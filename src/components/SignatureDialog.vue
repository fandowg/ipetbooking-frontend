<script>
import request from '@utils/request'
import vueSignature from 'vue-signature'
import { genderFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import lazyLoadComponent from '@router/lazyload-component'
import { debounce } from 'lodash'

// base64 to FileObject
const dataURLtoFile = function(dataurl, filename) {
  let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

export default {
  filters: {
    genderFilter,
    formatDate,
  },
  components: {
    vueSignature,
    InvoiceForm: () => lazyLoadComponent(import('@components/InvoiceForm')),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      default: 'edit',
    },
  },
  data() {
    return {
      signatureOption: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'white',
      },
      tryingSignature: false,
      activeStep: 1,
      submitData: {
        taxType: 'B2C',
        taxId: '',
        CarrierType: '0',
        CarrierNum: '',
        LoveCode: '',
        saveTaxInfo:1,
        ...this.order.invoice,
      },
      width:window.innerWidth
    }
  },
  computed: {
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
    storeInvoiceSetting(){
      return this.order.storeInvoiceSetting === 1
    },
    vueSignatureHeight(){
      return this.width < 481 ? '500px':'300px'
    }
  },
  created() {
    if(this.order.invoices && this.order.invoices.length === 0){
      this.submitData.taxType = 'B2C'
    }
  },
  mounted() {
    // 行動裝置轉向時會將canvas長寬歸零，觸發 resize 來恢復長寬
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 1000)
    window.addEventListener('resize',()=>{
      this.width = window.innerWidth
    })
    // console.log(this.storeInvoiceSetting())
  },
  methods: {
    async tryToStore(signature) {
      // this.tryingSignature = true
      try{
        const {params,...other} = this.order
        const storeData = {
          ...other,
          ...this.submitData,
          status: 6,
          signature,
          CarrierNum: this.submitData.CarrierType === '2' ? this.order.phoneNumber : this.submitData.CarrierNum,
        }
        await this.$store.dispatch('order/store', storeData)
        this.$emit('update')
        this.$emit('update:visible', false)
        // this.tryingSignature = false
      }catch{

      }finally{

      }
      
    },
    onBtnClickClearSign() {
      this.$refs.signature.clear()
    },
    onBtnClickUndoSign() {
      this.$refs.signature.undo()
    },
    handleSubmit:debounce(async function() {
      this.tryingSignature = true
      if (this.$refs.signature.isEmpty()) {
        this.$message({
          type: 'error',
          message: '請在框中簽名！',
        })
        this.tryingSignature = false
      } else {
        try{
          const signData = this.$refs.signature.save() // default format is png
          const rid = Math.floor(Math.random() * 5000000)
          await this.handleUpload(dataURLtoFile(signData, `signature_${rid}.png`))
        }catch{
          this.tryingSignature = false
        }finally{
          
        }
        
      }
      
    },1000),
    async handleUpload(file) {
      try{
        const formData = new FormData()
        formData.append('files[]', file)
        formData.append('dir', 'signature')
        this.tryingToUpload = true
        const imgUrl = await request.post('/admin/merchant/media/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // store api
        this.tryToStore(imgUrl)
      } catch{

      }finally{

      }
      
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleNextStep() {
      await this.$refs.form.validate()
      this.activeStep = 2
    },
  },
}
</script>

<template>
  <el-dialog :class="$style.sign" :visible="visible" :fullscreen="isMobile" top="0" append-to-body @close="handleClose">
    <div v-if="mode !== 'edit'" :class="$style.info">
      <div class="service">{{ order.params[0].title }}</div>
      <div class="product">{{ order.productName }}</div>
      <p class="booking-date Jost" style="margin-bottom: 5px;">{{ new Date(order.date) | formatDate() }} {{ order.time }}</p>
      <div>{{ order.fullName }} {{ order.gender | genderFilter }}</div>
    </div>

    <template v-if="mode === 'edit'">
      <template v-if="storeInvoiceSetting">
        <div :class="$style.steps">
          <div class="item" :class="{ active: activeStep === 1 }" @click="activeStep = 1">
            <div class="step">1</div>
            <div class="title">填寫發票資訊</div>
          </div>
          <div class="item" :class="{ active: activeStep === 2 }" @click="handleNextStep">
            <div class="step">2</div>
            <div class="title">簽名確認</div>
          </div>
        </div>
        <el-divider></el-divider>
      </template>
      <template v-if="activeStep === 1 && storeInvoiceSetting">
        <h4 style="text-align: center;margin-top: 45px;">填寫發票資訊</h4>
        <p style="margin-bottom: 40px;text-align: center;">請先填寫完發票資訊後，於下一步簽名確認</p>
        <el-form ref="form" :model="submitData" class="el-form-item--normal-margin">
          <InvoiceForm :default-value="submitData" />
        </el-form>
        <el-row :gutter="20" style="margin-top:20px;">
          <el-col :span="12"><el-button class="is-fullwidth is-round" @click="handleClose">取消</el-button></el-col>
          <el-col :span="12"><el-button class="is-fullwidth is-round" type="primary" @click="handleNextStep">下一步：簽名確認</el-button></el-col>
        </el-row>
      </template>
      <template v-if="activeStep === 2 || !storeInvoiceSetting">
        <div class="hidden-mobile">
          <h4 style="text-align: center;margin-top: 45px;">簽名確認</h4>
          <p style="margin-bottom: 40px;text-align: center;">請檢查寵物狀態再簽名確認完成本次服務</p>
        </div>
        <div style="position: relative;">
          <div :class="$style.actions">
            <el-tooltip class="item" effect="dark" content="復原" placement="top">
              <el-button class="is-round" type="text" @click="onBtnClickUndoSign"><BaseIcon name="undo"></BaseIcon></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="清除簽名" placement="top">
              <el-button class="is-round" type="text" @click="onBtnClickClearSign"><BaseIcon name="trash-alt"></BaseIcon></el-button>
            </el-tooltip>
          </div>
          <vueSignature ref="signature" :class="$style['signature-area']" :sig-option="signatureOption" :w="'100%'" :h="vueSignatureHeight"></vueSignature>
        </div>
        <div v-if="order.note" style="margin-top:20px;">使用人備註： {{order.note}}</div>

        <el-row :gutter="20" style="margin-top:20px;">
          <el-button class="is-fullwidth is-round" type="primary" :loading="tryingSignature" :disabled="tryingSignature" @click="handleSubmit">確認送出</el-button>
          <!-- <el-col :span="12"><el-button class="is-fullwidth is-round" @click="activeStep = 1">上一步</el-button></el-col>
          <el-col :span="12"><el-button class="is-fullwidth is-round" type="primary" :loading="tryingSignature" :disabled="tryingSignature" @click="handleSubmit">確認送出</el-button></el-col> -->
        </el-row>
      </template>
    </template>
    <template v-else>
      <el-image :src="order.signature" :class="$style.image">
        <div slot="error">
          圖片載入失敗
        </div>
      </el-image>
    </template>
  </el-dialog>
</template>
<style lang="scss" module>
@import '@design';
.signature-area {
  :global {
    canvas {
      border: 1px solid #c6c6ba;
      border-radius: 8px;
    }
  }
}
.info {
  text-align: center;
  :global {
    .service {
      font-size: 20px;
      line-height: 25px;
      font-weight: 500;
    }
    .product {
      color: $color-primary;
      font-size: 16px;
      line-height: 25px;
    }
    .booking-date {
      line-height: 28px;
      color: $color-primary;
      font-weight: 500;
    }
  }
}
.actions {
  position: absolute;
  top: 0;
  right: 0;
}
.image {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(211 211 211 / 0.2);
  margin-top: 40px;
}
.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  @include touch {
    justify-content: flex-start;
  }
  :global {
    .item {
      display: flex;
      align-items: center;
      opacity: 0.3;
      &.active {
        opacity: 1;
      }
      .step {
        color: white;
        background: $color-primary;
        width: 27px;
        height: 27px;
        padding: 0;
        line-height: 25px;
        text-align: center;
        font-size: 12px;
        box-shadow: 0 0 0px 2px $color-primary;
        border: 1px solid white;
        margin-right: 8px;
      }
      .title {
      }
      & + .item {
        margin-left: 20px;
      }
    }
  }
}
.sign {
  :global {
    @include touch {
      h4 {
        margin-top: 28px !important;
      }
      h4,
      p {
        text-align: left !important;
      }
      .el-dialog__headerbtn {
        top: 41px;
        font-size: 30px;
      }
    }
  }
}
</style>
