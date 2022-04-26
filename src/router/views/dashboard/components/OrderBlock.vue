<script>
import lazyLoadComponent from '@router/lazyload-component'
import {
  genderFilter,
  orderStatusMap,
  orderStatusFilter,
  bookingStatusMap,
  bookingStatusFilter,
  orderPaymentMethodMap,
  orderPaymentMethodFilter,
  orderSourceMap,
  orderSourceFilter,
  paymentStatusMapFilter
} from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import { PortalTarget } from 'portal-vue'

export default {
  components: {
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
      OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
      OrderForm: () => lazyLoadComponent(import('@views/schedule/components/OrderForm')),
      PortalTarget
  },
  filters: {
    genderFilter,
    orderStatusFilter,
    bookingStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
    paymentStatusMapFilter
  },
  data() {
    return {
      componentKey:0,
      loading: false,
      drawerVisible: false,
      drawerOrderData: '',
      getRowKeys(row) {
            return row.id;
        },
        expandRowKeys:[],
      orderInfo: {
        ordersCount: 0,
        prepaidOrdersCount: 0,
        totalSales: 0,
        orders: [],
      },
    }
  },
  created() {
    this.tryToFetchOrders()
  },
  methods: {
    async tryToFetchOrders() {
      this.loading = true
      this.orderInfo = await this.$store.dispatch('dashboard/fetchOrders')
      this.loading = false
    },
    redirectOrders() {
      this.$router.push({
        name: 'orders',
      })
    },
    tableRowClassName({ row }) {
      const rowStatus = row.status
      const usedStatus = row.groupSize / row.usedSize
      if (rowStatus === 0) return 'order--canceled'
      if (usedStatus === 1) return 'order--used'
      if (row.id===this.expandRowKeys[0]) return 'expandedRow'
    },
    async tryToFetchList() {
      this.orderInfo = await this.$store.dispatch('order/fetchList')
    },
    onCellClick(row, column, cell) {
      if (column.type === 'expand') return
      this.tryToGetOrder(row.id)
    },
    async tryToGetOrder(orderId) {
      this.tryingToGetOrder = true
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    excludeCanceledPrice(order) {
      let total = order.allTotal
      // if (order.status === 0) total -= order.priceTotal
      if (order.addOrders.length) {
        total = order.addOrders
          .map((subOrder) => subOrder.items)
          .flat()
          .reduce((acc, item) => (item.status === 0 ? acc + item.price : acc), total)
      }
      // console.log(total)
      return total
    },
    handleExpand(row){
      if(this.expandRowKeys[0]===row.id){
      this.expandRowKeys=[]
      }else{
        // this.expandRowKeys=[]
        this.expandRowKeys=[row.id]
      }
      // console.log(367)
    }
  },
}
</script>

<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <el-row :gutter="15" class="Jost">
        <el-col :sm="6" :span="24" class="mb-2 mb-sm-0">
          <el-button class="large-btn" type="primary" @click="redirectOrders"
            >查看訂單紀錄<BaseIcon name="file-invoice-dollar"
          /></el-button>
        </el-col>
        <el-col v-loading="loading" :sm="6" :span="24" class="mb-2 mb-sm-0">
          <el-card class="card-statistics">
            <div class="card-statistics-info">
              <div class="card-statistics-title">近七日預約次數</div>
              <div class="card-statistics-count">{{
                orderInfo.ordersCount
              }}</div>
            </div>
            <el-avatar :size="50"> <BaseIcon name="flag" /> </el-avatar>
          </el-card>
        </el-col>
        <el-col v-loading="loading" :sm="6" :span="24" class="mb-2 mb-sm-0">
          <el-card class="card-statistics">
            <div class="card-statistics-info"
              ><div class="card-statistics-title">包月方案銷售次數</div
              ><div class="card-statistics-count">{{
                orderInfo.prepaidOrdersCount
              }}</div></div
            >
            <el-avatar :size="50"> <BaseIcon name="piggy-bank" /> </el-avatar>
          </el-card>
        </el-col>
        <el-col v-loading="loading" :sm="6" :span="24" class="mb-2 mb-sm-0">
          <el-card class="card-statistics">
            <div class="card-statistics-info"
              ><div class="card-statistics-title">近七日銷售總額</div
              ><div class="card-statistics-count"
                >${{ orderInfo.totalSales }}</div
              ></div
            >
            <el-avatar :size="50"> <BaseIcon name="dollar-sign" /> </el-avatar>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="header">
      <h3 class="block-title">
        最新預約紀錄
      </h3>
    </div>

    <el-table
      v-loading="loading"
      element-loading-text="取得訂單資訊中"
      :data="orderInfo.orders"
      :default-sort="{ prop: 'created', order: 'descending' }"
      :row-class-name="tableRowClassName"
      :row-key="getRowKeys"
      :expand-row-keys="expandRowKeys"
      @cell-click="onCellClick"
      @expand-change="handleExpand"
    >
      <el-table-column v-slot="{ row }" type="expand">
          <div :class="$style['order-expanded']">
            <!-- <div class="header item">
              <div>#訂單編號</div>
              <div>服務項目</div>
              <div>付款狀態</div>
              <div>付款方式</div>
              <div>金額</div>
            </div> -->
            <div class="item">
              <div>
                <div class="Jost">{{ `#${row.id}` }}</div>
              </div>
              <!-- <div>
                <div style="line-height: 20px">
                  <b>{{ row.productName }} {{ row.params[0].title }}</b>
                </div>
              </div> -->
              <div>
                <template v-if="row.status === 0">
                  <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
                </template>
                <template v-else>
                  <BaseStateLabel :state="row.paymentStatus | paymentStatusMapFilter('color')" text>{{ row.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
                </template>
              </div>
              <div style="width: 30%">
                <BaseStateLabel state="info" text>{{ row.paymentMethod | orderPaymentMethodFilter }}</BaseStateLabel>
              </div>
              <div class="order-table-items">
                <div v-for="(item, itemIndex) in row.params" :key="itemIndex" class="order-item">
                  <div>
                    <div style="color: #41695b">
                      <span v-if="item.type === 'coupon'">優惠券</span>
                      <span v-if="item.type === '+'">加價</span>
                      <span v-if="item.type === '-'">減價</span>
                      <span v-if="item.type === '%'">折扣</span>
                      {{ item.title }}
                    </div>
                  </div>

                  <div>
                    <div class="Jost">{{ item.total }}</div>
                  </div>
                </div>
                <div class="order-item">
                  <div>小計</div>
                  <div>{{ row.payTotal }}</div>
                </div>
              </div>

              <!-- <div>
                <div class="Jost">${{ row.payTotal }}</div>
              </div> -->
            </div>
            <div v-for="(order, index) in row.childrenOrders" :key="index" class="item">
              <div>
                <div class="Jost">{{ `#${order.id}` }}</div>
              </div>
              <div>
                <BaseStateLabel :state="order.status | orderStatusFilter('color')" text>{{ order.status | orderStatusFilter('text') }}</BaseStateLabel>
              </div>
              <div style="width: 30%">
                <BaseStateLabel state="info" text>{{ order.paymentMethod | orderPaymentMethodFilter }}</BaseStateLabel>
              </div>
              <div class="order-table-items">
                <div v-for="(item, itemIndex) in order.items" :key="itemIndex" class="order-item">
                  <div>
                    <div style="color: #41695b">
                      <span v-if="item.type === 'coupon'">優惠券</span>
                      <span v-if="item.type === '+'">加價</span>
                      <span v-if="item.type === '-'">減價</span>
                      <span v-if="item.type === '%'">折扣</span>
                      {{ item.title }}
                    </div>
                  </div>

                  <div>
                    <div class="Jost">{{ item.total }}</div>
                  </div>
                </div>
                <div class="order-item">
                  <div>小計</div>
                  <div>{{ order.payTotal }}</div>
                </div>
              </div>
            </div>
            <div class="footer">
              <div class="total Jost">應付總額 ${{  row.allPayTotal }} </div>
              <div v-if="row.allRefundTotal > 0" class="total Jost alert-word">退款 - {{ row.allRefundTotal }}</div>
              <div class="total Jost">實付總額 ${{  row.allActualPayTotal }} </div>
              <div v-if="row.allUnpaidTotal > 0" class="unpaid Jost">未付款金額 ${{ row.allUnpaidTotal }}</div>
            </div>
          </div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="#訂單編號" prop="created" min-width="150" sortable>
          <div class="Jost">{{ `#${row.id}` }}</div>
          <div>{{ row.created | formatDate('dateTime') }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="付款狀態與方式" prop="paymentMethod" min-width="150" sortable>
           <template v-if="row.status === 0">
            <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
          </template>
          <template v-else>
            <BaseStateLabel :state="row.paymentStatus | paymentStatusMapFilter('color')" text>{{ row.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
            <br />
            <BaseStateLabel state="info" text>{{ row.paymentMethod | orderPaymentMethodFilter }}</BaseStateLabel>
          </template>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="預約狀態" prop="status" min-width="120" sortable>
          <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="使用人資訊" width="150">
          <div>{{ row.fullName }} {{ row.gender | genderFilter }}</div>
          <div>{{ `${row.phoneCode} ${row.phoneNumber}` }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="訂購項目" prop="date" min-width="140" sortable>
          <div>
            <b>{{ row.productName }}</b
            ><br />
            {{ row.params[0].title }}
          </div>
          <div>{{ row.date | formatDate }} {{ row.time }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="總金額" min-width="80">
          <div class="Jost">${{ row.allActualPayTotal }}</div>
        </el-table-column>
        <el-table-column min-width="40">
          <el-tooltip content="查看訂單詳情" placement="top">
            <el-button type="text">
              <BaseIcon name="ellipsis-v" />
            </el-button>
          </el-tooltip>
        </el-table-column>
    </el-table>
    <el-drawer ref="orderFormEdit" class="only-close"
      :visible.sync="drawerVisible" 
      append-to-body 
      :size="$root.isSmallDevice ? '100%' : '90%'" 
      destroy-on-close
      :wrapper-closable = "false"
      custom-class="order-drawer"
      @closed="componentKey++"
    > 
      <OrderForm 
        ref="orderDetail"
        :key="componentKey"
        :default-value.sync="drawerOrderData" 
        @update="tryToFetchOrders"
      />
    </el-drawer>
     <!-- <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <PortalTarget slot="title" name="drawer-header"></PortalTarget>
      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToFetchOrders" />
    </el-drawer> -->
  </el-card>
</template>
<style lang="scss" module>
.order-expanded {
  :global {
    .item {
      display: flex;
      align-items: center;
      padding: 20px;
      position: relative;
      &.header {
        // background-color: #e2e2df;
        padding: 15px 20px;
      }
      &.header,
      &.no-divider {
        &:after {
          display: none;
        }
      }
      > div {
        flex: 1 1 auto;
        padding: 0 10px;
        &.vs-hide {
          visibility: hidden;
        }
        &.cancel {
          text-decoration: line-through;
          color: #919191;
        }
        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          text-align: right;
          padding-right: 0;
        }
        &:nth-child(1) {
          width: 25%;
        }
        &:nth-child(2) {
          width: 20%;
        }
        &:nth-child(3) {
          width: 10%;
        }
        &:nth-child(4) {
          width: 10%;
        }
        &:nth-child(5) {
          width: 10%;
        }
      }
      &:after {
        content: '';
        position: absolute;
        border-bottom: 1px solid $color-border-base;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0 20px;
      }
    }
    .footer {
      text-align: right;
      padding: 20px;
      > div {
        line-height: 20px;
      }
      .total {
        color: $color-text-primary;
        margin-bottom: 10px;
      }
      .unpaid {
        color: #e35d5d;
      }
    }
  }
}
</style>
