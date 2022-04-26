<script>
import lazyLoadComponent from '@router/lazyload-component'

import BaseButtonDialog from '@components/BaseButtonDialog'

import pageMixin from '@src/mixins/pagination'

import { productTypeList, productTypeFilter, prepaidCapacityFilter, priceStatusFilter } from '@utils/filter-value-to-text'
import { formatDateRange } from '@utils/format-date'
import { messageStroe, messageDelete } from '@utils/message'
import { messageBoxDelete } from '@utils/message-box'
import { notification } from '@utils/notification'

const initData = () => {
  return {
    level: 0,
    state: 1,
  }
}

export default {
  page: {
    title: '分類設定',
    meta: [{ name: 'description', content: 'Prepaid List' }],
  },
  components: {
    BaseButtonDialog,
    BaseStateLabel: () => lazyLoadComponent(import('@components/BaseStateLabel')),
    ItemDetail: () => lazyLoadComponent(import('./ServiceItemDetail')),
  },
  filters: {
    productTypeFilter,
    priceStatusFilter,
    prepaidCapacityFilter,
    formatDateRange,
  },
  mixins: [pageMixin],
  props: {
    serviceCategory: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      categoryList: [...this.serviceCategory],
      tableData: [
        {
          id: 1,
          title: '狗狗',
          children: [
            {
              id: 11,
              title: '大型犬',
            },
            {
              id: 12,
              title: '中型犬',
            },
            {
              id: 13,
              title: '小型犬',
            },
          ],
        },
        {
          id: 2,
          title: '貓咪',
          children: [
            {
              id: 21,
              title: '短毛',
            },
            {
              id: 22,
              title: '長毛',
            },
          ],
        },
      ],
      selectedCoupons: [],
      selectedDetail: {},
      filterData: {
        state: '',
        productId: '',
        type: '',
        body: '',
      },
      productTypeList: Object.freeze(productTypeList),
      visibleDetail: false,
      previousPage: 1,
      previousTotal: 0,
      tryingFetchDetail: false,
      visibleDialog: false,
      submitData: Object.assign(initData(), this.defaultValue),
      submitDataCreate: Object.assign(initData(), this.defaultValue),
      editData: {},
      isNoSize:false
    }
  },
  computed: {
    submitRules() {
      return {
        title: [
          {
            required: true,
            message: '請填寫分類名',
          },
        ],
        // parentId: [
        //   {
        //     required: true,
        //     message: '請填寫姓名',
        //   },
        // ],
   
      }
    },
  },
  watch: {},
  created() {
    this.tryToFetchList()
  },
  methods: {
    async tryToFetchList() {
      // console.log(123)
      this.categoryList = await this.$store.dispatch('product/fetchServiceCategory')
      this.isNoSize=this.categoryList.some((item)=>{
        // console.log(item)
        return item.children.length===0
        // if(item.children.length===0){
        //   // console.log(123)
        //   this.isNoSize=true
        // }
      })
    },
    async tryToStoreCategory() {},
    async tryToRemove(id) {
      try {
        await messageBoxDelete('分類')
        try {
          await this.$store.dispatch('product/removeServiceCategory', { ids: [id] })
          messageDelete()
          this.tryToFetchList()
        } finally {
  
        }
      } catch {

      }
    },
    // editCategory(title) {
    //   this.editData.title = title
    //   this.visibleDialog = true
    // },
    tryToEdit(data) {
      this.visibleDialog = true
      this.submitData = { ...data }
      this.submitData.state = 1
      this.submitData.params = ''
    },
    async tryToSave(isNew) {
      let submit = isNew ? { ...this.submitDataCreate } : { ...this.submitData }
      // console.log(submit)
      if(isNew){
        await this.$refs.newForm.validate()
      }else{
        await this.$refs.editForm.validate()
      }
      
      await this.$store.dispatch('product/storeServiceCategory', submit)
      await this.tryToFetchList()
      if(isNew){
        messageStroe('add')
      }else{
        messageStroe('edit')
      }
      if(isNew && !this.isNoSize){
        notification('分類資訊','一般服務','prices')
      }
      this.visibleDialog = false
      this.$emit('update-category')
    },
    // async tryToSave(data){
    //   await this.$store.dispatch('product/storeServiceCategory', this.submitData)
    //   this.tryToFetchList()
    // },
    // async tryToSaveEdit(data){
    //   await this.$store.dispatch('product/storeServiceCategory', this.submitData)
    //   this.tryToFetchList()
    // },
    changeParentCreate() {
      this.submitDataCreate.level = this.submitDataCreate.parentId ? 1 : 0
    },
    changeParent() {
      this.submitData.level = this.submitData.parentId ? 1 : 0
    },
  },
}
</script>

