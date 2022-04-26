<script>
import lazyLoadComponent from '@router/lazyload-component'
import Layout from '@layouts/mainEmployee'
import { genderFilter, bookingStatusFilter, orderPaymentMethodFilter, orderSourceFilter } from '@utils/filter-value-to-text'
import formatDate, { formatRequestData } from '@utils/format-date'
import pageMixin from '@src/mixins/pagination'

export default {
  page: {
    title: '預約列表',
    meta: [{ name: 'description', content: 'Booking List' }],
  },
  components: {
    Layout,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderInfo: () => lazyLoadComponent(import('./components/OrderInfo')),
  },
  filters: {
    genderFilter,
    bookingStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
  },
  mixins: [pageMixin],
  data() {
    return {
      drawerVisible: false,
      drawerOrderData: {},
      search: '',
      filterData: {
        productId: '',
        serviceId: '',
        status: '',
        startDate: '',
        endDate: '',
        orderBy: '',
      },
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

      statusList: [],
      serviceList: [],
      productList: [],
      loadedOrders: [],
      tryingToGetOrder: false,
      filterDialogVisible: false,
      isFirst:true,
    }
  },
  computed: {
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
      return Object.assign(searchParams, { search: this.search }, queryData)
    },
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchList',
      immediate: true,
    },
  },
  created() {
    this.tryToGetOrderByQuery()
  },
  methods: {
    tryToGetOrderByQuery(){
      if (this.$route.query.type === 'order') {
        this.tryToGetOrder(this.$route.query.id)
      }
    },
    async tryToGetOrder(orderId) {
      this.tryingToGetOrder = true
      try{
        this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
        this.drawerVisible = true
      }catch{

      }finally{
        this.tryingToGetOrder = false
        
      }
      
      
    },
    async tryToFetchList() {
      const { items, total, products, services, orderStatus } = await this.$store.dispatch('schedule/fetchBookingList', this.fetchDataParams)
      this.loadedOrders = items
      if(this.isFirst){
        this.statusList = orderStatus
        this.productList = products
        this.filterServiceList(services)
        this.isFirst=false
      }
      
      

      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
    filterServiceList(list) {
      const group = {}
      list.forEach((item) => {
        if (group[item.productTitle] === undefined) group[item.productTitle] = []
        group[item.productTitle].push(item)
      })
      this.serviceList = group
    },
    tableRowClassName({ row }) {
      const rowStatus = row.status
      const usedStatus = row.groupSize / row.usedSize
      if (rowStatus === 0) return 'order--canceled'
      if (usedStatus === 1) return 'order--used'
    },
    onRowClick(row) {
      if (this.isMobile) this.tryToGetOrder(row.id)
    },
    onSortChange({ order }) {
      this.filterData.orderBy = order === null ? '' : order === 'ascending' ? 'asc' : 'desc'
      this.tryToFetchList()
    },
    resetList(){
      this.tryToFetchList()
      this.filterDialogVisible=false
    }
  },
}
</script>

