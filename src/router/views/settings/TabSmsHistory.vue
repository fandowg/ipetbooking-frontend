<script>
import {
  genderFilter,
  orderStatusFilter,
  orderPaymentMethodFilter,
  orderSourceFilter,
} from '@utils/filter-value-to-text'
import formatDate, { formatRequestData } from '@utils/format-date'

import pageMixin from '@src/mixins/pagination'

export default {
  page: {
    title: '商店設定',
    meta: [{ name: 'description', content: 'Sms History' }],
  },
  components: {},
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
      filterData: {
        phone: '',
        date: '',
        startDate: '',
        endDate: '',
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
      loadedOrders: [],
      tryingToGetOrder: false,
    }
  },
  computed: {
    fetchDataParams() {
      this.handleDateRange()

      const { startDate, endDate, ...filterDataWithoutDate } = this.filterData
      const searchWithDate = startDate && endDate
      const searchParams = searchWithDate
        ? Object.assign(
            {},
            {
              ...this.filterData,
              startDate: formatRequestData(startDate),
              endDate: formatRequestData(endDate),
            }
          )
        : filterDataWithoutDate
      delete searchParams.date
      return { ...searchParams, ...this.pageQuery }
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchList',
      immediate: true,
    },
    // 'filterData.date': {
    //   handler(value) {
    //     const [start, end] = value || ['', '']
    //     this.filterData.startDate = formatRequestData(start)
    //     this.filterData.endDate = formatRequestData(end)
    //   },
    // },
  },
  methods: {
    async tryToFetchList() {
      this.tryingToGetOrder = true
      const { items, total } = await this.$store.dispatch(
        'merchant/fetchSmsHistory',
        this.fetchDataParams
      )
      this.loadedOrders = items
      this.tryingToGetOrder = false
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
    handleDateRange() {
      const [start, end] = this.filterData.date || []
      this.filterData.startDate = formatRequestData(start)
      this.filterData.endDate = formatRequestData(end)
    },
    previewContent(templateString = '') {
      let content = templateString
      if (content === null) return ''
      content = content.replace(new RegExp(`\n`, 'g'), '<br>')
      return content
    },
  },
}
</script>

<template>
  <div>
    <BaseTableSearch
      ref="filter"
      v-slot="{ fields }"
      :default-value="filterData"
      class="p-0 mb-4"
      hide-action
      @reset="tryToFetchList"
    >
      <el-form-item prop="phone">
        <el-input
          v-model.trim.lazy="fields.phone"
          :placeholder="'輸入手機號碼'"
          @keyup.native.enter="tryToFetchList"
        >
          <BaseIcon slot="prefix" name="search" class="el-input__icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="date">
        <el-date-picker
          v-model="fields.date"
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
    </BaseTableSearch>
    <el-table
      v-loading="tryingToGetOrder"
      element-loading-text="取得簡訊紀錄"
      :data="loadedOrders"
      :default-sort="{ prop: 'created', order: 'descending' }"
    >
      <el-table-column v-slot="{ row }" label="發送時間" width="150">
        <div>{{ row.createdAt | formatDate('dateTime') }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="發送對象" width="120">
        <div>{{ row.memberName }}</div>
        <div>{{ row.phone }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="簡訊內容" min-width="330">
        <div v-html="previewContent(row.message)"></div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="寄發帳號" width="100">
        <div>{{ row.createdBy }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="簡訊用量" width="100" align="center">
        <div>{{ row.messageCount }}</div>
      </el-table-column>
    </el-table>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
  </div>
</template>
