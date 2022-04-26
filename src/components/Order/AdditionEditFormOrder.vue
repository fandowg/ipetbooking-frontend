<script>
import lazyLoadComponent from '@router/lazyload-component'
import cloneDeep from 'lodash/cloneDeep'
import formatDate from '@utils/format-date'
import { differenceInDays } from 'date-fns'
import { authComputed } from '@state/helpers'
import scrollToElement from '@utils/scroll-to-element'

const initData = (defaultValue) => {
  const { id, orderId, paymentMethod, addItems } = cloneDeep(defaultValue)
  return {
    id,
    orderId,
    paymentMethod,
    addItems: addItems.map((item) => ({
      ...item,
      defaultStatus: item.status,
    })),
  }
}

export default {
  components: {
    Info: () => lazyLoadComponent(import('@components/Order/Info')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    bookingOrder: {
      type: Object,
      default: () => {},
    },
    storeCashflowSetting: {
      type: Number,
      default: 1,
    },
    scheduleDetail: {
      type: Object,
      required: true,
    },
    schedules:{
      type: Array,
      default: () => [],
    },
    petSizeId:{
      type: Number,
      default:0
    }
  },
  data() {
    return {
      submitData: initData(this.defaultValue),
      tryingToStoreOrder: false,
      bankTypeList: [{ id: 'BOT', title: '台灣銀行' }, { id: 'Taishin', title: '台新' }, { id: 'HNCB', title: '華南' }],
    }
  },
  computed: {
    ...authComputed,
    submitRules() {
      return {
        bankType: [{ required: this.isRequiredBankType, message: '請選擇轉帳銀行' }],
      }
    },
    hasUnpaidItem() {
      return this.defaultValue.addItems.some((item) => item.status === 2)
    },
    filterSubmitData() {
      const addItems = this.submitData.addItems.map((item) => ({
        id: item.id,
        status: item.status,
      }))
      return {
        ...this.submitData,
        addItems,
      }
    },
    isPaid() {
      return this.defaultValue.status === 1
    },
    isPaidByCredit() {
      return this.defaultValue.paymentMethod === 'Credit'
    },
    fullRefundOnly() {
      return this.isPaid && this.isPaidByCredit && this.defaultValue.canRefund === 1 && this.defaultValue.canPartialRefund === 0
    },
    isHomeService() {
      return this.bookingOrder.storeType === 'home'
    },
    isEmployee() {
      // console.log(this.currentUser)
      return !!this.currentUser.scheduleItemId
      // return this.currentUserRoutes.includes('employee-calendar')
    },
    showVacc() {
      const bookingDate = new Date(formatDate(new Date(this.bookingOrder.date)))
      const today = new Date(formatDate(new Date()))
      // 虛擬帳戶付款距離預約日要大於1天
      return differenceInDays(bookingDate, today) > 1
    },
    isRequiredBankType() {
      return this.submitData.paymentMethod === 'Vacc'
    },
    disabledPayment() {
      return this.defaultValue.status === 1 || (this.isEmployee && this.isHomeService && !this.showVacc)
    },
  },
  methods: {
    handleStoreOrder() {
      this.$refs.form.validate((valid) => {
        if (valid) this.tryToStoreOrder()
        else
          this.$nextTick(() => {
            scrollToElement(this.$refs.form.$el.querySelector('.el-form-item__error'), 182)
          })
      })
    },
    async tryToStoreOrder() {
      this.tryingToStoreOrder = true
      try {
        await this.$store.dispatch('order/storeAdditionalOrder', this.filterSubmitData)
      } finally {
        this.tryingToStoreOrder = false
      }

      this.$emit('update')
    },
    updateOrderStatus(status) {
      this.submitData.addItems.forEach((item) => {
        if (item.defaultStatus !== 0) item.status = status
      })
    },
    onChangePayment(payment) {
      if (['Credit', 'Vacc'].includes(payment)) this.resetItemsStatus()
    },
    resetItemsStatus() {
      const { addItems } = cloneDeep(this.defaultValue)
      this.submitData = {
        ...this.submitData,
        addItems: addItems.map((item) => ({
          ...item,
          defaultStatus: item.status,
        })),
      }
    },
  },
}
</script>

<template>
  <div :class="$style['edit-addition']">
    <Info class="order-info" :default-value="bookingOrder"></Info>
    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
      <div class="order-id Jost">加購訂單 #{{ defaultValue.id }}</div>
      <el-alert v-if="fullRefundOnly" title="信用卡公司尚未請款完成，目前只允許整筆退款！" type="warning" show-icon :closable="false"></el-alert>
      <el-form-item label="付款方式">
        <el-select v-model="submitData.paymentMethod" class="is-round is-border" :disabled="disabledPayment" @change="onChangePayment">
          <el-option :value="null" label="不指定" :disabled="isEmployee && isHomeService"></el-option>
          <el-option value="Cash" label="到店付款(現金)" :disabled="isEmployee || isHomeService"></el-option>
          <el-option value="Atm" label="線下匯款" ></el-option>
          <el-option value="StoreCredit" label="現場刷卡" :disabled="isEmployee || isHomeService"></el-option>
          <el-option v-if=" storeCashflowSetting === 1" value="Credit" label="信用卡付款"></el-option>
          <el-option v-if=" storeCashflowSetting !== 0" value="Vacc" label="ATM虛擬帳戶"  border></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="defaultValue.paymentMethod !== 'Vacc' && submitData.paymentMethod === 'Vacc'" prop="bankType" label="轉帳銀行">
        <el-select v-model="submitData.bankType" class="is-round is-border">
          <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
        </el-select>
      </el-form-item>
      <el-row :gutter="20">
        <el-col v-if="hasUnpaidItem && !['Credit', 'Vacc'].includes(submitData.paymentMethod) && !(isHomeService && isEmployee)" :span="12">
          <el-button class="is-round is-fullwidth paid" type="primary" @click="updateOrderStatus(1)">整筆訂單已付款</el-button>
        </el-col>
        <el-col :span="hasUnpaidItem && !['Credit', 'Vacc'].includes(submitData.paymentMethod) && !(isHomeService && isEmployee) ? 12 : 24">
          <el-button class="is-round is-fullwidth" type="danger" @click="updateOrderStatus(0)">取消此筆訂單</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <div class="item-wrapper">
        <div class="item header">
          <div>加購項目</div>
          <div>訂單狀態</div>
          <div>金額</div>
        </div>
        <div v-for="(item, index) in defaultValue.addItems" :key="`item-${index}`" class="item">
          <div>{{ item.title }}</div>
          <div class="status">
            <el-select v-model="submitData.addItems[index].status" class="is-round is-border" placeholder="訂單狀態" :disabled="item.status === 0 || fullRefundOnly">
              <el-option :value="0" label="已取消"></el-option>
              <el-option v-if="item.status !== 1" :value="2" label="未付款"></el-option>
              <el-option v-if="item.status !== 0" :value="1" label="已付款" disabled></el-option>
            </el-select>
          </div>
          <div class="Jost">${{ item.price }}</div>
        </div>
      </div>
    </el-form>
    <el-row :gutter="20" class="footer" style="margin-top: 32px;">
      <el-col :span="12" :xs="24">
        <el-button class="is-round is-fullwidth" @click="$emit('close')">取消編輯</el-button>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-button :loading="tryingToStoreOrder" class="is-round is-fullwidth" type="primary" @click="handleStoreOrder">儲存變更</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.edit-addition {
  :global {
    .order-info {
      @include touch {
        display: none;
      }
    }
    .el-form {
      margin-top: 30px;
      padding: 30px 25px;
      background-color: white;
      @include touch {
        padding-left: 0;
        padding-right: 0;
        margin-top: 0;
      }
      .order-id {
        font-size: 16px;
        line-height: 18px;
        letter-spacing: 1.6px;
        font-weight: 500;
        margin-bottom: 30px;
      }
      .el-button.paid {
        background-color: $color-state-success;
      }
      .item-wrapper {
        @include touch {
          border: 1px solid #c6c6ba;
        }
        .item {
          display: flex;
          padding: 12px 0;
          @include touch {
            flex-wrap: wrap;
            padding: 30px 20px;
            &:not(.header) + .item {
              padding-top: 0;
              &::before {
                content: '';
                border-top: 1px dashed #c6c6ba;
                height: 1px;
                width: 100%;
                padding: 0 20px;
                margin-bottom: 30px;
              }
            }
          }
          > div {
            flex: 1;
            display: flex;
            align-items: center;
            &:first-child {
              flex: 2;
            }
            &:last-child {
              justify-content: flex-end;
            }
            @include touch {
              color: $color-dark-primary;
            }
          }
          @include touch {
            .status {
              order: 3;
              flex-basis: 100%;
              margin-top: 25px;
              flex-wrap: wrap;
              &:before {
                content: '訂單狀態';
                display: block;
                color: #3f3a2e;
                margin-bottom: 10px;
              }
            }
          }

          &.header {
            padding: 0;
            height: 44px;
            line-height: 44px;
            color: #919191;
            @include touch {
              display: none;
            }
          }
        }
      }
    }
    @include touch {
      .footer {
        display: flex;
        flex-direction: column-reverse;
        .el-col + .el-col {
          margin-bottom: 10px;
        }
      }
    }
  }
}
.payment-methods {
  :global {
    .el-radio {
      margin: 5px !important;
    }
  }
}
</style>
