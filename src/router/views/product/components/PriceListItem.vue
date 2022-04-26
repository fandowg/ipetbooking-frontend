<script>
import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'
import ItemTitle from './PriceListItemTitle'
import { merchantComputed } from '@state/helpers'
import formatDate, { formatRequestData } from '@utils/format-date'


const minutesOfTime = (time = '00:00') => {
  const timeMatches = time.match(/^(\d+):(\d+)$/i)
  const [, hours, minutes] = timeMatches
  return Number(hours) * 60 + Number(minutes)
}

const initData = () => {
  return {
    state: 1,
    title: '',
    introtext: '',
    description: '',
    basePrice: '0',
    price: '0',
    size: '1',
    saleStartDate: '',
    saleStartTime: '',
    saleEndDate: null,
    saleEndTime: null,
    infinity: 0,
    inventory: '1',
    isSaleTimeLimited: 0,
  }
}

const formatDefaultValue = (initData, defaultValue) => {
  const today = new Date()
  let saleStartDate = formatDate(today, 'dateTime')
  let saleStartTime = formatDate(today, 'dateTime').split(' ')[1]
  let saleEndDate = null
  let saleEndTime = null
  if (defaultValue.saleStartDate) {
    let startTime = defaultValue.saleStartDate.split(' ')[1]
    saleStartDate = defaultValue.saleStartDate.split(' ')[0]
    saleStartTime = `${startTime.split(':')[0]}:${startTime.split(':')[1]}`
  }
  if (defaultValue.saleEndDate) {
    let endTime = defaultValue.saleEndDate.split(' ')[1]
    saleEndDate = defaultValue.saleEndDate.split(' ')[0]
    saleEndTime = `${endTime.split(':')[0]}:${endTime.split(':')[1]}`
  }
  return {
    ...Object.assign(initData, defaultValue),
    saleStartDate,
    saleStartTime,
    saleEndDate,
    saleEndTime,
  }
}

export default {
  components: {
    BaseInputFloatingLabel,
    ItemTitle,
  },
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    canCancel: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    itemIndex: {
      type: Number,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    const submitData = formatDefaultValue(initData(), this.defaultValue)
    return {
      submitData,
      canSetPrice: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
    }
  },
  computed: {
    ...merchantComputed,
    submitRules() {
      return {
        title: [
          {
            required: true,
            message: '請填寫方案名稱',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: '請填寫方案內容',
            trigger: 'blur',
          },
        ],
        basePrice: [
          {
            required: true,
            message: '請輸入原始價格',
            trigger: 'change',
          },
        ],
        price: [
          {
            required: true,
            message: '請輸入販售價格',
            trigger: 'change',
          },
        ],
        size: [
          {
            required: true,
            message: '請輸入使用人數',
            trigger: 'blur',
          },
        ],
        inventory: [
          {
            required: true,
            message: '請輸庫存數量',
            trigger: 'blur',
          },
        ],
        saleStartDate: [
          {
            required: true,
            message: '請選擇起始日期',
            trigger: 'change',
          },
        ],
        saleStartTime: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇時段開始時間'))
              if (this.submitData.saleEndTime) this.$refs.form.validateField('saleEndTime')

              callback()
            },
            trigger: 'change',
          },
        ],
        saleEndDate: [
          {
            validator: (rule, value, callback) => {
              if (this.submitData.saleEndTime === null) {
                if (value === null) {
                  this.$refs.saleEndDate.resetField()
                  this.$refs.saleEndTime.resetField()
                }
                callback()
                return
              }
              if (!value && this.submitData.saleEndTime !== null) return callback(new Error('請選擇結束日期'))
              if (this.submitData.saleEndTime) this.$refs.form.validateField('saleEndTime')
              callback()
            },
            trigger: 'change',
          },
        ],
        saleEndTime: [
          {
            validator: (rule, value, callback) => {
              if (this.submitData.saleEndDate === null) {
                if (value === null) {
                  this.$refs.saleEndTime.resetField()
                  this.$refs.saleEndDate.resetField()
                }
                callback()
                return
              }
              if (this.submitData.saleEndDate !== null) if (!value) return callback(new Error('請選擇時段結束時間'))

              const { saleStartDate, saleEndDate, saleStartTime } = this.submitData
              const isSameDate = saleStartDate instanceof Date ? saleStartDate.getDate() === saleEndDate.getDate() : saleStartDate === saleEndDate

              if (isSameDate && minutesOfTime(saleStartTime) >= minutesOfTime(value)) return callback(new Error('結束時間不可早於開始時間'))
              callback()
            },
            trigger: 'change',
          },
        ],
      }
    },
    availableAmount() {
      const amount = this.submitData.inventory - this.defaultValue.qty
      return amount < 0 ? 0 : amount
    },
  },
  created() {
    this.checkCanSetPrice()
  },
  methods: {
    emitSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('save', {
            index: this.itemIndex,
            data: this.formatSubmitData(Object.assign({}, this.submitData)),
          })
        }
      })
    },
    emitButtonEvent(event) {
      this.$emit(event, this.itemIndex)
    },
    async checkCanSetPrice() {
      if (!this.$can('api', 'setPrice')) {
        const merchantInfo = this.currentMerchant
        if (merchantInfo === '' || merchantInfo.cashflowSetting !== 1) {
          const settings = await this.$store.dispatch('merchant/fetchSingle')
          this.canSetPrice = settings.cashflowSetting === 1
          return
        }
      }

      this.canSetPrice = this.$can('api', 'setPrice')
    },
    formatSubmitData(submitData) {
      const { saleStartDate, saleEndDate, saleStartTime, saleEndTime, ...restSubmitData } = submitData
      return {
        ...restSubmitData,
        saleStartDate: formatRequestData(saleStartDate) + ' ' + saleStartTime,
        saleEndDate: saleEndDate === null ? '' : formatRequestData(saleEndDate) + ' ' + saleEndTime,
      }
    },
  },
}
</script>

