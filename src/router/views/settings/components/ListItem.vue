<script>
import { forOwn } from 'lodash'
import lazyLoadComponent from '@router/lazyload-component'

export default {
  components: { At: () => lazyLoadComponent(import('@components/At')) },
  props: {
    itemName: {
      type: String,
      default: '',
    },
    defaultValue: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      tryingStore: false,
      mapTemplateString: {
        姓名: '黃大明',
        訂單成立時間: ' 2021/01/01 00:00 ',
        店家名稱: '小捲尾寵物美容',
        預約時間: ' 2021/01/03 13:00 ',
        訂單付款時間: ' 2021/01/01 10:00 ',
        服務項目: '小捲尾美容SPA',
        人數: ' 1 ',
        數量: ' 1 ',
        短網址: ' ipbk.in/yoga ',
        包月方案項目: '招牌沐浴超值特惠組',
        店家電話: '02-27422526',
        店家地址: '台北市松山區健康路239號',
        店家網址: 'https://j-tails.com',
        訂單取消時間: ' 2021/01/02 09:00 ',
        訂單短網址: 'ipbk.in/12345',
        服務類型: '到店服務',
        訂單付款期限: ' 2021/01/02 23:59 ',
        原始預約時間: ' 2021/01/03 10:00 ',
        帳號: 'account@01',
        密碼: 'password@01',
        分店名稱:'中山店',
        分店電話:'002-274225262',
        分店地址:'台北市松山區健康路239號',
        舊預約時間:'2021/01/03 10:00'
      },
      mapEnableMessage: {
        order_Qrcode: {
          sms: '客戶會在付款後收到確認簡訊',
          email: '客戶會在付款後收到確認電子郵件',
        },
        order_CheckoutLink: {
          sms: '客戶會在付款前收到繳款連結簡訊',
          email: '客戶會在付款前收到繳款連結電子郵件',
        },
        order_Remind: {
          sms: '客戶會在行前收到行程提醒簡訊',
          email: '客戶會在行前收到行程提醒電子郵件',
        },

        order_Cancel: {
          sms: '客戶會在預約被取消時收到提醒簡訊',
          email: '客戶會在行前收到行程提醒電子郵件',
        },
        order_ChangeTime: {
          sms: '客戶會在預約改期時收到提醒簡訊',
          email: '客戶會在行前收到行程提醒電子郵件',
        },
        order_RequestDeduct: {
          sms: '客戶會在訂單折抵時收到提醒簡訊',
          email: '客戶會在行前收到行程提醒電子郵件',
        },

        prepaid_Qrcode: {
          sms: '客戶會在包月方案付款完成後收到購買完成簡訊',
          email: '客戶會在包月方案付款完成後收到購買完成電子郵件',
        },
        prepaid_CheckoutLink: {
          sms: '客戶會在選購包月方案後收到付款連結簡訊',
          email: '客戶會在選購包月方案後收到付款連結電子郵件',
        },
        prepaid_Cancel: {
          sms: '客戶會在退款完成時收到提醒簡訊',
          email: '客戶會在選購包月方案後收到付款連結電子郵件',
        },
        member_SendPassword: {
          sms: '客戶會在註冊成功時收到提醒簡訊',
          email: '',
        },

        orderAdd_PaySuccess: {
          sms: '客戶會在加購訂單付款完成後收到購買完成簡訊',
          email: '客戶會在加購訂單付款完成後收到購買完成電子郵件',
        },
        orderAdd_CheckoutLink: {
          sms: '客戶會在選購加購項目後收到付款連結簡訊',
          email: '客戶會在選購加購項目後收到付款連結電子郵件',
        },
        orderAdd_Cancel: {
          sms: '客戶會在加購訂單退款完成時收到提醒簡訊',
          email: '',
        },
      },
      mapFixedPhrase: {
        order_Qrcode: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間', '分店電話', '分店地址', '店家網址', '訂單短網址', '訂單付款時間'],
        order_CheckoutLink: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間', '分店電話', '分店地址', '訂單付款期限', '訂單短網址', '訂單成立時間'],
        order_Remind: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間', '分店電話', '分店地址', '訂單短網址'],

        order_Cancel: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間', '分店電話', '分店地址', '訂單短網址', '訂單取消時間'],
        order_ChangeTime: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間','舊預約時間', '分店電話', '分店地址', '訂單付款期限', '訂單短網址'],
        order_RequestDeduct: ['姓名', '店家名稱', '服務類型', '服務項目', '預約時間', '店家電話', '店家地址', '店家網址', '訂單成立時間', '訂單短網址'],

        prepaid_Qrcode: ['姓名', '店家名稱', '分店名稱', '分店電話', '分店地址', '訂單短網址', '包月方案項目', '訂單付款時間'],
        prepaid_CheckoutLink: ['姓名', '店家名稱', '分店名稱', '分店電話', '分店地址', '訂單付款期限', '訂單短網址', '訂單成立時間','包月方案項目'],
        prepaid_Cancel: ['姓名', '店家名稱', '分店名稱', '分店電話', '分店地址', '訂單短網址', '包月方案項目', '訂單取消時間'],

        member_SendPassword: ['帳號', '密碼', '店家名稱', '店家電話', '店家地址', '店家網址'],

        orderAdd_PaySuccess: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間', '分店電話', '分店地址', '訂單短網址','訂單付款時間'],
        orderAdd_CheckoutLink: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間', '分店電話', '分店地址','訂單短網址','訂單成立時間','訂單付款期限'],
        orderAdd_Cancel: ['姓名', '店家名稱', '分店名稱', '服務項目', '預約時間', '分店電話', '分店地址', '訂單短網址','訂單取消時間'],
      },
      mapDefaultPreview: {
        order_Qrcode: {
          sms: '您預約{店家名稱}{分店名稱}{預約時間}{服務項目}，詳情請見以下連結:{訂單短網址}',
          email: '',
        },
        order_CheckoutLink: {
          sms: '您已預約{店家名稱}{分店名稱}的{預約時間}{服務項目}，請點連結立即付款:{訂單短網址}',
          email: '',
        },
        order_Remind: {
          sms: '提醒您已預約{店家名稱}{分店名稱}的{預約時間} {服務項目}，若不克前往請提前與我們聯繫。',
          email: '',
        },

        order_Cancel: {
          sms: '您於{店家名稱}{分店名稱}{預約時間}的預約已於{訂單取消時間}取消，倘若有任何問題，歡迎與我們聯繫!',
          email: '',
        },
        order_ChangeTime: {
          sms: '您於{店家名稱}{分店名稱}的預約{服務項目}已改期到{預約時間}，如有問題請與我們聯繫！',
          email: '',
        },
        order_RequestDeduct: {
          sms: '您已在{訂單成立時間}使用{包月方案名稱}預約{服務類型}{服務項目}，請點擊連結確認折抵:{訂單短網址}',
          email: '',
        },

        prepaid_Qrcode: {
          sms: '您於{店家名稱}{分店名稱}購買的{包月方案項目}付款完成，您可開始使用您的包月方案',
          email: '',
        },
        prepaid_CheckoutLink: {
          sms: '您已購買{店家名稱}的{包月方案項目}，請點連結立即付款:{訂單短網址}',
          email: '',
        },
        prepaid_Cancel: {
          sms: '您於{店家名稱}{分店名稱}購買的{包月方案項目}已於{訂單取消時間}取消，如有任何疑問請聯繫我們',
          email: '',
        },
        member_SendPassword: {
          sms: '感謝您註冊成為小捲尾寵物美容的會員，您的帳號：{帳號}密碼：{密碼}，請儘速登入會員中心修改密碼！',
          email: '',
        },

        orderAdd_PaySuccess: {
          sms: '您的加購訂單已付款完成！點擊查看詳情：{訂單短網址}',
          email: '',
        },
        orderAdd_CheckoutLink: {
          sms: '您的加購訂單已成立，請點連結立即付款:{訂單短網址}',
          email: '',
        },
        orderAdd_Cancel: {
          sms: '您的加購訂單已於{訂單取消時間}取消，如有任何疑問請聯繫商家，點擊查看詳情:{訂單短網址}',
          email: '',
        },
      },
    }
  },
  computed: {
    isSmsEnable() {
      return this.defaultValue.sms.receive === 1
    },
    isEmailEnable() {
      return this.defaultValue.email.receive === 1
    },
    isSmsUseTemplate() {
      return this.defaultValue.sms.useCustomTemplate === 1
    },
    isEmailUseTemplate() {
      return this.defaultValue.email.useCustomTemplate === 1
    },
    smsContent() {
      return this.defaultValue.sms.templateContentHTML ? this.defaultValue.sms.templateContentHTML : this.defaultValue.sms.templateContent
    },
  },
  // watch: {
  //   defaultValue: 'updateSubmitData',
  // },
  methods: {
    emitClose() {
      this.$emit('close')
      this.$refs.form.resetFields()
    },
    updateSubmitData() {
      this.submitData = Object.assign({}, this.defaultValue)
    },
    save() {
      this.tryingStore = true
      this.$emit('save', this.getSubmitData(), () => {
        this.tryingStore = false
      })
    },
    getSubmitData() {
      const submitData = {}
      const productType = this.itemName.split('_')[0]
      const itemType = this.itemName.split('_')[1]

      this.defaultValue.sms.templateContent = this.$refs.smsTemplate.getTemplateContent()
      this.defaultValue.sms.templateContentHTML = this.$refs.smsTemplate.getTemplateContentHTML()
      // this.defaultValue.email.templateContent = this.$refs.emailTemplate.getTemplateContent()
      // this.defaultValue.email.templateContent = this.$refs.emailTemplate.getTemplateContentHTML()

      forOwn(this.defaultValue, (config, sendType) => {
        if (submitData[sendType] === undefined) submitData[sendType] = {}
        submitData[sendType][productType] = {
          [itemType]: config,
        }
      })
      return submitData
    },
    previewContent(templateString = '') {
      let content = templateString
      if (content === null) return ''

      // let content = `樣式預覽： 親愛的{姓名}，感謝您的訂購！ 您已向{店家名稱}購買超值方案「新課體驗組合」，{預約時間}請點以下連結立即付款完成結帳{短網址}`
      Object.keys(this.mapTemplateString).forEach((key) => {
        content = content.replace(new RegExp(`{${key}}`, 'g'), this.mapTemplateString[key])
      })
      content = content.replace(/\n/g, '<br>')

      return content
    },
    updateTemplate(type) {
      this.defaultValue[type].templateContent = this.$refs[`${type}Template`].getTemplateContent()
      this.defaultValue[type].templateContentHTML = this.$refs[`${type}Template`].getTemplateContentHTML()

      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
  },
}
</script>

