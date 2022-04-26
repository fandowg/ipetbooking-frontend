<script>
import { merchantUserComputed } from '@state/helpers'
import PermissionTable from './PermissionTable'
import BaseInputFloatingLabel from '@components/BaseInputFloatingLabel'

const initData = () => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    groupIds: [],
    block: 0,
  }
}
const ownerGroupId = 7

export default {
  components: { PermissionTable, BaseInputFloatingLabel },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
    visible:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      tryingStore: false,
      showPasswordField: false,
      submitData: Object.assign(initData(), this.defaultValue),
      passwordVisible: false,
      repasswordVisible: false,
    }
  },
  computed: {
    ...merchantUserComputed,
    isEditMode() {
      return this.defaultValue.id
    },
    isOwner() {
      return (
        (this.defaultValue.groupIds &&
          this.defaultValue.groupIds.includes(ownerGroupId)) ||
        false
      )
    },
    filterOwnerGroupList() {
      const ownerGroup = (groupId) => groupId === ownerGroupId
      return this.userGroupList.filter((group) =>
        this.isOwner ? this.isOwner : !ownerGroup(group.id)
      )
    },
    submitRules() {
      return {
        email: [
          { required: true, message: '請輸入 Email', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value && !this.isEditMode) {
                this.$store
                  .dispatch('merchant/validUserEmail', value)
                  .then(() => callback())
                  .catch(() => callback(new Error('此 Email 已被註冊')))
              } else {
                callback()
              }
            },
            type: 'email',
            // trigger: 'blur',
          },
        ],
        password: [
          {
            required:
              !this.isEditMode || (this.isEditMode && this.showPasswordField),
            message: '請輸入密碼',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*#?&])|(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*#?&])|(?=.*[a-z])(?=.*[0-9])(?=.*[$@$!%*#?&]).{8,16}/
              const passwordConfirmValue = this.submitData.passwordConfirm
              if (!passwordPattern.test(value)) {
                callback(
                  new Error('請用 8~16 個大小寫英文字母、數字與特殊符號組合')
                )
              }
              if (passwordConfirmValue !== '') {
                this.$refs.form.validateField('passwordConfirm')
              }

              callback()
            },
            trigger: 'blur',
          },
        ],
        passwordConfirm: [
          {
            required:
              !this.isEditMode || (this.isEditMode && this.showPasswordField),
            message: '請再次輸入密碼',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              const passwordValue = this.submitData.password
              if (value !== passwordValue) {
                callback(new Error('兩次輸入的密碼不一致'))
              } else {
                callback()
              }
            },
            trigger: 'blur',
          },
        ],
        groupIds: [
          {
            type: 'array',
            required: true,
            message: '請至少選擇一種身份',
            trigger: 'change',
          },
        ],
        firstName: [{ required: true, message: '請輸入名字', trigger: 'blur' }],
        lastName: [{ required: true, message: '請輸入姓氏', trigger: 'blur' }],
      }
    },
  },
  watch: {
    defaultValue: 'updateSubmitData',
    visible:{
      handler(value){
        if(value && !this.isEditMode){
           setTimeout(()=>{
              this.$refs.form.resetFields()
        
            },2000)
        }
      },
      immediate:true
      
    }
  },
  mounted() {
      

   
  },
  methods: {
    async tryToStore() {
      await this.$refs.form.validate()
      this.tryingStore = true
      try {
        await this.$store.dispatch('merchant/storeUser', this.submitData)
        this.emitStore()
      } catch (error) {
        // console.log('TCL: tryToStore -> error', error)
      } finally {
        this.tryingStore = false
      }
    },
    emitStore() {
      this.$emit('store')
      this.emitClose()
    },
    emitClose() {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    updateSubmitData() {
      this.submitData = Object.assign(initData(), this.defaultValue)
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
      :validate-on-rule-change="false"
      label-position="top"
      class="el-form--floating"
      autocomplete="off"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="名字" prop="firstName" required>
            <el-input v-model="submitData.firstName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓氏" prop="lastName" required>
            <el-input v-model="submitData.lastName" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Email" prop="email">
            <el-input
              v-model="submitData.email"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="isEditMode" :span="24">
          <el-button
            type="text"
            :class="$style.toggler"
            @click="showPasswordField = !showPasswordField"
            >{{ showPasswordField ? '取消變更密碼' : '變更密碼' }}</el-button
          >
        </el-col>

        <template v-if="!isEditMode || (isEditMode && showPasswordField)">
          <el-col :span="12">
            <el-form-item label="密碼" prop="password">
              <el-input
                v-model="submitData.password"
                :type="passwordVisible ? 'text' : 'password'"
                autocomplete="off"
              >
               <template v-slot:append>
                  <el-button @click="passwordVisible = !passwordVisible">
                    <BaseIcon :name="passwordVisible ? 'eye-slash' : 'eye'" />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="再次輸入密碼" prop="passwordConfirm">
              <el-input
                v-model="submitData.passwordConfirm"
                :type="repasswordVisible ? 'text' : 'password'"
                autocomplete="off"
              >
               <template v-slot:append>
                  <el-button @click="repasswordVisible = !repasswordVisible">
                    <BaseIcon :name="repasswordVisible ? 'eye-slash' : 'eye'" />
                  </el-button>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="24">
          <el-form-item
            label="所屬身份（可複選）"
            prop="groupIds"
            :class="$style['form-item--last']"
          >
            <el-checkbox-group
              v-model="submitData.groupIds"
              
            >
              <el-checkbox
                v-for="group in filterOwnerGroupList"
                :key="group.id"
                :label="group.id"
                :disabled="group.id === 7"
                >{{ group.title }}</el-checkbox
              >
            </el-checkbox-group>
            <el-collapse>
              <el-collapse-item title="查看各個身份權限表">
                <PermissionTable />
              </el-collapse-item>
            </el-collapse>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="!isOwner" label="帳號啟用" prop="block">
            <el-switch v-model="submitData.block" active-text="啟用" inactive-text="停權" :active-value="0" :inactive-value="1" :disabled="defaultValue.canBlock === 0"></el-switch>
            <el-alert v-if="defaultValue.canBlock === 0" title="欲停權請先移轉隸屬此帳號的有效訂單" type="warning" style="display: inline; margin-left: 20px;" :closable="false" show-icon> </el-alert>
          </el-form-item>
        </el-col>
      </el-row>
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
.toggler {
  margin-bottom: 15px;
}

.form-item--last {
  margin-top: 30px;
}
.footer {
  text-align: right;
}
</style>
