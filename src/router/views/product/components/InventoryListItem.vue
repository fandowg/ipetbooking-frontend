<script>
import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'
import ItemTitle from './InventoryListItemTitle'
import { formatRequestData } from '@utils/format-date'
import { daysInWeek } from '@utils/filter-value-to-text'

const minutesOfTime = (time = '00:00') => {
  const timeMatches = time.match(/^(\d+):(\d+)$/i)
  const [, hours, minutes] = timeMatches
  return Number(hours) * 60 + Number(minutes)
}
const initData = () => {
  const today = new Date()

  return {
    title: '',
    state: 1,
    startDate: today,
    endDate: today,
    startTime: '',
    endTime: '',
    inventory: '',
    repeat: '',
    repeatWith: [], // default with the day of today
    repeatEndDate: '',
  }
}

export default {
  components: { BaseInputFloatingLabel, ItemTitle },
  props: {
    itemIndex: {
      type: Number,
      default: 0,
    },
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
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      submitData: Object.assign(initData(), this.defaultValue),
      daysInWeek,
      endDatePickerOptions: {
        disabledDate: (time) => {
          // check String or Date Object
          const selectedStartDate =
            this.submitData.startDate instanceof Object
              ? this.submitData.startDate
              : new Date(this.submitData.startDate)
          const limitWith365Days =
            selectedStartDate.getTime() + 3600 * 1000 * 24 * 365
          return time < selectedStartDate || time.getTime() >= limitWith365Days
        },
      },
    }
  },
  computed: {
    submitRules() {
      const repeatIsEmpty = this.submitData.repeat === ''
      const repeatIsWeekMode = this.submitData.repeat === 'week'
      return {
        startDate: [
          {
            required: true,
            message: '請選擇起始日期',
            trigger: 'change',
          },
        ],
        startTime: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇時段開始時間'))
              if (this.submitData.endTime)
                this.$refs.form.validateField('endTime')

              callback()
            },
            trigger: 'change',
          },
        ],
        endDate: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇結束日期'))
              if (this.submitData.endTime)
                this.$refs.form.validateField('endTime')

              callback()
            },
            trigger: 'change',
          },
        ],
        endTime: [
          {
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇時段結束時間'))

              const { startDate, endDate, startTime } = this.submitData
              const isSameDate =
                startDate instanceof Date
                  ? startDate.getDate() === endDate.getDate()
                  : startDate === endDate

              if (
                isSameDate &&
                minutesOfTime(startTime) >= minutesOfTime(value)
              )
                return callback(new Error('結束時間不可早於開始時間'))
              callback()
            },
            trigger: 'change',
          },
        ],
        inventory: [
          {
            required: !this.isEditGroup,
            min: 0,
            type: 'number',
            trigger: 'change',
            message: '請輸入大於 0 之數字',
          },
        ],
        repeatWith: [
          {
            type: 'array',
            required: repeatIsWeekMode,
            message: '請選擇重複的星期',
            trigger: 'change',
          },
        ],
        repeatEndDate: [
          {
            required: !repeatIsEmpty,
            message: '請選擇重複結束日期',
            trigger: 'change',
          },
        ],
      }
    },
    isEditMode() {
      return !!this.defaultValue && !!this.defaultValue.id
    },
    isEditGroup() {
      return !!this.defaultValue && !this.defaultValue.hasOwnProperty('groupId')
    },
  },
  watch: {
    defaultValue: 'updateSubmitData',
  },
  methods: {
    formatSubmitData(submitData) {
      const {
        startDate,
        endDate,
        repeat,
        repeatWith,
        repeatEndDate,
        ...restSubmitData
      } = submitData
      const repeatData = repeat
        ? {
            repeat,
            repeatWith,
            repeatEndDate: formatRequestData(repeatEndDate) || '',
          }
        : { repeat }
      return {
        ...restSubmitData,
        startDate: formatRequestData(startDate),
        endDate: formatRequestData(endDate),
        ...repeatData,
      }
    },
    onClickSave() {
      this.$refs.form.validate((valid) => {
        if (valid)
          this.$emit('save', {
            index: this.itemIndex,
            data: this.formatSubmitData(Object.assign({}, this.submitData)),
          })
      })
    },
    onClickButton(event) {
      this.$emit(event, this.itemIndex)
    },
    updateSubmitData() {
      this.submitData = Object.assign(initData(), this.defaultValue)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
  },
}
</script>

