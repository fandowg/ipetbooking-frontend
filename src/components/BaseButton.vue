<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    direction: {
      type: String,
      default: 'horizontal',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <button :class="[$style.button, $style[`button--${direction}`]]" v-on="$listeners">
    <BaseIcon v-if="loading" :class="$style.icon" name="spinner" spin />
    <BaseIcon v-else-if="icon" :class="$style.icon" :name="icon" />
    <div :class="$style.label">
      <slot></slot>
    </div>
  </button>
</template>

<style lang="scss" module>
@import '@design';
.label {
  flex: 1;
  padding-top: $size-button-padding-vertical;
}
.icon {
  flex-basis: 3rem;
}

/* Stacked Buttons */
.button {
  -webkit-appearance: none;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  background-color: transparent;
  border: none;
  transition: $all-transition;
  &:hover:not(:disabled) {
    color: $color-primary;
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }

  &--horizontal {
    width: 100%;
    .label {
      padding-bottom: $size-button-padding-vertical;
    }
    &:not(:last-child) .label {
      // border-bottom: 1px solid $color-border-base;
    }
    .icon {
      margin-top: $size-button-padding-vertical;
      margin-bottom: $size-button-padding-vertical;
    }
  }
  &--vertical {
    flex-direction: column;
    padding: $size-button-padding-vertical;
    border: 1px solid $color-border-base;
    &:hover:not(:disabled) {
      color: white;
      background: $color-primary-gradient;
      border-color: $color-primary;
    }
    .icon {
      font-size: 2.5em;
    }
  }
}
</style>
