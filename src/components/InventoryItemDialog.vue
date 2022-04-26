<script>
import { formatTimeRange } from '@utils/format-date'
import { inventoryCapacityFilter } from '@utils/filter-value-to-text'

export default {
  filters: {
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
  },
  data() {
    return {
      editingState: '',
      popoverVisible: false,
    }
  },
  computed: {
    capacityStatus() {
      return inventoryCapacityFilter(this.item.qty, this.item.inventory, this.item.infinity)
    },
  },
  watch: {
    'item.state': {
      handler: 'updateEditingState',
      deep: true, // * magic point
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    emitViewOrders() {
      this.$emit('view-orders')
      this.handleClose()
    },
    async handleUpdateState() {
      await this.$store.dispatch('inventory/updateState', {
        productId: this.item.productId,
        groupId: this.item.groupId,
        ids: [this.item.id],
        state: this.editingState,
      })
      this.$message({
        message: '變更狀態成功！',
        type: 'success',
      })
      this.$emit('update:item', {
        ...this.item,
        state: this.editingState,
      })
      this.$emit('update-state')
    },
    updateEditingState(value) {
      this.editingState = value
    },
  },
}
</script>

<template>
  <el-dialog :visible="visible" width="400px" top="0" append-to-body @close="handleClose">
    <h5>
      {{ item.date}}
      <br />
      <small>{{ item.startTime | formatTimeRange(item.endTime) }}</small>
    </h5>
    <div :class="$style.subtitle">
      <div>{{ item.title }}</div>
      <div>販售狀態 {{ capacityStatus }}</div>
    </div>
    <div>
      <el-switch
        v-model="editingState"
        active-text="時段開放"
        inactive-text="時段關閉"
        :active-value="1"
        :inactive-value="0"
        :class="$style.switcher"
      ></el-switch>
      <el-button
        v-show="editingState !== item.state"
        size="small"
        type="primary"
        @click="handleUpdateState"
      >儲存狀態變更</el-button>
    </div>

    <el-button
      slot="footer"
      v-can:api="'searchOrder'"
      class="is-fullwidth"
      @click="emitViewOrders"
    >查看此時段所有訂單</el-button>
  </el-dialog>
</template>

<style lang='scss' module>
@import '@design';
.subtitle {
  display: flex;
  justify-content: space-between;
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid $color-border-base;
}
.switcher {
  margin-right: 15px;
}
</style>