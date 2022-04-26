<script>
import lazyLoadComponent from '@router/lazyload-component'
import Layout from '@layouts/main'

export default {
  page: {
    title: '商店設定',
    meta: [{ name: 'description', content: 'Settings' }],
  },

  components: {
    Layout,
  },
  data() {
    return {
      activeTab: 'info',
      tabList: [
        {
          label: '商店資訊',
          description:
            '設定商店名稱、簡介、Logo 圖等資訊，同步更新您專屬訂購頁面。',
          alias: 'info',
          actionName: 'getInfo',
          component: () => lazyLoadComponent(import('./TabInfo')),
        },
        {
          label: '方案訂閱',
          description: '查看您目前訂閱的方案。',
          alias: 'subscription',
          actionName: 'subscription',
          component: () => lazyLoadComponent(import('./TabSubscription')),
        },
        {
          label: '訂閱付費紀錄',
          description: '瀏覽您所有方案續約扣款紀錄。',
          alias: 'subscription-history',
          actionName: 'subscriptionHistory',
          component: () =>
            lazyLoadComponent(import('./TabSubscriptionHistory')),
        },
        // {
        //   label: '收款金流開通／設定',
        //   description: '申請金流並開通，即可變更價格。',
        //   alias: 'payment',
        //   actionName: 'payment',
        //   component: () => lazyLoadComponent(import('./TabPayment')),
        // },
        // {
        //   label: 'LINE Bot 設定',
        //   description: '設定 LINE Bot 讓客戶透過 LINE 快速預約，生意強強滾！',
        //   alias: 'line-bot',
        //   actionName: 'linebot',
        //   component: () => lazyLoadComponent(import('./TabLineBot')),
        // },
        {
          label: '通知設定',
          description: '通知設定',
          alias: 'notification',
          actionName: 'getDashboardSmsInfo',
          component: () => lazyLoadComponent(import('./TabNotification')),
        },
        {
          label: '簡訊紀錄',
          description: '簡訊紀錄',
          alias: 'sms-record',
          actionName: 'getDashboardSmsInfo',
          component: () => lazyLoadComponent(import('./TabSmsHistory')),
        },
      ],
    }
  },
  computed: {
    permittedTabList() {
      return this.tabList.filter(({ actionName }) =>
        this.$can('api', actionName)
      )
    },
  },
  created() {
    this.changeActiveTabFromRouter()
    this.handleChangeCard()
  },
  methods: {
    async tryToFetchMerchant() {
      await this.$store.dispatch('merchant/fetchSingle')
    },
    changeActiveTabFromRouter() {
      if (this.$route.params.activeTab !== undefined)
        this.activeTab = this.$route.params.activeTab
    },
    handleChangeCard() {
      if (sessionStorage.getItem('merchant.tryToChangeCard') === null) return
      if (this.$route.params.routeFrom === 'newebpay-success') {
        this.$alert(
          '已經可以開始使用 iPetBooking 管理您的預約事業囉！',
          '付款方式已設定成功',
          {
            confirmButtonText: '確定',
            type: 'success',
            center: true,
          }
        )
      }
      if (this.$route.params.routeFrom === 'newebpay-fail') {
        this.$alert(
          '很可惜，因為種種因素我們無法成功取得您付款方式的授權，請重新再試。',
          '付款方式設定失敗',
          {
            confirmButtonText: '確定',
            type: 'error',
            center: true,
          }
        )
      }
      this.activeTab = 'subscription'
      sessionStorage.removeItem('merchant.tryToChangeCard')
    },
  },
}
</script>

<template>
  <Layout>
 <div :class="$style.page">
    <el-tabs v-model="activeTab" stretch type="border-card">
      <el-tab-pane
        v-for="(tab, index) in permittedTabList"
        :key="index"
        v-can:api="tab.actionName"
        :label="tab.label"
        :name="tab.alias"
        :setting-guide-title="tab.label"
        :setting-guide-intro="tab.description"
        lazy
      >
        <component
          :is="tab.component"
          v-if="tab.alias === activeTab"
          @update="tryToFetchMerchant"
        ></component>
      </el-tab-pane>
    </el-tabs>
 </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>
