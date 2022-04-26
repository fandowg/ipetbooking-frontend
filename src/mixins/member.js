import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import {
  cloneDeep
} from 'lodash'
import {
  genderFilter,
  orderStatusMap,
  findDistrictZip,
  districtsFilter,
  orderStatusFilter,
  orderSourceFilter,
  bookingStatusFilter,
  paymentStatusMapFilter,
  taxTypeMap,
  carrierTypeMap,
  taiwanCitys
} from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import {
  formatStatusMessage
} from '@utils/request'

const extraInfoPhone = {
  // type:'phone',
  phoneCode: '+886',
  phoneNumber: ''
}

const extraInfoEmergency = {
  // type:'emergency',
  phoneCode: '+886',
  phoneNumber: '',
  fullName: '',
  gender: 'male'
}

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

const memderData = () =>{
  return{
    fullName:'',
    gender:'male',
    phone:'',
    phoneCode:'+886',
    phoneNumber:'',
    tags:[],
    email:'',
    lineId:'',
    merchantNote:'',
    extraInfos: {
      extraInfoPhone: [extraInfoPhone],
      extraInfoEmergency: [extraInfoEmergency]
    }
  }
  
}

export default {
  components: {
    BaseButtonDialog,
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
    InvoiceForm: () => lazyLoadComponent(import('@components/InvoiceForm')),
    

  },
  filters: {
    orderStatusFilter,
    orderSourceFilter,
    formatDate,
    bookingStatusFilter,
    paymentStatusMapFilter,
    genderFilter
  },
  data() {
    return {
      submitDataMember: memderData(),
      memberInfo: {},
      activeSearchType: 'short',
      activeMemberData: 'information',
      searchData: {
        phoneCode: '+886',
        phoneNumber: '',
      },
      filterData: {
        search: ''
      },
      searchNone: false,
      isNewMember:false,
      memberEditMode: 'edit',
      memberOrderType:'order',
      // 地址
      addressMode: 'billing',
      taiwanCitys,
    }
  },
  computed: {

    searchRules() {
      const isTaiwan = this.searchData.phoneCode === '+886'
      return {
        phoneNumber: [{
            pattern: isTaiwan ? /^09\d{8}$/ : '',
            message: '格式請符合 09XXXXXXXX',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (!value) return callback()
              this.tryToSearchMember()
            },
            trigger: 'custom',
          },
        ],
      }
    },
    memberRules() {
      const isTaiwan = this.submitDataMember.phoneCode === '+886'
      // const isTaiwan = true
      return {
        fullName: [{
          required: true,
          message: '請輸入姓名'
        }],
        phone: [{
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
        gender: [{
          required: true,
          message: '請選擇性別',
          // trigger: 'change',
        }, ],
        email: [

          {
            type: 'email',
            message: '請輸入正確的 Email 格式'
          },
        ],
      }
    },
    // 地址
    addressRules() {
      return {
        'shippingInfo.0.phone': [
          // { required: true, message: '請輸入電話',trigger: 'blur' },
          {
            pattern: /[\s\#0-9_\-\+\/\(\)\.]/,
            message: '請輸入正確的 電話 格式',
            trigger: 'blur',
          },
        ],
        'billingInfo.phone': [
          // { required: true, message: '請輸入電話',trigger: 'blur' },
          {
            pattern: /[\s\#0-9_\-\+\/\(\)\.]/,
            message: '請輸入正確的 電話 格式',
            trigger: 'blur',
          },
        ],
      }
    },
    districts() {
      let districts = []
      if (this.addressMode === 'shipping') {
        districts = this.submitDataMember[`${this.addressMode}Info`][0].city
      }
      if (this.addressMode === 'billing') {
        districts = this.submitDataMember[`${this.addressMode}Info`].city
      }
      return districtsFilter(districts)
    },
    // 發票
    storeInvoiceSetting() {
      if (this.submitDataMember.storeInvoiceSetting) {
        return this.submitDataMember.storeInvoiceSetting
      } else {
        return false
      }

    },
    
  },
  watch: {
    memberInfo: 'updateUserByMember',
    userSameAsMember: 'updateUserByMember',
  },
  created() {
    this.tryToFetchTagList()

  },
  methods: {
    memberPets(item){
      // console.log(item)
      if(item.value!== '查無會員，立刻新增會員'){
        const petNames = item.pets.map(i=>i.name)
      return petNames.join('，')
      } else {
        return ''
      }
      
    },
    updateUserByMember() {
      const fields = ['memberId', 'fullName', 'gender', 'phoneCode', 'phoneNumber', 'email']
      fields.forEach((field) => {
        this.submitData[field] = field === 'memberId' ? this.memberInfo.id : this.memberInfo[field]
      })
    },
    async tryToSearchMember() {
      // if(this.scheduleDetail){
      //   this.searchData.bookingDateTime = `${formatDate(this.scheduleDetail.date,'date-dash')} ${formatDate(this.scheduleDetail.date,'time')}`
      // }
      this.tryingGetMember = true
      this.$store
        .dispatch('member/findByPhone', this.searchData)
        .then((member) => {
          this.memberInfo = member
          // this.$emit('update:syncMemberInfo', member)
          // this.$emit('updateMemberInfo', member)
          this.editDetailEnabled = false
          this.setSubmitDataMember()
          this.tryToFetchPetList() // 這可能可以不用
          this.isNewMember = false
          
          this.tryingGetMember = false
          this.mamberSearchShow = false
          // this.syncEditCustomerEnabled = false
          // this.memberSubmitData = {
          //   fullName: '',
          //   phone: '',
          //   email: '',
          //   tagIds: [],
          //   gender: '',
          //   lineId: '',
          // }
          // if (this.syncMemberDataNotYet) {
          //   this.openEditMember()
          // }
        })
        .catch(() => {
          // this.memberInfo = {}
          this.creatMember()
          this.submitDataMember.phone = this.searchData.phoneNumber
          // this.$emit('update:syncMemberInfo', {})
          // this.$emit('updateMemberInfo')
          this.isNewMember = true
          
          this.tryingGetMember = false
          // this.mamberSearchShow = false
          // this.syncEditCustomerEnabled = true
          // this.submitDataMember = memderData()
          // return callback(new Error('此手機號碼尚未註冊'))
        })
    },
    async searchQuery(string, cb) {
      // console.log(string.length)
      if (string && string.length >= 2) {
        let {
          items
        } = await this.$store.dispatch(
          'member/fetchListShort', {
            search: string
          }
        )
        if (items.length > 0) {
          items = items.map(item => {
            return {
              ...item,
              value: item.phoneNumber
            }
          })
          this.searchNone = false
          cb(items)
        } else {
          this.searchNone = true
          cb([{
            value: '查無會員，立刻新增會員'
          }])

        }
      } else {
        cb([])
      }


    },
    async tryToFetchDetail(memberId) {
      let member ={}
      // if(!this.isEditMode){
      //   member = await this.$store.dispatch('member/fetchSingle', memberId)
      // }else if(this.isEditMode){
      //   member = this.memberItem
      // }
      
      this.tryingGetMember = true
      member = await this.$store.dispatch('member/fetchSingle', memberId)
      //  console.log(member.merchantNote)
      this.memberInfo = member
      //  if(!this.memberInfo.extraInfos || this.memberInfo.extraInfos.length === 0){
      //   this.memberInfo.extraInfos = []
      //   this.memberInfo.extraInfos[0]=extraInfoPhone
      //   this.memberInfo.extraInfos[1]=extraInfoEmergency
      //  }
      //  console.log(this.memberInfo)
      this.setSubmitDataMember()

      this.mamberSearchShow = false
      this.tryingGetMember = false
      // 寵物要找到會員才能搜尋
      this.tryToFetchPetList()
      if(!this.isEditMode){
        this.scrollToBottom()
      }
      
      //  console.log(member)
    },
    setSubmitDataMember() {
      this.submitDataMember = cloneDeep(this.memberInfo)
      if (!this.submitDataMember.extraInfos) {
        this.submitDataMember = {
          ...this.submitDataMember,
          extraInfos: {
            extraInfoPhone: [extraInfoPhone],
            extraInfoEmergency: [extraInfoEmergency]
          }

        }
      }
      this.submitDataMember.merchantNote = this.submitDataMember.merchantNote ? this.submitDataMember.merchantNote.replace(/<br\s\/>/g, '') : ''
      this.submitDataMember.phone = this.submitDataMember.phoneNumber
    },
    searchQueryByBtn() {
      // console.log(99)
      if (this.filterData.search && this.filterData.search !== '查無會員，立刻新增會員') {
        this.$refs.autocomplete.$refs.suggestions.showPopper = true;
      }

    },
    async selectMember(item) {
      // console.log(item)
      this.tryingGetMember = true
      try{
        if (item.value && item.value !== '查無會員，立刻新增會員') {
          
          await this.tryToFetchDetail(item.id)
          this.mamberSearchShow = false
          this.editDetailEnabled = false
          // this.$refs.autocomplete.$refs.suggestions.showPopper = false;
        }
        if (item.value === '查無會員，立刻新增會員') {
          this.filterData.search = ''
          this.creatMember()
        }
      }catch{

      }finally{
        this.tryingGetMember = false
      }
      
    },
    creatMember() {
      this.editDetailEnabled = true
      this.memberEditMode = 'new'
      // this.memberInfoShow = true
      this.submitDataMember = memderData()
    },
    goToDetail() {
      this.closeAllInfo()
      this.memberInfoShow = true
    },
    clearMemberInfo() {
      this.mamberSearchShow = true
      this.memberInfo = {}
      this.memberInfoShow = false
      this.editDetailEnabled = false
      this.filterData.search = ''
      this.resetMember()
    },
    enableEditDetail() {
      this.editDetailEnabled = true
      // this.isEditMember =true
      this.memberEditMode = 'edit'
    },
    async tryToSaveDetail() {
      // console.log(555)
      if (this.$refs.memberForm) {
        await this.$refs.memberForm.validate()
      }
      // console.log(666)
      this.tryingSaveMember = true
      const {
        tags,
        ...data
      } = this.submitDataMember
      const tagIds = tags.map(item => item.id)
      const submitData = {
        ...data,
        tagIds,
      }
      if (this.memberEditMode === 'edit') {
        submitData.id = this.submitDataMember.id
        await this.$store.dispatch('member/store', submitData)
        this.tryToFetchDetail(this.memberInfo.id)
      } else {
        const {
          items
        } = await this.$store.dispatch('member/store', submitData)
        this.tryToFetchDetail(items.id)
      }


      // if(mode==='edit'){


      // }else{

      // }
      this.editDetailEnabled = false
      this.tryingSaveMember = false
      this.editInvoiceEnabled = false
    },
    closeEditDetail() {
      this.editDetailEnabled = false
      this.setSubmitDataMember()
    },
    closeMemberInfo() {
      this.memberInfoShow = false
    },
    onSelectMemberOrderType(type){
      this.memberOrderType = type
    },
    // closeDetail(){
    //   this.editDetailEnabled = false
    // },

    validPhoneNumber(phoneNumber) {
      this.$refs.searchFormByPhone.validateField('phoneNumber')
    },
    // 地址
    enableEditAddress(mode) {
      this.addressMode = mode
      this.visibleDialogAddress = true
    },
    onSelectCity() {
      // console.log(111)
      if (this.addressMode === 'billing') {
        this.submitDataMember[`${this.addressMode}Info`] = {
          ...this.submitDataMember[`${this.addressMode}Info`],
          district: '',
          postcode: '',
        }
      }
      if (this.addressMode === 'shipping') {
        this.submitDataMember[`${this.addressMode}Info`][0].district = ''
        this.submitDataMember[`${this.addressMode}Info`][0].postcode = ''
      }
    },
    onSelectDistrict() {
      if (this.addressMode === 'shipping') {
        const {
          city,
          district
        } = this.submitDataMember[`${this.addressMode}Info`][0]
        this.submitDataMember[`${this.addressMode}Info`][0].postcode = findDistrictZip(city, district)
      }
      if (this.addressMode === 'billing') {
        const {
          city,
          district
        } = this.submitDataMember[`${this.addressMode}Info`]
        this.submitDataMember[`${this.addressMode}Info`].postcode = findDistrictZip(city, district)
      }

    },
    async onSaveAddress() {
      try {
        await this.$refs.addressForm.validate()
        this.tryingSaveAddress = true
        // console.log(333)
        await this.tryToSaveDetail()
        // await this.tryToFetchDetail()
        // await this.saveEdit()
        // await this.tryToFetchMember()
        this.visibleDialogAddress = false
      } catch {
        console.log(444)
      } finally {
        this.tryingSaveAddress = false
      }
    },
    handleCloseAddress() {
      this.submitDataMember = cloneDeep(this.memberInfo)
      this.getDefaultAddress()
      this.visibleDialogAddress = false
    },
    getDefaultAddress() {

      if (this.$hasHomeService()) {
        if (!this.submitDataMember.billingInfo) {
          this.submitDataMember.billingInfo = defaultAddress()
        }
        if (!this.submitDataMember.shippingInfo) {
          this.submitDataMember.shippingInfo = [defaultAddress()]
        }
      }


    },
    // 發票
    enableEditInvoice() {
      this.editInvoiceEnabled = true
    },
    cancelEditInvoice() {
      const {
        taxType,
        taxId,
        CarrierType,
        CarrierNum,
        LoveCode
      } = this.memberInfo
      this.submitDataMember = {
        ...this.submitDataMember,
        taxType,
        taxId,
        CarrierType,
        CarrierNum,
        LoveCode,
      }
      this.editInvoiceEnabled = false
    },
  }
}