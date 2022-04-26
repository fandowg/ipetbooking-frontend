<script>
import lazyLoadComponent from '@router/lazyload-component'

import pageMixin from '@src/mixins/pagination'
import formatDate, { formatRequestData } from '@utils/format-date'
// import { sellData } from './fakeData'

export default {
  page: {
    title: '銷售',
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
        type: 'order',
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
      // sellData,
      // activeFilter: 'filterDay',
      sales: {},
      dateRangeMode: 'month',
      dateNow:'',
      activeCellData: '',
      showMode: 'total',
      pageNum: 0,
      tryingFetch: false,
      tryingFetchTime: false,
      showSum:true,
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
    showMode(){
      this.showSum=false
      this.$nextTick(()=>{
        this.showSum=true
      })
    },
    'filterData.unit': function () {
      // this.tryToFetchListUnit()
      this.pageNum = 0
    },
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
      // this.tryingFetchDetail = true
      // if (isChangeTime) {
       
      // }
      this.tryingFetch = true
      this.tryingFetchTime = true
      this.sales = await this.$store.dispatch('analytics/fetchSales', this.fetchDataParams)

      // this.sales = items
      this.tryingFetch = false
      this.tryingFetchTime = false
      this.pageNum = 0

      // this.visibleDetail = true
      // this.tryingFetchDetail = false
    },
    async tryToFetchListUnit() {
      this.tryingFetchTime = true
      this.sales = await this.$store.dispatch('analytics/fetchSales', this.fetchDataParams)
      this.tryingFetchTime = false
      this.pageNum = 0
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
     getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        // console.log(456)
        // console.log(columns, data)
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '訂單加總';
            return;
          }
          // console.log(index)
          // console.log(data[0].items[this.pageNum].items[index])
          const values = data.map(item => Number(item.items[this.pageNum].items[index-1][this.showMode]));

          // console.log(values)
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index]=this.showMode==='total'?'$'+sums[index]:sums[index];
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      },
    deleteYear(item) {
      const year = new Date().getFullYear()
      // console.log(year)
      if(this.filterData.unit==='quarter' || this.filterData.unit==='month'){
        return item
      }else{
        const reg = new RegExp(`${year}-`, 'g')
        const regSpace = new RegExp('-', 'g')
        item = item.replace(reg, '')
        item = item.replace(regSpace, '/')
        return item
      }
    },
    async handleExport() {
      if (this.tryingToExport) return
      this.tryingToExport = true
      const request ={
        analyticsType:'sales',
        submitData:{
          ...this.fetchDataParams,
          export:1,
          count:this.showMode === 'orders' ? 1 : 0

        }
      }
      const { fileName, csvData } = await this.$store.dispatch('analytics/analyticsExport', request)
      const csvFormatData = csvData.map((row) => Object.values(row).join(',')).join('\n')
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
    <BaseTableSearch v-slot="{ fields }" class="isForTab" :default-value.sync="filterData" hide-action @reset="reset" @handleExport="handleExport" @tryToFetchList="tryToFetchList">
      <el-form-item prop="status">
        <el-select v-model="fields.productId" placeholder="分店" @change="tryToFetchList">
          <el-option label="全部分店" value></el-option>
          <el-option v-for="(product, index) in merchantProducts" :key="index" :label="product.name" :value="product.id"></el-option>
        </el-select>
      </el-form-item>

    </BaseTableSearch>
    <div v-if="sales[0]" v-loading="tryingFetch" class="infoBox noCursor">
      <div class="infoBox__item">
        <div class="infoBox__title"> 服務 </div>
        <div class="infoBox__content"> ${{ sales[0].total }} </div>
      </div>
      <div class="infoBox__item">
        <div class="infoBox__title"> 加購 </div>
        <div class="infoBox__content"> ${{ sales[1].total }} </div>
      </div>
      <div class="infoBox__item">
        <div class="infoBox__title"> 包月方案 </div>
        <div class="infoBox__content"> ${{ sales[2].total }} </div>
      </div>
      <div class="infoBox__item">
        <div class="infoBox__title"> 銷售總額 </div>
        <div class="infoBox__content"> ${{ sales[0].total + sales[1].total + sales[2].total }} </div>
      </div>
    </div>
    <div class="right-radio">
      <div class="right-radio">
        <el-radio-group v-model="filterData.unit" @change="tryToFetchListUnit">
          <el-radio-button label="day" :disabled="dateRangeMode === 'year' || dateRangeMode === 'month'">日</el-radio-button>
          <el-radio-button label="week" :disabled="dateRangeMode === 'year' || dateRangeMode === 'day'">週</el-radio-button>
          <el-radio-button label="month" :disabled="dateRangeMode === 'week' || dateRangeMode === 'day'">月</el-radio-button>

          <el-radio-button label="quarter" :disabled="dateRangeMode !== 'year' && dateRangeMode !== ''">季</el-radio-button>
          <el-radio-button label="year" :disabled="dateRangeMode !== 'year' && dateRangeMode !== ''">年</el-radio-button>
        </el-radio-group>
      </div>

      <el-radio-group v-model="showMode" style="margin-left: 30px">
        <el-radio-button label="total">顯示金額</el-radio-button>
        <el-radio-button label="orders">顯示數量</el-radio-button>
      </el-radio-group>
    </div>
    <div v-if="sales[0]">
      <div v-if="filterData.unit !== 'filterSeason' && filterData.unit !== 'filterYear'" class="timeSelect">
        <div class="timeSelect__arrow" :class="{ disabled: pageNum === 0 }" @click="pageNum--">
          <BaseIcon name="angle-left" />
        </div>
        <div class="timeSelect__item isActive">
          {{ sales[0].items[pageNum].title }}
        </div>
        <div class="timeSelect__arrow" :class="{ disabled: pageNum + 1 >= sales[0].items.length }" @click="pageNum++">
          <BaseIcon name="angle-right" />
        </div>
      </div>
    </div>
    <div v-if="sales[0]" class="el-table-wrapper">
      <el-table ref="table" v-loading="tryingFetchTime" element-loading-text="取得資訊中" :data="sales" :summary-method="getSummaries" :show-summary="showSum">
        <el-table-column label="訂單類型" min-width="80">
          <template slot-scope="scope"> {{ scope.row.title }} </template>
        </el-table-column>
        <el-table-column v-for="(item, index) in sales[0].items[pageNum].items" :key="index" prop="item.total" min-width="110" :label="deleteYear(item.date)" align="right">
          <template slot-scope="scope"><span v-if="showMode === 'total'">$</span>{{ scope.row.items[pageNum].items[index][showMode] }} </template>
        </el-table-column>
      </el-table>
      <BasePagination ref="pagination" :current-page.sync="currentPage" />
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
