<script>
import tourMixin from '@src/mixins/tour'
import pageMixin from '@src/mixins/pagination'
import { authComputed ,merchantComputed} from '@state/helpers'

import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import { productStateMap, productTypeList } from '@utils/filter-value-to-text'
export default {
  page: {
    title: '所有項目',
    meta: [{ name: 'description', content: 'Product List' }],
  },

  components: {
    Layout,
    ListItem: () => lazyLoadComponent(import('./components/ListItem')),
    // addProduct: () => lazyLoadComponent(import('./addProduct')),
    BaseButtonDialog: () => import('@components/BaseButtonDialog'),
    BaseButton: () => lazyLoadComponent(import('@components/BaseButton')),
  },
  mixins: [tourMixin, pageMixin],
  tourName: 'products',
  data() {
    return {
      addDialogVisible: false,
      dialogCalendarVisible: false,
      filterData: {
        state: '',
        activeOrders: '',
        hidden: '',
        order: 'desc',
        order_by: '',
      },
      stateList: Object.freeze(productStateMap),
      productTypeList: Object.freeze(productTypeList),
      orderByList: Object.freeze([
        {
          label: '依創建時間：近→遠',
          value: 'created_at',
        },
        {
          label: '依最後更新時間：近→遠',
          value: 'updated_at',
        },
      ]),
      productList: [],
      readiedComponents: [],
      modulesLimit: 0,
      modulesUsed: 0,
    }
  },
  watch: {
    currentPage: {
      handler: 'tryToSearchProduct',
      immediate: true,
    },
    readiedComponents: {
      handler: 'componentsReady',
    },
  },
  created() {
   this.$store.dispatch('merchant/fetchSingle')
  },
  mounted() {
    if (this.$route.params.showAddDialog === true) this.showAddDialog()
  },
  computed: {
    ...authComputed,
    ...merchantComputed,
    merchantCalendarURL() {
      return `${window.location.origin}/api/${this.currentUser.merchantAlias}/${this.currentUser.merchantId}/product/ical`
    },
    showUsageWarning() {
      if (this.modulesLimit === 0) return false
      const percent25 = this.modulesLimit / 4
      const remnant = this.modulesLimit - this.modulesUsed
      return percent25 >= remnant
    },
    isSroresLimit(){
      // console.log(this.currentMerchant.plan.stores)
      return this.currentMerchant.plan.stores <= this.productList.length
    }
  },
  methods: {
    async tryToSearchProduct() {
      const { items, modulesLimit, modulesUsed, total } = await this.$store.dispatch('product/fetchList', Object.assign(this.filterData, this.pageQuery))
      this.productList = items
      this.modulesUsed = modulesUsed
      this.modulesLimit = modulesLimit
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
    updateReadiedComponents(id) {
      this.readiedComponents.push(id)
    },
    componentsReady() {
      if (this.readiedComponents.length === this.productList.length) this.showProductDialog()
    },
    showProductDialog() {
      if (this.$route.params.productId !== undefined) this.$refs[this.$route.params.productId][0].dialogVisible = true
    },
    showAddDialog() {
      this.addDialogVisible = true
    },
    copyCalendarUrl() {
      this.$refs.CalendarUrlInput.select()
      document.execCommand('copy')
      this.$message('連結複製成功')
    },
    openExternal(url) {
      window.open(url, '_blank')
    },
    goToAddProduct(){
       this.$router.push({ name: 'add-product' })
    }
  },
}
</script>

<template>
  <Layout>
    <div class="btn-top-box p-0 mb-4" style="background: transparent">
     <span>
       <el-button v-if="currentMerchant.plan"  class="is-round" type="primary"  :disabled="isSroresLimit" @click="goToAddProduct">
          <BaseIcon name="plus" />
          <span>新增</span>
        </el-button>
     </span>
    </div>
     <!-- <BasePageHeader >
        <template v-slot:title>分店設定</template>
        <template v-slot:right>
       
        </template>
        </BasePageHeader> -->
    <el-alert
      v-if="showUsageWarning"
      :title="`您目前的項目使用數量： ${modulesUsed} / ${modulesLimit} 。提醒您，項目數量達到上限時，您無法在創建項目，欲擴增項目額度請聯絡業務處理。`"
      show-icon
      :closable="true"
      :class="$style.warning"
    ></el-alert>
    <div :class="[$style['item__list'], $style[`item__list--last-${productList.length % 5}`]]">
      <ListItem v-for="product in productList" :ref="product.id" :key="product.id" :data="product" :class="$style.item" @updated="tryToSearchProduct" @ready="updateReadiedComponents" />
    </div>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <el-dialog title="全店行事曆" :visible.sync="dialogCalendarVisible" :append-to-body="true" top="0" width="680px">
      <el-input ref="CalendarUrlInput" :value="merchantCalendarURL" :readonly="true">
        <el-button slot="append" @click="copyCalendarUrl">複製此網址</el-button>
      </el-input>
      <p style="margin-top: 50px;">行事曆設定教學</p>
      <div style="margin-bottom: 15px;">
        <el-button style="width: 100%;" type="primary" plain @click="openExternal('https://support.apple.com/zh-tw/guide/iphone/iph3d1110d4/ios')">設定於 Apple 行事曆</el-button>
      </div>
      <div>
        <el-button style="width: 100%;" type="primary" plain @click="openExternal('https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DDesktop&hl=zh-Hant')"
          >設定於 Google 行事曆</el-button
        >
      </div>
    </el-dialog>

    <!-- <addProduct :default-step="1" /> -->
  </Layout>
</template>
<style lang="scss" module>
@import '@design';

$column-number: 5;

.item {
  width: calc(100% / #{$column-number} - 15px);
  margin-bottom: 30px;

  @include max-sm {
    width: calc(100% - 0.5rem);
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &--last-2:after {
      width: calc(100% / #{$column-number} * 3 - 15px);
      content: '';
    }
    &--last-3:after {
      width: calc(100% / #{$column-number} * 2 - 15px);
      content: '';
    }
    &--last-4:after {
      width: calc(100% / #{$column-number} * 1 - 15px);
      content: '';
    }
  }
}

.create {
  border: 2px dashed lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 45px;
  color: lightgray;
  cursor: pointer;
  margin: 5px 5px 35px 5px;
  height: 190px;
}

.types {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: space-between;

  &__item {
    min-width: 100px;
    margin-bottom: 20px;
  }
}

.warning {
  background-color: #bf7e45 !important;
  color: white !important;
  margin-top: -20px;
  margin-bottom: 20px;
  padding: 18px 16px;
  :global {
    .el-alert__closebtn {
      color: white !important;
      top: 18px;
      font-size: 18px;
    }
  }
}
</style>
