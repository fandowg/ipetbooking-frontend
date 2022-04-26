<script>

import { daysInWeek } from '@utils/filter-value-to-text'

const exclude = {
  type: 'exclude',
  name: '',
  state: 1,
  rangeType: '',
  startDate: '',
  endDate: '',
  times: [
    {
      startTime: '',
      endTime: '',
    },
  ],
}
const week = {
  type: 'exclude',
  name: '',
  state: 1,
  rangeType: '',
  range: [],
  times: [
    {
      startTime: '',
      endTime: '',
    },
  ],
}

const dateForm = () => {
  return {
    type: 'exclude',
    name: '',
    state: 1,
    rangeType: 'date',
    range: [],
    startDate: '',
    endDate: '',
    times: [
      {
        startTime: '',
        endTime: '',
      },
    ],
    timeRanges: [['00:00', '23:59']],
  }
}

export default {
  components: {},
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
    return {
      usageRules: {},
      // timeRanges: [['', '']],
      usageRuleIndex:null,
      count:0,
      daysInWeek,
      isCreated:false
    }
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
    formRules() {
      return {
        name: [
          { 
            required: true, 
            message: '請輸入限制名稱' ,
            trigger: 'blur',
          }
        ],
        startDate:[
          { 
            required: true, 
            message: '請輸入日期' ,
            trigger: 'blur',
          }
        ],
        range:[
          {   required: true, 
              validator: (rule, value, callback) => {
                // console.log(value)
                if(value.length===0) {
                  return callback(new Error('請選擇日期'))
                }else{
                  callback()
                }
              },
              trigger: 'change',
            },
        ]
     

      }
    },
    //    formatSubmitData() {
    //   const { images, categoryIds } = this.submitData
    //   return {
    //     ...this.submitData,
    //     images: images.map((image, index) => {
    //       return {
    //         ...image,
    //         default: index === 0 ? 1 : 0,
    //       }
    //     }),
    //     categoryIds: [categoryIds],
    //   }
    // },
    // timeRanges:{
    //   get(){
    //     const list = []
    //     this.usageRules.times.forEach(item => {
    //       list.push([item.startTime,item.endTime])
    //     })
    //     return list
    //   },
    //   set(value){
    //     const list = []
    //     value.forEach((item,index) => {
    //       const [start,end] = item
    //       list.push({
    //         startTime:start,
    //         endTime:end
    //       })
    //     })
    //     this.usageRules.times=list

    //   }
    // },
    filterDateRange: {
      get() {
        return [this.usageRules.startDate, this.usageRules.endDate]
      },
      set(value) {
        const [start, end] = value || ['', '']
        this.usageRules.startDate = start
        this.usageRules.endDate = end
      },
    },
     isEditMode(){
      return !!this.defaultValue.groupOrdering
    },
  },
  created() {
    if(this.isEditMode){
      if(this.submitData.usageRules.length>0){
        this.usageRuleIndex = 0
        this.goToSingleUsageRule(0)
      }
    }
  },
  methods: {
    addTimeRange() {
      this.usageRules.timeRanges.push(['00:00', '23:59'])
    },
    deleteTimeRange(index) {
      this.usageRules.timeRanges.splice(index, 1)
    },
    creatUsageRule(){
      // console.log(3334)
      if(!this.isCreated){
        this.usageRules = dateForm()
        // this.timeRanges =[['','']]
        this.usageRuleIndex = null
        this.isCreated = true
      }
      
    },
    async saveSingleUsageRule() {
      // await this.$refs.form.validate()
      if(this.isCreated){
        await this.$refs.form.validate()
      }
      if(!this.usageRules.name){
        return false
      }
      // this.count++

      const list = []
      this.usageRules.timeRanges.forEach((item) => {
        const [start, end] = item
        list.push({
          startTime: start,
          endTime: end,
        })
      })
 
      this.usageRules.times = list
      const data = {
        ...this.usageRules
      }
      if(this.usageRuleIndex === null){
        const index = this.submitData.usageRules.length
        this.submitData.usageRules.push(data)
        this.goToSingleUsageRule(index )
        // this.usageRules = dateForm()
 
        // this.timeRanges =[['','']]
      }else{
  
       
          this.submitData.usageRules[this.usageRuleIndex] = {...this.usageRules}
    
          // 這段有點智障，只是要強制畫面渲染
          this.submitData.usageRules = [...this.submitData.usageRules]
          // console.log(this.submitData.usageRules[this.usageRuleIndex].name)
 
        
        
        // const chose = this.submitData.usageRules.find(item=>{
        //   return item.id === this.usageRules.id
        // })
      }
      // this.usageRuleIndex = null
      // console.log(this.usageRules, this.usageRules.times)
    },
    deleteSingleUsageRule(){
      this.submitData.usageRules.splice(this.usageRuleIndex,1)
      this.usageRuleIndex = null
      this.usageRules = dateForm()
        // this.timeRanges =[['','']]

      
    },
    goToSingleUsageRule(index){
      this.usageRules = {...this.submitData.usageRules[index]}
      this.usageRuleIndex = index
      this.isCreated = false
      this.getTimeRanges()
    },
    getTimeRanges(){
      const list = []
      this.usageRules.times.forEach(item => {
        if(item.startTime === null){
          item.startTime =''
        }
        if(item.endTime === null){
          item.endTime =''
        }
          list.push([item.startTime,item.endTime])
        })
      this.usageRules.timeRanges = list
    },
    cancelUsageRle(){
      this.isCreated = false
      this.usageRules ={}
    },
    async validate() {
     await this.saveSingleUsageRule()
      // if(this.isCreated){
      //   return this.$refs.form.validate()
      // }
      // return this.$refs.form.validate()
    },
  },
  
}
</script>

