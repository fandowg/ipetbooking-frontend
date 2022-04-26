<script>
import lazyLoadComponent from '@router/lazyload-component'
import {
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
  },
  filters: {
    orderStatusFilter,
    orderSourceFilter,
    orderPaymentMethodFilter,
    formatDate,
  },
  mixins: [pageMixin],
  props:{
    memberInfoId:{
      type:String,
      default:''
    }
  },
  data() {
    return {
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
      this.drawerOrderData = await this.$store.dispatch(
        'prepaid/fetchOrderSingle',
        row.id
      )
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    async tryToSearchOrder() {
      const { items, total } = await this.$store.dispatch(
        'prepaid/fetchOrders',
        Object.assign(
          { 
            memberId: this.memberInfoId, 
            paymentMethod: 'All' ,
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
      :default-sort="{ prop: 'date', order: 'descending' }"
      :row-class-name="calcRowClassName"
      @row-click="tryToGetOrder"
       @sort-change="sortChange"
    >
      <el-table-column v-slot="{ row }" label="#訂單編號" prop="created_at" min-width="160" sortable="custom">
        <div>{{ `#${row.orderNo}` }}</div>
        <div>{{ row.created | formatDate('dateTime') }}</div>
      </el-table-column>


      <el-table-column v-slot="{ row }" min-width="150" label="包月方案/次數與期限">
        <div>
          <b>{{ row.prepaidTitle }}</b>
          
        </div>
        <div>${{ row.total }}</div>
        <div><b>剩餘：{{ row.times - row.used }} / {{ row.times }}</b></div>
      </el-table-column>
      <!-- <el-table-column v-slot="{ row }" min-width="140" label="次數與期限">
        <div>
          <b>剩餘：{{ row.times - row.used }} / {{ row.times }}</b>
        </div>
        <div v-if="row.status === 1">到期：{{row.expiredDate ? row.expiredDate : '' | formatDate}}{{row.expiredDate ? '' : '無使用期限' }}</div>
      </el-table-column> -->

    </el-table>
    </div>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'">
      <!-- header -->
      <PortalTarget slot="title" name="drawer-prepaid-header"></PortalTarget>
      <OrderDetail
        ref="orderDetail"
        :default-value.sync="drawerOrderData"
        @update="tryToSearchOrder"
      />
    </el-drawer>
  </div>
</template>
