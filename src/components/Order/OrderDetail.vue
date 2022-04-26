<script>
import lazyLoadComponent from '@router/lazyload-component'

import { Portal } from 'portal-vue'

import { genderFilter, orderStatusFilter, orderSourceFilter, bookingStatusFilter } from '@utils/filter-value-to-text'

import { authComputed } from '@state/helpers'

export default {
  name: 'OrderDetail',
  components: {
    Info: () => lazyLoadComponent(import('@components/Order/Info')),
    Service: () => lazyLoadComponent(import('@components/Order/Service')),
    Orders: () => lazyLoadComponent(import('@components/Order/Orders')),
    More: () => lazyLoadComponent(import('@components/Order/More')),
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
    Portal,
    SignatureDialog: () => lazyLoadComponent(import('@components/SignatureDialog')),
    OrderChangeStatusDialog: () => lazyLoadComponent(import('@components/OrderChangeStatusDialog')),
  },
  filters: {
    orderStatusFilter,
    genderFilter,
    orderSourceFilter,
    bookingStatusFilter,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      mode: 'view', // view 檢視、edit 編輯
      cancelDialogVisible: false,
      signDialogVisible: false,
      signDialogKey: 0,
      tryingCheckIn: false,
      noShowDialogVisible: false,
      tryingNoShow: false,
      submitData: {
        note: '',
      },

      activeTab: 'service',
      tabList: [
        {
          name: 'service',
          label: '服務',
        },
        {
          name: 'orders',
          label: '訂單',
        },
        {
          name: 'more',
          label: '更多',
        },
      ],
      payMethods:{
        'Cash': '到店付款(現金)',
        'StoreCredit': '現場刷卡',
        'Atm': '線下匯款',
      },

      check: {
        // beautician: 'Cindy Lee',
        helperId: '',
      },
      assignList: [],
      checkDialogVisible: false,
      helperId: '',
      tryingAssign: false,
      paidDialogVisible:false,
      statusDialogVisible:false
    }
  },
  computed: {
    ...authComputed,
    isPaid() {
      return this.defaultValue.status === 1
    },
    isEmptyBySizeExtrafields() {
      if (this.defaultValue.customerInfos.length === 0) return true
      return this.defaultValue.customerInfos[0].bySizeExtrafields instanceof Array
    },
    submitRules() {
      return {
        // beautician: [
        //   {
        //     required: true,
        //     message: '請選擇美容師',
        //     trigger: 'change',
        //   },
        // ],
        helperId: [
          {
            required: true,
            message: '請選擇助理',
            trigger: 'change',
          },
        ],
      }
    },
    isAddOrdersCanceled() {
      return this.defaultValue.childrenOrders.every((order)=> order.status !== 1)
    },
    isAllPaid(){
      let mainOrderPaid = this.defaultValue.paymentStatus === 'PAID'
      let addOrderPaid = this.defaultValue.childrenOrders.every((order)=> order.status !== 2)
      return mainOrderPaid && addOrderPaid
    }
  },
  created() {
    this.$parent.$el.querySelector('.el-drawer__header').style.borderBottom = 'none'
    this.$parent.$el.querySelector('.el-drawer__header').style.minHeight = '82px'
    // this.tryToFetchCalendar()
    this.tryToFetchHelperList()
    this.check.helperId = this.defaultValue.helper ? this.defaultValue.helper.id : ''
  },
  methods: {
    updateMode(value) {
      this.mode = value
    },
    async handleStore() {
      const updatedValue = await this.$store.dispatch('order/fetchSingle', this.defaultValue.id)
      this.$emit('update:defaultValue', updatedValue)
      this.$emit('update')
      this.updateMode('view')
    },
    showCancelDialog() {
      this.cancelDialogVisible = true
    },
    async tryToCheckIn() {
      await this.$refs.beauticianForm.validate()
      this.checkDialogVisible = false
      // await this.$confirm('確定將此訂單改為「已報到」？', '警告', {
      //   confirmButtonText: '確定',
      //   cancelButtonText: '取消',
      //   type: 'warning',
      //   center: true,
      // })
      try {
        this.tryingCheckIn = true
        await this.$store.dispatch('order/verifySingleCode', {
          codeId: this.defaultValue.params[0].codes[0].id,
          orderId: this.defaultValue.id,
        })
        this.$message({
          type: 'success',
          message: '報到成功！',
        })
        this.handleStore()
      } catch (e) {
      } finally {
        this.tryingCheckIn = false
      }
    },
    async onClickNoShow() {
      await this.$refs.form.validate()
      await this.$confirm('確定將此訂單改為「未報到」？', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      })
      this.tryingNoShow = true
      const storeData = {
        ...this.defaultValue,
        status: 5,
        merchantNote: this.submitData.note,
      }
      await this.$store.dispatch('order/store', storeData)
      this.handleStore()
      this.submitData.note = ''
      this.noShowDialogVisible = false
      this.tryingNoShow = false
    },
    showSignDialog() {
      this.signDialogKey++
      this.signDialogVisible = true
    },
  /*   async tryToFetchCalendar() {
      if (!this.defaultValue.scheduleItem) {
        this.tryingAssign = false
        return
      }
      this.tryingAssign = true
      const { scheduleItems } = await this.$store.dispatch('schedule/fetchList', { date: this.defaultValue.date })
      this.assignList = scheduleItems.filter((assign) => {
        return assign.scheduleDetails.some((item) => {
          const minute = this.defaultValue.time.split(':')
          const endDate = new Date(this.defaultValue.endDate).getTime()
          let startDate = new Date(this.defaultValue.date)
          // console.log(minute)
          startDate.setHours(Number(minute[0]))
          startDate.setMinutes(Number(minute[1]))
          startDate = startDate.getTime()
          // console.log(startDate,endDate)
          // console.log(new Date(item.startDate).getTime(),new Date(item.endDate).getTime())
          return startDate >= new Date(item.startDate).getTime() && endDate <= new Date(item.endDate).getTime()
        })

        // return  item.scheduleDetails.length > 0
      })
      this.assignList.forEach((item, index) => {
        if (item.id === this.defaultValue.scheduleItem.id) {
          this.assignList.splice(index, 1)
        }
      })
      this.tryingAssign = false
      console.log(this.assignList)
    }, */
    async tryToFetchHelperList(){
     this.tryingAssign = true
     const {items} = await this.$store.dispatch('order/fetchHelperList', this.defaultValue.id)
     this.assignList = items
     this.assignList.forEach((item,index)=>{
       if(item.id===this.defaultValue.scheduleItem.id){
         this.assignList.splice(index,1)
       }
     })
     this.tryingAssign = false
    },
    async tryToStoreAssignAndCheckIn() {
      // this.tryingAssign=true
      this.tryingCheckIn = true
    /*   if (this.check.helperId) {
        await this.$store.dispatch('order/storeAssignHelper', { id: this.defaultValue.id, itemId: this.check.helperId })
      } */
      await this.$store.dispatch('order/storeAssignHelper', { id: this.defaultValue.id, itemId: this.check.helperId })
      this.tryToCheckIn()
      // this.$emit('update')
      // this.tryingAssign=false
      // this.editAssistantEnabled = false
    },
    openCheckDialog(){
      this.checkDialogVisible = true
      this.check.helperId = this.defaultValue.helper ? this.defaultValue.helper.id : ''
    },
    openPaidDialog(){
      this.paidDialogVisible = true
    },
    async tryToPayOrder(method){
      try {
        await this.$confirm(`確認付款方式為「 ${this.payMethods[method]} 」？`, '提示', {
            confirmButtonText: '確定',
            showCancelButton: true,
            type: 'warning',
            center: true,
          })
        await this.$store.dispatch('order/store', {
          ...this.defaultValue,
          paymentMethod:method,
          paymentStatus:'PAID',
        })
          this.$message({
          type: 'success',
          message: '編輯成功！',
          })
        this.handleStore()
        this.paidDialogVisible = false
      } catch {
      }
      finally{
        
      }
     
    },
    
    tryToCancel(){
      if(!this.isAddOrdersCanceled){
         this.$confirm('請先將加購訂單全數取消', '提示', {
            confirmButtonText: '確定',
            // cancelButtonText:'放棄',
            showCancelButton: false,
            type: 'warning',
            center: true,
          })
      }else{
        this.statusDialogVisible = true
      }
      
    },
    // async tryToCancel(){
    //   try{
    //     await this.$confirm('確定取消訂單？', '提示', {
    //         confirmButtonText: '確定',
    //         cancelButtonText:'放棄',
    //         showCancelButton: true,
    //         type: 'warning',
    //         center: true,
    //       })
    //     await this.$store.dispatch('order/store', {
    //       ...this.defaultValue,
    //       status:0
    //     })
    //     this.$message({
    //     type: 'success',
    //     message: '已取消訂單！',
    //     })
    //     this.handleStore()
    //   } catch {

    //   }
    // },
    emitStore(){
      this.handleStore()
    }
  },
}
</script>

