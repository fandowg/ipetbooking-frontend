<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap } from '@utils/filter-value-to-text'
import Layout from '@layouts/main'
import { PushNotifications } from "@capacitor/push-notifications";

export default {
  page: {
    title: '推播中心',
    meta: [{ name: 'description', content: 'Notification' }],
  },
  components:{
    Layout,
    Notification: () => lazyLoadComponent(import('./listContent')),
  },
  filters:{
    genderFilter
  },
  props:{

  },
  data(){
    return{

    }
  },
  computed:{

  },
  watch:{

  },
  created(){
    this.onRemoveAllDeliveredNotifications();
  },
  methods:{
    onRemoveAllDeliveredNotifications() {
      if(process.env.VUE_APP_BUILD_MODE === 'admin-app-build') {
        PushNotifications.removeAllDeliveredNotifications()
      }
    }
  }
}
</script>
<template>
<Layout is-no-top>
<Notification />
</Layout>
</template>

<style lang="scss" module>

</style>