<template>
  <Layout>
    <BasePageHeader :class="$style['booking-header']" :large-title="true">
      <template v-slot:title
        >預約列表</template
      >
      <template v-slot:right>
        <el-input v-model="search" class="is-round" :class="$style.search" placeholder="搜尋手機號碼" clearable @change="tryToFetchList" @clear="tryToFetchList">
          <BaseIcon slot="prefix" name="search" class="el-input__icon" />
        </el-input>
        <BaseIcon name="filter" :class="$style.filter" @click.native="filterDialogVisible = true"></BaseIcon>
      </template>
    </BasePageHeader>
    <BaseTableSearch v-slot="{ fields }" hide-action :class="$style['table-search']" :default-value.sync="filterData" :border="true" @reset="tryToFetchList">
      <el-form-item style="flex-grow:2;">
        <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          :picker-options="pickerOptions"
          @change="tryToFetchList"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="orderStatus">
        <el-select v-model="fields.status" @change="tryToFetchList">
          <el-option label="全部預約狀態" value></el-option>
          <el-option v-for="(status, value) in statusList" :key="value" :label="status.orderStatus | bookingStatusFilter('text')" :value="String(status.orderStatus)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="productId">
        <el-select v-model="fields.productId" @change="tryToFetchList">
          <el-option label="全部地點" value></el-option>
          <el-option v-for="(product, value) in productList" :key="value" :label="product.title" :value="product.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="serviceId">
        <el-select v-model="fields.serviceId" @change="tryToFetchList">
          <el-option label="全部預約項目" value></el-option>
          <el-option-group v-for="(services, productTitle) in serviceList" :key="`group-${productTitle}`" :label="productTitle">
            <el-option v-for="(service, index) in services" :key="index" :label="`${service.title}・${service.size}`" :value="service.id"> </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
    </BaseTableSearch>
    <el-table
      v-loading.fullscreen.lock="tryingToGetOrder"
      element-loading-text="取得訂單資訊中"
      class="is-dark"
      :class="$style['booking-list']"
      :data="loadedOrders"
      :default-sort="{ prop: 'created', order: 'descending' }"
      :row-class-name="tableRowClassName"
      @row-click="onRowClick"
      @sort-change="onSortChange"
    >
      <el-table-column v-slot="{ row }" label="預約日期 / 時間" width="170" sortable>
        <div class="time Jost">
          <div>
            <b>{{ row.startDate | formatDate }}</b>
          </div>
          <div> {{ row.startDate | formatDate('time') }} - {{ row.endDate | formatDate('time') }}</div>
        </div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="預約客戶 / 手機" width="150">
        <div class="name"
          ><b>{{ row.name }} {{ row.gender | genderFilter }}</b></div
        >
        <div class="phone Jost">{{ row.phoneNumber }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="預約狀態" width="120">
        <BaseStateLabel :round="true" :state="row.status | bookingStatusFilter('color')" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="預約地點 / 項目">
        <div>
          {{ row.productTitle }} <b style="margin-left: 5px;">{{ row.serviceTitle }}</b>
        </div>
        <div v-if="row.storeType === 'home'" class="address" style="font-size: 12px;">{{ row.address }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="LINE ID" >
      <span class="side visible-mobile">{{ row.phoneNumber }}</span>
      <span class="side"> 
        <template v-if="row.lineId">
          <span class="visible-mobile">LINE ID : </span> {{row.lineId}} 
        </template>
      </span>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="查看" width="130">
        <el-button class="is-fullwidth is-round is-dark" @click="tryToGetOrder(row.id)"><BaseIcon icon-style="fal" name="eye" style="font-size: 19px;"></BaseIcon></el-button>
      </el-table-column>
    </el-table>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <OrderInfo :visible.sync="drawerVisible" :order.sync="drawerOrderData" @update="tryToFetchList" />

    <el-dialog :visible.sync="filterDialogVisible" top="0" style="padding:0" center append-to-body lock-scroll fullscreen>
      <h2>篩選條件</h2>
      <BaseTableSearch v-slot="{ fields }" hide-action :class="$style['filter-mobile']" :default-value.sync="filterData" :border="true" @reset="resetList">
        <el-form-item label="日期區間">
          <el-date-picker
            v-model="filterDateRange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="起始日期"
            end-placeholder="結束日期"
            :picker-options="pickerOptions"
            :class="$style['date-range-picker']"
            :popper-class="$style['date-range-picker']"
            @change="tryToFetchList"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="預約狀態" prop="orderStatus">
          <el-select v-model="fields.status" @change="tryToFetchList">
            <el-option label="全部預約狀態" value></el-option>
            <el-option v-for="(status, value) in statusList" :key="value" :label="status.orderStatus | bookingStatusFilter('text')" :value="String(status.orderStatus)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服務地點" prop="productId">
          <el-select v-model="fields.productId" @change="tryToFetchList">
            <el-option label="全部地點" value></el-option>
            <el-option v-for="(product, value) in productList" :key="value" :label="product.title" :value="product.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="預約項目" prop="serviceId">
          <el-select v-model="fields.serviceId" @change="tryToFetchList">
            <el-option label="全部預約項目" value></el-option>
            <el-option-group v-for="(services, productTitle) in serviceList" :key="`group-${productTitle}`" :label="productTitle">
              <el-option v-for="(service, index) in services" :key="index" :label="`${service.title}・${service.size}`" :value="service.id"> </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-button class="is-round" type="primary" style="margin-top:30px" @click="filterDialogVisible = false">篩選</el-button>

      </BaseTableSearch>
    </el-dialog>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
.booking-header {
  @include pad {
    margin: 0;
  }
}
.search {
  width: 350px;
  @include pad {
    display: none;
  }
  :global {
    .el-input__inner {
      background: white;
      border-color: #c6c6ba;
    }
  }
}
.filter {
  font-size: 24px;
  display: none;
  margin: 10px;
  @include pad {
    display: inherit;
    font-size: 20px;
  }
  &:hover,
  &:focus {
    color: $color-primary;
  }
}
.table-search {
  @include pad {
    display: none;
  }
}
.filter-mobile {
  flex-direction: column;
  height: calc(100vh - 138px);
  :global {
    [class*='_base-table-search_fields'] {
      flex-direction: column;
      flex-grow: 0;
      .el-form-item {
        flex-grow: 0;
        margin-right: 0;
        .el-form-item__label {
          font-size: 18px;
        }
        & + .el-form-item {
          margin-top: 20px;
        }
      }
    }
  }
}
.booking-list {
  :global {
    @include pad {
      .el-table__header-wrapper {
        display: none;
      }
      .el-table__body {
        width: 100% !important;
        table-layout: auto;
        display: block;
        tbody{
          display: block;
        }
        .el-table__row {
          display: flex;
          flex-wrap: wrap;
          border-top: 1px solid #ebeef5;
          padding: 5px 0;
          width: 100%;
          &:last-child {
            border-bottom: 1px solid #ebeef5;
          }
          td {
            width: 100%;
            border-bottom: none;
            .cell {
              padding: 0;
              .time {
                display: flex;
                font-weight: 500;
                div + div {
                  margin-left: 10px;
                }
              }
              .name {
                font-size: 16px;
                font-weight: 500;
              }
              .phone {
                display: none;
              }
              .address {
                font-size: 14px !important;
                color: #726f65;
              }
            }
            &:nth-child(1) {
              display: flex;
              align-items: center;
              width: 70%;
              order: 1;
              padding-left: 0;
            }
            &:nth-child(2) {
              order: 3;
              padding: 0;
            }
            &:nth-child(3) {
              width: 30%;
              order: 2;
              text-align: right;
            }
            &:nth-child(4) {
              order: 4;
            }
            &:nth-child(5) {
              order: 5;
              padding-top: 0;
              .cell{
                width: 100%;
                display: flex;
                justify-content: space-between;
              }
              .side{
                display: block;
                max-width: 45%;
              }
            }
            &:nth-child(6) {
              display: none;
            }
          }
        }
      }
      .el-table__empty-block {
        width: 100% !important;
      }
    }
  }
}
.date-range-picker {
  width: 100% !important;
  :global {
    .el-picker-panel__sidebar {
      position: relative;
      display: flex;
      width: 100%;
      justify-content: space-between;
    }
    .el-picker-panel__shortcut {
      text-align: center;
      padding: 0;
      text-decoration: underline;
    }
    .el-picker-panel__body {
      margin: 0;
      min-width: auto;
      .el-picker-panel__content {
        float: none;
        width: 100%;
        padding: 0px 20px;
      }
    }
  }
}
</style>
