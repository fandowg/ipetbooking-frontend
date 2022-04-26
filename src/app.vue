<script>
import appConfig from '@src/app.config'
import { authComputed, deviceComputed } from '@state/helpers'
import { PushNotifications } from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import { Badge } from '@robingenz/capacitor-badge';
import { mapActions } from 'vuex'
import router from '@router'

export default {
  page: {
    // All subcomponent titles will be injected into this template.
    titleTemplate(title) {
      title = typeof title === 'function' ? title(this.$store) : title
      return title ? `${title} | ${appConfig.title}` : appConfig.title
    },
  },
  data() {
    return {
      loadingRegisterDevice: false,
      loadingSetCurrentDeviceToken: false,
      loadingReadPush: false,
      echoPrivate: '',
    }
  },
  computed: {
    ...authComputed,
    ...deviceComputed
  },
  watch: {
    currentUser: {
      handler(newValue, oldValue) {
        // https://capacitorjs.com/docs/guides/screen-orientation
        if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
          if(newValue && newValue.redirect) {
            if(newValue.redirect === "employee-calendar") {
              // 縱向
              // window.screen.orientation.lock('portrait');
              // 橫向
              // window.screen.orientation.lock('landscape');

              // window.screen.orientation.unlock();
              // console.log('Orientation is ' + screen.orientation.type);
              // alert('aa')
            } else {
              // alert('bb')
              // window.screen.orientation.lock('portrait');
              // window.screen.orientation.lock('portrait-primary');
              // window.screen.orientation.lock('portrait-secondary');
            }
          } else {
            // alert('cc')
            // window.screen.orientation.unlock();
            //


          }
          // alert(screen.orientation.type)
          // window.screen.orientation.lock('any');
          // window.screen.orientation.unlock();
          // screen.orientation.lock('landscape');
          // screen.orientation.lock('landscape-primary');
          // screen.orientation.lock('landscape-secondary');
        }
      },
      immediate: true,
      deep: true,
    },
    loggedIn: {
      handler(newValue, oldValue) {
        if(newValue) {
          if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
            this.tryToRegisterDevice();
          }
          this.initEcho();
        } else {
          this.leaveEcho();
        }
      },
    }
  },
  mounted() {
    // document.querySelector('#app').onscroll = ()=>{
    //   console.log(document.querySelector('#app').scrollTop)
    // }
    // console.log(this.loggedIn)
    if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
      this.initPushNotifications();
      this.initAppListener();
    }
    if(this.loggedIn){
      this.initEcho();
    }
    
    // console.log(Notification.permission)
    // console.log('Notification' in window,screen,window)
    if(screen.orientation){
      screen.orientation.addEventListener('change', function() {
        // alert(screen.orientation.type); // e.g. portrait
      });
    }
    
    // console.log(this.currentUser.redirect === "employee-calendar")
  },
  methods: {
    ...mapActions('push',['addPush']),
    leaveEcho() {
      if(this.echoPrivate) {
        this.$echo
          .leave(this.echoPrivate);
      }
    },
    initEcho() {
      this.echoPrivate = `pusher.${this.currentUser.id}`;

      this.$echo.connector.options.auth.headers["Authorization"] = `Bearer ${this.currentUser.token}`;

      this.$echo
        .private(this.echoPrivate)
        .subscribed(() => {
          // console.log(`加入Echo頻道: ${this.echoPrivate}`);
        })
        .listenToAll((event, data) => {
          if(process.env.VUE_APP_BUILD_MODE !== 'admin-app-build') {
            if(data.aps) {
              // console.log('notifyBrowser');
              if('Notification' in window){
                this.notifyBrowser(data.aps);
              }
            }
          }
          if(data) {
            this.addPush(data)
            const routeName = router.app.$route.name
            if(routeName === 'notification' || routeName === 'employee-notification'){
              this.$store.dispatch('push/clearUnRead')
            }
            const alert = data.aps.alert
            const url = data.aps.data.url
            const vm = this
            this.$notify({
              title: alert.title,
              message: alert.body,
              customClass:url?'notificationText':'',
              onClick(){
                vm.readPush({
                  pushId: data.aps.data.id
                });
                if(url){
                  window.location = url
                }
                
              }
            })
          }
        });
    },
    initPushNotifications() {
      // 請求權限
      PushNotifications.requestPermissions()
        .then(result => {
          // console.log('result ' + JSON.stringify(result));

          PushNotifications.register();
        });

      // 註冊應用程序以接收推送通知。
      PushNotifications.addListener('registration', (token) => {
        // console.log('Push registration success, token: ' + token.value);

        if(token.value) {
          this.tryToSetCurrentDeviceToken({
            token: token.value
          })
            .then(() => {
              if(this.loggedIn && this.currentDeviceToken) {
                this.tryToRegisterDevice();
              }
            });
        } else {
          console.log('need token')
        }
      });

      // 當設備收到推送通知時調用。
      PushNotifications.addListener('pushNotificationReceived', (pushNotificationSchema) => {
          // alert('收到通知: ' + JSON.stringify(pushNotificationSchema));
        }
      );

      // 當對推送通知執行操作時調用。
      PushNotifications.addListener('pushNotificationActionPerformed', (actionPerformed) => {
          const goToUrl = (url) => {
            if(url) {
              window.location = url
            }
          };

          goToUrl(actionPerformed.notification?.data?.aps?.data?.url);

          this.readPush({
            pushId: actionPerformed.notification?.data?.aps?.data?.id
          })
          // alert('點擊通知: ' + JSON.stringify(actionPerformed));
        }
      );
    },
    initAppListener() {
      App.addListener('appStateChange', ({ isActive }) => {
        if(isActive) {
          // PushNotifications.removeAllDeliveredNotifications()
        }
      });
    },
    notifyBrowser(data) {
      const notifyConfig = {
        body: data.alert.body,
        icon: require('@assets/images/notification_avatar.jpg'),
        // icon: data.data.icon || require('@assets/images/notification_avatar.jpg'),
        // tag: data.data.tag
      };

      const notification = new Notification(data.alert.title, notifyConfig);

      notification.onclick = () => {
        const goToUrl = (url) => {
          if(url) {
            window.location = url
          }
        };

        goToUrl(data?.data?.url);
        notification.close();

        this.readPush({
          pushId: data.data.id
        });
      };
    },
    async readPush({ pushId }) {
      this.loadingReadPush = true;

      await this.$store.dispatch('push/readPush', {
        pushId,
      })
        .then(() => {

          return true
        })
        .finally(() => {
          this.loadingReadPush = false
        })
    },
    async tryToRegisterDevice() {
      this.loadingRegisterDevice = true;

      await this.$store.dispatch('device/registerDevice', {
        token: this.currentDeviceToken,
      })
        .then(() => {
          // alert('tryToRegisterDevice success');

          return true
        })
        .finally(() => {
          this.loadingRegisterDevice = false
        })
    },
    async tryToSetCurrentDeviceToken({ token }) {
      this.loadingSetCurrentDeviceToken = true;

      // 商店擁有者,商店管理,小編人員,訂單操作,排班人員
      await this.$store.dispatch('device/setCurrentDeviceToken', {
        token,
      })
        .then(() => {
          // alert('tryToSetCurrentDeviceToken success');

          return true
        })
        .finally(() => {
          this.loadingSetCurrentDeviceToken = false
        })
    },
    // setCurrentDeviceToken
  }
  // data() {
  //   return {
  //     lockDialogVisible: false,
  //   }
  // },
  // computed: {
  //   ...authComputed,
  //   isMobileStaffMode() {
  //     return this.currentUserRoutes.includes('employee-calendar') && /Mobi/.test(navigator.userAgent)
  //   }
  // },
  // mounted() {
  //   if(!this.isMobileStaffMode) {
  //     const appDirection = window.matchMedia('(orientation: landscape)')
  //     this.handleOrientationChange(appDirection)
  //     appDirection.addListener(this.handleOrientationChange)
  //   }
  // },
  // methods: {
  //   handleOrientationChange(screenDirection) {
  //     this.lockDialogVisible = !screenDirection.matches
  //   },
  // },
}
</script>

