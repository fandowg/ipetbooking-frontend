<script>
import { isSameDay } from 'date-fns'
import formatDate, { formatRequestData } from '@utils/format-date'
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, bookingStatusFilter, orderPaymentMethodFilter, orderSourceFilter } from '@utils/filter-value-to-text'

import pageMixin from '@src/mixins/pagination'

import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/zh-hk.js'
import 'vue-cal/dist/vuecal.css'

export default {
  page: {
    title: '行事曆',
    meta: [{ name: 'description', container: 'schedule' }],
  },
  mixins: [pageMixin],
  filters: {
    genderFilter,
    bookingStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
  },
  components: {
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    CalendarItem: () => lazyLoadComponent(import('./CalendarItem')),
    OrderInfo: () => lazyLoadComponent(import('./OrderInfo')),
    VueCal,
  },
  props: {},
  data() {
    return {
      selectedDate: new Date(),
      loadedOrders: [],
      tryingToGetOrder: false,
      tryingToFetchList: false,
      drawerOrderData: {},
      drawerVisible: false,
      orderBy: '',
      calendarEvents: [],
    }
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchList',
      immediate: true,
    },
  },
  computed: {
    fetchDataParams() {
      const routeQuery = this.$route.query
      const queryData = Object.assign(routeQuery, this.pageQuery)
      return Object.assign(
        {
          startDate: formatRequestData(this.selectedDate),
          endDate: formatRequestData(this.selectedDate),
          orderBy: this.orderBy,
        },
        queryData
      )
    },
    selectedDateString() {
      return this.selectedDate.format()
    },
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
  },
  created() {
    let timeout = setInterval(() => {
      if (this.$refs['sm-cal'] !== undefined) {
        clearInterval(timeout)
        this.tryToFetchCurrentMonthly()
      }
    }, 300)
  },
  methods: {
    async tryToFetchList() {
      this.tryingToFetchList = true
      const { items, total } = await this.$store.dispatch('schedule/fetchBookingList', this.fetchDataParams)

      this.loadedOrders = items
      this.tryingToFetchList = false
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
    async tryToGetOrder(orderId) {
      this.tryingToGetOrder = true
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    onClickDetail(event) {
      this.tryToGetOrder(event.customInfo.orderId)
    },
    tableRowClassName({ row }) {
      const rowStatus = row.status
      const usedStatus = row.groupSize / row.usedSize
      if (rowStatus === 0) return 'order--canceled'
      if (usedStatus === 1) return 'order--used'
    },
    updateSelectedDate(date) {
      this.selectedDate = date
      this.tryToFetchList()
    },
    formatBookingDate(date) {
      return isSameDay(new Date(date), new Date()) ? '今天' : formatDate(date)
    },
    onCellFocus(date) {
      this.updateSelectedDate(date)
    },
    onSortChange({ order }) {
      this.orderBy = order === null ? '' : order === 'ascending' ? 'asc' : 'desc'
      this.tryToFetchList()
    },
    async tryToFetchMonthly(date) {
      const list = await this.$store.dispatch('schedule/fetchMonthly', { ...date })
      this.calendarEvents = list.map((item) => ({
        start: item.date,
        end: item.date,
        customInfo: {
          ...item,
        },
      }))
    },
    tryToFetchCurrentMonthly() {
      const startDate = formatRequestData(this.$refs['sm-cal'].view.startDate)
      const endDate = formatRequestData(this.$refs['sm-cal'].view.endDate)
      this.tryToFetchMonthly({ startDate, endDate })
    },
    onViewChange(viewInfo) {
      if (viewInfo.view !== 'month') return
      this.tryToFetchMonthly({
        startDate: formatRequestData(viewInfo.startDate),
        endDate: formatRequestData(viewInfo.endDate),
      })
    },
    customCellClass(events) {
      if (events.length === 0) return ''
      return events[0].customInfo.isOpen ? 'is-available' : 'is-unscheduled'
    },
  },
}
</script>

<template>
  <div v-loading.fullscreen.lock="tryingToGetOrder" element-loading-text="取得訂單資訊中">
    <el-row :gutter="isMobile ? 0 : 10">
      <el-col :span="17" :xs="24">
        <el-table
          v-loading="tryingToFetchList"
          element-loading-text="取得訂單列表中"
          class="is-dark hidden-mobile"
          :data="loadedOrders"
          :default-sort="{ prop: 'created', order: 'descending' }"
          :row-class-name="tableRowClassName"
          @sort-change="onSortChange"
        >
          <el-table-column v-slot="{ row }" label="預約時間" width="130" sortable>
            <div class="time Jost">
              <div>
                <b>{{ row.startDate | formatDate }}</b>
              </div>
              <div> {{ row.startDate | formatDate('time') }} - {{ row.endDate | formatDate('time') }}</div>
            </div>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="預約客戶 / 手機" width="130">
            <div class="name"
              ><b>{{ row.name }} {{ row.gender | genderFilter }}</b></div
            >
            <div class="phone Jost">{{ row.phoneNumber }}</div>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="預約狀態" width="90">
            <BaseStateLabel :round="true" :state="row.status | bookingStatusFilter('color')" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="預約地點 / 項目">
            <div>
              {{ row.productTitle }} <b style="margin-left: 5px;">{{ row.serviceTitle }}</b>
            </div>
            <div class="address" style="font-size: 12px;">{{ row.address }}</div>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="查看" width="130">
            <el-button class="is-fullwidth is-round is-dark" @click="tryToGetOrder(row.id)"><BaseIcon iconStyle="fal" name="eye" style="font-size: 19px;"></BaseIcon></el-button>
          </el-table-column>
        </el-table>
        <VueCal
          ref="sm-cal"
          class="vuecal--date-picker visible-mobile Jost"
          xsmall="xsmall"
          hide-view-selector="hide-view-selector"
          active-view="month"
          locale="zh-hk"
          style="height: 300px"
          :class="$style['cal-mobile']"
          :events="calendarEvents"
          :selected-date="selectedDate"
          :time="false"
          :transitions="false"
          :disable-views="['week', 'day']"
          :editable-events="false"
          click-to-navigate
          @cell-focus="onCellFocus"
          @view-change="onViewChange"
        >
          <template v-slot:cell-content="{ cell, events }">
            <span class="vuecal__cell-date" :class="customCellClass(events)">{{ cell.content }}</span>
          </template>
        </VueCal>
        <div v-loading="tryingToFetchList" element-loading-text="取得訂單列表中" class="visible-mobile" :class="$style['list']">
          <div v-for="(order, index) in loadedOrders" :key="`order-${index}`" class="item" @click="tryToGetOrder(order.id)">
            <div class="header">
              <div>
                <BaseStateLabel :round="true" :state="order.status | bookingStatusFilter('color')" text>{{ order.status | bookingStatusFilter('text') }}</BaseStateLabel>
                <b style="margin-left:10px;">{{ order.name }} {{ order.gender | genderFilter }}</b>
              </div>
              <div class="time">{{ order.startDate | formatDate('time') }}</div>
            </div>
            <div class="product">
              {{ order.productTitle }} <b style="margin-left: 5px;">{{ order.serviceTitle }}</b>
            </div>
            <div class="address">{{ order.address }}</div>
          </div>
          <div v-if="loadedOrders.length === 0" style="text-align: center;padding-top:20px;">暫無資料</div>
        </div>
        <BasePagination ref="pagination" :current-page.sync="currentPage" />
      </el-col>
      <el-col class="hidden-mobile" :span="7">
        <CalendarItem :hide-status="true" @update="updateSelectedDate"></CalendarItem>
      </el-col>
    </el-row>

    <OrderInfo :visible.sync="drawerVisible" :order.sync="drawerOrderData" @update="tryToFetchList" />
  </div>
</template>
<style lang="scss">
@import '@src/design/vuecal-override.scss';
</style>
<style lang="scss" module>
@import '@design';
.list {
  padding: 20px;
  :global {
    .item {
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        font-size: 16px;
        .time {
          font-size: 14px;
          font-weight: 500;
        }
        [class*='BaseStateLabel'] {
          padding: 0px 12px;
        }
      }
      .address {
        color: #726f65;
      }
      .product,
      .address {
        line-height: 20px;
        letter-spacing: 0.7px;
      }
      & + .item {
        margin-top: 30px;
      }
    }
  }
}
.cal-mobile {
  :global {
    .vuecal__title-bar {
      height: 48px;
      padding: 0 12px;
      .vuecal__title {
        button {
          font-size: 16px;
        }
      }
    }
    .vuecal__weekdays-headings,
    .vuecal__body {
      padding: 0 10px;
      background: #fafafa;
    }
    .month-view {
      .vuecal__cell {
        font-size: 14px !important;
        .vuecal__cell-content {
          width: 30px;
          height: 30px;
          .vuecal__cell-date:before {
            height: 30px !important;
            width: 30px !important;
          }
        }
      }
    }
  }
}
</style>
