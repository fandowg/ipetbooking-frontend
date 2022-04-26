<script>
import parseDate from 'date-fns/parse'
import lazyLoadComponent from '@router/lazyload-component'
import { couponComputed } from '@state/helpers'

import Layout from '@layouts/main'
import BaseButtonDialog from '@components/BaseButtonDialog'

import { generateUniqueString } from '@utils'
import { defaultStatusFilter, numberUnitFilter } from '@utils/filter-value-to-text'
import { formatDateRange } from '@utils/format-date'
import pageMixin from '@src/mixins/pagination'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'

export default {
  page: {
    title: '優惠券設定',
    meta: [{ name: 'description', content: 'Coupon List' }],
  },
  components: {
    Layout,
    BaseButtonDialog,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {
    defaultStatusFilter,
    numberUnitFilter,
    formatDateRange,
  },
  mixins: [pageMixin],
  data() {
    return {
      loadedCoupons: [],
      selectedCoupons: [],
      filterData: {
        state: '',
        startDate: '',
        endDate: '',
        type: '',
        inProgress: '',
      },
      isFilterChange: false,
    }
  },
  computed: {
    ...couponComputed,
    enabledBulkButton() {
      return this.selectedCoupons.length === 0
    },
    enabledCopyButton() {
      return this.selectedCoupons.length === 1
    },
    filterDateRange: {
      get() {
        return [this.filterData.startDate, this.filterData.endDate]
      },
      set(value) {
        const [start, end] = value || Array.from({ length: 2 }, () => '')
        this.filterData.startDate = start
        this.filterData.endDate = end
      },
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToSearchCoupon',
      immediate: true,
    },
    filterData: {
      handler() {
        this.isFilterChange = true
      },
      deep: true,
    },
  },
  methods: {
    async tryToSearchCouponFilter() {
      // 當篩選前不在第一頁的時候，跳回第一頁
      if (this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      const { items, total } = await this.$store.dispatch('coupon/fetchList', Object.assign(this.filterData, this.pageQuery))
      this.loadedCoupons = items
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
    async tryToSearchCoupon() {
      const { items, total } = await this.$store.dispatch('coupon/fetchList', Object.assign(this.filterData, this.pageQuery))
      this.loadedCoupons = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
        this.currentPageLimit()
      })
    },
    handleResetSearch() {
      this.filterDateRange = ['', '']
      this.tryToSearchCoupon()
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
    goToViewCoupon(row) {
      const couponId = row.id
      this.$router.push({ name: 'view-coupon', params: { couponId } })
    },
    goToAddCoupon(data) {
      this.$router.push({
        name: 'add-coupon',
        params: {
          data,
        },
      })
    },
    async handleBulkUpdateState(state) {
      const couponIds = this.selectedCoupons.map(({ id }) => id)
      await this.$store.dispatch('coupon/updateState', {
        ids: couponIds,
        state,
      })
      this.tryToSearchCoupon()
    },
    async handleDeleteCoupon() {
      try {
        await messageBoxDelete('優惠券')
        try {
          const couponIds = this.selectedCoupons.map(({ id }) => id)
          await this.$store.dispatch('coupon/remove', { ids: couponIds })
          messageDelete()
          this.tryToSearchCoupon()
        } finally {
  
        }
      } catch {

      }
  
    },
    async handleDuplicateCoupon() {
      const [couponId] = this.selectedCoupons.map(({ id }) => id)

      const { id, title, code, ...couponData } = await this.$store.dispatch('coupon/fetchSingle', couponId)
      const randomCode = `${this.currentUser.merchantAlias}_${generateUniqueString(5)}`

      const duplicateData = {
        ...couponData,
        title: `${title}（複製）`,
        code: randomCode.toUpperCase(),
      }
      this.goToAddCoupon(duplicateData)

      // await this.$store.dispatch('coupon/store', duplicateData)
      // this.tryToSearchCoupon()
    },
    handleSelectionChange(selected) {
      this.selectedCoupons = selected
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.btnTop" class="btn-top-box">
      <span>
        <el-button class="is-round" type="primary" @click="goToAddCoupon({})">
        <span><BaseIcon name="plus" /> 新增</span>
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

    <BaseTableSearch v-slot="{ fields }" :default-value="filterData" hide-action 
    @reset="handleResetSearch"
    @tryToFetchList="tryToSearchCouponFilter">
      <el-form-item prop="state">
        <el-select v-model="fields.state" placeholder="選擇開放狀態" @change="tryToSearchCouponFilter">
          <el-option label="開放中" value="1"></el-option>
          <el-option label="未開放" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="filterDateRange"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          range-separator="-"
          start-placeholder="起始日期"
          end-placeholder="結束日期"
          :clearable="false"
          unlink-panels
          @change="tryToSearchCouponFilter"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="inProgress">
        <el-select v-model="fields.inProgress" placeholder="目前可使用" @change="tryToSearchCouponFilter">
          <el-option label="可使用" value="1"></el-option>
          <el-option label="不可使用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="type">
        <el-select v-model="fields.type" placeholder="折扣類型" @change="tryToSearchCouponFilter">
          <el-option label="固定金額（元）" value="fixed"></el-option>
          <el-option label="按訂單總額比例（％）" value="%"></el-option>
        </el-select>
      </el-form-item>
    </BaseTableSearch>
    <div class="el-table-wrapper">
      <el-table class="Jost" :data="loadedCoupons" :class="$style['table']" @row-click.once="goToViewCoupon" @selection-change="handleSelectionChange">
        <el-table-column type="selection" min-width="55"></el-table-column>
        <el-table-column v-slot="{ row }" label="優惠券名稱／代號" min-width="150">
          <b>{{ row.title }}</b>
          <div>{{ row.code }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="目前可使用" min-width="120" align="center">
          <BaseIcon v-if="checkAvailability(row)" name="check" class="only-icon" />
        </el-table-column>
        <el-table-column v-slot="{ row }" label="開放狀態／可使用日期" min-width="200">
          <BaseStateLabel :state="row.state | defaultStatusFilter('color')" text>{{ row.state | defaultStatusFilter('text') }}</BaseStateLabel>
          <div>{{ row.startDate | formatDateRange(row.endDate) }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="折扣" min-width="80">-{{ row.discount }}{{ row.type | numberUnitFilter }}</el-table-column>
        <el-table-column v-slot="{ row }" label="已被使用／發放總張數" min-width="180">{{ `${row.used}張／${row.infinity === 1 ? '無上限' : `${row.limit}張`}` }}</el-table-column>
        <el-table-column min-width="40">
          <el-tooltip content="查看優惠券詳情" placement="top">
            <el-button type="text">
              <BaseIcon name="ellipsis-v" />
            </el-button>
          </el-tooltip>
        </el-table-column>
      </el-table>
    </div>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    <!-- <BaseButtonDialog button-tooltip="新增優惠券" only-button floating @opened="goToAddCoupon" /> -->
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
