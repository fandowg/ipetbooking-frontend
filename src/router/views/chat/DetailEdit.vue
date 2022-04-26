<script>
import { genderFilter } from '@utils/filter-value-to-text'
export default {
  filters: { genderFilter },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      submitData: Object.assign({}, this.defaultValue),
      editedNote: null,
      editEnabled: false,
      editTagEnabled: false,
      removeTags: new Set(),
      tagList: [],
      tryingUpdateTag: false,
    }
  },
  created() {
    this.tryToFetchList('')
  },
  computed: {
    addIds() {
      return this.allIds.filter((id) => !this.defaultTagIds.includes(id) && this.submitDataTagIds.includes(id))
    },
    deleteIds() {
      return this.allIds.filter((id) => this.defaultTagIds.includes(id) && !this.submitDataTagIds.includes(id))
    },
    defaultTagIds() {
      return this.defaultValue.tags.map((tag) => tag.id)
    },
    submitDataTagIds() {
      return this.submitData.tags.map((tag) => tag.id)
    },
    allIds() {
      return [...new Set([...this.defaultTagIds, ...this.submitDataTagIds])]
    },
  },
  methods: {
    enableEdit() {
      this.editEnabled = true
      this.editedNote = this.submitData.merchantNote
    },
    cancelEdit() {
      this.editEnabled = false
      this.editedNote = null
    },
    enableEditTag() {
      this.editTagEnabled = true
    },
    cancelTagEdit() {
      this.submitData.tags = [...this.defaultValue.tags]
      this.editTagEnabled = false
    },
    async saveEdit() {
      await this.$store.dispatch('member/store', {
        ...this.submitData,
        merchantNote: this.editedNote,
      })
      this.submitData.merchantNote = this.editedNote
      this.cancelEdit()
    },
    async updateTag() {
      this.tryingUpdateTag = true
      await this.$store.dispatch('member/applyTags', {
        addIds: this.addIds,
        deleteIds: this.deleteIds,
        memberIds: [this.submitData.id],
      })
      await this.tryToFetchMember()
      this.cancelTagEdit()
      this.tryingUpdateTag = false
    },
    async tryToFetchList(search) {
      this.tagList = await this.$store.dispatch('member/fetchTags', {
        search,
      })
    },
    async tryToFetchMember() {
      const memberInfo = await this.$store.dispatch('member/fetchSingle', this.$route.params.memberId)
      this.$emit('update:defaultValue', memberInfo)
    },
  },
}
</script>

<template>
  <div>
    <el-card :class="$style.info">
      <h6 class="form-block-title">基本資料</h6>
      <ul :class="$style.detail" style="font-size: 12px;">
        <!-- <li>姓名：{{ submitData.fullName }} {{ submitData.gender | genderFilter }}</li> -->
        <li>聯絡電話：{{ `${submitData.phoneCode} ${submitData.phoneNumber}` }}</li>
        <li>電子信箱：{{ submitData.email }}</li>
      </ul>

      <h6 class="form-block-title">
        隸屬群組
        <template v-if="editTagEnabled">
          <el-button size="mini" @click="cancelTagEdit">取消</el-button>
          <el-button size="mini" type="primary" @click="updateTag" :loading="tryingUpdateTag">
            <BaseIcon name="check" />
            <span>儲存</span>
          </el-button>
        </template>
        <el-button v-else size="mini" type="primary" plain @click="enableEditTag">
          <BaseIcon name="edit" />
          <span>編輯</span>
        </el-button>
      </h6>
      <div v-if="editTagEnabled">
        <div
          style="color: #AAAAAA;
    margin-bottom: 10px;
    margin-top: -10px;"
          >標籤</div
        >
        <el-select v-model="submitData.tags" value-key="id" multiple placeholder="請選擇">
          <el-option v-for="tag in tagList" :key="tag.id" :label="tag.title" :value="tag"> </el-option>
        </el-select>
      </div>
      <div v-else :class="$style['label-tag']">
        <span>標籤：</span>
        <el-tag v-for="tag in submitData.tags" :key="`tag-${tag.id}`" :type="'info'" effect="plain" disable-transitions>
          {{ tag.title }}
        </el-tag>
      </div>

      <h6 class="form-block-title">
        備註
        <template v-if="editEnabled">
          <el-button size="mini" @click="cancelEdit">取消</el-button>
          <el-button size="mini" type="primary" @click="saveEdit">
            <BaseIcon name="check" />
            <span>儲存</span>
          </el-button>
        </template>
        <el-button v-else size="mini" type="primary" plain @click="enableEdit">
          <BaseIcon name="edit" />
          <span>編輯</span>
        </el-button>
      </h6>

      <el-input v-if="editEnabled" v-model="editedNote" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="請輸入你的備註文字"></el-input>
      <p v-else>{{ submitData.merchantNote || '目前尚無備註' }}</p>
    </el-card>
  </div>
</template>
<style lang="scss" module>
.detail li {
  line-height: 25px;
}
.label-tag {
  :global {
    .el-tag {
      border-color: #808080;
      border-radius: 3px;
      height: 25px;
      line-height: 25px;
      color: #808080;
      margin-bottom: 10px;
    }
    .el-tag + .el-tag {
      margin-left: 10px;
    }
  }
}
.info {
  :global {
    .form-block-title {
      margin-bottom: 10px;
      &:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>
