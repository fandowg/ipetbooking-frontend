<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap , numberUnitFilter } from '@utils/filter-value-to-text'
import { Portal } from 'portal-vue'
import { authComputed , merchantComputed } from '@state/helpers'
import scrollToElement from '@utils/scroll-to-element'

const initData = () => {
  return {
    prepaidId: '',
    fullName: '',
    gender: 'female',
    phoneCode: '+886',
    phoneNumber: '',
    email: '',
    note: '',
    status: 2,
    memberId: '',
    paymentMethod: 'Cash',
    bankType: '',

    taxType: 'B2C',
    CarrierType: '',
    CarrierNum: '',
    taxId: '',
    LoveCode: '',
    invoiceSync: true,
    type:'fixed',
    discount:0
  }
}
export default {
  components: {
    SearchMember: () => lazyLoadComponent(import('@components/Order/SearchMember')),
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
    OrderChangeStatusDialog: () => lazyLoadComponent(import('./OrderChangeStatusDialog')),
    Portal,
    InvoiceForm: () => lazyLoadComponent(import('@components/InvoiceForm')),
  },
  filters: {
    genderFilter,
    numberUnitFilter
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
    prepaid: {
      type: Object,
      default: () => {},
    },
    selectPrice:{
      type:Number,
      default:0
    }
  },
  data() {
    return {
      tryingStore: false,
      submitData: Object.assign({}, this.defaultValue),
 
      prepaidId:'',
      statusDialogVisible: false,
      memberInfo: {},
      bankTypeList: [
        { id: 'BOT', title: '台灣銀行' },
        { id: 'Taishin', title: '台新' },
        { id: 'HNCB', title: '華南' },
      ],
      editCustomerEnabled: false,

    }
  },
  computed: {
    ...authComputed,
    ...merchantComputed,
    submitRules() {
      const isTaiwan = this.submitData.phoneCode === '+886'
      const checkDiscount = (rule, value, callback) => {
        this.$refs.form.validateField('discount')
        callback()
      }
      return {
        phoneNumber: [
          {
            required: true,
            message: '請填寫手機號碼',
            trigger: 'blur',
          },
          {
            pattern: isTaiwan ? /^09\d{8}$/ : '',
            message: '格式請符合 09XXXXXXXX',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '請輸入 Email' },
          { type: 'email', message: '請輸入正確的 Email 格式' },
        ],
        fullName: [
          { required: true, message: '請輸入客戶姓名' },
          {
            validator: (rule, value, callback) => {
              if (this.submitData.gender) {
                callback()
              } else {
                callback(new Error('請選擇客戶性別！'))
              }
            },
            trigger: 'blur',
          },
        ],
        bankType: [{ required: true, message: '請選擇轉帳銀行' }],
        paymentMethod: [
          // { required: true, message: '請選擇付款方式' },
          {
            required: true,
            validator: (rule, value, callback) => {
              if (this.submitData.status !== 2 && value === '') {
                callback(new Error('請選擇付款方式'))
              }
              callback()
            },
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
      }
    },

    isEditMode() {
      return this.defaultValue.id
    },
    isNotReady(){
      const noMember = !this.isEditMode && !this.memberInfoShow
      const noSize = !this.isEditMode && !this.prepaidId
      return noMember || noSize
    },
    statusIsChanged() {
      return this.defaultValue.status !== this.submitData.status
    },
    filteredStatusMap() {
      // ! 已付款不能手動改成未付款
      const filteredStatus = Object.keys(orderStatusMap)
        .filter((status) => {
          // console.log(+status,status)
          switch (this.defaultValue.status) {
            case 1:
              return +status < 2
            case 2:
              //  虛擬帳戶不能手動改成已付款
              // if (+status === 1 && this.defaultValue.paymentMethod === 'Vacc') return false
              // if (+status === 1 && this.defaultValue.paymentMethod === 'Credit') return false
              return +status <= 2
            default:
              return false
          }
        })
        .reduce((obj, key) => {
          obj[key] = orderStatusMap[key]
          return obj
        }, {})

      const createStatus = Object.keys(orderStatusMap)
        .filter((status) => status > 0 && status <= this.defaultValue.status)
        .reduce((obj, key) => {
          obj[key] = orderStatusMap[key]
          return obj
        }, {})

      return this.isEditMode ? filteredStatus : createStatus
    },
    isMemberInfoIncomplete() {
      return this.memberInfo === {} ? true : this.memberInfo.email === null
    },
    CarrierNumExample() {
      if (this.submitData.CarrierType === 1) return '例：AB01234567898765'
      else return '例：/ABC+123'
    },
    storeCashflowSetting() {
      if (this.prepaid) {
        return this.prepaid.storeCashflowSetting
      } else {
        return this.defaultValue.storeCashflowSetting
      }
    },
     memberInfoShow(){
      return Object.keys(this.memberInfo).length !== 0
    },
    merchantCheck(){
      return this.currentUser.merchantAlias === 'lionpet'
    }

  },
  watch: {
    memberInfo: 'updateUserByMember',
    'submitData.paymentMethod'(value) {
      if (value !== 'Vacc') this.submitData.bankType = ''
    },
    'submitData.status'(value) {
      // if(!this.isEditMode){
      // this.submitData.paymentMethod = ''
      // }
      this.submitData.paymentMethod = ''
    },
  },
  created() {
    console.log(this.currentUser.merchantAlias)
    // console.log(this.$hasHomeService())

  },

  methods: {

    emitCancel() {
      this.$emit('cancel')
    },
    emitStore() {
      this.$emit('store')
    },

    async handlePaidStatus(merchantNote) {
      this.isEditMode ? this.tryToSaveOrder(merchantNote) : this.tryToCreateOrder(merchantNote)
    },

    handleStoreOrder() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // show the status dialog when changing order status
          if (this.statusIsChanged && (this.submitData.status === 1 || this.isEditMode)) return (this.statusDialogVisible = true)
          this.isEditMode ? this.tryToSaveOrder() : this.tryToCreateOrder()
        } else {
          this.$nextTick(() => {
            scrollToElement(this.$refs.form.$el.querySelector('.el-form-item__error'), 100)
          })
        }
      })
    },
    handleCreateSuccess(requirePay = false) {
      this.$alert(`已發送${requirePay ? '付款' : '訂單'}連結至客戶 Email`, '包月方案購買成功！', {
        confirmButtonText: '確認',
        center: true,
        callback: () => {
          this.emitStore()
        },
      })
    },
    handleSaveSuccess() {
      this.$message({
        message: '編輯成功！',
        type: 'success',
      })
      this.emitStore()
    },
    async tryToSaveOrder(merchantNote = '') {
      const storeData = {
        ...this.submitData,
        merchantNote,
      }
      this.tryingStore = true
      try {
        await this.$store.dispatch('prepaid/storeOrder', storeData)
        this.handleSaveSuccess()
      } catch (error) {
        // console.log('TCL: tryToSaveOrder -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    async tryToCreateOrder(merchantNote = '') {
      const storeData = {
        ...this.submitData,
        prepaidId: this.prepaidId,
        merchantNote,
        CarrierNum: this.submitData.CarrierType === '2' ? this.submitData.phoneNumber : this.submitData.CarrierNum,
      }

      this.tryingStore = true

      try {
        await this.$store.dispatch('prepaid/storeOrder', storeData)
        let requirePay = storeData.status !== 1
        if (this.prepaid.price === 0) {
          requirePay = false
        }
        this.handleCreateSuccess(requirePay)
      } catch (error) {
        // console.log('TCL: tryToCreateOrder -> error', error)
      } finally {
        this.tryingStore = false
      }
    },

    
    updateMemberInfo(member = {}) {
      if (Object.keys(member).length === 0) {
        this.submitData.phoneNumber = this.$refs.SearchMember.searchData.phoneNumber
      }
      // this.memberInfo = member
    },
    updateUserByMember() {
      const fields = ['memberId', 'fullName', 'gender', 'phoneCode', 'phoneNumber', 'email', 'taxType', 'taxId', 'CarrierType', 'CarrierNum', 'LoveCode']
      fields.forEach((field) => {
        this.submitData[field] = field === 'memberId' ? this.memberInfo.id : this.memberInfo[field]
      })
    },
    onTaxTypeChange() {
      this.submitData.CarrierNum = ''
      this.submitData.taxId = ''
      this.submitData.LoveCode = ''
    },
    changeSize(value){
      // console.log(value)
      const select = this.prepaid.prepaids.find(item=>{
        return item.id === value
      })
      this.$emit('update:selectPrice',select.price)
    },


  },
}
</script>
<template>
  <div :class="$style.wrapper">
    <SearchMember
      ref="SearchMember"
      :sync-member-info.sync="memberInfo" 
      :is-edit-mode="isEditMode" 
      :member-info-show="memberInfoShow" 
      :edit-customer-enabled.sync="editCustomerEnabled"
      @updateMemberInfo="updateMemberInfo" />

    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
      <template v-if="prepaid">
        <el-row v-if="prepaid.price !== 0" :gutter="20">
          <el-col :span="24">
             <el-form-item v-if="!isEditMode" prop="status" label="選擇體型">
              <el-select v-model="prepaidId" placeholder="選擇體型" @change="changeSize">
                <el-option v-for="(item, index) in prepaid.prepaids" :key="item.id" :value="item.id" :label="`${item.sizeTitle} / ${item.price}元`" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="status" label="訂單狀態">
              <el-select v-model="submitData.status" placeholder="訂單狀態">
                <el-option v-for="(status, statusValue) in filteredStatusMap" :key="statusValue" :value="+statusValue" :label="status.text"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <template>
              <el-form-item :class="$style['payment-methods']" label="付款方式" prop="paymentMethod">
                <el-radio-group v-model="submitData.paymentMethod">
                  <el-radio v-if="submitData.status === 2" label border>不指定</el-radio>
                  <el-radio label="Cash" border>到店付款(現金)</el-radio>
                  <el-radio label="StoreCredit" border>現場刷卡</el-radio>
                  <el-radio label="Atm" border>線下匯款</el-radio>
                  <el-radio v-if="submitData.status === 2 && storeCashflowSetting === 1" label="Credit" border>信用卡付款</el-radio>
                  <el-radio v-if="submitData.status === 2 && storeCashflowSetting !== 0" label="Vacc" border>ATM虛擬帳戶</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="submitData.paymentMethod === 'Vacc'" prop="bankType" label="轉帳銀行">
                <el-select v-model="submitData.bankType">
                  <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
        <el-alert v-if="prepaid.price === 0" style="margin-bottom: 20px" title="本包月方案免費" type="warning" :closable="false"></el-alert>
      </template>
      <template v-if="!prepaid">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item prop="status" label="訂單狀態">
              <el-select v-model="submitData.status" placeholder="訂單狀態">
                <el-option v-for="(status, statusValue) in filteredStatusMap" :key="statusValue" :value="+statusValue" :label="status.text"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <template v-if="defaultValue.status === 2 && submitData.status !== 0">
              <el-form-item :class="$style['payment-methods']" label="付款方式" prop="paymentMethod">
                <el-radio-group v-model="submitData.paymentMethod">
                  <el-radio v-if="submitData.status === 2" label border>不指定</el-radio>
                  <el-radio label="Cash" border>到店付款(現金)</el-radio>
                  <el-radio label="StoreCredit" border>現場刷卡</el-radio>
                  <el-radio label="Atm" border>線下匯款</el-radio>
                  <el-radio v-if="submitData.status === 2 && storeCashflowSetting === 1" label="Credit" border>信用卡付款</el-radio>
                  <el-radio v-if="submitData.status === 2 && storeCashflowSetting !== 0" label="Vacc" border>ATM虛擬帳戶</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="submitData.paymentMethod === 'Vacc'" prop="bankType" label="轉帳銀行">
                <el-select v-model="submitData.bankType">
                  <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-col>
         
        </el-row>
         
        <!-- <el-alert v-if="defaultValue.priceTotal === 0" style="margin-bottom:20px" title="本包月方案免費" type="warning" :closable="false"></el-alert> -->
      </template>
      <!-- <template v-if="!isEditMode && isMemberInfoIncomplete">
        <el-form-item prop="fullName" label="客戶資訊">
          <el-input v-model="submitData.fullName" placeholder="姓名">
            <el-select slot="append" v-model="submitData.gender" placeholder="性別">
              <el-option value="female" label="小姐"></el-option>
              <el-option value="male" label="先生"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="phoneNumber">
          <el-input v-model="submitData.phoneNumber" placeholder="手機號碼" autocomplete="tel">
            <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" />
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="submitData.email" placeholder="Email"></el-input>
        </el-form-item>
      </template> -->
      <template v-if="!isEditMode">
       
        <el-row :gutter="20">
        <el-col :sm="15" :span="24">
              <el-form-item label="折扣類型" prop="type" >
                <el-radio-group v-model="submitData.type">
                  <el-radio style="background:none" label="fixed">固定金額</el-radio>
                  <el-radio style="background:none" label="%">按訂單總額比例</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :sm="9" :span="24">
              <el-form-item label="數值" prop="discount" >
                <el-input v-model.number="submitData.discount" min="0">
                  <template v-slot:append>{{ submitData.type | numberUnitFilter }}</template>
                </el-input>
              </el-form-item>
            </el-col>
        </el-row>
      </template>
      <template v-if="isEditMode">
        <el-form-item label="客戶資訊">
          <ul :class="$style.info">
            <li>{{ submitData.fullName }} {{ submitData.gender | genderFilter }}</li>
            <li>{{ `${submitData.phoneCode} ${submitData.phoneNumber}` }}</li>
            <li>{{ submitData.email }}</li>
          </ul>
        </el-form-item>
      </template>

      <!-- <template v-if="!isEditMode">
        <el-divider></el-divider>
        <h5 :class="$style.title">發票資訊</h5>
        <small style="opacity: 0.5; margin-bottom: 20px; display: block">發票開立後如欲修改發票資訊，請至ezPay電子發票後台處理</small>
        <InvoiceForm :default-value="submitData" />
      </template> -->
    </el-form>
    <!-- <el-row :gutter="20">
      <el-col :span="12">
        <el-button class="is-fullwidth" @click="emitCancel">{{ `取消${(isEditMode) ? '編輯' : '新增'}` }}</el-button>
      </el-col>
      <el-col :span="12">
        <el-button
          class="is-fullwidth"
          type="primary"
          :loading="tryingStore"
          @click="handleStoreOrder"
        >{{ (isEditMode) ? '儲存變更' : '新增訂單'}}</el-button>
      </el-col>
    </el-row> -->
    <Portal to="drawer-prepaid-header">
      <el-button class="is-round" type="primary" :disabled="tryingStore || isNotReady" :loading="tryingStore" @click="handleStoreOrder">{{ isEditMode ? '儲存變更' : '新增訂單' }}</el-button>
      <el-button class="is-round" @click="emitCancel">{{ `取消${isEditMode ? '編輯' : '新增'}` }}</el-button>
    </Portal>
    <OrderChangeStatusDialog :visible.sync="statusDialogVisible" :order="submitData" @paid="handlePaidStatus" @cancelled="emitStore" />
  </div>
