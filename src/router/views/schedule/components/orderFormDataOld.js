
import cloneDeep from 'lodash/cloneDeep'
import { differenceInDays } from 'date-fns'
import lazyLoadComponent from '@router/lazyload-component'
import { groupById } from '@utils/normalize-data'
import { genderFilter, orderStatusMap, findDistrictZip } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import { formatStatusMessage } from '@utils/request'
import { Portal } from 'portal-vue'
import scrollToElement from '@utils/scroll-to-element'

const initData = () => {
  return {
    params: '',
    fullName: '',
    gender: 'male',
    phoneCode: '+886',
    phoneNumber: '',
    email: '',
    note: '',
    status: 2,
    paymentStatus:'UNPAID',
    basePrice: '',
    total: '',
    allowExpired: 0,
    couponCode: '',
    memberId: '',
    prepaidOrderUuid: '',
    byOrderExtrafields: {},
    customerInfos: [],
    // paymentMethod: 'Prepaid',
    paymentMethod: '',
    productId: '',
    bankType: '',
    address: '',
    petId: '',
    city:'',
    district:'',
    errorHandle: false,
  }
}
export default {
  name: 'ScheduleOrderForm',
  components: {
    SearchMember: () => lazyLoadComponent(import('@components/Order/SearchMember')),
    PetSelect: () => lazyLoadComponent(import('@components/Order/PetSelect')),
    OrderSingle: () => lazyLoadComponent(import('./OrderSingle')),
    OrderPrepaid: () => lazyLoadComponent(import('./OrderPrepaid')),
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
    OrderChangeStatusDialog: () => lazyLoadComponent(import('@components/OrderChangeStatusDialog')),
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
    products: {
      type: Array,
      required: true,
    },
    scheduleDetail: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tryingStore: false,
      submitData: Object.assign({}, this.defaultValue),
  
      statusDialogVisible: false,
  
      
      couponInfo: {},
      memberInfo: {},
      userSameAsMember: true,

      selectedPrepaid: {},
  
      productHasExtraField: true,
      bankTypeList: [
        { id: 'BOT', title: '台灣銀行' },
        { id: 'Taishin', title: '台新' },
        { id: 'HNCB', title: '華南' },
      ],
      updateParams: false,

      previousCouponCode: '',
      editCustomerEnabled: false,

      selectedPetSizeId: 0,

      orderMode: '',
      
      submitDataPrepaid: {
        prepaidId: '',
        status: 2,
        paymentMethod: 'Cash',
        bankType: '',
        taxType: 'B2C',
        CarrierType: '',
        CarrierNum: '',
        taxId: '',
        LoveCode: '',
        invoiceSync: true,
      },
      prepaidPrice: null,
      memberDataNotYet:false
    }
  },
  computed: {

    memberInfoShow(){
      return Object.keys(this.memberInfo).length !== 0
    },
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
        email: [
          { required: true, message: '請輸入 Email' },
          { type: 'email', message: '請輸入正確的 Email 格式' },
        ],
        fullName: [{ required: true, message: '請輸入使用人姓名' }],
        productId: [{ required: true, message: '請選擇服務地點' }],
        productId2: [{ required: true, message: '請選擇服務地點' }],
        params: [{ required: true, message: '請選擇服務項目' }],
        bankType: [{ required: true, message: '請選擇轉帳銀行' }],
        petId: [{ required: true, message: '請選擇寵物' }],
        city: [{ required: this.isHomeService, message: '請選擇縣市'}],
        district: [{ required: this.isHomeService, message: '請選擇區域'}],
        address: [{ required: this.isHomeService, message: '請輸入服務地址', trigger: 'blur' }],
        prepaidOrderUuid: [{ required: this.isRequiredPrePaid, message: '請選擇包月方案', trigger: 'change' }],
        couponCode: [
          {
            validator: (rule, value, callback) => {
              clearTimeout(validCodeTimeout)
              if (value === '') {
                this.$refs.order.$refs.form.clearValidate('couponCode')
                return callback()
              }
              if (this.previousCouponCode === this.submitData.couponCode) return callback()
              validCodeTimeout = setTimeout(() => {
                this.previousCouponCode = this.submitData.couponCode
                this.$store
                  .dispatch('coupon/validCode', {
                    code: value,
                    basePrice: this.paramPriceTotal,
                    priceId: this.submitData.params[0].id,
                    memberId: this.memberInfo.id,
                    // productId: this.inventory.productId,
                  })
                  .then((response) => {
                    callback()
                    this.applyCoupon(response.items)
                  })
                  .catch((error) => {
                    this.previousCouponCode = ''
                    callback(new Error(formatStatusMessage(error.status)))
                  })
              }, 500)
            },
            trigger: 'custom',
          },
        ],
      }
    },
    paramSizeTotal() {
      const sizeArray = this.submitData.params.map
        ? this.submitData.params.map((param) => {
            return 1 * 1
          })
        : []
      return sizeArray.length > 0 ? sizeArray.reduce((prev, curr) => +prev + +curr, 0) : 0
    },//
    paramPriceTotal() {
      const priceArray = this.submitData.params.map
        ? this.submitData.params.map((param) => {
            // return +param.qty * +param.price
            return 1 * +param.price
          })
        : []
      return priceArray.length > 0 ? priceArray.reduce((prev, curr) => +prev + +curr, 0) : 0
    },//
    paramsWithNoQty() {
      // return this.submitData.params.filter((param) => param.qty !== 0)
      return this.submitData.params.length ? this.submitData.params : []
    },//
    submitPriceTotal() {
      const calcFixedDiscount = (value = 0, total = 0) => {
        return total - value < 0 ? 0 : total - value
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
      return this.defaultValue.paymentStatus !== this.submitData.paymentStatus
    },
    // availableSizeTotal() {
    //   if (this.inventory.infinity) return 9999 - this.inventory.qty
    //   return this.inventory.inventory - this.inventory.qty || 0
    // },// 沒用到
  
    availablePrepaidList() {
      const memberPrepaids = (this.memberInfoShow && this.memberInfo.availablePrepaidOrders) || []
      const chosenPriceIds = this.paramsWithNoQty.map((param) => param.id)
      const chosenPriceQty = this.paramSizeTotal
      // console.log(chosenPriceIds)
      const checkPrepaidUsability = (prepaidPriceIds, chosenPriceIds) => {
        // console.log(prepaidPriceIds,chosenPriceIds)
        const getExcludePriceIds = chosenPriceIds.filter((priceId) => !prepaidPriceIds.has(priceId))
        // console.log(getExcludePriceIds)
        return getExcludePriceIds.length === 0
      }

      const checkPrepaidAvailability = (prepaidQty, chosenQty) => {
        return chosenQty <= prepaidQty
      }

      const checkedPrepaids = memberPrepaids.filter((memberPrepaid) => {
        const { times, used, productPriceIds } = memberPrepaid
        // console.log(checkPrepaidUsability(new Set(productPriceIds), chosenPriceIds))
        // console.log(chosenPriceIds,checkPrepaidUsability(new Set(productPriceIds), chosenPriceIds) ,checkPrepaidAvailability(times - used, chosenPriceQty))
        return checkPrepaidUsability(new Set(productPriceIds), chosenPriceIds) && checkPrepaidAvailability(times - used, chosenPriceQty)
      })
      // console.log(checkedPrepaids, memberPrepaids)
      return groupById(checkedPrepaids, 'prepaid') || {}
    },
    // productType() {
    //   if (this.inventory) return this.inventory.productType
    //   return this.defaultValue.productType || this.$route.params.product.type
    // },// 沒用到
    // filteredExtrafields() {
    //   let byOrder = []
    //   this.products.some((product) => product.id === this.submitData.productId && (byOrder = product.extrafields.byOrder))
    //   this.submitData.byOrderExtrafields = this.convertToObject(byOrder)
    //   return this.convertToObject(byOrder)
    // },// 沒用到

    showVacc() {
      const bookingDate = new Date(formatDate(new Date(this.scheduleDetail.date)))
      const today = new Date(formatDate(new Date()))
      // 虛擬帳戶付款距離預約日要大於1天
      return differenceInDays(bookingDate, today) > 1
    },
    isHomeService() {
      return this.products.some((product) => product.id === this.submitData.productId && product.storeType === 'home')
    },
    isRequiredPrePaid() {
      return this.memberInfoShow && this.submitPriceTotal > 0 && this.submitData.paymentMethod === 'Prepaid' && Object.keys(this.availablePrepaidList).length > 0
    },

  
  },
  watch: {
    // searchPet(value) {
    //   if (value !== '') this.showPet = true
    // },
    // 'searchData.phoneNumber'(value) {
    //   if (value !== '') this.showCustomer = true
    // },
    'submitData.paymentMethod'(value) {
      if (value !== 'Prepaid') this.submitData.prepaidOrderUuid = ''
      if (value !== 'Vacc') this.submitData.bankType = ''
      if (value === 'Prepaid') this.submitData.couponCode = ''
    },
    'submitData.petId'(value) {
      this.submitData.productId = ''
      this.submitData.params = ''
      this.submitData.prepaidOrderUuid = ''
      this.submitDataPrepaid.prepaidId = ''
      // this.scrollDrawer()
    },
 
    'submitData.params'(value) {
      this.scrollDrawer()
    },
    availablePrepaidList(value) {
      if (Object.keys(value).length === 0) this.submitData.prepaidOrderUuid = ''
    },
    orderMode() {
      this.submitData.productId = ''
      this.submitData.petId = ''
      this.submitData.params = ''
        if(this.$refs.PetSelect){
          // console.log(this.$refs.PetSelect)
          this.$refs.PetSelect.singlePetData = {}
        }
    },
    // 'submitData.params': { handler: 'updateEachExtraField', deep: true },
    memberInfo: 'updateUserByMember',
    userSameAsMember: 'updateUserByMember',
  },
  created() {
    
    // if (!this.isEditMode) this.tryToGetParams()
    // if (!this.isEditMode) this.fetchExtraField()
  },
  methods: {
    // isEmptyExtrafields(Extrafields) {
    //   return Extrafields instanceof Array
    // },沒用到
    // emitCancel() {
    //   this.$emit('cancel')
    // },沒用到
    updateMemberInfo(member = {}) {

      if (Object.keys(member).length === 0) {
        this.submitData.phoneNumber = this.$refs.SearchMember.searchData.phoneNumber
      }
      // else {
      //   if (member.availablePrepaidOrders.length > 0) {
      //     // console.log(member.availablePrepaidOrders)
      //     this.submitData.paymentMethod = 'Prepaid'
      //   }
      // }
 
      this.userSameAsMember = this.memberInfoShow
      if (this.memberInfoShow && this.$refs.PetSelect) {
        this.$nextTick(() => {
          // 這裡搜尋會員資料後，會去取得 PetSelect元件的 petlist 資料，但是 PetSelect元件要取得會員才會渲染，所以必須等元件更新完之後，才能取得元件的資料
          // 第一次渲染從元件的created去做，之後的更新才是這裡做，第一次取得 this.$refs.PetSelect 在這裡還沒更新到，所以這段都不會執行
          this.$refs.PetSelect.tryToFetchPetList()
          this.submitData.petId = ''
          this.$refs.PetSelect.singlePetData = {}
        })
      }
 
    },
    updateUserByMember() {
      const fields = ['memberId', 'fullName', 'gender', 'phoneCode', 'phoneNumber', 'email']
      fields.forEach((field) => {
        this.submitData[field] = field === 'memberId' ? this.memberInfo.id : this.memberInfo[field]
      })
    },
    emitStore() {
      this.$emit('store')
    },
    applyCoupon(couponData) {
      this.couponInfo = couponData
    },
    validCoupon() {
      this.$refs.order.$refs.form.validateField('couponCode')
    },
    resetCoupon() {
      this.couponInfo = {}
      this.submitData.couponCode = ''
      this.previousCouponCode = ''
      // this.$refs.couponCode.resetField('couponCode')
    },
    // async tryToGetParams() {
    //   this.productParams = await this.$store.dispatch('product/fetchPrices', {
    //     productId: this.inventory.productId,
    //   })

    //   const paramWithQty = this.productParams.map((param) => {
    //     return {
    //       ...param,
    //       qty: 0,
    //     }
    //   })

    //   this.$set(this.submitData, 'params', paramWithQty)
    // },// 沒用到
    async handlePaidStatus(merchantNote) {
      if (this.submitDataPrepaid.prepaidId) {
        this.tryToCreatePrepaidOrder(merchantNote)
      } else {
        this.tryToCreateOrder(merchantNote)
      }
    },

    handleStoreOrder() {
      // show the status dialog when changing order status
      // console.log(this.$refs.order.$refs.form)
      this.$refs.order.$refs.form.validate((valid) => {
        if (valid) {
          // if (this.statusIsChanged && !this.isEditMode && this.submitData.status === 1) return (this.statusDialogVisible = true)
       
          if (this.submitData.paymentMethod === 'Prepaid' && !this.submitDataPrepaid.prepaidId) {
            if (Object.keys(this.availablePrepaidList).length > 0 && this.submitData.prepaidOrderUuid === '') {
              this.$confirm('請選擇包月方案', '提示', {
                confirmButtonText: '確定',
                showCancelButton: false,
                type: 'warning',
                center: true,
              })
              return
            }
            if (Object.keys(this.availablePrepaidList).length === 0 && !this.submitDataPrepaid.prepaidId) {
              this.$confirm('目前選擇的服務項目無適用之包月方案，請選擇其他付款方式', '提示', {
                confirmButtonText: '確定',
                showCancelButton: false,
                type: 'warning',
                center: true,
              })
              return
            }
          }

          if (this.statusIsChanged && !this.isEditMode && this.submitData.paymentStatus === 'PAID' || this.submitDataPrepaid.status === 1) return (this.statusDialogVisible = true)
          // 新增購買包月方案
          if (this.submitDataPrepaid.prepaidId) {
            // console.log('購買')
            this.tryToCreatePrepaidOrder()
            // this.tryToCreateOrder()
          } else {
            // console.log('不購買')
            this.tryToCreateOrder()
          }
        } else {
          this.$nextTick(() => {
            scrollToElement(this.$refs.order.$refs.form.$el.querySelector('.el-form-item__error'), 182)
          })
        }
      })
    },
    async tryToSaveAddress(){
      if(this.$refs.order.enableSaveAddress){
        // console.log('儲存地址')
        // const { city, district } = this.submitData.shippingInfo[0]
        let data = {
          address:this.submitData.address ,
          city:this.submitData.city ,
          district:this.submitData.district ,
          email:'' ,
          name:'',
          phone:'' ,
          postcode:'' ,
        }
        data.postcode = findDistrictZip(this.submitData.city, this.submitData.district)
        await this.$store.dispatch('member/store', {
          id:this.memberInfo.id,
          fullName:this.memberInfo.fullName,
          gender:this.memberInfo.gender,
          shippingInfo: [data]
        })
      }else{
        // console.log('不儲存')
      }
    },
    async tryToCreatePrepaidOrder(merchantNote = '') {
   
      const orderExtrafields = this.productHasExtraField ? this.convertExtraFieldToStoreDataFromCreateMode() : undefined

      const orderData = {
        ...this.submitData,
        basePrice: this.paramPriceTotal,
        total: this.submitPriceTotal,
        groupSize: this.paramSizeTotal,
        // productId: this.inventory.productId,
        // inventoryId: this.inventory.id,
        merchantNote,
        orderExtrafields,
        startDate: `${formatDate(this.scheduleDetail.date, 'date-dash')} ${formatDate(this.scheduleDetail.date, 'time')}`,
        scheduleItemId: this.scheduleDetail.id,
        params: [
          {
            id: this.submitData.params[0].id,
            qty: 1,
          },
        ],
      }
      const prepaidData = {
        ...this.submitDataPrepaid,
        email: this.memberInfo.email,
        fullName: this.memberInfo.fullName,
        gender: this.memberInfo.gender,
        memberId: this.memberInfo.id,
        phoneCode: this.memberInfo.phoneCode,
        phoneNumber: this.memberInfo.phoneNumber,
        taxType: this.memberInfo.taxType,
        merchantNote,
        note:orderData.note,
        order: { ...orderData },
        // CarrierNum: this.submitData.CarrierType === '2' ? this.submitData.phoneNumber : this.submitData.CarrierNum
      }

      this.tryingStore = true

      try {
        await this.tryToSaveAddress()
        await this.$store.dispatch('prepaid/storeOrder', prepaidData)
        let requirePay = prepaidData.status === 1 ? false : prepaidData.status === 2
        if (this.prepaidPrice === 0) {
          requirePay = false
        }
        this.handleCreateSuccess(requirePay)
        // this.submitData.prepaidOrderUuid = items.id
        // this.submitData.status = 1
        // this.tryToCreateOrder()
        // const requirePay = storeData.status !== 1
        // this.handleCreateSuccess(requirePay)
      } catch (error) {
        // console.log('TCL: tryToCreateOrder -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    handleCreateSuccess(requirePay = false) {
      this.$alert(`已發送${requirePay ? '付款' : '訂單'}連結至使用人 Email`, '訂單新增成功！', {
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
        merchantNote,
      }
      this.tryingStore = true
      try {
        await this.$store.dispatch('order/store', storeData)
        this.handleSaveSuccess()
      } catch (error) {
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
        // productId: this.inventory.productId,
        // inventoryId: this.inventory.id,
        merchantNote,
        orderExtrafields,
        startDate: `${formatDate(this.scheduleDetail.date, 'date-dash')} ${formatDate(this.scheduleDetail.date, 'time')}`,
        scheduleItemId: this.scheduleDetail.id,
        params: [
          {
            id: this.submitData.params[0].id,
            qty: 1,
          },
        ],
      }

      this.tryingStore = true

      try {
        await this.tryToSaveAddress()
        await this.$store.dispatch('order/store', storeData)
        let requirePay = storeData.paymentStatus === 'PAID' ? false : storeData.paymentStatus === 'UNPAID' && storeData.total > 0
        // if(this.submitData.params[0].price===0){
        //   requirePay=false
        // }
        this.handleCreateSuccess(requirePay)
      } catch (error) {
        if (error.status === 'SCHEDULE_ITEM_CALENDAR_TIME_UNAVAILABLE')
          this.$message({
            type: 'warning',
            message: `與該訂單時段重疊： ${formatDate(new Date(error.data.date), 'dateTime')}`,
          })
        if (error.status === 'SCHEDULE_ITEM_ADMIN_ITEM_NOT_EXIST')
          this.$message({
            type: 'error',
            message: `此排班不存在或該排班人員不存在`,
          })
        else
          this.$message({
            type: 'error',
            message: `Server Error`,
          })
        // console.log('TCL: tryToCreateOrder -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    // calculateParamMaxQty(size) {
    //   const remainSize = this.availableSizeTotal - this.paramSizeTotal
    //   const remainParamQty = remainSize >= size ? Math.floor(this.paramSizeTotal / size) : 0
    //   return Math.floor(remainSize / size) + remainParamQty
    // },// 沒用到
 
    convertExtraFieldToStoreDataFromEditMode(submitData) {
      const orderInfo = cloneDeep(submitData)
      const storeData = cloneDeep(this.$refs.order.$refs.extrafield.defaultValue)
      orderInfo.byOrderExtrafields = this.getExtraFieldsArray(storeData.byOrderExtrafields)
      // orderInfo.bySizeExtrafields = this.getBySizeExtraFieldsArray(storeData.customerInfos)
      delete orderInfo.customerInfos
      return orderInfo
    },
    // getBySizeExtraFieldsArray(customerInfos) {
    //   return customerInfos.map((customerInfo) => {
    //     return {
    //       customerInfoId: customerInfo.customerInfoId,
    //       orderExtrafields: this.getExtraFieldsArray(customerInfo.bySizeExtrafields),
    //     }
    //   })
    // },
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
 
    // updateEachExtraField() {
    //   const selectedPrices = this.getSelectedPrices()
    //   this.updateEachCustomerExtraFields(selectedPrices)
    // },// 沒用到
    // getSelectedPrices() {
    //   return this.submitData.params.filter ? this.submitData.params.filter((price) => price.qty > 0) : []
    // },// 沒用到
    // updateEachCustomerExtraFields(selectedPrices) {
    //   if (this.bySizeExtraFieldsQuestion === null) return
    //   const customerInfos = []
    //   let groupCount = 1
    //   selectedPrices.forEach((price) => {
    //     for (let x = 0; x < price.qty; x++) {
    //       for (let i = 0; i < price.size; i++) {
    //         const bySizeList = {}
    //         groupCount++
    //         this.bySizeExtraFieldsQuestion.forEach((field) => {
    //           bySizeList[field.id] = {
    //             group: groupCount,
    //             id: field.id,
    //             Alias: price.alias,
    //             value: '',
    //             title: field.title,
    //           }
    //         })
    //         customerInfos.push({ bySizeExtrafields: bySizeList })
    //       }
    //     }
    //   })

    //   this.defaultValue.customerInfos = customerInfos
    // },// 沒用到
    convertExtraFieldToStoreDataFromCreateMode() {
      let byOrderList = []
      let bySizeList = []
      const byOrderExtrafields = this.$refs.order.$refs.extrafield.defaultValue.byOrderExtrafields || {}
      // const customerInfos = this.$refs.extrafield.defaultValue.customerInfos

      byOrderList = Object.keys(byOrderExtrafields).map((id) => {
        return byOrderExtrafields[id]
      })
      // customerInfos.map((customerInfo) => {
      //   Object.keys(customerInfo.bySizeExtrafields).forEach((id) => {
      //     bySizeList.push(customerInfo.bySizeExtrafields[id])
      //   })
      // })

      return [...byOrderList, ...bySizeList]
    },


    orderSingle() {
      this.orderMode = 'single'
      this.submitData.paymentMethod = ''
      this.submitData.paymentStatus = 'UNPAID'
      this.scrollDrawer()
    },
    orderPrepaid() {
      this.orderMode = 'prepaid'
      this.submitData.paymentMethod = 'Prepaid'
      this.submitData.prepaidOrderUuid = ''
      this.submitData.params = []
      this.scrollDrawer()
      // this.submitData.status=this.memberInfo.availablePrepaidOrders.some(item=>{return item.status===1})?1:2
    },
    scrollDrawer() {
      this.$emit('scroll')
    },
  },
}
