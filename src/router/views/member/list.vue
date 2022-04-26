<script>
import Layout from '@layouts/main'
import pageMixin from '@src/mixins/pagination'
import { genderFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import { memberComputed } from '@state/helpers'
import { debounce } from 'lodash'

export default {
  page: {
    title: '客戶管理',
    meta: [{ name: 'description', content: 'Member List' }],
  },
  components: {
    Layout,
    BaseButtonDialog,
    NotificationWrite: () =>
      lazyLoadComponent(import('@components/NotificationWrite')),
    TagPopover: () => lazyLoadComponent(import('./components/TagPopover')),
  },
  filters: {
    genderFilter,
    formatDate,
  },
  mixins: [pageMixin],
  data() {
    return {
      loadedData: [],
      dialogVisible: false,
      selectAllDialogVisible: false,
      selectedMember: [],
      filterData: {
        tagIds: [],
        search:''
      },
      tagList: [],
      tryingFetchTag: false,
      membersLimit: 0,
      membersUsed: 0,
      isFilterChange: false,
    }
  },
  watch: {
    currentPage: {
      handler: 'tryToSearch',
      // immediate: true,
    },
    filterData: {
      handler() {
        this.isFilterChange = true
      },
      deep: true,
    },
  },
  created() {
    const page = this.$route.params.pagination
    if(page){
      this.currentPage=page
      this.tryToSearch()
    }else{
      this.tryToSearch()
    }
    this.handleSelectChange = debounce(async (searchValue) => {
      this.tryToSearch()
    }, 300)
  },
  computed: {
    ...memberComputed,
    disabledSnedBtn() {
      return this.selectedMember.length === 0
    },
    memberIds() {
      return this.selectedMember.map((member) => member.id)
    },
    showUsageWarning() {
      if(this.membersLimit === 0) return false
      const percent10 = this.membersLimit / 10
      const remnant = this.membersLimit - this.membersUsed
      return percent10 >= remnant
    }
  },
  methods: {
    async tryToSearchFilter() {
      // 當篩選前不在第一頁的時候，跳回第一頁
      if ( this.currentPage !== 1) {
        this.currentPage = 1
        return
      }
      let query = Object.assign({}, this.$route.query, this.pageQuery)
      if (this.filterData.tagIds.length > 0 || this.filterData.search)
        query = Object.assign(query, this.filterData)
      const { items, membersLimit, membersUsed, total } = await this.$store.dispatch(
        'member/fetchList',
        query
      )
      this.loadedData = items
      this.membersUsed = membersUsed
      this.membersLimit = membersLimit
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
      this.isFilterChange=false
    },
    currentPageLimit(){
      const remainder = this.$refs.pagination.total % this.$refs.pagination.pageSize
      const qotient = this.$refs.pagination.total / this.$refs.pagination.pageSize
      const totalPage = remainder ? parseInt(qotient) + 1 : parseInt(qotient)
      if (this.currentPage > totalPage) {
        this.currentPage = totalPage
      }
    },
    async tryToSearch() {
      let query = Object.assign({}, this.$route.query, this.pageQuery)
      if (this.filterData.tagIds.length > 0 || this.filterData.search)
        query = Object.assign(query, this.filterData)
      const { items, membersLimit, membersUsed, total } = await this.$store.dispatch(
        'member/fetchList',
        query
      )
      this.loadedData = items
      this.membersUsed = membersUsed
      this.membersLimit = membersLimit
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
        this.currentPageLimit()
      })
    },
    goToMemberDetail(row) {
      const { id: memberId } = row
      this.$router.push({
        name: 'view-member',
        params: {
          memberId,
          pagination:this.currentPage
        },
      })
    },
    handleSelectionChange(value) {
      this.selectedMember = value
    },
    closeDialog() {
      this.dialogVisible = false
    },
    handleSelectAll(value) {
      if (value.length > 0) this.selectAllDialogVisible = true
    },
    handleSelectAllMember() {
      this.selectedMember = this.members
      this.selectAllDialogVisible = false
    },
    async tryToFetchTag() {
      this.tryingFetchTag = true
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search: '',
      })
      this.tryingFetchTag = false
    },
  },
}
</script>

