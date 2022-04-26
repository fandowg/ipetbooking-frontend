<script>
import lazyLoadComponent from '@router/lazyload-component'
import Layout from '@layouts/mainEmployee'
import formatDate from '@utils/format-date'


export default {
  page: {
    title: '推播中心',
    meta: [{ name: 'description', content: 'Staff' }],
  },
  components: { 
    Layout, 
    Notification: () => lazyLoadComponent(import('@views/notification/listContent')),
  },
  data() {
    return {

    }
  },
  computed: {

  },
  created() {

  },
  methods: {
   
  },
}
</script>

<template>
  <Layout is-no-top>
    <Notification is-employee />
  </Layout>
</template>

<style lang="scss" module></style>
