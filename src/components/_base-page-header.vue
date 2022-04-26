<script>
export default {
  props: {
    title: String,
    subtitle: String,
    center: {
      type: Boolean,
      default: false,
    },
    largeTitle: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<template>
  <div :class="[$style.wrapper, { [$style['center-hub']]: center }]">
    <div :class="$style['inner__left']">
      <h2 :class="{ [$style.lg]: largeTitle }">
        <slot name="title">{{ title }}</slot>
      </h2>
      <p v-if="$slots.subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>
    </div>
    <div v-if="$slots.center" :class="$style['inner__center']">
      <slot name="center"></slot>
    </div>
    <div :class="$style['inner__right']">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5em;

  @include max-sm {
    flex-direction: column;
    align-items: flex-start;
  }
}
.inner {
  &__right {
    text-align: right;
  }
  &__center {
    width: 60%;
  }
}
.center-hub {
  > div {
    flex-grow: 1;
    flex-basis: 0;
  }
  .inner__center {
    flex-grow: 2;
  }
}
.lg {
  font-size: 25px;
  letter-spacing: 2.5px;
  line-height: 36px;
  @include touch {
    font-size: 20px;
  }
}
</style>
