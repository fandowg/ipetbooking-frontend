<script>
import OrderListItem from '@components/OrderListItem'
import OrderDetail from '@components/Order/OrderDetail'
import OrderForm from '@components/OrderForm'
import formatDate, { formatTimeRange } from '@utils/format-date'

import { inventoryCapacityFilter } from '@utils/filter-value-to-text'
import lazyLoadComponent from '@router/lazyload-component'

import BaseButtonDialog from '@components/BaseButtonDialog'
import { PortalTarget } from 'portal-vue'

const initData = () => {
  return {
    mode: 'list', // list 列表、single 查看單一訂單、add 新增訂單
    refundMode: false,
    tryingToFetchOrderList: false,
    orderDetailData: '',
    cancelForm: {
      id: '',
      status: '',
      note: '',
      refundUnit: '',
      refundValue: '',
    },
    orderList: [],
    tryingToExport: false,

    exportType: 'byOrder',
    dialogVisible: false,

    cKey: 0,
  }
}

export default {
  components: {
    OrderListItem,
    OrderDetail,
    OrderForm,
    BaseButtonDialog,
    PortalTarget,
    NotificationWrite: () => lazyLoadComponent(import('@components/NotificationWrite')),
  },
  filters: {
    formatDate,
    formatTimeRange,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    item: {
      type: Object,
      required: true,
    },
    productName: {
      type: String,
      default: '',
    },
    productType: {
      type: String,
      default: '',
    },
  },
  data() {
    return initData()
  },
  computed: {
    showAddOrderButton() {
      return (
        !this.refundMode && // 非取消／退款模式
        this.item.state === 1 && // 時段開放
        (this.item.infinity === 1 || this.item.qty !== this.item.inventory) // 時段額滿
      )
    },
    capacityStatus() {
      return inventoryCapacityFilter(this.item.qty, this.item.inventory, this.item.infinity)
    },
    allOrderIds() {
      return this.orderList.filter((order) => order.status !== 0).map((order) => order.id)
    },
  },
  methods: {
    async handleExport() {
      if (this.tryingToExport) return
      this.tryingToExport = true
      const { fileName, csvData } = await this.$store.dispatch('order/export', {
        productId: this.item.productId,
        inventoryId: this.item.id,
        type: this.exportType,
      })

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
    updateMode(value) {
      if (value === 'list') {
        this.tryToFetchOrderList()
      }
      this.mode = value
    },
    handleCloseDrawer() {
      Object.assign(this.$data, initData())
      this.$emit('update:visible', false)
    },
    async tryToGetOrder(orderId) {
      this.orderDetailData = await this.$store.dispatch('order/fetchSingle', orderId)
      this.updateMode('single')
    },
    async tryToFetchOrderList() {
      this.tryingToFetchOrderList = true

      this.orderList = await this.$store
        .dispatch('order/fetchInventoryList', {
          inventoryId: this.item.id,
          paymentMethod: 'All',
          paginate: '0',
        })
        .then(({ items }) => items)
      this.tryingToFetchOrderList = false
      if (this.$parent.componentName === 'TabCalendar') this.$emit('calendar')
    },
    closeDialog() {
      this.dialogVisible = false
    },
    onBaseButtonDialogOpend() {
      this.cKey += 1
    },
  },
}
</script>

<template>
  <el-drawer :visible="visible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" @open="tryToFetchOrderList" @close="handleCloseDrawer">
    <!-- header -->
    <PortalTarget v-if="mode === 'single' || mode === 'add'" name="drawer-header" slot="title"></PortalTarget>
    <!-- 查看訂單區塊 -->
    <template v-if="mode === 'single'">
      <el-page-header title="回到訂單列表" content="訂單詳細內容" @back="updateMode('list')" style="margin-top: 20px;"></el-page-header>
      <OrderDetail ref="orderDetail" :default-value.sync="orderDetailData" @update="tryToFetchOrderList" />
    </template>

    <div v-else :class="$style.header">
      <h4>{{ item.title }}</h4>
      <h5>{{ item.date | formatDate('dateWeekDay') }} {{ item.startTime | formatTimeRange(item.endTime) }}</h5>
      <div>販售狀態 {{ capacityStatus }}</div>
    </div>
    <!-- 訂單列表區塊 -->
    <div v-if="mode === 'list'" v-loading="tryingToFetchOrderList" element-loading-text="載入訂單中⋯⋯">
      <el-button v-if="refundMode" key="view" type="primary" plain class="is-fullwidth" @click="refundMode = false">我要查看訂單內容／報到</el-button>
      <el-button v-else key="refund" type="primary" plain class="is-fullwidth" @click="refundMode = true">我要取消訂單（退款）</el-button>
      <el-button v-if="showAddOrderButton" class="is-fullwidth" type="primary" @click="updateMode('add')">新增訂單至此時段</el-button>
      <OrderListItem v-for="order in orderList" :key="order.id" :data="order" :refund-mode="refundMode" @view="tryToGetOrder" @update="tryToFetchOrderList" />

      <el-button v-if="orderList.length > 0" class="is-fullwidth is-drawer--bottom" plain @click="dialogVisible = true"><BaseIcon name="mail-bulk" /> 撰寫通知</el-button>
      <el-form v-if="orderList.length > 0" label-position="top" :class="$style.export">
        <el-form-item label="匯出訂單 CSV 檔">
          <el-select v-model="exportType">
            <el-option label="只匯出訂單資訊" value="byOrder"></el-option>
            <el-option label="匯出訂單資訊與參與人資訊" value="byPerson"></el-option>
          </el-select>
          <el-button type="primary" @click="handleExport">匯出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <OrderForm v-if="mode === 'add'" :inventory="{ ...item, productType }" @store="updateMode('list')" @cancel="updateMode('list')" />
    <BaseButtonDialog :only-dialog="true" :title="'撰寫通知'" :dialog-visible.sync="dialogVisible" :destroy="true" :width="'80%'" @opened="onBaseButtonDialogOpend" floating>
      <NotificationWrite :product-name="productName" :source-name="'reception'" :source-inventory="item" :selected-order-ids="allOrderIds" :key="cKey" @close="closeDialog" />
    </BaseButtonDialog>
  </el-drawer>
</template>

<style lang="scss" module>
@import '@design';
.header {
  margin-bottom: 20px;
}
.export {
  margin-top: 20px;
  border-top: 1px solid $color-border-base;

  :global {
    .el-input__inner {
      background-color: white;
    }
    .el-form-item__content {
      display: flex;
    }
  }
}
</style>
