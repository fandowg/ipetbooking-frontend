<script>
import lazyLoadComponent from '@router/lazyload-component'
import { debounce } from 'lodash'

export default {
  components: {
    TagManagment: () => lazyLoadComponent(import('./TagManagment')),
  },
  props: {
    selectedMember: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
      keyword: '',
      tagList: [],
      selectedTag: [],
      selectedTagClone: [],
      selectedTagPrevious: [],
      tryingApply: false,
      tryingFetch: false,
      addList: new Set(),
      addListTracker: 1,  // vue reactivity 不支援 new Set
      deleteList: new Set(),
      deleteListTracker: 1
    }
  },
  computed: {
    tagRecord() {
      const count = {}
      this.tagList.forEach((tag) => {
        count[`id_${tag.id}`] = 0
      })
      this.selectedMember.forEach((member) => {
        member.tags.forEach((tag) => {
          if (count[`id_${tag.id}`] !== undefined) count[`id_${tag.id}`]++
        })
      })
      return count
    },
    showManageBtn() {
      if (this.isAddedOrDeleted) return false
      return (
        // this.selectedTag.length > 0 &&
        this.isEqualArray(this.selectedTag, this.selectedTagClone)
      )
    },
    isAddedOrDeleted() {
      return (this.addListTracker && this.addList.size > 0) || (this.deleteListTracker && this.deleteList.size > 0)
    },
  },
  watch: {
    selectedMember: function(newValue, oldValue) {
      this.checkSelectedTag()
    },
    dialogVisible: function(newValue) {
      if (newValue === false) {
        this.tryToFetchList()
        this.$emit('update')
      }
    },
  },
  created() {
    this.tryToFetchList()
    this.onSearch = debounce(async (searchValue) => {
      // if (!searchValue) return
      this.tryToFetchList(searchValue)
    }, 500)
  },
  methods: {
    async tryToFetchList(search) {
      this.tryingFetch = true
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search: search || this.keyword,
      })
      this.tryingFetch = false
      this.checkSelectedTag()
    },
    async tryToApply() {
      if (!this.isAddedOrDeleted) {
        this.$message({
          message: '請先選擇標籤',
          type: 'warning',
        })
        return
      }
      if (this.tryingApply) return
      this.tryingApply = true
      const memberIds = this.selectedMember.map((member) => member.id)
      const request = {
        addIds: [...this.addList],
        deleteIds: [...this.deleteList],
        memberIds,
      }
      await this.$store.dispatch('member/applyTags', request)
      this.tryingApply = false
      this.$emit('update')
    },
    showIndeterminate(id) {
      if (this.addList.has(id) || this.deleteList.has(id)) return false

      return (
        this.tagRecord[`id_${id}`] > 0 &&
        this.tagRecord[`id_${id}`] < this.selectedMember.length
      )
    },
    isIndeterminate(id) {
      return (
        this.tagRecord[`id_${id}`] > 0 &&
        this.tagRecord[`id_${id}`] < this.selectedMember.length
      )
    },
    checkSelectedTag() {
      this.selectedTag = []
      this.tagList.forEach((tag) => {
        if (
          this.selectedMember.length > 0 &&
          this.tagRecord[`id_${tag.id}`] === this.selectedMember.length
        )
          this.selectedTag.push(tag.id)
      })

      this.selectedTagClone = [...this.selectedTag]
      this.selectedTagPrevious = [...this.selectedTag]

      this.addList.clear()
      this.deleteList.clear()
      this.$nextTick(()=>{
        this.$forceUpdate()
      })
    },
    onChanged() {
      this.isAdd()
      this.isDelete()
      this.selectedTagPrevious = [...this.selectedTag]
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    isEqualArray(array1, array2) {
      return (
        array1.length === array2.length &&
        array1.every((value, index) => value === array2[index])
      )
    },
    isAdd() {
      const [addIds] = this.selectedTag.filter(
        (x) => !this.selectedTagPrevious.includes(x)
      )
      if (addIds) {
        // 初始狀態是已勾選
        if (this.selectedTagClone.includes(addIds)) {
          this.deleteList.delete(addIds)
        } else if (this.deleteList.has(addIds)) {
          // 初始狀態是 indeterminate
          this.selectedTag = [...this.selectedTag.filter((id) => id !== addIds)]
          this.selectedTagPrevious = [...this.selectedTag]
          this.deleteList.delete(addIds)
        } else {
          this.addList.add(addIds)
        }
      }
      this.addListTracker += 1
    },
    isDelete() {
      const [deleteIds] = this.selectedTagPrevious.filter(
        (x) => !this.selectedTag.includes(x)
      )
      if (deleteIds) {
        // 初始狀態是已勾選 或 indeterminate
        if (
          this.isIndeterminate(deleteIds) ||
          this.selectedTagClone.includes(deleteIds)
        )
          this.deleteList.add(deleteIds)
        this.addList.delete(deleteIds)
      }
      this.deleteListTracker += 1
    },
  },
}
</script>

<template>
  <el-popover placement="bottom" title="貼標籤：" width="200" trigger="click">
    <div :class="$style.popover">
      <el-input
        v-model="keyword"
        clearable
        @input="onSearch"
        @clear="tryToFetchList"
        ><BaseIcon slot="prefix" name="search" class="el-input__icon"
      /></el-input>
      <div :class="$style.list">
        <el-checkbox-group v-model="selectedTag" @change="onChanged">
          <el-checkbox
            v-for="(tag, index) in tagList"
            :key="`box-${index}`"
            :label="tag.id"
            :disabled="selectedMember.length === 0"
            :indeterminate="showIndeterminate(tag.id)"
            :class="$style.checkbox"
            >{{ tag.title }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <el-divider></el-divider>
      <div
        v-if="selectedMember.length && !showManageBtn"
        style="margin-bottom: 5px;"
      >
        <div
          ><el-button class="is-round"
            :loading="tryingApply"
            style="width:100%;"
            type="primary"
            plain
            @click="tryToApply"
            >套 用</el-button
          >
        </div>
      </div>
      <el-link
        v-if="showManageBtn"
        :underline="false"
        style="padding: 10px 0;
                width: 100%;
                justify-content: left;"
        @click="dialogVisible = true"
        >新增 / 管理標籤</el-link
      >
      <TagManagment :dialog-visible.sync="dialogVisible"></TagManagment>
    </div>
    <el-button slot="reference" class="is-round" plain>
      <BaseIcon  name="user-tag" />
      <span>標籤管理 </span>
      <BaseIcon name="caret-down" />
    </el-button>
  </el-popover>
</template>

<style lang="scss" module>
.popover {
  :global {
    .el-divider {
      margin: 15px 0;
    }
  }
}
.list {
  padding: 10px 0;
  max-height: 50vh;
  overflow: auto;
  &::-webkit-scrollbar {
    display: block;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #d8d8d8;
  }
}
.checkbox {
  display: block;
  margin: 0;
  margin-bottom: 10px;
  width: 100%;
  overflow: hidden;
  &:last-child {
    margin: 0;
  }
  :global {
    .el-checkbox__label {
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      padding-right: 10px;
      margin-bottom: -4px;
    }
  }
}
</style>
