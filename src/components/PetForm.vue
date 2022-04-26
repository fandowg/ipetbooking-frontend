<script>
import lazyLoadComponent from '@router/lazyload-component'
import {cloneDeep} from 'lodash'
import { questions } from '@utils/pet-question'
// import { formatGetTime } from '@utils/format-date'

// const initData = () => {
//   return {
//     imgSrc: '',
//     name: '',
//     type: '',
//     bodyType: '',
//     variety: '',
//     gender: '',
//     birthDay: '',
//     remark: '',
//   }
// }
// const typeList = [
//   {
//     label: '貓',
//     value: '貓',
//   },
//   {
//     label: '狗',
//     value: '狗',
//   },
// ]
// const gender = [
//   {
//     label: '公',
//     value: '公',
//   },
//   {
//     label: '母',
//     value: '母',
//   },
// ]
// const bodyTypeList = [
//   {
//     label: '特大毛量厚多形/34kg+',
//     value: '特大毛量厚多形/34kg+',
//   },
//   {
//     label: '中型 17-22kg',
//     value: '中型 17-22kg',
//   },
//   {
//     label: '小型 3-5kg',
//     value: '小型 3-5kg',
//   },
// ]

export default {
  components: {
    BaseInputFloatingLabel: () => lazyLoadComponent(import('@components/BaseInputFloatingLabel')),
    BaseUpload: () => lazyLoadComponent(import('@components/BaseUpload')),
    // CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    category: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tryingStore: false,
      questions:cloneDeep(questions),
      submitData: {
        categoryId: '',
        // categoryTitle: "鱷魚",
        sizeId: '',
        // sizeTitle: "長吻鱷55",
        name: '',
        birthday: '',
        avatar: '',
        gender: '',
        breed: '',
        note: '',
        memberId: this.defaultValue.id,
        questions: {
          personality: [],
          healthy: [],
          behavior: [],
          vaccine:0
        },
        
      },
      behavior: [],
      healthy: [],
      parentCategoryIndex: 0,
      // endDatePickerOptions: {
      //   disabledDate: (time) => {
      //     // check String or Date Object
      //     const selectedStartDate = this.submitData.takeOfficeDate instanceof Object ? this.submitData.takeOfficeDate : new Date(this.submitData.takeOfficeDate)
      //     const limitWith365Days = selectedStartDate.getTime() + 3600 * 1000 * 24 * 365
      //     return time < selectedStartDate || time.getTime() >= limitWith365Days
      //   },
      // },
      // typeList,
      // bodyTypeList,
      // gender,
      // passwordVisible: false,
      // repasswordVisible: false,
    }
  },
  computed: {
    submitRules() {
      // const isTaiwan = this.submitData.phoneCode === '+886'
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
            message: '請填寫寵物名',
            trigger: 'blur',
          },
        ],
        categoryId: [
          {
            required: true,
            message: '請選擇類別',
            trigger: 'change',
          },
        ],
        sizeId: [
          {
            required: true,
            message: '請選擇體型',
            // trigger: 'change',
          },
        ],
        gender: [
          {
            required: true,
            message: '請選擇性別',
            trigger: 'change',
          },
        ],
        birthday: [
          {
            required: true,
            message: '請選擇生日',
            trigger: 'blur',
            // trigger: 'change',
          },
        ],
      }
    },
  },
  watch: {
    'submitData.categoryId': function () {
      this.getParentCategoryIndex()
      //  this.submitData.sizeId=''
    },
    behavior(val){
      if(val.length>0 && this.submitData.questions.behavior){
        this.submitData.questions.behavior=val.map(item=>{
          const selected = this.questions.behavior.find(i=>{
            return i.title === item
          }) 
          return selected
        })
      }
      
    },
    healthy(val){
      if(val.length>0 && this.submitData.questions.healthy){
        this.submitData.questions.healthy=val.map(item=>{
          const selected = this.questions.healthy.find(i=>{
            return i.title === item
          }) 
          return selected
        })
      }
    }
  },
  created() {},
  methods: {
    async tryToStore() {
      await this.$refs.form.validate()
      this.tryingStore = true
      try {
          this.submitData.questions.behavior.forEach(item=>{
            this.questions.behavior.forEach(i=>{
              if(item.title===i.title){
                item.text = i.text
              }
            })
          })
          this.submitData.questions.healthy.forEach(item=>{
            this.questions.healthy.forEach(i=>{
              if(item.title===i.title){
                item.text = i.text
              }
            })
          })

          
        
        await this.$store.dispatch('member/storeSinglePet', this.submitData)
        this.behavior =[]
        this.healthy =[]
        this.questions.behavior.forEach(item=>{
          item.text=''
        })
        this.questions.healthy.forEach(item=>{
          item.text=''
        })
        this.submitData= {
          categoryId: '',
          // categoryTitle: "鱷魚",
          sizeId: '',
          // sizeTitle: "長吻鱷55",
          name: '',
          birthday: '',
          avatar: '',
          gender: '',
          breed: '',
          note: '',
          memberId: this.defaultValue.id,
          questions: {
            personality: [],
            healthy: [],
            behavior: [],
          },
          
        }
        this.emitClose()
      } finally {
        this.tryingStore = false
      }

      // this.tryingStore = true
      // try {
      //   if (!this.isEditMode) {
      //     const newStaff = await this.$store.dispatch('schedule/storeStaff', this.submitData)
      //     this.emitStore(newStaff)
      //   } else {
      //     await this.$store.dispatch('schedule/storeStaff', this.submitData)
      //     this.emitStore()
      //   }
      // } catch (error) {
      //   console.log('TCL: tryToStore -> error', error)
      // } finally {
      //   this.tryingStore = false
      // }
    },
    // emitStore(newStaff = '') {
    //   this.$emit('store', newStaff)
    //   this.emitClose()
    // },
    emitClose() {
      this.$emit('close')
      this.$refs.form.resetFields()
      this.submitData.avatar = ''
    },
    getParentCategoryIndex() {
      this.category.forEach((item, index) => {
        if (this.submitData.categoryId === item.id) {
          // console.log(index)
          this.parentCategoryIndex = index
        }
      })
    },
    changeCategory() {
      this.submitData.sizeId = ''
    },
    // updateSubmitData() {
    //   this.submitData = Object.assign({}, this.defaultValue)
    // },
  },
}
</script>

