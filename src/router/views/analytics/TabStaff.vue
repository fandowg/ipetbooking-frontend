<script>
import lazyLoadComponent from '@router/lazyload-component'

import pageMixin from '@src/mixins/pagination'
import formatDate, { formatRequestData } from '@utils/format-date'
import { defaultStatusFilter, numberUnitFilter } from '@utils/filter-value-to-text'
import { merchantUserComputed } from '@state/helpers'
import { debounce } from 'lodash'
// import { inComeData } from './fakeData'

export default {
  page: {
    title: '數據分析',
    meta: [{ name: 'description', content: 'Customer Analytics' }],
  },
  filters: {
    defaultStatusFilter,
    numberUnitFilter,
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
        jobTitle: '',
        userGroupId: '',
        scheduleItemName: '',
        block: null,
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

      staffs: [],
      // userGroups:[],
      dateRangeMode: 'month',
      dateNow:'',
      activeCellData: '',
      tryingFetch: false,
      tryingFetchTime: false,
      tryingToExport: false,
    }
  },
  computed: {
    // ...authComputed,
    ...merchantUserComputed,
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
    this.$store.dispatch('merchant/fetchUserGroups')
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
      if (this.filterDateRange[0] === undefined) {
        this.dateRangeMode = ''
      }
      this.tryingFetch = true
      this.tryingFetchTime = true
      this.staffs = await this.$store.dispatch('analytics/fetchScheduleItem', this.fetchDataParams)
      this.tryingFetch = false
      this.tryingFetchTime = false
    },
    async tryToFetchListUnit() {
      this.tryingFetchTime = true
      this.staffs = await this.$store.dispatch('analytics/fetchScheduleItem', this.fetchDataParams)
      this.tryingFetchTime = false
    },
    reset() {
      // this.filterDateRange = []
      // this.dateRangeMode = 'month'
      // this.filterData.unit = 'week'
      this.getDefaultDate()
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
      const request = {
        analyticsType: 'scheduleItem',
        submitData: {
          ...this.fetchDataParams,
          export: 1,
        },
      }
      const { fileName, csvData } = await this.$store.dispatch('analytics/analyticsExport', request)
      const csvFormatData = csvData.map((row) => Object.values(row).join(',')).join('\n')
      const blob = new Blob(['\uFEFF', csvFormatData], {
        type: 'text/csv;charset=utf-8;',
      })

      const url = window.URL.createObjectURL(blob)
      const date = `${this.filterDateRange[0]} 至 ${this.filterDateRange[1]}`
      let jobTitle = ''
      let userGroupTitle = ''
      let statustitle = ''
      let scheduleItemName = ''

      if (this.fetchDataParams.jobTitle) {
        jobTitle = ` ${this.fetchDataParams.jobTitle}`
      }
      if (this.fetchDataParams.userGroupId) {
        userGroupTitle = this.userGroupList.find((item) => {
          return item.id === this.fetchDataParams.userGroupId
        }).title
        userGroupTitle = ` ${userGroupTitle}`
      }
      if (this.fetchDataParams.block !== null) {
        statustitle = this.fetchDataParams.block === 0 ? '啟用' : '停權'
        statustitle = ` 狀態：${statustitle}`
      }
      if (this.fetchDataParams.scheduleItemName) {
        scheduleItemName = ` ${this.fetchDataParams.scheduleItemName}`
      }
      const filterFileName = `${fileName} ( ${date}${jobTitle}${userGroupTitle}${statustitle}${scheduleItemName} ).csv`
      const tempLink = document.createElement('a')
      tempLink.download = filterFileName
      tempLink.href = url
      tempLink.click()
      window.URL.revokeObjectURL(url)
      this.tryingToExport = false
    },
    tryToSearchByInput: debounce(function () {
      // console.log(this)
      this.tryToFetchList()
    }, 300),
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
      <el-form-item>
        <el-select v-model="fields.jobTitle" placeholder="職稱" @change="tryToFetchList">
          <el-option label="全部職稱" value=""></el-option>
          <el-option label="美容師" value="美容師"></el-option>
          <el-option label="排班人員" value="排班人員"></el-option>
          <el-option label="助理" value="助理"></el-option>
          <el-option label="櫃台人員" value="櫃台人員"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="userGroupList.length > 0">
        <el-select v-model="fields.userGroupId" placeholder="帳號權限" @change="tryToFetchList">
          <el-option label="所有權限" value></el-option>
          <el-option v-for="item in userGroupList" :key="item.id" :value="item.id" :label="item.title"></el-option>
          <!-- <el-option :key="0" :label="'全部權限'" :value="0"></el-option>
          <el-option :key="1" :label="'商店擁有者'" :value="1"></el-option>
          <el-option :key="2" :label="'商店管理'" :value="2"></el-option>
          <el-option :key="3" :label="'訂單操作'" :value="3"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="fields.block" placeholder="狀態" @change="tryToFetchList">
          <el-option :label="'全部狀態'" :value="null"></el-option>
          <el-option :label="'啟用'" :value="0"></el-option>
          <el-option :label="'停權'" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          align="left"
          unlink-panels
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          :clearable="false"
          :picker-options="pickerOptions"
     
        ></el-date-picker>
        <div class="fix-small-btn">
          <el-button type="text" :class="{ 'selected': dateNow === 'day' }" @click="quickSelectTime('day')">
            <span>今日
            </span>
          </el-button>
          <el-button type="text" :class="{ 'selected': dateNow === 'month' }" @click="quickSelectTime('month')">
            <span>最近一個月</span>
          </el-button>
        </div>
      </el-form-item> -->
    </BaseTableSearch>
    <div class="btn-top-box right">
      <el-input v-model.trim.lazy="filterData.scheduleItemName" clearable placeholder="搜尋服務人員" @input="tryToSearchByInput">
        <BaseIcon slot="prefix" name="search" class="el-input__icon" />
      </el-input>
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
      <el-table v-loading="tryingFetchTime" element-loading-text="取得資訊中" :data="staffs" :cell-class-name="changeCellClass" :header-cell-class-name="changeCellClass">
        <el-table-column v-slot="{ row }" label="姓名" min-width="100">
          <div>{{ row.name }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="職稱" min-width="100">
          {{ row.title }}
        </el-table-column>
        <el-table-column v-slot="{ row }" label="權限" min-width="100">{{ row.userGroupsTitle.join(', ') }} </el-table-column>
        <el-table-column v-slot="{ row }" label="狀態" min-width="80" align="center">
          {{ row.block === 0 ? '啟用' : '停權' }}
        </el-table-column>
        <el-table-column label="接單數量" align="right" min-width="100" prop="ordersCount" sortable> </el-table-column>
        <el-table-column v-slot="{ row }" label="訂單累計金額" align="right" min-width="130" sortable>
          美容師 {{ row.actualTotal }} <br />
          助理 {{ row.helperActualTotal }}
        </el-table-column>
        <el-table-column v-slot="{ row }" label="接單累計金額" align="right" min-width="130" prop="actualTotal" sortable>
          美容師 {{ row.ordersTotal }} <br />
          助理 {{ row.helperOrdersTotal }}
        </el-table-column>
        <el-table-column label="排班時數" min-width="100" align="right" prop="scheduleTotalHours" sortable></el-table-column>
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