<template>
  <div>
    <el-tabs v-model="activeTab" :class="$style.tabs">
      <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.label" :name="tab.name"></el-tab-pane>
    </el-tabs>
    <Info :default-value="defaultValue" :assign-list="assignList" :loading.sync="tryingAssign" @update="handleStore"></Info>
    <component :is="activeTab" :class="$style['tab-content']" :default-value="defaultValue" @update="handleStore"></component>

    <Portal to="drawer-header">
      <template v-if="defaultValue.status !== 0">
        <!-- 判斷「待報到」的狀態才能顯示 -->
        <el-button v-if="defaultValue.status === 4 && isAllPaid" class="is-round" type="primary" @click="showSignDialog">簽名請款</el-button>
        <el-alert v-if="defaultValue.status === 4 && !isAllPaid && defaultValue.paymentMethod !== 'Credit'" style="display:inline-block; width:auto;top:14px;left:-10px" type="error" :closable="false">
          <span slot="title">請將訂單及加購款項結清，<br>始可完成簽名請款</span>
        </el-alert>
        <el-alert v-if="defaultValue.status === 4 && !isAllPaid && defaultValue.paymentMethod === 'Credit'" style="display:inline-block; width:auto;top:14px;left:-10px" type="error" :closable="false">
          <span slot="title">客戶選定線上信用卡結帳，<br>無法快速付款</span>
        </el-alert>
        <el-button 
          v-if="defaultValue.paymentStatus === 'UNPAID' 
                && defaultValue.paymentMethod !== 'Credit' 
                && defaultValue.paymentMethod !== 'Vacc' 
                && defaultValue.paymentMethod !== 'Prepaid'" 
          class="is-round" 
          type="success" 
          @click="openPaidDialog"
        >
          付款
        </el-button>
        <el-button v-if="defaultValue.status === 3" :loading="tryingCheckIn" :disabled="tryingCheckIn || tryingAssign" class="is-round" type="primary" @click="openCheckDialog">報到</el-button>
        <el-button v-if="defaultValue.status === 3" :loading="tryingCheckIn" :disabled="tryingCheckIn || tryingAssign" class="is-round" type="danger" @click="noShowDialogVisible = true">未報到</el-button>
        <el-button v-if="defaultValue.status !== 6 "  type="info" class="is-round"  @click="tryToCancel">取消</el-button>
        <!-- <el-button class="is-round" @click="updateMode('edit')">編輯訂單</el-button> -->
      </template>
    </Portal>

    <SignatureDialog :key="signDialogKey" :visible.sync="signDialogVisible" :order="{ ...defaultValue }" @update="handleStore" />
    <el-dialog title="請說明未報到情況" :visible.sync="noShowDialogVisible" top="0" append-to-body>
      <el-form ref="form" :model="submitData" :rules="{ note: [{ required: true, message: '請輸入情況！', trigger: 'blur' }] }">
        <el-form-item prop="note">
          <el-input v-model="submitData.note" type="textarea" class="is-round is-light is-border" :rows="4" placeholder="請輸入備註"></el-input>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="12">
          <el-button class="is-round is-fullwidth" @click="noShowDialogVisible = false">返回</el-button>
        </el-col>
        <el-col :span="12">
          <el-button :loading="tryingNoShow" :disabled="tryingNoShow" type="danger" class="is-round is-fullwidth" @click="onClickNoShow">未報到</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog  :title="'請選擇付款方式'" :visible.sync="paidDialogVisible" top="0" append-to-body>
      <div class="bottom-btn-center">
        <el-button v-for="(item,key) in payMethods" :key="key" class="is-round" @click="tryToPayOrder(key)">{{item}}</el-button>
      
      </div>
    </el-dialog>

    <el-dialog v-if="defaultValue.scheduleItem" :title="'確認將此訂單改為「已報到」'" :visible.sync="checkDialogVisible" top="0" append-to-body>
      <el-form ref="beauticianForm" :model="check" :rules="submitRules" class="el-form-item--normal-margin" label-width="100px" label-position="left">
        <el-form-item label="美容師" class="el-form-item--normal-margin">
          {{ defaultValue.scheduleItem ? defaultValue.scheduleItem.name : '' }}
          <!-- <el-select v-model="check.beautician">
            <el-option v-for="item in beauticianList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select> -->
        </el-form-item>
        
        <div v-loading="tryingAssign" element-loading-background="rgba(0, 0, 0,0)">
        <el-form-item v-if="assignList.length > 0" label="助理" prop="assistant" class="el-form-item--normal-margin">
          <el-select v-model="check.helperId">
            <el-option label="不指派" value></el-option>
            <el-option v-for="(item, index) in assignList" :key="index" :value="item.id" :label="`${item.name} ${item.sameStore ? '(同分店)' : '(不同分店)'}`"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="assignList.length === 0 && !tryingAssign" label="助理" prop="assistant" class="el-form-item--normal-margin">
          <el-alert title="目前無人員可指派" type="warning" :closable="false"></el-alert>
        </el-form-item>
        </div>

      </el-form>

      <div class="bottom-btn-center">
        <el-button class="is-round" @click="checkDialogVisible = false">取消</el-button>
        <el-button class="is-round" type="primary" @click="tryToStoreAssignAndCheckIn">確認</el-button>
      </div>
    </el-dialog>
    <!-- <BaseCollapse v-if="!isEmptyBySizeExtrafields" title="參與人資訊">
        <div v-for="(customerInfo, index) in defaultValue.customerInfos" :key="`customerInfo-${index}`" :class="$style['question-list']">
          <div class="customer">
            <BaseIcon name="user" icon-style="fas" />
            {{ `參與人 ${index + 1}` }}
          </div>
          <ul v-for="(field, bySizeIndex) in customerInfo.bySizeExtrafields" :key="`customerInfo-${index}-${bySizeIndex}`" :class="$style.question">
            <li class="title">{{ field.title }}</li>
            <li>{{ field.value }}</li>
          </ul>
        </div>
      </BaseCollapse> -->
    <!-- <div :class="$style.buttons" >
        <BaseButton icon="clipboard-list" @click="showMemberDialog"
          >查看客戶資訊</BaseButton
        >
        <template v-if="defaultValue.status !== 0">
          <BaseButton icon="mail-bulk" @click="writeDialogVisible = true"
            >撰寫通知</BaseButton
          >
          <BaseButton
            icon="paper-plane"
            :loading="tryingSendEmail"
            @click="tryToSendEmail"
            >發送{{ isPaid ? ' QR Code ' : '付款' }}連結至使用人
            Email</BaseButton
          >
          <BaseButton icon="share-alt" @click="showShareDialog"
            >分享{{ isPaid ? 'QR Code' : '付款' }}頁面連結</BaseButton
          >
          <BaseButton icon="edit" @click="updateMode('edit')"
            >編輯訂單</BaseButton
          >
          <BaseButton icon="ban" @click="showCancelDialog">取消訂單</BaseButton>
        </template>
      </div> -->
      <OrderChangeStatusDialog :visible.sync="statusDialogVisible"  :order="{ ...defaultValue,status: 0 }"  @cancelled="emitStore" />
  </div>
