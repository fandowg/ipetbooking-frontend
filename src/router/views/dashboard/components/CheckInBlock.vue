<script>
import lazyLoadComponent from '@router/lazyload-component'
import formatDate, {
  formatDateTimeRange,
  formatTimeRange,
} from '@utils/format-date'

export default {
  components: {
    carousel: () => lazyLoadComponent(import('vue-owl-carousel')),
  },
  filters: {
    formatDate,
    formatDateTimeRange,
  },
  data() {
    return {
      loading: false,
      productId: '',
      products: [],
      schedule: [],
      componentKey: 0,
    }
  },
  computed: {
    isEmptySchedule() {
      return this.schedule.length === 0
    },
  },
  created() {
    this.tryToFetchSchedule()
  },
  methods: {
    async tryToFetchSchedule(productId = '') {
      this.loading = true
      const response = await this.$store.dispatch('dashboard/fetchSchedule', {
        productId,
      })
      if (this.products.length === 0) this.products = response.products
      this.schedule = response.schedule
      this.loading = false
      this.$nextTick(() => {
        this.forceRerender()
      })
    },
    forceRerender() {
      this.componentKey += 1
    },
    redirectPhoneNumber() {
      this.$router.push({
        name: 'check-in',
        params: { activeTab: 'PhoneNumber' },
      })
    },
    redirectInventoryItem(productId, inventoryId) {
      this.$router.push({
        name: 'check-in',
        params: {
          productId,
          inventoryId,
        },
      })
    },
    getDay() {
      const daysMap = ['日', '一', '二', '三', '四', '五', '六']
      return daysMap[new Date().getDay()]
    },
    getInfoTime(inventory) {
      if (inventory.startDate === inventory.endDate)
        return formatTimeRange(inventory.startTime, inventory.endTime)
      else
        return formatDateTimeRange(
          inventory.startDate,
          inventory.endDate,
          inventory.startTime,
          inventory.endTime
        )
    },
  },
}
</script>

<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="header">
      <span>
        <h3 class="block-title">今日行程</h3>
        <span>{{ new Date() | formatDate() }}{{ `（${getDay()}）` }}</span>
      </span>
      <el-select
        v-model="productId"
        style="width:250px;"
        @change="tryToFetchSchedule"
      >
        <el-option label="所有預約項目的行程" value=""></el-option>
        <el-option
          v-for="product in products"
          :key="product.productId"
          :label="product.productName"
          :value="product.productId"
        ></el-option>
      </el-select>
      <el-button type="primary" @click="redirectPhoneNumber"
        ><BaseIcon name="phone" /> 電話報到</el-button
      >
    </div>
    <div style="height:231px;">
      <template v-if="isEmptySchedule">
        <div v-loading="loading" style="height:230px;"></div>
      </template>
      <template v-else>
        <carousel
          :key="componentKey"
          v-loading="loading"
          :class="$style['no-left-padding']"
          :items="5"
          :margin="15"
          :dots="false"
          :nav="false"
          :loop="false"
          :stage-padding="15"
        >
          <el-card
            v-for="(inventory, index) in schedule"
            :key="'inventory' + index"
            :class="$style['product-card']"
            :body-style="{ padding: '0px' }"
            shadow="never"
          >
            <span
              v-if="inventory.qty === inventory.inventory"
              :class="$style['out-of-stock']"
              >已售完</span
            >
            <el-image
              :src="inventory.productIntroImage"
              class="image"
              fit="cover"
            >
              <div slot="error" class="image--error">
                <BaseIcon name="image" />
              </div>
            </el-image>
            <div>
              <div :class="$style['inventory-info']">
                <div>
                  <div class="inventory-info-title">{{
                    inventory.productName
                  }}</div>
                  <div class="inventory-info-time">{{
                    getInfoTime(inventory)
                  }}</div>
                </div>
                <div style="color: rgba(128, 128, 128, 0.5);font-size: 13px;">
                  報名狀態： {{ inventory.qty }} / {{ inventory.inventory }}
                </div>
              </div>
              <div class="bottom clearfix">
                <el-button
                  style="width:100%;"
                  plain
                  @click="
                    redirectInventoryItem(
                      inventory.productId,
                      inventory.inventoryId
                    )
                  "
                  >查看時段訂單列表</el-button
                >
              </div>
            </div>
          </el-card>
        </carousel>
      </template>
    </div>
  </el-card>
</template>
<style lang="scss" module>
.out-of-stock {
  position: absolute;
  top: 5px;
  right: -5px;
  z-index: 2;
  background: #f56c6c;
  height: 25px;
  padding: 0 15px;
  line-height: 25px;
  font-size: 12px;
  color: white;
  font-weight: 400;
  letter-spacing: 1px;
  box-shadow: 0px 0px 2px 0px #000000;
}
.no-left-padding {
  :global {
    .owl-stage {
      padding-left: 0 !important;
    }
  }
}
.product-card {
  border: 0;
  :global {
    img {
      object-fit: cover;
      border: none;
    }
    .el-image.image {
      height: 100px;
      border: none;
    }
  }
}
.inventory-info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 90px;
  padding: 10px 0;
  :global {
    .inventory-info-title {
      font-weight: 600;
      font-size: 15px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      width: 90%;
    }
    .inventory-info-time {
      font-size: 12px;
      font-weight: 600;
    }
  }
}
</style>
