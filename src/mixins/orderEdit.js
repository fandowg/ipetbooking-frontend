import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import formatDate from '@utils/format-date'
import {
  cloneDeep
} from 'lodash'
import {
  questions
} from '@utils/pet-question'
import { Clipboard } from '@capacitor/clipboard';
// import { ElStep } from '@/node_modules/element-ui/types/step'



export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      assignList: [],
      signDialogKey: 0,
      editAssistantEnabled: false,

      // submitData: { ...this.defaultValue },
      tryingAssign: false,
      commentList: [],
      petCommentDialogVisible: false,
      checkDialogVisible: false,
      changeDialogVisible: false,
      noShowDialogVisible: false,
      signDialogVisible: false,
      // show
      noteEditShow: false,
      editPaymentMethodShow: false,
      orderHistoryShow: false,
      orderRefundShow: false,

      tryingNoShow: false,
      tryingCheckIn: false,

      // childrenOrder
      isChildren:false,

      payMethods: {
        'Cash': '到店付款(現金)',
        'StoreCredit': '現場刷卡',
        'Atm': '線下匯款',
      },
      check: {
        // beautician: 'Cindy Lee',
        helperId: '',
      },
      addOrderIndex: 'main', // 這種同個資料用兩種型別其實不太對，後續修正
      adds:[],
      deleteIds:[],
      deleteCoupon:{},

      // more
      mapStatusName: {
        'PAID': '訂單資訊',
        'UNPAID': '付款',
        // '3': '訂單資訊',
      },
      shareLink: '',
      shareDialogVisible:false,
      tryingSendSMS:false,
      writeDialogVisible:false,

      tryingSendEmail: false,

      // 退款
      refundSubmitData: {
        refundDate: '',
        amount: '',
        note: '',
      },
 
      isRefund: false,
      tryingRefund: false,


    }
  },
  computed: {
    canPartialRefund() {
      return this.currentOrder.canPartialRefund
    },
    storeCashflowSetting(){
      return this.defaultValue.storeCashflowSetting
    },
    // personalityContent() {
    //   return this.defaultValue.pet.questions.personality.join('，')
    // },
    // healthyContent() {
    //   const content = this.defaultValue.pet.questions.healthy.map(item => {
    //     return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
    //   })
    //   return content.join('，')
    // },
    // behaviorContent() {
    //   const content = this.defaultValue.pet.questions.behavior.map(item => {
    //     return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
    //   })
    //   return content
    // },
    // vaccineContent() {
    //   let vaccine = ''
    //   switch (this.defaultValue.pet.questions.vaccine) {
    //     case 1:
    //       vaccine = '1 劑'
    //       break;
    //     case 2:
    //       vaccine = '2 劑'
    //       break;
    //     case 3:
    //       vaccine = '3 劑'
    //       break;
    //     default:
    //       break;
    //   }
    //   return vaccine
    // },
    editOrderDate() {
      return formatDate(`${this.defaultValue.date} ${this.defaultValue.time}`, 'dateTime')
    },
    isEmptyByOrderExtrafields() {
      return this.defaultValue.byOrderExtrafields instanceof Array
    },
    editParams() {
      return this.submitData.params.map(item => {
        return {
          ...item,
          price: item.total
        }
      })
    },
    childrenOrders() {
      return this.defaultValue.childrenOrders.length > 0 ? this.defaultValue.childrenOrders : []
    },
    childrenOrdersHaveInvoice() {
      return this.childrenOrders.filter(item=>{
        return item.invoice.InvoiceNumber
      })
      // return this.defaultValue.childrenOrders.length > 0 ? this.defaultValue.childrenOrders : []
    },
    helpSubmitRules() {
      return {
        // beautician: [
        //   {
        //     required: true,
        //     message: '請選擇美容師',
        //     trigger: 'change',
        //   },
        // ],
        helperId: [{
          required: true,
          message: '請選擇助理',
          trigger: 'change',
        }, ],
      }
    },
    currentHistory() {
      return this.currentOrder.history
      // if (this.addOrderIndex === 'main') {
      //   return this.defaultValue.history
      // } else{
      //   return this.currentOrder.history
      // }

    },

   
    editTotalEditList() {
      const totalEditTypes = ['+', '-', '%']
      return this.defaultValue.params.filter((item) => {
        return totalEditTypes.includes(item.type)
      })
    }, // 重複的值，後續要拉掉
    editAddList() {
      return this.defaultValue.params.filter((item) => {
        return item.type === 'cosmetic-add'
      })
    }, // 重複的值，後續要拉掉

    // editPamamsOther(){
    //   const list = this.defaultValue.params.splice(0,1)
    //   return list
    // },

    prepaidItem() {
      return this.defaultValue.params.find((item) => {
        return item.type === 'prepaid'
      })
    },
    couponItem() {
      return this.defaultValue.params.find((item) => {
        return item.type === 'coupon'
      })
    },
    editServiceTotal() {
      let cacheTotal = 0
      if (this.prepaidItem) {
        cacheTotal = 0
      } else if (this.couponItem) {
        cacheTotal = this.defaultValue.params[0].total + this.couponItem.total
      } else {
        cacheTotal = this.defaultValue.params[0].total
      }
      return cacheTotal
    },
    childrenOrderTotal(){
      let total = 0
      let basePrice = 0
      if(this.isChildren){
        this.addList.forEach((item,index)=>{
          total = total + parseInt(item.price)
          basePrice = basePrice + parseInt(item.price)
        })
        this.totalEditList.forEach((item,index)=> {
          if(item.type==="+"){
            total = total + parseInt(item.price)
            basePrice = basePrice + parseInt(item.price)
          }
          if(item.type==="-"){
            total = total - parseInt(item.price)
          }
          if(item.type==="%"){
            // console.log(item.price,typeof(item.price),total)
            
            const discount = Math.round(total * (item.price / 100))
            // console.log(discount)
            this.totalEditList[index].discount = discount
            total = total - discount
          }
        })
        this.moreItems.forEach((item,index)=> {
          if(item.type==="+"){
            total = total + parseInt(item.price)
            basePrice = basePrice + parseInt(item.price)
          }
          if(item.type==="-"){
            total = total - parseInt(item.price)
          }
          if(item.type==="%"){
            // console.log(item.price,typeof(item.price),total)
            
            const discount = Math.round(total * (item.price / 100))
            // console.log(discount)
            this.moreItems[index].discount = discount
            total = total - discount
          } else{
            total = total + parseInt(item.price)
          basePrice = basePrice + parseInt(item.price)
          }
        })
        this.basePrice = basePrice
        // this.totalEditList = [...this.totalPlusList,...this.totalDicountList]
        // console.log(this.totalEditList)
   
        // this.totalDicountList

      }
      
      // if(total<0){
      //   total = 0
      // }
      return total
    },
    isMainOrder(){
      return this.addOrderIndex === 'main'
    },
    linkTitle() {
      const { childrenOrders } = this.defaultValue
      if (childrenOrders.length) {
        let hasUnpaid = false
        hasUnpaid = childrenOrders.some((order) => order.paymentStatus === 'UNPAID')
        return this.mapStatusName[hasUnpaid ? 'UNPAID' : 'PAID']
      } else return this.mapStatusName[this.defaultValue.paymentStatus]
    },
    refundRules() {
      return {
        refundDate: [
          {
            required: true,
            message: '請選擇日期',
            // trigger: 'change',
          },
        ],
        amount: [
          {
            required: true,
            message: '請輸入退款金額',
            // trigger: 'blur',
          },
          // {
          //   type: 'number',
          //   message: '請輸入數字',
          //   // trigger: 'blur',
          // },
        ],
      }
    },
    unPaidAddOrder(){
      return this.childrenOrders.find(item =>{
        return item.paymentStatus === 'UNPAID' && item.status !==0
      })
    }
  },
  watch: {

  },
  created() {

    this.getEditOrderDefault()
    this.getCoupon()
    

  },
  methods: {
    getCoupon(){
      if(this.isEditMode && this.submitData.coupon){
        this.couponInfo = this.submitData.coupon
        this.submitData = {
          ...this.submitData,
          couponCode:this.submitData.coupon.code
  
        }
      }
    },
    async getEditOrderDefault() {
      if (this.isEditMode) {
        this.mamberSearchShow = false
        this.tryToFetchHelperList()
        await this.tryToFetchDetail(this.defaultValue.memberId)
        this.tryToFetchCommentListAll()


      }
    },
    openCommentEdit() {
      this.$refs.comment.openEdit()
    },
    async tryToFetchCommentListAll() {
      // console.log(345)
      try {
        this.commentList = await this.$store.dispatch('petComment/fetchList', {
          // pet_id: this.pet,
          petId: this.defaultValue.pet.id,
          paginate: 0,
        })
      } catch {

      }
    },
    emitCommentFetch() {
      this.tryToFetchCommentListAll()
    },
    openCommentList() {
      this.petCommentDialogVisible = true
      this.$nextTick(() => {
        this.$refs.commentAll.tryToFetchList()
      })
      // console.log(789)
    },

    async tryToFetchHelperList() {
      this.tryingAssign = true
      const {
        items
      } = await this.$store.dispatch('order/fetchHelperList', this.defaultValue.id)
      this.assignList = items
      this.assignList.forEach((item, index) => {
        if (item.id === this.defaultValue.scheduleItem.id) {
          this.assignList.splice(index, 1)
        }
      })
      this.tryingAssign = false
    },
    async tryToStoreAssignHelper() {
      this.tryingAssign = true
      // this.$emit('update:loading', true)
      await this.$store.dispatch('order/storeAssignHelper', {
        id: this.defaultValue.id,
        itemId: this.submitData.helper.id
      })
      // 要更新訂單 改這個等於是改訂單
      this.updateOrder()
      // this.$emit('update')
      this.tryingAssign = false
      // this.$emit('update:loading', false)
      this.editAssistantEnabled = false
    },
    cancelAssignEdit() {
      // this.assistant = ''
      this.editAssistantEnabled = false
    },
    openAssignEdit() {
      this.editAssistantEnabled = true

      // defaultValue.helper.name
      if (this.defaultValue.helper) {
        // this.submitData.helper.id=this.defaultValue.helper.id
        this.submitData.helper = {
          ...this.defaultValue.helper
        }
      } else {
        this.submitData.helper = {
          id: '',
          name: ''
        }
      }
    },
    openNoteEdit() {
      this.noteEditShow = true
      this.editPaymentMethodShow = false
      this.orderHistoryShow = false 
      this.orderRefundShow = false
    },
    closeNoteEdit() {
      this.noteEditShow = false
    },
    convertExtraFieldToStoreDataFromEditMode(submitData) {
      const orderInfo = cloneDeep(submitData)
      const storeData = cloneDeep(this.$refs.extrafieldEdit.defaultValue)
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
          const {
            id,
            value
          } = extraFields[extraFieldsId]
          extraFieldsArray.push({
            id,
            value
          })
        }
      })
      return extraFieldsArray
    },
    isEdited(field) {
      return field.edited === true
    },
    async tryToStorePayment(){
      if(this.$refs.bankType){
        await this.$refs.bankType.validate()
      }
      
      this.tryToSaveOrder()
    },
    async tryToSaveOrder(type) {
      const {
        params,
        ...other
      } = this.currentOrder
      // const orderExtrafields = this.productHasExtraField ? this.convertExtraFieldToStoreDataFromCreateMode() : undefined
      let storeData ={}
      if(type === 'extraField'){
        storeData = {
          ...this.convertExtraFieldToStoreDataFromEditMode({
            ...other,
            // bankType:''//
          }),
          // params:[...this.editParams],
          // basePrice: this.basePrice, 
          // total: this.submitPriceTotal,
          // ...this.convertExtraFieldToStoreDataFromEditMode(this.submitData),
          merchantNote: '',
        }
      } else {
        storeData = {
          ...other,
          // bankType:'',//
          merchantNote: '',
        }
      }
      
      // if(this.isEditMode){
      //   delete storeData.prepaidOrderUuid
      // }
      this.tryingStore = true
      try {
        await this.$store.dispatch('order/store', storeData)
        this.handleSaveSuccess()
        await this.updateOrder()
        // 很多地方都會用到編輯訂單，所以必須關掉很多的介面
        this.noteEditShow = false
        this.editPaymentMethodShow = false
        this.addressShow = false

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
    handleSaveSuccess() {
      this.$message({
        message: '編輯成功！',
        type: 'success',
      })
      // this.emitStore()
    },
    async updateOrder() {
      const updatedValue = await this.$store.dispatch('order/fetchSingle', this.defaultValue.id)
      this.$emit('update:defaultValue', updatedValue)
      this.submitData = Object.assign({}, updatedValue)
      this.getCoupon()
      this.$emit('update')
      // await this.$store.dispatch('order/fetchSingle', this.defaultValue.id)
    },
    // 子訂單的show要另外寫 orderItem必須做成編輯的樣式
    editOpenTotalEdit(index) {
      // console.log(index)
      this.totalAllShow = true
      if(index==='main'){
        this.addOrderIndex = index
        this.currentOrder = cloneDeep(this.defaultValue) // 如果同時有編輯多個地方 用submitData會存到我當下沒有想要存的東西，所以複製defaultValue來改比較好
        
      } else {
        this.addOrderIndex = index
        this.currentOrder = cloneDeep(this.childrenOrders[index])
        // console.log(this.currentOrder)
      }
        // console.log(index)
        // const totalEditTypes = ['+','-','%']
        // this.totalEditList = this.defaultValue.params.filter(item =>{
        //   return totalEditTypes.includes(item.type)
        // })
        // console.log(this.totalEditList)
        // this.addList = this.defaultValue.params.filter(item =>{
        //   return item.type ==="cosmetic-add"
        // })
        let list = [...this.currentOrder.params]
        if(index==='main'){
          list.splice(0,1)
          list.forEach((item,index)=>{
            if(item.type==='coupon'){
              list.splice(index,1)
            }
          })
          list.forEach((item,index)=>{
            if(item.type==='prepaid'){
              list.splice(index,1)
            }
          })
        }
       
        list = list.map(item =>{
          let {total ,...other}=item
          if(item.type==='-'){
            total = - total
          }
          if(item.type==='%'){
            total = parseInt(item.description)
            // console.log(total)
          }
          return {
            ...other,
            price:total
          }
        })
        this.haveItems = list
        // this.totalEditList = this.totalEditList.map(item =>{
        //   let {total ,...other}=item
        //   if(item.type==='-'){
        //     total = - total
        //   }
        //   if(item.type==='%'){
        //     total = parseInt(item.description)
        //     // console.log(total)
        //   }
        //   return {
        //     ...other,
        //     price:total
        //   }
        // })
        // this.addList = this.addList.map(item =>{
        //   const {total ,...other}=item
        //   return {
        //     ...other,
        //     price:total
        //   }
        // })
        this.moreItems =[]
        this.adds = []
        this.deleteIds = []
        // console.log(this.addList)
      
    },
    editOpenPaymentMethod(index) {
      if(index==='main'){
        this.addOrderIndex = index
        
       
        this.currentOrder = cloneDeep(this.defaultValue) 
        // 取得 bankType
        delete this.currentOrder.bankType
        if(this.currentOrder.Vacc){
          this.currentOrder = {
            ...this.currentOrder,
            bankType:this.currentOrder.Vacc.BankType
          }
        }
        
      } else {
        this.addOrderIndex = index

        this.currentOrder = cloneDeep(this.childrenOrders[index])
        // 取得 bankType
        delete this.currentOrder.bankType
        if(this.currentOrder.Vacc){
          this.currentOrder = {
            ...this.currentOrder,
            bankType:this.currentOrder.Vacc.BankType
          }
        }
      }

      this.editPaymentMethodShow = true
    },
    closeEditPaymentMethod() {
      this.editPaymentMethodShow = false
    },
    editOpenHistory(index) {

      if(index==='main'){
        this.addOrderIndex = index
        this.currentOrder = cloneDeep(this.defaultValue) 
        
      } else {
        this.addOrderIndex = index

        this.currentOrder = cloneDeep(this.childrenOrders[index])
      }

      this.orderHistoryShow = true

    },
    closeHistory() {
      this.orderHistoryShow = false
    },
    tryToCancelOrder(index) {
      this.statusDialogVisible = true
      if(index==='main'){
        this.addOrderIndex = index
        this.currentOrder = cloneDeep(this.defaultValue) 
        
      } else {
        this.addOrderIndex = index

        this.currentOrder = cloneDeep(this.childrenOrders[index])
      }
    },
    editOpenRefund(index) {
      if(index==='main'){
        this.addOrderIndex = index
        this.currentOrder = cloneDeep(this.defaultValue) 
        
      } else {
        this.addOrderIndex = index

        this.currentOrder = cloneDeep(this.childrenOrders[index])
      }
      this.refundSubmitData = {
        refundDate: '',
        amount: '',
        note: '',
      }
      if(!this.canPartialRefund){
        this.refundSubmitData.amount=this.currentOrder.backBalance
      }
      this.orderRefundShow = true
    },
    closeOpenRefund(){
      this.orderRefundShow = false
    },
    openPaidDialog() {
      this.tryToPayOrder(this.submitData.paymentMethod,this.submitData,'main')
    },
    openAddPaidDialog(){
      this.tryToPayOrder(this.unPaidAddOrder.paymentMethod,this.unPaidAddOrder,'add')
    },
    async tryToPayOrder(method,data,type) {
      try {
        if(type === 'add'){
          await this.$confirm(`子訂單：${data.id} 確認付款方式為「 ${this.payMethods[method]} 」？`, '提示', {
            confirmButtonText: '確定',
            showCancelButton: true,
            type: 'warning',
            center: true,
          })

        } else{
          await this.$confirm(`確認付款方式為「 ${this.payMethods[method]} 」？`, '提示', {
            confirmButtonText: '確定',
            showCancelButton: true,
            type: 'warning',
            center: true,
          })
        }
        
        
        const {
          params,
          ...other
        } = data
        await this.$store.dispatch('order/store', {
          ...other,
          paymentMethod: method,
          paymentStatus: 'PAID',
        })
        this.$message({
          type: 'success',
          message: '編輯成功！',
        })
        this.updateOrder()
        // this.handleStore()
        this.paidDialogVisible = false
      } catch {} finally {

      }

    },
    changeCheckDialog() {
      this.changeDialogVisible = true

    },
    openCheckDialog() {
      this.checkDialogVisible = true
      this.check.helperId = this.defaultValue.helper ? this.defaultValue.helper.id : ''
    },
    async onClickNoShow() {
      await this.$refs.form.validate()
      await this.$confirm('確定將此訂單改為「未報到」？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
      this.tryingNoShow = true
      const {
        params,
        ...other
      } = this.defaultValue
      const storeData = {
        ...other,
        status: 5,
        merchantNote: this.submitData.note,
      }
      await this.$store.dispatch('order/store', storeData)
      this.updateOrder()
      // this.handleStore()
      this.submitData.note = ''
      this.noShowDialogVisible = false
      this.changeDialogVisible = false
      this.tryingNoShow = false
    },
    async tryToStoreAssignAndCheckIn() {
      // this.tryingAssign=true
      this.tryingCheckIn = true
      /*   if (this.check.helperId) {
          await this.$store.dispatch('order/storeAssignHelper', { id: this.defaultValue.id, itemId: this.check.helperId })
        } */
      await this.$store.dispatch('order/storeAssignHelper', {
        id: this.defaultValue.id,
        itemId: this.check.helperId
      })
      this.tryToCheckIn()
      // this.$emit('update')
      // this.tryingAssign=false
      // this.editAssistantEnabled = false
    },
    async tryToCheckIn() {
      await this.$refs.beauticianForm.validate()
      this.checkDialogVisible = false
      // await this.$confirm('確定將此訂單改為「已報到」？', '警告', {
      //   confirmButtonText: '確定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   center: true,
      // })
      try {
        this.tryingCheckIn = true
        await this.$store.dispatch('order/verifySingleCode', {
          codeId: this.defaultValue.params[0].codes[0].id,
          orderId: this.defaultValue.id,
        })
        this.$message({
          type: 'success',
          message: '報到成功！',
        })
        this.changeDialogVisible = false
        this.updateOrder()
        // this.handleStore()
      } catch (e) {} finally {
        this.tryingCheckIn = false
      }
    },
    showSignDialog() {
      this.signDialogKey++
      this.signDialogVisible = true
    },
    async editOrderItem(){
      
      // let addTotal = []
      // // const haveIds = this.editTotalEditList.map(item => item.id)
      // const newTotalEdits = this.totalEditList.filter(item =>{
      //   return !item.id
      // })
      // addTotal = newTotalEdits

      // let deleteTotal = []
      // const olderTotalEdits = this.totalEditList.filter(item =>{
      //   return item.id
      // })
      // const orderIds = olderTotalEdits.map(item => item.id)
      // this.editTotalEditList.forEach(item =>{
      //   if(!orderIds.includes(item.id)){
      //     deleteTotal.push(item)
      //   }
      // })

      // let addAdds = []
      // const priceIds = this.editAddList.map(item => item.priceId)
      // const newAdds = this.addList.filter(item =>{
      //   return !priceIds.includes(item.priceId)
      // })
      // // console.log(this.addList,newAdds)
      // addAdds = newAdds

      // let deleteAdd = []
      // // const olderAdd = this.addList.filter(item =>{
      // //   return item.priceId
      // // })
      // const addIds = this.addList.map(item => item.priceId)
      // this.editAddList.forEach(item =>{
      //   if(!addIds.includes(item.priceId)){
      //     deleteAdd.push(item)
      //   }
      // })

      // this.adds = [...addAdds,...addTotal]
      this.adds = [...this.moreItems]
      if(this.isMainOrder){
        if(this.deleteCoupon.price){
          this.deleteIds = [this.deleteCoupon.id,...this.deleteIds]
        }else{
          // this.deleteIds = [...deleteAdd.map(item => item.id),...deleteTotal.map(item => item.id)]
        }
      }
      
      let data = {
        orderId: this.currentOrder.id,
        deleteIds:this.deleteIds,
        adds:this.adds,
        total:this.submitPriceTotal
      }
      if(this.isMainOrder){
        if(this.deleteCoupon.price && this.submitData.couponCode){
          data.couponCode = this.submitData.couponCode
        }
      }
      // console.log(data)
      await this.$store.dispatch('order/storeOrderItem', data)
      this.$message({
        type: 'success',
        message: '編輯成功！',
      })
      this.adds = []
      this.deleteIds = []
      this.haveItems = []
      this.moreItems = []
      this.updateOrder()
      this.totalAllShow = false
      this.addShow = false
      // console.log(this.adds,this.deleteIds)
      // console.log(addTotal,deleteTotal,addAdds,deleteAdd)

      // adds,deleteIds
      // let catchDelete = [] 

    },
    addMore(array){
      // console.log(array)
      this.moreItems = [...this.moreItems,...array]
    },
    openAddOrder(){
    
        const UnPaid = this.defaultValue.paymentStatus === 'UNPAID'
        const childrenUnPaid = this.childrenOrders.some(item =>{
          return item.paymentStatus === 'UNPAID' && item.status !==0
        })
        // console.log(UnPaid,childrenUnPaid)
        if(UnPaid || childrenUnPaid){
           this.$confirm('未付款前，加購請於原來的訂單中選擇『編輯價格與折扣』', '提醒', {
            confirmButtonText: '確定',
            showCancelButton: false,
            type: 'warning',
            center: true,
          })
          return
        }
      
      this.totalAllShow = true
      this.addShow = true
      this.isChildren = true
      this.moreItems = []
    },
    closeChildren(){
      // console.log(111)
      this.totalAllShow = false
      this.addShow = false
      this.isChildren = false
    },
    closeNotificationDialog() {
      this.writeDialogVisible = false
    },
    async tryToGetShareLink() {
      this.shareLink = await this.$store.dispatch('order/getLink', this.defaultValue.id)
    },
    handleShareLink(platform) {
      // <!-- <a href=”fb-messenger://share/?link= https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=123456789”>Send In Messenger</a> -->
      const platformLinkMap = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${this.shareLink}`,
        line: `https://social-plugins.line.me/lineit/share?url=${this.shareLink}`,
      }
      window.open(platformLinkMap[platform], '_blank')
    },
    async tryToSendSMS() {
      this.tryingSendSMS = true
      try {
        await this.$store.dispatch('order/sendLink', {
          orderId: this.defaultValue.id,
          router: 'sms',
        })
        this.$alert(`已發送${this.linkTitle}連結簡訊至使用人電話`, '簡訊發送成功！', {
          confirmButtonText: '確認',
          center: true,
          callback: () => {
            this.tryingSendSMS = false
          },
        })
      } catch (error) {
        this.tryingSendSMS = false
      }
    },
    async copyShareLink() {
      const ghostInput = document.createElement('INPUT')
      document.body.appendChild(ghostInput)
      ghostInput.setAttribute('value', this.shareLink)
      ghostInput.select()
      document.execCommand('copy')
      document.body.removeChild(ghostInput)

      if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
        await Clipboard.write({
          string: this.shareLink
        });
      }

      this.$message('連結複製成功')
    },
    showShareDialog() {
      this.shareDialogVisible = true
    },
    async tryToRefund(id) {
      await this.$refs.refundForm.validate()
      if (this.refundSubmitData.amount > this.currentOrder.backBalance) {
        this.$confirm('退款金額不能超過可退款金額', '提示', {
          confirmButtonText: '確定',
          showCancelButton: false,
          type: 'warning',
          center: true,
        })
        return
      }
      try {
        this.tryingRefund = true
        await this.$store.dispatch('order/refundOrder', {
          id,
          refundData: this.refundSubmitData,
        })
        this.$confirm('退款已完成', '提示', {
          confirmButtonText: '關閉',
          showCancelButton: false,
          type: 'warning',
          center: true,
        })
        this.updateOrder()
        this.orderRefundShow = false
      } catch (error) {
        console.log('TCL: tryToCreateOrder -> error', error)
      } finally {
        this.tryingRefund = false  // 沒用到
        this.isRefund = true // 沒用到

        
        // this.tryingStore = false
      }
    },

    goToPrepaidOrder(id) {
      // console.log(this.$route.name)
  
        this.$router.push({
          name: 'orders',
          query: {
            type: 'prepaidOrder',
            id,
          },
        })
    
      // else{
      //   this.$router.push({
      //     name: 'orders',
      //     params: {
            
      //       type: 'prepaidOrder',
      //       id,
      //     },
      //   })
      // }
    },

    // async tryToGetOrder(orderId) {
    //   this.tryingToGetOrder = true
    //   // console.log(formatDate(this.selectedContextEvent.startDate,'dateTime'))
    //   this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)


    //   // this.memberItem = await this.$store.dispatch('member/fetchSingle', this.drawerOrderData.memberId)

    //   this.tryingToGetOrder = false
    //   this.drawerVisible = true
    // },


  }
}