<script>
import parseDate from 'date-fns/parse'
import lazyLoadComponent from '@router/lazyload-component'
import { debounce } from 'lodash'

import Layout from '@layouts/main'
import BaseButtonDialog from '@components/BaseButtonDialog'
// import draggable from 'vuedraggable'
import ElTableDraggable from 'element-ui-el-table-draggable'

import pageMixin from '@src/mixins/pagination'

import { productTypeList, productTypeFilter, prepaidCapacityFilter, defaultStatusFilter } from '@utils/filter-value-to-text'
import { formatDateRange } from '@utils/format-date'
import { authComputed } from '@state/helpers'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'

export default {
  page: {
    title: '包月方案管理',
    meta: [{ name: 'description', content: 'Prepaid List' }],
  },
  components: {
    Layout,
    BaseButtonDialog,
    ElTableDraggable,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {
    productTypeFilter,
    defaultStatusFilter,
    prepaidCapacityFilter,
    formatDateRange,
  },
  mixins: [pageMixin],
  props: {

    category: {
      type: Array,
      required: true,
    },

  },
  data() {
    return {
      tableData: [],
      selectedPrepaids: [],
      filterData: {
        groupByGroupOrdering:true,
        // state: '',
        productIds: [''],
        categoryId:'',
        search:'',
        // productType: '',
        // type: '',
        // body: '',
        paginate:1
      },
      productTypeList: Object.freeze(productTypeList),
      productListPrepaid: [],
      productIds: [],
      cacheTableData: [],
      pageSize:10,
      tryingFetch:false
      // options: [],
      // drag: false,
    }
  },
  computed: {
    ...authComputed,
    enabledBulkButton() {
      return this.selectedPrepaids.length === 0
    },
    enabledCopyButton() {
      return this.selectedPrepaids.length === 1
    },
    isOrderManager() {
      return !this.currentUserRoutes.includes('add-prepaid') && this.currentUserRoutes.includes('prepaid')
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchList',
      immediate: false,
    },
    filterData: {
      handler() {
        this.isFilterChange = true
      },
      deep: true,
    },
    pageSize: {
      handler(){
        this.tryToFetchList()
        this.currentPage=1
      },
      immediate: false,
    },
  },
  created() {
    const page = this.$route.params.pagination
    if(page){
      const data = {...this.$route.params.filterData}
      this.filterData.productIds = data.productIds
      this.filterData.categoryId = data.categoryId
      this.filterData.search = data.search
      // this.tryToFetchListPage(data,page)
      this.currentPage=page
      if(this.currentPage === 1){
        this.tryToFetchList()
      }

    }else{
      this.tryToFetchListFilter()
    }
    // const filterData = this.$route.params.filterData
    // if(this.$route.params.filterData){
    //   this.filterData = 
    // }
    this.tryToSearchProduct()
  },
  mounted() {
    // console.log(this.$refs.fff)
  },
  methods: {
    async tryToFetchListPage(query,page){
      // console.log(query)
      this.tryingFetch = true
      const { items, total } = await this.$store.dispatch('prepaid/fetchListGroup', Object.assign(query, this.pageQuery,{
        limit:this.pageSize,
        page:page
      }))
      this.tableData = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
      this.isFilterChange = false
      this.tryingFetch = false
    },
    async tryToFetchListFilter() {
      // 當篩選前不在第一頁的時候，跳回第一頁
      this.tryingFetch = true
      if (this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      
      const query = {...this.filterData}
      if(query.productIds[0]=== ''){
        query.productIds = []
      }
      const { items, total } = await this.$store.dispatch('prepaid/fetchListGroup', Object.assign(query, this.pageQuery,{
        limit:this.pageSize
      }))
      this.tableData = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
      this.isFilterChange = false
      this.tryingFetch = false
    },
    currentPageLimit(){
      const remainder = this.$refs.pagination.total % this.$refs.pagination.pageSize
      const qotient = this.$refs.pagination.total / this.$refs.pagination.pageSize
      const totalPage = remainder ? parseInt(qotient) + 1 : parseInt(qotient)
      if (this.currentPage > totalPage) {
        this.currentPage = totalPage
      }
    },
    async tryToFetchList() {
      this.tryingFetch = true
      const query = {...this.filterData}
      if(query.productIds[0]=== ''){
        query.productIds = []
      }
      const { items, total } = await this.$store.dispatch('prepaid/fetchListGroup', Object.assign(query, this.pageQuery,{
        limit:this.pageSize
      }))
      this.tableData = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
        this.currentPageLimit()
      })
      this.tryingFetch = false
    },
    checkAvailability(row) {
      const now = new Date()
      const { state, startDate, endDate } = row
      if (state === 0) return false

      if (startDate && endDate) return now >= parseDate(startDate) && now <= parseDate(endDate)
      if (!startDate) return now <= parseDate(endDate)
      if (!endDate) return now >= parseDate(startDate)
      return state
    },
    goToViewPage(row, isDrawer) {
      const groupOrdering = row.groupOrdering
      if (isDrawer) {
        this.$router.push({ name: 'view-prepaid', params: { groupOrdering, pagination:this.currentPage, drawer: isDrawer } })
      } else {
        this.$router.push({ name: 'view-prepaid', params: { groupOrdering, pagination:this.currentPage,filterData:this.filterData } })
      }
    },
    goToAddPrepaid(data) {
      this.$router.push({
        name: 'add-prepaid',
        params: {
          data,
          pagination:this.currentPage,
          filterData:this.filterData
        },
      })
    },
    async handleBulkUpdateState(state) {
      const prepaidIds = this.selectedPrepaids.map(({ id }) => id)
      await this.$store.dispatch('prepaid/updateState', {
        ids: prepaidIds,
        state,
      })
      this.tryToFetchList()
    },
    async handleDeleteCoupon() {
      try {
        await messageBoxDelete('包月方案')
        try {
          const prepaidIds = this.selectedPrepaids.map(({ groupOrdering }) => groupOrdering)
          await this.$store.dispatch('prepaid/removeGroup', { groupOrderings: prepaidIds })
          messageDelete()
          this.tryToFetchList()
        } finally {
  
        }
      } catch {

      }
    },
    async handleDuplicateCoupon() {
      const [prepaidId] = this.selectedPrepaids.map(({ groupOrdering }) => groupOrdering)

      const { id, title, alias, ...prepaidData } = await this.$store.dispatch('prepaid/fetchSingle', prepaidId)

      const duplicateData = {
        title: `${title}（複製）`,
        ...prepaidData,
      }
      this.goToAddPrepaid(duplicateData)
      // await this.$store.dispatch('prepaid/store', duplicateData)
      // this.tryToFetchList()
    },
    handleSelectionChange(selected) {
      this.selectedPrepaids = selected
    },
    handleResetSearch() {
      // this.filterData.productIds = ''
      this.filterData =  {
        groupByGroupOrdering:true,
    
        productIds: [''],
        categoryId:'',
        search:'',
   
        paginate:1
      }
      this.tryToFetchList()
    },
    async tryToSearchProduct() {
      const { items } = await this.$store.dispatch('product/fetchList', { limit: 10000, page: 1 })
      this.productListPrepaid = items.map((item) => {
        return {
          ...item,
          id: [item.id],
        }
      })

      // this.productListPrepaid = items
      // this.productListPrepaid.forEach(item => {
      //   item.id=[item.id]
      // });
      // this.productIds=this.productList.map(item=>[item.id])
    },
    startDraggable() {
      this.cacheTableData = [...this.tableData]
    },
    endDraggable({ targetObject, list }) {
      // console.log(targetObject.id,list)
      const preIndex = this.cacheTableData.map((item) => item.id).indexOf(targetObject.id)
      const nextIndex = this.tableData.map((item) => item.id).indexOf(targetObject.id)
      const draggableChange = nextIndex - preIndex
      this.tryToOrderingPrepaid(targetObject.id, draggableChange)
      // console.log(preIndex,nextIndex,draggableChange)
    },
    async tryToOrderingPrepaid(prepaidId, indexDiff) {
      await this.$store.dispatch('prepaid/orderingPrepaid', {
        id: prepaidId,
        indexDiff,
      })
    },
    tryToSearchByInput: debounce(function () {
      // console.log(this)
      this.tryToFetchListFilter()
    }, 300),
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.btnTop" class="btn-top-box">
      <span>
        <el-button class="is-round" type="primary" @click="goToAddPrepaid({})">
          <BaseIcon name="plus" />
          <span>新增</span>
        </el-button>
      </span>
      <span>
        <el-button class="is-round"  :disabled="enabledBulkButton" @click="handleDeleteCoupon">
          <BaseIcon name="trash-alt" />
          <span>刪除選取</span>
        </el-button>
      </span>
      <!-- <span>
        <el-button class="is-round" :disabled="enabledBulkButton" @click="handleBulkUpdateState(1)">
          <BaseIcon name="eye" />
          <span>開放</span>
        </el-button>
      </span>
      <span>
        <el-button class="is-round" :disabled="enabledBulkButton" @click="handleBulkUpdateState(0)">
          <BaseIcon name="eye-slash" />
          <span>不開放</span>
        </el-button>
      </span>
      <span>
        <el-button class="is-round"  :disabled="enabledBulkButton" @click="handleDeleteCoupon">
          <BaseIcon name="trash-alt" />
          <span>刪除選取</span>
        </el-button>
      </span>
      <span>
        <el-button class="is-round" :disabled="!enabledCopyButton" @click="handleDuplicateCoupon">
          <BaseIcon name="copy" />
          <span>複製</span>
        </el-button>
      </span> -->
    </div>

    <BaseTableSearch v-slot="{ fields }" hide-action :default-value="filterData" @reset="handleResetSearch" @tryToFetchList="tryToFetchListFilter">
      <!-- <el-form-item prop="state">
        <el-select v-model="fields.state" placeholder="選擇開放狀態" @change="tryToFetchListFilter">
          <el-option label="所有狀態" value=""></el-option>
          <el-option label="開放中" value="1"></el-option>
          <el-option label="未開放" value="0"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="productIds">
        <el-select v-model="fields.productIds[0]" placeholder="選擇分店" @change="tryToFetchListFilter">
          <el-option label="所有分店" value=""></el-option>
          <el-option v-for="(product, index) in productListPrepaid" :key="`product-${index}`" :label="product.name" :value="product.id[0]"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="categoryId">
        <el-select v-model="fields.categoryId" placeholder="選擇類別" @change="tryToFetchListFilter">
          <el-option label="所有類別" value></el-option>
          <el-option v-for="item in category" :key="item.id" :value="item.id" :label="item.title"></el-option>
       
        </el-select>
      </el-form-item>
      <el-form-item prop="search">
        <el-input v-model.trim.lazy="fields.search" clearable placeholder="輸入標題搜尋" @input="tryToSearchByInput">
          <BaseIcon slot="prefix" name="search" class="el-input__icon" />
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="body">
        <el-select v-model="fields.body" placeholder="選擇體型" @change="tryToFetchList">
          <el-option label="所有體型" value=""></el-option>
          <el-option label="小型 3-5kg" value="0"></el-option>
           <el-option label="中小型 6-10kg" value="1"></el-option>
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item prop="productType">
        <el-select v-model="fields.productType" placeholder="適用項目類型" @change="tryToFetchList">
          <el-option
            v-for="(type, typeValue) in productTypeList"
            :key="typeValue"
            :label="type.name"
            :value="typeValue"
          ></el-option>
        </el-select>
      </el-form-item> -->
    </BaseTableSearch>
    <div class="el-table-wrapper">
   
        <el-table v-loading="tryingFetch" element-loading-text="取得包月資訊中" :data="tableData" :class="$style['table']" row-key="id" @row-click.once="goToViewPage" @selection-change="handleSelectionChange">
          <el-table-column v-if="!isOrderManager" type="selection" min-width="55"></el-table-column>
          <el-table-column v-slot="{ row }" label="圖片" min-width="150">
            <el-image  class="image image--square" :src="row.image" fit="cover">
              <div slot="error">
              <BaseIcon name="image" class="image--error" />
              </div>
            </el-image>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="標題與可用次數" prop="title" min-width="160">
            {{ row.title }} <br />
            可用次數 {{ row.times }} 次
          </el-table-column>
           <el-table-column v-slot="{ row }" label="類別" prop="categoryTitle" min-width="70">
            {{ row.categoryTitle }} 
          </el-table-column>
          <el-table-column v-slot="{ row }" label="分店" prop="stores" min-width="120">
            {{ row.stores.join(' | ') }} 
          </el-table-column>
          <!-- <el-table-column v-slot="{ row }" label="開放狀態" min-width="80">
            <BaseStateLabel :state="row.state | defaultStatusFilter('color')" text>{{ row.state | defaultStatusFilter('text') }}</BaseStateLabel>
          </el-table-column> -->
   
     
          <el-table-column v-slot="{ row }" label="販售狀態" min-width="120">{{ row.infinity | prepaidCapacityFilter(row.groupQtyTotal, row.groupInventoryTotal) }}</el-table-column>
          <el-table-column v-slot="{ row }" label="購買方案" min-width="90">
            <el-tooltip content="代客購買包月方案" placement="top">
              <el-button type="text" @click.stop="goToViewPage(row, true)">
                <BaseIcon icon-style="fal" name="shopping-cart" />
              </el-button>
      
            </el-tooltip>
          </el-table-column>
          <el-table-column min-width="60" label="查看">
        <el-tooltip content="查看包月方案詳細資訊" placement="top">
          <el-button  type="text">
            <BaseIcon name="ellipsis-v" />
          </el-button>
        </el-tooltip>
      </el-table-column>
        
        </el-table>
 
    </div>
    <BasePagination ref="pagination" show-size :current-page.sync="currentPage" :page-size.sync="pageSize" />
   
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.table {
  @include layer-elevation(5);
}

.btnTop {
  @include max-sm {
    > * {
      &:not(:first-child) {
        width: 50%;
      }
    }
  }
}
</style>
