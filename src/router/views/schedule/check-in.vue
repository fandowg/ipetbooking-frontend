<script>
import { addMinutes, getMinutes, setMinutes, differenceInSeconds, addSeconds } from 'date-fns'
import formatDate, { formatRequestData, formatGetTime } from '@utils/format-date'
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter , bookingStatusFilter, orderStatusFilter, orderPaymentMethodFilter ,paymentStatusMapFilter } from '@utils/filter-value-to-text'
import { PortalTarget } from 'portal-vue'
import { saveState, getSavedState } from '@utils/browser-help'

import Layout from '@layouts/main'
import BaseButtonDialog from '@components/BaseButtonDialog'

import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/zh-hk.js'
import VueScrollTo from 'vue-scrollto'

import Vue from 'vue'
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)

export default {
  page: {
    title: '前台接待',
    meta: [{ name: 'description', container: 'schedule' }],
  },
  filters: {
    genderFilter,
    formatDate,
    orderStatusFilter,
    bookingStatusFilter,
    orderPaymentMethodFilter,
    paymentStatusMapFilter
  },
  components: {
    Layout,
    VueCal,
    BaseButtonDialog,
    ScheduleStaffForm: () => lazyLoadComponent(import('@components/ScheduleStaffForm')),
    OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
    OrderForm: () => lazyLoadComponent(import('./components/OrderForm')),
    CalendarItem: () => lazyLoadComponent(import('./components/CalendarItem')),
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    PortalTarget,
  },
  props: {
    staffItems: {
      type: Array,
      required: true,
    },
    merchantProducts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      tryingFetchSchedule: false,
      filterData: {
        productId: '',
        serviceId: '',
        orderStatus: '',
        scheduleItemId: '',
      },
      filterLocationList: [],
      filterServiceList: [],
      filterStatusList: [],
      filterStaffList: [],

      selectedDate: new Date(),
      productId: '',
      itemList: [],
      scheduleStaffs: this.staffItems,
      splitLabels: [],
      calendarEvents: [],
      events: [],
      originEvents: [],
      disabledDays: [],
      schedules:[],

      dialogVisible: false,
      dialogItem: {},
      dialogMode: 'edit', // edit 編輯, add 新增， view 預覽

      editable: {
        title: false,
        drag: false,
        resize: false,
        create: false,
        delete: false,
      },

      changingBooking: false,
      submitBooking: {},
      selectedContextEvent: {},
      memberItem:{},

      // 營業時間
      openingHour: '00:00',
      closedHour: '23:59',

      tryingToGetOrder: false,
      drawerOrderData: {},
      drawerVisible: false,
      createOrderVisible: false,
      createOrderData: {},
      createOrderExtraData: {},
      componentKey: 0,
      scrollOptions: {
        container: '.vuecal__flex',
        easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
        // offset: -60,
        force: true,
        cancelable: true,
        x: false,
        y: true,
      },
      columnWidth:300
    }
  },
  computed: {
    staffs() {
      return this.splitLabels.length
    },
    selectedDateString() {
      return this.selectedDate.format()
    },
    bookingTitle() {
      if (!this.selectedContextEvent.id) return ''
      const { productTitle, priceTitle, startDate } = this.selectedContextEvent
      // console.log(startDate)
      const replaceDate = startDate.replace(/-/g, '/')
      return `${productTitle} ${priceTitle} ${formatDate(new Date(replaceDate), 'dateTime')}`
    },
    isReschedule() {
      return this.changingBooking && this.submitBooking.id
    },
    enableReschedule() {
      return this.selectedContextEvent.orderStatus && [1, 2, 3, 4].includes(this.selectedContextEvent.orderStatus) && !this.changingBooking
    },
    mirrorWidth() {
      return this.splitLabels.length * this.columnWidth
    },
  },
  watch:{
    selectedDateString(){
      this.scrollToNow()
    }
  },
  created() {
    this.tryToFetchSchedule()
    let timeout = setInterval(() => {
      if (this.$refs['cal'] !== undefined) {
        clearInterval(timeout)
        this.handleSynchronizeScroll()
      }
    }, 300)
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollToNow()
      }, 100)
    })
    const initColumnWidth = async () => {
      const columnWidth = await getSavedState('columnWidth') ?? 300;

      // this.collapsed = stateCollapsed !== null ? stateCollapsed : true
      await this.setColumnWidth(columnWidth)
    };
    initColumnWidth()
  },
  // mounted() {
  //   console.log(123)
  // },
  beforeDestroy() {
    this.handleSynchronizeScroll(false)
  },
  methods: {
    
    bookingStatusFilter,
    async tryToFetchSchedule() {
      // v-contextmenu 會將 references 快取起來，導致後來的資料無法對應到
      this.originEvents = []
      this.events = []

      this.tryingFetchSchedule = true
      const { scheduleItems, orderStatus, products, staffs, services } = await this.$store.dispatch('schedule/fetchList', {
        date: this.selectedDateString,
        ...this.filterData,
      })

      this.filterLocationList = products
      this.filterServiceList = services
      this.filterStatusList = orderStatus
      this.filterStaffList = staffs

      this.filterSplitLabels(scheduleItems)
      this.filterEvents(scheduleItems)
      this.filterScheduleStaffs(scheduleItems)

      this.$nextTick(() => {
        setTimeout(() => {
          this.tryingFetchSchedule = false
          const cont = document.querySelectorAll('.vuecal__event:not(.vuecal__event--background)')
          cont.forEach((item) => {
            // console.log(parseInt(item.style.width))
            item.style.width = `${parseInt(item.style.width) - 4}%`
          })
        }, 300)
      })
    },
    async tryToStoreItem(staff) {
      await this.$store.dispatch('schedule/storeItem', {
        date: this.selectedDateString,
        itemId: staff.id,
      })
      this.tryToFetchSchedule()
    },
    
    filterScheduleStaffs(list) {
      this.scheduleStaffs = [...this.staffItems]
      const itemIds = list.map((item) => item.id)
      this.scheduleStaffs = [
        ...this.scheduleStaffs.filter((staff) => {
          return !itemIds.includes(staff.id)
        }),
      ]
    },
    filterSplitLabels(list) {
      const labels = list
        .filter((item) => item.scheduleDetails.some((detail) => detail.isFiltered === 0))
        .map((item) => {
          let storesTitle = []
          item.scheduleDetails.forEach((scheduleDetail) => {
            storesTitle.push(...scheduleDetail.storesTitle)
          })
          storesTitle = storesTitle.filter((title, index) => storesTitle.indexOf(title) === index).join('，')
          // .storesTitle.join('，')
          // console.log(storesTitle)
          return {
            id: item.id,
            name: item.name,
            storesTitle: storesTitle,
            state: item.state,
          }
        })
      this.splitLabels = [...labels, { id: 'create-staff', type: 'create' }]
    },
    filterEvents(list) {
      const eventList = []
      const begin = `${this.selectedDateString} ${this.openingHour}`
      const finish = `${this.selectedDateString} ${this.closedHour}`
      list.forEach((item) => {
        // 訂單
        item.schedules.forEach((order) => {
          eventList.push({
            start: order.startDate,
            end: order.endDate,
            split: item.id,
            customInfo: { ...order, staffId: item.id },
          })
        })

        // 找出禁止時段
        if (item.scheduleDetails.length) {
          // 確保時間從早排到晚
          item.scheduleDetails.sort((prev, next) => formatGetTime(prev.startDate) - formatGetTime(next.startDate))

          item.scheduleDetails.forEach((detail) => {
            if (detail.isFiltered || detail.state === 0)
              eventList.push({
                start: detail.startDate,
                end: detail.endDate,
                split: item.id,
                disabled: true,
                background: true,
              })
          })

          item.scheduleDetails.reduce((prev, next) => {
            eventList.push({
              start: prev.endDate,
              end: next.startDate,
              split: item.id,
              disabled: true,
              background: true,
            })
            return next
          })

          eventList.push({
            start: begin,
            end: item.scheduleDetails[0].startDate,
            split: item.id,
            disabled: true,
            background: true,
          })
          eventList.push({
            start: item.scheduleDetails[item.scheduleDetails.length - 1].endDate,
            end: finish,
            split: item.id,
            disabled: true,
            background: true,
          })
        } else {
          eventList.push({
            start: begin,
            end: finish,
            split: item.id,
            disabled: true,
            background: true,
          })
        }
      })

      // 前往新增排班人員
      eventList.push({
        split: 'create-staff',
        start: begin,
        end: finish,
        redirect: true,
      })

      this.originEvents = [...eventList]
      this.events = [...eventList]

      // 選好想變更的時間後，換去其他日期又換回來
      if (this.isReschedule) {
        this.events.some((event, index) => {
          if (event.customInfo && event.customInfo.id === this.submitBooking.id) {
            this.events.splice(index, 1)
            return true
          }
          return false
        })
        this.events.push(this.submitBooking.eventData)
      }
    },
    onCellClick({ date, split: itemId }) {
      if (!this.changingBooking) {
        const { startTime: startDate } = this.getStartEndTime(date, 'dateTime')
        const isExpired = formatGetTime(startDate) < new Date().getTime()
        /* if (formatGetTime(startDate) < new Date().getTime()) {
          this.$message({
            type: 'warning',
            message: '選擇的時段不得小於現在！',
          })
          return
        } */
        this.handleCreateOrder(itemId, startDate, isExpired)
      } else this.changeToOtherPeriod({ itemId, ...this.getStartEndTime(date) })
    },
    async changeToOtherPeriod(period) {
      let { id, orderId, startDate: oldStart, endDate: oldEnd } = this.selectedContextEvent
      oldStart = oldStart.replace(/-/g, '/')
      oldEnd = oldEnd.replace(/-/g, '/')
      const servicePeriodSecond = differenceInSeconds(new Date(oldEnd), new Date(oldStart))
      const newStart = `${formatDate(this.selectedDate)} ${period.startTime}`
      const newEnd = formatDate(addSeconds(new Date(newStart), servicePeriodSecond), 'dateTime')
      // console.log(newStart,newEnd,servicePeriodSecond,oldStart,oldEnd)
      // 檢查能不能塞進去新的時段
      await this.$store.dispatch('order/fetchAvailablePeriod', {
        orderId,
        startDate: newStart,
        itemId: period.itemId,
      })

      // 將原本的時段移除
      this.events.forEach((event, index) => {
        if (event.customInfo && event.customInfo.id === id) {
          this.events.splice(index, 1)
        }
      })
      /*   this.events.some((event, index) => {
        if (event.customInfo && event.customInfo.id === id) {
          this.events.splice(index, 1)
          return true
        }
        return false
      }) */
      /*   this.events.some((event, index) => {
        if (event.customInfo && event.customInfo.id === id) {
          this.events.splice(index, 1)
          return true
        }
        return false
      }) */

      // 把資料塞進新的人員
      this.events.push({
        start: newStart,
        end: newEnd,
        split: period.itemId,
        customInfo: {
          ...this.selectedContextEvent,
          staffId: period.itemId,
        },
      })

      // 暫存資料
      this.submitBooking = {
        orderId,
        id: this.selectedContextEvent.id,
        staffId: period.itemId,
        startDate: newStart,
        eventData: {
          start: newStart,
          end: newEnd,
          split: period.itemId,
          customInfo: {
            ...this.selectedContextEvent,
            staffId: period.itemId,
          },
        },
      }
    },
    fetchEvents() {
      this.filterData = {
        productId: '',
        serviceId: '',
        orderStatus: '',
        scheduleItemId: '',
      }
      this.tryToFetchSchedule()
    },
    getStartEndTime(date, format = 'time') {
      const time = getMinutes(date)
      let startTime = ''
      switch (true) {
        case time < 15:
          startTime = setMinutes(date, 0)
          break
        case time < 30 && time >= 15:
          startTime = setMinutes(date, 15)
          break
        case time < 45 && time >= 30:
          startTime = setMinutes(date, 30)
          break
        case time < 60 && time >= 45:
          startTime = setMinutes(date, 45)
          break
      }
      // const startTime = getMinutes(date) < 30 ? setMinutes(date, 0) : setMinutes(date, 30)
      const endTime = addMinutes(startTime, 15)
      return { startTime: formatDate(startTime, format), endTime: formatDate(endTime, format) }
    },
    createStaff() {
      this.openDialog('add')
    },
    openDialog(mode, itemData) {
      this.dialogVisible = true
      this.dialogMode = mode
      this.$set(this.$data, 'dialogItem', itemData)
    },
    closeDialog() {
      this.dialogVisible = false
    },
    onContext(vm) {
      this.selectedContextEvent = { ...vm.data.attrs.event.customInfo }
    },
    onChangBooking() {
      this.changingBooking = true
    },
    onCancelChanging() {
      this.changingBooking = false
      // this.events = [...this.originEvents]
      this.submitBooking = {}
      this.selectedContextEvent = {}
      this.updateFilter()
      this.tryToFetchSchedule()
    },
    customCellClass(events) {
      if (events.length === 0) return ''

      const { expired, isOpen, canMoveSchedule, orderCount } = events[0].customInfo
      if (expired || !isOpen) return 'is-expired'
      return this.changingBooking ? (canMoveSchedule ? 'is-available' : 'is-full') : orderCount > 0 ? 'is-available' : ''
    },
    onClickDetail() {
      this.tryToGetOrder(this.selectedContextEvent.orderId)
    },
    onClickChangingBooking() {
      this.changingBooking = true

      // 改變過濾的顯示狀態
      const { productId, priceId, orderStatus, staffId} = this.selectedContextEvent
      this.updateFilter({
        productId,
        serviceId: priceId,
      })
      if(orderStatus===6){
        this.filterData.scheduleItemId=staffId
      }
      this.tryToFetchSchedule()

      // 改變日曆狀態
      this.tryToFetchCurrentMonthly()
    },
    onViewChange(viewInfo) {
      if (viewInfo.view !== 'month') return
      this.tryToFetchMonthly({
        startDate: formatRequestData(viewInfo.firstCellDate),
        endDate: formatRequestData(viewInfo.lastCellDate),
      })
    },
    async tryToFetchMonthly(date) {
      const list = await this.$store.dispatch('schedule/fetchMonthly', { ...date, scheduleId: this.changingBooking ? this.selectedContextEvent.id : undefined })
      this.calendarEvents = list.map((item) => ({
        start: item.date,
        end: item.date,
        customInfo: {
          ...item,
        },
      }))
      this.disabledDays = list.filter((item) => item.expired || !item.canMoveSchedule).map((item) => item.date)
    },
    getFilterId(filterName, title) {
      let id = ''
      this[`filter${filterName}List`].some((item) => {
        if (item.title === title) {
          id = item.id
          return true
        }
        return false
      })
      return id
    },
    updateFilter(
      data = {
        productId: '',
        serviceId: '',
        orderStatus: '',
        scheduleItemId: '',
      }
    ) {
      this.filterData = {
        ...this.filterData,
        ...data,
      }
    },
    async onClickModify() {
      const { orderId: id, staffId: itemId, startDate } = this.submitBooking
      await this.$store.dispatch('order/storeModifyOrder', {
        id,
        startDate,
        itemId,
      })
      this.$message({
        message: '已成功更換預約時間！',
        type: 'success',
      })

      this.onCancelChanging()
    },
    onEventClick({ split: itemId }) {
      if (this.changingBooking) return
      if (itemId === 'create-staff') this.goToSchedule()
    },
    async goToSchedule() {
      await this.$confirm('您即將離開前台接待前往排班功能進行排班，請問是否確定前往？', '您將離開此頁面', {
        confirmButtonText: '前往排班',
        cancelButtonText: '留在此頁',
        type: 'warning',
        center: true,
      })
      this.$router.push({
        name: 'schedule',
        params: {
          selectedDate: new Date(this.selectedDateString),
        },
      })
    },
    checkDisabledEvent(info) {
      return this.changingBooking ? this.selectedContextEvent.id !== info.id : info.isFiltered === 1
    },
    async tryToGetOrder(orderId) {
      this.tryingToGetOrder = true
      // console.log(formatDate(this.selectedContextEvent.startDate,'dateTime'))
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)


      // this.memberItem = await this.$store.dispatch('member/fetchSingle', this.drawerOrderData.memberId)

      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    async handleCreateOrder(scheduleItemId, selectedTime, showExpiredAlert = false) {
      // console.log(selectedTime)
      const { scheduleItems } = await this.$store.dispatch('schedule/fetchList', {
        date: this.selectedDateString,
        scheduleItemId,
      })

      const filterProduct = (scheduleDetails) => {
        let prodcut = []
        scheduleDetails.some((detail) => {
          const isBetweenStartAndEnd = formatGetTime(selectedTime) >= formatGetTime(detail.startDate) && formatGetTime(selectedTime) < formatGetTime(detail.endDate)
          if (isBetweenStartAndEnd) {
            prodcut = detail.products
            return true
          }
          return false
        })
        return prodcut
      }

      const clickTime = scheduleItems[0].scheduleDetails.find((item) => {
        const isBetweenStartAndEnd = formatGetTime(selectedTime) >= formatGetTime(item.startDate) && formatGetTime(selectedTime) < formatGetTime(item.endDate)
        return isBetweenStartAndEnd
      })
      this.schedules = scheduleItems[0].schedules

      this.createOrderData = filterProduct(scheduleItems[0].scheduleDetails)
      this.createOrderExtraData = {
        id: scheduleItems[0].id,
        date: selectedTime,
        name: scheduleItems[0].name,
        state: scheduleItems[0].state,
        showExpiredAlert,
        storesTitle: clickTime.storesTitle.join('，'),
      }
      this.createOrderVisible = true
    },
    async onCreateOrderDone() {
      await this.tryToFetchSchedule()
      this.$refs.orderForm.closeDrawer()
      // this.createOrderVisible = false
    },
    tryToFetchCurrentMonthly() {
      const { firstCellDate, lastCellDate } = this.$refs['sm-cal'].getViewInfo()
      const startDate = formatRequestData(firstCellDate)
      const endDate = formatRequestData(lastCellDate)
      this.tryToFetchMonthly({ startDate, endDate })
    },
    onRenderedCalendarItem() {
      this.tryToFetchCurrentMonthly()
    },
    handleSynchronizeScroll(bind = true) {
      const $header = this.$refs.cal.$el.getElementsByClassName('vuecal__header')[0]
      const $body = this.$refs.cal.$el.querySelector('[row]')
      const $scrollbar = this.$el.querySelector('#custom-scrollbar')

      if (bind) {
        $header.addEventListener('scroll', () => {
          $body.scrollLeft = $header.scrollLeft
          $scrollbar.scrollLeft = $header.scrollLeft
        })
        $body.addEventListener('scroll', () => {
          $header.scrollLeft = $body.scrollLeft
          $scrollbar.scrollLeft = $body.scrollLeft
        })
        $scrollbar.addEventListener('scroll', () => {
          $header.scrollLeft = $scrollbar.scrollLeft
          $body.scrollLeft = $scrollbar.scrollLeft
        })
      } else {
        $header.removeEventListener('scroll', () => {
          $body.scrollLeft = $header.scrollLeft
          $scrollbar.scrollLeft = $header.scrollLeft
        })
        $body.removeEventListener('scroll', () => {
          $header.scrollLeft = $body.scrollLeft
          $scrollbar.scrollLeft = $body.scrollLeft
        })
        $scrollbar.removeEventListener('scroll', () => {
          $header.scrollLeft = $scrollbar.scrollLeft
          $body.scrollLeft = $scrollbar.scrollLeft
        })
      }
    },
    scrollToNow(){
      const now = new Date()
      const minutes = (now.getHours() - 6) * 60 + now.getMinutes()
      const pxFerMinute = 50/15
      // formatDate(now,'date-dash')
      // console.log(now.format())
      // this.$refs.cal.$el.querySelector('.vuecal__bg').scrollTop= minutes * pxFerMinute -50
      if(now.format()===this.selectedDateString){
        this.$refs.cal.$el.querySelector('.vuecal__bg').scrollTop= minutes * pxFerMinute -50
      }else{
        this.$refs.cal.$el.querySelector('.vuecal__bg').scrollTop=600
      }
      
    },
    scrollToElement(el) {
      // console.log(el)
      VueScrollTo.scrollTo(el, 500, this.scrollOptions)
    },
    scrollToDrawer(){
      // console.log(this.$refs.orderForm)
      this.$nextTick(() => {
        setTimeout(()=>{
          this.$refs.orderForm.$el.querySelector('.el-drawer').scrollTop=900
        },200)
      })
      // console.log(333)
      
    },
    checkAdd(info){
 
      return info.childrenOrders.some(item=>{
        return item.status === 2
      })
    },
    addItems(order){
      let list =[]
      order.params.forEach(item=>{
        if(item.type==='cosmetic-add'){
          list.push(item)
        }
      })
      order.childrenOrders.forEach(item=>{
        item.items.forEach(i=>{
          if(i.type==='cosmetic-add'){
            list.push(i)
          }
        })
        
      })
      return list
    },
    async changeColumnWidth(value){
      await this.setColumnWidth(value)
      // this.columnWidth = value
    },
    async setColumnWidth(value) {
      this.columnWidth = value;
      await saveState('columnWidth', value)
    },
    
  },
}
</script>

