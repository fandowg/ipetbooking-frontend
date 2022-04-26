<script>
import lazyLoadComponent from '@router/lazyload-component'
import pageMixin from '@src/mixins/pagination'

import {
  genderFilter,
  orderStatusFilter,
  orderPaymentMethodFilter,
  orderSourceFilter,
} from '@utils/filter-value-to-text'
import formatDate, { formatRequestData } from '@utils/format-date'

export default {
  components: {
    At: () => lazyLoadComponent(import('@components/At')),
    BaseStateLabel: () =>
      lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {
    genderFilter,
    orderStatusFilter,
    orderPaymentMethodFilter,
    orderSourceFilter,
    formatDate,
  },
  mixins: [pageMixin],
  props: {
    selectedMemberIds: {
      type: Array,
      default: () => {
        return []
      },
    },
    selectedOrderIds: {
      type: Array,
      default: () => {
        return []
      },
    },
    sourceName: {
      type: String,
      default: 'reception',
    },
    sourceInventory: {
      type: Object,
      default: () => {},
    },
    sourceOrder: {
      type: Object,
      default: () => {},
    },
    sourceMember: {
      type: Object,
      default: () => {},
    },
    sourceMemberList: {
      type: Object,
      default: () => {},
    },
    productName: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      submitData: {
        // mode: 'byOrder',
        orderIds: [],
        memberIds: this.selectedMemberIds,
        templateContent: '',
        router: 'sms',
        sendWhoType: 'onlyUser',
        subject: '',
      },
      router: ['sms'],
      sendWhoType: ['onlyUser'],
      mapTemplateString: {
        姓名: '黃大明',
        訂單成立時間: ' 2021/01/01 00:00 ',
        店家名稱: '小捲尾寵物美容',
        預約時間: ' 2021/01/03 13:00 ',
        付款時間: ' 2021/01/01 10:00 ',
        服務項目: '小捲尾美容SPA',
        // 短網址: ' https://ipb.pet/yoga ',
      },
      mapFixedPhrase: {
        reception: [
          '姓名',
          '店家名稱',
          '服務項目',
          '預約時間',
          // '短網址',
        ],
        order: ['姓名', '店家名稱', '服務項目', '預約時間'],
        memberList: ['姓名', '店家名稱'],
        member: ['姓名', '店家名稱'],
      },
      mapSubjectFixedPhrase: {
        reception: ['店家名稱', '服務項目'],
        order: ['店家名稱', '服務項目'],
        memberList: ['店家名稱'],
        member: ['店家名稱'],
      },
      orderList: [],
      target: 'all',
      previewSubjectTemplate: '',
      previewTemplate: '',
      tryingToSend: false,
      searchQuery: '',
      selectedCustom: [],
    }
  },
  computed: {
    memberIds() {
      return this.selectedMember.map((member) => {
        return member.id
      })
    },
    fetchDataParams() {
      const routeQuery = this.$route.query
      const queryData = Object.assign(routeQuery, this.pageQuery)
      const {
        startDate,
        endDate,
        dateType,
        ...filterDataWithoutDate
      } = this.filterData
      const searchWithDate = startDate && endDate
      const searchParams = searchWithDate
        ? Object.assign(this.filterData, {
            startDate: formatRequestData(startDate),
            endDate: formatRequestData(endDate),
          })
        : filterDataWithoutDate
      return Object.assign(searchParams, queryData)
    },
    isByOrder() {
      return this.sourceName === 'reception' || this.sourceName === 'order'
    },
    isByMember() {
      return this.sourceName === 'member' || this.sourceName === 'memberList'
    },
    showCustom() {
      return this.sourceName === 'reception' && this.target === 'custom'
    },
    showMessageContent() {
      if (this.isByOrder) {
        return this.router.length && this.sendWhoType.length
      } else {
        return !!this.router.length
      }
    }
  },
  watch: {
    currentPage: {
      handler: 'tryToFetchOrderList',
      immediate: true,
    },
  },
  methods: {
    async tryToFetchOrderList() {
      if (this.sourceName !== 'reception') return
      this.tryingToGetOrder = true

      const { items, total } = await this.$store.dispatch('order/fetchList', {
        inventoryId: this.sourceInventory.id,
        paymentMethod: 'All',
        limit: 0,
        search: this.searchQuery,
      })
      this.orderList = items
      this.tryingToGetOrder = false
      this.$nextTick(() => {
        // if (this.$refs.pagination !== undefined)
        //   this.$refs.pagination.updateTotal(total)
      })
    },
    emitClose() {
      this.$emit('close')
    },
    async tryToSend(data) {
      this.tryingToSend = true
      await this.$store.dispatch('merchant/sendNoti', data)
      this.$message({ message: '發送成功！', type: 'success' })
      this.tryingToSend = false
      // this.emitClose()
    },
    validataSubmitData() {
      if (this.target === 'custom' && this.selectedCustom.length === 0) {
        this.$message({ message: '請選擇發送對象！', type: 'error' })
        return
      }
      if (this.router.includes('email') && this.previewSubjectTemplate === '') {
        this.$message({ message: '請填寫 Email 主旨！', type: 'error' })
        return
      }
      if (this.previewTemplate === '') {
        this.$message({ message: '請填寫訊息內容！', type: 'error' })
        return
      }
      const sendData = {
        ...this.submitData,
        sendWhoType: this.isByMember
          ? undefined
          : this.submitData.sendWhoType,
        mode: this.isByOrder ? 'byOrder' : 'byMember',
        orderIds: this.target === 'all' ?  this.selectedOrderIds : this.selectedCustom,
        templateContent: this.previewTemplate,
        subject: this.previewSubjectTemplate
      }
      this.tryToSend(sendData)
    },
    getTemplate() {
      return this.$refs.template.getTemplateContent()
    },
    getSubjectTemplate() {
      if (this.$refs.subjectTemplate === undefined) return ''
      return this.$refs.subjectTemplate.getTemplateContent()
    },
    updateTemplate() {
      this.previewTemplate = this.$refs.template.getTemplateContent()
      this.$forceUpdate()
    },
    updateSubjectTemplate() {
      this.previewSubjectTemplate = this.$refs.subjectTemplate.getTemplateContent()
      this.$forceUpdate()
    },
    tableRowClassName({ row }) {
      const rowStatus = row.status
      const usedStatus = row.groupSize / row.usedSize
      if (rowStatus === 0) return 'order--canceled'
      if (usedStatus === 1) return 'order--used'
    },
    updateRouter(value) {
      this.router = value
      this.submitData.router = value[0]
      if (value.length === 2) this.submitData.router = 'all'
    },
    updateSendWhoType(value) {
      this.sendWhoType = value
      this.submitData.sendWhoType = value[0]
      if (value.length === 2) this.submitData.sendWhoType = 'all'
    },
    handleSelectionChange(value) {
      this.selectedCustom = value.map((order) => order.id)
    },
    previewContent(templateString = '') {
      let content = templateString
      if (content === null) return ''
      Object.keys(this.mapTemplateString).forEach((key) => {
        content = content.replace(
          new RegExp(`{${key}}`, 'g'),
          this.mapTemplateString[key]
        )
      })
      content = content.replace(new RegExp(`\n`, 'g'), '<br>')
      return content
    },
    sameAsUser(order) {
      if (order.member.fullName !== order.fullName) return false
      if (order.member.gender !== order.gender) return false
      if (order.member.phoneCode !== order.phoneCode) return false
      if (order.member.phoneNumber !== order.phoneNumber) return false
      return true
    },
  },
}
</script>

