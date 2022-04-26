<script>
import lazyLoadComponent from '@router/lazyload-component'

import formatDate from '@utils/format-date'
import { orderPaymentMethodMap, genderFilter,paymentStatusMapFilter, taxTypeMap, carrierTypeMap,bookingStatusFilter } from '@utils/filter-value-to-text'
export default {
  components: {
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
  },
  filters: {
    formatDate,
    paymentStatusMapFilter,
    bookingStatusFilter
  },
  props: {
    // currentService: {
    //   type: Object,
    //   default: () => {},
    // },
    isMainOrder: {
      type: Boolean,
      default: false,
    },
    isChildren: {
      type: Boolean,
      default: false,
    },
    deleteIds: {
      type: Array,
      default: () => [],
    },
    adds: {
      type: Array,
      default: () => [],
    },
    haveItems: {
      type: Array,
      default: () => [],
    },
    moreItems: {
      type: Array,
      default: () => [],
    },
    submitData: {
      type: Object,
      default: () => {},
    },
    submitDataPrepaid: {
      type: Object,
      default: () => {},
    },
    currentBuyPrepaid: {
      type: Object,
      default: () => {},
    },
    orderParams: {
      type: Array,
      default: () => [],
    },
    orderTotalEditList: {
      type: Array,
      default: () => [],
    },
    orderAddList: {
      type: Array,
      default: () => [],
    },
    couponInfo: {
      type: Object,
      default: () => {},
    },
    serviceTotal: {
      type: Number,
      default: 0,
    },
    couponPriceTotal: {
      type: Number,
      default: 0,
    },
    submitPriceTotal: {
      type: Number,
      default: 0,
    },
    childrenOrderTotal: {
      type: Number,
      default: 0,
    },

    hasCouponInfo: {
      type: Boolean,
      default: false,
    },
    isOutSide: {
      type: Boolean,
      default: false,
    },
    isEditMode: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      orderPaymentMethodMap,
      MaxQty: 1,
      tableFixHeight: 0,
      mainTableItemShow: true,
    }
  },
  computed: {
    params: {
      get() {
        return this.orderParams
      },
      set(value) {
        this.$emit('update:orderParams', value)
      },
    }, // 可以不用這樣寫
    totalEditList: {
      get() {
        return this.orderTotalEditList
      },
      set(value) {
        this.$emit('update:orderTotalEditList', value)
      },
    },
    addList: {
      get() {
        return this.orderAddList
      },
      set(value) {
        this.$emit('update:orderAddList', value)
      },
    },
    // 編輯時 only 呈現
    prepaidItem() {
      return this.params.find((item) => {
        return item.type === 'prepaid'
      })
    },
    couponItem() {
      return this.params.find((item) => {
        return item.type === 'coupon'
      })
    },
    editTotalEditList() {
      const totalEditTypes = ['+', '-', '%']
      return this.params.filter((item) => {
        return totalEditTypes.includes(item.type)
      })
    },
    editAddList() {
      return this.params.filter((item) => {
        return item.type === 'cosmetic-add'
      })
    },
    editServiceTotal() {
      let cacheTotal = 0
      if (this.prepaidItem) {
        cacheTotal = 0
      } else if (this.couponItem) {
        cacheTotal = this.params[0].total + this.couponItem.total
      } else {
        cacheTotal = this.params[0].total
      }
      return cacheTotal
    },
    tableReduceHeight() {
      let height = ''
      if (this.isChildren) {
        height = '230px'
      } else {
        if (this.isOutSide) {
          if (this.isEditMode) {
            height = '230px'
          } else {
            height = '380px'
          }
        } else {
          height = '270px'
        }
      }

      // isOutSide ? '380px' : '270px'

      return height
    },
    editPamamsOther() {
      // console.log(data.params)
      const list = [...this.submitData.params]
      list.splice(0, 1)
      list.forEach((item, index) => {
        if (item.type === 'coupon') {
          list.splice(index, 1)
        }
      })
      list.forEach((item, index) => {
        if (item.type === 'prepaid') {
          list.splice(index, 1)
        }
      })

      // console.log(list)
      return list
    },
    childrenOrders() {
      return this.submitData.childrenOrders
    },
   
  },
  watch: {
    /*  finalTotal: {
      handler(value) {
        this.$emit('update:final-total', value)
      },
      immediate: true,
    }, */
  },
  mounted() {
    // this.$refs.tableScroll.style.maxHeight=calc(100vh - )
    // this.tableFixHeight = this.$refs.tableFix.offsetHeight
    // console.log(this.$refs.tableFix.offsetHeight,this.$refs.tableScroll.offsetHeight)
  },
  created() {},
  methods: {
     paymentExpiredDate(data) {
      if (data.allowExpired === 1) return '無（可逾期付款）'
      return formatDate(data.paymentExpiredDate, 'dateTime')
    },
    paidAt(data) {
      if (!!data.paidAt === false) return '無'
      return formatDate(data.paidAt, 'dateTime')
    },
    totalEditTitle(type) {
      let title = ''
      switch (type) {
        case '+':
          title = '加價'
          break
        case '-':
          title = '減價'
          break
        case '%':
          title = '折扣'
          break
      }
      return title
    },
    discount(item) {
      return item.price
    },
    deleteTotalEdit(index, type) {
      if (this.isChildren) {
        this.totalEditList.splice(index, 1)
      } else {
        if (!this.isEditMode) {
          this.totalEditList.splice(index, 1)
        } else {
        }
      }

      if (type === 'isEdit') {
        this.deleteIds.push(this.totalEditList[index].id)
        this.totalEditList.splice(index, 1)
      }
      // console.log(this.deleteIds)
    },
    deleteAdd(index, type) {
      if (this.isChildren) {
        this.addList.splice(index, 1)
      } else {
        if (!this.isEditMode) {
          this.addList.splice(index, 1)
        } else {
        }
      }

      if (type === 'isEdit') {
        this.deleteIds.push(this.addList[index].id)
        this.addList.splice(index, 1)
      }
      // console.log(this.deleteIds)
    },
    deleteMore(index) {
      let list = [...this.haveItems]
      list.splice(index, 1)
      this.$emit('update:moreItems', list)
    },
    deleteHave(id, index) {
      let list = [...this.haveItems]
      list.splice(index, 1)
      this.$emit('update:haveItems', list)
      let deleteIds = [...this.deleteIds]
      deleteIds.push(id)
      this.$emit('update:deleteIds', deleteIds)
    },
    openAddEdit() {
      this.$emit('openAdd')
    },
    openTotalEdit(){
      this.$emit('openTotalEdit')
    },
    // toCollapse() {
    //   // console.log(this.tableItemShow[0])
    //   this.mainTableItemShow = !this.mainTableItemShow
    // },
    handleCommand(command) {
      // console.log(command.index)
      this[command.command](command.index)
    },
    editOpenTotalEdit(index) {
      this.$emit('editOpenTotalEdit', index)
    },
    editOpenPaymentMethod(index) {
      this.$emit('editOpenPaymentMethod', index)
    },
    editOpenHistory(index) {
      this.$emit('editOpenHistory', index)
    },
    tryToCancelOrder(index) {
      this.$emit('tryToCancelOrder', index)
    },
    editOpenRefund(index) {
      this.$emit('editOpenRefund', index)
    },
    // openTotal() {
    //   this.$emit('openTotalEdit')
    // },
    // openAdd() {

    // },
  },
}
</script>
<template>
  <div :class="$style.wrapper">
    <div :class="$style.table"
      ><h6>訂單計算</h6>
      <div ref="tableScroll" :class="{ isOutSide: isOutSide }" class="table__scroll" :style="`max-height:calc(100vh - ${tableFixHeight}px - ${tableReduceHeight}`">
        <template v-if="isChildren">
          <div class="table__block">
            <div class="table__head">
              <div class="table__title"> 加購項目 </div>
              <div class="table__item"> 售價 </div>
              <div class="table__item"> 數量 </div>
              <div class="table__item"> 小計 </div>
              <div class="table__button"> </div>
            </div>

            <template v-if="addList.length > 0">
              <div class="table__box">
                <div v-for="(item, index) in addList" :key="index" class="table__row">
                  <div class="table__title">
                    <span v-if="item.title">{{ item.title }}</span>
                  </div>
                  <div class="table__item">
                    {{ item.price }}
                  </div>
                  <div class="table__item">
                    {{ 'x1' }}
                  </div>
                  <div class="table__item">
                    {{ item.price }}
                  </div>
                  <div class="table__button">
                    <div @click="deleteAdd(index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                  </div>
                </div>
              </div>
            </template>
            <div  style="margin-top: 15px">
              <el-button type="text" style="padding-top: 0; text-decoration: underline" @click="openAddEdit"> 加購 </el-button>
               <el-button type="text" style="padding-top: 0; text-decoration: underline;margin-left:15px" @click="openTotalEdit"> 變價 </el-button>
            </div>
            <template v-if="totalEditList.length > 0">
              <!-- <div style="padding-top: 15px; padding-bottom: 10px">價格編輯</div> -->
              <div class="table__box" style="margin-top: 10px">
                <div v-for="(item, index) in totalEditList" :key="index" class="table__row">
                  <div class="table__title">
                    {{ totalEditTitle(item.type) }}
                    <span v-if="item.title"
                      ><br />
                      ({{ item.title }})</span
                    >
                  </div>
                  <div class="table__item"> {{ item.price }} <span v-if="item.type === '%'">%</span> </div>
                  <div class="table__item">
                    {{ 'x1' }}
                  </div>
                  <div class="table__item">
                    <span v-if="item.type === '+'">+ {{ item.price }}</span>
                    <span v-if="item.type === '-'">- {{ item.price }}</span>
                    <span v-if="item.type === '%'">- {{ item.discount }}</span>
                  </div>
                  <div class="table__button">
                    <div @click="deleteTotalEdit(index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                  </div>
                </div>
              </div>
            </template>

            <div class="table__box" style="margin-top: 10px">
              <div class="table__row">
                <div class="table__title"> 應付金額 </div>
                <div class="table__single">
                  {{ childrenOrderTotal }}
                </div>
                <div class="table__button"> </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <template v-if="isEditMode && isOutSide">
            <div class="table__block">
              <BaseCollapse style="margin-bottom: 30px" expanded is-table>
                <template v-slot:title>
                  <div class="table__head" style="padding: 0">
                    <div class="table__title" style="padding: 10px; width: 90%">
                      <div style="cursor: pointer"><BaseIcon style="font-size: 16px" name="angle-down"></BaseIcon> 訂單 {{ submitData.id }}
                        <template v-if="submitData.status === 0">
                          <BaseStateLabel state="info" text>
                            <span style="font-size:12px"> {{ submitData.status | bookingStatusFilter('text') }}</span>  
                          </BaseStateLabel>
                        </template>
                        <template v-else>
                          <BaseStateLabel :state="submitData.paymentStatus | paymentStatusMapFilter('color')" text>
                          
                            <span style="font-size:12px"> {{ submitData.paymentStatus | paymentStatusMapFilter('text') }}</span>
                          </BaseStateLabel>
                  
                        </template>
                      </div>
                    </div>
                    <div class="table__single">
                      <el-dropdown ref="more" trigger="click" :hide-on-click="true" @command="handleCommand">
                        <div style="cursor: pointer; padding: 10px; width: 20%" @click.stop="$refs.more && $refs.more.show()"><BaseIcon style="font-size: 16px" name="ellipsis-v"></BaseIcon></div>
                        <!-- <el-button class="is-round" style="margin-left: 10px" @click="$refs.more && $refs.more.show()">更多 <BaseIcon name="caret-down" /></el-button> -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="submitData.status !== 0 && !isPaid" :command="{ command: 'editOpenTotalEdit', index: 'main' }">編輯價格與折扣</el-dropdown-item>
                          <el-dropdown-item v-if="submitData.status !== 0 && !isPaid" :command="{ command: 'editOpenPaymentMethod', index: 'main' }">編輯付款方式</el-dropdown-item>
                          <el-dropdown-item :command="{ command: 'editOpenHistory', index: 'main' }">訂單變更記錄</el-dropdown-item>
                          <el-dropdown-item v-if="submitData.status !== 0 && submitData.status !== 6" :command="{ command: 'tryToCancelOrder', index: 'main' }">取消訂單</el-dropdown-item>
                          <el-dropdown-item v-if="isPaid && submitData.paymentMethod !== 'Prepaid' && submitData.backBalance !== 0" :command="{ command: 'editOpenRefund', index: 'main' }">退款</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </template>
                <div>
                  <div>
                    <div class="table__head isEdit">
                      <div class="table__title"> 預約項目 </div>
                      <div class="table__item"> 售價 </div>
                      <div class="table__item"> 數量 </div>
                      <div class="table__item"> 小計 </div>
                      <!-- <div class="table__button"> </div> -->
                    </div>

                    <div class="table__box">
                      <div class="table__row">
                        <div class="table__title">
                          {{ params[0].title }}
                        </div>
                        <div class="table__item">
                          {{ params[0].price }}
                        </div>
                        <div class="table__item"> x{{ params[0].qty }} </div>
                        <div class="table__item">
                          {{ params[0].total * params[0].qty }}
                        </div>
                        <!-- <div class="table__button"> </div> -->
                      </div>

                      <div v-if="prepaidItem && prepaidItem.id" class="table__row">
                        <div class="table__title"> {{ prepaidItem.title }} </div>

                        <div class="table__single"> {{ prepaidItem.total }} </div>
                        <!-- <div class="table__button"> </div> -->
                      </div>
                      <div v-if="couponItem && couponItem.id" class="table__row">
                        <div class="table__title"> {{ `優惠券 (${couponItem.title})` }} </div>

                        <div class="table__single">
                          {{ couponItem.total }}
                        </div>
                        <!-- <div class="table__button"> </div> -->
                      </div>

                      <div class="table__row">
                        <div class="table__title"> 小計 </div>

                        <div class="table__single">
                          {{ editServiceTotal }}
                        </div>
                        <!-- <div class="table__button"> </div> -->
                      </div>
                    </div>
                  </div>

                  <template v-if="editPamamsOther.length > 0">
                    <div class="table__box" style="margin-top: 10px">
                      <div v-for="(item, index) in editPamamsOther" :key="index" class="table__row">
                        <div class="table__title">
                          <span v-if="item.type === 'cosmetic-add'">{{ item.title }}</span>
                          <span v-else>
                            {{ totalEditTitle(item.type) }}
                            <span v-if="item.title"
                              ><br />
                              ({{ item.title }})</span
                            >
                          </span>
                        </div>
                        <div class="table__item">
                          <span v-if="item.type === '%'">{{ item.description }} %</span>
                          <span v-else>{{ item.total }} </span>
                        </div>
                        <div class="table__item">
                          {{ 'x1' }}
                        </div>
                        <div class="table__item">
                          {{ item.total }}
                        </div>
                        <!-- <div class="table__button">
                          <div @click="deleteAdd(index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                        </div> -->
                      </div>
                    </div>
                  </template>

                  <!-- <template v-if="editAddList.length > 0">
                    <div class="inline-between" style="margin-top: 15px; margin-bottom: 15px">
                      加購項目
                      <el-button type="text" style="padding: 0; text-decoration: underline" @click="openAddEdit"> 編輯加購 </el-button>
                    </div>
                    <div class="table__box" style="margin-top: 10px">
                      <div v-for="(item, index) in editAddList" :key="index" class="table__row">
                        <div class="table__title">
                          <span v-if="item.title">{{ item.title }}</span>
                        </div>
                        <div class="table__item">
                          {{ item.total }}
                        </div>
                        <div class="table__item">
                          {{ 'x1' }}
                        </div>
                        <div class="table__item">
                          {{ item.total }}
                        </div>
                        <div class="table__button">
                    
                        </div>
                      </div>
                    </div>
                  </template> -->

                  <!-- <template v-if="editTotalEditList.length > 0">
                
                    <div class="table__box" style="margin-top: 10px">
                      <div v-for="(item, index) in editTotalEditList" :key="index" class="table__row">
                        <div class="table__title">
                          {{ totalEditTitle(item.type) }}
                          <span v-if="item.title"
                            ><br />
                            ({{ item.title }})</span
                          >
                        </div>
                        <div class="table__item">
                          <span v-if="item.type === '%'">% {{ item.description }}</span>
                          <span v-else>{{ item.total }} </span>
                        </div>
                        <div class="table__item">
                          {{ 'x1' }}
                        </div>
                        <div class="table__item">
                          {{ item.total }}
                        </div>
                        <div class="table__button">
                      
                        </div>
                      </div>
                    </div>
                  </template> -->

                  <div class="table__box" style="margin-top: 10px;margin-bottom:10px">
                    <div class="table__row">
                      <div class="table__title" style="width:50%"> 應付金額 
                        <!-- <span v-if="submitData.status === 0" class="alert-word">(已取消)</span>  -->
                      </div>
                      <div class="table__single" style="width:40%">
                        {{ submitData.payTotal }}
                      </div>
                      <!-- <div class="table__button"> </div> -->
                    </div>
                    <template v-if="submitData.refundHistories.length > 0">
                      <div v-for="(item, index) in submitData.refundHistories" :key="index" class="table__row">
                        <div class="alert-word table__title" style="width:50%" >{{ item.refundDate }}退款</div>
                        <div class=" alert-word table__single" style="width:50%">-{{ item.Amt }}</div>
                      </div>
                    </template>
                  </div>
                </div>
                <BaseCollapse  title="付款資訊" :class="$style.payment">
                  <ul style="padding: 0 15px; padding-bottom: 10px">
                    <li
                      ><span class="title">付款方式</span><span class="content">{{ orderPaymentMethodMap[submitData.paymentMethod] || '不指定' }}</span>
                      <span v-if="submitData.prepaid"
                        ><span v-if="submitData.paymentMethod === 'Prepaid'" style="color: lightgray">（{{ submitData.prepaid.title }}）</span>
                      </span>
                    </li>
                    <li v-if="submitData.paymentMethod === 'Prepaid' && submitData.prepaid"
                      ><span class="title">抵扣次數</span><span class="content">{{ submitData.prepaid.deductTimes }} 次 </span></li
                    >
                    <li
                      ><span class="title">付款時間</span><span class="content">{{ paidAt(submitData) }}</span></li
                    >
                    <li v-if="submitData.paymentMethod !== 'Vacc' && submitData.paymentMethod !== 'Prepaid'"
                      ><span class="title">付款期限</span><span class="content">{{ paymentExpiredDate(submitData) }}</span></li
                    >
                    <template v-if="submitData.Vacc">
                      <li style="border-top: 1px solid #dcdfe6"
                        ><span class="title">轉帳銀行</span><span class="content">{{ `${submitData.Vacc.Bank} ${submitData.Vacc.BankCode}` }}</span></li
                      >
                      <li
                        ><span class="title">轉帳帳號</span><span class="content">{{ submitData.Vacc.VACCNo }}</span></li
                      >
                      <li
                        ><span class="title">轉帳期限</span><span class="content">{{ submitData.paymentExpiredDate | formatDate('dateTime') }}</span></li
                      >
                    </template>
                    <template v-if="submitData.Card4No">
                      <li
                        ><span class="title">信用卡末四碼</span><span class="content">{{ submitData.Card4No }}</span></li
                      >

                    </template>
                    <template v-if="submitData.PayerAccount5Code">
                      <li
                        ><span class="title">匯款帳號末五碼</span><span class="content">{{ submitData.PayerAccount5Code }}</span></li
                      >

                    </template>

                  </ul>
                </BaseCollapse>
              </BaseCollapse>

              <BaseCollapse v-for="(addOrder, index) in childrenOrders" :key="index" style="margin-bottom: 30px" is-table>
                <template v-slot:title>
                  <div class="table__head" style="padding: 0">
                    <div class="table__title" style="padding:10px 0 10px 10px; width: 90%">
                      <div style="cursor: pointer"><BaseIcon style="font-size: 16px" name="angle-down"></BaseIcon> 子訂單 {{ addOrder.id }} 
                        <template v-if="addOrder.status === 0">
                          <BaseStateLabel state="info" text>
                            <span style="font-size:12px"> {{ addOrder.status | bookingStatusFilter('text') }}</span>  
                          </BaseStateLabel>
                        </template>
                        <template v-else>
                          <BaseStateLabel :state="addOrder.paymentStatus | paymentStatusMapFilter('color')" text>
                          
                            <span style="font-size:12px"> {{ addOrder.paymentStatus | paymentStatusMapFilter('text') }}</span>
                          </BaseStateLabel>
                  
                        </template>
                      
                      </div>
                    </div>
                    <div class="table__single">
                      <el-dropdown :ref="`more${index}`" trigger="click" :hide-on-click="true" @command="handleCommand">
                        <div style="cursor: pointer; padding: 10px; width: 20%" @click.stop="$refs[`more${index}`][0] && $refs[`more${index}`][0].show()"
                          ><BaseIcon style="font-size: 16px" name="ellipsis-v"></BaseIcon
                        ></div>
                        <!-- <el-button class="is-round" style="margin-left: 10px" @click="$refs.more && $refs.more.show()">更多 <BaseIcon name="caret-down" /></el-button> -->
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-if="addOrder.status !== 0 && addOrder.paymentStatus === 'UNPAID'" :command="{ command: 'editOpenTotalEdit', index: index }"
                            >編輯價格與折扣</el-dropdown-item
                          >
                          <el-dropdown-item v-if="addOrder.status !== 0 && addOrder.paymentStatus === 'UNPAID'" :command="{ command: 'editOpenPaymentMethod', index: index }"
                            >編輯付款方式</el-dropdown-item
                          >
                          <el-dropdown-item :command="{ command: 'editOpenHistory', index: index }">訂單變更記錄</el-dropdown-item>
                          <el-dropdown-item v-if="addOrder.status !== 0 && addOrder.status !== 6" :command="{ command: 'tryToCancelOrder', index: index }">取消訂單</el-dropdown-item>
                          <el-dropdown-item v-if="addOrder.paymentStatus === 'PAID' && addOrder.paymentMethod !== 'Prepaid' && addOrder.backBalance !== 0" :command="{ command: 'editOpenRefund', index: index }">退款</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </template>
                <div>
                  <div>
                    <div class="table__head isEdit">
                      <div class="table__title"> 加購項目 </div>
                      <div class="table__item"> 售價 </div>
                      <div class="table__item"> 數量 </div>
                      <div class="table__item"> 小計 </div>
                      <!-- <div class="table__button"> </div> -->
                    </div>
                  </div>

                  <template v-if="addOrder.params.length > 0">
                    <div class="table__box">
                      <div v-for="(item, index) in addOrder.params" :key="index" class="table__row">
                        <div class="table__title">
                          <span v-if="item.type === 'cosmetic-add'">{{ item.title }}</span>
                          <span v-else>
                            {{ totalEditTitle(item.type) }}
                            <span v-if="item.title"
                              ><br />
                              ({{ item.title }})</span
                            >
                          </span>
                        </div>
                        <div class="table__item">
                          <span v-if="item.type === '%'">{{ item.description }} %</span>
                          <span v-else>{{ item.total }} </span>
                        </div>
                        <div class="table__item">
                          {{ 'x1' }}
                        </div>
                        <div class="table__item">
                          {{ item.total }}
                        </div>
                        <!-- <div class="table__button">
                          <div @click="deleteAdd(index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                        </div> -->
                      </div>
                    </div>
                  </template>

                  <div class="table__box" style="margin-top: 10px;margin-bottom:10px">
                    <div class="table__row">
                      <div class="table__title" style="width:50%"> 應付金額 
                        <!-- <span v-if="addOrder.status === 0" class="alert-word">(已取消)</span> -->
                      </div>
                      <div class="table__single" style="width:40%">
                        {{ addOrder.payTotal }}
                      </div>
                      <!-- <div class="table__button"> </div> -->
                    </div>
                    <template v-if="addOrder.refundHistories.length > 0">
                      <div v-for="(item, index) in addOrder.refundHistories" :key="index" class="table__row">
                        <div class="alert-word table__title" style="width:50%" >{{ item.refundDate }}退款</div>
                        <div class=" alert-word table__single" style="width:50%">-{{ item.Amt }}</div>
                      </div>
                    </template>
                  </div>
                </div>
                <BaseCollapse  title="付款資訊" small-title :class="$style.payment">
                  <ul style="padding: 0 15px; padding-bottom: 10px">
                    <li
                      ><span class="title">付款方式</span><span class="content">{{ orderPaymentMethodMap[addOrder.paymentMethod] || '不指定' }}</span>
                      <span v-if="addOrder.prepaid"
                        ><span v-if="addOrder.paymentMethod === 'Prepaid'" style="color: lightgray">（{{ addOrder.prepaid.title }}）</span>
                      </span>
                    </li>
                    <li v-if="addOrder.paymentMethod === 'Prepaid' && addOrder.prepaid"
                      ><span class="title">抵扣次數</span><span class="content">{{ addOrder.prepaid.deductTimes }} 次 </span></li
                    >
                    <li
                      ><span class="title">付款時間</span><span class="content">{{ paidAt(addOrder) }}</span></li
                    >
                    <li v-if="addOrder.paymentMethod !== 'Vacc' && addOrder.paymentMethod !== 'Prepaid'"
                      ><span class="title">付款期限</span><span class="content">{{ paymentExpiredDate(addOrder) }}</span></li
                    >
                    <template v-if="addOrder.Vacc">
                      <li style="border-top: 1px solid #dcdfe6"
                        ><span class="title">轉帳銀行</span><span class="content">{{ `${addOrder.Vacc.Bank} ${addOrder.Vacc.BankCode}` }}</span></li
                      >
                      <li
                        ><span class="title">轉帳帳號</span><span class="content">{{ addOrder.Vacc.VACCNo }}</span></li
                      >
                      <li
                        ><span class="title">轉帳期限</span><span class="content">{{ addOrder.paymentExpiredDate | formatDate('dateTime') }}</span></li
                      >
                    </template>
                    <template v-if="addOrder.Card4No">
                      <li
                        ><span class="title">信用卡末四碼</span><span class="content">{{ addOrder.Card4No }}</span></li
                      >

                    </template>
                    <template v-if="addOrder.PayerAccount5Code">
                      <li
                        ><span class="title">匯款帳號末五碼</span><span class="content">{{ addOrder.PayerAccount5Code }}</span></li
                      >

                    </template>
                  </ul>
                </BaseCollapse>
              </BaseCollapse>
            </div>
          </template>

          <div v-if="isEditMode && !isOutSide" class="table__block">
            <div v-if="isMainOrder">
              <div class="table__head">
                <div class="table__title"> 預約項目 </div>
                <div class="table__item"> 售價 </div>
                <div class="table__item"> 數量 </div>
                <div class="table__item"> 小計 </div>
                <div class="table__button"> </div>
              </div>

              <div class="table__box">
                <div class="table__row">
                  <div class="table__title">
                    {{ params[0].title }}
                  </div>
                  <div class="table__item">
                    {{ params[0].price }}
                  </div>
                  <div class="table__item"> x{{ params[0].qty }} </div>
                  <div class="table__item">
                    {{ params[0].total * params[0].qty }}
                  </div>
                  <div class="table__button"> </div>
                </div>

                <div v-if="prepaidItem && prepaidItem.id" class="table__row">
                  <div class="table__title"> {{ prepaidItem.title }} </div>

                  <div class="table__single"> {{ prepaidItem.total }} </div>
                  <div class="table__button"> </div>
                </div>

                <div v-if="hasCouponInfo" class="table__row">
                  <div class="table__title"> {{ `優惠券 (${couponInfo.code})` }} </div>

                  <div class="table__single">
                    {{ couponPriceTotal - serviceTotal }}
                  </div>
                  <div class="table__button"> </div>
                </div>
                <div class="table__row">
                  <div class="table__title"> 小計 </div>

                  <div class="table__single">
                    <span v-if="!prepaidItem">{{ couponPriceTotal }}</span>
                    <span v-else>0</span>
                  </div>
                  <div class="table__button"> </div>
                </div>
              </div>
            </div>

            <template v-if="haveItems.length > 0">
              <div v-if="!isMainOrder" class="table__head">
                <div class="table__title"> 加購項目 </div>
                <div class="table__item"> 售價 </div>
                <div class="table__item"> 數量 </div>
                <div class="table__item"> 小計 </div>
                <div class="table__button"> </div>
              </div>
              <div class="table__box" style="margin-top: 10px">
                <div v-for="(item, index) in haveItems" :key="index" class="table__row">
                  <div class="table__title">
                    <template v-if="item.type === 'cosmetic-add'">
                      <span v-if="item.title">{{ item.title }}</span>
                    </template>
                    <template v-else>
                      {{ totalEditTitle(item.type) }}
                      <span v-if="item.title"
                        ><br />
                        ({{ item.title }})</span
                      >
                    </template>
                  </div>
                  <div class="table__item">
                    <template v-if="item.type === 'cosmetic-add'">
                      {{ item.price }}
                    </template>
                    <template v-else> {{ item.price }} <span v-if="item.type === '%'">%</span> </template>
                  </div>
                  <div class="table__item">
                    {{ 'x1' }}
                  </div>
                  <div class="table__item">
                    <template v-if="item.type === 'cosmetic-add'">
                      {{ item.price }}
                    </template>
                    <template v-else>
                      <span v-if="item.type === '+'">+ {{ item.price }}</span>
                      <span v-if="item.type === '-'">- {{ item.price }}</span>
                      <span v-if="item.type === '%'">- {{ item.discount }}</span>
                    </template>
                  </div>
                  <div class="table__button">
                    <div @click="deleteHave(item.id, index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                  </div>
                </div>
              </div>
            </template>

            <!-- <template v-if="addList.length > 0">
              <div class="table__box" style="margin-top: 10px">
                <div v-for="(item, index) in addList" :key="index" class="table__row">
                  <div class="table__title">
                    <span v-if="item.title">{{ item.title }}</span>
                  </div>
                  <div class="table__item">
                    {{ item.price }}
                  </div>
                  <div class="table__item">
                    {{ 'x1' }}
                  </div>
                  <div class="table__item">
                    {{ item.price }}
                  </div>
                  <div class="table__button">
                    <div @click="deleteAdd(index, 'isEdit')"><BaseIcon name="trash-alt"></BaseIcon></div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="totalEditList.length > 0">
              <div style="padding-top: 15px; padding-bottom: 10px">價格編輯</div>
              <div class="table__box" style="margin-top: 10px">
                <div v-for="(item, index) in totalEditList" :key="index" class="table__row">
                  <div class="table__title">
                    {{ totalEditTitle(item.type) }}
                    <span v-if="item.title"
                      ><br />
                      ({{ item.title }})</span
                    >
                  </div>
                  <div class="table__item"> {{ item.price }} <span v-if="item.type === '%'">%</span> </div>
                  <div class="table__item">
                    {{ 'x1' }}
                  </div>
                  <div class="table__item">
                    <span v-if="item.type === '+'">+ {{ item.price }}</span>
                    <span v-if="item.type === '-'">- {{ item.price }}</span>
                    <span v-if="item.type === '%'">- {{ item.discount }}</span>
                  </div>
                  <div class="table__button">
                    <div @click="deleteTotalEdit(index, 'isEdit')"><BaseIcon name="trash-alt"></BaseIcon></div>
                  </div>
                </div>
              </div>
            </template> -->

            <div class="table__box" style="margin-top: 10px; margin-bottom: 10px">
              <div v-for="(item, index) in moreItems" :key="index" class="table__row">
                <div class="table__title">
                  <template v-if="item.type === 'cosmetic-add'">
                    <span v-if="item.title">{{ item.title }}</span>
                  </template>
                  <template v-else>
                    {{ totalEditTitle(item.type) }}
                    <span v-if="item.title"
                      ><br />
                      ({{ item.title }})</span
                    >
                  </template>
                </div>
                <div class="table__item">
                  <template v-if="item.type === 'cosmetic-add'">
                    {{ item.price }}
                  </template>
                  <template v-else> {{ item.price }} <span v-if="item.type === '%'">%</span> </template>
                </div>
                <div class="table__item">
                  {{ 'x1' }}
                </div>
                <div class="table__item">
                  <template v-if="item.type === 'cosmetic-add'">
                    {{ item.price }}
                  </template>
                  <template v-else>
                    <span v-if="item.type === '+'">+ {{ item.price }}</span>
                    <span v-if="item.type === '-'">- {{ item.price }}</span>
                    <span v-if="item.type === '%'">- {{ item.discount }}</span>
                  </template>
                </div>
                <div class="table__button">
                  <div @click="deleteMore(index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                </div>
              </div>
            </div>

            <el-button type="text" style="padding-top: 0; text-decoration: underline" @click="openAddEdit"> 新增加購 </el-button>
           

            <div class="table__box" style="margin-top: 10px">
              <div class="table__row">
                <div class="table__title"> 應付金額 </div>
                <div class="table__single">
                  <!-- <span v-if="submitDataPrepaid.prepaidId"> {{ currentBuyPrepaid.price }} + </span> -->
                  {{ submitPriceTotal }}
                </div>
                <div class="table__button"> </div>
              </div>
            </div>
          </div>

          <div v-if="!isEditMode" class="table__block">
            <div>
              <template v-if="submitDataPrepaid.prepaidId">
                <div class="table__head">
                  <div class="table__title"> 購買包月 </div>
                  <div class="table__single"> 售價 </div>
                  <div class="table__button"> </div>
                </div>
                <div class="table__box" style="margin-bottom: 20px">
                  <div class="table__row">
                    <div class="table__title" style="width: 60%"> {{ currentBuyPrepaid.title }} </div>

                    <div class="table__single" style="width: 30%">
                      {{ currentBuyPrepaid.price }}
                    </div>
                    <div class="table__button"> </div>
                  </div>
                </div>
              </template>

              <div class="table__head">
                <div class="table__title"> 預約項目 </div>
                <div class="table__item"> 售價 </div>
                <div class="table__item"> 數量 </div>
                <div class="table__item"> 小計 </div>
                <div class="table__button"> </div>
              </div>

              <div v-if="params[0].priceId" class="table__box">
                <div class="table__row">
                  <div class="table__title">
                    {{ params[0].title }}
                  </div>
                  <div class="table__item">
                    {{ params[0].price }}
                  </div>
                  <div class="table__item"> x{{ MaxQty }} </div>
                  <div class="table__item">
                    {{ params[0].price * MaxQty }}
                  </div>
                  <div class="table__button"> </div>
                </div>

                <div v-if="submitData.prepaidOrderUuid" class="table__row">
                  <div class="table__title"> {{ `包月抵扣` }} </div>

                  <div class="table__single"> -{{ serviceTotal }} </div>
                  <div class="table__button"> </div>
                </div>

                <div v-if="submitDataPrepaid.prepaidId" class="table__row">
                  <div class="table__title"> {{ `包月抵扣` }} </div>

                  <div class="table__single"> -{{ serviceTotal }} </div>
                  <div class="table__button"> </div>
                </div>

                <div v-if="hasCouponInfo" class="table__row">
                  <div class="table__title"> {{ `優惠券 (${couponInfo.code})` }} </div>

                  <div class="table__single">
                    {{ couponPriceTotal - serviceTotal }}
                  </div>
                  <div class="table__button"> </div>
                </div>
                <div v-if="submitData.prepaidOrderUuid || submitDataPrepaid.prepaidId" class="table__row">
                  <div class="table__title"> 小計 </div>

                  <div class="table__single">
                    {{ 0 }}
                  </div>
                  <div class="table__button"> </div>
                </div>
                <div v-else class="table__row">
                  <div class="table__title"> 小計 </div>

                  <div class="table__single">
                    {{ couponPriceTotal }}
                  </div>
                  <div class="table__button"> </div>
                </div>
              </div>
            </div>

            <div v-if="addList.length > 0 || totalEditList.length > 0">
              <template v-if="addList.length > 0">
                <div class="inline-between" style="margin-top: 15px">
                  加購項目
                  <el-button type="text" style="padding-top: 0; text-decoration: underline" @click="openAddEdit"> 編輯加購 </el-button>
                </div>
                <div class="table__box">
                  <div v-for="(item, index) in addList" :key="index" class="table__row">
                    <div class="table__title">
                      <span v-if="item.title">{{ item.title }}</span>
                    </div>
                    <div class="table__item">
                      {{ item.price }}
                    </div>
                    <div class="table__item">
                      {{ 'x1' }}
                    </div>
                    <div class="table__item">
                      {{ item.price }}
                    </div>
                    <div class="table__button">
                      <div @click="deleteAdd(index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="totalEditList.length > 0">
                <!-- <div style="padding-top: 15px; padding-bottom: 10px">價格編輯</div> -->
                <div class="table__box" style="margin-top: 10px">
                  <div v-for="(item, index) in totalEditList" :key="index" class="table__row">
                    <div class="table__title">
                      {{ totalEditTitle(item.type) }}
                      <span v-if="item.title"
                        ><br />
                        ({{ item.title }})</span
                      >
                    </div>
                    <div class="table__item"> {{ item.price }} <span v-if="item.type === '%'">%</span> </div>
                    <div class="table__item">
                      {{ 'x1' }}
                    </div>
                    <div class="table__item">
                      <span v-if="item.type === '+'">+ {{ item.price }}</span>
                      <span v-if="item.type === '-'">- {{ item.price }}</span>
                      <span v-if="item.type === '%'">- {{ item.discount }}</span>
                    </div>
                    <div class="table__button">
                      <div @click="deleteTotalEdit(index)"><BaseIcon name="trash-alt"></BaseIcon></div>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <div class="table__box" style="margin-top: 10px">
              <div class="table__row">
                <div class="table__title"> 應付金額 </div>
                <div class="table__single">
                  <span v-if="submitDataPrepaid.prepaidId"> {{ currentBuyPrepaid.price }} + </span>
                  {{ submitPriceTotal }}
                </div>
                <div class="table__button"> </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  height: calc(100% - 128px);
  position: relative;
}
.table {
  padding: 20px 30px 0;
  // height: calc(100% - 128px);
  &:global {
    &.isOutSide {
      // height: calc(100% - 90px);
    }
  }
  // overflow: auto;
  :global {
    .table {
      &__head {
        background-color: #e5e7eb;
        display: flex;
        padding: 10px;
        justify-content: space-between;
        margin-bottom: 10px;
        &.isEdit {
          background-color: #fff;
          margin-bottom: 0;
        }
      }
      &__box {
        background-color: #fff;
        // margin-bottom: 10px;
      }
      &__row {
        display: flex;
        padding: 10px;
        justify-content: space-between;
        &:not(:last-child) {
          border-bottom: $color-border-base 1px solid;
        }
      }
      &__title {
        width: 30%;
        flex-shrink: 0;
      }
      &__item {
        width: 20%;
        text-align: right;
      }
      &__single {
        text-align: right;
        width: 60%;
      }
      &__button {
        width: 10%;
        text-align: right;
        color: $color-state-info;
        cursor: pointer;
      }
      &__scroll {
        max-height: calc(100vh - 480px);

        &.isOutSide {
          // max-height: calc(100vh - 550px);
          // height: calc(100% - 90px);
        }
        overflow: auto;
      }
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
</style>