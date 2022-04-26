<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      isFloating: false,
    }
  },
  watch: {
    value: {
      handler: 'onBlur',
      immediate: true,
    },
    isFloating: {
      handler: 'toggleFormItemClass',
      immediate: true,
    },
  },
  methods: {
    toggleFormItemClass(floating) {
      // Ensuring that when watcher is fired immediately, DOM is ready to get this.$refs.input
      this.$nextTick(() => {
        // NOTE: .el-form-item validation trigger 時 class 會被重新運算，因此增加的 class 會被洗掉
        const formItemLabelElement = this.$refs.input.$el.parentNode
          .previousElementSibling
        formItemLabelElement.classList.add('floating-label')

        if (floating || this.$slots.prepend) {
          formItemLabelElement.classList.add('is-floating')
        } else {
          formItemLabelElement.classList.remove('is-floating')
        }
      })
    },
    onBlur(value) {
      this.isFloating = value !== '' && value !== null
    },
    onFocus() {
      this.isFloating = true
    },
    onInput(value) {
      this.isFloating = value !== '' && value !== null
    },
  },
}
</script>
      

<template>
  <el-input
    ref="input"
    :value="value"
    v-bind="$attrs"
    v-on="$listeners"
    @focus="onFocus"
    @input="onInput(value)"
    @blur="onBlur(value)"
  >
    <template v-slot:prepend>
      <slot name="prepend"></slot>
    </template>
    <template v-slot:append>
      <slot name="append"></slot>
    </template>
    <template v-slot:suffix>
      <slot name="suffix"></slot>
    </template>
  </el-input>
</template>

