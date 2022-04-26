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
      loading: false,
      fetchData: {},
      defaultDateRange: {
        startDate: formatRequestData(
          new Date().getTime() - 3600 * 1000 * 24 * 30
        ),
        endDate: formatRequestData(new Date()),
      },
      defaultValue: {
        blockTitle: '購買類別統計',
        height: 200,
        chartType: 'Pie',
      },
      chartData: {},
    }
  },
  computed: {
    options() {
      const options = {
        tooltips: {
          callbacks: {
            title: (tooltipItem, data) => {
              return data['labels'][tooltipItem[0]['index']]
            },
            label: (tooltipItem, data) => {
              return (
                '訂單數量：' + data['datasets'][0]['data'][tooltipItem['index']]
              )
            },
            afterLabel: (tooltipItem, data) => {
              // console.log('params', { tooltipItem, data })
              const dataset = data['datasets'][0]
              const total = dataset.data.reduce((acc, next) => acc + next, 0)
              const percent = Math.round(
                (dataset['data'][tooltipItem['index']] / total) * 100
              )
              return '(' + percent + '%)'
            },
          },
          // backgroundColor: '#FFF',
          titleFontSize: 16,
          // titleFontColor: '#0066ff',
          // bodyFontColor: '#000',
          // bodyFontSize: 14,
          displayColors: false,
        },
      }
      return options
    },
    isEmptyData() {
      return (
        Object.keys(this.fetchData).length === 0 ||
        this.fetchData.countAll === 0
      )
    },
  },
  // props: {
  //   defaultValue: {
  //     default: () => {},
  //   },
  // },
  created() {
    this.fetchReportByProductCategory()
  },
  methods: {
    async fetchReportByProductCategory(dateRange) {
      this.loading = true
      this.fetchData = await this.$store.dispatch(
        'analytics/fetchReportByProductCategory',
        dateRange === undefined ? this.defaultDateRange : dateRange
      )
      this.updateChart()
      this.loading = false
    },
    updateChart() {
      this.chartData = this.convertToChartData()
    },
    convertToChartData() {
      const rawData = Object.assign({}, this.fetchData)
      const labels = ['活動', '服務', '課程', '導覽', '訂位']
      const data = [
        rawData.countActivity,
        rawData.countService,
        rawData.countCourse,
        rawData.countGuide,
        rawData.countReservation,
      ]
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
            label: '銷售量',
          },
        ],
      }
    },
  },
}
</script>
<template>
  <AnalyticsBlock
    v-loading="loading"
    :hide="isEmptyData"
    :default-value="defaultValue"
    :chart-data="chartData"
    :options="options"
    :height="defaultValue.height"
    @update="fetchReportByProductCategory"
  ></AnalyticsBlock>
</template>
<style lang="scss" module></style>
