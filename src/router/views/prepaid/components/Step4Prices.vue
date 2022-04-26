<script>
export default {
  filters: {},
  props: {
    products: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    prices: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {}
  },
  computed: {
    submitData: {
      get() {
        return this.defaultValue
      },
      set(value) {
        this.$emit('update:defaultValue', value)
      },
    },
    isEditMode(){
      return !!this.defaultValue.groupOrdering
    },
    // prepaidRules() {
    //   return {
    //     price: [
    //       { 
    //         type: 'number',
    //         min: 0,
    //         message: '請輸入數字' 
    //       }
    //     ],
      
      
    //   }
    // },
    // filterSizes() {
    //   return this.category.find((item) => {
    //     return item.id === this.submitData.categoryId
    //   }).children
    // },
  },
  watch: {
    'submitData.categoryId':{
        handler(value) {
          this.doSetSizes()
        }
    }
  },
  created() {
    // this.submitData.categoryId = 1
    if(!this.isEditMode){
      this.doSetSizes()
    }
    
  },
  mounted() {},
  methods: {
    doSetSizes(){
      const list = this.category.find((item) => {
        return item.id === this.submitData.categoryId
      }).children
      this.submitData.prepaids = list.map(item=>{
        return {
          sizeId: item.id,
          title:item.categoryTitle,
          basePrice: 0,
          price: 0,
          state: 0
        }
      })
    },
     validate() {
      return this.$refs.form.validate()
    },
  },
}
</script>

<template>
  <div>
    <h4 class="form-block-title">販售設定</h4>
    <el-form ref="form" :model="submitData"   label-position="top">
    <div v-for="(item,index) in submitData.prepaids" :key="index">
      <div :class="$style.switch">
        <span v-if="isEditMode">{{item.sizeTitle}}</span>
        <span v-else>{{item.title}}</span>
        
        <el-form-item prop="state">
          <el-switch v-model="item.state" active-text="開放" inactive-text="關閉" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        
        
      </div>
      <el-row :gutter="20">
      <el-col :span="12" >
      <el-form-item prop="basePrice"  label="原價">
          <el-input v-model.number="item.basePrice">
            <span slot="suffix" style="margin-right:10px">元</span>
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" >
        <el-form-item :prop="`prepaids[${index}].price`" :rules="{ type: 'number',min: 0,message: '請輸入數字',trigger: 'blur' }" label="售價">
          <el-input v-model.number="item.price">
            <span slot="suffix" style="margin-right:10px">元</span>
          </el-input>
        </el-form-item>
      </el-col>
      </el-row>
    </div>
    </el-form>
  </div>
</template>
<style lang="scss" module>
.switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  padding-bottom: 5px;
  border-bottom: $color-border-base 1px solid;
  :global {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
</style>
