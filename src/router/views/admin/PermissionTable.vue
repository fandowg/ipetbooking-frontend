

<script>
import { merchantUserComputed } from '@state/helpers'

import permissions from './permission-data'

export default {
  props: {
    showOwner: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      permissionData: Object.freeze(permissions),
    }
  },
  computed: {
    ...merchantUserComputed,
    filterOwnerGroupList() {
      return this.showOwner
        ? this.userGroupList
        : this.userGroupList.filter((group) => group.value !== 7)
    },
  },
}
</script>

<template>
  <el-table :data="permissionData">
    <el-table-column prop="item" width="300"></el-table-column>
    <el-table-column
      v-for="group in filterOwnerGroupList"
      v-slot="{ row }"
      :key="group.id"
      :label="group.title"
      align="center"
    >
      <BaseIcon v-if="row.groupIds.includes(group.id)" name="check-circle" class="only-icon" />
    </el-table-column>
  </el-table>
</template>


