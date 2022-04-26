import appConfig from '@src/app.config'
import '@babel/polyfill'
import Vue from 'vue'
import App from './app'
import router, { resetRouter } from '@router'
import store from '@state/store'
import i18n from '@src/locales'
import '@components/_globals'

import './plugins/element.js'
import './plugins/can.js'
import './plugins/echo.js'
import './plugins/global-data.js'
import './plugins/notification.js'

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production';

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}




Promise.all([
  store.dispatch('auth/init'),
  store.dispatch('device/init')
])
  .then(() => {
    resetRouter();

    const app = new Vue({
      i18n,
      router,
      store,
      computed: {
        isTouchDevice() {
          return (
            'ontouchstart' in window ||
            navigator.MaxTouchPoints > 0 ||
            navigator.msMaxTouchPoints > 0
          )
        },
        isMobileDevice() {
          return /Mobi|Android/i.test(navigator.userAgent)
        },
        isSmallDevice() {
          return window.innerWidth < 576
        },
      },
      created: function() {
        this.initFrame();
        window.addEventListener('resize',this.initFrame)
        // window.onresize = this.initFrame()
      },
      methods: {
        initFrame() {
          const height = window.innerHeight;
          // console.log(height)
          document.querySelector('body').style.cssText = `height: ${ height }px; `;
          document.querySelector('#frame').style.cssText = `
          height: ${ height }px; 
          max-width: ${appConfig.appMaxWidth}px;width:${appConfig.appWidth}`;
          document.querySelector('body').classList.add('show-frame')
          /* if (!this.isTouchDevice) {
           document.querySelector('#frame').style.cssText = `height: ${
           appConfig.appMaxHeight
           }; max-width: ${appConfig.appMaxWidth}px;width:${appConfig.appWidth}`
           document.querySelector('body').classList.add('show-frame')
           } */
        },
      },
      render: (h) => h(App),
    }).$mount('#app');
  });

// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  // window.__app__ = app
}
