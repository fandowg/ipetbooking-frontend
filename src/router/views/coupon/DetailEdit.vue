<script>
import CouponForm from './CouponForm'
import cloneDeep from 'lodash/cloneDeep'

import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'
export default {
  components: { CouponForm },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    isAssigned: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeTab: '1',
      couponData: cloneDeep(this.defaultValue),
      tabList: Object.freeze([
        {
          title: '基本資訊',
          component: () => import('./CouponForm'),
        },
        {
          title: '適用項目',
          component: () => import('./CouponAssigned'),
        },
        {
          title: '適用對象',
          component: () => import('./CouponTarget'),
        },
      ]),
      tryingToSave: false,
      tryingToSend: false,
      tryingToRemove: false,
      allMembers: [],
    }
  },
  computed: {
    availableMembers() {
      let filterMembers = []
      if (this.defaultValue.availableTags.length === 0 && this.defaultValue.availableMembers.length === 0) {
        filterMembers = this.allMembers
      } else {
        const availableTagIds = this.defaultValue.availableTags.map((item) => item.id)
        const availableMemberIds = this.defaultValue.availableMembers.map((item) => item.id)
        const blockMemberIds = this.defaultValue.blockMembers.map((item) => item.id)
        filterMembers = this.allMembers.filter((member) => {
          const tagids = member.tags.map((item) => item.id)
          const isAvailable = tagids.some((item) => {
            return availableTagIds.includes(item)
          })
          if (isAvailable && !blockMemberIds.includes(member.id)) {
            return true
          } else {
            if (availableMemberIds.includes(member.id)) {
              return true
            }
          }
        })
      }
      return filterMembers
    },
  },
  watch: {
    isAssigned() {
      this.activeTab = '3'
    },
  },
  created() {
    this.tryToSearch()
  },
  methods: {
    async tryToSearch() {
      const { items } = await this.$store.dispatch('member/fetchList')
      this.allMembers = items
    },
    getCoupon() {
      this.$store.dispatch('coupon/fetchSingle', this.$route.params.couponId).then((coupon) => {
        this.$emit('update:defaultValue', coupon)
      })
    },
    async onClickSave() {
      this.tryingToSave = true
      try {
        // console.log(this.$refs.step2)
        if (this.$refs.step2[0].submitData.priceIds.length === 0) {
          this.$confirm('請至少選擇一個適用項目', '提示', {
            confirmButtonText: '確定',
            showCancelButton: false,
            type: 'warning',
            center: true,
          })
          this.tryingToSave = false
          return
        }
        const submitData = Object.assign({}, this.$refs.step1[0].submitData, this.$refs.step2[0].submitData, this.$refs.step3[0].filterSubmitData)
        await this.$store.dispatch('coupon/store', submitData)
        messageStroe('edit')
        // await this.$alert('儲存成功', '太棒了！', {
        //   confirmButtonText: '確認',
        //   type: 'success',
        //   center: true,
        // })
        this.tryingToSave = false
        this.getCoupon()
        // this.couponData = await this.$store.dispatch('coupon/fetchSingle', this.defaultValue.id)
        
      } catch (error) {
        this.tryingToSave = false
      }
    },
    async tryToSend() {
      if (this.availableMembers.length === 0) {
        await this.$confirm(`沒有適用的會員`, {
          confirmButtonText: '確定',
          showCancelButton: false,
          // cancelButtonText: '取消',
          // type: 'warning',
          center: true,
        })
        return
      }
      await this.$confirm(`確定發送${this.availableMembers.length}張優惠券`, {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        // type: 'warning',
        center: true,
      })
      this.tryingToSend = true
      const sendData = {
        memberIds: this.availableMembers.map((item) => item.id),
        router: 'all',
        sendWhoType: 'all',
        mode: 'byMember',
        templateContent: '寄送全部優惠券',
        subject: '店家名稱',
      }
      await this.$store.dispatch('merchant/sendNoti', sendData)
      this.$message({ message: '發送成功！', type: 'success' })
      this.tryingToSend = false
    },
    async tryToRemove() {
      try {
        await messageBoxDelete('該優惠券')
        try {
          this.tryingToRemove = true
          await this.$store.dispatch('coupon/remove', { ids: [this.defaultValue.id] })
          messageDelete()
          this.$router.push({ name: 'coupon' })
        } finally {
          this.tryingToRemove = false
        }
      } catch {
      
      }
    },
    changePage(value) {
      this.$emit('changePage', value)
    },
  },
}
</script>
<template>
  <div :class="$style.page">
    <BasePageHeader title="編輯優惠券" />
    <el-tabs v-model="activeTab" stretch type="border-card">
      <el-tab-pane v-for="(tab, index) in tabList" :key="index" :label="tab.title" :name="`${index + 1}`">
        <component :is="tab.component" :ref="`step${index + 1}`" :default-value="defaultValue" @store="getCoupon"></component>

        <div :class="$style.footer">
          <el-button  class="is-round" type="danger" :loading="tryingToRemove" :disabled="tryingToRemove" @click="tryToRemove">刪除</el-button>
          <el-button class="is-round" type="primary" plain :loading="tryingToSave" @click="$router.push({ name: 'coupon' })">取消</el-button>
          <el-button class="is-round" type="primary" :loading="tryingToSave" @click="onClickSave">儲存變更</el-button>
          <el-button v-if="activeTab === '3'" class="is-round" :loading="tryingToSave" @click="changePage(2)">查看名單</el-button>
          <el-button v-if="activeTab === '3'" class="is-round" :loading="tryingToSave" @click="tryToSend">儲存並發送</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" module>
@import '@src/design/layout_detail_steps.scss';
</style>