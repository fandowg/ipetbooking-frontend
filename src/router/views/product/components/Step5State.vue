<script>
export default {
  props: {
    itemType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tryingUpdateState: false,
    }
  },
  computed: {
    productId() {
      return this.$route.params.productId
    },
  },
  methods: {
    async updateItemState(state) {
      this.tryingUpdateState = true
      try {
        await this.$store.dispatch('product/updateState', {
          ids: [this.productId],
          state,
        })
        this.$router.push({ name: 'products' })
        this.tryingUpdateState = false
      } catch (error) {
        this.tryingUpdateState = false
      }
    },
  },
}
</script>

<template>
  <div v-loading="tryingUpdateState" :class="$style.container">
    <h4>
      {{ $t('PRODUCT.COMPLETE_ADD_CONFIRM_MESSAGE', {
      name: $t(`PRODUCT.${itemType}.NAME`),
      }) }}
    </h4>
    <div :class="$style.image">
      <img src="@assets/images/add_item_step4_state.png" />
    </div>

    <el-button @click="updateItemState(0)">暫緩上架</el-button>
    <el-button type="primary" @click="updateItemState(1)">立即上架</el-button>
  </div>
</template>
<style lang="scss" module>
.container {
  text-align: center;
}
.image {
  margin-bottom: 30px;
}
</style>
