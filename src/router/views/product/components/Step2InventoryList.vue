<script>
import lazyLoadComponent from '@router/lazyload-component'
import {
  inventoryGroupStatusFilter,
  inventoryCapacityFilter,
} from '@utils/filter-value-to-text'
import formatDate, {
  formatDateTimeRange,
  formatRequestData,
} from '@utils/format-date'

import pageMixin from '@src/mixins/pagination'

export default {
  components: {
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
    InventoryItemOrders: () =>
      lazyLoadComponent(import('@components/InventoryItemOrders')),
    InventoryListItem: () => lazyLoadComponent(import('./InventoryListItem')),
  },
  filters: {
    formatDate,
    formatDateTimeRange,
    inventoryGroupStatusFilter,
    inventoryCapacityFilter,
  },
  mixins: [pageMixin],
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loadedGroupItems: [],
      selectedGroupItems: [],
      dialog: {
        visible: false,
        item: {},
      },
      drawer: {
        visible: false,
        item: {},
      },
      filterData: {
        state: '',
        startDate: formatRequestData(new Date()),
        endDate: '',
        withActiveOrders: '',
      },
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    },
    disabledBulkButton() {
      return this.selectedGroupItems.length === 0
    },
    disabledEditButton() {
      return this.selectedGroupItems.length !== 1
    },
    disabledDeleteButton() {
      return this.selectedGroupItems.some((item) => item.activeOrdersCount > 0)
    },
    filterDateRange: {
      get() {
        return [this.filterData.startDate, this.filterData.endDate]
      },
      set(value) {
        const [start, end] = value
        this.filterData.startDate = start
        this.filterData.endDate = end
      },
    },
  },
  watch: {
    group: {
      handler: 'tryToSearchGroupItems',
      immediate: true,
    },
    currentPage: 'tryToSearchGroupItems',
  },
  methods: {
    toggleDialog(visible) {
      this.dialog.visible = visible
    },
    updateDialogItem(itemData = null) {
      this.dialog.item = itemData
    },
    toggleOrdersDrawer(visible) {
      this.drawer.visible = visible
    },
    handleResetSearch() {
      this.filterDateRange = ['', '']
      this.tryToSearchGroupItems()
    },
    handleViewOrders(inventory) {
      this.toggleOrdersDrawer(true)
      this.drawer.item = {
        ...inventory,
        date: formatDate(inventory.startDate, 'dateWeekDay'),
      }
    },
    async handleDeleteItems() {
      await this.$confirm('確認刪除選取的時段？', '提示', {
        confirmButtonText: '確認',
        cancelButtonText: '放棄',
        type: 'warning',
        center: true,
      })
      const itemIds = this.selectedGroupItems.map(({ id }) => id)

      await this.$store.dispatch('inventory/remove', {
        productId: this.productId,
        groupId: this.group.id,
        ids: itemIds,
      })

      this.tryToSearchGroupItems()
    },
    handleEditItem() {
      const [editItem] = this.selectedGroupItems
      this.updateDialogItem(editItem)
      this.toggleDialog(true)
    },
    async handleBulkUpdateState(state) {
      await this.$confirm(
        `確認${state === 1 ? '開放' : '關閉'}此時段？`,
        '提示',
        {
          confirmButtonText: '確認',
          cancelButtonText: '放棄',
          type: 'warning',
          center: true,
        }
      )
      const itemIds = this.selectedGroupItems.map(({ id }) => id)
      await this.$store.dispatch('inventory/updateState', {
        productId: this.productId,
        groupId: this.group.id,
        ids: itemIds,
        state,
      })

      this.tryToSearchGroupItems()
    },
    handleSelectionChange(selected) {
      this.selectedGroupItems = selected
    },
    async tryToStoreGroupItem({ index, data }) {
      await this.$store.dispatch('inventory/store', {
        productId: this.productId,
        groupId: this.group.id,
        storeData: data,
      })
      this.tryToSearchGroupItems()
      this.toggleDialog(false)
    },
    async tryToSearchGroupItems() {
      const { items, total } = await this.$store.dispatch(
        'inventory/fetchList',
        {
          productId: this.productId,
          groupId: this.group.id,
          query: Object.assign(this.filterData, this.pageQuery),
        }
      )
      this.loadedGroupItems = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
  },
}
</script>