</template>

<style lang="scss" module>
@import '@design';
.meta {
  display: flex;
  justify-content: space-between;
}
.header {
  margin-bottom: 15px;
}
.title:not(:first-child) {
  margin-top: 30px;
}
.info {
  padding-inline-start: 0;
  > li {
    padding: 5px 0;
  }
}
.params {
  padding: 5px 15px;
  font-size: 14px;
  line-height: 40px;
  background: white;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
  &__item {
    display: flex;
    justify-content: space-between;

    &:first-child {
      color: $color-text-placeholder;
    }
    > * {
      flex: 1;
      &:first-child {
        flex: 2;
      }
      &:not(:first-child) {
        text-align: right;
      }
    }
  }
}
.total {
  border-top: 1px solid $color-border-base;
  &__item {
    display: flex;
    justify-content: space-between;

    &--discount {
      color: $color-state-danger;
    }
    &:not(.total__item--discount) > *:first-child {
      color: $color-text-placeholder;
    }
  }
}

.buttons {
  margin-top: 30px;
  border-top: 1px solid $color-border-base;
  border-bottom: 1px solid $color-border-base;
}

.info-byOrder {
  margin-bottom: 15px;
  margin-top: 35px;
}
.question-list {
  border-bottom: 1px solid lightgrey;
  margin-bottom: 20px;
  padding-bottom: 20px;
  :global {
    .customer {
      margin: 0 0 16px 0;
      color: #53c2cc;
      vertical-align: middle;
      svg {
        margin-right: 8px;
        margin-left: 2px;
        font-size: 11px;
        vertical-align: baseline;
      }
    }
    ul:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
  &:last-child {
    border-bottom: none;
    margin-bottom: 0px;
  }
}
.question {
  padding-left: 24.2px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  :global {
    .title {
      margin-bottom: 10px;
      color: darkgray;
    }
  }
}
.payment {
  :global {
    li {
      line-height: 40px;
    }
    .title {
      margin-right: 20px;
      color: darkgray;
    }
  }
}
.chat {
  padding: 0 !important;
  :global {
    li {
      margin: 0;
      &:before {
        height: 0 !important;
      }
    }
    .title {
      pointer-events: none;
      font-weight: 400;
      color: #808080;
      letter-spacing: 2.4px;
    }
    .message {
      max-width: 390px;
      overflow: hidden;
      padding-top: 10px;
      min-width: 320px;
      border: 1px solid #ebeef5;
      margin: 20px 0 0;
      padding: 10px;
      cursor: pointer;
      div {
        line-height: 24px;
      }
      .name-date {
        display: flex;
        justify-content: inherit;
        flex-direction: row-reverse;
        color: #031d1d;
        .name {
          font-size: 14px;
          color: black;
          font-weight: 400;
        }
        .date {
          color: #9b9b9b;
          font-size: 12px;
        }
      }
      .phone {
        font-weight: 400;
        letter-spacing: 1.3px;
        color: black;
      }
      .text {
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        white-space: nowrap;
        width: 100%;
      }
      &.unread {
        background-color: lighten($color: $color-primary, $amount: 38%);
      }
      &:hover {
        background-color: rgb(247 227 196 / 0.3);
      }
    }
    .view-all {
      text-align: center;
      color: $color-primary;
      padding: 5px 20px;
      letter-spacing: 2.3px;
    }
  }
}
.tabs {
  position: sticky;
  top: 82px;
  background: #f2f2f2;
  margin: 0 -30px;
  margin-bottom: 30px;
  z-index: 2;
  :global {
    .el-tabs__header {
      margin-bottom: 0;
      .el-tabs__nav {
        width: 100%;
        display: flex;
        .el-tabs__active-bar {
          background-color: #41695b;
        }
        .el-tabs__item {
          flex: 1 1 auto;
          padding: 0;
          text-align: center;
          letter-spacing: 3.2px;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
        }
      }
    }
  }
}
.tab-content {
  :global {
    .icon-text {
      padding: 31px 18px;
      background-color: transparent;
      border: none;
      border-bottom: 1px solid #c6c6ba;
      width: 100%;
      text-align: left;
      svg {
        font-size: 20px;
        margin-right: 20px;
      }
      & + .icon-text {
        margin: 0;
      }
    }
  }
}
</style>
