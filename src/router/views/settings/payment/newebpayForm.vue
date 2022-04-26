
<script>
import tourMixin from '@src/mixins/tour'

import { merchantComputed } from '@state/helpers'

import NewebPayBusinessType from './newebpay_businessType'
import NewebPayIDCardPlace from './newebpay_IDCardPlace'
import TaiwanCityCode from '@utils/taiwan-city-area'
import TaiwanBankCode from '@utils/taiwan-bank-code'
import TaiwanBankBranchCode from '@utils/taiwan-bank-branch-code'

export default {
  mixins: [tourMixin],
  tourName: 'newebpayForm',
  data() {
    return {
      NewebPayBusinessType: Object.freeze(NewebPayBusinessType),
      NewebPayIDCardPlace: Object.freeze(NewebPayIDCardPlace),
      TaiwanCityAreaCodeList: Object.freeze(TaiwanCityCode),
      TaiwanBankCodeList: Object.freeze(TaiwanBankCode),
      tryingToApply: false,
      submitData: {
        MemberType: 0,
        MemberUnified: '',
        Nationality: 1,
        ManagerID: '',
        IDCardDate: '',
        IDCardPlace: '',
        IDPic: 0,
        IDFrom: 1,
        MemberName: '',
        MemberPhone: '',
        ManagerName: '',
        ManagerNameE: '',
        LoginAccount: '',
        ManagerMobile: '',
        ManagerEmail: '',
        MerchantName: '',
        MerchantNameE: '',
        MerchantWebURL: '',
        MerchantAddrCity: '',
        MerchantAddrArea: '',
        MerchantAddrCode: '',
        MerchantAddr: '',
        NationalE: 'Taiwan',
        CityE: '',
        MerchantType: 1,
        BusinessType: '',
        MerchantDesc: '',
        BankCode: '',
        SubBankCode: '',
        BankAccount: '',
      },
    }
  },
  computed: {
    ...merchantComputed,
    isEnterprise() {
      return this.submitData.MemberType === 1
    },
    selectedCityAreaList() {
      const selectedCity = this.submitData.MerchantAddrCity
      const checkCityExit = this.TaiwanCityAreaCodeList.cities[selectedCity]

      return selectedCity && checkCityExit ? checkCityExit['AreaList'] : []
    },
    selectedBankBranchList() {
      return TaiwanBankBranchCode[this.submitData.BankCode]
    },
    submitRules() {
      return {
        MemberUnified: [
          {
            required: true,
            message: '請輸入會員證號',
            trigger: 'blur',
          },
        ],
        ManagerID: [
          {
            required: this.isEnterprise,
            message: '請輸入身分證字號',
            trigger: 'blur',
          },
        ],
        IDCardDate: [
          {
            required: !this.isEnterprise,
            message: '請輸入身分證發證日期',
            trigger: 'blur',
          },
          {
            max: 7,
            pattern: /^[0-9]{1,3}(0?[1-9]|1[012])(0?[1-9]|[12][0-9]|3[01])$/,
            message: '請輸入有效的日期格式',
            trigger: 'blur',
          },
        ],
        IDCardPlace: [
          {
            required: !this.isEnterprise,
            trigger: 'blur',
          },
        ],
        IDPic: [
          {
            required: !this.isEnterprise,
            trigger: 'blur',
          },
        ],
        IDFrom: [
          {
            required: !this.isEnterprise,
            trigger: 'blur',
          },
        ],
        MemberName: [
          {
            required: true,
            message: '請輸入會員名稱',
            trigger: 'blur',
          },
          {
            max: this.isEnterprise ? 60 : 20,
            message: `${this.isEnterprise ? '60' : '20'}個字為限`,
            trigger: 'blur',
          },
        ],
        MemberPhone: [
          {
            required: true,
            pattern: /^09\d{2}-\d{6}$/,
            message: '格式請符合 09XX-XXXXXX（需包含英文半形減號）',
            trigger: 'blur',
          },
        ],
        ManagerName: [
          {
            required: true,
            trigger: 'blur',
            message: '請輸入使用者真實姓名',
          },
        ],
        ManagerNameE: [
          {
            required: true,
            message: '請輸入使用者護照英文名字',
            trigger: 'blur',
          },
          {
            pattern: /.,/,
            message: '請使用英文半形逗點分隔姓名，如：Xiao ming,Wang',
            trigger: 'blur',
          },
        ],
        MerchantAddrCity: [
          {
            required: true,
            message: '請選擇戶籍地址／營業登記地址所屬城市',
            trigger: 'change',
          },
        ],
        MerchantAddrArea: [
          {
            required: true,
            message: '請選擇戶籍地址／營業登記地址所屬地區',
            trigger: 'change',
          },
        ],
        MerchantAddr: [
          {
            required: true,
            message: '請填寫戶籍地址／營業登記地址路名及門牌號碼',
            trigger: 'blur',
          },
        ],
        CityE: [
          {
            required: true,
            message: '請選擇設立登記營業城市',
            trigger: 'change',
          },
        ],
        BusinessType: [
          {
            required: true,
            message: '請選擇服務型態分類',
            trigger: 'change',
          },
        ],

        BankCode: [
          {
            required: true,
            message: '請選擇金融機構帳戶銀行',
            trigger: 'change',
          },
        ],
        SubBankCode: [
          {
            required: true,
            message: '請選擇金融機構帳戶分行',
            trigger: 'change',
          },
        ],
        BankAccount: [
          {
            required: true,
            message: '請填寫帳戶帳號',
            trigger: 'blur',
          },
          {
            pattern: /^\d{10,14}$/,
            message: '請輸入有效的帳戶帳號',
            trigger: 'blur',
          },
        ],
      }
    },

    managerIDPlaceholder() {
      const nationalityMap = {
        1: '如：A123456789',
        2: '如：AC12345678',
        3: '如：19420712RO',
      }
      return nationalityMap[this.submitData.Nationality]
    },
  },
  watch: {
    'submitData.MerchantAddrCity': 'changeSelectedCity',
  },
  mounted() {
    this.$_tour_pageInit()
  },
  methods: {
    fillFieldsFromInfo() {
      const infoFields = {
        name: 'MerchantName',
        phoneNumber: 'MemberPhone',
        email: 'ManagerEmail',
        city: 'MerchantAddrCity',
        address: 'MerchantAddr',
      }
      Object.keys(infoFields).forEach((field) => {
        const formatValue = (field, value) => {
          if (field === 'phoneNumber') {
            const isCellPhone = /^09/.test(value)
            return isCellPhone
              ? value.replace(/(\d{4})(\d{6})/, '$1-$2')
              : value.replace(/(\d{2})(\d{7,8})/, '$1-$2')
          }
          return value
        }
        this.$set(
          this.submitData,
          infoFields[field],
          formatValue(field, this.currentMerchant[field])
        )
      })
    },
    changeMemberName(value) {
      if (!this.isEnterprise) this.submitData.ManagerName = value
    },
    changeSelectedCity(value) {
      this.submitData.MerchantAddrArea = ''
      this.submitData.MerchantAddrCode = ''

      this.submitData.CityE = this.TaiwanCityAreaCodeList.cities[
        value
      ].CityEngName
    },
    changeSelectedArea() {
      this.submitData.MerchantAddrCode = this.TaiwanCityAreaCodeList.areas[
        this.submitData.MerchantAddrArea
      ]['ZipCode']
    },
    changeSelectedBank() {
      this.submitData.SubBankCode = ''
    },
    addAutoFillData(userData) {
      const autoFillData = {
        LoginAccount: `din_${this.currentMerchant.alias}`,
        ManagerMobile: userData.MemberPhone.replace('-', ''),
        ManagerEmail: this.currentMerchant.email,
        MerchantName: this.currentMerchant.name,
        MerchantNameE: this.currentMerchant.alias,
        MerchantWebURL: this.merchantUrl,
        MerchantDesc:
          this.currentMerchant.description || this.currentMerchant.name,
      }
      return {
        ...userData,
        ...autoFillData,
      }
    },
    async tryToApply() {
      this.tryingToApply = true
      try {
        await this.$refs.form.validate()
        await this.$store.dispatch(
          'merchant/paymentApply',
          this.addAutoFillData(this.submitData)
        )

        await this.$alert(
          '您已可設定方案價格，待藍新金流審核通過',
          '金流申請成功！',
          {
            confirmButtonText: '確認',
            type: 'success',
            center: true,
          }
        )

        this.$emit('submit')
      } catch (error) {
        // console.log('TCL: tryToApply -> error', error)
      } finally {
        this.tryingToApply = false
      }
    },
  },
}
</script>