<template>
  <div>
    <h4 class="form-block-title">限制設定</h4>
    <el-row :gutter="20">
      <el-col :span="12">
        <div :class="$style.box">
          <el-button class="is-round is-fullwidth" :class="{ isActiveCheckBox: isCreated }" @click="creatUsageRule"><BaseIcon name="plus"   /> 新增暫停使用期間</el-button>
          <el-button v-for="(item, index) in submitData.usageRules" :key="index" :class="{ isActiveCheckBox: index === usageRuleIndex }" class="is-round is-fullwidth" @click="goToSingleUsageRule(index)"> {{item.name}}</el-button>
        </div>
      </el-col>
      <el-col :span="12">
        <div :class="$style.box">
          <template v-if="usageRules.type || isCreated">
  
            <el-form ref="form" class="el-form-item--white-bg" :validate-on-rule-change="true" :rules="formRules" :model="usageRules" label-position="top">
              <div :class="$style.switch">
                是否關閉限制
                <el-form-item prop="state">
                  <el-switch v-model="usageRules.state" active-text="開放" inactive-text="關閉" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
              </div>
              <el-form-item label="限制名稱" prop="name">
                <el-input v-model="usageRules.name"> </el-input>
              </el-form-item>
              <el-form-item label="時段類別">
                <el-select v-model="usageRules.rangeType">
                  <el-option label="日期" :value="`date`"></el-option>
                  <el-option label="星期" :value="`week`"></el-option>
                </el-select>
              </el-form-item>

              <template v-if="usageRules.rangeType">
      
              <el-form-item v-if="usageRules.rangeType === 'week'" prop="range" label="重複於">
              <el-checkbox-group v-model="usageRules.range" :class="$style.repeat">
                  <el-checkbox-button v-for="(weekDay, index) in daysInWeek" :key="index" :label="String(index)">{{ weekDay }}</el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item v-if="usageRules.rangeType === 'date'" prop="startDate" label="日期">
                <el-date-picker
                  v-model="filterDateRange"
                  type="daterange"
                  align="left"
                  unlink-panels
                  range-separator="-"
                  value-format="yyyy-MM-dd"
                  start-placeholder="起始日期"
                  end-placeholder="結束日期"
                  style="width: 100%"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
              <span class="el-form-item__label">時間</span>
              <el-form-item  v-for="(item, index) in usageRules.timeRanges" :key="index"   :prop="`timeRanges[${index}][0]`"
                :rules="{ required: true, message: '請輸入時間', trigger: 'blur' }"
                style="margin-bottom: 30px">
                <div class="inline-section">
                  <el-time-picker v-model="usageRules.timeRanges[index]" 
                    :clearable="false" range-separator="至" format="HH:mm" value-format="HH:mm" placeholder="選擇時間" is-range

                  ></el-time-picker>
                  <el-button class="is-round is-no-border" :disabled="usageRules.timeRanges.length === 1" type="text" plain @click="deleteTimeRange(index)">
                    <BaseIcon name="trash-alt" />
                  </el-button>
                </div>
              </el-form-item>
              <el-button class="is-round is-fullwidth" style="margin-bottom: 40px" @click="addTimeRange"><BaseIcon name="plus" /> 新增暫停使用時間</el-button>
              <div class="btn-group-inline">
                 <el-button v-if="usageRuleIndex !== null" class="is-round" @click="deleteSingleUsageRule"> 刪除</el-button>
                 <el-button v-if="usageRuleIndex === null" class="is-round" @click="cancelUsageRle"> 取消</el-button>
                <el-button class="is-round" type="primary" @click="saveSingleUsageRule"> 儲存</el-button>
              </div>
              </template>
            </el-form>
          </template>
          <template v-else>
            <span>請新增限制，或選擇已有限制</span>
              
            
          </template>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" module>
.box {
  border: $color-border-base 1px solid;
  padding: 15px;
  border-radius: 6px;
  :global {
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-input__inner {
      border-color: $color-border-base;
      &:focus {
        border-color: $color-primary;
      }
    }
    .inline-section {
      display: flex;
      // margin-bottom: 15px;
    }
    .el-button.is-no-border {
      border: 0;
    }
  }
}
.switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding-bottom: 10px;
  border-bottom: $color-border-base 1px solid;
  :global {
    .el-form-item {
      margin-bottom: 0;
    }
  }
}
.repeat {
  :global {
    .el-checkbox-button {
      .el-checkbox-button__inner {
        border-radius: 8px;
        padding: 14px 15px;
        border-color: $color-primary;
      }
      &.is-checked {
        .el-checkbox-button__inner {
          background: $color-primary;
        }
      }
      & + .el-checkbox-button {
        margin-left: 5px;
        .el-checkbox-button__inner {
          border-left: 1px solid $color-primary;
        }
      }
    }
  }
}
</style>
