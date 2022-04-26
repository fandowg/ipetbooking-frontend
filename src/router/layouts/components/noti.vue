<script>
// import lazyLoadComponent from '@router/lazyload-component'
import formatDate from '@utils/format-date'
import { authComputed, memberComputed } from '@state/helpers'
import io from 'socket.io-client'
import Echo from 'laravel-echo'

export default {
  filters: {
    formatDate,
    formatTimeOrDate(date) {
      const isToDay = new Date(date).getDate() === new Date().getDate()
      return isToDay ? formatDate(date, 'time') : formatDate(date)
    },
  },
  data() {
    return {
      notiList: [],
      displayLimit: 5,
    }
  },
  computed: {
    ...authComputed,
    ...memberComputed,
    unreadChatCount() {
      let total = 0
      this.notiList.forEach((noti) => {
        noti.unreadCount && total++
      })
      return total
    },
    isEmptyList() {
      return this.notiList.length === 0
    },
    isHttps() {
      return window.location.protocol === 'https:'
    },
    isAllowNoti() {
      return window.Notification.permission === 'granted'
    },
  },
  watch: {},
  created() {
    this.tryToSearch()
    this.initBrowserNotification()
  },
  mounted() {
    if (this.isHttps) this.initEcho()
  },
  beforeDestroy() {
    if (this.isHttps) this.echo.leave(`chat.${this.currentUser.merchantId}`)
  },
  methods: {
    async tryToSearch() {
      const query = {
        // is_read: 'all',
        order: 'desc',
        type: 'chat',
        page: 1,
        limit: 5,
      }
      const { items } = await this.$store.dispatch('member/fetchChats', query)
      this.notiList = items
    },
    goChat(data) {
      this.$router.push({
        name: 'view-chat',
        params: { memberId: data.member_id },
      })
    },
    goChatList() {
      this.$router.push({
        name: 'chat',
      })
    },
    initEcho() {
      const host_port = document.location.protocol === 'https:' ? ':8443' : ':6001';

      this.echo = new Echo({
        client: io,
        broadcaster: 'socket.io',
        host: window.location.hostname + host_port,
        namespace: 'DaydreamLab.Dddream.Events.Chat',
        auth: {
          headers: {
            Authorization: 'Bearer ' + this.currentUser.token,
          },
        },
      })

      this.echo.private(`chat.${this.currentUser.merchantId}`).notification((noti) => {
        this.updateList(noti.data)
        this.showNoti(noti.data)
      })
    },
    updateList(data) {
      if (this.isSameWithActiveChatMember(data.member_id)) return
      const isExists = this.notiList.some((noti, index) => {
        if (noti.member_id === data.member_id) {
          this.notiList.splice(index, 1, { ...data })
          return true
        }
        return false
      })
      if (!isExists) this.notiList.unshift(data)
      if (this.notiList.length > this.displayLimit) this.notiList.pop()
      this.sortListToDescByDateTime()
    },
    sortListToDescByDateTime() {
      this.notiList.sort((a, b) => (Date.parse(a.created_at) < Date.parse(b.created_at) ? 1 : Date.parse(a.created_at) > Date.parse(b.created_at) ? -1 : 0))
    },
    initBrowserNotification() {
      // Let's check if the browser supports notifications
      if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification')
      }
      // Otherwise, we need to ask the user for permission
      else if (window.Notification.permission !== 'denied') {
        window.Notification.requestPermission()
      }
    },
    showNoti(data) {
      if (this.isAllowNoti && !this.isSameWithActiveChatMember(data.member_id))
        new Notification(data.name, {
          body: data.message,
          icon: '/favicon.ico',
        })
    },
    isSameWithActiveChatMember(member_id) {
      return this.activeChatMemberId === member_id
    },
  },
}
</script>

<template>
  <span :class="$style.action">
    <el-dropdown :class="$style.action" trigger="click">
      <el-badge :hidden="unreadChatCount === 0" :value="unreadChatCount" class="item">
        <BaseIcon name="bell" />
      </el-badge>

      <el-dropdown-menu slot="dropdown" :class="[$style['action-menu'], $style.chat]">
        <el-dropdown-item class="title" divided>
          新訊息
        </el-dropdown-item>
        <template v-if="!isEmptyList">
          <el-dropdown-item v-for="(noti, index) in notiList" :key="index" class="message" :class="noti.unreadCount > 0 ? 'unread' : ''" command="goChat" divided>
            <div @click="goChat(noti)">
              <div class="name-date">
                <div class="name">{{ noti.name }} {{ noti.unreadCount > 0 ? `（${noti.unreadCount}）` : '' }}</div
                ><div class="date">{{ noti.created_at | formatTimeOrDate }}</div>
              </div>
              <div class="phone">{{ `${noti.phoneCode} ${noti.phoneNumber}` }}</div>
              <div class="text">{{ noti.message || '客戶傳送了圖片。' }}</div>
            </div>
          </el-dropdown-item>
        </template>
        <template v-else>
          <div :class="$style.empty">暫無資料</div>
        </template>
        <el-dropdown-item class="view-all" command="goChatList" divided>
          <div @click="goChatList">查看所有訊息</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<style lang="scss" module>
@import '@design';

.action {
  margin: 0 12px;
  :global {
    .el-badge {
      font-size: 18px;
    }
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
      div {
        line-height: 24px;
      }
      .name-date {
        display: flex;
        justify-content: space-between;
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
        font-weight: 100;
        letter-spacing: 1.3px;
        color: black;
        font-size: 12px;
      }
      .text {
        color: #9b9b9b;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
        width: 100%;
      }
      &.unread {
        background-color: lighten($color: $color-primary, $amount: 38%);
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

.empty {
  line-height: 90px;
  width: 320px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #ebeef5;
  color: #cacaca;
}
</style>