<template>
  <div>
    <div :class="$style.header">
      <div :class="$style['header__title']">
        <h4>#{{ itemIndex + 1 }}</h4>
        <ItemTitle :title-prices="{ ...submitData }" />
      </div>

      <div v-if="!isActive">
        <el-switch v-if="submitData.id" v-model="submitData.state" active-text="開" inactive-text="關" :active-value="1" :inactive-value="0" :class="$style.switcher" @change="emitSave"></el-switch>
        <el-tooltip effect="dark" content="編輯" placement="top">
          <el-button :disabled="isDisabled" size="mini" @click="emitButtonEvent('edit')">
            <BaseIcon name="edit" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="移除" placement="top">
          <el-button :disabled="isDisabled" type="danger" size="mini" plain @click="emitButtonEvent('remove')">
            <BaseIcon name="trash-alt" />
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div v-show="isActive" :class="$style.content">
      <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form--floating">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="名稱" prop="title" data-tour-step="1" data-tour-text="給此方案一個名稱，讓客戶可以了解不同方案的差異性。">
              <el-input v-model="submitData.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="方案開放" prop="state" data-tour-step="4" data-tour-text="若目前不想將此方案顯示於訂購頁讓客戶看到，請將此方案切換至關閉。">
              <el-switch v-model="submitData.state" active-text="開" inactive-text="關" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="簡述" prop="introtext" data-tour-step="2" data-tour-text="簡短描述此方案的內容，讓客戶可以大略知道此方案提供哪些內容。">
              <el-input v-model="submitData.introtext" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="內容" prop="description">
              <el-input v-model="submitData.description" type="textarea" :autosize="{ minRows: 2 }" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="原價" prop="basePrice">
              <el-tooltip :disabled="canSetPrice" effect="dark" content="申請金流並開通後即可編輯價格" placement="top">
                <el-input v-model.number="submitData.basePrice" :disabled="!canSetPrice" min="0" />
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="售價" prop="price">
              <el-input v-model.number="submitData.price" :disabled="!canSetPrice" min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="使用人數" prop="size" data-tour-step="3" data-tour-text="此方案可供幾名客戶使用呢？">
              <el-input v-model.number="submitData.size" min="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="庫存設定" prop="infinity">
              <el-radio-group v-model="submitData.infinity">
                <el-radio :label="1">無限量</el-radio>
                <el-radio :label="0">限量</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="submitData.infinity === 0">
            <el-col :span="12"
              ><el-form-item label="調整庫存數量" prop="inventory">
                <el-input v-model.number="submitData.inventory" :class="$style['price-qty']" min="1">
                  <div v-if="defaultValue.qty !== undefined" slot="append">已售出：{{ defaultValue.qty }}</div>
                </el-input>
              </el-form-item></el-col
            >
            <el-col v-if="defaultValue.qty !== undefined" :span="6"
              ><el-form-item label="實際可販售數量"> <el-input v-model="availableAmount" disabled></el-input> </el-form-item
            ></el-col>
          </template>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="販售時間">
              <el-radio-group v-model="submitData.isSaleTimeLimited">
                <el-radio :label="0">立即販售</el-radio>
                <el-radio :label="1">限時販售</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <template v-if="submitData.isSaleTimeLimited">
            <el-col :span="11">
              <el-form-item :class="$style['form-item--split']" label="開賣日期與時間" required>
                <el-form-item class="el-form-item--normal-margin" prop="saleStartDate">
                  <el-date-picker v-model="submitData.saleStartDate" format="yyyy/MM/dd" type="date" :clearable="false" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-form-item class="el-form-item--normal-margin" prop="saleStartTime">
                  <el-time-picker v-model="submitData.saleStartTime" format="HH:mm" value-format="HH:mm" placeholder="選擇開始時間" :clearable="false"></el-time-picker>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col :span="2" :class="$style['form-item--separator']">～</el-col>
            <el-col :span="11">
              <el-form-item :class="$style['form-item--split']" label="結束日期與時間">
                <el-form-item ref="saleEndDate" class="el-form-item--normal-margin" prop="saleEndDate">
                  <el-date-picker v-model="submitData.saleEndDate" format="yyyy/MM/dd" type="date" clearable :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-form-item ref="saleEndTime" class="el-form-item--normal-margin" prop="saleEndTime">
                  <el-time-picker v-model="submitData.saleEndTime" format="HH:mm" value-format="HH:mm" placeholder="選擇結束時間" clearable></el-time-picker>
                </el-form-item>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <div :class="$style.footer">
          <el-button v-if="canCancel" @click="emitButtonEvent('cancel')">取消</el-button>
          <el-button type="primary" data-tour-step="5" data-tour-text="最後別忘記按下「完成」，完成此方案新增了唷！" @click="emitSave">
            <BaseIcon name="check" />
            <span>完成</span>
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid $color-border-lighter;
  h4 {
    display: inline-block;
  }
  &__title {
    display: inline-flex;
    flex: 1;
    align-items: center;
  }
}
.content {
  margin-top: 30px;
}
.switcher {
  margin-right: 10px;
}

.footer {
  padding-bottom: 15px;
  text-align: right;
  border-bottom: 2px solid $color-border-lighter;
}

.form-item {
  &--split {
    :global {
      .el-form-item__content {
        display: flex;
        align-items: center;
      }
      .el-form-item + .el-form-item {
        margin-left: 10px;
      }
    }
  }
  &--separator {
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
}
.price-qty {
  :global {
    .el-input-group__append {
      border: none;
      background-color: #f2f2f2;
      color: #2f8d96;
    }
  }
}
</style>
