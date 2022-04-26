<script>
import lazyLoadComponent from '@router/lazyload-component'
import { staffComputed } from '@state/helpers'

import BaseButtonDialog from '@components/BaseButtonDialog'

const staffTitleList = [
  '分享者',
  '主廚',
  '主辦人',
  '主辦單位',
  '合作夥伴',
  '協辦單位',
  '承辦單位',
  '治療師',
  '美容師',
  '師傅',
  '特別邀請',
  '參與機構',
  '教練',
  '設計師',
  '媒體合作',
  '策展人',
  '嘉賓',
  '講者',
  '醫師',
  '藝術家',
  '贊助廠商',
  '導覽員',
  '解說員',
  '老師',
]

export default {
  components: {
    BaseButtonDialog,
    StaffForm: () => lazyLoadComponent(import('@components/StaffForm')),
    SelectStaffButton: () => lazyLoadComponent(import('./SelectStaffButton')),
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      staffTitleList: Object.freeze(staffTitleList),
    }
  },

  computed: {
    ...staffComputed,
    staffList() {
      return JSON.parse(JSON.stringify(this.staffs))
    },
    selectedList() {
      return this.value
    },
    unSelectedList() {
      return this.staffList.filter(
        (staff) => this.value.map((el) => el.id).indexOf(staff.id) === -1
      )
    },
  },
  created() {
    this.tryToGetStaffs()
  },
  methods: {
    onDeselect(staffId) {
      this.$emit(
        'input',
        this.value.filter((el) => el.id !== staffId)
      )
    },
    onSelect(staffs) {
      this.$emit('input', [...this.value, ...staffs])
    },
    updateList(staff) {
      this.tryToGetStaffs()
      this.$emit('input', [...this.value, staff])
    },
    closeDialog() {
      this.dialogVisible = false
    },
    async tryToGetStaffs() {
      await this.$store.dispatch('staff/fetchList')
    },
  },
}
</script>

<template>
  <div>
    <div :class="$style['staff__list']">
      <div
        v-for="(staff, index) in selectedList"
        :key="staff.id"
        :class="$style['staff__item']"
      >
        <div :class="$style['staff__content']">
          <el-avatar
            :src="staff.avatar"
            :size="100"
            :class="$style['staff__avatar']"
          ></el-avatar>
          <div :class="$style['staff__name']">
            <el-form-item
              style="margin: 0;"
              :prop="'staffs.' + index + '.hostTitle'"
              :rules="{
                required: true,
                message: '請選擇頭銜',
                trigger: 'blur',
              }"
            >
              <el-select
                v-model="staff.hostTitle"
                :class="$style['staff__title']"
                prop="hostTitle"
                placeholder="請選擇人員的頭銜"
                filterable
              >
                <el-option
                  v-for="title in staffTitleList"
                  :key="title"
                  :value="title"
                  >{{ title }}</el-option
                >
              </el-select>
            </el-form-item>

            <h5>{{ staff.name }}</h5>
            {{ staff.title }}
          </div>
          <div :class="$style['staff__intro']">{{ staff.description }}</div>
        </div>

        <el-button
          type="danger"
          size="mini"
          plain
          @click="onDeselect(staff.id)"
        >
          <BaseIcon name="trash-alt" />
        </el-button>
      </div>
    </div>

    <BaseButtonDialog title="創建人員" :dialog-visible.sync="dialogVisible">
      <span slot="trigger">創建人員</span>
      <StaffForm @store="updateList" @close="closeDialog" />
    </BaseButtonDialog>
    <span :class="$style.separator">或</span>
    <SelectStaffButton :list="unSelectedList" @select="onSelect" />
  </div>
</template>

<style lang="scss" module>
@import '@design';
.separator {
  margin: 0 10px;
}
.staff {
  &__list {
    margin-bottom: 15px;
  }
  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid $color-border-base;
  }
  &__content {
    display: flex;
    align-items: center;
  }
  &__avatar,
  &__name {
    flex-shrink: 0;
  }
  &__name {
    flex-basis: 300px;
    flex-grow: 1;
    h5 {
      margin-top: 0;
    }
  }
  &__title {
    margin-bottom: 15px;
  }
  &__avatar,
  &__name,
  &__intro {
    margin-right: 30px;
  }
}
</style>
