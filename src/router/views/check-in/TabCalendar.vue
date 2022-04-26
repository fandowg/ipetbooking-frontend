<script>
import lazyLoadComponent from '@router/lazyload-component'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import zhTWLocale from '@fullcalendar/core/locales/zh-tw'

import formatDate, { formatRequestData } from '@utils/format-date'
import { inventoryCapacityFilter } from '@utils/filter-value-to-text'

export default {
  components: {
    FullCalendar: () => lazyLoadComponent(import('@fullcalendar/vue')),
    InventoryItemOrders: () =>
      lazyLoadComponent(import('@components/InventoryItemOrders')),
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      componentName: 'TabCalendar',
      drawerVisible: false,
      drawerInventoryData: {},
      tryinyToFetchEvents: false,
      switchToMonthDate: new Date(),
      calendarNow: new Date(),
      calendarProps: {
        locale: zhTWLocale,
        plugins: [timeGridPlugin, dayGridPlugin],
        defaultView: 'dayGridMonth',
        eventLimit: true,
        eventLimitClick: 'day',
        views: {
          dayGridMonth: {
            eventLimit: 3,
          },
          timeGridDay: {
            //  https://fullcalendar.io/docs/slotLabelFormat
            slotLabelFormat: {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
          },
        },
        header: false,
        eventTimeFormat: {
          // like '14:30'
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        },
        // https://fullcalendar.io/docs/events-function
        events: (info, successCallback, failureCallback) => {
          this.tryinyToFetchEvents = true
          const { startStr: startDate, endStr: endDate } = info
          this.tryToFetchEvents(startDate, endDate)
            .then((res) => {
              if (this.drawerVisible) this.updateDrawerInventoryData(res)
              return successCallback(res)
            })
            .catch((err) => failureCallback(err))
            .finally(() => (this.tryinyToFetchEvents = false))
        },
        // https://fullcalendar.io/docs/eventRender
        eventRender: (info) => {
          const { event, el, view } = info

          if (!this.checkEventIsPast(event.start))
            el.classList.add(
              event.extendedProps.qty === event.extendedProps.inventory
                ? 'is-full'
                : 'is-open'
            )
          const isMonthView = view.type === 'dayGridMonth'
          if (!isMonthView) {
            let capacityStatusEl = document.createElement('div')
            capacityStatusEl.classList.add('capacity')
            capacityStatusEl.appendChild(
              document.createTextNode(
                inventoryCapacityFilter(
                  event.extendedProps.qty,
                  event.extendedProps.inventory
                )
              )
            )

            el.appendChild(capacityStatusEl)
          }
        },
      },
      inventoryItems: [],
    }
  },

  watch: {
    'product.id': 'refetchCalendarEvents',
    inventoryItems: 'checkInventoryItems',
  },
  methods: {
    checkEventIsPast(eventEndTime) {
      return this.calendarNow.getTime() > eventEndTime.getTime()
    },
    toggleOrdersDrawer() {
      this.drawerVisible = !this.drawerVisible
    },
    navigateCalendar(method) {
      this.$refs.fullCalendar.getApi()[method]()
      const currentDate = this.$refs.fullCalendar.getApi().getDate()
      // FIXME: 可以取得 title
      // const currentView = this.$refs.fullCalendar.getApi().view
      this.switchToMonthDate = currentDate
      // console.log('TCL: navigateCalendar -> currentDate', currentDate)
    },
    changeCalendarView(view) {
      this.$refs.fullCalendar.getApi().changeView(view)
    },
    calendarGoToDate(value) {
      this.$refs.fullCalendar.getApi().gotoDate(value)
    },
    refetchCalendarEvents() {
      this.$refs.fullCalendar.getApi().refetchEvents()
    },
    onClickCalendarEvent(info) {
      // https://fullcalendar.io/docs/eventClick
      const { id, title, start, end, extendedProps } = info.event
      this.drawerInventoryData = {
        id,
        title,
        date: formatDate(start, 'dateWeekDay'),
        startTime: formatDate(start, 'time'),
        endTime: formatDate(end, 'time'),
        isPast: this.checkEventIsPast(start),
        ...extendedProps, // inventory, state, qty, productId
      }
      if (!this.drawerVisible) this.toggleOrdersDrawer()
    },
    async tryToFetchEvents(startDate, endDate) {
      this.inventoryItems = this.product.id
        ? await this.$store
            .dispatch('product/inventoryCalendar', {
              productId: this.product.id,
              submitData: {
                startDate: formatRequestData(startDate),
                endDate: formatRequestData(endDate),
                withGroup: 0,
              },
            })
            .then((res) => res.items)
        : new Promise((resolve) => resolve([]))
      return this.inventoryItems
    },
    updateDrawerInventoryData(fetchData) {
      fetchData.every((inventoryItem) => {
        if (inventoryItem.id === this.drawerInventoryData.id) {
          this.drawerInventoryData = {
            ...this.drawerInventoryData,
            inventory: inventoryItem.inventory,
            qty: inventoryItem.qty,
          }
          return false
        }
        return true
      })
    },
    checkInventoryItems() {
      if (
        this.inventoryItems.length > 0 &&
        this.$route.params.inventoryId !== undefined
      ) {
        this.inventoryItems.some((item) => {
          if (item.id === this.$route.params.inventoryId) {
            this.openDrawerFromDashboard(item)
            return true
          }
          return false
        })
      }
    },
    openDrawerFromDashboard(inventoryItem) {
      const { id, title = '', start, end, ...extendedProps } = inventoryItem
      this.drawerInventoryData = {
        id,
        title,
        date: formatDate(start, 'dateWeekDay'),
        startTime: formatDate(start, 'time'),
        endTime: formatDate(end, 'time'),
        isPast: this.checkEventIsPast(new Date(start)),
        ...extendedProps, // inventory, state, qty, productId
      }
      if (!this.drawerVisible) this.toggleOrdersDrawer()
      delete this.$route.params.inventoryId
    },
  },
}
</script>
<template>
  <div v-loading="tryinyToFetchEvents">
    <h3>{{ product.name }}</h3>
    <div :class="$style.calendar">
      <div :class="$style.toolbar">
        <div :class="$style['toolbar-left']">
          <el-button-group>
            <el-button size="small" @click="navigateCalendar('prev')">
              <BaseIcon name="angle-left" />
            </el-button>
            <el-button size="small" @click="navigateCalendar('next')">
              <BaseIcon name="angle-right" />
            </el-button>
          </el-button-group>
          <el-button size="small" @click="navigateCalendar('today')"
            >今天</el-button
          >
        </div>

        <el-date-picker
          v-model="switchToMonthDate"
          size="small"
          :class="$style['toolbar-center']"
          type="month"
          placeholder="跳至"
          format="yyyy 年 M 月 d 日"
          :editable="false"
          :clearable="false"
          @change="calendarGoToDate"
        ></el-date-picker>
        <el-radio-group
          v-model="calendarProps.defaultView"
          :class="$style['toolbar-right']"
          size="small"
          @change="changeCalendarView"
        >
          <el-radio-button label="timeGridDay">天</el-radio-button>
          <el-radio-button label="timeGridWeek">週</el-radio-button>
          <el-radio-button label="dayGridMonth">月</el-radio-button>
        </el-radio-group>
      </div>
      <FullCalendar
        ref="fullCalendar"
        v-bind="calendarProps"
        :now="calendarNow"
        :now-indicator="true"
        :all-day-slot="false"
        @eventClick="onClickCalendarEvent"
      />
    </div>

    <InventoryItemOrders
      :visible.sync="drawerVisible"
      :item="drawerInventoryData"
      :product-name="product.name"
      :product-type="product.type"
      @calendar="refetchCalendarEvents"
    />
  </div>
</template>
<style lang="scss">
/* override fullcalendar style */
@import '@src/design/fullcalendar-override.scss';
</style>
<style lang="scss" module>
@import '@design';
.calendar {
  @include layer-elevation(5);

  background: white;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid $color-border-base;

  &-left,
  &-right {
    flex: 1 0 200px;
  }
  &-center {
    width: 200px;
    text-align: center;
  }
  &-right {
    text-align: right;
  }
}
</style>
