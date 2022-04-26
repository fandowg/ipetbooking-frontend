<script>
// 目前沒用到這個 component
import lazyLoadComponent from '@router/lazyload-component'

import { genderFilter, orderStatusFilter, bookingStatusFilter, orderSourceFilter } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

import { authComputed } from '@state/helpers'

export default {
  name: 'OrderDetail',
  components: {
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
  },
  filters: {
    orderStatusFilter,
    genderFilter,
    orderSourceFilter,
    formatDate,
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
    }
  },
  computed: {
    ...authComputed,
    isEmptyByOrderExtrafields() {
      return this.defaultValue.byOrderExtrafields instanceof Array
    },
    isEmptyBySizeExtrafields() {
      if (this.defaultValue.customerInfos.length === 0) return true
      return this.defaultValue.customerInfos[0].bySizeExtrafields instanceof Array
    },
    isHomeService(){
      return this.defaultValue.storeType === 'home'
    }
  },
  methods: {
    updateMode(value) {
      this.mode = value
    },
  },
}
</script>

<template>
  <div>
    <h5 class="Jost">#{{ defaultValue.id }}</h5>
    <BaseStateLabel :state="defaultValue.status | orderStatusFilter('color')">{{ defaultValue.status | orderStatusFilter('text') }}</BaseStateLabel>
    <BaseStateLabel :round="true" :state="defaultValue.status | bookingStatusFilter('color')" text>{{ defaultValue.status | bookingStatusFilter('text') }}</BaseStateLabel>

    <div :class="$style.header">
      <h5 :class="$style.title">{{ defaultValue.productName }} {{ defaultValue.params[0].title }}</h5>
      <h6 style="margin-top: -10px;color: darkgrey;">{{ defaultValue.params[0].introtext }}</h6>
      <h5 class="Jost">預約時間：{{ defaultValue.date | formatDate }} {{ defaultValue.time }}</h5>
      <h5 v-if="isHomeService" class="Jost">服務地址：{{ defaultValue.address }}</h5>
    </div>
    <el-divider></el-divider>
    <template v-if="mode === 'view'">
      <h5 :class="$style.title">使用人資訊</h5>
      <ul :class="$style.info">
        <li>{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</li>
        <li>{{ `${defaultValue.phoneCode} ${defaultValue.phoneNumber}` }}</li>
        <li>{{ defaultValue.email }}</li>
      </ul>
      <h5 :class="$style.title">登記人備註</h5>
      <p>{{ defaultValue.note || '目前尚無備註' }}</p>

      <BaseCollapse v-if="!isEmptyByOrderExtrafields" title="參與資訊" class="hidden-mobile" :class="$style['info-byOrder']">
        <ul v-for="(byOrderExtrafield, byOrderExtrafieldIndex) in defaultValue.byOrderExtrafields" :key="`byOrderExtrafieldIndex-${byOrderExtrafieldIndex}`" :class="$style.question">
          <li class="title">{{ byOrderExtrafield.title }}</li>
          <li>{{ byOrderExtrafield.value }}</li>
        </ul>
      </BaseCollapse>

      <div class="visible-mobile">
        <h5 :class="$style.title">登記資訊</h5>
        <ul v-for="(byOrderExtrafield, byOrderExtrafieldIndex) in defaultValue.byOrderExtrafields" :key="`byOrderExtrafieldIndex-${byOrderExtrafieldIndex}`" :class="$style.question">
          <li class="title">{{ byOrderExtrafield.title }}</li>
          <li>{{ byOrderExtrafield.value }}</li>
        </ul>
      </div>

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
    </template>
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
.share {
  &__buttons {
    display: flex;
    align-items: center;
    text-align: center;
  }
  &__button {
    flex: 1;
  }
  &__icon {
    font-size: 3rem;
  }
  &__label {
    margin-top: 10px;
  }
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
  @include touch {
    padding-left: 0;
  }
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
</style>
