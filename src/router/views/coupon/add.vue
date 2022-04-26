<script>
import Layout from '@layouts/main'
import CouponForm from './CouponForm'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxLeave } from '@utils/message-box'
import { notification } from '@utils/notification'

export default {
  page: {
    title: '新增優惠券',
    meta: [{ name: 'description', content: 'Add Coupon' }],
  },
  components: {
    Layout,
    CouponForm,
    BaseSteps: () => import('@components/BaseSteps'),
    Step1: () => import('./CouponForm'),
    Step2: () => import('./CouponAssigned'),
    Step3: () => import('./CouponTarget'),
  },
  data() {
    return {
      activeStep: 1,
      stepList: Object.freeze([
        {
          title: '基本資訊',
          description: '請填寫下方欄位',
          // component: () => import('./components/Step1Basic'),
        },
        {
          title: '適用項目',
          description: '請選擇可使用優惠券的服務項目',
          // component: () => import('./components/Step1Basic'),
        },
        {
          title: '設定適用對象',
          description: '請選取可抵扣的購買方案',
          // component: () => import('./components/Step2Prices'),
        },
      ]),
      tryingNextStep: false,
      nextStepButtonVisible: false,
      step1Data: undefined,

      defaultValue: {},
    }
  },
  created() {
    if (this.$route.params.data.title) {
      this.step1Data = this.$route.params.data
    }
  },
  methods: {
    backToList() {
      this.$router.push({ name: 'coupon' })
    },
    async onClickNextStep(currentStep) {
      this.tryingNextStep = true
      try {
        switch (currentStep) {
          case 1:
            await this.$refs.step.validate()
            // await this.$refs.step.tryToStore()
            this.step1Data = this.$refs.step.submitData

            this.activeStep++
            this.tryingNextStep = false
            break

          case 2:
            // await this.$refs.step.validate()
            if (this.$refs.step.submitData.priceIds.length === 0) {
              this.$confirm('請至少選擇一個適用項目', '提示', {
                confirmButtonText: '確定',
                showCancelButton: false,
                type: 'warning',
                center: true,
              })
              this.tryingNextStep = false
              return
            }
            this.step1Data = Object.assign({}, this.step1Data, this.$refs.step.submitData)
            
            // await this.$refs.step.tryToStore()
            // this.step1Data = this.$refs.step.submitData

            this.activeStep++
            this.tryingNextStep = false
            break

          case 3:
            try {
              // console.log(this.$refs.step.filterSubmitData)
              this.step1Data = Object.assign({}, this.step1Data, this.$refs.step.filterSubmitData)
              const { items } = await this.$store.dispatch('coupon/store', this.step1Data)
              // console.log(items)
              messageStroe('add')
              this.$notify({
                title: '提示',
                dangerouslyUseHTMLString: true,
                message:`已更新優惠券!
                <br>您可前往
                <a href="/coupon/${items.id}?tab=sendCoupons" style="cursor: pointer;">發送優惠券</a>
                進行後續設定`,
              });
              // this.$message({
              //   message: `創建成功！`,
              //   type: 'success',
              // })
              this.$router.push({ name: 'coupon' })
            } catch (error) {}
            this.tryingNextStep = false
            break
        }
      } catch (error) {
        this.tryingNextStep = false
      }
    },
    async onClickLeave() {
      try{
        await messageBoxLeave('優惠券')
        this.$router.push({ name: 'coupon' })
      }
      catch (error) {

      } finally {

      }
     
    },
    back() {
      this.activeStep--
    },
  },
}
</script>

<template>
  <Layout>
    <BaseSteps :active="activeStep" :list="stepList" />

    <el-card :class="$style['card-wrapper']">
      <keep-alive>
        <component :is="`step-${activeStep}`" ref="step" :default-value="step1Data" @back="backToList"></component>
      </keep-alive>
      <div :class="$style.footer">
        <el-button class="is-round" data-tour-text="若不想新增此活動，請按「離開」跳出。注意：我們將不會保留此步驟填寫的資料。" @click="onClickLeave">離開</el-button>
        <el-button v-if="activeStep !== 1" class="is-round" data-tour-text="若不想新增此活動，請按「離開」跳出。注意：我們將不會保留此步驟填寫的資料。" @click="back">上一步</el-button>
        <el-button class="is-round" data-tour-text="若欄位皆已填寫完成，點擊「下一步」儲存此步驟填寫的資料，前往下一步" type="primary" :loading="tryingNextStep" @click="onClickNextStep(activeStep)">{{
          activeStep !== 3 ? '下一步' : '建立優惠券'
        }}</el-button>
      </div>
    </el-card>
  </Layout>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>
