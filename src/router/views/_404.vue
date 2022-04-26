<script>
import Layout from '@layouts/main'
import { authComputed } from '@state/helpers'

export default {
  page: {
    title: '404',
    meta: [{ name: 'description', content: '404' }],
  },
  components: { Layout },
  props: {
    resource: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...authComputed,
  },
}
</script>

<template>
  <div class="page404">
    <div class="page404__box">
      <img src="~@assets/images/logo_no_icon.svg" alt="" />
      <div class="page404__content">
      <h1>
        Error 404 頁面連結錯誤
      </h1>
      <p>很抱歉！目前無法連結到該頁面。造成您的不便，敬請見諒。</p>
      <!-- <el-button v-if="loggedIn" @click="$router.push({ name: currentUser.redirect })">回到預設頁</el-button> -->
      <el-button type="primary" class="is-round" @click="$router.push({ name: 'login' })">回到登入頁</el-button>
    </div>
    </div>
  </div>
</template>

<style lang="scss" module>
</style>
