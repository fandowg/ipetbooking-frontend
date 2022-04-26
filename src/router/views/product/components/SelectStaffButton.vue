<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      query: '',
      selected: [],
    }
  },
  computed: {
    listIsEmpty() {
      return this.list.length === 0
    },
    selectedIsEmpty() {
      return this.selected.length === 0
    },
    filteredList() {
      const queryIsEmpty = this.query === ''
      const queryMatcher = new RegExp(this.query, 'g')
      return queryIsEmpty
        ? this.list
        : this.list.filter(
            (option) =>
              queryMatcher.test(option.name) || queryMatcher.test(option.title)
          )
    },
  },
  methods: {
    emitSelect() {
      this.$emit('select', this.selected)
      this.selected = []
      this.dialogVisible = false
    },
  },
}
</script>

<template>
  <span>
    <el-button
      plain
      :disabled="listIsEmpty"
      @click="dialogVisible = true"
    >{{ (listIsEmpty) ? '現有人員皆已選取' : '選取現有人員' }}</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :class="$style.wrapper"
      :show-close="false"
      top="0"
      width="680px"
      append-to-body
    >
      <el-input slot="title" v-model="query" placeholder="搜尋人員姓名或稱謂">
        <BaseIcon slot="suffix" name="search" class="el-input__icon" />
      </el-input>
      <el-checkbox-group v-model="selected">
        <el-checkbox
          v-for="option in filteredList"
          :key="option.id"
          :label="option"
          class="el-checkbox--block"
        >{{ option.name }}</el-checkbox>
      </el-checkbox-group>

      <div v-if="filteredList.length === 0">無符合搜尋條件之人員</div>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="selectedIsEmpty" @click="emitSelect">選取</el-button>
      </span>
    </el-dialog>
  </span>
</template>
<style lang="scss" module>
.wrapper {
  :global {
    .el-dialog__body {
      max-height: 50vh;
      overflow: scroll;
    }
  }
}
</style>
