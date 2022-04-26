<script>
export default {
  data() {
    return {
      loading: false,
      visible: false,
    }
  },
  methods: {
    tryToFetchData() {
      if (!this.visible) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 500)
      } else {
        this.loading = false
      }
    },
  },
}
</script>

<template>
  <el-popover v-model="visible" placement="bottom-end" trigger="click">
    <div v-loading="loading">Notifications</div>
    <span slot="reference" @click="tryToFetchData">
      <el-badge :value="12">
        <BaseIcon name="bell" />
      </el-badge>
    </span>
  </el-popover>
</template>

