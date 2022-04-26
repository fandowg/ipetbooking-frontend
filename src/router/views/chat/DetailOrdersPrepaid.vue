<script>
import lazyLoadComponent from '@router/lazyload-component'
import { orderStatusFilter, orderSourceFilter, orderPaymentMethodFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import pageMixin from '@src/mixins/pagination'
import { PortalTarget } from 'portal-vue'

export default {
  components: {
    PortalTarget,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderDetail: () => lazyLoadComponent(import('@components/PrepaidOrderDetail')),
  },
  filters: {
    orderStatusFilter,
    orderSourceFilter,
    orderPaymentMethodFilter,
    formatDate,
  },
  mixins: [pageMixin],
  data() {
    return {
      loadedOrders: [],
      tryingToGetOrder: false,
      drawerVisible: false,
      drawerOrderData: '',
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
      this.drawerOrderData = await this.$store.dispatch('prepaid/fetchOrderSingle', row.id)
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    async tryToSearchOrder() {
      const { items, total } = await this.$store.dispatch('prepaid/fetchOrders', Object.assign({ memberId: this.$route.params.memberId, paymentMethod: 'All' }, this.pageQuery))
      this.loadedOrders = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
  },
}
</script>

<template>
  <div>
    <el-table
      v-loading.fullscreen.lock="tryingToGetOrder"
      element-loading-text="取得訂單資訊中"
      :data="loadedOrders"
      :default-sort="{ prop: 'date', order: 'descending' }"
      :row-class-name="calcRowClassName"
      :height="350"
      @row-click="tryToGetOrder"
    >
      <el-table-column v-slot="{ row }" label="#訂單編號" width="220" sortable>
        <div>{{ `#${row.orderNo}` }}</div>
        <div>{{ row.created | formatDate('dateTime') }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="狀態與來源" width="120" sortable>
        <BaseStateLabel :state="row.status | orderStatusFilter('color')" text>{{ row.status | orderStatusFilter('text') }}</BaseStateLabel>
        <br />
        <BaseStateLabel state="info" text>{{ row.source | orderSourceFilter }}</BaseStateLabel>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="付款方式" width="100" sortable>{{ row.paymentMethod | orderPaymentMethodFilter }}</el-table-column>

      <el-table-column v-slot="{ row }" label="包月方案名稱">
        <div>
          <b>{{ row.prepaidTitle }}</b>
        </div>
        <div>{{ row.date | formatDate }} {{ row.time }}</div>
      </el-table-column>
      <el-table-column width="50">
        <el-tooltip content="查看訂單詳情" placement="top">
          <el-button type="text">
            <BaseIcon name="ellipsis-v" />
          </el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'">
      <!-- header -->
      <PortalTarget name="drawer-prepaid-header" slot="title"></PortalTarget>
      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToSearchOrder" />
    </el-drawer>
  </div>
</template>
