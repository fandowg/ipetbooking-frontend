<script>
import lazyLoadComponent from '@router/lazyload-component'
import { formatRequestData } from '@utils/format-date'

export default {
  components: {
    AnalyticsBlock: () =>
      lazyLoadComponent(import('@components/AnalyticsBlock')),
  },
  data() {
    return {
      done: false,
      loading: false,
      displayType: '銷售金額',
      fetchData: undefined,
      chartType: 'Bar',
      chartData: {},
      defaultDateRange: {
        startDate: formatRequestData(
          new Date().getTime() - 3600 * 1000 * 24 * 30
        ),
        endDate: formatRequestData(new Date()),
      },
      defaultValue: {
        blockTitle: '商品銷售',
        height: 200,
        chartType: 'Bar',
      },
    }
  },
  computed: {
    options() {
      const options = {
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: (value, index, values) => {
                  const format = this.displayType === '銷售金額' ? '$ ' : ''
                  return format + value.toLocaleString()
                },
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            title: (tooltipItem, data) =>
              data['labels'][tooltipItem[0]['index']],
            label: (tooltipItem, data) => {
              return (
                this.displayType +
                '：' +
                data['datasets'][0]['data'][tooltipItem['index']]
              )
            },
          },
          // backgroundColor: '#FFF',
          // titleFontSize: 16,
          // titleFontColor: '#0066ff',
          // bodyFontColor: '#000',
          // bodyFontSize: 14,
          displayColors: false,
        },
      }
      return options
    },
  },
  created() {
    this.fetchReportByProducts()
    this.done = true
  },
  methods: {
    async fetchReportByProducts(dateRange) {
      this.loading = true
      this.fetchData = await this.$store.dispatch(
        'analytics/fetchReportByProducts',
        dateRange === undefined ? this.defaultDateRange : dateRange
      )
      this.updateChart()
      this.loading = false
    },
    updateChart() {
      this.chartData = this.convertToChartData()
    },
    convertToChartData() {
      const labels = []
      const data = []
      this.fetchData.forEach((report) => {
        labels.push(report.productTitle)
        data.push(
          this.displayType === '銷售金額' ? report.buyTotal : report.buyCount
        )
      })
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: [
              '#c80e0e',
              '#E26928',
              '#46BFBD',
              '#FDB45C',
              'rgb(153, 102, 255)',
            ],
            label: '銷售金額',
          },
        ],
      }
    },
  },
}
</script>
<template>
  <AnalyticsBlock
    v-if="done"
    v-loading="loading"
    :default-value="defaultValue"
    :chart-data="chartData"
    :options="options"
    :height="defaultValue.height"
    @update="fetchReportByProducts"
  >
    <el-radio-group
      :class="$style['group']"
      v-model="displayType"
      size="mini"
      @change="updateChart"
    >
      <el-radio-button label="銷售金額"></el-radio-button>
      <el-radio-button label="銷售量"></el-radio-button>
    </el-radio-group>
  </AnalyticsBlock>
</template>
<style lang="scss" module>
.group {
  float: right;
  margin-bottom: 20px;
}
</style>