<template>
  <div>
    <el-alert v-if="isNoSize" style="margin-bottom:20px"
    title="請新增子分類，若沒有子分類，將無法建立服務方案"
    type="warning">
  </el-alert>
    <el-row :gutter="40">
      <el-col :md="10" :span="24">
        <el-form ref="newForm" :model="submitDataCreate" :rules="submitRules" label-position="top" class="el-form--floating mb-5 mb-md-0">
          <h4 style="margin-bottom: 40px"> 新增自訂分類 </h4>
          <el-form-item label="名稱" prop="title">
            <el-input v-model="submitDataCreate.title" placeholder="請輸入分類名稱"></el-input>
          </el-form-item>
          <el-form-item label="指派上層分類" prop="parentId">
            <el-select v-model="submitDataCreate.parentId" placeholder="指派上層分類" @change="changeParentCreate">
              <el-option value label="無上層分類"></el-option>
              <el-option v-for="(item, index) in categoryList" :key="index" :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-button class="is-round" type="primary" @click="tryToSave(true)">
            <BaseIcon name="plus" />
            <span>新增自訂分類</span>
          </el-button>
        </el-form>
      </el-col>
      <el-col :md="14" :span="24">
        <div class="el-table-wrapper isCategory">
          <el-table :data="categoryList" default-expand-all :class="$style['table']" class="tree-table" row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
            <el-table-column prop="categoryTitle" label="名稱" :min-width="20"> </el-table-column>
            <el-table-column v-slot="{ row }" prop="children.length" label="項目數量" :min-width="10" align="right">{{ row.children.length > 1 ? row.children.length : 1 }} </el-table-column>
            <el-table-column v-slot="{ row }" width="120" align="right">
              <el-tooltip content="編輯" placement="top">
                <el-button class="is-round" type="primary" size="mini" plain @click="tryToEdit(row)">
                  <BaseIcon name="edit" />
                </el-button>
              </el-tooltip>
              <!-- <el-tooltip content="刪除" placement="top">
                <el-button class="is-round" type="danger" plain size="mini" @click.stop="tryToRemove(row.id)">
                  <BaseIcon name="trash-alt" />
                </el-button>
              </el-tooltip> -->
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog :title="'編輯自訂分類'" :visible.sync="visibleDialog" top="0" width="680px" append-to-body>
      <el-form ref="editForm"  :model="submitData" label-position="top" class="el-form--floating">
        <el-form-item label="名稱" prop="title" required>
          <el-input v-model="submitData.title" placeholder="請輸入分類名稱"></el-input>
        </el-form-item>
        <el-form-item v-if="submitData.level !== 0" label="指派上層分類" prop="parentId">
          <el-select v-model="submitData.parentId" placeholder="指派上層分類" @change="changeParent">
            <el-option v-for="(item, index) in categoryList" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="bottom-btn-center">
        <el-button class="is-round" @click="visibleDialog = false">取消</el-button>
        <el-button class="is-round" type="primary" @click="tryToSave(false)">儲存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.table {
  @include layer-elevation(5);
}
</style>
