<script>
import lazyLoadComponent from '@router/lazyload-component'

import { genderFilter, orderStatusMap, orderStatusFilter, orderPaymentMethodMap, orderPaymentMethodFilter, orderSourceMap, orderSourceFilter } from '@utils/filter-value-to-text'
import formatDate, { formatRequestData } from '@utils/format-date'
import { debounce } from 'lodash'

import pageMixin from '@src/mixins/pagination'
import { PortalTarget } from 'portal-vue'

export default {
  page: {
    title: '訂單查詢',
    meta: [{ name: 'description', content: 'Order List' }],
  },
  components: {
    PortalTarget,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderDetail: () => lazyLoadComponent(import('@components/PrepaidOrderDetail')),
  },
  filters: {
    genderFilter,
    orderStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
  },
  mixins: [pageMixin],
  data() {
    return {
      drawerVisible: false,
      drawerOrderData: '',
      filterData: {
        search:'',
        status: '',
        source: '',
        startDate: '',
        endDate: '',
        paymentMethod: 'All',
        order_by:'created_at',
        order:'desc',
      },
      statusList: Object.freeze(orderStatusMap),
      sourceList: Object.freeze(orderSourceMap),
      paymentMethodList: Object.freeze(orderPaymentMethodMap),
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一週',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近一個月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '最近三個月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            },
          },
        ],
      },
      loadedOrders: [],
      tryingToGetOrder: false,
      tryingToExport: false,
      isFilterChange: false,
    }
  },
  computed: {
    statusListFilter(){
      let obj={...orderStatusMap}
      delete obj['3']
      delete obj['4']
      delete obj['5']
      delete obj['6']
      return obj
    },
    filterDateRange: {
      get() {
        return [this.filterData.startDate, this.filterData.endDate]
      },
      set(value) {
        const [start, end] = value || ['', '']
        this.filterData.startDate = start
        this.filterData.endDate = end
      },
    },
    fetchDataParams() {
      const routeQuery = this.$route.query
      const queryData = Object.assign(routeQuery, this.pageQuery)
      const { startDate, endDate, dateType, ...filterDataWithoutDate } = this.filterData
      const searchWithDate = startDate && endDate
      const searchParams = searchWithDate
        ? Object.assign(this.filterData, {
            startDate: formatRequestData(startDate),
            endDate: formatRequestData(endDate),
          })
        : filterDataWithoutDate
      return Object.assign(searchParams, queryData)
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
    drawerVisible(value){
      // console.log(value)
      if(!value){
        if(this.$route.query.type==='prepaidOrder'){
          this.$router.push({
          name: 'orders',
          query: {
            
          },
        })
        }
      }
      
    }
    // '$route.params.type'(value){
    //   this.tryToGetOrder(this.$route.params.id)
    // }
  },
  created() {
    if(this.$route.query.type==='prepaidOrder'){
      this.tryToGetOrder(this.$route.query.id)
    }
    if(this.$route.params.type==='prepaidOrder'){
      this.tryToGetOrder(this.$route.params.id)
    }
  },
  methods: {
    async handleExport() {
      if (this.tryingToExport) return
      this.tryingToExport = true
      const { fileName, csvData } = await this.$store.dispatch('prepaid/simpleExport', this.fetchDataParams)
      const csvFormatData = csvData.map((row) => Object.values(row).join(',')).join('\n')

      const blob = new Blob(['\uFEFF', csvFormatData], {
        type: 'text/csv;charset=utf-8;',
      })

      const url = window.URL.createObjectURL(blob)

      const tempLink = document.createElement('a')
      tempLink.download = fileName
      tempLink.href = url
      tempLink.click()
      window.URL.revokeObjectURL(url)
      this.tryingToExport = false
    },
    tableRowClassName({ row }) {
      const rowStatus = row.status
      const usedStatus = row.groupSize / row.usedSize
      if (rowStatus === 0) return 'order--canceled'
      if (usedStatus === 1) return 'order--used'
    },
    async tryToGetOrder(orderId) {
      try{
        this.tryingToGetOrder = true
        this.drawerOrderData = await this.$store.dispatch('prepaid/fetchOrderSingle', orderId)
        this.drawerVisible = true
      }catch{

      }finally{
        this.tryingToGetOrder = false
      }

    },
    async tryToFetchListFilter() {
      // 當篩選前不在第一頁的時候，跳回第一頁
      if (this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      const routeQuery = this.$route.query
      const queryData = Object.assign(routeQuery, this.pageQuery)

      const { startDate, endDate } = this.filterData

      const { items, total } = await this.$store.dispatch(
        'prepaid/fetchOrders',
        Object.assign(
          this.filterData,
          {
            startDate: formatRequestData(startDate),
            endDate: formatRequestData(endDate),
          },
          queryData
        )
      )

      this.loadedOrders = items
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
      const routeQuery = this.$route.query
      const queryData = Object.assign(routeQuery, this.pageQuery)

      const { startDate, endDate } = this.filterData

      const { items, total } = await this.$store.dispatch(
        'prepaid/fetchOrders',
        Object.assign(
          this.filterData,
          {
            startDate: formatRequestData(startDate),
            endDate: formatRequestData(endDate),
          },
          queryData
        )
      )

      this.loadedOrders = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
        this.currentPageLimit()
      })
    },
    clearSearchQuery() {
      this.$router.push(this.$route.path)
    },
     onCellClick(row) {

      this.tryToGetOrder(row.id)
    },
    sortChange({column, prop, order}){
      if(order){
        this.filterData.order_by = prop
        this.filterData.order = order==='ascending'?'asc':'desc'
        // this.filterData.page=1
        this.currentPage=1
        this.tryToFetchList()
      }
      // console.log(column, prop, order)
    },
    tryToSearchByInput: debounce(function(){
      // console.log(this)
      this.tryToFetchList()
    },300)
  },
}
</script>

