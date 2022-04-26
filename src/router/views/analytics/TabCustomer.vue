<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  page: {
    title: '客戶分析',
    meta: [{ name: 'description', content: 'Customer Analytics' }],
  },
  components: {
    CustomerGrowth: () =>
      lazyLoadComponent(import('./components/CustomerGrowth')),
    PurchaseType: () => lazyLoadComponent(import('./components/PurchaseType')),
    ProductSalesVolume: () =>
      lazyLoadComponent(import('./components/ProductSalesVolume')),
  },
  data() {
    return {
      chartData: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    }
  },
  computed: {},
  methods: {
    fillData() {
      const datasets = []
      const labels = []
      for (let i = 0; i < 4; i++) {
        labels.push(this.getRandomInt())
        datasets.push({
          label: 'Data One',
          backgroundColor: `#f879${this.getRandomInt()}`,
          data: [
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
            this.getRandomInt(),
          ],
        })
      }
      this.chartData = {
        labels,
        datasets,
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
  },
}
</script>

<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <CustomerGrowth />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <PurchaseType />
      </el-col>
      <el-col :span="12">
        <ProductSalesVolume />
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" module></style>
