import Vue from 'vue'

import Can, { checkPermission } from '@src/directives/can'

const CanPlugin = {
  install(Vue) {
    Vue.directive('can', Can)

    Vue.prototype.$can = function(type, value) {
      return checkPermission(type, value)
    }
  },
}

Vue.use(CanPlugin)
