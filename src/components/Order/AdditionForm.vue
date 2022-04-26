<script>
import { orderStatusMap } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'
import { addMinutes, differenceInMinutes, differenceInDays } from 'date-fns'
import scrollToElement from '@utils/scroll-to-element'
import { authComputed } from '@state/helpers'

export default {
  components: {},
  filters: {
    orderStatusMap,
    formatDate,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      submitData: {
        status: 2,
        paymentMethod: '',
        addItems: [],
      },
      priceList: [],
      tryingToCreteOrder: false,
      bankTypeList: [{ id: 'BOT', title: '台灣銀行' }, { id: 'Taishin', title: '台新' }, { id: 'HNCB', title: '華南' }],
    }
  },
  created() {
    this.tryToFetchPrice()
    if (this.isEmployee && this.isHomeService) {
      this.submitData.paymentMethod = 'Credit'
    }
  },
  mounted() {
    this.$emit('scrollToTop')
    
  },
  computed: {
    ...authComputed,
    submitRules() {
      return {
        bankType: [{ required: this.isRequiredBankType, message: '請選擇轉帳銀行' }],
        addItems: [{ required: true, message: '請選擇服務項目' }],
      }
    },
    hasNextOrder() {
      return this.defaultValue.scheduleItem.nextOrder !== null
    },
    filteredStatusMap() {
      // ! 已付款不能手動改成未付款
      const filteredStatus = Object.keys(orderStatusMap)
        .filter((status) => {
          switch (this.defaultValue.status) {
            case 1:
              return +status < 2
            case 2:
              //  虛擬帳戶不能手動改成已付款
              if (+status === 1 && this.defaultValue.paymentMethod === 'Vacc') return false
              return +status <= 2
            case 3:
              return +status === 0 || +status === 3
            case 4:
              return +status === 4
            case 5:
              return +status === 0 || +status === 5
            case 6:
              return +status === 6
            default:
              return false
          }
        })
        .reduce((obj, key) => {
          obj[key] = orderStatusMap[key]
          return obj
        }, {})
        // console.log(orderStatusMap)
      return this.isEditMode ? filteredStatus : orderStatusMap
    },
    serviceEndTime() {
      return formatDate(addMinutes(this.defaultValue.endDate, this.totalMinute), 'time')
    },
    differMinute() {
      if (!this.hasNextOrder) return 10000
      const bookingEndDate = this.defaultValue.endDate
      const nextBookingStartDate = this.defaultValue.scheduleItem.nextOrder.startDate
      const differ = differenceInMinutes(nextBookingStartDate, bookingEndDate)
      return differ - this.totalMinute
    },
    selectedItem() {
      return this.priceList.filter((price) => this.submitData.addItems.includes(price.id))
    },
    total() {
      return this.selectedItem.reduce((cur, next) => {
        return (cur += next.price)
      }, 0)
    },
    totalMinute() {
      return this.selectedItem.reduce((cur, next) => {
        return (cur += next.serviceTime)
      }, 0)
    },
    filterSubmitData() {
      const { status, paymentMethod ,bankType} = this.submitData
      const addItems = this.selectedItem.map((item) => ({
        id: '',
        addId: item.id,
        status: this.submitData.status,
      }))
      return {
        addItems,
        orderId: this.defaultValue.id,
        total: this.total,
        status,
        paymentMethod,
        bankType
      }
    },
    isHomeService() {
      return this.defaultValue.storeType === 'home'
    },
    isEmployee() {
      // console.log(this.currentUser)
      return !!this.currentUser.scheduleItemId
      // return this.currentUserRoutes.includes('employee-calendar')
    },
    showVacc() {
      const bookingDate = new Date(formatDate(new Date(this.defaultValue.date)))
      const today = new Date(formatDate(new Date()))
      // 虛擬帳戶付款距離預約日要大於1天
      return differenceInDays(bookingDate, today) > 1
    },
    isRequiredBankType() {
      return this.submitData.paymentMethod === 'Vacc'
    },
    storeCashflowSetting(){
      return this.defaultValue.storeCashflowSetting
    }
  },
  methods: {
    async tryToFetchPrice() {
      const { items } = await this.$store.dispatch('product/fetchAdditionalPrices', {
        state: 1,
        // type:'',
        order_by:'groupOrdering',
        productId: this.defaultValue.productId,
        introtext: this.defaultValue.params[0].introtext,
        limit: 10000,
      })

      this.priceList = items.filter(item=>{
       return item.categoryIds[0] === this.defaultValue.sizeId
      })
    },
    onStatusChange(value) {
      if (!this.isEditMode && value === 1) this.submitData.paymentMethod = 'Cash'
    },
    createOrder() {
      this.$refs.form.validate((valid) => {
        if (valid) this.tryToCreateOrder()
        else
          this.$nextTick(() => {
            scrollToElement(this.$refs.form.$el.querySelector('.el-form-item__error'), 182)
          })
      })
    },
    async tryToCreateOrder() {
      this.tryingToCreteOrder = true
      await this.$store.dispatch('order/storeAdditionalOrder', this.filterSubmitData)
      this.tryingToCreteOrder = false
      this.$emit('update')
    },
  },
}
</script>

