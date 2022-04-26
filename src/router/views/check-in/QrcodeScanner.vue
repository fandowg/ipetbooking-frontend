<script>
import { QrcodeStream } from 'vue-qrcode-reader'

import { checkInComputed } from '@state/helpers'
import { formatStatusMessage } from '@utils/request'
import formatDate, { formatRequestData } from '@utils/format-date'

const errorMessageMap = {
  NotAllowedError: '請允許 iPetBooking 存取您的相機',
  NotFoundError: '此裝置無相機',
  NotSupportedError: '此頁面非安全瀏覽（如：HTTPS、localhost 或 file://）',
  NotReadableError: '無法存取您的相機。相機是否正在使用中？',
  OverconstrainedError: '您裝置的相機無法使用',
  StreamApiNotSupportedError: '掃描憑證不支援此瀏覽器',
}

class CodeError extends Error {
  constructor(message) {
    super(message)
    this.status = message
  }
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
  components: {
    QrcodeStream,
  },
  filters: {
    formatDate,
  },
  data() {
    return {
      mode: 'manual', // manual 手動； auto 自動
      cameraStatus: 'auto', // auto 自動；rear 後鏡頭；front 前鏡頭；off 關閉
      cameraErrorMessage: '',
      cameraVisible: true,
      cameraLoading: false,
      ...initDecodeData(),
      verifyForm: {
        productId: '',
        date: '',
        inventoryId: '',
      },
      tryingToFetchInventory: false,
      inventoryList: [],
    }
  },
  computed: {
    ...checkInComputed,
    isAutoMode() {
      return this.mode === 'auto'
    },
    autoVerifyValues() {
      return Object.values(this.verifyForm).join(', ')
    },
  },
  watch: {
    mode: 'onChangeMode',
  },
  methods: {
    formatDate,
    changeCameraStatus(status) {
      this.cameraStatus = status
    },
    handleContinue() {
      this.resetDecodeData()
      this.cameraVisible = true
    },
    resetDecodeData() {
      Object.assign(this.$data, initDecodeData())
    },
    switchCamera() {},
    handleVerifySuccess(message) {
      this.$notify({
        title: '成功',
        message: formatStatusMessage(message, false),
        type: 'success',
      })
    },
    async handleGetCodeInfo(codeId) {
      this.cameraVisible = false

      try {
        const codeContent = await this.$store.dispatch(
          'order/fetchSingleCode',
          codeId
        )
        this.codeInfo = codeContent
        this.codeCanCheckIn = await this.checkValidation(codeContent)
      } catch (error) {
        this.codeInvalidMessage = formatStatusMessage(error.status)
      }
    },
    async handleCodeVerify(codeId) {
      const verifyData = this.isAutoMode
        ? {
            codeId,
            verifyRule: this.verifyForm,
          }
        : { codeId }
      try {
        const message = await this.$store
          .dispatch('order/verifyCode', verifyData)
          .then((res) => res.status)

        this.handleVerifySuccess(message)
        this.handleContinue()
      } catch (error) {
        this.$notify.error({
          title: '錯誤',
          message: formatStatusMessage(error.status) || error,
          duration: 0,
        })
      }
    },
    async onDecode(codeId) {
      if (!codeId) return false
      this.decodeResult = codeId
      this.isAutoMode
        ? this.handleCodeVerify(codeId)
        : this.handleGetCodeInfo(codeId)
    },
    checkValidation(content) {
      const { orderStatus, used } = content

      if (orderStatus === 1 && used === 0) return Promise.resolve(true)

      // 不能報到的情況：訂單未付款、已取消、憑證已使用

      if (used === 1)
        return Promise.reject(
          new CodeError('ORDER_QRCODE_ADMIN_QRCODE_HAS_BEEN_VERIFIED')
        )

      return Promise.reject(
        new CodeError(
          orderStatus === 0
            ? 'ORDER_QRCODE_ADMIN_PLEASE_CHECKOUT_FIRST'
            : 'ORDER_QRCODE_ADMIN_INVALID_QRCODE'
        )
      )
    },
    async onInit(promise) {
      this.cameraLoading = true
      try {
        await promise
      } catch (error) {
        this.cameraErrorMessage =
          errorMessageMap[error.name] || `未預期的錯誤：${error}`
      } finally {
        this.cameraLoading = false
      }
    },
    handleResetVerifyForm() {
      this.cameraVisible = false
    },
    async handleAutoScan() {
      try {
        await this.$refs['verify-form'].validate()
        this.cameraVisible = true
      } catch (error) {
        this.cameraVisible = false
      }
    },
    onChangeMode() {
      if (this.isAutoMode) {
        this.handleAutoScan()
      } else {
        this.cameraVisible = true
      }
    },
    async tryToFetchInventory() {
      this.tryingToFetchInventory = true
      this.inventoryList = await this.$store
        .dispatch('product/inventoryCalendar', {
          productId: this.verifyForm.productId,
          submitData: {
            startDate: formatRequestData(this.verifyForm.date),
            endDate: formatRequestData(this.verifyForm.date),
            withGroup: 0,
          },
        })
        .then((res) => res.items)
        .finally(() => (this.tryingToFetchInventory = false))
    },
  },
}
</script>
<template>
  <div :class="$style.wrapper">
    <div :class="$style.scanner">
      <QrcodeStream
        v-if="cameraVisible"
        v-loading="cameraLoading"
        :camera="cameraStatus"
        @init="onInit"
        @decode="onDecode"
      />
      <el-alert
        v-if="cameraErrorMessage"
        :title="cameraErrorMessage"
        type="error"
        effect="dark"
        show-icon
        :closable="false"
        :class="$style.result"
      ></el-alert>
      <el-card v-if="isAutoMode && !cameraVisible" header="請先設定自動核銷範圍" :class="$style.result">
        <el-form
          ref="verify-form"
          :model="verifyForm"
          label-position="left"
          label-width="80px"
          class="el-form-item--normal-margin"
        >
          <el-form-item label="項目" required prop="productId">
            <el-select v-model="verifyForm.productId" placeholder="請選擇項目">
              <el-option
                v-for="product in cachedProducts"
                :key="product.id"
                :label="product.name"
                :value="product.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期" required prop="date">
            <el-date-picker
              v-model="verifyForm.date"
              align="right"
              type="date"
              placeholder="請選擇日期"
              format="yyyy/MM/dd"
              :editable="false"
              @change="tryToFetchInventory"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="時段" required prop="inventoryId">
            <el-select
              v-model="verifyForm.inventoryId"
              placeholder="請選擇時段"
              :loading="tryingToFetchInventory"
            >
              <el-option
                v-for="inventory in inventoryList"
                :key="inventory.id"
                :label="formatDate(inventory.start, 'dateTime') "
                :value="inventory.id"
              >
                <span>{{ formatDate(inventory.start, 'dateTime') }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAutoScan">完成設定並開始掃描憑證</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card
        v-else-if="!isAutoMode && !!decodeResult"
        :header="`憑證編號：${decodeResult}`"
        :class="$style.result"
      >
        <div v-if="codeInfo">
          <h4>訂單編號：{{ codeInfo.orderId }}</h4>
          <ul :class="$style.result__detail">
            <!-- FIXME: 多回傳 product 的類型？ -->
            <li>活動名稱：{{ codeInfo.productTitle }}</li>
            <li>活動開始時間：{{ codeInfo.startDate | formatDate('dateTime') }}</li>
            <li>活動結束時間：{{ codeInfo.endDate | formatDate('dateTime') }}</li>

            <li>方案名稱：{{codeInfo.priceTitle}}</li>
            <li>使用人姓名：{{codeInfo.fullName}}</li>
          </ul>
          <div v-if="codeCanCheckIn">
            <el-button @click="handleContinue">不使用，繼續掃描憑證</el-button>
            <el-button type="primary" @click="handleCodeVerify(codeInfo.id)">立即使用</el-button>
          </div>
        </div>
        <div v-if="codeInvalidMessage">
          <el-alert
            :title="codeInvalidMessage"
            type="error"
            effect="dark"
            show-icon
            :closable="false"
            :class="$style.result__detail"
          ></el-alert>
          <el-button :class="$style.action" type="primary" @click="handleContinue">繼續掃描憑證</el-button>
        </div>
      </el-card>
    </div>
    <div :class="$style.setting">
      <div :class="$style['setting-mode']">
        <el-radio-group v-model="mode">
          <el-radio-button label="manual">手動</el-radio-button>
          <el-radio-button label="auto">自動</el-radio-button>
        </el-radio-group>
        <p v-if="mode === 'manual'">若購買方案有不同的內容需入場時逐一核對，請選手動模式；掃描 QR Code 後會將客戶購買的方案及時段列出供您核對。</p>
        <p v-else>若您單一場次入場人數較多，且購買方案單純，可以選擇自動模式，設定好預約之時間場次後可以快速驗證 QR Code 是否有效並符合時段，但無法列出購買細項。</p>
        <div v-if="isAutoMode && cameraVisible" :class="$style.params">
          <!-- TODO: 思考如何更好的取對應值的文字
          <div>
            目前設定的核銷範圍：
            <br />
            {{ autoVerifyValues }}
          </div>-->
          <el-button size="small" @click="handleResetVerifyForm">重新設定核銷範圍</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
.wrapper {
  display: flex;
  align-items: center;
  min-height: $size-content-height;
  border: 1px solid $color-border-base;
}
.scanner {
  flex-grow: 1;
  :global {
    .camera {
      width: 100%;
    }
  }
}
.result {
  max-width: 66%;
  margin: auto;
  &__detail {
    margin-bottom: 20px;
    li {
      padding: 5px 0;
    }
  }
  &__action {
    text-align: center;
  }
}

.setting {
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;
  width: 300px;
  padding: 30px;
  border-left: 1px solid $color-border-base;
  &-mode {
    flex-grow: 1;
    margin-right: 15px;
  }
}

.params {
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #f4f4f5;
}
</style>
