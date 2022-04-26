<script>
import lazyLoadComponent from '@router/lazyload-component'
import { orderStatusFilter, orderSourceFilter } from '@utils/filter-value-to-text'
import formatDate, { formatLunarDate } from '@utils/format-date'
import pageMixin from '@src/mixins/pagination'
import { PortalTarget } from 'portal-vue'

export default {
  components: {
    PortalTarget,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
  },
  filters: {
    orderStatusFilter,
    orderSourceFilter,
    formatDate,
    formatLunarDate,
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
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', row.id)
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    async tryToSearchOrder() {
      const { items, total } = await this.$store.dispatch('order/fetchList', Object.assign({ memberId: this.$route.params.memberId, paymentMethod: 'All' }, this.pageQuery))
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
      :class="$style.sm"
      :data="loadedOrders"
      :default-sort="{ prop: 'date', order: 'descending' }"
      :row-class-name="calcRowClassName"
      :height="350"
      @row-click="tryToGetOrder"
    >
      <el-table-column v-slot="{ row }" prop="id" label="#訂單編號" sortable>
        <span>#{{ row.id }}</span>
      </el-table-column>
      <el-table-column prop="productName" label="訂購項目"></el-table-column>
      <el-table-column v-slot="{ row }" prop="status" label="訂單狀態" width="100" sortable>
        <BaseStateLabel :state="row.status | orderStatusFilter('color')" text>{{ row.status | orderStatusFilter('text') }}</BaseStateLabel>
        <br />
        <BaseStateLabel state="info" text>{{ row.source | orderSourceFilter }}</BaseStateLabel>
      </el-table-column>
    </el-table>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <!-- header -->
      <PortalTarget name="drawer-header" slot="title"></PortalTarget>

      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToSearchOrder" @close="drawerVisible = false" />
    </el-drawer>
  </div>
</template>
<style lang="scss" module>
.sm {
  :global {
    .el-table__body {
      font-size: 12px;
    }
  }
}
</style>
