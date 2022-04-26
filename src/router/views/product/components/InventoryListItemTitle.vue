<script>
import formatDate, { formatDateTimeRange } from '@utils/format-date'
import { inventoryRepeatFilter } from '@utils/filter-value-to-text'

export default {
  props: {
    dateTimeRepeat: {
      type: Object,
      required: true,
    },
  },
  render() {
    const vnodes = []
    const {
      startDate,
      endDate,
      repeatEndDate = '',
      startTime,
      endTime,
      repeat,
      repeatWith,
      inventory,
    } = this.dateTimeRepeat

    vnodes.push(
      <span>{formatDateTimeRange(startDate, endDate, startTime, endTime)}</span>
    )

    if (repeatEndDate) {
      vnodes.push(
        <span class={this.$style.grey}>
          {inventoryRepeatFilter(repeat, repeatWith)}重複至
          {formatDate(repeatEndDate)}
        </span>
      )
    } else {
      vnodes.push(
        <span class={this.$style.grey}>
          {inventoryRepeatFilter(repeat, repeatWith)}
        </span>
      )
    }
    vnodes.push(
      <span class={this.$style.inventory}>可供{inventory}人報名</span>
    )

    return <div class={this.$style.title}>{vnodes}</div>
  },
}
</script>

<style lang="scss" module>
@import '@design';
.title {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: ms(2) / 1.5 20px;

  > span:not(:last-child) {
    margin-right: 20px;
  }
}
.primary {
  color: $color-primary;
}
.grey {
  color: $color-text-secondary;
}

.inventory {
  text-align: right;
}
</style>

