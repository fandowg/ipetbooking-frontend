<script>
import lazyLoadComponent from '@router/lazyload-component'
import { forOwn } from 'lodash'

export default {
  page: {
    title: '商店設定',
    meta: [{ name: 'description', content: 'Notification' }],
  },
  components: {
    ListItem: () => lazyLoadComponent(import('./components/ListItem')),
  },
  tourName: 'merchantPlan',
  data() {
    return {
      recevie: '1',
      activeNames: [],
      merchantConfigs: {},
      mapItemName: {
        order_Cancel: '預約已取消',
        order_ChangeTime: '預約改期',
        order_Qrcode: '確認收款通知',
        order_CheckoutLink: '預約付款通知',
        order_Remind: '行前提醒通知',
        order_RequestDeduct: '訂單確認折抵通知',
        prepaid_Cancel: '包月方案訂單取消通知',
        prepaid_Qrcode: '包月方案購買完成通知',
        prepaid_CheckoutLink: '包月方案付款通知',
        member_SendPassword: '成功加入會員',
        orderAdd_CheckoutLink: '加購訂單付款通知',
        orderAdd_PaySuccess: '加購訂單購買完成通知',
        orderAdd_Cancel: '加購訂單取消通知',
      },
      tryingToFetchConfig: false,
    }
  },
  computed: {
    configData() {
      const configData = {}
      forOwn(this.merchantConfigs, (sendTypeData, sendType) => {
        forOwn(sendTypeData, (productTypeData, productType) => {
          forOwn(productTypeData, (itemTypeData, itemType) => {
            if (configData[`${productType}_${itemType}`] === undefined) configData[`${productType}_${itemType}`] = {}
            configData[`${productType}_${itemType}`][sendType] = itemTypeData
          })
        })
      })
      delete configData['prepaid_Remind']
      delete configData['member_SendPassword']
      // delete configData['order_Cancel']
      // delete configData['order_RequestDeduct']
      // delete configData['prepaid_Cancel']
      return configData
    },
  },
  created() {
    this.tryToFetchConfig()
  },
  methods: {
    changeMode(mode) {
      this.mode = mode
    },
    async tryToFetchConfig() {
      this.tryingToFetchConfig = true
      let config = await this.$store.dispatch('merchant/fetchConfig')
      if(config.email.coupon){
        delete config.email.coupon
      }
      if(config.sms.coupon){
        delete config.sms.coupon
      }
      this.merchantConfigs = config
      this.tryingToFetchConfig = false
    },
    async tryToStoreConfig(config, callback) {
      const submitData = {
        name: this.$store.state.merchant.cached.name,
        merchantConfig: {
          notification: {
            ...config,
          },
        },
      }
      await this.$store.dispatch('merchant/store', submitData)
      this.$message({
        message: '儲存成功！',
        type: 'success',
      })
      callback()
    },
  },
}
</script>

<template>
  <div v-loading="tryingToFetchConfig" :class="$style.notification" element-loading-text="取得資訊中">
    <div v-if="tryingToFetchConfig" style="height: 40vh;"></div>
    <el-collapse v-model="activeNames" style="margin-bottom: 20px; padding: 0 20px; border: none;">
      <el-collapse-item v-for="(data, index) in configData" :key="`config-${index}`" :title="mapItemName[index]" :name="index">
        <ListItem :item-name="index" :default-value="data" @save="tryToStoreConfig"></ListItem>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style lang="scss" module>
.notification {
  :global {
    .el-collapse-item__header {
      font-size: 18px;
      height: 60px;
    }
    .el-collapse-item__wrap {
      padding: 0 10px;
    }
  }
}
</style>
