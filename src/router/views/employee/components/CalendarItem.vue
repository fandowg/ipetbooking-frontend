<script>
import formatDate, { formatRequestData } from '@utils/format-date'
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/zh-hk.js'
import 'vue-cal/dist/vuecal.css'

export default {
  components: {
    VueCal,
  },
  props: {
    hideStatus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedDate: new Date(),
      calendarEvents: [],
    }
  },
  computed: {
    selectedDateString() {
      return this.selectedDate.format()
    },
  },
  created() {
    let timeout = setInterval(() => {
      if (this.$refs['sm-cal'] !== undefined) {
        clearInterval(timeout)
        this.tryToFetchCurrentMonthly()
      }
    }, 300)
  },
  methods: {
    onCellFocus(date) {
      this.$emit('update', date)
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
    tryToFetchCurrentMonthly() {
      const startDate = formatRequestData(this.$refs['sm-cal'].view.startDate)
      const endDate = formatRequestData(this.$refs['sm-cal'].view.endDate)
      this.tryToFetchMonthly({ startDate, endDate })
    },
    onViewChange(viewInfo) {
      if (viewInfo.view !== 'month') return
      this.tryToFetchMonthly({
        startDate: formatRequestData(viewInfo.startDate),
        endDate: formatRequestData(viewInfo.endDate),
      })
    },
    customCellClass(events) {
      if (events.length === 0) return ''
      return events[0].customInfo.isOpen ? 'is-available' : 'is-unscheduled'
    },
  },
}
</script>

<template>
  <el-card shadow="never" :class="$style['card-wrapper']">
    <div class="vue-cal-layout">
      <div>
        <VueCal
          ref="sm-cal"
          class="vuecal--date-picker Jost"
          xsmall="xsmall"
          hide-view-selector="hide-view-selector"
          active-view="month"
          locale="zh-hk"
          style="height: 300px"
          :events="calendarEvents"
          :selected-date="selectedDate"
          :time="false"
          :transitions="false"
          :disable-views="['week', 'day']"
          :editable-events="false"
          click-to-navigate
          @cell-focus="onCellFocus"
          @view-change="onViewChange"
        >
          <template v-slot:cell-content="{ cell, events }">
            <span class="vuecal__cell-date" :class="customCellClass(events)">{{ cell.content }}</span>
          </template>
        </VueCal>

        <template v-if="!hideStatus">
          <el-divider></el-divider>
          <p :class="$style.status" style="margin-top: 30px;">預約狀態</p>
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
            <div>待報到 / 已確認</div>
          </div>
          <div :class="$style['order-status']">
            <div class="mark mark-4"></div>
            <div>未報到 / 已保留</div>
          </div>
          <div :class="$style['order-status']">
            <div class="mark mark-5"></div>
            <div>已保留</div>
          </div>
        </template>
      </div>
    </div>
  </el-card>
</template>
<style lang="scss">
@import '@src/design/vuecal-override.scss';
</style>
<style lang="scss" module>
@import '@design';
.status {
  font-size: 14px;
  line-height: 20p;
  color: #3f3a2e;
  font-weight: 500;
  letter-spacing: 1.4px;
}
.calendar-status {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 10px;
  :global {
    .mark {
      background-color: #41695b;
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
        background-color: #98b8ad33;
        color: #41695b;
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
    }
  }
}
</style>
