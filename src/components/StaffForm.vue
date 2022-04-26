<script>
import lazyLoadComponent from '@router/lazyload-component'

const initData = () => {
  return {
    avatar: '',
    name: '',
    title: '',
    phoneCode: '+886',
    phoneNumber: '',
    description: '',
  }
}
export default {
  components: {
    BaseInputFloatingLabel: () =>
      lazyLoadComponent(import('@components/BaseInputFloatingLabel')),
    BaseUpload: () => lazyLoadComponent(import('@components/BaseUpload')),
    CountryCodePicker: () =>
      lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
  },
  data() {
    return {
      tryingStore: false,
      submitData: Object.assign(initData(), this.defaultValue),
    }
  },
  computed: {
    submitRules() {
      const isTaiwan = this.submitData.phoneCode === '+886'
      return {
        avatar: [
          {
            required: true,
            message: '請上傳頭像',
            trigger: 'change',
          },
        ],
        name: [
          {
            required: true,
            message: '請填寫姓名',
            trigger: 'blur',
          },
        ],
        title: [
          {
            // required: true,
            message: '請填寫稱謂',
            trigger: 'blur',
          },
        ],
        phoneCode: [
          {
            required: true,
            message: '請選擇電話國碼',
            trigger: 'change',
          },
        ],
        phoneNumber: [
          {
            required: true,
            message: '請填寫聯絡電話',
            trigger: 'blur',
          },
          {
            pattern: isTaiwan ? /^02\d{7,8}$|^09\d{8}$/ : '',
            message:
              '市話號碼格式請符合 02XXXXXXXX；手機號碼格式請符合 09XXXXXXXX',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: '請填寫介紹',
            trigger: 'blur',
          },
        ],
      }
    },
    isEditMode() {
      return this.defaultValue.id
    },
  },
  watch: {
    defaultValue: 'updateSubmitData',
  },
  methods: {
    async tryToStore() {
      await this.$refs.form.validate()
      this.tryingStore = true
      try {
        if (!this.isEditMode) {
          const newStaff = await this.$store
            .dispatch('staff/store', this.submitData)
            .then((response) => response.items)
          this.emitStore(newStaff)
        } else {
          await this.$store.dispatch('staff/store', this.submitData)
          this.emitStore()
        }
      } catch (error) {
        console.log('TCL: tryToStore -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    emitStore(newStaff = '') {
      this.$emit('store', newStaff)
      this.emitClose()
    },
    emitClose() {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    updateSubmitData() {
      this.submitData = Object.assign({}, this.defaultValue)
    },
  },
}
</script>

<template>
  <div>
    <el-form
      ref="form"
      :model="submitData"
      :rules="submitRules"
      label-position="top"
      class="el-form--floating"
      :validate-on-rule-change="false"
    >
      <el-form-item prop="avatar">
        <BaseUpload
          v-model="submitData.avatar"
          resource="staff"
          circle
          suggest-size="128/128"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="submitData.name" />
      </el-form-item>
      <el-form-item label="稱謂" prop="title">
        <el-input v-model="submitData.title" />
      </el-form-item>
      <el-form-item label="聯絡電話" prop="phoneNumber">
        <el-input v-model="submitData.phoneNumber">
          <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" />
        </el-input>
      </el-form-item>
      <el-form-item label="介紹" prop="description">
        <el-input
          v-model="submitData.description"
          type="textarea"
          :autosize="{ minRows: 2 }"
        />
      </el-form-item>
    </el-form>
    <div :class="$style.footer">
      <el-button @click="emitClose">取消</el-button>
      <el-button type="primary" :loading="tryingStore" @click="tryToStore">{{
        isEditMode ? '儲存' : '創建'
      }}</el-button>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
.footer {
  text-align: right;
}
</style>
