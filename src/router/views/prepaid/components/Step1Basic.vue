<script>
import lazyLoadComponent from '@router/lazyload-component'
import { merchantComputed, authComputed } from '@state/helpers'

export default {
  components: {
    // BaseInputFloatingLabel: () => import('@components/BaseInputFloatingLabel'),
    // BaseUpload: () => import('@components/BaseUpload'),
    ImageUpload: () => lazyLoadComponent(import('@views/chat/components/FileUpload')),
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
      default: () => {},
    },
  },
  data() {
    return {
      // submitData: this.defaultValue,
      // limit:{
      //   year:0,
      //   month:0,
      //   day:0
      // }
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
    canSetPrice() {
      return this.$can('api', 'setPrice')
    },
    formRules() {
      return {
        title: [
          { 
            required: true, 
            message: '請輸入包月方案名稱' 
          }
        ],
        categoryId:[
          { 
            required: true, 
            message: '請選擇類別' 
          }
        ],
        groupAlias:[
          {
            required: true, 
            message: '請輸入包月網址別名' 
          }
        ],
        // basePrice: [
        //   {
        //     required: true,
        //     message: '請輸入原價',
        //     // trigger: 'change',
        //   },
        // ],
        // price: [
        //   {
        //     required: true,
        //     message: '請輸入售價',
        //     // trigger: 'change',
        //   },
        // ],
        infinity: [
          {
            required: true,
            message: '請選擇庫存數量',
            // trigger: 'change',
          },
        ],
        times: [
          {
            required: true,
            message: '請輸入可抵扣次數',
            // trigger: 'change',
          },
        ],
      }
    },
    currentCategory(){
      return this.category.filter(item=>{
        return item.children.length > 0
      })
    },
    isEditMode(){
      return !!this.defaultValue.groupOrdering
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
    homeServicePrepaidUrl(){
      return `${this.productBaseBookingUrl}/${this.storeType}/prepaid/包月網址別名`
    },
    storeType(){
      return `商店類型`
    }
  },
  created() {
    
  },
  methods: {
    deleteSave(){
      if(this.isEditMode){
        this.$emit('update')
      }
      
    },
    validate() {
      return this.$refs.form.validate()
    },
   /*  handleInputSlogan(value) {
      const MAX_DIGIT_PER_LINE = 32
      const MAX_LINES = 3

      const valueLinesArray = value.split('\n')

      let filterLinesArray = valueLinesArray.map((line) => {
        function getOverflowIndex(string, maxDigit) {
          let digitCounter = 0

          for (let index = 0; index < string.length; index++) {
            if (digitCounter >= maxDigit) return index
            const isChinese = string.charCodeAt(index) > 255
            digitCounter += isChinese ? 2 : 1
          }
          return maxDigit
        }

        return line.substring(0, getOverflowIndex(line, MAX_DIGIT_PER_LINE))
      })

      if (filterLinesArray.length > MAX_LINES)
        filterLinesArray.splice(MAX_LINES)
      this.submitData.slogan = filterLinesArray.join('\n')
    }, */
  },
}
</script>

<template>
  <div>
    <el-form
      ref="form"
      :model="submitData"
      :rules="formRules"
      :validate-on-rule-change="false"
      label-position="top"
      :class="$style.form"
   
      autocomplete="off"
    >
      <!-- <h4 class="form-block-title">是否開放購買與顯示</h4>
      <el-row>
        <el-col :span="12">
          <el-form-item label="開放購買" prop="state">
            <el-switch
              v-model="submitData.state"
              active-text="開放"
              inactive-text="關閉"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-col>
        <el-col v-if="submitData.state === 1" :span="12">
          <el-form-item label="在商店首頁" prop="hidden">
            <el-switch
              v-model="submitData.hidden"
              active-text="顯示"
              :active-value="0"
              inactive-text="隱藏"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
        </el-col>
      </el-row> -->

      <h4 class="form-block-title">基本設定</h4>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="包月方案名稱" prop="title" required>
            <el-input v-model="submitData.title" />
          </el-form-item>
        </el-col>
          <el-col :span="12">
          <el-form-item label="類別" prop="categoryId" required>
            <el-select v-model="submitData.categoryId" :disabled="isEditMode">
              <el-option v-for="(item, index) in currentCategory" :key="`category-${index}`" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <template v-if="!$hasHomeService()">
          
          <el-col  :span="24">
          <el-form-item :label="`包月網址`" prop="groupAlias">
            <el-input v-model="submitData.groupAlias" placeholder="請使用英文字母與數字組合">
              <template v-if="!$root.isSmallDevice" v-slot:prepend style="padding-left:0">{{ productBaseBookingUrl }}/prepaid/</template>
            
            </el-input>
          </el-form-item>
          </el-col>
        </template>
        <template v-else>
          <el-col  :span="24">
          <el-form-item :label="`包月網址別名`" prop="groupAlias">
            <el-input v-model="submitData.groupAlias" placeholder="請使用英文字母與數字組合">
         
            </el-input>
          </el-form-item>
          </el-col>
          <el-col  style="margin-bottom:20px;font-size: 12px; color: darkgray;" :span="24">
            包月方案網址範例：{{`${homeServicePrepaidUrl}`}}
          </el-col>
        </template> -->
        
         <el-col :span="24" :sm="12">
          <el-form-item label="總抵扣次數" prop="times" required>
            <el-input v-model.number="submitData.times" min="0">
              <span slot="suffix" style="margin-right:10px">次</span>
            </el-input>
          </el-form-item>
        </el-col>
               <el-col :span="24" :sm="12">
          <el-form-item label="庫存數量" prop="infinity" required>
            <div :class="$style['form-item--split']">
              <el-radio-group v-model="submitData.infinity">
                <el-radio :label="1">無上限</el-radio>
                <el-radio :label="0">限量</el-radio>
              </el-radio-group>
              <el-input
                v-show="!submitData.infinity"
                v-model.number="submitData.inventory"
                min="0"
                size="small"
              ></el-input>
            </div>
          </el-form-item>
        </el-col>
       
        <el-col :span="24" >
           <el-form-item  label="" >
             <span slot="label" for=""
            >使用期限(輸入0表示可以無限期使用)
            <el-tooltip content="如限制方案須於購買後一年內使用完畢，請輸入數字365；一個月內則輸入30。" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip
          ></span>
             <el-input v-model="submitData.expireDays"><span slot="suffix" style="margin-right:10px">天</span></el-input>
          </el-form-item>
        
        </el-col>
        <el-col :span="24">
          <el-form-item label="優惠內容" prop="slogan">
            <el-input
              v-model="submitData.slogan"
              type="textarea"
              :autosize="{ minRows: 3 }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="方案內容說明" prop="description">
            <el-input
              v-model="submitData.description"
              type="textarea"
              :autosize="{ minRows: 2 }"
            />
          </el-form-item>
        </el-col> 
        <!-- <el-col :span="24" :sm="12">
          <el-form-item label="方案圖片" prop="image">
            <template v-if="!$hasSpecial()">
              <BaseUpload
                v-model="submitData.image"
                resource="prepaid"
                suggest-size="360/270"
                image-size="4:3"
              />
            </template>
            <template v-if="$hasSpecial()">
              <BaseUpload
              v-model="submitData.image"
              resource="prepaid"
              suggest-size="720/350"
            />
            </template>
           
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="注意事項" prop="notice">
            <el-input
              v-model="submitData.notice"
              type="textarea"
              :autosize="{ minRows: 2 }"
            />
         
          </el-form-item>
        </el-col>
      </el-row>


   
      <h4 class="form-block-title">圖片設定</h4>
      <el-col :sm="24" :span="24">
              <el-form-item prop="images">
                
                <template v-if="!$hasSpecial()">
                  <el-alert title="第一張圖片將會是包月方案首圖,建議尺寸：360*270px" type="warning" show-icon style="padding: 0 16px; margin-top: 5px"> </el-alert>
                  <ImageUpload v-model="submitData.images" is-delete-save :class="$style.upload" :show-upload="true" :resource="'prepaid'" @deleteSave="deleteSave"></ImageUpload>
                </template>
                <template v-if="$hasSpecial()">
                  <el-alert title="第一張圖片將會是包月方案首圖,建議尺寸：720*350px" type="warning" show-icon style="padding: 0 16px; margin-top: 5px"> </el-alert>
                  <ImageUpload v-model="submitData.images" is-delete-save :class="$style.upload"  :show-upload="true" :resource="'prepaid'" @deleteSave="deleteSave" ></ImageUpload>
                </template>
              </el-form-item>
            </el-col>
    </el-form>
  </div>
</template>
<style lang="scss" module>
@import '@design';
.form{
  :global {
    .el-input-group__prepend{
      padding-left: 0;
    }
  }
}
%img-size {
  width: calc(33.333333% - 10px);
  height: 175px;
  @include max-sm {
    width: calc(100% - 10px);
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
.form-item--split {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;

  :global {
    .el-radio-group {
      flex-shrink: 0;
      margin-right: 15px;
    }
    .el-input {
      max-width: 150px;
    }
  }
}
</style>
