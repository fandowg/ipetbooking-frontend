<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import BaseButtonDialog from '@components/BaseButtonDialog'

import pageMixin from '@src/mixins/pagination'

import { productTypeList, productTypeFilter, prepaidCapacityFilter, priceStatusFilter } from '@utils/filter-value-to-text'
import { formatDateRange } from '@utils/format-date'

export default {
  page: {
    title: '服務項目',
    meta: [{ name: 'description', content: 'Prepaid List' }],
  },
  components: {
    Layout,
    BaseButtonDialog,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {
    productTypeFilter,
    priceStatusFilter,
    prepaidCapacityFilter,
    formatDateRange,
  },
  mixins: [pageMixin],
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
      products:[...this.merchantProducts],
      category:[...this.serviceCategory],
      filterData: {
        state: '',
        productId: '',
        type: '',
      },
      productTypeList: Object.freeze(productTypeList),

      activeTab: '0',
      tabList: Object.freeze([
        {
          title: '一般服務',
          component: () => lazyLoadComponent(import('./TabService')),
        },
        {
          title: '加購服務',
          component: () => lazyLoadComponent(import('./TabAddition')),
        },
        {
          title: '分類設定',
          component: () => lazyLoadComponent(import('./Category')),
        },
      ]),

      mode: '',
    }
  },
  computed: {
    pageTitle() {
      return this.mode ? (this.mode === 'add' ? `新增${this.tabList[+this.activeTab].title}` : `編輯${this.tabList[+this.activeTab].title}`) : `服務項目`
    },
  },
  watch: {
    //  activeTab(value){
    //    if(value==='0'){
    //      this.$router.push({
    //        name:'service',
    //        params:{
    //          type:'service'
    //        }
    //      })
    //    }
    //    if(value==='1'){
    //      this.$router.push({
    //        name:'service',
    //        params:{
    //          type:'addition'
    //        }
    //      })
    //    }
    //     if(value==='2'){
    //      this.$router.push({
    //        name:'service',
    //        params:{
    //          type:'category'
    //        }
    //      })
    //    }
    // }
  },
  created() {
    if(this.$route.params.type==='service'){
      this.activeTab='0'
    }
    if(this.$route.params.type==='addition'){
      this.activeTab='1'
    }
    // if(this.$route.params.type==='category'){
    //   this.activeTab='2'
    // }
    if(this.$route.query.tab==='category'){
      this.activeTab='2'
    }
    // this.$route.meta.title=this.pageTitle
  },
  methods: {
    onFilterReset() {
      this.filterData = {
        state: '',
        productId: '',
      }
      this.tryToFetchList()
    },
    updateMode(mode) {
      this.mode = mode
    },
    changeTitle(){
      this.$route.meta.title=this.pageTitle
    },
    async updateCategory(){
      this.category = await this.$store.dispatch('product/fetchServiceCategory')
      // console.log(data)
    }
  },
}
</script>

<template>
  <Layout>
    <el-tabs v-model="activeTab"  :class="{ isEdit: mode !== '' }"  stretch type="border-card">
      <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.title" :name="`${index}`">
        <component :is="tabList[activeTab].component" v-if="Number(activeTab) === index"  :merchant-products="products" :service-category="category" @update-category="updateCategory" @update-mode="updateMode" @changeTitle="changeTitle"></component>
      </el-tab-pane>
    </el-tabs>

      <!-- <component :is="tabList[activeTab].component" :merchant-products="merchantProducts" :service-category="serviceCategory" @update-mode="updateMode"></component> -->

    <!-- <transition :name="visibleDetail ? $style.slide : $style['slide-reverse']" mode="out-in">
      <div v-if="!visibleDetail" v-loading.fullscreen.lock="tryingFetchDetail" element-loading-text="取得服務資訊中">
        <BaseTableSearch v-slot="{ fields }" :default-value="filterData" @reset="onFilterReset">
          <el-form-item prop="state">
            <el-select v-model="fields.state" placeholder="上架狀態" @change="tryToFetchList">
              <el-option label="所有狀態" value=""></el-option>
              <el-option label="上架中" value="1"></el-option>
              <el-option label="已下架" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="productId">
            <el-select v-model="fields.productId" placeholder="所有地點" @change="tryToFetchList">
              <el-option label="所有地點" value=""></el-option>
              <el-option v-for="(product, index) in merchantProducts" :key="index" :label="product.name" :value="product.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="type">
            <el-select v-model="fields.type" placeholder="服務分類" @change="tryToFetchList">
              <el-option label="所有服務分類" value=""></el-option>
              <el-option label="貓" value="cat"></el-option>
              <el-option label="狗" value="dog"></el-option>
            </el-select>
          </el-form-item>
        </BaseTableSearch>
        <el-table :data="tableData" :class="$style['table']" @row-click.once="goToDetail">
          <el-table-column v-slot="{ row }" label="圖片">
            <el-image slot="error" class="image image--square" :src="row.image" fit="cover">
              <BaseIcon name="image" class="image--error" />
            </el-image>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="名稱" prop="title">
            <div>{{ row.title }}</div>
            <div style="font-size: 12px;color: darkgray;">{{ row.introtext }}</div>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="服務設定" width="100">{{ row.productTitle }}</el-table-column>
          <el-table-column v-slot="{ row }" label="狀態" width="100">
            <BaseStateLabel :state="row.state | priceStatusFilter('color')" text>{{ row.state | priceStatusFilter('text') }}</BaseStateLabel>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="項目描述" prop="description" width="250"><div v-html="row.description"></div></el-table-column>
          <el-table-column v-slot="{ row }" label="原價/售價">
            <span class="Jost" style="text-decoration: line-through;font-size: 12px;color: #b3b3b3;">原價${{ row.basePrice }}</span
            ><br />
            <span class="Jost">${{ row.price }}</span>
          </el-table-column>
          <el-table-column width="50">
            <el-tooltip content="查看詳情" placement="top">
              <el-button type="text">
                <BaseIcon name="ellipsis-v" />
              </el-button>
            </el-tooltip>
          </el-table-column>
        </el-table>
        <BasePagination ref="pagination" :current-page.sync="currentPage" />
        <BaseButtonDialog button-tooltip="新增服務項目" only-button floating @opened="createDetail" />
      </div>
      <ItemDetail v-else :products="merchantProducts" :category="serviceCategory" :default-value="selectedDetail" @cancel="onCancel" @update="tryToFetchList"></ItemDetail>
    </transition> -->
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.table {
  @include layer-elevation(5);
}
:global{
  .isEdit{
    .el-tabs__header{
      display: none;
    }
    &.el-tabs--border-card {
      border-radius: 0;
      background: none;
      box-shadow: none;
      
      .el-tabs__content{
        padding: 0;
      }
    }
  }
}
</style>
