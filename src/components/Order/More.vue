<script>
import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import { genderFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import { Clipboard } from '@capacitor/clipboard';

import { authComputed } from '@state/helpers'

export default {
  components: {
    BaseButtonDialog,
    NotificationWrite: () => lazyLoadComponent(import('@components/NotificationWrite')),
    OrderMemberDialog: () => lazyLoadComponent(import('@components/OrderMemberDialog')),
  },
  filters: { formatDate, genderFilter },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      writeDialogVisible: false,
      memberDialogVisible: false,
      relatedChat: [],
      chatHistoryDialogVisible: false,
      shareLink: '',
      shareDialogVisible: false,
      mapStatusName: {
        'PAID': '訂單資訊',
        'UNPAID': '付款',
        // '3': '訂單資訊',
      },
      tryingSendSMS: false,
      tryingSendEmail: false,
    }
  },
  created() {
    if (this.currentUserRoutes.includes('chat')) this.tryToFetchChat()
  },
  computed: {
    ...authComputed,
    isOnChatView() {
      return this.$route.name === 'view-chat'
    },
    linkTitle() {
      const { addOrders } = this.defaultValue
      if (addOrders.length) {
        let hasUnpaid = false
        hasUnpaid = addOrders.some((order) => order.status === 2)
        return this.mapStatusName[hasUnpaid ? 'UNPAID' : 'PAID']
      } else return this.mapStatusName[this.defaultValue.paymentStatus]
    },
  },
  methods: {
    showMemberDialog() {
      this.memberDialogVisible = true
    },
    async tryToGetShareLink() {
      this.shareLink = await this.$store.dispatch('order/getLink', this.defaultValue.id)
    },
    async tryToFetchChat() {
      const orderInfo = this.defaultValue
      this.relatedChat = await this.$store.dispatch('member/fetchOrderRelatedChat', {
        phone: `${orderInfo.phoneCode}-${orderInfo.phoneNumber}`,
        page: 1,
        limit: 100,
        order_id: orderInfo.id,
      })
    },
    showChatHistory() {
      if (this.relatedChat.length > 1) {
        this.chatHistoryDialogVisible = true
      } else {
        this.$store.dispatch('member/updateMessageId', this.relatedChat[0])
        this.redirectToChatView(this.relatedChat[0].data.id)
      }
    },
    onHistoryClick(data) {
      this.$store.dispatch('member/updateMessageId', data)
      this.redirectToChatView(data.data.id)
    },
    redirectToChatView(messageId) {
      if (this.isOnChatView) {
        this.chatHistoryDialogVisible = false
        this.$emit('close')
        return
      }
      this.$router.push({
        name: 'view-chat',
        params: {
          memberId: this.defaultValue.memberId,
          messageId,
        },
      })
    },
    showShareDialog() {
      this.shareDialogVisible = true
    },
    async copyShareLink() {
      const ghostInput = document.createElement('INPUT')
      document.body.appendChild(ghostInput)
      ghostInput.setAttribute('value', this.shareLink)
      ghostInput.select()
      document.execCommand('copy')
      document.body.removeChild(ghostInput)

      if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
        await Clipboard.write({
          string: this.shareLink
        });
      }

      this.$message('連結複製成功')
    },
    handleShareLink(platform) {
      // <!-- <a href=”fb-messenger://share/?link= https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fsend-dialog&app_id=123456789”>Send In Messenger</a> -->
      const platformLinkMap = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${this.shareLink}`,
        line: `https://social-plugins.line.me/lineit/share?url=${this.shareLink}`,
      }
      window.open(platformLinkMap[platform], '_blank')
    },
    async tryToSendEmail() {
      this.tryingSendEmail = true
      try {
        await this.$store.dispatch('order/sendLink', {
          orderId: this.defaultValue.id,
          router: 'email',
        })
        this.$alert(`已發送${this.linkTitle}連結至使用人 Email`, 'Email 發送成功！', {
          confirmButtonText: '確認',
          center: true,
          callback: () => {
            this.tryingSendEmail = false
          },
        })
      } catch (error) {
        this.tryingSendEmail = false
      }
    },
    async tryToSendSMS() {
      this.tryingSendSMS = true
      try {
        await this.$store.dispatch('order/sendLink', {
          orderId: this.defaultValue.id,
          router: 'sms',
        })
        this.$alert(`已發送${this.linkTitle}連結簡訊至使用人電話`, '簡訊發送成功！', {
          confirmButtonText: '確認',
          center: true,
          callback: () => {
            this.tryingSendSMS = false
          },
        })
      } catch (error) {
        this.tryingSendSMS = false
      }
    },
    closeDialog() {
      this.writeDialogVisible = false
    },
  },
}
</script>

