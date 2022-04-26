<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'
import BaseButtonDialog from '@components/BaseButtonDialog'
import formatDate from '@utils/format-date'
const initData = () => {
  return {
    block:0,
    canBlock:1,
    email:'',
    firstName:'',
    groupIds:[],
    id:'',
    lastName:''
  }
}

export default {
  page: {
    title: '排班人員',
    meta: [{ name: 'description', content: 'Staff List' }],
  },

  components: {
    Layout,
    ListItem: () => lazyLoadComponent(import('./components/ListItem')),
    BaseButtonDialog,
    StaffForm: () => lazyLoadComponent(import('@components/ScheduleStaffForm')),
    ScheduleStaffDetail: () => lazyLoadComponent(import('@components/ScheduleStaffDetail')),
  },
  data() {
    return {
      staffs: [],
      dialogVisible: false,
      dialogItem: {},
      dialogMode: 'edit', // edit 編輯, add 新增， view 預覽

      visibleDetail: false,
      staffDetail: {},
      tryingFetchDetail: false,
      visibleEdit: false,
      selectUserVisible: false,
      tryingGetUser: false,
      selectUser: initData(),
      addUserToStaffData:{},
      userList: [],
      accountId:0
    }
  },
  computed: {
    dialogTitle() {
      const modeTitleMap = {
        add: '創建人員',
        edit: '編輯人員',
        view: '項目人員',
      }
      return modeTitleMap[this.dialogMode]
    },
  },
  watch:{
    selectUserVisible(value){
      if(!value){
        this.selectUser=initData()
      }
    }
  },
  created() {
    this.tryToFetchList()
  },
  methods: {
    async tryToFetchList() {
      this.staffs = await this.$store.dispatch('schedule/fetchStaff')
    },
    async tryToFetchDetail(id) {
      this.tryingFetchDetail = true
      this.staffDetail = await this.$store.dispatch('schedule/fetchStaffDetail', {
        id,
        page: 1,
        limit: 10,
        date: formatDate(new Date(), 'YYYY-MM'),
      })
      this.visibleDetail = true
      this.tryingFetchDetail = false
    },
    updateList() {
      this.tryToFetchList()
      this.closeEdit()
      // this.closeDialog()
    },
    openDialog(mode, itemData) {
      this.dialogVisible = true
      this.dialogMode = mode
      this.$set(this.$data, 'dialogItem', itemData)
    },
    async openEdit(mode, itemData) {
      this.accountId=0
      const title = mode === 'add' ? '創建人員' : '編輯人員'
      this.$store.commit('title/SET_TITLE', title)
      this.dialogMode = mode
      if (mode === 'add') {
        this.$set(this.$data, 'dialogItem', itemData)
        this.visibleEdit = true
      } else {
        await this.tryToFetchDetail(itemData.id)
        this.visibleEdit = true
        this.visibleDetail = false
        this.$set(this.$data, 'dialogItem', this.staffDetail)
      }
    },
    closeEdit() {
      this.visibleEdit = false
      this.$store.commit('title/SET_TITLE', '')
    },
    openSelectUser() {
      this.tryToSearchUser()
      this.selectUserVisible = true
    },
    async tryToSearchUser() {
      this.tryingGetUser = true
      this.userList = await this.$store.dispatch('merchant/fetchUsersForStaff', { onlyConnectableUser: 1 })
      this.tryingGetUser = false
      // console.log(as)
    },
    async sendLinkUser() {
  
      // this.addUserToStaffData = await this.$store.dispatch('schedule/sendLinkUser', { userId: this.selectUser.id })

      
      this.$store.commit('title/SET_TITLE', '新增人員')
      this.dialogMode = 'add'
      this.staffDetail={
        name:this.selectUser.firstName,
        email:this.selectUser.email,
        userGroupIds:this.selectUser.groupIds
      }
      this.accountId = this.selectUser.id
      // await this.tryToFetchDetail(this.addUserToStaffData.id)
      // this.staffDetail.phoneCode= '+886' // 強制國碼886
      this.selectUserVisible = false
      this.visibleEdit = true
      this.visibleDetail = false
      this.$set(this.$data, 'dialogItem', this.staffDetail)
      
    },
    backTolist(){
      this.visibleDetail = false
      this.tryToFetchList()
    }
    /*   closeDialog() {
      this.dialogVisible = false
    }, */
  },
}
</script>

