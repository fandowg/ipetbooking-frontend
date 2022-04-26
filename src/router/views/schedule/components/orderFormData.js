import lazyLoadComponent from '@router/lazyload-component'

import cloneDeep from 'lodash/cloneDeep'
import {
  differenceInDays
} from 'date-fns'
import {
  groupById
} from '@utils/normalize-data'
import {
  genderFilter,
  orderStatusMap,
  findDistrictZip,
  districtsFilter,
  orderStatusFilter,
  orderSourceFilter,
  bookingStatusFilter,
  orderPaymentMethodFilter,
  paymentStatusMapFilter,
  taxTypeMap,
  carrierTypeMap,
  taiwanCitys,
  orderPaymentMethodMap
} from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import {
  formatStatusMessage
} from '@utils/request'
import {
  Portal
} from 'portal-vue'
import scrollToElement from '@utils/scroll-to-element'
import BaseButtonDialog from '@components/BaseButtonDialog'

import petMixin from '@src/mixins/pet'
import memberMixin from '@src/mixins/member'
import serviceMixin from '@src/mixins/service'
import orderEditMixin from '@src/mixins/orderEdit'


const paramsItem = () => {
  return {
    type: 'cosmetic',
    title: '',
    priceId: '',
    price: 0,
    qty: 1
  }
}


const initData = () => {
  return {
    params: [paramsItem()],
    fullName: '',
    gender: 'male',
    phoneCode: '+886',
    phoneNumber: '',
    phone: '',
    // bankType:'',
    email: '',
    note: '',
    status: 2,
    paymentStatus: 'UNPAID',
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
    city: '',
    district: '',
    errorHandle: false,
    type: 'cosmetic',

    // 假資料先暫做
    storeCredit: '',
    credit: ''
  }
}



