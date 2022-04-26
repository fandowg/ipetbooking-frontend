<script>
import { authComputed } from '@state/helpers'

export default {
  page: {
    title: '付款方式已設定成功',
    meta: [{ name: 'description', content: 'Card Binding Success' }],
  },
  computed: {
    ...authComputed,
  },
  methods: {
    async handleLogin() {
      const userRoutes = await this.$store.dispatch('auth/fetchAccess')
      this.$router.addRoutes(userRoutes)
      await this.$store.dispatch('auth/fetchTour')

      this.$router.push({
        name: this.currentUser.redirect,
      })
    },
  },
}
</script>

<template>
  <el-container class="centered-container centered-container--primary">
    <div class="inner">
      <el-card class="card-with-image">
        <img src="~@assets/images/newebpay_success.png" alt />
        <h4 class="card-with-image__title">付款方式已設定成功</h4>
        <p class="card-with-image__description">已經可以開始使用 iPetBooking 管理您的預約事業囉！</p>
        <el-button type="primary" class="is-fullwidth" @click="handleLogin">前往後臺管理</el-button>
      </el-card>
    </div>
  </el-container>
</template>