<template>
  <div :class="$style.write">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="source-info" :shadow="'never'">
          <h6 style="color: #53c2cc;">來源資訊</h6>
          <template v-if="sourceInventory !== undefined">
            <div>預約項目：{{ productName }}</div>
            <div>日期： {{ sourceInventory.date }}</div>
            <div
              >時間： {{ sourceInventory.startTime }} -
              {{ sourceInventory.endTime }}</div
            >
            <div
              >販售狀況： {{ sourceInventory.qty }} /
              {{ sourceInventory.infinity === 1 ? '無限' : sourceInventory.inventory }}</div
            >
          </template>
          <template v-if="sourceOrder !== undefined">
            <div>{{ `#${sourceOrder.id}` }}</div>
            <div
              >{{ sourceOrder.created | formatDate('dateTime') }} 成立訂單</div
            >
            <div>訂單來源：{{ sourceOrder.source | orderSourceFilter }}</div>
            <div style="margin-bottom: 16px;">{{
              sourceOrder.status | orderStatusFilter('text')
            }}</div>
            <div>預約項目：{{ sourceOrder.productName }}</div>
            <div
              >預約時間：{{ sourceOrder.date | formatDate }}
              {{ sourceOrder.time }}</div
            >
            <div style="margin-bottom: 16px;"
              >訂購項目：
              <span
                v-for="(param, index) in sourceOrder.params"
                :key="`${param.title}-${index}`"
              >
                {{ `${param.title}x${param.qty} ` }}
              </span>
            </div>
            <div>使用人姓名：{{ sourceOrder.fullName }}</div>
            <div
              >使用人電話：{{ sourceOrder.phoneCode }}
              {{ sourceOrder.phoneNumber }}</div
            >
            <div>電子信箱：{{ sourceOrder.email }}</div>
            <div>使用人備註：{{ sourceOrder.note || '無' }}</div>
          </template>
          <template v-if="sourceMember !== undefined">
            <div>客戶姓名：{{ sourceMember.fullName }}</div>
            <div
              >電話：{{ sourceMember.phoneCode }}
              {{ sourceMember.phoneNumber }}</div
            >
            <div>電子郵件：{{ sourceMember.email }}</div>
          </template>
          <template v-if="sourceName === 'memberList'">
            <p>已選擇名單上 {{ selectedMemberIds.length }} 位客戶</p>
          </template>
        </el-card>
        <p>發送方式（複選）</p>
      </el-col>
      <el-checkbox-group v-model="router" @change="updateRouter">

        <el-col :span="12">
          <el-checkbox label="email" border style="width: 100%;"
            >電子郵件</el-checkbox
          ></el-col
        >
        <el-col :span="12"
          ><el-checkbox label="sms" border style="width: 100%;"
            >簡訊</el-checkbox
          >
        </el-col>
      </el-checkbox-group>
      <template v-if="sourceInventory !== undefined">
        <el-col :span="24">
          <p>發送對象（單選）</p>
          <el-radio-group v-model="target" style="width: 100%;">
            <el-col :span="12" class="no-padding-left">
              <el-radio label="all" border style="width: 100%;"
                >全部名單</el-radio
              ></el-col
            >
            <el-col :span="12" class="no-padding-right"
              ><el-radio label="custom" border style="width: 100%;"
                >自訂</el-radio
              >
            </el-col>
          </el-radio-group>
        </el-col>

        <el-col v-show="showCustom" :span="24">
          <p>自訂發送對象：</p>

          <el-input
            v-model.trim.lazy="searchQuery"
            :class="$style.search"
            :placeholder="'搜尋訂單：輸入使用人姓名、手機號碼或訂單編號'"
            @keyup.native.enter="tryToFetchOrderList"
          >
            <BaseIcon slot="prefix" name="search" class="el-input__icon" />
          </el-input>

          <el-table
            v-loading="tryingToGetOrder"
            style="
              width: 100%;
              margin-bottom: 30px;
              border-right: 1px solid #f6f7fa;
              border-left: 1px solid #f6f7fa;
            "
            height="370"
            element-loading-text="取得訂單資訊中"
            :data="orderList"
            :default-sort="{ prop: 'created', order: 'descending' }"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <!-- <el-table-column v-slot="{ row }" type="expand">
              <el-table :data="[row]" border>
                <el-table-column v-slot="child" width="230" label="#訂單編號"
                  ><div>{{ `#${child.row.id}` }}</div></el-table-column
                >
                <el-table-column v-slot="child" label="狀態與來源"
                  ><BaseStateLabel
                    :state="child.row.status | orderStatusFilter('color')"
                    text
                    >{{
                      child.row.status | orderStatusFilter('text')
                    }}</BaseStateLabel
                  >
                  <br />
                  <BaseStateLabel state="info" text>{{
                    child.row.source | orderSourceFilter
                  }}</BaseStateLabel></el-table-column
                >
              </el-table>
            </el-table-column> -->

            <el-table-column v-slot="{ row }" label="#訂單編號" width="220">
              <div>{{ `#${row.id}` }}</div>
              <!-- <div>{{ row.created | formatDate('dateTime') }}</!-->
            </el-table-column>

            <!-- <el-table-column
            v-slot="{ row }"
            label="付款方式"
            width="100"
            sortable
            >{{ row.paymentMethod | orderPaymentMethodFilter }}</el-table-column
          > -->
            <el-table-column v-slot="{ row }" label="使用人">
              <div>{{ row.fullName }} {{ row.gender | genderFilter }}</div>
              <div style="color: #aaaaaa;">{{
                `${row.phoneCode} ${row.phoneNumber}`
              }}</div>
            </el-table-column>
            <el-table-column v-slot="{ row }" label="客戶">
              <template v-if="sameAsUser(row)">
                <div style="color: #aaaaaa;">同使用人</div>
              </template>
              <template v-else
                ><div
                  >{{ row.member.fullName }}
                  {{ row.member.gender | genderFilter }}</div
                >
                <div style="color: #aaaaaa;">{{
                  `${row.member.phoneCode} ${row.member.phoneNumber}`
                }}</div></template
              >
            </el-table-column>
            <el-table-column v-slot="{ row }" label="狀態與來源" width="120">
              <BaseStateLabel
                :state="row.status | orderStatusFilter('color')"
                text
                >{{ row.status | orderStatusFilter('text') }}</BaseStateLabel
              >
              <br />
              <BaseStateLabel state="info" text>{{
                row.source | orderSourceFilter
              }}</BaseStateLabel>
            </el-table-column>
            <!-- <el-table-column v-slot="{ row }" label="訂購項目">
            <div>
              <b>{{ row.productName }}</b>
            </div>
            <div>{{ row.date | formatDate }} {{ row.time }}</div>
          </el-table-column>
          <el-table-column v-slot="{ row }">
            <el-button @click="tryToGetOrder(row.id)">查看詳情</el-button>
          </el-table-column> -->
          </el-table>
          <!-- <BasePagination ref="pagination" :current-page.sync="currentPage" /> -->
        </el-col>
      </template>

      <template
        v-if="sourceInventory !== undefined || sourceOrder !== undefined"
      >
        <el-col :span="24">
          <p>發送給...（複選）</p>
        </el-col>
        <el-checkbox-group
          v-model="sendWhoType"
          @change="updateSendWhoType"
        >
          <el-col :span="12">
            <el-checkbox label="onlyUser" border style="width: 100%;"
              >使用人</el-checkbox
            ></el-col
          >
          <el-col :span="12"
            ><el-checkbox label="onlyBuyer" border style="width: 100%;"
              >客戶</el-checkbox
            >
          </el-col>
        </el-checkbox-group>
      </template>
    </el-row>
    <el-divider></el-divider>
    <el-row v-show="showMessageContent">
      <el-col :span="24">
        <template v-if="router.includes('email')">
          <div><b>Email 主旨：</b></div>
          <At
            ref="subjectTemplate"
            :oneline="true"
            :fixed-phrase="mapSubjectFixedPhrase[sourceName]"
            @update="updateSubjectTemplate"
          ></At>
          <p>預覽：</p>
          <p
            style="margin-bottom: 50px;"
            v-html="previewContent(previewSubjectTemplate)"
          ></p>
        </template>

        <div><b>訊息內容：</b></div>
        <At
          ref="template"
          :fixed-phrase="mapFixedPhrase[sourceName]"
          @update="updateTemplate"
        ></At>
        <p>預覽：</p>
        <p
          style="margin-bottom: 50px;"
          v-html="previewContent(previewTemplate)"
        ></p>
      </el-col>
    </el-row>
    <div :class="$style.footer">
      <el-button @click="emitClose">取消</el-button>
      <el-button
        type="primary"
        :loading="tryingToSend"
        :disabled="!showMessageContent"
        @click="validataSubmitData"
        >確認發送</el-button
      >
    </div>
  </div>
</template>
<style lang="scss" module>
@import '@design';
.title {
  color: $color-primary;
}
.footer {
  text-align: right;
}
.write {
  :global {
    .source-info {
      .el-card__body {
        padding: 5px 20px;
        div {
          margin: 5px 0;
        }
      }
    }
    .no-padding-left {
      padding-left: 0 !important;
    }
    .no-padding-right {
      padding-right: 0 !important;
    }
  }
}
</style>
