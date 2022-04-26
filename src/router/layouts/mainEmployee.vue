<script>
import { authComputed } from '@state/helpers'
import filterArrayByValue from '@utils/filter-array-by-value'

import menuList from './sidemenuEmployee'
import { mapState, mapActions } from 'vuex'
import { PushNotifications } from "@capacitor/push-notifications";

export default {
  props:{
    isNoTop:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      current: ['home'],
      collapsed: true,
      menus: [],
    }
  },
  computed: {
    ...authComputed,
    ...mapState('push',['isUnread',"isFirst"]),
    userMenuList() {
      return menuList
      // return filterArrayByValue(menuList, this.currentUserRoutes, 'name')
    },
    currentUserName() {
      return this.currentUser && `${this.currentUser.firstName} ${this.currentUser.lastName}`
    },
  },
  created() {
    window.addEventListener('resize',this.getHeight)
    if(this.isFirst&& this.$route.name!=='employee-notification'){
      this.fetchPushes({
        type:null,
        nextCursorRequest:null
      })
    }
  },
  mounted() {
    this.getHeight()
  },
  methods: {
    ...mapActions('push', ['fetchPushes','clearUnRead']),
    toggle() {
      this.collapsed = !this.collapsed
    },
    onClickDropdown(command) {
      this.$router.push({ name: command })
    },
    getHeight(){
      const windowHeight = window.innerHeight
      const windowWidth = window.innerWidth
      this.$nextTick(()=>{
        if(windowWidth<481){
          // console.log(this.$refs.main,windowHeight)
          this.$refs.main.$el.style.height=`${windowHeight}px`
        }else{
          this.$refs.main.$el.style.height=`auto`
        }
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
        name: 'employee-notification'
      })
    }
  },
}
</script>

<template>
  <div :class="[$style.wrapper, { [$style['wrapper--collapsed']]: !collapsed }]">
    <el-header :class="$style.header">
      <div>
        <div :class="$style.logo">
          <img src="~@assets/images/logo-dark.svg" alt />
        </div>
           <el-dropdown :class="$style.action" trigger="click" @command="onClickDropdown">
          <span>
            {{ currentUserName }}
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
      <el-menu :default-active="$route.name" mode="horizontal" :router="true">
        <el-menu-item v-for="(menu, index) in userMenuList" :key="`menu-${index}`" :index="menu.name"><BaseIcon icon-style="fal" :name="menu.icon"></BaseIcon>{{ menu.title }}</el-menu-item>
      </el-menu>
      <div style="text-align: right; padding-right:10px" @click="onRemoveAllDeliveredNotifications">
       <router-link :to="{ name: 'employee-notification' }">
        <span class="d-none d-sm-block bell" :class="{ isActive: isUnread }">
          <el-button type="text" class="top-link">
            推播中心
            <BaseIcon name="bell" />
          </el-button>
        </span>
        <span class="d-sm-none bell bell--icon" style="cursor:pointer" :class="{ isActive: isUnread }">
          <i class="fal fa-bell fa-lg"></i>
        </span>
      </router-link>
      </div>
    </el-header>
    <el-main ref="main" :class="[$style.main,{ 'no-top': isNoTop }]">
      <slot />
    </el-main>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.main{
  @include touch {
    min-height: 0 !important;
  }
}
.header {
  // @include layer-elevation(8);

  position: absolute;
  z-index: $layer-header-z-index;
  display: flex;
  justify-content: space-between;
  background-color: white;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #c3c3c3;
  padding-top: 10px !important;
  padding-top: calc(constant(safe-area-inset-top) + 10px) !important;
  padding-top: calc(env(safe-area-inset-top) + 10px) !important;
  padding-bottom: 0;
  height: auto !important;
  min-height: 60px;
  @include pad {
    padding: 0 10px;
  }
  div {
    display: flex;
    align-items: center;
    // flex-grow: 1;
    // flex-basis: 0;
  }
  ul {
    flex-grow: 2;
    flex-basis: 0;
    display: flex;
    justify-content: center;
    border-bottom: none !important;
    background: transparent;
    @include pad {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      border-top: 1px solid #c3c3c3;
      height: auto;
      padding-bottom: 15px;
      padding-top: 15px;
      justify-content: space-between;
      box-shadow: 0 -2px 10px 0px rgba(0, 0, 0, 0.14);
    }
    :global {
      .el-menu-item {
        color: #3f3a2e;
        & + .el-menu-item {
          margin-left: 30px;
        }
        &:not(.is-disabled):hover,
        &:not(.is-disabled):focus {
          background: transparent;
          color: $color-primary;
        }
        &.is-active {
          border-bottom-width: 3px !important;
          color: $color-primary !important;
          @include pad {
            border: none;
          }
        }
        svg {
          display: none;
        }
        @include pad {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: auto;
          line-height: 30px;
          color: #c6c6ba;
          border: none;
          svg {
            display: inherit;
            font-size: 24px;
          }
          &:last-child {
            // display: none;
          }
        }
      }
    }
  }
}
.action {
  margin: 0 12px;
  :global {
    .el-badge {
      font-size: 18px;
    }
  }
}
.sidebar {
  position: absolute;
  z-index: $layer-sidebar-z-index;
  height: 100%;
  background-color: $color-sidebar-bg;
  transition: width 0.3s;
  top: 0;
  left: 0;

  .menu {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100% - #{$size-header-height});
    background-color: $color-sidebar-bg;
    border-right: none;

    &::before,
    &::after {
      display: none;
    }

    &__item {
      color: white;
      text-align: center;
      &:hover {
        background: $color-primary-gradient;
      }
      i {
        color: white;
      }
    }
    &__link {
      &:global(.router-link-active) .menu__item {
        background: $color-primary-gradient;
      }
    }
  }
}

.content {
  margin-left: $size-sidebar-width;
  transition: margin-left 0.28s;
}

.wrapper {
  &--collapsed {
    .sidebar {
      width: 200px;
    }
    .content {
      margin-left: 200px;
    }
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $size-header-height;
  width: $size-header-height;
  img {
    // height: $size-header-height - 20px;
  }
}

.main:global(.el-main) {
  position: relative;
  padding-top: $size-header-height + 34px;
  padding-top: calc(constant(safe-area-inset-top) + #{$size-header-height} + 34px);
  padding-top: calc(env(safe-area-inset-top) + #{$size-header-height} + 34px);
  padding-left: 32px;
  padding-right: 32px;
  @include pad {
    padding-top: 60px;
    padding-top: calc(constant(safe-area-inset-top) + 60px);
    padding-top: calc(env(safe-area-inset-top) + 60px);
    background: white;
    padding-bottom: 85px;
    padding-bottom: calc(constant(safe-area-inset-bottom) + 85px);
    padding-bottom: calc(env(safe-area-inset-bottom) + 85px);
    padding-left: 20px;
    padding-right: 20px;
    min-height: 100vh;
  }
}
</style>
