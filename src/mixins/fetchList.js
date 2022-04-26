

export default {
  data() {
    return {
      isFilterChange:false,
      
    }
  },
  computed: {
   
  },
  watch: {
    filterData: {
      handler() {
        this.isFilterChange = true
      },
      deep: true,
    },
  },
  methods: {

  },
}
