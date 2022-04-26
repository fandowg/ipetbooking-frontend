<script>
export default {
  props: {
    active: {
      type: Number,
      default: 1,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<template>
  <div :class="$style.steps">
    <div
      v-for="(step, $index) in list"
      :key="$index + 1"
      :class="[$style.step, { [$style['is-process']]: $index + 1 === active }]"
    >
      <div :class="$style.step__number">{{ $index + 1}}</div>
      <div :class="$style.step__main">{{ step.title}}</div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
// @import '@src/design/_mixins.scss';
.steps {
  display: flex;
  margin-bottom: 20px;
  justify-content: center;
  // width: 60%;

  // margin-left: 20%;
}
.step {
  display: flex;
  // flex-basis: 50%;
  // width: 100%;
  justify-content: center;
  // flex-shrink: 1;
  align-items: center;
  color: #bebebe;
  margin-left: 30px;
  margin-right: 30px;

  &:last-child {
    // flex-basis: auto;
    // flex-grow: 0;
    // flex-shrink: 0;
  }
  &__number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border: 1px solid #bebebe;
    border-radius: 50%;
  }

  @include when(process) {
    color: #222;

    .step__number {
      color: white;
      background-color: $color-primary;
    }
  }
}
</style>
