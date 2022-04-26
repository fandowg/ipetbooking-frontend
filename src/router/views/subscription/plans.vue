<script>
import { authComputed, merchantComputed } from '@state/helpers'
import cloneDeep from 'lodash/cloneDeep'
import Vue from 'vue'
import dsthPlanSubscription from 'dsth-plan-subscription'
import { resetRouter } from '@router'
import formatDate from '@utils/format-date'

// 前後台共用元件：訂閱方案
Vue.use(dsthPlanSubscription)

export default {
  page: {
    title: '選購方案',
    meta: [{ name: 'description', content: 'Choose your plan' }],
  },
  components: {},
  data() {
    return {
      showEditPlan: false,
      bindCardFormData: '',
      processingBindCard: false,
    }
  },
  computed: {
    ...authComputed,
    ...merchantComputed,
    storeData() {
      const cloneData = cloneDeep(this.currentMerchant.plan)
      const data = {
        alias: cloneData.alias,
        period: cloneData.billingCycle,
        modules: {
          freeOptional: cloneData.freeModules,
          additional: cloneData.additionalModules,
        },
        // components: [],
        total: cloneData.price,
      }
      return data
    },
    cardIssuer() {
      const issuer =
        this.currentMerchant.creditCard !== ''
          ? this.currentMerchant.creditCard.issuer
          : ''
      return require(`@assets/images/card_icon_${issuer.toLowerCase() ||
        'visa'}.svg`)
    },
    isBindCardSuccess() {
      return this.$route.name === 'newebpay-success'
    },
    isBindCardFailed() {
      return this.$route.name === 'newebpay-fail'
    },
    canUpgrade() {
      return this.currentMerchant.canUpgrade === 1
    },
  },
  mounted() {
    window.addEventListener('unload', this.clearSubscription)
    if (this.isBindCardFailed) this.showBindCardFailedMessage()
    if (this.isBindCardSuccess) this.showBindCardSuccessMessage()
    this.$store.dispatch('auth/updateAccessSubscription', false)
  },
  beforeDestroy() {
    window.removeEventListener('unload', this.clearSubscription)
    this.clearSubscription()
  },
  methods: {
    async updatedPlan(data) {
      const currentSubscription = cloneDeep(this.currentMerchant)
      const userPlanInfo = {
        alias: data.alias,
        name: data.name,
        billingCycle: data.period,
        price: data.total,
        freeModules: data.modules.freeOptional,
        additionalModules: data.modules.additional,
      }
      currentSubscription.plan = Object.assign({}, userPlanInfo)
      this.$store.dispatch('merchant/updateSubscription', currentSubscription)
      this.showEditPlan = false
      await this.$store.dispatch('merchant/storePlan', this.storeData) // 變更方案
    },
    async tryToBindingCard() {
      this.processingBindCard = true
      this.$store.dispatch('auth/updateAccessSubscription', true)
      this.bindCardFormData = await this.$store.dispatch(
        'merchant/changeCard',
        this.currentMerchant.alias
      )
      this.$nextTick(() => {
        this.$refs.cardForm.submit()
      })
    },
    cancelUpdatePlan() {
      this.showEditPlan = false
    },
    async tryToRenewPlan() {
      await this.$store.dispatch('merchant/renewPlan') // 續訂
      this.clearSubscription()
      this.$store.dispatch('auth/validate').then(() => {
        this.handleLogin()
      })
    },
    async handleLogin() {
      console.log('handleLogin')
      const userRoutes = await this.$store.dispatch('auth/fetchAccess');
      resetRouter();
      this.$router.addRoutes(userRoutes);
      await this.$store.dispatch('auth/fetchTour');

      this.$router.push({
        name: this.currentUser.redirect,
      })
    },
    async clearSubscription() {
      if (this.processingBindCard === false) {
        await this.$store.dispatch('auth/clearSubscription')
        await this.$store.dispatch('merchant/updateSubscription', '')
      }
    },
    showBindCardFailedMessage() {
      this.$alert(
        '很可惜，因為種種因素我們無法成功取得您付款方式的授權，請重新再試。',
        '付款方式設定失敗',
        {
          confirmButtonText: '確定',
          type: 'error',
          center: true,
        }
      )
    },
    showBindCardSuccessMessage() {
      this.$alert(
        '已經可以開始使用 iPetBooking 管理您的預約事業囉！',
        '付款方式已設定成功',
        {
          confirmButtonText: '確定',
          type: 'success',
          center: true,
        }
      )
    },
    async beforeShowEditPlan() {
      if (this.canUpgrade) {
        if (this.planList.length === 0)
          await this.$store.dispatch('merchant/fetchPlans')
        this.showEditPlan = true
      } else {
        this.$alert(
          `您在過去曾變更過方案，<br/>在 ${formatDate(
            this.currentMerchant.nextChargeDate
          )} 前您不得取消或升級方案。`,
          '無法更換方案',
          {
            confirmButtonText: '確定',
            type: 'warning',
            center: true,
            dangerouslyUseHTMLString: true,
          }
        )
      }
    },
    backToDefaultRoute() {
      this.$router.push('/')
    },
  },
}
</script>

<template>
  <el-container
    :class="[$style['centered-container-subscription'], 'centered-container']"
  >
    <el-page-header
      v-if="!showEditPlan"
      title="返回"
      style="position: absolute; top: 20px; left: 20px;"
      @back="backToDefaultRoute"
    ></el-page-header>
    <div style="overflow: auto; width: 100%;">
      <SubscriptionContent
        v-if="!showEditPlan"
        :user-plan-info="currentMerchant"
        :card-issuer="cardIssuer"
        @confirm="tryToRenewPlan"
        @update-plan="beforeShowEditPlan"
        @update-credit-card="tryToBindingCard"
      ></SubscriptionContent>
      <EditPlan
        v-if="showEditPlan"
        :plans-info="planList"
        :previous-plan="currentMerchant.plan"
        @done="updatedPlan"
        @leave="cancelUpdatePlan"
      ></EditPlan>
    </div>
    <form
      v-if="bindCardFormData"
      ref="cardForm"
      :action="bindCardFormData.PostUrl"
      method="POST"
      hidden
    >
      <input
        v-for="(value, field) in bindCardFormData"
        :key="field"
        :name="field"
        :value="value"
      />
    </form>
  </el-container>
</template>

<style lang="scss" module>
@import '@design';

.title {
  color: white;
  text-align: center;
}
.centered-container-subscription {
  background: white;
}
</style>
