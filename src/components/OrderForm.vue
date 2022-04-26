<script>
import cloneDeep from 'lodash/cloneDeep'
import lazyLoadComponent from '@router/lazyload-component'
import { groupById } from '@utils/normalize-data'
import { genderFilter, orderStatusMap, bookingStatusMap } from '@utils/filter-value-to-text'
import { formatStatusMessage } from '@utils/request'
import { Portal } from 'portal-vue'
import formatDate from '@utils/format-date'
import { differenceInDays } from 'date-fns'
import scrollToElement from '@utils/scroll-to-element'

const initData = () => {
  return {
    params: [],
    fullName: '',
    gender: 'female',
    phoneCode: '+886',
    phoneNumber: '',
    email: '',
    note: '',
    status: 2,
    basePrice: '',
    total: '',
    allowExpired: 0,
    couponCode: '',
    memberId: '',
    prepaidOrderUuid: '',
    byOrderExtrafields: {},
    customerInfos: [],
    paymentMethod: 'Cash',
    bankType: 'BOT'
  }
}
export default {
  components: {
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
    OrderChangeStatusDialog: () => lazyLoadComponent(import('./OrderChangeStatusDialog')),
    OrderExtraField: () => lazyLoadComponent(import('@components/OrderExtraField')),
    Portal,
  },
  filters: {
    genderFilter,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
    inventory: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tryingStore: false,
      submitData: Object.assign({}, initData(), this.defaultValue),
      searchData: {
        phoneCode: '+886',
        phoneNumber: '',
      },
      searchRules: {
        phoneNumber: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback()
              this.$store
                .dispatch('member/findByPhone', this.searchData)
                .then((member) => {
                  this.updateMemberInfo(member)
                })
                .catch(() => {
                  this.updateMemberInfo()
                  return callback(new Error('此手機號碼尚未註冊'))
                })
            },
            trigger: 'custom',
          },
        ],
      },
      statusDialogVisible: false,
      productParams: [],
      couponInfo: '',
      memberInfo: '',
      userSameAsMember: false,

      selectedPrepaid: '',
      productHasExtraField: false,

      bankTypeList: [{ id: 'BOT', title: '台灣銀行' }, { id: 'Taishin', title: '台新' }, { id: 'HNCB', title: '華南' }],
      filterCities:[]
    }
  },
  computed: {
    submitRules() {
      const isTaiwan = this.submitData.phoneCode === '+886'
      let validCodeTimeout = ''
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
        email: [{ required: true, message: '請輸入 Email' }, { type: 'email', message: '請輸入正確的 Email 格式' }],
        fullName: [{ required: true, message: '請輸入使用人姓名' }],
        bankType: [{ required: this.isRequiredBankType, message: '請選擇轉帳銀行' }],
        city: [{ required: this.isHomeService, message: '請選擇縣市'}],
        district: [{ required: this.isHomeService, message: '請選擇區域'}],
        address: [{ required: true, message: '請輸入服務地址' }],
        prepaidOrderUuid: [{ required: this.isRequiredPrePaid, message: '請選擇包月方案', trigger: 'change' }],
        couponCode: [
          {
            validator: (rule, value, callback) => {
              clearTimeout(validCodeTimeout)
              if (value === '') {
                this.$refs.form.clearValidate('couponCode')
                return callback()
              }
              validCodeTimeout = setTimeout(() => {
                this.$store
                  .dispatch('coupon/validCode', {
                    code: value,
                    basePrice: this.paramPriceTotal,
                    productId: this.inventory.productId,
                  })
                  .then((response) => {
                    callback()
                    this.applyCoupon(response.items)
                  })
                  .catch((error) => callback(new Error(formatStatusMessage(error.status))))
              }, 500)
            },
            trigger: 'custom',
          },
        ],
      }
    },
    submitPriceTotal() {
      const calcFixedDiscount = (value = 0, total = 0) => {
        return total - value
      }
      const calcPercentDiscount = (value = 0, total = 1) => {
        return total - Math.round(total * (value / 100))
      }
      const basePriceTotal = this.paramPriceTotal
      const { discount, type } = this.couponInfo

      return this.couponInfo ? (type === 'fixed' ? calcFixedDiscount(discount, basePriceTotal) : calcPercentDiscount(discount, basePriceTotal)) : basePriceTotal
    },
    isEditMode() {
      return this.defaultValue.id
    },
    statusIsChanged() {
      return this.defaultValue.status !== this.submitData.status
    },
    filteredStatusMap() {
      // ! 已付款不能手動改成未付款
      const filteredStatus = Object.keys(bookingStatusMap)
        .filter((status) => {
          switch (this.defaultValue.status) {
            case 1:
              return +status < 2
            case 2:
              //  虛擬帳戶不能手動改成已付款
              // if (+status === 1 && this.defaultValue.paymentMethod === 'Vacc') return false
              return +status <= 2
            case 3:
              return +status === 0 || +status === 3
            case 4:
              return +status === 4 || +status === 0 
            case 5:
              return +status === 0 || +status === 5
            case 6:
              return +status === 6
            default:
              return false
          }
        })
        .reduce((obj, key) => {
          obj[key] = bookingStatusMap[key]
          return obj
        }, {})
      return this.isEditMode ? filteredStatus : bookingStatusMap
    },
    availableSizeTotal() {
      if (this.inventory.infinity) return 9999 - this.inventory.qty
      return this.inventory.inventory - this.inventory.qty || 0
    },
    paramSizeTotal() {
      const sizeArray = this.submitData.params.map((param) => {
        return +param.qty * +param.size
      })
      return sizeArray.length > 0 ? sizeArray.reduce((prev, curr) => +prev + +curr, 0) : ''
    },
    paramPriceTotal() {
      const priceArray = this.submitData.params.map((param) => {
        return +param.qty * +param.price
      })
      return priceArray.length > 0 ? priceArray.reduce((prev, curr) => +prev + +curr, 0) : ''
    },
    paramsWithNoQty() {
      return this.submitData.params.filter((param) => param.qty !== 0)
    },
    availablePrepaidList() {
      const memberPrepaids = (this.memberInfo && this.memberInfo.availablePrepaidOrders) || []
      const chosenPriceIds = this.paramsWithNoQty.map((param) => param.id)
      const chosenPriceQty = this.paramSizeTotal

      const checkPrepaidUsability = (prepaidPriceIds, chosenPriceIds) => {
        const getExcludePriceIds = chosenPriceIds.filter((priceId) => !prepaidPriceIds.has(priceId))
        return getExcludePriceIds.length === 0
      }

      const checkPrepaidAvailability = (prepaidQty, chosenQty) => {
        return chosenQty <= prepaidQty
      }

      const checkedPrepaids = memberPrepaids.filter((memberPrepaid) => {
        const { times, used, productPriceIds } = memberPrepaid
        return checkPrepaidUsability(new Set(productPriceIds), chosenPriceIds) && checkPrepaidAvailability(times - used, chosenPriceQty)
      })
      return groupById(checkedPrepaids, 'prepaid') || {}
    },
    productType() {
      if (this.inventory) return this.inventory.productType
      return this.defaultValue.productType || this.$route.params.product.type
    },
    isAddOrdersCanceled() {
      return this.defaultValue.addOrders.every((order)=> order.status === 0)
    },
    showVacc() {
      const bookingDate = new Date(formatDate(new Date(this.defaultValue.date)))
      const today = new Date(formatDate(new Date()))
      // 虛擬帳戶付款距離預約日要大於1天
      return differenceInDays(bookingDate, today) > 1
    },
    isRequiredPrePaid() {
      return this.memberInfo && this.submitPriceTotal > 0 && this.submitData.paymentMethod === 'Prepaid' && Object.keys(this.availablePrepaidList).length > 0
    },
    isRequiredBankType() {
      return this.submitData.paymentMethod === 'Vacc'
    },
    storeCashflowSetting(){
      return this.defaultValue.storeCashflowSetting
    },
    isHomeService(){
      return this.defaultValue.storeType === 'home'
    },
    //    filterCities(){
    // const cities = this.products.find(item=>{
    //    return item.id === this.submitData.productId
    //  }).addressRestrictions
    //  return cities
    // },
    districts() {
      if(!this.submitData.city){
        return []
      }
      const city = this.filterCities.find(item=>{
        return this.submitData.city === item.city
      })
      return city.district 
    },

  },
  watch: {
    'submitData.paymentMethod'(value) {
      if (value !== 'Prepaid') this.submitData.prepaidOrderUuid = ''
      if (value !== 'Vacc') this.submitData.bankType = ''
    },
    availablePrepaidList(value) {
      // if (Object.keys(value).length === 0) this.submitData.prepaidOrderUuid = ''
    },
    'submitData.prepaidOrderUuid'(value) {
      this.updateSelectedPrepaid(value)
    },
    'submitData.params': { handler: 'updateEachExtraField', deep: true },
    memberInfo: 'updateUserByMember',
    userSameAsMember: 'updateUserByMember',
  },
  created() {
    if (!this.isEditMode) this.tryToGetParams()

    if (!this.isEditMode) this.fetchExtraField()

    if (this.isEditMode) this.tryToFetchMember()

    if (this.isEditMode) this.tryToGetFilterCities()
  },
  methods: {
    isEmptyExtrafields(Extrafields) {
      return Extrafields instanceof Array
    },
    emitCancel() {
      this.$emit('cancel')
    },
    emitStore() {
      this.$emit('store')
    },
    applyCoupon(couponData) {
      this.couponInfo = couponData
    },
    validCoupon() {
      this.$refs.form.validateField('couponCode')
    },
    resetCoupon() {
      this.couponInfo = ''
      this.$refs.couponCode.resetField('couponCode')
    },
    async tryToGetParams() {
      this.productParams = await this.$store.dispatch('product/fetchPrices', {
        productId: this.inventory.productId,
      })

      const paramWithQty = this.productParams.map((param) => {
        return {
          ...param,
          qty: 0,
        }
      })

      this.$set(this.submitData, 'params', paramWithQty)
    },
    async handlePaidStatus(merchantNote) {
      this.isEditMode ? this.tryToSaveOrder(merchantNote) : this.tryToCreateOrder(merchantNote)
    },

    handleStoreOrder() {
      // show the status dialog when changing order status
      this.$refs.form.validate((valid) => {
        if (valid) {

          /* if (this.defaultValue.paymentMethod === 'Prepaid' && this.submitData.status === 1) {
            this.$confirm('付款方式為「抵扣包月方案」時，<br>不允許將訂單狀態改為已確認', '警告', {
              confirmButtonText: '確定',
              showCancelButton: false,
              type: 'error',
              center: true,
              dangerouslyUseHTMLString: true
            })
            return
          } */

          if ( this.statusIsChanged && this.isEditMode )
          return (this.statusDialogVisible = true)
          if (this.submitData.paymentMethod === 'Prepaid' && this.defaultValue.paymentMethod !== 'Prepaid') {
            if (Object.keys(this.availablePrepaidList).length > 0 && this.submitData.prepaidOrderUuid === '') {
              this.$confirm('請選擇包月方案', '提示', {
                confirmButtonText: '確定',
                showCancelButton: false,
                type: 'warning',
                center: true,
              })
              return
            }
            if (Object.keys(this.availablePrepaidList).length === 0) {
              this.$confirm('目前選擇的服務項目無適用之包月方案，<br>請選擇其他付款方式', '提示', {
                confirmButtonText: '確定',
                showCancelButton: false,
                type: 'warning',
                center: true,
                dangerouslyUseHTMLString: true
              })
              return
            }
          }

          this.isEditMode ? this.tryToSaveOrder() : this.tryToCreateOrder()
        } else {
          this.$nextTick(()=>{
            scrollToElement(this.$refs.form.$el.querySelector('.el-form-item__error'), 100)
          })
        }
      })
    },
    handleCreateSuccess(requirePay = false) {
      this.$alert(`已發送${requirePay ? '付款' : ' QR Code '}連結至使用人 Email`, '訂單新增成功！', {
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
        ...this.convertExtraFieldToStoreDataFromEditMode(this.submitData),
        basePrice: this.paramPriceTotal,
        total: this.submitPriceTotal,
        merchantNote,
      }
      // if(this.isEditMode){
      //   delete storeData.prepaidOrderUuid
      // }
      this.tryingStore = true
      try {
        await this.$store.dispatch('order/store', storeData)
        this.handleSaveSuccess()
      } catch (error) {
        this.$message({
          type: 'error',
          message: `Server Error`,
        })
        // console.log('TCL: tryToSaveOrder -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    async tryToCreateOrder(merchantNote = '') {
      const orderExtrafields = this.productHasExtraField ? this.convertExtraFieldToStoreDataFromCreateMode() : undefined

      const storeData = {
        ...this.submitData,
        basePrice: this.paramPriceTotal,
        total: this.submitPriceTotal,
        groupSize: this.paramSizeTotal,
        productId: this.inventory.productId,
        inventoryId: this.inventory.id,
        merchantNote,
        orderExtrafields,
      }

      this.tryingStore = true

      try {
        await this.$store.dispatch('order/store', storeData)
        const requirePay = storeData.status === 1 ? false : storeData.status === 2 && storeData.total > 0
        this.handleCreateSuccess(requirePay)
      } catch (error) {
        // console.log('TCL: tryToCreateOrder -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    calculateParamMaxQty(size) {
      const remainSize = this.availableSizeTotal - this.paramSizeTotal
      const remainParamQty = remainSize >= size ? Math.floor(this.paramSizeTotal / size) : 0
      return Math.floor(remainSize / size) + remainParamQty
    },
    updateSelectedPrepaid(prepaidUuid) {
      this.selectedPrepaid = this.availablePrepaidList[prepaidUuid]
    },
    validPhoneNumber(phoneNumber) {
      this.$refs.searchForm.validateField('phoneNumber')
    },
    updateMemberInfo(member = '') {
      if (!member) {
        this.submitData.phoneNumber = this.searchData.phoneNumber
      }
      this.memberInfo = member
      this.userSameAsMember = !!member
    },
    updateUserByMember() {
      const fields = ['memberId', 'fullName', 'gender', 'phoneCode', 'phoneNumber', 'email']
      fields.forEach((field) => {
        this.submitData[field] = field === 'memberId' ? this.memberInfo.id : this.memberInfo[field]
      })
    },
    convertExtraFieldToStoreDataFromEditMode(submitData) {
      const orderInfo = cloneDeep(submitData)
      const storeData = cloneDeep(this.$refs.extrafield.defaultValue)
      orderInfo.byOrderExtrafields = this.getExtraFieldsArray(storeData.byOrderExtrafields)
      orderInfo.bySizeExtrafields = this.getBySizeExtraFieldsArray(storeData.customerInfos)
      delete orderInfo.customerInfos
      return orderInfo
    },
    getBySizeExtraFieldsArray(customerInfos) {
      return customerInfos.map((customerInfo) => {
        return {
          customerInfoId: customerInfo.customerInfoId,
          orderExtrafields: this.getExtraFieldsArray(customerInfo.bySizeExtrafields),
        }
      })
    },
    getExtraFieldsArray(extraFields) {
      const extraFieldsArray = []
      Object.keys(extraFields).forEach((extraFieldsId) => {
        if (this.isEdited(extraFields[extraFieldsId])) {
          const { id, value } = extraFields[extraFieldsId]
          extraFieldsArray.push({ id, value })
        }
      })
      return extraFieldsArray
    },
    isEdited(field) {
      return field.edited === true
    },
    async fetchExtraField() {
      const productInfo = await this.$store.dispatch('product/fetchSingle', this.inventory.productId)
      this.defaultValue.byOrderExtrafields = this.convertToObject(productInfo.orderExtrafields.byOrder)
      this.bySizeExtraFieldsQuestion = productInfo.orderExtrafields.bySize
      this.productHasExtraField = productInfo.orderExtrafields.bySize !== null || productInfo.orderExtrafields.byOrder !== null
    },
    convertToObject(extraFields) {
      if (extraFields === null) return
      const fields = {}
      extraFields.forEach((field) => {
        fields[field.id] = {
          group: 1,
          id: field.id,
          Alias: '',
          value: '',
          title: field.title,
        }
      })
      return fields
    },
    updateEachExtraField() {
      const selectedPrices = this.getSelectedPrices()
      this.updateEachCustomerExtraFields(selectedPrices)
    },
    getSelectedPrices() {
      return this.submitData.params.filter((price) => price.qty > 0)
    },
    updateEachCustomerExtraFields(selectedPrices) {
      if (this.bySizeExtraFieldsQuestion === null) return
      const customerInfos = []
      let groupCount = 1
      selectedPrices.forEach((price) => {
        for (let x = 0; x < price.qty; x++) {
          for (let i = 0; i < price.size; i++) {
            const bySizeList = {}
            groupCount++
            this.bySizeExtraFieldsQuestion.forEach((field) => {
              bySizeList[field.id] = {
                group: groupCount,
                id: field.id,
                Alias: price.alias,
                value: '',
                title: field.title,
              }
            })
            customerInfos.push({ bySizeExtrafields: bySizeList })
          }
        }
      })

      this.defaultValue.customerInfos = customerInfos
    },
    convertExtraFieldToStoreDataFromCreateMode() {
      let byOrderList = []
      let bySizeList = []
      const byOrderExtrafields = this.$refs.extrafield.defaultValue.byOrderExtrafields || {}
      const customerInfos = this.$refs.extrafield.defaultValue.customerInfos

      byOrderList = Object.keys(byOrderExtrafields).map((id) => {
        return byOrderExtrafields[id]
      })
      customerInfos.map((customerInfo) => {
        Object.keys(customerInfo.bySizeExtrafields).forEach((id) => {
          bySizeList.push(customerInfo.bySizeExtrafields[id])
        })
      })

      return [...byOrderList, ...bySizeList]
    },
    onStatusChange(value) {
      if (this.isEditMode && value === 1 && this.defaultValue.paymentMethod !== 'Prepaid') {
        this.submitData.paymentMethod = 'Cash'
      }
    },
    async tryToFetchMember() {
      const {phoneCode, phoneNumber} = this.defaultValue.member
      const member = await this.$store.dispatch('member/findByPhone', {phoneCode, phoneNumber})
      this.updateMemberInfo(member)
    },
    onSelectCity() {
      this.submitData.district = ''
    },
    async tryToGetFilterCities(){
     const { addressRestrictions } = await this.$store.dispatch('product/fetchSingle',this.submitData.productId)
     this.filterCities = addressRestrictions
    //  console.log(await this.$store.dispatch('product/fetchSingle',this.submitData.productId))
    },
  },
}
</script>
<template>
  <div :class="$style.wrapper">

    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
      <!-- <el-form-item prop="status" label="訂單狀態">
        <el-select v-model="submitData.status" placeholder="訂單狀態" :disabled=" defaultValue.status === 6" @change="onStatusChange">
          <template v-for="(status, statusValue) in filteredStatusMap">
            <el-option v-if="isEditMode" :key="statusValue" :value="+statusValue" :label="`${status.text} ${+statusValue === 0 && !isAddOrdersCanceled ? '（請先將加購訂單全數退款）' : ''}`" :disabled="+statusValue === 0 && !isAddOrdersCanceled">
            </el-option>
          </template>
        </el-select>
      </el-form-item> -->

      <template v-if="isEditMode && defaultValue.paymentStatus === 'UNPAID' && submitData.status !== 0 && defaultValue.paymentMethod !== 'Prepaid'">
        <el-form-item label="付款方式">
          <el-radio-group v-model="submitData.paymentMethod" :class="$style['payment-methods']">
            <el-radio v-if="submitData.paymentStatus === 'UNPAID'" :label="null" border>不指定</el-radio>
            <el-radio label="Cash" border>到店付款(現金)</el-radio>
            <el-radio label="StoreCredit" border>現場刷卡</el-radio>
            <el-radio label="Atm" border>線下匯款</el-radio>
            <el-radio v-if="submitData.paymentStatus === 'UNPAID' && storeCashflowSetting === 1" label="Credit" border>信用卡付款</el-radio>
            <el-radio v-if="submitData.paymentStatus === 'UNPAID' && storeCashflowSetting !== 0"  label="Vacc"  border>ATM虛擬帳戶</el-radio>
            <el-radio v-if="memberInfo" label="Prepaid" border>抵扣包月方案</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="submitData.paymentMethod === 'Vacc'" prop="bankType" label="轉帳銀行">
          <el-select v-model="submitData.bankType" :disabled="false">
            <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="memberInfo && submitPriceTotal > 0 && submitData.paymentMethod === 'Prepaid'">
          <el-form-item v-if="Object.keys(availablePrepaidList).length > 0" prop="prepaidOrderUuid" label="請選擇包月方案">
            <el-select v-model="submitData.prepaidOrderUuid" @change="updateSelectedPrepaid">
              <el-option v-for="(prepaid, prepaidUuid) in availablePrepaidList" :key="prepaidUuid" :value="prepaidUuid" :label="prepaid.prepaidTitle">
                {{ prepaid.prepaidTitle }}
                <span class="select__option--meta">{{ `(尚餘${prepaid.times - prepaid.used}次)` }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="請選擇包月方案">
            <el-alert
              title="目前選擇的服務項目無適用之包月方案（或包月方案剩餘次數不足），請調整購買數量、建議顧客購買新的包月方案、或請顧客改以其它方式付款"
              type="warning"
              :closable="false"
            ></el-alert>
          </el-form-item>
        </template>
      </template>

      <!-- <el-form-item v-if="!isEditMode" label="購買方案">
        <div v-for="(param, paramIndex) in productParams" :key="param.id" :class="$style['params-options']">
          <div>
            {{ param.title }}
            <small>{{ param.size }} 枚憑證</small>
          </div>
          <div>${{ param.price }}</div>

          <el-input-number v-if="param.state" v-model.number="submitData.params[paramIndex].qty" :min="0" :max="calculateParamMaxQty(param.size) + submitData.params[paramIndex].qty"></el-input-number>
          <div v-else>此方案未開放</div>
        </div>
      </el-form-item> -->
      <!-- <template v-if="!isEditMode">
        <el-form-item v-if="memberInfo" label="付款方式">
          <el-radio-group v-if="submitPriceTotal > 0" v-model="submitData.paymentMethod">
            <el-radio v-if="submitData.status === 2" label border>不指定</el-radio>
            <el-radio label="Cash" border>到店付款(現金)</el-radio>
            <el-radio v-if="submitData.status === 2" label="Prepaid" border>抵扣包月方案</el-radio>
          </el-radio-group>
          <el-alert v-else title="請先選擇購買方案" type="warning" :closable="false"></el-alert>
        </el-form-item>
        <el-form-item v-if="memberInfo && submitPriceTotal > 0 && submitData.paymentMethod === 'Prepaid'" label="請選擇包月方案">
          <el-select v-if="Object.keys(availablePrepaidList).length > 0" v-model="submitData.prepaidOrderUuid" @change="updateSelectedPrepaid">
            <el-option v-for="(prepaid, prepaidUuid) in availablePrepaidList" :key="prepaidUuid" :value="prepaidUuid" :label="prepaid.prepaidTitle">
              {{ prepaid.prepaidTitle }}
              <span class="select__option--meta">{{ `(尚餘${prepaid.times - prepaid.used}次)` }}</span>
            </el-option>
          </el-select>
          <el-alert
            v-else
            title="目前選擇的購買方案無適用之包月方案（或包月方案剩餘次數不足），請調整購買數量、建議顧客購買新的包月方案、或請顧客改以信用卡付款"
            type="warning"
            :closable="false"
          ></el-alert>
        </el-form-item>
      </template> -->

      <el-form-item v-if="paramsWithNoQty.length > 0" :class="$style['params-list']">
        <template v-if="submitData.paymentMethod === 'Prepaid' && Object.keys(availablePrepaidList).length > 0">
          <div :class="$style['params-list__item']">
            <div>訂購項目</div>
            <div>數量</div>
          </div>
          <div v-for="param in paramsWithNoQty" :key="param.id" :class="$style['params-list__item']">
            <div>{{ param.title }}</div>
            <div>{{ `x${param.qty}` }}</div>
          </div>
          <div :class="$style.total">
            <div v-if="selectedPrepaid" :class="$style['total__item']">
              <div>使用方案</div>
              <div>{{ selectedPrepaid.prepaidTitle }}</div>
            </div>
            <div :class="$style['total__item']">
              <div>使用次數</div>
              <div>{{ paramSizeTotal }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <div :class="$style['params-list__item']">
            <div>訂購項目</div>
            <div>售價</div>
            <div>數量</div>
            <div>小計</div>
          </div>
          <div v-for="param in paramsWithNoQty" :key="param.id" :class="$style['params-list__item']">
            <div>{{ param.title }}</div>
            <div>{{ param.price }}</div>
            <div>{{ `x${param.qty}` }}</div>
            <div>{{ param.price * param.qty }}</div>
          </div>
          <div :class="$style.total">
            <div :class="$style['total__item']">
              <div>小計</div>
              <div>{{ paramPriceTotal }}</div>
            </div>
            <div v-if="couponInfo" :class="[$style['total__item'], $style['total__item--discount']]">
              <div>{{ `優惠券（${couponInfo.code}）` }}</div>
              <div>{{ submitPriceTotal - paramPriceTotal }}</div>
            </div>
          </div>

          <div :class="$style.total">
            <div :class="$style['total__item']">
              <div>付款金額</div>
              <div>{{ submitPriceTotal }}</div>
            </div>
          </div>
        </template>
      </el-form-item>

      <el-form-item v-if="!isEditMode && submitPriceTotal > 0 && (submitData.paymentMethod === 'Cash' || submitData.paymentMethod === '')" ref="couponCode" prop="couponCode" label="優惠券">
        <el-input v-model="submitData.couponCode" :disabled="!!couponInfo" placeholder="請輸入優惠券代碼">
          <el-button v-if="couponInfo" slot="append" @click="resetCoupon">清除優惠券</el-button>
          <el-button v-else slot="append" @click="validCoupon">使用優惠券</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="fullName" label="使用人資訊">
        <el-checkbox v-if="memberInfo" v-model="userSameAsMember">使用人同客戶</el-checkbox>
        <el-input v-model="submitData.fullName" :disabled="userSameAsMember" placeholder="姓名">
          <el-select slot="append" v-model="submitData.gender" :disabled="userSameAsMember" placeholder="性別">
            <el-option value="female" label="小姐"></el-option>
            <el-option value="male" label="先生"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-form-item prop="phoneNumber">
        <el-input v-model="submitData.phoneNumber" :disabled="userSameAsMember" placeholder="手機號碼" autocomplete="tel">
          <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" :disabled="userSameAsMember" />
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="email">
        <el-input v-model="submitData.email" :disabled="userSameAsMember" placeholder="Email"></el-input>
      </el-form-item> -->
       <template v-if="isHomeService && filterCities.length > 0">
          <el-row :gutter="20">
            <el-col :md="6">
              <el-form-item prop="city" label="縣市">
                <el-select v-model="submitData.city" filterable placeholder="請選擇" @change="onSelectCity">
                  <el-option v-for="(city, index) in filterCities" :key="index" :label="city.city" :value="city.city"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="6">
              <el-form-item prop="district" label="區域">
                <el-select v-model="submitData.district" placeholder="請選擇" filterable>
                  <el-option v-for="(district, index) in districts" :key="index" :label="district" :value="district"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item prop="address" label="地址">
                <el-input v-model="submitData.address" placeholder="地址" />
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      <!-- <el-form-item v-if="isHomeService" prop="address" label="服務地址">
        <el-input v-model="submitData.address" placeholder="地址"></el-input>
      </el-form-item> -->
      <el-form-item prop="note" label="使用人備註">
        <small style="margin-top: -20px;display: block;opacity: 0.5;">客戶可瀏覽此備註。若是不需要提供客戶瀏覽的資訊，請使用「內部備註」功能</small>
        <el-input v-model="submitData.note" type="textarea" :rows="2" placeholder="其他備註"></el-input>
      </el-form-item>


      <OrderExtraField ref="extrafield" :default-value="defaultValue" />

      <el-form-item prop="allowExpired">
        <el-checkbox v-model="submitData.allowExpired" :false-label="0" :true-label="1">可逾期付款</el-checkbox>
      </el-form-item>
    </el-form>
    <!-- <Portal to="drawer-header">
      <el-button class="is-round" type="primary" :loading="tryingStore" :disabled="isEditMode ? !submitData.groupSize : !paramSizeTotal" @click="handleStoreOrder">{{ isEditMode ? '儲存變更' : '新增訂單' }}</el-button>
      <el-button class="is-round" @click="emitCancel">{{ `取消${isEditMode ? '編輯' : '新增'}` }}</el-button>
    </Portal> -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-button class="is-round is-fullwidth" @click="emitCancel">{{
          `取消${isEditMode ? '編輯' : '新增'}`
        }}</el-button>
      </el-col>
      <el-col :span="12">
        <el-button
          class="is-round is-fullwidth"
          type="primary"
          :loading="tryingStore"
          :disabled="isEditMode ? !submitData.groupSize : !paramSizeTotal"
          @click="handleStoreOrder"
          >{{ isEditMode ? '儲存變更' : '新增訂單' }}</el-button
        >
      </el-col>
    </el-row>
    <OrderChangeStatusDialog :visible.sync="statusDialogVisible" :is-not-pay-prepaid="defaultValue.prepaidOrderStatus === 2" :prepaid-order-uuid="defaultValue.prepaidOrderUuid"  :order="submitData" @paid="handlePaidStatus" @cancelled="emitStore" />
  </div>
</template>
<style lang="scss" module>
@import '@design';
.wrapper {
  padding-top: 30px;
  // border-top: 1px solid $color-border-base;
  :global {
    .el-form-item__label {
      @extend %font-heading;
    }
  }
}

.search-form {
  margin-bottom: 15px;
  border-bottom: 1px solid $color-border-base;
}

.title:not(:first-child) {
  margin-top: 30px;
}

.info {
  padding-inline-start: 0;
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

.total {
  border-top: 1px solid $color-border-base;
  &__item {
    display: flex;
    justify-content: space-between;

    &--discount {
      color: $color-state-danger;
    }
    &:not(.total__item--discount) > *:first-child {
      color: $color-text-placeholder;
    }
  }
}

.payment-methods {
  :global {
    .el-radio {
      margin: 5px !important;
    }
    .vacc-disabled {
      margin-bottom: 20px;
      &::after {
        content: '(服務前一日不提供)';
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        color: #c2c6ce;
      }
    }
  }
}
</style>