<template>
  <div :class="$style.config">
    <div class="sms">
      <h5 class="title">簡訊設定 <BaseIcon name="comment-dots"/></h5>
      <div class="enable-disable">
        <div class="disable"><el-radio v-model="defaultValue.sms.receive" :label="0">關閉簡訊通知</el-radio></div>
        <div class="enable"
          ><el-radio v-model="defaultValue.sms.receive" :label="1">啟用簡訊通知</el-radio><span style="color: #aaaaaa;">－{{ mapEnableMessage[itemName].sms }}</span></div
        >
      </div>
      <el-divider></el-divider>
      <div v-show="isSmsEnable">
        <div><el-radio v-model="defaultValue.sms.useCustomTemplate" :label="0">預設內容：</el-radio></div>
        <div class="content" v-html="mapDefaultPreview[itemName].sms"> 您已向[店家名稱]購買包月方案「[包月方案名稱]」，請點以下連結立即付款完成結帳[訂單短網址]</div>
        <div><el-radio v-model="defaultValue.sms.useCustomTemplate" :label="1">自訂內容：</el-radio></div>
        <div :class="['content', !isSmsUseTemplate ? 'disabled' : '']">
          <At ref="smsTemplate" :fixed-phrase="mapFixedPhrase[itemName]" :content="smsContent" @update="updateTemplate('sms')"></At>
          <!-- <el-input v-model="defaultValue.sms.templateContent"></el-input> -->

          <el-alert style="margin-top: 10px;" title="提醒您，簡訊實際字數計算會因參數長度有所不同。每則簡訊字數依實際計算為準。" type="info" show-icon :closable="true"> </el-alert>
          <div style="margin-top: 30px;">
            <div>樣式預覽：</div>
            <div style="margin-bottom: 30px;" v-html="previewContent(defaultValue.sms.templateContent)"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="email">
      <h5 class="title">郵件設定 <BaseIcon name="envelope" /></h5>
      <div class="enable-disable">
        <div class="disable"
          ><el-radio v-model="defaultValue.email.receive" :label="0"
            >關閉郵件通知</el-radio
          ></div
        >
        <div class="enable"
          ><el-radio v-model="defaultValue.email.receive" :label="1"
            >啟用郵件通知</el-radio
          ><span style="color: #aaaaaa;"
            >－{{ mapEnableMessage[itemName].email }}</span
          ></div
        >
      </div>
      <el-divider></el-divider>
      <div v-show="isEmailEnable">
        <div
          ><el-radio v-model="defaultValue.email.useCustomTemplate" :label="0"
            >預設內容：</el-radio
          ></div
        >
        <div class="content" v-html="mapDefaultPreview[itemName].email"> </div>

        <div
          ><el-radio v-model="defaultValue.email.useCustomTemplate" :label="1"
            >自訂內容：</el-radio
          ></div
        >
        <div :class="['content', !isEmailUseTemplate ? 'disabled' : '']">
          <At
            ref="emailTemplate"
            :fixed-phrase="mapFixedPhrase[itemName]"
            :content="defaultValue.email.templateContent"
            @update="updateTemplate('email')"
          ></At>
          <div style="margin-top: 30px;">
            <div>樣式預覽：</div>
            <div
              style="margin-bottom: 30px;"
              v-html="previewContent(defaultValue.email.templateContent)"
            ></div>
          </div>
        </div>
      </div>
    </div> -->
    <el-button :loading="tryingStore" type="primary" style="width: 100%; margin-top: 50px;" @click="save">儲存變更</el-button>
  </div>
</template>
<style lang="scss" module>
.config {
  :global {
    .disabled {
      opacity: 0.3;
      pointer-events: none;
    }
    .title {
      color: #2f8d96;
    }
    .content {
      padding-left: 25px;
      & + div {
        margin-top: 30px;
      }
    }

    .el-radio__input {
      vertical-align: top;
    }
    .enable-disable {
      .disable + .enable {
        margin-top: 20px;
      }
    }
  }
}
</style>
