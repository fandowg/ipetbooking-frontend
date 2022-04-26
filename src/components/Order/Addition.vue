<script>
import lazyLoadComponent from '@router/lazyload-component'
import { orderStatusFilter, orderPaymentMethodMap } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

export default {
  components: {
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
    AdditionForm: () => lazyLoadComponent(import('@components/Order/AdditionForm')),
    AdditionEditForm: () => lazyLoadComponent(import('@components/Order/AdditionEditForm')),
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {
    formatDate,
    orderStatusFilter,
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
      mode: 'add',
      drawerVisible: false,
      drawerOrderData: {},
      refund: {
        total: 3999,
      },
      refundSubmitData: {
        refundDate: '',
        amount: '',
        note: '',
      },
      refundDialogVisible: false,
      isRefund: true,
      tryingRefund: false,
      selectedOrder: {
        id: '',
        backBalance: 0,
      },
      canPartialRefund: true,
    }
  },
  computed: {
    isEditMode() {
      return this.mode === 'edit'
    },
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
    showCreateBtn() {
      return ![0, 5, 6].includes(this.defaultValue.status)
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
    // canPartialRefund() {
    //   let value = false
    //   if (this.defaultValue.canPartialRefund !== undefined) {
    //     value = this.defaultValue.canPartialRefund
    //   }
    //   else{
    //     value=true
    //   }
    //   return value
    //   // return false
    // },
  },
  created() {},
  mounted() {
    this.scrollToTop()
  },
  methods: {
    scrollToTop() {
      if (window.innerWidth < 481) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.drawer.$el.querySelector('.el-drawer').scrollTop = 150

            // console.log(this.$refs.drawer.$el.querySelector('.el-drawer').scrollTop)
          }, 200)
        })
      }
    },
    updateMode(value) {
      this.mode = value
    },
    handleDrawerClosed() {
      this.$refs.drawer.handleClose()
    },
    updateDefaultValue() {
      this.$emit('update')
      this.handleDrawerClosed()
    },
    paidAt(order) {
      if (!!order.paidAt === false) return '無'
      return formatDate(order.paidAt, 'dateTime')
    },
    paymentExpiredDate(order) {
      if (order.allowExpired === 1) return '無（可逾期付款）'
      return formatDate(order.paymentExpiredDate, 'dateTime')
    },
    showCreateOrder() {
      this.updateMode('add')
      this.drawerVisible = true
    },
    showEditOrder(order) {
      this.updateMode('edit')
      this.drawerOrderData = order
      this.drawerVisible = true
    },
    showEditRefund(order) {
      this.refundDialogVisible = true
      this.selectedOrder = { ...order }
      // console.log(124,this.selectedOrder.canPartialRefund)
      if (this.selectedOrder.canPartialRefund !== undefined && !this.selectedOrder.canPartialRefund) {
        this.canPartialRefund = false
        this.refundSubmitData.amount = this.selectedOrder.backBalance
        //  console.log(456,this.canPartialRefund)
      }
      //  console.log(this.canPartialRefund)
    },
    // tryToRefund() {
    //   this.isRefund = true
    //   this.refundDialogVisible = false
    // },
    async tryToRefund() {
      await this.$refs.refundForm.validate()
      if (this.refundSubmitData.amount > this.selectedOrder.backBalance) {
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
          id: this.selectedOrder.id,
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
  <div :class="$style.addition">
    <div v-if="defaultValue.addOrders.length === 0" style="margin-bottom: 50px">目前無加購訂單</div>
    <div v-for="(order, index) in defaultValue.addOrders" :key="index" class="sub-order">
      <div class="order-id Jost">#{{ order.id }}</div>
      <div :class="$style.params">
        <div :class="$style['params__item']">
          <div>加購項目</div>
          <div>訂單狀態</div>
          <div>金額</div>
        </div>
        <div v-for="(item, itemIndex) in order.addItems" :key="itemIndex" :class="$style['params__item']">
          <div>{{ item.title }}</div>
          <div class="Jost">
            <BaseStateLabel :state="item.status | orderStatusFilter('color')" text>{{ item.status | orderStatusFilter('text') }}</BaseStateLabel>
          </div>
          <div class="Jost">{{ item.price }}</div>
        </div>

        <div :class="$style.total">
          <div :class="$style['total__item']">
            <div>小計</div>
            <div class="Jost">{{ order.total }}</div>
          </div>
          <template v-for="(item, itemIndex) in order.addItems">
            <div v-if="item.status === 0 && !order.paidAt" :key="itemIndex" :class="$style['params__item']">
              <div>{{ item.title }}{{ item.status | orderStatusFilter('text') }}</div>
              <div class="Jost">
                <!-- {{ `-${item.price}` }} -->
                </div>
            </div>
          </template>
          <!-- <div v-if="isRefund" :class="$style['total__item']">
            <div class="alert-word">6/29退款</div>
            <div class="Jost alert-word">-200</div>
          </div> -->
          <template v-if="order.refundHistories.length > 0">
            <div v-for="(item, refundindex) in order.refundHistories" :key="refundindex" :class="$style['total__item']">
              <div class="alert-word">{{ item.refundDate }}退款</div>
              <div class="Jost alert-word">-{{ item.Amt }}</div>
            </div>
          </template>
        </div>
        <div :class="$style.total">
          <div :class="$style['total__item']">
            <div>總計</div>
            <div v-if="order.paidAt" class="Jost">{{ order.backBalance }}</div>
            <div v-if="!order.paidAt && order.status !== 0" class="Jost">{{ order.total }}</div>
            <!-- <div v-if="order.refundHistories.length === 0 && order.status !== 0" class="Jost">{{ order.payTotal }}</div> -->
            <div v-if="!order.paidAt && order.status === 0" class="Jost">{{ order.total }}</div>
          </div>
          <div v-if="order.unpaidTotal !== 0" :class="[$style['total__item'], $style['total__item--discount']]">
            <div>未付款金額</div>
            <div class="Jost">{{ order.unpaidTotal }}</div>
          </div>
        </div>
      </div>
      <BaseCollapse title="付款資訊" :class="$style.payment">
        <ul style="padding: 0 25px; padding-bottom: 10px">
          <li
            ><span class="title">付款方式</span><span class="content">{{ orderPaymentMethodMap[order.paymentMethod] || '不指定' }}</span>
          </li>
          <li
            ><span class="title">付款時間</span><span class="content">{{ paidAt(order) }}</span></li
          >
          <li v-if="order.paymentMethod !== 'Vacc'"
            ><span class="title">付款期限</span><span class="content">{{ paymentExpiredDate(order) }}</span></li
          >
          <template v-if="order.Vacc">
            <li style="border-top: 1px solid #dcdfe6"
              ><span class="title">轉帳銀行</span><span class="content">{{ `${order.Vacc.Bank} ${order.Vacc.BankCode}` }}</span></li
            >
            <li
              ><span class="title">轉帳帳號</span><span class="content">{{ order.Vacc.VACCNo }}</span></li
            >
            <li
              ><span class="title">轉帳期限</span><span class="content">{{ order.paymentExpiredDate | formatDate('dateTime') }}</span></li
            >
          </template>
        </ul>
      </BaseCollapse>
      <div class="btn-group-inline">
        <el-button v-if="order.status !== 0" class="is-round is-fullwidth" @click="showEditOrder(order)">編輯加購訂單</el-button>
        <el-button v-if="order.status !== 2 && order.paidAt && order.backBalance !== 0" class="is-round" style="margin-top: 24px" @click="showEditRefund(order)">退款記錄</el-button>
      </div>
    </div>

    <el-button v-if="showCreateBtn" class="is-round is-fullwidth" type="primary" @click="showCreateOrder">加購</el-button>

    <el-drawer ref="drawer" class="no-header mobile" :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close @closed="handleDrawerClosed">
      <el-page-header :content="isEditMode ? '編輯加購訂單' : '加購'" @back="handleDrawerClosed"></el-page-header>
      <el-divider></el-divider>
      <AdditionForm v-if="!isEditMode" :default-value.sync="defaultValue" @update="updateDefaultValue" @close="handleDrawerClosed" @scrollToTop="scrollToTop" />
      <AdditionEditForm
        v-else
        :store-cashflow-setting="defaultValue.storeCashflowSetting"
        :default-value="drawerOrderData"
        :booking-order="defaultValue"
        @update="updateDefaultValue"
        @close="handleDrawerClosed"
      />
    </el-drawer>
    <el-dialog title="退款" :visible.sync="refundDialogVisible" top="0" append-to-body>
      <el-form ref="refundForm" :rules="refundRules" :model="refundSubmitData" class="el-form--floating" label-position="top">
        <el-form-item label="退款金額" prop="amount" style="margin-top: 20px">
          <el-input v-model="refundSubmitData.amount" :disabled="!canPartialRefund" placeholder=""><span slot="suffix" style="padding-right: 10px">元</span></el-input>
          <span class="alert-word">上限為{{ selectedOrder.backBalance }}元</span>
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
        <el-button class="is-round" type="primary" @click="tryToRefund">確認退款記錄</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.addition {
  :global {
    .el-divider {
      display: none;
    }
    .sub-order {
      margin-bottom: 36px;
      .order-id {
        font-size: 16px;
        letter-spacing: 1.6px;
        line-height: 18px;
        margin-bottom: 20px;
        font-weight: 500;
      }
      .el-button {
        margin-top: 24px;
        margin-bottom: 12.5px;
        @include touch {
          color: $color-dark-primary;
          border-color: $color-primary;
        }
      }
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
@include touch {
  .params,
  .payment {
    border: 1px solid #c6c6ba;
  }
}
</style>
