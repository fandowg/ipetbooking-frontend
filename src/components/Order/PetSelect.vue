<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

export default {
  // name: '',
  components: {
    // CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  filters: {
    genderFilter,
  },
  props: {
    memberInfo:{
      type: Object,
      default: () => {},
    },
    memberInfoShow: {
      type: Boolean,
      default: false,
    },
    submitData: {
      type: Object,
      default: () => {},
    },
    selectedPetSizeId: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      editPetEnabled: false,

      petList: [],
      categoryList: [],
      parentCategoryIndex: 0,
      pet: {
        name: '',
        categoryId: '',
        sizeId: '',
        gender: '',
        memberId: '',
      },
      // selectedPetSizeId: '',
      singlePetData: {},
      // searchPet: '',
      // showCustomer: false,
      showPet: false,
      isNewPet: true,
      tryingPet: false,
      petMode: 'new',
    }
  },
  computed: {
    submitRulesPet() {
      return {
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
      }
    },
    personalityContent(){
      return this.singlePetData.questions.personality.join('，')
    },
    healthyContent(){
      const content = this.singlePetData.questions.healthy.map(item =>{
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content.join('，')
    },
    behaviorContent(){
      const content = this.singlePetData.questions.behavior.map(item =>{
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content
    },
    vaccineContent(){
      let vaccine = ''
      switch (this.singlePetData.questions.vaccine) {
        case 1:
          vaccine = '1 劑'
          break;
        case 2:
          vaccine = '2 劑'
          break;
        case 3:
          vaccine = '3 劑'
          break;
        default:
          break;
      }
      return vaccine
    }
  },
  watch: {
    singlePetData(){
      this.$emit('scrollDrawer')
    },
  },
  created() {
    this.tryToFetchCategory()
    this.tryToFetchPetList()
    // console.log('created')
  },
  methods: {
    addPet() {
      this.editPetEnabled = true
      this.pet = {
        name: '',
        categoryId: '',
        sizeId: '',
        gender: '',
        memberId: '',
      }
      this.$emit('scrollDrawer')
      // this.scrollDrawer()
      // this.pet = {}
      // this.petList.push(this.pet)
    },
    editPet() {
      this.editPetEnabled = true
      // this.petMode = 'edit'
      this.pet = { ...this.singlePetData }
      this.getDefaultCategoryIndex()
    },

    cancelEdit() {
      this.editPetEnabled = false
    },
    // async saveEdit() {
    //   // await this.$refs.petForm.validate()
    //   this.editPetEnabled = false
    //   // if (this.petMode === 'new') {
    //   //   this.petList.push(this.pet)
    //   //   this.searchPet = this.petList.length - 1
    //   // }
    //   // if (this.petMode === 'edit') {
    //   //   this.petList[this.searchPet] = { ...this.pet }
    //   // }
    // },
    async tryToFetchCategory() {
      this.categoryList = await this.$store.dispatch('product/fetchServiceCategory')
    },
    async tryToFetchPetList() {
      // console.log(this.memberInfo.id)
      this.petList = await this.$store.dispatch('member/fetchPetList', {
        memberId: this.memberInfo.id,
      })
    },
    async tryToStorePet(isNew) {
      await this.$refs.petForm.validate()
      this.tryingPet = true
      try {
        await this.$store.dispatch('member/storeSinglePet', { ...this.pet, memberId: this.memberInfo.id })
        await this.tryToFetchPetList()
        // if(!isNew){
        //   this.tryToFetchSinglePet()
        // }else{
        //   this.petList.forEach(item=>{
        //     if(item.name === this.pet.name){
        //     this.submitData.petId=item.id
        //     }
        //   })
        //    this.tryToFetchSinglePet()
        // }
        this.$nextTick(() => {
          this.petList.forEach((item) => {
            if (item.name === this.pet.name) {
              this.submitData.petId = item.id
            }
          })
          this.tryToFetchSinglePet()
          let selectedPetSizeId = this.petList.find((item) => {
            return item.id === this.submitData.petId
          }).sizeId
          // console.log(typeof(selectedPetSizeId))
          
          // selectedPetSizeId = selectedPetSizeId.toString()
          this.$emit('update:selectedPetSizeId', selectedPetSizeId)
        })

        // this.emitClose()
      } finally {
        // this.tryingPet = false
        this.editPetEnabled = false
      }
    },
    getDefaultCategoryIndex() {
      this.categoryList.forEach((item, index) => {
        if (this.pet.categoryId === item.id) {
          this.parentCategoryIndex = index
        }
      })
    },
    getParentCategoryIndex() {
      this.categoryList.forEach((item, index) => {
        if (this.pet.categoryId === item.id) {
          this.parentCategoryIndex = index
          this.pet.sizeId = ''
        }
      })
    },
    onChangePet() {
      this.isNewPet = false
      this.tryToFetchSinglePet()
      let selectedPetSizeId = this.petList.find((item) => {
        return item.id === this.submitData.petId
      }).sizeId
      // console.log(typeof(selectedPetSizeId))
      // selectedPetSizeId = selectedPetSizeId.toString()
      this.$emit('update:selectedPetSizeId', selectedPetSizeId)
    },
    async tryToFetchSinglePet() {
      this.tryingPet = true
      try{
        const { items } = await this.$store.dispatch('member/fetchSinglePet', {
          memberId: this.memberInfo.id,
          petId: this.submitData.petId,
        })
        this.singlePetData = items

      }catch{

      }finally{
        this.tryingPet = false
      }
    },
  },
}
</script>
<template>
  <div v-if="memberInfoShow" :class="$style.customer">
    <el-form-item label="選擇寵物" prop="petId">
      <div class="lineFormItem">
        <el-select v-model="submitData.petId" placeholder="請選擇寵物" class="lineFormItem__input" :disabled="editPetEnabled" @change="onChangePet">
          <el-option v-for="(item, index) in petList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>

        <div class="lineFormItem__btn">
          <el-button v-if="!editPetEnabled && submitData.petId" class="is-round isInputGroup" :loading="tryingPet" @click="editPet">修改</el-button>
          <el-button v-if="!editPetEnabled" class="is-round isInputGroup" @click="addPet">新增寵物</el-button>

          <el-button v-if="editPetEnabled" class="is-round isInputGroup" @click="cancelEdit"> 取消</el-button>
          <el-button v-if="editPetEnabled" class="is-round isInputGroup" type="primary" :loading="tryingPet" @click="tryToStorePet(isNewPet)"> 儲存</el-button>
        </div>
      </div>
    </el-form-item>

    <template v-if="editPetEnabled">
      <el-form ref="petForm" :model="pet" :rules="submitRulesPet">
        <el-row :gutter="20">
          <el-col :span="24" :md="12">
            <el-form-item prop="name" label="寵物名" class="el-form-item--normal-margin">
              <el-input v-model="pet.name" placeholder="請輸入寵物名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12">
            <el-form-item label="類別" prop="categoryId" class="el-form-item--normal-margin">
              <el-select v-model="pet.categoryId" @change="getParentCategoryIndex">
                <el-option v-for="(item, index) in categoryList" :key="index" :value="item.id" :label="item.title"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="24" :md="12">
            <el-form-item label="性別" prop="gender" class="el-form-item--normal-margin">
              <el-select v-model="pet.gender">
                <el-option label="母" value="female"></el-option>
                <el-option label="公" value="male"></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->

          <el-col :span="24" :md="12">
            <el-form-item label="體型" prop="sizeId" class="el-form-item--normal-margin">
              <el-select v-model="pet.sizeId">
                <el-option v-for="(item, index) in categoryList[parentCategoryIndex].children" :key="index" :label="item.title" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" :md="12">
              <el-form-item label="品種"  class="el-form-item--normal-margin">
                <el-input v-model="pet.breed" placeholder="請輸入品種"></el-input>
              </el-form-item>
            </el-col>
        </el-row>
      </el-form>
    </template>
    <template v-else>
      <div v-if="singlePetData.name" v-loading="tryingPet" element-loading-background="rgba(255, 255, 255, 0)" :class="$style.infoList">
        <div class="infoList__row">
          <el-row :gutter="20">
            <el-col :span="24" class="infoList__title"> 寵物資訊</el-col>
            <el-col :span="24">
              <el-row :gutter="20">
                <el-col :span="24" class="infoList__item" >
                  <span style="margin-right: 20px">{{ singlePetData.name }}</span>
                  <span v-if="singlePetData.breed" style="margin-right: 20px">{{ singlePetData.breed }}</span>
                  <!-- <span style="margin-right: 20px">{{ singlePetData.gender === 'male' ? '公' : '母' }}</span> -->
                  {{ singlePetData.categoryTitle }} / {{ singlePetData.sizeTitle }}
                </el-col>
                <el-col v-if="singlePetData.note" :span="24" class="infoList__item"> {{ singlePetData.note }} </el-col>
                <template v-if="singlePetData.questions">
                  <el-col v-if="singlePetData.note" :span="24" class="infoList__item"></el-col>
                  
                  <el-col v-if="singlePetData.questions.personality.length > 0" :span="24" class="infoList__item"> 個性： {{ personalityContent }} </el-col>
                  <el-col v-if="singlePetData.questions.healthy.length > 0" :span="24" class="infoList__item"> 健康狀況： {{ healthyContent }} </el-col>
                  <el-col v-if="singlePetData.questions.behavior.length > 0" :span="24" class="infoList__item indentList">
                    <span class="title">行為：</span>
                    <template v-if="behaviorContent.length > 0">
                      <span class="content">
                        <span v-for="n in behaviorContent" :key="n" class="content__item">{{n}}</span>
                      </span>
                    </template>
                  </el-col>
                  <el-col v-if="singlePetData.questions.vaccine" :span="24" class="infoList__item">疫苗：{{vaccineContent}}</el-col>

                </template>

              </el-row>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.customer {
  margin-bottom: 15px;
}
// .infoList {
//   // margin-bottom: 30px;
//   padding-top: 15px;
//   // border-bottom: 1px solid $color-border-base;
//   // font-size: 16px;
//   :global {
//     .muted {
//       color: $color-text-secondary;
//     }
//     .el-tag + .el-tag {
//       margin-left: 10px;
//     }
//     .infoList {
//       &__title {
//         font-weight: 500;
//         margin-bottom: 20px;
//       }
//       &__item {
//         margin-bottom: 15px;
//       }
//       &__row {
//         margin-bottom: 20px;
//       }
//     }
//   }
// }
</style>