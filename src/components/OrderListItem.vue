<script>
import lazyLoadComponent from '@router/lazyload-component'

import {
  genderFilter,
  orderStatusFilter,
  orderSourceFilter,
} from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

export default {
  components: {
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderChangeStatusDialog: () =>
      lazyLoadComponent(import('./OrderChangeStatusDialog')),
  },
  filters: {
    genderFilter,
    orderStatusFilter,
    orderSourceFilter,
    formatDate,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    refundMode: {
      type: Boolean,
      default: false,
    },
    showProduct: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      tryingToVerify: false,
      tryingToGetOrder: false,
      checkInDialogVisible: false,
      cancelDialogVisible: false,
      checkInOrder: {},
      selectedCodes: [],
      expandParamIndex: 0,
      orderDetail: {}
    }
  },
  computed: {
    isAllUsed() {
      return this.data.groupSize / this.data.usedSize === 1
    },
    statusClassName() {
      if (this.data.status === 0) return 'order--canceled'
      if (this.isAllUsed) return 'order--used'
      return ''
    },
    enabledUseSelectedCodes() {
      return this.selectedCodes.length > 0
    },
  },
  methods: {
    async tryToVerifyCodes() {
      this.tryingToVerify = true
      try {
        await this.$store.dispatch('order/verifyCodes', this.selectedCodes)
        this.tryingToVerify = false
        await this.$alert('已報到選取之票券', '報到成功！', {
          confirmButtonText: '確認',
          center: true,
        })
        this.checkInOrder = await this.$store.dispatch(
          'order/fetchSingle',
          this.checkInOrder.id
        )
        this.selectedCodes = []
        this.$emit('update')
      } catch (error) {
        this.tryingToVerify = false
      }
    },
    async showCancelDialog() {
      this.tryingToGetOrder = true
      this.orderDetail = await this.$store.dispatch('order/fetchSingle', this.data.id)
      this.cancelDialogVisible = true
      this.tryingToGetOrder = false
    },
    emitViewSingle() {
      this.$emit('view', this.data.id)
    },
    async tryToGetOrder(orderId) {
      this.tryingToGetOrder = true
      this.checkInOrder = await this.$store.dispatch(
        'order/fetchSingle',
        orderId
      )
      this.checkInDialogVisible = true
      this.tryingToGetOrder = false
    },
    selectAllParamCodes(paramId) {
      const paramCodes = this.checkInOrder.params[paramId].codes
        .filter((code) => !code.used)
        .map((code) => code.id)
      this.selectedCodes = [...paramCodes]
    },
    checkUsedCodes(codes) {
      return codes.filter((code) => code.used)
    },
    checkUnusedCodes(codes) {
      return codes.filter((code) => !code.used)
    },
    chunckArrayBySize(array, chunckSize = 1, cacheArray = []) {
      const tempArray = [...array]
      if (chunckSize <= 0) return cacheArray
      while (tempArray.length) cacheArray.push(tempArray.splice(0, chunckSize))
      return cacheArray
    },
    updateCalendar() {
      this.$emit('update')
    },
  },
}
</script>

