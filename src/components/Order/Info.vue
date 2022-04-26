<script>
import lazyLoadComponent from '@router/lazyload-component'

import { orderStatusFilter, orderSourceFilter, bookingStatusFilter ,paymentStatusMapFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import { authComputed } from '@state/helpers'

export default {
  components: {
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {
    orderStatusFilter,
    orderSourceFilter,
    formatDate,
    bookingStatusFilter,
    paymentStatusMapFilter
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    assignList: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editAssistantEnabled: false,
      IsFull: false,
      submitData: { ...this.defaultValue },

      tryingAssign: false,
    }
  },
  watch: {},
  computed: {
    ...authComputed,
    isEmployee() {
      return this.currentUserRoutes.includes('employee-calendar')
    },
    isHomeService(){
      return this.defaultValue.storeType === 'home'
    }
  },
  created() {},
  methods: {
    async tryToStoreAssignHelper() {
      this.tryingAssign = true
      this.$emit('update:loading', true)
      await this.$store.dispatch('order/storeAssignHelper', { id: this.defaultValue.id, itemId: this.submitData.helper.id })
      this.$emit('update')
      this.tryingAssign = false
      this.$emit('update:loading', false)
      this.editAssistantEnabled = false
    },
    cancelEdit() {
      // this.assistant = ''
      this.editAssistantEnabled = false
    },
    openEdit() {
      this.editAssistantEnabled = true

      // defaultValue.helper.name
      if (this.defaultValue.helper) {
        // this.submitData.helper.id=this.defaultValue.helper.id
        this.submitData.helper = { ...this.defaultValue.helper }
      } else {
        this.submitData.helper = { id: '', name: '' }
      }
    },
    goToPrepaidOrder(id) {
      // console.log(this.$route.name)
  
        this.$router.push({
          name: 'orders',
          query: {
            type: 'prepaidOrder',
            id,
          },
        })
    
      // else{
      //   this.$router.push({
      //     name: 'orders',
      //     params: {
            
      //       type: 'prepaidOrder',
      //       id,
      //     },
      //   })
      // }
    },
  },
}
</script>

<template>
  <div :class="$style.info">
    <h3 class="Jost">{{ `#${defaultValue.id}` }}</h3>
    <p v-if="!isEmployee" :class="$style.meta">
      <span>{{ defaultValue.created | formatDate('dateTime') }} 成立訂單</span>
      <BaseStateLabel state="info" text>訂單來源：{{ defaultValue.source | orderSourceFilter }}</BaseStateLabel>
    </p>

    <BaseStateLabel :state="defaultValue.paymentStatus | paymentStatusMapFilter('color')">{{ defaultValue.paymentStatus | paymentStatusMapFilter('text') }}</BaseStateLabel>

    <BaseStateLabel :round="true" style="padding:0 18px;height:25px" :state="defaultValue.status | bookingStatusFilter('color')" text>{{ defaultValue.status | bookingStatusFilter('text') }}</BaseStateLabel>  <br>
    <BaseStateLabel v-if="defaultValue.paymentMethod === 'Prepaid'" style="background: #000;margin-left:0;margin-top:10px">方案預約:{{defaultValue.prepaid.title}}</BaseStateLabel>

    <div :class="$style.header">
      <h5 :class="$style.title">{{ defaultValue.productName }} {{ defaultValue.params[0].title }}</h5>
      <h6 style="margin-top: -10px; color: darkgrey">{{ defaultValue.params[0].introtext }}</h6>
      <h5 class="Jost">預約時間：{{ defaultValue.date | formatDate }} {{ defaultValue.time }}</h5>
      
      <h5 v-if="isHomeService && defaultValue.city" class="Jost">服務地址：{{ defaultValue.city }}{{ defaultValue.district }}{{ defaultValue.address }}</h5>
      <h5 v-else class="Jost">服務地點：{{ defaultValue.productName }}</h5>
      <template v-if="defaultValue.scheduleItem">
        <h5 v-if="defaultValue.scheduleItem && !isEmployee" class="Jost">美容師：{{ defaultValue.scheduleItem.name }}</h5>
        <div v-if="isEmployee" :class="$style.editOneLine">
          <h5 class="editOneLine__title">美容師：</h5>

          <span class="editOneLine__text">{{ defaultValue.scheduleItem.name }} </span>
          <!-- <template v-if="defaultValue.status === 3">
          <el-alert class="alert-inline">若需變更美容師或時間，請點選行事曆 → 變更預約時間</el-alert>
        </template> -->
          <!-- <div v-if="IsFull" class="el-form-item__error"> 排班已滿，請另外指定 </div> -->
        </div>

        <div v-if="defaultValue.status === 6" :class="$style.editOneLine" style="margin-top: 15px padding:0  20px">
          <h5 class="editOneLine__title">助理：</h5>
          <span class="editOneLine__text">{{ defaultValue.helper ? defaultValue.helper.name : '不指派' }} </span>
        </div>

        <div v-else v-loading="loading" element-loading-background="rgba(0, 0, 0,0)" :class="$style.editOneLine" style="margin-top: 15px padding:0  20px">
          <h5 class="editOneLine__title">助理：</h5>
          <template v-if="editAssistantEnabled">
            <el-form ref="assistantForm" class="el-form--floating" style="width: 200px">
              <el-form-item label="" class="el-form-item--normal-margin">
                <el-select v-model="submitData.helper.id">
                  <!-- <el-option label="不指派" value></el-option> -->
                  <el-option label="不指派" value></el-option>
                  <el-option v-for="(item, index) in assignList" :key="index" :value="item.id" :label="`${item.name} ${item.sameStore ? '(同分店)' : '(不同分店)'}`">
                    {{ item.name }} ({{ item.sameStore ? '同分店' : '不同分店' }})
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </template>
          <template v-if="!editAssistantEnabled">
            <span v-if="assignList.length > 0 && !defaultValue.helper" class="editOneLine__text">請選擇</span>
            <span v-if="!loading && assignList.length === 0 && !defaultValue.helper" class="editOneLine__text">目前無人員可指派 </span>
            <span v-if="defaultValue.helper" class="editOneLine__text">{{ defaultValue.helper.name }} </span>
          </template>
          <template v-if="assignList.length > 0">
            <template v-if="!editAssistantEnabled">
              <el-button class="is-round" size="mini" @click="openEdit">
                <BaseIcon name="edit" />
                <span>編輯</span>
              </el-button>
            </template>
            <template v-else>
              <el-button class="is-round" @click="cancelEdit">
                <!-- <BaseIcon name="times" />  -->
                取消
              </el-button>
              <el-button class="is-round" type="primary" :loading="tryingAssign" @click="tryToStoreAssignHelper">
                <!-- <BaseIcon name="check" />  -->
                儲存
              </el-button>
            </template>
          </template>
        </div>
      </template>
      <template v-if="defaultValue.prepaidOrderStatus">
        <div v-if="defaultValue.prepaidOrderStatus === 2" :class="$style.editOneLine">
          <h5 class="editOneLine__title">包月方案：</h5>
          <span class="editOneLine__text">未付款</span>
          <el-button class="is-round" size="mini" @click="goToPrepaidOrder(defaultValue.prepaidOrderUuid)">
            <BaseIcon name="edit" />
            <span>編輯</span>
          </el-button>
        </div>
      </template>

      <div v-if="!isEmployee" class="total">
        <div>訂單總計</div>
        <div class="Jost">${{ defaultValue.allTotal }}</div>
      </div>
      <div v-if="defaultValue.allUnpaidTotal > 0" class="unpaid">
        <div>未付款項目金額總計</div>
        <div class="Jost">${{ defaultValue.allUnpaidTotal }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.editOneLine {
  display: flex;
  align-items: center;
  position: relative;
  flex-wrap: wrap;
  margin-bottom: 10px;
  :global {
    .el-form-item__error {
      position: static;
      width: 100%;
      padding-left: 80px;
    }
    .editOneLine {
      &__title {
        margin: 0;
        // margin-right: 15px;
      }
      &__text {
        font-size: 1.2rem;
        margin-right: 15px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
      margin-right: 15px;
      &.isFull {
        margin-bottom: 20px;
      }
    }
    .el-input__inner {
      background-color: #fff;
      height: 40px;
    }
  }
}
.meta {
  display: flex;
  justify-content: space-between;
}
.header {
  :global {
    .total {
      padding: 16px 20px;
      background-color: #dddbdb;

      margin-top: 20px;
    }
    .unpaid {
      margin-top: 12px;
      padding: 16px 20px;
      color: $color-state-danger;
      background-color: #f2e4e4;
    }
    .total,
    .unpaid {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.title:not(:first-child) {
  margin-top: 30px;
}
.info {
  border-bottom: 1px solid #c6c6ba;
  padding-bottom: 30px;
}
</style>
