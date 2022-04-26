<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'

export default {
  page: {
    title: '新增項目',
    meta: [{ name: 'description', content: 'Add Product' }],
  },
  components: {
    Layout,
    BaseSteps: () => lazyLoadComponent(import('@components/BaseSteps')),
    Step1: () => lazyLoadComponent(import('./components/Step1Basic')),
    Step2: () => lazyLoadComponent(import('./components/Step4ExtraField')),
  },
  props: {
    defaultStep: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      default: 'activity',
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
          description: '設定店內服務基本資訊！',
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
      tryingUpdateState: false,
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    },
  },
  methods: {
    handleFormValidate(valid) {
      this.nextStepButtonVisible = valid
    },
    onClickLeave() {
      this.$confirm(
        this.$t('PRODUCT.LEAVE_ADD_CONFIRM_MESSAGE', {
          name: this.$t(`PRODUCT.${this.productType}.NAME`),
        }),
        '您將離開此頁面',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }
      ).then(() => {
        this.$router.push({ name: 'products' })
      })
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
    handleStoreProduct(submitData) {
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
      this.tryingNextStep = true
      try {
        switch (this.activeStep) {
          case 1:
            const formData = this.$refs.step.submitData
            await this.$refs.step.validate()
            const newProduct = await this.handleStoreProduct(formData)
            const routeTo = this.$router.resolve({
              params: { productId: newProduct.id },
            })
            this.$router.push(routeTo.location)
            this.incrementActiveStep()

            break
          case 2:
            const list = this.$refs.step.list
            await this.handleStoreExtraField(list)
            this.updateItemState()

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
  },
}
</script>

<template>
<div>
    <BasePageHeader
      :title="
        $t('GLOBAL.HEADER_ADD_PREFIX', {
          name: $t(`PRODUCT.${productType}.NAME`),
        })
      "
    >
      <BaseSteps slot="center" :active="activeStep" :list="stepList" />
    </BasePageHeader>
    <el-card shadow="never" :header="stepList[activeStep - 1].description" :class="$style['card-wrapper']">
      <keep-alive>
        <component :is="`step-${activeStep}`" ref="step" :item-type="productType" :default-value="defaultValue" @validate="handleFormValidate"></component>
      </keep-alive>
    </el-card>
    <div v-show="activeStep !== stepList.length" :class="$style.footer">
      <el-button data-tour-text="若不想新增此活動，請按「離開」跳出。注意：我們將不會保留此步驟填寫的資料。" @click="onClickLeave">離開</el-button>
      <el-button
        v-if="activeStep === 1 ? true : nextStepButtonVisible"
        data-tour-text="若欄位皆已填寫完成，點擊「下一步」儲存此步驟填寫的資料，前往下一步"
        type="primary"
        :loading="tryingNextStep"
        @click="onClickNextStep"
        >下一步</el-button
      >
    </div>
</div>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>
