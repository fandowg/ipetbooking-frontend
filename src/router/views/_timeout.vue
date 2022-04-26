<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: '頁面逾時',
    meta: [
      { name: 'description', content: 'The page timed out while loading.' },
    ],
  },
  components: { Layout },
}
</script>

<template>
<div class="page404">
    <div class="page404__box">
      <img src="~@assets/images/logo_no_icon.svg" alt="" />
      <div class="page404__content">
      <h1>
       頁面連線已逾時
      </h1>
      <p>請重新載入頁面，謝謝。</p>
    </div>
    </div>
  </div>

</template>

<style lang="scss" module>
.title {
  text-align: center;
}
</style>
