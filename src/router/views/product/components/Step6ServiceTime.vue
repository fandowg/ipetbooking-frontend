<script>
const minutesOfTime = (time = '00:00') => {
  const timeMatches = time.match(/^(\d+):(\d+)$/i)
  const [, hours, minutes] = timeMatches
  return Number(hours) * 60 + Number(minutes)
}

const initData = () => {
  return {
    start: '00:00',
    end: '23:59',
    lastOrder: '23:00',
    beforehandOrder: '0',
    isOpen: 0,
    timeRange: ['00:00', '23:59'],
  }
}
const serviceTimeSetting = {
  1: { ...initData(), title: '週一' },
  2: { ...initData(), title: '週二' },
  3: { ...initData(), title: '週三' },
  4: { ...initData(), title: '週四' },
  5: { ...initData(), title: '週五' },
  6: { ...initData(), title: '週六' },
  7: { ...initData(), title: '週日' },
}

const week = ['週一','週二','週三','週四','週五','週六','週日']

export default {
  props: {
    itemType: {
      type: String,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      /* submitData: {
        serviceTimeSetting: {
          start: '00:00',
          end: '23:59',
          lastOrder: '',
          beforehandOrder: '0',
        },
      }, */
      submitRules: {
        start: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇營業開始時間'))
              if (this.submitData.serviceTimeSetting.end) this.$refs.form.validateField('params.serviceTimeSetting.end')

              callback()
            },
            trigger: 'change',
          },
        ],
        end: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const { start } = this.submitData.serviceTimeSetting
              if (minutesOfTime(start) >= minutesOfTime(value)) return callback(new Error('結束時間不可早於開始時間'))
              callback()
            },
            trigger: 'change',
          },
        ],
        lastOrder: [
          {
            required: true,
            message: '請選擇時間',
            trigger: 'change',
          },
        ],
        beforehandOrder: [
          {
            required: true,
            message: '請輸入提前預約時間',
          },
        ],
      },
      week,
      serviceTimeSetting,
      // timeRange:[
      //   "00:00",
      //   "23:59"
      // ]
    }
  },
  computed: {
    isEditMode() {
      return this.defaultValue.id
    },
    /*  timeRange: {
      get() {
        return [this.submitData.serviceTimeSetting.start, this.submitData.serviceTimeSetting.end]
      },
      set(value) {
        this.submitData.serviceTimeSetting.start = value[0]
        this.submitData.serviceTimeSetting.end = value[1]
      },
    }, */
  },
  /*   watch:{
    timeRange(value){
      this.submitData.serviceTimeSetting.start=value[0]
      this.submitData.serviceTimeSetting.end=value[1]
    }
  }, */
  created() {
    if(this.isEditMode){
      
      this.serviceTimeSetting = {...serviceTimeSetting,...this.defaultValue.serviceTimeSetting}
      // this.$set(this.serviceTimeSetting, 'timeRange', [])
      for (let i in this.serviceTimeSetting) {
        // console.log(124)
        this.$set(this.serviceTimeSetting[i], 'timeRange', [this.serviceTimeSetting[i].start,this.serviceTimeSetting[i].end])
        // this.serviceTimeSetting[i].timeRange = [this.serviceTimeSetting[i].start,this.serviceTimeSetting[i].end]
      }
    }
  },
  methods: {
    async validate() {
      // let isValidate
      // const week =[1,2,3,4,5,6,7]
      let validateList =[]
      for (let i in this.serviceTimeSetting) {
        validateList.push(this.$refs[`form${i}`][0].validate())
        // if(this.serviceTimeSetting[i].isOpen===1){
        //   validateList.push(this.$refs[`form${i}`][0].validate())
        // }
      }
      // const array= [
      //   this.$refs.form1[0].validate(),
      //   this.$refs.form2[0].validate(),
      //   this.$refs.form3[0].validate(),
      //   this.$refs.form4[0].validate(),
      //   this.$refs.form5[0].validate(),
      //   this.$refs.form6[0].validate(),
      //   this.$refs.form7[0].validate()
      // ]
      const resault =  await Promise.all(validateList)
      // console.log(resault)
      return resault
    },
    fillAllTimes() {
      for (let i in this.serviceTimeSetting) {
        this.serviceTimeSetting[i].timeRange = this.serviceTimeSetting['1'].timeRange
        // serviceTimeSetting[i].end=serviceTimeSetting['1'].end
        this.serviceTimeSetting[i].lastOrder = this.serviceTimeSetting['1'].lastOrder
        this.serviceTimeSetting[i].beforehandOrder = this.serviceTimeSetting['1'].beforehandOrder
        this.serviceTimeSetting[i].isOpen = this.serviceTimeSetting['1'].isOpen
      }
    },
  },
}
</script>

<template>
  <div>
    <h4 class="form-block-title">營業時間</h4>
    <div v-for="(item, key,index) in serviceTimeSetting" :key="key">
      <el-form :ref="`form${key}`" :rules="submitRules" :model="serviceTimeSetting[key]" label-position="top">
        
        <el-row :gutter="20" :class="$style.timeRow">
       
          <el-col :sm="12" :span="24"> <el-switch v-model="serviceTimeSetting[key].isOpen" :active-value="1" :inactive-value="0"></el-switch>{{ week[index] }} </el-col>
          <el-col :sm="8" :span="24">
            <el-form-item label="營業時間">
              <el-time-picker
                v-model="serviceTimeSetting[key].timeRange"
                :clearable="false"
                range-separator="至"
                format="HH:mm"
                value-format="HH:mm"
                placeholder="選擇開始營業時間"
                is-range
              ></el-time-picker>
              <el-button v-if="key === '1'" type="text" @click="fillAllTimes">
                <span>套用至所有營業日</span>
              </el-button>
            </el-form-item>
          </el-col>
     
          <el-col :sm="6" :span="24">
            <el-form-item label="最晚接受預約時間" prop="lastOrder">
              <el-time-picker v-model="serviceTimeSetting[key].lastOrder" format="HH:mm" value-format="HH:mm" placeholder="選擇最晚接受預約時間" :clearable="false"></el-time-picker>
            </el-form-item>
          </el-col>
          <el-col :sm="6" :span="24">
            <el-form-item label="提前預約時間" prop="beforehandOrder">
              <el-input v-model.number="serviceTimeSetting[key].beforehandOrder" min="0">
                <template v-slot:append>分鐘</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>



<style lang="scss" module>
.timeRow {
  display: flex;
  align-items: center;
  border-bottom: $color-border-base 1px solid;
  margin-bottom: 30px;
  padding-bottom: 20px;

  @include max-sm {
    flex-direction: column;
  }
  :global {
    .el-switch {
      margin-right: 20px;
    }
    .el-button {
      position: absolute;
      left: 0;
      bottom: -40px;
    }
  }
}
.container {
  text-align: center;
}
.image {
  margin-bottom: 30px;
}
</style>
