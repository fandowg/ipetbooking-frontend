<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import zhTWLocale from '@fullcalendar/core/locales/zh-tw'

import lazyLoadComponent from '@router/lazyload-component'
import { inventoryRepeatFilter, inventoryCapacityFilter } from '@utils/filter-value-to-text'
import formatDate, { formatDateTimeRange, formatRequestData } from '@utils/format-date'

export default {
  components: {
    FullCalendar,
    InventoryItemDialog: () => lazyLoadComponent(import('@components/InventoryItemDialog')),
    InventoryItemOrders: () => lazyLoadComponent(import('@components/InventoryItemOrders')),
  },
  filters: {
    formatDate,
    formatDateTimeRange,
    inventoryRepeatFilter,
  },
  data() {
    return {
      tryinyToFetchEvents: false,
      filteredGroupId: '',
      dialogVisible: false,
      dialogInventory: {},
      ordersDrawerVisible: false,
      switchToMonthDate: new Date(),
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
              const { groups, inventories } = res.items
              this.groupList = groups
              this.eventList = inventories
              this.$refs.fullCalendar.getApi().updateSize()
              return successCallback(this.filteredEvents)
            })
            .catch((err) => failureCallback(err))
            .finally(() => (this.tryinyToFetchEvents = false))
        },
        // https://fullcalendar.io/docs/eventRender
        eventRender: (info) => {
          const { event, el, view } = info

          // check the inventory state is open or close
          el.classList.add(+event.extendedProps.state === 1 ? 'is-open' : 'is-close')
          // 若是此時段已有售出，增加右上角紅色三角形標記
          if (+event.extendedProps.qty > 0) {
            el.classList.add('is-booked')
          }
          const viewTypeIsMonth = view.type === 'dayGridMonth'
          if (!viewTypeIsMonth) {
            let capacityStatusEl = document.createElement('div')
            capacityStatusEl.classList.add('capacity')
            capacityStatusEl.appendChild(document.createTextNode(inventoryCapacityFilter(event.extendedProps.qty, event.extendedProps.inventory, event.extendedProps.infinity)))

            el.appendChild(capacityStatusEl)
          }
        },
      },
      calendarNow: new Date(),
      groupList: [],
      eventList: [],
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    },
    filteredEvents() {
      return this.filteredGroupId ? this.eventList.filter((event) => event.groupId === this.filteredGroupId) : this.eventList
    },
  },
  mounted() {
    let checkCalendarHeight = setInterval(() => {
      if (this.$refs.fullCalendar !== undefined && this.$refs.fullCalendar.getApi().component.viewHeight === 0) this.$refs.fullCalendar.getApi().updateSize()
      else clearInterval(checkCalendarHeight)
    }, 1000)
  },
  methods: {
    toggleOrdersDrawer() {
      this.ordersDrawerVisible = !this.ordersDrawerVisible
    },
    calendarGoToDate(value) {
      this.$refs.fullCalendar.getApi().gotoDate(value)
    },
    onClickCalendarEvent(info) {
      const { id, title, start, end, groupId, extendedProps } = info.event
      this.dialogInventory = {
        id,
        title,
        groupId,
        date: formatDate(start, 'dateWeekDay'),
        startTime: formatDate(start, 'time'),
        endTime: formatDate(end, 'time'),
        isPast: this.calendarNow.getTime() > start.getTime(),
        ...extendedProps, // state, inventory, qty
      }
      this.dialogVisible = true
    },
    navigateCalendar(method) {
      this.$refs.fullCalendar.getApi()[method]()
      const currentDate = this.$refs.fullCalendar.getApi().getDate()
      this.switchToMonthDate = currentDate
    },
    changeCalendarView(view) {
      this.$refs.fullCalendar.getApi().changeView(view)
    },
    refetchEvents() {
      this.$nextTick(() => {
        this.$refs.fullCalendar.getApi().refetchEvents()
      })
    },
    tryToFetchEvents(startDate, endDate) {
      return this.$store.dispatch('product/inventoryCalendar', {
        productId: this.productId,
        submitData: {
          startDate: formatRequestData(startDate),
          endDate: formatRequestData(endDate),
          withGroup: 1,
        },
      })
    },
  },
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.sidebar">
      <el-radio-group v-model="filteredGroupId" :class="$style.radios" size="small" @change="refetchEvents">
        <el-radio label>所有時段</el-radio>
        <el-radio v-for="(group, groupIndex) in groupList" :key="group.id" :label="group.id">
          {{ `#${groupIndex + 1} ${group.title || '時段'}` }}
          <div v-show="group.id === filteredGroupId" :class="$style['radios__content']">
            {{ group.startDate | formatDateTimeRange(group.endDate, group.startTime, group.endTime) }}
            <br />
            <b>{{ group.repeat | inventoryRepeatFilter(group.repeatWith) }}</b>
            <template v-if="group.repeatEndDate">
              <br />
              至{{ group.repeatEndDate | formatDate }}
            </template>
          </div>
        </el-radio>
      </el-radio-group>
    </div>
    <div v-loading="tryinyToFetchEvents" :class="$style.container">
      <ul :class="$style.legend">
        <li :class="$style['legend__item']"> <span class="fc-event is-close"></span>時段關閉 </li>
        <li :class="$style['legend__item']"> <span class="fc-event is-open"></span>時段開放 </li>
        <li :class="$style['legend__item']"> <span class="fc-event is-booked"></span>已有訂單 </li>
      </ul>
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
          <el-button size="small" @click="navigateCalendar('today')">今天</el-button>
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
        <el-radio-group v-model="calendarProps.defaultView" :class="$style['toolbar-right']" size="small" @change="changeCalendarView">
          <el-radio-button label="timeGridDay">天</el-radio-button>
          <el-radio-button label="timeGridWeek">週</el-radio-button>
          <el-radio-button label="dayGridMonth">月</el-radio-button>
        </el-radio-group>
      </div>
      <FullCalendar ref="fullCalendar" v-bind="calendarProps" :now="calendarNow" :now-indicator="true" :all-day-slot="false" @eventClick="onClickCalendarEvent" />
    </div>
    <InventoryItemDialog :visible.sync="dialogVisible" :item.sync="dialogInventory" @view-orders="toggleOrdersDrawer" @update-state="refetchEvents" />
    <InventoryItemOrders :visible.sync="ordersDrawerVisible" :item="dialogInventory" />
  </div>
