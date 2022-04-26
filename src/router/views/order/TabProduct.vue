<script>
import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import { debounce } from 'lodash'

import {
  genderFilter,
  // orderStatusMap,
  orderStatusFilter,
  bookingStatusMap,
  bookingStatusFilter,
  orderPaymentMethodMap,
  orderPaymentMethodFilter,
  orderSourceMap,
  orderSourceFilter,
  paymentStatusMapFilter,
} from '@utils/filter-value-to-text'
import formatDate, { formatRequestData } from '@utils/format-date'

import pageMixin from '@src/mixins/pagination'
// import fetchListMixin from '@src/mixins/fetchList'

import { PortalTarget } from 'portal-vue'

export default {
  page: {
    title: '訂單查詢',
    meta: [{ name: 'description', content: 'Order List' }],
  },
  components: {
    BaseButtonDialog,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
    OrderForm: () => lazyLoadComponent(import('@views/schedule/components/OrderForm')),
    PortalTarget,
  },
  filters: {
    genderFilter,
    orderStatusFilter,
    bookingStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
    paymentStatusMapFilter,
  },
  mixins: [pageMixin],
  data() {
    return {
      componentKey: 0,
      drawerVisible: false,
      drawerOrderData: '',
      getRowKeys(row) {
        return row.id
      },
      expandRowKeys: [],
      filterData: {
        status: '',
        search: '',
        source: '',
        dateType: 'create', // create 訂單成立日期、 use 訂單使用日期
        startDate: '',
        endDate: '',
        paymentMethod: 'All',
        productId: '',
        order_by: 'created_at',
        order: 'desc',
      },
      statusList: { ...bookingStatusMap },
      sourceList: Object.freeze(orderSourceMap),
      paymentMethodList: Object.freeze(orderPaymentMethodMap),
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一週',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一個月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三個月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      loadedOrders: [],
      queryProductName: '',
      tryingToGetOrder: false,
      tryingToExport: false,
      submitForm: [],
      submitRules: {
        title: [{ required: true, message: 'empty', trigger: 'change' }],
      },
      productList: [],
      isFilterChange: false,
    }
  },
  computed: {
    filterDateRange: {
      get() {
        return [this.filterData.startDate, this.filterData.endDate]
      },
      set(value) {
        const [start, end] = value || ['', '']
        this.filterData.startDate = start
        this.filterData.endDate = end
      },
    },
    fetchDataParams() {
      const routeQuery = this.$route.query
      const queryData = Object.assign(routeQuery, this.pageQuery)
      const { startDate, endDate, dateType, ...filterDataWithoutDate } = this.filterData
      const searchWithDate = startDate && endDate
      const searchParams = searchWithDate
        ? Object.assign(this.filterData, {
            startDate: formatRequestData(startDate),
            endDate: formatRequestData(endDate),
          })
        : filterDataWithoutDate
      return Object.assign(searchParams, queryData)
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchList',
      immediate: true,
    },
    filterData: {
      handler() {
        this.isFilterChange = true
        // console.log(this.isFilterChange)
      },
      deep: true,
    },
  },
  created() {
    this.tryToSearchProduct()
    if (this.$route.query.type === 'order') {
      this.tryToGetOrder(this.$route.query.id)
    }
    delete this.statusList['1']
    // this.test()
    // this.tryToSearchByInput=debounce(()=>{
    //     console.log(344)
    //     this.tryToFetchList()
    //   },300)
  },
  methods: {
    async handleExport() {
      if (this.tryingToExport) return
      this.tryingToExport = true
      const { fileName, csvData } = await this.$store.dispatch('order/simpleExport', this.fetchDataParams)
      const csvFormatData = csvData.map((row) => Object.values(row).join(',')).join('\n')

      const blob = new Blob(['\uFEFF', csvFormatData], {
        type: 'text/csv;charset=utf-8;',
      })

      const url = window.URL.createObjectURL(blob)

      const tempLink = document.createElement('a')
      tempLink.download = fileName
      tempLink.href = url
      tempLink.click()
      window.URL.revokeObjectURL(url)
      this.tryingToExport = false
    },
    tableRowClassName({ row }) {
      const rowStatus = row.status
      const usedStatus = row.groupSize / row.usedSize
      if (rowStatus === 0) return 'order--canceled'
      if (usedStatus === 1) return 'order--used'
      if (row.id === this.expandRowKeys[0]) return 'expandedRow'
    },
    async tryToGetOrder(orderId) {
      try {
        this.tryingToGetOrder = true
        this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
        this.drawerVisible = true
      } catch {
        // this.drawerVisible = false
      } finally {
        this.tryingToGetOrder = false
      }
    },
    async tryToFetchListFilter() {
      // 當篩選前不在第一頁的時候，跳回第一頁
      // console.log(this.isFilterChange)
      if (this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      const { items, productName, total } = await this.$store.dispatch('order/fetchList', this.fetchDataParams)
      // console.log('篩選搜尋')
      this.loadedOrders = items
      this.queryProductName = productName
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)

        // console.log(parseInt(this.$refs.pagination.total/this.$refs.pagination.pageSize))
      })
      this.isFilterChange = false
    },
    currentPageLimit() {
      const remainder = this.$refs.pagination.total % this.$refs.pagination.pageSize
      const qotient = this.$refs.pagination.total / this.$refs.pagination.pageSize
      const totalPage = remainder ? parseInt(qotient) + 1 : parseInt(qotient)
      if (this.currentPage > totalPage) {
        this.currentPage = totalPage
      }
    },
    async tryToFetchList() {
      // if(this.isFilterChange){
      //   this.currentPage = 1
      // }
      const { items, productName, total } = await this.$store.dispatch('order/fetchList', this.fetchDataParams)
      // console.log('一般搜尋')
      this.loadedOrders = items
      this.queryProductName = productName
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
        this.currentPageLimit()
      })
      // this.isFilterChange=false
    },
    clearSearchQuery() {
      this.$router.push(this.$route.path)
    },
    async tryToSearchProduct() {
      const { items } = await this.$store.dispatch('product/fetchList', { limit: 10000, page: 1 })
      this.productList = items
    },
    onCellClick(row, column, cell) {
      if (column.type === 'expand') return
      this.tryToGetOrder(row.id)
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
    handleExpand(row) {
      if (this.expandRowKeys[0] === row.id) {
        this.expandRowKeys = []
      } else {
        // this.expandRowKeys=[]
        this.expandRowKeys = [row.id]
      }
      // console.log(367)
    },
    sortChange({ column, prop, order }) {
      if (order) {
        this.filterData.order_by = prop
        this.filterData.order = order === 'ascending' ? 'asc' : 'desc'
        // this.filterData.page=1
        this.currentPage = 1
        this.tryToFetchList()
      }
      // console.log(column, prop, order)
    },
    tryToSearchByInput: debounce(function () {
      // console.log(this)
      this.tryToFetchList()
    }, 300),
    // paymentStatus(status){
    //   return status === 'PAID'
    // },
    // test(){
    //   console.log(this)
    //   return function(name){
    //     console.log(name)
    //   }(this)
    // }
    // tryToSearchByInput(){
    //   console.log(this)
    //   debounce(function(){
    //     console.log(this)
    //     this.tryToFetchList()
    //   },300)()
    //   // console.log(debounce)
    // }
  },
}
</script>

