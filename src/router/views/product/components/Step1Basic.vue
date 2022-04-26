<script>
import cloneDeep from 'lodash/cloneDeep'
import tourMixin from '@src/mixins/tour'
import { authComputed , merchantComputed } from '@state/helpers'
import lazyLoadComponent from '@router/lazyload-component'
import { cities as TaiwanCity } from '@utils/taiwan-city-area'
import { taiwanCitys, districtsFilter, findDistrictZip } from '@utils/filter-value-to-text'

import taiwanBankCode from  '@utils/taiwan-bank-code'

const minutesOfTime = (time = '00:00') => {
  const timeMatches = time.match(/^(\d+):(\d+)$/i)
  const [, hours, minutes] = timeMatches
  return Number(hours) * 60 + Number(minutes)
}

const initData = () => {
  return {
    phoneCode: '+886',
    phone: '',
    state: 2,
    hidden: 0,
    name: '',
    alias: '',
    type: '',
    description: '',
    notice: '',
    location: {
      name: '',
      country: '臺灣',
      city: '',
      address: '',
      district: '',
    },
    staffs: [],
    introimage: '',
    image: '',
    images:[],
    video: '',
    orderExtrafields: [],
    allowOverlap: 0,
    // params: {
    //   addressRestrictions: [
    //     {
    //       city: '',
    //       region: [],
    //     },
    //   ],
    //   serviceTimeSetting: {
    //     start: '',
    //     end: '',
    //     lastOrder: '',
    //     beforehandOrder: 0,
    //   },
    // },
    showPrice: 1,
    lineId: '',
    lineFriendUrl: '',
    fbFanpageUrl: '',
    lat:'',
    lng:'',
    storeType:''
  }
}
export default {
  components: {
    BaseInputFloatingLabel: () => lazyLoadComponent(import('@components/BaseInputFloatingLabel')),
    ServiceAreaItem: () => lazyLoadComponent(import('./ServiceAreaItem')),
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
    BaseUpload: () => lazyLoadComponent(import('@components/BaseUpload')),
    ImageUpload: () => lazyLoadComponent(import('@views/chat/components/FileUpload')),
  },
  mixins: [tourMixin],
  tourName: 'productBasic',
  props: {
    itemType: {
      type: String,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    return {
      infoChecked: false,
      socialChecked: false,
      noticeChecked: false,
      taiwanCitys,
      sameAsMerchant: true,
      merchantInfo: {},
      TaiwanCityList: Object.freeze(TaiwanCity),
      submitData: cloneDeep(Object.assign({}, initData(), this.defaultValue)),
      submitRules: {
        name: [
          {
            required: true,
            message: '請填寫名稱',
            trigger: 'blur',
          },
        ],
        // alias: [
        //   {
        //     required: true,
        //     message: '請填寫別名',
        //     trigger: 'blur',
        //   },
        //   {
        //     pattern: /^[a-zA-Z0-9-]+$/,
        //     message: '請使用英文大小寫字母、數字或英文半形連字號組合',
        //     trigger: 'blur',
        //   },
        // ],
        description: [
          {
            required: true,
            message: '請填寫描述',
            trigger: 'blur',
          },
        ],
        'location.name': [
          {
            required: true,
            message: '請填寫地點名稱',
            trigger: 'blur',
          },
        ],
        // 'location.country': [
        //   {
        //     required: true,
        //     message: '請選擇國家',
        //     trigger: 'change',
        //   },
        // ],
        'location.city': [
          {
            required: true,
            message: '請選擇城市',
            trigger: 'change',
          },
        ],
        'location.district': [
          {
            required: true,
            message: '請選擇區域',
            trigger: 'change',
          },
        ],
        'location.address': [
          {
            required: true,
            message: '請輸入地址',
            trigger: 'blur',
          },
        ],
        // video: [
        //   {
        //     pattern: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
        //     message: '請輸入有效的 YouTube 影片網址',
        //     trigger: 'blur',
        //   },
        // ],
        atmAccount: [
          {
            type: 'number',
            message: '帳號必須為數字',
            // required: false,
            // trigger: 'blur',
          },
        ],
        'addressRestrictions.city': [
          {
            required: true,
            message: '請選擇城市',
            trigger: 'blur',
          },
        ],
        'addressRestrictions.district': [
          {
            required: true,
            message: '請選擇區域',
            trigger: 'blur',
          },
        ],
        // 'serviceTimeSetting.start': [
        //   {
        //     required: true,
        //     validator: (rule, value, callback) => {
        //       if (!value) return callback(new Error('請選擇營業開始時間'))
        //       if (this.submitData.serviceTimeSetting.end) this.$refs.form.validateField('serviceTimeSetting.end')

        //       callback()
        //     },
        //     trigger: 'change',
        //   },
        // ],
        // 'serviceTimeSetting.end': [
        //   {
        //     required: true,
        //     validator: (rule, value, callback) => {
        //       const { start } = this.submitData.serviceTimeSetting
        //       if (minutesOfTime(start) >= minutesOfTime(value)) return callback(new Error('結束時間不可早於開始時間'))
        //       callback()
        //     },
        //     trigger: 'change',
        //   },
        // ],
        // 'serviceTimeSetting.lastOrder': [
        //   {
        //     required: true,
        //     message: '請選擇時間',
        //     trigger: 'change',
        //   },
        // ],
        // 'serviceTimeSetting.beforehandOrder': [
        //   {
        //     required: true,
        //     message: '請輸入提前預約時間',
        //   },
        // ],
      },
      taiwanBankCode,
      
    }
  },
  watch: {
    infoChecked(value) {
      if (value) {
        this.getMerchant('info')
      }
    },
    socialChecked(value) {
      if (value) {
        this.getMerchant('social')
      }
    },
    'submitData.image': {
      handler(value) {
        if(value){
          this.submitData.images=[{
            type:'image',
            path:value,
           
          }]
        }else{
          this.submitData.images=[]
        }
      },
    },
    // 'submitData.location.address': {
    //   handler(value) {
    //     this.geocode()
    //   },
    // },
  },
  computed: {
    ...authComputed,
    ...merchantComputed,
    // productBaseBookingUrl() {
    //   return `${this.merchantUrl}/product/`
    // },
    productBaseBookingUrl() {
      const prefixUrl = this.merchantUrl.split('//',2)
      return `${prefixUrl[0]}//${this.currentMerchant.alias}.${prefixUrl[1]}`
    },
    storeBaseUrl(){
      if (this.$hasHomeService()){
        return `${this.productBaseBookingUrl}/store/`
      } else {
        return `${this.productBaseBookingUrl}/reservation?store=`
      }
    },
    isEditMode() {
      return this.defaultValue.id
    },
    filteredCity() {
      const selectedCitys = this.submitData.addressRestrictions.map((res) => res.city)
      return taiwanCitys.filter((city) => {
        return !selectedCitys.includes(city.name)
      })
    },
    districts() {
      return districtsFilter(this.submitData.location.city)
    },
    isHomeService(){
      return this.defaultValue.storeType === 'home'
    },
    formatSubmitData() {
      // const { images, categoryIds } = this.submitData
      const { images } = this.submitData
      return {
        ...this.submitData,
        images: images.map((image, index) => {
          return {
            ...image,
            default: index === 0 ? 1 : 0,
          }
        }),
        // categoryIds: [categoryIds],
      }
    },
  },
   
  created() {
    !this.isEditMode || (this.isEditMode && !this.submitData.orderExtrafields.byProduct)
      ? this.requestExtraFieldbyProduct()
      : this.updateExtraFieldbyProduct(this.submitData.orderExtrafields.byProduct)
    !this.isEditMode && this.tryToFetchMerchant()
    // if (this.isEditMode && !this.submitData.params.serviceTimeSetting) {
    //   this.submitData.params = {
    //     addressRestrictions: [
    //       {
    //         city: '',
    //         region: [],
    //       },
    //     ],
    //     serviceTimeSetting: {
    //       start: '',
    //       end: '',
    //       lastOrder: '',
    //       beforehandOrder: 0,
    //     },
    //   }
    // }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    async requestExtraFieldbyProduct() {
      const extraFieldData = await this.$store.dispatch('product/fetchExtraField', {
        typeByProduct: this.itemType,
      })
      const filterData = extraFieldData.map((field) => {
        const { id, title, value, required } = field
        return {
          id,
          title,
          value,
          required,
        }
      })
      this.updateExtraFieldbyProduct([...filterData])
    },
    updateExtraFieldbyProduct(value) {
      this.submitData.orderExtrafields = value
    },
    async tryToFetchMerchant() {
      const data = await this.$store.dispatch('merchant/fetchSingle')
      this.merchantInfo = { ...data }
      // this.submitData.location.name = data.name
      // this.submitData.location.city = data.city
      // this.submitData.location.address = data.address
    },
    onChange(checked) {
      if (checked) {
        this.submitData.location.name = this.merchantInfo.name
        this.submitData.location.city = this.merchantInfo.city
        this.submitData.location.address = this.merchantInfo.address
      } else {
        this.submitData.location.name = ''
        this.submitData.location.city = ''
        this.submitData.location.address = ''
      }
    },
    onRemoveServiceArea(index) {
      this.submitData.addressRestrictions.splice(index, 1)
    },
    onAddServiceArea() {
      this.submitData.addressRestrictions.push({
        city: '',
        district: [],
      })
    },
    onSelectCity() {
      this.submitData.location.district = ''
    },
    async getMerchant(type) {
      const { name, description, phoneCode, phoneNumber, email, city, district, address, lineId, fbFanpageUrl, lineFriendUrl } = await this.$store.dispatch('merchant/fetchSingle')
      if (type === 'info') {
        this.submitData.name = name
        this.submitData.description = description
        this.submitData.phoneCode = phoneCode
        this.submitData.phone = phoneNumber
        this.submitData.email = email
        this.submitData.location.city = city
        this.submitData.location.district = district
        this.submitData.location.address = address
      }
      if (type === 'social') {
        this.submitData.lineId = lineId
        this.submitData.fbFanpageUrl = fbFanpageUrl
        this.submitData.lineFriendUrl = lineFriendUrl
      }
    },
    
    // onSelectDistrict() {
    //   const { city, region } = this.submitData
    //   this.submitData.postcode = findDistrictZip(city, region)
    // },
  },
}
</script>

