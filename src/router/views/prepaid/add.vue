<script>
import Layout from '@layouts/main'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxLeave } from '@utils/message-box'
const initData = () => {
  return {
    groupOrdering: 0,
    groupAlias:'',
    title: '',
    categoryId: '',
    times: 1,
    infinity: 0,
    inventory: 100,
    expireDays: 90,
    slogan: '',
    description: '',
    notice: '',
    images: [],
    usageRules: [],
    prices: [
      {
        maxTimes: 5,
        priceGroupOrdering: null,
        productIds: [],
      },
    ],
    prepaids: [
      {
        sizeId: null,
        basePrice: 0,
        price: 0,
        state: 0,
      },
    ],
  }
}

export default {
  page: {
    title: '新增包月方案',
    meta: [{ name: 'description', content: 'Add Prepaid' }],
  },
  components: {
    Layout,
    BaseSteps: () => import('@components/BaseSteps'),
    // Step1: () => import('./components/Step1Basic'),
    // Step2: () => import('./components/Step2Limit'),
    // Step3: () => import('./components/Step3Available'),
    // Step4: () => import('./components/Step4Prices'),
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
  },
  data() {
    return {
      activeStep: 1,
      stepList: Object.freeze([
        {
          title: '基本資訊',
          description: '請填寫下方欄位',
          component: () => import('./components/Step1Basic'),
        },
        {
          title: '限制設定',
          description: '請選取可抵扣的購買方案',
          component: () => import('./components/Step2Limit'),
        },
        {
          title: '適用設定',
          description: '請填寫下方欄位',
          component: () => import('./components/Step3Available'),
        },
        {
          title: '價格設定',
          description: '請選取可抵扣的購買方案',
          component: () => import('./components/Step4Prices'),
        },
      ]),
      tryingNextStep: false,
      nextStepButtonVisible: false,
      submitData: Object.assign({}, initData()),
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
    // console.log(this.$route.params.data)
    // if (this.$route.params.data.title) {
    //   this.step1Data = this.$route.params.data
    // }
  },
  methods: {
    async onClickNextStep(currentStep) {
      this.tryingNextStep = true
      try {
        // console.log(this.$refs.step.submitData.times)
        // await this.$refs.step.validate()
        switch (currentStep) {
          case 1:
            // this.step1Data = this.$refs.step.submitData
            await this.$refs.step.validate()
            this.activeStep++
            // console.log('換頁')
            this.tryingNextStep = false
            break
          case 2:
            await this.$refs.step.validate()
            // this.step1Data = this.$refs.step.submitData
            this.activeStep++
            // console.log('換頁')
            this.tryingNextStep = false
            break
          case 3:
            // this.step1Data = this.$refs.step.submitData

            if (this.submitData.prices[0].productIds.length === 0) {
              await this.$confirm('請至少選擇一個服務項目，並設定適用店家', '提示', {
                confirmButtonText: '確定',
                showCancelButton: false,
                type: 'warning',
                center: true,
              })
              this.tryingNextStep = false
              return
            } else{
              if (this.submitData.prices.some(item =>{
                  return item.productIds.length === 0
                })) {
              await this.$confirm('有適用項目尚無選擇適用店家', '提示', {
                  confirmButtonText: '確定',
                  showCancelButton: false,
                  type: 'warning',
                  center: true,
                })
                this.tryingNextStep = false
                return
              }
            }
           
            this.activeStep++
            // console.log('換頁')
            this.tryingNextStep = false
            break

          case 4:
            await this.$refs.step.validate()
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
            messageStroe('add')
            this.$router.push({ name: 'prepaid', params: { pagination: this.pagination,filterData:this.filterData } })
            // this.$router.push({ name: 'prepaid',params: {  pagination:this.pagination } })
            // try {
            //   // console.log(this.$refs.step.submitData.prices)
            //   if (this.$refs.step.submitData.prices.length === 0) {
            //     await this.$confirm('請至少選擇一個適用項目', '提示', {
            //       confirmButtonText: '確定',
            //       showCancelButton: false,
            //       type: 'warning',
            //       center: true,
            //     })
            //     this.tryingNextStep = false
            //     return
            //   }
            //   // 檢查包月方案適用項目總數必須大於方案總抵用次數
            //   let allPricesMaxTimes = 0
            //   this.$refs.step.submitData.prices.forEach((item) => {
            //     allPricesMaxTimes = allPricesMaxTimes + item.maxTimes
            //   })
            //   // console.log(allPricesMaxTimes)
            //   if (allPricesMaxTimes < this.submitData.times) {
            //     await this.$confirm('適用項目總抵扣次數不得小於方案抵扣次數', '提示', {
            //       confirmButtonText: '確定',
            //       showCancelButton: false,
            //       type: 'warning',
            //       center: true,
            //     })
            //     this.tryingNextStep = false
            //     return
            //   }
            //   // this.step1Data = Object.assign({}, this.step1Data, this.$refs.step.submitData)
            //   await this.$store.dispatch('prepaid/store', this.submitData)
            //   messageStroe('add')
            //   this.$router.push({ name: 'prepaid',params: {  pagination:this.pagination } })
            // } catch (error) {}
            // this.tryingNextStep = false
            break
        }
      } catch (error) {
        this.tryingNextStep = false
      }
    },
    goBack() {
      this.activeStep--
      // this.step1Data = this.$refs.step.submitData
    },
    async onClickLeave() {
      try {
        await messageBoxLeave('包月方案')
        this.$router.push({ name: 'prepaid', params: { pagination: this.pagination,filterData:this.filterData } })
      } catch (error) {
      } finally {
      }
    },
  },
}
</script>

<template>
  <Layout>
    <BaseSteps :active="activeStep" :list="stepList" />

    <el-card :class="$style['card-wrapper']">
      <keep-alive>
        <component :is="stepList[activeStep - 1].component" ref="step" :default-value.sync="submitData" :products="products" :category="category" :prices="prices" />
      </keep-alive>
    </el-card>
    <div :class="$style.footer">
      <el-button class="is-round" data-tour-text="若不想新增此活動，請按「離開」跳出。注意：我們將不會保留此步驟填寫的資料。" @click="onClickLeave">離開</el-button>
      <el-button v-if="activeStep !== 1" class="is-round" data-tour-text="若不想新增此活動，請按「離開」跳出。注意：我們將不會保留此步驟填寫的資料。" @click="goBack">上一步</el-button>
      <el-button class="is-round" data-tour-text="若欄位皆已填寫完成，點擊「下一步」儲存此步驟填寫的資料，前往下一步" type="primary" :loading="tryingNextStep" @click="onClickNextStep(activeStep)">{{
        activeStep !== 4 ? '下一步' : '儲存'
      }}</el-button>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>
