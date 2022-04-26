<script>
import { authComputed } from '@state/helpers'
import Layout from '@layouts/mainEmployee'
import lazyLoadComponent from '@router/lazyload-component'

export default {
  page: {
    title: '行事曆',
    meta: [{ name: 'description', content: 'Booking List' }],
  },
  components: {
    Layout,
    Week: () => lazyLoadComponent(import('./components/Week')),
    Day: () => lazyLoadComponent(import('./components/Week')),
    Schedule: () => lazyLoadComponent(import('./components/Schedule')),
  },
  data() {
    return {
      activeTab: 'Day',
      previousTab: '',
      dialogCalendarVisible: false,
    }
  },
  watch: {
    activeTab(newValue, oldValue) {
      this.previousTab = oldValue
    },
  },
  computed: {
    ...authComputed,
    staffCalendarURL() {
      return `${window.location.origin}/api/${this.currentUser.merchantAlias}/schedule/item/${this.currentUser.scheduleItemId}/ical`
    },
    isForward() {
      switch (this.activeTab) {
        case 'Week':
          return true
        case 'Day':
          if (this.previousTab === 'Week') return false
          if (this.previousTab === 'Schedule') return true
          break
        case 'Schedule':
          return false
      }
      return true
    },
    keyName() {
      const name = `Tab-${this.activeTab}--${Math.floor(Math.random() * 5000)}`
      return name
    },
  },
  methods: {
    copyCalendarUrl() {
      this.$refs.CalendarUrlInput.select()
      document.execCommand('copy')
      this.$message('連結複製成功')
    },
    openExternal(url) {
      window.open(url, '_blank')
    },
  },
}
</script>

<template>
  <Layout :class="$style.wrap">
    <BasePageHeader :center="true" :large-title="true">
      <template v-slot:title
        >行事曆</template
      >
      <template v-slot:center>
        <div style="text-align: center;" :class="$style.tabs">
          <el-radio-group v-model="activeTab" :class="$style.tab">
            <el-radio-button label="Week">週</el-radio-button>
            <el-radio-button label="Day">天</el-radio-button>
            <el-radio-button label="Schedule">行程表</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <template v-slot:right>
        <el-button class="is-round is-dark" style="line-height: 20px;" @click="dialogCalendarVisible = true">同步至其他行事曆</el-button>
      </template>
    </BasePageHeader>
    <el-radio-group v-model="activeTab" :class="[$style.tab, $style.mobile]">
      <el-radio-button label="Day">日排程</el-radio-button>
      <el-radio-button label="Schedule">行程表</el-radio-button>
    </el-radio-group>
    <transition :name="!isForward ? $style.slide : $style['slide-reverse']" mode="out-in">
      <component :is="activeTab" :key="keyName" :mode="activeTab.toLowerCase()"></component>
    </transition>

    <el-dialog title="同步行事曆" :visible.sync="dialogCalendarVisible" :append-to-body="true" top="0" width="680px">
      <el-input ref="CalendarUrlInput" :value="staffCalendarURL" :readonly="true">
        <el-button slot="append" @click="copyCalendarUrl">複製此網址</el-button>
      </el-input>
      <p style="margin-top: 50px;">行事曆設定教學</p>
      <div style="margin-bottom: 15px;">
        <el-button style="width: 100%;" type="primary" plain @click="openExternal('https://support.apple.com/zh-tw/guide/iphone/iph3d1110d4/ios')">設定於 Apple 行事曆</el-button>
      </div>
      <div>
        <el-button style="width: 100%;" type="primary" plain @click="openExternal('https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DDesktop&hl=zh-Hant')"
          >設定於 Google 行事曆</el-button
        >
      </div>
    </el-dialog>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.tab {
  text-align: center;
  @include touch {
    padding: 20px 20px 0px 20px;
  }
  :global {
    .el-radio-button {
      min-width: 82px;
      span {
        padding: 10px 18px;
      }
      &:first-child {
        span {
          border-top-left-radius: 8px;
          border-bottom-left-radius: 8px;
        }
      }
      &:last-child {
        span {
          border-top-right-radius: 8px;
          border-bottom-right-radius: 8px;
        }
      }
      span {
        width: 100%;
      }
      @include touch {
        width: 50%;
        .el-radio-button__inner {
          border: none;
          background: white;
          border-radius: 0 !important;
          font-size: 16px;
          box-shadow: none !important;
          border-bottom: 3px solid white;
        }
        &.is-active .el-radio-button__inner {
          color: $color-primary;
          border-bottom: 3px solid $color-primary;
        }
      }
    }
  }
}
.wrap {
  .mobile {
    display: none;
    @include touch {
      display: inherit;
    }
  }
  :global {
    .el-main {
      > div:first-child {
        @include touch {
          display: none;
        }
      }
      @include touch {
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
    }
  }
}
</style>
