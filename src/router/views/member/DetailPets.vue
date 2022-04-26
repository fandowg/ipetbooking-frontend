<script>
import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import {cloneDeep} from 'lodash'
import { questions } from '@utils/pet-question'

export default {
  components: {
    // ListItem: () => lazyLoadComponent(import('./components/ListItem')),
    BaseButtonDialog,
    BaseUpload: () => lazyLoadComponent(import('@components/BaseUpload')),
    PetForm: () => lazyLoadComponent(import('@components/PetForm')),
    PetCommentList: () => lazyLoadComponent(import('@components/PetCommentList')),
    // BaseInputFloatingLabel: () => lazyLoadComponent(import('@components/BaseInputFloatingLabel')),
    // ScheduleStaffDetail: () => lazyLoadComponent(import('@components/ScheduleStaffDetail')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      // pets: Array.from({ length: 5 }).fill(pet),
      // pet,
      questions:cloneDeep(questions),
      petList: [],
      dialogItem: {},
      submitData: {
        questions: {
          personality: [],
          healthy: [],
          behavior: [],
          vaccine:0
        },
      },
      behavior:[],
      healthy:[],
      singlePetData: {},
      dialogMode: 'edit', // edit 編輯, add 新增， view 預覽
      // typeList,
      // bodyTypeList,
      // gender,
      dialogVisible: false,
      showDetail: false,
      editDetailEnabled: false,
      category: [],
      // parentCategoryId: '',
      parentCategoryIndex: 0,
      tryingGet: false,
      activeTab: '1',
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
            trigger: 'blur',
          },
        ],
        sizeId: [
          {
            required: true,
            message: '請選擇體型',
            trigger: 'blur',
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
      }else if(val.length===0 && this.submitData.questions.behavior){
        this.submitData.questions.behavior=[]
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
      }else if(val.length===0 && this.submitData.questions.healthy){
        this.submitData.questions.healthy=[]
      }
      
    },
    
    //  "singlePetData.avatar":function(){
    //    console.log(123)
    //  }
  },
  created() {
    this.tryToFetchList()
    this.tryToFetchCategory()
    
  },
  methods: {
    // tryToGetPets(row) {
    //   console.log(row)
    //   // this.tryingToGetOrder = true
    //   // this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', row.id)
    //   // this.tryingToGetOrder = false
    //   // this.drawerVisible = true
    // },
    async tryToFetchCategory() {
      this.category = await this.$store.dispatch('product/fetchServiceCategory')
    },
    async tryToFetchList() {
      this.petList = await this.$store.dispatch('member/fetchPetList', {
        memberId: this.$route.params.memberId,
      })
    },
    async gotoSinglePet(row, column, cell) {
      this.showDetail = true
      this.tryingGet = true
      const { items } = await this.$store.dispatch('member/fetchSinglePet', {
        memberId: this.$route.params.memberId,
        petId: row.id,
      })
      this.singlePetData = items
      this.getDefaultQuestion()
      this.tryingGet = false
      // console.log(row, column, cell)
    },
    async tryToFetchSinglePet() {
      // console.log(456)
      this.tryingGet = true
      const { items } = await this.$store.dispatch('member/fetchSinglePet', {
        memberId: this.$route.params.memberId,
        petId: this.singlePetData.id,
      })
      this.singlePetData = items
      this.getDefaultQuestion()
      this.tryingGet = false
    },
    getDefaultQuestion(){
      // console.log(333)
      this.questions.behavior.forEach(item=>{
        item.text=''
      })
      this.questions.healthy.forEach(item=>{
        item.text=''
      })
      if(this.singlePetData.questions){
        this.behavior = this.singlePetData.questions.behavior.map(item=>item.title)
        this.healthy = this.singlePetData.questions.healthy.map(item=>item.title)
      }else{
        this.behavior = []
        this.healthy = []
        
      }
      
      
    },
    openDialog(mode, itemData) {
      this.behavior =[]
      this.healthy =[]
      this.questions.behavior.forEach(item=>{
        item.text=''
      })
      this.questions.healthy.forEach(item=>{
        item.text=''
      })
      this.dialogVisible = true
      this.dialogMode = mode
      this.$set(this.$data, 'dialogItem', itemData)
    },
    closeDialog() {
      this.dialogVisible = false
      this.tryToFetchList()
    },
    async tryToRemove(id) {
      await this.$confirm('確定刪除該寵物？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
      try {
        await this.$store.dispatch('member/removehPet', {
          memberId: this.$route.params.memberId,
          ids: [id],
        })
        this.tryToFetchList()
      } finally {
      }
    },
    openEdit() {
      this.editDetailEnabled = true
      this.submitData = { ...this.singlePetData }
      
      if(!this.submitData.questions){
        this.submitData = {
          ...this.submitData,
          questions:{
            personality: [],
            healthy: [],
            behavior: [],
            vaccine:''
          }
        }
        // this.submitData.question = {
        //   personality: [],
        //   healthy: [],
        //   behavior: [],
        // }
      }else{
        this.submitData.questions.behavior.forEach(item=>{
          this.questions.behavior.forEach(i=>{
            if(item.title===i.title){
              i.text = item.text
            }
          })
        })
        this.submitData.questions.healthy.forEach(item=>{
          this.questions.healthy.forEach(i=>{
            if(item.title===i.title){
              i.text = item.text
            }
          })
        })
      }
      
      this.getParentCategoryIndex()
    },
    async tryToSave() {
      if(this.submitData.questions){
        this.submitData.questions.behavior.forEach(item=>{
          // console.log(item)
          this.questions.behavior.forEach(i=>{
            // console.log(i)
            if(item.title===i.title){
              item.text = i.text
            }
          })
        })
        this.submitData.questions.healthy.forEach(item=>{
          // console.log(item)
          this.questions.healthy.forEach(i=>{
            // console.log(i)
            if(item.title===i.title){
              item.text = i.text
            }
          })
        })

        
      }
    
      await this.$store.dispatch('member/storeSinglePet', this.submitData)
      
      this.tryToFetchSinglePet()
      this.editDetailEnabled = false
    },
    backToList() {
      this.showDetail = false
      this.editDetailEnabled = false
      this.submitData = {
         questions: {
          personality: [],
          healthy: [],
          behavior: [],
        },
      }
      this.singlePetData = {}
      this.tryToFetchList()
    },
    // getParentCategoryId() {
    //   this.category.forEach((parant) => {
    //     parant.children.forEach((category) => {
    //       if (this.submitData.categoryIds[0] === category.id) {
    //         this.parentCategoryId = category.parentId
    //         // this.parentCategoryIndex=
    //       }
    //     })
    //   })
    //   this.getParentCategoryIndex()
    // },
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
    uploadToStore() {
      this.submitData = { ...this.singlePetData }
        if(!this.submitData.questions){
          this.submitData = {
            ...this.submitData,
            questions:{
              personality: [],
              healthy: [],
              behavior: [],
            }
          }
          // this.submitData.question = {
          //   personality: [],
          //   healthy: [],
          //   behavior: [],
          // }
        }else{
          this.submitData.questions.behavior.forEach(item=>{
            this.questions.behavior.forEach(i=>{
              if(item.title===i.title){
                i.text = item.text
              }
            })
          })
          this.submitData.questions.healthy.forEach(item=>{
            this.questions.healthy.forEach(i=>{
              if(item.title===i.title){
                i.text = item.text
              }
            })
          })
        }
      this.tryToSave()
    },
  },
}
</script>

