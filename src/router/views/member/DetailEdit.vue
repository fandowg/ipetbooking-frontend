<script>
import { genderFilter, taiwanCitys, districtsFilter, findDistrictZip, taxTypeMap, carrierTypeMap } from '@utils/filter-value-to-text'
import cloneDeep from 'lodash/cloneDeep'
import lazyLoadComponent from '@router/lazyload-component'

const defaultAddress = () => {
  return {
    address: '',
    city: '',
    district: '',
    email: '',
    name: '',
    phone: '',
    postcode: '',
  }
}

const extraInfoPhone ={
  // type:'phone',
  phoneCode:'+886',
  phoneNumber:''
}

const extraInfoEmergency ={
  // type:'emergency',
  phoneCode:'+886',
  phoneNumber:'',
  fullName:'',
  gender:'male'
}

export default {
  components: {
    InvoiceForm: () => lazyLoadComponent(import('@components/InvoiceForm')),
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  filters: { genderFilter },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      taxTypeMap,
      carrierTypeMap,
      taiwanCitys,
      submitData: cloneDeep(Object.assign({}, 
      { 
        extraInfos:{
          extraInfoPhone:[extraInfoPhone],
          extraInfoEmergency:[extraInfoEmergency]
        }
      },
      this.defaultValue, { merchantNote: this.defaultValue.merchantNote && this.defaultValue.merchantNote.replace(/<br\s\/>/g, '') },
      // {extraInfos:this.defaultValue.extraInfos[0]?cloneDeep(this.defaultValue.extraInfos):[extraInfoPhone,extraInfoEmergency]}
      )),
      editedNote: null,
      editEnabled: false,
      editTagEnabled: false,
      removeTags: new Set(),
      tagList: [],
      tryingUpdateTag: false,
      addressMode: 'billing',
      tryingSave: false,
      visibleDialog: false,
      editDetailEnabled: false,
      editInvoiceEnabled: false,
    }
  },
  computed: {
    addIds() {
      return this.allIds.filter((id) => !this.defaultTagIds.includes(id) && this.submitDataTagIds.includes(id))
    },
    deleteIds() {
      return this.allIds.filter((id) => this.defaultTagIds.includes(id) && !this.submitDataTagIds.includes(id))
    },
    defaultTagIds() {
      return this.defaultValue.tags.map((tag) => tag.id)
    },
    submitDataTagIds() {
      return this.submitData.tags.map((tag) => tag.id)
    },
    allIds() {
      return [...new Set([...this.defaultTagIds, ...this.submitDataTagIds])]
    },
    districts() {
      let districts = []
      if (this.addressMode === 'shipping') {
        districts = this.submitData[`${this.addressMode}Info`][0].city
      }
      if (this.addressMode === 'billing') {
        districts = this.submitData[`${this.addressMode}Info`].city
      }
      return districtsFilter(districts)
    },
    searchRules() {
      return {
        email: [
          { required: false, message: '請輸入 Email' },
          { type: 'email', message: '請輸入正確的 Email 格式' },
        ],
        fullName: [{ required: true, message: '請輸入使用人姓名' }],
      }
    },
    addressRules() {
      return {
        'shippingInfo.0.phone': [
          // { required: true, message: '請輸入電話',trigger: 'blur' },
          { pattern: /[\s\#0-9_\-\+\/\(\)\.]/, message: '請輸入正確的 電話 格式', trigger: 'blur' },
        ],
        'billingInfo.phone': [
          // { required: true, message: '請輸入電話',trigger: 'blur' },
          { pattern: /[\s\#0-9_\-\+\/\(\)\.]/, message: '請輸入正確的 電話 格式', trigger: 'blur' },
        ],
      }
    },
    storeInvoiceSetting() {
      return this.defaultValue.storeInvoiceSetting
    },
    hasHomeService() {
      return this.$hasHomeService()
    },
  },
  watch: {
    hasHomeService(value) {
      this.getDefaultAddress()
      // console.log(value)
    },
  },
  created() {
    // console.log(this.$store.state.merchant.hasMerchant,this.$store.state.merchant.cached)
    this.tryToFetchList('')
    // console.log(this.submitData.shippingInfo.district)
    // if(this.submitData.billingInfo){
    //   if(!this.submitData.shippingInfo.district){
    //     this.submitData.shippingInfo.district =''
    //     delete this.submitData.shippingInfo.region
    //   }
    //   if(!this.submitData.billingInfo.district){
    //     this.submitData.billingInfo.district =''
    //     delete this.submitData.billingInfo.region
    //   }
    // }
    if(!this.submitData.extraInfos){
      this.submitData = {
        ...this.submitData,
        extraInfos:{
          extraInfoPhone:[extraInfoPhone],
          extraInfoEmergency:[extraInfoEmergency]
        }
        
      }
      // this.submitData.extraInfosextraInfoPhone=extraInfoPhone
      // this.submitData.extraInfos[1]=extraInfoEmergency
     }
    this.getDefaultAddress()
  },
  mounted() {
    // console.log(this.$store.state.merchant.cached)
  },
  methods: {
    getDefaultAddress() {
      // console.log(this.$hasHomeService(),(!this.submitData.billingInfo || !this.submitData.shippingInfo))
      // console.log(this.$hasHomeService())
      if (this.$hasHomeService()) {
        if (!this.submitData.billingInfo) {
          this.submitData.billingInfo = defaultAddress()
        }
        if (!this.submitData.shippingInfo) {
          this.submitData.shippingInfo = [defaultAddress()]
        }
      }

      // if( (!this.submitData.billingInfo || !this.submitData.shippingInfo)){
      //   this.submitData.billingInfo = defaultAddress()
      //   this.submitData.shippingInfo = [defaultAddress()]
      //   // console.log(this.submitData.billingInfo,this.submitData.shippingInfo)
      // }
    },
    enableEdit() {
      this.editEnabled = true
      this.editedNote = this.submitData.merchantNote
    },
    cancelEdit() {
      this.editEnabled = false
      this.editedNote = null
    },
    enableEditTag() {
      this.editTagEnabled = true
    },
    cancelTagEdit() {
      this.submitData.tags = [...this.defaultValue.tags]
      this.editTagEnabled = false
    },
    enableEditDetail() {
      this.editDetailEnabled = true
    },
    cancelEditDetail() {
      // console.log(this.defaultValue)
      const { fullName, gender, email } = this.defaultValue
      this.submitData = {
        ...this.submitData,
        fullName,
        gender,
        email,

      }
      // this.submitData.extraInfos = cloneDeep([...this.defaultValue.extraInfos])
      this.editDetailEnabled = false
    },
    enableEditInvoice() {
      this.editInvoiceEnabled = true
    },
    cancelEditInvoice() {
      const { taxType, taxId, CarrierType, CarrierNum, LoveCode } = this.defaultValue
      this.submitData = {
        ...this.submitData,
        taxType,
        taxId,
        CarrierType,
        CarrierNum,
        LoveCode,
      }
      this.editInvoiceEnabled = false
    },
    async saveEdit() {
      if (this.$refs.form) await this.$refs.form.validate()
      if (this.$refs['form-invoice']) await this.$refs['form-invoice'].validate()
      if (!this.$hasHomeService() && !this.defaultValue.shippingInfo && !this.defaultValue.billingInfo) {
        delete this.submitData.billingInfo
        delete this.submitData.shippingInfo
      }
      await this.$store.dispatch('member/store', {
        ...this.submitData,
        merchantNote: this.editedNote,
        CarrierNum: this.submitData.CarrierType === '2' ? this.defaultValue.phoneNumber : this.submitData.CarrierNum,
      })
      this.submitData.merchantNote = this.editedNote

      await this.tryToFetchMember()
      this.cancelEdit()
      this.cancelEditDetail()
      this.cancelTagEdit()
      this.cancelEditInvoice()
    },
    async updateTag() {
      this.tryingUpdateTag = true
      await this.$store.dispatch('member/applyTags', {
        addIds: this.addIds,
        deleteIds: this.deleteIds,
        memberIds: [this.submitData.id],
      })
      await this.tryToFetchMember()
      this.cancelTagEdit()
      this.tryingUpdateTag = false
    },
    async tryToFetchList(search) {
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search,
      })
    },
    async tryToFetchMember() {
      const memberInfo = await this.$store.dispatch('member/fetchSingle', this.$route.params.memberId)
      this.$emit('update:defaultValue', memberInfo)
    },
    enableEditAddress(mode) {
      this.addressMode = mode
      this.visibleDialog = true
    },
    onSelectCity() {
      // console.log(111)
      if (this.addressMode === 'billing') {
        this.submitData[`${this.addressMode}Info`] = {
          ...this.submitData[`${this.addressMode}Info`],
          district: '',
          postcode: '',
        }
      }
      if (this.addressMode === 'shipping') {
        this.submitData[`${this.addressMode}Info`][0].district = ''
        this.submitData[`${this.addressMode}Info`][0].postcode = ''
      }
    },
    onSelectDistrict() {
      if (this.addressMode === 'shipping') {
        const { city, district } = this.submitData[`${this.addressMode}Info`][0]
        this.submitData[`${this.addressMode}Info`][0].postcode = findDistrictZip(city, district)
      }
      if (this.addressMode === 'billing') {
        const { city, district } = this.submitData[`${this.addressMode}Info`]
        this.submitData[`${this.addressMode}Info`].postcode = findDistrictZip(city, district)
      }
    },
    async onSaveAddress() {
      try {
        await this.$refs.addressForm.validate()
        this.tryingSave = true
        await this.saveEdit()
        await this.tryToFetchMember()
        this.visibleDialog = false
      } catch {
      } finally {
        this.tryingSave = false
      }
    },
    handleClose() {
      this.submitData = cloneDeep(this.defaultValue)
      this.getDefaultAddress()
      this.visibleDialog = false
    },
  },
}
</script>

<template>
  <div>
    <BasePageHeader title="編輯客戶" />
    <el-card>
      <h4 class="form-block-title"
        >基本資料
        <template v-if="editDetailEnabled">
          <el-button class="is-round" size="mini" @click="cancelEditDetail">取消</el-button>
          <el-button class="is-round" size="mini" type="primary" @click="saveEdit">
            <BaseIcon name="check" />
            <span>儲存</span>
          </el-button>
        </template>
        <el-button v-else class="is-round" size="mini" @click="enableEditDetail">
          <BaseIcon name="edit" />
          <span>編輯</span>
        </el-button>
      </h4>
      <ul :class="$style.detail">
        <template v-if="editDetailEnabled">
          <el-form ref="form" :model="submitData" :class="$style['detail-form']" :label-position="$root.isSmallDevice ? 'top' : 'left'" :rules="searchRules" label-width="130px">
            <el-row>
              <el-col :span="15">
            <el-form-item prop="fullName" label="姓名" class="el-form-item--normal-margin" style="margin-left: -4px">
              <el-input v-model="submitData.fullName" placeholder="姓名：">
                <!-- <el-select slot="append" v-model="submitData.gender" placeholder="性別">
                  <el-option value="female" label="小姐"></el-option>
                  <el-option value="male" label="先生"></el-option>
                </el-select> -->
              </el-input>
            </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item class="el-form-item--normal-margin gender-box" label-width="0" style="padding-top:0;margin-left:20px;margin-bottom:0;height:auto">
                  <el-radio-group v-model="submitData.gender" class="no-bg-radio-group">
                    <el-radio label="male">先生</el-radio>
                    <el-radio label="female">小姐</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <li style="margin-bottom: 22px">聯絡電話：{{ `${submitData.phoneCode} ${submitData.phoneNumber}` }}</li>

            <el-form-item label="備用電話" class="el-form-item--normal-margin">
              <el-input v-model.trim="submitData.extraInfos.extraInfoPhone[0].phoneNumber" placeholder="請輸入備用電話">
                <CountryCodePicker slot="prepend" v-model="submitData.extraInfos.extraInfoPhone[0].phoneCode" />
              </el-input>
            </el-form-item>

            <el-row>
              <el-col :span="15">
                <el-form-item label="緊急聯絡人姓名" class="el-form-item--normal-margin">
                  <el-input v-model="submitData.extraInfos.extraInfoEmergency[0].fullName" placeholder="請輸入姓名"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item class="el-form-item--normal-margin gender-box" label-width="0" style="padding-top:0;margin-left:20px;margin-bottom:0;height:auto">
                  <el-radio-group v-model="submitData.extraInfos.extraInfoEmergency[0].gender" class="no-bg-radio-group">
                    <el-radio label="male">先生</el-radio>
                    <el-radio label="female">小姐</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="緊急聯絡人電話" class="el-form-item--normal-margin" >
              <el-input v-model.trim="submitData.extraInfos.extraInfoEmergency[0].phoneNumber" placeholder="請輸入緊急聯絡人電話">
                <CountryCodePicker slot="prepend" v-model="submitData.extraInfos.extraInfoEmergency[0].phoneCode" />
              </el-input>
            </el-form-item>

            <el-form-item prop="email" label="電子信箱" class="el-form-item--normal-margin" style="margin-left: -4px">
              <el-input v-model="submitData.email" placeholder="Email"></el-input>
            </el-form-item>
            <el-form-item label="LINE ID" class="el-form-item--normal-margin" style="margin-left: -4px">
              <el-input v-model="submitData.lineId" placeholder="LINE ID"></el-input>
            </el-form-item>
          </el-form>
        </template>
        <template v-else>
          <li>姓名：{{ submitData.fullName }} {{ submitData.gender | genderFilter }}</li>
          <li>聯絡電話：{{ `${submitData.phoneCode} ${submitData.phoneNumber}` }}</li>
          <li v-if="defaultValue.extraInfos && defaultValue.extraInfos.extraInfoPhone[0].phoneNumber">
            備用電話：
            {{ `${defaultValue.extraInfos.extraInfoPhone[0].phoneCode} ${defaultValue.extraInfos.extraInfoPhone[0].phoneNumber}` }}
          </li>
          <li v-if="defaultValue.extraInfos && defaultValue.extraInfos.extraInfoEmergency[0].fullName">
            緊急聯絡人姓名：
            {{ defaultValue.extraInfos.extraInfoEmergency[0].fullName }} {{ defaultValue.extraInfos.extraInfoEmergency[0].gender | genderFilter }} 
          </li>
          <li v-if="defaultValue.extraInfos && defaultValue.extraInfos.extraInfoEmergency[0].phoneNumber">
            緊急聯絡人電話：
            {{ `${defaultValue.extraInfos.extraInfoEmergency[0].phoneCode} ${defaultValue.extraInfos.extraInfoEmergency[0].phoneNumber}` }}
          </li>
          <li>電子信箱：{{ submitData.email }}</li>
          <li>LINE ID：{{ submitData.lineId }}</li>
          
        </template>
        <template v-if="$hasHomeService()">
          <li>
            帳單地址：
            <template v-if="defaultValue.billingInfo"> {{ defaultValue.billingInfo.city }} {{ defaultValue.billingInfo.district }} {{ defaultValue.billingInfo.address }} </template>

            <el-button class="is-round" size="mini" @click="enableEditAddress('billing')">
              <BaseIcon name="edit" />
              <span>編輯</span>
            </el-button>
          </li>
          <li>
            地址：
            <template v-if="defaultValue.shippingInfo"> {{ defaultValue.shippingInfo[0].city }} {{ defaultValue.shippingInfo[0].district }} {{ defaultValue.shippingInfo[0].address }} </template>
            <el-button class="is-round" size="mini" @click="enableEditAddress('shipping')">
              <BaseIcon name="edit" />
              <span>編輯</span>
            </el-button>
          </li>
        </template>

        <!-- <li>帳單地址：{{ defaultValue.billingInfo.address }}
          <el-button class="is-round" size="mini" @click="enableEditAddress('billing')">
            <BaseIcon name="edit" />
            <span>編輯</span>
          </el-button>
        </li> -->
      </ul>
      <div class="bottom-line-box-normal"></div>
      <h4 class="form-block-title">
        隸屬標籤
        <template v-if="editTagEnabled">
          <el-button class="is-round" size="mini" @click="cancelTagEdit">取消</el-button>
          <el-button class="is-round" size="mini" type="primary" :loading="tryingUpdateTag" @click="updateTag">
            <BaseIcon name="check" />
            <span>儲存</span>
          </el-button>
        </template>
        <el-button v-else class="is-round" size="mini" @click="enableEditTag">
          <BaseIcon name="edit" />
          <span>編輯</span>
        </el-button>
      </h4>
      <div v-if="editTagEnabled">
        <div style="color: #aaaaaa; margin-bottom: 10px; margin-top: -10px">標籤</div>
        <el-select v-model="submitData.tags" value-key="id" multiple placeholder="請選擇">
          <el-option v-for="tag in tagList" :key="tag.id" :label="tag.title" :value="tag"> </el-option>
        </el-select>
      </div>
      <div v-else :class="$style['label-tag']">
        <span>標籤：</span>
        <el-tag v-for="tag in submitData.tags" :key="`tag-${tag.id}`" :type="'info'" effect="plain" disable-transitions>
          {{ tag.title }}
        </el-tag>
      </div>
      <div class="bottom-line-box-normal"></div>
      <template v-if="storeInvoiceSetting">
        <h4 class="form-block-title"
          >發票資訊
          <template v-if="editInvoiceEnabled">
            <el-button class="is-round" size="mini" @click="cancelEditInvoice">取消</el-button>
            <el-button class="is-round" size="mini" type="primary" @click="saveEdit">
              <BaseIcon name="check" />
              <span>儲存</span>
            </el-button>
          </template>
          <el-button v-else class="is-round" size="mini" @click="enableEditInvoice">
            <BaseIcon name="edit" />
            <span>編輯</span>
          </el-button>
        </h4>
        <ul :class="$style.detail">
          <template v-if="editInvoiceEnabled">
            <el-form ref="form-invoice" class="el-form-item--normal-margin" :model="submitData" :class="$style['detail-form']" label-position="left" label-width="100px">
              <InvoiceForm :default-value="submitData" :show-sync="false" />
            </el-form>
          </template>
          <template v-else>
            <li>開立類型：{{ taxTypeMap[defaultValue.taxType] }}</li>
            <template v-if="defaultValue.taxType === 'B2C'">
              <li>載具類別：{{ carrierTypeMap[defaultValue.CarrierType] || '無（寄送電子發票至客戶 email）' }}</li>
              <li v-if="defaultValue.CarrierType === '0' || defaultValue.CarrierType === '1'">載具編號：{{ defaultValue.CarrierNum }}</li>
            </template>
            <li v-else-if="defaultValue.taxType === 'B2B'">統一編號：{{ defaultValue.taxId }}</li>
            <li v-else>捐贈碼：{{ defaultValue.LoveCode }}</li>
          </template>
        </ul>
        <div class="bottom-line-box-normal"></div>
      </template>

      <h4 class="form-block-title">
        內部備註
        <template v-if="editEnabled">
          <el-button class="is-round" size="mini" @click="cancelEdit">取消</el-button>
          <el-button class="is-round" size="mini" type="primary" @click="saveEdit">
            <BaseIcon name="check" />
            <span>儲存</span>
          </el-button>
        </template>
        <el-button v-else class="is-round" size="mini" @click="enableEdit">
          <BaseIcon name="edit" />
          <span>編輯</span>
        </el-button>
      </h4>

      <el-input v-if="editEnabled" v-model="editedNote" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="請輸入你的備註文字"></el-input>
      <p v-else style="line-height: 25px; white-space: break-spaces" v-html="submitData.merchantNote || '目前尚無備註'"></p>
    </el-card>
    <el-dialog :title="`編輯${addressMode === 'billing' ? '帳單' : ''}地址`" :visible.sync="visibleDialog" top="0" width="680px" append-to-body @close="handleClose">
      <template v-if="$hasHomeService() && submitData[`${addressMode}Info`]">
        <el-form ref="addressForm" :model="submitData" :rules="addressRules" label-position="top" class="el-form--floating" style="margin-top: 30px">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-if="addressMode === 'shipping'" v-model="submitData[`${addressMode}Info`][0].name"></el-input>
                <el-input v-else v-model="submitData[`${addressMode}Info`].name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item v-if="addressMode === 'shipping'" label="電話" prop="shippingInfo.0.phone">
                <el-input v-model="submitData[`${addressMode}Info`][0].phone"></el-input>
              </el-form-item>
              <el-form-item v-else label="電話" prop="billingInfo.phone">
                <el-input v-model="submitData[`${addressMode}Info`].phone"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="addressMode === 'billing'" label="電子郵件">
            <el-input v-model="submitData[`${addressMode}Info`].email"></el-input>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="縣市">
                <el-select v-if="addressMode === 'shipping'" v-model="submitData[`${addressMode}Info`][0].city" placeholder="請選擇縣市" filterable @change="onSelectCity">
                  <el-option v-for="(city, index) in taiwanCitys" :key="`billing-city-${index}`" :label="city.name" :value="city.name"> </el-option>
                </el-select>
                <el-select v-else v-model="submitData[`${addressMode}Info`].city" placeholder="請選擇縣市" filterable @change="onSelectCity">
                  <el-option v-for="(city, index) in taiwanCitys" :key="`billing-city-${index}`" :label="city.name" :value="city.name"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="鄉鎮市區">
                <el-select v-if="addressMode === 'shipping'" v-model="submitData[`${addressMode}Info`][0].district" placeholder="請選擇鄉鎮市區" filterable @change="onSelectDistrict">
                  <el-option v-for="(district, index) in districts" :key="`billing-district-${index}`" :label="district.name" :value="district.name"> </el-option>
                </el-select>
                <el-select v-else v-model="submitData[`${addressMode}Info`].district" placeholder="請選擇鄉鎮市區" filterable @change="onSelectDistrict">
                  <el-option v-for="(district, index) in districts" :key="`billing-district-${index}`" :label="district.name" :value="district.name"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="郵政編號">
            <el-input v-if="addressMode === 'shipping'" v-model="submitData[`${addressMode}Info`][0].postcode"></el-input>
            <el-input v-else v-model="submitData[`${addressMode}Info`].postcode"></el-input>
          </el-form-item>
          <el-form-item label="詳細地址">
            <el-input v-if="addressMode === 'shipping'" v-model="submitData[`${addressMode}Info`][0].address"></el-input>
            <el-input v-else v-model="submitData[`${addressMode}Info`].address"></el-input>
          </el-form-item>
        </el-form>
        <div :class="$style.footer">
          <el-button class="is-round" @click="visibleDialog = false">取消</el-button>
          <el-button class="is-round" :loading="tryingSave" :disabled="tryingSave" type="primary" @click="onSaveAddress">儲存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" module>
.detail li {
  line-height: 40px;
}
.label-tag {
  :global {
    .el-tag {
      border-color: #808080;
      border-radius: 3px;
      height: 25px;
      line-height: 25px;
      color: #808080;
      margin-bottom: 10px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
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
.detail-form {
  width:550px;

  @include max-sm {
    width: 100%;
  }
  :global {
    .el-input-group__append,
    .el-input-group__prepend {
      border: 1px solid #dcdfe6 !important;
    }
  }
}
</style>