<template>
  <el-form
    ref="form"
    :model="submitData"
    :rules="submitRules"
    label-position="top"
    :validate-on-rule-change="false"
  >
    <h4 class="form-block-title">請選擇申請的會員類型</h4>
    <el-form-item prop="MemberType" data-tour-text="請選擇您的營業身份。若需要開立三聯式發票，請選擇「企業」。">
      <el-radio-group v-model="submitData.MemberType">
        <el-radio :label="0">個人</el-radio>
        <el-radio :label="1">企業</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        data-tour-text="點擊後將會把您在「商店資訊」填寫的資料自動填入相對應的欄位內。"
        @click="fillFieldsFromInfo"
      >快速帶入商店資訊欄位資料</el-button>
    </el-form-item>

    <h4 class="form-block-title">會員身分與聯絡資料</h4>
    <el-form-item label="會員證號" prop="MemberUnified" required>
      <el-input
        v-model="submitData.MemberUnified"
        :placeholder="(isEnterprise) ?  '企業統一編號' : '身分證字號'"
      />
    </el-form-item>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="身分證件類型" prop="Nationality" required>
          <el-radio-group v-model="submitData.Nationality">
            <el-radio :label="1">本國身分證字號</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="isEnterprise" :span="12">
        <el-form-item label="企業代表人身分證件號" prop="ManagerID">
          <el-input v-model="submitData.ManagerID" :placeholder="managerIDPlaceholder" />
        </el-form-item>
      </el-col>
      <el-col v-if="!isEnterprise" :span="12">
        <el-form-item label="身分證發證日期（民國年月日）" prop="IDCardDate">
          <el-input v-model="submitData.IDCardDate" placeholder="如：1090101" />
        </el-form-item>
      </el-col>
      <el-col v-if="!isEnterprise" :span="12">
        <el-form-item label="身分證發證地點" prop="IDCardPlace">
          <el-select v-model="submitData.IDCardPlace" placeholder="請選擇發證地點縣市">
            <el-option
              v-for="place in NewebPayIDCardPlace"
              :key="place.value"
              :label="place.label"
              :value="place.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col v-if="!isEnterprise" :span="12">
        <el-form-item label="身分證上是否有照片" prop="IDPic">
          <el-radio-group v-model="submitData.IDPic">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col v-if="!isEnterprise" :span="12">
        <el-form-item label="身分證領補換" prop="IDFrom">
          <el-radio-group v-model="submitData.IDFrom">
            <el-radio :label="1">初發</el-radio>
            <el-radio :label="2">補發</el-radio>
            <el-radio :label="3">換發</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
    </el-row>

    <el-form-item :label="`會員名稱（${(isEnterprise) ? '公司登記之名稱' : '身分證登記姓名' }）`" prop="MemberName">
      <el-input
        v-model="submitData.MemberName"
        :maxlength="(isEnterprise) ? 60 : 20"
        @change="changeMemberName"
      />
    </el-form-item>
    <el-form-item label="聯絡手機" prop="MemberPhone">
      <el-input v-model="submitData.MemberPhone" placeholder="如：09XX-XXXXXX" />
    </el-form-item>
    <h4 class="form-block-title">商店管理者</h4>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="使用者真實姓名（若無中文姓名，請輸入英文姓名）" prop="ManagerName">
          <el-input v-model="submitData.ManagerName" placeholder="如：王小明" autocomplete="name" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="使用者護照英文姓名（格式：名,姓，半形逗號）" prop="ManagerNameE">
          <el-input v-model="submitData.ManagerNameE" placeholder="如：Xiao ming,Wang" />
        </el-form-item>
      </el-col>
    </el-row>
    <h4 class="form-block-title">商店資料</h4>
    <el-form-item label="戶籍地址／營業登記地址" prop="MerchantAddr">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-select v-model="submitData.MerchantAddrCity" @change="changeSelectedCity">
            <el-option
              v-for="city in TaiwanCityAreaCodeList.cities"
              :key="city.CityName"
              :label="city.CityName"
              :value="city.CityName"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-select v-model="submitData.MerchantAddrArea" @change="changeSelectedArea">
            <el-option v-for="area in selectedCityAreaList" :key="area" :label="area" :value="area"></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input :value="submitData.MerchantAddrCode" readonly />
        </el-col>
        <el-col :span="24" :class="$style.address">
          <el-input
            v-model="submitData.MerchantAddr"
            placeholder="路名及門牌號碼"
            autocomplete="address-line1"
          />
        </el-col>
      </el-row>
    </el-form-item>

    <el-form-item label="服務型態" prop="MerchantType" required>
      <el-radio-group v-model="submitData.MerchantType">
        <el-radio :label="1">實體商品</el-radio>
        <el-radio :label="2">服務</el-radio>
        <el-radio :label="3">虛擬商品</el-radio>
        <el-radio :label="4">票券</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="服務型態分類" required>
      <el-select v-model="submitData.BusinessType">
        <el-option
          v-for="type in NewebPayBusinessType"
          :key="type.value"
          :label="type.label"
          :value="type.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <h4 class="form-block-title">會員金融機構帳戶</h4>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form-item label="金融機構代碼" prop="BankCode">
          <el-select v-model="submitData.BankCode" @change="changeSelectedBank">
            <el-option
              v-for="bank in TaiwanBankCodeList"
              :key="bank.name"
              :label="`${bank.name}(${bank.code})`"
              :value="bank.code"
            >
              <span>{{bank.name}}</span>
              <span class="select__option--meta">{{bank.code}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="金融機構分行代碼" prop="SubBankCode">
          <el-select v-model="submitData.SubBankCode">
            <el-option
              v-for="branch in selectedBankBranchList"
              :key="branch.name"
              :label="`${branch.name}(${branch.code})`"
              :value="branch.code"
            >
              <span>{{branch.name}}</span>
              <span class="select__option--meta">{{branch.code}}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="帳戶帳號（戶名需與會員名稱相同）" prop="BankAccount">
          <el-input v-model="submitData.BankAccount" />
        </el-form-item>
      </el-col>
      <el-col :span="8" :offset="8">
        <el-button
          data-tour-text="辛苦填寫完的資料請記得點擊提交，完成申請手續！"
          type="primary"
          class="is-fullwidth"
          :loading="tryingToApply"
          @click="tryToApply"
        >註冊會員並提交申請</el-button>
      </el-col>
    </el-row>
  </el-form>
</template>


<style lang="scss" module>
@import '@design';

.address {
  margin-top: 20px;
}
</style>