<script>
import { authComputed, merchantUserComputed } from '@state/helpers'

import Layout from '@layouts/main'
import BaseButtonDialog from '@components/BaseButtonDialog'
import AdminForm from './AdminForm'
import PermissionTable from './PermissionTable'

import pageMixin from '@src/mixins/pagination'

export default {
  page: {
    title: '商店管理帳號',
    meta: [{ name: 'description', content: 'Admin List' }],
  },
  components: { Layout, BaseButtonDialog, AdminForm, PermissionTable },
  mixins: [pageMixin],
  data() {
    return {
      editDialogVisible: false,
      editDialogMode: 'add', // edit 編輯, add 新增'
      editDialogItem: {},
      permissionDialogVisible: false,
      filterData: {
        groupIds: [],
        block: '',
      },
      statusList: [
        {value: '', title: '全部帳號狀態'},
        {value: 0, title: '啟用中'},
        {value: 1, title: '停權中'},
      ],
      isFilterChange: false,
    }
  },
  computed: {
    ...authComputed,
    ...merchantUserComputed,
    editDialogTitle() {
      return this.editDialogMode === 'add' ? '新增管理帳號' : '編輯管理帳號'
    },
  },
  watch: {
    currentPage: {
      handler: 'tryToSearchUser',
      immediate: true,
    },
    filterData: {
      handler() {
        this.isFilterChange = true
      },
      deep: true,
    },
  },
  mounted() {
    this.$refs.table.doLayout()
    // console.log(this.$store.getters['auth/testGetter']('超級管理者'))
    // console.log(this.$store)
    
  },
  methods: {
    openEditDialog(mode, userData) {
      this.editDialogVisible = true
      this.editDialogMode = mode
      this.editDialogItem = userData
    },
    closeEditDialog() {
      this.editDialogVisible = false
      this.resetEditDialog()
    },
    updateList() {
      this.tryToSearchUser()
      this.closeEditDialog()
    },
    async tryToSearchUserFilter() {
      // 當篩選前不在第一頁的時候，跳回第一頁
      if (this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      const total = await this.$store.dispatch(
        'merchant/fetchUsers',
        Object.assign(this.filterData, this.pageQuery)
      )
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
    async tryToSearchUser() {
      const total = await this.$store.dispatch(
        'merchant/fetchUsers',
        Object.assign(this.filterData, this.pageQuery)
      )

      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
        this.currentPageLimit()
      })
    },
    resetEditDialog() {
      this.editDialogMode = 'add'
      this.editDialogItem = {}
    }
  },
}
</script>

<template>
  <Layout>
    <div >
    <div class="btn-top-box">
      <span>
        <el-button  class="is-round" type="primary"  @click="editDialogVisible = true">
            <BaseIcon name="plus" />
            <span>新增</span>
        </el-button>
      </span>
      <span>
        <el-button  class="is-round"   @click="permissionDialogVisible = true">
            <BaseIcon name="user-lock" />
            <span>管理權限表</span>
        </el-button>
      </span>
    </div>
    <BaseTableSearch v-slot="{ fields }" :default-value="filterData" hide-action @reset="tryToSearchUser" @tryToFetchList="tryToSearchUserFilter">
      <el-form-item prop="groupIds">
        <el-select
          v-model="fields.groupIds"
          multiple
          placeholder="選擇帳號身份"
          style="width:300px"
          @change="tryToSearchUserFilter"
        >
          <el-option
            v-for="group in userGroupList"
            :key="group.id"
            :label="group.title"
            :value="group.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="block">
        <el-select
          v-model="fields.block"
          @change="tryToSearchUserFilter"
        >
          <el-option
            v-for="status in statusList"
            :key="status.title"
            :label="status.title"
            :value="status.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </BaseTableSearch>
    <div class="el-table-wrapper">
    <el-table ref="table" :data="userList">
      <el-table-column v-slot="{ row }" label="姓名／Email" min-width="200">
        {{ row.firstName }} {{ row.lastName }}
        <div>{{ row.email }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="帳號狀態" width="100">
        <div :style="`color: ${row.block ? '#e35d5d' : '#60a32f'}`">{{ row.block ? '停權中' : '啟用中'}}</div>
      </el-table-column>
      <el-table-column
      v-for="group in userGroupList"
        v-slot="{ row }"
        :key="group.id"
        width="100"
        :label="group.title"
        align="center"
      >
        <BaseIcon v-if="row.groupIds.includes(group.id)" name="check-circle" class="only-icon" />
      </el-table-column>
      <el-table-column v-slot="{ row }" align="right" width="100">
        <el-button class="is-round" type="primary" style="font-size: 16px;" plain @click="openEditDialog('edit', row)">
          <BaseIcon name="edit" />
        </el-button>
      </el-table-column>
    </el-table>
    </div>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
    </div>
    <BaseButtonDialog
      v-can:api="'addAdmin'"
      only-dialog
      title="身份與權限表"
      :dialog-visible.sync="permissionDialogVisible"
      :dialog-props=" { width: '80%' }"
      button-type="info"
      button-icon-name="info"
      order="2"
      width="1135px"
      floating
    >
      <PermissionTable show-owner />
    </BaseButtonDialog>

    <BaseButtonDialog
      only-dialog
      :title="editDialogTitle"
      :dialog-visible.sync="editDialogVisible"
      :dialog-props="{ width: '80%' }"
      floating
      :destroy="true"
      width="1135px"
      @closed="resetEditDialog"
    >
      <AdminForm :default-value="editDialogItem" :visible="editDialogVisible" @close="closeEditDialog" @store="updateList" />
    </BaseButtonDialog>
  </Layout>
</template>