<template>
  <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form--floating">
    <template>
      <!-- <h4 class="form-block-title">{{
        $t('PRODUCT.TITLE_STATE_AND_DISPLAY', {
          name: $t(`PRODUCT.${itemType}.NAME`),
        })
      }}</h4> -->
      <h4 class="form-block-title">分店狀態</h4>
      <el-row>
        <el-col :span="8">
          <el-form-item label="分店啟用" prop="state">
            <el-switch v-model="submitData.state" active-text="開放" inactive-text="關閉" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
          <!-- <el-form-item
            :label="
              $t('PRODUCT.STATE_LABEL', {
                name: $t(`PRODUCT.${itemType}.NAME`),
              })
            "
            prop="state"
          >
            <el-switch v-model="submitData.state" active-text="開放" inactive-text="關閉" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item> -->
        </el-col>
      <!--   <el-col v-if="submitData.state === 1" :span="8">
          <el-form-item label="在商店首頁" prop="hidden">
            <el-switch v-model="submitData.hidden" active-text="顯示" :active-value="0" inactive-text="隱藏" :inactive-value="1"></el-switch>
          </el-form-item>
        </el-col> -->
        <!-- <el-col v-if="submitData.state === 1" :span="8">
          <el-form-item label="在網站顯示價格">
            <el-switch v-model="submitData.showPrice" active-text="是" :active-value="1" inactive-text="否" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col> -->
      </el-row>
    </template>
    <div class="only-bottom-line"></div>

    <h4 data-tour-text="介紹你的活動吧！讓客戶初步了解活動內容及更多注意事項。" class="form-block-title"
      >基本資訊 <el-checkbox v-model="infoChecked" class="check-by-head">和商店設定相同</el-checkbox></h4
    >
    <!-- <el-form-item :label="$t('PRODUCT.NAME_LABEL', { name: $t(`PRODUCT.${itemType}.NAME`) })" prop="name">
      <BaseInputFloatingLabel v-model="submitData.name" />
    </el-form-item> -->
    <el-row :gutter="20">
      <el-col :sm="12" :span="24">
        <el-form-item label="分店名稱" prop="name">
          <el-input v-model="submitData.name" />
        </el-form-item>
      </el-col>
      <el-col :sm="12" :span="24">
        <el-form-item label="聯絡電話">
          <el-input v-model="submitData.phone">
            <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" />
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item :label="$root.isSmallDevice ? `分店網址: ${storeBaseUrl}` : '分店網址'" prop="alias">
      <el-input v-model="submitData.alias" placeholder="請使用英文字母與數字組合">
        <template v-if="!$root.isSmallDevice" v-slot:prepend>{{ storeBaseUrl }}</template>
      </el-input>
    </el-form-item>

    <!-- <div class="only-bottom-line"></div> -->
    <!-- <el-form-item
      :label="
        $t('PRODUCT.ALIAS_LABEL', { name: $t(`PRODUCT.${itemType}.NAME`) })
      "
      prop="alias"
    >
      <el-input
        v-model="submitData.alias"
        placeholder="請使用英文字母與數字組合"
      >
        <template v-slot:prepend>{{ productBaseBookingUrl }}</template>
      </el-input>
    </el-form-item> -->
    <el-form-item label="分店簡介" prop="description">
      <el-input v-model="submitData.description" type="textarea" :autosize="{ minRows: 2 }" />
    </el-form-item>
    <el-row :gutter="20">
      <el-col :md="6">
        <el-form-item label="縣市" prop="location.city">
          <el-select v-model="submitData.location.city" filterable placeholder="請選擇" @change="onSelectCity">
            <el-option v-for="(city, index) in taiwanCitys" :key="index" :label="city.name" :value="city.name"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="6">
        <el-form-item label="區域" prop="location.district">
          <el-select v-model="submitData.location.district" placeholder="請選擇" filterable>
            <el-option v-for="(district, index) in districts" :key="index" :label="district.name" :value="district.name"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="地址" prop="location.address">
          <el-input v-model="submitData.location.address" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="only-bottom-line"></div>
    <!-- <el-form-item
      :label="
        $t('PRODUCT.DESCRIPTION_LABEL', {
          name: $t(`PRODUCT.${itemType}.NAME`),
        })
      "
      prop="description"
    >
      <BaseInputFloatingLabel v-model="submitData.description" type="textarea" :autosize="{ minRows: 2 }" />
    </el-form-item> -->
    <!-- <el-row v-if="!isEditMode">
      <el-col :span="8">
        <el-form-item
          :label="
            $t('PRODUCT.OVERLAP_LABEL', {
              name: $t(`PRODUCT.${itemType}.NAME`),
            })
          "
          prop="allowOverlap"
        >
          <el-switch
            v-model="submitData.allowOverlap"
            active-text="是"
            inactive-text="否"
            :active-value="0"
            :inactive-value="1"
          ></el-switch>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-alert
          title="若您的預約是一個時段結束後再接續另一場時段者，請開啟此選項以避免施作人員分身乏術。"
          :closable="false"
          type="warning"
          effect="dark"
        ></el-alert>
      </el-col>
    </el-row> -->

    <!-- <template v-if="submitData.orderExtrafields instanceof Array">
      <el-form-item
        v-for="(extrafield, fieldIndex) in submitData.orderExtrafields"
        :key="fieldIndex"
        :label="extrafield.title"
        :prop="`orderExtrafields.${fieldIndex}.value`"
        :rules="{
          required: !!extrafield.required,
          message: `請填寫${extrafield.title}`,
        }"
      >
        <BaseInputFloatingLabel
          v-model="extrafield.value"
          type="textarea"
          :autosize="{ minRows: 2 }"
        />
      </el-form-item>
    </template> -->

    <!-- <h4 class="form-block-title">地點</h4>
    <el-form-item v-if="!isEditMode">
      <el-checkbox v-model="sameAsMerchant" style="width: 100%" label="同商家地址" border @change="onChange"></el-checkbox>
    </el-form-item>
    <el-form-item label="名稱" prop="location.name">
      <BaseInputFloatingLabel v-model="submitData.location.name" />
    </el-form-item> -->
    <!-- <el-form-item label="國家" prop="location.country">
      <el-select v-model="submitData.location.country">
        <el-option label="臺灣" value="臺灣"></el-option>
      </el-select>
    </el-form-item> -->
    <!-- <el-form-item label="城市" prop="location.city">
      <el-select v-model="submitData.location.city">
        <el-option v-for="city in TaiwanCityList" :key="city.CityName" :label="city.CityName" :value="city.CityName"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="地址" prop="location.address">
      <BaseInputFloatingLabel v-model="submitData.location.address" />
    </el-form-item> -->

    <!-- <h4
      data-tour-text="你的活動有大卡司嗎？建立你的活動嘉賓吸引客戶的注意吧！"
      class="form-block-title form-block-title--small-margin"
      >人員</h4
    >
    <StaffList v-model="submitData.staffs" /> -->

    <template v-if="isHomeService && $hasHomeService()">
      <div style="margin-bottom:20px">
      <h4 class="form-block-title">服務區域</h4>
      <ServiceAreaItem
        v-for="(restriction, index) in submitData.addressRestrictions"
        :key="`restriction-${index}`"
        :item-index="index"
        :default-value="restriction"
        :citys="filteredCity"
        :show-remove="submitData.addressRestrictions.length > 1"
        @remove="onRemoveServiceArea"
      ></ServiceAreaItem>
      <el-button
        type="primary"
        class="is-round is-border is-fullwidth"
        style="margin-top: 30px"
        plain
        :disabled="taiwanCitys.length === submitData.addressRestrictions.length"
        @click="onAddServiceArea"
        ><BaseIcon name="plus"></BaseIcon> 新增服務區域{{ taiwanCitys.length === submitData.addressRestrictions.length ? '（已選擇全部區域）' : '' }}</el-button
      >
      </div>
    </template>
