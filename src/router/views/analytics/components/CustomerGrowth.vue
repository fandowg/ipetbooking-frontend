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
      defaultValue: {
        blockTitle: '客戶成長',
        height: 300,
        chartType: 'Line',
        chartData: {
          labels: ['productTitle A', 'productTitle B'],
          datasets: [
            {
              label: '銷售額',
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
              ],
              data: [8620, 3200],
            },
          ],
        },
      },
    }
  },
  // props: {
  //   defaultValue: {
  //     default: () => {},
  //   },
  // },
  computed: {},
  methods: {
    async fetchPageViews(dateRange) {
      this.loading = true
      await this.$store.dispatch('analytics/fetchGA', {
        startDate: formatRequestData(dateRange[0]),
        endDate: formatRequestData(dateRange[1]),
        callback: this.displayResults,
      })
    },
    displayResults(response) {
      // console.log(JSON.stringify(response.result, null, 2))
      this.loading = false
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
  },
}
</script>
<template>
  <AnalyticsBlock
    v-loading="loading"
    :default-value="defaultValue"
    @update="fetchPageViews"
  ></AnalyticsBlock>
</template>
<style lang="scss" module></style>
