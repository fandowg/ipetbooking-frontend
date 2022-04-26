<script>
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'
import cloneDeep from 'lodash/cloneDeep'

export default {
  page: {
    title: '編輯包月方案',
    meta: [{ name: 'description', content: 'Edit Prepaid' }],
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
    prices: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeTab: '1',
      tabList: Object.freeze([
        {
          title: '基本資訊',
          component: () => import('./components/Step1Basic'),
        },
        {
          title: '限制設定',
          component: () => import('./components/Step2Limit'),
        },
        {
          title: '適用設定',
          component: () => import('./components/Step3Available'),
        },
        {
          title: '價格設定',
          component: () => import('./components/Step4Prices'),
        },
      ]),
      submitData: cloneDeep(this.defaultValue),
      tryingToSave: false,
      tryingToRemove: false,
    }
  },
  computed: {
    pagination() {
      return this.$route.params.pagination
    },
    filterData(){
      return this.$route.params.filterData
    }
  },
  created() {
    // console.log(this.$route.params.pagination)
  },
  methods: {
    async onClickSave(type) {
      this.tryingToSave = true
      try {
        if (
          this.submitData.prices.some((item) => {
            return item.productIds.length === 0
          })
        ) {
          await this.$confirm('還有適用項目沒選擇適用店家', '提示', {
            confirmButtonText: '確定',
            showCancelButton: false,
            type: 'warning',
            center: true,
          })
          this.tryingNextStep = false
          return
        }
        // if(this.submitData.prices[0].productIds.length===0){
        //       await this.$confirm('請至少選擇一個服務項目，並設定適用店家', '提示', {
        //           confirmButtonText: '確定',
        //           showCancelButton: false,
        //           type: 'warning',
        //           center: true,
        //         })
        //         this.tryingNextStep = false
        //         return
        //     }
        // if (this.$refs.step2[0].submitData.prices.length === 0) {
        //  await this.$confirm('請至少選擇一個適用項目', '提示', {
        //     confirmButtonText: '確定',
        //     showCancelButton: false,
        //     type: 'warning',
        //     center: true,
        //   })
        //   this.tryingToSave = false
        //   return
        // }
        // 檢查包月方案適用項目總數必須大於方案總抵用次數
        // let allPricesMaxTimes = 0
        // this.$refs.step2[0].submitData.prices.forEach(item => {
        //  allPricesMaxTimes = allPricesMaxTimes + item.maxTimes
        // });
        // // console.log(allPricesMaxTimes)
        // if (allPricesMaxTimes  < this.defaultValue.times) {
        //   await this.$confirm('適用項目總抵扣次數不得小於方案抵扣次數', '提示', {
        //     confirmButtonText: '確定',
        //     showCancelButton: false,
        //     type: 'warning',
        //     center: true,
        //   })
        //   this.tryingToSave = false
        //   return
        // }
        // const submitData = Object.assign({}, this.$refs.step1[0].submitData, this.$refs.step2[0].submitData)
        // console.log(this.$refs.step2[0].submitData)
        // 幫忙存限制
        await this.$refs.step1[0].validate()
        await this.$refs.step2[0].saveSingleUsageRule()
  
        this.submitData = {
          ...this.submitData,
          images: this.submitData.images.map((image, index) => {
            return {
              ...image,
              default: index === 0 ? 1 : 0,
            }
          }),
        }
        await this.$store.dispatch('prepaid/storeGroup', this.submitData)
        // await this.$store.dispatch('prepaid/store', submitData)
        messageStroe('edit')
        // this.tryingToSave = false
        // 回到進來的頁數
        if(type!=='image'){
          this.$router.push({ name: 'prepaid', params: { pagination: this.pagination,filterData:this.filterData } })
        }
        
      } catch (error) {
      } finally {
        this.tryingToSave = false
      }
    },
    async tryToRemove() {
      try {
        await messageBoxDelete('該包月方案')
        try {
          this.tryingToRemove = true
          // await this.$store.dispatch('prepaid/remove', { ids: [this.defaultValue.id] })
          await this.$store.dispatch('prepaid/removeGroup', { groupOrderings: [this.defaultValue.groupOrdering] })
          messageDelete()
          this.$router.push({ name: 'prepaid' })
        } finally {
          this.tryingToRemove = false
        }
      } catch {}
    },
    async beforeTabSwitch(activeName, oldActiveName) {
      // console.log(oldActiveName)
      if(oldActiveName==='2'){
        // console.log(333)
        await this.$refs.step2[0].saveSingleUsageRule()
      }
      if(oldActiveName==='1'){
        await this.$refs.step1[0].validate()
      //  await this.$refs.step2[0].validate()
      }
    
    }
  },
}
</script>
<template>
  <div :class="$style.page">
    <BasePageHeader title="編輯包月方案" />
    <el-tabs v-model="activeTab" type="border-card" stretch :before-leave="beforeTabSwitch">
      <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.title" :name="`${index + 1}`">
        <component :is="tab.component" :ref="`step${index + 1}`" :default-value.sync="submitData" :products="products" :category="category" :prices="prices" @update="onClickSave('image')" />

        <div :class="$style.footer">
          <el-button class="is-round" type="danger" :loading="tryingToRemove" :disabled="tryingToRemove" @click="tryToRemove">刪除</el-button>
          <el-button class="is-round" :loading="tryingToSave" @click="$router.push({ name: 'prepaid' })">取消</el-button>
          <el-button class="is-round" type="primary" :loading="tryingToSave" @click="onClickSave">儲存變更</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>