<!-- 
    <h4 class="form-block-title">服務時間設定</h4>

    <template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="開始營業時間" prop="params.serviceTimeSetting.start">
            <el-time-picker v-model="submitData.params.serviceTimeSetting.start" format="HH:mm" value-format="HH:mm" placeholder="選擇開始營業時間" :clearable="false"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="結束營業時間" prop="params.serviceTimeSetting.end">
            <el-time-picker v-model="submitData.params.serviceTimeSetting.end" format="HH:mm" value-format="HH:mm" placeholder="選擇結束營業時間" :clearable="false"></el-time-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-form-item label="最晚接受預約時間" prop="params.serviceTimeSetting.lastOrder">
            <el-time-picker v-model="submitData.params.serviceTimeSetting.lastOrder" format="HH:mm" value-format="HH:mm" placeholder="選擇最晚接受預約時間" :clearable="false"></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提前預約時間" prop="params.serviceTimeSetting.beforehandOrder">
            <BaseInputFloatingLabel v-model.number="submitData.params.serviceTimeSetting.beforehandOrder" min="0">
              <template v-slot:append>分鐘</template>
            </BaseInputFloatingLabel>
          </el-form-item>
        </el-col>
      </el-row>
    </template> -->

    <div class="only-bottom-line"></div>
    <h4 data-tour-text="" class="form-block-title">社群資訊<el-checkbox v-model="socialChecked" class="check-by-head">和商店設定相同</el-checkbox></h4>
    <el-row :gutter="20">
      <el-col :md="12">
        <el-form-item label="官方 LINE@ 帳號">
          <el-input v-model="submitData.lineId" />
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="加入Line好友網址" prop="lineFriendUrl">
          <el-input v-model="submitData.lineFriendUrl" />
        </el-form-item>
      </el-col>
      <el-col :md="12">
        <el-form-item label="Facebook 粉絲專頁">
          <el-input v-model="submitData.fbFanpageUrl" />
        </el-form-item>
      </el-col>
    </el-row>
    <div class="only-bottom-line"></div>

    <h4 data-tour-text="" class="form-block-title"
      >注意事項
      <!-- <el-checkbox v-model="noticeChecked" class="check-by-head">套用至此分店的所有服務項目</el-checkbox> -->
    </h4>
    <el-form-item label="" prop="notice">
      <el-input v-model="submitData.notice" type="textarea" :autosize="{ minRows: 3 }" />
    </el-form-item>
    <div class="only-bottom-line"></div>

    <template v-if="true || currentMerchant.plan.alias === 'normal'">
      <h4 data-tour-text="" class="form-block-title">匯款資訊 <span class="text-muted">（如需使用金流服務，請與iPetBooking 聯繫 (02)2531-6628）</span></h4>
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
    </template>


    <h4 data-tour-text="上傳活動或環境照片吸引客戶的目光吧！" class="form-block-title">圖片</h4>
    <el-row :gutter="20">
      
        
          <template v-if="$hasSpecial()">
            <el-col :sm="24" :span="24">
              <el-form-item prop="images">
                <el-alert title="第一張圖片將會是分店首圖，建議尺寸：首圖
