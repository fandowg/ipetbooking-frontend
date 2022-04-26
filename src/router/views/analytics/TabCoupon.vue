
<script>
import lazyLoadComponent from '@router/lazyload-component'

import pageMixin from '@src/mixins/pagination'
import formatDate, { formatDateRange,formatRequestData } from '@utils/format-date'
import { defaultStatusFilter, numberUnitFilter } from '@utils/filter-value-to-text'

// import { inComeData } from './fakeData'

export default {
  page: {
    title: '數據分析',
    meta: [{ name: 'description', content: 'Customer Analytics' }],
  },
   filters: {
    defaultStatusFilter,
    numberUnitFilter,
    formatDateRange
  },
  components: {
     BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  mixins: [pageMixin],
  props: {
    merchantProducts: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filterData: {
        startDate: '',
        endDate: '',
        unit: 'week',
       
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              // console.log(this.$moment)
              const end = new Date()
              const start = new Date()
              // start.setTime(start.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', [start, end])
            },
          },
          {
            text: '過去7日',
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
            text: '最近一年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            },
          },
    
        ],
      },
  
      coupons: {},
      dateRangeMode: 'month',
      dateNow:'',
      activeCellData: '',
      tryingFetch: false,
      tryingFetchTime: false,
      tryingToExport:false
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
      const { startDate, endDate, ...filterDataWithoutDate } = this.filterData
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
    filterDateRange(value) {
       if (this.filterDateRange[0] === undefined) {
          this.dateRangeMode = ''
          return
        }
        const time = (new Date(this.filterDateRange[1]).getTime() / 1000 - new Date(this.filterDateRange[0]).getTime() / 1000) / 86400
        const todayRange = Math.floor(new Date().getTime() / 1000 / 86400) - new Date(this.filterDateRange[0]).getTime() / 1000 / 86400
        // console.log(time)
        switch (true) {
          case time >= 0 && time <= 7:
            this.dateRangeMode = 'day'
            this.filterData.unit = 'day'
            break
          case time > 7 && time < 30:
            this.dateRangeMode = 'week'
            this.filterData.unit = 'day'
            break
          case time >= 30 && time < 364:
            this.dateRangeMode = 'month'
            this.filterData.unit = 'week'
            break
          case time >= 365:
            this.dateRangeMode = 'year'
            this.filterData.unit = 'quarter'
            break
        }
        switch (true) {
          case todayRange === 0:
            this.dateNow = 'day'
            break
          case todayRange === 30:
            this.dateNow = 'month'
            break
          default:
            this.dateNow = ''
        }
    },
    // 'filterData.unit': function () {
    //   this.tryToFetchListUnit()
    // },
  },
  created() {
    this.getDefaultDate()
    this.tryToFetchList()
  },
  methods: {
    getDefaultDate() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      this.filterData.startDate = `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`
      this.filterData.endDate = `${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`
      // console.log(this.filterData.startDate)
      // console.log(start.getMonth()+1,end.getMonth()+1)
    },
    async tryToFetchList(isChangeTime) {

      this.tryingFetch = true
      this.tryingFetchTime = true
      this.coupons = await this.$store.dispatch('analytics/fetchCoupon', this.fetchDataParams)
      this.tryingFetch = false
      this.tryingFetchTime = false
      
      // this.visibleDetail = true
      // this.tryingFetchDetail = false
    },
    async tryToFetchListUnit() {
      this.tryingFetchTime = true
      this.coupons = await this.$store.dispatch('analytics/fetchCoupon', this.fetchDataParams)
      this.tryingFetchTime = false
    },
    reset() {
      // this.filterDateRange = []
      this.getDefaultDate()
      this.dateRangeMode = 'month'
      this.filterData.unit = 'week'
      this.tryToFetchList()
    },

    changeCellClass(row, column, rowIndex, columnIndex) {
      // console.log(row.column)
      if (row.column.label === this.activeCellData) {
        return 'active'
      } else {
        return ''
      }
    },
     async handleExport() {
      if (this.tryingToExport) return
      this.tryingToExport = true
      const request ={
        analyticsType:'coupon',
        submitData:{
          ...this.fetchDataParams,
          export:1
        }
      }
      const { fileName, csvData } = await this.$store.dispatch('analytics/analyticsExport', request)
      // csvData[0].date='1\r2'
      const csvFormatData = csvData.map((row) => Object.values(row).join(',')).join('\n')
      // csvFormatData[0].date='1\n2'
      // console.log(csvFormatData)
      const blob = new Blob(['\uFEFF', csvFormatData], {
        type: 'text/csv;charset=utf-8;',
      })

      const url = window.URL.createObjectURL(blob)
      const date = `${this.filterDateRange[0]} 至 ${this.filterDateRange[1]}`
      
      const filterFileName = `${fileName}( ${date} ).csv`
      const tempLink = document.createElement('a')
      tempLink.download = filterFileName
      tempLink.href = url
      tempLink.click()
      window.URL.revokeObjectURL(url)
      this.tryingToExport = false
    },
    quickSelectTime(unit){
      if(unit==='day'){
        const end = new Date()
        const start = new Date()
        this.filterDateRange=[start,end]
      }
      if(unit==='month'){
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        this.filterDateRange=[start,end]
      }
      this.tryToFetchList()
    }
  },
}
</script>

