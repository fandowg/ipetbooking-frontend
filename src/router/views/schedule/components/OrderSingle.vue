<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap , paymentStatusMap, taiwanCitys, districtsFilter } from '@utils/filter-value-to-text'
import { groupById } from '@utils/normalize-data'

export default {
  components: {
    OrderExtraField: () => lazyLoadComponent(import('@components/OrderExtraField')),
    // CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  filters: {
    genderFilter,
  },
  props: {
    syncSubmitData: {
      type: Object,
      default: () => {},
    },
    products:{
      type: Array,
      default: () => []
    },
    memberInfoShow: {
      type: Boolean,
      default: false,
    },
    memberInfo: {
      type: Object,
      default: () => {},
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
    availablePrepaidList: {
      type: Object,
      default: () => {},
    },
    selectedPrepaid: {
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
    couponInfo: {
      type: Object,
      default: () => {},
    },
    selectedPetSizeId: {
      type: Number,
      default:0

    },
    paramSizeTotal: {
      type: Number,
      default:0
    },
    paramPriceTotal: {
      type: Number,
      default:0
    },
    paramsWithNoQty: {
      type: Array,
      default: () => []
    },
    submitPriceTotal: {
      type: Number,
      default:0
    },
    isHomeService:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      // couponInfo: '',
      // selectedPrepaid: '',
      taiwanCitys,
      bankTypeList: [
        { id: 'BOT', title: '台灣銀行' },
        { id: 'Taishin', title: '台新' },
        { id: 'HNCB', title: '華南' },
      ],
      paymentStatusMap,
      enableSaveAddress:false
      // previousCouponCode: '',
      // noPaid: false,
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
    hasCouponInfo(){
      // let hasCouponInfo =false
      // Object.keys(couponInfo).length === 0
      return Object.keys(this.couponInfo).length !== 0
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

    filteredServices() {
      let services = []
      this.products.some((product) => product.id === this.submitData.productId && (services = product.prices))
      services = services.filter((item) => {
        return item.sizeId === this.selectedPetSizeId
      })
      // console.log(services,this.selectedPetSizeId)
      return services
    }, //
 
    cashflowSetting() {
      let store = {}
      store = this.products.find((item) => {
        return item.id === this.submitData.productId
      })
      return store.cashflowSetting
    }, //
    hasPrepaid(){
      return Object.keys(this.availablePrepaidList).length > 0
    },
    filterCities(){
      if(!this.submitData.productId){
        return []
      }
    const cities = this.products.find(item=>{
       return item.id === this.submitData.productId
     }).addressRestrictions
     return cities
    },
    districts() {
      if(!this.submitData.city){
        return []
      }
      const city = this.filterCities.find(item=>{
        return this.submitData.city === item.city
      })
      // console.log(city) 
      if(city){
        return city.district
      }else{
        return []
      }
    },
  },
  watch: {

  },
  created() {
    if(this.hasPrepaid){
      this.submitData.paymentMethod="Prepaid"
    }
    // this.getDefaultAddress()

  },
  methods: {
 
    validCoupon() {
      this.$emit('validCoupon')
      // this.$refs.form.validateField('couponCode')
    },
    resetCoupon() {
      this.$emit('resetCoupon')
      // this.couponInfo = ''
      // this.submitData.couponCode = ''
      // this.previousCouponCode = ''
      this.$refs.couponCode.resetField('couponCode')
    },
    updateSelectedPrepaid(prepaidUuid) {
      this.$emit('updateSelectedPrepaid', prepaidUuid)
      // this.selectedPrepaid = this.availablePrepaidList[prepaidUuid]
      //  const productId =this.availablePrepaidListFirst[value].productIds[0]
      //  if (this.orderMode === 'prepaid') {
      //     this.submitData.productId=this.selectedPrepaid.productIds[0]
      //     this.submitData.params=''
      //  }
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
    onStatusChange(value) {
      if (!this.isEditMode && value === 'PAID' && this.hasPrepaid) {
        this.submitData.paymentMethod = 'Prepaid'
      } else if(!this.isEditMode && value === 'PAID'){
        this.submitData.paymentMethod = 'Cash'
      }
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
    onChangeService() {
      this.submitData.prepaidOrderUuid = ''
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
  <template >
    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
      <slot name="petSelect" />
      <template v-if="submitData.petId">
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

        <!-- <el-form-item v-show="isHomeService" prop="address" label="服務地址">
          <el-input v-model="submitData.address" placeholder="請輸入服務地址"></el-input>
        </el-form-item> -->

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item v-if="filteredServices.length > 0 && submitData.productId" prop="params" label="服務項目">
              <el-select ref="service" v-model="submitData.params" placeholder="請選擇服務項目" @change="onChangeService">
                <el-option v-for="(service, index) in filteredServices" :key="`service-${index}`" :value="[service]" :label="`${service.title}・${service.introtext}`"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="filteredServices.length === 0 && submitData.productId" label="請選擇服務項目">
              <el-alert title="目前選擇的分店沒有適用的服務項目" type="warning" :closable="false"></el-alert>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="submitData.params.length > 0 && submitData.params[0].price !== 0" prop="status" label="訂單狀態">
              <el-select v-model="submitData.paymentStatus" placeholder="訂單狀態" @change="onStatusChange">
             
                <el-option v-for="(status, statusValue) in paymentStatusMap" :key="statusValue" :value="statusValue" :label="status.text"></el-option>
                <!-- <template v-for="(status, statusValue) in filteredStatusMap">
                  <el-option v-if="isEditMode" :key="statusValue" :value="+statusValue" :label="status.text"></el-option>
               
                  <el-option v-else-if="[1, 2].includes(+statusValue)" :key="statusValue" :value="+statusValue" :label="status.text"></el-option>
                </template> -->
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item v-if="!isEditMode && submitPriceTotal > 0" label="購買方案">
                    <div v-for="(param, paramIndex) in productParams" :key="param.id" :class="$style['params-options']">
                      <div>
                        {{ param.title }}
                        <small>{{ param.size }} 枚憑證</small>
                      </div>
                      <div>${{ param.price }}</div>

                      <el-input-number v-if="param.state" v-model.number="submitData.params[paramIndex].qty" :min="0" :max="1"></el-input-number>
                      <div v-else>此方案未開放</div>
                    </div>
                  </el-form-item> -->
        <template v-if="!isEditMode && submitData.params.length > 0 && submitData.params[0].price !== 0">
          <el-form-item label="付款方式">
            <el-radio-group v-if="submitData.params.length > 0" v-model="submitData.paymentMethod" :class="$style['payment-methods']">
              <el-radio v-if="memberInfoShow" label="Prepaid" border>抵扣包月方案</el-radio>
              <el-radio v-if="submitData.paymentStatus === 'UNPAID'" label border>不指定</el-radio>
              <el-radio label="Cash" border>到店付款(現金)</el-radio>
              <el-radio label="StoreCredit" border>現場刷卡</el-radio>
              <el-radio label="Atm" border>線下匯款</el-radio>
              <el-radio v-if="submitData.paymentStatus === 'UNPAID' && cashflowSetting === 1" label="Credit" border>信用卡付款</el-radio>
              <el-radio v-if="submitData.paymentStatus === 'UNPAID' && cashflowSetting !== 0" label="Vacc" border>ATM虛擬帳戶</el-radio>
              
              <!-- <el-radio label="Prepaid" border>抵扣包月方案</el-radio> -->
            </el-radio-group>
            <el-alert v-else :title="filteredServices.length > 0 ? '請先選擇服務項目' : '請先選擇服務地點'" type="warning" :closable="false"></el-alert>
          </el-form-item>
          <el-form-item v-if="submitData.paymentMethod === 'Vacc'" prop="bankType" label="轉帳銀行">
            <el-select v-model="submitData.bankType">
              <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
            </el-select>
          </el-form-item>

          <template v-if="memberInfoShow && submitPriceTotal > 0 && submitData.paymentMethod === 'Prepaid'">
            <el-form-item v-if="Object.keys(availablePrepaidList).length > 0" prop="prepaidOrderUuid" label="請選擇包月方案">
              <el-select v-model="submitData.prepaidOrderUuid" @change="updateSelectedPrepaid">
                <el-option v-for="(prepaid, prepaidUuid) in availablePrepaidList" :key="prepaidUuid" :value="prepaidUuid" :label="prepaid.prepaidTitle" :disabled="prepaid.status !== 1">
                  {{ prepaid.prepaidTitle }}
                  <span v-if="prepaid.status === 1" class="select__option--meta">{{ `(尚餘${prepaid.times - prepaid.used}次)` }}</span>
                  <span v-else class="select__option--meta">未付款</span>
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
        <el-alert v-if="submitData.params.length > 0 && submitData.params[0].price === 0" style="margin-bottom: 20px" title="本服務項目免費" type="warning" :closable="false"></el-alert>

        <el-form-item v-if="paramsWithNoQty.length > 0" :class="$style['params-list']">
          <template v-if="submitData.paymentMethod === 'Prepaid' && Object.keys(availablePrepaidList).length > 0">
            <div :class="$style['params-list__item']">
              <div>訂購項目</div>
              <div>數量</div>
            </div>
            <div v-for="param in paramsWithNoQty" :key="param.id" :class="$style['params-list__item']">
              <div>{{ param.title }}</div>
              <div>{{ `x${param.qty || 1}` }}</div>
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
              <div>{{ `x${param.qty || 1}` }}</div>
              <div>{{ param.price * 1 }}</div>
            </div>
            <div :class="$style.total">
              <div :class="$style['total__item']">
                <div>小計</div>
                <div>{{ paramPriceTotal }}</div>
              </div>
              <div v-if="hasCouponInfo" :class="[$style['total__item'], $style['total__item--discount']]">
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

        <!-- 付款方式從抵扣換去其他的方式，couponCode 會從 el-form 裡面消失 -->
        <keep-alive>
          <el-form-item v-if="!isEditMode && paramPriceTotal > 0 && submitData.paymentMethod !== 'Prepaid'" ref="couponCode" prop="couponCode" label="優惠券">
            <el-input v-model="submitData.couponCode" clearable :disabled="!!hasCouponInfo" placeholder="請輸入優惠券代碼">
              <el-button v-if="hasCouponInfo" slot="append" @click="resetCoupon">清除優惠券</el-button>
              <el-button v-else slot="append" @click="validCoupon">使用優惠券</el-button>
            </el-input>
          </el-form-item>
        </keep-alive>

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