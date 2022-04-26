<script>
function initData() {
  return {
    storeIds: [],
    serviceCategoryIds: [],
    productPriceIds: [],
  }
}
export default {
  components: {},
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    return {
      submitData: {
        storeIds: [],
        serviceCategoryIds: [],
        productPriceIds: [],
      },
      categoryList: [],
      priceList: [],
      locations: [],
      checkAll: false,
      checkAllCategory: false,
    }
  },
  computed: {
    isEditMode() {
      return this.defaultValue.id !== undefined
    },
    availableService() {
      let list = []
      this.priceList.forEach((price) => {
        this.submitData.storeIds.forEach((product) => {
          if (price.productId === product.id) {
            this.submitData.serviceCategoryIds.forEach((category) => {
              if (price.petSizeId === category) {
                list.push({
                  ...price,
                  location: product.name,
                })
              }
            })
          }
          // list.push({
          //   ...price,
          //   location: product.name,
          // })
        })
      })
      // console.log(list)
      // list = list.filter(item=>{
      //   return item.state === 1
      // })
      return list
    },
    isIndeterminate() {
      this.checkAll = this.submitData.productPriceIds.length === this.availableService.length
      if (this.submitData.productPriceIds.length === 0) return false
      return this.submitData.productPriceIds.length > 0 && this.submitData.productPriceIds.length < this.availableService.length
    },
    isIndeterminateCategory() {
      this.checkAllCategory = this.submitData.serviceCategoryIds.length === this.categoryList.length
      if (this.submitData.serviceCategoryIds.length === 0) return false
      return this.submitData.serviceCategoryIds.length > 0 && this.submitData.serviceCategoryIds.length < this.categoryList.length
    },
    filterSubmitData() {
      const storeIds = this.submitData.storeIds.map((item) => item.id)
      return {
        ...this.submitData,
        storeIds,
      }
    },
    submitRules() {
      const repeatIsEmpty = this.submitData.repeat === ''
      const repeatIsWeekMode = this.submitData.repeat === 'week'
      return {
        title: [
          {
            required: true,
            message: '請填寫方案名稱',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: '請填寫方案內容',
            trigger: 'blur',
          },
        ],
        startTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇時段開始時間'))
              if (this.submitData.endTime) this.$refs.form.validateField('endTime')

              callback()
            },
            trigger: 'change',
          },
        ],
        endTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇時段結束時間'))
              if (minutesOfTime(this.submitData.startTime) >= minutesOfTime(value)) return callback(new Error('結束時間不可早於開始時間'))
              callback()
            },
            trigger: 'change',
          },
        ],
        repeatWith: [
          {
            type: 'array',
            required: repeatIsWeekMode,
            message: '請選擇重複的星期',
            trigger: 'change',
          },
        ],
        repeatEndDate: [
          {
            required: !repeatIsEmpty,
            message: '請選擇重複結束日期',
            trigger: 'change',
          },
        ],
        maxCollision: [
          {
            required: true,
            message: '請輸入人數',
          },
          { type: 'number', message: '人數必須為數字' },
        ],
        storeIds: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length) {
                this.$nextTick(() => {
                  this.$refs.form.clearValidate('productPriceIds')
                })
                return callback(new Error('請選擇服務地點'))
              }
              callback()
            },
            trigger: 'change',
          },
        ],
        productPriceIds: [
          {
            required: true,
            message: '請選擇服務項目',
            trigger: 'change',
          },
        ],
        serviceCategoryIds:[
          {
            required: true,
            message: '請選擇寵物類別與體型',
            trigger: 'change',
          },
        ],
      }
    },
  },
  watch: {},
  created() {
    this.tryToFetchPrices()
    // this.tryToSearchProduct()
    this.getDefaultSubmitData()
    // console.log(456)
    // this.submitData.productIds.push(this.locations[0])
  },
  methods: {
    async getDefaultSubmitData() {
      // const { items } = await this.$store.dispatch('product/fetchList', { limit: 10000, page: 1 })
      await this.tryToSearchProduct()
      let categoryAll = await this.$store.dispatch('product/fetchServiceCategory')
      let newArray = []
      categoryAll.forEach((itemParent) => {
        itemParent.children.forEach((item) => {
          newArray.push(item)
        })
      })
      this.categoryList = newArray

      if (this.isEditMode) {
        const { storeIds, serviceCategoryIds, productPriceIds } = this.defaultValue
        // this.locations = items
        // storeIds = this.locations.filter((location) => productIds.includes(location.id))
        this.submitData = {
          storeIds: this.locations.filter((location) => storeIds.includes(location.id)),
          serviceCategoryIds,
          productPriceIds,
        }
      }else{
        this.submitData = {
          storeIds:[],
          serviceCategoryIds:[],
          productPriceIds:[],
        }
      }
    },
    async tryToFetchPrices() {
      const { items } = await this.$store.dispatch('product/fetchServicePrices', {
        limit: 10000,
        page: 1,
      })
      this.priceList = items
    },
    async tryToSearchProduct() {
      const { items } = await this.$store.dispatch('product/fetchList', { limit: 10000, page: 1 })
      this.locations = items
    },
    onLocationChange(selectedItem) {
      this.checkValidServices()
    },
    checkValidServices() {
      const storeIds = this.submitData.storeIds.map((product) => product.id)
      const validPrice = this.priceList.filter((price) => storeIds.includes(price.productId)).map((price) => price.id)
      this.submitData.productPriceIds = [...this.submitData.productPriceIds.filter((serviceId) => validPrice.includes(serviceId))]
    },
    handleCheckAllChange(checked) {
      this.submitData.productPriceIds = checked ? this.availableService.map((price) => price.id) : []
    },
    handleCheckAllCategory(checked) {
      this.submitData.serviceCategoryIds = checked ? this.categoryList.map((category) => category.id) : []
    },
    validate() {
      return this.$refs.form.validate()
    },
  },
}
</script>

