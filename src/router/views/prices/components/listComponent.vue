<script>
import lazyLoadComponent from '@router/lazyload-component'

import BaseButtonDialog from '@components/BaseButtonDialog'
import ElTableDraggable from 'element-ui-el-table-draggable'

import pageMixin from '@src/mixins/pagination'

import { productTypeList, productTypeFilter, prepaidCapacityFilter, priceStatusFilter } from '@utils/filter-value-to-text'
import { formatDateRange } from '@utils/format-date'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'

export default {
  page: {
    title: '服務項目',
    meta: [{ name: 'description', content: 'Prepaid List' }],
  },
  components: {
    BaseButtonDialog,
    ElTableDraggable,
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
    type:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      tableData: [],
      selectedCoupons: [],
      selectedDetail: {},
      filterData: {
        state: '',
        productId: '',
        type: '',
        // body:'',
        petCategoryId: '',
        petSizeId: '',
        groupByGroupOrdering:1
      },
      productTypeList: Object.freeze(productTypeList),
      visibleDetail: false,
      previousPage: 1,
      previousTotal: 0,
      tryingFetchDetail: false,
      tryingFetch:false,
      pageSize: 10,
      isFilterChange: false,
    }
  },
  computed: {
    // pageTitle() {
    //   return this.visibleDetail ? (this.selectedDetail.id ? '編輯服務項目' : '新增服務項目') : '服務項目'
    // },
    enabledBulkButton() {
      return this.selectedCoupons.length === 0
    },
    enabledCopyButton() {
      return this.selectedCoupons.length === 1
    },
    activeSizeList() {
      let active = []
      if (this.filterData.petCategoryId) {
        active = this.serviceCategory.find((item) => {
          return item.id === this.filterData.petCategoryId
        }).children
      } else {
        active = []
      }
      // console.log(active)
      return active
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchList',
      immediate: true,
    },
    filterData: {
      handler() {
        this.isFilterChange = true
      },
      deep: true,
    },
    pageSize: {
      handler(val) {
        // console.log(val)
        if (this.currentPage !== 1) {
          this.currentPage = 1
        } else {
          this.tryToFetchList()
        }
      },
      immediate: false,
    },
    'filterData.petCategoryId': function (value) {
      this.filterData.petSizeId = ''
      //  this.tryToFetchList()
    },
  },
  created() {
    // console.log(345)

    // 改框架中
    // if (this.$route.params.priceInfo) this.goToDetail(this.$route.params.priceInfo)
    if (this.$route.params.createPrice) this.createDetail()

    // this.tryToFetchList()
    // this.$route.meta.title="新增服務"
  },
  methods: {
    async tryToFetchListFilter() {
      // if(!this.filterData.petCategoryId){
      //   this.filterData.petSizeId=""
      // }
       // 當篩選前不在第一頁的時候，跳回第一頁
      if (this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      this.pageQuery.limit = this.pageSize
      const url = this.type==='service'?'product/fetchServicePriceGroup':'product/fetchAdditionalPriceGroup'
      
      try {
        this.tryingFetch = true
        const items = await this.$store.dispatch(`${url}`, Object.assign({}, this.filterData, {paginate:0}))
        this.tableData = items
        this.isFilterChange = false
      } catch {

      } finally {
        this.tryingFetch = false
      }
      
    },
    // currentPageLimit(){
    //   const remainder = this.$refs.pagination.total % this.$refs.pagination.pageSize
    //   const qotient = this.$refs.pagination.total / this.$refs.pagination.pageSize
    //   const totalPage = remainder ? parseInt(qotient) + 1 : parseInt(qotient)
    //   if (this.currentPage > totalPage) {
    //     this.currentPage = totalPage
    //   }
    // },
    async tryToFetchList() {
      // if(!this.filterData.petCategoryId){
      //   this.filterData.petSizeId=""
      // }
      this.pageQuery.limit = this.pageSize
      const url = this.type==='service'?'product/fetchServicePriceGroup':'product/fetchAdditionalPriceGroup'
      try{
        this.tryingFetch = true
        const items = await this.$store.dispatch(`${url}`, Object.assign({}, this.filterData, {paginate:0}))
        this.tableData = items
      } catch {

      } finally {
        this.tryingFetch = false

      }
      
  
    },
    async goToDetail(row) {
      try {
        if(this.type==='service'){
          this.$store.commit('title/SET_TITLE', '編輯一般服務')
          // this.tryingFetchDetail = true
          // this.selectedDetail = await this.$store.dispatch('product/fetchSingleServicePrice', row.id)
          this.$router.push({ 
            name: 'view-service', 
            params: { 
              groupOrdering:row.groupOrdering,
              merchantProducts:this.merchantProducts,
              serviceCategory:this.serviceCategory

            } 
          
          })
        }
        if(this.type==='addition'){
          this.$store.commit('title/SET_TITLE', '編輯加購項目')
          // this.tryingFetchDetail = true
          // this.selectedDetail = await this.$store.dispatch('product/fetchSingleServicePrice', row.id)
          this.$router.push({ 
            name: 'view-service', 
            params: { 
              type:'addition',
              groupOrdering:row.groupOrdering,
              merchantProducts:this.merchantProducts,
              serviceCategory:this.serviceCategory

            } 
          
          })
        }
        // this.visibleDetail = true
        this.$emit('update-mode', 'edit')
      } finally {
        // this.tryingFetchDetail = false
      }
    },
    createDetail(date) {
      if(this.type==='service'){
        this.$store.commit('title/SET_TITLE', '新增一般服務')
        this.$router.push({ 
          name: 'add-service', 
          params: { 
              
              merchantProducts:this.merchantProducts,
              serviceCategory:this.serviceCategory

          } 
          
        })
      }
      if(this.type==='addition'){
        this.$store.commit('title/SET_TITLE', '新增加購項目')
        this.$router.push({ 
          name: 'add-service', 
          params: { 
              type:'addition',
              merchantProducts:this.merchantProducts,
              serviceCategory:this.serviceCategory

          } 
          
        })
      }
      
      
      // this.selectedDetail = date
      // this.visibleDetail = true
      this.$emit('update-mode', 'add')
      // this.$emit('changeTitle')
    },
    // onCancel() {
    //   this.$store.commit('title/SET_TITLE', '')
    //   this.visibleDetail = false
    //   this.$emit('update-mode', '')
    //   this.$nextTick(() => {
    //     setTimeout(() => {
    //       this.$refs.pagination.updateTotal(this.previousTotal)
    //       this.$refs.pagination.updateCurrentPage(this.previousPage)
    //     }, 400)
    //   })
    // },
    onFilterReset() {
      // this.filterData = {
      //   state: '',
      //   productId: '',
      // }
      this.tryToFetchList()
    },
    handleSelectionChange(selected) {
      this.selectedCoupons = selected
    },
    // async handleDuplicateService() {
    //   const [priceId] = this.selectedCoupons.map(({ id }) => id)

    //   const { id, title, alias, ...priceData } = await this.$store.dispatch('product/fetchSingleServicePrice', priceId)

    //   const duplicateData = {
    //     title: `${title}（複製）`,
    //     alias: `${alias}-2`,
    //     ...priceData,
    //   }
    //   this.createDetail(duplicateData)

    //   // await this.$store.dispatch('product/storeServicePrice', { productId: duplicateData.productId, params: [duplicateData] })
    //   // this.tryToFetchList()
    // },
    // async handleDeleteService() {
    //   try {
    //     await messageBoxDelete('服務項目')
    //     try {
    //       const priceIds = this.selectedCoupons.map(({ id }) => id)
    //       await this.$store.dispatch('product/removeServicePrice', { ids: priceIds })
    //       messageDelete()
    //       this.tryToFetchList()
    //     } finally {
    //     }
    //   } catch {}
    // },
    // async handleBulkUpdateState(state) {
    //   const priceIds = this.selectedCoupons.map(({ id }) => id)
    //   await this.$store.dispatch('product/serviceUpdateState', {
    //     ids: priceIds,
    //     state,
    //   })
    //   this.tryToFetchList()
    // },
    startDraggable() {
      this.cacheTableData = [...this.tableData]
    },
    endDraggable({ targetObject, list }) {
      // console.log(targetObject.id,list)
      const preIndex = this.cacheTableData.map((item) => item.groupOrdering).indexOf(targetObject.groupOrdering)
      const nextIndex = this.tableData.map((item) => item.groupOrdering).indexOf(targetObject.groupOrdering)
      const draggableChange = nextIndex - preIndex
      this.tryToOrderingPriceGroup(targetObject.groupOrdering, draggableChange)
      // console.log(preIndex,nextIndex,draggableChange)
    },
    // async tryToOrderingPrice(productId, priceId, indexDiff) {
    //   await this.$store.dispatch('product/orderingServicePrice', {
    //     productId,
    //     orderingData: {
    //       id: priceId,
    //       indexDiff,
    //     },
    //   })
    // },
    async tryToOrderingPriceGroup(groupOrdering,indexDiff) {
      const url = this.type==='service'?'product/orderingServicePriceGroup':'product/orderingAdditionalPriceGroup'
      await this.$store.dispatch(`${url}`, {
        orderingData: {
          groupOrdering,
          indexDiff,
        },
      })
      this.tryToFetchList()
    },
    // async handleBulkUpdateState(state) {
    //   const priceIds = this.selectedCoupons.map(({ id }) => id)
    //   await this.$store.dispatch('prepaid/updateState', {
    //     ids: priceIds,
    //     state,
    //   })
    //   this.tryToFetchList()
    // },
  },
}
</script>

