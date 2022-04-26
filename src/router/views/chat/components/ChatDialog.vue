<script>
import lazyLoadComponent from '@router/lazyload-component'
import formatDate from '@utils/format-date'
import { throttle } from 'lodash'
import { orderStatusFilter } from '@utils/filter-value-to-text'
import { authComputed } from '@state/helpers'
import io from 'socket.io-client'
import Echo from 'laravel-echo'
import VueScrollTo from 'vue-scrollto'

function makeid(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export default {
  components: {
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),

    FileUpload: () => lazyLoadComponent(import('./FileUpload')),
    FileGallery: () => lazyLoadComponent(import('./FileGallery')),
  },
  filters: {
    orderStatusFilter,
    formatDate,
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      submitText: '',
      echo: {},
      scrollOptions: {
        container: '#log-container',
        easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
        // offset: -60,
        force: true,
        cancelable: true,
        x: false,
        y: true,
      },
      logList: [],
      historyList: [],
      replyTo: {},
      focused: '',
      status: '1',
      mode: 'log',
      loading: false,
      loading_previous: false,
      loading_latest: false,
      lastMessageId: '',
      nothingToLoading: false,
      nothingToLoading_previous: false,
      nothingToLoading_latest: false,

      message_per_page: 10,
      memberId: this.$route.params.memberId,
      previous_page: 1,
      history_request_id: '',
      history_previous_page: 1,
      history_latest_page: 1,

      errorList: [],
      showNewLog: false,

      tryingSendMessage: false,
      tryingFetchSpecificChat: false,

      unwatch: {},
      cachedTimestamp: Date.now().toString(),
    }
  },
  computed: {
    ...authComputed,
    showReply() {
      return Object.keys(this.replyTo).length > 0
    },
    isLog() {
      return this.mode === 'log'
    },
    isHistory() {
      return this.mode === 'history'
    },
    isHttps() {
      return window.location.protocol === 'https:'
    },
  },
  created() {
    if (this.$route.params.messageId) this.tryToFetchSpecificChat(this.$route.params.messageId)
    else this.tryToFetchHistory()

    // if order detail showChatHistory method triggered
    this.unwatch = this.$store.watch(
      (state) => {
        return state.member.cachedMessageId
      },
      (ID) => {
        if (ID === '') return
        this.scrollToMessageOrFetchMessage(ID)
      }
    )
  },
  mounted() {
    if (this.isHttps) this.initEcho()

    this.tryToStoreChatReaded()
  },
  beforeDestroy() {
    if (this.isHttps) this.closeEcho()
    this.tryToStoreChatReaded()
    this.unwatch()
    this.$store.dispatch('member/updateActiveChatMemberId', '')
  },
  methods: {
    formatDate,
    initEcho() {
      const host_port = document.location.protocol === 'https:' ? ':8443' : ':6001'
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

      this.echo.private(`chat.${this.memberId}`).listen('ChatSendMessageEvent', (chat) => {
        if (chat.data.data.sender.id !== this.memberId) return
        this.logList.push(chat.data)
        this.showNotification()
      })
    },
    async tryToFetchHistory() {
      this.loading = true
      const chat = await this.$store.dispatch('member/fetchSingleChat', {
        phone: this.phone,
        page: this.previous_page,
        limit: this.message_per_page,
        request_time: this.cachedTimestamp,
      })
      this.mergeList(chat)
      this.loading = false
      if (this.previous_page === 1)
        this.$nextTick(() => {
          this.scrollToBottom()
          setTimeout(this.scrollToBottom, 500) // for image lazyload problem
        })
    },
    async tryToStoreChatReaded() {
      await this.$store.dispatch('member/storeChatReaded', {
        member_id: this.memberId,
        type: 'chat',
      })
    },
    async tryToFetchMoreChat(forward) {
      const page = forward === 'older' ? this.history_previous_page : this.history_latest_page
      const more = await this.$store.dispatch('member/fetchMoreChat', {
        request_id: this.history_request_id,
        phone: this.phone,
        per_page: this.message_per_page,
        forward,
        page,
      })
      this.mergeList(forward === 'newer' ? more : more.reverse(), forward === 'newer')
    },
    async tryToFetchSpecificChat(request_id) {
      this.tryingFetchSpecificChat = true
      this.history_request_id = request_id
      this.resetHistoryPagination()
      const specific = await this.$store.dispatch('member/fetchSpecificChat', {
        phone: this.phone,
        request_id,
        display: this.message_per_page,
      })
      this.historyList = this.insertDateBeforeMessage(specific)

      this.changeMode('history')
      this.tryingFetchSpecificChat = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.scrollToElement(`#log-item-${request_id}`)
        }, 100)
      })
    },
    async tryToSendChat() {
      this.tryingSendMessage = true
      const rid = makeid(20)
      const message = this.submitText || null
      const attached = [...this.$refs['file-upload'].fileList]
      try {
        this.logList.push({
          type: 'request',
          data: {
            id: rid,
            sender: {
              id: this.currentUser.merchantId,
            },
            message,
            reply: null,
            order: null,
            // created_at: '2020-08-01 12:29:00',
            attached,
          },
          needUpdate: true,
        })

        this.submitText = ''
        this.$refs['file-upload'].clearFileList()

        const messageData = await this.$store.dispatch('member/sendChat', {
          content: message,
          phone: this.phone,
          attached,
          timestamp: Date.now().toString(),
        })
        this.updateOnViewMessage(rid, messageData)
      } catch (e) {
        this.errorList.push(rid)
      } finally {
        this.tryingSendMessage = false
      }
    },
    async tryToReplyChat(content) {
      this.tryingSendMessage = true
      const rid = makeid(20)
      const message = this.submitText || null
      const request_id = this.replyTo.data.id
      const attached = [...this.$refs['file-upload'].fileList]
      try {
        this.logList.push({
          type: 'reply',
          data: {
            id: rid,
            sender: {
              id: this.currentUser.merchantId,
            },
            // isRead: 0,
            message,
            reply: {
              data: {
                id: this.replyTo.data.id,
                message: this.replyTo.data.message,
              },
            },
            order: null,
            // created_at: '2020-08-19 12:31:00',
            attached,
          },
          needUpdate: true,
        })

        this.submitText = ''
        this.clearReply()
        this.$refs['file-upload'].clearFileList()

        const messageData = await this.$store.dispatch('member/replyChat', {
          content: message,
          request_id,
          phone: this.phone,
          attached,
          timestamp: Date.now().toString(),
        })
        this.updateOnViewMessage(rid, messageData)
      } catch (e) {
        this.errorList.push(rid)
      } finally {
        this.tryingSendMessage = false
      }
    },

    closeEcho() {
      this.echo.leave(`chat.${this.memberId}`)
    },
    onSend(e) {
      // prevent change line
      e.preventDefault()
      if (this.submitText.trim() === '' && this.isEmptyFile()) return
      try {
        if (this.showReply) this.tryToReplyChat()
        else this.tryToSendChat()
      } catch (e) {
        if (!navigator.onLine) console.log('status: Offline')
      } finally {
        if (this.isLog)
          this.$nextTick(() => {
            this.scrollToBottom()
          })
      }
    },
    updateOnViewMessage(rid, data) {
      this.logList.some((log, index) => {
        if (log.data === undefined) return false
        if (log.data.id === rid) {
          this.logList.splice(index, 1, { ...data, rid })
          return true
        }
        return false
      })
    },
    scrollToMessageOrFetchMessage(id) {
      if (this.isMessageOnView(id)) {
        this.scrollToElement(`#log-item-${id}`)
        this.focused = id
        this.$nextTick(() => {
          setTimeout(() => {
            this.focused = ''
          }, 5000)
        })
      } else {
        this.tryToFetchSpecificChat(id)
      }
    },
    isMessageOnView(id) {
      return this[`${this.mode}List`].some((log) => {
        if (!!log.data && log.data.id === id) return true
        return false
      })
    },
    scrollToElement(el) {
      VueScrollTo.scrollTo(el, 500, this.scrollOptions)
    },
    scrollToBottom() {
      this.$refs.logs.scrollTop = this.$refs.logs.scrollHeight
    },
    updateReply(data) {
      this.replyTo = Object.assign({}, data)
    },
    clearReply() {
      this.replyTo = {}
    },
    onScroll: throttle(async function() {
      const IS_TOP = this.$refs.logs.scrollTop === 0
      const IS_BOTTOM = this.$refs.logs.scrollHeight === this.$refs.logs.scrollTop + this.$refs.logs.clientHeight

      if (IS_TOP) {
        if (this.isHistory || this.nothingToLoading || this.loading) return
        this.previous_page++
        await this.tryToFetchHistory()
      } else if (IS_BOTTOM) {
        this.showNewLog = false
      }
    }, 500),

    mergeList(list = [], is_latest_search = false) {
      if (this.isHistory) {
        this.lastMessageId = this.findMessageId(this.historyList, is_latest_search)
        is_latest_search ? this.historyList.push(...list) : this.historyList.unshift(...list)
        this.historyList = this.insertDateBeforeMessage(this.historyList)
      } else {
        this.lastMessageId = this.findMessageId(this.logList)
        this.logList.unshift(...list)
        this.logList = this.insertDateBeforeMessage(this.logList)
      }
      this.updateNothingLoadingState(list, is_latest_search)
      this.scrollToLastMessage(list, is_latest_search)
    },
    findMessageId(list, is_latest_search = false) {
      if (list.length === 0) return ''
      if (is_latest_search) return list.filter((item) => item.data !== undefined).slice(-1)[0].data.id
      else return list.filter((item) => item.data !== undefined)[0].data.id
    },
    insertDateBeforeMessage(data) {
      const list = []
      data
        .filter((item) => item.data !== undefined)
        .reduce((prev, current, index) => {
          if (Date.parse(prev) < Date.parse(current.data.created_at.split(' ')[0])) {
            list.push({ dateTime: current.data.created_at })
            list.push({ ...current })
            return current.data.created_at.split(' ')[0]
          }
          list.push({ ...current })
          return prev.split(' ')[0]
        }, '1970-01-01')
      return list
    },
    scrollToLastMessage(list = [], is_latest_search = false) {
      const isLoadingPreviousMessageOrEmptyList = is_latest_search || list.length === 0
      if (isLoadingPreviousMessageOrEmptyList) return
      const messageCount = list.length
      this.$nextTick(() => {
        VueScrollTo.scrollTo(`#log-item-${this.lastMessageId}`, -1, { ...this.scrollOptions, offset: messageCount >= 5 ? -280 : -100 })
        // this.$refs[`${this.mode}s`].scrollTop = document.getElementById(`log-item-${this.lastMessageId}`).offsetTop - 250
      })
    },
    updateNothingLoadingState(list = [], is_latest_search = false) {
      const SEARCH_MESSAGES = this.message_per_page
      const RESPONSE_MESSAGES = list.length
      if (is_latest_search) this.nothingToLoading_latest = RESPONSE_MESSAGES !== SEARCH_MESSAGES && is_latest_search
      else this.nothingToLoading = this.nothingToLoading_previous = RESPONSE_MESSAGES !== SEARCH_MESSAGES && !is_latest_search
    },
    resetLoadingState() {
      this.nothingToLoading = this.nothingToLoading_previous = this.nothingToLoading_latest = false
    },
    showOrderDetail(orderId) {
      this.$emit('show-order', orderId)
    },
    changeMode(mode) {
      this.mode = mode
      this.resetLoadingState()
    },
    onLeaveHistory() {
      this.history_request_id = ''
      this.changeMode('log')

      if (this.logList.length === 0) this.tryToFetchHistory()
      else
        this.$nextTick(() => {
          this.scrollToBottom()
        })
    },
    async onClickPrevious() {
      this.loading_previous = true

      await this.tryToFetchMoreChat('older')
      this.history_previous_page++
      this.loading_previous = false
    },
    async onClickLatest() {
      this.loading_latest = true

      await this.tryToFetchMoreChat('newer')
      this.history_latest_page++
      this.loading_latest = false
    },
    resetHistoryPagination() {
      this.history_previous_page = 1
      this.history_latest_page = 1
    },
    showNotification() {
      if (this.isHistory) return
      const DISTANCE_FROM_BOTTOM = this.$refs.logs.scrollHeight - (this.$refs.logs.scrollTop + this.$refs.logs.clientHeight)
      if (DISTANCE_FROM_BOTTOM >= 150) {
        this.showNewLog = true
      } else
        this.$nextTick(() => {
          this.scrollToBottom()
        })
    },
    showUpload() {
      this.$refs['file-upload'].$refs['el-upload'].$refs['upload-inner'].$refs.input.click()
    },
    isEmptyFile() {
      return this.$refs['file-upload'] !== undefined ? (this.$refs['file-upload'].fileList !== undefined ? this.$refs['file-upload'].fileList.length === 0 : true) : true
    },
  },
}
</script>

