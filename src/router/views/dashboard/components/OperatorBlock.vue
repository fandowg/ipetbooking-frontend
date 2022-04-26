<script>
export default {
  data() {
    return {
      loading: false,
      logs: [],
    }
  },
  created() {
    this.tryToFetchUserActivity()
  },
  methods: {
    async tryToFetchUserActivity() {
      this.loading = true
      const { logs } = await this.$store.dispatch('dashboard/fetchUserActivity')
      this.logs = logs
      this.loading = false
    },
  },
}
</script>

<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="header">
      <h3 class="block-title">最近帳號活動狀態</h3>
    </div>

    <el-table
      v-loading="loading"
      element-loading-text="取得列表資訊中"
      :data="logs"
    >
      <el-table-column prop="fullName" label="使用者名稱"> </el-table-column>
      <el-table-column prop="email" label="使用者 Email"> </el-table-column>
      <el-table-column prop="ipAddress" label="IP"></el-table-column>
      <el-table-column prop="created" label="登入時間"> </el-table-column>
    </el-table>
  </el-card>
</template>
