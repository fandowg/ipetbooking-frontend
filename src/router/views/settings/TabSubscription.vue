<script>
import {
  planIntervalFilter,
  planPriceFilter,
} from '@utils/filter-value-to-text'

import tourMixin from '@src/mixins/tour'

import PlanList from '@components/PlanList'

import { merchantComputed } from '@state/helpers'
import formatDate from '@utils/format-date'

export default {
  filters: {
    formatDate,
    planIntervalFilter,
    planPriceFilter,
  },
  components: {
    PlanList,
  },
  mixins: [tourMixin],
  tourName: 'merchantPlan',
  data() {
    return {
      mode: 'view', // view 檢視目前方案與綁定信用卡資訊； upgrade 升級方案瀏覽方案列表
      tryingChangeCard: false,
      changeCardFormData: '',
    }
  },
  computed: {
    ...merchantComputed,
    currentPlan() {
      return this.currentMerchant.plan
    },
    disabledChange() {
      return this.currentMerchant.canUpgrade === 0
    },
    isSubscribed() {
      return this.currentMerchant.subscriptionState === 1
    },
    isTrial() {
      return !this.currentMerchant.creditCard.number
    },
    unit(){
      let dateUnit=''
      switch (this.currentPlan.billingCycle) {
        case 'year':
          dateUnit='年'
          break;
        case 'month':
          dateUnit='月'
          break;
      }
      return dateUnit
    }
  },
  methods: {
    changeMode(mode) {
      this.mode = mode
    },
    async tryToChangeState(state) {
      const submitData = {
        ...this.currentMerchant,
        subscriptionState: state,
      }
      if (state === 0) {
        await this.$confirm('確認取消訂閱？', '提醒', {
          confirmButtonText: '確認',
          cancelButtonText: '放棄',
          type: 'warning',
          center: true,
        })
        await this.$store.dispatch('merchant/store', submitData)
        this.$message({
          message: '取消成功!',
          type: 'success',
        })
        this.$emit('update')
      } else {
        await this.$confirm(
          `確認續訂「${
            this.currentPlan.name
          }${this.$options.filters.planIntervalFilter(
            this.currentPlan.billingCycle,
            false
          )}」方案？`,
          '提醒',
          {
            confirmButtonText: '確認',
            cancelButtonText: '放棄',
            type: 'warning',
            center: true,
          }
        )
        await this.$store.dispatch('merchant/store', submitData)
        this.$message({
          message: '續訂成功!',
          type: 'success',
        })
        this.$emit('update')
      }
    },
    async tryToChangePlan(plan) {
      const submitData = {
        ...this.currentMerchant,
        planId: plan.id,
        subscriptionState: 1, // 取消訂閱後重新訂閱並升級
      }
      await this.$confirm(
        '於續約日前僅能升級方案一次，確認升級方案？',
        '提醒',
        {
          confirmButtonText: '確認',
          cancelButtonText: '放棄',
          type: 'warning',
          center: true,
        }
      )
      await this.$store.dispatch('merchant/store', submitData)
      this.$message({
        message: '升級成功!',
        type: 'success',
      })
      this.$emit('update')
      this.changeMode('upgrade-success')
    },
    async tryToChangeCard() {
      sessionStorage.setItem('merchant.tryToChangeCard', true)
      this.tryingChangeCard = true
      this.changeCardFormData = await this.$store.dispatch(
        'merchant/changeCard',
        this.currentMerchant.alias
      )
      this.tryingChangeCard = false
      this.$nextTick(() => {
        this.$refs.cardForm.submit()
      })
    },
  },
}
</script>

