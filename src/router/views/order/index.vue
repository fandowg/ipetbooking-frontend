<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'

export default {
  page: {
    title: '訂單查詢',
    meta: [{ name: 'description', container: 'Order List' }],
  },
  components: {
    Layout,
  },
  data() {
    return {
      activeTab: '0',
      tabList: Object.freeze([
        {
          title: '預約訂單',
          component: () => lazyLoadComponent(import('./TabProduct')),
        },
        {
          title: '包月方案',
          component: () => lazyLoadComponent(import('./TabPrepaid')),
        },
      ]),
    }
  },
  watch: {
    activeTab() {
      this.$route.params.activeTab = this.activeTab
    },
  },
  created() {
    if (this.$route.params.activeTab) this.activeTab = this.$route.params.activeTab
    if(this.$route.query.type){
      if(this.$route.query.type==="order"){
        this.activeTab="0"
      }
      if(this.$route.query.type==="prepaidOrder"){
        this.activeTab="1"
      }
      // this.activeTab=this.$route.query.type==="order"?"0":"1"
      // this.$refs.order[0].tryToGetOrder('JTAIL2109060002LJZHN')
    }
    // console.log(this.$refs.order)
  },
  mounted() {
    // setTimeout(()=>{
    //   console.log(this.$refs.order[0])
    // },0)
    
    // this.$refs.order[0].tryToGetOrder('JTAIL2109060002LJZHN')
  },
}
</script>

<template>
  <Layout>
    <!-- <BasePageHeader>
      <template v-slot:title>訂單查詢</template>
      <template v-slot:right>
        <el-tabs v-model="activeTab" class="is-no-border">
          <el-tab-pane
            v-for="(tab, index) in tabList"
            :key="index"
            :label="tab.title"
            :name="`${index}`"
          ></el-tab-pane>
        </el-tabs>
      </template>
    </BasePageHeader> -->
    <!-- <keep-alive> -->
    <el-tabs v-model="activeTab" stretch type="border-card">
      <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.title" :name="`${index}`">
        <component :is="tab.component" ref="order"></component>
      </el-tab-pane>
    </el-tabs>

    <!-- </keep-alive> -->
  </Layout>
</template>
