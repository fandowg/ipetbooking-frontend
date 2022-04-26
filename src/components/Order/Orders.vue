<script>
import lazyLoadComponent from '@router/lazyload-component'
import { orderPaymentMethodMap, genderFilter, taxTypeMap, carrierTypeMap } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
    Addition: () => lazyLoadComponent(import('@components/Order/Addition')),
    OrderForm: () => lazyLoadComponent(import('@components/OrderForm')),
    Info: () => lazyLoadComponent(import('@components/Order/Info')),
  },
  filters: {
    formatDate,
    genderFilter,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      orderPaymentMethodMap,
      drawerVisible: false,
      drawerOrderData: {},
      taxTypeMap,
      carrierTypeMap,
      refund: {
        total: 3999,
      },
      refundSubmitData: {
        refundDate: '',
        amount: '',
        note: '',
      },
      refundDialogVisible: false,
      isRefund: false,
      tryingRefund: false,
    }
  },
  computed: {
    isEmptyByOrderExtrafields() {
      return this.defaultValue.byOrderExtrafields instanceof Array
    },
    isPaidByPrepaid() {
      return this.defaultValue.paymentMethod === 'prepaid' && this.defaultValue.prepaid
    },
    paidAt() {
      if (!!this.defaultValue.paidAt === false) return '無'
      return formatDate(this.defaultValue.paidAt, 'dateTime')
    },
    paymentExpiredDate() {
      if (this.defaultValue.allowExpired === 1) return '無（可逾期付款）'
      return formatDate(this.defaultValue.paymentExpiredDate, 'dateTime')
    },
    canPartialRefund() {
      return this.defaultValue.canPartialRefund
      // let value = false
      // if (this.defaultValue.canPartialRefund !==undefined) {
      //   value = this.defaultValue.canPartialRefund
      // }
      // else{
      //   value=true
      // }
      // console.log(value)
      // return value
      // return false
    },
    refundRules() {
      return {
        refundDate: [
          {
            required: true,
            message: '請選擇日期',
            // trigger: 'change',
          },
        ],
        amount: [
          {
            required: true,
            message: '請輸入退款金額',
            // trigger: 'blur',
          },
          // {
          //   type: 'number',
          //   message: '請輸入數字',
          //   // trigger: 'blur',
          // },
        ],
      }
    },
  },
  created() {},
  methods: {
    handleDrawerClosed() {
      this.$refs.drawer.handleClose()
    },
    handleStore() {
      this.$emit('update')
      this.handleDrawerClosed()
    },
    handlerDrawerOpen() {
      this.drawerOrderData = cloneDeep(this.defaultValue)
      this.drawerVisible = true
    },
    openRefundDialog(){
     this.refundDialogVisible = true
     if(!this.canPartialRefund){
       this.refundSubmitData.amount=this.defaultValue.backBalance
     }
    },
    async tryToRefund(id) {
      await this.$refs.refundForm.validate()
      if (this.refundSubmitData.amount > this.defaultValue.backBalance) {
        this.$confirm('退款金額不能超過可退款金額', '提示', {
          confirmButtonText: '確定',
          showCancelButton: false,
          type: 'warning',
          center: true,
        })
        return
      }
      try {
        this.tryingRefund = true
        await this.$store.dispatch('order/refundOrder', {
          id,
          refundData: this.refundSubmitData,
        })
        this.$confirm('退款已完成', '提示', {
          confirmButtonText: '關閉',
          showCancelButton: false,
          type: 'warning',
          center: true,
        })
        this.$emit('update')
      } catch (error) {
        console.log('TCL: tryToCreateOrder -> error', error)
      } finally {
        this.tryingRefund = false
        this.isRefund = true
        this.refundDialogVisible = false
        // this.tryingStore = false
      }
    },
  },
}
</script>

