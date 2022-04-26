import Vue from 'vue'
import store from '@state/store'

Vue.prototype.$hasHomeService = () => {
  return store.getters['merchant/hasHomeService']
}

// 可能需要一個在 merchant 裡面的關於發票的值來判斷
Vue.prototype.$hasInvoice = () => {
  return store.getters['merchant/hasHomeService']
}

Vue.prototype.$hasSpecial = () => {
  return store.getters['merchant/hasHomeService']
}