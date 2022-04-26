<script>
const initData = {
  availableTags: [],
  blockTags: [],
  availableMembers: [],
  blockMembers: [],
}

export default {
  components: {},
  filters: {},
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const { availableTags, blockTags, availableMembers, blockMembers, ...restDefaultValue } = Object.assign({}, initData, this.defaultValue)
    return {
      tryingStore: false,
      searchIncludeTag: '',
      searchExcludeTag: '',
      searchIncludeMember: '',
      searchExcludeMember: '',
      submitData: {
        ...restDefaultValue,
        includeTag: [...availableTags.map((tag) => tag.id)],
        excludeTag: [...blockTags.map((tag) => tag.id)],
        includeMember: [...availableMembers],
        excludeMember: [...blockMembers],
      },
      tryingtryToFetchMember: false,
      tagList: [],
      includeMemberList: [],
      excludeMemberList: [],
      checkAll: false,
    }
  },
  computed: {
    isEditMode() {
      return this.defaultValue.id !== undefined
    },
    filterIncludeMembers() {
      return this.includeMemberList.filter((member) => {
        return !this.submitData.excludeMember.includes(member.id)
      })
    },
    filterExcludeMembers() {
      return this.excludeMemberList.filter((member) => {
        return !this.submitData.includeMember.includes(member.id)
      })
    },
    filterIncludeTags() {
      if (this.searchIncludeTag === '') return this.tagList
      return this.tagList.filter((tag) => {
        return tag.title.includes(this.searchIncludeTag)
      })
    },
    filterExcludeTags() {
      if (this.searchExcludeTag === '') return this.tagList
      return this.tagList.filter((tag) => {
        return tag.title.includes(this.searchExcludeTag)
      })
    },
    isIndeterminate() {
      this.checkAll = this.submitData.includeTag.length === this.tagList.length
      if (this.submitData.includeTag.length === 0) return false
      return this.submitData.includeTag.length > 0 && this.submitData.includeTag.length < this.tagList.length
    },
    filterSubmitData() {
      const {includeTag,excludeTag,includeMember,excludeMember, ...restSubmitData} = this.submitData
      const includeTags = includeTag.map((id) => ({ id, block: 0 }))
      const excludeTags = excludeTag.map((id) => ({ id, block: 1 }))
      const includeMembers = includeMember.map((member) => ({ id: member.id, block: 0 }))
      const excludeMembers = excludeMember.map((member) => ({ id: member.id, block: 1 }))
      if(this.isEditMode) {
        return {
          tags: [...includeTags, ...excludeTags],
          members: [...includeMembers, ...excludeMembers],
        }
      } else {
        return {
          // ...restSubmitData,
          tags: [...includeTags, ...excludeTags],
          members: [...includeMembers, ...excludeMembers],
        }
      }
    },
  },
  created() {
    this.tryToFetchTags()
  },
  methods: {
    async tryToFetchTags() {
      this.tagList = await this.$store.dispatch('member/fetchTags')
    },
    async tryToFetchMember(keyword = '') {
      this.tryingtryToFetchMember = true
      const list = await this.$store.dispatch('member/fetchListByKeyword', keyword)
      this.tryingtryToFetchMember = false
      return list
    },
    remoteMethodLeft(query) {
      this.searchMember(query)
    },
    remoteMethodRight(query) {
      this.searchMember(query, 'exclude')
    },
    async searchMember(query, type = 'include') {
      if (query !== '') {
        this[`${type}MemberList`] = await this.tryToFetchMember(query)
      } else {
        this[`${type}MemberList`] = []
      }
    },
    handleCheckAllChange(checked) {
      this.submitData.includeTag = checked ? this.tagList.filter((tag) => !this.submitData.excludeTag.includes(tag.id)).map((price) => price.id) : []
    },
    async tryToSearchMember(queryString, cb, type = 'include') {
      if (!queryString) {
        cb([])
        return
      }
      const list = await this.tryToFetchMember(queryString)
      const memberIds = this.submitData[`${type}Member`].map((member) => member.id)
      const oppositeIds = this.submitData[`${type === 'include' ? 'exclude' : 'include'}Member`].map((member) => member.id)
      cb(list.filter((item) => !memberIds.includes(item.id) && !oppositeIds.includes(item.id)))
    },
    tryToSearchIncludeMember(queryString, cb) {
      this.tryToSearchMember(queryString, cb)
    },
    tryToSearchExcludeMember(queryString, cb) {
      this.tryToSearchMember(queryString, cb, 'exclude')
    },
    handleSelectMember(member, type = 'include') {
      const isExist = this.submitData[`${type}Member`].some((item) => item.id === member.id)
      if (!isExist) this.submitData[`${type}Member`].push(member)
    },
    handleSelectIncludeMember(member) {
      this.handleSelectMember(member)
    },
    handleSelectExcludeMember(member) {
      this.handleSelectMember(member, 'exclude')
    },
    handleRemoveMember(index, type = 'include') {
      this.submitData[`${type}Member`].splice(index, 1)
    },
  },
}
</script>