<template>
  <div :class="$style['create-addition']">
    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form-item--normal-margin el-form-item--white-bg">
      <div class="header">
        <div>目前排程</div>
        <div>美容師：{{ defaultValue.scheduleItem.name }}</div>
      </div>

      <div class="schedule-group-wrap">
        <div class="schedule">
          <div>本服務(含緩衝)時間</div>
          <div class="date">
            <span class="today">今天</span><br />
            <span class="time Jost"
              >{{ defaultValue.time }}－<span :style="`color:${totalMinute === 0 ? '' : differMinute > 0 ? '#C79484' : '#E35D5D'};`"><span class="text-primary">{{ serviceEndTime }}</span></span></span
            >
          </div>
          <div class="service">
            <span class="title">{{ defaultValue.productName }} {{ defaultValue.params[0].title }}</span
            ><br />
            <span class="size">{{ defaultValue.params[0].introtext }}</span>
          </div>
        </div>
        <div class="schedule">
          <BaseIcon name="angle-double-right" :icon-style="'fal'"></BaseIcon>
          <div>下個服務開始時間</div>
          <template v-if="hasNextOrder">
            <div class="date">
              <span class="today">今天</span><br />
              <span class="time Jost">{{ defaultValue.scheduleItem.nextOrder.startDate | formatDate('time') }}</span>
            </div>
            <div class="service">
              <span class="title">{{ defaultValue.scheduleItem.nextOrder.productName }} {{ defaultValue.scheduleItem.nextOrder.priceTitle }}</span
              ><br />
              <span class="size">{{ defaultValue.scheduleItem.nextOrder.priceIntrotext }}</span>
            </div>
          </template>
          <div v-else class="date">
            <span class="today vs-hide">今天</span><br />
            <span class="no-booking">暫無預約</span>
          </div>
        </div>
      </div>
      <div class="alert Jost" :class="{ danger: differMinute <= 0 }"
        >本次加購時間 <span class="text-secondary">{{ totalMinute }}</span> 分
        <span v-if="hasNextOrder">
          <span v-if="differMinute > 0">
           ，空檔時間剩餘 <span class="text-secondary">{{differMinute}}</span> 分
          </span>
          <span v-else>
            ，已與下個預約重疊
          </span>
          <!-- {{ differMinute > 0 ? `，空檔時間剩餘 ${differMinute} 分` : `，已與下個預約重疊` }} -->

        </span>
      </div>
      <el-form-item label="選擇加購項目" prop="addItems">
        <div :class="$style.addItems">
          <div class="wrap">
            <div v-for="(item, index) in priceList" :key="index" class="item">
              <el-checkbox-group v-model="submitData.addItems">
                <el-checkbox :label="item.id" border>
                  <div>
                    <span class="name">{{ item.title }}</span>
                    <br />
                    <span class="size">{{ item.introtext }}</span>
                  </div>
                  <div class="price">${{ item.price }}/{{ item.serviceTime }}分</div>
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="total">
            <div>加購總計</div>
            <div>${{ total }}，共 {{ totalMinute }} 分</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item prop="status" label="訂單狀態">
        <el-select v-model="submitData.status" placeholder="訂單狀態" @change="onStatusChange">
          <template v-for="(status, statusValue) in filteredStatusMap">
            <!-- 新增訂單只有已付款、未付款狀態(員工不可選已付款) -->
            <el-option v-if="[1, 2].includes(+statusValue)" :key="statusValue" :value="+statusValue" :label="status.text" :disabled="+statusValue === 1 && (isHomeService && isEmployee)"></el-option>
          </template>
        </el-select>
      </el-form-item>
      <el-form-item label="付款方式">
        <el-radio-group v-if="total > 0" v-model="submitData.paymentMethod" class="hidden-mobile" :class="$style['payment-methods']">
          <el-radio v-if="submitData.status === 2 && (!isEmployee || !isHomeService)" label border>不指定</el-radio>
          <template v-if="!(isEmployee || isHomeService)">
            <el-radio label="Cash" border>到店付款(現金)</el-radio>
            <el-radio label="StoreCredit" border>現場刷卡</el-radio>
            
          </template>
          <el-radio label="Atm" border>線下匯款</el-radio>
          <el-radio v-if="submitData.status === 2 && storeCashflowSetting === 1" label="Credit" border>信用卡付款</el-radio>
          <el-radio v-if="submitData.status === 2 && storeCashflowSetting !== 0"  label="Vacc"  border>ATM虛擬帳戶</el-radio>
        </el-radio-group>
        <el-select v-if="total > 0" v-model="submitData.paymentMethod" class="visible-mobile">
          <el-option v-if="submitData.status === 2 && (!isEmployee || !isHomeService)" value label="不指定"></el-option>
          <template v-if="!(isEmployee || isHomeService)">
            <el-option value="Cash" label="到店付款(現金)"></el-option>
            <el-option value="StoreCredit" label="現場刷卡"></el-option>
            
          </template>
          <el-option value="Atm" label="線下匯款" ></el-option>
          <el-option v-if="submitData.status === 2 && storeCashflowSetting === 1" value="Credit" label="信用卡付款"></el-option>
          <el-option v-if="submitData.status === 2 && storeCashflowSetting !== 0"  value="Vacc" label="ATM虛擬帳戶" ></el-option>
        </el-select>
        <el-alert v-else title="請先選擇加購項目" type="warning" :closable="false"></el-alert>
      </el-form-item>
      <el-form-item v-if="submitData.paymentMethod === 'Vacc'" prop="bankType" label="轉帳銀行">
        <el-select v-model="submitData.bankType">
          <el-option v-for="(bank, index) in bankTypeList" :key="`bank-${index}`" :value="bank.id" :label="bank.title"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-row :gutter="20" class="footer" style="margin-top: 40px;">
      <el-col :span="12" :xs="24">
        <el-button class="is-round is-fullwidth" @click="$emit('close')">取消加購</el-button>
      </el-col>
      <el-col :span="12" :xs="24">
        <el-button class="is-round is-fullwidth" :loading="tryingToCreteOrder" type="primary" @click="createOrder">確定加購</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.create-addition {
  :global {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .vs-hide {
      visibility: hidden;
    }
    .schedule-group-wrap {
      display: flex;
      padding: 24px 22px;
      background-color: white;
      border: 1px solid $color-border-base;
      .schedule {
        position: relative;
        flex: 1;
        svg {
          position: absolute;
          left: -40px;
          top: 62px;
          color: #c6c6ba;
          font-size: 27px;
          @include touch {
            top: 77px;
          }
        }
        & + .schedule {
          margin-left: 50px;
        }
        > div:first-of-type {
          // color: #726f65;
          margin-bottom: 26px;
          letter-spacing: 1.4px;
        }
        .date {
          margin-bottom: 25px;
          .today {
            display: inline-block;
            font-size: 12px;
            letter-spacing: 1.2px;
            margin-bottom: 10px;
          }
          .time {
            font-size: 20px;
            color: $color-secondary;
            letter-spacing: 2px;
            line-height: 18px;
            font-weight: 500;
          }
        }
        .service {
          .title {
            display: inline-block;
            margin-bottom: 5px;
            letter-spacing: 1.4px;
          }
          .size {
            font-size: 12px;
            color: #726f65;
          }
        }
        .no-booking {
          color: #d0d0d0;
          letter-spacing: 1.4px;
        }
      }
    }
    .alert {
      margin-top: 15px;
      margin-bottom: 47px;
      padding: 15px 20px;
      letter-spacing: 1.4px;
      // color: #41695b;
      background-color: #FDD7AA65;
      &.danger {
        color: $color-state-danger;
        background-color: #e35d5d17;
      }
    }
    @include touch {
      .el-input__inner {
        background-color: white;
        border-color: $color-border-base;
        border-radius: 8px;
      }
      .footer {
        display: flex;
        flex-direction: column-reverse;
        .el-col + .el-col {
          margin-bottom: 10px;
        }
      }
    }
  }
}
.addItems {
  border: 1px solid $color-border-base;
  :global {
    .wrap {
      max-height: 350px;
      overflow: auto;
      background-color: white;
      &::-webkit-scrollbar {
        display: block;
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background-color: #d8d8d8;
      }
      &::-webkit-scrollbar-track {
        background: #f5f5f5ed;
      }
      .item {
        &:last-child .el-checkbox {
          border-bottom: none;
        }
        .el-checkbox {
          width: 100%;
          display: flex;
          align-items: center;
          border: none;
          border-bottom: 1px solid $color-border-base;
          padding: 18px 22px;
          height: auto;
          .el-checkbox__label {
            display: flex;
            justify-content: space-between;
            flex: 2;
            letter-spacing: 1.4px;
            align-items: center;
            .name {
              display: inline-block;
              min-width: 90px;
            }
            br {
              display: none;
            }
            @include touch {
              br {
                display: inherit;
              }
              .size {
                color: #d0d0d0;
              }
            }
            .size {
              font-size: 12px;
            }
          }
          .el-checkbox__inner {
            width: 18px;
            height: 18px;
            &::after {
              height: 9px;
              width: 5px;
              border-width: 2px;
            }
          }
        }
      }
    }
    .total {
      display: flex;
      justify-content: space-between;
      padding: 20px 25px;
      // color: #41695b;
      background-color: #F1F9FB;
      line-height: 1;
      letter-spacing: 1.4px;
      border-top: 1px solid $color-border-base;
    }
  }
}
.payment-methods {
  :global {
    .el-radio {
      margin: 5px !important;
    }
    .vacc-disabled {
      margin-bottom: 20px;
      &::after {
        content: '(服務前一日不提供)';
        position: absolute;
        bottom: -20px;
        left: 50%;
        transform: translateX(-50%);
        color: #c2c6ce;
      }
    }
  }
}
</style>
