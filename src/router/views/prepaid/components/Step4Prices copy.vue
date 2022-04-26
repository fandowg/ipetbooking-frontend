<script>
import { productTypeList, productTypeFilter } from '@utils/filter-value-to-text'
const initData = () => {
  return {
    productType: 'service',
    productPriceIds: [],
    prices: [],
  }
}

export default {
  filters: {
    productTypeFilter,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    return {
      // submitData: Object.assign(initData(), this.defaultValue),
      submitData:{
        prices:this.defaultValue.prices?this.defaultValue.prices:[],
        productType: 'service',
      },
      productTypeList: Object.freeze(productTypeList),
      // fetchingProducts: false,
      fetchingPrices: false,
      filterText: '',
      // productList: [],
      priceList: [],
      productPriceIds: [],
      productProps: {
        label: 'title',
        children: 'children',
        // disabled: (data, node) => {
				// 	const hasProductPriceIds = this.submitData.prices.length !== 0;

				// 	const checkDisabled = (item) => {
				// 		const isSameActiveStore = item.data.alias === this.activeStore;
				// 		const hasParent = !!item.parent;

				// 		if (isSameActiveStore) {
				// 			return true;
				// 		}

				// 		if (hasParent) {
				// 			return checkDisabled(item.parent);
				// 		}
				// 	};

				// 	const clearDisabled = () => {
				// 		const isDisabled = !checkDisabled(node);

				// 		if (isDisabled) {
				// 			node.checked = false;
				// 			node.indeterminate = false;
				// 		}
				// 	};

				// 	clearDisabled();

				// 	return (
        //     hasProductPriceIds && 
        //     !checkDisabled(node)
        //     && !(hasProductPriceIds && !this.activeStore)
        //   );
				// }

        /* disabled: (data, node) => {
          //  return console.log(node.parent)

          const checkedItem = this.$refs.prices.getCheckedNodes()
          if (checkedItem.length <= 1) {
            return false
          }

          if (node.level === 2) {
            const check = node.parent.childNodes.some((price) => {
              return price.checked || price.indeterminate
            })
            // if (!check) {
            //   return !check
            // }
           
            return !check

          }

          if (node.level === 3) {
            const check = node.parent.parent.childNodes.some((store) => {
              const priceChecked = store.childNodes.some((price) => {
                return price.checked || price.indeterminate
              })
              return priceChecked
            })
            // if (!check) {
            //   return !check
            // }
            return !check
          }

          // return
          // return node.level === 1 || node.level === 2
          // return node.level === 3
          // if (node.level === 2) {
          //   return console.log(node)
          // }
        }, */
   /*      isLeaf: (data, node) => {
          console.log({data,node})
          return node.level !== 1
        }, */
      },
      num: 0,
    }
  },
  computed: {
    submitRules() {
      return {
        productType: [
          {
            required: true,
            message: '請指定此包月方案可適用的項目類型',
            trigger: 'change',
          },
        ],
      }
    },
    isEditMode() {
      return this.defaultValue.id
    },
    activeStore(){
      let store=""
      const priceId = this.submitData.prices[0]?this.submitData.prices[0].id : ""
      if(priceId){
        const getActiveStore = (list,storeTitle="")=>{
          list.some(item=>{
            const level1StoreAlias= storeTitle || item.alias
            const hasChildren = !!item.children
            const isSameId = item.id === priceId
            if (isSameId) {
							store = level1StoreAlias;
							return true;
						}

						if (hasChildren) {
							getActiveStore(item.children, level1StoreAlias);
						}

						if (store) return true;
          })
        }
        getActiveStore(this.priceList)
      }
    
      return store
    }
  },
  watch: {
    // 'submitData.productType': {
    //   handler(value) {
    //     if (value) return this.fetchProducts()
    //   },
    //   immediate: true,
    // },
    'defaultValue.times': {
      handler(value) {
        this.submitData.times = value
        // console.log(123)
        this.getDefaultMaxTimes()
        this.getMaxtimes()
      },
    },
    filterText(val) {
      this.$refs.prices.filter(val)
    },
  },
  created() {
    this.fetchPrices()
    this.productPriceIds = this.submitData.prices.length>0 ? this.submitData.prices.map((item) => item.id):[]
  },
  mounted() {},
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    changeSelectPrice() {
      // this.productPriceIds = this.$refs.prices.getCheckedKeys().filter((id) => id)
      // const checkedIds = this.$refs.prices.getCheckedNodes().map((item) => {
      //   return item.id
      // })
      // console.log(checkedIds)
      // this.priceList.forEach((store, index) => {
      //   const selectedStorePrice = store.children.some((price) => {
      //     return price.children.some((size) => {
      //       console.log(checkedIds.includes(size.id))
      //       return checkedIds.includes(size.id)
      //     })
      //   })
      //   if (!selectedStorePrice) {
      //     //  store.disabled=true
      //     this.$set(store, 'disabled', true)
      //     store.children.forEach((price) => {
      //       this.$set(price, 'disabled', true)
      //       // price.disabled=true
      //       price.children.forEach((size) => {
      //         this.$set(size, 'disabled', true)
      //         // size.disabled=true
      //       })
      //     })
      //   }
      // })
      // console.log(this.$refs.prices.getCheckedNodes())
      const changeData = []
      this.$refs.prices.getCheckedNodes().forEach((item) => {
        if (item.id) {
          changeData.push({ id: item.id, maxTimes: parseInt(item.maxTimes) })
        }
      })
      // this.submitData.productPrices = changeData
      this.submitData.prices = changeData
    },
    filterProduct(value, data) {
      if (!value) return true
      return data.title.indexOf(value) !== -1
    },
    // async fetchProductPrices(node, resolve) {
    //   const { id: productId } = node.data
    //   if (!productId) return
    //   return resolve(
    //     await this.$store.dispatch('product/fetchPrices', {
    //       productId,
    //       query: {
    //         size: 1, // NOTE: 僅限使用人數為 1 的購買方案
    //       },
    //     })
    //   )
    // },
    // async fetchProducts() {
    //   this.fetchingProducts = true
    //   const { items: originalProduct } = await this.$store.dispatch(
    //     'product/fetchList',
    //     {
    //       type: this.submitData.productType,
    //       paginate: 0,
    //     }
    //   )
    //   this.productList = Object.freeze(
    //     originalProduct.map((product) => {
    //       return {
    //         ...product,
    //         title: product.name,
    //       }
    //     })
    //   )
    //   this.fetchingProducts = false
    // },
    getDefaultMaxTimes() {
      this.priceList.forEach((store) => {
        // store.disabled = false
        store.alias=store.title
        store.children.forEach((price) => {
          // price.disabled = false
          price.children.forEach((item) => {
            // item.disabled = false
            item.maxTimes = this.defaultValue.times
          })
        })
      })
    },
    async fetchPrices() {
      this.fetchingPrices = true
      this.priceList = await this.$store.dispatch('product/fetchServicePricesByGroup')
      this.getDefaultMaxTimes()
      this.getMaxtimes()
      // console.log(this.priceList)
      // this.priceList.map((item, index)=>{
      //   return{
      //     ...item,
      //     maxTimes:10,
      //   }
      // })
      this.fetchingPrices = false
    },
    getMaxtimes() {
      this.submitData.prices.forEach((checked) => {
        this.priceList.forEach((store) => {
          // console.log(store)
          store.children.forEach((price) => {
            price.children.forEach((item) => {
              if (item.id === checked.id) {
                // console.log(item.id)
                item.maxTimes = checked.maxTimes
              }
            })
          })
        })
      })
    },
    //  changeMaxtimes() {
    //   this.submitData.productPrices.forEach((checked) => {
    //     this.priceList.forEach((store) => {
    //       console.log(store)
    //       store.children.forEach((price) => {
    //         price.children.forEach((item) => {
    //           if (item.id === checked.id) {
    //             console.log(item.id)
    //             item.maxTimes = checked.maxTimes
    //           }
    //         })
    //       })
    //     })
    //   })
    // },
    // gogo() {
    //   console.log(123)
    // },
  },
}
</script>

