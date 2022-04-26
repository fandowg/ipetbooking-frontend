<script>
import {cloneDeep} from 'lodash'
export default {
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    targetName: {
      type: String,
      default: '項目',
    },
    searchPlaceholder: {
      type: String,
      default: '搜尋項目',
    },
    group: {
      type: Boolean,
      default: false
    }
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
      if(queryIsEmpty) return this.list
      if(!this.group) {
        return this.list.filter((option) => queryMatcher.test(option.name) || queryMatcher.test(option.title))
      } else {
        const filter = cloneDeep(this.list)
        filter.forEach(group => {
          group.children = group.children.filter((price)=> queryMatcher.test(price.title))
        });
        return filter
      }
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
      :disabled="listIsEmpty"
      size="small"
      type="primary"
      @click="dialogVisible = true"
    >{{ (listIsEmpty) ? `${targetName}皆已選取` : `選取${targetName}` }}</el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      :class="$style.wrapper"
      :show-close="false"
      top="0"
      width="680px"
      append-to-body
    >
      <el-input slot="title" v-model="query" :placeholder="searchPlaceholder">
        <BaseIcon slot="prefix" name="search" class="el-input__icon" />
      </el-input>
      <el-checkbox-group v-if="!group" v-model="selected">
        <el-checkbox
          v-for="option in filteredList"
          :key="option.id"
          :label="option.id"
          class="el-checkbox--block"
        >{{ option.name }}</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group v-else v-model="selected">
        <div v-for="(product, productIndex) in filteredList" :key="productIndex" :class="$style.group">
          <div :class="$style.title">{{product.title}}</div>
          <el-checkbox
            v-for="(price, index) in product.children"
            :key="index"
            :label="price.id"
            class="el-checkbox--block"
          >{{ `${price.title}・${price.introtext}` }}</el-checkbox>
        </div>
      </el-checkbox-group>

      <div v-if="filteredList.length === 0">{{`無符合搜尋條件之${targetName}` }}</div>

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
.group {
  .title {
    font-size: 12px;
    color: #909399;
    line-height: 30px;
  }
  & + .group {
    border-top: 1px solid #E4E7ED;
    padding-top: 10px;
    margin-top: 10px;
  }
}
</style>