<template>
  <div>
    <div :class="$style.header">
      <div :class="$style['header__title']">
        <h4 v-if="submitData.title">{{
          `#${itemIndex + 1} ${submitData.title || '時段'}`
        }}</h4>
        <ItemTitle :date-time-repeat="{ ...submitData }" />
      </div>
      <div v-if="!isActive">
        <el-tooltip effect="dark" content="編輯" placement="top">
          <el-button
            :disabled="isDisabled"
            size="mini"
            plain
            @click="onClickButton('edit')"
          >
            <BaseIcon name="edit" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="移除" placement="top">
          <el-button
            :disabled="isDisabled"
            type="danger"
            size="mini"
            plain
            @click="onClickButton('remove')"
          >
            <BaseIcon name="trash-alt" />
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div v-show="isActive" :class="$style.content">
      <el-form
        ref="form"
        :model="submitData"
        :rules="submitRules"
        label-position="top"
        class="el-form--floating"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              v-if="!isEditMode || (isEditMode && isEditGroup)"
              label="時段群組標題"
              prop="title"
            >
              <el-input v-model="submitData.title" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="時段開放"
              prop="state"
              data-tour-step="5"
              data-tour-text="若目前不想將此時段讓客戶訂購，請將時段切換至關閉。"
            >
              <el-switch
                v-model="submitData.state"
                active-text="開"
                inactive-text="關"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="11">
            <el-form-item
              :class="$style['form-item--split']"
              label="開始日期與時間"
              :disabled="isEditMode && !isEditGroup"
              data-tour-step="1"
              data-tour-text="由此開始設定活動排程，請選擇活動開始日期。"
              required
            >
              <el-form-item
                class="el-form-item--normal-margin"
                prop="startDate"
              >
                <el-date-picker
                  v-model="submitData.startDate"
                  :disabled="isEditMode"
                  format="yyyy/MM/dd"
                  type="date"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                class="el-form-item--normal-margin"
                prop="startTime"
              >
                <el-time-picker
                  v-model="submitData.startTime"
                  :disabled="isEditMode && isEditGroup"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="選擇開始時間"
                  :clearable="false"
                ></el-time-picker>
              </el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="2" :class="$style['form-item--separator']">～</el-col>
          <el-col :span="11">
            <el-form-item
              :class="$style['form-item--split']"
              label="結束日期與時間"
              required
              data-tour-step="2"
              data-tour-text="設定活動結束時間。若是有不同時段，請再新增一個時段唷！"
            >
              <el-form-item
                class="el-form-item--normal-margin"
                prop="endDate"
                :disabled="isEditMode && !isEditGroup"
              >
                <el-date-picker
                  v-model="submitData.endDate"
                  :disabled="isEditMode"
                  format="yyyy/MM/dd"
                  type="date"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="el-form-item--normal-margin" prop="endTime">
                <el-time-picker
                  v-model="submitData.endTime"
                  :disabled="isEditMode && isEditGroup"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="選擇結束時間"
                  :clearable="false"
                ></el-time-picker>
              </el-form-item>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item
              v-if="!isEditMode || (isEditMode && isEditGroup)"
              label="是否重複"
              prop="repeat"
              data-tour-step="3"
              data-tour-text="若活動是每天或每週星期五都有，請選擇對應重複頻率，並選擇重複結束日期，快速建立活動排程！"
            >
              <el-select v-model="submitData.repeat" :disabled="isEditMode">
                <el-option label="不重複" value></el-option>
                <el-option label="每天" value="day"></el-option>
                <el-option label="每週" value="week"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              :label="isEditMode && isEditGroup ? '覆寫人數上限' : '人數上限'"
              prop="inventory"
              data-tour-step="4"
              data-tour-text="請輸入此時段可供預約人數。例如此時段只能讓 10 人預約，請輸入 10。"
            >
              <el-input
                v-model.number="submitData.inventory"
                min="0"
              />
            </el-form-item>
          </el-col>
          <template v-if="!!submitData.repeat || (isEditMode && !isEditGroup)">
            <el-col v-if="submitData.repeat === 'week'" :span="24" :sm="12">
              <el-form-item
                v-if="!isEditMode || (isEditMode && isEditGroup)"
                label="重複於"
                prop="repeatWith"
              >
                <el-checkbox-group
                  v-model="submitData.repeatWith"
                  :min="1"
                  :disabled="isEditMode"
                >
                  <el-checkbox-button
                    v-for="(weekDay, index) in daysInWeek"
                    :key="index"
                    :label="String(index)"
                    >{{ weekDay }}</el-checkbox-button
                  >
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                v-if="!isEditMode || (isEditMode && isEditGroup)"
                label="重複結束於"
                prop="repeatEndDate"
              >
                <el-date-picker
                  v-model="submitData.repeatEndDate"
                  :disabled="isEditMode && isEditGroup"
                  :picker-options="endDatePickerOptions"
                  type="date"
                  format="yyyy/MM/dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </template>
        </el-row>

        <div :class="$style.footer">
          <el-button
            v-if="canCancel"
            @click="onClickButton('cancel')"
            >取消</el-button
          >
          <el-button
            type="primary"
            data-tour-step="6"
            data-tour-text="最後別忘記按下「完成」，完成此時段新增了唷！"
            @click="onClickSave"
          >
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
    flex-shrink: 0;
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
.footer {
  padding-bottom: 15px;
  text-align: right;
  border-bottom: 2px solid $color-border-lighter;
}
</style>