<template>
  <div v-loading="tryingToGetOrder" :class="[$style.order, statusClassName]">
    <div class="item">
      <div>{{ data.fullName }}{{ data.gender | genderFilter }}</div>
      <div :class="$style['order__meta']">{{ data.phoneNumber }}</div>
    </div>

    <div class="item">
      <BaseStateLabel :state="data.status | orderStatusFilter('color')" text>{{
        data.status | orderStatusFilter('text')
      }}</BaseStateLabel>
      <div :class="$style['order__meta']">{{
        data.source | orderSourceFilter
      }}</div>
    </div>
    <div
      class="order__ticket item"
      :class="{ [$style['order--hide']]: data.status !== 1 }"
      >{{ `${data.usedSize} / ${data.groupSize}` }}</div
    >
    <div v-if="showProduct" class="item">
      <div>{{ data.productName }}</div>
      <div>{{ data.date | formatDate }} {{ data.time }}</div>
    </div>
    <div :class="$style['order__button']">
      <template v-if="refundMode">
        <el-button v-if="data.status === 0" disabled type="text">{{
          +data.refund ? '已退款' : '已取消'
        }}</el-button>
        <el-button
          v-else-if="data.status === 1"
          type="primary"
          @click="showCancelDialog"
          >退款</el-button
        >
        <el-button v-else type="primary" @click="showCancelDialog"
          >取消</el-button
        >
      </template>
      <template v-else>
        <el-button
          v-if="data.status === 1 && !isAllUsed"
          type="primary"
          @click="tryToGetOrder(data.id)"
          >報到</el-button
        >
        <el-button v-else @click="emitViewSingle">查看</el-button>
      </template>
    </div>
    <OrderChangeStatusDialog
      :visible.sync="cancelDialogVisible"
      :order="{ ...orderDetail, status: 0 }"
      @cancelled="updateCalendar"
    />
    <!-- 報到 Dialog -->
    <el-dialog
      :visible.sync="checkInDialogVisible"
      top="0"
      width="830px"
      append-to-body
    >
      <h3>
        {{ checkInOrder.productName }}
        <br />
        <small
          >{{ checkInOrder.date | formatDate }} {{ checkInOrder.time }}</small
        >
      </h3>
      <h5
        >{{ checkInOrder.fullName }}
        {{ checkInOrder.gender | genderFilter }}</h5
      >
      <p>{{ checkInOrder.note }}</p>
      <el-collapse v-model="expandParamIndex" accordion>
        <el-collapse-item
          v-for="(param, paramId, index) in checkInOrder.params"
          :key="param.id"
          :name="index"
          :disabled="checkUnusedCodes(param.codes).length === 0"
          :class="$style.param"
        >
          <template v-slot:title :class="$style['param__title']">
            <h5>{{ param.title }}</h5>
            <span
              >({{
                checkUnusedCodes(param.codes).length === 0
                  ? '全數使用完畢'
                  : `${checkUsedCodes(param.codes).length}/${
                      param.codes.length
                    }`
              }}，共{{ param.qty }}組)</span
            >
          </template>

          <div
            v-for="(group, groupIndex) in chunckArrayBySize(
              param.codes,
              param.size
            )"
            :key="groupIndex"
            :class="$style['code__group']"
          >
            <div :class="$style['code__header']"
              >第{{ groupIndex + 1 }}組，共{{ param.qty }}組</div
            >
            <div :class="$style['code__list']">
              <label
                v-for="code in group"
                :key="code.id"
                :class="[
                  $style.code,
                  {
                    [$style['code--disabled']]: !!code.used,
                    [$style['code--checked']]:
                      selectedCodes.indexOf(code.id) !== -1,
                  },
                ]"
              >
                <input
                  v-model="selectedCodes"
                  type="checkbox"
                  :value="code.id"
                  :disabled="!!code.used"
                  :class="$style['code__checkbox']"
                />
                <img
                  :class="$style['code__img']"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/QRcode_image.svg/220px-QRcode_image.svg.png"
                />
                <span :class="$style['code__number']"
                  >末5碼：{{
                    code.id
                      .split('')
                      .splice(-5)
                      .join('')
                  }}</span
                >
              </label>
            </div>
          </div>
          <el-button class="is-fullwidth" @click="selectAllParamCodes(paramId)"
            >全選</el-button
          >
          <el-button
            :disabled="!enabledUseSelectedCodes"
            :type="enabledUseSelectedCodes ? 'primary' : 'info'"
            class="is-fullwidth"
            :loading="tryingToVerify"
            @click="tryToVerifyCodes"
            >使用</el-button
          >
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.order {
  @include layer-elevation(1);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  margin-top: 15px;
  background: white;
  &__meta {
    margin-top: 5px;
    font-size: $font-size-smaller;
    color: $color-text-placeholder;
    letter-spacing: $font-letter-spacing-small;
  }

  &__ticket {
    flex-basis: 40px;
    flex-shrink: 0;
    text-align: right;
  }
  &__button {
    flex-basis: 60px;
    flex-shrink: 0;
    button {
      width: 100%;
    }
  }
  &--hide {
    opacity: 0;
  }
  :global {
    .item {
      flex-basis: 25%;
      overflow: hidden;
      &:first-child,
      &:last-child {
        flex-basis: 30%;
      }
      div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.param {
  height: auto;
  line-height: auto;
}
.code {
  position: relative;
  max-width: 150px;
  padding: 10px;
  font-size: 0;
  text-align: center;
  border: 1px solid transparent;

  &__img {
    max-width: 100%;
  }
  &__number {
    font-size: 0.85rem;
  }
  &__list {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px dashed $color-border-base;
  }
  &__checkbox {
    z-index: -1;
    width: 0;
    height: 0;
    opacity: 0;
  }
  &--disabled {
    cursor: not-allowed;
    &::before {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      width: 4vw;
      height: 4vw;
      content: '';
      background: $color-state-success;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    &:after {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 1;
      width: 12px;
      height: 24px;
      content: '';
      border: solid white;
      border-width: 0 5px 5px 0;
      transform: translate(-50%, -50%) rotate(45deg);
    }
    .code__img {
      opacity: 0.5;
    }
  }
  &--checked {
    border-color: $color-primary;
  }

  & + & {
    margin-left: 10px;
  }
}
</style>
