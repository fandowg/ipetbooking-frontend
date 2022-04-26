import Vue from 'vue'
import VueI18n from 'vue-i18n'

import appConfig from '@src/app.config'

Vue.use(VueI18n)

const messages = {
  'zh-TW': require('./zh-TW').default,
}

const i18n = new VueI18n({
  locale: appConfig.defaultLocale,
  fallbackLocale: appConfig.fallbackLocale,
  messages,
})

export default i18n
