<script>
import lazyLoadComponent from '@router/lazyload-component'
import Layout from '@layouts/main'
// import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'
// import { merchantComputed, authComputed } from '@state/helpers'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'
import { notification } from '@utils/notification'

const initData = () => {
  return {
    title: '',
    alias: '',
    // state: 1,
    // serviceTime: 90,
    // bufferTime: 30,
    introtext: '',
    description: '',
    content: '',
    notice: '',
    // groupOrdering:60,
    // basePrice: '0',
    // price: '0',
    // productId: '',
    images: [],
    // categoryIds: [],
    // categoryIds: 2,
  }
}

export default {
  page: {
    title: '服務項目',
    meta: [{ name: 'description', content: 'Prepaid List' }],
  },
  components: {
    Layout,
    BaseSteps: () => import('@components/BaseSteps'),
    // BaseInputFloatingLabel,
    // ImageUpload: () => lazyLoadComponent(import('../chat/components/FileUpload')),
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    const submitData = Object.assign({}, initData(), this.defaultValue, {
      description: this.defaultValue.description && this.defaultValue.description.replace(/<br\s\/>/g, ''),
      content: this.defaultValue.content && this.defaultValue.content.replace(/<br\s\/>/g, ''),
      notice: this.defaultValue.notice && this.defaultValue.notice.replace(/<br\s\/>/g, ''),
      // categoryIds: this.defaultValue.categoryIds ? this.defaultValue.categoryIds[0] : 2,
      // productId: this.defaultValue.productId ? this.defaultValue.productId : this.products[0].id,
    })
    return {
      cacheData:{},
      submitData,
      // canSetPrice: false,
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 8.64e7
      //   },
      // },
      // productId: '',
      tryingToStore: false,
      // tryingToRemove: false,
      parentCategoryId: null,
      parentCategoryIndex: 0,
      // noticeChecked: false,
      tabList: Object.freeze([
        {
          title: '基本資訊',
          name:'info',
          component: () => lazyLoadComponent(import('./components/TabInfo')),
        },
        {
          title: '價格設定',
          name:'price',
          component: () => lazyLoadComponent(import('./components/TabPrice')),
          // component: () => lazyLoadComponent(import('./TabPrice')),
        },
        {
          title: '服務項目圖片',
          name:'image',
          component: () => lazyLoadComponent(import('./components/TabImage')),
          // component: () => lazyLoadComponent(import('./TabImage')),
        },
      ]),
      activeTab:'info',
      activeStep:1,
      tryingNextStep:false
    }
  },
  computed: {

    isEditMode() {
      return this.defaultValue.groupOrdering
    },
    isService(){
      return this.$route.params.type !== 'addition'
    }
    // formatSubmitData() {
    //   // const { images, categoryIds } = this.submitData
    //   const { images } = this.submitData
    //   return {
    //     ...this.submitData,
    //     images: images.map((image, index) => {
    //       return {
    //         ...image,
    //         default: index === 0 ? 1 : 0,
    //       }
    //     }),
    //     // categoryIds: [categoryIds],
    //   }
    // },
  },
  watch: {

  },
  created() {
    // console.log(this.isEditMode)
    if(this.isEditMode){
      this.findCategory()
    }
    if(!this.isService){
      if(this.isEditMode){
        this.$route.meta.title="編輯加購項目"
        // this.$store.commit('title/SET_TITLE', '編輯加購項目')
      }else{
        this.$route.meta.title="新增加購項目"
        // this.$store.commit('title/SET_TITLE', '新增加購項目')
      }
      
    }
    if(this.isService){
      if(this.isEditMode){
        this.$route.meta.title="編輯服務項目"
        // this.$store.commit('title/SET_TITLE', '編輯加購項目')
      }else{
        this.$route.meta.title="新增服務項目"
        // this.$store.commit('title/SET_TITLE', '新增加購項目')
      }
      
    }
     
    
  },
  mounted() {

   
  },
  methods: {
    setSubmitData(){
      // console.log(this.cacheData)
      const submitData = Object.assign({}, initData(), this.cacheData, {
        description: this.cacheData.description && this.cacheData.description.replace(/<br\s\/>/g, ''),
        content: this.cacheData.content && this.cacheData.content.replace(/<br\s\/>/g, ''),
        notice: this.cacheData.notice && this.cacheData.notice.replace(/<br\s\/>/g, ''),
        // categoryIds: this.defaultValue.categoryIds ? this.defaultValue.categoryIds[0] : 2,
        // productId: this.defaultValue.productId ? this.defaultValue.productId : this.products[0].id,
      })
      this.submitData = submitData
    },

    async tryToFetchSingle(){
      const url = this.isService?'product/fetchSingleServicePriceGroup':'product/fetchSingleAdditionalPriceGroup'
      this.cacheData = await this.$store.dispatch(`${url}`, this.submitData.groupOrdering) 
      this.setSubmitData()

    },
    async onClickNextStep(currentStep) {
      this.tryingNextStep = true
      try{
        if(this.activeStep === 1){
          await this.$refs[this.tabList[this.activeStep-1].name].validate()
        }
        if(this.activeStep === 2){
          const isPriceNone = this.$refs[this.tabList[this.activeStep-1].name].isPriceNone
          if(isPriceNone){
            await this.$confirm('尚有服務項目的價格為0，確定要繼續嗎？', '提示', {
              confirmButtonText: '確定',
              showCancelButton: true,
              type: 'warning',
              center: true,
            })
          }
            
        }
        // await this.$refs[this.activeTab].validate()  //驗證要改
        this.activeStep++
      } catch {

      } finally{
        this.tryingNextStep = false
      }
    },
    goBack(){
      this.activeStep--
    },
    async tryToStore(type) {
      try {
        if(this.isEditMode){
          if(this.activeTab === 'info'){
            await this.$refs[this.activeTab][0].validate()
          }
        }else{
          // await this.$refs[this.tabList[this.activeStep-1].name].validate() // 驗證要改
        }
        this.tryingToStore = true
        const url = this.isService?'product/storeServicePriceGroup':'product/storeAdditionalPriceGroup'
        await this.$store.dispatch(`${url}`, this.submitData)
        if (!this.isEditMode) {
          messageStroe('add')
          notification('一般服務','排班人員','staff')
          // this.$message({
          //   message: `創建成功！`,
          //   type: 'success',
          // })
        } else {
          messageStroe('edit')
        }
        if(type!=='price'){
          this.backToList()
        }else{
          if(this.isEditMode){
            this.tryToFetchSingle()
          }
        }
        // this.updateParent()
      } catch{

      } finally {
        this.tryingToStore = false
      }
    },

    // emitButtonEvent(event) {
    //   this.$emit(event)
    // },
  
    // updateParent() {
    //   this.emitButtonEvent('update')
    //   // this.emitButtonEvent('cancel')
    // },
    findCategory(){
      const id = this.defaultValue.prices[0].categoryId
      if(this.category.length>0){
        this.category.forEach(item =>{
          const ids = item.children.map(child =>child.id)
          if(ids.includes(id)){
            this.parentCategoryId = item.id
            // console.log(this.$refs.info[0])
            // this.$refs.info.parentCategoryId = item.id
            // return item.id
          }
        })
      }
      // const sizeIds = this.defaultValue.prices.map(item=>item.categoryId)
      // if(this.category.length>0){
      //   this.category.forEach(item =>{
      //     const categotyIds = item.children.map(child =>child.id)
      //     sizeIds.forEach(size=>{
      //       if(categotyIds.includes(size)){
      //         this.parentCategoryId = item.id
      //         // console.log(this.$refs.info[0])
      //         // this.$refs.info.parentCategoryId = item.id
      //         // return item.id
      //       }
      //     })
          
      //   })
      // }
      
    },

    getService(){

    },
    backToList(){
      this.$router.push({
        name:'service',
        params:{
          type:this.isService?'service':'addition'
        }
      })
    },
    async beforeTabSwitch(activeName, oldActiveName) {
      if(oldActiveName==='info'){
       await this.$refs[this.activeTab][0].validate()
      }
    },
  },
}
</script>

