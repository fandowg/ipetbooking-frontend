<script>
import tourMixin from '@src/mixins/tour'

import { merchantComputed } from '@state/helpers'
import NewebpayForm from './payment/newebpayForm'

export default {
  components: {
    NewebpayForm,
  },
  mixins: [tourMixin],
  tourName: 'merchantPayment',
  data() {
    return {
      mode: 'list',
      applyService: '',
      serviceList: [
        {
          logo: 'newebpay_logo.png',
          component: 'Newebpay',
        },
      ],
      displayText: ['立即申請', '已開通', '審核中'],
    }
  },
  computed: {
    ...merchantComputed,
    applyForm() {
      return `${this.applyService}-form`
    },
    disabledApply() {
      return this.currentMerchant.cashflowSetting !== 0
    },
    btnText() {
      return this.displayText[this.currentMerchant.cashflowSetting]
    },
  },
  methods: {
    goBackToList() {
      this.mode = 'list'
    },
    goToApply(serviceComponent) {
      this.mode = 'apply'
      this.applyService = serviceComponent
    },
    finishApply() {
      this.$emit('update')
      this.goBackToList()
    },
  },
}
</script>

<template>
  <transition name="fade">
    <el-row v-if="mode === 'list'" :gutter="20">
      <el-col :span="24">
        <h4>請點選欲開通之收款金流服務商進行申請</h4>
      </el-col>
      <el-col
        v-for="service in serviceList"
        :key="service.component"
        :span="8"
        data-tour-step="1"
        data-tour-text="無法變更方案的金額嗎？立即申請藍新金流，申請完成後即能開始收款囉！"
      >
        <el-card :class="$style.card" shadow="hover">
          <img
            :class="$style.card__logo"
            :src="require(`@assets/images/payment_${service.logo}`)"
          />
          <el-button
            type="primary"
            plain
            class="is-fullwidth"
            :disabled="disabledApply"
            @click="goToApply(service.component)"
            >{{ btnText }}</el-button
          >
        </el-card>
      </el-col>
    </el-row>
    <div v-else>
      <el-page-header
        title="返回列表"
        content="申請頁面"
        @back="goBackToList"
      ></el-page-header>
      <component :is="applyForm" @submit="finishApply"></component>
    </div>
  </transition>
</template>

<style lang="scss" module>
@import '@design';
.card {
  text-align: center;
  &__logo {
    width: 60%;
    margin: 25px 0;
  }
}
.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
