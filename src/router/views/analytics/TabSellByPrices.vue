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
        type: 'service',
        petCategoryId: '',
        petSizeId: '',
        serviceId:''
      },
      categoryList: [],
      priceList:[],
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
      dateGroup: [],
      activeDate: '',
      activeDateIndex: 0,
      dateRangeMode: 'month',
      dateNow:'',
      activeCellData: '',
      showMode: 'total',
      pageNum: 0,
      tryingFetch: false,
      tryingFetchTime: false,
      showSum: true,
      tryingToExport:false
    }
  },
  computed: {
    activeSizeList() {
      let active = []
      if (this.filterData.petCategoryId) {
        active = this.categoryList.find((item) => {
          return item.id === this.filterData.petCategoryId
        }).children
      }else{
        active=[]
      }
      // console.log(active)
      return active
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
      const { startDate, endDate, ...filterDataWithoutDate } = this.filterData
      const searchWithDate = startDate && endDate
      const searchParams = searchWithDate
        ? Object.assign(this.filterData, {
            startDate: formatRequestData(startDate),
            endDate: formatRequestData(endDate),
          })
        : filterDataWithoutDate
        // console.log(this.filterData.unit,searchParams.unit,searchParams)
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
            // console.log(this.filterData.unit,this.fetchDataParams.unit)
            this.filterData.unit = 'week'
            // console.log(this.filterData.unit)
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
    showMode() {
      this.showSum = false
      this.$nextTick(() => {
        this.showSum = true
      })
    },
    'filterData.unit': function () {
      // this.tryToFetchListUnit()
      this.activeDateIndex = 0
      this.activeDate = this.dateGroup[this.activeDateIndex]
    },
    'filterData.petCategoryId': function (value) {
        this.filterData.petSizeId=""
    },
  },
  created() {
    this.getDefaultDate()
    this.tryToFetchList()
    this.tryToFetchCategory()
    this.tryToFetchPrices()
    // this.$nextTick(() => {
    //   this.$refs.pagination.updateTotal(20)
    // })
  },
  methods: {
    async tryToFetchPrices(){
      const { items } = await this.$store.dispatch('product/fetchServicePrices', {state:1})
      this.priceList = items
    },
    getDefaultDate() {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      this.filterData.startDate = `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`
      this.filterData.endDate = `${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`
      // console.log(this.filterData.startDate)
      // console.log(start.getMonth()+1,end.getMonth()+1)
    },
    async tryToFetchCategory() {
      this.categoryList = await this.$store.dispatch('product/fetchServiceCategory')
    },
    async tryToFetchList(isChangeTime) {
      this.tryingFetch = true
      this.tryingFetchTime = true
      // console.log(this.fetchDataParams.unit,this.fetchDataParams)
      this.sales = await this.$store.dispatch('analytics/fetchSales', this.fetchDataParams)
      this.dateGroup = Object.keys(this.sales)
      this.activeDateIndex = 0
      this.activeDate = this.dateGroup[this.activeDateIndex]

      // this.sales = items
      this.tryingFetch = false
      this.tryingFetchTime = false

      // this.pageNum = 0
      // this.visibleDetail = true
      // this.tryingFetchDetail = false
    },
    async tryToFetchListUnit() {
      this.tryingFetchTime = true
      this.sales = await this.$store.dispatch('analytics/fetchSales', this.fetchDataParams)
      this.tryingFetchTime = false
      this.dateGroup = Object.keys(this.sales)
      this.activeDateIndex = 0
      this.activeDate = this.dateGroup[this.activeDateIndex]
      // this.pageNum = 0
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
    changeGroup(isPlus) {
      if (isPlus) {
        this.activeDateIndex++
        this.activeDate = this.dateGroup[this.activeDateIndex]
      } else {
        this.activeDateIndex--
        this.activeDate = this.dateGroup[this.activeDateIndex]
      }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      // console.log(columns, data)
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '加總'
          return
        }
        if (index === 1) {
          sums[index] = '全部分店'
          return
        }
        // console.log(index)
        // console.log(data)
        // console.log(data[0].items[0])
        // console.log(columns, index)
        const values = data.map((item) => Number(item.items[0][index - 2][this.showMode]))

        // console.log(values)
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index] = this.showMode === 'total' ? '$' + sums[index] : sums[index]
        } else {
          sums[index] = 'N/A'
        }
      })

      return sums
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
      let categoryTitle = ''
      let sizetitle=''
      

      if(this.fetchDataParams.productId){
        productTitle = this.merchantProducts.find((item)=>{
          return item.id === this.fetchDataParams.productId
        }).name
        productTitle=` ${productTitle}`
      }
      if(this.fetchDataParams.petCategoryId){
        categoryTitle = this.categoryList.find((item)=>{
          return item.id === this.fetchDataParams.petCategoryId
        }).categoryTitle
        categoryTitle=` ${categoryTitle}`
      }
      if(this.fetchDataParams.petSizeId){
        sizetitle = this.activeSizeList.find((item)=>{
          return item.id === this.fetchDataParams.petSizeId
        }).title
        sizetitle=` ${sizetitle}`
      }
      const filterFileName = `${fileName} ( ${date}${productTitle}${categoryTitle}${sizetitle} ).csv`
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
      <!-- <el-form-item>
        <el-select v-model="fields.serviceId" placeholder="服務項目" @change="tryToFetchList(false)">
          <el-option label="所有服務項目" value></el-option>
          <el-option v-for="item in priceList" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-select v-model="fields.petCategoryId" placeholder="寵物類別" @change="tryToFetchList">
          <el-option label="所有類別" value></el-option>
          <el-option v-for="item in categoryList" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select v-model="filterData.petSizeId" placeholder="寵物體型" @change="tryToFetchList">
          <el-option label="所有體型" value></el-option>
          <template v-if="fields.petCategoryId">
            
          <el-option v-for="item in activeSizeList" :key="item.id" :label="item.categoryTitle" :value="item.id"></el-option>
          </template>
        </el-select>
      </el-form-item>


    </BaseTableSearch>

    <div class="right-radio" style="padding-top: 30px">
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
    <div v-if="sales[activeDate]">
      <div v-if="filterData.unit !== 'filterSeason' && filterData.unit !== 'filterYear'" class="timeSelect">
        <div class="timeSelect__arrow" :class="{ disabled: activeDate === dateGroup[0] }" @click="changeGroup(false)">
          <BaseIcon name="angle-left" />
        </div>
        <div class="timeSelect__item isActive">
          {{ activeDate }}
        </div>
        <div class="timeSelect__arrow" :class="{ disabled: activeDate === dateGroup[dateGroup.length - 1] }" @click="changeGroup(true)">
          <BaseIcon name="angle-right" />
        </div>
      </div>
    </div>
    <div v-if="sales[activeDate]">
      <div v-if="sales[activeDate].length > 0" class="el-table-wrapper">
        <el-table v-loading="tryingFetchTime" element-loading-text="取得資訊中" :data="sales[activeDate]" :summary-method="getSummaries" :show-summary="showSum">
          <el-table-column label="服務項目/寵物" min-width="200">
            <template slot-scope="scope">
              {{ scope.row.title }}
              <!-- <br>{{scope.row.petCategory}}{{scope.row.petSizeId}} -->
            </template>
          </el-table-column>
          <el-table-column label="分店" min-width="80">
            <template slot-scope="scope"> {{ scope.row.store }} </template>
          </el-table-column>
          <el-table-column v-for="(item, index) in sales[activeDate][0].items[0]" :key="index" min-width="110" :label="deleteYear(item.date)" align="right">
            <template slot-scope="scope"><span v-if="showMode === 'total'">$</span>{{ scope.row.items[0][index][showMode] }} </template>
          </el-table-column>
        </el-table>
        <BasePagination ref="pagination" :current-page.sync="currentPage" />
      </div>
      <div v-else> <el-alert class="flex-center" title="所選擇的條件與時間內沒有相關數據" type="warning"> </el-alert></div>
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
