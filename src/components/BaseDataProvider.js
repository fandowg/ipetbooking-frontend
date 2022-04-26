import request from '@utils/request'

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    data: null,
    loaded: false,
  }),
  created() {
    request({
      method: 'post',
      url: this.url,
    }).then((response) => {
      this.loadedData = response.items
      this.loaded = true
    })
  },
  render() {
    return this.$scopedSlots.default({
      loading: !this.loaded,
      data: this.data,
    })
  },
}
