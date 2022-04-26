<script>
import lazyLoadComponent from '@router/lazyload-component'

import pageMixin from '@src/mixins/pagination'
import formatDate, { formatRequestData } from '@utils/format-date'

// import { inComeData } from './fakeData'

export default {
  page: {
    title: '數據分析',
    meta: [{ name: 'description', content: 'Customer Analytics' }],
  },
  components: {},
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
        productId: '',
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
          // {
          //   text: '最近三個月',
          //   onClick(picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          //     picker.$emit('pick', [start, end])
          //   },
          // },
        ],
      },
      // inComeData,
      income: {},
      // sellData,
      // activeFilter: 'week',
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
    // activeFilter(val) {
    //   this.filterData.unit = val
    // },
    // 'filterData.unit': function () {
    //   this.tryToFetchListUnit()
    // },
  },
  created() {
    this.getDefaultDate()
    this.tryToFetchList()
    // this.$nextTick(() => {
    //   this.$refs.pagination.updateTotal(20)
    // })
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
      // if (isChangeTime) {
      // }
      this.tryingFetch = true
      this.tryingFetchTime = true
      this.income = await this.$store.dispatch('analytics/fetchIncome', this.fetchDataParams)
      this.tryingFetch = false
      this.tryingFetchTime = false
    },
    async tryToFetchListUnit() {
      this.tryingFetchTime = true
      this.income = await this.$store.dispatch('analytics/fetchIncome', this.fetchDataParams)
      this.tryingFetchTime = false
    },
    changeMode(valve) {
      // console.log(456)
      this.dateRangeMode = valve
    },
    reset() {
      // this.filterDateRange = []
      this.getDefaultDate()
      this.dateRangeMode = 'month'
      this.filterData.unit = 'week'
      this.tryToFetchList()
    },
    selectData(value) {
      this.activeCellData = value
      this.changeCellClass()
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
        analyticsType:'income',
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
      let productTitle=''
      if(this.fetchDataParams.productId){
        productTitle = this.merchantProducts.find((item)=>{
          return item.id === this.fetchDataParams.productId
        }).name
        productTitle=` ${productTitle}`
      }
      const filterFileName = `${fileName} ( ${date}${productTitle} ).csv`
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
    <BaseTableSearch v-slot="{ fields }"  :default-value.sync="filterData" hide-action class="isForTab" @reset="reset" @handleExport="handleExport" @tryToFetchList="tryToFetchList">
      <el-form-item prop="status">
        <el-select v-model="fields.productId" placeholder="分店" @change="tryToFetchList">
          <el-option label="全部分店" value></el-option>
          <el-option v-for="(product, index) in merchantProducts" :key="index" :label="product.name" :value="product.id"></el-option>
        </el-select>
      </el-form-item>

 
    </BaseTableSearch>
    <div v-loading="tryingFetch" class="infoBox">
      <div class="infoBox__item" :class="{ isActive: activeCellData === '銷售總額' }" @click="selectData('銷售總額')">
        <div class="infoBox__title"> 銷售總額 </div>
        <div class="infoBox__content"> ${{ income.salesFigures }} </div>
      </div>
      <div class="infoBox__item" :class="{ isActive: activeCellData === '退款' }" @click="selectData('退款')">
        <div class="infoBox__title"> 退款 </div>
        <div class="infoBox__content"> ${{ income.refundTotal }} </div>
      </div>
      <div class="infoBox__item" :class="{ isActive: activeCellData === '優惠券' }" @click="selectData('優惠券')">
        <div class="infoBox__title"> 優惠券 </div>
        <div class="infoBox__content"> ${{ income.couponTotal }} </div>
      </div>
      <div class="infoBox__item" :class="{ isActive: activeCellData === '銷售淨額' }" @click="selectData('銷售淨額')">
        <div class="infoBox__title"> 銷售淨額 </div>
        <div class="infoBox__content"> ${{ income.netSales }} </div>
      </div>
      <div class="infoBox__item" :class="{ isActive: activeCellData === '稅金' }" @click="selectData('稅金')">
        <div class="infoBox__title"> 稅金 </div>
        <div class="infoBox__content"> ${{ income.taxTotal }} </div>
      </div>
      <div class="infoBox__item" :class="{ isActive: activeCellData === '稅後淨額' }" @click="selectData('稅後淨額')">
        <div class="infoBox__title"> 稅後淨額 </div>
        <div class="infoBox__content"> ${{ income.niat }} </div>
      </div>
      <div class="infoBox__item" :class="{ isActive: activeCellData === '平均訂單銷售淨額' }" @click="selectData('平均訂單銷售淨額')">
        <div class="infoBox__title">
          平均訂單銷售淨額 <el-tooltip content="平均訂單銷售淨額 = 銷售淨額 / 訂單數" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip
        ></div>
        <div class="infoBox__content"> ${{ income.avgOrderPrice }} </div>
      </div>
      <div class="infoBox__item" :class="{ isActive: activeCellData === '訂單數' }" @click="selectData('訂單數')">
        <div class="infoBox__title"> 平均訂單數 </div>
        <div class="infoBox__content">
          {{ income.avgOrderCount }}
        </div>
      </div>
    </div>
    <div class="right-radio">
      <el-radio-group v-model="filterData.unit" @change="tryToFetchListUnit">
        <el-radio-button label="day" :disabled="dateRangeMode === 'year' || dateRangeMode === 'month'">日</el-radio-button>
        <el-radio-button label="week" :disabled="dateRangeMode === 'year' || dateRangeMode === 'day'">週</el-radio-button>
        <el-radio-button label="month" :disabled="dateRangeMode === 'week' || dateRangeMode === 'day'">月</el-radio-button>
        <!-- <el-radio-button label="filterMonth" :disabled="activeFilter === 'filterDay'">月</el-radio-button> -->
        <el-radio-button label="quarter" :disabled="dateRangeMode !== 'year' && dateRangeMode !== ''">季</el-radio-button>
        <el-radio-button label="year" :disabled="dateRangeMode !== 'year' && dateRangeMode !== ''">年</el-radio-button>
      </el-radio-group>
    </div>
    <div class="el-table-wrapper">
      <el-table
        v-loading="tryingFetchTime"
        show-summary
        sum-text="總計"
        element-loading-text="取得資訊中"
        :data="income.table"
        :cell-class-name="changeCellClass"
        :header-cell-class-name="changeCellClass"
      >
        <el-table-column label="日期" prop="date" width="200"></el-table-column>
        <el-table-column label="訂單數" prop="ordersCount" align="right" min-width="80"> </el-table-column>
        <el-table-column label="銷售總額" prop="salesFigures" align="right" min-width="100">
          <template slot="header">
            銷售總額 <el-tooltip content="計算已付款和未付款訂單的售價金額。金額含稅、不含退款＆優惠" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip>
          </template>
          <template slot-scope="scope"> ${{ scope.row.salesFigures }} </template>
        </el-table-column>
        <el-table-column prop="refundTotal" label="退款" align="right" min-width="100">
          <template slot="header">退款</template>
          <template slot-scope="scope"> ${{ scope.row.refundTotal }} </template>
        </el-table-column>
        <el-table-column prop="couponTotal" label="優惠券" align="right" min-width="100">
          <template slot="header">優惠券</template>
          <template slot-scope="scope"> ${{ scope.row.couponTotal }} </template>
        </el-table-column>
        <el-table-column prop="netSales" label="銷售淨額" align="right" min-width="100">
          <template slot="header">
            銷售淨額
            <el-tooltip
              content="扣掉退款、優惠後，即是現在訂單列表上的總金額。
銷售淨額 = 銷售總額 - 退款 - 優惠券金額"
              placement="right"
            >
              <BaseIcon name="info-circle" />
            </el-tooltip>
          </template>
          <template slot-scope="scope"> ${{ scope.row.netSales }} </template>
        </el-table-column>
        <el-table-column prop="taxTotal" label="稅金" align="right" min-width="100">
          <template slot="header"
            >稅金5% <el-tooltip content="稅金= 銷售淨額 x 5%" placement="right"><BaseIcon name="info-circle" /> </el-tooltip
          ></template>
          <template slot-scope="scope"> ${{ scope.row.taxTotal }} </template>
        </el-table-column>
        <el-table-column prop="niat" label="稅後淨額" align="right" min-width="100">
          <template slot="header"
            >稅後淨額<el-tooltip content="稅後淨額 = 銷售淨額 - 稅金" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip
          ></template>
          <template slot-scope="scope"> ${{ scope.row.niat }} </template>
        </el-table-column>
     
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
