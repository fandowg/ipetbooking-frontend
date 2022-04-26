<script>
import lazyLoadComponent from '@router/lazyload-component'
import { formatRequestData } from '@utils/format-date'

export default {
  components: {
    ChartLine: () => lazyLoadComponent(import('./ChartLine')),
    ChartBar: () => lazyLoadComponent(import('./ChartBar')),
    ChartPie: () => lazyLoadComponent(import('./ChartPie')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    chartData: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startDate: new Date().getTime() - 3600 * 1000 * 24 * 30,
      endDate: new Date(),
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一週',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一個月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三個月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
    }
  },

  computed: {
    filterDateRange: {
      get() {
        return [this.startDate, this.endDate]
      },
      set(value) {
        const [start, end] = value || []
        this.startDate = start
        this.endDate = end
      },
    },
    dateRangeText() {
      const dateRangeText = Object.assign([], this.filterDateRange)
      // console.log('dateRangeText', dateRangeText)
      return (
        formatRequestData(dateRangeText[0]) +
        ' 至 ' +
        formatRequestData(dateRangeText[1])
      )
    },
  },
  methods: {
    updateChart() {
      this.$emit('update', this.formatDateRangeToString())
    },

    togglePickerVisible() {
      this.$refs.datepicker.pickerVisible = !this.$refs.datepicker.pickerVisible
    },
    formatDateRangeToString() {
      const startDate = formatRequestData(this.filterDateRange[0])
      const endDate = formatRequestData(this.filterDateRange[1])
      return { startDate, endDate }
    },
  },
}
</script>
<template>
  <div>
    <el-card :class="$style['box-card']">
      <div slot="header" :class="[$style['chart-header']]">
        <span style="font-size: 18px;">{{ defaultValue.blockTitle }}</span>
        <el-date-picker
          ref="datepicker"
          v-model="filterDateRange"
          :class="$style['invisible']"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          :picker-options="pickerOptions"
          :clearable="false"
          @change="updateChart"
        ></el-date-picker>
        <el-button size="small" @click="togglePickerVisible">{{
          dateRangeText
        }}</el-button>
      </div>
      <div class="chart-body">
        <template v-if="!hide">
          <slot></slot>
          <component
            :is="`Chart${defaultValue.chartType}`"
            :chart-data="chartData"
            :options="options"
            :height="defaultValue.height"
          ></component>
        </template>
        <template v-else>
          <div
            :style="`height:${defaultValue.height}px;`"
            :class="$style['empty-placeholder']"
          >
            <span>無資料顯示</span>
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" module>
.chart-block {
  padding: 10px;
  background: #f9f7f5;
}
.box-card {
  margin-bottom: 20px;
}
.chart-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.chart-body {
}
.invisible {
  width: 188px;
  position: absolute;
  right: 0;
  height: 32px;
  visibility: hidden;
}
.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 111111;
  width: 100%;
  bottom: 0;
}
.empty-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-weight: 600;
    font-size: 20px;
    color: lightgray;
    letter-spacing: 5px;
  }
}
</style>
