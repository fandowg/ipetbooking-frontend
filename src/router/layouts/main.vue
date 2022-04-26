<script>
import { saveState, getSavedState } from '@utils/browser-help'
import { authComputed } from '@state/helpers'
import filterArrayByValue from '@utils/filter-array-by-value'
import { groupByKey } from '@utils'

import TheHeader from './TheHeader'
import menuList from './sidemenu'

export default {
  components: { TheHeader },
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
      // collapsed: getSavedState('collapsed') !== null ? getSavedState('collapsed') : true,
      menus: [],
      lockDialogVisible: false,
      width:0,
    }
  },
  watch:{
    /* async collapsed(value){
      await saveState('collapsed',value)
      // saveState('collapsed',value)
    } */
  },
  computed: {
    ...authComputed,
    userMenuList() {
      const userMenu = filterArrayByValue(menuList, this.currentUserRoutes, 'name')

      return groupByKey(userMenu, 'group')
    },
    externalURL() {
      return window.location.hostname.includes('daydream-lab') ? 'https://shop.jtails.daydream-lab.com/jtails_dashboard/' : 'http://shop.j-tails.com/jtails_dashboard/'
    },
    isMobileStaffMode() {
      return this.currentUserRoutes.includes('employee-calendar') && /Mobi/.test(navigator.userAgent)
    }
  },
  mounted() {
    const appDirection = window.matchMedia('(orientation: landscape)')
    const initCollapsed = async () => {
      const stateCollapsed = await getSavedState('collapsed') ?? true;

      // this.collapsed = stateCollapsed !== null ? stateCollapsed : true
      await this.setCollapsed(stateCollapsed)
    };

    if(!this.isMobileStaffMode) {
      
      // console.log(appDirection)
      this.handleOrientationChange(appDirection)
      appDirection.addListener(this.handleOrientationChange)
    }

    this.handleWidth()
    window.addEventListener('resize',this.handleWidth)
    initCollapsed();
    // window.onresize = this.handleWidth()
  },
  methods: {
    typeChange(value){
      if(value==='true'){
        return true
      }else{
        return false
      }
    },
    async toggle() {
      await this.setCollapsed(!this.collapsed)
    },
    handleWidth(){
      const appDirection = window.matchMedia('(orientation: landscape)')
      if(window.innerWidth <= 1024 ){
        this.handleOrientationChange(appDirection)
      }
      // this.lockDialogVisible = window.innerWidth <= 1024 
      // console.log()
      // console.log(window.innerWidth)
    },
    handleOrientationChange(screenDirection) {
      // this.getWindowWidth()
      // console.log(window.innerWidth,!screenDirection.matches)
      this.lockDialogVisible = !screenDirection.matches && window.innerWidth <= 1024
    },
    async setCollapsed(value) {
      this.collapsed = value;
      await saveState('collapsed', value)
    }
    /* getWindowWidth(){
      this.width = window.innerWidth
    } */
  },
}
</script>

<template>
  <div :class="[$style.wrapper, { [$style['wrapper--collapsed']]: !collapsed }]">
    <template v-if="loggedIn">
      <div :class="[$style.sidebar, { [$style.isCollapsed]: !collapsed }]">
        <!-- <div :class="$style.logo">
          <img src="~@assets/images/logo.svg" alt />
        </div> -->

        <el-menu mode="vertical" :collapse="collapsed" :class="$style.menu" :collapse-transition="false">
          <el-menu-item :class="[$style['menu__item'],{ isExpand: !collapsed }]" class="isLogo" @click="toggle">
            <BaseIcon :name="collapsed ? 'bars' : 'chevron-left'" :icon-style="collapsed ? 'far' : 'fal'" />
            <span slot="title">iPet BUSINESS</span>
            <!--<div class="d-none d-sm-block">
              <BaseIcon :name="collapsed ? 'bars' : 'chevron-left'" :icon-style="collapsed ? 'far' : 'fal'" />
              <span slot="title">iPet BUSINESS</span>
            </div>
            <div class="d-sm-none">
              <BaseIcon :name="collapsed ? 'bars' : 'chevron-left'" :icon-style="collapsed ? 'far' : 'fal'" />
            </div>-->
          </el-menu-item>
          <div v-for="(group, groupNumber) in userMenuList" :key="groupNumber" :class="$style['menu__group']" >
            <router-link v-for="menu in group" :key="menu.name" :to="{ name: menu.name }" :class="$style['menu__link']" >
              <el-menu-item :class="$style['menu__item']" :welcome-guide-title="menu.title" :welcome-guide-intro="menu.description">
                <BaseIcon :name="menu.icon" :icon-style="menu.icon === 'tachometer' ? 'fal' : 'far'" style="font-size:16px"/>
                <span slot="title">{{ menu.title }}</span>
              </el-menu-item>
            </router-link>
            <!-- <a v-if="groupNumber === '2'" :class="$style['menu__link']" :href="externalURL" target="_blank">
              <el-menu-item  :class="$style['menu__item']">
                <BaseIcon name="store" />
                <span slot="title">商城管理</span>
              </el-menu-item>
            </a> -->
          </div>
        </el-menu>
      </div>
      <div :class="$style.content">
        <TheHeader :collapsed="collapsed" @toggle="toggle" />
        <el-main :class="[$style.main,{ 'no-top': isNoTop }]" >
          <slot name="pageTitle" />
          <slot />
        </el-main>
      </div>
    </template>

    <el-main v-else :class="$style.main">
      <slot />
    </el-main>
    <!-- <el-dialog
      title="網站以橫向模式瀏覽最佳"
      :visible.sync="lockDialogVisible"
      top="0"
      width="680px"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      center
      lock-scroll
    >
      <p style="text-align: center;">請旋轉您的裝置</p>
    </el-dialog> -->
  </div>