<template>
  <div>
    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" style="margin-top: 30px">
      <el-form-item label="設定此時段可服務的地點" prop="storeIds">
        <el-select v-model="submitData.storeIds" value-key="id" multiple placeholder="請選擇" :popper-append-to-body="true" @change="onLocationChange">
          <el-option v-for="site in locations" :key="site.id" :label="site.name" :value="site"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="categoryList.length > 0" prop="serviceCategoryIds">
        <span slot="label" class="clickOk"
          >此時段可服務的寵物類別與體型 <el-checkbox v-model="checkAllCategory" class="check-by-head" :indeterminate="isIndeterminateCategory" @change="handleCheckAllCategory">全選</el-checkbox></span
        >
        <el-select v-model="submitData.serviceCategoryIds" value-key="id" multiple placeholder="請選擇" :popper-append-to-body="true">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryTitle" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="可受理的服務項目" style="min-height:250px" :class="$style['services-wrap']" prop="productPriceIds">
        <el-checkbox
          v-if="availableService.length"
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          style="margin-left: 5px; margin-top: 10px; margin-bottom: 5px"
          border
          @change="handleCheckAllChange"
          >全 選</el-checkbox
        >
        <el-alert v-else title="請選擇分店與寵物體型" type="warning" :closable="false"></el-alert>
        <el-checkbox-group v-model="submitData.productPriceIds" :class="$style.services">
          <el-checkbox v-for="service in availableService" :key="`free-${service.id}`" :label="service.id" border>
            <div class="content">
              <span v-if="service.state === 0" class="side-icon">已下架</span>
              <span class="title" style="font-size: 15px">{{ service.title }}</span>
              <span class="meta">
                <span style="font-size: 14px; margin-right: 10px">{{ service.location }}</span>
                <span>{{ service.categoryTitle }}</span>
              </span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<style lang="scss" module>
.repeat {
  :global {
    .el-checkbox-button {
      .el-checkbox-button__inner {
        border-radius: 8px;
        padding: 14px 15px;
        border-color: $color-primary;
      }
      &.is-checked {
        .el-checkbox-button__inner {
          background: $color-primary;
        }
      }
      & + .el-checkbox-button {
        margin-left: 5px;
        .el-checkbox-button__inner {
          border-left: 1px solid $color-primary;
        }
      }
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

      .title, .meta {
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
.footer {
  display: flex;
  :global {
    button {
      flex: 1 0 auto;
    }
  }
}
</style>
