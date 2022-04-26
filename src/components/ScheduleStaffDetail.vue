<script>
import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'

import { genderFilter, orderStatusFilter, bookingStatusFilter, orderPaymentMethodFilter, orderSourceFilter, paymentStatusMapFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

import pageMixin from '@src/mixins/pagination'

import { PortalTarget } from 'portal-vue'

export default {
  page: {
    title: '訂單查詢',
    meta: [{ name: 'description', content: 'Order List' }],
  },
  components: {
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    OrderDetail: () => lazyLoadComponent(import('@components/Order/OrderDetail')),
    PortalTarget,
    BaseButtonDialog,
    StaffForm: () => lazyLoadComponent(import('@components/ScheduleStaffForm')),
    OrderForm: () => lazyLoadComponent(import('@views/schedule/components/OrderForm')),
  },
  filters: {
    genderFilter,
    orderStatusFilter,
    bookingStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
    paymentStatusMapFilter
  },
  mixins: [pageMixin],
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      componentKey:0,
      drawerVisible: false,
      drawerOrderData: '',
      loadedOrders: [],
      tryingToGetOrder: false,
      filterMonth: new Date(),
      avatarWidth: 130,

      dialogVisible: false,
      dialogItem: {},
      visibleEdit: false,
    }
  },
  computed: {
    fetchDataParams() {
      const routeQuery = this.$route.query
      const queryData = Object.assign(routeQuery, this.pageQuery)
      return {
        id: this.defaultValue.id,
        date: this.filterMonth,
        ...queryData,
      }
    },
    storeTitles() {
      return this.defaultValue.storeTitles.join('、')
    },
    userGroupTitles() {
      // console.log(this.defaultValue.userGroups)
      const titles = this.defaultValue.userGroups.map((item) => item.title)
      return titles.join('、')
    },
  },
  watch: {
    defaultValue: {
      handler: 'handleDefaultValueUpdate',
      immediate: true,
    },
    currentPage: {
      handler: 'tryToFetchList',
    },
  },
  methods: {
    tableRowClassName({ row }) {
      const rowStatus = row.status
      const usedStatus = row.groupSize / row.usedSize
      if (rowStatus === 0) return 'order--canceled'
      if (usedStatus === 1) return 'order--used'
    },
    async tryToGetOrder(orderId) {
      this.tryingToGetOrder = true
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    async tryToFetchList() {
      const detail = await this.$store.dispatch('schedule/fetchStaffDetail', this.fetchDataParams)
      this.$emit('update:defaultValue', detail)
    },
    goBack() {
      this.$emit('back')
    },
    handleDefaultValueUpdate() {
      this.$nextTick(() => {
        const {
          orders: {
            items,
            pagination: { total },
          },
        } = this.defaultValue
        this.loadedOrders = items
        this.$refs.pagination.updateTotal(total)
      })
    },
    closeEdit() {
      this.visibleEdit = false
    },
    // closeDialog() {
    //   this.dialogVisible = false
    //   this.dialogItem = {}
    // },
    onClickEdit() {
      const { ordersCount, ordersTotal, orders, ...dialogItem } = this.defaultValue
      this.dialogItem = dialogItem
      this.visibleEdit = true
      // this.dialogVisible = true
    },
    onCellClick(row) {
      this.tryToGetOrder(row.id)
    },
  },
}
</script>

