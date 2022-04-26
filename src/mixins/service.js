import formatDate from '@utils/format-date'

const paramsItem = () =>{
  return {
    type:'cosmetic',
    title:'',
    priceId:'',
    price:0,
    qty:1
  }
}

export default {
  components: {

  },
  filters: {

  },
  data() {
    return {
      currentServiceCont:'',
      currentPrepaid:{},
      currentBuyPrepaid:{},
      // currentService:{
      //   id:'',
      //   maxTimes:1,
      //   name:'',
      //   sizeId:0,
      //   storeTitle:'',
      //   used:0
      // },
      currentService:null, // 包月選中的service
      isBuyPrepaid:false,
      prepaidList:[],
      
    }
  },
  computed: {
   

    filteredServices() {
      if(this.petSizeId){
        let services = []
        this.products.forEach(item=>{
          const list = item.prices.map(i => {
            return {
              ...i,
              storeTitle:item.title,
              productId:item.id

            }
          })
          services=[...services,...list]
        })
        services = services.filter((item) => {
          return item.sizeId === this.petSizeId
        })
        return services
      }else{
        return []
      }
      
    },
    filteredAvailablePrepaidList(){
      // const list =[]
      // console.log(this.memberInfo.availablePrepaidOrders)
      // return this.memberInfo.availablePrepaidOrders
      let available = []
      if(this.memberInfo.availablePrepaidOrders){
        available = this.memberInfo.availablePrepaidOrders.filter((prepaid) => {
          return this.products.some((product) => {
            return prepaid.prices.some((price) => {
              const priceIds = product.prices.map((item) => item.id)
              const priceSizeIds = product.prices.map((item) => item.sizeId)
              const hasPrepaidSizeId = prepaid.sizeIds.includes(this.petSizeId)
              const hasScheduleSizeId = priceSizeIds.includes(this.petSizeId)
              const hasBoth = hasPrepaidSizeId && hasScheduleSizeId
              return priceIds.includes(price.id) && hasBoth
            })
          })
        })
      }
      
      return available
    },
    prepaidListAfterService(){
      const id = this.submitData.params[0].priceId
      return this.filteredAvailablePrepaidList.filter(item =>{
        return item.prices.some(i =>{
          return id === i.id
        })
      })
      
    },
    filteredServicesByPrepaid() {
      // filteredServices 已經濾過體型，再檢查購買的包月哩的服務是否有包含在美容師可以服務的服務裡
      let list = []
      // const priceIds = this.filteredServices.map(item => item.id)
      this.currentPrepaid.prices.forEach((item,index) =>{
        return this.filteredServices.some(i =>{
          if(i.id === item.id){
            item = {
              ...item,
              title:item.name,
              productId:i.productId,
              price:i.price,
              serviceTime:i.serviceTime
            }
            list.push(item)
            return true         
          } else {
            return false
          }
        })
       
      })
      return list
      // const priceIds = this.filteredServices.map(item => item.id)
      // return this.currentPrepaid.prices.filter(item =>{
      //   return priceIds.includes(item.id)
      // })
      // this.filteredServices
    },
    filterPrepaidList() {
      let available = []
      const priceIds = this.filteredServices.map(item => item.id)
      available = this.prepaidList.filter((prepaid) => {
        
        return prepaid.prices.some(item =>{
          return priceIds.includes(item.id)
        })
      })
      return available
    },
    filteredServicesByBuyingPrepaid() {
      let list = []
      // const priceIds = this.filteredServices.map(item => item.id)
      this.currentBuyPrepaid.prices.forEach((item,index) =>{
        return this.filteredServices.some(i =>{
          if(i.id === item.id){
            item = {
              ...item,
              productId:i.productId,
              price:i.price,
              serviceTime:i.serviceTime
            }
            list.push(item)
            return true         
          } else {
            return false
          }
        })
       
      })
      return list
      // return this.currentBuyPrepaid.prices.filter(item =>{
      //   return priceIds.includes(item.id)
      // })
    }

  },
  watch: {
   
  },
  created() {
    // this.tryToFetchPrepaid()
  },
  methods: {
    resetService(){
      this.submitData.prepaidOrderUuid = ''
      this.submitDataPrepaid.prepaidId = ''
      this.submitData.params = [paramsItem()]
      // this.submitData.params= [
      //   {
      //     id:'',
      //     qty:0
      //   }
      // ]
      this.currentService = null
      this.currentServiceCont = ''
    },
    onSelectOrderType(type){
      this.ordertype = type
      this.closeAllInfo()
      if(type==='order'){
        this.serviceShow = true
        this.prepaidShow = false
        this.isBuyPrepaid = false
        this.resetService()
        
      } 
      if(type==='prepaid-order'){
        this.serviceShow = false
        this.prepaidShow = true
        
        this.resetService()
      } 
    },
    reSelectOrder(){
      if(this.ordertype ==='order'){
        this.serviceShow = true
        this.prepaidShow = false
      } 
      if(this.ordertype ==='prepaid-order'){
        this.serviceShow = false
        this.prepaidShow = true
        if(this.isBuyPrepaid){
          this.prepaidAllShow = true
        }
      } 
    },
    closeService(){
      this.serviceShow = false
      this.ordertype=""
    },
    setPrice(item){
      return {
        type:'cosmetic',
        title:item.title,
        priceId:item.id,
        price:item.price,
        qty:1,
        // id:item.id, // 後續要拉掉
        
      }
    },
    selectService(item){
      this.submitData.params=[this.setPrice(item)]
      this.addList=[]
      this.totalEditList=[]
      this.currentService = item
      this.currentServiceCont = `服務項目：${item.title} | ${item.sizeTitle}`
      this.submitData.prepaidOrderUuid = ''
      this.submitDataPrepaid.prepaidId = ''
      this.serviceShow = false
      this.isPrepaidAndEdit = false
      this.scrollToBottom()
 
    },
    selectPrepaidService(){
      this.submitData.params=[this.setPrice(this.currentService)]
      this.addList=[]
      this.totalEditList=[]
      // this.currentService.price = this.filteredServices.find(item => item.id === this.currentService.id).price
      // this.currentService.title = this.currentService.name 
      this.currentServiceCont = `包月方案：${this.currentPrepaid.prepaidTitle}  |  服務項目：${this.currentService.title}`
      this.prepaidAllShow = false
      this.prepaidShow = false
      this.paymentWay = 'Prepaid'
      this.submitData.paymentMethod = 'Prepaid'
      this.isPrepaidAndEdit = false
      this.scrollToBottom()
    },
    selectBuyingPrepaidService(){
      this.submitData.params=[this.setPrice(this.currentService)]
      this.addList=[]
      this.totalEditList=[]
      // this.currentService.price = this.filteredServices.find(item => item.id === this.currentService.id).price
      this.currentServiceCont = `包月方案：${this.currentBuyPrepaid.title}  |  服務項目：${this.currentService.title}`
      this.prepaidAllShow = false
      this.prepaidShow = false
      this.isPrepaidAndEdit = false
      this.scrollToBottom()
    },
    goToPrepaid(item){
      this.isBuyPrepaid = false
      this.submitData.prepaidOrderUuid = item.id
      this.currentPrepaid = {...item}
      this.prepaidAllShow = true
      this.currentBuyPrepaid = {}
      this.submitData.params = [paramsItem()]
      this.submitDataPrepaid.prepaidId = ''
      this.currentService = null
      this.currentServiceCont = ''
      
    },
    selectBuyingPrepaid(item){
      this.submitDataPrepaid.prepaidId = item.id
      this.currentBuyPrepaid = item
      this.currentService = null
    },
    closePrepaidAll(){
      this.prepaidAllShow = false
    },
    closePrepaid(){
      this.prepaidShow = false
      this.ordertype=""
    },
    goToBuyPrepaid(){
      if(this.filteredServices.length===0){
        this.$confirm('目前選擇的寵物與不在服務人員的排班範圍之內', '提醒', {
          confirmButtonText: '確定',
          showCancelButton: false,
          type: 'warning',
          center: true,
        })
        return

      }
      this.isBuyPrepaid = true
      this.submitData.prepaidOrderUuid = ''
      this.prepaidAllShow = true
      this.currentPrepaid = {}
      this.submitData.params = [paramsItem()]
      this.currentService = null
      this.currentServiceCont = ''
      if(this.filterPrepaidList.length>0){
        this.selectBuyingPrepaid(this.filterPrepaidList[0])
      }
      this.clearPayment()
      

    },
    // 做任何服務以及包月的改動，都必須要把paymentWay和submitData裡面的paymentMethod清空
    clearPayment(){
      this.paymentWay = 'offline'
      this.submitData.paymentMethod = 'Cash'
    },
    async tryToFetchPrepaid() {
      const { items } = await this.$store.dispatch('prepaid/fetchListAll', 
        { 
        //  state: 1,
         bookingDateTime:`${formatDate(this.scheduleDetail.date,'date-dash')} ${formatDate(this.scheduleDetail.date,'time')}`,
         // 編輯訂單要改
        //  groupByGroupOrdering:true,
        //  limit:100,
         sizeId:this.petSizeId,
         paginate:0
        }
      )
      this.prepaidList = items
    },
  }
}