<template>
  <Layout v-loading.fullscreen.lock="tryingFetchDetail" element-loading-text="取得人員資訊中">
 
      <div v-if="!visibleDetail && !visibleEdit">
        <div class="btn-top-box p-0 mb-4" style="background: transparent">
          <!-- <el-button class="is-round" type="primary" :disabled="staffs.length > 10" @click="openEdit('add')">
          
            <span>新增</span>
          </el-button> -->
          <span>
            <el-button class="is-round" type="primary"  @click="openEdit('add')">
              <BaseIcon name="plus" />
              <span>新增</span>
            </el-button>
          </span>
          <span>
            <el-button class="is-round" @click="openSelectUser">
              <BaseIcon name="user-plus" />
              <span>從管理人員新增</span>
            </el-button>
          </span>
        </div>
        <div :class="[$style['item__list'], $style[`item__list--last-${staffs.length % 5}`]]">
          <!-- <ListItem
            v-for="item in staffs"
            :key="item.id"
            :data="item"
            :class="$style.item"
            @view="
              (itemData) => {
                tryToFetchDetail(itemData.id)
              }
            "
            @edit="
              (itemData) => {
                openDialog('edit', itemData)
              }
            "
          /> -->
          <ListItem
            v-for="item in staffs"
            :key="item.id"
            :data="item"
            :class="$style.item"
            @view="
              (itemData) => {
                tryToFetchDetail(itemData.id)
              }
            "
            @edit="
              (itemData) => {
                openEdit('edit', itemData)
              }
            "
          />
        </div>
        <!-- <BaseButtonDialog v-show="!visibleDetail" :title="dialogTitle" :dialog-visible.sync="dialogVisible" floating @opened="openDialog('add')">
          <div v-if="dialogMode === 'view'">
            <ListItem :data="dialogItem" show-detail @edit="dialogMode = 'edit'" @close="closeDialog" />
          </div>
          <StaffForm v-else :default-value="dialogItem" @store="updateList" @close="closeDialog" />
        </BaseButtonDialog> -->
        <el-dialog title="從管理人員新增" :visible.sync="selectUserVisible" top="0" width="450px" append-to-body>
          <template v-if="userList.length > 0">
            <p style="margin-top: 0; margin-bottom: 25px">請從下方選取您欲新增的排班人員</p>
            <div class="el-radio-wrapper">
              <div class="el-radio-wrapper__title"> <span>管理人員</span> <span>帳號狀態</span> </div>
              <el-radio-group v-model="selectUser" v-loading="tryingGetUser" class="vertical-radio">
                <el-radio v-for="item in userList" :key="item.id" border :label="item">
                  {{ item.firstName }}
                  <span class="select__option--meta"
                    ><span :style="`color: ${item.block ? '#e35d5d' : '#60a32f'}`">{{ item.block ? '停權中' : '啟用中' }}</span></span
                  >
                </el-radio>
              </el-radio-group>
            </div>
          </template>
          <el-alert v-else title="目前沒有可以新增的帳號" type="warning" :closable="false"></el-alert>

          <div class="bottom-btn-center">
            <el-button class="is-round" @click="selectUserVisible = false">取消</el-button>
            <el-button class="is-round" type="primary" :disabled="!selectUser.id" @click="sendLinkUser">確認</el-button>
          </div>
        </el-dialog>
      </div>

      <ScheduleStaffDetail v-if="visibleDetail && !visibleEdit" :default-value.sync="staffDetail" @back="backTolist"></ScheduleStaffDetail>
      <StaffForm v-if="visibleEdit" :default-value="dialogItem" :account-id="accountId" @store="updateList" @close="closeEdit" />
 
  </Layout>
</template>
<style lang="scss" module>
@import '@design';

$column-number: 5;

.item {
  width: calc(100% / #{$column-number} - 15px);
  padding: 20px 10px;
  margin-bottom: 30px;
  background-color: white;
  cursor: pointer;
  transition: $all-transition;

  @include max-sm {
    width: calc(100% - 0.5rem);
  }

  &:hover {
    @include layer-elevation(8);
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &--last-2:after {
      width: calc(100% / #{$column-number} * 3 - 15px);
      content: '';
    }
    &--last-3:after {
      width: calc(100% / #{$column-number} * 2 - 15px);
      content: '';
    }
    &--last-4:after {
      width: calc(100% / #{$column-number} * 1 - 15px);
      content: '';
    }
  }
}
</style>
