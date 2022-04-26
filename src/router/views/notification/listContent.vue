<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap } from '@utils/filter-value-to-text'
import pageMixin from '@src/mixins/pagination'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ListItem: () => lazyLoadComponent(import('./components/ListItem')),
  },
  filters: {
    genderFilter,
  },
  mixins: [pageMixin],
  props: {
    isEmployee:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      activeTab: 'normal',
      // activeList:[],
      tabList: Object.freeze([
        {
          title: '一般通知',
          type:'normal',
          readType: 'unRead',
          // listType:'normalPushes'
          // component: () => lazyLoadComponent(import('./TabIncome')),
        },
        {
          title: '系統公告',
          type:'system',
          readType: 'sysUnRead',
          // listType:'systemPushes'
          // component: () => lazyLoadComponent(import('./TabSell')),
        },
      ]),
      tryingPush: false,
      next_cursor: {
        normal:null,
        system:null
      },
      isListEnd:{
        normal:false,
        system:false
      }
      // pushList:[],
      // readData:{},
    }
  },
  computed: {
    ...mapState('push', ['readData','normalPushes','systemPushes']),
    // ...mapGetters('push', ['normalPushes', 'systemPushes']),
    // normalPushes(){
    //   return this.pushList.filter(item =>{
    //     return item.type !== 'PushSystemPostEvent'
    //   })
    // },
    // systemPushes(){
    //   return this.pushList.filter(item =>{
    //     return item.type === 'PushSystemPostEvent'
    //   })
    // },
    activeList() {
      let list = []
      if (this.activeTab === 'normal') {
        list = this.normalPushes
      } else {
        list = this.systemPushes
      }
      return list
    },
  },
  watch: {},
  created() {
    this.$store.commit('push/CLEAR_PUSHES')
    this.tryToFetchPushes()
    // 已在通知頁面，所以清空狀態
    this.clearUnRead()
  },
  
  mounted() {
    // console.log(this.$refs.notification)
    this.$refs.notification.style.height=`${window.innerHeight - 0}px`
    this.$refs.notification.addEventListener('scroll', this.onScroll)
    if(this.$route.name==='notification'){
      // document.getElementById('app').addEventListener('scroll', this.onScroll)
      // document.querySelector('.eee').addEventListener('scroll', this.onScroll)
    }
   
  //  console.log(document.getElementById('app').scrollTop)
  //  document.getElementById('app').onscroll()
  },
  // beforedestroy(){
  //   document.getElementById('app').removeEventListener('scroll', this.onScroll)
  // },
  methods: {
    ...mapActions('push', ['fetchPushes','clearUnRead']),

    async tryToFetchPushes() {
      this.tryingPush = true
      const nextCursorRequest = this.next_cursor[this.activeTab]
      // console.log(nextCursorRequest)
      const nextCursorResponse = await this.fetchPushes({
        type:this.activeTab,
        nextCursorRequest
      })
      // console.log(next_cursor)
      if(nextCursorResponse.normal!=='not'){
        this.next_cursor.normal = nextCursorResponse.normal
      }
      if(nextCursorResponse.system!=='not'){
        this.next_cursor.system = nextCursorResponse.system
      }
      // this.next_cursor[this.activeTab] = nextCursorResponse
      this.tryingPush = false

      

    },
    // installScroll() {
    //   document.addEventListener('scroll', this.onScroll)
    // },
    onScroll() {
      // console.log('scroll')
      let bottomOfWindow = this.$refs.notification.scrollHeight  - this.$refs.notification.scrollTop < window.innerHeight + 20
      // console.log(this.next_cursor[this.activeTab])
      // console.log(this.$refs.notification.scrollHeight ,this.$refs.notification.scrollTop ,window.innerHeight,bottomOfWindow)
      // console.log(this.next_cursor[this.activeTab],bottomOfWindow,this.tryingPush)
      if (this.next_cursor[this.activeTab] && bottomOfWindow && !this.tryingPush) {
        // console.log('取資料')
        this.tryToFetchPushes()
      }
      if(!this.next_cursor[this.activeTab]){
        this.isListEnd[this.activeTab] = true
      }
    },
  },
}
</script>
<template>
  <div ref="notification" :class="[$style.listContentSection,{ 'employeeBox': isEmployee }]">
    <el-tabs v-model="activeTab"  stretch type="border-card">
      <el-tab-pane v-for="(tab, index) in tabList" :key="index" :name="tab.type">
        <span slot="label"
          >{{ tab.title }} <span v-if="readData[tab.readType] !== 0 && readData[tab.readType]">(<span class="hidden-mobile">未讀</span>{{ readData[tab.readType] }})</span>
        </span>
        <p v-if="activeList.length === 0" style="padding: 35px 30px">尚未有任何通知</p>
        <div  >
          <ListItem v-for="(item, i) in activeList"  :key="i" :item="item" :index="i" :type="tab.type" @update="tryToFetchPushes" />
          
          <div v-if="tryingPush" v-loading="tryingPush" style="height:80px"></div>
        </div>
        <div v-if="isListEnd[tab.type]" class="listEnd" >已經到最後囉</div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
.listContentSection {
  overflow-y:scroll;
  padding-top: 90px;
  &:global {
    &.employeeBox{
      padding-top: 120px;
      padding-top: calc(constant(safe-area-inset-top) + 120px);
      padding-top: calc(env(safe-area-inset-top) + 120px);
      @include touch {
        margin-top: 0;
        padding-top: 90px;
        padding-top: calc(constant(safe-area-inset-top) + 90px);
        padding-top: calc(env(safe-area-inset-top) + 90px);
        padding-bottom: 100px;
        padding-bottom: calc(constant(safe-area-inset-bottom) + 100px);
        padding-bottom: calc(env(safe-area-inset-bottom) + 100px);
      }
    }
  }
  @include touch {
    // margin-top: 60px;
  }
  :global {
    .el-tabs--border-card{
      @include touch {
        box-shadow:none ;
      }
    }
    .scroll-box{
      overflow-y:scroll
    }
    .el-tabs__content {
      padding: 0 !important;
    }
    .listEnd{
      background:#F9FAFB;
      text-align:center;
      padding:10px 0;
      @include touch {
        background:none;
        border-top: $color-border-base 1px solid;
      }
    }
  }
}
</style>
