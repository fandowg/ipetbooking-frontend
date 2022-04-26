<script>
import { deviceComputed } from '@state/helpers'
import { PushNotifications } from '@capacitor/push-notifications';

export default {

  data() {
    return {
      loadingDeleteDevice: false,
      loadingLogOut: false
    }
  },
  computed: {
    ...deviceComputed
  },
  created() {
    if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
      this.tryToDeleteDevice()
    }

    this.tryToLogOut();
  },
  methods: {
    async tryToDeleteDevice() {
      if(this.currentDeviceToken) {
        this.loadingDeleteDevice = true;

        return this.$store.dispatch('device/deleteDevice', {
          token: this.currentDeviceToken,
        })
          .finally(() => {
            this.loadingDeleteDevice = false;
          })
      }
    },
    async tryToLogOut() {
      this.loadingLogOut = true;

      await this.$store.dispatch('auth/logOut').then(() => {
        if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
          PushNotifications.removeAllDeliveredNotifications();
        }

        this.$router.push({
          name:'login'
        })
      })
        .finally(() => {
          this.loadingLogOut = false;
        })
    },
  },
}
</script>

<template>
<div></div>
</template>

<style lang="scss" module>

</style>
