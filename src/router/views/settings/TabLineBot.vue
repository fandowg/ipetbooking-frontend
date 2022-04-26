<script>
import tourMixin from '@src/mixins/tour'
import { merchantComputed } from '@state/helpers'

export default {
  mixins: [tourMixin],
  tourName: 'merchantLinebot',
  data() {
    return {
      submitData: {
        enabled: 0,
        id: '',
        secret: '',
        accessToken: '',
        webhook: '',
      },
      showSecretValue: false,
    }
  },
  computed: {
    ...merchantComputed,
  },
  created() {
    this.submitData = Object.assign({}, this.currentMerchant.lineBot)
  },
  methods: {
    copyWebhookUrl() {
      this.$refs.webhookInput.select()
      document.execCommand('copy')
      this.$message('連結複製成功')
    },
    async tryToStore() {
      const submitEnabled = this.submitData.enabled
      if (submitEnabled === 1) await this.$refs.form.validate()
      await this.$store.dispatch('merchant/store', {
        ...this.currentMerchant,
        lineBot: this.submitData,
      })
      this.$message({
        message: submitEnabled === 1 ? '啟用設定成功!' : '已關閉 LINE bot',
        type: 'success',
      })
      this.$emit('update')
    },
    changeEnabled() {
      this.$refs.form.clearValidate()
    },
  },
}
</script>

<template>
  <div>
    <el-alert type="info" :closable="false" show-icon>
      <p slot="title">
        如欲啟用 LINE bot 讓客戶透過您的 LINE@ 官方帳號進行預約，請先點擊
        <a
          data-tour-text="請先點擊連結閱讀我們精心製作的教學，手把手設置您的專屬 LINE Bot！"
          href="https://developers.line.biz/zh-hant/docs/messaging-api/getting-started/"
          target="_blank"
        >此教學</a> 取得 LINE bot 必要資訊後填寫對應下方欄位。
      </p>
    </el-alert>
    <h4 class="form-block-title">是否啟用</h4>
    <el-switch
      v-model="submitData.enabled"
      data-tour-text="請先啟用 LINE Bot，系統才能自動連結您的 LINE Bot 資訊喔！"
      active-text="啟用"
      :active-value="1"
      :inactive-value="0"
      :class="$style.switcher"
      :disabled="currentMerchant.lineBot.enabled === null"
      @change="changeEnabled"
    ></el-switch>
    <el-button
      v-if=" currentMerchant.lineBot.enabled !== submitData.enabled"
      data-tour-text="參數填寫完畢後請記得儲存，啟用 LINE Bot！"
      type="primary"
      size="medium"
      @click="tryToStore"
    >儲存變更</el-button>
    <h4 data-tour-text="請將 LINE Bot 的參數填寫至下列對應欄位內。" class="form-block-title">參數設定</h4>
    <el-form
      ref="form"
      :model="submitData"
      label-position="top"
      :disabled="!submitData.enabled"
      class="el-form-item--normal-margin"
    >
      <el-form-item label="Channel ID" prop="id" required>
        <el-input v-model="submitData.id" placeholder="如：1607186945" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Channel Secret" prop="secret" required>
        <el-input
          v-model="submitData.secret"
          :type="(showSecretValue) ? 'text' : 'password'"
          placeholder="如：dd3b5f41c7a47db0e9d3fa242654d5fa"
          autocomplete="off"
        >
          <el-button
            slot="append"
            @click="showSecretValue = !showSecretValue"
          >{{ (showSecretValue) ? '隱藏' : '顯示' }}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="Channel Access Token" prop="accessToken" required>
        <el-input
          v-model="submitData.accessToken"
          placeholder="如：oetJcVMLMEXPkiqUgzNN0ou9Ye7XOgS5ybbZI0Ovtm4cnO5wmZ2aJIM9l4SdimEkLMf53tpzg5BWkZl8PiczgGFXRVDOlx4Ix8I0Whmk/owa48xZBjxNz5sa93iF4JvPQcOaYu4wb7i+y43bsriIQdB04t89/1O/w1cDnyilFU="
          autocomplete="off"
        />
      </el-form-item>
    </el-form>

    <h4
      data-tour-text="請記得啟用 LINE Bot 的 Webhook 並將下方網址複製至 Webhook URL 欄位完成設定！"
      class="form-block-title"
    >Webhook URL</h4>
    <el-input ref="webhookInput" :value="submitData.webhook">
      <el-button slot="append" @click="copyWebhookUrl">複製此網址</el-button>
    </el-input>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.switcher {
  margin-right: 25px;
}
</style>
