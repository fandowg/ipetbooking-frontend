<script>
// import lazyLoadComponent from '@router/lazyload-component'
// import { orderStatusFilter, orderSourceFilter } from '@utils/filter-value-to-text'
// import formatDate from '@utils/format-date'
// import { PortalTarget } from 'portal-vue'
import pageMixin from '@src/mixins/pagination'
import { genderFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
// import lazyLoadComponent from '@router/lazyload-component'
import { memberComputed } from '@state/helpers'
import { debounce } from 'lodash'

export default {
  components: {
    // PortalTarget,
    // BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    // OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
  },
  filters: {
    genderFilter,
    formatDate,
  },
  mixins: [pageMixin],
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [
        {
          id: 1223,
        },
      ],
      allMembers: [],
      dialogVisible: false,
      selectAllDialogVisible: false,
      selectedMember: [],
      // filterData: {
      //   tagIds: [],
      // },
      tagList: [],
      tryingToSend: false,
      tryingFetchTag: false,
      membersLimit: 0,
      membersUsed: 0,
      // selectedCoupons: [],
      // loadedOrders: [],
      // tryingToGetOrder: false,
      // drawerVisible: false,
      // drawerOrderData: '',
    }
  },
  computed: {
    ...memberComputed,
    enabledBulkButton() {
      return this.selectedMember.length === 0
    },
    enabledCopyButton() {
      return this.selectedMember.length === 1
    },
    memberIds() {
      return this.selectedMember.map((member) => member.id)
    },
    availableMembers() {
      let filterMembers = []
      if (this.defaultValue.availableTags.length === 0 && this.defaultValue.availableMembers.length === 0) {
        filterMembers = this.allMembers
      } else {
        const availableTagIds = this.defaultValue.availableTags.map((item) => item.id)
        const availableMemberIds = this.defaultValue.availableMembers.map((item) => item.id)
        const blockMemberIds = this.defaultValue.blockMembers.map((item) => item.id)
        filterMembers = this.allMembers.filter((member) => {
          const tagids = member.tags.map((item) => item.id)
          const isAvailable = tagids.some((item) => {
            return availableTagIds.includes(item)
          })
          if (isAvailable && !blockMemberIds.includes(member.id)) {
            return true
          } else {
            if (availableMemberIds.includes(member.id)) {
              return true
            }
          }
        })
      }
      return filterMembers
    },
    /*  availableMembers() {
      let filterMembers = []
      const availableTagIds = this.defaultValue.availableTags.map((item) => item.id)
      const availableMemberIds = this.defaultValue.availableMembers.map((item) => item.id)
      const blockMemberIds = this.defaultValue.blockMembers.map((item) => item.id)
      filterMembers = this.allMembers.filter((member) => {
        const tagids = member.tags.map((item) => item.id)
        const isAvailable = tagids.some((item) => {
          return availableTagIds.includes(item)
        })
        if (isAvailable && !blockMemberIds.includes(member.id)) {
          return true
        } else {
          if (availableMemberIds.includes(member.id)) {
            return true
          }
        }
        // availableTagIds.some()
        // return tagids.includes()
      })
      // filterMembers.forEach(item =>{
      //   if(blockMemberIds.includes(item.id))
      // })
      return filterMembers
    }, */
  },

  // watch: {
  //   currentPage: {
  //     handler: 'tryToSearch',
  //     immediate: true,
  //   },
  // },
  created() {
    this.tryToSearch()
    // this.handleSelectChange = debounce(async (searchValue) => {
    //   this.tryToSearch()
    // }, 1000)
  },
  methods: {
    async tryToSearch() {
      let query = Object.assign({}, this.$route.query, this.pageQuery)
      // if (this.filterData.tagIds.length > 0)
      //   query = Object.assign(query, this.filterData)
      const { items, membersLimit, membersUsed, total } = await this.$store.dispatch(
        'member/fetchList'
        // query
      )
      this.allMembers = items
      this.membersUsed = membersUsed
      this.membersLimit = membersLimit
      // this.$nextTick(() => {
      //   this.$refs.pagination.updateTotal(total)
      // })
    },
    handleSelectionChange(selected) {
      this.selectedMember = selected
    },
    async tryToFetchTag() {
      this.tryingFetchTag = true
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search: '',
      })
      this.tryingFetchTag = false
    },
    async tryToRemove() {
      await this.$confirm('確定刪除該適用對象？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
    },
    // async tryToSendAll() {
    //   await this.$confirm(`確定發送${this.availableMembers.length}張優惠券`, {
    //     confirmButtonText: '確定',
    //     cancelButtonText: '取消',
    //     // type: 'warning',
    //     center: true,
    //   })
    // },
    async tryToSend(type) {
      try {
        if (type === 'selected') {
          await this.$confirm(`確定發送${this.selectedMember.length}張優惠券`, {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            // type: 'warning',
            center: true,
          })
        }
        if (type === 'all') {
          await this.$confirm(`確定發送${this.availableMembers.length}張優惠券`, {
            confirmButtonText: '確定',
            cancelButtonText: '取消',
            // type: 'warning',
            center: true,
          })
        }
        this.tryingToSend = true
        const sendData = {
          memberIds: type === 'selected' ? this.memberIds : this.availableMembers.map((item) => item.id),
          couponCode: this.defaultValue.code,
        }
        // console.log('準備發送')
        await this.$store.dispatch('coupon/sendCoupon', sendData)
        // console.log('發送完成')
        this.$message({ message: '發送成功！', type: 'success' })
      } finally {
        this.tryingToSend = false
      }
    },
    changePage(value) {
      this.$emit('changePage', value)
    },
    // calcRowClassName({ row }) {
    //   const orderStatus = row.status
    //   const orderUsedStatus = row.groupSize / row.usedSize

    //   if (orderStatus === 0) return 'order--canceled'
    //   if (orderUsedStatus === 1) return 'order--used'
    // },
    // async tryToGetOrder(row) {
    //   this.tryingToGetOrder = true
    //   this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', row.id)
    //   this.tryingToGetOrder = false
    //   this.drawerVisible = true
    // },
    // async tryToSearchOrder() {
    //   this.$store.dispatch('coupon/getOrders', this.$route.params.couponId).then(({ items }) => {
    //     this.loadedOrders = items
    //   })
    // },
  },
}
</script>

