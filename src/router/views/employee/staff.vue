<script>
import lazyLoadComponent from '@router/lazyload-component'
import Layout from '@layouts/mainEmployee'
import formatDate from '@utils/format-date'
import { authComputed } from '@state/helpers'

export default {
  page: {
    title: '我的帳戶',
    meta: [{ name: 'description', content: 'Staff' }],
  },
  components: { Layout, ScheduleStaffDetail: () => lazyLoadComponent(import('@components/ScheduleStaffDetail')) },
  data() {
    return {
      visibleDetail: false,
      staffDetail: {
        scheduleTotalHours:0,
        order:{
          items:[]
        }
      },
      tryingFetchDetail: false,
      visibleEdit: false,
    }
  },
  computed: {
    ...authComputed,
  },
  created() {
    if(this.currentUser.scheduleItemId){
      this.tryToFetchDetail(this.currentUser.scheduleItemId)
    }
  },
  methods: {
    async tryToFetchDetail(id) {
      this.tryingFetchDetail = true
      this.staffDetail = await this.$store.dispatch('schedule/fetchStaffDetail', {
        id,
        page: 1,
        limit: 10,
        date: formatDate(new Date(), 'YYYY-MM'),
      })
      this.visibleDetail = true
      this.tryingFetchDetail = false
    },
  },
}
</script>

<template>
  <Layout>
    <ScheduleStaffDetail v-if="currentUser.scheduleItemId && staffDetail.id" :default-value.sync="staffDetail" type="employee" />
  </Layout>
</template>

<style lang="scss" module></style>