<template>
  <div>
    <div class="btn-top-space-between" style="justify-content: space-between">
      <div>
       <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          :picker-options="pickerOptions"
          style="width:405px"
          :clearable="false"
          @change="tryToFetchList"
        ></el-date-picker>
        <el-button class="is-round" style="margin-left:10px" :class="{ 'isActive': dateNow === 'day' }" @click="quickSelectTime('day')">
          今日
        </el-button>
        <el-button class="is-round" :class="{ 'isActive': dateNow === 'month' }" @click="quickSelectTime('month')">
          最近一個月
        </el-button>
      </div>
      <el-button  class="is-round" plain @click="handleExport"><BaseIcon name="file-export" /> 數據匯出</el-button>
    </div>
    <BaseTableSearch v-slot="{ fields }" hide-action :default-value.sync="filterData" class="isForTab" @reset="reset" @tryToFetchList="tryToFetchList">

    </BaseTableSearch>
    <div v-loading="tryingFetch" class="infoBox infoBox noCursor">
      <div class="infoBox__item" >
        <div class="infoBox__title"> 折扣訂單數 </div>
        <div class="infoBox__content"> {{ coupons.ordersCount }} </div>
      </div>
      <div class="infoBox__item" >
        <div class="infoBox__title"> 折扣金額 </div>
        <div class="infoBox__content"> ${{ coupons.discountTotal }} </div>
      </div>
    
   
    </div>
    <!-- <div class="right-radio">
      <el-radio-group v-model="filterData.unit">
        <el-radio-button label="day" :disabled="dateRangeMode === 'year' || dateRangeMode === 'month'">日</el-radio-button>
        <el-radio-button label="week" :disabled="dateRangeMode === 'year' || dateRangeMode === 'day'">週</el-radio-button>
        <el-radio-button label="month" :disabled="dateRangeMode === 'week' || dateRangeMode === 'day'">月</el-radio-button>
        <el-radio-button label="quarter" :disabled="dateRangeMode !== 'year' && dateRangeMode !== ''">季</el-radio-button>
        <el-radio-button label="year" :disabled="dateRangeMode !== 'year' && dateRangeMode !== ''">年</el-radio-button>
      </el-radio-group>
    </div> -->
    <div class="el-table-wrapper">
      <el-table
        v-loading="tryingFetchTime"
        element-loading-text="取得資訊中"
        :data="coupons.table"
        :cell-class-name="changeCellClass"
        :header-cell-class-name="changeCellClass"
      >
        <el-table-column v-slot="{ row }" label="優惠券名稱／代號" min-width="150">
          <b>{{ row.title }}</b>
          <div>{{ row.code }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="已使用訂單數" min-width="150" align="right">{{row.ordersCount}}</el-table-column>
        <el-table-column v-slot="{ row }" label="累積折扣金額" min-width="120" align="right"> ${{row.discountTotal}} </el-table-column>

        <el-table-column v-slot="{ row }" label="開放狀態" min-width="110" align="right">
          <BaseStateLabel :state="row.state | defaultStatusFilter('color')" text>{{ row.state | defaultStatusFilter('text') }}</BaseStateLabel>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="建立時間/過期時間" min-width="220" align="right">
          <div>{{ row.startDate | formatDateRange(row.endDate) }}</div>
        </el-table-column>
       
        <el-table-column v-slot="{ row }" label="發放總張數" min-width="100" align="right">{{ `${row.infinity === 1 ? '無上限' : `${row.limit}張`}` }}</el-table-column>
         <el-table-column v-slot="{ row }" label="折扣" min-width="100" align="right">-{{ row.discount }}{{ row.type | numberUnitFilter }}</el-table-column>

       
      </el-table>

    </div>

  </div>
</template>
<style lang="scss" module>
.bottomInfo {
  text-align: center;
  padding: 30px 0;
  :global {
    .bottomInfo {
      &__item {
        padding: 0 10px;
      }
    }
  }
}
</style>