</template>

<style lang="scss">
/* override fullcalendar style */
@import '@src/design/fullcalendar-override.scss';
</style>
<style lang="scss" module>
@import '@design';
.wrapper {
  display: flex;
  min-height: calc(100vh - #{$size-header-height});
  margin: -15px;
}
.sidebar {
  min-width: 15rem;
  background: $color-primary;
}
.container {
  padding: 20px;
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
.radios {
  display: flex;
  flex-direction: column;
  :global {
    .el-radio {
      display: flex;
      width: 100%;
      padding: 10px 20px;
      margin-right: 0;
      color: white;

      &.is-checked {
        @include layer-elevation(4);

        background-color: rgba(255, 255, 255, 0.15);
      }
      .el-radio__label {
        white-space: normal;
        vertical-align: middle;
      }
    }
    .el-radio__inner:after {
      background: transparent;
    }

    .el-radio__input.is-checked {
      & + .el-radio__label {
        color: white;
      }

      .el-radio__inner {
        background: #f85858;
        border-color: #f85858;
      }
    }
  }
  &__content {
    padding-top: 10px;
    margin-top: 15px;
    line-height: 1.5;
    white-space: normal;
    border-top: 1px solid $color-border-light;
  }
}
.legend {
  display: flex;
  justify-content: flex-end;

  &__item:not(:last-child) {
    margin-right: 20px;
  }
  :global {
    .fc-event {
      display: inline-block;
      margin-right: 10px;
    }
  }
}
</style>
