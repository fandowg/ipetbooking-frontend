<script>
import { startOfWeek, endOfWeek } from 'date-fns'
import formatDate from '@utils/format-date'
import lazyLoadComponent from '@router/lazyload-component'
import { bookingStatusFilter, orderStatusFilter } from '@utils/filter-value-to-text'

import format from 'date-fns/format'

import VueCal from 'vue-cal'
import 'vue-cal/dist/i18n/zh-hk.js'
import 'vue-cal/dist/vuecal.css'

export default {
  page: {
    title: '行事曆',
    meta: [{ name: 'description', container: 'schedule' }],
  },
  components: {
    VueCal,
    CalendarItem: () => lazyLoadComponent(import('./CalendarItem')),
    WeekPicker: () => lazyLoadComponent(import('@components/WeekPicker')),
    OrderInfo: () => lazyLoadComponent(import('./OrderInfo')),
  },
  filters: {
    orderStatusFilter,
  },
  props: {
    mode: {
      type: String,
      default: 'week',
    },
  },
  data() {
    return {
      selectedDate: new Date(),
      events: [],
      tryingToFetchSchedule: false,

      editable: {
        title: false,
        drag: false,
        resize: false,
        create: false,
        delete: false,
      },

      // 營業時間
      openingHour: '00:00',
      closedHour: '23:59',

      tryingToGetOrder: false,
      drawerOrderData: {},
      drawerVisible: false,
      triggerIndex: 0,
      canChangeDate:false
    }
  },
  computed: {
    selectedDateString() {
      return this.selectedDate.format()
    },
    headerDate() {
      let date = this.$refs.cal ? this.$refs.cal.view.startDate : new Date()
      if(this.$route.query.type === 'order' && !this.canChangeDate){
        this.canChangeDate = true
        date = new Date(this.drawerOrderData.date)
      }
      const trigger = this.triggerIndex % 2 === 0 ? '\n' : ''
      if (this.isWeekMode) return `${format(startOfWeek(date, { weekStartsOn: 1 }), 'YYYY年MM月D日')} ~ ${format(endOfWeek(date, { weekStartsOn: 1 }), 'YYYY年MM月D日')}${trigger}`
      else return format(date, 'YYYY年MM月D日')
    },
    isWeekMode() {
      return this.mode === 'week'
    },
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
  },
  watch:{
    selectedDateString(){
      this.scrollToNow()
    }
  },
  created() {
    this.tryToFetchSchedule()
    this.tryToGetOrderByQuery()
    // window.addEventListener('resize',this.getVueCalHeight)
  },
  mounted() {
    this.getVueCalHeight()
    this.$nextTick(() => {
      setTimeout(() => {
        this.scrollToNow()
      }, 100)
    })
  },
  methods: {
    bookingStatusFilter,
    async tryToFetchSchedule() {
      this.tryingToFetchSchedule = true
      const { startDate: date, endDate } = this.getWeekStartEnd()
      const list = await this.$store.dispatch('schedule/fetchRangeList', {
        date,
        endDate,
      })

      this.filterEvents(list)
      this.tryingToFetchSchedule = false
    },
    async tryToGetOrderByQuery(){
      if (this.$route.query.type === 'order') {
       await this.tryToGetOrder(this.$route.query.id)
       const date = this.drawerOrderData.date
      //  console.log(this.selectedDate)
      //  this.$refs.week.initData(new Date(date))
       this.selectedDate = new Date(date)
      }
    },
    async tryToGetOrder(orderId) {
      this.tryingToGetOrder = true
      this.drawerOrderData = await this.$store.dispatch('order/fetchSingle', orderId)
      this.tryingToGetOrder = false
      this.drawerVisible = true
    },
    filterEvents(list) {
      this.events = list.map((order) => ({
        start: order.startDate,
        end: order.endDate,
        customInfo: { ...order },
      }))
    },
    fetchEvents() {
      this.tryToFetchSchedule()
    },
    getWeekStartEnd() {
      if (this.$refs.cal) {
        const { startDate, endDate } = this.$refs.cal.view
        return { startDate: formatDate(startDate, 'date-dash'), endDate: formatDate(endDate, 'date-dash') }
      } else {
        const startDate = formatDate(startOfWeek(new Date(), { weekStartsOn: 1 }), 'date-dash')
        const endDate = formatDate(endOfWeek(new Date(), { weekStartsOn: 1 }), 'date-dash')
        return { startDate, endDate }
      }
    },
    onClickPreviousDay() {
      this.$refs.cal.previous()
      if (this.isWeekMode) {
        this.$refs.week.weekPre()
      } else {
        this.selectedDate = this.$refs.cal.view.startDate
        const date = formatDate(this.$refs.cal.view.startDate, 'date-dash')
        this.$refs.week.initData(date)
      }
      this.triggerIndex++
    },
    onClickNextDay() {
      this.$refs.cal.next()
      if (this.isWeekMode) {
        this.$refs.week.weekNext()
      } else {
        this.selectedDate = this.$refs.cal.view.startDate
        const date = formatDate(this.$refs.cal.view.startDate, 'date-dash')
        this.$refs.week.initData(date)
      }
      this.triggerIndex++
    },
    onClickToday() {
      this.selectedDate = new Date()
      this.isWeekMode && this.$refs.week.initData(this.selectedDateString)
      this.triggerIndex++
    },
    checkExpired(date) {
      return new Date().getTime() > new Date(date)
    },
    onClickDetail(event) {
      this.tryToGetOrder(event.customInfo.orderId)
    },
    updateSelectedDate(date) {
      this.selectedDate = date
      this.isWeekMode && this.$refs.week.initData(this.selectedDateString)
      this.triggerIndex++
    },
    showDatePicker() {
      this.$refs.picker.showPicker()
    },
    onDatePickerChange() {
      this.$refs.week.initData(this.selectedDateString)
      this.triggerIndex++
    },
    getVueCalHeight(){
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const safeAreaInsetTop = getComputedStyle(document.documentElement).getPropertyValue("--sat").replace('px', '');

      this.$nextTick(()=>{
        if(windowWidth < 481 && !this.isWeekMode){
          this.$refs.cal.$el.querySelector('.vuecal__bg').style.height=`${windowHeight - 355 - safeAreaInsetTop}px`
        }
        if(windowWidth >= 481){
          this.$refs.cal.$el.querySelector('.vuecal__bg').style.height=`auto`
        }
      })
    },
    scrollToNow(){
      const now = new Date()
      const minutes = (now.getHours() - 6) * 60 + now.getMinutes()
      const pxFerMinute = 50/15
      // formatDate(now,'date-dash')
      // console.log(now.format())
      // this.$refs.cal.$el.querySelector('.vuecal__bg').scrollTop= minutes * pxFerMinute -50
      if(now.format()===this.selectedDateString){
        this.$refs.cal.$el.querySelector('.vuecal__bg').scrollTop= minutes * pxFerMinute -50
      }else{
        this.$refs.cal.$el.querySelector('.vuecal__bg').scrollTop=600
      }
      
    },
  },
}
</script>