<template>
  <Layout>
    
    <BaseTableSearch v-slot="{ fields }" :default-value.sync="filterData" :border="true" :hide-reset="changingBooking" style="position:relative" @reset="tryToFetchSchedule" @tryToFetchList="tryToFetchSchedule">
    <div class="inline-text-btn">
      行事曆寬度：
        <div class="text-btn" :class="{ isActive: columnWidth === 300 }" @click="changeColumnWidth(300)">一般</div> 
        <div class="text-btn" :class="{ isActive: columnWidth === 600 }" @click="changeColumnWidth(600)">加大</div>
    </div>
      <el-form-item prop="productId">
        <el-select v-model="fields.productId" :disabled="changingBooking">
          <el-option label="所有服務地點" value></el-option>
          <el-option v-for="(location, typeValue) in filterLocationList" :key="typeValue" :label="location.title" :value="location.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="serviceId">
        <el-select v-model="fields.serviceId" :disabled="changingBooking">
          <el-option label="所有服務項目" value></el-option>
          <el-option v-for="(service, value) in filterServiceList" :key="value" :label="service.title" :value="service.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-show="!changingBooking" prop="orderStatus">
        <el-select v-model="fields.orderStatus">
          <el-option label="所有預約狀態" value></el-option>
          <el-option v-for="(status, value) in filterStatusList" :key="value" :label="status.title" :value="status.orderStatus"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="scheduleItemId">
        <el-select v-model="fields.scheduleItemId">
          <el-option :label="changingBooking ? '可執行的所有人員' : '所有人員'" value></el-option>
          <el-option v-for="(staff, value) in filterStaffList" :key="value" :label="staff.name" :value="staff.id"></el-option>
        </el-select>
      </el-form-item>
    </BaseTableSearch>
    <el-card v-loading.fullscreen.lock="tryingToGetOrder" element-loading-text="取得訂單資訊中" shadow="never" style="margin-bottom:0" :class="[$style['card-wrapper'], { [$style['mask']]: tryingFetchSchedule }]">
      <div class="vue-cal-layout" :style="changingBooking ? 'padding-bottom: 85px;' : ''">
        <div>
          <!-- <VueCal
            ref="sm-cal"
            class="vuecal--date-picker Jost"
            xsmall="xsmall"
            hide-view-selector="hide-view-selector"
            active-view="month"
            locale="zh-hk"
            style="width: 250px; height: 300px"
            :events="calendarEvents"
            :selected-date="selectedDate"
            :time="false"
            :transitions="false"
            :disable-views="['week', 'day']"
            :editable-events="false"
            :disable-days="changingBooking ? disabledDays : []"
            click-to-navigate
            @cell-focus="selectedDate = $event"
            @view-change="onViewChange"
          >
            <template v-slot:cell-content="{ cell, events }">
              <span class="vuecal__cell-date" :class="customCellClass(events)">{{ cell.content }}</span>
            </template>
          </VueCal> -->
          <CalendarItem
            v-slot="{ data: { cell, events } }"
            ref="sm-cal"
            :selected-date.sync="selectedDate"
            :calendar-events="calendarEvents"
            :disable-days="changingBooking ? disabledDays : []"
            @view-change="onViewChange"
            @rendered="onRenderedCalendarItem"
          >
            <span class="vuecal__cell-date" :class="customCellClass(events)">{{ cell.content }}</span>
          </CalendarItem>
          <div class="only-bottom-line" style="margin-top:12px;margin-bottom:24px"></div>
          <!-- <el-divider style="padding-top:15px"></el-divider> -->
          <p :class="$style.status">行事曆狀態</p>
          <div :class="$style['calendar-status-wrapper']">
          <div :class="$style['calendar-status']">
            <div class="mark mark-1">1</div>
            <div>當天</div>
          </div>
          <template v-if="changingBooking">
            <div :class="$style['calendar-status']">
              <div class="mark mark-available">1</div>
              <div>有排班＋尚可預約</div>
            </div>
            <div :class="$style['calendar-status']">
              <div class="mark mark-full">1</div>
              <div>有排班＋無時段可預約</div>
            </div>
            <div :class="$style['calendar-status']">
              <div class="mark mark-3">1</div>
              <div>已過期 / 店休</div>
            </div>
          </template>
          <template v-else>
            
              <div :class="$style['calendar-status']">
                <div class="mark mark-available">1</div>
                <div>有預約</div>
              </div>
              <div :class="$style['calendar-status']">
                <div class="mark mark-2">1</div>
                <div>有營業</div>
              </div>
              <div :class="$style['calendar-status']" style="width:50%">
                <div class="mark mark-3">1</div>
                <div>已過去 / 無營業</div>
              </div>
            

          </template>
          </div>

          <p :class="$style.status" style="margin-top: 20px;margin-bottom:5px">預約狀態</p>
          <div :class="$style['calendar-status-wrapper']">
            <div :class="$style['order-status']">
              <div class="mark mark-1"></div>
              <div>已完成</div>
            </div>
            <div :class="$style['order-status']">
              <div class="mark mark-2"></div>
              <div>已報到</div>
            </div>
            <div :class="$style['order-status']">
              <div class="mark mark-3"></div>
              <div>待報到</div>
            </div>
            <div :class="$style['order-status']">
              <div class="mark mark-4"></div>
              <div>未報到</div>
            </div>
            <div :class="$style['order-status']">
              <div class="mark mark-5"></div>
              <div>未付款</div>
            </div>
          </div>

          <!-- <p :class="$style.status" style="margin-top: 30px">付款狀態</p>
          <div :class="$style['order-status']">
            <div class="mark mark-6"></div>
            <div>未付款</div>
          </div> -->
       
        </div>
        <div class="schedule-wrap">
          <VueCal
            ref="cal"
            class="full-cal vuecal--full-height-delete"
            :class="[$style.schedule, $style[`split-labels-${staffs}`], { [$style['is-changing']]: changingBooking },{ isBigWidth: columnWidth === 600 }]"
            active-view="day"
            locale="zh-hk"
            :selected-date="selectedDate"
            :time-from="6 * 60"
            :time-to="24 * 60"
            :split-days="splitLabels"
            :sticky-split-labels="true"
            :editable-events="editable"
            :events="changingBooking ? events : originEvents"
            :time-step="15"
            :disable-views="['years', 'year', 'week', 'day', 'month']"
            :hide-title-bar="true"
            :time-cell-height="50"
            :snap-to-time="1"
            :on-event-click="onEventClick"
            @cell-click="onCellClick"
            @view-change="fetchEvents"
          >
            <template v-slot:split-label="{ split }">
              <div v-if="split.type === 'create'" :class="$style['split-label']" style="text-align: center"><BaseIcon name="plus" style="font-size: 15px"></BaseIcon></div>
              <div v-else :class="$style['split-label']"
                >{{ split.name }} <span v-if="split.state === 0">(停權中)</span> | <span>{{ split.storesTitle }}</span></div
              >
            </template>
            <template v-slot:event="{ event }">
              <div
                v-if="event.customInfo"
                v-contextmenu:contextmenu
                class="wrap"
                :class="[
                  bookingStatusFilter(event.customInfo.orderStatus, 'color'),
                  { 'is-disabled': checkDisabledEvent(event.customInfo) },
                  { isHelper: event.customInfo.isHelper === 1 && event.customInfo.isBeautician === 0 },
                  { isUNPAID: event.customInfo.paymentStatus === 'UNPAID' },
                  { isUNPAIDADD: checkAdd(event.customInfo) },
                ]"
                style="height: inherit"
                :event="event"
              >
                <div class="name">
                  {{event.customInfo.pet.name}} - <span style="display:inline-block">{{event.customInfo.customerName}} {{event.customInfo.customerGender | genderFilter}}</span>
                  <!-- {{ `${event.customInfo.customerName} ${event.customInfo.customerGender === 'male' ? '先生' : '小姐'}` }} -->
                </div>
                <div>{{ `${event.customInfo.productTitle} ${event.customInfo.priceTitle}` }}</div>
                <div>{{ `${event.customInfo.priceCategory} ${event.customInfo.pet.breed ? '- ' + event.customInfo.pet.breed : ''} | ${event.customInfo.priceIntrotext}` }}</div>

                <div class="title" :event="event">
                  <div class="time">{{ event.start.format('HH:mm') + ' ~ ' + event.end.format('HH:mm') }}</div>
                </div>
                <template v-if="addItems(event.customInfo).length">
                  <div v-for="(item, index) in addItems(event.customInfo)" :key="index">
                    <p>{{item.title}} 
                      <!-- <br><span>({{ order.status | orderStatusFilter('text') }})</span> -->
                    </p>
                    
                    <!-- <template v-for="(item, itemIndex) in order">
                      <p v-if="item.status !== 0" :key="itemIndex">
                        <span>加購 {{ item.title }}</span
                        ><br />
                        <span>({{ item.status | orderStatusFilter('text') }})</span>
                      </p>
                    </template> -->
                  </div>
                </template>
                <p v-if="event.customInfo.bufferTime > 0">緩衝時間 {{ event.customInfo.bufferTime }} 分鐘</p>
              </div>
              <div v-else-if="event.disabled" class="disabled"></div>
              <div v-else class="redirect" :class="{ disabled: changingBooking }">前往新增排班人員</div>
            </template>
          </VueCal>
          <v-contextmenu ref="contextmenu" :event-type="'click'" :class="$style['contextmenu']" @contextmenu="onContext">
            <div v-if="selectedContextEvent.orderStatus" class="label-box">
              <BaseStateLabel v-if="selectedContextEvent.paymentMethod === 'Prepaid'" style="background: #000">方案預約</BaseStateLabel>
              <BaseStateLabel :state="selectedContextEvent.paymentStatus | paymentStatusMapFilter('color')">{{ selectedContextEvent.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
              <BaseStateLabel state="info">
                <span v-if="!selectedContextEvent.paymentMethod">不指定</span>
                <span v-else>{{ selectedContextEvent.paymentMethod | orderPaymentMethodFilter }}</span>
              </BaseStateLabel>
            </div>
            <v-contextmenu-item @click="onClickDetail">查看訂單</v-contextmenu-item>
            <v-contextmenu-item v-if="enableReschedule && selectedContextEvent.isBeautician === 1" @click="onClickChangingBooking">變更預約時間</v-contextmenu-item>
          </v-contextmenu>
          <div id="custom-scrollbar" :class="$style['custom-scrollbar']">
            <div :style="`height:inherit;width: ${mirrorWidth}px;`"></div>
          </div>
        </div>
      </div>
    </el-card>
    <BaseButtonDialog only-dialog title="新增人員" :dialog-visible.sync="dialogVisible" floating>
      <ScheduleStaffForm :default-value="dialogItem" @store="tryToStoreItem" @close="closeDialog" />
    </BaseButtonDialog>
    <div v-if="changingBooking" :class="[$style.footer, $style.booking]">
      <div class="content">
        <div class="title">變更預約模式</div>
        <div class="item">
          <div>{{ bookingTitle }}</div>
          <div class="date">改期至：{{ submitBooking.id ? submitBooking.startDate : '（請點擊空白時段）' }}</div>
        </div>
      </div>
      <div>
        <el-button @click="onCancelChanging">取消變更</el-button>
        <el-button type="primary" @click="onClickModify">確定變更</el-button>
      </div>
    </div>
    <!-- 編輯訂單 -->
    <!-- <el-drawer 
      :visible.sync="drawerVisible" 
      append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" 
      destroy-on-close
    >
      <PortalTarget slot="title" name="drawer-header"></PortalTarget>
      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToFetchSchedule" />
    </el-drawer> -->
    <el-drawer ref="orderFormEdit" class="only-close"
      :visible.sync="drawerVisible" 
      append-to-body 
      :size="$root.isSmallDevice ? '100%' : '90%'" 
      destroy-on-close
      :wrapper-closable = "false"
      custom-class="order-drawer"
      @closed="componentKey++"
    > 
      <OrderForm 
        ref="orderDetail"
        :key="componentKey"
        :default-value.sync="drawerOrderData" 
     
   
       
        :member-item="memberItem"
    
        @update="tryToFetchSchedule"
      />
    </el-drawer>
    <!-- 新增訂單 -->
    <el-drawer ref="orderForm" class="only-close" 
      :visible.sync="createOrderVisible" 
      :append-to-body = "true"
      :size="$root.isSmallDevice ? '100%' : '90%'" 
      destroy-on-close
      :modal-append-to-body = "false"
      :wrapper-closable = "false"
      custom-class="order-drawer"
      @closed="componentKey++"
    >
      <!-- <PortalTarget slot="title" name="drawer-header-order">dd</PortalTarget> -->
      <!-- <div :class="$style.header">
        <el-alert v-if="createOrderExtraData.showExpiredAlert" type="warning" :title="'請注意，您選擇的時段已經過期！'" :closable="false"></el-alert>
        <h5 class="Jost" :class="$style.title">此時段服務地點：{{ createOrderExtraData.storesTitle }}</h5>
        <h5 class="Jost">服務人員：{{ createOrderExtraData.name }} {{ createOrderExtraData.state === 0 ? '(停權中)' : '' }}</h5>
        <h5 class="Jost">預約時間：{{ createOrderExtraData.date | formatDate('dateTime') }}</h5>
      </div> -->
      <OrderForm 
        :key="componentKey" 
        :products="createOrderData" 
        :schedule-detail="createOrderExtraData" 
        :schedules="schedules"
        @store="onCreateOrderDone"
      />
  
    </el-drawer>
  </Layout>
</template>
<style lang="scss">
@import '@src/design/vuecal-override.scss';
.schedule-wrap {
  margin-left: 20px;
  flex: 1 0 auto;
  width: 200px;
  height: calc(100vh - 200px);
  margin-top: -21px;
  position: relative;

  @include max-sm {
    width: auto;
    height: auto;
  }

  .vuecal__flex {
    @include max-sm {
      overflow: hidden !important;
    }
  }
  .vuecal__time-column {
    @include max-sm {
      height: auto !important;
    }
  }
}
.vue-cal-layout {
  display: flex;
  height: auto;
}
</style>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_steps.scss';
$min-split-width: 200px;
@for $i from 1 through 10 {
  .split-labels-#{$i} {
    overflow-x: hidden;
    :global {
      .vuecal__header {
        // width: $min-split-width * $i + 42px;
        .vuecal__split-days-headers {
          height: auto !important;
          border-top: 0 !important;
          border-bottom: 0 !important;
          margin-left: 3em;
          box-shadow: inset 0px 0px 0px 0.5px rgba(0, 0, 0, 0.08);
          width: auto;
        }
      }
      .vuecal__body {
        // width: $min-split-width * $i + 42px !important;
      }
    }
  }
}
:global{
  .vuecal__flex{
    &.isBigWidth{
      .day-split-header{
        width: 600px!important;
      }
      .vuecal__cell-content {
        min-width:600px;
        max-width:600px;
      }
    }
  }
}

.schedule {
  // border-radius: 4px;
  box-shadow: inherit !important;
  position: relative;
  // 若變更服務時間較長的訂單時間，時間無法從10:00改到10:30 (點擊不到這個時間點)
  &.is-changing {
    :global {
      .vuecal__cell-content:not([data-split='create-staff']) {
        .vuecal__event:not(.vuecal__event--background) {
          pointer-events: none;
        }
      }
    }
  }
  :global {
    .vuecal__header {
      width: auto;
      overflow-x: scroll;
      min-height: 42px;
      margin-left: 42px;
      .vuecal__split-days-headers {
        border-top: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
        margin-left: 0;
        display: inline-flex;
        .day-split-header {
          width: 300px;
          > .el-button span {
            white-space: nowrap;
            text-overflow: ellipsis;
            width: auto;
            display: block;
            overflow: hidden;
          }
          .el-dropdown {
            width: 99%;
            button {
              border: none;
              width: 100%;
              span {
                display: flex;
                justify-content: space-between;
              }
            }
          }
          & + .day-split-header {
            border-left: 1px solid rgb(198 198 186 / 0.7);
          }
        }
      }
    }
    .vuecal__time-cell-line::before {
      left: 43px;
      width: 3000px;
    }
    .vuecal__body {
      &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 42px;
        width: 100%;
        height: 1px;
        background: rgba(0, 0, 0, 0.08);
      }
      .vuecal__bg > .vuecal__flex {
        overflow-x: scroll;
        display: block;
        .vuecal__time-column {
          position: absolute;
          height: 3600px;
          left: 0;
          background: #fff;
          z-index: 14;
          padding-top: 40px;
          margin-top: -40px;
          .vuecal__time-cell {
            background: white;
            &:last-child {
              box-shadow: 0px 1px white;
            }
          }
        }
        .vuecal__cells {
          height: 3600px;
          padding-left: 3rem;
          .vuecal__cell {
            width: auto;
            justify-content: inherit;
          }
        }
      }
    }
    .vuecal__cell-content {
      // width: 200px;
      max-width: 300px;
      min-width: 300px;
      padding-left: 30px;
      .vuecal__no-event {
        display: none;
      }
      .vuecal__event {
        background-color: transparent;
        // padding-right: 8%;
        // margin-right: 5%;
        // max-width: 90%;
        .wrap {
          padding: 20px;
          border-radius: 8px;
          border-width: 2px;
          border-style: solid;
          text-align: left;
          .name {
            font-size: 16px;
            letter-spacing: 1.4px;
            line-height: 20px;
            color: #3f3a2e;
            margin-bottom: 5px;
            font-weight: 400;
          }
          .title {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            .time {
              font-size: 15px;
              .cycle {
                font-weight: 400;
              }
            }
            svg {
              color: white;
              background: green;
              padding: 6px;
              font-size: 30px;
              border-radius: 6px;
              padding-left: 8px;
            }
          }
          &.finish {
            border-color: $color-state-finish;
            background-color: lighten($color-state-finish, 50%);
          }
          &.success {
            border-color: $color-state-success;
            background-color: lighten($color-state-success, 35%);
          }
          &.warning {
            border-color: $color-state-warning;
            background-color: lighten($color-state-warning, 35%);
          }
          &.danger {
            border-color: $color-state-danger;
            background-color: lighten($color-state-danger, 30%);
          }
          &.info {
            border-color: $color-state-info;
            background-color: lighten($color-state-info, 30%);
          }
          &.is-disabled {
            pointer-events: none;
            &::before {
              content: '';
              position: absolute;
              top: -10px;
              bottom: -10px;
              left: -10px;
              right: -10px;
              background: white;
              opacity: 0.6;
            }
          }
          &.is-changing {
            pointer-events: none;
          }
          &.isHelper {
            border-style: dashed;
          }
          
          &.isUNPAIDADD{
            border-color: #E2B550;
            background-color: #fbf6e9;
          }
          &.isUNPAID {
            border-color: #909399 !important;
            background-color: #e0e1e2 !important;
          }
        }
        .redirect {
          height: inherit;
          display: flex;
          flex-direction: column;
          padding-top: 80px;
          // justify-content: center;
          background: #fcfcfc;
          cursor: pointer;
          &.disabled {
            pointer-events: none;
            color: rgb(102 102 102 / 0.5);
          }
        }
        &.vuecal__event--background {
          margin-top: 2px;
          // z-index: 0;
          z-index: 3;
          .disabled {
            height: inherit;
            background: repeating-linear-gradient(45deg, lightgrey 0px, lightgrey 2px, #f2f2f2 0px, #f2f2f2 7px);
            opacity: 0.5;
            box-shadow: inset 0 -2px white;
            pointer-events: none;
          }
        }
        &:not(.vuecal__event--background) {
          z-index: 4 !important;
        }
      }
      & + .vuecal__cell-content {
        border-left: 1px solid rgba(0, 0, 0, 0.08);
      }
    }
  }
}
:global() {
  :local(.schedule) {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 42px;
      width: calc(100% - 9px);
      height: 1px;
      background: rgb(0 0 0 / 0.08);
    }
  }
}
.card-wrapper {
  // min-height: 79vh;

  @include max-sm {
    overflow-x: scroll;
  }

  :global {
    .el-card__body {
      position: relative;
    }
  }
}
.filter {
  :global {
    input {
      height: 40px;
      background: white;
      border: 2px solid lightgray;
      border-radius: 9px;
    }
    i,
    input::placeholder {
      color: #333 !important;
    }
  }
}

