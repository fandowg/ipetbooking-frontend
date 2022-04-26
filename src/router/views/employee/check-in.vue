<script>
import lazyLoadComponent from '@router/lazyload-component'
import Layout from '@layouts/mainEmployee'

export default {
  page: {
    title: '報到核銷',
    meta: [{ name: 'description', content: 'Booking List' }],
  },
  components: { Layout, QrcodeScanner: () => lazyLoadComponent(import('@views/check-in/QrcodeScanner')) },
  data() {
    return {}
  },
  computed: {},
  methods: {},
}
</script>

<template>
  <Layout>
    <BasePageHeader :large-title="true">
      <template v-slot:title
        >報到核銷</template
      >
    </BasePageHeader>
    <QrcodeScanner />
  </Layout>
</template>

<style lang="scss" module></style>
