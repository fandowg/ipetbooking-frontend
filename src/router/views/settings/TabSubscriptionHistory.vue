
<script>
import { groupById } from '@utils/normalize-data'

import { merchantComputed } from '@state/helpers'

export default {
  data() {
    return {
      historyList: [],
      filterMode: 'all',
      tryingToGetInvoice: false,
      getInvoiceForm: '',
    }
  },
  computed: {
    ...merchantComputed,
  },
  created() {
    this.tryToGetList()
  },
  methods: {
    async tryToGetList() {
      this.historyList = await this.$store.dispatch(
        'merchant/subscriptionHistory',
        this.filterMode
      )
    },
    formatPlanTitle(row) {
      return groupById(this.planList, 'plans')[row.planId].title
    },
    async tryToGetInvoice(historyId) {
      this.tryingToGetInvoice = true
      this.getInvoiceForm = await this.$store.dispatch(
        'merchant/fetchSingleInvoice',
        historyId
      )

      this.tryingToGetInvoice = false
      this.$nextTick(() => {
        this.$refs.invoiceForm.submit()
      })
    },
  },
}
</script>

<template>
  <div>
    <div class="right-radio" >
    <el-radio-group v-model="filterMode">
      <el-radio-button label="all">所有紀錄</el-radio-button>
      <el-radio-button label="halfyear">過去半年</el-radio-button>
      <el-radio-button label="year">過去一年</el-radio-button>
    </el-radio-group>
    </div>
    <el-table :data="historyList" style="width: 100%">
      <el-table-column label="付費日期" prop="created"></el-table-column>
      <el-table-column label="訂閱方案" prop="planId" :formatter="formatPlanTitle"></el-table-column>
      <el-table-column v-slot="{ row }" label="付款信用卡" min-width="100">
        <img :src="require(`@assets/images/card_icon_${row.cardType.toLowerCase()}.svg`)" alt />
        <div>{{ row.card}}</div>
      </el-table-column>
      <el-table-column label="總金額" prop="total"></el-table-column>
      <!-- <el-table-column v-slot="{ row }" label="電子發票">
        <el-tooltip effect="dark" content="點擊後將會於新分頁開啟 ezPay 電子發票網站" placement="right-start">
          <el-button type="text" @click="tryToGetInvoice(row.id)">
            <BaseIcon name="file-invoice" />
          </el-button>
        </el-tooltip>
      </el-table-column>-->
    </el-table>
    <form ref="invoiceForm" target="_blank" :action="getInvoiceForm.PostUrl" method="POST" hidden>
      <input v-for="(value, field) in getInvoiceForm" :key="field" :name="field" :value="value" />
    </form>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.toolbar {
  float: right;
}
</style>
