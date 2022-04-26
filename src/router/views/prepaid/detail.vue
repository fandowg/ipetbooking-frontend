<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import formatDate, { formatDateRange } from '@utils/format-date'
import { defaultStatusFilter } from '@utils/filter-value-to-text'

import { PortalTarget } from 'portal-vue'
import { authComputed } from '@state/helpers'

export default {
  page: {
    title: '查看包月方案',
    meta: [{ name: 'description', content: 'View Prepaid' }],
  },
  filters: {
    formatDate,
    formatDateRange,
    defaultStatusFilter,
  },
  components: {
    Layout,
    PortalTarget,
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderForm: () => import('@components/PrepaidOrderForm'),
  },
  props: {
     products: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    prices: {
      type: Array,
      required: true,
    },
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
          title: '編輯包月方案',
          name: 'edit',
          component: () => import('./DetailEdit'),
        },
        {
          icon: 'history',
          title: '此包月方案訂購紀錄',
          name: 'orders',
          component: () => import('./DetailOrders'),
        },
      ],
      drawerVisible: false,
      selectPrice:0
    }
  },
  watch:{
    drawerVisible(value){
      if(!value){
        this.selectPrice = 0
      }

    }
  },
  created() {
    if (this.isOrderManager)
      this.sideTabList.shift()
  },
  mounted() {
     if(this.$route.params.drawer){
      this.drawerVisible=true
    }
    setTimeout(()=>{
      this.delay = false
    },500)
  },
  computed: {
    ...authComputed,
    activeTab() {
      return this.sideTabList[this.activeTabIndex]
    },
    isOrderManager() {
      return !this.currentUserRoutes.includes('add-prepaid') && this.currentUserRoutes.includes('prepaid')
    },
    pagination(){
     return this.$route.params.pagination
    },
    filterData(){
     return this.$route.params.filterData
    }
    // showDrawer:{
    //   get(){
    //     return this.$route.params.drawer;
    //   },
    //   set(value){
    //     this.drawerVisible=value
    //   }

    // }
    
  },
  methods: {
    backToList() {
      this.$router.push({ name: 'prepaid',params:{
        pagination:this.pagination,
        filterData:this.filterData
      } })
    },
    handleUpdateOrders() {
      if (!this.isOrderManager)
        this.activeTabIndex = 1

      this.$nextTick(()=>{
        let timeout = setInterval(()=>{
          if(this.$refs.orders !== undefined){
            clearInterval(timeout)
            this.$refs.orders.tryToFetchOrder()
          }
        }, 500)
      })

      this.handleCloseDrawer()
    },
    handleCloseDrawer() {
      this.$refs.drawer.closeDrawer()
    },
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
            <el-image class="image" :src="displayValue.image" fit="cover">
              <div slot="error">
                <BaseIcon name="image" class="image--error" />
              </div>
            </el-image>
            <h3>{{ displayValue.title }}</h3>
            <h4 class="Jost">可抵用次數{{ `${displayValue.times}次` }}</h4>

            <!-- <BaseStateLabel :state="displayValue.state | defaultStatusFilter('color')">
              {{
              displayValue.state | defaultStatusFilter('text')
              }}
            </BaseStateLabel> -->
            <ul :class="$style.metadata">
              <li class="Jost">建立於 {{ displayValue.createdAt | formatDate('dateTime') }}</li>
              <li class="Jost">
                最後編輯於
                {{ displayValue.updatedAt | formatDate('dateTime') }}
              </li>
            </ul>
          </div>

          <div class="Jost" :class="$style.overview">
            <div :class="$style['overview__item']">
              <div :class="$style['overview__value']">
                {{
                displayValue.infinity === 1 ? '無上限' : displayValue.groupInventoryTotal
                }}
              </div>庫存
            </div>
            <div :class="$style['overview__item']">
              <div :class="$style['overview__value']">{{ displayValue.groupQtyTotal }}</div>已售出
            </div>
          </div>

          <el-radio-group v-model="activeTabIndex" class="is-block" :class="$style.tabs">
            <el-radio-button v-for="(tab, $index) in sideTabList" :key="tab.name" :label="$index">
              <BaseIcon :name="tab.icon" />
              <span>{{ tab.title }}</span>
            </el-radio-button>

            <el-radio-group class="is-block" :class="$style.tabs">
              <el-radio-button :class="$style.enabled" :label="1" disabled @click.native="drawerVisible = true">
                <!-- <BaseIcon name="mail-bulk" /> -->
              <BaseIcon name="shopping-bag" icon-style="fal"  />  <span>代客購買此包月方案</span>
              </el-radio-button>
              <el-radio-button v-show="false" :label="0" @click.native="drawerVisible = true"> </el-radio-button>
            </el-radio-group>
          </el-radio-group>
        </div>
        <div :class="$style.content">
          <keep-alive>
            <component
              :is="activeTab.component"
              :ref="activeTab.name"
              :key="activeTab.name"
              :default-value.sync="displayValue"
              :products="products" 
              :category="category"
              :prices="prices"
            ></component>
          </keep-alive>
        </div>
      </div>
      <el-drawer ref="drawer" :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" :destroy-on-close="true">
        <PortalTarget slot="title" name="drawer-prepaid-header"></PortalTarget>
        <h4>{{ defaultValue.title }}</h4>
        <h5>{{ `${defaultValue.times}次`}}<span v-if="selectPrice">{{` / $${selectPrice}` }}</span></h5>
        <!-- <h5>{{ `${defaultValue.times}次／$${defaultValue.price}` }}</h5> -->
        <OrderForm :prepaid="defaultValue" :select-price.sync="selectPrice" @store="handleUpdateOrders" @cancel="handleCloseDrawer" />
      </el-drawer>
    </template>
   
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_sidebar.scss';
.enabled {
  :global {
    .el-radio-button__orig-radio:disabled + .el-radio-button__inner {
      color: inherit;
      cursor: pointer;
      &:hover {
        color: $color-primary;
      }
    }
  }
}
</style>
