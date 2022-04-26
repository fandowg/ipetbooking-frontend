<script>
import tourMixin from '@src/mixins/tour'

import InventoryListItem from './InventoryListItem'
import { generateUniqueString } from '@utils'

export default {
  components: {
    InventoryListItem,
  },
  mixins: [tourMixin],
  tourName: 'productInventory',
  data() {
    return {
      activeGroupIndex: '',
      groups: [],
    }
  },
  computed: {
    showItemCancelButton() {
      return this.groups.length > 1
    },
    disabledAddNewButton() {
      return !this.tourIsActive && !(this.activeGroupIndex === '')
    },
    enabeledNextButton() {
      return this.groups.filter(Boolean).length > 0
    },
    stepValid() {
      return this.enabeledNextButton && !this.disabledAddNewButton
    },
  },
  watch: {
    stepValid: {
      handler: 'emitStepValidate',
      immediate: true,
    },
  },
  created() {
    this.addNewGroup()
  },
  methods: {
    emitStepValidate(valid) {
      this.$emit('validate', valid)
    },
    updateActiveGroupIndex(index) {
      this.activeGroupIndex = index
    },
    cancelEditGroup(index) {
      // if the group has only one property (_key)
      if (Object.keys(this.groups[index]).length === 1) {
        this.removeGroup(index)
      }
      this.updateActiveGroupIndex('')
    },
    saveGroup({ index, data }) {
      this.$set(this.groups, index, data)
      this.updateActiveGroupIndex('')
    },
    removeGroup(index) {
      this.groups.splice(index, 1)
    },
    addNewGroup() {
      this.groups.push({
        _key: generateUniqueString(15),
      })
      this.updateActiveGroupIndex(this.groups.length - 1)
    },
  },
}
</script>

<template>
  <div>
    <el-alert
      v-if="!enabeledNextButton"
      title="請建立至少 1 個時段"
      type="warning"
      effect="dark"
      :closable="false"
    ></el-alert>
    <InventoryListItem
      v-for="(group, index) in groups"
      :key="group.hasOwnProperty('id') ?  group.id : group._key"
      :item-index="index"
      :default-value="group"
      :is-active="activeGroupIndex === index"
      :is-disabled="(!!activeGroupIndex && activeGroupIndex !== index)"
      :can-cancel="showItemCancelButton"
      @save="saveGroup"
      @remove="removeGroup"
      @edit="updateActiveGroupIndex"
      @cancel="cancelEditGroup"
    />
    <el-button
      v-show="!disabledAddNewButton"
      data-tour-step="7"
      data-tour-text="若想繼續新增時段，請點擊「新增時段」。"
      :disabled="disabledAddNewButton"
      class="is-fullwidth"
      :class="$style['add-button']"
      type="primary"
      plain
      @click="addNewGroup"
    >
      <BaseIcon name="plus" />
      <span>新增時段</span>
    </el-button>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.add-button {
  margin-top: 15px;
}
</style>

