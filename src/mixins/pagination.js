export const DEFAULT_CURRENT_PAGE = 1
export const DEFAULT_PAGE_SIZE = 10

export default {
  data() {
    return {
      currentPage: DEFAULT_CURRENT_PAGE,
    }
  },
  computed: {
    pageQuery() {
      return {
        page: this.currentPage,
        limit: DEFAULT_PAGE_SIZE,
      }
    },
  },
}
