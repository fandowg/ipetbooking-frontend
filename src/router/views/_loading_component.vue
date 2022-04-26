<script>
export default {}
</script>

<template>
  <div :class="$style.skeleton">
    <div :class="$style.skeleton__row"></div>
    <div :class="$style.skeleton__row"></div>
    <div :class="$style.skeleton__row"></div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.skeleton {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 16px;
  animation: skeleton-blink 1.2s ease-in-out infinite;
  &__row {
    width: 100%;
    height: 40px;
    background-color: #f2f3f5;
    &:not(:first-child) {
      margin-top: 20px;
    }
  }
}

@keyframes skeleton-blink {
  50% {
    opacity: 0.6;
  }
}
</style>