<template>
  <Layout>
    <div :class="$style.btnTop" class="btn-top-box">
   <TagPopover :selected-member="selectedMember" @update="tryToSearch" />
        <span>
          <el-button class="is-round"
                     :disabled="disabledSnedBtn"
                     @click="dialogVisible = true"
          >
          <BaseIcon name="mail-bulk" />
          <span>群發通知</span>
        </el-button>
        </span>
         <span>
           <el-input v-model.trim.lazy="filterData.search" clearable placeholder="請輸入客戶姓名或是手機號碼" @input="handleSelectChange">
             <BaseIcon slot="prefix" name="search" class="el-input__icon" />
           </el-input>
         </span>
    </div>
    <el-alert
      v-if="showUsageWarning"
      :title="`您目前的會員人數： ${membersUsed} / ${membersLimit} 。提醒您，會員人數達到上限時，新客將無法在您的前台訂購商品，欲擴增會員額度請聯絡業務處理。`"
      show-icon
      :closable="true"
      :class="$style.warning"
    ></el-alert>
    <BaseTableSearch
      v-slot="{ fields }"
      hide-action
      :default-value.sync="filterData"
      @reset="tryToSearch"
      @tryToFetchList="tryToSearchFilter"
    >
      <el-form-item prop="tagIds" label="標籤：" >
        <el-select
          v-model="fields.tagIds"
          style="width: 400px;"
          value-key="id"
          multiple
          placeholder="過濾標籤"
          :loading="tryingFetchTag"
          :loading-text="'取得資料中...'"
          @change="tryToSearchFilter"
          @focus="tryToFetchTag"
        >
          <el-option
            v-for="(tag, index) in tagList"
            :key="`list-tag-${index}`"
            :label="tag.title"
            :value="tag.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </BaseTableSearch>

    <div class="el-table-wrapper">

    <el-table
      :data="loadedData"
      :class="$style['member-table']"
      @row-click.once="goToMemberDetail"
      @selection-change="handleSelectionChange"
      @select-all="handleSelectAll"
    >
      <el-table-column type="selection" min-width="55"> </el-table-column>
      <el-table-column v-slot="{ row }" label="姓名電話" min-width="150">
        <b>{{ row.fullName }} {{ row.gender | genderFilter }}</b>
        <div>{{ `${row.phoneCode} ${row.phoneNumber}` }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="標籤" min-width="160">
        <div>
          <el-tag
            v-for="tag in row.tags"
            :key="`tag-${tag.id}`"
            :type="'info'"
            effect="plain"
            disable-transitions
          >
            {{ tag.title }}
          </el-tag>
        </div>
      </el-table-column>
      <el-table-column
        label="有效訂單筆數"
        prop="ordersCounts"
        min-width="150"
      ></el-table-column>
      <el-table-column
        label="累積消費金額"
        prop="ordersTotal"
        min-width="120"
      ></el-table-column>
      <el-table-column v-slot="{ row }" label="最後訂單日期" min-width="150">{{
        row.lastOrderDate | formatDate('dateTime')
      }}</el-table-column>
      <el-table-column min-width="40">
        <el-tooltip content="查看客戶詳細資料" placement="top">
          <el-button  type="text">
            <BaseIcon name="ellipsis-v" />
          </el-button>
        </el-tooltip>
      </el-table-column>
    </el-table>
    </div>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />

    <BaseButtonDialog
      :only-dialog="true"
      :title="'撰寫通知'"
      :dialog-visible.sync="dialogVisible"
      :destroy="true"
      floating
    >
      <NotificationWrite
        :source-name="'memberList'"
        :selected-member-ids="memberIds"
        @close="closeDialog"
      />
    </BaseButtonDialog>

    <el-dialog
      :visible.sync="selectAllDialogVisible"
      :title="'請選擇全選範圍'"
      top="0"
      width="30%"
      append-to-body
      :destroy-on-close="true"
    >
      <div style="margin-bottom: 20px;">
        <el-button class="is-round"
          style="width: 100%;"
          plain
          @click="selectAllDialogVisible = false"
          >選取這個頁面上全部 {{ loadedData.length }} 個客戶</el-button
        >
      </div>
      <div>
        <el-button class="is-round" style="width: 100%;" plain @click="handleSelectAllMember"
          >選取所有分頁全部共 {{ members.length }} 個客戶</el-button
        >
      </div>
    </el-dialog>
  </Layout>
</template>
<style lang="scss" module>
.member-table {
  :global {
    .el-tag {
      border-color: #808080;
      border-radius: 3px;
      height: 25px;
      line-height: 25px;
      color: #808080;
      margin-bottom: 10px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
  }
}

.warning {
  background-color: #BF7E45 !important;
  color: white !important;
  margin-top: -20px;
  margin-bottom: 20px;
  padding: 18px 16px;
  :global {
    .el-alert__closebtn {
      color: white !important;
      top: 18px;
      font-size: 18px;
    }
  }
}

.btnTop {
  @include max-sm {
    > * {
      &:nth-child(1) {
        width: 50%;
      }

      &:nth-child(2) {
        width: 50%;
      }
    }
  }
}
</style>
