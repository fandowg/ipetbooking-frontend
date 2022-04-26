<script>
import { addMinutes, getMinutes, setMinutes } from 'date-fns'
import formatDate, { formatRequestData } from '@utils/format-date'
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import BaseButtonDialog from '@components/BaseButtonDialog'

import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/zh-hk.js'

export default {
  page: {
    title: '排班',
    meta: [{ name: 'description', container: 'schedule' }],
  },
  components: {
    Layout,
    VueCal,
    BaseButtonDialog,
    ScheduleItem: () => lazyLoadComponent(import('./ScheduleItem')),
    CalendarItem: () => lazyLoadComponent(import('./components/CalendarItem')),
    ScheduleStaffForm: () => lazyLoadComponent(import('@components/ScheduleStaffForm')),
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
      selectedDate: new Date(),
      selectedItem: {},
      // productId: '',
      filterData: {
        productId: '',
        scheduleItemId: '',
      },
      visibleScheduleItem: false,
      splitLabels: [],
      staffsInSchedule:[],
      events: [],
      calendarEvents: [],
      scheduleStaffs: this.staffItems,
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
      tryingFetchItemDetail: false,
      selectedStaffName: '',
      isFirst:true
    }
  },
  computed: {
    staffs() {
      return this.splitLabels.length
    },
    selectedDateString() {
      return this.selectedDate.format()
    },
    mirrorWidth() {
      return this.splitLabels.length * 200
    },
  },
  created() {
    if (this.$route.params.selectedDate !== undefined) {
      this.selectedDate = this.$route.params.selectedDate
    }
    this.tryToFetchSchedule()
    let timeout = setInterval(() => {
      if (this.$refs['cal'] !== undefined) {
        clearInterval(timeout)
        this.handleSynchronizeScroll()
      }
    }, 300)
  },
  beforeDestroy() {
    this.handleSynchronizeScroll(false)
  },
  methods: {
    async tryToFetchSchedule(type) {
      const { scheduleItems } = await this.$store.dispatch('schedule/fetchList', {
        date: this.selectedDateString,
        productId: this.filterData.productId,
        scheduleItemId: this.filterData.scheduleItemId,
      })

      this.filterSplitLabels(scheduleItems)
      this.filterEvents(scheduleItems)
      this.filterScheduleStaffs(scheduleItems)
      if(type==='filter'){
        this.tryToFetchCurrentMonthly()
      }
      // 
      // if(this.isFirst){
      //   this.filterScheduleStaffs(scheduleItems)
      // }      
      // this.isFirst=false
    },
    async tryToStoreItem(staff) {
      await this.$store.dispatch('schedule/storeItem', {
        date: this.selectedDateString,
        itemId: staff.id,
      })
      // this.isFirst=true
      this.filterData.scheduleItemId=''
      this.filterData.productId=''
      this.tryToFetchSchedule()
    },
    tryToFetchCurrentMonthly() {
      const { firstCellDate, lastCellDate } = this.$refs['sm-cal'].getViewInfo()
      const startDate = formatRequestData(firstCellDate)
      const endDate = formatRequestData(lastCellDate)
      this.tryToFetchMonthly({ startDate, endDate,scheduleItemId:this.filterData.scheduleItemId })
    },
    // 過濾出尚未加入班表上的人員
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
      const splits = list.map((item) => {
        return {
          id: item.id,
          name: `${item.name}${item.scheduleDetails.length ? '' : '（無排班）'}`,
          canDelete: item.scheduleDetails.length === 0,
        }
      })
      // if(this.isFirst){
      //   this.staffsInSchedule=[...splits]
      // }
      this.staffsInSchedule=[...splits]
      
      this.splitLabels = [...splits, { type: 'create' }]
    },
    filterEvents(list) {
      const eventList = []
      list.forEach((item) => {
        item.scheduleDetails.forEach((event) => {
          if (event.isFiltered === 0)
            eventList.push({
              start: event.startDate,
              end: event.endDate,
              split: item.id,
              customInfo: { ...event },
            })
        })
      })
      this.events = eventList
    },
    onCellClick({ date, split: itemId }) {
      if (typeof itemId === 'number') return
      this.tryToFetchStaffDetail(itemId, date)
      // console.log(this.tryToFetchStaffDetail(itemId))
      // this.selectedItem = { itemId, ...this.getStartEndTime(date),storeIds,serviceCategoryIds,productPriceIds,maxCollision }
      this.getSelectedStaffName(itemId)
      this.visibleScheduleItem = true
    },
    async onEventClick(event, e) {
      this.tryingFetchItemDetail = true
      this.selectedItem = await this.$store.dispatch('schedule/fetchItemDetail', event.customInfo.id)
      this.getSelectedStaffName(event.split)
      this.visibleScheduleItem = true
      this.tryingFetchItemDetail = false

      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    },
    fetchEvents() {
      this.tryToFetchSchedule()
    },
    getStartEndTime(date) {
      const time = getMinutes(date)
      let startTime =''
      switch (true) {
        case (time<15):
          startTime = setMinutes(date, 0) 
          break;
        case (time<30 && time>=15):
          startTime = setMinutes(date, 15) 
          break;
        case (time<45 && time>=30):
          startTime = setMinutes(date, 30) 
          break;
        case (time<60 && time>=45):
          startTime = setMinutes(date, 45) 
          break;
      }
      // let startTime = getMinutes(date) < 15 ? setMinutes(date, 0) : setMinutes(date, 15)
      const endTime = addMinutes(startTime, 15)
      return { startTime: formatDate(startTime, 'time'), endTime: formatDate(endTime, 'time') }
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
    onItemStored() {
      this.tryToFetchSchedule()
      this.tryToFetchCurrentMonthly()
      this.visibleScheduleItem = false
    },
    getSelectedStaffName(itemId) {
      this.splitLabels.some((label) => (label.id === itemId ? (this.selectedStaffName = label.name) : false))
    },
    onViewChange(viewInfo) {
      if (viewInfo.view !== 'month') return
      this.tryToFetchMonthly({
        startDate: formatRequestData(viewInfo.firstCellDate),
        endDate: formatRequestData(viewInfo.lastCellDate),
        scheduleItemId:this.filterData.scheduleItemId
      })
    },
    async tryToFetchMonthly(date) {
      const list = await this.$store.dispatch('schedule/fetchMonthly', { ...date })
      this.calendarEvents = list.map((item) => ({
        start: item.date,
        end: item.date,
        customInfo: {
          ...item,
        },
      }))
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
    async tryToFetchStaffDetail(id, date) {
      const { storeIds, serviceCategoryIds, productPriceIds, maxCollision } = await this.$store.dispatch('schedule/fetchStaffDetail', { id })
      // console.log(storeIds, serviceCategoryIds, productPriceIds, maxCollision,this.getStartEndTime(date))
      this.selectedItem = { itemId: id, ...this.getStartEndTime(date), productIds: storeIds, serviceCategoryIds, serviceIds: productPriceIds, maxCollision }
      // return { storeIds, serviceCategoryIds, productPriceIds, maxCollision }
    },
    async tryToRemoveItem(id) {
      try {
        await this.$store.dispatch('schedule/deleteScheduleItem', {
          date: this.selectedDateString,
          itemId: id,
        })
        // this.isFirst=true
        this.tryToFetchSchedule()
      } finally {
      }
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.page" style="margin-bottom:0">
      <BaseTableSearch v-if="!visibleScheduleItem" v-slot="{ fields }" hide-action :default-value.sync="filterData" :border="true" @reset="tryToFetchSchedule('filter')" @tryToFetchList="tryToFetchSchedule">
        <el-form-item prop="productId">
          <el-select v-model="fields.productId" @change="tryToFetchSchedule('filter')">
            <el-option label="所有地點" value></el-option>
            <el-option v-for="(product, index) in merchantProducts" :key="`list-tag-${index}`" :label="product.name" :value="product.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="productId">
          <el-select v-model="fields.scheduleItemId" @change="tryToFetchSchedule('filter')">
            <el-option label="所有排班人員" value></el-option>
            <el-option v-for="(staff, index) in staffsInSchedule" :key="index" :label="staff.name" :value="staff.id"></el-option>
          </el-select>
        </el-form-item>
      </BaseTableSearch>
      <el-card v-loading="tryingFetchItemDetail" element-loading-text="取得排班資訊中" shadow="never" :class="$style['card-wrapper']" style="margin-bottom:0">
        <transition-group :name="visibleScheduleItem ? $style.zoom : $style['zoom-reverse']">
          <div v-show="!visibleScheduleItem" :key="'vue-cal'" class="vue-cal-layout">
            <div>
              <!-- <VueCal
              ref="sm-cal"
              class="vuecal--date-picker Jost"
              xsmall="xsmall"
              hide-view-selector="hide-view-selector"
              active-view="month"
              locale="zh-hk"
              style="width: 250px; height: 300px"
              :selected-date="selectedDate"
              :events="calendarEvents"
              :time="false"
              :transitions="false"
              :disable-views="['week', 'day']"
              :editable-events="false"
              click-to-navigate
              @cell-focus="selectedDate = $event"
              @view-change="onViewChange"
            >
              <template v-slot:cell-content="{ cell, events }">
                <span class="vuecal__cell-date" :class="events[0] && events[0].customInfo.isOpen ? 'is-available' : ''">{{ cell.content }}</span>
              </template>
            </VueCal> -->
              <CalendarItem
                v-slot="{ data: { cell, events } }"
                ref="sm-cal"
                :selected-date.sync="selectedDate"
                :calendar-events="calendarEvents"
                @view-change="onViewChange"
                @rendered="onRenderedCalendarItem"
              >
                <span class="vuecal__cell-date" :class="events[0] && events[0].customInfo.isOpen ? 'is-available' : ''">{{ cell.content }}</span>
              </CalendarItem>
              <el-divider></el-divider>
              <!-- <p>篩選</p>
            <el-select v-model="productId" value-key="id" :class="$style.filter" @change="tryToFetchSchedule">
              <el-option label="所有地點" value></el-option>
              <el-option v-for="(product, index) in merchantProducts" :key="`list-tag-${index}`" :label="product.name" :value="product.id"></el-option>
            </el-select> -->
            </div>
            <div class="schedule-wrap">
              <VueCal
                ref="cal"
                class="full-cal vuecal--full-height-delete"
                :class="[$style.schedule, $style[`split-labels-${staffs}`]]"
                hide-weekends="hide-weekends"
                active-view="day"
                locale="zh-hk"
                :selected-date="selectedDate"
                :time-from="6 * 60"
                :time-to="24 * 60"
                :split-days="splitLabels"
                :sticky-split-labels="true"
                :editable-events="editable"
                :events="events"
                :on-event-click="onEventClick"
                :time-step="15"
                :disable-views="['years', 'year', 'week', 'day', 'month']"
                :hide-title-bar="true"
                :time-cell-height="50"
                :snap-to-time="1"
                @cell-click="onCellClick"
                @view-change="fetchEvents"
              >
                <template v-slot:split-label="{ split }">
                  <el-dropdown v-if="split.type === 'create'" trigger="click">
                    <el-button style="background-color: #98b8ad33; height: 44px">選擇人員 <BaseIcon icon-style="fal" name="chevron-down" /></el-button>
                    <el-dropdown-menu slot="dropdown" :class="$style['schedule-dropdown']">
                      <el-dropdown-item @click.native="createStaff"><BaseIcon name="plus" /> 新增人員</el-dropdown-item>
                      <el-dropdown-item v-for="(staff, index) in scheduleStaffs" :key="`staff-${index}`" @click.native="tryToStoreItem(staff)">{{ staff.name }} </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <!-- <el-dropdown v-else trigger="click">
                  <el-button style="background: #C6C6BA66;height: 44px;"
                    >{{ split.name }}
                  </el-button>
                  <el-dropdown-menu v-if="false" slot="dropdown" :class="$style['schedule-dropdown']">
                    <el-dropdown-item @click.native="disabledSchedule">停用本日所有排班</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
                  <el-button v-if="split.type !== 'create' && !split.canDelete" style="background: #c6c6ba66; height: 44px; width: 100%; text-align: left; pointer-events: none">
                    {{ split.name }}
                  </el-button>
                  <div v-if="split.type !== 'create' && split.canDelete" style="padding: 14px 20px; background: #c6c6ba66; height: 44px; position: relative; width: 100%; text-align: left">
                    {{ split.name }}
                    <div class="cancelBtn" @click="tryToRemoveItem(split.id)">
                      <BaseIcon icon-style="fal" name="times" />
                    </div>
                  </div>
                </template>

                <template v-slot:event="{ event }">
                  <div class="title">
                    <div class="time Jost"
                      >{{ event.start.format('HH:mm') + ' ~ ' + event.end.format('HH:mm') }}
                      <span class="state" :class="{ 'is-close': event.customInfo.state === 0 }">{{ event.customInfo.state ? '開放中' : '未開放' }}</span>
                      <br />
                      <span class="cycle">{{ event.customInfo.repeat }}</span>
                    </div>
                  </div>
                  <div>{{ `本時段可服務 ${event.customInfo.servicesCount} 種項目` }}</div>
                  <div>{{ `可於 ${event.customInfo.productsCount} 個地點服務` }}</div>
                  <el-button class="is-fullwidth is-round" type="primary" style="margin-top: 10px; padding: 8px"><BaseIcon name="edit" style="font-size: 20px"></BaseIcon></el-button>
                </template>
              </VueCal>
              <div id="custom-scrollbar" :class="$style['custom-scrollbar']">
                <div :style="`height:inherit;width: ${mirrorWidth}px;`"></div>
              </div>
            </div>
          </div>
          <ScheduleItem
            v-show="visibleScheduleItem"
            :key="'ScheduleItem'"
            :default-value="selectedItem"
            :staff-name="selectedStaffName"
            :day="selectedDateString"
            :locations="merchantProducts"
            @cancel="visibleScheduleItem = false"
            @store="onItemStored"
          ></ScheduleItem>
        </transition-group>
      </el-card>
      <div v-if="visibleScheduleItem" style="margin-top:60px"></div>
    </div>

    <BaseButtonDialog width="70%" only-dialog title="新增人員" :dialog-visible.sync="dialogVisible" floating>
      <ScheduleStaffForm :default-value="dialogItem" access-type="schedule" @store="tryToStoreItem" @close="closeDialog" />
    </BaseButtonDialog>
  </Layout>
</template>
<style lang="scss">
@import '@src/design/vuecal-override.scss';
.schedule-wrap {
  margin-left: 20px;
  flex: 1 0 auto;
  width: 200px;
  height: calc(100vh - 200px);
  // height: calc(100vh - 260.53px - 21px);
  // margin-top: -21px;
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
}
</style>
<style lang="scss" module>
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
.schedule-dropdown {
  width: 199.5px;
  margin-top: 3px !important;
  :global {
    .popper__arrow {
      display: none;
    }
  }
}
.schedule {
  // border-radius: 4px;
  box-shadow: inherit !important;
  position: relative;
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
          // border: 1px solid #C6C6BA;
          width: 200px;
          > .el-button span {
            white-space: nowrap;
            text-overflow: ellipsis;
            width: auto;
            display: block;
            overflow: hidden;
          }
          .el-dropdown {
            width: 100%;
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
            border-left: 1px solid rgba(198, 198, 186, 0.7);
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
          height:3600px;
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
      max-width: 200px;
      min-width: 200px;
      .vuecal__no-event {
        display: none;
      }
      .vuecal__event {
        box-shadow: inset 0 0 0 2px #f2eae6;
        padding: 15px;
        text-align: left;
        background-color: #f8f4f2;
        .title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          .time {
            font-size: 15px;
            line-height: 18px;
            font-weight: 500;
            .state {
              margin-left: 13px;
              color: darkseagreen;
              font-size: 14px;
              box-shadow: 0px 0px 0 2px darkseagreen;
              border-radius: 3px;
              padding: 1px 4px;
              &.is-close {
                color: #f56c6c;
                box-shadow: 0px 0px 0 2px #f56c6c;
              }
            }
            .cycle {
              color: #f2a67f;
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
  min-height: 77vh;
  @include max-sm {
    overflow-x: scroll;
  }
  :global {
    .el-card__header {
      background-color: #eeeeee;
    }
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

%zoom_leaving {
  position: absolute;
  width: 878px;
}
.zoom {
  &:global(-enter) {
    opacity: 0;
    transform: scale(1.1);
  }
  &:global(-enter-active) {
    transition-delay: 0.15s !important;
  }
  &:global(-enter-active),
  &:global(-leave-active) {
    transition: all 0.3s;
  }

  &:global(-leave) {
    @extend %zoom_leaving;
  }
  &:global(-leave-to) {
    @extend %zoom_leaving;
    opacity: 0;
    transform: scale(0.9);
  }
  &-reverse {
    &:global(-enter) {
      opacity: 0;
      transform: scale(0.9);
      @extend %zoom_leaving;
    }
    &:global(-enter-active) {
      transition-delay: 0.15s !important;
    }
    &:global(-enter-to) {
      @extend %zoom_leaving;
    }
    &:global(-enter-active),
    &:global(-leave-active) {
      transition: all 0.3s;
    }
    &:global(-leave) {
      @extend %zoom_leaving;
    }
    &:global(-leave-to) {
      @extend %zoom_leaving;
      opacity: 0;
      transform: scale(1.1);
    }
  }
}
</style>
