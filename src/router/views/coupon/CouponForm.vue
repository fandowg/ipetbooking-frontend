<script>
import { chain } from 'lodash'
import { couponComputed } from '@state/helpers'
import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'
// import BaseButtonPicker from '@components/BaseButtonPicker'

import { generateUniqueString } from '@utils'

import { numberUnitFilter } from '@utils/filter-value-to-text'
import { formatRequestData } from '@utils/format-date'

const initData = () => {
  return {
    title: '',
    code: '',
    type: 'fixed',
    discount: '',
    state: 1,
    infinity: 1,
    limit: 1,
    rebatePrice: 0,
    startDate: '',
    endDate: '',
    productAssign: 1,
    productIds: [],
    priceIds: [],
    // limitPerson:1,
    rules:{
      type:'Normal',
      value:1
    }
  }
}

export default {
  components: { BaseInputFloatingLabel},
  filters: {
    numberUnitFilter,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    return {
      tryingStore: false,
      submitData: Object.assign(initData(), this.defaultValue),
    }
  },
  computed: {
    ...couponComputed,
    isEditMode() {
      return this.defaultValue.id
    },
    submitRules() {
      let checkCodeTimeout = ''
      const checkDiscount = (rule, value, callback) => {
        this.$refs.form.validateField('discount')
        callback()
      }
      const self = this
      return {
        title:[
          {
            required: true, 
            message: '請輸入優惠券名稱' 
          }
        ],
        code: [
          { 
            required: true, 
            message: '請輸入優惠券代碼' 
          },
          {
            validator: (rule, value, callback) => {
              // 編輯時若是沒有更改 code 就不用驗證
              if (value === self.defaultValue.code) {
                callback()
                return
              }

              clearTimeout(checkCodeTimeout)
              if (value === '') callback(new Error('請輸入優惠券代碼'))
              checkCodeTimeout = setTimeout(() => {
                return this.$store
                  .dispatch('coupon/checkCode', { code: value, id: self.defaultValue.id })
                  .then(() => callback())
                  .catch(() => callback(new Error('您輸入的優惠券代碼已存在')))
              }, 500)
            },
            trigger: 'change',
          },
        ],
        // productIds: [
        //   {
        //     type: 'array',
        //     required: this.submitData.productAssign,
        //     message: '請至少指定一個項目',
        //     trigger: 'change',
        //   },
        // ],
        priceIds: [
          {
            type: 'array',
            required: this.submitData.productAssign,
            message: '請至少指定一個項目',
            trigger: 'change',
          },
        ],
        type: [
          {
            validator: checkDiscount,
            trigger: 'change',
          },
        ],
        discount: [
          {
            type: 'number',
            min: 0,
            max: this.submitData.type === '%' ? 100 : null,
            message: this.submitData.type === '%' ? '請輸入小於 100 之數字' : '請輸入欲折扣之數值',
          },
        ],
        rebatePrice:[
           {
            type: 'number',
            min: 0,
            message:'請輸入最低消費金額'
         
          },
        ],
        'rules.value':[
           {
            type: 'number',
            min: 0,
            message:'請輸入每人可使用次數'
         
          },
        ],
        limit:[
          {
            type: 'number',
            min: 0,
            message:'請輸入張數'
         
          },
        ]
      }
    },
    productsAssigned() {
      return Object.values(this.cachedProductsById).filter((product) => this.submitData.productIds.indexOf(product.id) === -1)
    },
    pricesAssigned() {
      const filterList = Object.values(this.cachedPricesById).filter((price) => this.submitData.priceIds.indexOf(price.id) === -1)
      return chain(filterList)
        .groupBy('productTitle')
        .map((value, key) => ({ title: key, children: value }))
        .value()
    },
  },
  created() {
    this.$store.dispatch('product/fetchServicePrices', { limit: 1000 })
    if (this.isEditMode) this.updateProductAssign()
  },
  methods: {
    updateProductAssign() {
      if (this.submitData.productAssign === 0) this.submitData.productAssign = 1
    },
    async tryToStore() {
      await this.$refs.form.validate()

      this.submitData = {
        ...this.submitData,
        startDate: formatRequestData(this.submitData.startDate) || '',
        endDate: formatRequestData(this.submitData.endDate) || '',
      }

      this.tryingStore = true

      try {
        await this.$store.dispatch('coupon/store', this.submitData)
        // this.$message({
        //   message: `${this.isEditMode ? '編輯' : '創建'}成功！`,
        //   type: 'success',
        // })
        this.emitStore()
      } catch (error) {
        console.log('TCL: tryToStore -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    emitStore() {
      this.$emit('store')
      this.emitBack()
    },
    emitBack() {
      this.$emit('back')
    },
    generateCode() {
      const randomCode = `${this.currentUser.merchantAlias}_${generateUniqueString(5)}`
      this.submitData.code = randomCode.toUpperCase()
    },
    onSelectPrice(priceIds) {
      this.submitData.priceIds = [...this.submitData.priceIds, ...priceIds]
    },
    onDeselectPrice(priceId) {
      this.submitData.priceIds = this.submitData.priceIds.filter((pid) => pid !== priceId)
    },
    validate() {
      return this.$refs.form.validate()
    },
  },
}
</script>

<template>
  <div>
    <el-form ref="form" :model="submitData" :rules="submitRules" :validate-on-rule-change="false" label-position="top" class="el-form--floating" autocomplete="off">
      <h4 class="form-block-title">是否開放使用</h4>
      <el-switch v-model="submitData.state" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
      <h4 class="form-block-title">基本設定</h4>
      <el-form-item label="優惠券名稱" prop="title" required>
        <el-input v-model="submitData.title" />
      </el-form-item>
      <el-form-item label="優惠券代碼" prop="code" required>
        <el-input v-model.lazy="submitData.code">
          <el-button slot="append" @click="generateCode">自動產生代碼</el-button>
        </el-input>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :sm="12" :span="24">
          <el-form-item label="優惠類型" prop="type" required>
            <el-radio-group v-model="submitData.type">
              <el-radio label="fixed">固定金額</el-radio>
              <el-radio label="%">按訂單總額比例</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="24">
          <el-form-item label="數值" prop="discount" required>
            <el-input v-model.number="submitData.discount" min="0">
              <template v-slot:append>{{ submitData.type | numberUnitFilter }}</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <h4 class="form-block-title">使用限制 <el-checkbox v-model="submitData.rules.type" true-label="FirstUse" false-label="Normal" class="check-by-head">限定初次使用</el-checkbox></h4>
       <el-row :gutter="40">
         <el-col :sm="12" :span="24">
       
          <el-form-item label="發放張數" prop="infinity" required>
            <div :class="$style['form-item--split']">
              <el-radio-group v-model="submitData.infinity">
                <el-radio :label="1">無上限</el-radio>
                <el-radio :label="0">限量</el-radio>
              </el-radio-group>
              <el-form-item v-if="!submitData.infinity"  prop="limit" style="margin-bottom:0" required>
              <el-input v-model.number="submitData.limit" style="width:120px" min="0" size="small">
                <template v-slot:append>張</template>
              </el-input>
              </el-form-item>
            </div>
          </el-form-item>
      </el-col>
       </el-row>

       
     
      <!-- <el-form-item label="" required>
        
      </el-form-item> -->
      <!-- <el-form-item label="可使用優惠券之項目" prop="productAssign" required>
        <el-radio-group v-model="submitData.productAssign">
          <el-radio :label="0">全店所有項目</el-radio>
          <el-radio :label="1">指定項目</el-radio>
        </el-radio-group>
        <span v-if="submitData.productAssign">
          <el-form-item :class="$style['product-list']" prop="productIds">
            <div :class="$style['product-list__header']">
              已指定項目清單
              <BaseButtonPicker
                :class="$style['product-list__button']"
                :list="pricesAssigned"
                :group="true"
                @select="onSelectPrice"
              />
            </div>
            <div v-show="submitData.priceIds.length > 0" :class="$style['product-list__body']">
              <el-tag
                v-for="priceId in submitData.priceIds"
                :key="priceId"
                :disable-transitions="false"
                :class="$style['product-list__item']"
                effect="plain"
                type="info"
                closable
                @close="onDeselectPrice(priceId)"
              >{{ cachedPricesById[priceId] && cachedPricesById[priceId].title }}</el-tag>
            </div>
          </el-form-item>
        </span>
      </el-form-item> -->
      <el-row :gutter="40">
        <el-col :sm="12" :span="24">
      <el-form-item label="最低消費金額" prop="rebatePrice">
        <el-input v-model.number="submitData.rebatePrice">
          <template v-slot:append>元</template>
        </el-input>
      </el-form-item>
      </el-col>
       <el-col v-if="submitData.rules.type !== 'FirstUse'" :span="12">
          <el-form-item label="每人可使用次數" prop="rules.value" >
          
              <el-input v-model.number="submitData.rules.value" min="1" >
                <template v-slot:append>次</template>
              </el-input>
        
          </el-form-item>
        </el-col>
         </el-row>
      <el-row :gutter="40">
        <el-col :sm="12" :span="24">
          <el-form-item label="開始使用日期" prop="startDate">
            <el-date-picker v-model="submitData.startDate" format="yyyy/MM/dd" value-format="yyyy-MM-dd" type="date" placeholder="若開放優惠券即可使用"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :sm="12" :span="24">
          <el-form-item label="停止使用日期" prop="endDate">
            <el-date-picker v-model="submitData.endDate" format="yyyy/MM/dd" value-format="yyyy-MM-dd" type="date" placeholder="無使用期限"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
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
.toggler {
  margin-bottom: 15px;
}
.form-item--split {
  display: flex;
  align-items: center;
  :global {
    .el-radio-group {
      flex-shrink: 0;
      margin-right: 15px;
    }
    .el-input-group {
      max-width: 150px;
    }
  }
}
.product-list {
  margin-bottom: 0 !important;
  border: 1px solid $color-border-base;

  &__header {
    padding: 5px 10px;
  }
  &__button {
    float: right;
  }
  &__body {
    padding: 10px;
    border-top: 1px solid $color-border-base;
  }
  &__item + .product-list__item {
    margin-left: 7px;
  }
}
.footer {
  margin-top: 30px;
  text-align: center;
}
</style>

