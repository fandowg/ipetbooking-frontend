<script>
import lazyLoadComponent from '@router/lazyload-component'

import { genderFilter, orderStatusFilter, orderSourceFilter, prepaidOrderStatusFilter, orderPaymentMethodMap } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import { PortalTarget, Portal } from 'portal-vue'

export default {
  name: 'PrepaidOrderDetail',
  components: {
    Portal,
    PortalTarget,
    BaseButton: () => lazyLoadComponent(import('@components/BaseButton')),
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
    OrderForm: () => lazyLoadComponent(import('@components/PrepaidOrderForm')),
    OrderChangeStatusDialog: () => lazyLoadComponent(import('@components/OrderChangeStatusDialog')),
    OrderMemberDialog: () => lazyLoadComponent(import('@components/OrderMemberDialog')),
    OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
  },
  filters: {
    orderStatusFilter,
    prepaidOrderStatusFilter,
    genderFilter,
    orderSourceFilter,
    formatDate,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    drawerVisibleDetail :{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      mode: 'view', // view 檢視、edit 編輯
      shareDialogVisible: false,
      cancelDialogVisible: false,
      memberDialogVisible: false,
      tryingSendEmail: false,
      tryingSendSMS: false,
      shareLink: '',
      mapStatusName: {
        1: '訂單資訊',
        2: '付款',
        3: '訂單資訊',
      },
      showCancelDeductOrder: false,
      drawerVisible: false,
      drawerOrderData: '',
      relatedChat: [],
      orderPaymentMethodMap,
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
    isPaid() {
      return this.defaultValue.status === 1
    },
    filterDeductOrders() {
      const deductedStatus = [1,2, 3, 4, 5, 6]
      return this.showCancelDeductOrder ? this.defaultValue.deductOrders : this.defaultValue.deductOrders.filter((order) => deductedStatus.includes(order.status))
    },
    paidAt() {
      if (!!this.defaultValue.paidAt === false) return '無'
      return formatDate(this.defaultValue.paidAt, 'dateTime')
    },
    paymentExpiredDate() {
      if (this.defaultValue.allowExpired === 1) return '無（可逾期付款）'
      return formatDate(this.defaultValue.paymentExpiredDate, 'dateTime')
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
    sendTitle(){
      let title =''
      switch (this.defaultValue.status) {
        case 1:
          title='訂單'
          break;
        case 2:
          title='付款'
          break;
    
      }
      return title
    }
  },
  watch:{
    drawerVisibleDetail(value){
      setTimeout(()=>{
        if(!value){
          this.mode='view'
        }
      },200)
      
    }
  },
  destroyed() {
  },
  created() {
    // console.log(333)
  },
  methods: {
    formatDate,
    updateMode(value) {
      this.mode = value
    },
    async tryToGetOrder(orderId) {
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
      this.drawerVisible = true
    },
    async handleStore() {
      const updatedValue = await this.$store.dispatch('prepaid/fetchOrderSingle', this.defaultValue.id)
      this.$emit('update:defaultValue', updatedValue)
      this.$emit('update')
      this.updateMode('view')
    },
    async tryToSendEmailOrSMS(router) {
      router === 'email' ? (this.tryingSendEmail = true) : (this.tryingSendSMS = true)
      try {
        await this.$store.dispatch('prepaid/sendLink', {
          orderId: this.defaultValue.id,
          router,
        })
        this.$alert(`已發送${this.sendTitle}連結至 ${router}`, `${router} 發送成功！`, {
          confirmButtonText: '確認',
          center: true,
          callback: () => {
            router === 'email' ? (this.tryingSendEmail = false) : (this.tryingSendSMS = false)
          },
        })
      } catch (error) {
        router === 'email' ? (this.tryingSendEmail = false) : (this.tryingSendSMS = false)
      }
    },
    async tryToGetShareLink() {
      this.shareLink = await this.$store.dispatch('order/getLink', this.defaultValue.id)
    },
    tryToSendSMS() {
      this.tryToSendEmailOrSMS('sms')
    },
    tryToSendEmail() {
      this.tryToSendEmailOrSMS('email')
    },
    handleCommand(command) {
      this[command]()
    },
    showCancelDialog() {
      this.cancelDialogVisible = true
    },
    showMemberDialog() {
      this.memberDialogVisible = true
    },
    showShareDialog() {
      this.shareDialogVisible = true
    },
    copyShareLink() {
      const ghostInput = document.createElement('INPUT')
      document.body.appendChild(ghostInput)
      ghostInput.setAttribute('value', this.shareLink)
      ghostInput.select()
      document.execCommand('copy')
      document.body.removeChild(ghostInput)
      this.$message('連結複製成功')
    },
    handleShareLink(platform) {
      // <!-- <a href=”fb-messenger://share/?link= https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=123456789”>Send In Messenger</a> -->
      const platformLinkMap = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${this.shareLink}`,
        line: `https://social-plugins.line.me/lineit/share?url=${this.shareLink}`,
      }
      window.open(platformLinkMap[platform], '_blank')
    },
    async tryToFetchChat() {
      const orderInfo = this.defaultValue
      this.relatedChat = await this.$store.dispatch('member/fetchOrderRelatedChat', {
        phone: `${orderInfo.phoneCode}-${orderInfo.phoneNumber}`,
        page: 1,
        limit: 100,
        order_id: orderInfo.id,
      })
    },
    showChatHistory() {
      if (this.relatedChat.length > 1) {
        this.chatHistoryDialogVisible = true
      } else {
        this.$store.dispatch('member/updateMessageId', this.relatedChat[0])
        this.redirectToChatView(this.relatedChat[0].data.id)
      }
    },
    // tryToRefund() {
    //   this.isRefund = true
    //   this.refundDialogVisible = false
    // },
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
        this.handleStore()
        // this.$emit('update')
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
  <div>
    <h3>{{ `#${defaultValue.orderNo}` }}</h3>
    <p :class="$style.meta">
      <span>{{ defaultValue.created | formatDate('dateTime') }} 成立訂單</span>
      <BaseStateLabel state="info" text>訂單來源：{{ defaultValue.source | orderSourceFilter }}</BaseStateLabel>
    </p>
    <BaseStateLabel :state="defaultValue.status | orderStatusFilter('color')">{{ defaultValue.status | orderStatusFilter('text') }}</BaseStateLabel>

    <div :class="$style.header">
      <h5 :class="$style.title">{{ defaultValue.productName }}</h5>
      <div>{{ defaultValue.date | formatDate }} {{ defaultValue.time }}</div>
    </div>

    <!-- 編輯訂單 -->
    <OrderForm v-if="mode === 'edit'" :default-value="defaultValue" @store="handleStore" @cancel="updateMode('view')" />

    <template v-if="mode === 'view'">
     
      <div :class="$style.params">
        <div :class="$style['params__item']">
          <div>訂購項目</div>
          <div>售價</div>
          <div>數量</div>
        </div>
        <div :class="$style['params__item']">
          <div>{{ defaultValue.prepaidTitle }}</div>
          <div class="Jost">{{ defaultValue.priceBase }}</div>
          <div class="Jost">x1</div>
        </div>

        <template>
          <div :class="$style.total">
            <template v-if="defaultValue.refundHistories.length > 0">
              <div v-for="(item, index) in defaultValue.refundHistories" :key="index" :class="$style['total__item']">
                <div class="alert-word">{{ item.refundDate }}退款</div>
                <div class="Jost alert-word">-{{ item.Amt }}</div>
              </div>
            </template>
            <div :class="$style['total__item']">
              <div :class="$style['total__item__title']">付款金額</div>
               <div v-if="defaultValue.discountAmount && defaultValue.discountAmount > 0" :class="$style['total__item__content']" class="Jost alert-text">
                  -{{ defaultValue.discountAmount }}
                  <template v-if="defaultValue.discountType === '%'">
                    ({{defaultValue.discountValue }}%)
                  </template>
                </div>
              <div v-if="defaultValue.paidAt" :class="$style['total__item__content']" class="Jost">{{ defaultValue.backBalance }}</div>
             
              <div v-if="!defaultValue.paidAt && defaultValue.status !== 0" :class="$style['total__item__content']" class="Jost">{{ defaultValue.priceTotal }}</div>
              <div v-if="!defaultValue.paidAt && defaultValue.status === 0" :class="$style['total__item__content']" class="Jost">0</div>

              <!-- <div class="Jost">{{ defaultValue.priceTotal }}</div> -->
            </div>
            <!-- <div v-if="isRefund" :class="$style['total__item']">
              <div class="alert-word">6/29退款</div>
              <div class="Jost alert-word">-200</div>
            </div> -->
          </div>
        </template>
        <div :class="$style.total">
          <div :class="$style['total__item']">
            <div>總額度</div>
            <div class="Jost">{{ defaultValue.times }} 次</div>
          </div>
          <div :class="$style['total__item']">
            <div>剩餘可用額度</div>
            <div class="Jost">{{ defaultValue.times - defaultValue.used }} 次</div>
          </div>
        </div>
      </div>
      <BaseCollapse title="客戶使用歷程">
        <el-switch v-model="showCancelDeductOrder" active-text="顯示已取消訂單"></el-switch>
        <el-timeline>
          <el-timeline-item
            v-for="order in filterDeductOrders"
            :key="order.id"
            :timestamp="`訂單成立時間：${formatDate(order.created, 'dateTime')}`"
            :type="order.status | prepaidOrderStatusFilter('color')"
          >
            <BaseStateLabel :state="order.status | prepaidOrderStatusFilter('color')" text>{{ order.status | prepaidOrderStatusFilter('text') }}</BaseStateLabel>

            <el-link :class="$style['history-title']" @click="tryToGetOrder(order.id)">{{ order.productTitle }}</el-link>
            <span :class="$style['history-meta']">・{{ order.startDate | formatDate('dateTime') }}</span>
            <div :class="$style['history-meta']" style="margin-top: 8px">使用 {{ order.deductTimes }} 次抵扣：{{order.priceTitle}}</div>
          </el-timeline-item>
        </el-timeline>
      </BaseCollapse>
      <BaseCollapse title="付款資訊" :class="$style.payment" style="margin-bottom:10px">
        <ul style="padding: 0 25px; padding-bottom: 10px">
          <li
            ><span class="title">付款方式</span><span class="content">{{ orderPaymentMethodMap[defaultValue.paymentMethod] || '不指定' }}</span>
          </li>
          <li
            ><span class="title">付款時間</span><span class="content">{{ paidAt }}</span></li
          >
          <li v-if="defaultValue.paymentMethod !== 'Vacc'"
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
       <BaseCollapse title="訂單變更紀錄">
        <el-timeline>
          <el-timeline-item v-for="log in defaultValue.history" :key="log.id" :timestamp="log.created | formatDate('dateTime')" type="primary" placement="top">
            {{ log.description }}
            <div v-if="log.note">{{ log.note }}</div>
          </el-timeline-item>
        </el-timeline>
      </BaseCollapse>
      <!-- <BaseCollapse title="發票資訊" :class="$style.payment">
        <div :class="$style.invoice"
          ><div class="info"
            ><div class="order-id Jost">預約訂單 #JTAIL2104140004WC1HX</div
          >
            <div class="el-row" style="margin-left: -10px; margin-right: -10px"
              ><div class="el-col el-col-12 el-col-xs-24" style="padding-left: 10px; padding-right: 10px"
                ><div class="info-item"><span class="title">發票日期</span><span>2021/04/14</span></div
                ><div class="info-item"><span class="title">發票號碼</span><span>QB00000125</span></div
                ><div class="info-item"><span class="title">隨機碼</span><span>1501</span></div></div
              ><div class="el-col el-col-12 el-col-xs-24" style="padding-left: 10px; padding-right: 10px"
                ><div class="info-item"><span class="title">發票形式</span><span>個人</span></div
                ><div class="info-item"><span class="title">載具類別</span><span>手機條碼</span></div
                ><div span="12" xs="24" class="info-item"><span class="title">載具編號</span><span>/O.G4-KQ</span></div
                ></div
              ></div
            ></div
          ></div
        >
      </BaseCollapse> -->

      <h5 :class="$style.title">客戶資訊</h5>
      <ul :class="$style.info">
        <li>{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</li>
        <li>{{ `${defaultValue.phoneCode} ${defaultValue.phoneNumber}` }}</li>
        <li>{{ defaultValue.email }}</li>
      </ul>

      <Portal to="drawer-prepaid-header">
        <div class="isPrepaid">
          <!-- <el-button class="is-round" style="padding: 5px 17px"
            ><a target="_blank" href="https://www.newebpay.com/main/login_center/single_login"><img :src="require(`@assets/images/newebPay.svg`)" alt="" /></a
          ></el-button> -->
          <el-button v-if="defaultValue.paidAt && defaultValue.backBalance !== 0" class="is-round" @click="refundDialogVisible = true">退款記錄</el-button>
          <template v-if="defaultValue.status !== 0">
            <el-button class="is-round" type="danger" @click="showCancelDialog">取消訂單</el-button>
            <el-button class="is-round" @click="updateMode('edit')">編輯訂單</el-button>
            <!-- <el-button @click="writeDialogVisible = true">撰寫通知</el-button> -->
            <el-dropdown ref="more" trigger="click" :hide-on-click="false" @command="handleCommand">
              <el-button class="is-round" style="margin-left: 10px" @click="$refs.more && $refs.more.show()">更多 <BaseIcon name="caret-down" /></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="showMemberDialog">查看客戶資訊</el-dropdown-item>
                <template v-can:api="'searchOrder'">
                  <el-dropdown-item v-if="relatedChat.length > 0" command="showChatHistory"
                    >查看問答紀錄
                    <el-dialog title="請選擇欲查看的紀錄" :visible.sync="chatHistoryDialogVisible" top="0" width="680px" append-to-body>
                      <div :class="$style.chat">
                        <div v-for="(chat, index) in relatedChat" :key="index" class="message" @click.stop="onHistoryClick(chat)">
                          <div class="text">{{ chat.data.message || '客戶傳送了圖片。' }}</div>
                          <div class="name-date">
                            <div class="date">{{ chat.data.created_at | formatDate('dateTime') }}</div>
                          </div>
                        </div>
                      </div>
                    </el-dialog>
                  </el-dropdown-item>
                </template>
                <template v-if="defaultValue.status !== 0">
                 
                  <el-dropdown-item v-loading="tryingSendEmail" command="tryToSendEmail">發送{{sendTitle}}連結至 Email</el-dropdown-item>
                </template>
                 <el-dropdown-item command="showShareDialog">分享訂單資訊頁面連結</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>

          <template v-if="defaultValue.status === 0">
            <el-button @click="showMemberDialog">查看客戶資訊</el-button>
          </template>
        </div>
      </Portal>
      <!-- <div :class="$style.buttons">
        <BaseButton icon="clipboard-list" @click="showMemberDialog">查看客戶資訊</BaseButton>
        <template v-if="defaultValue.status === 2">
          <BaseButton icon="paper-plane" @click="tryToSendEmailOrSMS('email')">發送付款連結至 Email</BaseButton>
          <BaseButton icon="sms" @click="tryToSendEmailOrSMS('sms')">發送付款連結至簡訊</BaseButton>
        </template>
        <template v-if="defaultValue.status !== 0">
          <BaseButton icon="edit" @click="updateMode('edit')">編輯訂單</BaseButton>
          <BaseButton icon="ban" @click="showCancelDialog">取消訂單</BaseButton>
        </template>
      </div> -->

      <OrderChangeStatusDialog :visible.sync="cancelDialogVisible" :order="{ ...defaultValue, status: 0 }" @cancelled="handleStore" />
      <OrderMemberDialog :visible.sync="memberDialogVisible" :member-id="defaultValue.memberId" />
    </template>
    <el-drawer :key="defaultValue.id" :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <!-- header -->

      <PortalTarget slot="title" name="drawer-header"></PortalTarget>
      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" />
      <el-button class="is-fullwidth is-drawer--bottom" plain @click="drawerVisible = false">回到客戶使用歷程</el-button>
    </el-drawer>
    <el-dialog title="退款" :visible.sync="refundDialogVisible" top="0" append-to-body>
      <el-form ref="refundForm" :rules="refundRules" :model="refundSubmitData" class="el-form--floating" label-position="top">
        <el-form-item label="退款金額" prop="amount" style="margin-top: 20px">
          <el-input v-model="refundSubmitData.amount" placeholder=""><span slot="suffix" style="padding-right: 10px">元</span></el-input>
          <span class="alert-word">上限為{{ defaultValue.backBalance }}元</span>
        </el-form-item>
        <el-form-item label="退款日期" prop="refundDate">
          <el-date-picker v-model="refundSubmitData.refundDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="選擇日期"> </el-date-picker>
        </el-form-item>
        <el-form-item label="退款原因" style="margin-bottom: 20px">
          <el-input v-model="refundSubmitData.note" type="textarea" :autosize="{ minRows: 2 }" placeholder=""></el-input>
          <p>僅提供後台退款記錄功能，實際退款請至藍新金流後台，或與客戶確認退款方式後做線下處理。</p>
        </el-form-item>
      </el-form>

      <div class="bottom-btn-center">
        <el-button class="is-round" @click="refundDialogVisible = false">取消</el-button>
        <el-button class="is-round" type="primary" @click="tryToRefund(defaultValue.id)">確認退款記錄</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分享連結" :visible.sync="shareDialogVisible" top="0" width="680px" append-to-body lock-scroll @open="tryToGetShareLink">
      <div slot="title">
        <h5>{{ `#${defaultValue.id}` }}</h5>
        <ul>
          <li>使用人：{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</li>
          <li>訂購內容：{{ defaultValue.prepaidTitle }}</li>
        </ul>
      </div>

      <div :class="$style['share__buttons']">
        <el-button type="text" :class="$style['share__button']" @click="handleShareLink('facebook')">
          <BaseIcon :class="$style['share__icon']" name="facebook-f" icon-style="fab" />
        </el-button>

        <el-button type="text" :class="$style['share__button']" @click="handleShareLink('line')">
          <BaseIcon :class="$style['share__icon']" name="line" icon-style="fab" />
        </el-button>
        <template v-if="defaultValue.status !== 0">
          <el-button type="text" :loading="tryingSendSMS" :class="$style['share__button']" @click="tryToSendSMS">
            <BaseIcon :class="$style['share__icon']" name="sms" />
          </el-button>
        </template>
        <div :class="$style['share__button']">
          <el-button circle @click="copyShareLink">
            <BaseIcon name="copy" />
          </el-button>
          <div :class="$style['share__label']">複製連結</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.share {
  &__buttons {
    display: flex;
    align-items: center;
    text-align: center;
  }
  &__button {
    flex: 1;
  }
  &__icon {
    font-size: 3rem;
  }
  &__label {
    margin-top: 10px;
  }
}
:global {
  .el-timeline {
    margin-top: 15px;
  }
}

.meta {
  display: flex;
  justify-content: space-between;
}
.header {
  margin-bottom: 15px;
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
.params {
  padding: 5px 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 40px;
  background: white;

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
    &__title{
      flex: 2;
      // text-align: right;
    }
    &__content{
      flex: 1;
      text-align: right;
    }

    &--discount {
      color: $color-state-danger;
    }
    &:not(.total__item--discount) > *:first-child {
      color: $color-text-placeholder;
    }
  }
}
.history {
  &-title {
    margin-left: 10px;
  }
  &-meta {
    color: $color-text-placeholder;
  }
}

.buttons {
  margin-top: 30px;
  border-top: 1px solid $color-border-base;
  border-bottom: 1px solid $color-border-base;
}

.payment {
  margin-top: 10px;
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
