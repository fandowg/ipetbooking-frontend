<script>
import draggable from 'vuedraggable'
import tourMixin from '@src/mixins/tour'

import ExtraFieldListItem from './ExtraFieldListItem'
import HistoryExtraField from './HistoryExtraField'
import { generateUniqueString } from '@utils'

export default {
  components: {
    ExtraFieldListItem,
    HistoryExtraField,
    draggable,
  },
  mixins: [tourMixin],
  tourName: 'productInventory',
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeTab: 'byOrder',
      activeGroupIndex: '',
      disabledTab: false,
      list: {
        byOrder: [],
        bySize: [],
      },
      currentGroup: 'byOrder',
      dialogVisible: false,
      drag: false,
    }
  },
  computed: {
    disabledAddNewButton() {
      return !this.tourIsActive && !(this.activeGroupIndex === '')
    },
    stepValid() {
      return !this.disabledAddNewButton
    },
  },
  watch: {
    stepValid: {
      handler: 'emitStepValidate',
      immediate: true,
    },
    defaultValue: {
      immediate: true,
      deep: true,
      handler: 'updateListValue',
    },
  },
  methods: {
    updateListValue() {
      Object.keys(this.defaultValue.orderExtrafields).forEach((displayType) => {
        const typeArray = this.defaultValue.orderExtrafields[displayType]
        if (typeArray !== null) this.list[displayType] = typeArray
      })
    },
    emitStepValidate(valid) {
      this.$emit('validate', valid)
    },
    updateActiveGroupIndex(index) {
      this.activeGroupIndex = index
    },
    cancelEditGroup(index) {
      // if the group has only one property (_key)
      if (Object.keys(this.list[this.currentGroup][index]).length === 1) {
        this.removeGroup(index, this.currentGroup)
      }
      this.updateActiveGroupIndex('')
    },
    saveGroup({ index, data }) {
      this.$set(this.list[this.currentGroup], index, data)
      this.updateActiveGroupIndex('')
    },
    removeGroup(index) {
      this.list[this.currentGroup].splice(index, 1)
    },
    addNewGroup() {
      this.list[this.currentGroup].push({
        _key: generateUniqueString(15),
      })
      this.updateActiveGroupIndex(this.list[this.currentGroup].length - 1)
    },
    handleClick(tab, event) {
      this.currentGroup = tab.name
    },
    closeDialog() {
      this.dialogVisible = false
    },
    addGroupFromHistory(list) {
      // clone history question to current question, avoid modified
      const newExtraFields = list.map((item) => {
        return {
          ...item,
          id: '',
          displayType: this.currentGroup,
        }
      })
      this.list[this.currentGroup] = [
        ...this.list[this.currentGroup],
        ...newExtraFields,
      ]
    },
  },
}
</script>

<template>
  <div>
    <!-- <el-tabs
      v-model="activeTab"
      :class="[activeGroupIndex !== '' ? $style['el-tabs__nav'] : '']"
      @tab-click="handleClick"
    >
      <el-tab-pane label="隨訂單顯示" name="byOrder"></el-tab-pane>
      <el-tab-pane label="隨參與人數顯示" name="bySize"></el-tab-pane>
    </el-tabs> -->

    <div :class="$style.stage">
      <el-row v-show="list[currentGroup].length === 0">
        <el-col :span="24" :class="$style.placeholder">
          <BaseIcon name="clipboard-list" />
        </el-col>
        <el-col :span="24" :class="$style.placeholder">
          <span>按下新增題目開始自訂問題</span>
        </el-col>
      </el-row>
      <div v-show="list[currentGroup].length">
        <draggable
          v-model="list[currentGroup]"
          animation="200"
          handle=".handle-subject"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group
            type="transition"
            :name="!drag ? 'flip-list' : null"
          >
            <ExtraFieldListItem
              v-for="(group, index) in list[currentGroup]"
              :key="`ExtraFieldListItem-${index}`"
              :item-index="index"
              :default-value="group"
              :group="currentGroup"
              :is-active="activeGroupIndex === index"
              :is-disabled="
                activeGroupIndex !== '' && activeGroupIndex !== index
              "
              @save="saveGroup"
              @remove="removeGroup"
              @edit="updateActiveGroupIndex"
              @cancel="cancelEditGroup"
            />
          </transition-group>
        </draggable>
      </div>
      <el-row
        v-show="!disabledAddNewButton"
        :gutter="20"
        :class="$style['margin-top']"
      >
        <el-col :span="12">
          <el-button
            v-show="!disabledAddNewButton"
            :disabled="disabledAddNewButton"
            class="is-fullwidth"
            type="primary"
            plain
            @click="addNewGroup"
          >
            <BaseIcon name="plus" />
            <span>新增題目</span>
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button class="is-fullwidth" @click="dialogVisible = true">
            <span>選擇已新增的題目</span>
          </el-button>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      title="選擇已新增的題目"
      width="400px"
      :visible.sync="dialogVisible"
      append-to-body
      modal-append-to-body
      :destroy-on-close="true"
      top="0"
    >
      <HistoryExtraField @close="closeDialog" @add="addGroupFromHistory" />
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.el-tabs__nav {
  opacity: 0.5;
  &::before {
    content: '';
    height: 50px;
    width: 244px;
    position: absolute;
    z-index: 3;
    cursor: not-allowed;
  }
}
.placeholder {
  text-align: center;
  color: #bebebe;
  opacity: 0.5;
  margin-top: 15px;
  & svg {
    font-size: 100px;
  }
  & span {
    font-size: 18px;
  }
  &:last-child {
    margin-bottom: 30px;
  }
}

.stage {
  padding: 0 10px;
}

.margin-top {
  margin-top: 20px;
}
</style>
