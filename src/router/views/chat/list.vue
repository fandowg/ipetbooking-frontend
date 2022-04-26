<script>
import Layout from '@layouts/main'
import pageMixin from '@src/mixins/pagination'
import { genderFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import lazyLoadComponent from '@router/lazyload-component'
import { memberComputed } from '@state/helpers'
import { debounce } from 'lodash'

export default {
  page: {
    title: '訊息回覆',
    meta: [{ name: 'description', content: 'Chat List' }],
  },
  components: {
    Layout,
  },
  filters: {
    genderFilter,
    formatDate,
    formatTimeOrDate(date) {
      const isToDay = new Date(date).getDate() === new Date().getDate()
      return isToDay ? formatDate(date, 'time') : formatDate(date)
    },
  },
  mixins: [pageMixin],
  data() {
    return {
      loadedData: [],
      filterData: {
        is_read: 'all',
        order: 'desc',
        type: 'chat',
      },
      stateList: Object.freeze([
        {
          label: '全部',
          value: 'all',
        },
        {
          label: '未讀',
          value: 0,
        },
        {
          label: '已讀',
          value: 1,
        },
      ]),
      sortByTime: Object.freeze([
        {
          label: '依時間遠近排序：近→遠',
          value: 'desc',
        },
        {
          label: '依時間遠近排序：遠→近',
          value: 'asc',
        },
      ]),
    }
  },
  watch: {
    currentPage: {
      handler: 'tryToSearch',
      immediate: true,
    },
  },
  computed: {
    ...memberComputed,
  },
  methods: {
    async tryToSearch() {
      const query = {
        ...this.filterData,
        ...this.pageQuery,
      }
      query.is_read === 'all' && delete query.is_read
      const { items, total } = await this.$store.dispatch('member/fetchChats', query)
      this.loadedData = items
      this.$nextTick(() => {
        this.$refs.pagination.updateTotal(total)
      })
    },
    goToChatDetail(row) {
      const { member_id } = row

      this.$router.push({
        name: 'view-chat',
        params: {
          memberId: member_id,
        },
      })
    },
    tableRowClassName({ row, rowIndex }) {
      return row.unreadCount ? this.$style['unread-chat'] : ''
    },
  },
}
</script>

<template>
  <Layout>
    <BasePageHeader>
      <template v-slot:title
        >訊息回覆</template
      >
    </BasePageHeader>

    <BaseTableSearch v-slot="{ fields }" :default-value="filterData" @reset="tryToSearch">
      <el-form-item prop="is_read">
        <el-select v-model="fields.is_read" placeholder="讀取狀態" @change="tryToSearch">
          <el-option v-for="(state, stateValue) in stateList" :key="stateValue" :label="`讀取狀態：${state.label}`" :value="state.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="order">
        <el-select v-model="fields.order" placeholder="依時間遠近排序" @change="tryToSearch">
          <el-option v-for="(sort, index) in sortByTime" :key="index" :label="sort.label" :value="sort.value"></el-option>
        </el-select>
      </el-form-item>
    </BaseTableSearch>

    <el-table :data="loadedData" @row-click.once="goToChatDetail" :class="$style['member-table']" :row-class-name="tableRowClassName">
      <el-table-column v-slot="{ row }" label="" width="50">
        <div v-if="row.unreadCount > 0" :class="$style.unreadDot"></div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="姓名電話" width="200">
        <b>{{ row.name }}</b>
        <div>{{ `${row.phoneCode} ${row.phoneNumber}` }}</div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="訊息內容" width="550">
        <div style="height: 46px;">
          {{ row.message || '客戶傳送了圖片。' }}
        </div>
      </el-table-column>
      <el-table-column v-slot="{ row }" label="時間" :align="'center'"
        ><div style="text-align:right;">{{ row.created_at | formatTimeOrDate }} </div></el-table-column
      >
    </el-table>
    <BasePagination ref="pagination" :current-page.sync="currentPage" />
  </Layout>
</template>
<style lang="scss" module>
@import '@design';

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
  background-color: #bf7e45 !important;
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

.unreadDot {
  margin: 0 auto;
  height: 10px;
  width: 10px;
  background: $color-primary;
  border-radius: 25px;
}

tr.unread-chat {
  background-color: lighten($color-primary, 40%);
}
</style>
