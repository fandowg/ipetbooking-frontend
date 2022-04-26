<script>
import lazyLoadComponent from '@router/lazyload-component'
import {
  genderFilter,
  orderStatusFilter,
  orderSourceFilter,
  orderPaymentMethodFilter,
} from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

import pageMixin from '@src/mixins/pagination'
import { PortalTarget } from 'portal-vue'

export default {
  components: {
    PortalTarget,
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderDetail: () =>
      lazyLoadComponent(import('@components/PrepaidOrderDetail')),
    OrderForm: () => import('@components/PrepaidOrderForm'),
  },
  filters: {
    genderFilter,
    orderStatusFilter,
    orderSourceFilter,
    orderPaymentMethodFilter,
    formatDate,
  },
  mixins: [pageMixin],
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loadedOrders: [],
      tryingToGetOrder: false,
      drawerVisible: false,
      drawerOrderData: '',
      drawerMode: 'detail',
      filterData:{
        order_by:'created_at',
        order:'desc'
      },
      selectPrice:0
    }
  },
  computed: {
    enabledCreateOrder() {
      return (
        this.defaultValue.infinity === 1 ||
        (this.defaultValue.infinity === 0 &&
          this.defaultValue.inventory > this.defaultValue.qty)
      )
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchOrder',
      immediate: true,
    },
    drawerVisible(value){
      if(!value){
        this.selectPrice = 0
      }

    }
  },
  methods: {
    updateDrawerMode(value) {
      if (this.drawerMode !== value) this.drawerMode = value
    },
    calcRowClassName({ row }) {
      const orderStatus = row.status
      const orderUsedStatus = row.groupSize / row.usedSize

      if (orderStatus === 0) return 'order--canceled'
      if (orderUsedStatus === 1) return 'order--used'
    },
    async tryToGetOrder(row) {
      this.tryingToGetOrder = true
      this.drawerOrderData = await this.$store.dispatch(
        'prepaid/fetchOrderSingle',
        row.id
      )
      this.tryingToGetOrder = false
      this.updateDrawerMode('detail')
      this.drawerVisible = true
    },
    async tryToFetchOrder() {
      // console.log(orderby)
      const { items, total } = await this.$store.dispatch(
        'prepaid/fetchOrders',
        Object.assign(
          { 
            groupOrdering:this.defaultValue.groupOrdering,
            // prepaidId: this.defaultValue.id,
            paymentMethod: 'All',
            order_by:this.filterData.order_by,
            order:this.filterData.order,
          },
          this.pageQuery
        )
      )

      this.loadedOrders = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
    handleCreateOrder() {
      this.updateDrawerMode('add')
      this.drawerVisible = true
    },
    handleCloseDrawer() {
      this.$refs.drawer.closeDrawer()
      // this.drawerVisible = false
    },
    handleUpdateOrders() {
      this.$emit('update:defaultValue', {
        ...this.defaultValue,
        qty: this.defaultValue.qty + 1,
      })
      this.tryToFetchOrder()
      this.handleCloseDrawer()
    },
     sortChange({column, prop, order}){
      if(order){
        this.filterData.order_by = prop
        this.filterData.order = order==='ascending'?'asc':'desc'
        this.currentPage=1
        this.tryToFetchOrder()
      }
      // console.log(column, prop, order)
    }
  },
}
</script>

<template>
  <div>
    <BasePageHeader title="此包月方案客戶購買紀錄">
      <template v-slot:right>
        <el-button
          class="is-round"
          :disabled="!enabledCreateOrder"
          type="primary"
          @click="handleCreateOrder"
        >代客購買此包月方案</el-button>
      </template>
    </BasePageHeader>
    <el-table
      v-loading.fullscreen.lock="tryingToGetOrder"
      element-loading-text="取得訂單資訊中"
      :data="loadedOrders"
      :default-sort="{ prop: 'created', order: 'descending' }"
      :row-class-name="calcRowClassName"
      @row-click="tryToGetOrder"
      @sort-change="sortChange"
    >
      <el-table-column v-slot="{ row }" label="#訂單編號" prop="created_at" min-width="170" sortable="custom">
        <span>{{ `#${row.orderNo}` }}</span>
        <div>{{ row.created | formatDate('dateTime') }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="狀態與來源" prop="status" min-width="120" sortable="custom">
        <BaseStateLabel
          :state="row.status | orderStatusFilter('color') "
          text
        >{{ row.status | orderStatusFilter('text') }}</BaseStateLabel>
        <br />
        <BaseStateLabel state="info" text>{{ row.source | orderSourceFilter }}</BaseStateLabel>
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        label="體型"
        min-width="80"


      >{{ row.sizeTitle }}</el-table-column>
      <el-table-column
        v-slot="{ row }"
        label="付款方式"
        min-width="100"
        prop="paymentMethod"
        sortable="custom"
      >{{ row.paymentMethod | orderPaymentMethodFilter }}</el-table-column>
       
      <el-table-column v-slot="{ row }" label="客戶資訊" min-width="120">
        <div>{{ row.fullName }} {{ row.gender | genderFilter }}</div>
        <div>{{ `${row.phoneCode} ${row.phoneNumber}` }}</div>
      </el-table-column>
      <el-table-column min-width="40">
        <el-tooltip content="查看訂單詳情" placement="top">
          <el-button type="text">
            <BaseIcon name="ellipsis-v" />
          </el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <el-drawer ref="drawer" :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" :destroy-on-close="true">
      <template v-if="drawerMode === 'detail'">
        <!-- header -->
        <PortalTarget slot="title" name="drawer-prepaid-header"></PortalTarget>
        <OrderDetail
          ref="orderDetail"
          :default-value.sync="drawerOrderData"
          @update="tryToFetchOrder"
        />
      </template>
      <template v-else>
        <PortalTarget slot="title" name="drawer-prepaid-header"></PortalTarget>
        <h4>{{ defaultValue.title }}</h4>
        <h5>{{ `${defaultValue.times}次`}}<span v-if="selectPrice">{{` / $${selectPrice}` }}</span></h5>
        <OrderForm :prepaid="defaultValue" :select-price.sync="selectPrice" @store="handleUpdateOrders" @cancel="handleCloseDrawer" />
      </template>
    </el-drawer>
  </div>
</template>
