<script>
import lazyLoadComponent from '@router/lazyload-component'
import { priceStatusFilter } from '@utils/filter-value-to-text'
// import { messageStroe, messageDelete } from '@utils/message'
// import { messageBoxDelete } from '@utils/message-box'
// import { notification } from '@utils/notification'

const initData = () => {
  return {
    // id: "8ad9fc9f-6477-4372-aedc-f128a543fe7e",
    productId: '',
    title: '',
    state: 0,
    basePrice: 0,
    storeTitle: '',
    price: 0,
    serviceTime: 90,
    bufferTime: 30,
    isFlexible: 0,
    categoryId: 0,
    petCategoryTitle: '',
    petSizeTitle: '',
    
  }
}

export default {
  components: {
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {

    priceStatusFilter,
 
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    categoryIndex: {
      type: Number,
      default: 0,
    },
    categoryId:{
      type:Number,
      default:0
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
      filterData: {
        state: '',
        productId: '',
        categoryId: '',
  
      },
      priceData:{},
      formIndex:0,
      selectedPrices:[],
      dialogVisible:false,
    }
  },
  computed: {
    submitData: {
      get() {
        return this.defaultValue
      },
      set(value) {
        // console.log(value)
        // this.setTableData()
        this.$emit('update:defaultValue', value)
      },
    }, 
    submitRules() {
      return {
        serviceTime: [
          {
            required: true,
            message: '請輸入服務時間',
            trigger: 'change',
          },
        ],
        bufferTime: [
          {
            required: true,
            message: '請輸入緩衝時間',
            trigger: 'change',
          },
        ],
        basePrice: [
          {
            required: true,
            message: '請輸入原始價格',
            trigger: 'change',
          },
        ],
        price: [
          {
            required: true,
            message: '請輸入販售價格',
            trigger: 'change',
          },
        ],
       
      }
    },

    filterTableData(){
      let filterData = [...this.tableData]
      const state = this.filterData.state
      const productId = this.filterData.productId
      const categoryId = this.filterData.categoryId
      if(state!==''){
        filterData = filterData.filter(item=>{
          return item.state === state
        })
      }
      if(productId!==''){
        filterData = filterData.filter(item=>{
          return item.productId === productId
        })
      }
      if(categoryId!==''){
        filterData = filterData.filter(item=>{
          return item.categoryId === categoryId
        })
      }

      return filterData
    },
    
    // priceData(){
    //   // console.log(this.tableData[this.formIndex])
    //   this.editForm = {...this.filterTableData[this.formIndex]}
    //   return this.editForm
    // },
    isEditMode() {
      return this.defaultValue.groupOrdering
    },
    isPriceNone(){
      const prices = this.tableData.map(item => item.price)
      const hasZero = prices.includes(0)
      return hasZero
    },
    isService(){
      return this.$route.params.type !== 'addition'
    }
  },
  watch: {
    submitData(){
      this.setTableData()
    },
    categoryIndex(){
      this.getDefaultPrices()
    }
    
  },
  created() {
   if(!this.isEditMode) {
     this.getDefaultPrices()
   }else{
     this.setTableData()
   }
  },
  methods: {
    // setFilterTableData(){
    //   let filterData = [...this.tableData]
    //   const state = this.filterData.state
    //   const productId = this.filterData.productId
    //   const categoryId = this.filterData.categoryId
    //   if(state!==''){
    //     filterData = filterData.filter(item=>{
    //       return item.state === state
    //     })
    //   }
    //   if(productId!==''){
    //     filterData = filterData.filter(item=>{
    //       return item.productId === productId
    //     })
    //   }
    //   if(categoryId!==''){
    //     filterData = filterData.filter(item=>{
    //       return item.categoryId === categoryId
    //     })
    //   }
    //   this.filterTableData = filterData
    // },
    setTableData(){
      // console.log(111)
      this.tableData = this.submitData.prices
    },
    getDefaultPrices() {
      this.tableData = []
      let num = 0
      this.products.forEach((store) => {
        this.category[this.categoryIndex].children.forEach((cat) => {
          num ++
          this.tableData.push({
            ...initData(),
            storeTitle: store.name,
            productId: store.id,
            title: this.defaultValue.title,
            petCategoryTitle: this.category[this.categoryIndex].categoryTitle,
            petSizeTitle: cat.title,
            categoryId: cat.id,
            catchId:num
          })
        })
      })
      this.submitData.prices = this.tableData
    },
    tableRowClassName({row,rowIndex}){
      row.index = rowIndex
    },
    goToDetail(row,event,column) {
      // console.log(row,event,column)
      this.formIndex = row.index
      this.priceData = {...this.filterTableData[this.formIndex]}
      this.dialogVisible = true
    },
    handleSelectionChange(selected) {
      this.selectedPrices = selected
    },
    async tryToSave(){
      try{
        await this.$refs.form.validate()
        
        // console.log(this.tableData[0])
        if(this.isEditMode){
          const changeDataId = this.priceData.id
          // let catchTableData = []
          this.tableData.forEach((item,index)=>{
            if(changeDataId === item.id){
              this.tableData[index] = {...this.priceData}
              // console.log(item)
            }
          })
          this.$emit('store','price')
        }else{
          // const changeDataTitle = this.priceData.petSizeTitle
          this.tableData.forEach((item,index)=>{
            if(this.priceData.catchId === item.catchId){
              this.tableData[index] = {...this.priceData}
              // console.log(item)
            }
          })
          this.tableData = [...this.tableData]
          this.submitData.prices = [...this.tableData]
          // this.setFilterTableData()
        }
        this.dialogVisible = false
      } catch {

      } finally{

      }

    },
    tryToFetchListFilter(){

    },
    onFilterReset(){

    },
    async selectOn(){
      
      const ids = this.selectedPrices.map(item=>item.id)
      
      const url = this.isService?'product/serviceUpdateState':'product/additionUpdateState'
      await this.$store.dispatch(`${url}`,{
        ids,
        state:1
      })
      this.$emit('update')
    },
    async selectOff(){
      try{
        await this.$confirm('服務上架中，確定要下架嗎？', '確認下架', {
          confirmButtonText: '確定',
          showCancelButton: true,
          type: 'warning',
          center: true,
        })
        const ids = this.selectedPrices.map(item=>item.id)
        const url = this.isService?'product/serviceUpdateState':'product/additionUpdateState'
        await this.$store.dispatch(`${url}`,{
          ids,
          state:0
        })
        this.$emit('update')
      }catch{

      }finally{

      }
    },
    validate() {
      return this.$refs.form.validate()
    },

  },
}
</script>

<template>
  <div :class="$style.content">
    <template v-if="isEditMode">
      <el-button class="is-round " :disabled="selectedPrices.length === 0" @click="selectOn">上架項目</el-button>
      <el-button class="is-round " :disabled="selectedPrices.length === 0" @click="selectOff">下架項目</el-button>      
    </template>

    <BaseTableSearch v-slot="{ fields }" hide-action :default-value="filterData" class="isForTab" @reset="onFilterReset" @tryToFetchList="tryToFetchListFilter">
        <el-form-item prop="state">
          <el-select v-model.number="fields.state" placeholder="上架狀態" >
            <el-option label="所有狀態" value=""></el-option>
            <el-option label="上架中" :value="1"></el-option>
            <el-option label="已下架" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="productId">
          <el-select v-model="fields.productId" placeholder="所有地點" >
            <el-option label="所有分店" value=""></el-option>
            <el-option v-for="(product, index) in products" :key="index" :label="product.name" :value="product.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="petCategoryId">
          <el-select v-model="fields.petCategoryId" placeholder="選擇寵物類別" @change="tryToFetchListFilter">
            <el-option label="所有類別" value></el-option>
            <el-option v-for="item in serviceCategory" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="categoryId">
          <el-select v-model="fields.categoryId" placeholder="寵物體型" >
            <el-option label="所有體型" value></el-option>
           
              <el-option v-for="item in category[categoryIndex].children" :key="item.id" :label="item.categoryTitle" :value="item.id"></el-option>
       
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="type">
          <el-select v-model="fields.type" placeholder="服務分類" >
            <el-option label="所有類別" value=""></el-option>
            <el-option label="貓" value="cat"></el-option>
            <el-option label="狗" value="dog"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="body">
        <el-select v-model="fields.body" placeholder="選擇體型" >
          <el-option label="所有體型" value=""></el-option>
          <el-option label="小型 3-5kg" value="0"></el-option>
           <el-option label="中小型 6-10kg" value="1"></el-option>
        </el-select>
      </el-form-item> -->
      </BaseTableSearch>
    <el-table 
      :data="filterTableData" 
      :class="$style['table']"
      :row-class-name="tableRowClassName"
      @row-click="goToDetail" 
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="isEditMode" type="selection" min-width="55"></el-table-column>

      <el-table-column v-slot="{ row }" label="門市" prop="storeTitle" min-width="180">
        <div>{{ row.storeTitle }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="體型" prop="petSizeTitle" min-width="180">
        <div>{{ row.petSizeTitle }}</div>
        <div style="font-size: 12px; color: darkgray">{{ row.serviceTime }}分鐘 緩衝+ {{ row.bufferTime }}分鐘</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="售價"  min-width="180">
        <div class="Jost" style="text-decoration: line-through; font-size: 12px; color: #b3b3b3">原價 ${{ row.basePrice }}</div>
     
        <div class="Jost">${{ row.price }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="狀態" prop="state" min-width="180">
        <BaseStateLabel :state="row.state | priceStatusFilter('color')" text>{{ row.state | priceStatusFilter('text') }}</BaseStateLabel>
        <!-- <el-switch v-model="row.state" active-text="上架" inactive-text="下架" :active-value="1" :inactive-value="0"></el-switch> -->

      </el-table-column>
    </el-table>
    <el-dialog  :visible.sync="dialogVisible" top="0" append-to-body :close-on-click-modal="false">
      <span slot="title" style="font-size:18px;line-height:24px">{{priceData.storeTitle}} / {{priceData.petSizeTitle}} 編輯價格設定</span>
      <div class="inline-between " style="margin-top: 20px;margin-bottom:30px">
        是否上架服務<el-switch v-model="priceData.state" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
      </div>
      <div class="only-bottom-line"></div>
      <el-form ref="form" :rules="submitRules" :model="priceData" label-width="100px" label-position="left">
        <el-form-item label="服務時間" prop="serviceTime" style="margin-top: 30px">
          <div class="input-inline">
            <el-input v-model="priceData.serviceTime" placeholder=""></el-input>
            <span class="text">分鐘</span>
          </div>  
        </el-form-item>
        <el-form-item label="緩衝時間" prop="bufferTime" >
          <div class="input-inline">
            <el-input v-model="priceData.bufferTime" placeholder=""></el-input>
            <span class="text">分鐘</span>
          </div>  
        </el-form-item>
        <el-form-item label="原價" prop="basePrice" >
          <div class="input-inline">
            <el-input v-model="priceData.basePrice" placeholder=""></el-input>
            <span class="text">元</span>
            
          </div>  
        </el-form-item>
        <el-form-item label="售價" prop="price" >
          <div class="input-inline">
            <el-input v-model="priceData.price" placeholder=""></el-input>
            <span class="text" style="width:60px;margin-right:15px">元</span>
            <el-checkbox v-model="priceData.isFlexible" :true-label="1" :false-label="0">起以上</el-checkbox>
          </div>  
        </el-form-item>
 
      </el-form>

      <div class="btn-group-inline" style="padding-top:15px">
        <el-button class="is-round " @click="dialogVisible = false">取消</el-button>
        <el-button class="is-round " type="primary" @click="tryToSave">儲存</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_steps.scss';

.content {
  // margin-top: 30px;
}
</style>
