<script>
import { formatRequestData } from '@utils/format-date'
import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/zh-hk.js'
import 'vue-cal/dist/vuecal.css'

export default {
  components: {
    VueCal,
  },
  props: {
    selectedDate: {
      type: Date,
      default: new Date(),
    },
    calendarEvents: {
      type: Array,
      default: () => [],
    },
    disableDays: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  computed: {},
  created() {
    let timeout = setInterval(() => {
      if (this.$refs['cal'] !== undefined) {
        clearInterval(timeout)
        // this.tryToFetchCurrentMonthly()
        this.$emit('rendered', this.getViewInfo())
      }
    }, 300)
  },

  methods: {
    onCellFocus($event) {
      this.$emit('update:selectedDate', $event)
      this.$emit('cell-focus', $event)
    },
    // tryToFetchCurrentMonthly() {
    //   const startDate = formatRequestData(this.$refs['cal'].view.startDate)
    //   const endDate = formatRequestData(this.$refs['cal'].view.endDate)
    //   this.tryToFetchMonthly({ startDate, endDate })
    // },
    onViewChange(viewInfo) {
      this.$emit('view-change', viewInfo)
      // if (viewInfo.view !== 'month') return
      // this.tryToFetchMonthly({
      //   startDate: formatRequestData(viewInfo.startDate),
      //   endDate: formatRequestData(viewInfo.endDate),
      // })
    },
    // customCellClass(events) {
    //   if (events.length === 0) return ''
    //   return events[0].customInfo.isOpen ? 'is-available' : 'is-unscheduled'
    // },
    getViewInfo() {
      return this.$refs['cal'].view
    },
  },
}
</script>

<template>
  <VueCal
    ref="cal"
    class="vuecal--date-picker Jost"
    xsmall="xsmall"
    hide-view-selector="hide-view-selector"
    active-view="month"
    locale="zh-hk"
    style="width: 250px;height: 300px;"
    :events="calendarEvents"
    :selected-date="selectedDate"
    :time="false"
    :transitions="false"
    :disable-views="['week', 'day']"
    :editable-events="false"
    :disable-days="disableDays"
    click-to-navigate
    @cell-focus="onCellFocus"
    @view-change="onViewChange"
  >
    <template v-slot:cell-content="{ cell, events }">
      <slot :data="{ cell, events }"></slot>
      <!-- <span class="vuecal__cell-date" :class="customCellClass(events)">{{ cell.content }}</span> -->
    </template>
  </VueCal>
</template>
<style lang="scss">
@import '@src/design/vuecal-override.scss';
</style>
<style lang="scss" module></style>