<template>
  <div>
    <template v-if="defaultValue.status !== 0">
      <el-button class="icon-text" @click="writeDialogVisible = true"><BaseIcon name="envelope" :icon-style="'fal'"></BaseIcon>撰寫通知</el-button>
      <el-button v-if="currentUserRoutes.includes('view-member')" class="icon-text" @click="showMemberDialog"><BaseIcon name="address-card" :icon-style="'fal'"></BaseIcon>查看客戶資訊</el-button>
      <el-button v-if="currentUserRoutes.includes('chat') && relatedChat.length > 0" class="icon-text" @click="showChatHistory">
        查看問答紀錄
        <el-dialog title="請選擇欲查看的紀錄" :visible.sync="chatHistoryDialogVisible" top="0" width="680px" append-to-body>
          <div :class="$style.chat">
            <div v-for="(chat, index) in relatedChat" :key="index" class="message" @click.stop="onHistoryClick(chat)">
              <div class="text">{{ chat.data.message || '客戶傳送了圖片。' }}</div>
              <div class="name-date">
                <div class="date">{{ chat.data.created_at | formatDate('dateTime') }}</div>
              </div>
            </div>
          </div>
        </el-dialog>
      </el-button>
      <el-button v-if="defaultValue.status !== 5" class="icon-text" @click="showShareDialog"><BaseIcon name="paper-plane" :icon-style="'fal'"></BaseIcon>分享{{ linkTitle }}頁面連結</el-button>
      <el-button v-if="defaultValue.status === 1 || defaultValue.status === 2" :loading="tryingSendEmail" class="icon-text" @click="tryToSendEmail"
        ><BaseIcon name="paper-plane" :icon-style="'fal'"></BaseIcon>發送{{ linkTitle }}連結至使用人Email</el-button
      >

      <el-dialog title="分享連結" :visible.sync="shareDialogVisible" top="0" width="680px" append-to-body lock-scroll @open="tryToGetShareLink">
        <div slot="title">
          <h5>{{ `#${defaultValue.id}` }}</h5>
          <ul>
            <li>使用人：{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</li>
            <li>訂購內容：{{ defaultValue.productName }} {{ defaultValue.date | formatDate }} {{ defaultValue.time }}</li>
          </ul>
        </div>

        <div :class="$style['share__buttons']">
          <el-button type="text" :class="$style['share__button']" @click="handleShareLink('facebook')">
            <BaseIcon :class="$style['share__icon']" name="facebook-f" icon-style="fab" />
          </el-button>

          <el-button type="text" :class="$style['share__button']" @click="handleShareLink('line')">
            <BaseIcon :class="$style['share__icon']" name="line" icon-style="fab" />
          </el-button>
          <el-button  type="text" :loading="tryingSendSMS" :class="$style['share__button']" @click="tryToSendSMS">
            <BaseIcon :class="$style['share__icon']" name="sms" />
          </el-button>
          <div :class="$style['share__button']">
            <el-button circle @click="copyShareLink">
              <BaseIcon name="copy" />
            </el-button>
            <div :class="$style['share__label']">複製連結</div>
          </div>
        </div>
      </el-dialog>

      <BaseButtonDialog :only-dialog="true" :title="'撰寫通知'" :dialog-visible.sync="writeDialogVisible" :destroy="true" floating>
        <NotificationWrite :selected-order-ids="[defaultValue.id]" :source-name="'order'" :source-order="defaultValue" @close="closeDialog" />
      </BaseButtonDialog>
    </template>
    <template v-else>
      <el-button v-if="currentUserRoutes.includes('view-member')" class="icon-text" @click="showMemberDialog"><BaseIcon name="address-card" :icon-style="'fal'"></BaseIcon>查看客戶資訊</el-button>
    </template>
    <OrderMemberDialog :visible.sync="memberDialogVisible" :member-id="defaultValue.memberId" />
  </div>
</template>

<style lang="scss" module>
@import '@design';
.share {
  &__buttons {
    display: flex;
    align-items: center;
    text-align: center;
  }
  &__button {
    flex: 1;
  }
  &__icon {
    font-size: 3rem;
  }
  &__label {
    margin-top: 10px;
  }
}
.chat {
  padding: 0 !important;
  :global {
    li {
      margin: 0;
      &:before {
        height: 0 !important;
      }
    }
    .title {
      pointer-events: none;
      font-weight: 400;
      color: #808080;
      letter-spacing: 2.4px;
    }
    .message {
      max-width: 390px;
      overflow: hidden;
      padding-top: 10px;
      min-width: 320px;
      border: 1px solid #ebeef5;
      margin: 20px 0 0;
      padding: 10px;
      cursor: pointer;
      div {
        line-height: 24px;
      }
      .name-date {
        display: flex;
        justify-content: inherit;
        flex-direction: row-reverse;
        color: #031d1d;
        .name {
          font-size: 14px;
          color: black;
          font-weight: 400;
        }
        .date {
          color: #9b9b9b;
          font-size: 12px;
        }
      }
      .phone {
        font-weight: 400;
        letter-spacing: 1.3px;
        color: black;
      }
      .text {
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
        width: 100%;
      }
      &.unread {
        background-color: lighten($color: $color-primary, $amount: 38%);
      }
      &:hover {
        background-color: rgb(247 227 196 / 0.3);
      }
    }
    .view-all {
      text-align: center;
      color: $color-primary;
      padding: 5px 20px;
      letter-spacing: 2.3px;
    }
  }
}
</style>
