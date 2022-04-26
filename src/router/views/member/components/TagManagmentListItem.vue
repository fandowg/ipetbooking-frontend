<script>
export default {
  components: {
  },
  data() {
    return {
      submitData: Object.assign({}, this.defaultValue),
      tryingRemove: false,
      tryingStore: false
    }
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {}
    },
    currentActiveIndex: {
      default: ''
    },
    itemIndex: {
      type: Number,
    }
  },
  computed: {
  },
  methods: {
    async tryToStore(tag) {
      this.tryingStore = true
      await this.$store.dispatch('member/storeTag', { ...this.submitData })
      this.$message({
        message: '儲存成功',
        type: 'success',
      })
      this.$emit('refresh')
      this.tryingStore = false
      this.$emit('update','')
    },
    async tryToRemove() {
      this.tryingRemove = true
      await this.$store.dispatch('member/removeTags', { ids: [this.submitData.id] })
      this.$emit('refresh')
      this.tryingRemove = false
    },
    reset() {
      this.submitData = Object.assign({}, this.defaultValue)
      this.$emit('update','')
    },
    updateActiveIndex() {
      this.$emit('update', this.itemIndex)
    }
  },
}
</script>

<template>
  <el-form-item>
    <div v-if="itemIndex === currentActiveIndex">
      <el-input v-model="submitData.title" style="margin-bottom: 10px;"> </el-input>
      <div style="text-align: right;">
        <el-button @click="reset">取消</el-button>
        <el-button v-loading="tryingStore" @click="tryToStore" type="primary">儲存</el-button>
      </div>
    </div>
    <el-input v-else v-model="submitData.title" placeholder="請輸入" :class="$style.editInput" readonly>
      <template v-if="currentActiveIndex === ''">
        <el-button slot="append" @click="updateActiveIndex(itemIndex)"><BaseIcon name="pencil-alt"/></el-button>
        <el-button slot="append" v-loading="tryingRemove" @click="tryToRemove"><BaseIcon name="trash-alt"/></el-button>
      </template>
    </el-input>
  </el-form-item>
</template>

<style lang="scss" module>
@import '@design';
.editInput {
  :global {
    .el-input__inner {
      border: transparent;
      background: transparent;
    }
    .el-input-group__append {
      border: none;
    }
  }
}
</style>
