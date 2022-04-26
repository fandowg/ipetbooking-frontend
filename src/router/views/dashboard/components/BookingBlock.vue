<script>
export default {
  data() {
    return {
      loading: false,
      filterProduct: '',
      list: [],
      filterProducts: []
    }
  },
  created() {
    this.tryToFetchRanking()
  },
  methods: {
    async tryToFetchRanking(productId = '') {
      this.loading = true
      const {filter, ranking} = await this.$store.dispatch('dashboard/fetchRanking', {
        productId,
      })
      this.list = ranking
      this.filterProducts = filter
      this.loading = false
    },
    redirectPriceList(info, show = undefined) {
      this.$router.push({
        name: 'service',
        params: {
          priceInfo: info || undefined,
          createPrice: show,
        },
      })
    },
    indexMethod(index) {
      return '#' + (index + 1)
    },
  },
}
</script>

<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="header">
      <h3 class="block-title">
        近七日熱門預約服務項目排行
      </h3>
      <div :class="$style.headerRight">
        <template v-can="'redirectProducts'">
          <span>
            <el-button class="is-round" type="primary" plain @click="redirectPriceList('')">
              <BaseIcon name="th" /> 檢視所有服務項目
            </el-button>
          </span>
          <span>
            <el-button class="is-round" type="primary" @click="redirectPriceList('', true)">
              <BaseIcon name="plus" /> 新增服務項目
            </el-button>
          </span>
        </template>
      </div>
    </div>
    <span>篩選： </span>
    <el-radio-group
      v-model="filterProduct"
      :class="$style['sort-group']"
      @change="tryToFetchRanking"
    >
      <el-radio-button label="">所有</el-radio-button>
      <el-radio-button v-for="(product, index) in filterProducts" :key="`filter-${index}`" :label="product.id">{{product.title}}</el-radio-button>
    </el-radio-group>
    <el-table
      v-loading="loading"
      element-loading-text="取得排行資訊中"
      :data="list"
    >
      <el-table-column label="#" :index="indexMethod" type="index" width="50">
      </el-table-column>
      <el-table-column label="預約項目" prop="title" min-width="300">
      </el-table-column>
      <el-table-column v-slot="{ row }" label="訂單數量" width="190" align="right">
        <div
          ><BaseIcon name="clipboard-list" /> {{ row.orderCount }}</div
        >
      </el-table-column>
      <el-table-column width="40">
      </el-table-column>
      <!-- <el-table-column v-slot="{ row }" label="動作" width="150">
        <el-button type="text" @click="redirectPriceList(row)">
          <BaseIcon name="edit" />
          修改服務項目</el-button
        >
      </el-table-column> -->
    </el-table>
  </el-card>
</template>
<style lang="scss" module>
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sort-group {
  :global {
    .el-radio-button {
      box-shadow: none !important;
      &:not(.is-active) {
        .el-radio-button__inner {
          border-color: transparent;
        }
      }
      &.is-active {
        .el-radio-button__inner {
          border-color: $color-secondary;
          background: $color-secondary;
        }
      }
      .el-radio-button__inner {
        padding: 6px 15px;
        font-size: 12px;
        border-radius: 8px;
        box-shadow: none;
        outline: none;
        font-size: 14px;
      }
    }
  }
}

.headerRight {
  > span {
    button {
      margin-left: 0.5rem;
    }
  }
  @include max-sm {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    > span {
      width: 100%;
      flex: 0 0 auto;
      button {
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