<template>
  <div>
    <el-form ref="form" :model="submitData" :rules="submitRules" :validate-on-rule-change="false" label-position="top" class="el-form--floating" autocomplete="off">
      <!-- <template v-if="isEditMode">
        <h4 class="form-block-title">此方案適用的項目類型為</h4>
        {{ submitData.productType | productTypeFilter }}

      </template>
      <template v-else>
        <h4 class="form-block-title">1. 請先選擇適用的項目類型</h4>
        <p>包月方案僅能套用單一項目類型，儲存後將無法變更</p>
        <el-form-item prop="productType">
          <el-select v-model="submitData.productType" disabled>
            <el-option v-for="(type, typeValue) in productTypeList" :key="typeValue" :label="type.name" :value="typeValue"></el-option>
          </el-select>
        </el-form-item>

        <h4 v-if="submitData.productType" class="form-block-title">2. 請選擇適用的購買方案</h4>
      </template> -->
      <h4 class="form-block-title">適用項目 
        <!-- <span class="text-muted">（限定單間分店使用）</span> -->
      </h4>
      <el-form-item  prop="productPriceIds">
        <div :class="$style.searchbar">
          <el-input v-model="filterText" placeholder="輸入關鍵字篩選項目"></el-input>
        </div>
        <!-- {{activeStore}} -->
        <el-tree
        
          ref="prices"
          v-loading="fetchingPrices"
          element-loading-text="正在取得此類型之所有項目"
          :class="$style['parent-checkbox-hide']"
          :default-checked-keys="productPriceIds"
          :data="priceList"
          :props="productProps"
          :filter-node-method="filterProduct"
          node-key="id"
          show-checkbox
          class="treeWithInput isProduct"
          default-expand-all
          @check-change="changeSelectPrice"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span v-if="data.id" class="right-input"><el-input v-model="data.maxTimes" placeholder="0" @input="changeSelectPrice"></el-input> 次</span>
          </span>
        </el-tree>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" module>
.searchbar {
  margin-bottom: 15px;
}
:global {
  :local(.parent-checkbox-hide) {
    &.el-tree > .el-tree-node > .el-tree-node__content > .el-checkbox {
      // display: none;
    }
  }
}
.withInput {
  :global {
    // background-color: #666;
  }
}
</style>
