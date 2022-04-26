<script>
import formatDate from '@utils/format-date'
import { Portal } from 'portal-vue'

export default {
  name: 'HistoryNote',
  components: {
    Portal,
  },
  filters: {
    formatDate,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      edit: false,
      note: '',
    }
  },
  methods: {
    async tryToStoreNote() {
      await this.$store.dispatch('order/storeMerchantNote', { id: this.defaultValue.id, note: this.note })
      this.$emit('update')
    },
    updateMode(value) {
      this.edit = value
      this.$emit('update-mode', value ? 'edit' : 'view')
    },
    async onSubmit() {
      await this.tryToStoreNote()
      this.note = ''
      this.updateMode(false)
    },
    onCancel() {
      this.note = ''
      this.updateMode(false)
    },
  },
}
</script>

<template>
  <div>
    <h5>內部備註</h5>
    <p v-html="defaultValue.member.merchantNote || '目前尚無備註'" style="line-height: 25px;"></p>

    <el-button v-if="!edit" type="primary" class="is-round is-fullwidth is-border" plain @click="updateMode(true)" style="margin-top:20px;"><BaseIcon name="plus"></BaseIcon> 新增備註</el-button>
    <template v-else>
      <!-- <Portal to="drawer-header">
        <el-button type="primary" class="is-round" @click="onSubmit">儲存</el-button>
        <el-button class="is-round" @click="onCancel">取消</el-button>
      </Portal> -->
      <el-input v-model="note" type="textarea" class="is-round is-light is-border" :rows="4" placeholder="請輸入備註"></el-input>
      <el-row :gutter="10" style="margin-top: 20px;">
        <el-col :span="12">
          <el-button class="is-round is-fullwidth" @click="onCancel">取消</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" class="is-round is-fullwidth" @click="onSubmit">儲存</el-button>
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