<template>
  <div>
    <div :class="$style.btnTop" class="btn-top-space-between">
      <div class="side">
        <el-button class="is-round" type="primary" @click="$router.push({ name: 'schedule-check-in' })"> <BaseIcon name="plus" /> 新增 </el-button>
        <el-button class="is-round" plain @click="handleExport"><BaseIcon name="file-export" /> 訂單匯出</el-button>
      </div>
      <div class="side">
        <el-input v-model.trim.lazy="filterData.search" clearable placeholder="輸入使用人姓名、手機號碼或訂單編號" @input="tryToSearchByInput">
          <BaseIcon slot="prefix" name="search" class="el-input__icon" />
        </el-input>
      </div>
    </div>
    <BaseTableSearch
      v-slot="{ fields }"
      class="isForTab"
      hide-action
      :default-value.sync="filterData"
      :class="$style.filter"
      @handleExport="handleExport"
      @reset="tryToFetchList"
      @tryToFetchList="tryToFetchListFilter"
    >
      <el-form-item prop="status" style="width: 130px">
        <el-select v-model="fields.status" placeholder="選擇訂單狀態" @change="tryToFetchListFilter">
          <el-option label="所有預約狀態" value></el-option>
          <el-option v-for="(status, statusValue) in statusList" :key="statusValue" :label="status.text" :value="statusValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="paymentMethod" style="width: 140px">
        <el-select v-model="fields.paymentMethod" placeholder="選擇付款方式" @change="tryToFetchListFilter">
          <el-option label="所有付款方式" value="All"></el-option>
          <el-option v-for="(label, value) in paymentMethodList" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="source">
        <el-select v-model="fields.source" placeholder="選擇訂單來源" >
          <el-option label="所有訂單來源" value></el-option>
          <el-option v-for="(label, value) in sourceList" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="productId" style="width: 130px">
        <el-select v-model="fields.productId" placeholder="選擇訂分店" @change="tryToFetchListFilter">
          <el-option label="所有分店" value></el-option>
          <el-option v-for="(product, index) in productList" :key="`product-${index}`" :label="product.name" :value="product.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 260px">
        <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          :picker-options="pickerOptions"
          @change="tryToFetchListFilter"
        ></el-date-picker>
      </el-form-item>
    </BaseTableSearch>
    <div class="el-table-wrapper">
      <el-table
        v-loading.fullscreen.lock="tryingToGetOrder"
        element-loading-text="取得訂單資訊中"
        :data="loadedOrders"
        :default-sort="{ prop: 'created', order: 'descending' }"
        :row-key="getRowKeys"
        :row-class-name="tableRowClassName"
        :expand-row-keys="expandRowKeys"
        @cell-click="onCellClick"
        @expand-change="handleExpand"
        @sort-change="sortChange"
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
              <div class="total Jost">應付總額 ${{ row.allPayTotal }} </div>
              <div v-if="row.allRefundTotal > 0" class="total Jost alert-word">退款 - {{ row.allRefundTotal }}</div>
              <div class="total Jost">實付總額 ${{ row.allActualPayTotal }} </div>
              <div v-if="row.allUnpaidTotal > 0" class="unpaid Jost">未付款金額 ${{ row.allUnpaidTotal }}</div>
            </div>
          </div>
        </el-table-column>
        <el-table-column v-slot="{ row }" prop="created_at" label="#訂單編號" min-width="150" sortable="custom">
          <div class="Jost">{{ `#${row.id}` }}</div>
          <div>{{ row.created | formatDate('dateTime') }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="付款狀態與方式" prop="paymentMethod" min-width="150" sortable="custom">
          <template v-if="row.status === 0">
            <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
          </template>
          <template v-else>
            <BaseStateLabel :state="row.paymentStatus | paymentStatusMapFilter('color')" text>{{ row.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
            <br />
            <BaseStateLabel state="info" text>{{ row.paymentMethod | orderPaymentMethodFilter }}</BaseStateLabel>
          </template>
        </el-table-column>
        <el-table-column v-slot="{ row }" prop="status" label="預約狀態" min-width="120" sortable="custom">
          <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
        </el-table-column>
        <el-table-column v-slot="{ row }" min-width="150" label="使用人資訊">
          <div>{{ row.fullName }} {{ row.gender | genderFilter }}</div>
          <div>{{ `${row.phoneCode} ${row.phoneNumber}` }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" min-width="140" label="訂購項目" prop="startDate" sortable="custom">
          <div>
            <b>{{ row.productName }}</b
            ><br />
            {{ row.params[0].title }}
          </div>
          <div>{{ row.date | formatDate }} {{ row.time }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" min-width="80" label="總金額" prop="total">
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
    </div>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <BaseButtonDialog only-dialog floating />
    <!-- <BaseButtonDialog button-tooltip="匯出訂單 CSV 檔" button-icon-name="file-export" only-button floating @opened="handleExport" /> -->
    <el-drawer
      ref="orderFormEdit"
      class="only-close"
      :visible.sync="drawerVisible"
      append-to-body
      :size="$root.isSmallDevice ? '100%' : '90%'"
      destroy-on-close
      :wrapper-closable="false"
      custom-class="order-drawer"
      @closed="componentKey++"
    >
      <OrderForm ref="orderDetail" :key="componentKey" :default-value.sync="drawerOrderData" @update="tryToFetchList" />
    </el-drawer>
    <!-- <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <PortalTarget slot="title" name="drawer-header"></PortalTarget>
      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToFetchList" />
    </el-drawer> -->
  </div>
</template>
<style lang="scss" module>
:global {
  :local(.filter) {
    & > div {
      // flex-wrap: wrap;
      .el-form-item {
        width: 20%;

        @include max-sm {
          width: 100% !important;
        }
      }
      & + button {
        align-self: baseline;
      }
    }
  }
}
.order-expanded {
  :global {
    .item {
      display: flex;
      align-items: center;
      padding: 20px;
      position: relative;
      align-items: flex-start;
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
.btnTop {
  @include max-sm {
    display: flex;
    flex-direction: column;
  }

  :global {
    .side {
      @include max-sm {
        display: flex;
        // flex-direction: column;
      }

      &:first-child {
        @include max-sm {
          margin-bottom: 0.5rem;
          .el-button {
            flex: 1 0 0;
            width: 50%;
          }
        }
      }

      .el-input {
        @include max-sm {
          margin-left: 0 !important;
          width: 100%;
        }
      }
    }
  }
}
</style>
