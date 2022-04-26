<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  page: {
    title: '數據分析',
    meta: [{ name: 'description', content: 'Customer Analytics' }],
  },
  components: {},
  props: {
    merchantProducts: {
      type: Array,
      required: true,
    },
    sellShow:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      activeTab: '1',
      // ifShow:false,
      tabList: Object.freeze([
        {
          title: '依訂單類型',
          component: () => import('./TabSellByOrder'),
        },
        {
          title: '依服務項目',
          component: () => import('./TabSellByPrices'),
        },
        {
          title: '依包月方案',
          component: () => import('./TabSellByPrepaid'),
        },
        {
          title: '依加購項目',
          component: () => import('./TabSellByAddition'),
        },
      ]),
    }
  },
  computed: {},
  mounted() {
    this.activeTab = '1'
  },
  created() {
    // this.$refs.tab.resize()
  },
  methods: {
    toClick(){
      // console.log(123)
    }
  },
}
</script>

<template>
  <div>

    <el-tabs v-if="sellShow" ref="tab" v-model="activeTab" stretch class="is-no-border is-no-bg is-second" @tab-click="toClick">


      <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.title" :name="`${index + 1}`"
        >
        <component :is="tab.component" v-if="Number(activeTab) === index + 1" :merchant-products="merchantProducts"></component>

      </el-tab-pane>

    </el-tabs>
 
  </div>
</template>
<style lang="scss" module >
:global {
  .is-second {
    .el-tabs__active-bar {
      // width: 80px !important;
      // transform: translateX(105.828px)!important;
      // margin-left:7%;
      // font-size: 16px;
    }
    .el-tabs__nav.is-stretch {
      // padding-left: 8%;
      // padding-right: 8%;
    }
    .el-tabs__item {
      font-size: 14px !important;
      // padding-left: 9% !important;
      // padding-right: 9% !important;
      &.is-active{
        color: $color-secondary!important;
      }
    }
  }
  // .el-tabs--border-card .el-tabs__item:not([id=tab-byOrder]):not([id=tab-bySize]):after {
  //   background: none;
  // }
}
</style>
