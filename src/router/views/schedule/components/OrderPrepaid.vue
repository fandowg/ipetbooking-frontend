<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap ,paymentStatusMap } from '@utils/filter-value-to-text'
import { groupById } from '@utils/normalize-data'
import formatDate from '@utils/format-date'

export default {
  components: {
    OrderExtraField: () => lazyLoadComponent(import('@components/OrderExtraField')),
    // CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  filters: {
    genderFilter,
  },
  props: {
    scheduleDetail:{
      type: Object,
      default: () => {},
    },
    syncSubmitData: {
      type: Object,
      default: () => {},
    },
    syncSubmitDataPrepaid: {
      type: Object,
      default: () => {},
    },
    products: {
      type: Array,
      default: () => [],
    },
    memberInfo: {
      type: Object,
      default: () => {},
    },
    memberInfoShow: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
    availablePrepaidList: {
      type: Object,
      default: () => {},
    },

    isEditMode: {
      type: String,
      default: '',
    },
    submitRules: {
      type: Object,
      default: () => {},
    },
 
    selectedPetSizeId: {
      type: Number,
      default: 0,
    },
    prepaidPrice: {
      type: Number,
      default: null,
    },
    paramSizeTotal: {
      type: Number,
      default: 0,
    },
    paramPriceTotal: {
      type: Number,
      default: 0,
    },
    paramsWithNoQty: {
      type: Array,
      default: () => [],
    },
    isHomeService:{
      type: Boolean,
      default: false,
    }
    // noPaid: {
    //   type: Boolean,
    //   defalut: false,
    // },
  },
  data() {
    return {
      isBuyPrepaid: false,
      selectedBuyingPrepaid: {},
      selectedPrepaid: {},
      prepaidList: [],
      bankTypeList: [
        { id: 'BOT', title: '台灣銀行' },
        { id: 'Taishin', title: '台新' },
        { id: 'HNCB', title: '華南' },
      ],
      paymentStatusMap,
      enableSaveAddress:false,
      noPaid:false
    }
  },
  computed: {
    submitData:{
      get(){
        return this.syncSubmitData
      },
      set(value) {
        this.$emit('update:syncSubmitData', value)
      },
    },
    submitDataPrepaid:{
      get(){
        return this.syncSubmitDataPrepaid
      },
      set(value) {
        this.$emit('update:syncSubmitDataPrepaid', value)
      },
    },
    prepaidRules() {
      return {
        prepaidId: [
          {
            required: true,
            message: '請選擇包月方案',
            trigger: 'blur',
          },
        ],
        // status: [
        //   {
        //     required: true,
        //     message: '請選擇類別',
        //     trigger: 'change',
        //   },
        // ],
      }
    },
    availablePrepaidListFirst() {
      let available = []
      available = this.memberInfo.availablePrepaidOrders.map((prepaid) => {
        if (prepaid.status === 2 || !prepaid.checkUsageRules) {
          return { ...prepaid, available: false }
        } else if (
          this.products.some((product) => {
            return prepaid.productPriceIds.some((price) => {
              const priceIds = product.prices.map((item) => item.id)
              const priceSizeIds = product.prices.map((item) => item.sizeId)
              const hasPrepaidSizeId = prepaid.sizeIds.includes(this.selectedPetSizeId)
              const hasScheduleSizeId = priceSizeIds.includes(this.selectedPetSizeId)
              const hasBoth = hasPrepaidSizeId && hasScheduleSizeId
              return priceIds.includes(price) && hasBoth
            })
          })
        ) {
          return { ...prepaid, available: true }
        } else {
          return { ...prepaid, available: false }
        }
      })
      return groupById(available, 'prepaid') || {}
    },
    filterPrepaidList() {
      let available = []
      available = this.prepaidList.filter((prepaid) => {
        return this.products.some((product) => {
          return prepaid.prices.some((price) => {
            const priceIds = product.prices.map((item) => item.id)
            const priceSizeIds = product.prices.map((item) => item.sizeId)
            const hasPrepaidSizeId = prepaid.sizeIds.includes(this.selectedPetSizeId)
            const hasScheduleSizeId = priceSizeIds.includes(this.selectedPetSizeId)
            const hasBoth = hasPrepaidSizeId && hasScheduleSizeId
            return priceIds.includes(price.id) && hasBoth
          })
        })
      })
      return available
    },
    filteredServicesByPrepaid() {
      let services = []
      // services = this.memberInfo.availablePrepaidOrders.find(item => item.id === this.submitData.prepaidOrderUuid).prices
      // services = services.filter(item => {

      //  const hasPrice = this.products.some((product) => {
      //     const priceIds = product.prices.map((item) => item.id)
      //     return priceIds.includes(item.id)
      //   })
      //   return item.sizeId === this.selectedPetSizeId && hasPrice
      // })
      // console.log(this.selectedPrepaid.id)
      this.products.some((product) => product.id === this.submitData.productId && (services = product.prices))
      const checkedPrepaidPriceIds = this.availablePrepaidList[this.submitData.prepaidOrderUuid].productPriceIds
      // console.log(this.availablePrepaidList[this.submitData.prepaidOrderUuid].productPriceIds)
      services = services.filter((service) => {
        const hasSize = service.sizeId === this.selectedPetSizeId
        return checkedPrepaidPriceIds.includes(service.id) && hasSize
        // this.submitData.prepaidOrderUuid
      })
      const checkedPrepaidPrices = this.availablePrepaidList[this.submitData.prepaidOrderUuid].prices
      services = services.map((item) => {
        const times = {}
        checkedPrepaidPrices.forEach((price) => {
          if (price.id === item.id) {
            times.maxTimes = price.maxTimes
            times.used = price.used
          }
        })
        return { ...item, ...times }
      })
      return services
    },
    filteredServicesByBuyingPrepaid() {
      let services = []
      this.products.some((product) => product.id === this.submitData.productId && (services = product.prices))
      const checkedPrepaidPriceIds = this.filterPrepaidList.find((item) => item.id === this.submitDataPrepaid.prepaidId).prices.map((price) => price.id)
      // console.log(this.filterPrepaidList,checkedPrepaidPriceIds,services)
      services = services.filter((service) => {
        // console.log(service.sizeId,this.selectedPetSizeId)
        const hasSize = service.sizeId === this.selectedPetSizeId
        return checkedPrepaidPriceIds.includes(service.id) && hasSize
      })

      return services
    },
    filteredStatusMap() {
      // ! 已付款不能手動改成未付款
      const filteredStatus = Object.keys(orderStatusMap)
        .filter((status) => {
          switch (this.defaultValue.status) {
            case 1:
              return +status < 2
            case 2:
              //  虛擬帳戶不能手動改成已付款
              if (+status === 1 && this.defaultValue.paymentMethod === 'Vacc') return false
              return +status <= 2
            case 3:
              return +status === 0 || +status === 3
            case 4:
              return +status === 4
            case 5:
              return +status === 0 || +status === 5
            case 6:
              return +status === 6
            default:
              return false
          }
        })
        .reduce((obj, key) => {
          obj[key] = orderStatusMap[key]
          return obj
        }, {})
      return this.isEditMode ? filteredStatus : orderStatusMap
    }, //
    filteredStatusMapPrepaid() {
      // ! 已付款不能手動改成未付款
      const filteredStatus = Object.keys(orderStatusMap)
        .filter((status) => {
          switch (this.defaultValue.status) {
            case 1:
              return +status < 2
            case 2:
              //  虛擬帳戶不能手動改成已付款
              if (+status === 1 && this.defaultValue.paymentMethod === 'Vacc') return false
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

    cashflowSetting() {
      let store = {}
      store = this.products.find((item) => {
        return item.id === this.submitData.productId
      })
      return store.cashflowSetting
    }, //
    filterCities(){
      if(!this.submitData.productId){
        return []
      }
      const cities = this.products.find(item=>{
      return item.id === this.submitData.productId}).addressRestrictions
      return cities
    },
    districts() {
      if(!this.submitData.city){
        return []
      }
      const city = this.filterCities.find(item=>{
        return this.submitData.city === item.city
      })
      if(city){
        return city.district
      }else{
        return []
      }
    },
  },
  watch: {
    'submitData.prepaidOrderUuid'(value) {
      // this.submitData.params = []

      if (!value) {
        return
      }
     
        this.updateSelectedPrepaidFirst(value)
        if (this.selectedPrepaid.status === 2) {
          this.submitData.paymentStatus = 'UNPAID'
          this.noPaid = true
        } else if (this.selectedPrepaid.status === 1) {
          this.submitData.paymentStatus = 'PAID'
          this.noPaid = false
        }
        this.$emit('scrollDrawer')
        // this.scrollDrawer()
  
    },
    'submitDataPrepaid.prepaidId'(value) {
      if (value) {
        const select = this.filterPrepaidList.find((item) => {
          return item.id === value
        })
        // this.submitData.productId = select.productIds[0]
        // this.onChangeLocation()
        this.submitData.params = ''
        this.$emit('update:prepaidPrice', select.price)
        // console.log(this.prepaidPrice)
        // this.$nextTick(()=>{
        //   console.log(this.prepaidPrice)
        // })
        // this.show()
        // 所有prop去更新到父層的資料，都無法在同一個function馬上取用，必須使用nextTick，所以應該是在元件處理完所有事件，再去回傳一個最終值，不應該傳回去再拿來處理，若有這種情形，則那個date寫在元件裡比較好
        // this.prepaidPrice = select.price
        this.$emit('scrollDrawer')
        // this.scrollDrawer()
      }
    },
  },
  created() {
    this.tryToFetchPrepaid()
  },
  methods: {
    // show(){
    //   console.log(this.prepaidPrice)
    // },
    tryToBuyPrepaid() {
      this.isBuyPrepaid = true
      this.submitData.prepaidOrderUuid = ''
      this.submitData.paymentStatus = 'UNPAID'
    },
    cancelBuyPrepaid() {
      this.isBuyPrepaid = false
      this.submitDataPrepaid.prepaidId = ''
      this.submitDataPrepaid.status = 2
    },
    updateSelectedPrepaidFirst(prepaidUuid) {
      // console.log(prepaidUuid)
      if (prepaidUuid) {
        this.selectedPrepaid = this.availablePrepaidListFirst[prepaidUuid]

        //  const productId =this.availablePrepaidListFirst[value].productIds[0]

        // this.submitData.productId = this.selectedPrepaid.productIds[0]
        // this.onChangeLocation()
        this.submitData.params = ''
      }
    },
    updateSelectedBuyingPrepaid() {
      this.selectedBuyingPrepaid = this.filterPrepaidList.find((item) => {
        return item.id === this.submitDataPrepaid.prepaidId
      })
    },
    async tryToFetchPrepaid() {
      const { items } = await this.$store.dispatch('prepaid/fetchListAll', 
        { 
        //  state: 1,
         bookingDateTime:`${formatDate(this.scheduleDetail.date,'date-dash')} ${formatDate(this.scheduleDetail.date,'time')}`,
        //  limit:100,
         paginate:0
        }
      )
      this.prepaidList = items
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
    onChangeLocation() {
      
      // console.log('執行')
      let byOrder = []
      this.submitData.params = ''
      this.products.some((product) => product.id === this.submitData.productId && (byOrder = product.extrafields.byOrder))
      // console.log(byOrder)
      this.submitData.byOrderExtrafields = this.convertToObject(byOrder)
      this.getDefaultAddress()
      this.$emit('scrollDrawer')
      // this.scrollDrawer()
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
    }
   
  },
}
</script>
<template>
  <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
    <slot name="petSelect" />
    <template v-if="submitData.petId">
      <template v-if="!isBuyPrepaid">
        <template v-if="memberInfoShow">
          <el-form-item v-if="Object.keys(availablePrepaidListFirst).length > 0" prop="prepaidOrderUuid" label="請選擇包月方案">
            <!-- <el-select v-model="submitData.prepaidOrderUuid" @change="updateSelectedPrepaid">
                      <el-option v-for="(prepaid, prepaidUuid) in availablePrepaidListFirst" :key="prepaidUuid" :value="prepaidUuid" :label="prepaid.prepaidTitle">
                        {{ prepaid.prepaidTitle }}
                        <span class="select__option--meta">{{ `(尚餘${prepaid.times - prepaid.used}次)` }}</span>
                      </el-option>
                    </el-select> -->
            <el-radio-group v-model="submitData.prepaidOrderUuid" class="vertical-radio">
              <el-radio v-for="(prepaid, prepaidUuid) in availablePrepaidListFirst" :key="prepaidUuid" border :disabled="!prepaid.available" :label="prepaidUuid">
                {{ prepaid.prepaidTitle }}
                <span v-if="prepaid.status === 1" class="select__option--meta">{{ `(尚餘${prepaid.times - prepaid.used}次)` }}</span>
                <span v-else class="select__option--meta">{{ '未付款' }}</span>
                <span v-if="!prepaid.checkUsageRules" >{{ '(本時段不可用)' }}</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-else label="請選擇包月方案">
            <el-alert title="目前選擇的寵物與服務人員無適用之包月方案，請調整購買數量、建議顧客購買新的包月方案" type="warning" :closable="false"></el-alert>
          </el-form-item>
        </template>
        <div style="margin-top: -10px; margin-bottom: 20px">
          <el-button type="text" @click="tryToBuyPrepaid">
            <span>點此購買包月方案</span>
          </el-button>
        </div>
        <template v-if="submitData.prepaidOrderUuid">
          <el-form-item prop="productId" label="服務地點">
            <el-select v-model="submitData.productId" placeholder="請選擇服務地點" @change="onChangeLocation">
              <el-option v-for="(product, index) in products" :key="`product-${index}`" :value="product.id" :label="product.title"></el-option>
            </el-select>
          </el-form-item>

        <template v-if="isHomeService">
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
                <el-input v-model="submitData.address" placeholder="地址"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-checkbox v-model="enableSaveAddress"  style="margin-bottom:20px">儲存到客戶地址</el-checkbox>
        </template>
          <el-row :gutter="20">
            <el-col :span="24">
              <keep-alive>
                <el-form-item v-if="filteredServicesByPrepaid.length > 0 && submitData.productId" prop="params" label="服務項目">
                  <el-select v-if="filteredServicesByPrepaid.length > 0" ref="service" v-model="submitData.params" placeholder="請選擇服務項目">
                    <el-option v-for="(service, index) in filteredServicesByPrepaid" :key="`service-${index}`" :value="[service]" :label="`${service.title}・${service.introtext}`">
                      {{ service.title }}{{ service.introtext }}
                      <span class="select__option--meta">
                        {{ `(尚餘${service.maxTimes - service.used}次)` }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </keep-alive>
              <el-form-item v-if="filteredServicesByPrepaid.length === 0 && submitData.productId" label="請選擇服務項目">
                <el-alert title="目前選擇的分店沒有適用的服務項目" type="warning" :closable="false"></el-alert>
              </el-form-item>
            </el-col>
            <!-- <el-col v-if="submitData.params.length > 0 && submitData.params[0].price !== 0" :span="12">
              <el-form-item prop="status" label="訂單狀態">
                <el-select v-model="submitData.paymentStatus" placeholder="訂單狀態" :disabled="noPaid">
                  <el-option v-for="(status, statusValue) in paymentStatusMap" :key="statusValue" :value="statusValue" :label="status.text"></el-option>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="24">
              <template v-if="!isEditMode && submitData.params.length > 0 && submitData.params[0].price !== 0">
                <el-form-item label="付款方式">
                  <el-radio-group v-if="submitData.params.length > 0" v-model="submitData.paymentMethod" :class="$style['payment-methods']">
                    <el-radio label="Prepaid" border>抵扣包月方案</el-radio>
                  </el-radio-group>
                  <el-alert v-else :title="filteredServicesByPrepaid.length > 0 ? '請先選擇服務項目' : '請先選擇服務地點'" type="warning" :closable="false"></el-alert>
                </el-form-item>
              </template>

              <el-alert v-if="submitData.params.length > 0 && submitData.params[0].price === 0" style="margin-bottom: 20px" title="本服務項目免費" type="warning" :closable="false"></el-alert>
            </el-col>
          </el-row>
        </template>
      </template>
      <template v-if="isBuyPrepaid">
        <el-form ref="prepaidForm" :model="submitDataPrepaid" :rules="prepaidRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
          <el-form-item v-if="filterPrepaidList.length > 0" label="購買包月方案" prop="prepaidId">
            <el-select v-model="submitDataPrepaid.prepaidId" @change="updateSelectedBuyingPrepaid">
              <el-option v-for="item in filterPrepaidList" :key="item.id" :value="item.id" :label="item.title">
                {{ item.title }}
                <span class="select__option--meta">(可用{{ item.times }}次)</span>
              </el-option>
              <!-- <el-option :key="1" :value="1" :label="'小捲尾超值特惠組'">
                      小捲尾超值特惠組
                      <span class="select__option--meta">(尚餘10次)</span>
                    </el-option> -->
            </el-select>
          </el-form-item>

          <el-form-item v-else label="請選擇包月方案">
            <el-alert title="此人員此時段目前並沒有合適的包月方案" type="warning" :closable="false"></el-alert>
          </el-form-item>

          <el-alert v-if="prepaidPrice === 0 && submitDataPrepaid.prepaidId" style="margin-bottom: 20px" title="本包月方案免費" type="warning" :closable="false"></el-alert>

          <div style="margin-top: -10px; margin-bottom: 20px; text-align: right">
            <el-button type="text" @click="cancelBuyPrepaid">
              <span>取消購買</span>
            </el-button>
          </div>
           </el-form>
          <template v-if="submitDataPrepaid.prepaidId">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item prop="productId" label="服務地點">
                  <el-select v-model="submitData.productId" placeholder="請選擇服務地點" @change="onChangeLocation">
                    <el-option v-for="(product, index) in products" :key="`product-${index}`" :value="product.id" :label="product.title"></el-option>
                  </el-select>
                </el-form-item>
                <template v-if="isHomeService">
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
                        <el-input v-model="submitData.address" placeholder="地址"/>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-checkbox v-model="enableSaveAddress"  style="margin-bottom:20px">儲存到客戶地址</el-checkbox>
                </template>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="filteredServicesByBuyingPrepaid.length > 0 && submitData.productId" prop="params" label="服務項目">
                  <el-select ref="service" v-model="submitData.params" placeholder="請選擇服務項目">
                    <el-option v-for="(service, index) in filteredServicesByBuyingPrepaid" :key="`service-${index}`" :value="[service]" :label="`${service.title}・${service.introtext}`"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="filteredServicesByBuyingPrepaid.length === 0 && submitData.productId" label="請選擇服務項目">
                  <el-alert title="目前選擇的分店沒有適用的服務項目" type="warning" :closable="false"></el-alert>
                </el-form-item>
              </el-col>
              <el-col v-if="prepaidPrice !== 0" :span="12">
                <el-form-item v-if="submitData.params.length > 0" prop="status">
                  <label slot="label" for=""
                    >訂單狀態 <el-tooltip content="此為購買包月方案的訂單狀態" placement="top"> <BaseIcon name="info-circle" /> </el-tooltip
                  ></label>

                  <el-select v-model="submitDataPrepaid.status" placeholder="訂單狀態">
                    <el-option v-for="(status, statusValue) in filteredStatusMapPrepaid" :key="statusValue" :value="+statusValue" :label="status.text"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <template v-if="prepaidPrice !== 0">
              <el-form-item v-if="submitData.params.length > 0" :class="$style['payment-methods']" label="付款方式">
                <el-radio-group v-model="submitDataPrepaid.paymentMethod">
                  <el-radio v-if="submitDataPrepaid.status === 2" label border>不指定</el-radio>
                  <el-radio label="Cash" border>到店付款(現金)</el-radio>
                  <el-radio label="StoreCredit" border>現場刷卡</el-radio>
                  <el-radio label="Atm" border>線下匯款</el-radio>
                  <el-radio v-if="submitDataPrepaid.status === 2 && cashflowSetting === 1" label="Credit" border>信用卡付款</el-radio>
                  <el-radio v-if="submitDataPrepaid.status === 2 && cashflowSetting !== 0" label="Vacc" border>ATM虛擬帳戶</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="submitDataPrepaid.paymentMethod === 'Vacc'" prop="bankType" label="轉帳銀行">
                <el-select v-model="submitDataPrepaid.bankType">
                  <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </template>
       
      </template>

      <template v-if="submitData.prepaidOrderUuid || submitDataPrepaid.prepaidId">
        <el-form-item v-if="paramsWithNoQty.length > 0" :class="$style['params-list']">
          <template v-if="(submitData.paymentMethod === 'Prepaid' && Object.keys(availablePrepaidListFirst).length > 0) || filterPrepaidList.length > 0">
            <div :class="$style['params-list__item']">
              <div>訂購項目</div>
              <div>數量</div>
            </div>
            <div v-for="param in paramsWithNoQty" :key="param.id" :class="$style['params-list__item']">
              <div>{{ param.title }}</div>
              <div>{{ `x${param.qty || 1}` }}</div>
            </div>
            <div :class="$style.total">
              <template v-if="!submitDataPrepaid.prepaidId">
                <div v-if="selectedPrepaid" :class="$style['total__item']">
                  <div>使用方案</div>
                  <div>{{ selectedPrepaid.prepaidTitle }}</div>
                </div>
                <div :class="$style['total__item']">
                  <div>使用次數</div>
                  <div>{{ paramSizeTotal }}</div>
                </div>
              </template>
              <template v-else>
                <div :class="$style['total__item']">
                  <div>購買方案</div>
                  <div>{{ selectedBuyingPrepaid.title }}</div>
                </div>
                <div :class="$style['total__item']">
                  <div>價格</div>
                  <div>{{ selectedBuyingPrepaid.price }}</div>
                </div>
              </template>
            </div>
          </template>

          <!-- <template v-else>
            <div :class="$style['params-list__item']">
              <div>訂購項目</div>
              <div>售價</div>
              <div>數量</div>
              <div>小計</div>
            </div>
            <div v-for="param in paramsWithNoQty" :key="param.id" :class="$style['params-list__item']">
              <div>{{ param.title }}</div>
              <div>{{ param.price }}</div>
              <div>{{ `x${param.qty || 1}` }}</div>
              <div>{{ param.price * 1 }}</div>
            </div>
            <div :class="$style.total">
              <div :class="$style['total__item']">
                <div>小計</div>
                <div>{{ paramPriceTotal }}</div>
              </div>
            </div>

            <div :class="$style.total">
              <div :class="$style['total__item']">
                <div>付款金額</div>
                <div>{{ submitPriceTotal }}</div>
              </div>
            </div>
          </template> -->
        </el-form-item>

        <template v-if="submitData.params.length > 0">
          <OrderExtraField ref="extrafield" :default-value="{ byOrderExtrafields: submitData.byOrderExtrafields, customerInfos: [] }" />

          <el-form-item prop="note" label="使用人備註">
            <small style="display: block; opacity: 0.5; line-height: 1.3; margin-bottom: 10px">客戶可瀏覽此備註。若是不需要提供客戶瀏覽的資訊，請使用「內部備註」功能</small>
            <el-input v-model="submitData.note" type="textarea" :rows="2" placeholder="其他備註"></el-input>
          </el-form-item>

          <el-form-item prop="allowExpired">
            <el-checkbox v-model="submitData.allowExpired" :false-label="0" :true-label="1">可逾期付款</el-checkbox>
          </el-form-item>
        </template>
      </template>
    </template>
  </el-form>
</template>

<style lang="scss" module>
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
    .vacc-disabled::after {
      content: '(服務前一日不提供)';
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%);
      color: #c2c6ce;
    }
  }
}
</style>