<template>
  <div>
    <BasePageHeader>
      <template v-slot:title>優惠券之適用對象</template>
      <template v-slot:right>
        <el-button type="text" @click="changePage(0)">
          <span>編輯適用對象</span>
        </el-button>
        <el-button class="is-round" @click="tryToSend('all')">
          <span>全部發送</span>
        </el-button>
        <el-button class="is-round" :disabled="enabledBulkButton" @click="tryToSend('selected')">
          <span>選取發送</span>
        </el-button>
        <!-- <el-button class="is-round" type="danger" :disabled="enabledBulkButton" @click="tryToRemove">
          <BaseIcon name="trash-alt" />
          <span>刪除</span>
        </el-button> -->
        <!-- <el-button class="is-round" :disabled="!enabledCopyButton" >
          <BaseIcon name="copy" />
          <span>複製</span>
        </el-button> -->
      </template>
    </BasePageHeader>
    <div class="el-table-wrapper">
      <el-table element-loading-text="取得適用對象資訊中" :data="availableMembers" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column v-slot="{ row }" label="姓名電話" :min-width="11">
          <b>{{ row.fullName }} {{ row.gender | genderFilter }}</b>
          <div>{{ `${row.phoneCode} ${row.phoneNumber}` }}</div>
        </el-table-column>
        <el-table-column v-slot="{ row }" label="標籤" :min-width="11">
          <div>
            <el-tag v-for="tag in row.tags" :key="`tag-${tag.id}`" :type="'info'" effect="plain" disable-transitions>
              {{ tag.title }}
            </el-tag>
          </div>
        </el-table-column>
        <el-table-column label="有效訂單" :min-width="11" prop="ordersCounts"></el-table-column>
        <el-table-column label="累積消費金額" :min-width="11" prop="ordersTotal"></el-table-column>
        <el-table-column v-slot="{ row }" :min-width="11" label="最後訂單日期">{{ row.lastOrderDate | formatDate('dateTime') }}</el-table-column>
      </el-table>
    </div>
    <!-- <BasePagination ref="pagination" :current-page.sync="currentPage" /> -->
  </div>
</template>
