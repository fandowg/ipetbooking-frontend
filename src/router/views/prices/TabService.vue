<script>
import listComponent from './components/listComponent.vue'

export default {
  page: {
    title: '服務項目',
    meta: [{ name: 'description', content: 'Prepaid List' }],
  },
  components: {
   listComponent
  },
  filters: {

  },

  props: {
    merchantProducts: {
      type: Array,
      required: true,
    },
    serviceCategory: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
 
    }
  },
  computed: {

  },
  watch: {

  },
  created() {

  },
  methods: {
  },
}
</script>

<template>
<listComponent
  :merchant-products="merchantProducts" 
  :service-category="serviceCategory"
  type="service"
/>

</template>

<style lang="scss" module>
</style>
