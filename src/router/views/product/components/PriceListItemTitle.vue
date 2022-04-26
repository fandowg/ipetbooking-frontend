<script>
export default {
  props: {
    titlePrices: {
      type: Object,
      default: () => {
        return {
          title: '',
          basePrice: '0',
          price: '0',
          size: '1',
        }
      },
    },
  },
  render() {
    const { title, basePrice, price, size } = this.titlePrices
    return (
      <span class={this.$style.title}>
        <span>{title}</span>
        <span class={this.$style.grey}>原價 {basePrice}</span>
        <span>售價 {price}</span>
        <span>每一單位可供{size}人使用</span>
      </span>
    )
  },
}
</script>

<style lang="scss" module>
@import '@design';
.title {
  display: inline-flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0 20px;
  > span:not(:last-child) {
    margin-left: 20px;
  }
}

.grey {
  color: $color-text-secondary;
}
</style>

