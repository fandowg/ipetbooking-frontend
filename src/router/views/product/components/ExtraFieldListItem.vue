<script>
import cloneDeep from 'lodash/cloneDeep'
import draggable from 'vuedraggable'
import { generateUniqueString } from '@utils'

const initData = () => {
  return {
    id: '',
    productId: '',
    title: '',
    state: 1,
    type: 'text',
    displayType: '',
    required: 1,
    params: {
      options: [],
    },
    showOtherAnswer: false,
  }
}
const otherAnswerData = {
  title: '其他',
  optionType: 'text',
}

function checkOtherAnswer(submitData) {
  if (submitData.params !== undefined) {
    const otherAnswerList = submitData.params.options.filter((option) => option.optionType === 'text')
    return otherAnswerList.length > 0
  }
  return false
}

export default {
  components: {
    draggable,
  },
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
    group: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      submitData: Object.assign(
        initData(),
        {
          productId: this.$route.params.productId,
          displayType: this.group,
          showOtherAnswer: checkOtherAnswer(this.defaultValue),
          default: 0,
        },
        this.defaultValue
      ),
      drag: false,
      loading: false,
      previousType: this.defaultValue.type || 'text',
    }
  },
  computed: {
    submitRules() {
      return {
        title: [
          {
            required: true,
            message: '請填寫問題標題',
          },
        ],
      }
    },
    showRemoveButton() {
      const minOptionNum = this.submitData.showOtherAnswer ? 2 : 1
      return this.submitData.params.options.length > minOptionNum
    },
  },
  watch: {
    defaultValue: 'updateSubmitData',
  },
  created() {
    this.originalData = cloneDeep(this.submitData)
  },
  methods: {
    onClickSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('save', {
            index: this.itemIndex,
            data: this.submitData,
          })
        }
      })
    },
    onClickButton(event) {
      if (event === 'cancel') this.submitData = cloneDeep(this.originalData)
      this.$emit(event, this.itemIndex, this.group)
    },
    updateSubmitData() {
      this.submitData = Object.assign(initData(), {
        showOtherAnswer: checkOtherAnswer(this.defaultValue),
        ...this.defaultValue,
      })
    },
    addOption() {
      const optionData = {
        title: '',
        optionType: 'default',
      }
      const options = this.submitData.params.options
      if (this.submitData.showOtherAnswer) {
        options.splice(options.length - 1, 0, optionData)
      } else options.push(optionData)
    },

    removeOption(index) {
      this.submitData.params.options.splice(index, 1)
    },
    updateOtherAnswerDisplay() {
      const otherAnswerOptionIndex = this.submitData.params.options.length - 1
      if (this.submitData.showOtherAnswer) this.removeOption(otherAnswerOptionIndex)
      else this.submitData.params.options.push(otherAnswerData)
      this.submitData.showOtherAnswer = !this.submitData.showOtherAnswer
    },
    checkPreviousTypeIsChoice() {
      return this.previousType === 'radio' || this.previousType === 'checkbox'
    },
    updatePreviousType(type) {
      this.previousType = type
    },
    clearOptions() {
      this.submitData.params.options = []
    },
    addDefaultOption() {
      this.submitData.params.options.length === 0 && this.addOption()
      this.submitData.showOtherAnswer = false
    },
    typeChanged(chosedType) {
      if (chosedType === 'text') {
        this.clearOptions()
      } else {
        if (this.checkPreviousTypeIsChoice()) return
        this.addDefaultOption()
      }
      this.updatePreviousType(chosedType)
    },
    async updateExtraField() {
      this.loading = true
      const response = await this.$store.dispatch('product/updateExtraField', this.submitData)
      this.loading = false
      response && this.$set(this.submitData, 'id', response.id)
    },
    generateUniqueString() {
      return generateUniqueString(15)
    },
  },
}
</script>