<template>
  <div v-loading.fullscreen.lock="tryingToGetOrder" element-loading-text="取得訂單資訊中">
    <el-row :gutter="isMobile ? 0 : 10">
      <el-col :span="17" :xs="24">
        <el-card shadow="never" :class="$style['card-wrapper']">
          <template v-if="!isMobile" slot="header">
            <div>
              <el-button class="is-round" @click="onClickToday">今天</el-button>
            </div>
            <div class="Jost" :class="$style['header-date']"><BaseIcon icon-style="fal" name="calendar"></BaseIcon> {{ headerDate }}</div>
            <div :class="$style['header-nav']">
              <el-button class="is-round" @click="onClickPreviousDay"><BaseIcon icon-style="fal" name="chevron-left"></BaseIcon></el-button>
              <el-button class="is-round" @click="onClickNextDay"><BaseIcon icon-style="fal" name="chevron-right"></BaseIcon></el-button>
            </div>
          </template>
          <template v-else slot="header">
            <BaseIcon icon-style="fal" name="chevron-left" @click.native="onClickPreviousDay"></BaseIcon>
            <div v-if="headerDate" class="Jost" :class="$style['header-date']" @click="showDatePicker">
              <BaseIcon icon-style="fal" name="calendar"></BaseIcon> {{ headerDate }}
              <el-date-picker ref="picker" v-model="selectedDate" type="date" format="yyyy/MM/dd" :class="$style['mobile-picker']" @change="onDatePickerChange"></el-date-picker>
            </div>
            <BaseIcon icon-style="fal" name="chevron-right" @click.native="onClickNextDay"></BaseIcon>
          </template>
          <WeekPicker v-if="isWeekMode" ref="week" :class="$style['weekpicker']" :format-string="'D'"></WeekPicker>
          <WeekPicker
            v-else
            ref="week"
            class="visible-mobile"
            :class="$style['weekpicker']"
            :format-string="'D'"
            :show-selected="true"
            :selected-date.sync="selectedDate"
            @change="triggerIndex++"
          ></WeekPicker>
          <div v-loading="tryingToFetchSchedule" element-loading-text="取得行事曆資訊中" :class="[$style['vue-cal-layout'],{ topMargin: !isWeekMode }]" >
            <div class="schedule-wrap">
              <VueCal
                ref="cal"
                class="full-cal vuecal--full-height-delete"
                :class="[[$style.schedule], $style['is-week']]"
                :active-view="mode"
                locale="zh-hk"
                :selected-date="selectedDate"
                :time-from="6 * 60"
                :time-to="24 * 60"
                :sticky-split-labels="true"
                :editable-events="editable"
                :events="events"
                :on-event-click="onClickDetail"
                :time-step="15"
                :disable-views="['years', 'year', 'week', 'day', 'month']"
                :hide-title-bar="true"
                :time-cell-height="50"
                :snap-to-time="1"
                @view-change="fetchEvents"
              >
                <template v-slot:event="{ event }">
                  <div v-if="!event.disabled" class="wrap" :class="[bookingStatusFilter(event.customInfo.orderStatus, 'color'), { 'is-expired': checkExpired(event.end) }]" style="height: inherit;">
                    <div class="name">
                      {{event.customInfo.pet.name}}
                      <!-- {{ `${event.customInfo.customerName} ${event.customInfo.customerGender === 'male' ? '先生' : '小姐'}` }} -->
                    </div>
                    <div>{{ `${event.customInfo.productTitle} ${event.customInfo.priceTitle}` }}</div>

                    <div class="title" :event="event">
                      <div class="time">{{ event.start.format('HH:mm') + ' ~ ' + event.end.format('HH:mm') }}</div>
                    </div>
                    <template v-if="event.customInfo.childrenOrders.length">
                      <div v-for="(order, index) in event.customInfo.childrenOrders" :key="index">
                        <template v-for="(item, itemIndex) in order.addItems">
                          <p v-if="item.status !== 0" :key="itemIndex">
                            <span>加購 {{ item.title }}</span
                            ><br />
                            <span>({{ item.status | orderStatusFilter('text') }})</span>
                          </p>
                        </template>
                      </div>
                    </template>
                    <p v-if="event.customInfo.bufferTime > 0">緩衝時間 {{ event.customInfo.bufferTime }} 分鐘</p>
                  </div>
                  <div v-else class="disabled"></div>
                </template>
              </VueCal>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7" class="hidden-mobile">
        <CalendarItem @update="updateSelectedDate"></CalendarItem>
      </el-col>
    </el-row>
    <OrderInfo :visible.sync="drawerVisible" :order.sync="drawerOrderData" @update="tryToFetchSchedule" />
  </div>
