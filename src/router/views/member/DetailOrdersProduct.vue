<script>
import lazyLoadComponent from '@router/lazyload-component'
import { orderStatusFilter, orderSourceFilter,orderPaymentMethodFilter,bookingStatusFilter,paymentStatusMapFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import pageMixin from '@src/mixins/pagination'
import { PortalTarget } from 'portal-vue'

export default {
  components: {
    PortalTarget,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
    OrderForm: () => lazyLoadComponent(import('@views/schedule/components/OrderForm')),
  },
  filters: {
    orderStatusFilter,
    orderSourceFilter,
    orderPaymentMethodFilter,
    formatDate,
    bookingStatusFilter,
    paymentStatusMapFilter,
  },
  mixins: [pageMixin],
  data() {
    return {
      componentKey: 0,
      loadedOrders: [],
      tryingToGetOrder: false,
      drawerVisible: false,
      drawerOrderData: '',
      filterData:{
        order_by:'created_at',
        order:'desc'
      }
    }
  },
  watch: {
    currentPage: {
      handler: 'tryToSearchOrder',
      immediate: true,
    },
  },
  methods: {
    calcRowClassName({ row }) {
      const orderStatus = row.status
      const orderUsedStatus = row.groupSize / row.usedSize

      if (orderStatus === 0) return 'order--canceled'
      if (orderUsedStatus === 1) return 'order--used'
    },
    async tryToGetOrder(row) {
      this.tryingToGetOrder = true
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', row.id)
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    async tryToSearchOrder() {
      const { items, total } = await this.$store.dispatch('order/fetchList', Object.assign({ 
        memberId: this.$route.params.memberId, 
          paymentMethod: 'All',
          order_by:this.filterData.order_by,
          order:this.filterData.order,
        }, this.pageQuery,
       
      ))
      this.loadedOrders = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
    sortChange({column, prop, order}){
      if(order){
  
        this.filterData.order_by = prop
        this.filterData.order = order==='ascending'?'asc':'desc'
        this.currentPage=1
        this.tryToSearchOrder()
      }
      // console.log(column, prop, order)
    }
  },
}
</script>

<template>
  <div>
    <div class="el-table-wrapper">
      <el-table
        v-loading.fullscreen.lock="tryingToGetOrder"
        element-loading-text="取得訂單資訊中"
        :data="loadedOrders"
        :default-sort="{ prop: 'created', order: 'descending' }"
        :row-class-name="calcRowClassName"
        @row-click="tryToGetOrder"
        @sort-change="sortChange"
      >
        <el-table-column v-slot="{ row }" prop="created_at" min-width="160" label="#編號與成立時間"  sortable="custom">
          <span
            >#{{ row.id }} <br />
            {{ row.created | formatDate }}

            {{ row.created | formatDate('time') }}
          </span>
        </el-table-column>
        <el-table-column v-slot="{ row }" prop="status" min-width="130" label="訂單狀態" sortable="custom">
          <BaseStateLabel :state="row.paymentStatus | paymentStatusMapFilter('color')" text>{{ row.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
          <br />
          <BaseStateLabel state="info" text>{{ row.paymentMethod | orderPaymentMethodFilter }}</BaseStateLabel>
          <!-- <BaseStateLabel state="info" text>{{ row.source | orderSourceFilter }}</BaseStateLabel> -->
        </el-table-column>
        <el-table-column  v-slot="{ row }" min-width="100" label="預約狀態" >
          <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
        </el-table-column>

        <el-table-column v-slot="{ row }" prop="startDate" min-width="200" label="服務項目 / 服務時間"  sortable="custom">
          <div>{{row.productName}} {{ row.params[0].title }}</div>
          <div>{{ row.date | formatDate }} {{ row.time }}</div>
          <div>${{ row.allActualPayTotal }}</div>
        </el-table-column>

        <!-- <el-table-column v-slot="{ row }" prop="created" label="成立時間" sortable width="110">
        <span>
          {{ row.created | formatDate }}
          <br />
          {{ row.created | formatDate('time') }}
        </span>
      </el-table-column> -->
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
        @update="tryToSearchOrder"
      />
    </el-drawer>
    <!-- <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>

      <PortalTarget slot="title" name="drawer-header"></PortalTarget>

      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToSearchOrder" />
    </el-drawer> -->
  </div>
</template>
