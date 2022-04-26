<script>
export default {
  inheritAttrs: false,
  props: {
    floating: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    dialogProps: {
      type: Object,
      default: () => {},
    },
    buttonTooltip: {
      type: String,
      default: '',
    },
    buttonType: {
      type: String,
      default: 'primary',
    },
    buttonIconName: {
      type: String,
      default: 'plus',
    },
    order: {
      type: String,
      default: '1',
    },
    onlyDialog: {
      type: Boolean,
      default: false,
    },
    onlyButton: {
      type: Boolean,
      default: false,
    },
    destroy: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '830px',
    },
  },
  computed: {
    floatingClass() {
      return [
        this.$style.floating,
        {
          [this.$style['floating--active']]:
            this.buttonIconName === 'plus' && this.dialogVisible,
        },
        this.$style[`floating__order${this.order}`],
      ]
    },
    tooltipText() {
      return this.buttonTooltip ? this.buttonTooltip : this.title
    },
  },
  methods: {
    manualOpen() {
      if (!this.onlyButton) this.$emit('update:dialogVisible', true)
      this.$emit('opened')
    },
    dialogOpened() {
      if (!this.onlyButton) this.$emit('update:dialogVisible', true)
      this.$emit('dialog-opened')
    },
    handleClose() {
      if (!this.onlyButton) this.$emit('update:dialogVisible', false)
      this.$emit('closed')
    },
  },
}
</script>

<template>
  <div v-if="floating" :class="$style['floating__wrapper']">
    <template v-if="!onlyDialog">
      <el-tooltip effect="dark" :content="tooltipText" placement="left">
        <el-button
          v-bind="$attrs"
          :type="buttonType"
          :circle="floating"
          :class="floatingClass"
          @click="manualOpen"
        >
          <BaseIcon :name="buttonIconName" />
          <slot name="trigger"></slot>
        </el-button>
      </el-tooltip>
    </template>

    <el-dialog
      v-if="!onlyButton"
      :visible="dialogVisible"
      :title="title"
      v-bind="dialogProps"
      top="0"
      :width="width"
      append-to-body
      :destroy-on-close="destroy"
      @close="handleClose"
      @opened="dialogOpened"
    >
      <slot></slot>
    </el-dialog>
  </div>
  <span v-else>
    <template v-if="!onlyDialog">
      <el-button v-bind="$attrs" :type="buttonType" @click="manualOpen">
        <BaseIcon :name="buttonIconName" />
        <slot name="trigger"></slot>
      </el-button>
    </template>
    <el-dialog
      v-if="!onlyButton"
      :visible="dialogVisible"
      :title="title"
      v-bind="dialogProps"
      top="0"
      :width="width"
      append-to-body
      :destroy-on-close="destroy"
      @close="handleClose"
      @opened="dialogOpened"
    >
      <slot></slot>
    </el-dialog>
  </span>
</template>

<style lang="scss" module>
@import '@design';
.floating {
  @include layer-elevation(4);

  position: fixed;
  right: 30px;
  bottom: 30px;
  font-size: 1.5rem;
  transition: transform 200ms cubic-bezier(0.19, 1, 0.22, 1);
  will-change: transform;
  transform-origin: center center;

  &--active {
    transform: rotate(-45deg) translateZ(0);
  }
  &__order2 {
    bottom: 95px;
  }

  &__wrapper {
    position: fixed;
    right: 30px;
    bottom: 30px;
    z-index: $layer-header-z-index;
  }
}
</style>
