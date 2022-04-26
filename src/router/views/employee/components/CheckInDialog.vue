<script>
import { QrcodeStream } from 'vue-qrcode-reader'
import formatDate from '@utils/format-date'
import { genderFilter } from '@utils/filter-value-to-text'

const errorMessageMap = {
  NotAllowedError: "請允許 j'tails 存取您的相機",
  NotFoundError: '此裝置無相機',
  NotSupportedError: '此頁面非安全瀏覽（如：HTTPS、localhost 或 file://）',
  NotReadableError: '無法存取您的相機。相機是否正在使用中？',
  OverconstrainedError: '您裝置的相機無法使用',
  StreamApiNotSupportedError: '掃描憑證不支援此瀏覽器',
}

const initDecodeData = () => {
  return {
    decodeResult: '',
    codeInfo: '',
    codeCanCheckIn: false,
    codeInvalidMessage: '',
  }
}

export default {
  name: 'CheckInDialog',
  components: {
    QrcodeStream,
  },
  filters: {
    formatDate,
    genderFilter,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
    noShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      edit: false,
      note: '',
      submitData: {
        note: '',
      },

      cameraStatus: 'auto', // auto 自動；rear 後鏡頭；front 前鏡頭；off 關閉
      cameraErrorMessage: '',
      cameraVisible: false,
      cameraLoading: false,
      ...initDecodeData(),

      tryingCheckIn: false,
      tryingNoShow: false,
    }
  },
  computed: {
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
  },
  methods: {
    onClose() {
      this.$emit('update:visible', false)
    },
    changeCameraStatus(status) {
      this.cameraStatus = status
    },
    async onInit(promise) {
      this.cameraLoading = true
      try {
        await promise
      } catch (error) {
        this.cameraErrorMessage = errorMessageMap[error.name] || `未預期的錯誤：${error}`
      } finally {
        this.cameraLoading = false
      }
    },
    async onDecode(codeId) {
      if (!codeId) return false
      // console.log(codeId)
      this.tryToCheckIn(codeId)
    },
    async tryToCheckIn(codeId) {
      await this.$confirm('確定將此訂單改為「已報到」？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
      try {
        this.tryingCheckIn = true
        await this.$store.dispatch('order/verifySingleCode', {
          codeId,
          orderId: this.defaultValue.id,
        })
        this.$message({
          type: 'success',
          message: '報到成功！',
        })
        this.$emit('update')
        this.onClose()
      } catch (e) {
      } finally {
        this.tryingCheckIn = false
      }
    },
    onClickManualCheckIn() {
      this.tryToCheckIn(this.defaultValue.params[0].codes[0].id)
    },
    async onClickNoShow() {
      await this.$refs.form.validate()
      await this.$confirm('確定將此訂單改為「未報到」？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
      this.tryingNoShow = true
      const storeData = {
        ...this.defaultValue,
        status: 5,
        merchantNote: this.submitData.note,
      }
      await this.$store.dispatch('order/store', storeData)
      this.$emit('update')
      this.$emit('update:visible', false)
      this.tryingNoShow = false
    },
  },
}
</script>

<template>
  <el-dialog :visible="visible" :fullscreen="isMobile" top="0" append-to-body @close="onClose">
    <div :class="$style.info">
      <div class="service">{{ defaultValue.params[0].title }}</div>
      <div class="product">{{ defaultValue.productName }}</div>
      <p class="booking-date Jost" style="margin-bottom: 5px;">{{ new Date(defaultValue.date) | formatDate() }} {{ defaultValue.time }}</p>
      <div>{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</div>
    </div>
    <el-divider></el-divider>
    <div v-if="noShow">
      <p>請說明情況</p>
      <el-form ref="form" :model="submitData" :rules="{ note: [{ required: true, message: '請輸入情況！', trigger: 'blur' }] }">
        <el-form-item prop="note">
          <el-input v-model="submitData.note" type="textarea" class="is-round is-light is-border" :rows="4" placeholder="請輸入備註"></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" style="margin-top:20px;">
        <el-col :span="12">
          <el-button class="is-round is-fullwidth" @click="onClose">返回</el-button>
        </el-col>
        <el-col :span="12">
          <el-button :loading="tryingNoShow" :disabled="tryingNoShow" type="danger" class="is-round is-fullwidth" @click="onClickNoShow">未報到</el-button>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <div v-loading="tryingCheckIn">
        <el-button v-if="!cameraVisible" class="is-round is-fullwidth is-border" type="primary" plain @click="onClickManualCheckIn">報到</el-button>
        <!-- <el-button v-if="!cameraVisible" class="is-round is-fullwidth is-border" type="primary" plain @click="onClickManualCheckIn">手動報到</el-button> -->
        <!-- <el-button class="is-round is-fullwidth is-border" type="primary" plain @click="cameraVisible = !cameraVisible">{{ cameraVisible ? '關閉QRcode掃描' : '掃描QRcode核銷' }}</el-button> -->
        <!-- <QrcodeStream v-if="cameraVisible" v-loading="cameraLoading" :camera="cameraStatus" style="margin-top: 20px;" @init="onInit" @decode="onDecode" /> -->
      </div>
      <el-divider></el-divider>
      <el-button class="is-round is-fullwidth" plain @click="onClose">返回訂單</el-button>
    </div>
  </el-dialog>
</template>

<style lang="scss" module>
@import '@design';
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
      color: #41695b;
      font-weight: 500;
    }
  }
}
</style>
