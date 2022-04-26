<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import formatDate, { formatDateRange } from '@utils/format-date'
import { defaultStatusFilter } from '@utils/filter-value-to-text'

export default {
  page: {
    title: '查看優惠券',
    meta: [{ name: 'description', content: 'View Coupon' }],
  },
  filters: {
    formatDate,
    formatDateRange,
    defaultStatusFilter,
  },
  components: {
    Layout,
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      delay:true,
      activeTabIndex: 0,
      displayValue: Object.assign({}, this.defaultValue),
      sideTabList: [
        {
          icon: 'edit',
          title: '編輯優惠券',
          name: 'edit',
          component: () => import('./DetailEdit'),
        },
        {
          icon: 'history',
          title: '此優惠券使用紀錄',
          name: 'orders',
          component: () => import('./DetailOrders'),
        },
         {
          icon: 'paper-plane',
          title: '發送優惠券',
          name: 'send',
          component: () => import('./DetailSend'),
        },
      ],
      isAssigned:false
    }
  },
  computed: {
    activeTab() {
      return this.sideTabList[this.activeTabIndex]
    },
  },
  created() {
    if(this.$route.query.tab==='sendCoupons'){
      this.activeTabIndex=2
    }
  },
  mounted() {
    setTimeout(()=>{
      this.delay = false
    },500)
  },
  methods: {
    backToList() {
      this.$router.push({ name: 'coupon' })
    },
    changePage(value){
      this.activeTabIndex=value;
      this.isAssigned=true;
    }
  },
}
</script>

<template>
  <Layout>
    <div v-if="delay" v-loading="delay" style="height:100vh"></div>
    <template v-else>
      <div :class="$style.wrapper">
        <div :class="$style.sidebar">
          <div :class="$style.header">
            <el-page-header title="返回列表" @back="backToList"></el-page-header>
            <h3>{{displayValue.title}}</h3>
            <p class="Jost">{{ displayValue.startDate | formatDateRange(displayValue.endDate) }}</p>
            <BaseStateLabel
              :state="displayValue.state | defaultStatusFilter('color') "
            >{{ displayValue.state | defaultStatusFilter('text') }}</BaseStateLabel>
            <ul class="Jost" :class="$style.metadata">
              <li>建立於 {{displayValue.createdAt | formatDate('dateTime')}}</li>
              <li>最後編輯於 {{displayValue.updatedAt | formatDate('dateTime')}}</li>
            </ul>
          </div>

          <div class="Jost" :class="$style.overview">
            <div :class="$style['overview__item']">
              <div :class="$style['overview__value']">{{ displayValue.used }}</div>已被使用
            </div>
            <div :class="$style['overview__item']">
              <div
                :class="$style['overview__value']"
              >{{ (displayValue.infinity === 1) ? '無上限' : displayValue.limit }}</div>發放總張數
            </div>
          </div>

          <el-radio-group v-model="activeTabIndex" class="is-block" :class="$style.tabs">
            <el-radio-button v-for="(tab, $index) in sideTabList" :key="tab.name" :label="$index">
              <BaseIcon :name="tab.icon" />
              <span>{{tab.title}}</span>
            </el-radio-button>
          </el-radio-group>
        </div>
        <div :class="$style.content">
          <keep-alive>
            <component
              :is="activeTab.component"
              :key="activeTab.name"
              :default-value.sync="displayValue"
              :is-assigned="isAssigned"
              @changePage="changePage"
            ></component>
          </keep-alive>
        </div>
      </div>
    </template>
  </Layout>
</template>

<style lang='scss' module>
@import '@design';
@import '@src/design/layout_detail_sidebar.scss';
</style>