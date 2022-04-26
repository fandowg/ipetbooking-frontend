<script>
import lazyLoadComponent from '@router/lazyload-component'
import { PortalTarget } from 'portal-vue'

export default {
  components: {
    PortalTarget,
    OrderListItem: () => lazyLoadComponent(import('@components/OrderListItem')),
    OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
  },
  data() {
    return {
      searchMode: true,
      drawerVisible: false,
      drawerOrderData: true,
      tryingToSearchOrders: false,
      searchPhone: '',
      orderList: [],
    }
  },
  methods: {
    handleDrawerClosed() {
      this.$refs.orderDetail.mode = 'view'
    },
    updateSearchPhone(number) {
      if (this.searchPhone.length >= 10) return
      this.searchPhone = `${this.searchPhone}${number}`
    },
    backSearchPhone() {
      if (!this.searchPhone) return
      this.searchPhone = this.searchPhone.slice(0, -1)
    },
    changeDialpadVisible(visible) {
      this.searchMode = visible
    },
    async tryToGetOrder(orderId) {
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
      this.drawerVisible = true
    },
    async tryToSearchOrdersByPhone(query) {
      this.changeDialpadVisible(false)
      this.tryingToSearchOrders = true
      this.orderList = query
        ? await this.$store
            .dispatch('order/fetchList', {
              search: query,
              paymentMethod: 'All',
              pagination: 0,
            })
            .then(({ items }) => items)
        : []

      this.tryingToSearchOrders = false
    },
  },
}
</script>
<template>
  <div>
    <div :class="$style.dialpad">
      <div :class="$style['dialpad-result']">{{ searchPhone }}</div>
      <template v-if="searchMode">
        <el-button v-for="number in 9" :key="`number-${number}`" :class="$style['dialpad-button']" @click="updateSearchPhone(number)">{{ number }}</el-button>
        <el-button :class="$style['dialpad-button']" @click="backSearchPhone">
          <BaseIcon name="backspace" />
        </el-button>
        <el-button :class="$style['dialpad-button']" @click="updateSearchPhone(0)">0</el-button>
        <el-button :class="$style['dialpad-button']" type="primary" @click="tryToSearchOrdersByPhone(searchPhone)">
          <BaseIcon name="search" />
        </el-button>
      </template>
    </div>

    <div v-if="!searchMode" v-loading="tryingToSearchOrders" :class="$style.main">
      <OrderListItem v-for="order in orderList" :key="order.id" :data="order" show-product @view="tryToGetOrder" @update="tryToSearchOrdersByPhone(searchPhone)" />
      <p v-if="searchPhone && !tryingToSearchOrders && orderList.length === 0">無符合條件之訂單</p>
      <el-button class="is-fullwidth is-drawer--bottom" type="primary" plain @click="changeDialpadVisible(true)">再次查詢</el-button>
    </div>
    <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" @closed="handleDrawerClosed">
      <!-- header -->
      <PortalTarget name="drawer-header" slot="title"></PortalTarget>
      <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToSearchOrdersByPhone(searchPhone)" />
    </el-drawer>
  </div>
</template>
<style lang="scss" module>
@import '@design';
.main {
  min-height: $size-content-height;
}
.dialpad {
  display: grid;
  grid-template-rows: [first-row-start] 6rem [first-row-end] auto;
  grid-template-columns: repeat(3, 120px);
  grid-gap: 10px;
  justify-content: center;

  /* IE10+ CSS styles go here */
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    display: flex;
    flex-wrap: wrap;
  }

  &-result {
    grid-row-start: first-row-start;
    grid-row-end: first-row-end;
    grid-column-start: 1;
    grid-column-end: 4;
    font-size: 5rem;
    text-align: right;
    /* IE10+ CSS styles go here */
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      height: 75px;
      flex-basis: 100%;
      margin-right: 20px;
    }
  }

  &-button {
    font-size: 3.5rem;
    & + & {
      margin-left: 0;
    }
    /* IE10+ CSS styles go here */
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
      flex-basis: 25%;
      margin-top: 10px;
      margin-right: 10px;
    }
  }
}
</style>