<template>
  <div>
    <BasePageHeader>
      <template v-slot:title>{{
        `#${group.listNumber} ${group.title || '時段'}`
      }}</template>
      <template v-slot:subtitle>{{
        group.startDate
          | formatDateTimeRange(group.endDate, group.startTime, group.endTime)
      }}</template>
      <template v-slot:right>
        <el-button :disabled="disabledEditButton" @click="handleEditItem">
          <BaseIcon name="edit" />
          <span>編輯選取</span>
        </el-button>
        <el-button
          type="danger"
          :disabled="disabledBulkButton || disabledDeleteButton"
          @click="handleDeleteItems"
        >
          <BaseIcon name="trash-alt" />
          <span>刪除選取</span>
        </el-button>
        <el-button
          :disabled="disabledBulkButton"
          @click="handleBulkUpdateState(1)"
        >
          <BaseIcon name="eye" />
          <span>變更為開放</span>
        </el-button>
        <el-button
          :disabled="disabledBulkButton"
          @click="handleBulkUpdateState(0)"
        >
          <BaseIcon name="eye-slash" />
          <span>變更為不開放</span>
        </el-button>
      </template>
    </BasePageHeader>
    <BaseTableSearch
      v-slot="{ fields }"
      :default-value="filterData"
      @reset="handleResetSearch"
    >
      <el-form-item prop="state">
        <el-select v-model="fields.state" @change="tryToSearchGroupItems">
          <el-option label="所有狀態" value></el-option>
          <el-option label="開放中" value="1"></el-option>
          <el-option label="關閉中" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          format="yyyy/MM/dd"
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          unlink-panels
          :clearable="false"
          @change="tryToSearchGroupItems"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="withActiveOrders">
        <el-select
          v-model="fields.withActiveOrders"
          @change="tryToSearchGroupItems"
        >
          <el-option label="全部" value></el-option>
          <el-option label="無未過期訂單" value="0"></el-option>
          <el-option label="有未過期訂單" value="1"></el-option>
        </el-select>
      </el-form-item>
    </BaseTableSearch>
    <el-alert
      v-if="disabledDeleteButton"
      title="若欲刪除時段，請先處理有未過期訂單之時段訂單。"
      type="warning"
      effect="dark"
      :closable="false"
    ></el-alert>
    <el-table
      :data="loadedGroupItems"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column v-slot="{ row }" label="狀態" width="55" align="center">
        <el-tooltip
          effect="dark"
          :content="row.state | inventoryGroupStatusFilter('text')"
          placement="top"
        >
          <BaseStateLabel
            dot
            :state="row.state | inventoryGroupStatusFilter('color')"
          />
        </el-tooltip>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="日期">
        <b>{{ row.startDate | formatDate }}</b>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="販售狀態">
        <b>{{ row.qty | inventoryCapacityFilter(row.inventory, row.infinity) }}</b>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="未過期訂單">
        <span :class="row.activeOrdersCount > 0 ? 'is-danger' : 'is-info'">{{
          `${row.activeOrdersCount} 筆`
        }}</span>
      </el-table-column>
      <el-table-column v-slot="{ row }">
        <el-button @click="handleViewOrders(row)">查看此時段所有訂單</el-button>
      </el-table-column>
    </el-table>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <InventoryItemOrders :visible.sync="drawer.visible" :item="drawer.item" />
    <el-dialog
      title="編輯時段"
      :visible.sync="dialog.visible"
      width="850px"
      top="0"
      append-to-body
      @closed="updateDialogItem"
    >
      <InventoryListItem
        :default-value="dialog.item"
        can-cancel
        is-active
        @save="tryToStoreGroupItem"
        @cancel="toggleDialog(false)"
      />
    </el-dialog>
  </div>
</template>
