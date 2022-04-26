<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxLeave } from '@utils/message-box'
import { notification } from '@utils/notification'

export default {
  page: {
    title: '新增項目',
    meta: [{ name: 'description', content: 'Add Product' }],
  },
  components: {
    Layout,
    BaseSteps: () => lazyLoadComponent(import('@components/BaseSteps')),
    Step1: () => lazyLoadComponent(import('./components/Step1Basic')),
    Step2: () => lazyLoadComponent(import('./components/Step6ServiceTime')),
    Step3: () => lazyLoadComponent(import('./components/Step4ExtraField')),
  },
  props: {
    defaultStep: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      default: 'service',
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tryingNextStep: false,
      nextStepButtonVisible: false,
      activeStep: this.defaultStep,
      stepList: [
        {
          title: '基本資訊',
          description: '設定分店資訊',
        },
        {
          title: '營業時間',
          description: '設定營業時間',
        },
        // {
        //   title: '時段',
        //   description: '想要在什麼時間讓客戶參與活動呢？可以設定多重時段及重複週期喔！暫不編輯時段，請按離開，完成時段編輯，請按下一步。',
        // },
        // {
        //   title: '購買方案',
        //   description: '可以設定各式各樣的購買方案讓客戶選擇，請將購買方案所包含的項目或使用方式寫在內容中。暫不編輯購買方案，請按離開，完成購買方案編輯，請按下一步。',
        // },
        {
          title: '自訂問題',
          description: '想知道客戶是如何得知你們的嗎？或是需要統計餐點數量提前做準備嗎？可以自訂問題與客戶互動喔～完成或想略過額外欄位新增請按下一步。',
        },
        // {
        //   title: '設定上下架',
        //   description: '是否上架？',
        // },
      ],
      formDataAll:{},
      tryingUpdateState: false,
      geocoder:'',
      map:[],
      hasGeo: false,
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    },
  },
   mounted() {
    this.initGeocoder();
  },
  methods: {
    handleFormValidate(valid) {
      this.nextStepButtonVisible = valid
    },
    async onClickLeave() {
      try{
        await messageBoxLeave('分店')
        this.$router.push({ name: 'products' })
      }
      catch (error) {

      } finally {

      }
      // this.$confirm(
      //   this.$t('PRODUCT.LEAVE_ADD_CONFIRM_MESSAGE', {
      //     name: this.$t(`PRODUCT.${this.productType}.NAME`),
      //   }),
      //   '您將離開此頁面',
      //   {
      //     confirmButtonText: '確定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     center: true,
      //   }
      // ).then(() => {
      //   this.$router.push({ name: 'products' })
      // })


    },
    handleStorePrice(storeData) {
      return this.$store.dispatch('product/storePrices', {
        productId: this.productId,
        storeData,
      })
    },
    handleStoreInventory(submitData) {
      return this.$store.dispatch('inventory/storeGroups', {
        productId: this.productId,
        submitData,
      })
    },
   async handleStoreProduct(submitData) {
       await this.geocode(submitData)
      // console.log(this.map)
      submitData.lat=this.map[0]
      submitData.lng=this.map[1]
      const storeData = {
        ...submitData,
        type: this.productType,
        staffs: submitData.staffs.map((staff) => {
          return {
            id: staff.id,
            hostTitle: staff.hostTitle,
          }
        }),
      }
      return this.$store.dispatch('product/store', storeData)
    },
    handleStoreExtraField(submitData) {
      const extraFields = [...submitData.byOrder, ...submitData.bySize]
      const storeData = {
        productId: this.productId,
      }
      if (extraFields.length > 0) storeData.extraFields = extraFields
      return this.$store.dispatch('product/updateExtraField', storeData)
    },
    incrementActiveStep() {
      if (this.activeStep++ === this.stepList.length) this.activeStep = 1
      this.tryingNextStep = false
    },
    async onClickNextStep() {
      
      // const step1Ref = this.$refs.step1[0]
      // const formData = step1Ref.submitData
      // const step2Ref = this.$refs.step2[0]
      // const timeData = step2Ref.serviceTimeSetting
      try {
        switch (this.activeStep) {
          case 1:
            // const formData = this.$refs.step.submitData
            await this.$refs.step.validate()
            this.formDataAll = this.$refs.step.formatSubmitData
            this.activeStep++
       
            // const newProduct = await this.handleStoreProduct(formData)
           

            break
          case 2:
            // console.log(this.$refs.step2[0].serviceTimeSetting)
            
            await this.$refs.step.validate()
            this.tryingNextStep = true
            const timeData = this.$refs.step.serviceTimeSetting
            // console.log(formData,timeData)
            for(let i in timeData){
              timeData[i].start = timeData[i].timeRange[0]
              timeData[i].end = timeData[i].timeRange[1]
            }
            // console.log(timeData)
            const newProduct = await this.handleStoreProduct({...this.formDataAll,serviceTimeSetting:timeData})
            const routeTo = this.$router.resolve({
              params: { productId: newProduct.id },
            })
            this.$router.push(routeTo.location)
             this.activeStep=3
            this.tryingNextStep=false
            // this.incrementActiveStep()
           
            break
          case 3:
            const list = this.$refs.step.list
            this.tryingNextStep = true
            await this.handleStoreExtraField(list)
            this.tryingNextStep = false
            messageStroe('add')
            notification('分店資訊','分類設定','prices?tab=category')
             this.$router.push({ name: 'products' })
            // this.updateItemState()

            break
        }
      } catch (error) {
        this.tryingNextStep = false
      }
    },
    async updateItemState(state = 1) {
      this.tryingUpdateState = true
      try {
        await this.$store.dispatch('product/updateState', {
          ids: [this.productId],
          state,
        })
        this.$router.push({ name: 'products' })
        this.tryingUpdateState = false
      } catch (error) {
        this.tryingUpdateState = false
      }
    },
      initGeocoder() {
      this.geocoder = new google.maps.Geocoder();
    },
    async geocode(submitData) {

      // const address = this.restaurant.address;
    const callback = await this.geocoder.geocode(
        // GeocoderRequest 物件: 帶入要轉換的地址與相關設定
        {
     
          address:`${submitData.location.city}${submitData.location.district}${submitData.location.address}`,
          // 限制轉換的結果必須是在台灣的範圍
          componentRestrictions: {
            country: "TW"
          }
        }
  
      );
      const lat = callback.results[0].geometry.location.lat()
      const lng = callback.results[0].geometry.location.lng()
      this.map = [lat,lng]
      // console.log(callback)
    }
  },
}
</script>

