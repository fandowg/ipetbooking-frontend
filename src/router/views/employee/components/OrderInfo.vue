<script>
import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'
import { PortalTarget } from 'portal-vue'

import 'element-ui/lib/theme-chalk/display.css'

export default {
  components: {
    BaseButtonDialog,
    PortalTarget,
    OrderDetail: () => lazyLoadComponent(import('./OrderDetail')),
    HistoryNote: () => lazyLoadComponent(import('@components/HistoryNote')),
    CheckInDialog: () => lazyLoadComponent(import('./CheckInDialog')),
    SignatureDialog: () => lazyLoadComponent(import('@components/SignatureDialog')),

    Info: () => lazyLoadComponent(import('@components/Order/Info')),
    Service: () => lazyLoadComponent(import('@components/Order/Service')),
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: '',
      orderDetailData: '',
      checkInDialogVisible: false,
      signatureDialogVisible: false,
      noShow: false,
      mode: 'view',
      historyNoteMode: 'view',
      signDialogKey: 0,
    }
  },
  computed: {
    isActive() {
      return this.activeName !== ''
    },
    isHistoryNoteMode() {
      return this.historyNoteMode === 'view'
    },
  },
  methods: {
    handleCloseDrawer() {
      // console.log(456)
      this.$emit('update:visible', false)
      this.activeName = ''
    },
    closeDrawer(){
      this.$refs.drawer.closeDrawer()
      // this.$emit('update:visible', false)
      this.activeName = ''
    },
    async handleStore() {
      const updatedValue = await this.$store.dispatch('order/fetchSingle', this.order.id)
      this.$emit('update:order', updatedValue)
      this.$emit('update')
    },
    closeDialog() {
      this.dialogVisible = false
    },
    showCheckInDialog(noShow = false) {
      this.checkInDialogVisible = true
      this.noShow = noShow
    },
    showSignatureDialog(mode = false) {
      this.signDialogKey++
      this.signatureDialogVisible = true
      this.mode = mode
    },
    onNoteModeUpdate(mode) {
      this.historyNoteMode = mode
    },
  },
}
</script>

<template>
  <el-drawer ref="drawer" :visible="visible" class="mobile" destroy-on-close append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" @close="handleCloseDrawer">
    <!-- header -->
    <div slot="title">
      <template v-if="order.status === 3">
        <el-button type="danger" class="is-round" @click="showCheckInDialog(true)">未報到</el-button>
        <el-button type="primary" class="is-round" style="background: #60A32F;" @click="showCheckInDialog(false)">報到</el-button>
      </template>
      <el-button v-if="order.status === 4 && order.paymentStatus !== 'UNPAID'" type="primary" class="is-round" @click="showSignatureDialog('edit')">簽名確認</el-button>
      <el-button v-if="order.status === 6" type="primary" class="is-round" @click="showSignatureDialog('view')">查看簽名</el-button>
    </div>
    <el-button class="visible-mobile" type="text" style="font-size: 16px;padding-top: 23px;padding-bottom: 0;letter-spacing: 1.6px;margin-bottom: 20px;" @click="closeDrawer"
      ><BaseIcon icon-style="fal" name="chevron-left" style="margin-right: 5px;"></BaseIcon>返回</el-button
    >
    <Info :default-value="order"></Info>
    <Service :class="$style['tab-content']" :default-value="order" @update="handleStore"></Service>

    <CheckInDialog :visible.sync="checkInDialogVisible" :default-value="order" :no-show="noShow" @update="handleStore" />
    <SignatureDialog :key="signDialogKey" :visible.sync="signatureDialogVisible" :order="order" :mode="mode" @update="handleStore" />
    <div v-if="[3, 4].includes(order.status)" class="visible-mobile" :class="$style.footer">
      <template v-if="order.status === 3">
        <el-button type="danger" class="is-round" @click="showCheckInDialog(true)">未報到</el-button>
        <el-button type="primary" class="is-round" style="background: #60A32F;" @click="showCheckInDialog(false)">報到</el-button>
      </template>
      <el-button v-if="order.status === 4 && order.paymentStatus !== 'UNPAID'" type="primary" class="is-round is-fullwidth" @click="showSignatureDialog('edit')">簽名確認</el-button>
      <!-- <el-button v-if="order.status === 6" type="primary" class="is-round is-fullwidth" @click="showSignatureDialog('view')">查看簽名</el-button> -->
    </div>
  </el-drawer>
</template>

<style lang="scss" module>
@import '@design';
.header {
  margin-bottom: 20px;
}
.reverse {
  :global {
    .el-drawer__header {
      flex-direction: row;
    }
  }
}
.blocks {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 30px - 68px);
  :global {
    .el-col {
      flex-grow: 1;
      display: flex;
      margin-top: 20px;
    }
  }
}

.actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: white;
  border-top: 1px solid #dcdfe6;
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
.footer {
  display: flex;
  bottom:0;
  // bottom: 85px;
  background: white;
  padding: 17px 20px;
  box-shadow: 0 -5px 6px #0000000b;
  position: fixed;
  left: 0;
  right: 0;
  border: 1px solid #e6e6e6;
  :global {
    button {
      flex: 1;
    }
  }
}
</style>
