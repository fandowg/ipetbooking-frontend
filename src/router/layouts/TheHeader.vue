<script>
import { authComputed , merchantComputed } from '@state/helpers'
import { mapState, mapActions, mapGetters } from 'vuex'
import { PushNotifications } from '@capacitor/push-notifications';

// import { mapGetters } from '@state/modules/title'
import lazyLoadComponent from '@router/lazyload-component'

// import NotificationIcon from './TheNotificationIcon'
export default {
  components: {
    noti: () => lazyLoadComponent(import('./components/noti')),
  },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      showSearchList: Object.freeze({
        orders: {
          placeholder: '輸入使用人姓名、手機號碼或訂單編號',
        },
        member: {
          placeholder: '請輸入客戶姓名或是手機號碼',
        },
      }),
    }
  },

  computed: {
    ...authComputed,
    ...merchantComputed,
    ...mapState('push',["isUnread","isFirst"]),
    ...mapGetters('title',["pageTitle"]),
    currentUserName() {
      return this.currentUser && `${this.currentUser.firstName} ${this.currentUser.lastName}`
    },
    showSearch() {
      return this.showSearchList[this.$route.name]
    },
    title(){
      return this.$route.meta.title
    },
    merchantUrlPrefix(){
      let url=''
      if(window.globalData.APP_ENV==='local'){
        url=this.merchantUrl
      }else{
        if(this.currentMerchant){
          // console.log(this.currentMerchant)
          const prefixUrl = this.merchantUrl.split('//',2)
          url = `${prefixUrl[0]}//${this.currentMerchant.alias}.${prefixUrl[1]}`
        }
        
      }
      return url
    }
  },
  created() {
    // if(!this.hasMerchant){
    //   this.$store.dispatch('merchant/fetchSingle')
    // }
    this.$store.dispatch('merchant/fetchSingle')
    this.$store.commit('merchant/HAS_MERCHANT',true)
    this.searchQuery = this.$route.query.search || ''
    if(this.isFirst&& this.$route.name!=='notification'){
      this.fetchPushes({
        type:null,
        nextCursorRequest:null
      })
    }
    
  },
  methods: {
    ...mapActions('push', ['fetchPushes','clearUnRead']),
    emitToggle() {
      this.$emit('toggle')
    },
    onClickDropdown(command) {
      this.$router.push({ name: command })
    },
    goToSearchPage() {
      this.$router.push({
        name: this.$route.name,
        query: { search: this.searchQuery },
        params: { ...this.$route.params }
      })
    },
    onRemoveAllDeliveredNotifications() {
      this.clearUnRead()
      if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
        PushNotifications.removeAllDeliveredNotifications()
      }
    },
    goToNotification(){
      this.clearUnRead()
      this.$router.push({
        name: 'notification'
      })
    }
  
  },
}
</script>

<template>
  <el-header :class="[$style.header,{ collapsed: !collapsed }]">
    <div :class="$style.title"> <h2>{{pageTitle ? pageTitle : title}}</h2></div>
    


    <!-- <div :class="$style['header-left']">
      <BaseIcon :name="collapsed ? 'bars' : 'bars'" :class=" $style.toggler" @click="emitToggle" />
      <el-input v-if="showSearch" v-model.trim.lazy="searchQuery" :class="$style.search" :placeholder="showSearch.placeholder" @keyup.native.enter="goToSearchPage">
        <BaseIcon slot="prefix" name="search" class="el-input__icon" />
        <el-button slot="append" style="border: 1px solid #DCDFE6;height: 46px;" type="primary" plain @click="goToSearchPage">搜尋</el-button>
      </el-input>
    </div> -->
    <div :class="$style['header-right']">
      <template v-if="currentUserRoutes && currentUserRoutes.includes('chat')">
        <noti></noti>
        <el-divider direction="vertical" />
      </template>      

      <template v-if="currentUserRoutes && (currentUserRoutes.includes('check-in') || currentUserRoutes.includes('schedule-check-in'))">
        <span welcome-guide-title="行事曆" welcome-guide-intro="每日服務排程、查看訂單＆報到。" :class="$style.action">
          <router-link :to="{ name: 'schedule-check-in' }">
            <span class="d-none d-sm-block">
              <el-button type="text">
                行事曆
                <BaseIcon name="calendar-check" />
              </el-button>
            </span>
            <span class="d-sm-none" >
              <i class="fal fa-calendar-check fa-lg"></i>
            </span>
          </router-link>
        </span>
        <!--[下一階段 TODO:]  <NotificationIcon :class="$style.action" /> -->
        <el-divider direction="vertical" />
      </template>
      <span :class="$style.action">
        <el-link :href="merchantUrlPrefix" target="_blank">
          <span class="d-none d-sm-block">
            查看網站
            <BaseIcon name="external-link" />
          </span>
          <span class="d-sm-none">
            <i class="fal fa-home fa-lg"></i>
          </span>
        </el-link>
      </span>
      <el-divider direction="vertical" />
      <span :class="$style.action" @click="onRemoveAllDeliveredNotifications">
        <router-link :to="{ name: 'notification' }">
          <span class="d-none d-sm-block bell" :class="{ isActive: isUnread }">
            <el-button type="text" class="top-link">
              推播中心
              <BaseIcon name="bell"  />
            </el-button>
          </span>
          <span class="d-sm-none bell bell--icon" style="cursor:pointer" :class="{ isActive: isUnread }">
            <i class="fal fa-bell fa-lg"></i>
          </span>
        </router-link>
      </span>
      <el-divider direction="vertical" />
      <el-dropdown :class="$style.action" trigger="click" @command="onClickDropdown">
        <span>
          <span class="mr-2">{{ currentUserName }}</span>
          <BaseIcon name="angle-down" />
        </span>

        <el-dropdown-menu slot="dropdown" :class="$style['action-menu']">
          <el-dropdown-item command="logout">
            登出
            <BaseIcon name="sign-out" />
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>

<style lang="scss" module>
@import '@design';
.title{
  display: flex;
  align-items: center;
   :global{
     h2{
       margin: 0;

       @include max-sm {
         font-size: 1rem;
         letter-spacing: 0;
       }
     }
   }
}
.header {
  @include layer-elevation(2);

  position: absolute;
  z-index: $layer-header-z-index;
  display: flex;
  justify-content: space-between;
  // width: 100%;
  width: calc(100% - #{$size-sidebar-width});
  background-color: white;
  z-index: 999;
  padding-top: 10px !important;
  padding-top: calc(constant(safe-area-inset-top) + 10px) !important;
  padding-top: calc(env(safe-area-inset-top) + 10px) !important;
  padding-bottom: 10px !important;
  // height: auto !important;
  min-height: 60px;

  @include max-sm {
    width: 100%;
    padding-left: 80px !important;
    margin-left: -$size-sidebar-width;
  }

  &-left,
  &-right {
    display: flex;
    align-items: center;
  }
  &-left {
    flex-basis: 43%;
    justify-content: center;
  }
  &:global{
    &.collapsed{
      width:calc(100% - 174px);

      @include max-sm {
        width: 100%;
      }
    }
  }
}
.toggler {
  margin-right: 20px;
}
.action {
  margin: 0 12px;
  :global {
    .el-badge {
      font-size: 18px;
    }
  }
}
.search :global(.el-input__inner) {
  border-top-color: transparent;
  border-right-color: transparent;
  border-left-color: transparent;
}
</style>
