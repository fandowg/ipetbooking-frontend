<script>
import parseDate from 'date-fns/parse'
import lazyLoadComponent from '@router/lazyload-component'

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
  data() {
    return {
      tableData: [],
      selectedCoupons: [],
      filterData: {
        groupByGroupOrdering:true,
        state: '',
        productIds: [],
        productType: '',
        type: '',
        body: '',
      },
      productTypeList: Object.freeze(productTypeList),
      productListPrepaid: [],
      productIds: [],
      cacheTableData: [],
      pageSize:10,
      // options: [],
      // drag: false,
    }
  },
  computed: {
    ...authComputed,
    enabledBulkButton() {
      return this.selectedCoupons.length === 0
    },
    enabledCopyButton() {
      return this.selectedCoupons.length === 1
    },
    isOrderManager() {
      return !this.currentUserRoutes.includes('add-prepaid') && this.currentUserRoutes.includes('prepaid')
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
      handler(){
        this.tryToFetchList()
        this.currentPage=1
      },
      immediate: true,
    },
  },
  created() {
    const page = this.$route.params.pagination
    if(page){
      this.currentPage=page
    }
    this.tryToSearchProduct()
  },
  mounted() {
    // console.log(this.$refs.fff)
  },
  methods: {
    async tryToFetchListFilter() {
      // 當篩選前不在第一頁的時候，跳回第一頁
      if (this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      
      const query = {...this.filterData}
      if(query.productIds[0]=== ''){
        query.productIds = []
      }
      const { items, total } = await this.$store.dispatch('prepaid/fetchListGroup', Object.assign(query, this.pageQuery))
      this.tableData = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
      this.isFilterChange = false
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
      const { items, total } = await this.$store.dispatch('prepaid/fetchListGroup', Object.assign(this.filterData, this.pageQuery))
      this.tableData = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
        this.currentPageLimit()
      })
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
      const prepaidId = row.id
      if (isDrawer) {
        this.$router.push({ name: 'view-prepaid', params: { prepaidId, pagination:this.currentPage, drawer: isDrawer } })
      } else {
        this.$router.push({ name: 'view-prepaid', params: { prepaidId, pagination:this.currentPage } })
      }
    },
    goToAddPrepaid(data) {
      this.$router.push({
        name: 'add-prepaid',
        params: {
          data,
          pagination:this.currentPage
        },
      })
    },
    async handleBulkUpdateState(state) {
      const prepaidIds = this.selectedCoupons.map(({ id }) => id)
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
          const prepaidIds = this.selectedCoupons.map(({ id }) => id)
          await this.$store.dispatch('prepaid/remove', { ids: prepaidIds })
          messageDelete()
          this.tryToFetchList()
        } finally {
  
        }
      } catch {

      }
    },
    async handleDuplicateCoupon() {
      const [prepaidId] = this.selectedCoupons.map(({ id }) => id)

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
      this.selectedCoupons = selected
    },
    handleResetSearch() {
      // this.filterData.productIds = ''
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
      </span>
    </div>

    <BaseTableSearch v-slot="{ fields }" hide-action :default-value="filterData" @reset="handleResetSearch" @tryToFetchList="tryToFetchListFilter">
      <el-form-item prop="state">
        <el-select v-model="fields.state" placeholder="選擇開放狀態" @change="tryToFetchListFilter">
          <el-option label="所有狀態" value=""></el-option>
          <el-option label="開放中" value="1"></el-option>
          <el-option label="未開放" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="productIds">
        <el-select v-model="fields.productIds[0]" placeholder="選擇分店" @change="tryToFetchListFilter">
          <el-option label="所有分店" value></el-option>
          <el-option v-for="(product, index) in productListPrepaid" :key="`product-${index}`" :label="product.name" :value="product.id[0]"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="type">
        <el-select v-model="fields.type" placeholder="選擇類別" @change="tryToFetchList">
          <el-option label="所有類別" value=""></el-option>
          <el-option label="狗" value="0"></el-option>
           <el-option label="貓" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="body">
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
      <ElTableDraggable handle=".handle" @drag="startDraggable" @drop="endDraggable">
        <el-table :data="tableData" :class="$style['table']" row-key="id" @row-click.once="goToViewPage" @selection-change="handleSelectionChange">
          <el-table-column v-if="!isOrderManager" type="selection" min-width="55"></el-table-column>
          <el-table-column v-slot="{ row }" label="圖片" min-width="150">
            <el-image  class="image image--square" :src="row.image" fit="cover">
              <div slot="error">
              <BaseIcon name="image" class="image--error" />
              </div>
            </el-image>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="標題與可用次數" prop="title" min-width="180">
            {{ row.title }} <br />
            可用次數 {{ row.times }} 次
          </el-table-column>
          <el-table-column v-slot="{ row }" label="開放狀態" min-width="80">
            <BaseStateLabel :state="row.state | defaultStatusFilter('color')" text>{{ row.state | defaultStatusFilter('text') }}</BaseStateLabel>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="分店" min-width="100"
            ><span v-for="item in row.stores" :key="item">{{ item }} </span>
          </el-table-column>
          <!-- <el-table-column v-slot="{ row }" label="類別與體型">
     狗 | 迷你犬
      </el-table-column> -->
          <!-- <el-table-column v-slot="{ row }" label="適用項目類型">{{ row.productType | productTypeFilter}}</el-table-column> -->
          <el-table-column v-slot="{ row }" label="售價" min-width="80"
            ><span class="Jost">{{ `$${row.price}` }}</span></el-table-column
          >
          <!-- <el-table-column label="可使用次數" prop="times"></el-table-column> -->
          <el-table-column v-slot="{ row }" label="販售狀態" min-width="120">{{ row.infinity | prepaidCapacityFilter(row.qty, row.inventory) }}</el-table-column>
          <el-table-column v-slot="{ row }" min-width="50">
            <el-tooltip content="代客購買包月方案" placement="top">
              <el-button type="text" @click.stop="goToViewPage(row, true)">
                <BaseIcon icon-style="fal" name="shopping-cart" />
              </el-button>
              <!-- <el-button type="text" >
            <BaseIcon icon-style="fal" name="shopping-cart" />
            {{row.id}}
          </el-button> -->
            </el-tooltip>
          </el-table-column>
          <el-table-column min-width="50">
            <el-tooltip content="拖曳改變排序" placement="top">
              <el-button type="text" class="handle">
                <BaseIcon icon-style="fas" name="grip-vertical" />
              </el-button>
            </el-tooltip>
          </el-table-column>
        </el-table>
      </ElTableDraggable>
    </div>
    <BasePagination ref="pagination" show-size :current-page.sync="currentPage" :page-size.sync="pageSize" />
    <BaseButtonDialog v-if="!isOrderManager" button-tooltip="新增包月方案" only-dialog floating />
    <!-- <BaseButtonDialog v-if="!isOrderManager" button-tooltip="新增包月方案" only-button floating @opened="goToAddPrepaid" /> -->
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
