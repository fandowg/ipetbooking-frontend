<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  data() {
    return {
      activeTab: '0',
      tabList: Object.freeze([
        {
          title: '預約訂單',
          component: () => lazyLoadComponent(import('./DetailOrdersProduct')),
        },
        {
          title: '包月方案',
          component: () => lazyLoadComponent(import('./DetailOrdersPrepaid')),
        },
      ]),
    }
  },
}
</script>

<template>
  <div>
    <BasePageHeader title="預約紀錄">
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
    </BasePageHeader>
    <!-- <keep-alive> -->
      <component :is="tabList[activeTab].component"></component>
    <!-- </keep-alive> -->
  </div>
</template>