<template>
  <div>
    <BasePageHeader title="寵物管理">
      <template v-slot:title>
        <span v-if="!showDetail">寵物管理</span>
        <span v-if="showDetail">寵物資料</span>
      </template>
      <template v-slot:right>
        <el-button v-if="!showDetail" class="is-round" type="primary" @click="dialogVisible = true">
          <BaseIcon name="plus" />
          <span>新增</span>
        </el-button>
      </template>
    </BasePageHeader>
    <!-- <keep-alive> -->
    <template v-if="!showDetail">
      <div class="el-table-wrapper">
        <div @click.stop>
        <el-table :data="petList" element-loading-text="取得寵物資訊中" @row-click="gotoSinglePet">
          <el-table-column v-slot="{ row }" label="寵物頭像" :min-width="12">
            <div :class="$style.petListImg">
              <img :src="row.avatar" alt="" />
            </div>
          </el-table-column>
          <el-table-column prop="name" label="寵物名字" :min-width="12"> </el-table-column>
          <el-table-column prop="categoryTitle" label="種類" :min-width="8"> </el-table-column>
          <el-table-column prop="sizeTitle" label="體型" :min-width="12"> </el-table-column>

          <el-table-column v-slot="{ row }" width="80">
            <el-tooltip content="刪除" placement="top">
              <el-button class="is-round" type="danger" plain size="mini" @click.stop="tryToRemove(row.id)">
                <BaseIcon name="trash-alt" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="查看寵物資訊" placement="top">
              <el-button type="text">
                <BaseIcon name="ellipsis-v" />
              </el-button>
            </el-tooltip>
          </el-table-column>
        </el-table>
        </div>
      </div>
    </template>
    <!-- </keep-alive> -->
    <template v-else>
      <div class="pet__back" style="margin-bottom: 20px" @click="backToList"><i class="el-icon-back"></i> 返回寵物列表</div>
      <el-tabs v-model="activeTab" stretch type="border-card">
        <el-tab-pane label="寵物資訊" :name="`1`">
          <div :class="$style.pet">
            <div class="top">
              <div>
                <template v-if="!editDetailEnabled">
                  <el-button size="mini" class="is-round" :disabled="tryingGet" @click="openEdit">
                    <!-- <BaseIcon name="edit" /> -->
                    <span>編輯</span>
                  </el-button>
                </template>
                <template v-else>
                  <el-button class="is-round" size="mini" @click="editDetailEnabled = false"><BaseIcon name="times" /> 取消</el-button>
                  <el-button class="is-round" size="mini" type="primary" @click="tryToSave"><BaseIcon name="check" /> 儲存</el-button>
                </template>
              </div>
            </div>
            <div class="pet__box">
              <el-form ref="form" :model="submitData" :rules="submitRules" label-position="left" class="el-form--floating" :validate-on-rule-change="false" label-width="100px">
                <el-row :gutter="20" style="margin-bottom:30px">
                  <el-col :span="10">
                    <div class="pet__avatar">
                      <!-- <el-avatar :src="pet.imgSrc" :size="100"></el-avatar> -->
                      <BaseUpload v-model="singlePetData.avatar" v-loading="tryingGet" resource="pet" circle dir="pet" @sendSuccess="uploadToStore" />
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <template v-if="editDetailEnabled">
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
                          <el-option v-for="(item, index) in category[parentCategoryIndex].children" :key="index" :label="item.title" :value="item.id"></el-option>
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
                    </template>
                    <template v-else>
                      <div v-loading="tryingGet" class="pet__info">
                        <ul class="pet__info__list">
                          <li class="pet__info__item">寵物名<span class="danger">*</span>：{{ singlePetData.name }}</li>
                          <li class="pet__info__item">類別<span class="danger">*</span>：{{ singlePetData.categoryTitle }}</li>
                          <li class="pet__info__item">體型<span class="danger">*</span>：{{ singlePetData.sizeTitle }}</li>
                          <li class="pet__info__item">品種：{{ singlePetData.breed }}</li>
                          <li class="pet__info__item">
                            
                              性別：
                            <span v-if="singlePetData.gender">
                              {{ singlePetData.gender === 'male' ? '公' : '母' }}
                            </span>
                          </li>
                          <li class="pet__info__item">生日：{{ singlePetData.birthday }}</li>
                        </ul>
                      </div>
                    </template>
                  </el-col>
                </el-row>
                <div class="notice">
                  <h5>寵物問題：</h5>
                  <template v-if="editDetailEnabled">
                 
                    <el-form-item label="個性" class="el-form-item--normal-margin">
                      <el-checkbox-group v-model="submitData.questions.personality">
                        <el-checkbox v-for="item in questions.personality" :key="item.name" :label='item.title'>{{item.title}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="健康狀況" class="el-form-item--normal-margin">
                      <el-checkbox-group v-model="healthy">
                        <template v-for="item in questions.healthy">
                     
                          <el-checkbox  :key="item.name" :label='item.title'>{{item.title}}</el-checkbox>
                          <!-- <el-checkbox  :label='item.title'>{{item.title}} </el-checkbox> -->
                          <el-input v-if="healthy.includes('其他疾病') && item.name === 'other'" :key="item.title" v-model="item.text"   placeholder="請填寫其他疾病"/>
                        </template>
                        
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="行為" class="el-form-item--normal-margin">
                      <el-checkbox-group v-model="behavior">
                        <template v-for="item in questions.behavior">
                          <div :key="item.title" class="inline-checkbox-input">
                            <el-checkbox  :key="item.name" :label='item.title'>{{item.title}}</el-checkbox>
                            <el-input v-model="item.text"/>
                          </div>
                        </template>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="疫苗" class="el-form-item--normal-margin">
                      <el-radio v-model="submitData.questions.vaccine" :label="1">1 劑</el-radio>
                      <el-radio v-model="submitData.questions.vaccine" :label="2">2 劑</el-radio>
                      <el-radio v-model="submitData.questions.vaccine" :label="3">3 劑</el-radio>
                    </el-form-item>
                  </template>
                  <template v-else>
                  
                    <ul v-if="singlePetData.questions" class="pet__info__list">
                      <li class="pet__info__item">個性：{{ personalityContent ? personalityContent : '未填寫' }}</li>
                      <li class="pet__info__item">健康狀況：{{ healthyContent ? healthyContent : '未填寫' }}</li>
                      <li class="pet__info__item indentList">
                        <span class="title">行為：</span>
                        <template v-if="behaviorContent.length > 0">
                          <span class="content">
                            <span v-for="n in behaviorContent" :key="n" class="content__item">{{n}}</span>
                          </span>
                        </template>
                        <span v-else>未填寫</span>
                      </li>
                      <li class="pet__info__item">疫苗：{{ singlePetData.questions.vaccine ? vaccineContent : '未填寫' }}</li>
                    </ul>
                  </template>

                </div>
                <div class="notice">
                  <h5>內部備註：</h5>
                  <template v-if="editDetailEnabled">
                    <el-form-item label="" label-width="0">
                      <el-input v-model="submitData.note" type="textarea" :rows="2"></el-input>
                      <!-- <BaseInputFloatingLabel v-model="pet.remark" type="textarea" :autosize="{ minRows: 2 }" /> -->
                    </el-form-item>
                  </template>
                  <template v-else>
                    <div> {{ singlePetData.note }}</div>
                  </template>
                </div>
              </el-form>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="寵物備註" :name="`2`"><PetCommentList v-if="singlePetData.id" ref="commentAll" :order="undefined" :pet="singlePetData.id" type="pet" /> </el-tab-pane>
      </el-tabs>
    </template>

    <BaseButtonDialog title="寵物資料" only-dialog :dialog-visible.sync="dialogVisible" floating @opened="openDialog('add')">
      <!-- <div v-if="dialogMode === 'view'">
            <ListItem :data="dialogItem" show-detail @edit="dialogMode = 'edit'" @close="closeDialog" />
          </div> -->
      <PetForm :default-value="defaultValue" :category="category" @close="closeDialog" />
    </BaseButtonDialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.petListImg {
  border-radius: 10px;
  overflow: hidden;
  height: 70px;
}
.pet {
  // font-size: 18px;
  :global {
    .danger {
      color: $color-state-danger;
    }
    .top {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }
    .pet {
      &__back {
        cursor: pointer;
      }
      &__box {
        margin-bottom: 30px;
      }
      &__info {
        &__list {
        }
        &__item {
          margin-bottom: 18px;
        }
      }
    }
    .notice {
      margin-bottom: 30px;
      h5 {
        font-size: 18px;
      }
      line-height: 1.5;
    }
  }
}
</style>