</template>

<style lang="scss" module>
@import '@design';
.menu__group{
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  height: 100%;
  // margin-bottom: 20px;
}
.sidebar {
  position: absolute;
  z-index: $layer-sidebar-z-index;
  height: 100%;
  background-color: $color-sidebar-bg;
  transition: width 0.3s;
  top: 0;
  left: 0;
  z-index: 9999;
  // margin-top: -1px;
  overflow-y: auto;

  &:before {
    content: '';
    background-color: $color-secondary;
    width: 100%;
    height: constant(safe-area-inset-top);
    height: env(safe-area-inset-top);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  &.isCollapsed {
    &:before {
      background-color: #FDD7AA !important;
    }
  }



  @include max-sm {
    // width: 180px;
    width: auto;
    background-color: transparent;
    pointer-events: none;
  }

  .menu {
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    // height: calc(100% - #{$size-header-height});
    // height: 100%;
    background-color: $color-sidebar-bg;
    border-right: none;
    padding-top: constant(safe-area-inset-top);
    padding-top: env(safe-area-inset-top);
    position: relative;
    height: 100%;
    // margin-left: -1px;

    @media only screen and (max-width: 1025px) {
      overflow-y: scroll;
    }

    @include max-sm {
      height: 100%;
      pointer-events: auto;
    }

    &::before,
    &::after {
      display: none;
    }

    &__item {
      color: white;
      height: 100%;
      line-height: 1;
      display: flex;
      align-items: center;
      // text-align: center;
      :global{
        .el-tooltip{
          height: auto!important;
          position: relative !important;
          padding: 0 !important;
        }
      }
      svg{
        margin-left: 5px;
        margin-right: 10px;
      }
      &:hover {
        background: $color-secondary;
      }
      i {
        color: white;
      }
    }
    &__link {
      height: 100%;
      max-height: 85px;
      text-decoration: none;
      &:global(.router-link-active) .menu__item {
        background: $color-secondary;
      }
    }
  }
}

.content {
  margin-left: $size-sidebar-width;
  // margin-left: 64px!important;
  // transition: margin-left 0.28s;

  @include max-sm {
    // margin-left: 0;
  }
}

.wrapper {
  &--collapsed {
    .sidebar {
      // width: 180px;
      width: auto;

      @include max-sm {
        // width: 100vw;
      }
    }
    .content {
      margin-left: 174px;

      @include max-sm {
        margin-left: $size-sidebar-width;
      }
    }
  }
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $size-header-height;
  background: $color-secondary;
  // border:$color-primary 1px solid;
  // width: 65px;
  // width: 65px;
  img {
    // height: $size-header-height - 20px;
    height: 60px;
  }
}

.main:global(.el-main) {
  position: relative;
  padding-top: $size-header-height + 30px;
  padding-top: calc(constant(safe-area-inset-top) + #{$size-header-height} + 30px);
  padding-top: calc(env(safe-area-inset-top) + #{$size-header-height} + 30px);
  padding-left: 25px;
  padding-right: 25px;

  @include max-sm {
    padding-top: $size-header-height + 10px;
    padding-top: calc(constant(safe-area-inset-top) + #{$size-header-height} + 10px);
    padding-top: calc(env(safe-area-inset-top) + #{$size-header-height} + 10px);
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>