<template>
  <div>
    <!-- <template v-if="isTrial">
      <p
        >您目前為尊榮試用期，並將於
        {{ currentMerchant.nextChargeDate | formatDate }} 到期。</p
      >
    </template> -->
    <template >
      <template v-if="mode === 'view'">
        <h4 class="form-block-title">目前方案</h4>
        <template v-if="isSubscribed">
          <div :class="$style.row">
            <div
              :class="$style.column"
              
            >
            <p>
                {{ currentPlan.name }} ( {{unit}}繳，{{ currentPlan.price | planPriceFilter }}/{{unit}} )
            </p>
            <p>
              方案期限： {{ currentMerchant.nextChargeDate | formatDate }}
            </p>
            <p>
              付款方式：匯款（ 如有疑問請來電 02-2531-6628 ）
            </p>
              <!-- <h4>
                {{ currentPlan.name }}
                <small
                  >({{ currentPlan.price | planPriceFilter }}
                  {{ currentPlan.billingCycle | planIntervalFilter }})</small
                >
              </h4>
              <p
                >您的方案將在
                {{ currentMerchant.nextChargeDate | formatDate }}
                自動續約，屆時您將被收取
                {{ currentPlan.price | planPriceFilter }}。</p
              > -->
            </div>
            <!-- <div :class="$style.column">
      
              <el-button :disabled="disabledChange" @click="tryToChangeState(0)"
                >取消訂閱</el-button
              >
              <p v-if="disabledChange" :class="$style.metatext"
                >您在過去一個月內曾變更過方案，在
                {{ currentMerchant.nextChargeDate | formatDate }}
                前您不得取消或升級方案。</p
              >
            </div> -->
          </div>
        </template>
        <!-- <template v-else>
          <div :class="$style.row">
            <div :class="$style.column">
              <h4>
                {{ currentPlan.name }}
                <small
                  >({{ currentPlan.price | planPriceFilter }}
                  {{ currentPlan.billingCycle | planIntervalFilter }})</small
                >
              </h4>
              <p
                >你已取消訂閱，在
                {{ currentMerchant.nextChargeDate | formatDate }}
                之後將無法登入。</p
              >
            </div>
            <div :class="$style.column">
              <el-button
                :disabled="disabledChange"
                type="primary"
                @click="changeMode('upgrade')"
                >訂閱並升級方案</el-button
              >
              <el-button :disabled="disabledChange" @click="tryToChangeState(1)"
                >繼續訂閱</el-button
              >
              <p v-if="disabledChange"
                >您在過去一個月內曾變更過方案，在
                {{ currentMerchant.nextChargeDate | formatDate }}
                前您不得取消或升級方案。</p
              >
            </div>
          </div>
        </template> -->

        <!-- <h4 class="form-block-title">付款信用卡</h4> -->
        <!-- <div :class="$style.row">
          <div :class="$style.column">
            <div :class="$style.card">
              <img
                :src="
                  require(`@assets/images/card_icon_${
                    currentMerchant.creditCard.issuer.toLowerCase() || 'visa'
                  }.svg`)
                "
                alt
              />
              <div>{{ currentMerchant.creditCard.number }}</div>
              <div>{{ currentMerchant.creditCard.cardExpired }} 到期</div>
            </div>
          </div>
          <div
            :class="$style.column"
            data-tour-text="若想要更改扣款的信用卡，點擊「變更信用卡資訊」進行變更。"
          >
            <el-button :loading="tryingChangeCard" @click="tryToChangeCard"
              >變更信用卡資訊</el-button
            >
            <p :class="$style.metatext">您將會跳轉至藍新金流進行變更設定</p>
          </div>
        </div> -->
        <!-- <form
          v-if="changeCardFormData"
          ref="cardForm"
          :action="changeCardFormData.PostUrl"
          method="POST"
          hidden
        >
          <input
            v-for="(value, field) in changeCardFormData"
            :key="field"
            :name="field"
            :value="value"
          />
        </form> -->
      </template>
    </template>

    <!-- <template v-if="mode === 'upgrade'">
      <el-page-header
        title="取消升級"
        content="升級方案"
        @back="changeMode('view')"
      ></el-page-header>
      <PlanList
        :list-data="planList"
        :current-plan-id="currentMerchant.planId"
        @change="tryToChangePlan"
      />
    </template>

    <el-card v-if="mode === 'upgrade-success'" class="card-with-image">
      <img src="~@assets/images/upgrade_success.png" alt />
      <h4 class="card-with-image__title">方案升級成功！</h4>
      <div class="card-with-image__description">
        <p
          >您訂閱的方案為{{ currentPlan.name }}({{
            currentPlan.price | planPriceFilter
          }}
          {{ currentPlan.billingCycle | planIntervalFilter }})</p
        >
        <p>將會於 {{ currentMerchant.nextChargeDate | formatDate }} 自動續約</p>
      </div>

      <el-button type="primary" @click="changeMode('view')"
        >回到訂閱管理</el-button
      >
    </el-card> -->
  </div>
</template>

<style lang="scss" module>
@import '@design';

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .column:last-child {
    // text-align: right;
  }
  .column{
    p{
      margin-top: 0;
      margin-bottom: 20px;
    }
  }
}

.card {
  display: flex;
  align-items: center;
  > * {
    margin-right: 10px;
  }
}

.metatext {
  margin-top: 15px;
  color: $color-text-placeholder;
}
</style>
