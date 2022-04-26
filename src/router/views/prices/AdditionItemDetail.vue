<script>
import lazyLoadComponent from '@router/lazyload-component'
import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'
import { merchantComputed, authComputed } from '@state/helpers'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'

const initData = () => {
  return {
    title: '',
    state: 1,
    serviceTime: 90,
    bufferTime: 30,
    introtext: '',
    description: '',
    basePrice: '0',
    price: '0',
    productId: '',
    image: [],
    categoryIds: [],
    // categoryIds: 2,
  }
}

export default {
  components: {
    BaseInputFloatingLabel,
    ImageUpload: () => lazyLoadComponent(import('../chat/components/FileUpload')),
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
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    const submitData = Object.assign({}, initData(), this.defaultValue, {
      description: this.defaultValue.description && this.defaultValue.description.replace(/<br\s\/>/g, ''),
      // categoryIds: this.defaultValue.categoryIds ? this.defaultValue.categoryIds[0] : 2,
      productId: this.defaultValue.productId ? this.defaultValue.productId : this.products[0].id,
      image: this.defaultValue.image ? [{ path: this.defaultValue.image }] : [],
    })
    return {
      submitData,
      canSetPrice: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      productId: '',
      tryingToStore: false,
      tryingToRemove: false,
      parentCategoryId: '',
      parentCategoryIndex: 0,
    }
  },
  computed: {
    ...merchantComputed,
    ...authComputed,
    submitRules() {
      return {
        title: [
          {
            required: true,
            message: '請填寫服務名稱',
            trigger: 'blur',
          },
        ],
        productId: [
          {
            required: true,
            message: '請選擇服務設定',
            trigger: 'change',
          },
        ],
        introtext: [
          {
            required: true,
            message: '請填寫簡述',
            trigger: 'blur',
          },
        ],
        description: [
          {
            // required: true,
            message: '請填寫服務內容',
            trigger: 'blur',
          },
        ],
        serviceTime: [
          {
            required: true,
            message: '請輸入服務時間',
            trigger: 'change',
          },
        ],
        bufferTime: [
          {
            required: true,
            message: '請輸入緩衝時間',
            trigger: 'change',
          },
        ],
        basePrice: [
          {
            required: true,
            message: '請輸入原始價格',
            trigger: 'change',
          },
        ],
        price: [
          {
            required: true,
            message: '請輸入販售價格',
            trigger: 'change',
          },
        ],
        image: [
          {
            required: false,
            message: '請上傳一張項目圖片',
            trigger: 'change',
          },
        ],
        categoryIds: [
          {
            required: true,
            message: '請選擇體型',
            trigger: 'change',
          },
        ],
      }
    },
    availableAmount() {
      const amount = this.submitData.inventory - this.defaultValue.qty
      return amount < 0 ? 0 : amount
    },
    isEditMode() {
      return this.defaultValue.id
    },
    formatSubmitData() {
      const { image} = this.submitData
      return {
        ...this.submitData,
        image: image.length ? image[0].path : '',
        // categoryIds: [categoryIds],
      }
    },
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
  },
   watch:{
     parentCategoryId(){
       this.getParentCategoryIndex()
     }
  },
  created() {
    this.checkCanSetPrice()
     this.getParentCategoryId()
    this.getParentCategoryIndex()
  },
  methods: {
    async tryToStore() {
      this.tryingToStore = true
      try {
        await this.$store.dispatch('product/storeAdditionalPrice', this.formatSubmitData)
         if (!this.isEditMode) {
          messageStroe('add')
        } else {
          messageStroe('edit')
        }
        this.updateParent()
      } finally {
        this.tryingToStore = false
      }
    },
    async tryToRemove() {
       try {
        await messageBoxDelete('該加購服務')
        try {
          this.tryingToRemove = true
          await this.$store.dispatch('product/storeAdditionalPrice', {...this.formatSubmitData, state: -2})
          messageDelete()
          this.updateParent()
        } finally {
          this.tryingToRemove = false
        }
      } catch {
      }
    },
    emitSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.tryToStore()
        }
      })
    },
    emitButtonEvent(event) {
      this.$emit(event)
    },
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
    updateParent() {
      this.emitButtonEvent('update')
      this.emitButtonEvent('cancel')
    },
    onChangeCategory() {
       this.submitData.categoryIds=[]
      // this.submitData.introtext = ''
    },
    getParentCategoryId() {
      this.category.forEach((parant) => {
        parant.children.forEach((category) => {
          if (this.submitData.categoryIds[0] === category.id) {
            this.parentCategoryId = category.parentId
            // this.parentCategoryIndex=
          }
        })
      })
      this.getParentCategoryIndex()
    },
    getParentCategoryIndex() {
      this.category.forEach((item, index) => {
        if (this.parentCategoryId === item.id) {
          // console.log(index)
          this.parentCategoryIndex = index
        }
      })
    },
  },
}
</script>