1920*1080px，其他 940*530px" type="warning" show-icon style="padding: 0 16px; margin-top: 5px"> </el-alert>
                <ImageUpload v-model="submitData.images" :class="$style.upload" :show-upload="true" :resource="'product'"></ImageUpload>
              </el-form-item>
            </el-col>
          </template>
          <template v-if="!$hasSpecial()">
            <el-col :sm="12" :span="24">
              <el-form-item prop="image">
                
                <BaseUpload v-model="submitData.image" resource="product" suggest-size="480/270" image-size="16:9" />
              </el-form-item>
            </el-col>
          </template>
          
        
      
      <!-- <el-col :span="12">
        <el-form-item label="介紹橫幅形象圖" prop="image">
          <BaseUpload
            v-model="submitData.image"
            resource="product"
            suggest-size="912/300"
          />
        </el-form-item>
      </el-col> -->
    </el-row>

    <!-- <h4
      data-tour-text="有任何精彩的影片也不錯過！立刻輸入影片網址讓客戶看看吧！"
      class="form-block-title"
      >影片</h4
    >
    <el-form-item label="YouTube 影片網址" prop="video">
      <BaseInputFloatingLabel v-model="submitData.video" />
    </el-form-item> -->
  </el-form>
</template>
<style lang="scss" module>
@import '@design';
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
</style>