<script>
import lazyLoadComponent from '@router/lazyload-component'
import BaseButtonDialog from '@components/BaseButtonDialog'

export default {
  components: {
    BaseButtonDialog,
    TagManagmentListItem: () => lazyLoadComponent(import('./TagManagmentListItem'))
  },
  data() {
    return {
      tagList: [],
      newTagTitle: '',
      tryAdd: false,
      show: this.dialogVisible,
      activeItemIndex: '',
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
  },
  computed: {
    isEmptyList() {
      return this.tagList.length
    }
  },
  watch: {
    dialogVisible: function() {
      this.show = this.dialogVisible
    },
  },
  methods: {
    async tryToFetchList() {
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search: '',
      })
    },
    async tryToAdd() {
      if (this.tryAdd) return
      this.tryAdd = true
      await this.$store.dispatch('member/storeTag', {
        title: this.newTagTitle,
      })
      this.tryAdd = false
      this.tryToFetchList()
    },
    onAdd() {
      if (this.newTagTitle === '') {
        this.$message({
          message: '請輸入標籤名稱',
          type: 'warning',
        })
        return
      }
      this.tryToAdd()
    },
    onSave() {
      this.tryToRemove()
    },
    closeDialog() {
      this.$emit('update:dialogVisible', false)
      this.activeItemIndex = ''
      // this.refs.dialog.handleClose()
    },
    // openDialog() {
    //   this.refs.dialog.handleOpen()
    // },
    updateActiveIndex (index) {
      this.activeItemIndex = index
    }
  },
}
</script>

<template>
  <BaseButtonDialog
    ref="dialog"
    :only-dialog="true"
    :title="'標籤管理'"
    :dialog-visible.sync="show"
    :destroy="true"
    :width="'36%'"
    floating
    @closed="closeDialog"
    @dialog-opened="tryToFetchList"
  >
    <el-form class="el-form-item--normal-margin" @submit.prevent.native>
      <el-form-item>
        <el-alert
          title="注意： 移除標籤不會移除具有該標籤的客戶。"
          type="info"
          show-icon
          :closable="false"
          :class="$style.alert"
        >
        </el-alert>
      </el-form-item>

      <el-form-item>
        <el-input
          v-model.trim="newTagTitle"
          placeholder="建立新標籤"
          clearable
          :class="$style.createInput"
          @keydown.enter.prevent
          ><BaseIcon slot="prefix" name="tag" class="el-input__icon" />
          <el-button
            v-loading="tryAdd"
            :class="$style.create"
            slot="append"
            @click="onAdd"
            >新增</el-button>
        </el-input>
      </el-form-item>

      <div :class="$style.list">
        <transition-group v-if="isEmptyList" name="el-zoom-in-center">
          <template v-for="(tag, index) in tagList">
            <TagManagmentListItem :key="`tag-${tag.id}`" :default-value="tag" :item-index="index" :current-active-index="activeItemIndex" @update="updateActiveIndex" @refresh="tryToFetchList"/>
          </template>
        </transition-group>
        <div v-else style="text-align: center;color: darkgray;line-height: 5em;">
          暫無資料顯示
        </div>
      </div>
    </el-form>
  </BaseButtonDialog>
</template>

<style lang="scss" module>
@import '@design';

.alert {
  background-color: rgba($color-primary, 0.1) !important;
  color: $color-primary !important;
}
.createInput {
  :global {
    .el-input__prefix {
      left: 10px;
    }
  }
}
.create {
  color: $color-primary !important;
}
.list {
  overflow: auto;
  max-height: 30vh;
  margin-bottom: 20px;
  &::-webkit-scrollbar {
    display: block;
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #d8d8d8;
  }
  :global {
    .el-form-item {
      margin-bottom: 15px;
    }
  }
}
.editInput {
  :global {
    .el-input__inner {
      border: transparent;
      background: transparent;
      // &:focus {
      //   border: 1px solid transparent;
      //   background-color: #f2f2f2;
      // }
    }
    .el-input-group__append {
      border: none;
    }
  }
}
</style>
