<script>
import { debounce } from 'lodash'
import { generateUniqueString } from '@utils'

export default {
  data() {
    return {
      list: [],
      searchKeyword: '',
      activeIndex: '',
      loading: false,
    }
  },
  computed: {
    getSelectedCount() {
      return this.list.reduce((acc, cur) => {
        cur.checked === true && acc++
        return acc
      }, 0)
    },
  },
  created() {
    this.searchExtraFields = debounce(async (searchValue) => {
      if (!searchValue) return
      this.loading = true
      this.activeIndex = ''

      this.list = await this.$store.dispatch('product/fetchExtraField', {
        search: searchValue,
      })
      // 排除預設題目
      this.list = this.list.filter((item) => !item.default)
      if (this.list.length === 0)
        this.$message({
          message: '查無結果！',
          type: 'warning',
        })
      this.loading = false
    }, 500)
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    getFieldTitle(fieldType, fieldOptions) {
      switch (fieldType) {
        case 'text':
          return '簡答題'
        case 'radio':
          return `單選題：${fieldOptions.length} 個選項`
        case 'checkbox':
          return `多選題：${fieldOptions.length} 個選項`
      }
    },
    showAlertMessage() {
      this.$message({
        message: '請勾選題目！',
        type: 'warning',
      })
    },
    addSelectedItems() {
      const selectedItems = this.getSelectedItems()
      if (selectedItems.length > 0) {
        this.$emit('add', selectedItems)
        this.closeDialog()
      } else this.showAlertMessage()
    },
    getUniqueKey() {
      return generateUniqueString(15)
    },
    getSelectedItems() {
      return this.list.filter((item) => item.checked)
    },
  },
}
</script>

<template>
  <div>
    <el-input v-model="searchKeyword" :class="$style['search-bar']" placeholder="搜尋" @input="searchExtraFields">
      <BaseIcon slot="prefix" class="el-input__icon" name="search" />
    </el-input>

    <div v-loading="loading" :class="list.length > 0 ? [$style['list-wrap'], 'not-empty'] : [$style['list-wrap']]">
      <div v-for="(field, fieldIndex) in list" :key="field.id" :class="$style['list-item']">
        <el-checkbox v-model="field.checked" :label="field.title" border></el-checkbox>
        <el-collapse v-model="activeIndex" :class="$style['el-collapse']">
          <el-collapse-item :title="getFieldTitle(field.type, field.params.options)" :name="fieldIndex" :disabled="field.type === 'text'">
            <template v-if="field.type !== 'text'">
              <div v-for="(option, optionIndex) in field.params.options" :key="`${field.id}.${optionIndex}`" class="option">{{ `選項 ${optionIndex + 1}：${option.title}` }}</div>
            </template>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <div slot="footer" :class="$style['dialog-footer']">
      <span>已選 {{ getSelectedCount }} 項</span>
      <span>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="addSelectedItems">加入</el-button>
      </span>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.dialog-footer {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 400px;
    height: 1px;
    z-index: 3;
    top: -20px;
    left: -20px;
    background: rgba(0, 0, 0, 0.14);
  }
  & > span {
    width: 50%;
    display: inline-block;
    &:last-child {
      text-align: right;
    }
  }
}
.search-bar {
  margin-bottom: 20px;
}

:global {
  :local(.list-wrap) {
    height: 0;
    overflow: auto;
    margin-bottom: 20px;
    transition: 0.2s all;
    &.not-empty {
      height: 520px;
    }
  }
}
.list-item {
  margin-bottom: 20px;
  label {
    width: 100%;
  }
  :global {
    .el-checkbox.is-bordered.is-checked {
      border-bottom-color: #dcdfe6;
    }
    .is-checked + .el-collapse {
      border-color: $color-primary;
    }
    .el-checkbox,
    .el-collapse {
      border-width: 2px;
    }
    .el-checkbox__label {
      text-overflow: ellipsis;
      width: 100%;
      overflow: hidden;
      vertical-align: sub;
    }
  }
}

.el-collapse {
  border: 1px solid #dcdfe6;
  border-top: 0;
  border-bottom-width: 2px;

  :global {
    .el-collapse-item__header {
      direction: rtl;
      justify-content: flex-end;
      padding-left: 11px;
      height: 40px;

      & i {
        margin: 0 11px 0 0;
      }
    }
    .is-disabled .el-collapse-item__header {
      color: inherit;
      cursor: auto;
    }
    .is-disabled i {
      visibility: hidden;
    }
    .option {
      margin-bottom: 10px;
    }
    .el-collapse-item__wrap {
      padding: 0 35px;
      .el-collapse-item__content {
        padding-bottom: 0px;
      }
    }
  }
}
</style>
