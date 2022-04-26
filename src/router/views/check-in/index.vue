<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'

export default {
  page: {
    title: '接待報到',
    meta: [{ name: 'description', container: 'Check In' }],
  },
  components: {
    Layout,
    TabCalendar: () => lazyLoadComponent(import('./TabCalendar')),
    TabPhoneNumber: () => lazyLoadComponent(import('./TabPhoneNumber')),
    QrcodeScanner: () => lazyLoadComponent(import('./QrcodeScanner')),
  },
  data() {
    return {
      activeTab: 'Calendar',
      productList: [],
      filterProduct: {},
      qrcodeDialogVisible: false,
    }
  },
  created() {
    this.changeActiveTabFromRouter()
    this.fetchProducts()
  },
  methods: {
    changeActiveTabFromRouter() {
      if (this.$route.params.activeTab !== undefined)
        this.activeTab = this.$route.params.activeTab
    },
    async fetchProducts() {
      const { items } = await this.$store.dispatch('product/fetchList', {
        paginate: 0,
      })
      this.productList = items
      this.filterProduct = this.productList[0] || ''
      this.$nextTick(() => {
        this.defaultActiveProduct()
      })
    },
    defaultActiveProduct() {
      if (this.$route.params.productId !== undefined) {
        this.productList.some((product) => {
          if (product.id === this.$route.params.productId) {
            this.filterProduct = product
            return true
          }
          return false
        })
      } else {
        this.filterProduct = this.productList[0]
      }
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.wrapper">
      <div :class="$style.sidebar">
        <el-tabs v-model="activeTab">
          <el-tab-pane name="Calendar">
            <div slot="label">
              <BaseIcon :class="$style['sidebar__icon']" name="calendar" />
              <div>行事曆</div>
            </div>
            <el-radio-group
              v-model="filterProduct"
              :class="$style.radios"
              size="small"
            >
              <el-radio
                v-for="product in productList"
                :key="product.id"
                :label="product"
                >{{ product.name }}</el-radio
              >
            </el-radio-group>
          </el-tab-pane>
          <el-tab-pane name="PhoneNumber">
            <div slot="label">
              <BaseIcon :class="$style['sidebar__icon']" name="phone" />
              <div>電話報到</div>
            </div>
            <div :class="$style['sidebar__pane']">
              <el-button
                class="is-fullwidth"
                @click="qrcodeDialogVisible = true"
                >掃描憑證</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <keep-alive>
        <component
          :is="`Tab${activeTab}`"
          ref="tab"
          :product="filterProduct"
          :class="$style.content"
        ></component>
      </keep-alive>
    </div>
    <el-dialog
      title="掃描憑證"
      :visible.sync="qrcodeDialogVisible"
      top="0"
      center
      append-to-body
      lock-scroll
      fullscreen
    >
      <QrcodeScanner v-if="qrcodeDialogVisible" />
    </el-dialog>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.wrapper {
  display: flex;
  min-height: calc(100vh - #{$size-header-height});
  margin: -20px;
}
.sidebar {
  min-width: 15rem;
  max-width: 15rem;
  background: $color-primary;
  &__icon {
    margin-bottom: 5px;
    font-size: 2rem;
  }
  &__pane {
    padding: 20px;
  }

  :global {
    .el-tabs__nav {
      display: flex;
      width: 100%;
      text-align: center;
    }
    .el-tabs__item {
      flex: 1;
      height: auto;
      padding: 15px 10px;
      line-height: initial;
      color: #e1e1e1;
      background-color: darken($color-primary, 10);
      transition: $all-transition;

      &.is-active {
        color: white;
        border-bottom-color: $color-primary;
        background-color: $color-primary;
      }
    }
  }
}
.content {
  width: 100%;
  padding: 20px;
}

.radios {
  width: 100%;
  :global {
    .el-radio {
      display: flex;
      width: 100%;
      padding: 10px 20px;
      margin-right: 0;
      color: white;
      white-space: normal;
      &.is-checked {
        @include layer-elevation(4);

        background-color: rgba(255, 255, 255, 0.15);
      }
    }
    .el-radio__inner:after {
      background: transparent;
    }

    .el-radio__input.is-checked {
      & + .el-radio__label {
        color: white;
      }

      .el-radio__inner {
        background: #f85858;
        border-color: #f85858;
      }
    }
  }
}
</style>