</template>
<style lang="scss" module>
@import '@design';
.wrapper {
  border-top: 1px solid $color-border-base;
  :global {
    .el-form-item__label {
      @extend %font-heading;
    }
  }
}

.infoList {
  margin-bottom: 30px;
  padding-top: 15px;
  // font-size: 16px;
  :global {
    .muted {
      color: $color-text-secondary;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .infoList {
      &__title {
        font-weight: 500;
        margin-bottom: 20px;
      }
      &__item {
        margin-bottom: 15px;
      }
      &__row {
        margin-bottom: 20px;
      }
    }
  }
}

.search-form {
  margin-bottom: 15px;
  // border-bottom: 1px solid $color-border-base;
}

.title:not(:first-child) {
  margin-top: 30px;
}

.info {
  padding-inline-start: 0;
  line-height: 1.2;
  > li {
    padding: 5px 0;
  }
}

.params {
  &-options {
    display: flex;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  &-list {
    padding: 5px 15px;
    background: white;
    &__item {
      display: flex;
      justify-content: space-between;

      &:first-child {
        color: $color-text-placeholder;
      }
      > * {
        flex: 1;
        &:first-child {
          flex: 2;
        }
        &:not(:first-child) {
          text-align: right;
        }
      }
    }
  }
}
.payment-methods {
  :global {
    .el-radio {
      margin: 5px !important;
    }
  }
}
</style>
