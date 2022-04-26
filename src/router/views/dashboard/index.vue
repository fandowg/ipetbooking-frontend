<script>
import lazyLoadComponent from '@router/lazyload-component'

import Layout from '@layouts/main'

import tourMixin from '@src/mixins/tour'

export default {
  page: {
    title: '儀表板',
    meta: [{ name: 'description', container: 'Dashboard' }],
  },
  components: {
    Layout,
    // CheckInBlock: () => lazyLoadComponent(import('./components/CheckInBlock')),
    SmsBlock: () => lazyLoadComponent(import('./components/SmsBlock')),
    OrderBlock: () => lazyLoadComponent(import('./components/OrderBlock')),
    BookingBlock: () => lazyLoadComponent(import('./components/BookingBlock')),
    // OperatorBlock: () =>
    //   lazyLoadComponent(import('./components/OperatorBlock')),
  },
  mixins: [tourMixin],
  tourName: 'merchantInfo',
}
</script>

<template>
  <Layout>
    <!-- <BasePageHeader>
      <template v-slot:title>儀表板</template>
    </BasePageHeader> -->
    <!-- <keep-alive>
      <CheckInBlock
        v-can:api="'getDashboardSchedule'"
        :class="$style['block']"
      />
    </keep-alive> -->
    <keep-alive>
      <SmsBlock v-can:api="'getDashboardSmsInfo'" :class="$style['block']" />
    </keep-alive>
    <keep-alive>
      <BookingBlock
        v-can:api="'getDashboardRanking'"
        :class="$style['block']"
      />
    </keep-alive>
    <keep-alive>
      <OrderBlock v-can:api="'getDashboardOrders'" :class="$style['block']" />
    </keep-alive>
    <!-- <keep-alive>
      <OperatorBlock
        v-can:api="'getDashboardActivity'"
        :class="$style['block']"
      />
    </keep-alive> -->
  </Layout>
</template>
<style lang="scss" module>
.block {
  margin-bottom: 20px;
  :global {
    .el-card__header {
      border-bottom: none;
      padding-bottom: 0;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      @include max-sm {
        flex-direction: column;
        align-items: flex-start;
      }
      .block-title {
        margin-bottom: 10px;
        margin-top: 5px;
      }
    }
    .large-btn {
      height: 90px;
      width: 100%;
      font-size: 16px;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      text-align: left;
      border: none;
      svg {
        position: absolute;
        right: -8px;
        font-size: 4em;
        bottom: 13px;
        z-index: 0;
        color: rgba(255, 255, 255, 0.3);
      }
    }
    .card-statistics {
      height: 90px;
      border: none;
      .el-card__body {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .card-statistics-info {
          height: 100%;
          .card-statistics-title {
            margin-bottom: 10px;
            color: darkgrey;
            font-size: 10px;
          }
          .card-statistics-count {
            font-size: 1.5em;
            font-weight: 600;
            letter-spacing: 2px;
          }
        }
        .el-avatar {
          position: relative;
          background: #f3d3c2;
          svg {
            font-size: 22px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            color: $color-secondary;
          }
        }
      }
    }
    .el-radio-group + .el-table,
    .header + .el-table {
      margin-top: 20px;
    }
    .el-table {
      border: 1px solid #d3d3d340;
      border-bottom: 0;

      th {
        background: #d3d3d340;
      }
    }
  }
}
</style>
