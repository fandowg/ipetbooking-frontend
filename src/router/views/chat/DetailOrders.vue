<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  components: {
    DetailOrdersProduct: () => lazyLoadComponent(import('./DetailOrdersProduct')),
    DetailOrdersPrepaid: () => lazyLoadComponent(import('./DetailOrdersPrepaid')),
  },
  data() {
    return {
      activeTab: '0',
      tabList: Object.freeze([
        {
          title: '預約報名',
          component: () => lazyLoadComponent(import('./DetailOrdersProduct')),
        },
        {
          title: '包月方案',
          component: () => lazyLoadComponent(import('./DetailOrdersPrepaid')),
        },
      ]),
    }
  },
  methods: {
    openOrderDetail(orderId) {
      // 'PRE' 結尾一定是包月方案訂單
      const isPrepaidId = orderId.match(/PRE$/g) !== null
      this.activeTab = isPrepaidId ? '1' : '0'
      this.$nextTick(()=>{
        let timeout = setInterval(()=>{
          if(this.$refs[isPrepaidId ? 'prepaid' : 'order'] !== undefined){
            clearInterval(timeout)
            this.$refs[isPrepaidId ? 'prepaid' : 'order'].tryToGetOrder({ id: orderId })
          }
        },300)
      })
    },
  },
}
</script>

<template>
  <div>
    <BasePageHeader :class="$style.header" title="所有訂單">
      <template v-slot:right>
        <el-tabs v-show="true" v-model="activeTab" class="is-no-border">
          <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.title" :name="`${index}`"></el-tab-pane>
        </el-tabs>
      </template>
    </BasePageHeader>
    <DetailOrdersProduct v-if="activeTab === '0'" ref="order" :class="$style.component" />
    <DetailOrdersPrepaid v-if="activeTab === '1'" ref="prepaid" :class="$style.component" />
  </div>
</template>

<style lang="scss" module>
.header {
  background: white;
  margin-top: 20px;
  padding: 0px 15px 0;
  margin-bottom: 0;
  line-height: 55px;
  :global {
    h2 {
      font-size: 1.2427326007em;
      margin-block-start: 0.8284884005em;
      margin-block-end: 0.8284884005em;
      letter-spacing: 0.15em;
      margin: 0;
    }
    .is-top {
      margin: 0;
    }
  }
}
.component {
  :global {
    .el-table {
      th {
        background: #f2f2f2;
        padding: 5px 0;
      }
    }
  }
}
</style>