<template>
  <el-card shadow="never" :class="$style['card-wrapper']">
    <div :class="$style.content">
      <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form--floating">
        <el-row :gutter="20">
          <el-col :span="24">
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
              <el-select  v-model="parentCategoryId" @change="onChangeCategory" >
                <el-option v-for="(item, index) in category" :key="`category-${index}`" :label="item.title" :value="item.id"></el-option>
              </el-select >
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="24">
            <el-form-item label="寵物體型" prop="categoryIds">
              <el-select v-model="submitData.categoryIds[0]" placeholder="寵物體型">
                <template v-if="parentCategoryId">
                 <el-option v-for="(item,index) in category[parentCategoryIndex].children" :key="index" :label="item.title" :value="item.id"></el-option>
                </template>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :sm="12" :span="24">
            <el-form-item label="是否上架" prop="state" data-tour-step="4" data-tour-text="若目前不想將此方案顯示於訂購頁讓客戶看到，請將此方案切換至關閉。">
              <el-switch v-model="submitData.state" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="24">
            <el-form-item label="服務分店" prop="productId">
              <el-select v-model="submitData.productId" placeholder="服務分店">
                <el-option v-for="(product, index) in products" :key="`option-${index}`" :label="product.name" :value="product.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="簡述" prop="introtext" data-tour-step="2" data-tour-text="簡短描述此方案的內容，讓客戶可以大略知道此方案提供哪些內容。">
              <BaseInputFloatingLabel v-model="submitData.introtext" />
              <el-select v-model="submitData.introtext" placeholder="簡述">
                <el-option v-for="(option, index) in introtextOption" :key="`introtextOption-${index}`" :label="option.title" :value="option.title"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :sm="12" :span="24">
            <el-form-item label="服務時間" prop="serviceTime" data-tour-step="3" data-tour-text="此方案可供幾名客戶使用呢？">
              <el-input v-model.number="submitData.serviceTime" min="1">
                <template v-slot:append
                  >分鐘</template
                >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="24">
            <el-form-item label="緩衝時間（將自動附帶於服務之後，以免美容師分身乏術）" prop="bufferTime" data-tour-step="3" data-tour-text="此方案可供幾名客戶使用呢？">
              <el-input v-model.number="submitData.bufferTime" min="1">
                <template v-slot:append
                  >分鐘</template
                >
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="項目描述" prop="description">
              <el-input v-model="submitData.description" type="textarea" :autosize="{ minRows: 2 }" />
            </el-form-item>
          </el-col>
          <el-col :sm="12" :span="24">
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
          </el-col>
          <el-col :span="24">
            <el-form-item label="服務項目圖片（圖檔最大 2 MB，檔案格式限 JPG 或 PNG，建議尺寸：960*548）" >
              <ImageUpload v-model="submitData.image" :class="$style.upload" :show-upload="true" :resource="'product'" :single="true"></ImageUpload>
            </el-form-item>
          </el-col>
        </el-row>

        <div :class="$style.footer">
          <el-button v-if="isEditMode" class="is-round" type="danger"  :loading="tryingToRemove" :disabled="tryingToRemove" @click="tryToRemove">刪除</el-button>
          <el-button class="is-round" @click="emitButtonEvent('cancel')">取消</el-button>
          <el-button
            class="is-round"
            type="primary"
            data-tour-step="5"
            data-tour-text="最後別忘記按下「完成」，完成此方案新增了唷！"
            :loading="tryingToStore"
            :disabled="tryingToStore"
            @click="emitSave"
          >
            <BaseIcon v-if="!tryingToStore" name="check" />
            <span>{{ isEditMode ? '儲存' : '建立' }}</span>
          </el-button>
        </div>
      </el-form>
    </div>
  </el-card>
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
%img-size {
  width: calc(33.333333% - 10px);
  height: 175px;

  @include max-sm {
    width: 100%;
  }
}
:global {
  :local(.upload) {
    margin: 0 -10px;
    border-top: none !important;
    > div {
      @extend %img-size;
    }

    .image-and-action {
      @extend %img-size;
      & + div {
        @extend %img-size;
      }
    }
  }
}
</style>
