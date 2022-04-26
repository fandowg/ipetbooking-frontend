<script>
// import tourMixin from '@src/mixins/tour'

import lazyLoadComponent from '@router/lazyload-component'

import { merchantComputed } from '@state/helpers'

// import { cities as TaiwanCity } from '@utils/taiwan-city-area'
import { taiwanCitys, districtsFilter, findDistrictZip } from '@utils/filter-value-to-text'
import taiwanBankCode from '@utils/taiwan-bank-code'

import BaseButtonDialog from '@components/BaseButtonDialog'
import { messageStroe } from '@utils/message'
import { notification } from '@utils/notification'
import request from '@utils/request'

export default {
  components: {
    BaseButtonDialog,
    BaseInputFloatingLabel: () => lazyLoadComponent(import('@components/BaseInputFloatingLabel')),
    BaseUpload: () => lazyLoadComponent(import('@components/BaseUpload')),
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  // mixins: [tourMixin],
  tourName: 'merchantInfo',
  data() {
    return {
      taiwanCitys,
      taiwanBankCode,
      // TaiwanCityList: Object.freeze(TaiwanCity),
      tryingToStore: false,
      submitData: '',
      tutorialDialog: false,
      tutorialList: [
        {
          title: '如何取得 LINE好友網址?',
          component: () => lazyLoadComponent(import('./components/lineFriend')),
        },
        {
          title: '如何取得 Facebook 粉絲專頁網址？',
          component: () => lazyLoadComponent(import('./components/fbUrl')),
        },
        {
          title: '粉絲專頁 Messenger 設定教學',
          component: () => lazyLoadComponent(import('./components/fbCode')),
        },
        {
          title: 'Google Analytics追蹤編號教學',
          component: () => lazyLoadComponent(import('./components/ga')),
        },
      ],
      tutorialIndex: 0,
    }
  },
  computed: {
    ...merchantComputed,
    districts() {
      return districtsFilter(this.submitData.city)
    },
    merchantUrlPrefix() {
      const prefixUrl = this.merchantUrl.split('//', 2)
      return `${prefixUrl[0]}//${this.currentMerchant.alias}.${prefixUrl[1]}`
    },
  },
  created() {
    this.submitData = JSON.parse(JSON.stringify(this.currentMerchant))
    // if(this.submitData.merchantConfig.siteEnabled===undefined){
    //   this.submitData.merchantConfig = {
    //     ...this.submitData.merchantConfig,
    //     siteEnabled:1
    //   }
    // }
    
  },
  methods: {
    async tryToStore() {
      this.tryingToStore = true
      // delete this.submitData.image
      if (!this.$hasSpecial()) {
        if (this.submitData.image) {
          this.submitData.images = [this.submitData.image]
        } else {
          this.submitData.images = []
        }
      } else {
        let images = [...this.submitData.images]
        let mobileImages = [...this.submitData.mobileImages]
        // console.log(images.length,mobileImages.length)
        let count = 0
        this.submitData.images.forEach((item, index) => {
          // console.log(item,this.submitData.mobileImages[index])
          if (!item && !this.submitData.mobileImages[index]) {
            // console.log(index)
            // console.log(images,mobileImages)
            let i = index - count
            if (i >= 0) {
              images.splice(i, 1)
              mobileImages.splice(i, 1)
            }
            count++
          }
        })
        // console.log(images,mobileImages)
        this.submitData.images = [...images]
        this.submitData.mobileImages = [...mobileImages]
      }

      await this.$store.dispatch('merchant/store', this.submitData)
      messageStroe('edit')
      notification('商店資訊', '分店設定', 'products')
      // this.$message({
      //   message: '儲存成功！',
      //   type: 'success',
      // })
      this.updateMerchantCached()
      this.tryingToStore = false
    },
    async updateMerchantCached() {
      await this.$store.dispatch('merchant/fetchSingle')
    },
    onSelectCity() {
      this.submitData = {
        ...this.submitData,
        region: '',
        postcode: '',
      }
    },
    onSelectDistrict() {
      const { city, region } = this.submitData
      this.submitData.postcode = findDistrictZip(city, region)
    },
    reset() {
      this.submitData = JSON.parse(JSON.stringify(this.currentMerchant))
      this.$message({ message: '已取消', type: 'success' })
    },
    openDialog(step) {
      this.tutorialDialog = true
      this.tutorialIndex = step
    },
    addSlideShow() {
      this.submitData.images.push(null)
      this.submitData.mobileImages.push(null)
    },
    async deleteSlideShow(index) {
      // console.log(index,this.submitData.images[index],)
      if (this.submitData.images[index] || this.submitData.mobileImages[index]) {
        try {
          await this.$confirm('確定要刪除這組圖片', '提示', {
            confirmButtonText: '確定',
            // showCancelButton: false,
            type: 'warning',
            center: true,
          })
          if (this.submitData.images[index]) {
            // console.log(this.submitData.images[index])
            await this.handleRemove(this.submitData.images[index])
          }
          if (this.submitData.mobileImages[index]) {
            await this.handleRemove(this.submitData.mobileImages[index])
          }
          this.submitData.images.splice(index, 1)
          this.submitData.mobileImages.splice(index, 1)
        } catch {
        } finally {
        }
      } else {
        this.submitData.images.splice(index, 1)
        this.submitData.mobileImages.splice(index, 1)
      }
    },
    async handleRemove(path) {
      const isExternal = /^(https?:)/.test(path)
      if (!isExternal) {
        const formData = new FormData()
        formData.append('paths[]', path)
        formData.append('resource', 'merchant')

        await request.post('/admin/merchant/media/delete', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
    },
  },
}
</script>

<template>
  <div :class="$style.page">
    <el-form ref="infoForm" :model="submitData" label-position="top" class="el-form--floating">
      <h4 data-tour-text="更改設定商店的名字、介紹文字與聯絡資訊" class="form-block-title">基本資訊</h4>
   
          <div class="inline-item-floating">
            您的專屬訂購頁網址 <span class="content">{{ merchantUrlPrefix }}</span>
          </div>

 
          
   

      <!-- <el-form-item label="您的專屬訂購頁網址">
      <div></div>
    </el-form-item> -->
      <el-row :gutter="20">
        <el-col :md="12">
          <el-form-item label="商店名稱" prop="name">
            <el-input v-model="submitData.name" />
          </el-form-item>
        </el-col>
        <!-- <el-col :md="12">
        <el-form-item label="是否開放前台"  prop="state">
            <el-switch v-model="submitData.merchantConfig.siteEnabled" active-text="開放" inactive-text="關閉" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col> -->
        <el-col :md="12">
          <el-form-item prop="description">
            <span slot="label" for=""
              >商店介紹
              <el-tooltip content="即為Meta Description，顯示於搜尋引擎結果，用以簡短描述您的網頁內容。建議長度為110~150字以內。" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip
            ></span>
            <el-input v-model="submitData.description" type="textarea" :autosize="{ minRows: 2 }" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="聯繫電話" prop="phoneNumber">
            <el-input v-model="submitData.phoneNumber">
              <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" />
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="聯繫 Email" prop="email">
            <el-input v-model="submitData.email" />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="only-bottom-line"></div>
      <h4 data-tour-text="地址" class="form-block-title">地址</h4>

      <!-- <el-form-item label="國別" prop="country">
      <el-select v-model="submitData.country">
        <el-option label="臺灣" value="臺灣"></el-option>
      </el-select>
    </el-form-item> -->
      <el-row :gutter="20">
        <el-col :md="6">
          <el-form-item label="縣市" prop="city">
            <el-select v-model="submitData.city" filterable placeholder="請選擇" @change="onSelectCity">
              <el-option v-for="(city, index) in taiwanCitys" :key="index" :label="city.name" :value="city.name"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="6">
          <el-form-item label="區域">
            <el-select v-model="submitData.district" placeholder="請選擇" filterable @change="onSelectDistrict">
              <el-option v-for="(district, index) in districts" :key="index" :label="district.name" :value="district.name"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item label="地址" prop="address">
            <el-input v-model="submitData.address" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="only-bottom-line"></div>
      <h4 class="form-block-title">社群／行銷</h4>
      <el-row :gutter="20">
        <el-col :md="12">
          <el-form-item label="官方 LINE@ 帳號" prop="lineId">
            <el-input v-model="submitData.lineId" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item prop="lineFriendUrl">
            <span slot="label">
              加入Line好友網址
              <el-button type="text" @click="openDialog(0)">
                <BaseIcon name="info-circle" />
              </el-button>
            </span>
            <el-input v-model="submitData.lineFriendUrl" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item prop="fbFanpageUrl">
            <span slot="label">
              Facebook 粉絲專頁網址
              <el-button type="text" @click="openDialog(1)">
                <BaseIcon name="info-circle" />
              </el-button>
            </span>
            <el-input v-model="submitData.fbFanpageUrl" />
          </el-form-item>
        </el-col>
        <el-col :md="12">
          <el-form-item prop="fbFanpageId">
            <span slot="label">
              Facebook 粉絲專頁編號
              <el-button type="text" @click="openDialog(2)">
                <BaseIcon name="info-circle" />
              </el-button>
            </span>
            <el-input v-model="submitData.fbFanpageId" />
          </el-form-item>
          <!-- <el-link href="https://www.facebook.com/help/www/1503421039731588?helpref=platform_switcher" target="_blank" type="primary" style="margin-top: -15px; margin-bottom: 0px"
            >如何找到粉絲專頁編號 ?</el-link
          > -->
        </el-col>
        <el-col :md="12">
          <el-form-item
            prop="ga"
            :rules="{
              pattern: /UA-\d{4,10}-\d{1,4}/,
              message: '請填寫有效的追蹤 ID',
              trigger: 'blur',
            }"
          >
            <span slot="label">
              Google Analytics 追蹤編號
              <el-button type="text" @click="openDialog(3)">
                <BaseIcon name="info-circle" />
              </el-button>
            </span>

            <el-input v-model="submitData.ga" />
          </el-form-item>
        </el-col>
      </el-row>
      <div class="only-bottom-line"></div>
      <!-- <template v-if="true || currentMerchant.plan.alias === 'normal'">
        <h4 data-tour-text="" class="form-block-title">匯款資訊 <span class="text-muted">（如需修改，請聯繫iPet Booking：02-2531 6628）</span></h4>
        <el-row :gutter="20">
          <el-col :md="12">
            <el-form-item label="匯款銀行">
              <el-select v-model="submitData.atmBank" placeholder="請選擇匯款銀行" :popper-append-to-body="false">
                <el-option v-for="item in taiwanBankCode" :key="item.code" :value="`${item.code}-${item.name}`">
                  {{`${item.code}-${item.name}`}}
                </el-option>
              </el-select>
          
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="匯款帳號">
              <el-input v-model="submitData.atmAccount" />
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="戶名">
              <el-input v-model="submitData.atmAccountName" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="only-bottom-line"></div>
      </template> -->
      <!-- <h4 class="form-block-title">電子發票設定</h4>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="發票開立類型" prop="tax.type">
          <el-select v-model="submitData.tax.type" placeholder="請選擇發票開立類型">
            <el-option label="個人" value="B2C"></el-option>
            <el-option label="企業" value="B2B"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="公司抬頭"
          prop="tax.title"
          :rules="[
            {
              required: submitData.tax.type === 'B2B',
              message: '請填寫公司抬頭',
            },
          ]"
        >
          <BaseInputFloatingLabel v-model="submitData.tax.title" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item
          label="公司統一編號"
          prop="tax.id"
          :rules="[
            {
              required: submitData.tax.type === 'B2B',
              message: '請填寫公司統一編號',
            },
            { pattern: /^\d{8}$/, message: '請填寫正確的統一編號' },
          ]"
        >
          <BaseInputFloatingLabel v-model="submitData.tax.id" />
        </el-form-item>
      </el-col>
    </el-row> -->
      <h4 data-tour-text="在這裡設定你的商店 Logo 圖與首頁封面圖" class="form-block-title">Logo 與商店圖片</h4>

      <template v-if="$hasSpecial()">
        <el-card v-for="(n, index) in submitData.images" :key="`${index}`" style="margin-bottom: 20px">
          <el-row :gutter="20" type="flex">
            <el-col :span="24" :sm="12">
              <el-form-item :label="`首頁輪播圖 ${index + 1} (桌機)`" prop="images">
                <BaseUpload v-model="submitData.images[index]" suggest-size="1920/750" resource="merchant" />
              </el-form-item>
            </el-col>
            <el-col :key="`${index}-mobile`" :span="24" :sm="10">
              <el-form-item :label="`首頁輪播圖 ${index + 1} (手機)`" prop="mobileImages">
                <BaseUpload v-model="submitData.mobileImages[index]" suggest-size="768/1230" resource="merchant" />
              </el-form-item>
            </el-col>
            <el-col :key="`${index}-remove`" class="image-group-plus-btn" :span="24" :sm="2">
              <el-button class="is-round is-border is-fullwidth" style="height: 200px; padding: 12px 0; border: 0" plain @click="deleteSlideShow(index)">
                <BaseIcon name="trash-alt" />
              </el-button>
            </el-col>
            <!-- <el-col :key="`${index}-bottom`" :span="24" :sm="24" style="margin-bottom:20px">
                <div class="only-bottom-line"></div>
              </el-col> -->
          </el-row>
        </el-card>
        <div style="margin-bottom: 20px" :span="24" :sm="24">
          <el-button class="is-round is-border is-fullwidth" plain type="primary" @click="addSlideShow">
            <BaseIcon name="plus" />
            新增輪播圖
          </el-button>
        </div>
      </template>
      <template v-if="!$hasSpecial()">
        <el-row :gutter="20">
          <el-col :span="24" :sm="12">
            <el-form-item label="首頁封面圖" prop="image">
              <BaseUpload v-model="submitData.image" resource="merchant" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row :gutter="20">
        <el-col :span="24" :sm="12">
          <el-form-item label="Logo" prop="logo">
            <BaseUpload v-model="submitData.logo" resource="merchant" />
          </el-form-item>
        </el-col>
        <el-col :span="24" :sm="12">
          <el-form-item label="首頁「關於我們」圖片">
            <template v-if="!$hasSpecial()">
              <BaseUpload v-model="submitData.aboutUsImage" resource="merchant" />
            </template>
            <template v-if="$hasSpecial()">
              <BaseUpload v-model="submitData.aboutUsImage" suggest-size="700/480" resource="merchant" />
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <div :class="$style.footer">
        <el-button class="is-round" @click="reset">取消</el-button>
        <el-button class="is-round" data-tour-text="欄位修改後，記得儲存資料。" type="primary" :loading="tryingToStore" @click="tryToStore">儲存</el-button>
      </div>
    </el-form>
    <el-dialog :title="tutorialList[tutorialIndex].title" :visible.sync="tutorialDialog" width="1135px" top="0" append-to-body>
      <component :is="tutorialList[tutorialIndex].component"></component>
    </el-dialog>
    <!-- <div id="map" class="google-map"></div> -->
  </div>
</template>
<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
/* :global {
  .google-map {
    width: 100%;
    height: 400px;
  }
} */
.messenger-steps {
  :global {
    .step {
      color: dodgerblue;
    }
    .img {
      margin-bottom: 40px;
    }
  }
}
</style>
