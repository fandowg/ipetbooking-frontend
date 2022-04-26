<script>
import {
  genderFilter,
  orderStatusFilter,
  orderSourceFilter,
} from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

export default {
  filters: {
    genderFilter,
    orderStatusFilter,
    orderSourceFilter,
    formatDate,
  },
  props: {
    orderId: {
      type: String,
      required: true,
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
  watch: {
    orderId: {
      immediate: true,
      handler: 'tryToGetOrder'
    }
  },
  computed: {
    enabledUseSelectedCodes() {
      return this.selectedCodes.length > 0
    },
  },
  methods: {
    async tryToGetOrder() {
      this.tryingToGetOrder = true
      this.checkInOrder = await this.$store.dispatch(
        'order/fetchSingle',
        this.orderId
      )
      this.checkInDialogVisible = true
      this.tryingToGetOrder = false
    },
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
        // this.$emit('update')
        this.tryToGetOrder()
      } catch (error) {
        this.tryingToVerify = false
      }
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
  <div>
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
  </div>
</template>
<style lang="scss" module>
@import '@design';
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