<template>
  <div v-loading="tryingFetchSpecificChat" :class="$style.wrap">
    <div v-if="isLog" id="log-container" ref="logs" class="log" @scroll="onScroll">
      <div v-show="loading" class="log-item"><el-button class="loading-chat" :loading="loading" disabled>載入中...</el-button></div>

      <transition-group :name="$style.flip" tag="div">
        <template v-for="(log, index) in logList">
          <div v-if="log.dateTime !== undefined" :key="`${log.dateTime}-${index}`" class="log-item log-date"
            ><span>{{ formatDate(log.dateTime, 'dateWeekDay') }}</span></div
          >
          <div v-else :id="`log-item-${log.data.id}`" :key="`log-item-${log.rid ? log.rid : log.data.id}`" :class="['log-item', log.data.sender.id === memberId ? 'member' : 'merchant']">
            <div :class="['content', focused === log.data.id ? 'focus' : '']">
              <div v-if="log.data.order !== null" class="order content-child">
                <div>
                  <BaseStateLabel :state="log.data.order.status | orderStatusFilter('color')">{{ log.data.order.status | orderStatusFilter('text') }}</BaseStateLabel>
                  <span> #{{ log.data.order.id }}</span>
                </div>
                <el-button @click="showOrderDetail(log.data.order.id)">查看</el-button>
              </div>
              <div v-if="!!log.data.reply" class="reply content-child" @click="scrollToMessageOrFetchMessage(log.data.reply.data.id)">
                回覆：
                <span v-if="log.data.reply.data.message !== null">{{ log.data.reply.data.message }}</span>
                <BaseIcon v-else name="image" />
              </div>

              <div v-if="log.data.message !== null" class="message content-child">{{ log.data.message }}</div>
              <template v-if="log.data.attached !== null && log.data.attached.length > 0">
                <div class="files content-child">
                  <FileGallery :file-list="log.data.attached" />
                </div>
              </template>
            </div>

            <div v-if="log.needUpdate !== true" class="time">{{ log.data.created_at | formatDate('time') }}</div>
            <div v-else class="time"></div>

            <el-button v-if="log.needUpdate !== true" @click="updateReply(log)"><BaseIcon icon-style="fas" name="reply"/></el-button>
            <div v-if="errorList.includes(log.data.id)" class="error">此訊息傳送失敗</div>
          </div>
        </template>
      </transition-group>

      <div v-if="showNewLog" class="new-log" @click="scrollToBottom">有新訊息</div>
    </div>

    <div v-else id="log-container" ref="historys" class="log">
      <div v-if="!nothingToLoading_previous" class="log-item loading_previous"
        ><el-button class="loading-history" :loading="loading_previous" :disabled="loading_previous" @click="onClickPrevious">載入更多...</el-button></div
      >
      <transition-group :name="$style.flip" tag="div">
        <template v-for="(history, index) in historyList">
          <div v-if="history.dateTime !== undefined" :key="`${history.dateTime}-${index}`" class="log-item log-date"
            ><span>{{ formatDate(history.dateTime, 'dateWeekDay') }}</span></div
          >
          <div v-else :id="`log-item-${history.data.id}`" :key="`log-item-${history.data.id}`" :class="['log-item', history.data.sender.id === memberId ? 'member' : 'merchant']">
            <div :class="['content', focused === history.data.id ? 'focus' : '', history_request_id === history.data.id ? 'focused-infinite' : '']">
              <div v-if="history.data.order !== null" class="order content-child">
                <div class="order-title">
                  <BaseStateLabel :state="history.data.order.status | orderStatusFilter('color')">{{ history.data.order.status | orderStatusFilter('text') }}</BaseStateLabel>
                  <span> #{{ history.data.order.id }}</span></div
                >
                <el-button @click="showOrderDetail(history.data.order.id)">查看</el-button>
              </div>
              <div v-if="!!history.data.reply" class="reply content-child" @click="scrollToMessageOrFetchMessage(history.data.reply.data.id)">
                回覆：
                <span v-if="history.data.reply.data.message !== null">{{ history.data.reply.data.message }}</span>
                <BaseIcon v-else name="image" />
              </div>

              <div v-if="history.data.message !== null" class="message content-child">{{ history.data.message }}</div>
              <template v-if="history.data.attached !== null && history.data.attached.length > 0">
                <div class="files content-child">
                  <FileGallery :file-list="history.data.attached" />
                </div>
              </template>
            </div>
            <div class="time">{{ history.data.created_at | formatDate('time') }}</div>
            <el-button @click="updateReply(history)"><BaseIcon icon-style="fas" name="reply"/></el-button>
          </div>
        </template>
      </transition-group>

      <div v-if="!nothingToLoading_latest" class="log-item loading_latest"
        ><el-button class="loading-history" :loading="loading_latest" :disabled="loading_latest" @click="onClickLatest">載入更多...</el-button></div
      >

      <el-button :class="$style['leave']" circle @click="onLeaveHistory"><BaseIcon name="arrow-down"/></el-button>
    </div>

    <div v-if="showReply" class="reply-to">
      <div class="reply-to-message">
        回覆：
        <span v-if="replyTo.data.message !== null">{{ replyTo.data.message }}</span>
        <BaseIcon v-else name="image" />
      </div>
      <el-button type="text" @click="clearReply"><BaseIcon name="times"/></el-button>
    </div>
    <div class="upload-image-area"><FileUpload ref="file-upload" :resource="'merchant'"/></div>
    <div class="textarea">
      <el-button class="upload-image" type="text" @click="showUpload"><BaseIcon name="image"/></el-button>
      <el-input
        v-model="submitText"
        :autosize="{ minRows: 1, maxRows: 5 }"
        type="textarea"
        resize="none"
        placeholder="請輸入訊息"
        style="min-height: 46.5px;"
        @keypress.enter.native.exact="onSend"
      ></el-input>
      <el-button type="primary" :disabled="submitText.trim().length === 0 && isEmptyFile()" @click="onSend"><BaseIcon name="paper-plane"/></el-button
    ></div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.wrap {
  display: flex;
  flex-direction: column;
  position: relative;
  :global {
    .log {
      flex-grow: 1;
      padding: 20px;
      overflow: scroll;
      .loading-chat {
        width: 100%;
        border: none;
        background: transparent;
      }
      .loading-history {
        border-radius: 20px;
        width: 100%;
        color: $color-primary;
        border-color: $color-primary;
      }
      .log-item {
        display: flex;
        align-items: center;
        transition: all 0.2s;
        position: relative;
        .content {
          border: 1px solid #dcdfe6;
          line-height: 1.5em;
          white-space: break-spaces;
          .order,
          .reply {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            font-size: 12px;
            button {
              margin-left: 40px;
            }
            .order-title {
              display: flex;
              align-items: center;
            }
          }
          .message {
            padding: 10px;
          }
          .reply {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 386px;
            justify-content: inherit;
            cursor: pointer;
            svg {
              font-size: 18px;
            }
          }
          &.focus {
            & :local {
              animation: blink 5s;
            }
          }
          &.focused-infinite {
            & :local {
              animation: blink-infinite 1s infinite ease-in-out;
            }
          }
          &.first {
            background: lightgreen;
          }
          .files {
            flex-wrap: wrap;
            display: flex;
            padding: 10px 5px 0px 5px;
            .image-and-action {
              position: relative;
            }
          }
          .content-child + .content-child {
            border-top: 1px solid #dcdfe6;
          }
        }
        .time {
          margin: 0 10px;
          color: #adadad;
        }
        .error {
          position: absolute;
          bottom: -14px;
          color: crimson;
          font-size: 12px;
        }
        .time + button {
          padding: 8px 8px;
          font-size: 12px;
        }
        &.member {
          padding-right: 4.4em;
        }
        &.merchant {
          flex-direction: row-reverse;
          padding-left: 4.4em;
          .content {
            background: lighten($color-primary, 30%);
          }
        }
        & + .log-item {
          padding-top: 20px;
        }
        &.loading_previous {
          margin-bottom: 20px;
        }
        &.loading_latest {
          margin-top: 20px;
        }
      }
      .new-log {
        background: $color-state-danger;
        color: white;
        padding: 5px;
        margin: 40px 0;
        text-align: center;
        font-size: 12px;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 110px;
        letter-spacing: 2px;
        text-align: center;
        font-size: 14px;
        box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14);
        cursor: pointer;
      }
      .log-date {
        display: flex;
        justify-content: center;
        span {
          padding: 5px 8px;
          color: white;
          background: darken($color-primary, 10%);
          font-size: 12px;
        }
        & + [class*='log-'],
        & + [class*='new-'] {
          margin-top: 20px;
        }
      }
    }
    .reply-to {
      padding: 10px 20px;
      border-top: 1px solid #dcdfe6;
      background: #f6f3f3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .reply-to-message {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 493px;
      }
      button {
        font-size: 18px;
        padding: 0;
      }
    }
    .textarea {
      display: flex;
      padding: 15px 20px;
      border-top: 1px solid #dcdfe6;
      background: white;
      align-items: flex-end;
      z-index: 4;
      textarea {
        min-height: 46.5px !important;
      }
      button {
        margin-left: 20px;
        font-size: 18px;
      }
      .upload-image {
        margin: 0;
        font-size: 20px;
        padding-right: 20px;
      }
    }
  }
}

