<script>
export default {
  props: {
    text: {
      type: Boolean,
      default: false,
    },
    dot: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: 'success',
      validator: function(value) {
        return ['success', 'warning', 'danger', 'info', 'finish', 'semi-success-warning'].indexOf(value) !== -1
      },
    },
    round: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <span :class="[$style.label, $style[`label--${state}`], { [$style['label--text']]: text, [$style['label--dot']]: dot, [$style['label--round']]: round }]">
    <slot></slot>
  </span>
</template>

<style lang="scss" module>
@import '@design';

$type-state-map: (
  success: $color-state-success,
  danger: $color-state-danger,
  info: $color-state-info,
  warning: $color-state-warning,
  finish: $color-state-finish,
  semi-success-warning: linear-gradient($color-state-success 50%, $color-state-warning 50%),
);

.label {
  box-sizing: border-box;
  border-radius: 8px;
  display: inline-block;
  font-weight: bold;
  letter-spacing: $font-letter-spacing-small;
  white-space: nowrap;

  & + & {
    margin-left: 10px;
  }

  @each $state, $color in $type-state-map {
    &--#{$state} {
      color: white;
      background: $color;
      &.label--text {
        color: $color;
        background: transparent;
      }
      &.label--dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      &.label--round {
        padding: 4px 10px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        line-height: 23px;
        @if $state == 'success' {
          background-color: lighten($color, 37%);
        }
        @if $state == 'danger' {
          background-color: lighten($color, 30%);
        }
        @if $state == 'info' {
          background-color: lighten($color, 35%);
        }
        @if $state == 'warning' {
          background-color: lighten($color, 35%);
        }
        @if $state == 'finish' {
          background-color: lighten($color, 50%);
        }
      }
      &:not(.label--text):not(.label--dot) {
        height: 25px;
        padding: 0 18px;
        font-size: $font-size-smaller;
        line-height: 25px;
      }
    }
  }
}
</style>
