<script>
import { productTypeList, productTypeFilter } from '@utils/filter-value-to-text'
import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'
// const initData = () => {
//   return {
//     productType: 'service',
//     productPriceIds: [],
//   }
// }
export default {
  components: { BaseInputFloatingLabel },
  filters: {
    productTypeFilter,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      tryingStore: false,
      // submitData:{

      // },
      submitData: {
        // productType: 'service',
        priceIds: [],
        productAssign: 1,
      },
      productTypeList: Object.freeze(productTypeList),
      // fetchingProducts: false,
      fetchingPrices: false,
      filterText: '',
      // productList: [],
      priceList: [],
      productProps: {
        label: 'title',
        children: 'children',
        // disabled: (data, node) => {
        //   console.log({data,node})
        //   return node.level === 1 || node.level === 2
        // },
        // isLeaf: (data, node) => {
        //   console.log({data,node})
        //   return node.level !== 1
        // },
      },
      num: 0,
    }
  },

  computed: {
    submitRules() {
      return {
        productIds: [
          {
            type: 'array',
            required: true,
            message: '請至少指定一個項目',
            trigger: 'change',
          },
        ],
      }
    },
  },
  watch: {
    // 'submitData.productType': {
    //   handler(value) {
    //     if (value) return this.fetchProducts()
    //   },
    //   immediate: true,
    // },
    filterText(val) {
      this.$refs.prices.filter(val)
    },
  },
  created() {
    this.fetchPrices()
    this.getDefaultPriceIds()
  },
  methods: {
    getDefaultPriceIds() {
      const { productAssign, priceIds } = this.defaultValue
      this.submitData.productAssign = productAssign
      this.submitData.priceIds = priceIds
    },
    filterProduct(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    changeSelectPrice() {
      this.submitData.priceIds = this.$refs.prices.getCheckedKeys().filter((id) => id)
    },
    async fetchPrices() {
      this.fetchingPrices = true
      this.priceList = await this.$store.dispatch('product/fetchServicePricesByGroup')
      this.fetchingPrices = false
    },
    validate() {
      return this.$refs.assignedForm.validate()
    },
  },
}
</script>

<template>
  <div>
    <el-form ref="assignedForm" :model="submitData" :validate-on-rule-change="false" label-position="top" class="el-form--floating" autocomplete="off">
      <h4 class="form-block-title">可使用優惠券的服務項目</h4>

      <!-- <el-radio-group v-model="submitData.productAssign">
          <el-radio :label="0">全店所有項目</el-radio>
          <el-radio :label="1">指定項目</el-radio>
        </el-radio-group> -->

      <el-form-item >
        <div :class="$style.searchbar">
          <el-input v-model="filterText" placeholder="輸入關鍵字篩選項目"></el-input>
        </div>
        <el-tree
          ref="prices"
          v-loading="fetchingPrices"
          element-loading-text="正在取得此類型之所有項目"
          :class="$style['parent-checkbox-hide']"
          :default-checked-keys="submitData.priceIds"
          :data="priceList"
          :props="productProps"
          :filter-node-method="filterProduct"
          node-key="id"
          show-checkbox
          class="treeWithInput"
          default-expand-all
          @check-change="changeSelectPrice"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <!-- <div :class="$style.footer">
      <el-button v-if="!isEditMode" @click="emitBack">返回</el-button>
      <el-button
        type="primary"
        :loading="tryingStore"
        @click="tryToStore"
      >{{(isEditMode) ? '儲存' : '創建' }}</el-button>
    </div> -->
  </div>
</template>
<style lang="scss" module>
@import '@design';
.searchbar {
  margin-bottom: 15px;
  margin-top: 15px;
}
:global {
  :local(.parent-checkbox-hide) {
    &.el-tree > .el-tree-node > .el-tree-node__content > .el-checkbox {
      // display: none;
    }
  }
}
</style>

