<script>
import { genderFilter } from '@utils/filter-value-to-text'
export default {
  filters: {
    genderFilter,
  },
  components: {
    BaseButton: () => import('@components/BaseButton'),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    memberId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tryingToFetch: false,
      memberData: '',
    }
  },

  watch: {
    memberId: {
      handler: 'fetchData',
      immediate: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    async fetchData() {
      this.tryingToFetch = true
      this.memberData = await this.$store.dispatch(
        'member/fetchSingle',
        this.memberId
      )
      this.tryingToFetch = false
    },
    async goToMemberPage() {
      await this.$confirm(
        '即將跳轉至客戶詳細資訊頁，確認離開此頁面？',
        '您將離開此頁面',
        {
          confirmButtonText: '前往',
          cancelButtonText: '留在此頁',
          type: 'warning',
          center: true,
        }
      )
      this.$router.push({
        name: 'view-member',
        params: { memberId: this.memberId },
      })
    },
  },
}
</script>
<template>
  <el-dialog
    v-loading="tryingToFetch"
    :visible="visible"
    width="300px"
    top="0"
    append-to-body
    @close="handleClose"
  >
    <div slot="title">
      <h5>{{memberData.fullName}} {{memberData.gender | genderFilter}}</h5>
      <ul class="is-info">
        <li>{{`${memberData.phoneCode} ${memberData.phoneNumber}`}}</li>
        <li>{{memberData.email}}</li>
      </ul>
    </div>

    <div :class="$style.overview">
      <div :class="$style['overview__item']">
        <div :class="$style['overview__value']">{{ memberData.ordersCounts }}</div>有效訂單筆數
      </div>
      <div :class="$style['overview__item']">
        <div :class="$style['overview__value']">{{ memberData.ordersTotal }}</div>累積消費金額
      </div>
    </div>
    <div :class="$style.note">
      <h6>你的備註</h6>
      <p v-html="memberData.merchantNote || '目前尚無備註'"></p>
    </div>

    <BaseButton icon="clipboard-list" @click="goToMemberPage">前往查看客戶詳細資訊</BaseButton>
  </el-dialog>
</template>
<style lang="scss" module>
@import '@design';
.overview {
  @include layer-elevation(4);

  display: flex;
  align-items: center;
  justify-content: center;
  padding: $size-button-padding-horizontal;
  margin-bottom: $size-button-padding-vertical * 2;
  text-align: center;
  background: #fff;

  &__item {
    flex: 1;
    font-size: ms(-1);
    & + & {
      border-left: 1px solid $color-border-base;
    }
  }
  &__value {
    margin-bottom: 10px;
    font-size: ms(2);
    font-weight: $heading-font-weight;
  }
}
.note {
  border-bottom: 1px solid $color-border-base;
}
</style>