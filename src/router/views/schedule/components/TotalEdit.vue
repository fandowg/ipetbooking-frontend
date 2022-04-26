<script>
import lazyLoadComponent from '@router/lazyload-component'

import formatDate from '@utils/format-date'

export default {
  components: {},
  filters: {},
  props: {},
  data() {
    return {
      param: {
        type: '+',
        title: '',
        priceId: '',
        price: 0,
        qty: 1,
      },
      numberArray: ['7', '8', '9', '0', '4', '5', '6', '00', '1', '2', '3', '000'],
      numberString: '',
      activeTotalEdit: '+',
      tabList: [
        {
          title: '加價',
          value: '+',
        },
        {
          title: '減價',
          value: '-',
        },
        {
          title: '折扣',
          value: '%',
        },
      ],
    }
  },
  computed: {
    number() {
      if (this.numberString) {
        return parseInt(this.numberString)
      } else {
        return 0
      }
    },
    totalTabTitle() {
      return this.tabList.find((item) => {
        return item.value === this.activeTotalEdit
      }).title
    },
    paramRules() {
      return {
        price: [
          {
            type: 'number',
            min: 0,
            max: this.param.type === '%' ? 100 : null,
            message: this.param.type === '%' ? '請輸入小於 100 之數字' : '請輸入欲折扣之數值',
          },
        ],
        title:[{
          required: true, 
          message: '請填寫變價備註',
          trigger: 'blur',
        }]
      }
    },
  },
  watch: {
    activeTotalEdit(value) {
      this.param = {
        type: value,
        title: '',
        priceId: '',
        price: 0,
        qty: 1,
      }
      this.numberString = ''
    },
    number(value) {
      this.param.price = value
    },
  },
  created() {},
  methods: {
    addNumber(n) {
      this.numberString = this.numberString + n
      // if (this.numberString !== '0') {
      //   console.log(n)
      //   this.numberString = this.numberString + n
      // }
    },
    clearNubmer() {
      this.numberString = ''
    },
    async addTotalEdit() {
      
      try {
        await this.$refs.parmForm.validate()
        if(this.number){
          this.$emit('update:totalEditList', this.param)
        }
        
        // console.log(344)
        this.param = {
          type: this.activeTotalEdit,
          title: '',
          priceId: '',
          price: 0,
          qty: 1,
        }
        this.numberString = ''
      } catch {
      } finally {
      }
    },
  },
}
</script>
<template>
  <div :class="$style.TotalEditSection">
    <el-tabs v-model="activeTotalEdit" stretch>
      <el-tab-pane v-for="tab in tabList" :key="tab.value" :label="tab.title" :name="tab.value"> </el-tab-pane>
    </el-tabs>
    <div class="info-section" style="padding-top:20px">
      <el-form ref="parmForm" :model="param" :rules="paramRules" :validate-on-rule-change="false" class="el-form-item--white-bg">
        <div :class="$style.input">
          <span class="input__title">{{ totalTabTitle }}</span>
          <el-form-item class="el-form-item el-form-item--white-bg-border" prop="price">
            <el-input v-model="param.price" readonly style="font-size: 18px"> </el-input>
          </el-form-item>

          <div v-if="activeTotalEdit === '%'" class="input__text">% off</div>
          <el-button class="is-round" style="font-size: 18px;padding:13px 23px" @click="clearNubmer"> C </el-button>
        </div>
        <div :class="$style.computed">
          <el-button v-for="n in numberArray" :key="n" class="is-round" @click="addNumber(n)">{{ n }}</el-button>
        </div>
        <el-form-item label="備註" >
          <el-input v-model="param.title" type="textarea" :autosize="{ minRows: 3 }"> </el-input>
        </el-form-item>
        <el-button type="primary" class="is-round is-fullwidth" @click="addTotalEdit"> 輸入變價 </el-button>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" module>
.TotalEditSection {
  :global {
    .info-section {
      padding: 30px 40px;
    }
    .el-tabs__item {
      height: 60px;
      line-height: 60px;
    }
    textarea{
      height: calc(100vh - 518px) !important;
      // min-height: 60px;
    }
  }
}

.input {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  :global {
    .input {
      &__title {
        flex-shrink: 0;
        margin-right: 10px;
      }
      &__text {
        flex-shrink: 0;
        //  margin-right: 10px;
        margin-left: 10px;
      }
    }
    .is-round {
      padding: 18px 23px;
      margin-left: 10px;
    }
    .el-form-item {
      margin-bottom: 0;
      width: 100%;
    }
  }
}
.computed {
  display: flex;
  flex-wrap: wrap;
  margin-left: -5px;
  margin-right: -5px;
  :global {
    .is-round {
      margin: 0;
      width: calc(25% - 10px);
      min-height: 60px;
      margin: 0 5px 10px 5px;
      font-size: 18px;
    }
  }
}
</style>