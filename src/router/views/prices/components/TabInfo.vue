<script>
import lazyLoadComponent from '@router/lazyload-component'
// import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'
import { merchantComputed, authComputed } from '@state/helpers'
// import { messageStroe, messageDelete } from '@utils/message'
// import { messageBoxDelete } from '@utils/message-box'
// import { notification } from '@utils/notification'

// const initData = () => {
//   return {
//     title: '',
//     alias: '',
//     state: 1,
//     serviceTime: 90,
//     bufferTime: 30,
//     introtext: '',
//     description: '',
//     content: '',
//     notice: '',
//     basePrice: '0',
//     price: '0',
//     productId: '',
//     images: [],
//     categoryIds: [],
//     // categoryIds: 2,
//   }
// }

export default {
  components: {

    // BaseInputFloatingLabel,
   
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    categoryIndex:{
      type:Number,
      default:0
    },
    categoryId:{
      type:Number,
      default:0
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
   
    return {
      // submitData: Object.assign(initData(), this.defaultValue),
      canSetPrice: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      // productId: '',
      tryingToStore: false,
      tryingToRemove: false,
      // parentCategoryId: '',
      // parentCategoryIndex: 0,
      // noticeChecked: false,
     
    }
  },
  computed: {
    ...merchantComputed,
    ...authComputed,
    submitData:{
      get(){
        return this.defaultValue
      },
      set(value) {
        this.$emit('update:defaultValue', value)
      },
    },
    parentCategoryIndex:{
      get(){
        return this.categoryIndex
      },
      set(value) {
        this.$emit('update:categoryIndex', value)
      },
    },
    parentCategoryId:{
      get(){
        return this.categoryId
      },
      set(value) {
        this.$emit('update:categoryId', value)
      },
    },
    productBaseBookingUrl() {
      // return `${this.merchantUrl}/booking/${this.currentProductAlias}/`
      let url=''
      if(window.globalData.APP_ENV==='local'){
        url=this.merchantUrl
      }else{
        const prefixUrl = this.merchantUrl.split('//',2)
        url = `${prefixUrl[0]}//${this.currentMerchant.alias}.${prefixUrl[1]}`
        // url = `${prefixUrl[0]}//${this.currentMerchant.alias}.${prefixUrl[1]}/reservation/`
      }
      return url
    },
    serviceBaseUrl(){
      if (this.$hasHomeService()){
        return `${this.productBaseBookingUrl}/store/分店別名/reservation/服務網址別名＋系統產生數字`
      } else {
        return `${this.productBaseBookingUrl}/reservation/服務網址別名＋系統產生數字`
      }
    },
    submitRules() {
      return {
        alias: [
          {
            required: true,
            message: '請填寫別名',
            trigger: 'blur',
          },
          {
            pattern: /^[a-zA-Z0-9-]+$/,
            message: '請使用英文大小寫字母、數字或英文半形連字號組合',
            trigger: 'blur',
          },
        ],
        title: [
          {
            required: true,
            message: '請填寫服務名稱',
            trigger: 'blur',
          },
        ],
  
        // introtext: [
        //   {
        //     required: true,
        //     message: '請填寫簡述',
        //     trigger: 'blur',
        //   },
        // ],
        description: [
          {
            required: true,
            message: '請填寫服務內容',
            trigger: 'blur',
          },
        ],

      }
    },
    availableAmount() {
      const amount = this.submitData.inventory - this.defaultValue.qty
      return amount < 0 ? 0 : amount
    },
    isEditMode() {
      return this.defaultValue.groupOrdering
    },
    // isEditMode() {
    //   return this.defaultValue.id
    // },
    // formatSubmitData() {
    //   // const { images, categoryIds } = this.submitData
    //   const { images } = this.submitData
    //   return {
    //     ...this.submitData,
    //     images: images.map((image, index) => {
    //       return {
    //         ...image,
    //         default: index === 0 ? 1 : 0,
    //       }
    //     }),
    //     // categoryIds: [categoryIds],
    //   }
    // },
    introtextOption() {
      const options = []
      this.category.forEach((item) => {
        if (this.submitData.categoryIds === item.id) options.push(...item.params)
      })
      return options
    },
    currentProductAlias() {
      let alias = ''
      this.products.some((item) => item.id === this.submitData.productId && (alias = item.alias))
      return alias
    },
    isService(){
      return this.$route.params.type !== 'addition'
    },
    currentCategory(){
      return this.category.filter(item=>{
        return item.children.length > 0
      })
    }
  },
  watch: {
    parentCategoryId() {
      this.getParentCategoryIndex()
    },
    // noticeChecked(value) {
    //   if (value) {
    //     this.getStore()
    //   }
    // },
  },
  created() {
    this.checkCanSetPrice()
    // this.getParentCategoryId()
    this.getParentCategoryIndex()
    if(!this.isEditMode){
      this.parentCategoryId = this.category[0].id
    }
    
    // this.$route.meta.title="新增服務"
  },
  methods: {
    // async tryToStore() {
    //   this.tryingToStore = true
    //   try {
    //     await this.$store.dispatch('product/storeServicePrice', { productId: this.submitData.productId, params: [this.formatSubmitData] })
    //     if (!this.isEditMode) {
    //       messageStroe('add')
    //       notification('一般服務','排班人員','staff')
    //       // this.$message({
    //       //   message: `創建成功！`,
    //       //   type: 'success',
    //       // })
    //     } else {
    //       messageStroe('edit')
    //     }

    //     this.updateParent()
    //   } finally {
    //     this.tryingToStore = false
    //   }
    // },
    // async tryToRemove() {
    //   try {
    //     await messageBoxDelete('該服務項目')
    //     try {
    //       this.tryingToRemove = true
    //       await this.$store.dispatch('product/removeServicePrice', { ids: [this.submitData.id] })
    //       // await this.$store.dispatch('product/storeServicePrice', { productId: this.submitData.productId, params: [{ ...this.formatSubmitData, state: -2 }] })
    //       messageDelete()
    //       this.updateParent()
    //     } finally {
    //       this.tryingToRemove = false
    //     }
    //   } catch {
      
    //   }

    //   /* await this.$store.dispatch('product/removeServicePrice', {
    //     ids: [this.submitData.id],
    //     productId: this.submitData.productId,
    //   }) */
    // },
    // emitSave() {
    //   this.$refs.form.validate((valid) => {
    //     if (valid) {
    //       this.tryToStore()
    //     }
    //   })
    // },
    // emitButtonEvent(event) {
    //   this.$emit(event)
    // },
    async checkCanSetPrice() {
      if (!this.$can('api', 'setPrice')) {
        const merchantInfo = this.currentMerchant
        if (merchantInfo === '' || merchantInfo.cashflowSetting !== 1) {
          const settings = await this.$store.dispatch('merchant/fetchSingle')
          this.canSetPrice = settings.cashflowSetting === 1
          return
        }
      }

      this.canSetPrice = this.$can('api', 'setPrice')
    },
    // updateParent() {
    //   this.emitButtonEvent('update')
    //   this.emitButtonEvent('cancel')
    // },
    onChangeCategory() {
      // console.log(879)
      this.$nextTick(function () {
        this.submitData.categoryIds = []
      })

      //  this.submitData.categoryIds[0]=''
      // this.submitData.introtext = ''
    },
    // getParentCategoryId() {
    //   this.category.forEach((parant) => {
    //     parant.children.forEach((category) => {
    //       if (this.submitData.categoryIds[0] === category.id) {
    //         this.parentCategoryId = category.parentId
    //         // this.parentCategoryIndex=
    //       }
    //     })
    //   })
    //   this.getParentCategoryIndex()
    // },
    getParentCategoryIndex() {
      this.category.forEach((item, index) => {
        if (this.parentCategoryId === item.id) {
          // console.log(index)
          this.parentCategoryIndex = index
        }
      })
    },
    // async getStore(type) {
    //   const { notice } = await this.$store.dispatch('product/fetchSingle', this.submitData.productId)

    //   this.submitData.notice = notice
    // },
    validate() {
      // console.log(333)
      return this.$refs.form.validate()
    },
  },
}
</script>

<template>
 
        <div :class="$style.content">
          <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form--floating">
            <el-row :gutter="20">
              <el-col :sm="12" :span="24">
                <el-form-item label="名稱" prop="title" data-tour-step="1" data-tour-text="給此方案一個名稱，讓客戶可以了解不同方案的差異性。">
                  <el-input v-model="submitData.title" />
                </el-form-item>
              </el-col>
              <el-col :sm="12" :span="24">
                <!-- <el-form-item label="寵物類別">
                <el-radio-group v-model="parentCategoryId" @change.native="onChangeCategory" >
                  <el-radio v-for="(item, index) in category" :key="`category-${index}`" :label="item.id" border style="margin-right: 10px">{{ item.title }}</el-radio>
                </el-radio-group>
              </el-form-item> -->
                <el-form-item label="寵物類別">
                  <el-select v-model="parentCategoryId" :disabled="!!isEditMode" @change="onChangeCategory">
                    <el-option v-for="(item, index) in currentCategory" :key="`category-${index}`" :label="item.title" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- <el-col :sm="12" :span="24">
                <el-form-item label="寵物體型" prop="categoryIds">
                  <el-select v-model="submitData.categoryIds[0]" placeholder="寵物體型">
                    <template v-if="parentCategoryId">
                      <el-option v-for="(item, index) in category[parentCategoryIndex].children" :key="index" :label="item.title" :value="item.id"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col> -->

              <!-- <el-col v-if="isService" :span="24">
                <el-form-item :label="$root.isSmallDevice ? `項目網址: ${productBaseBookingUrl}` : `項目網址`" prop="alias">
                  <el-input v-model="submitData.alias" placeholder="請使用英文字母與數字組合">
                    <template v-if="!$root.isSmallDevice" v-slot:prepend>{{ productBaseBookingUrl }}</template>
                  </el-input>
                </el-form-item>
              </el-col> -->

              <el-col v-if="isService" :span="24">
                <el-form-item :label="`服務網址別名`" prop="alias">
                  <el-input v-model="submitData.alias" placeholder="請使用英文字母與數字組合">
                    <!-- <template  v-slot:append>範例：{{`${productBaseBookingUrl}/store/分店別名/reservation/服務網址別名＋數字`}}</template> -->
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col v-if="isService" style="margin-bottom:20px;font-size: 12px; color: darkgray;" :span="24">
                服務項目網址範例：{{`${serviceBaseUrl}`}}
              </el-col>

              <!-- <el-col :sm="12" :span="24">
                <el-form-item label="是否上架" prop="state" data-tour-step="4" data-tour-text="若目前不想將此方案顯示於訂購頁讓客戶看到，請將此方案切換至關閉。">
                  <el-switch v-model="submitData.state" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :span="24">
                <el-form-item label="服務門市" prop="productId">
                  <el-select v-model="submitData.productId" placeholder="服務門市">
                    <el-option v-for="(product, index) in products" :key="`option-${index}`" :label="product.name" :value="product.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :sm="12" :span="24">
                <el-form-item label="服務時間" prop="serviceTime" data-tour-step="3" data-tour-text="此方案可供幾名客戶使用呢？">
                  <el-input v-model.number="submitData.serviceTime" min="1">
                    <template v-slot:append>分鐘</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :span="24">
                <el-form-item label="緩衝時間" prop="bufferTime" data-tour-step="3" data-tour-text="此方案可供幾名客戶使用呢？">
                  <el-input v-model.number="submitData.bufferTime" min="1">
                    <template v-slot:append>分鐘</template>
                  </el-input>
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="24">
              <el-form-item label="簡述" prop="introtext" data-tour-step="2" data-tour-text="簡短描述此方案的內容，讓客戶可以大略知道此方案提供哪些內容。"> -->
              <!-- <BaseInputFloatingLabel v-model="submitData.introtext" /> -->
              <!-- <el-select v-model="submitData.introtext" placeholder="簡述">
                  <el-option v-for="(option, index) in introtextOption" :key="`introtextOption-${index}`" :label="option.title" :value="option.title"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->

              <el-col :span="24">
                <el-form-item label="項目描述" prop="description">
                  <el-input v-model="submitData.description" type="textarea" :autosize="{ minRows: 2 }" />
                </el-form-item>
              </el-col>
              <el-col v-if="isService" :span="24">
                <el-form-item label="預約內容" prop="content">
                  <el-input v-model="submitData.content" type="textarea" :autosize="{ minRows: 2 }" />
                </el-form-item>
              </el-col>
              <el-col v-if="isService" :span="24">
                <el-form-item label="注意事項" prop="notice">
                  <el-input v-model="submitData.notice" type="textarea" :autosize="{ minRows: 2 }" />
                  <!-- <el-checkbox v-model="noticeChecked">與商店設定相同</el-checkbox> -->
                </el-form-item>
              </el-col>
              <!-- <el-col :sm="12" :span="24">
                <el-form-item label="原價" prop="basePrice">
                  <el-tooltip :disabled="canSetPrice" effect="dark" content="申請金流並開通後即可編輯價格" placement="top">
                    <el-input v-model.number="submitData.basePrice" :disabled="!canSetPrice" min="0" />
                  </el-tooltip>
                </el-form-item>
              </el-col>
              <el-col :sm="12" :span="24">
                <el-form-item label="售價" prop="price">
                  <el-input v-model.number="submitData.price" :disabled="!canSetPrice" min="0" />
                </el-form-item>
              </el-col> -->
              <!-- <el-col :span="24">
                <el-form-item label="服務項目圖片（圖檔最大 2 MB，檔案格式限 JPG 或 PNG，圖片比例：16：9，建議尺寸：800*450px）">
                  <el-alert title="第一張圖片將會是服務項目首圖" type="warning" show-icon style="padding: 0 16px; margin-top: 5px"> </el-alert>
                  <ImageUpload v-model="submitData.images" :class="$style.upload" :show-upload="true" :resource="'product'"></ImageUpload>
                </el-form-item>
              </el-col> -->
            </el-row>

            
          </el-form>
        </div>
   
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_steps.scss';
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid $color-border-lighter;
  h4 {
    display: inline-block;
  }
  &__title {
    display: inline-flex;
    flex: 1;
    align-items: center;
  }
}
.content {
  // margin-top: 30px;
}
.switcher {
  margin-right: 10px;
}

.footer {
  padding-bottom: 15px;
  // text-align: right;
  // border-bottom: 2px solid $color-border-lighter;
}

.form-item {
  &--split {
    :global {
      .el-form-item__content {
        display: flex;
        align-items: center;
      }
      .el-form-item + .el-form-item {
        margin-left: 10px;
      }
    }
  }
  &--separator {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
.price-qty {
  :global {
    .el-input-group__append {
      border: none;
      background-color: #f2f2f2;
      color: #2f8d96;
    }
  }
}

</style>
