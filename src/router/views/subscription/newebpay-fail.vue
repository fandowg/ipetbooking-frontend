<script>
export default {
  page: {
    title: '付款方式設定失敗',
    meta: [{ name: 'description', content: 'Card Binding Fail' }],
  },
  data() {
    return {
      bindCardFormData: '',
    }
  },
  methods: {
    async tryToBindingCard() {
      this.bindCardFormData = await this.$store.dispatch(
        'merchant/changeCard',
        this.$route.params.merchantAlias
      )

      this.$nextTick(() => {
        this.$refs.cardForm.submit()
      })
    },
  },
}
</script>

<template>
  <el-container class="centered-container centered-container--primary">
    <div class="inner">
      <el-card class="card-with-image">
        <img src="~@assets/images/newebpay_fail.png" alt />
        <h4 class="card-with-image__title">付款方式設定失敗</h4>
        <p class="card-with-image__description">很可惜，因為種種因素我們無法成功取得您付款方式的授權，請重新再試。</p>
        <el-button type="primary" class="is-fullwidth" @click="tryToBindingCard">重新設定付款方式</el-button>
      </el-card>
      <form
        v-if="bindCardFormData"
        ref="cardForm"
        method="POST"
        :action="bindCardFormData.PostUrl"
        hidden
      >
        <input v-for="(value, field) in bindCardFormData" :key="field" :name="field" :value="value" />
      </form>
    </div>
  </el-container>
</template>
