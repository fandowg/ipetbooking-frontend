<script>
const formatUnitText = function(unit) {
  return unit === '%' ? '%' : '元'
}
const calculateValue = function(number, unit, total) {
  return `${unit === '%' ? convertPercentToValue(number, total) : number}`
}
const convertPercentToValue = function(percentage, total) {
  return Math.round((total * percentage) / 100) || 0
}

export default {
  filters: {
    formatUnitText,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      required: true,
    },
    prepaidOrder:{
      type: Object,
      default:()=>{}
    },
    paidMode: {
      type: Boolean,
      default: false,
    },
    isNotPayPrepaid:{
      type: Boolean,
      default: false,
    },
    prepaidOrderUuid:{
      type:String,
      default:''
    }
  },

  data() {
    return {
      tryingCancel: false,
      submitData: {
        note: '',
        refundUnit: '%', // 不會送給後端
        refundNumber: '', // 不會送給後端
      },
    }
  },
  computed: {
    dialogTitle() {
      // 0: 授權成功，剛刷完卡，只可以整筆退款
      // 1: 請款提送中、請款中，都不可以退款
      // 2: 請款完成＋未退款，可以選擇退款比例
      // 3: 拿不到單筆交易紀錄、交易紀錄取得失敗、付款未成功、請款完成＋退款提送中or退款中or退款完成
      const newebpayStatusMap = {
        0: '確定取消此訂單及授權？',
        1: '此筆訂單尚在金流請款中',
        2: '確定取消此筆訂單？',
        3: '取消訂單時產生非預期之錯誤',
      }
      return this.isPaidStatus
        ? '將訂單狀態改為已付款'
        : newebpayStatusMap[this.newebpayStatus] || `確定取消此筆 ${this.order.orderNo ? this.order.orderNo : this.order.id} 訂單？`
    },
    refundNumberMax() {
      return this.isRefundPercentage ? 100 : this.order.priceTotal
    },
    refundValue() {
      return calculateValue(
        this.submitData.refundNumber,
        this.submitData.refundUnit,
        this.order.priceTotal
      )
    },
    newebpayStatus() {
      return this.order.newebpayStatus
    },
    isPaidStatus() {
      let status = false
      if(this.prepaidOrder){
        status =this.order.status !==0 && this.prepaidOrder.status === 1 || this.order.paymentStatus === 'PAID' || this.order.status === 1 
      }else{
        status =this.order.status !==0 && this.order.paymentStatus === 'PAID' || this.order.status === 1
      }
      return status
    },
    isPaidByCreditCard() {
      return this.order.paymentMethod === 'Credit'
    },
    canOnlineRefund() {
      return this.order.refund === 1
    },
    isRefundPercentage() {
      return this.submitData.refundUnit === '%'
    },
    isPrepaidOrder() {
      return this.order.hasOwnProperty('prepaidTitle')
    },
    submitRules() {
      return {
        refundUnit: [
          {
            required: this.canOnlineRefund,
            message: '請選擇退款種類',
            trigger: 'change',
          },
        ],
        refundNumber: [
          {
            required: this.canOnlineRefund,
            message: '請輸入退款金額',
            trigger: 'change',
          },
          {
            type: 'number',
            min: 0,
            max: this.refundNumberMax,
            message: `請輸入小於 ${this.refundNumberMax} 之數字`,
          },
        ],
      }
    },
  },
  watch: {
    newebpayStatus: {
      handler(value) {
        if (value === 0) this.submitData.refundNumber = 100
      },
      immediate: true,
    },
  },
  created() {
    // console.log(this.order.id)
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    emitPaid() {
      this.$emit('paid', this.submitData.note)
      this.handleClose()
    },
    emitCancelled() {
      this.$emit('cancelled')
      this.handleClose()
    },

    async tryToCancel() {
      const CANCEL_API_URL = this.isPrepaidOrder
        ? 'prepaid/cancelOrder'
        : 'order/cancel'

      this.tryingCancel = true
      try {
        await this.$store.dispatch(CANCEL_API_URL, {
          orderId: this.order.id,
          cancelData: {
            ...this.submitData,
            refundValue: this.refundValue,
          },
        })

        this.$message({
          message: '取消成功！',
          type: 'success',
        })

        this.emitCancelled()
      } catch (error) {
        console.log('TCL: tryToCancel -> error', error)
      } finally {
        this.tryingCancel = false
      }
    },

    handleCancel() {
      // const ORDER_NUMBER = this.isPrepaidOrder
      //   ? this.order.orderNo
      //   : this.order.id
      // const confirmMassage = {
      //   title: `您將取消訂單 ${ORDER_NUMBER}`,
      //   content: this.canOnlineRefund
      //     ? `確認取消此筆訂單？`
      //     : '確認取消此筆訂單？',
      // }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.tryToCancel()
          // this.$confirm(confirmMassage.content, confirmMassage.title, {
          //   confirmButtonText: '確定',
          //   cancelButtonText: '取消',
          //   type: 'warning',
          //   closeOnClickModal: false,
          //   center: true,
          // }).then(() => {
          //   this.tryToCancel()
          // })
        }
      })
    },
    goToPrepaidOrder(id) {
        this.$router.push({
          name: 'orders',
          query: {
            type: 'prepaidOrder',
            id,
          },
        })
    },
  },
}
</script>
<template>
  <el-dialog
  
    :visible="visible"
    :show-close="false"
    top="0"
    append-to-body
  >
  
  <h5 slot="title" style="margin-bottom:0">
    <i class="el-icon-warning" style="font-size:24px;margin-bottom:15px;color:#E2B550"></i><br>
    {{dialogTitle}}</h5>
    <el-form
      ref="form"
      :model="submitData"
      :rules="submitRules"
      class="el-form-item--normal-margin"
    >
    <template  v-if="isPaidStatus">
      <template v-if="isNotPayPrepaid ">
      
      <p style="margin-top:0;text-align: center;">抵用的包月方案 <span class="alert-text">尚未付款</span>。<br>請問是否要將此筆訂單的狀態修改為【已付款】？</p>
      <el-form-item prop="note" label="">
        <el-input
          v-model="submitData.note"
          type="textarea"
          :rows="2"
          placeholder="請輸入付款備註"
        ></el-input>
      </el-form-item>
      </template>
    
    <template v-if="!isNotPayPrepaid ">
      <el-form-item  prop="note" label="付款備註">
        <el-input
          v-model="submitData.note"
          type="textarea"
          :rows="2"
          placeholder="請輸入付款備註"
        ></el-input>
      </el-form-item>
    </template>

      </template>

      <template v-if="!isPaidStatus">
        <template v-if="isPaidByCreditCard">
          <el-alert
            v-if="!canOnlineRefund"
            title="此訂單非線上付款，請自行處理退款事宜。"
            type="warning"
            :closable="false"
          ></el-alert>
          <template v-else>
            <el-alert
              v-if="newebpayStatus === 0"
              title="此訂單目前授權成功但尚未正式扣款，僅能整筆退款，無法部分退款。"
              type="error"
              :closable="false"
            ></el-alert>
            <el-alert
              v-if="newebpayStatus === 1"
              title="此訂單目前金流尚在請款流程中，暫無法取消訂單，請稍後再試。"
              type="error"
              :closable="false"
            ></el-alert>
            <el-alert
              v-if="newebpayStatus === 3"
              title="產生非預期之錯誤，請通知我們。"
              type="error"
              :closable="false"
            ></el-alert>
            <template v-if="newebpayStatus === 2">
              <small
                >退訂單的
                20％，退款種類請選「訂單總金額的百分比（％）」，退款百分比請輸入「20」。</small
              >
              <br />
              <small
                >退 150
                元，退款種類請選「指定金額」，退款金額請輸入「150」。</small
              >
              <el-form-item prop="refundUnit" label="退款種類">
                <el-select v-model="submitData.refundUnit">
                  <el-option
                    label="訂單總金額的百分比（％）"
                    value="%"
                  ></el-option>
                  <el-option label="指定金額" value="fixed"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                prop="refundNumber"
                :label="`退款${isRefundPercentage ? '百分比' : '金額'}`"
              >
                <small>訂單金額 {{ order.priceTotal }} 元</small>
                <el-input
                  v-model.number="submitData.refundNumber"
                  min="0"
                  placeholder="請輸入退款金額"
                >
                  <template v-slot:append>{{
                    submitData.refundUnit | formatUnitText
                  }}</template>
                </el-input>
                <small v-if="isRefundPercentage && submitData.refundNumber >= 0"
                  >經四捨五入計算，將會退 {{ refundValue }} 元給客戶</small
                >
              </el-form-item>
            </template>
          </template>
        </template>
        <el-form-item
          v-if="newebpayStatus !== 1 || newebpayStatus !== 3"
          prop="note"
          label="僅作取消訂單說明使用；若有退款請另行操作[退款紀錄]"
        >
          <el-input
            v-model="submitData.note"
            type="textarea"
            :rows="2"
            placeholder="請輸入取消原因"
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">放棄</el-button>
       <el-button
        v-if="isNotPayPrepaid && isPaidStatus"
        @click="goToPrepaidOrder(prepaidOrderUuid)"
        >查看包月方案</el-button
      >
      <el-button
        v-if="newebpayStatus === 1 || newebpayStatus === 3"
        type="primary"
        @click="handleClose"
        >關閉</el-button
      >
     
      <el-button
        v-else
        type="primary"
        :loading="tryingCancel"
        v-on="{ click: isPaidStatus ? emitPaid : handleCancel }"
        >確定</el-button
      >
    </span>
  </el-dialog>
</template>
