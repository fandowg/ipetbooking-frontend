<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'

export default {
  page: {
    title: '數據分析',
    meta: [
      { name: 'description', container: 'Data Analytics' },
      // {
      //   name: 'google-signin-client_id',
      //   content:
      //     '290512385831-dmghl5rmcej3pvvap0lrt261tk1ijdrv.apps.googleusercontent.com',
      // },
      {
        name: 'google-signin-scope',
        content: 'https://www.googleapis.com/auth/analytics.readonly',
      },
    ],
  },
  components: {
    Layout,
  },
   props: {
    merchantProducts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeTab: '1',
      formattedJson: '',
      sellShow:false,
      tabList: Object.freeze([
        {
          title: '收益',
          component: () => lazyLoadComponent(import('./TabIncome')),
        },
        {
          title: '銷售',
          component: () => lazyLoadComponent(import('./TabSell')),
        },
        {
          title: '優惠券',
          component: () => lazyLoadComponent(import('./TabCoupon')),
        },
        {
          title: '服務人員',
          component: () => lazyLoadComponent(import('./TabStaff')),
        },
      ]),
    }
  },
  watch:{
    activeTab(value){
      if(value==="2"){
        this.sellShow=true
      }

    }
  },
  created() {
    // this.accessGoogleAccount()
    // this.testAPIs()
  },
  mounted() {
    // this.importGapi()
    // this.accessGoogleAccount()
  },
  methods: {
    // async accessGoogleAccount() {
    //   await this.$store.dispatch('analytics/initGA')
    // },
    // async testAPIs() {
    //   const dateRange = {
    //     startDate: '2020-01-01',
    //     endDate: '2020-03-31',
    //   }
    //   await this.$store.dispatch('analytics/fetchReportByCustomer', dateRange)
    //   await this.$store.dispatch('analytics/fetchReportByProducts', dateRange)
    //   await this.$store.dispatch(
    //     'analytics/fetchReportByProductCategory',
    //     dateRange
    //   )
    //   await this.$store.dispatch('analytics/fetchReportBySingleProduct', {
    //     productId: '46c63acf-3329-432f-b790-c3c2db42a7ee',
    //     ...dateRange,
    //   })
    // },
  },
}
</script>

<template>
  <Layout>
   <div :class="$style.page" >
    <el-tabs v-model="activeTab" stretch type="border-card">
      <el-tab-pane
        v-for="(tab, index) in tabList"
        :key="index"
        :label="tab.title"
        :name="`${index + 1}`"
      >
        <component :is="tab.component" v-if="Number(activeTab) === index + 1" :ref="`step${index + 1}`" :merchant-products="merchantProducts" :sell-show="sellShow"></component>

     
      </el-tab-pane>
    </el-tabs>
  </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
:global{
  .isPage{
    .el-tabs__content{
      padding-bottom: 40px;
    }
  }
}
</style>