<template>
  <div>
    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="left" class="el-form--floating" :validate-on-rule-change="false" label-width="100px">
      <el-form-item class="isAvatar">
        <BaseUpload v-model="submitData.avatar" resource="pet" dir="pet" circle />
      </el-form-item>
      <el-form-item prop="name" label="寵物名" class="el-form-item--normal-margin">
        <el-input v-model="submitData.name" placeholder="請輸入寵物名"></el-input>
      </el-form-item>
      <el-form-item label="類別" prop="categoryId" class="el-form-item--normal-margin">
        <el-select v-model="submitData.categoryId" @change="changeCategory">
          <el-option v-for="(item, index) in category" :key="index" :value="item.id" :label="item.title"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="體型" prop="sizeId" class="el-form-item--normal-margin">
        <el-select v-model="submitData.sizeId">
          <template v-if="submitData.categoryId">
            <el-option v-for="(item, index) in category[parentCategoryIndex].children" :key="index" :label="item.title" :value="item.id"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="breed" label="品種" class="el-form-item--normal-margin">
        <el-input v-model="submitData.breed" placeholder="請輸入品種"></el-input>
      </el-form-item>
      <el-form-item label="性別"  class="el-form-item--normal-margin">
        <el-select v-model="submitData.gender">
          <el-option label="母" value="female"></el-option>
          <el-option label="公" value="male"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日" class="el-form-item--normal-margin">
        <el-date-picker v-model="submitData.birthday" type="date" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="個性" class="el-form-item--normal-margin">
        <el-checkbox-group v-model="submitData.questions.personality">
          <el-checkbox v-for="item in questions.personality" :key="item.name" :label="item.title">{{ item.title }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="健康狀況" class="el-form-item--normal-margin">
        <el-checkbox-group v-model="healthy">
          <template v-for="item in questions.healthy">
            <el-checkbox :key="item.name" :label="item.title">{{ item.title }}</el-checkbox>
            <!-- <el-checkbox  :label='item.title'>{{item.title}} </el-checkbox> -->
            <el-input v-if="healthy.includes('其他疾病') && item.name === 'other'" :key="item.title" v-model="item.text" placeholder="請填寫其他疾病" />
          </template>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="行為" class="el-form-item--normal-margin">
        <el-checkbox-group v-model="behavior">
          <template v-for="item in questions.behavior">
            <div :key="item.title" class="inline-checkbox-input">
              <el-checkbox :key="item.name" :label="item.title">{{ item.title }} </el-checkbox>
              <el-input v-model="item.text" />
            </div>
          </template>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="疫苗" class="el-form-item--normal-margin">
        <el-radio v-model="submitData.questions.vaccine" :label="1">1 劑</el-radio>
        <el-radio v-model="submitData.questions.vaccine" :label="2">2 劑</el-radio>
        <el-radio v-model="submitData.questions.vaccine" :label="3">3 劑</el-radio>
      </el-form-item>

      <el-form-item class="not-inline" label="內部備註">
        <el-input v-model="submitData.note" type="textarea" :autosize="{ minRows: 3 }" />
      </el-form-item>
    </el-form>
    <div :class="$style.footer">
      <el-button class="is-round" @click="emitClose"><BaseIcon name="times" /> 取消</el-button>
      <el-button class="is-round" type="primary" :loading="tryingStore" @click="tryToStore"><BaseIcon name="check" /> 儲存</el-button>
    </div>
  </div>
</template>
<style lang="scss" module>
.footer {
  text-align: right;
}
</style>
