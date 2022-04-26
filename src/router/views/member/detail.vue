<script>
import Layout from '@layouts/main'
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter } from '@utils/filter-value-to-text'
import BaseButtonDialog from '@components/BaseButtonDialog'
import { authComputed } from '@state/helpers'

export default {
  page: {
    title: '查看客戶資訊',
    meta: [{ name: 'description', content: 'View Member' }],
  },
  filters: { genderFilter },
  components: {
    Layout,
    BaseButtonDialog,
    NotificationWrite: () => lazyLoadComponent(import('@components/NotificationWrite')),
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
      noti: 0,
      dialogVisible: false,
      sideTabList: [
        {
          icon: 'edit',
          iconStyle: 'far',
          title: '編輯客戶資訊',
          name: 'edit',
          component: () => import('./DetailEdit'),
        },
        {
          icon: 'history',
          iconStyle: 'far',
          title: '所有預約紀錄',
          name: 'orders',
          component: () => import('./DetailOrders'),
        },
        {
          icon: 'paw',
          iconStyle: 'fal',
          title: '寵物列表',
          name: 'pets',
          component: () => import('./DetailPets'),
        },
      ],
      componentData: Object.assign({}, this.defaultValue),
    }
  },
  computed: {
    ...authComputed,
    activeTab() {
      return this.sideTabList[this.activeTabIndex]
    },
    pagination(){
     return this.$route.params.pagination
    }
  },
  mounted() {
    setTimeout(()=>{
      this.delay = false
    },500)
  },
  methods: {
    backToList() {
      this.$router.push({ 
        name: 'member',
        params:{ pagination:this.pagination }
      })
    },
    closeDialog() {
      this.dialogVisible = false
    },
    goChat() {
      this.$router.push({
        name: 'view-chat',
        params: { memberId: this.defaultValue.id },
      })
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
            <div :class="$style.intro">
              <el-avatar :src="require(`@assets/images/member_avatar_${componentData.gender || 'female'}.png`)" :size="100"></el-avatar>

              <h3>{{ componentData.fullName }} {{ componentData.gender | genderFilter }}</h3>
              <ul class="is-info Jost">
                <li>{{ `${componentData.phoneCode} ${componentData.phoneNumber}` }}</li>
                <li>{{ componentData.email }}</li>
              </ul>
            </div>
          </div>

          <div :class="$style.overview">
            <div :class="$style['overview__item']">
              <div :class="$style['overview__value']">{{ componentData.ordersCounts }}</div
              >有效訂單筆數
            </div>
            <div :class="$style['overview__item']">
              <div :class="$style['overview__value']">{{ componentData.ordersTotal }}</div
              >累積消費金額
            </div>
          </div>

          <el-radio-group v-model="activeTabIndex" class="is-block" :class="$style.tabs">
            <!-- <el-radio-button v-for="(tab, $index) in sideTabList" :key="tab.name" :label="$index">
              <BaseIcon :name="tab.icon" :icon-style="tab.iconStyle" />
              <span>{{ tab.title }}</span>
            </el-radio-button> -->
            <el-radio-button :class="$style.enabled" :label="0">
              <BaseIcon name="edit" />
              <span>編輯客戶資訊</span>
            </el-radio-button>
            <el-radio-button :class="$style.enabled" :label="1">
              <BaseIcon name="history" />
              <span>所有預約紀錄</span>
            </el-radio-button>
            <el-radio-group class="is-block" :class="$style.tabs">
              <el-radio-button :class="$style.enabled" :label="1" disabled @click.native="dialogVisible = true">
                <BaseIcon name="mail-bulk" />
                <span>撰寫通知</span>
              </el-radio-button>
              <el-radio-button v-show="false" :label="0" @click.native="dialogVisible = true"> </el-radio-button>
            </el-radio-group>

            <el-radio-group v-if="currentUserRoutes && currentUserRoutes.includes('chat')" class="is-block" :class="$style.tabs">
              <el-radio-button :class="$style.enabled" :label="1" disabled @click.native="goChat">
                <BaseIcon name="comments" />
                <span>對話紀錄</span>
              </el-radio-button>
            </el-radio-group>
            <el-radio-button :class="$style.enabled" :label="2">
              <BaseIcon name="paw"  icon-style="fal"/>
              <span>寵物列表</span>
            </el-radio-button>
          </el-radio-group>

          <!-- <el-radio-group v-model="activeTabIndex" class="is-block" :class="$style.tabs">
          
        
          </el-radio-group> -->
        </div>
        <div :class="$style.content">
          <keep-alive>
            <component :is="activeTab.component" :key="activeTab.name" :default-value.sync="componentData"></component>
          </keep-alive>
        </div>

        <BaseButtonDialog :only-dialog="true" :title="'撰寫通知'" :dialog-visible.sync="dialogVisible" :destroy="true" floating>
          <NotificationWrite :selected-member-ids="[defaultValue.id]" :source-name="'member'" :source-member="defaultValue" @close="closeDialog" />
        </BaseButtonDialog>
      </div>
    </template>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_sidebar.scss';
.tabs{
  :global {
    .el-radio-button:first-child .el-radio-button__inner{
      border-left:0;
      
    }
    .el-radio-button .el-radio-button__inner{
      border-bottom:$color-border-base 1px solid;
    }
  }
}

.intro {
  margin-top: 30px;
  text-align: center;
}
.enabled {
  :global {
    .el-radio-button__orig-radio:disabled + .el-radio-button__inner {
      color: #606266;
      cursor: pointer;
      &:hover {
        color: $color-primary;
      }
    }
  }
}
</style>
