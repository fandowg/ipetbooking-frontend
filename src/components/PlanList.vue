<script>
import appConfig from '@src/app.config'

import { groupByInterval } from '@utils/normalize-data'
import {
  planIntervalFilter,
  planPriceFilter,
} from '@utils/filter-value-to-text'

export default {
  filters: {
    planIntervalFilter,
    planPriceFilter,
  },
  props: {
    renewMode: {
      type: Boolean,
      default: false,
    },
    listData: {
      type: Array,
      default: () => [],
    },
    currentPlanId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      activeInterval: 'monthly',
    }
  },
  computed: {
    groupByInterval() {
      return Object.freeze(groupByInterval(this.listData))
    },
    contactLinkHref() {
      const subject = `[DingSomething] 客製化方案需求單`
      return `mailto:${appConfig.contactEmail}?subject=${subject}`
    },
  },
  methods: {
    isCurrentPlan(planId) {
      return this.currentPlanId === +planId
    },
    emitChange(plan) {
      this.$emit('change', plan)
    },
  },
}
</script>

<template>
  <div>
    <el-radio-group v-model="activeInterval" :class="$style.plan__groups">
      <el-radio-button
        v-for="interval in Object.keys(groupByInterval)"
        :key="interval"
        :label="interval"
      >{{ interval | planIntervalFilter(false) }}</el-radio-button>
    </el-radio-group>
    <el-row :gutter="20">
      <el-col v-for="(plan, planId) in groupByInterval[activeInterval]" :key="planId" :span="8">
        <el-card>
          <div :class="$style.plan__header">
            <span :class="$style.plan__label">{{ plan.title }}</span>
          </div>

          <div :class="$style.plan__wrapper">
            <div :class="$style.price__base">
              <div v-if="plan.basePrice && plan.price !== plan.basePrice">
                <sup>NT$</sup>
                {{ plan.basePrice | planPriceFilter(false) }}
              </div>
            </div>
            <div :class="$style.price">
              <sup v-if="plan.basePrice">NT$</sup>
              {{ plan.price | planPriceFilter(false) }}
              <span
                :class="$style.price__unit"
              >{{ plan.interval | planIntervalFilter }}</span>
            </div>
            <div :class="$style.metatext">{{ plan.introtext }}</div>

            <div
              :class="[$style.features, { [$style['features--customize']]: plan.type === 'customize' }]"
              v-html="plan.description"
            ></div>
          </div>

          <el-button
            v-if="plan.basePrice"
            :disabled="!plan.available"
            :type="(!renewMode && isCurrentPlan(planId)) ? 'info' : 'primary'"
            class="is-fullwidth"
            @click="emitChange(plan)"
          >{{ (isCurrentPlan(planId)) ? (renewMode) ? '續訂方案' : '目前方案' : '立即試用' }}</el-button>
          <a v-else :href="contactLinkHref">
            <el-button class="is-fullwidth">聯繫我們</el-button>
          </a>

          <div :class="$style.metatext">{{ plan.suggest }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.plan {
  &__groups {
    display: block;
    margin-bottom: 15px;
    text-align: center;
  }
  &__header {
    margin-top: 10px;
    margin-bottom: 30px;
  }
  &__wrapper {
    min-height: 430px;
  }
  &__label {
    height: 30px;
    padding: 5px 25px;
    line-height: 30px;
    color: white;
    background-color: $color-primary;
    border-radius: 20px;
  }
}
.price {
  margin-top: 10px;
  font-size: 2.5rem;

  &__unit {
    font-size: initial;
  }
  &__base {
    position: relative;
    display: inline-block;
    min-height: 20px;

    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 12px;
      content: ' ';
      border-top: 1px solid;
      transform: rotate(-7deg);
    }
  }
}
.features {
  margin-top: 20px;
  li {
    position: relative;
    padding: 10px 0;

    &::before {
      display: inline-block;
      width: 6px;
      height: 12px;
      margin-right: 10px;
      content: '';
      border-right: 2px solid #303133;
      border-bottom: 2px solid #303133;
      transform: rotate(45deg);
    }
  }
  &--customize li {
    &::before,
    &::after {
      width: 2px;
      height: 12px;
      content: ' ';
      background-color: #333;
      transform: rotate(0);
    }
    &::after {
      position: absolute;
      top: 11px;
      left: 0;
      transform: rotate(90deg);
    }
  }
}
.metatext {
  margin-top: 15px;
  color: $color-text-placeholder;
}
</style>