</template>
<style lang="scss"></style>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_steps.scss';

.vue-cal-layout {
  display: flex;
  margin-left: -25px;
  padding-left: 22px;
  // margin-top: -20px;
  &:global {
    &.topMargin{
      // margin-top: -20px;
      @include touch {
        // margin-top: 0;
      }
    }
  }
  @include touch {
    margin-right: -21px;
    margin-top: 0;
  }
  :global {
    .vuecal__weekdays-headings {
      display: none;
    }
    .schedule-wrap {
      flex: 1 0 auto;
      height: auto;
      // height: 70vh;
    }
  }
}

.schedule {
  border-radius: 4px;
  box-shadow: inherit !important;
  position: relative;
  :global {
    .vuecal__header {
      .vuecal__split-days-headers {
        border-top: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
        .day-split-header {
          .el-dropdown {
            width: 99%;
            button {
              border: none;
              width: 100%;
              span {
                display: flex;
                justify-content: space-between;
              }
            }
          }
          & + .day-split-header {
            border-left: 1px solid rgb(198 198 186 / 0.7);
          }
        }
      }
    }
    .vuecal__time-cell-line::before {
      left: 43px;
    }
    .vuecal__body:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 42px;
      width: 100%;
      height: 1px;
      background: rgba(0, 0, 0, 0.08);
    }
    .vuecal__cell-content {
      .vuecal__no-event {
        display: none;
      }
      .vuecal__event {
        background-color: transparent;
        cursor: pointer;
        .wrap {
          padding: 10px;
          border-radius: 8px;
          border-width: 2px;
          border-style: solid;
          text-align: left;
          .name {
            font-size: 16px;
            letter-spacing: 1.4px;
            line-height: 20px;
            color: #3f3a2e;
            margin-bottom: 5px;
            font-weight: 400;
          }
          .title {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
            .time {
              font-size: 15px;
              .cycle {
                font-weight: 400;
              }
            }
            svg {
              color: white;
              background: green;
              padding: 6px;
              font-size: 30px;
              border-radius: 6px;
              padding-left: 8px;
            }
          }
          &.finish {
            border-color: $color-state-finish;
            background-color: lighten($color-state-finish, 50%);
          }
          &.success {
            border-color: $color-state-success;
            background-color: lighten($color-state-success, 35%);
          }
          &.warning {
            border-color: $color-state-warning;
            background-color: lighten($color-state-warning, 35%);
          }
          &.danger {
            border-color: $color-state-danger;
            background-color: lighten($color-state-danger, 30%);
          }
          &.info {
            border-color: $color-state-info;
            background-color: lighten($color-state-info, 30%);
          }
          &.is-disabled {
            pointer-events: none;
          }
          &.is-expired,
          &.is-disabled {
            &::before {
              content: '';
              position: absolute;
              top: -10px;
              bottom: -10px;
              left: -10px;
              right: -10px;
              background: white;
              opacity: 0.6;
            }
          }
        }
        &.vuecal__event--background {
          margin-top: 2px;
          z-index: 0;
          .disabled {
            height: inherit;
            background: repeating-linear-gradient(45deg, lightgrey 0px, lightgrey 2px, #f2f2f2 0px, #f2f2f2 7px);
            opacity: 0.5;
            box-shadow: inset 0 -2px white;
            pointer-events: none;
          }
        }
      }
      & + .vuecal__cell-content {
        border-left: 1px solid rgba(0, 0, 0, 0.08);
      }
    }
    .vuecal__time-column {
      // width: 4.4em;
    }
  }
}
:global() {
  :local(.schedule) {
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 42px;
      width: calc(100% - 9px);
      height: 1px;
      background: rgb(0 0 0 / 0.08);
    }
  }
}
.card-wrapper {
  min-height: 79vh;
  @include touch {
    min-height: 0;
    margin-bottom: 0;
  }
  :global {
    .el-card__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @include touch {
        background: #f8f4f2;
        border-top: none;
        height: 48px;
      }
    }
    .el-card__body {
      position: relative;
      @include touch {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
  }
}

.status {
  font-size: 14px;
  line-height: 20p;
  color: #3f3a2e;
  font-weight: 500;
  letter-spacing: 1.4px;
}
.weekpicker {
  padding-bottom: 24px;
  margin: 0 -20px 0px -20px;
  border-bottom: 1px solid #ebeef5;
  padding-left: 57px;
  padding-right: 20px;
  @include touch {
    background: #fafafa;
    margin: 0 -20px;
    margin-top: 0 !important;
    padding-bottom: 20px;
    padding-top: 25px;
    padding-left: 10px;
    padding-right: 10px;
  }
  :global {
    ul {
      height: auto;
    }
    li {
      border: none !important;
      .item-wrapper {
        .selected{
          box-shadow: 0 0 0 2px $color-secondary-light;
        }
        p {
          margin-top: 0;
          // color: #919191;
          color: $color-secondary-light;
          margin-bottom: 20px;
          @include touch {
            font-size: 12px;
            // color: #98b8ad;
          }
        }
        span {
          color: #3f3a2e;
          font-weight: 500;
          width: 35px;
          height: 35px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      &.today {
        background: transparent !important;
        color: inherit !important;
        .item-wrapper {
          span {
            color: white;
            background:$color-secondary-light
            // background: #41695b;
          }
        }
      }
    }
  }
}
.is-week {
  :global {
    .vuecal__cell--current,
    .vuecal__cell--today {
      background-color: rgba(235, 255, 245, 0.4);
    }
    .vuecal__cell--selected {
      background-color: rgba(240, 240, 255, 0.4);
    }
  }
}
.header-date {
  position: relative;
  font-size: 16px;
  font-weight: 500;
  svg {
    margin-right: 10px;
  }
}
.header-nav {
  button {
    padding: 12px !important;
    font-size: 12px;
  }
}
.mobile-picker {
  width: 0;
  position: absolute;
  left: 0;
  height: 24px;
  z-index: -1;
}
</style>