<template>
  <div id="app">
    <!--
    Even when routes use the same component, treat them
    as distinct and create the component again.
    -->
    <RouterView :key="$route.fullPath"/>
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

<!-- This should generally be the only global CSS in the app. -->
<style lang="scss">
// Allow element/type selectors, because this is global CSS.
// stylelint-disable selector-max-type, selector-class-pattern

// Normalize default styles across browsers,
// https://necolas.github.io/normalize.css/
@import '~normalize.css/normalize.css';
// Style loading bar between pages.
// https://github.com/rstacruz/nprogress
@import '~nprogress/nprogress.css';

// Design variables and utilities from src/design.
@import '@design';
@import '@src/design/global.scss';
// @import '@src/design/index.scss';

*,
*::before,
*::after {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  display: none;
}

html {
  font-size: 14px;
  line-height: 1.15;
  -webkit-tap-highlight-color: transparent;
}

body {
  @extend %font-content;

  // height: 100vh;
  background: $color-body-bg;
  -webkit-overflow-scrolling: touch;
}

// ===
// Base element styles
// ===

a,
a:visited {
  color: $color-link-text;
}

ul {
  padding: 0;
  margin: 0;
  list-style: none;
}

h1 {
  @extend %font-heading;

  font-size: ms(6);
  letter-spacing: $font-letter-spacing-base;
}

h2 {
  @extend %font-heading;

  font-size: ms(5);
  letter-spacing: $font-letter-spacing-base;
}

h3 {
  @extend %font-heading;

  font-size: ms(4);
  margin-block-start: ms(4) / 1.5;
  margin-block-end: ms(4) / 1.5;
  letter-spacing: $font-letter-spacing-base;
}

h4 {
  @extend %font-heading;

  font-size: ms(3);
  margin-block-start: ms(3) / 1.5;
  margin-block-end: ms(3) / 1.5;
  letter-spacing: $font-letter-spacing-base;
}

h5 {
  @extend %font-heading;

  font-size: ms(2);
  margin-block-start: ms(2) / 1.5;
  margin-block-end: ms(2) / 1.5;
  letter-spacing: $font-letter-spacing-small;
}

h6 {
  @extend %font-heading;

  font-size: ms(1);
  margin-block-start: ms(1) / 1.5;
  margin-block-end: ms(1) / 1.5;
  letter-spacing: $font-letter-spacing-small;
}

h1, h2, h3, h4, h5, h6 {
  font-weight: 500;
}

input {
  background: none;
}

img {
  max-width: 100%;
}

[hidden] {
  display: none;
}

// ===
// Vendor
// ===

#nprogress {
  .bar {
    background: $color-primary;
  }

  .spinner-icon {
    border-top-color: $color-primary;
    border-left-color: $color-primary;
  }
}
</style>
