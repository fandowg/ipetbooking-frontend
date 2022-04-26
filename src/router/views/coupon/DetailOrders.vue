<script>
import lazyLoadComponent from '@router/lazyload-component'
import { orderStatusFilter, orderSourceFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
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
  },
  data() {
    return {
      loadedOrders: [],
      tryingToGetOrder: false,
      drawerVisible: false,
      drawerOrderData: '',
    }
  },

  watch: {
    $route: {
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
      this.$store.dispatch('coupon/getOrders', this.$route.params.couponId).then(({ items }) => {
        this.loadedOrders = items
      })
    },
  },
}
</script>

<template>
  <div>
    <BasePageHeader title="使用此優惠券之所有訂單" />
    <el-table
      v-loading.fullscreen.lock="tryingToGetOrder"
      element-loading-text="取得訂單資訊中"
      :data="loadedOrders"
      :default-sort="{ prop: 'date', order: 'descending' }"
      :row-class-name="calcRowClassName"
      @row-click="tryToGetOrder"
    >
      <el-table-column v-slot="{ row }" min-width="160" prop="id" label="#訂單編號" sortable>
        <span>#{{ row.id }}</span>
      </el-table-column>
      <el-table-column v-slot="{ row }" min-width="100" prop="status" label="訂單狀態" sortable>
        <BaseStateLabel :state="row.status | orderStatusFilter('color')" text>{{ row.status | orderStatusFilter('text') }}</BaseStateLabel>
        <br />
        <BaseStateLabel state="info" text>{{ row.source | orderSourceFilter }}</BaseStateLabel>
      </el-table-column>
      <el-table-column prop="productName" min-width="100" label="訂購項目"></el-table-column>

      <el-table-column v-slot="{ row }" prop="date" min-width="130" label="憑證使用日期"  sortable>
        <div>{{ row.date | formatDate }}</div>
        <div>{{ row.time }}</div>
      </el-table-column>

      <el-table-column v-slot="{ row }" prop="created" min-width="80" label="成立時間" sortable width="110">
        <span>
          {{ row.created | formatDate }}
          <br />
          {{ row.created | formatDate('time') }}
        </span>
      </el-table-column>
      <el-table-column  min-width="40">
        <el-tooltip content="查看訂單詳情" placement="top">
          <el-button type="text">
            <BaseIcon name="ellipsis-v" />
          </el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <!-- header -->
      <PortalTarget slot="title" name="drawer-header"></PortalTarget>
      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToSearchOrder" />
    </el-drawer>
  </div>
</template>