<template>
  <div>
    <div >
      <div :class="$style.btnTop" class="btn-top-box p-0">
        <span>
          <el-button class="is-round" type="primary" @click="createDetail({})">
            <BaseIcon name="plus" />
            <span>新增</span>
          </el-button>
        </span>
      </div>
    </div>
    <div  >
      <BaseTableSearch v-slot="{ fields }" hide-action :default-value="filterData" class="isForTab" @reset="onFilterReset" @tryToFetchList="tryToFetchListFilter">
        <!-- <el-form-item prop="state">
          <el-select v-model="fields.state" placeholder="上架狀態" @change="tryToFetchListFilter">
            <el-option label="所有狀態" value=""></el-option>
            <el-option label="上架中" value="1"></el-option>
            <el-option label="已下架" value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item prop="productId">
          <el-select v-model="fields.productId" placeholder="所有地點" @change="tryToFetchListFilter">
            <el-option label="所有分店" value=""></el-option>
            <el-option v-for="(product, index) in merchantProducts" :key="index" :label="product.name" :value="product.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="petCategoryId">
          <el-select v-model="fields.petCategoryId" placeholder="選擇寵物類別" @change="tryToFetchListFilter">
            <el-option label="所有類別" value></el-option>
            <el-option v-for="item in serviceCategory" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="petSizeId">
          <el-select v-model="filterData.petSizeId" placeholder="寵物體型" @change="tryToFetchListFilter">
            <el-option label="所有體型" value></el-option>
            <template v-if="fields.petCategoryId">
              <el-option v-for="item in activeSizeList" :key="item.id" :label="item.categoryTitle" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item prop="type">
          <el-select v-model="fields.type" placeholder="服務分類" >
            <el-option label="所有類別" value=""></el-option>
            <el-option label="貓" value="cat"></el-option>
            <el-option label="狗" value="dog"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="body">
        <el-select v-model="fields.body" placeholder="選擇體型" >
          <el-option label="所有體型" value=""></el-option>
          <el-option label="小型 3-5kg" value="0"></el-option>
           <el-option label="中小型 6-10kg" value="1"></el-option>
        </el-select>
      </el-form-item> -->
      </BaseTableSearch>
      <div class="el-table-wrapper">
        <ElTableDraggable handle=".handle" @drag="startDraggable" @drop="endDraggable">
          <el-table  v-loading="tryingFetch" :data="tableData" element-loading-text="取得服務資訊中"  :class="$style['table']" @row-click.once="goToDetail" @selection-change="handleSelectionChange">
            <!-- <el-table-column type="selection" min-width="55"></el-table-column> -->
            <el-table-column v-slot="{ row }" label="圖片" min-width="150">
              <el-image class="image image--square" :src="row.images[0] ? row.images[0].path : ''" fit="cover">
                <div slot="error">
                  <BaseIcon name="image" class="image--error" />
                </div>
              </el-image>
            </el-table-column>
            <el-table-column v-slot="{ row }" label="名稱" prop="title" min-width="180">
              <div>{{ row.title }}</div>
              <!-- <div style="font-size: 12px; color: darkgray">{{ row.serviceTime }}分鐘</div>
              <div style="font-size: 12px; color: darkgray">緩衝+{{ row.bufferTime }}分鐘</div> -->
              <!-- <div >{{ row.introtext }}</div> -->
            </el-table-column>
            <!-- <el-table-column v-slot="{ row }" label="狀態" min-width="80">
              <BaseStateLabel :state="row.state | priceStatusFilter('color')" text>{{ row.state | priceStatusFilter('text') }}</BaseStateLabel>
            </el-table-column> -->
            <!-- <el-table-column v-slot="{ row }" label="分店" min-width="80">{{ row.productTitle }}</el-table-column> -->

            <el-table-column v-slot="{ row }" label="類別" prop="type" min-width="170">{{ row.petCategoryTitle }}</el-table-column>
            <!-- <el-table-column v-slot="{ row }" label="原價/售價" min-width="100">
              <span class="Jost" style="text-decoration: line-through; font-size: 12px; color: #b3b3b3">原價${{ row.basePrice }}</span
              ><br />
              <span class="Jost">${{ row.price }}</span>
            </el-table-column> -->
            <el-table-column v-if="!filterData.productId && !filterData.petCategoryId" min-width="60">
              <el-tooltip content="拖曳改變排序" placement="top">
                <el-button type="text" class="handle">
                  <BaseIcon icon-style="fas" name="grip-vertical" />
                </el-button>
              </el-tooltip>
            </el-table-column>
          </el-table>
        </ElTableDraggable>
      </div>
      <!-- <BasePagination ref="pagination" show-size :current-page.sync="currentPage" :page-size.sync="pageSize" /> -->
      <!-- <BaseButtonDialog button-tooltip="新增服務項目" only-dialog floating /> -->
    </div>
    <!-- <ItemDetail v-else :products="merchantProducts" :category="serviceCategory" :default-value="selectedDetail"  @update="tryToFetchList" /> -->
  </div>
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