<template>
  <div>
    <div :class="$style.btnTop" class="btn-top-space-between">
      <div class="side">
        <el-button class="is-round" type="primary" @click="$router.push({ name: 'prepaid' })"><BaseIcon  name="plus" /> 新增</el-button>
        <el-button class="is-round" plain @click="handleExport"><BaseIcon  name="file-export" /> 訂單匯出</el-button>
      </div>
      <div class="side">
        <el-input v-model.trim.lazy="filterData.search" clearable placeholder="輸入使用人姓名、手機號碼或訂單編號" @input="tryToSearchByInput">
          <BaseIcon slot="prefix" name="search" class="el-input__icon" />
        </el-input>
      </div>
    </div>
    <BaseTableSearch v-slot="{ fields }" class="isForTab" hide-action :default-value.sync="filterData" :class="$style.filter" @reset="tryToFetchList" @tryToFetchList="tryToFetchListFilter">
      <el-form-item prop="status" style="width: 130px">
        <el-select v-model="fields.status" placeholder="選擇訂單狀態" @change="tryToFetchListFilter">
          <el-option value>所有訂單狀態</el-option>
          <el-option v-for="(status, statusValue) in statusListFilter" :key="statusValue" :label="status.text" :value="statusValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="paymentMethod" style="width: 140px">
        <el-select v-model="fields.paymentMethod" placeholder="選擇付款方式" @change="tryToFetchListFilter">
          <el-option label="所有付款方式" value="All"></el-option>
          <template v-for="(label, value) in paymentMethodList">
            <el-option v-if="value !== 'Prepaid'" :key="value" :label="label" :value="value"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item prop="source" style="width: 130px">
        <el-select v-model="fields.source" placeholder="選擇訂單來源" @change="tryToFetchListFilter">
          <el-option label="所有訂單來源" value></el-option>
          <el-option v-for="(label, value) in sourceList" :key="value" :label="label" :value="value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="width: 260px">
        <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          :picker-options="pickerOptions"
          @change="tryToFetchListFilter"
        ></el-date-picker>
      </el-form-item>
    </BaseTableSearch>
    <div class="el-table-wrapper">
    <el-table
      v-loading.fullscreen.lock="tryingToGetOrder"
      element-loading-text="取得訂單資訊中"
      :data="loadedOrders"
      :default-sort="{ prop: 'created', order: 'descending' }"
      :row-class-name="tableRowClassName"
      @cell-click="onCellClick"
      @sort-change="sortChange"

    >
      <el-table-column v-slot="{ row }" prop="created_at" label="#訂單編號" min-width="160" sortable="custom" >
        <div class="Jost">{{ `#${row.orderNo}` }}</div>
        <div>{{ row.created | formatDate('dateTime') }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="狀態與來源" prop="status" min-width="120" sortable="custom">
        <BaseStateLabel :state="row.status | orderStatusFilter('color')" text>{{ row.status | orderStatusFilter('text') }}</BaseStateLabel>
        <br />
        <BaseStateLabel state="info" text>{{ row.source | orderSourceFilter }}</BaseStateLabel>
      </el-table-column>
      <el-table-column
        v-slot="{ row }"
        label="體型"
        min-width="100"


      >{{ row.sizeTitle }}</el-table-column>
      <el-table-column v-slot="{ row }" label="付款方式" prop="paymentMethod" min-width="120" sortable="custom">{{ row.paymentMethod | orderPaymentMethodFilter }}</el-table-column>
      <el-table-column v-slot="{ row }" min-width="120" label="客戶資訊" >
        <div>{{ row.fullName }} {{ row.gender | genderFilter }}</div>
        <div>{{ `${row.phoneCode} ${row.phoneNumber}` }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" min-width="120" label="包月方案名稱" >
        <div>
          <b>{{ row.prepaidTitle }}</b> <br>
         剩餘：{{ row.times - row.used }} / {{ row.times }}
           <div v-if="row.status === 1">到期：{{row.expiredDate ? row.expiredDate : '' | formatDate}}{{row.expiredDate ? '' : '無使用期限' }}</div>
        </div>
        <div>{{ row.date | formatDate }} {{ row.time }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" min-width="80" label="金額" prop="total" >
     {{row.total}}
      </el-table-column>
      <el-table-column min-width="40">
        <el-tooltip content="查看訂單詳情" placement="top">
          <el-button type="text">
            <BaseIcon name="ellipsis-v" />
          </el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    </div>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'">
      <!-- header -->
      <PortalTarget slot="title" name="drawer-prepaid-header"></PortalTarget>
      <OrderDetail ref="orderDetail" :drawer-visible-detail="drawerVisible" :default-value.sync="drawerOrderData" @update="tryToFetchList" />
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
:global {
  :local(.filter) {
    & > div {
      flex-wrap: wrap;
      .el-form-item {
        width: 22%;

        @include max-sm {
          width: 100% !important;
        }
      }
      & + button {
        align-self: baseline;
      }
    }
  }
}
.btnTop {
  @include max-sm {
    display: flex;
    flex-direction: column;
  }

  :global {
    .side {
      @include max-sm {
        display: flex;
        // flex-direction: column;
      }

      &:first-child {
        @include max-sm {
          margin-bottom: 0.5rem;
          .el-button {
            flex: 1 0 0;
            width: 50%;
          }
        }
      }

      .el-input {
        @include max-sm {
          margin-left: 0 !important;
          width: 100%;
        }
      }
    }
  }
}
</style>
