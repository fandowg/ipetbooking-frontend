<script>
import tourMixin from '@src/mixins/tour'

import PriceListItem from './PriceListItem'
import { generateUniqueString } from '@utils'

export default {
  components: {
    PriceListItem,
  },
  mixins: [tourMixin],
  tourName: 'productPrice',
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeGroupIndex: '',
      params: [],
    }
  },
  computed: {
    isEditMode() {
      return this.$route.name === 'edit-product'
    },
    showItemCancelButton() {
      return this.params.length > 1
    },
    disabledAddNewButton() {
      return !this.tourIsActive && !(this.activeGroupIndex === '')
    },
    enabeledNextButton() {
      return this.params.filter(Boolean).length > 0
    },
    stepValid() {
      return this.enabeledNextButton && !this.disabledAddNewButton
    },
    productId() {
      return this.defaultValue.id
    },
  },
  watch: {
    stepValid: {
      handler: 'emitStepValidate',
      immediate: true,
    },
  },
  created() {
    this.isEditMode ? this.tryToGetPrices(this.productId) : this.addNewGroup()
  },
  methods: {
    emitStepValidate(valid) {
      this.$emit('validate', valid)
    },
    updateActiveGroupIndex(index) {
      this.activeGroupIndex = index
    },
    cancelEditGroup(index) {
      if (Object.keys(this.params[index]).length === 1) {
        this.removeGroup(index)
      }
      this.updateActiveGroupIndex('')
    },
    saveGroup({ index, data }) {
      this.$set(this.params, index, data)
      this.updateActiveGroupIndex('')
    },
    removeGroup(index) {
      this.params.splice(index, 1)
    },
    addNewGroup() {
      this.params.push({
        _key: generateUniqueString(15),
      })
      this.updateActiveGroupIndex(this.params.length - 1)
    },
    async tryToGetPrices(productId) {
      this.params = await this.$store.dispatch('product/fetchPrices', {
        productId,
      })
    },
  },
}
</script>

<template>
  <div>
    <el-alert v-if="isEditMode" type="info" :closable="false" show-icon>
      <p slot="title">關閉購買方案後，客戶不能新購買此方案，但不影響已售出的方案。</p>
    </el-alert>
    <PriceListItem
      v-for="(group, index) in params"
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
      data-tour-step="6"
      data-tour-text="若想繼續新增方案，請點擊「新增方案」。"
      :disabled="disabledAddNewButton"
      class="is-fullwidth"
      :class="$style['add-button']"
      type="primary"
      plain
      @click="addNewGroup"
    >
      <BaseIcon name="plus" />
      <span>新增方案</span>
    </el-button>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.add-button {
  margin-top: 15px;
}
</style>