.flip {
  &:global(-enter) {
    opacity: 0;
    transform: scale(0);
  }
  // &:global(-leave-to) {
  //   opacity: 0;
  //   transform: scale(0);
  // }
  // &:global(-leave-active) {
  //   position: absolute;
  // }
}

.leave {
  position: absolute;
  z-index: 3;
  bottom: 130px;
  right: 5px;
  height: 40px;
  width: 40px;
  padding: 0;
}

.refresh {
  position: absolute;
  z-index: 3;
  bottom: 200px;
  right: 5px;
  height: 40px;
  width: 40px;
  padding: 0;
}

.uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 116px;
  height: 116px;
  margin: 0;
  overflow: hidden;
  margin: 0 5px 10px;

  :global {
    .el-upload,
    .el-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: $color-text-placeholder;
    }
  }
  &__icon {
    font-size: ms(12);
  }
  &__limit {
    margin-top: 10px;
    line-height: 1.5;
    color: $color-text-placeholder;
  }
  &--circle {
    width: 150px;
    height: 150px;
    margin: auto;
    border-radius: 50%;
    .actions {
      border-radius: 50%;
    }
  }
  &.is-emtpy {
    border: 1px dashed $color-text-placeholder;
    &:hover :global {
      .el-upload,
      .el-image {
        color: darken($color-text-placeholder, 20);
      }
    }
  }
}

.actions {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: ms(8);
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: $fade-transition;
  span {
    cursor: pointer;
    + span {
      margin-left: 25px;
    }
  }
  &:hover {
    opacity: 1;
  }
}

@keyframes blink {
  from {
    background: yellow;
  }
  to {
    background: transparent;
  }
}

@keyframes blink-infinite {
  0% {
    box-shadow: 0 0 0px 0px rgb(244 210 158);
  }
  100% {
    box-shadow: 0 0 0px 15px rgb(244 210 158 / 0);
  }
}
</style>