<template>
  <div>
    <div :class="[$style.header, isActive ? $style['read-only'] : '']">
      <div :class="$style['header__title']">
        <BaseIcon v-if="!submitData.default" name="grip-vertical" icon-style="fas" :class="[$style.drag, 'handle-subject']" />
        <el-tooltip v-else content="預設題目" placement="top">
          <BaseIcon name="lock-alt" :class="[$style.drag]" />
        </el-tooltip>

        <span>{{ submitData.title === '' ? `問題標題` : submitData.title }}</span>
      </div>
      <div v-if="!submitData.default">
        <el-tooltip effect="dark" content="編輯" placement="top">
          <el-button v-show="!isActive" class="is-round" :disabled="isDisabled" size="mini" type="primary" plain @click="onClickButton('edit')">
            <BaseIcon name="edit" />
          </el-button>
        </el-tooltip>
        <el-tooltip effect="dark" content="移除" placement="top">
          <el-button v-show="!isActive" class="is-round" :disabled="isDisabled" type="danger" size="mini" plain @click="onClickButton('remove')">
            <BaseIcon name="trash-alt" />
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div v-show="isActive" :class="$style.content">
      <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form--floating">
        <el-row :gutter="20">
          <el-col :sm="18" :span="24">
            <el-form-item label="問題標題" prop="title">
              <el-input v-model="submitData.title" placeholder="請輸入問題標題"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="6" :span="24">
            <el-form-item label="回答形式" prop="type">
              <el-select v-model="submitData.type" @change="typeChanged">
                <el-option label="簡答" value="text"></el-option>
                <el-option label="單選" value="radio"></el-option>
                <el-option label="複選" value="checkbox"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div v-if="submitData.type !== 'text'">
          <draggable v-model="submitData.params.options" animation="200" handle=".handle" @start="drag = true" @end="drag = false">
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
              <div v-for="(option, index) in submitData.params.options" :key="`${group}.${itemIndex}.${index}`">
                <el-row v-if="option.optionType !== 'text'" :gutter="10">
                  <el-col :span="1">
                    <el-button type="text" :class="[$style.drag, 'handle']">
                      <BaseIcon name="grip-vertical" icon-style="fas" />
                    </el-button>
                  </el-col>
                  <el-col :span="22">
                    <el-form-item :prop="'params.options.' + index + '.title'" :rules="{ required: true, message: '請填寫選項名稱' }" :label="`選項 ${index + 1}`">
                      <el-input v-model="option.title" placeholder="請輸入問題標題"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <el-button v-show="showRemoveButton" type="text" :class="$style['font-md']" @click="removeOption(index)">
                      <BaseIcon name="times" />
                    </el-button>
                  </el-col>
                </el-row>
              </div>
            </transition-group>
          </draggable>

          <el-row v-show="submitData.showOtherAnswer" :gutter="10">
            <el-col :span="22" :offset="1">
              <el-form-item label="  ">
                <el-input placeholder="其他" :disabled="true"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <el-button type="text" :class="$style['font-md']" @click="updateOtherAnswerDisplay">
                <BaseIcon name="times" />
              </el-button>
            </el-col>
          </el-row>
        </div>

        <div v-if="submitData.type !== 'text'">
          <el-row>
            <el-col :offset="1">
              <el-form-item>
                <el-button class="is-round" type="primary" @click="addOption">
                  <BaseIcon name="plus" />
                  <span>新增選項</span>
                </el-button>
                <span v-show="!submitData.showOtherAnswer">
                  <span style="margin: 0 10px;"> 或 </span>
                  <el-button class="is-round" @click="updateOtherAnswerDisplay">
                    <span>新增「其他」輸入框</span>
                  </el-button>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="此問題是否為必填" prop="required">
              <el-switch v-model="submitData.required" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <div :class="$style.footer">
          <el-button class="is-round" @click="onClickButton('cancel')">取消</el-button>
          <el-button class="is-round" :loading="loading" type="primary" @click="onClickSave">
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
  padding: 15px 0;
  h4 {
    display: inline-block;
    flex-shrink: 0;
  }
  &__title {
    display: inline-flex;
    flex: 1;
    align-items: center;
  }
  [class*='fa-'] + span {
    margin-left: 1.5em;
  }
}
.content {
  margin-top: 30px;
}
.time-range {
  :global {
    .el-form-item__content {
      display: flex;
    }
    .el-form-item {
      margin-bottom: 0 !important;
    }
  }
  &__separator {
    margin: 0 5px;
  }
}
.footer {
  padding-bottom: 15px;
  text-align: right;
  border-bottom: 2px solid $color-border-lighter;
}
.read-only {
  opacity: 0.5;
  cursor: not-allowed;
}
.font-md {
  font-size: 18px;
  padding: 10px 0;
  width: 100%;
}
.drag {
  color: lightgray;
  width: 100%;
}
.vs-hide {
  visibility: hidden;
  pointer-events: none;
}
</style>
