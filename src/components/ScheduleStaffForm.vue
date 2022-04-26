<script>
import lazyLoadComponent from '@router/lazyload-component'
import { formatGetTime } from '@utils/format-date'
import { merchantUserComputed } from '@state/helpers'
import { messageStroe, messageDelete } from '@utils/message'
import { notification } from '@utils/notification'
// import { nextTick } from 'vuedraggable'

const initData = () => {
  return {
    avatar: '',
    name: '',
    title: '',
    phoneCode: '+886',
    phoneNumber: '',
    specialty: '',
    certificate: '',
    description: '',
    password: '',
    passwordConfirm: '',
    takeOfficeDate: '',
    leaveOfficeDate: '',
    block: 0,
    maxCollision:1,
    userGroupIds:[]
    // customerLimit: 1,
  }
}
export default {
  components: {
    BaseInputFloatingLabel: () => lazyLoadComponent(import('@components/BaseInputFloatingLabel')),
    BaseUpload: () => lazyLoadComponent(import('@components/BaseUpload')),
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
    ScheduleStaffServiceForm: () => lazyLoadComponent(import('@components/ScheduleStaffServiceForm')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
    type: {
      type: String,
      default: 'new',
    },
    accessType: {
      type: String,
      default: '',
    },
    accountId:{
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      tryingStore: false,
      submitData: Object.assign(initData(), this.defaultValue),
      endDatePickerOptions: {
        disabledDate: (time) => {
          // check String or Date Object
          const selectedStartDate = this.submitData.takeOfficeDate instanceof Object ? this.submitData.takeOfficeDate : new Date(this.submitData.takeOfficeDate)
          const limitWith365Days = selectedStartDate.getTime() + 3600 * 1000 * 24 * 365
          return time < selectedStartDate || time.getTime() >= limitWith365Days
        },
      },
      activeTab: '1',
      passwordVisible: false,
      repasswordVisible: false,
      passwordEditable:false,
      // isShow:false
    }
  },
  computed: {
    ...merchantUserComputed,
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
        email: [
          { required: true, message: '請輸入 Email' },
          { type: 'email', message: '請輸入正確的 Email 格式' },
        ],
        password: [
          {
            required: !this.isEditMode,
            message: '請輸入密碼',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              const passwordPattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[$@$!%*#?&])|(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*#?&])|(?=.*[a-z])(?=.*[0-9])(?=.*[$@$!%*#?&]).{8,16}/
              if (!passwordPattern.test(value)) {
                callback(new Error('請用 8~16 個大小寫英文字母、數字與特殊符號組合'))
              }
              if (this.submitData.passwordConfirm !== '') {
                this.$refs.form.validateField('passwordConfirm')
              }
              callback()
            },
            trigger: 'blur',
          },
        ],
        passwordConfirm: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請再次輸入密碼'))
              const passwordValue = this.submitData.password
              if (value !== passwordValue) {
                callback(new Error('兩次輸入的密碼不一致'))
              }
              callback()
            },
            trigger: 'blur',
          },
        ],
        title: [
          {
            required: true,
            message: '請填寫職位',
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
            message: '市話號碼格式請符合 02XXXXXXXX；手機號碼格式請符合 09XXXXXXXX',
            trigger: 'blur',
          },
        ],
        takeOfficeDate: [
          {
            validator: (rule, value, callback) => {
              if (this.submitData.takeOfficeDate) this.$refs.form.validateField('leaveOfficeDate')

              callback()
            },
            trigger: 'change',
          },
        ],
        leaveOfficeDate: [
          {
            validator: (rule, value, callback) => {
              // console.log(this.submitData.takeOfficeDate,value)
              // console.log(formatGetTime(this.submitData.takeOfficeDate))
              if (this.submitData.takeOfficeDate && !!value) {
                
                const isSmallThanTakeOfficeDate = formatGetTime(this.submitData.takeOfficeDate) > formatGetTime(value)
                if (isSmallThanTakeOfficeDate) return callback(new Error('不得小於到職日期'))
              }
              callback()
            },
            trigger: 'change',
          },
        ],
        userGroupIds:[
            {
            required: true,
            message: '請選擇權限',
            // trigger: 'blur',
          },
        ],
        maxCollision:[
          {
            required: true,
            message: '請輸入同時服務的顧客數',
            // trigger: 'blur',
          },
        ]
      }
    },
    isEditMode() {
      return this.defaultValue.id
    },
  },
  watch: {
    defaultValue: 'updateSubmitData',
    // isEditMode(value){
    //   if(!value){
    //     this.passwordEditable=true
    //   }
    // }
  },
  created() {
    // console.log(123)
    this.$store.dispatch('merchant/fetchUserGroups')
    if(this.submitData.userGroupIds.length===0){
    this.submitData.userGroupIds = this.submitData.userGroups ? [...this.submitData.userGroups.map(item=>item.id)] : []
    }
    // this.submitData.userGroupIds = this.submitData.accountId ? 
    this.submitData.phoneCode= '+886'
    if(!this.isEditMode){
      this.passwordEditable=true
    }
    if(this.accountId!==0){
      this.passwordEditable=true
    }
  },
  mounted() {
    //  this.$nextTick(()=>{
    //   this.$refs.form.resetFields()
    //   },2000)
    if(!this.isEditMode){
      setTimeout(()=>{
        // this.isShow = true
        this.$refs.form.resetFields()
      },2000)
    }
      
  },
  methods: {
    async tryToStore() {
      if(this.activeTab === '1'){
        await this.$refs.form.validate()
      }
      if(this.activeTab === '2'){
        await this.$refs.step2.validate()
      }
      // await this.$refs.form.validate()
      this.tryingStore = true
      try {
        // console.log(this.$refs.step2)
        // const productIds = this.submitData.productIds.map((item) => item.id)
        let submitData ={}
        if(!this.$refs.step2){
          submitData = Object.assign({}, this.submitData)
        } else {
          submitData = Object.assign({}, this.submitData,this.$refs.step2.filterSubmitData)
        }
        if (!this.isEditMode) {
          if(this.accountId){
            const accountUser =  await this.$store.dispatch('schedule/sendLinkUser', { userId: this.accountId })
            //  console.log(items)
            submitData.id = accountUser.id
           
          }
          const newStaff = await this.$store.dispatch('schedule/storeStaff', submitData)
          messageStroe('add')
          notification('排班人員','排班','schedule')
          this.emitStore(newStaff)
        } else {
          await this.$store.dispatch('schedule/storeStaff', submitData)
          messageStroe('edit')
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
    async toNext(){
      await this.$refs.form.validate()
      this.activeTab = '2'
    },
    async beforeTabSwitch(activeName, oldActiveName) {
      
      if(oldActiveName==='1'){
        // console.log(activeName, oldActiveName)
       await this.$refs.form.validate()
      }
    },
  },
}
</script>

<template>
  <div :class="[$style.page, { isEmployee: accessType === 'employee' }]">
    <div v-if="accessType === 'employee'" class="right-top-btn" @click="emitClose">
    <BaseIcon name="times" icon-style="fal" class="right-top-btn"/>
    </div>
    <BasePageHeader v-if="accessType === 'employee'" title="編輯資料" />
    <!-- <BasePageHeader v-else :title="!isEditMode ? '創建人員' : '編輯人員'" /> -->

    <el-tabs v-model="activeTab" :type="accessType !== 'employee' ? 'border-card' : ''" :before-leave="beforeTabSwitch" stretch>
      <el-tab-pane key="0" label="基本資訊" name="1">
        <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form--floating" :validate-on-rule-change="false">
          <div :class="{ ['bottom-line-box']: accessType !== 'employee' }">
            <el-row :gutter="40">
              <el-col v-if="accessType !== 'employee'" :md="18">
                <el-row :gutter="40" type="flex">
                  <el-col :md="12">
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="submitData.name" />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="!defaultValue.userGroupIds.includes(7)" :md="12">
                    <el-form-item label="帳號啟用" prop="block">
                      <el-switch v-model="submitData.block" active-text="啟用" inactive-text="停權" :active-value="0" :inactive-value="1" :disabled="defaultValue.canBlock === 0"></el-switch>
                      <el-alert v-if="defaultValue.canBlock === 0" title="欲停權請先移轉隸屬此帳號的有效訂單" type="warning" style="display: inline; margin-left: 20px" :closable="false" show-icon>
                      </el-alert>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12">
                    <el-form-item label="職位" prop="title">
                      <el-input v-model="submitData.title" />
                    </el-form-item>
                  </el-col>
                  <el-col :md="12">
                    <el-form-item label="聯絡電話" prop="phoneNumber">
                      <el-input v-model="submitData.phoneNumber">
                        <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" />
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12">
                    <el-form-item label="到職日期" prop="takeOfficeDate">
                      <el-date-picker v-model="submitData.takeOfficeDate" type="date"  value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :md="12">
                    <el-form-item label="離職日期" prop="leaveOfficeDate">
                      <el-date-picker v-model="submitData.leaveOfficeDate" :picker-options="endDatePickerOptions" type="date" value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col v-if="accessType !== 'employee'" :md="6">
                <el-form-item prop="avatar">
                  <BaseUpload v-model="submitData.avatar" resource="staff" circle suggest-size="128/128" />
                </el-form-item>
              </el-col>
              <el-col v-if="accessType === 'employee'" :md="24">
                <el-row :gutter="40" style="padding-top:20px">
                  <el-col :md="12" >
                    <el-form-item label="姓名" prop="name">
                      <el-input v-model="submitData.name" />
                    </el-form-item>
                  </el-col>
                  <el-col :md="12">
                    <el-form-item label="聯絡電話" prop="phoneNumber">
                      <el-input v-model="submitData.phoneNumber">
                        <CountryCodePicker slot="prepend" v-model="submitData.phoneCode" />
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>

          <el-row :gutter="40" type="flex">
            <el-col v-if="accessType !== 'employee'" :md="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="submitData.email" />
              </el-form-item>
            </el-col>
            <el-col v-if="accessType !== 'employee'" :md="12">
              <el-form-item label="指定權限" prop="userGroupIds" requierd>
                <!-- <el-select v-model="submitData.userGroupIds" value-key="id"  multiple >
                  <el-option v-if="defaultValue.userGroupIds.includes(7)" :value="7" label="商店擁有者"></el-option>
                   <el-option v-for="item in userGroupList" :key="item.id" :disabled="item.id === 7 && !defaultValue.userGroupIds.includes(7)" :value="item.id" :label="item.title"></el-option>
                  <el-option :value="9" label="資料上稿"></el-option>
                  <el-option :value="10" label="訂單操作"></el-option>
                  <el-option :value="11" label="排班人員"></el-option>
                </el-select> -->
                <el-checkbox-group v-model="submitData.userGroupIds" >
                  <el-checkbox v-for="item in userGroupList" :key="item.id" :label="item.id" :disabled="item.id === 7">{{item.title}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col v-if="isEditMode" :md="24">
              <el-button v-if="!passwordEditable" type="text" @click="passwordEditable = true">變更密碼</el-button>
              <el-button v-if="passwordEditable" type="text" @click="passwordEditable = false">取消變更密碼</el-button>
            </el-col>
            <el-col :md="12">
              <el-form-item v-if="accountId === 0 && passwordEditable" label="密碼" prop="password">
                <el-input v-model="submitData.password" :type="passwordVisible ? 'text' : 'password'" autocomplete="off">
                  <template v-slot:append>
                    <el-button @click="passwordVisible = !passwordVisible">
                      <BaseIcon :name="passwordVisible ? 'eye-slash' : 'eye'" />
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item v-if="accountId === 0 && passwordEditable" label="確認密碼" prop="passwordConfirm">
                <el-input v-model="submitData.passwordConfirm" :type="repasswordVisible ? 'text' : 'password'" autocomplete="off">
                  <template v-slot:append>
                    <el-button @click="repasswordVisible = !repasswordVisible">
                      <BaseIcon :name="repasswordVisible ? 'eye-slash' : 'eye'" />
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="accessType !== 'employee'" :md="12">
              <el-form-item prop="maxCollision">
                <span slot="label" for=""
                  >可同時服務幾位顧客 <el-tooltip content="這位服務人員同一時段可預約的顧客人數，如果輸入2，則同一時段可供2人預約" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip
                ></span>

                <el-input v-model="submitData.maxCollision" />
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="證照" prop="certificate">
                <el-input v-model="submitData.certificate" />
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="專長" prop="specialty">
                <el-input v-model="submitData.specialty" />
              </el-form-item>
            </el-col>
            <el-col :md="12">
              <el-form-item label="介紹" prop="description">
                <el-input v-model="submitData.description" type="textarea" :autosize="{ minRows: 2 }" />
              </el-form-item>
            </el-col>
            <!-- <el-col :lg="24"><div class="bottom-line"></div></el-col>
            <el-col :lg="12">
              <el-form-item  label="密碼" prop="password">
                <el-input v-model="submitData.password" :type="passwordVisible ? 'text' : 'password'" autocomplete="off">
                  <template v-slot:append>
                    <el-button @click="passwordVisible = !passwordVisible">
                      <BaseIcon :name="passwordVisible ? 'eye-slash' : 'eye'" />
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :lg="12">
              <el-form-item  label="確認密碼" prop="passwordConfirm">
                <el-input v-model="submitData.passwordConfirm" :type="repasswordVisible ? 'text' : 'password'" autocomplete="off">
                  <template v-slot:append>
                    <el-button @click="repasswordVisible = !repasswordVisible">
                      <BaseIcon :name="repasswordVisible ? 'eye-slash' : 'eye'" />
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane v-if="accessType !== 'employee'" key="1" label="服務項目" name="2">
        <ScheduleStaffServiceForm ref="step2" :default-value="defaultValue" />
      </el-tab-pane>
    </el-tabs>
    <div v-if="accessType === 'employee'" class="bottom-btn-center">
      <el-button class="is-round" type="primary" :loading="tryingStore" @click="tryToStore">儲存變更</el-button>
      <el-button class="is-round" @click="emitClose">取消變更</el-button>
    </div>
    <div v-else :class="[$style.footer,{ isSchedule: accessType === 'schedule' }]">
      <el-button class="is-round" @click="emitClose">取消</el-button>
      <el-button v-if="activeTab === '1' && isEditMode" class="is-round" type="primary" :loading="tryingStore" @click="tryToStore">儲存</el-button>
      <el-button v-if="activeTab === '1' && !isEditMode" class="is-round" type="primary" :loading="tryingStore" @click="toNext">下一頁</el-button>
      <el-button v-if="activeTab === '2'" class="is-round" type="primary" :loading="tryingStore" @click="tryToStore">{{ isEditMode ? '儲存' : '創建' }}</el-button>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
:global{
  .isSchedule{
    position: static;
    width: 100%;
    left: 0;
    box-shadow: none;
    margin-top: 10px;
  }
}
</style>
