<script>
import lazyLoadComponent from '@router/lazyload-component'
import { pickObjectByKey } from '@utils'
import { authComputed } from '@state/helpers'

import { productStateMap, productStateFilter } from '@utils/filter-value-to-text'

const stateButtonMap = (productType) => {
  return {
    add: {
      page: 'add',
      icon: 'edit',
      label: '繼續新增步驟',
      actionName: 'editProduct',
    },
    edit: {
      page: 'edit',
      icon: 'edit',
      label: `編輯${productType}`,
      actionName: 'editProduct',
    },
    on: {
      function: 'updateState',
      icon: 'eye',
      label: `上架${productType}`,
      actionName: 'updateProductState',
    },
    off: {
      function: 'updateState',
      icon: 'eye-slash',
      label: `下架${productType}`,
      actionName: 'updateProductState',
    },
    orders: {
      page: 'orders',
      icon: 'clipboard-list',
      label: '查看訂單',
      actionName: 'searchOrder',
    },
  }
}
export default {
  components: {
    BaseButton: () => lazyLoadComponent(import('@components/BaseButton')),
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
  },
  filters: {
    productStateFilter,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      dialogCalendarVisible: false,
    }
  },
  mounted() {
    this.$emit('ready', this.data.id)
  },
  computed: {
    ...authComputed,
    buttons() {
      const stateButtonArray = productStateMap[this.data.state].buttons
      return pickObjectByKey(
        stateButtonMap(this.$t(`PRODUCT.${this.data.type}.NAME`)),
        stateButtonArray
      )
    },
    enabledDeleteButton() {
      return this.data.activeOrders === 0
    },
    productCalendarURL(){
      return `${window.location.origin}/api/${this.currentUser.merchantAlias}/${this.currentUser.merchantId}/product/${this.data.alias}/ical`
    }
  },
  methods: {
    emitUpdated() {
      this.$emit('updated')
      this.dialogVisible = false
    },
    handleUpdateState(buttonType) {
      const submitData = {
        ids: [this.data.id],
        state: buttonType === 'off' ? 0 : 1,
      }

      const stateConfirmMap = {
        0: {
          message: this.$t('PRODUCT.STATE_OFF_CONFIRM_MESSAGE', {
            name: this.$t(`PRODUCT.${this.data.type}.NAME`),
          }),
          confirmText: '立即下架',
        },
        1: {
          message: this.$t('PRODUCT.STATE_ON_CONFIRM_MESSAGE', {
            name: this.$t(`PRODUCT.${this.data.type}.NAME`),
          }),
          confirmText: '上架分店',
        },
      }
      const confirmContent = stateConfirmMap[submitData.state]

      this.$confirm(confirmContent.message, '提示', {
        confirmButtonText: confirmContent.confirmText,
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.$store.dispatch('product/updateState', submitData).then(() => {
          this.emitUpdated()
        })
      })
    },
    handleRemove() {
      this.$confirm(
        this.$t('PRODUCT.DELETE_CONFIRM_MESSAGE', {
          name: this.$t(`PRODUCT.${this.data.type}.NAME`),
        }),
        '提示',
        {
          confirmButtonText: '確認',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }
      ).then(() => {
        this.$store.dispatch('product/remove', { ids: [this.data.id] }).then(() => {
          this.emitUpdated()
        })
      })
    },
    handleToPage(buttonType) {
      const typeRouteMap = {
        add: {
          name: 'add-product',
          params: { productId: this.data.id },
          query: {
            type: this.data.type,
          },
        },
        edit: {
          name: 'edit-product',
          params: { productId: this.data.id },
        },
        orders: {
          name: 'orders',
          query: {
            productId: this.data.id,
          },
        },
      }
      this.$router.push(typeRouteMap[buttonType])
    },
    onClickButton(type) {
      switch (type) {
        case 'on':
        case 'off':
          this.handleUpdateState(type)
          break
        case 'calendarUrl':
          this.dialogCalendarVisible = true
          break
        default:
          this.handleToPage(type)
          break
      }
    },
    copyCalendarUrl() {
      this.$refs.CalendarUrlInput.select()
      document.execCommand('copy')
      this.$message('連結複製成功')
    },
    openExternal(url) {
      window.open(url, '_blank')
    },
  },
}
</script>

<template>
  <div :class="[$style.container, { [$style['container--active']]: dialogVisible }]" @click="onClickButton('edit')">
    <el-image :src="data.image" class="image-default" fit="cover">
      <div slot="error" class="image--error">
        <BaseIcon name="image" />
      </div>
    </el-image>
    <div :class="$style.title"><h5>{{ data.name }}</h5></div>
    <BaseStateLabel :state="data.state | productStateFilter('color')" :class="$style.label">{{ data.state | productStateFilter('text') }}</BaseStateLabel>
    <div :class="$style.buttons">
        <BaseButton v-for="({ icon, label, actionName }, type) in buttons" :key="type" v-can:api="actionName" :icon="icon" @click.stop="onClickButton(type)">{{ label }}</BaseButton>

        <!-- <BaseButton v-can:api="'deleteProduct'" icon="trash-alt" :disabled="!enabledDeleteButton" @click="handleRemove">
          刪除{{ $t(`PRODUCT.${data.type}.NAME`) }}
          <span v-if="!enabledDeleteButton">(欲刪除請先處理訂單)</span>
        </BaseButton> -->
      </div>
    <el-dialog :title="data.name" :visible.sync="dialogVisible" top="0" width="300px" append-to-body>
      <div :class="$style.buttons">
        <BaseButton v-for="({ icon, label, actionName }, type) in buttons" :key="type" v-can:api="actionName" :icon="icon" @click="onClickButton(type)">{{ label }}</BaseButton>

        <!-- <BaseButton v-can:api="'deleteProduct'" icon="trash-alt" :disabled="!enabledDeleteButton" @click="handleRemove">
          刪除{{ $t(`PRODUCT.${data.type}.NAME`) }}
          <span v-if="!enabledDeleteButton">(欲刪除請先處理訂單)</span>
        </BaseButton> -->
      </div>
    </el-dialog>

    <el-dialog :title="$t(`PRODUCT.${data.type}.NAME`) + '行事曆'" :visible.sync="dialogCalendarVisible" :append-to-body="true" top="0" width="680px">
      <el-input ref="CalendarUrlInput" :value="productCalendarURL" :readonly="true">
        <el-button slot="append" @click="copyCalendarUrl">複製此網址</el-button>
      </el-input>
      <p style="margin-top: 50px;">行事曆設定教學</p>
      <div style="margin-bottom: 15px;">
        <el-button style="width: 100%;" type="primary" plain @click="openExternal('https://support.apple.com/zh-tw/guide/iphone/iph3d1110d4/ios')">設定於 Apple 行事曆</el-button>
      </div>
      <div>
        <el-button style="width: 100%;" type="primary" plain @click="openExternal('https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DDesktop&hl=zh-Hant')"
          >設定於 Google 行事曆</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.title {
  text-align: center;
  // padding: 5px 10px;
}
.label {
  position: absolute;
  top: 10px;
  right: 0;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
.container {
  position: relative;
  font-size: $font-size-large;
  cursor: pointer;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;

  &--active .image,
  &:hover .image {
    @include layer-elevation(8);

    border-color: $color-primary;
  }
}
.buttons {
  margin-top: $size-button-padding-vertical;
  padding-left: 15px;
  padding-bottom: 15px;
  // border-top: 1px solid $color-border-base;
}
</style>
