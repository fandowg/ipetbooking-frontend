<script>
import Layout from '@layouts/main'
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter } from '@utils/filter-value-to-text'

export default {
  page: {
    title: '查看客戶訊息記錄',
    meta: [{ name: 'description', content: 'View Member' }],
  },
  filters: {
    genderFilter,
  },
  components: {
    Layout,
    ChatDialog: () => lazyLoadComponent(import('./components/ChatDialog')),
    DetailEdit: () => lazyLoadComponent(import('./DetailEdit')),
    DetailOrders: () => lazyLoadComponent(import('./DetailOrders')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeTabIndex: 0,
      noti: 0,
      showInfo: false,
      sideTabList: [
        {
          icon: 'edit',
          title: '編輯客戶資訊',
          name: 'edit',
          component: () => import('./DetailEdit'),
        },
        {
          icon: 'history',
          title: '所有預約紀錄',
          name: 'orders',
          component: () => import('./DetailOrders'),
        },
      ],
      componentData: Object.assign({}, this.defaultValue),
    }
  },
  computed: {
    activeTab() {
      return this.sideTabList[this.activeTabIndex]
    },
    fullNameGender() {
      return `${this.defaultValue.fullName}`
    },
    phone() {
      return `${this.defaultValue.phoneCode}-${this.defaultValue.phoneNumber}`
    },
  },
  methods: {
    backToList() {
      this.$router.push({ name: 'chat' })
    },
    showDrawer(orderId) {
      this.$refs.DetailOrders.openOrderDetail(orderId)
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="[$style.wrapper, $style.detail]">
      <div :class="[$style.header, 'chat-wrap-header']">
        <el-page-header title="返回列表" :content="fullNameGender" @back="backToList"></el-page-header>
      </div>
      <ChatDialog class="chat-wrap" :phone="phone" @show-order="showDrawer" />
      <div class="member-info-wrap">
        <div :class="$style.intro">
          <el-avatar :src="require(`@assets/images/member_avatar_${defaultValue.gender || 'female'}.png`)" :size="76"></el-avatar>
          <h3
            >{{ fullNameGender }}
            <br />
            {{ defaultValue.gender | genderFilter }}
          </h3>
          <el-button :type="showInfo ? '' : 'primary'" @click="showInfo = !showInfo">{{ showInfo ? '關閉' : '查看' }}</el-button>
        </div>
        <DetailEdit v-show="showInfo" :class="$style.DetailEdit" :default-value.sync="componentData" />
        <DetailOrders ref="DetailOrders" :class="$style.DetailOrders" :default-value.sync="componentData" />
      </div>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_sidebar.scss';

$chat-height: 643px;

.intro {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 20px;
}
.enabled {
  :global {
    .el-radio-button__orig-radio:disabled + .el-radio-button__inner {
      color: inherit;
      cursor: pointer;
      &:hover {
        color: $color-primary;
      }
    }
  }
}
.detail {
  flex-wrap: wrap;
  min-height: auto;
  overflow: hidden;
  :global {
    .chat-wrap-header {
      flex-basis: 100%;
      background: #ffffff;
      border-bottom: 1px solid #dcdfe6;
    }
    .chat-wrap {
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14);
      background: #fafafa;
      flex-basis: 60%;
      height: $chat-height;
    }
    .member-info-wrap {
      flex-basis: 40%;
      height: $chat-height;
      padding: 20px;
      width: 40%;
      position: relative;
    }
  }
}
.DetailEdit {
  position: absolute;
  z-index: 3;
  top: 116px;
  bottom: 0;
  right: 0;
  left: 0;
  margin: 20px;
  background: white;
  :global {
    .el-card {
      box-shadow: none;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border: none;
      border-top: 2px solid #f9f7f5;
    }
  }
}
.DetailOrders {
  height: 488px;
  overflow: scroll;
}
</style>
