<script>
import cloneDeep from 'lodash/cloneDeep'
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import { messageStroe, messageDelete } from '@utils/message'

export default {
  page: {
    title: '編輯項目',
    meta: [{ name: 'description', content: 'Edit Product' }],
  },
  components: {
    Layout,
  },
  props: {
    defaultValue: {
      type: Object,
      required: true,
    },
    productType: {
      type: String,
      default: 'activity',
    },
  },
  data() {
    return {
      tryingToSave: false,
      saveButtonVisible: true,
      activeTab: '基本資訊',
      tabList: [
        {
          title: '基本資訊',
          component: () => lazyLoadComponent(import('./components/Step1Basic')),
          showFooter: true,
        },
        {
          title: '營業時間',
          component: () =>
            lazyLoadComponent(import('./components/Step6ServiceTime')),
          showFooter: true,
        },
        {
          title: '自訂題目',
          component: () =>
            lazyLoadComponent(import('./components/Step4ExtraField')),
          showFooter: true,
        },
      ],
      componentData: this.defaultValue,
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
      this.saveButtonVisible = valid
    },
    handleStorePrice(storeData) {
      const formatTime = (date) => {
        return date.match(/(\d+):(\d+):(00)$/g) ? date.replace(/:(00)$/g,'') : date
      }
      storeData.forEach((data) => {
        if (data.saleStartDate)
          data.saleStartDate = formatTime(data.saleStartDate)
        if (data.saleEndDate)
          data.saleEndDate = formatTime(data.saleEndDate)
      })
      return this.$store.dispatch('product/storePrices', {
        productId: this.productId,
        storeData,
      })
    },
    async handleStoreProduct(submitData) {
      const ordAddress = this.defaultValue.location
      const newAddress = this.$refs.step1[0].submitData.location
      const isSame = `${ordAddress.city}${ordAddress.district}${ordAddress.address}` === `${newAddress.city}${newAddress.district}${newAddress.address}`
      if(!isSame){
        await this.geocode(submitData)
        submitData.lat=this.map[0]
        submitData.lng=this.map[1]
      }
      submitData.type=this.productType
      return this.$store.dispatch('product/store', submitData)
    },
    handleStoreExtraField(submitData) {
      const extraFields = [...submitData.byOrder, ...submitData.bySize]
      const storeData = {
        productId: this.productId,
      }
      if (extraFields.length > 0) storeData.extraFields = extraFields
      return this.$store.dispatch('product/updateExtraField', storeData)
    },
    getProductInfo() {
      this.$store
        .dispatch('product/fetchSingle', this.productId)
        .then((product) => {
          this.componentData = cloneDeep(product)
          // this.$route.params.product = cloneDeep(product)
        })
    },
    async handleSaveSuccess() {
      await this.$alert('儲存成功', '太棒了！', {
        confirmButtonText: '確認',
        type: 'success',
        center: true,
      })
      this.tryingToSave = false
    },
    async onClickSave(mode) {
      this.tryingToSave = true
      const step1Ref = this.$refs.step1[0]
      // let formData = step1Ref.submitData
      const step2Ref = this.$refs.step2[0]
      const timeData = step2Ref.serviceTimeSetting
      for(let i in timeData){
        timeData[i].start = timeData[i].timeRange[0]
        timeData[i].end = timeData[i].timeRange[1]
      }
      try {
        switch (this.activeTab) {
          case '基本資訊':
            // await step1Ref.geocode()
            await step1Ref.validate()
            // console.log(formData)
            await this.handleStoreProduct({...step1Ref.formatSubmitData,serviceTimeSetting:timeData})
            messageStroe('edit')
            this.tryingToSave = false
            // this.handleSaveSuccess()
            break
          case '營業時間':
            // console.log(this.$refs.step2[0].serviceTimeSetting)
            
            await step2Ref.validate()
            
            // console.log(formData,timeData)
            
            // console.log(timeData)
            await this.handleStoreProduct({...step1Ref.formatSubmitData,serviceTimeSetting:timeData})
            messageStroe('edit')
            this.tryingToSave = false
            // this.handleSaveSuccess()
            break
          // case '購買方案':
          //   const { params } = this.$refs.step3[0]
          //   await this.handleStorePrice(params)
          //   this.handleSaveSuccess()
          //   break
          case '自訂題目':
            const list = this.$refs.step3[0].list
            await this.handleStoreExtraField(list)
            await this.handleStoreProduct({...step1Ref.formatSubmitData,serviceTimeSetting:timeData})
            await this.getProductInfo()
            messageStroe('edit')
            this.tryingToSave = false
            // this.handleSaveSuccess()
            break
        }
        if(mode==='leave'){
          this.$router.push({ name: 'products' })
        }
      } catch (error) {
        this.tryingToSave = false
      }
    },
    onClickLeave() {
      this.$router.push({ name: 'products' })
      // this.$confirm(
      //   this.$t('PRODUCT.LEAVE_EDIT_CONFIRM_MESSAGE', {
      //     name: this.$t(`PRODUCT.${this.productType}.NAME`),
      //   }),
      //   '您將離開此頁面',
      //   {
      //     confirmButtonText: '確定',
      //     cancelButtonText: '取消',
      //     type: 'warning',
      //     center: true,
      //     showClose: false,
      //   }
      // ).then(() => {
      //   this.$router.push({ name: 'products' })
      // })
    },
    async beforeTabSwitch(activeName, oldActiveName) {
      if(oldActiveName==='基本資訊'){
       await this.$refs.step1[0].validate()
      }
      if(oldActiveName==='營業時間'){
       await this.$refs.step2[0].validate()
      }
    
      // if(['基本資訊', '營業時間', '自訂題目'].includes(oldActiveName)){
      //   await this.$confirm(
      //     '即將離開此頁籤，請確認您所做的修改是否已儲存',
      //     '提醒',
      //     {
      //       confirmButtonText: '確定',
      //       cancelButtonText: '取消',
      //       type: 'warning',
      //       center: true,
      //     }
      //   )
      // }
    },
     initGeocoder() {
      this.geocoder = new google.maps.Geocoder();
    },
    async geocode(submitData) {
      // console.log(123)
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
        $t('GLOBAL.HEADER_EDIT_PREFIX', {
          name: $t(`PRODUCT.${productType}.NAME`),
          item: defaultValue.name,
        })
      "
    ></BasePageHeader> -->
    <el-tabs v-model="activeTab" type="border-card" :before-leave="beforeTabSwitch" stretch>
      <el-tab-pane
        v-for="(tab, index) in tabList"
        :key="index"
        :label="tab.title"
        :name="tab.title"
      >
        <keep-alive>
          <component
            :is="tab.component"
            :ref="`step${index + 1}`"
            :class="$style['card-wrapper']"
            :item-type="productType"
            :default-value="componentData"
            @validate="handleFormValidate"
          ></component>
        </keep-alive>

        <div v-show="tab.showFooter" :class="$style.footer">
          <el-button class="is-round" @click="onClickLeave">取消</el-button>
          <el-button
            v-show="saveButtonVisible"
            class="is-round"
            
            :loading="tryingToSave"
            @click="onClickSave('leave')"
            >儲存並返回列表</el-button
          >
          <el-button
            v-show="saveButtonVisible"
            class="is-round"
            type="primary"
            :loading="tryingToSave"
            @click="onClickSave"
            >儲存變更</el-button
          >
        </div>
      </el-tab-pane>
    </el-tabs>
  </Layout>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>
