<script>
import CountryCallingCode from '@utils/country-code'
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      query: '',
      list: Object.freeze(CountryCallingCode),
      selected: '',
    }
  },
  computed: {
    filteredList() {
      const queryIsEmpty = this.query === ''
      const queryMatcher = new RegExp(this.query.toLowerCase(), 'g')
      return queryIsEmpty
        ? this.list
        : this.list.filter(
            (option) =>
              queryMatcher.test(option.label.toLowerCase()) ||
              queryMatcher.test(option.value)
          )
    },
  },
  methods: {
    emitSelect() {
      this.$emit('input', this.selected)
      this.dialogVisible = false
    },
    onFocusInput() {
      this.$refs['search-input'].focus()
    },
  },
}
</script>

<template>
  <span>
    <el-button :disabled="disabled" @click="dialogVisible = true">
      {{ value || '選擇國碼' }}
      <BaseIcon name="caret-down" />
    </el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      top="0"
      :class="$style.wrapper"
      :show-close="false"
      append-to-body
      @open="onFocusInput"
    >
      <el-input
        ref="search-input"
        slot="title"
        v-model="query"
        placeholder="搜尋國家名稱或國碼"
      >
        <BaseIcon slot="suffix" name="search" class="el-input__icon" />
      </el-input>
      <el-radio-group v-model="selected">
        <el-radio
          v-for="option in filteredList"
          :key="option.label"
          :label="option.value"
          class="el-radio--block"
          :class="$style.option"
        >
          <span>{{ option.label }}</span>
          <span class="select__option--meta">{{ option.value }}</span>
        </el-radio>
      </el-radio-group>

      <div v-if="filteredList.length === 0">無符合搜尋條件之國碼</div>
      <span slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!selected" @click="emitSelect"
          >選取</el-button
        >
      </span>
    </el-dialog>
  </span>
</template>

<style lang="scss" module>
@import '@design';
.wrapper {
  :global {
    .el-dialog__body {
      max-height: 50vh;
      overflow: scroll;
    }
    .el-input__suffix {
      right: 10px;
    }
    .el-input__validateIcon {
      display: none;
    }
    .el-radio-group{
      @include touch {
        width: 100%
      }
    }
  }
}
.option {
  margin: 0;
  :global(.el-radio__input) {
    display: none;
  }
}
</style>