.booking {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  z-index: 14;
  :global {
    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        background-color: #c79484;
        color: white;
        font-size: 16px;
        border-radius: 25px;
        padding: 10px 20px;
        letter-spacing: 3px;
        text-align: center;
        padding-right: 13px;
      }
      .item {
        font-size: 14px;
        margin-left: 30px;
        text-align: left;
        .date {
          color: rgb(227 93 93);
          margin-top: 10px;
        }
      }
    }

    .el-button {
      width: 150px;
      height: 45px;
      letter-spacing: 4px;
    }
  }
}

.status {
  font-size: 14px;
  line-height: 20p;
  color: #3f3a2e;
  font-weight: 500;
  letter-spacing: 1.4px;
}

.calendar-status-wrapper{
  display: flex;
  flex-wrap: wrap;
  width: 250px;

}

.calendar-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 10px;
  width:33.33333%;
  :global {
    .mark {
      background-color: #f2a67f;
      border-radius: 20px;
      padding: 6px 10px;
      margin-right: 10px;
      &-1 {
        color: white;
      }
      &-2 {
        background-color: transparent;
      }
      &-3 {
        background-color: transparent;
        opacity: 0.25;
      }
      &-available {
        background-color: rgba(#fdd7aa, 0.4);
        color: #f2a67f;
      }
      &-full {
        background-color: #f2eae6;
        color: #c79484;
      }
    }
  }
}
.order-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 20px;
  width: 33.33333%;
  :global {
    .mark {
      padding: 7px;
      margin-right: 15px;
      &-1 {
        background-color: $color-state-finish;
      }
      &-2 {
        background-color: $color-state-success;
      }
      &-3 {
        background-color: $color-state-warning;
      }
      &-4 {
        background-color: $color-state-danger;
      }
      &-5 {
        background-color: $color-state-info;
      }
      &-5 {
        background-color: $color-state-info;
      }
      &-6 {
        background-color: #f56c6c;
      }
    }
  }
}
.contextmenu {
  :global {
    .v-contextmenu-item {
      padding: 23px 30px;
      font-size: 15px;
      text-align: left;
      min-width: 150px;
      &.v-contextmenu-item--hover {
        background-color: $color-primary;
      }
    }
  }
}
.split-label {
  text-align: left;
  width: 100%;
  font-weight: 500;
  padding: 13px 18px;
  background: #e8e8e3;
  border-color: #c6c6ba;
}
.header {
  margin-top: 30px;
  margin-bottom: 30px;
}
.title:not(:first-child) {
  margin-top: 30px;
}

.mask {
  pointer-events: none;
}
.custom-scrollbar {
  position: absolute;
  bottom: 0;
  height: 16px;
  left: 0;
  right: 0;
  margin-left: 42px;
  margin-right: -15px;
  bottom: -15px;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: block;
    height: 16px;
    background-color: #f5f5f5;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #dcdad8;
    box-shadow: inset 0px 0px 0px 4px rgb(245 245 245 / 1);
  }

  &::-webkit-scrollbar-track {
    box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0.3);
    background-color: #f5f5f5;
  }
}
</style>