export default {
  components: {
    BaseButtonDialog,
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderExtraField: () => lazyLoadComponent(import('@components/OrderExtraField')),
    OrderChangeStatusDialog: () => lazyLoadComponent(import('@components/OrderChangeStatusDialog')),
    SignatureDialog: () => lazyLoadComponent(import('@components/SignatureDialog')),
    MemberOrdersProduct: () => lazyLoadComponent(import('./MemberOrdersProduct')),
    MemberOrdersPrepaid: () => lazyLoadComponent(import('./MemberOrdersPrepaid')),
    TotalTable: () => lazyLoadComponent(import('./TotalTable')),
    TotalEdit: () => lazyLoadComponent(import('./TotalEdit')),
    // Addition: () => lazyLoadComponent(import('@components/Order/AdditionOrder')),
    AdditionForm: () => lazyLoadComponent(import('./AdditionFormOrder')),
    PetCommentList: () => lazyLoadComponent(import('@components/PetCommentList')),
    NotificationWrite: () => lazyLoadComponent(import('@components/NotificationWrite')),
    // SearchMember: () => lazyLoadComponent(import('@components/Order/SearchMember')),
    // PetSelect: () => lazyLoadComponent(import('@components/Order/PetSelect')),

  },
  filters: {
    orderStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
    bookingStatusFilter,
    paymentStatusMapFilter,
    genderFilter
  },
  mixins: [petMixin, memberMixin, serviceMixin, orderEditMixin],
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
    products: {
      type: Array,
      default: () => [],
    },
    scheduleDetail: {
      type: Object,
      default: () => {}
      // required: true,
    },
    schedules: {
      type: Array,
      default: () => [],
    },
    memberItem: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      type:'order',
      orderPaymentMethodMap,
      taxTypeMap,
      carrierTypeMap,
      headerHeight: 0,
      submitData: Object.assign({}, this.defaultValue),
      childrenSubmitData: Object.assign({}, this.defaultValue),
      currentOrder:Object.assign({}, this.defaultValue),
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
      couponInfo: {},
      previousCouponCode: '',
      // 各種 show

      // 全畫面
      prepaidAllShow: false,
      priceAllShow: false,
      totalAllShow: false,
      // 左邊的 show
      mamberSearchShow: true,
      // 右邊的show，左邊有任何選擇，右邊的show要全部關掉
      memberInfoShow: false,
      petShow: false,
      editDetailEnabled: false,
      visibleDialogAddress: false,
      editInvoiceEnabled: false,
      serviceShow: false,
      prepaidShow: false,
      addShow: false,
      addressShow:false,

      // totalShow:true,

      // dialog show
      paymentDialogVisible: false,
      extraDialogVisible: false,
      // 各種 loading
      tryingStore: false,
      tryingUpdateTag: false,
      tryingGetMember: false,
      tryingSaveMember: false,
      tryingSaveAddress: false,

      isEditMember: false,

      ordertype: '',
      paymentWay: 'offline',
      paymentStep: 1,
      bankTypeList: [{
          id: 'BOT',
          title: '台灣銀行'
        },
        {
          id: 'Taishin',
          title: '台新'
        },
        {
          id: 'HNCB',
          title: '華南'
        },
      ],
      // paymentTitle:'到店付款(現金)'
      productHasExtraField: true,
      userSameAsMember: true,
      statusDialogVisible: false,
      MaxQty: 1,

      // params 必須先拆開成 服務 加購 變價，然後變價的排序折扣要在最後面，有變動的時候要按照順序塞回submitData.params

      isPrepaidAndEdit: false,
      serviceParam: [{}],
      addList: [],
      totalEditList: [],
      totalPlusList: [],
      totalDicountList: [],
      haveItems: [],
      moreItems: [],
      basePrice: 0,

      // 到府地址

      enableSaveAddress:false,
      editFilterCities:[],

      // finalTotal:0,
      catchPrepaidOrderUuid:''





    }
  },
  computed: {
    isHomeService() {
      if(!this.isEditMode){
        return this.products.some((product) => product.id === this.submitData.productId && product.storeType === 'home')
      } else{
        return this.defaultValue.storeType === 'home'
      }
      
    },
    filterCities(){
      if(this.isEditMode){
        // const { addressRestrictions } = await this.$store.dispatch('product/fetchSingle',this.submitData.productId)
      } else{
        if(!this.submitData.productId){
          return []
        }
        const cities = this.products.find(item=>{
          return item.id === this.submitData.productId
        }).addressRestrictions
        return cities
      }
      
    },
    districts() {
      if(!this.submitData.city){
        return []
      }
      let cities = []
      if(this.isEditMode){
        cities = this.editFilterCities
      } else {
        cities = this.filterCities
      }
      // console.log(cities)
      const city = cities.find(item=>{
        return this.submitData.city === item.city
      })
      // console.log(city) 
      if(city){
        return city.district
      }else{
        return []
      }
    },
    isPaid() {
      return this.defaultValue.paymentStatus === 'PAID'
    },
    multipleStore() {
      return this.products.length > 1
      // if(!this.isEditMode){
      //   return this.products.length > 1
      // } else {
      //   return false
      // }

    },
    petSizeId() {
      if (this.submitData.petId) {
        return this.petList.find(item => {
          return this.submitData.petId === item.id
        }).sizeId
      } else {
        return 0
      }

    },
    submitRules() {
      const isTaiwan = this.submitData.phoneCode === '+886'
      let validCodeTimeout = ''
      return {
        phoneNumber: [{
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
        email: [{
            required: true,
            message: '請輸入 Email'
          },
          {
            type: 'email',
            message: '請輸入正確的 Email 格式'
          },
        ],
        fullName: [{
          required: true,
          message: '請輸入使用人姓名'
        }],
        gender:[{
          required:true,
          message:'請選擇性別'
        }],
        productId: [{
          required: true,
          message: '請選擇服務地點'
        }],
        productId2: [{
          required: true,
          message: '請選擇服務地點'
        }],
        params: [{
          required: true,
          message: '請選擇服務項目'
        }],
        bankType: [{
          required: true,
          message: '請選擇轉帳銀行'
        }],
        petId: [{
          required: true,
          message: '請選擇寵物'
        }],
        city: [{
          required: this.isHomeService,
          message: '請選擇縣市'
        }],
        district: [{
          required: this.isHomeService,
          message: '請選擇區域'
        }],
        address: [{
          required: this.isHomeService,
          message: '請輸入服務地址',
          trigger: 'blur'
        }],
        prepaidOrderUuid: [{
          required: this.isRequiredPrePaid,
          message: '請選擇包月方案',
          trigger: 'change'
        }],
        couponCode: [{
          validator: (rule, value, callback) => {
            clearTimeout(validCodeTimeout)
            if (value === '') {
              this.$refs.couponForm.clearValidate('couponCode')
              return callback()
            }
            if (this.previousCouponCode === this.submitData.couponCode) return callback()
            validCodeTimeout = setTimeout(() => {
              this.previousCouponCode = this.submitData.couponCode
              this.$store
                .dispatch('coupon/validCode', {
                  code: value,
                  basePrice: this.isEditMode ? this.submitData.params[0].total : this.submitData.params[0].price,
                  priceId: this.submitData.params[0].priceId,
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
        }, ],
      }
    },
    paymentTitle() {
      if(this.isChildren){
        return this.orderPaymentMethodMap[this.childrenSubmitData.paymentMethod]
      } else{
        return this.orderPaymentMethodMap[this.submitData.paymentMethod]
      }
      
    },
    statusIsChanged() {
      return this.defaultValue.paymentStatus !== this.submitData.paymentStatus
    },
    isEditMode() {
      return !!this.defaultValue.id
    },
    // finalTotal() {
    //   if (this.currentService) {
    //     return this.currentService.price * this.MaxQty
    //   } else {
    //     return 0
    //   }
    // },
    hasCouponInfo() {
      return Object.keys(this.couponInfo).length !== 0
    },

    paramPriceTotal() {
      const priceArray = this.submitData.params.map ?
        this.submitData.params.map((param) => {
          // return +param.qty * +param.price
          return 1 * +param.price
        }) : []
      return priceArray.length > 0 ? priceArray.reduce((prev, curr) => +prev + +curr, 0) : 0
    },
    mainService() {
      const service = this.submitData.params.find(item => {
        return item.type === 'cosmetic'
      })
      return service
    },
    serviceTotal() {
      // const price = this.submitData.params.find(item => item.type==='cosmetic').price
      // const service = this.submitData.params.find(item => {
      //  return  item.type==='cosmetic'
      // })
      // console.log(service)
      if (this.isEditMode) {
        return this.mainService.total
      } else {
        return this.mainService.price
      }

    },
    couponPriceTotal() {
      const calcFixedDiscount = (value = 0, total = 0) => {
        return total - value < 0 ? 0 : total - value
      }
      const calcPercentDiscount = (value = 0, total = 1) => {
        return total - Math.round(total * (value / 100))
      }
      const basePriceTotal = this.serviceTotal
      const {
        discount,
        type
      } = this.couponInfo

      return this.couponInfo ? (type === 'fixed' ? calcFixedDiscount(discount, basePriceTotal) : calcPercentDiscount(discount, basePriceTotal)) : basePriceTotal
    },
    submitPriceTotal() {
      let total = this.couponPriceTotal
      // console.log(total)
      if (this.submitData.prepaidOrderUuid || this.submitDataPrepaid.prepaidId) {
        total = 0
      }
      if (this.isEditMode) {
        total = parseInt(this.editServiceTotal)
      }
      // console.log(total)
      // console.log(total,this.editServiceTotal)

      let basePrice = this.serviceTotal
      if (!this.isChildren) {
        if(!this.isEditMode){
          this.addList.forEach((item, index) => {
            total = total + parseInt(item.price)
            basePrice = basePrice + parseInt(item.price)
          })
          this.totalEditList.forEach((item, index) => {
            if (item.type === "+") {
              total = total + parseInt(item.price)
              basePrice = basePrice + parseInt(item.price)
            }
            if (item.type === "-") {
              total = total - parseInt(item.price)
            }
            if (item.type === "%") {
              // console.log(item.price,typeof(item.price),total)
              // console.log(total)
              const discount = Math.round(total * (item.price / 100))
              // console.log(discount)
              this.totalEditList[index].discount = discount
              // console.log(this.totalEditList[index].discount)
              total = total - discount
            }
          })
        } else {
          if(!this.isMainOrder){
            basePrice = 0 
            total = 0
          }
          this.haveItems.forEach((item, index) => {
           
            if(item.type === "cosmetic-add"){
              total = total + parseInt(item.price)
              basePrice = basePrice + parseInt(item.price)
              // console.log(total)
            }
            if (item.type === "+") {
              total = total + parseInt(item.price)
              basePrice = basePrice + parseInt(item.price)
              // console.log(total)
            }
            if (item.type === "-") {
              total = total - parseInt(item.price)
              // console.log(total)
            }
            if (item.type === "%") {
              // console.log(item.price,typeof(item.price),total)
              // console.log(total)
              const discount = Math.round(total * (item.price / 100))
              // console.log(discount)
              this.haveItems[index].discount = discount
              // console.log(this.totalEditList[index].discount)
              total = total - discount
              // console.log(total)
            }
          })
          this.moreItems.forEach((item, index) => {
            if(item.type === "cosmetic-add"){
              total = total + parseInt(item.price)
              basePrice = basePrice + parseInt(item.price)
              // console.log(total)
            }
            if (item.type === "+") {
              total = total + parseInt(item.price)
              basePrice = basePrice + parseInt(item.price)
              // console.log(total)
            }
            if (item.type === "-") {
              total = total - parseInt(item.price)
              // console.log(total)
            }
            if (item.type === "%") {
              // console.log(item.price,typeof(item.price),total)
  
              const discount = Math.round(total * (item.price / 100))
              // console.log(discount)
              this.moreItems[index].discount = discount
              total = total - discount
              // console.log(total)
            } else {
              // total = total + parseInt(item.price)
              // basePrice = basePrice + parseInt(item.price)
            }
          })

        }
        
       
      }

      this.basePrice = basePrice
      // this.totalEditList = [...this.totalPlusList,...this.totalDicountList]
      // console.log(this.totalEditList)

      // this.totalDicountList
      // if(total<0){
      //   total = 0
      // }
      return total
    }
  },
  watch: {
    paymentDialogVisible(value) {
      if (!value) {
        this.paymentStep = 1
      }

    },
    currentService: {
      handler() {
        if (this.currentService && this.currentService.productId) {
          let byOrder = []
          this.products.some((product) => product.id === this.currentService.productId && (byOrder = product.extrafields.byOrder))
          // console.log(byOrder)
          this.submitData.productId = this.currentService.productId
          this.submitData.byOrderExtrafields = this.convertToObject(byOrder)
          this.getDefaultAddress()
          // console.log(this.submitData.byOrderExtrafields)
        }
      },
      deep: true

    },
    totalEditList(value) {
      // console.log(333)
      // const service = this.submitData.params.find(item => {
      //   return  item.type==='cosmetic'
      //  })
      if (value.length === 0 && this.addList.length === 0) {
        this.isPrepaidAndEdit = false
        if(this.submitData.prepaidOrderUuid){
          this.submitData.paymentMethod = "Prepaid"
          this.paymentWay = "Prepaid"
        }
        // this.submitData.paymentMethod = ""
        // this.paymentWay = "offline"
        // this.isPrepaidAndEdit = true
      }

      if (this.isChildren) {
        this.childrenSubmitData.params = [...this.addList, ...value]
      } else {
        if (!this.isEditMode) {
          this.submitData.params = [{
            ...this.mainService
          }, ...this.addList, ...value]
        }
      }


      // this.changeAllToral()
    },
    addList(value) {
      // console.log(222)
      if (value.length === 0 && this.totalEditList.length === 0) {
        this.isPrepaidAndEdit = false
        if(this.submitData.prepaidOrderUuid){
          this.submitData.paymentMethod = "Prepaid"
          this.paymentWay = "Prepaid"
        }
        // this.submitData.paymentMethod = ""
        // this.paymentWay = "offline"
        // this.isPrepaidAndEdit = true
      }
      if (this.isChildren) {
        this.childrenSubmitData.params = [...value, ...this.totalEditList]
      } else {
        if (!this.isEditMode) {
          this.submitData.params = [{
            ...this.mainService
          }, ...value, ...this.totalEditList]
        }
      }

    },
    paymentWay(value){
      if(value === 'Prepaid'){
        this.submitData.paymentMethod = 'Prepaid'
      } else {
        this.submitData.paymentMethod = ''
      }
    }

  },
  created() {
    if(this.isEditMode){
      this.tryToGetFilterCities()
    }
    delete this.childrenSubmitData.prepaidOrderUuid
    
  },
  mounted() {
    this.$nextTick(() => {
      this.headerHeight = document.querySelector('#orderHeader').offsetHeight + 40
      // console.log(this.headerHeight)
    })

    // this.scrollToBottom()
  },
  methods: {
    async tryToGetFilterCities(){
      const { addressRestrictions } = await this.$store.dispatch('product/fetchSingle',this.submitData.productId)
      this.editFilterCities = addressRestrictions
      // console.log(this.editFilterCities)
     //  console.log(await this.$store.dispatch('product/fetchSingle',this.submitData.productId))
     },

    async tryToFetchTagList(search) {
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search,
      })
    },
    closeAllInfo() {
      this.memberInfoShow = false
      this.petShow = false
      this.serviceShow = false
      this.prepaidShow = false
      // this.ordertype = ''
    },
    scrollToBottom() {
      // console.log(this.$refs.leftCont.scrollTop)
      this.$nextTick(() => {
        this.$refs.leftCont.scrollTop = 1000
      })

    },
    // 重新搜尋，資料必須全清
    resetMember() {
      this.submitData.petId = ''
      this.resetService()
    },
    handleStoreOrder(type) {
      let isNegative = false
      if(this.isChildren){
        isNegative = this.childrenOrderTotal < 0
      } else {
        isNegative = this.submitPriceTotal < 0
      }
      if(isNegative){
        this.$confirm('訂單金額不能小於0', '提醒', {
          confirmButtonText: '確定',
          showCancelButton: false,
          type: 'warning',
          center: true,
        })
        return
      }

      
      if (this.paymentWay === 'offline' || this.paymentWay === 'online') {
        this.paymentDialogVisible = true
      }
      // 若為單次預約選擇包月，跳出包月選擇
      if (this.paymentWay === 'Prepaid' && this.ordertype === 'order') {
        this.submitData.paymentMethod = 'Prepaid'
        this.paymentStep = 2
        this.paymentDialogVisible = true
      }
      // 若為包月方案預約，直接跳到備註
      if (this.paymentWay === 'Prepaid' && this.ordertype === 'prepaid-order') {
        this.goToExtrafields(true)
      }
      // !this.submitDataPrepaid.prepaidId ? this.tryToCreateOrder() : this.tryToCreatePrepaidOrder()
    },
    handleStorePrepaidOrder() {
      this.paymentDialogVisible = true
    },
    // async handlePaidStatus(merchantNote) {
    //   if (this.submitDataPrepaid.prepaidId) {
    //     this.tryToCreatePrepaidOrder(merchantNote)
    //   } else {
    //     this.tryToCreateOrder(merchantNote)
    //   }
    // },
    async handleCreateOrder() {
      await this.$refs.extraForm.validate()
      !this.submitDataPrepaid.prepaidId ? this.tryToCreateOrder() : this.tryToCreatePrepaidOrder()
    },
    async tryToCreateOrder(merchantNote = '') {
      // if (this.statusIsChanged && !this.isEditMode && this.submitData.paymentStatus === 'PAID' || this.submitDataPrepaid.status === 1) {
      //   return (this.statusDialogVisible = true)
      // }
      const orderExtrafields = this.productHasExtraField ? this.convertExtraFieldToStoreDataFromCreateMode() : undefined

      const storeData = {
        ...this.submitData,
        basePrice: this.basePrice,
        total: this.submitPriceTotal,
        groupSize: 1,
        // productId: this.currentService.productId,
        // inventoryId: this.inventory.id,
        merchantNote,
        orderExtrafields,
        startDate: `${formatDate(this.scheduleDetail.date, 'date-dash')} ${formatDate(this.scheduleDetail.date, 'time')}`,
        scheduleItemId: this.scheduleDetail.id,
        // params: [
        //   {
        //     id: this.submitData.params[0].id,
        //     qty: 1,
        //   },
        // ],
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
    async tryToCreateChildrenOrder() {
      // const orderExtrafields = this.productHasExtraField ? this.convertExtraFieldToStoreDataFromCreateMode() : undefined
      const {
        byOrderExtrafields,
        customerInfos,
        id,
        pet,
        ...other
      } = this.childrenSubmitData
      let storeData = {
        ...other,
        type: 'cosmetic',
        parentId: id,
        basePrice: this.basePrice,
        total: this.childrenOrderTotal,
        groupSize: 1,
        scheduleItemId: this.childrenSubmitData.scheduleItem.id,
        startDate: `${this.childrenSubmitData.date} ${this.childrenSubmitData.time}`,
        petId: pet.id
        // params: [
        //   {
        //     id: this.submitData.params[0].id,
        //     qty: 1,
        //   },
        // ],
      }
      delete storeData.status

      this.tryingStore = true

      // console.log(storeData)

      try {

        await this.$store.dispatch('order/store', storeData)
        let requirePay = storeData.paymentStatus === 'PAID' ? false : storeData.paymentStatus === 'UNPAID' && storeData.total > 0

        this.handleCreateSuccess(requirePay)
        this.addList = []
        this.totalEditList = []
        this.paymentDialogVisible = false
        this.totalAllShow = false
        this.addShow = false
        this.updateOrder()
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
    async tryToCreatePrepaidOrder(merchantNote = '') {

      const orderExtrafields = this.productHasExtraField ? this.convertExtraFieldToStoreDataFromCreateMode() : undefined

      // const orderData = {
      //   ...this.submitData,
      //   basePrice: this.paramPriceTotal,
      //   total: this.submitPriceTotal,
      //   groupSize: this.paramSizeTotal,
      //   // productId: this.inventory.productId,
      //   // inventoryId: this.inventory.id,
      //   merchantNote,
      //   orderExtrafields,
      //   startDate: `${formatDate(this.scheduleDetail.date, 'date-dash')} ${formatDate(this.scheduleDetail.date, 'time')}`,
      //   scheduleItemId: this.scheduleDetail.id,
      //   params: [
      //     {
      //       id: this.submitData.params[0].id,
      //       qty: 1,
      //     },
      //   ],
      // }
      const orderData = {
        ...this.submitData,
        // paymentMethod:'Cash',
        basePrice: this.basePrice,
        total: this.submitPriceTotal,
        // basePrice: this.currentService.price, // 要改
        // total: this.currentService.price, // 要改
        groupSize: 1,
        // productId: this.currentService.productId,
        // inventoryId: this.inventory.id,
        merchantNote,
        orderExtrafields,
        startDate: `${formatDate(this.scheduleDetail.date, 'date-dash')} ${formatDate(this.scheduleDetail.date, 'time')}`,
        scheduleItemId: this.scheduleDetail.id,
        // params: [
        //   {
        //     id: this.submitData.params[0].id,
        //     qty: 1,
        //   },
        // ],
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
        note: orderData.note,
        order: {
          ...orderData
        },
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
      this.extraDialogVisible = false
      this.$alert(`已發送${requirePay ? '付款' : '訂單'}連結至使用人 Email`, '訂單新增成功！', {
        confirmButtonText: '確認',
        center: true,
        callback: () => {
          
          this.emitStore()
        },
      })
    },
    selectPayment(payment) {
      if (this.isChildren) {
        this.childrenSubmitData.paymentMethod = payment
        this.childrenSubmitData.paymentMethod === 'Credit' ? this.goToExtrafields(false) : this.paymentStep = 2
      } else {
        if(this.isPrepaidAndEdit && !this.submitData.prepaidOrderUuid){
          this.submitData.prepaidOrderUuid = this.catchPrepaidOrderUuid
        }
        if (!this.submitDataPrepaid.prepaidId) {
          this.submitData.paymentMethod = payment
          this.submitData.paymentMethod === 'Credit' ? this.goToExtrafields(false) : this.paymentStep = 2
        } else {
          this.submitDataPrepaid.paymentMethod = payment
          this.submitDataPrepaid.paymentMethod === 'Credit' ? this.goToExtrafields(false) : this.paymentStep = 2
        }
      }


    },
    goToExtrafields(isPrepaid) {
      if (this.isChildren) {
        isPrepaid ? this.childrenSubmitData.paymentStatus = 'PAID' : this.childrenSubmitData.paymentStatus = 'UNPAID'
        this.tryToCreateChildrenOrder()
      } else {
        if (!this.submitDataPrepaid.prepaidId) {
          isPrepaid ? this.submitData.paymentStatus = 'PAID' : this.submitData.paymentStatus = 'UNPAID'
        } else {
          if (isPrepaid) {
            this.submitDataPrepaid.status = 1
            this.submitData.paymentStatus = 'PAID'
          } else {
            this.submitDataPrepaid.status = 2
            this.submitData.paymentStatus = 'UNPAID'
          }
          // isPrepaid ? this.submitDataPrepaid.status = 1 : this.submitDataPrepaid.status = 2
        }

        this.paymentDialogVisible = false
        // console.log(this.$refs.extrafield.defaultValue.byOrderExtrafields,this.$refs.extrafield.defaultValue)
        this.extraDialogVisible = true
        if(!this.submitData.fullName){
          this.userSameAsMember = false
        } else {
          this.userSameAsMember = true
        }
        // console.log('下一步')
      }

    },

    emitStore() {
      this.$emit('store')
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
    convertExtraFieldToStoreDataFromCreateMode() {
      let byOrderList = []
      let bySizeList = []
      const byOrderExtrafields = this.$refs.extrafield.defaultValue.byOrderExtrafields || {}
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
    // setTotal(value){
    //   this.finalTotal = value
    //   // console.log(value)
    // },
    openTotalEdit() {
      this.totalAllShow = true
      this.addShow = false
    },
    openAddEdit() {
      this.totalAllShow = true
      this.addShow = true
    },
    closeAdd() {
      this.addShow = false
      // this.$refs.addForm.submitData.addItems =[]
      // this.addList = []
    },
    closeTotalAll() {
      this.cancelToTalEdit()
      // this.totalAllShow = false
    },
    saveTotalEdit() {
      this.totalAllShow = false

    },
    cancelToTalEdit() {
      // this.totalEditList = []
      // this.totalDicountList = []
      // this.totalPlusList =[]
      // this.resetCoupon()
      this.totalAllShow = false
    },
    applyCoupon(couponData) {
      this.couponInfo = couponData
    },
    validCoupon() {
      // console.log(this.$refs.couponForm)
      this.$refs.couponForm.validateField('couponCode')
    },
    resetCoupon() {
      this.couponInfo = {}
      this.submitData.couponCode = ''
      this.previousCouponCode = ''
      this.$refs.couponCode.resetField('couponCode') // 留意
      this.submitData.couponCode = '' // resetField 有時不會work 所以還要清空couponCode
      if (this.isEditMode) {
        const {
          total,
          ...other
        } = this.couponItem
        this.deleteCoupon = {
          ...other,
          price: total
        }
        // this.deleteIds.push({
        //   ...other,
        //   price:total
        // })
        // console.log(this.deleteIds)
      }
    },
    addTotalEdit(item) {
      if (this.isChildren) {
        let list = [...this.totalEditList]
        list.push({
          ...item
        })
        this.totalEditList = [...list]
      } else {
        if (this.isEditMode) {
          this.addMore([{
            ...item
          }])
          // this.$emit('addMore',[{...item}])
        } else {
          let list = [...this.totalEditList]
          list.push({
            ...item
          })
          // console.log(list)
          // this.totalEditList.push({...item})
          // this.totalDicountList = list.filter(item =>{
          //   return item.type === '%'
          // })
          // this.totalPlusList = list.filter(item =>{
          //   return item.type !== '%'
          // })
          // // console.log(dicountList,otherList)
          // this.totalEditList = [...this.totalPlusList,...this.totalDicountList]
          this.totalEditList = [...list]
          this.prepaidAndEdit()
        }
      }


    },
    prepaidAndEdit() {
      if (this.submitData.paymentMethod === "Prepaid") {
        this.submitData.paymentMethod = ""
        this.paymentWay = "offline"
        this.isPrepaidAndEdit = true
      }
    },
    scrollToTop() {
      if (window.innerWidth < 481) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.drawer.$el.querySelector('.el-drawer').scrollTop = 150

            // console.log(this.$refs.drawer.$el.querySelector('.el-drawer').scrollTop)
          }, 200)
        })
      }
    },
    openAddressEdit(){
      this.addressShow = true
    },
    closeAddress(){
      this.addressShow = false
    },
    onSelectCity() {
      this.submitData.district = ''
    },
    getDefaultAddress(){
      
      if(this.memberInfo.shippingInfo && this.memberInfo.shippingInfo[0] && this.memberInfo.shippingInfo[0].district){
        const addressOk = this.filterCities.some(item => {
          return item.district.includes(this.memberInfo.shippingInfo[0].district)
        })
        if(addressOk){
          const {city, district ,address} = this.memberInfo.shippingInfo[0]
          this.submitData.city = city
          this.submitData.district = district
          this.submitData.address = address
        }
      }
    },
    async saveHomeAddress(){
      await this.$refs.addressForm.validate()
      if(this.isEditMode){
        this.tryToSaveOrder()
      } else {
        this.addressShow = false
      }
      
    },
    async tryToSaveAddress(){
      if(this.enableSaveAddress){
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
      }
    },
    // 可能要拿掉
    // updateDefaultValue() {
    //   this.$emit('update')
    //   // this.handleDrawerClosed()
    // },
    // changeAllToral(){

    // }
  },
}