<template>
  <div :class="$style['target-wrap']">
    <!-- <h4 class="form-block-title">是否限定使用對象</h4>
    <el-switch v-model="submitData.state" active-text="限定使用" inactive-text="完全公開" :active-value="1" :inactive-value="0"></el-switch> -->

    <template>
      <h4 class="form-block-title">適用對象</h4>
      <el-row type="flex">
        <el-col :span="24" :md="11">
          <h5 style="margin-top: 0;"><BaseIcon icon-style="fal" name="user-check"></BaseIcon> 加入適用對象</h5>
          <p style="li">請加入適用的標籤群組。</p>
          <p>若無設定則所有客戶皆為此優惠代碼發送的目標。</p>
          <!-- <p><br /><br v-if="isEditMode"/></p> -->
          <el-input v-model="searchIncludeTag" class="search" placeholder="搜尋標籤群組" clearable><BaseIcon slot="prefix" name="search" class="el-input__icon"/></el-input>
          <el-checkbox v-model="checkAll" class="check-all" :indeterminate="isIndeterminate" :disabled="this.submitData.excludeTag.length === tagList.length" border @change="handleCheckAllChange"
          >全選標籤</el-checkbox
          >
          <el-checkbox-group v-model="submitData.includeTag" class="tag">
            <el-checkbox v-for="(tag, index) in filterIncludeTags" :key="`tag-${index}`" :label="tag.id" :disabled="submitData.excludeTag.includes(tag.id)">{{ tag.title }}</el-checkbox>
          </el-checkbox-group>

          <h5>指定客戶</h5>
          <el-autocomplete v-model="searchIncludeMember" class="search" :fetch-suggestions="tryToSearchIncludeMember" placeholder="搜尋客戶" @select="handleSelectIncludeMember">
            <BaseIcon slot="prefix" name="search" class="el-input__icon" />
            <template v-slot="{ item }">{{ `${item.fullName}・${item.phoneNumber}` }}</template>
          </el-autocomplete>
          <div class="selected-member">
            <div class="header">客戶姓名 / 電話</div>
            <div class="content">
              <div v-for="(member, index) in submitData.includeMember" :key="`includeMember-${index}`" class="item">
                <div>{{ member.fullName }} {{ member.phoneNumber || member.phone }}</div>
                <el-button type="text" @click="handleRemoveMember(index)"><BaseIcon name="times"></BaseIcon></el-button>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="2" :class="$style['vertical-divider']"> </el-col>

        <el-col :span="24" :md="11">
          <h5 style="margin-top: 0;"><BaseIcon icon-style="fal" name="user-times"></BaseIcon> 排除特定的對象</h5>
          <p>請選取要特別排除的標籤群組與人，如：黑名單。</p>
          <p style="color: #E35D5D;">若選取對象和適用對象重複，會以排除對象為主。</p>
          <el-input v-model="searchExcludeTag" class="search" placeholder="搜尋標籤群組" clearable><BaseIcon slot="prefix" name="search" class="el-input__icon"/></el-input>
          <el-checkbox-group v-model="submitData.excludeTag" class="tag" style="height: 335px;">
            <el-checkbox v-for="(tag, index) in filterExcludeTags" :key="`tag-${index}`" :label="tag.id" :disabled="submitData.includeTag.includes(tag.id)">{{ tag.title }}</el-checkbox>
          </el-checkbox-group>

          <h5>排除客戶</h5>
          <el-autocomplete v-model="searchExcludeMember" class="search" :fetch-suggestions="tryToSearchExcludeMember" placeholder="搜尋客戶" @select="handleSelectExcludeMember">
            <BaseIcon slot="prefix" name="search" class="el-input__icon" />
            <template v-slot="{ item }">{{ `${item.fullName}・${item.phoneNumber}` }}</template>
          </el-autocomplete>
          <div class="selected-member">
            <div class="header">客戶姓名 / 電話</div>
            <div class="content">
              <div v-for="(member, index) in submitData.excludeMember" :key="`excludeMember-${index}`" class="item">
                <div>{{ member.fullName }} {{ member.phoneNumber || member.phone}}</div>
                <el-button type="text" @click="handleRemoveMember(index, 'exclude')"><BaseIcon name="times"></BaseIcon></el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </template>
  </div>
</template>
<style lang="scss" module>
:global() {
  :local(.vertical-divider) {
    position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      top: 0;
      left: 50%;
      width: 2px;
      background: #eeeeea;
      transform: translateX(-50%);
    }
  }
}
.target-wrap {
  margin-bottom: 40px;
  :global {
    h5 {
      svg.svg-inline--fa {
        width: 1.3em;
      }
    }
    .search {
      width: 100%;
      margin-bottom: 10px;
    }
    .check-all {
      display: block;
      padding: 10px 17px;
      background: #e0e0d9;
      border-color: #c6c6ba;
      border-bottom: none;
      &.is-bordered.is-disabled {
        border-color: #c6c6ba;
      }
    }
    .tag {
      height: 295px;
      overflow-y: auto;
      border: 1px solid #c6c6ba;
      margin-bottom: 60px;
      .el-checkbox {
        display: block;
        padding: 15px 17px;
        margin: 0;
        &.is-disabled {
          background: #fafafa;
          cursor: not-allowed;
        }
        & + .el-checkbox {
          border-top: 1px solid #eeeeea;
        }
        &:last-child {
          border-bottom: 1px solid #eeeeea;
        }
      }
    }
    .selected-member {
      border: 1px solid #c6c6ba;
      margin-bottom: 40px;
      .header {
        color: #3f3a2e;
        padding: 10px 17px;
        background: #e0e0d9;
      }
      .content {
        height: 259px;
        overflow-y: auto;
        .item {
          display: flex;
          justify-content: space-between;
          padding: 15px 17px;
          color: #41695b;
          .el-button {
            color: #726f65;
            padding: 0;
            transform: scale(1.5);
          }
          & + .item {
            border-top: 1px solid #eeeeea;
          }
          &:last-child {
            border-bottom: 1px solid #eeeeea;
          }
        }
      }
    }
  }
}
</style>