<template>
  <Layout>
    <div style="margin-bottom:60px">

      <template v-if="isEditMode">
        <el-page-header class="headNoAfter" title="返回列表" @back="backToList"></el-page-header>
        <!-- <el-button class="is-round" @click="backToList">返回</el-button> -->
        <!-- {{$refs.info[0]}} -->
        <el-tabs v-model="activeTab"  stretch :before-leave="beforeTabSwitch" type="border-card">
          <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.title" :name="tab.name">
            <component 
              :is="tab.component" 
              :ref="tab.name" 
              :default-value.sync="submitData" 
              :category-index.sync="parentCategoryIndex"
              :category-id.sync="parentCategoryId" 
              :products="products" 
              :category="category"
              @store="tryToStore"
              @update="tryToFetchSingle"
            />
          </el-tab-pane>
          
        </el-tabs>
        <div :class="$style.footer">
          <!-- <el-button v-if="isEditMode" class="is-round" type="danger" :loading="tryingToRemove" :disabled="tryingToRemove" @click="tryToRemove">刪除</el-button> -->
          <el-button class="is-round" @click="backToList">取消</el-button>
          <el-button
            class="is-round"
            type="primary"
            data-tour-step="5"
            data-tour-text="最後別忘記按下「完成」，完成此方案新增了唷！"
            :loading="tryingToStore"
            :disabled="tryingToStore"
            @click="tryToStore"
          >
            <BaseIcon v-if="!tryingToStore" name="check" />
            <span>{{ isEditMode ? '儲存' : '建立' }}</span>
          </el-button>
        </div>
      </template>



      <template v-else>
        <BaseSteps :active="activeStep" :list="tabList" />
        <el-card :class="$style['card-wrapper']">
          <keep-alive>
            <component 
              :is="tabList[activeStep - 1].component" 
              :ref="tabList[activeStep - 1].name" 
              :default-value.sync="submitData" 
              :category-index.sync="parentCategoryIndex"
              :category-id.sync="parentCategoryId" 
              :products="products" 
              :category="category"
              @store="tryToStore"
            />
          </keep-alive>
        <div :class="$style.footer">
          <!-- <el-button v-if="isEditMode" class="is-round" type="danger" :loading="tryingToRemove" :disabled="tryingToRemove" @click="tryToRemove">刪除</el-button> -->
          <el-button class="is-round" @click="backToList">取消</el-button>
          <el-button v-if="activeStep !== 1 " class="is-round"  @click="goBack">上一步</el-button>
          <el-button v-if="activeStep !== 3" class="is-round" data-tour-text="若欄位皆已填寫完成，點擊「下一步」儲存此步驟填寫的資料，前往下一步" type="primary" :loading="tryingNextStep" @click="onClickNextStep(activeStep)">
            {{`下一步`}}
          </el-button>
          <el-button
            v-if="activeStep === 3"
            class="is-round"
            type="primary"
            data-tour-step="5"
            data-tour-text="最後別忘記按下「完成」，完成此方案新增了唷！"
            :loading="tryingToStore"
            :disabled="tryingToStore"
            @click="tryToStore"
          >
            <BaseIcon v-if="!tryingToStore" name="check" />
            <span>{{ isEditMode ? '儲存' : '建立' }}</span>
          </el-button>
        </div>
        </el-card>

      </template>


      

    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_steps.scss';

</style>
