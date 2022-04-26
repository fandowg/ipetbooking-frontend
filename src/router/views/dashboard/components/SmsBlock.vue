<script>
export default {
  data() {
    return {
      loading: false,
      smsInfo: {
        available: 500,
        usage: 0,
      },
    }
  },
  computed: {
    status() {
      const remaining = (this.smsInfo.available - this.smsInfo.usage)/this.smsInfo.available
      const className =
        remaining <= 0.5 ? (remaining <= 0.1 ? 'danger' : 'warning') : ''
      return this.$style[className]
    },
  },
  created() {
    this.tryToFetchSMSInfo()
  },
  methods: {
    async tryToFetchSMSInfo() {
      this.loading = true
      this.smsInfo = await this.$store.dispatch('dashboard/fetchSMSInfo')
      this.loading = false
    },
    redirectSettings(activeTab = '') {
      this.$router.push({
        name: 'settings',
        params: { activeTab },
      })
    },
  },
}
</script>

<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="header">
      <h3 class="block-title">通知相關</h3>
    </div>
    <el-row :gutter="15">
      <el-col v-loading="loading" :sm="6" :span="24" class="mb-2 mb-sm-0">
        <el-card :class="[$style['card-sms'], status]">
          <div class="card-sms-title">本月簡訊已發則數 / 可發則數</div>
          <div class="card-sms-count Jost"
            >{{ smsInfo.usage }} / {{ smsInfo.available }}</div
          >
        </el-card>
      </el-col>
      <template v-can="'redirectSms'">
        <el-col :sm="6" :span="24" class="mb-2 mb-sm-0">
          <el-button
            class="large-btn"
            type="primary"
            @click="redirectSettings('sms-record')"
            >檢視發送記錄<BaseIcon name="paper-plane"
          /></el-button>
        </el-col>
        <!-- <el-col :span="6">
          <el-button
            class="large-btn"
            type="primary"
            @click="redirectSettings('')"
            >前往增購簡訊方案<BaseIcon name="donate"
          /></el-button>
        </el-col> -->
        <el-col :sm="6" :span="24" class="mb-2 mb-sm-0">
          <el-button
            class="large-btn"
            type="primary"
            @click="redirectSettings('notification')"
            >通知設定<BaseIcon name="cogs"
          /></el-button>
        </el-col>
      </template>
    </el-row>
    <template> </template>
  </el-card>
</template>
<style lang="scss" module>
.card-sms {
  background: linear-gradient(90deg, $color-secondary, #e28a5e);
  &.warning {
    background: linear-gradient(90deg, #fbb034 0%, #ffdd00 87%);
  }
  &.danger {
    background: linear-gradient(147deg, #990000 0%, #ff0000 74%);
  }
  :global {
    .el-card__body {
      height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
      .card-sms-title {
        font-size: 10px;
      }
      .card-sms-count {
        font-size: 1.5em;
        font-weight: 600;
        letter-spacing: 2px;
      }
    }
  }
}
</style>
