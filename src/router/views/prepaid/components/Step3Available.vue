<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  components: {},
  props: {
    products: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    prices: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      pricesDialogVisible: false,
      catchPrices: [],
      checkAll: false,
      priceIndex: null,
      search: '',
      // submitData: this.defaultValue,
    }
  },
  computed: {
    submitData: {
      get() {
        return this.defaultValue
      },
      set(value) {
        this.$emit('update:defaultValue', value)
      },
    },
    filterPrices() {
      let list = this.prices.filter((item) => {
        return item.petCategoryId === this.submitData.categoryId
      })

      list = list.map((item) => {
        return {
          title: item.title,
          priceGroupOrdering: item.groupOrdering,
          maxTimes: 1,
          productIds: [],
        }
      })
      return list
    },
    filterProducts() {
      let list = []
      if (this.search) {
        list = this.products.filter((item) => {
          console.log(item.name.search(this.search))
          // return products
          return item.name.search(this.search) !== -1
        })
      } else {
        list = this.products
      }
      return list
    },
    isIndeterminate() {
      this.checkAll = this.filterPrices.length === this.catchPrices.length
      if (this.catchPrices.length === 0) return false
      return this.catchPrices.length > 0 && this.catchPrices.length < this.filterPrices.length
    },
    isEditMode() {
      return !!this.defaultValue.groupOrdering
    },
  },
  created() {
    if (this.isEditMode) {
      this.getDefaultPrices()
    }
    // this.submitData.categoryId = 1 //
  },
  methods: {
    creatAvaliable() {
      this.pricesDialogVisible = true
    },
    selectAvaliable(index) {
      this.priceIndex = index
    },
    getDefaultPrices() {
      this.catchPrices = this.submitData.prices.map((item) => item.priceGroupOrdering)
      this.priceIndex = 0
      // this.catchPrices = this.submitData.prices.map((item) => {
      //   return {
      //     ...item,
      //     maxTimes: 1,
      //     productIds: [],
      //   }
      // })
      // const list = cloneDeep(this.submitData.prices)
      // this.catchPrices = list.map(item =>{
      //   return{
      //     maxTimes:1,

      //   }
      // })
    },
    saveSelectPrices() {
      //  要檢查這次儲存沒有變更的項目，不更新
      if (this.catchPrices.length === 0) {
        this.pricesDialogVisible = false
        return
      }
      const newPrices = []
      const catchPrices = cloneDeep(this.catchPrices)
      const havePriceIds = this.submitData.prices.map((item) => item.priceGroupOrdering)
      catchPrices.forEach((item) => {
        // this.submitData.prices.forEach(i=>{
        //   if(item.priceGroupOrdering === i.priceGroupOrdering){
        //     console.log(222)
        //     newPrices.push(i)
        //   }else{
        //     console.log(444)
        //     newPrices.push(item)
        //   }
        // })
        const index = havePriceIds.indexOf(item)
        if (index !== -1) {
          newPrices.push(this.submitData.prices[index])
        } else {
          const add = this.filterPrices.find((i) => {
            return i.priceGroupOrdering === item
          })
          newPrices.push(add)
        }
      })
      // console.log(newPrices,catchPrices)
      this.submitData.prices = newPrices
      // this.submitData.prices = list.map(item =>{
      //   return{
      //     maxTimes:1,
      //     priceGroupOrdering:item.priceGroupOrdering,
      //     productIds:[],
      //     title:item.title
      //   }
      // })
      this.pricesDialogVisible = false
      if(this.submitData.prices.length===1){
        this.priceIndex = 0
      }
      
    },
    cancelSelectPrices() {
      this.pricesDialogVisible = false
    },
    handleCheckAllChange(checked) {
      // console.log(checked)
      // this.catchPrices = checked ? [...this.filterPrices] : []
      this.catchPrices = checked ? [...this.filterPrices.map((item) => item.priceGroupOrdering)] : []
    },
    changeProductIds(value) {
      this.submitData.prices.forEach(item=>{
        item.productIds=[value]
      })
      // console.log(value)
    },
  },
}
</script>

