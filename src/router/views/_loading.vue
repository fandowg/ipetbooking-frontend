<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: '載入頁面中...',
    meta: [{ name: 'description', content: 'Loading page...' }],
  },
  components: { Layout },
}
</script>

<template>
  <!-- <Layout> -->
    <Transition appear>
      <BaseIcon :class="$style.loadingIcon" name="sync" spin />
    </Transition>
  <!-- </Layout> -->
</template>

<style lang="scss" module>
@import '@design';

.loadingIcon {
  display: block;
  margin: 0 auto;
  font-size: ms(12);

  // stylelint-disable-next-line selector-class-pattern
  &:global(.v-enter-active) {
    transition: opacity 1s;
  }
  // stylelint-disable-next-line selector-class-pattern
  &:global(.v-enter) {
    opacity: 0;
  }
}
</style>