<template>
  <div :class="$style.service">
    <BaseCollapse title="預約訂單" :order-theme="true" :expanded="true">
      <div :class="$style.params">
        <div :class="$style['params__item']">
          <div>訂購項目</div>
          <div>售價</div>
          <div>數量</div>
          <div v-if="!isPaidByPrepaid">小計</div>
        </div>
        <div v-for="param in defaultValue.params" :key="param.id" :class="$style['params__item']">
          <div>{{ param.title }}</div>
          <div class="Jost">{{ param.price }}</div>
          <div class="Jost">{{ `x${param.qty}` }}</div>
          <div v-if="!isPaidByPrepaid" class="Jost">{{ param.price * param.qty }}</div>
        </div>

        <template v-if="isPaidByPrepaid">
          <div :class="$style.total">
            <div :class="$style['total__item']">
              <div>使用方案</div>
              <div>{{ defaultValue.prepaid.title }}</div>
            </div>
            <div :class="$style['total__item']">
              <div>使用次數</div>
              <div class="Jost">{{ defaultValue.groupSize }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div :class="$style.total">
            <div :class="$style['total__item']">
              <div>小計</div>
              <div class="Jost">{{ defaultValue.priceBase }}</div>
            </div>
            <div v-if="defaultValue.hasOwnProperty('coupon')" :class="[$style['total__item'], $style['total__item--discount']]">
              <div>{{ `${defaultValue.coupon.title}（${defaultValue.coupon.code}）` }}</div>
              <div class="Jost">{{ `-${defaultValue.coupon.discountValue}` }}</div>
            </div>
            <template v-if="defaultValue.refundHistories.length > 0">
              <div v-for="(item, index) in defaultValue.refundHistories" :key="index" :class="$style['total__item']">
                <div class="alert-word">{{ item.refundDate }}退款</div>
                <div class="Jost alert-word">-{{ item.Amt }}</div>
              </div>
            </template>
          </div>
          <div :class="$style.total">
            <div :class="$style['total__item']">
              <div>付款金額</div>
              <div v-if="defaultValue.paidAt" class="Jost">{{ defaultValue.backBalance }}</div>
              <div v-if="!defaultValue.paidAt && defaultValue.status !== 0" class="Jost">{{ defaultValue.priceTotal }}</div>
              <div v-if="!defaultValue.paidAt && defaultValue.status === 0" class="Jost">0</div>
              <!-- <div v-if="defaultValue.paidAt" class="Jost">{{ defaultValue.backBalance }}</div>
              <div v-else class="Jost">0</div> -->
            </div>
          </div>
        </template>
      </div>
      <BaseCollapse title="付款資訊" :class="$style.payment">
        <ul style="padding: 0 25px; padding-bottom: 10px">
          <li
            ><span class="title">付款方式</span><span class="content">{{ orderPaymentMethodMap[defaultValue.paymentMethod] || '不指定' }}</span>
           <span v-if="defaultValue.prepaid"><span v-if="defaultValue.paymentMethod === 'Prepaid'" style="color: lightgray">（{{ defaultValue.prepaid.title }}）</span> </span>
          </li>
          <li v-if="defaultValue.paymentMethod === 'Prepaid' && defaultValue.prepaid"
            ><span class="title">抵扣次數</span><span class="content">{{ defaultValue.prepaid.deductTimes }} 次 </span></li
          >
          <li
            ><span class="title">付款時間</span><span class="content">{{ paidAt }}</span></li
          >
          <li v-if="defaultValue.paymentMethod !== 'Vacc' && defaultValue.paymentMethod !== 'Prepaid'"
            ><span class="title">付款期限</span><span class="content">{{ paymentExpiredDate }}</span></li
          >
          <template v-if="defaultValue.Vacc">
            <li style="border-top: 1px solid #dcdfe6"
              ><span class="title">轉帳銀行</span><span class="content">{{ `${defaultValue.Vacc.Bank} ${defaultValue.Vacc.BankCode}` }}</span></li
            >
            <li
              ><span class="title">轉帳帳號</span><span class="content">{{ defaultValue.Vacc.VACCNo }}</span></li
            >
            <li
              ><span class="title">轉帳期限</span><span class="content">{{ defaultValue.paymentExpiredDate | formatDate('dateTime') }}</span></li
            >
          </template>
        </ul>
      </BaseCollapse>

      <div class="btn-group-inline">
        <el-button v-if="defaultValue.status !== 0" type="primary" plain class="is-round is-fullwidth" style="margin-top: 24px" @click="handlerDrawerOpen">編輯訂單</el-button>
        <el-button v-if="defaultValue.paidAt && defaultValue.paymentMethod !== 'Prepaid' && defaultValue.backBalance !== 0" class="is-round" style="margin-top: 24px" @click="openRefundDialog">退款記錄</el-button>
      </div>
    </BaseCollapse>
    <!-- <BaseCollapse title="加購項目" :order-theme="true">
      <Addition :default-value="defaultValue" @update="$emit('update')"></Addition>
    </BaseCollapse> -->
    <BaseCollapse title="訂單變更紀錄" :order-theme="true">
      <el-timeline>
        <el-timeline-item v-for="log in defaultValue.history" :key="log.id" :timestamp="log.created | formatDate('dateTime')" type="primary" placement="top">
          {{ log.description }}
          <span style="font-size: 13px">
            <span v-if="log.creator">- {{ log.creator }}</span>
          </span>
          <div v-if="log.note">{{ log.note }}</div>
        </el-timeline-item>
      </el-timeline>
    </BaseCollapse>

    <!-- <template v-if="defaultValue.status === 6 && defaultValue.invoices.length > 0">
      <BaseCollapse title="發票資訊" :order-theme="true">
        <div v-for="(invoice, index) in defaultValue.invoices" :key="index" :class="$style.invoice">
          <div class="order-id Jost">{{ `${invoice.orderType === 'Order' ? '預約訂單' : '加購訂單'} #${invoice.orderId}` }}</div>
          <div class="info">
            <el-row :gutter="20">
              <el-col :span="12" :xs="24">
                <div class="info-item">
                  <span class="title">發票日期</span>
                  <span>{{ invoice.CreateTime | formatDate }}</span>
                </div>
                <div class="info-item">
                  <span class="title">發票號碼</span>
                  <span>{{ invoice.InvoiceNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="title">隨機碼</span>
                  <span>{{ invoice.RandomNum }}</span>
                </div>
              </el-col>
              <el-col :span="12" :xs="24">
                <div class="info-item">
                  <span class="title">發票形式</span>
                  <span>{{ taxTypeMap[invoice.taxType] }}</span>
                </div>
                <div v-if="invoice.taxType === 'B2C'" class="info-item">
                  <span class="title">載具類別</span>
                  <span>{{ carrierTypeMap[invoice.CarrierType] }}</span>
                </div>
                <div v-if="invoice.taxType === 'B2C' && ['0', '1'].includes(invoice.CarrierType)" :span="12" :xs="24" class="info-item">
                  <span class="title">載具編號</span>
                  <span>{{ invoice.CarrierNum }}</span>
                </div>
                <div v-if="invoice.taxType === 'B2B'" class="info-item">
                  <span class="title">統一編號</span>
                  <span>{{ invoice.taxId }}</span>
                </div>
                <div v-if="invoice.taxType === 'DONATE'" class="info-item">
                  <span class="title">捐贈碼</span>
                  <span>{{ invoice.LoveCode }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </BaseCollapse>
      <BaseCollapse title="簽名" :order-theme="true">
        <el-image :src="defaultValue.signature" :class="$style.image">
          <div slot="error"> 圖片載入失敗 </div>
        </el-image>
      </BaseCollapse>
    </template> -->

    <el-drawer ref="drawer" class="no-header" :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <el-page-header content="編輯訂單" @back="handleDrawerClosed"></el-page-header>
      <el-divider></el-divider>

      <Info :default-value="defaultValue"></Info>
      <OrderForm :default-value="drawerOrderData" @store="handleStore" @cancel="handleDrawerClosed" />
    </el-drawer>
    <el-dialog title="退款" :visible.sync="refundDialogVisible" top="0" append-to-body>
      <el-form ref="refundForm" :rules="refundRules" :model="refundSubmitData" class="el-form--floating" label-position="top">
        <el-form-item label="退款金額" prop="amount" style="margin-top: 20px">
          <el-input v-model="refundSubmitData.amount" :disabled="!canPartialRefund" placeholder=""><span slot="suffix" style="padding-right: 10px">元</span></el-input>
          <span class="alert-word">上限為{{ defaultValue.backBalance }}元</span>
        </el-form-item>
        <el-form-item label="退款日期" prop="refundDate">
          <el-date-picker v-model="refundSubmitData.refundDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="選擇日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="退款原因" style="margin-bottom: 20px">
          <el-input v-model="refundSubmitData.note" type="textarea" :autosize="{ minRows: 2 }" placeholder=""></el-input>
          <p>除「信用卡」付款之外，其他所有支付方式若需退款服務，皆須透過店家進行線下退款。</p>
        </el-form-item>
      </el-form>

      <div class="bottom-btn-center">
        <el-button class="is-round" @click="refundDialogVisible = false">取消</el-button>
        <el-button class="is-round" type="primary" @click="tryToRefund(defaultValue.id)">確認退款記錄</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.service {
  :global {
  }
}
.title:not(:first-child) {
  margin-top: 30px;
}
.info {
  padding-inline-start: 0;
  > li {
    padding: 5px 0;
  }
}
.question {
  padding-left: 24.2px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  :global {
    .title {
      margin-bottom: 10px;
      color: darkgray;
    }
  }
}
.params {
  padding: 5px 15px;
  font-size: 14px;
  line-height: 40px;
  background: white;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
  &__item {
    display: flex;
    justify-content: space-between;

    &:first-child {
      color: $color-text-placeholder;
    }
    > * {
      flex: 1;
      &:first-child {
        flex: 2;
      }
      &:not(:first-child) {
        text-align: right;
      }
    }
  }
}
.total {
  border-top: 1px solid $color-border-base;
  &__item {
    display: flex;
    justify-content: space-between;

    &--discount {
      color: $color-state-danger;
    }
    &:not(.total__item--discount) > *:first-child {
      color: $color-text-placeholder;
    }
  }
}
.payment {
  :global {
    li {
      line-height: 40px;
    }
    .title {
      margin-right: 20px;
      color: darkgray;
    }
  }
}
.invoice {
  :global {
    .order-id {
      font-size: 16px;
      letter-spacing: 1.6px;
      line-height: 18px;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .info {
      padding: 22.5px 20px;
      background: white;
      @include touch {
        border: 1px solid #c6c6ba;
      }
      .el-col {
        padding-top: 7.5px;
        padding-bottom: 7.5px;
      }
      .info-item {
        .title {
          width: 60px;
          display: inline-block;
          color: #919191;
          margin-right: 20px;
        }
        & + .info-item {
          margin-top: 15px;
        }
      }
    }
  }
  & + .invoice {
    margin-top: 40px;
  }
}
</style>