<template>
  <div>
    <template v-if="!visibleEdit">
      <div v-if="type !== 'employee'" :class="[$style['header'], $style['flex']]" style="padding-top:0">
        <div><el-page-header content="人員詳情" @back="goBack"></el-page-header></div>
      </div>
      <el-card :class="[$style['info'], { isEmployee: type === 'employee' }]" :shadow="'never'">
        <div class="half-upper Jost">
          <el-avatar class="avatar" :src="defaultValue.avatar" :size="avatarWidth"></el-avatar>
          <div class="basic-info" :style="{ '--avatar-width': avatarWidth }">
            <div :class="$style.flex">
              <div>
                <div class="name"
                  >{{ defaultValue.name }} <span :class="[$style['block-label'], { [$style['is-disabled']]: defaultValue.block }]">{{ defaultValue.block === 0 ? '啟用中' : '停權中' }}</span></div
                >
                <div class="title">{{ defaultValue.title }} | {{ userGroupTitles }}</div>
              </div>
              <el-button class="is-round" type="primary" plain @click="onClickEdit"
                ><span class="hidden-mobile">編輯</span><span class="visible-mobile"><BaseIcon name="edit"></BaseIcon></span
              ></el-button>
            </div>
            <div class="contact" :class="$style.flex">
              <div><BaseIcon name="phone"></BaseIcon>{{ defaultValue.phoneNumber }}</div>
              <div><BaseIcon name="envelope"></BaseIcon>{{ defaultValue.email }}</div>
              <!-- <div><BaseIcon name="user"></BaseIcon>可同時服務 2 人</div> -->
              <div v-if="type !== 'employee'"
                ><BaseIcon name="briefcase"></BaseIcon>{{ `${defaultValue.takeOfficeDate || ''} - ${defaultValue.leaveOfficeDate ? defaultValue.leaveOfficeDate + '(離職)' : '目前在職中'}` }}</div
              >
            </div>
          </div>
        </div>
        <div class="trivial">
          <div
            ><span class="title">可服務地點</span><span class="content">{{ storeTitles }}</span></div
          >
          <!-- <div
            ><span class="title">可服務地點</span><span class="content"><span v-for="item in defaultValue.storeTitles" :key="item">{{item}}</span></span></div
          > -->
          <div
            ><span class="title">可同時服務人數</span><span class="content">{{ defaultValue.maxCollision || '無' }}</span></div
          >
          <div
            ><span class="title">證照</span><span class="content">{{ defaultValue.certificate || '無' }}</span></div
          >
          <div
            ><span class="title">專長</span><span class="content">{{ defaultValue.specialty || '無' }}</span></div
          >
          <div
            ><span class="title">介紹</span><span class="content">{{ defaultValue.description || '無' }}</span></div
          >
        </div>
      </el-card>

      <div class="Jost" :class="$style.statistics">
        <div class="block full"
          ><BaseIcon name="calendar" :icon-style="'fal'"></BaseIcon
          ><el-date-picker v-model="filterMonth" type="month" placeholder="不限月份" value-format="yyyy-MM" @change="tryToFetchList"></el-date-picker
        ></div>
        <div class="block"
          ><BaseIcon name="cut" :icon-style="'fal'"></BaseIcon>
          <div class="block-more">
            <span>訂單數累計 </span>
            <span >美容師 {{ defaultValue.ordersCount }} 筆訂單</span>
            <span >助理 {{ defaultValue.helperOrderCount }} 筆訂單</span>
          </div>
        </div>
        <div class="block"
          ><BaseIcon name="money-check-alt" :icon-style="'fal'"></BaseIcon>
          <div class="block-more">
            <span>訂單累計 </span>
            <span >美容師 ${{ defaultValue.allActualPayTotal }}</span>
            <span >助理 ${{ defaultValue.helperAllActualPayTotal }}</span>
          </div>
        </div>
        <div class="block"
          ><BaseIcon name="file-invoice-dollar" :icon-style="'fal'"></BaseIcon>
          <div class="block-more">
            <span>接單累計 </span>
            <span >美容師 ${{ defaultValue.allSalesTotal }}</span>
            <span >助理 ${{ defaultValue.helperAllSalesTotal }}</span>
          </div>
        </div>
        <div class="block">
          <BaseIcon name="clock" :icon-style="'fal'"></BaseIcon>
          <div class="block-more">
            
            <span>當月排班 </span>
            <span>{{ defaultValue.scheduleTotalHours.toFixed(1) }}小時</span>
          </div>
        </div>
      </div>
      <div class="el-table-wrapper">
        <el-table
          v-if="type !== 'employee'"
          v-loading.fullscreen.lock="tryingToGetOrder"
          element-loading-text="取得訂單資訊中"
          :data="loadedOrders"
          :default-sort="{ prop: 'created', order: 'descending' }"
          :row-class-name="tableRowClassName"
          @cell-click="onCellClick"
        >
          <el-table-column v-slot="{ row }" label="#訂單編號" min-width="200">
            <div class="Jost">{{ `#${row.id}` }}</div>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="付款狀態" width="100">
            <BaseStateLabel :state="row.paymentStatus | paymentStatusMapFilter('color')" text>{{ row.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="預約狀態" width="100">
            <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="客戶資訊" width="110">
            <div>{{ row.fullName }} {{ row.gender | genderFilter }}</div>
          </el-table-column>
          <el-table-column v-slot="{ row }" label="地點&預約項目時間" width="190">
            <div>
              <b>{{ row.productName }}</b>
              <div class="Jost">{{ row.date | formatDate }} {{ row.time }}</div>
            </div>
          </el-table-column>
          <el-table-column width="110">
            <template slot="header">
              訂單金額 <el-tooltip content="訂單金額以折扣後計算(包含預付扣款)" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip>
            </template>
            <template slot-scope="scope"> ${{ scope.row.allActualPayTotal }} </template>
            <!-- <div class="Jost">${{ row.allTotal }}</div> -->
            <!-- <div class="Jost">${{ row.priceTotal }}</div> -->
          </el-table-column>
          <el-table-column width="110">
            <template slot="header">
              接單金額 <el-tooltip content="接單金額以服務項目和加購項目的售價計算" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip>
            </template>
            <template slot-scope="scope"> ${{ scope.row.allSalesTotal }} </template>
            <!-- <div class="Jost">${{ row.allTotal }}</div> -->
          </el-table-column>
          <!-- <el-table-column v-slot="{ row }">
        <el-button class="is-round is-dark" @click="tryToGetOrder(row.id)">查看詳情</el-button>
      </el-table-column> -->
        </el-table>
        <el-table
          v-else
          v-loading.fullscreen.lock="tryingToGetOrder"
          element-loading-text="取得訂單資訊中"
          :data="loadedOrders"
          :default-sort="{ prop: 'created', order: 'descending' }"
          :row-class-name="tableRowClassName"
          @cell-click="onCellClick"
        >
          <el-table-column v-slot="{ row }" label="#訂單編號" min-width="200">
            <div class="Jost">{{ `#${row.id}` }}</div>
          </el-table-column>

          <el-table-column v-slot="{ row }" label="預約狀態" width="100">
            <BaseStateLabel state="info" text>{{ row.status | bookingStatusFilter('text') }}</BaseStateLabel>
          </el-table-column>

          <el-table-column width="110" align="right">
            <template slot="header"
              >訂單金額
              <!-- 訂單金額 <el-tooltip content="訂單金額以折扣後計算(包含預付扣款)" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip> -->
            </template>
            <template slot-scope="scope"> ${{ scope.row.allActualPayTotal }} </template>
          </el-table-column>
          <el-table-column width="110" align="right">
            <template slot="header"
              >接單金額
              <!-- 接單金額 <el-tooltip content="接單金額以服務項目和加購項目的售價計算" placement="right"> <BaseIcon name="info-circle" /> </el-tooltip> -->
            </template>
            <template slot-scope="scope"> ${{ scope.row.allPayTotal }} </template>
          </el-table-column>
        </el-table>
      </div>
      <BasePagination ref="pagination" :current-page.sync="currentPage" />
      <el-drawer ref="orderFormEdit" class="only-close"
        :visible.sync="drawerVisible" 
        append-to-body 
        :size="$root.isSmallDevice ? '100%' : '90%'" 
        destroy-on-close
        :wrapper-closable = "false"
        custom-class="order-drawer"
        @closed="componentKey++"
      > 
        <OrderForm 
          ref="orderDetail"
          :key="componentKey"
          :default-value.sync="drawerOrderData" 
          @update="tryToFetchList"
        />
      </el-drawer>
      <!-- <el-drawer :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" class="isRWD" destroy-on-close>
        <PortalTarget slot="title" name="drawer-header"></PortalTarget>
        <OrderDetail ref="orderDetail" :default-value.sync="drawerOrderData" @update="tryToFetchList" />
      </el-drawer> -->
      <!-- <BaseButtonDialog title="編輯人員" :dialog-visible.sync="dialogVisible" floating only-dialog>
      <StaffForm :default-value="dialogItem" @store="tryToFetchList" @close="closeDialog" />
    </BaseButtonDialog> -->
    </template>
    <StaffForm v-if="visibleEdit && type !== 'employee'" :default-value="dialogItem" @store="tryToFetchList" @close="closeEdit" />
    <StaffForm v-if="visibleEdit && type === 'employee'" access-type="employee" :default-value="dialogItem" @store="tryToFetchList" @close="closeEdit" />
  </div>
</template>
<style lang="scss" module>
@import '@design';
.header {
  padding: 27px 0;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  @include pad {
    flex-wrap: wrap;
  }
}
.info {
  &:global {
    &.isEmployee {
      margin-top: 40px;
      @include pad {
        border: 0;
        margin-top: 0;
      }
      .el-avatar {
        @include pad {
          display: none;
        }
      }
    }
  }
  :global {
    .el-card__body {
      padding: 34px 45px;
      @include pad {
        padding: 1rem;
      }
    }
    .half-upper {
      display: flex;

      @include max-sm {
        flex-direction: column;
        align-items: center;
      }
      .basic-info {
        padding-left: 45px;
        width: calc(100% - (var(--avatar-width) * 1px));
        @include pad {
          width: 100%;
          padding-left: 0;
        }
        .name {
          font-size: 20px;
          letter-spacing: 2px;
          line-height: 29px;
          font-weight: 500;
        }
        .title {
          margin-top: 10px;
          color: $color-primary;
          letter-spacing: 2.8px;
          line-height: 20px;
        }
        button {
          padding: 12px 34px;
          @include pad {
            padding: 12px 20px;
          }
        }
        .contact {
          font-size: 14px;
          color: #726f65;
          padding-bottom: 25px;
          border-bottom: 2px solid #c6c6ba;
          margin-top: 42px;
          letter-spacing: 0.7px;
          margin-bottom: 34px;
          @include pad {
            margin-top: 30px;
            padding-bottom: 10px;
            div {
              margin-bottom: 15px;
            }
          }
          svg {
            color: #726f65;
            margin-right: 8px;
            font-size: 16px;
          }
        }
      }
      .avatar {
        margin-bottom: 1rem;
      }
    }
    .trivial {
      div {
        display: flex;
        line-height: 25px;
        letter-spacing: 1.4px;
        margin-bottom: 10px;
        @include max-sm {
          flex-direction: column;
        }
        .title {
          flex-basis: 15%;
          color: $color-primary;
          @include pad {
            flex-basis: 10%;
          }
        }
        .content {
          flex-basis: 85%;
          padding-left: 30px;
          @include pad {
            flex-basis: 90%;
          }
          @include max-sm {
            padding-left: 0;
          }
        }
      }
    }
  }
}
.statistics {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
  background: white;
  @include pad {
    flex-wrap: wrap;
    width: auto;
    margin-left: -3px;
    margin-right: -3px;
  }
  :global {
    .block {
      display: flex;
      align-items: center;
      flex-grow: 1;
      flex-basis: 0;
      padding: 20px 10px;
      line-height: 46px;
      flex-direction: column;
      height: 127px;
      @include pad {
        &.full {
          width: 100%;
          padding: 0;
          svg {
            position: absolute;
            left: 36%;
          }
        }
        width: calc(50% - 6px);
        margin-left: 3px;
        margin-right: 3px;
        flex-basis: auto;
        flex-direction: row;
        border: $color-border-base 1px solid;
        border-radius: 10px;
        margin-bottom: 6px;
        padding: 1rem;
        line-height: 1.5;
        :global {
          .block-more {
            text-align: left;
            padding-top: 0;
          }
        }
      }

      @include max-sm {
        // width: calc(100% - 6px);
      }
      .el-date-editor--month {
        .el-input__prefix {
          font-size: 18px;
          color: $color-primary;
        }
        input {
          background: transparent;
          padding-left: 35px;
        }
      }
      svg {
        font-size: 20px;
        // margin-right: 10px;
        color: $color-primary;
        margin-top: 10px;
        @include pad {
          font-size: 16px;
          margin-top: 0;
          margin-right: 1rem;
        }
      }
      & + .block {
        border-left: 1px solid #c6c6ba;
        @include pad {
          border: $color-border-base 1px solid;
        }
      }
      .el-input__inner {
        padding: 0 !important;
        text-align: center;
      }
      .el-input__prefix {
        display: none;
      }
    }
  }
}
.block-label {
  border-radius: 8px;
  color: white;
  background: #60a32f;
  padding: 4px 7px;
  font-size: 12px;
  margin-left: 10px;
  font-weight: 300;
  &.is-disabled {
    background: #e35d5d;
  }
}
</style>