<template>
  <div>
    <h4 class="form-block-title">適用項目</h4>
    <el-row :gutter="20">
      <el-col :span="12">
        <h6>可選服務項目(可複選)</h6>
        <div :class="$style.box">
          <template v-if="submitData.prices[0].title">
            <el-button v-for="(item, index) in submitData.prices" :key="index" :class="{ isActiveCheckBox: index === priceIndex }" class="is-round is-fullwidth" @click="selectAvaliable(index)">
              <div class="input-in-buttom">
                <span class="box__title">{{ item.title }}</span>
                <el-input v-model.number="item.maxTimes"><span slot="suffix" style="margin-right: 10px">次</span> </el-input>
              </div>
            </el-button>
          </template>
          <el-button class="is-round is-fullwidth" @click="creatAvaliable"><BaseIcon name="plus" /> 選取適用服務</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <h6>適用店家(可複選)</h6>
        <div :class="$style.box">
          <template v-if="priceIndex !== null">
            <el-input v-model="search" placeholder="輸入關鍵字篩選項目" class="search-in-box"></el-input>
            <el-checkbox-group v-model="submitData.prices[priceIndex].productIds" :class="$style.services">
                
              <template v-if="$hasHomeService()">
                <el-checkbox v-for="(store, index) in filterProducts" :key="index" :label="store.id" border >
                  {{ store.name }}
                </el-checkbox>
              </template>
              <template v-else>
                <el-radio v-for="(store, index) in filterProducts" :key="index" v-model="submitData.prices[priceIndex].productIds[0]" border :label="store.id" @change="changeProductIds">
                  {{ store.name }}
                </el-radio>
              </template>
            </el-checkbox-group>
          </template>
          <span v-else>請先選擇服務項目</span>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="選取適用服務" :visible.sync="pricesDialogVisible" width="80%" top="0" append-to-body>
      <el-form label-position="top" class="isWrap">
        <el-form-item style="min-height: 250px" :class="$style['services-wrap']">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" style="margin-left: 5px; margin-top: 10px; margin-bottom: 5px" border @change="handleCheckAllChange">全 選</el-checkbox>
          <el-checkbox-group v-model="catchPrices" :class="$style.services">
            <el-checkbox v-for="(price, index) in filterPrices" :key="index" :label="price.priceGroupOrdering" border>
              {{ price.title }}
              <!-- <div class="content">
              <span v-if="service.state === 0" class="side-icon">已下架</span>
              <span class="title" style="font-size: 15px">{{ service.title }}</span>
              <span class="meta">
                <span style="font-size: 14px; margin-right: 10px">{{ service.location }}</span>
                <span>{{ service.categoryTitle }}</span>
              </span>
            </div> -->
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div class="btn-group-inline">
        <el-button class="is-round" @click="cancelSelectPrices">取消</el-button>
        <el-button class="is-round" type="primary" @click="saveSelectPrices">儲存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="scss" module>
:global{
  .isWrap{
    .el-checkbox-group{
      display: flex;
      flex-wrap: wrap;
    }
    .el-checkbox.is-bordered {
      background-color: #fff;
      .el-checkbox__label{
        white-space: normal;
      }
    }
  }
}
.box {
  background-color: #f9f9f9;
  // border: $color-border-base 1px solid;
  padding: 15px;
  border-radius: 6px;
  :global {
    .box{
      &__title{
        white-space: normal;
        text-align: left;
        line-height: 1.4;
        max-width: calc(100% - 100px);
      }
    }
    .el-checkbox-group{
      display: flex;
      flex-wrap: wrap;
    }
    .el-checkbox.is-bordered {
      background-color: #fff;
      .el-checkbox__label{
        white-space: normal;
      }
    }
    .search-in-box {
      .el-input__inner {
        background-color: #fff;
        margin-left: 5px;
        margin-right: 5px;
        margin-bottom: 10px;
      }
    }
    .input-in-buttom {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-button {
      .el-input {
        width: 100px;
      }
      .el-input__inner {
        background-color: #fff;
        border-color: $color-border-base;
        height: 30px;
        &:focus {
          // border-color: $color-primary;
        }
      }
      .el-input__suffix {
        top: 7px;
      }
    }

    .inline-section {
      display: flex;
      margin-bottom: 15px;
    }
    .el-button.is-no-border {
      border: 0;
    }
  }
}
.services-wrap {
  margin: 0 -5px 30px;
}
.services {
  :global {
    label.el-checkbox.is-bordered {
      width: calc(50% - 10px);
      display: inline-flex;
      margin: 5px;
      align-items: center;
      height: auto;
      padding: 15px 20px 15px 15px;

      @include max-sm {
        width: 100%;
      }

      .el-checkbox__inner {
        border-radius: 10px;
        width: 18px;
        height: 18px;
        &:after {
          left: 5px;
          top: 2px;
          height: 8px;
          width: 4px;
          border-width: 2px;
        }
      }
      .el-checkbox__label {
        padding-left: 15px;
        width: 100%;
      }
      & + .el-checkbox.is-bordered {
        margin-left: 5px;
      }

      .title,
      .meta {
        width: calc(100% - 20px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .content {
        width: 100%;
      }
    }
     label.el-radio.is-bordered {
      width: calc(50% - 10px);
      display: inline-flex;
      margin: 5px;
      align-items: center;
      height: auto;
      padding: 15px 20px 15px 15px;
      background: #fff;

      @include max-sm {
        width: 100%;
      }

      // .el-radio__inner {
      //   border-radius: 10px;
      //   width: 18px;
      //   height: 18px;
      //   &:after {
      //     left: 5px;
      //     top: 2px;
      //     height: 8px;
      //     width: 4px;
      //     border-width: 2px;
      //   }
      // }
      .el-radio__label {
        padding-left: 15px;
        width: 100%;
        
      }
      & + .el-radio.is-bordered {
        margin-left: 5px;
      }

      .title,
      .meta {
        width: calc(100% - 20px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .content {
        width: 100%;
      }
    }
  }
}
</style>