<template>
  <Layout :class="$style.page">
    <!-- <BasePageHeader
      :title="
        $t('GLOBAL.HEADER_ADD_PREFIX', {
          name: $t(`PRODUCT.${productType}.NAME`),
        })
      "
    > -->
   <BaseSteps  :active="activeStep" :list="stepList" />
    <!-- :header="stepList[activeStep - 1].description" -->
    <el-card shadow="never" :class="$style['card-wrapper']">
      <keep-alive>
        <component :is="`step-${activeStep}`" ref="step" :item-type="productType" :default-value="formDataAll" @validate="handleFormValidate"></component>
      </keep-alive>
    </el-card>
    <div  :class="$style.footer">
      <el-button v-if="activeStep === 1" data-tour-text="若不想新增此活動，請按「離開」跳出。注意：我們將不會保留此步驟填寫的資料。" @click="onClickLeave">離開</el-button>
      <el-button  v-if="activeStep !== 1"  @click="activeStep--">上一步</el-button>
      <el-button
        v-if="activeStep !== 3 ? true : nextStepButtonVisible"
        data-tour-text="若欄位皆已填寫完成，點擊「下一步」儲存此步驟填寫的資料，前往下一步"
        type="primary"
        :loading="tryingNextStep"
        @click="onClickNextStep"
        >{{activeStep !== 3 ? '下一步' : '儲存'}}</el-button
      >
    </div>
     <!-- <div v-show="activeStep !== stepList.length" :class="$style.footer">
      <el-button data-tour-text="若不想新增此活動，請按「離開」跳出。注意：我們將不會保留此步驟填寫的資料。" @click="onClickLeave">離開</el-button>
      <el-button
        v-if="activeStep === 1 ? true : nextStepButtonVisible"
        data-tour-text="若欄位皆已填寫完成，點擊「下一步」儲存此步驟填寫的資料，前往下一步"
        type="primary"
        :loading="tryingNextStep"
        @click="onClickNextStep"
        >下一步</el-button
      >
    </div> -->
  </Layout>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>
