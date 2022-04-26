import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import {
  cloneDeep
} from 'lodash'
import {
  questions
} from '@utils/pet-question'

const petData = () => {
  return {
    categoryId: '',
    sizeId: '',
    name: '',
    birthday: '',
    avatar: '',
    gender: '',
    breed: '',
    note: '',
    memberId: '',
    questions: {
      personality: [],
      healthy: [],
      behavior: [],
      vaccine: 0
    },
  }
}

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
  filters: {

  },
  data() {
    return {
      
      questions: cloneDeep(questions),
      petList: [],
      // dialogItem: {},
      submitDataPet: {
        categoryId: '',
        sizeId: '',
        name: '',
        birthday: '',
        avatar: '',
        gender: '',
        breed: '',
        note: '',
        memberId: '',
        questions: {
          personality: [],
          healthy: [],
          behavior: [],
          vaccine: 0
        },
      },
      behavior: [],
      healthy: [],
      singlePetData: {},
      // dialogMode: 'edit', // edit 編輯, add 新增， view 預覽

      dialogVisiblePet: false,
      showDetailPet: false,
      editPetEnabled: false,
      category: [],

      parentCategoryIndex: 0,
      tryingGetPet: false,
      activeTabPet: '1',
      petEditMode: 'edit',
      petTabType:'info',
    }
  },
  computed: {
    submitPetRules() {
      return {
        avatar: [{
          required: true,
          message: '請上傳頭像',
          trigger: 'change',
        }, ],
        name: [{
          required: true,
          message: '請填寫寵物名',
          trigger: 'blur',
        }, ],
        categoryId: [{
          required: true,
          message: '請選擇類別',
          trigger: 'blur',
        }, ],
        sizeId: [{
          required: true,
          message: '請選擇體型',
          trigger: 'blur',
        }, ],
        gender: [{
          required: true,
          message: '請選擇性別',
          trigger: 'change',
        }, ],
        birthday: [{
          required: true,
          message: '請選擇生日',
          trigger: 'blur',
          // trigger: 'change',
        }, ],
      }
    },
    personalityContent() {
      return this.singlePetData.questions.personality.join('，')
    },
    healthyContent() {
      const content = this.singlePetData.questions.healthy.map(item => {
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content.join('，')
    },
    behaviorContent() {
      const content = this.singlePetData.questions.behavior.map(item => {
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content
    },
    vaccineContent() {
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
    },
    personalityContentOrder() {
      return this.defaultValue.pet.questions.personality.join('，')
    },
    healthyContentOrder() {
      const content = this.defaultValue.pet.questions.healthy.map(item => {
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content.join('，')
    },
    behaviorContentOrder() {
      const content = this.defaultValue.pet.questions.behavior.map(item => {
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content
    },
    vaccineContentOrder() {
      let vaccine = ''
      switch (this.defaultValue.pet.questions.vaccine) {
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
    },
    selectPetCont(){
      const cont = this.petList.find(item =>{
        return item.id === this.submitData.petId
      })
      const gender = cont.gender ? cont.gender==='male'?' 公 ':' 母 ':''
      return `${cont.name} ${gender} ${cont.categoryTitle}/${cont.sizeTitle}`
    }
  },
  watch: {
    'submitDataPet.categoryId': function() {
      this.getParentCategoryIndex()
      //  this.submitDataPet.sizeId=''
    },
    behavior(val) {
      if (val.length > 0 && this.submitDataPet.questions.behavior) {
        this.submitDataPet.questions.behavior = val.map(item => {
          const selected = this.questions.behavior.find(i => {
            return i.title === item
          })
          return selected
        })
      }
      else if(val.length===0 && this.submitDataPet.questions.behavior){
        this.submitDataPet.questions.behavior=[]
      }

    },
    healthy(val) {
      if (val.length > 0 && this.submitDataPet.questions.healthy) {
        this.submitDataPet.questions.healthy = val.map(item => {
          const selected = this.questions.healthy.find(i => {
            return i.title === item
          })
          return selected
        })
      }
      else if(val.length===0 && this.submitDataPet.questions.healthy){
        this.submitDataPet.questions.healthy=[]
      }

    },

    //  "singlePetData.avatar":function(){
    //    console.log(123)
    //  }
  },
  created() {

    this.tryToFetchCategory()
  },
  methods: {
    selectPet(item){
      this.submitData.petId = item.id
      this.petShow = false
      // 重選寵物必須把服務和包月全部清掉，記得回來做
      // console.log(this.petSizeId)
      this.tryToFetchPrepaid()
      this.scrollToBottom()
    },
    closePet() {
      this.petShow = false
      this.ordertype = ''
    },
    openSelectPet() {
      this.closeAllInfo()
      this.ordertype = ''
      this.petShow = true
    },
    async tryToFetchCategory() {
      this.category = await this.$store.dispatch('product/fetchServiceCategory')
     /*  console.log(this.category )
      // const list = this.category
      const list = [...this.category]
      // const list = cloneDeep(this.category)
      list[0].title='rr'
      list.push({ff:0})
      console.log(this.category[0].title)
      console.log(list,this.category) */
      // 陣列用展開只會影響長度不同，但是裡面object的key值還是會被影響，陣列要複製最好深拷貝
    },
    async tryToFetchPetList() {
      this.petList = await this.$store.dispatch('member/fetchPetList', {
        memberId: this.memberInfo.id,
      })
    },
    async gotoSinglePet(item) {
      this.petShow = true
      this.showDetailPet = true
      this.tryingGetPet = true
      const {
        items
      } = await this.$store.dispatch('member/fetchSinglePet', {
        memberId: this.memberInfo.id,
        petId: item.id,
      })
      this.singlePetData = items
      this.getDefaultQuestion()
      this.tryingGetPet = false
      // console.log(row, column, cell)
    },
    async tryToFetchSinglePet() {
      this.tryingGetPet = true
      const {
        items
      } = await this.$store.dispatch('member/fetchSinglePet', {
        memberId: this.memberInfo.id,
        petId: this.singlePetData.id,
      })
      this.singlePetData = items
      this.getDefaultQuestion()
      this.tryingGetPet = false
    },
    getDefaultQuestion() {
      this.questions.behavior.forEach(item => {
        item.text = ''
      })
      this.questions.healthy.forEach(item => {
        item.text = ''
      })
      if (this.singlePetData.questions) {
        this.behavior = this.singlePetData.questions.behavior.map(item => item.title)
        this.healthy = this.singlePetData.questions.healthy.map(item => item.title)
      } else {
        this.behavior = []
        this.healthy = []

      }


    },
    openDialog(mode, itemData) {
      // this.petShow = true
      this.behavior = []
      this.healthy = []
      this.questions.behavior.forEach(item => {
        item.text = ''
      })
      this.questions.healthy.forEach(item => {
        item.text = ''
      })
      this.dialogVisiblePet = true
      // this.dialogMode = mode
      // this.$set(this.$data, 'dialogItem', itemData)
    },
    closeDialog() {
      this.dialogVisiblePet = false
      this.tryToFetchPetList()
    },
    async tryToRemovePet(id) {
      await this.$confirm('確定刪除該寵物？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
      try {
        await this.$store.dispatch('member/removehPet', {
          memberId: this.memberInfo.id,
          ids: [id],
        })
        this.tryToFetchPetList()
      } finally {}
    },
    closeEditPet() {
      this.editPetEnabled = false
    },
    openEditPet() {
      // this.petShow = true
      this.editPetEnabled = true
      this.submitDataPet = {
        ...this.singlePetData
      }

      if (!this.submitDataPet.questions) {
        this.submitDataPet = {
          ...this.submitDataPet,
          questions: {
            personality: [],
            healthy: [],
            behavior: [],
            vaccine: ''
          }
        }
        // this.submitDataPet.question = {
        //   personality: [],
        //   healthy: [],
        //   behavior: [],
        // }
      } else {
        this.submitDataPet.questions.behavior.forEach(item => {
          this.questions.behavior.forEach(i => {
            if (item.title === i.title) {
              i.text = item.text
            }
          })
        })
        this.submitDataPet.questions.healthy.forEach(item => {
          this.questions.healthy.forEach(i => {
            if (item.title === i.title) {
              i.text = item.text
            }
          })
        })
      }

      this.getParentCategoryIndex()
    },
    creatPet() {
      this.editPetEnabled = true
      this.petEditMode = 'new'
      this.submitDataPet = petData()
      this.submitDataPet.memberId = this.memberInfo.id
      this.behavior =[]
      this.healthy =[]
      this.questions.behavior.forEach(item=>{
        item.text=''
      })
      this.questions.healthy.forEach(item=>{
        item.text=''
      })
    },
    async tryToSavePet() {
      await this.$refs.petForm.validate()
      if (this.submitDataPet.questions) {
        this.submitDataPet.questions.behavior.forEach(item => {
          // console.log(item)
          this.questions.behavior.forEach(i => {
            // console.log(i)
            if (item.title === i.title) {
              item.text = i.text
            }
          })
        })
        this.submitDataPet.questions.healthy.forEach(item => {
          // console.log(item)
          this.questions.healthy.forEach(i => {
            // console.log(i)
            if (item.title === i.title) {
              item.text = i.text
            }
          })
        })


      }
      if (this.petEditMode === 'new') {
        await this.$store.dispatch('member/storeSinglePet', this.submitDataPet)
        this.showDetailPet = false
        this.tryToFetchPetList()
      } else {
        await this.$store.dispatch('member/storeSinglePet', this.submitDataPet)
        this.tryToFetchSinglePet()
      }


      
      this.editPetEnabled = false
    },
    backToPetList() {
      this.showDetailPet = false
      this.editPetEnabled = false
      this.submitDataPet = {
        questions: {
          personality: [],
          healthy: [],
          behavior: [],
        },
      }
      this.singlePetData = {}
      this.tryToFetchPetList()
    },
    // getParentCategoryId() {
    //   this.category.forEach((parant) => {
    //     parant.children.forEach((category) => {
    //       if (this.submitDataPet.categoryIds[0] === category.id) {
    //         this.parentCategoryId = category.parentId
    //         // this.parentCategoryIndex=
    //       }
    //     })
    //   })
    //   this.getParentCategoryIndex()
    // },
    getParentCategoryIndex() {
      this.category.forEach((item, index) => {
        if (this.submitDataPet.categoryId === item.id) {
          // console.log(index)
          this.parentCategoryIndex = index
        }
      })
    },
    changeCategory() {
      this.submitDataPet.sizeId = ''
    },
    async petUploadToStore() {
      await this.$store.dispatch('member/storeSinglePet', {
        id:this.singlePetData.id,
        memberId:this.singlePetData.memberId,
        avatar:this.singlePetData.avatar,
        sizeId:this.singlePetData.sizeId,
        name:this.singlePetData.name
      })
      // if (this.petEditMode === 'edit') {


      //   this.submitDataPet = {
      //     ...this.singlePetData
      //   }
      //   if (!this.submitDataPet.questions) {
      //     this.submitDataPet = {
      //       ...this.submitDataPet,
      //       questions: {
      //         personality: [],
      //         healthy: [],
      //         behavior: [],
      //       }
      //     }
      //     // this.submitDataPet.question = {
      //     //   personality: [],
      //     //   healthy: [],
      //     //   behavior: [],
      //     // }
      //   } else {
      //     this.submitDataPet.questions.behavior.forEach(item => {
      //       this.questions.behavior.forEach(i => {
      //         if (item.title === i.title) {
      //           i.text = item.text
      //         }
      //       })
      //     })
      //     this.submitDataPet.questions.healthy.forEach(item => {
      //       this.questions.healthy.forEach(i => {
      //         if (item.title === i.title) {
      //           i.text = item.text
      //         }
      //       })
      //     })
      //   }
      //   this.tryToSavePet()
      // }
    },
    onSelectPetTabType(type){
      this.petTabType = type

    }
  }
}