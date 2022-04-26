<script>
import lazyLoadComponent from '@router/lazyload-component'
import { inventoryRepeatFilter, inventoryGroupStatusFilter } from '@utils/filter-value-to-text'
import formatDate, { formatDateTimeRange, formatRequestData } from '@utils/format-date'
import pageMixin from '@src/mixins/pagination'

export default {
  components: {
    InventoryListItem: () => lazyLoadComponent(import('./InventoryListItem')),
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    InventoryList: () => lazyLoadComponent(import('./Step2InventoryList')),
  },
  filters: {
    formatDate,
    formatDateTimeRange,
    inventoryRepeatFilter,
    inventoryGroupStatusFilter,
  },
  mixins: [pageMixin],
  data() {
    return {
      loadedGroups: [],
      selectedGroups: [],
      viewGroup: '',
      dialog: {
        visible: false,
        item: null,
      },
      filterData: {
        inventoriesState: '',
        startDate: formatRequestData(new Date()),
        endDate: '',
        repeat: 'all',
        withActiveOrders: '',
      },
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    },
    productType() {
      return this.$route.params.product.type
    },
    disabledBulkButton() {
      return this.selectedGroups.length === 0
    },
    disabledEditButton() {
      return this.selectedGroups.length !== 1
    },
    disabledDeleteButton() {
      return this.selectedGroups.some((group) => group.activeOrdersCount > 0)
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
    currentPage: {
      handler: 'tryToSearchGroups',
      immediate: true,
    },
  },
  methods: {
    updateViewGroup(groupData = null) {
      this.viewGroup = groupData
    },
    handleSelectionChange(selected) {
      this.selectedGroups = selected
    },
    toggleDialog(visible) {
      this.dialog.visible = visible
    },
    updateDialogItem(itemData = null) {
      this.dialog.item = itemData
    },
    tryToStoreGroup({ index, data }) {
      this.$store
        .dispatch('inventory/storeGroups', {
          productId: this.productId,
          submitData: [data],
        })
        .then(() => {
          this.toggleDialog(false)
          this.$message({
            message: '儲存成功！',
            type: 'success',
          })
          this.tryToSearchGroups()
        })
    },
    handleResetSearch() {
      this.filterDateRange = ['', '']
      this.tryToSearchGroups()
    },
    handleEditGroup() {
      const [editGroup] = this.selectedGroups

      const targetGroupIndex = this.loadedGroups.map((group) => group.id).indexOf(editGroup.id)

      this.updateDialogItem({
        ...editGroup,
        groupIndex: targetGroupIndex,
      })
      this.toggleDialog(true)
    },
    async handleDeleteGroups() {
      await this.$confirm('確認刪除選取的時段群組？', '提示', {
        confirmButtonText: '確認',
        cancelButtonText: '放棄',
        type: 'warning',
        center: true,
      })
      const groupIds = this.selectedGroups.map(({ id }) => id)
      await this.$store.dispatch('inventory/removeGroups', {
        productId: this.productId,
        ids: groupIds,
      })
      this.$message({
        message: '刪除成功！',
        type: 'success',
      })
      this.tryToSearchGroups()
    },
    async handleBulkUpdateState(state) {
      try {
        const stateText = state === 1 ? '開放' : '關閉'
        await this.$confirm(`若是${stateText}，隸屬於此群組之所有時段皆會同步${stateText}`, `確認${stateText}此時段群組？`, {
          confirmButtonText: '確認',
          cancelButtonText: '放棄',
          type: 'warning',
          center: true,
        })
        const groupIds = this.selectedGroups.map(({ id }) => id)
        await this.$store.dispatch('inventory/updateGroupState', {
          productId: this.productId,
          ids: groupIds,
          state,
        })
        this.$message({
          message: '變更成功！',
          type: 'success',
        })
        this.tryToSearchGroups()
      } catch (error) {
        // console.log('TCL: handleBulkUpdateState -> error', error)
      }
    },
    async tryToSearchGroups() {
      const { items, total } = await this.$store.dispatch('inventory/fetchGroups', {
        productId: this.productId,
        query: Object.assign(this.filterData, this.pageQuery),
      })
      this.loadedGroups = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
  },
}
</script>

<template>
  <div>
    <div v-if="viewGroup">
      <el-page-header title="返回群組列表" @back="updateViewGroup"></el-page-header>
      <InventoryList :group="viewGroup" />
    </div>
    <template v-else>
      <BasePageHeader>
        <template v-slot:title
          >時段群組列表</template
        >
        <template v-slot:right>
          <el-button type="primary" @click="toggleDialog(true)">
            <BaseIcon name="plus" />
            <span>新增時段</span>
          </el-button>
          <el-button :disabled="disabledEditButton" @click="handleEditGroup">
            <BaseIcon name="edit" />
            <span>編輯選取</span>
          </el-button>

          <el-button type="danger" :disabled="disabledBulkButton || disabledDeleteButton" @click="handleDeleteGroups">
            <BaseIcon name="trash-alt" />
            <span>刪除選取</span>
          </el-button>
          <el-button :disabled="disabledBulkButton" @click="handleBulkUpdateState(1)">
            <BaseIcon name="eye" />
            <span>變更為開放</span>
          </el-button>
          <el-button :disabled="disabledBulkButton" @click="handleBulkUpdateState(0)">
            <BaseIcon name="eye-slash" />
            <span>變更為不開放</span>
          </el-button>
        </template>
      </BasePageHeader>
      <BaseTableSearch v-slot="{ fields }" :default-value="filterData" @reset="handleResetSearch">
        <el-form-item prop="inventoriesState">
          <el-select v-model="fields.inventoriesState" @change="tryToSearchGroups">
            <el-option label="所有狀態" value></el-option>
            <el-option label="全部皆關閉" value="0"></el-option>
            <el-option label="全部皆開放" value="1"></el-option>
            <el-option label="部分開放部分關閉" value="2"></el-option>
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
            :start-placeholder="filterData.startDate && !filterData.endDate ? '今天' : '起始日期'"
            end-placeholder="結束日期"
            unlink-panels
            :clearable="false"
            @change="tryToSearchGroups"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="repeat">
          <el-select v-model="fields.repeat" @change="tryToSearchGroups">
            <el-option label="所有重複方式" value="all"></el-option>
            <el-option label="不重複" value></el-option>
            <el-option label="每天" value="day"></el-option>
            <el-option label="每週" value="week"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="withActiveOrders">
          <el-select v-model="fields.withActiveOrders" @change="tryToSearchGroups">
            <el-option label="不區分過期訂單" value></el-option>
            <el-option label="無未過期訂單" value="0"></el-option>
            <el-option label="有未過期訂單" value="1"></el-option>
          </el-select>
        </el-form-item>
      </BaseTableSearch>
      <el-alert v-if="disabledDeleteButton" title="若欲刪除時段，請先處理有未過期訂單之時段訂單。" type="warning" effect="dark" :closable="false"></el-alert>
      <el-table :data="loadedGroups" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-slot="{ row, $index }" label="編號與標題">
          <b>{{ `#${$index + 1} ${row.title || '時段'}` }}</b>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="狀態" width="55" align="center">
          <el-tooltip effect="dark" :content="row.inventoriesState | inventoryGroupStatusFilter('text')" placement="top">
            <BaseStateLabel dot :state="row.inventoriesState | inventoryGroupStatusFilter('color')" />
          </el-tooltip>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="起迄日期與時段" width="200">
          {{ row.startDate | formatDateTimeRange(row.endDate, row.startTime, row.endTime) }}
        </el-table-column>
        <el-table-column v-slot="{ row }" label="重複">
          <b>{{ row.repeat | inventoryRepeatFilter(row.repeatWith) }}</b>
          <template v-if="row.repeatEndDate">
            <br />
            至{{ row.repeatEndDate | formatDate }}
          </template>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="未過期訂單" width="100">
          <span :class="row.activeOrdersCount > 0 ? 'is-danger' : 'is-info'">
            {{ `${row.activeOrdersCount} 筆` }}
          </span>
        </el-table-column>
        <el-table-column v-slot="{ row, $index }">
          <el-button @click="updateViewGroup({ ...row, listNumber: $index + 1 })">查看時段列表</el-button>
        </el-table-column>
      </el-table>

      <BasePagination ref="pagination" :current-page.sync="currentPage" />
    </template>
    <el-dialog :title="`${dialog.item ? '編輯' : '新增'}時段`" :visible.sync="dialog.visible" width="850px" top="0" append-to-body @closed="updateDialogItem">
      <InventoryListItem
        :item-index="dialog.item ? dialog.item.groupIndex : loadedGroups.length"
        :default-value="dialog.item"
        can-cancel
        is-active
        @save="tryToStoreGroup"
        @cancel="toggleDialog(false)"
      />
    </el-dialog>
  </div>
</template>
