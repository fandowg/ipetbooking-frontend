<script>
import lazyLoadComponent from '@router/lazyload-component'
export default {
  page: {
    title: '',
    meta: [{ name: 'description', content: '' }],
  },
  components: {
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<template>
  <div>
    <h1>訂單分析</h1>
  </div>
</template>
