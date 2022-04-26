import Echo from "laravel-echo";
import store from "@state/store";
import Vue from "vue";

window.Pusher = require('pusher-js');

const echo = new Echo({
  broadcaster: 'pusher',
  key: window.globalData.MIX_PUSHER_APP_KEY,
  cluster: window.globalData.MIX_PUSHER_APP_CLUSTER,
  wsHost: window.globalData.BROADCAST_DOMAIN,
  wsPort: window.globalData.LARAVEL_WEBSOCKETS_PORT,
  wssPort: window.globalData.LARAVEL_WEBSOCKETS_PORT,
  forceTLS: window.globalData.PUSHER_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
  namespace: 'DaydreamLab\\Dddream\\Events\\Push\\Admin',
  auth: {
    headers: {
      Authorization: `Bearer ${store.state.auth.currentUser.token}`
    }
  },
});

Vue.use({
  install(Vue, options) {
    Vue.prototype.$echo = echo;
  }
});
