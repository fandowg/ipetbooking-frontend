<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

export default {
  // name: '',
  components: {
    CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  filters: {
    genderFilter,
  },
  props: {
    scheduleDetail:{
      type: Object,
      default: () => {},
    },
    syncMemberInfo: {
      type: Object,
      default: () => {},
    },
    // userSameAsMember: {
    //   type: Boolean,
    //   defalut: false,
    // },
    isEditMode: {
      type: String,
      default: '',
    },
    memberInfoShow: {
      type: Boolean,
      defalut: false,
    },
    editCustomerEnabled: {
      type: Boolean,
      defalut: false,
    },
    memberDataNotYet: {
      type: Boolean,
      defalut: false,
    },
  },
  data() {
    return {
      searchData: {
        phoneCode: '+886',
        phoneNumber: '',
        // bookingDateTime:`${formatDate(this.scheduleDetail.date,'date-dash')} ${formatDate(this.scheduleDetail.date,'time')}`
      },

      memberInfo: {},
      memberSubmitData: {
        fullName: '',
        phone: '',
        email: '',
        tagIds: [],
        gender: 'male',
        lineId: '',
      },
      tagList: [],
      tryingStoreMember: false,
      isEditMember: false,
      isNewMember: false,
    }
  },
  computed: {
    // syncMemberInfo: {
    //   get() {
    //     console.log('get')
    //     return {ff:44}
    //   },
    //   set(value) {
    //     console.log('set',value)
    //     this.$emit('update:memberInfo', value)
    //   },
    // },
    syncEditCustomerEnabled: {
      get() {
        return this.editCustomerEnabled
      },
      set(value) {
        this.$emit('update:editCustomerEnabled', value)
      },
    },
    searchRules() {
      const isTaiwan = this.searchData.phoneCode === '+886'
      return {
        phoneNumber: [
          {
            pattern: isTaiwan ? /^09\d{8}$/ : '',
            message: '格式請符合 09XXXXXXXX',
            trigger: 'blur',
          },
          {
            validator: (rule, value, callback) => {
              if (!value) return callback()
              this.tryToSearchMember()
            },
            trigger: 'custom',
          },
        ],
      }
    },
    memberRules() {
      const isTaiwan = this.searchData.phoneCode === '+886'
      // const isTaiwan = true
      return {
        fullName: [{ required: true, message: '請輸入姓名' }],
        phone: [
          {
            required: true,
            message: '請填寫手機號碼',
            trigger: 'blur',
          },
          {
            pattern: isTaiwan ? /^09\d{8}$/ : '',
            message: '格式請符合 09XXXXXXXX',
            trigger: 'blur',
          },
        ],
        gender: [
          {
            required: true,
            message: '請選擇性別',
            // trigger: 'change',
          },
        ],
        email: [
          { required: true, message: '請輸入 Email' },
          { type: 'email', message: '請輸入正確的 Email 格式' },
        ],
      }
    },
    syncMemberDataNotYet() {
      return !this.memberInfo.fullName || !this.memberInfo.gender
    },
  },
  watch: {
    syncMemberDataNotYet: {
      handler(value) {
        this.$emit('update:memberDataNotYet', value)
      },
      immediate: true,
    },
  },
  created() {
    this.tryToFetchTagList()
  },
  methods: {
    async tryToFetchTagList(search) {
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search,
      })
    },
    validPhoneNumber(phoneNumber) {
      this.$refs.searchForm.validateField('phoneNumber')
    },
    async tryToSearchMember() {
      if(this.scheduleDetail){
        this.searchData.bookingDateTime = `${formatDate(this.scheduleDetail.date,'date-dash')} ${formatDate(this.scheduleDetail.date,'time')}`
      }
      this.$store
        .dispatch('member/findByPhone', this.searchData)
        .then((member) => {
          this.memberInfo = member
          this.$emit('update:syncMemberInfo', member)
          this.$emit('updateMemberInfo', member)
          this.isNewMember = false
          this.syncEditCustomerEnabled = false
          this.memberSubmitData = {
            fullName: '',
            phone: '',
            email: '',
            tagIds: [],
            gender: '',
            lineId: '',
          }
          if (this.syncMemberDataNotYet) {
            this.openEditMember()
          }
        })
        .catch(() => {
          this.memberInfo = {}
          this.$emit('update:syncMemberInfo', {})
          this.$emit('updateMemberInfo')
          this.isNewMember = true
          this.syncEditCustomerEnabled = true
          this.memberSubmitData = {
            fullName: '',
            phone: this.searchData.phoneNumber,
            email: '',
            tagIds: [],
            gender: 'male',
            lineId: '',
          }
          // return callback(new Error('此手機號碼尚未註冊'))
        })
    },
    openEditMember() {
      this.syncEditCustomerEnabled = true
      // console.log(this.syncEditCustomerEnabled)
      this.$nextTick(()=>{
        // console.log(this.syncEditCustomerEnabled)
      })
      // this.memberSubmitData={...this.syncMemberInfo}
      this.memberSubmitData.phone = this.memberInfo.phoneNumber
      this.memberSubmitData.email = this.memberInfo.email || ''
      this.memberSubmitData.fullName = this.memberInfo.fullName || ''
      this.memberSubmitData.lineId = this.memberInfo.lineId || ''
      // this.memberSubmitData.tags = [...this.memberInfo.tags]
      this.memberSubmitData.tagIds = this.memberInfo.tags.map((item) => item.id)
      // this.memberSubmitData.gender = ''
      this.memberSubmitData.gender = this.memberInfo.gender || ''
      this.isEditMember = true
    },
    async tryToStoreMember(isNew) {
      await this.$refs.memberForm.validate()
      this.tryingStoreMember = true
      if (!isNew) {
        await this.$store.dispatch('member/store', {
          ...this.memberSubmitData,
          id: this.memberInfo.id,
        })
      } else {
        await this.$store.dispatch('member/store', {
          ...this.memberSubmitData,
          // id: this.memberInfo.id,
        })
      }
      this.searchData.phoneNumber = this.memberSubmitData.phone
      this.$store.dispatch('member/findByPhone', this.searchData).then((member) => {
        // this.memberInfo = member
        this.memberInfo = member
        this.$emit('update:syncMemberInfo', member)
        // 嘗試在這裡用 nextTick
        this.$emit('updateMemberInfo', member)
        // this.updateMemberInfo(member)
        this.syncEditCustomerEnabled = false
        this.tryingStoreMember = false
        this.isNewMember = false
      })
    },
  },
}
</script>
<template>
  <div :class="$style.customer">
    <el-form ref="searchForm" :model="searchData" :rules="searchRules" label-position="top" :class="$style['search-form']" class="el-form-item--normal-margin el-form-item--white-bg">
      <el-form-item v-if="!isEditMode" prop="phoneNumber" label="快速查詢客戶資料">
        <div class="lineFormItem">
          <el-input v-model.trim="searchData.phoneNumber" class="lineFormItem__input" placeholder="請輸入手機號碼" @keyup.native.enter="validPhoneNumber">
            <CountryCodePicker slot="prepend" v-model="searchData.phoneCode" />
            <!-- <i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" @click="validPhoneNumber"></i> -->
          </el-input>
          <div class="lineFormItem__btn">
            <!-- <el-button type="primary" style="height: 46px" @click="validPhoneNumber">查詢</el-button> -->
            <el-button v-if="!syncEditCustomerEnabled || isNewMember" class="is-round isInputGroup" @click="validPhoneNumber">查詢</el-button>
            <!-- <template v-if="!isNewMember">
                <el-button v-if="!syncEditCustomerEnabled && !memberInfoShow" class="is-round isInputGroup" @click="validPhoneNumber">查詢</el-button>
              </template> -->
            <template v-if="isNewMember">
              <el-button v-if="!memberInfoShow" class="is-round isInputGroup" @click="tryToStoreMember(true)">新增此客戶</el-button>
            </template>
            <template v-else>
              <el-button v-if="!syncEditCustomerEnabled && memberInfoShow" class="is-round isInputGroup" @click="openEditMember">修改資料</el-button>
              <el-button v-if="syncEditCustomerEnabled" class="is-round isInputGroup" @click="syncEditCustomerEnabled = false"> 取消</el-button>
              <el-button v-if="syncEditCustomerEnabled" class="is-round isInputGroup" type="primary" :loading="tryingStoreMember" @click="tryToStoreMember(false)"> 儲存</el-button>
            </template>
          </div>
        </div>
      </el-form-item>

      <span v-if="isNewMember" class="alert-word">查無客戶資訊，快速建立客戶</span>
      <!-- <template v-if="memberInfoShow">
          <h6 :class="$style.title">客戶資訊</h6>
          <ul :class="$style.info">
            <li>{{ memberInfo.fullName }} {{ memberInfo.gender | genderFilter }}</li>
            <li>{{ `${memberInfo.phoneCode} ${memberInfo.phoneNumber}` }}</li>
            <li>{{ memberInfo.email }}</li>
          </ul>
          <h6 :class="$style.title">你對此客戶之備註</h6>
          <p>{{ memberInfo.merchantNote || '目前尚無備註' }}</p>
        </template> -->
    </el-form>
    <template v-if="syncEditCustomerEnabled">
      <span v-if="syncMemberDataNotYet && memberInfoShow" class="alert-word">請輸入完整客戶資料</span>
      <el-form ref="memberForm" :model="memberSubmitData" :rules="memberRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
        <el-row :gutter="20">
          <el-col :span="24" :md="12">
            <el-form-item prop="fullName" label="姓名" class="el-form-item--normal-margin">
              <el-input v-model="memberSubmitData.fullName" placeholder="請輸入姓名"> </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12">
            <el-form-item class="el-form-item--normal-margin gender-box" prop="gender">
              <el-radio-group v-model="memberSubmitData.gender" class="no-bg-radio-group">
                <el-radio label="male">先生</el-radio>
                <el-radio label="female">小姐</el-radio>
              </el-radio-group>
              <!-- <el-select v-model="memberSubmitData.gender" prop="gender" placeholder="性別">
                  <el-option value="female" label="小姐"></el-option>
                  <el-option value="male" label="先生"></el-option>
                </el-select> -->
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12">
            <el-form-item prop="phone" label="電話" class="el-form-item--normal-margin">
              <el-input v-model.trim="memberSubmitData.phone" placeholder="請輸入手機號碼" :disabled="isEditMember">
                <CountryCodePicker slot="prepend" v-model="searchData.phoneCode" :disabled="isEditMember" />
              </el-input>
              <!-- <el-input v-model.trim="memberSubmitData.phone" placeholder="請輸入手機號碼" >
                  <CountryCodePicker slot="prepend" v-model="searchData.phoneCode"/>
                </el-input> -->
            </el-form-item>
          </el-col>

          <el-col :span="24" :md="12">
            <el-form-item label="標籤" class="el-form-item--normal-margin">
              <el-select v-model="memberSubmitData.tagIds" value-key="id" multiple placeholder="請選擇">
                <el-option v-for="tag in tagList" :key="tag.id" :label="tag.title" :value="tag.id"> </el-option> </el-select
            ></el-form-item>
          </el-col>

          <el-col :span="24" :md="12">
            <el-form-item label="Email">
              <el-input v-model="memberSubmitData.email" placeholder="Email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12">
            <el-form-item label="LINE ID">
              <el-input v-model="memberSubmitData.lineId" placeholder="LINE ID"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template v-if="memberInfoShow && !syncEditCustomerEnabled">
      <div :class="$style.infoList">
        <div class="infoList__row">
          <el-row :gutter="20">
            <el-col :span="24" class="infoList__title"> 客戶資訊</el-col>
            <el-col :span="24">
              <el-row :gutter="20">
                <el-col :span="24" :md="12" class="infoList__item"> {{ memberInfo.fullName }} {{ memberInfo.gender | genderFilter }} </el-col>
                <el-col :span="24" :md="12" class="infoList__item"> {{ `${memberInfo.phoneCode} ${memberInfo.phoneNumber}` }}</el-col>

                <el-col :span="24" :md="12" class="infoList__item">
                  <template v-if="memberInfo.tags.length > 0">
                    <el-tag v-for="tag in memberInfo.tags" :key="`tag-${tag.id}`" :type="'info'" effect="plain" disable-transitions>
                      {{ tag.title }}
                    </el-tag>
                  </template>
                  <template v-else>
                    <span class="muted"> 目前尚無標籤</span>
                  </template>
                </el-col>
                <!-- <el-col :span="12" class="infoList__item">{{ memberInfo.email }} </el-col> -->
                <el-col :span="24" :md="12" class="infoList__item">LINE ID: {{ memberInfo.lineId }} </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="infoList__row">
          <el-row :gutter="20">
            <el-col :span="24" class="infoList__title"> 內部備註</el-col>
            <el-col :span="24" class="infoList__item">
              <span v-if="memberInfo.merchantNote" class="muted" v-html="memberInfo.merchantNote"></span>
              <span v-else class="muted">目前尚無備註</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.infoList {
  // margin-bottom: 30px;
  padding-top: 15px;
  // border-bottom: 1px solid $color-border-base;
  // font-size: 16px;
  :global {
    .muted {
      color: $color-text-secondary;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
    .infoList {
      &__title {
        font-weight: 500;
        margin-bottom: 20px;
      }
      &__item {
        margin-bottom: 15px;
      }
      &__row {
        margin-bottom: 20px;
      }
    }
  }
}
</style>