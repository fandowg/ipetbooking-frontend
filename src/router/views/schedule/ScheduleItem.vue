<script>
import { daysInWeek } from '@utils/filter-value-to-text'
import formatDate, { formatRequestData } from '@utils/format-date'

import BaseButtonDialog from '@components/BaseButtonDialog'
import { messageStroe, messageDelete } from '@utils/message'
import { notification } from '@utils/notification'

const minutesOfTime = (time = '00:00') => {
  const timeMatches = time.match(/^(\d+):(\d+)$/i)
  const [, hours, minutes] = timeMatches
  return Number(hours) * 60 + Number(minutes)
}

function initData() {
  return {
    startTime: '',
    endTime: '',
    repeat: '',
    repeatWith: [],
    repeatEndDate: '',
    productIds: [],
    serviceIds: [],
    serviceCategoryIds: [],
    state: 1,
  }
}
export default {
  components: {
    BaseButtonDialog,
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => initData(),
    },
    staffName: {
      type: String,
      required: true,
    },
    day: {
      type: String,
      required: true,
    },
    locations: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      daysInWeek,
      endDatePickerOptions: {
        disabledDate: (time) => {
          // check String or Date Object
          const limitWith365Days = new Date(this.day).getTime() + 3600 * 1000 * 24 * 365
          return time.getTime() < new Date(this.day).getTime() || time.getTime() >= limitWith365Days
        },
      },
      services: {},
      submitData: {},
      dialogVisible: false,
      modifyMode: 'self',
      removeMode: false,
      tryingToStoreItem: false,
      tryingToRemoveItem: false,
      priceList: [],
      checkAll: false,
      categoryList: [],
    }
  },
  computed: {
    isEditMode() {
      return this.defaultValue.id !== undefined
    },
    isModifyMode() {
      return this.isEditMode && !!this.defaultValue.repeat
    },
    title() {
      return `${formatDate(new Date(this.day), 'dateWeekDay')}`
    },
    availableService() {
      let list = []
      this.priceList.forEach((price) => {
        this.submitData.productIds.forEach((product) => {
          if (price.productId === product.id) {
            this.submitData.serviceCategoryIds.forEach((category) => {
              if (price.petSizeId === category) {
                list.push({
                  ...price,
                  location: product.name,
                })
              }
            })
          }
        })
      })
      // list = list.filter(item=>{
      //   return item.state === 1
      // })
      return list
    },
    isIndeterminate() {
      this.checkAll = this.submitData.serviceIds.length === this.availableService.length
      if (this.submitData.serviceIds.length === 0) return false
      return this.submitData.serviceIds.length > 0 && this.submitData.serviceIds.length < this.availableService.length
    },
    isIndeterminateCategory() {
      this.checkAllCategory = this.submitData.serviceCategoryIds.length === this.categoryList.length
      if (this.submitData.serviceCategoryIds.length === 0) return false
      return this.submitData.serviceCategoryIds.length > 0 && this.submitData.serviceCategoryIds.length < this.categoryList.length
    },
    submitRules() {
      const repeatIsEmpty = this.submitData.repeat === ''
      const repeatIsWeekMode = this.submitData.repeat === 'week'
      return {
        title: [
          {
            required: true,
            message: '請填寫方案名稱',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: '請填寫方案內容',
            trigger: 'blur',
          },
        ],
        startTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇時段開始時間'))
              if (this.submitData.endTime) this.$refs.form.validateField('endTime')

              callback()
            },
            trigger: 'change',
          },
        ],
        endTime: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) return callback(new Error('請選擇時段結束時間'))
              if (minutesOfTime(this.submitData.startTime) >= minutesOfTime(value)) return callback(new Error('結束時間不可早於開始時間'))
              callback()
            },
            trigger: 'change',
          },
        ],
        repeatWith: [
          {
            type: 'array',
            required: repeatIsWeekMode,
            message: '請選擇重複的星期',
            trigger: 'change',
          },
        ],
        repeatEndDate: [
          {
            required: !repeatIsEmpty,
            message: '請選擇重複結束日期',
            trigger: 'change',
          },
        ],
        maxCollision: [
          {
            required: true,
            message: '請輸入人數',
          },
          { type: 'number', message: '人數必須為數字' },
        ],
        productIds: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value.length) {
                this.$nextTick(() => {
                  this.$refs.form.clearValidate('serviceIds')
                })
                return callback(new Error('請選擇服務地點'))
              }
              callback()
            },
            trigger: 'change',
          },
        ],
        serviceIds: [
          {
            required: true,
            message: '請選擇服務項目',
            trigger: 'change',
          },
        ],
      }
    },
  },
  watch: {
    defaultValue: {
      handler: function (value) {
        if (!this.isEditMode) {
          // const { storeIds, serviceCategoryIds, productPriceIds, maxCollision }=this.tryToFetchStaffDetail()
          this.submitData = Object.assign({}, initData(), this.defaultValue)
          let stores=[]
          this.locations.forEach(local => {
              this.submitData.productIds.forEach(item=>{
                if(item===local.id){
                   stores.push(local)
                }
              })
            })
          this.submitData.productIds = stores
          // this.submitData.customs=1// 06/28測試
        } else {
          const { startDate, endDate, productIds } = this.defaultValue

          this.submitData = {
            ...this.defaultValue,
            repeat: this.defaultValue.repeat || '',
            repeatWith: this.defaultValue.repeatWith || [],
            startTime: new Date(startDate.replace(/-/g, '/')).format('HH:mm'),
            endTime: new Date(endDate.replace(/-/g, '/')).format('HH:mm'),
            productIds: this.locations.filter((location) => productIds.includes(location.id)),
          }
          //  this.submitData.customs=1// 06/28測試
          if(this.submitData.repeatWith.length>0){
            this.submitData.repeatWith = this.submitData.repeatWith.map((item) => String(item))
          }
          delete this.submitData.startDate
          delete this.submitData.endDate
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getCategoryList()
    this.tryToFetchPrices()
    // console.log(this.defaultValue)
    // if(this.isEditMode){
    //   this.tryToFetchStaffDetail()
    // }
  },
  methods: {
    async getCategoryList() {
      let categoryAll = await this.$store.dispatch('product/fetchServiceCategory')
      let newArray = []
      categoryAll.forEach((itemParent) => {
        itemParent.children.forEach((item) => {
          newArray.push(item)
        })
      })
      this.categoryList = newArray
    },
    async tryToFetchPrices() {
      const { items } = await this.$store.dispatch('product/fetchServicePrices', {
        limit: 10000,
        page: 1,
      })
      this.priceList = items
    },
    async tryToStoreItem() {
      try {
        this.tryingToStoreItem = true
        await this.$store.dispatch('schedule/storeItemDetail', {
          modifyMode: this.isModifyMode ? this.modifyMode : undefined,
          ...this.filterSubmitData(),
        })
        this.emitButtonEvent('store')
        if (!this.isEditMode) {
          messageStroe('add')
          notification('排班','包月方案','prepaid')
        } else {
          messageStroe('edit')
        }
        this.dialogVisible = false
      } finally {
        this.tryingToStoreItem = false
      }
    },
    async tryToRemoveItem() {
      try {
        this.tryingToRemoveItem = true
        await this.$store.dispatch('schedule/removeItemDetail', {
          mode: this.modifyMode,
          id: this.defaultValue.id,
        })
        /* await this.$store.dispatch('schedule/deleteScheduleItem', {
          date: this.day,
          itemId: this.defaultValue.itemId,
        }) */
        this.emitButtonEvent('store')
        this.dialogVisible = false
      } finally {
        this.tryingToRemoveItem = false
      }
    },
    filterSubmitData() {
      const productIds = this.submitData.productIds.map((item) => item.id)

      return {
        ...this.submitData,
        startDate: `${this.day} ${this.submitData.startTime}`,
        endDate: `${this.day} ${this.submitData.endTime}`,
        repeatEndDate: formatRequestData(this.submitData.repeatEndDate),
        productIds,
      }
    },
    emitButtonEvent(event) {
      this.$emit(event)
    },
    async onSave() {
      await this.$refs.form.validate()
      if (this.isModifyMode) {
        this.removeMode = false
        this.dialogVisible = true
      } else this.tryToStoreItem()
    },
    async onRemove() {
      this.removeMode = true
      if (this.isModifyMode) this.dialogVisible = true
      else {
        await this.$confirm('確定刪除該時段？', '警告', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        })
        this.tryToRemoveItem()
      }
    },
    onLocationChange(selectedItem) {
      this.checkValidServices()
    },
    checkValidServices() {
      const productIds = this.submitData.productIds.map((product) => product.id)
      const validPrice = this.priceList.filter((price) => productIds.includes(price.productId)).map((price) => price.id)
      this.submitData.serviceIds = [...this.submitData.serviceIds.filter((serviceId) => validPrice.includes(serviceId))]
    },
    handleCheckAllChange(checked) {
      this.submitData.serviceIds = checked ? this.availableService.map((price) => price.id) : []
    },
    handleCheckAllCategory(checked) {
      this.submitData.serviceCategoryIds = checked ? this.categoryList.map((category) => category.id) : []
    },
  },
}
</script>
<template>
  <div>
    <h3 style="margin-top: 0"
      ><span class="Jost" style="margin-right: 20px">{{ title }}</span
      >{{ staffName }}
    </h3>
    <el-divider></el-divider>
    <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" class="el-form--floating" style="margin-top: 30px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="開始時間" prop="startTime">
            <el-time-select
              v-model="submitData.startTime"
              format="HH:mm"
              value-format="HH:mm"
              :editable="false"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59',
              }"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="結束時間" prop="endTime"
            ><el-time-select
              v-model="submitData.endTime"
              format="HH:mm"
              value-format="HH:mm"
              :editable="false"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59',
                minTime: submitData.startTime,
              }"
            >
            </el-time-select
          ></el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否重複" prop="repeat">
            <el-select v-model="submitData.repeat" :popper-append-to-body="false">
              <el-option label="不重複" value=""></el-option>
              <el-option label="每天" value="day"></el-option>
              <el-option label="每週" value="week"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <template v-if="submitData.repeat">
          <el-col v-if="submitData.repeat === 'week'" :span="24" :sm="12">
            <el-form-item label="重複於" prop="repeatWith">
              <el-checkbox-group v-model="submitData.repeatWith" :min="1" :class="$style.repeat">
                <el-checkbox-button v-for="(weekDay, index) in daysInWeek" :key="index" :label="String(index)">{{ weekDay }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重複結束於" prop="repeatEndDate">
              <el-date-picker v-model="submitData.repeatEndDate" :default-value="new Date(day)" :picker-options="endDatePickerOptions" type="date" format="yyyy/MM/dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </template>
        <el-col :span="12">
          <el-form-item label="可同時服務幾位顧客" prop="maxCollision">
            <el-input v-model.number="submitData.maxCollision" placeholder="請輸入數字"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="是否開放預約" prop="state">
            <el-switch v-model="submitData.state" active-text="是" inactive-text="否" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="設定此時段可服務的地點" >
            <el-select v-model="submitData.productIds" value-key="id" multiple placeholder="請選擇" :popper-append-to-body="false" @change="onLocationChange">
              <el-option v-for="site in locations" :key="site.id" :label="site.name" :value="site"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item v-if="categoryList.length > 0" >
            <span slot="label" class="clickOk"
              >此時段可服務的寵物類別與體型
              <el-checkbox v-model="checkAllCategory" class="check-by-head" :indeterminate="isIndeterminateCategory" @change="handleCheckAllCategory">全選</el-checkbox></span
            >
            <el-select v-model="submitData.serviceCategoryIds" value-key="id" multiple placeholder="請選擇" :popper-append-to-body="false">
              <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryTitle" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="可受理的服務項目" style="min-height:250px" :class="$style['services-wrap']" >
            <el-checkbox
              v-if="availableService.length"
              v-model="checkAll"
              :indeterminate="isIndeterminate"
              style="margin-left: 5px; margin-top: 10px; margin-bottom: 5px"
              border
              @change="handleCheckAllChange"
              >全 選</el-checkbox
            >
            <el-alert v-else title="請先選擇地點" type="warning" :closable="false"></el-alert>
            <el-checkbox-group v-model="submitData.serviceIds" :class="$style.services">
              <el-checkbox v-for="service in availableService" :key="`free-${service.id}`" :label="service.id" border>
                <div class="content">
                  <span v-if="service.state === 0" class="side-icon">已下架</span>
                  <span class="title" style="font-size: 15px">{{ service.title }}  </span>
                  <span class="meta">
                    <span style="font-size: 14px; margin-right: 10px">{{ service.location }}</span>
                    <span>{{ service.categoryTitle }}</span>
                  </span>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
   
    </el-form>
      <div :class="$style.footer">
        <el-button v-if="isEditMode" class="is-round" type="danger" plain :loading="tryingToRemoveItem" :disabled="tryingToRemoveItem" @click="onRemove"
          ><BaseIcon name="trash-alt"
        /></el-button>
        <el-button class="is-round" @click="emitButtonEvent('cancel')">取消</el-button>
        <el-button class="is-round" type="primary" :loading="tryingToStoreItem" :disabled="tryingToStoreItem" @click="onSave">
          <BaseIcon name="check" />
          <span>{{ isEditMode ? '儲存' : '建立' }}</span>
        </el-button>
      </div>
    <BaseButtonDialog only-dialog :title="removeMode ? '刪除週期性排程' : '編輯週期性排程'" :dialog-visible.sync="dialogVisible" :width="'270px'" floating>
      <el-radio-group v-model="modifyMode" style="width: 100%; margin-bottom: 30px">
        <el-col :span="24" style="margin-bottom: 10px">
          <el-radio label="self" border style="width: 100%">只{{ removeMode ? '刪除' : '修改' }}此排程</el-radio></el-col
        >
        <el-col :span="24"
          ><el-radio label="henceforth" border style="width: 100%">{{ removeMode ? '刪除' : '修改' }}此排程和後續所有排程</el-radio>
        </el-col>
      </el-radio-group>
      <div :class="$style['footer-btn']">
        <el-button class="is-round" @click="dialogVisible = false">取消</el-button>
        <el-button
          class="is-round"
          :loading="removeMode ? tryingToRemoveItem : tryingToStoreItem"
          :disabled="removeMode ? tryingToRemoveItem : tryingToStoreItem"
          type="primary"
          @click="removeMode ? tryToRemoveItem() : tryToStoreItem()"
          >確定</el-button
        >
      </div>
    </BaseButtonDialog>
  </div>
</template>
<style scoped>
.el-select >>> .el-select-dropdown {
  left: 0 !important;
  width: 100% !important;
  min-width: auto !important;
}
</style>
<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_steps.scss';
.repeat {
  :global {
    .el-checkbox-button {
      .el-checkbox-button__inner {
        border-radius: 8px;
        padding: 14px 15px;
        border-color: $color-primary;
      }
      &.is-checked {
        .el-checkbox-button__inner {
          background: $color-primary;
        }
      }
      & + .el-checkbox-button {
        margin-left: 5px;
        .el-checkbox-button__inner {
          border-left: 1px solid $color-primary;
        }
      }
    }
  }
}
.services-wrap {
  margin: 0 -5px 30px;
}
.services {
  :global {
    label.el-checkbox.is-bordered {
      width: calc(50% - 10px);
      display: inline-flex;
      margin: 5px;
      align-items: center;
      height: auto;
      padding: 15px 20px 15px 15px;

      @include max-sm {
        width: 100%;
      }
      .el-checkbox__inner {
        border-radius: 10px;
        width: 18px;
        height: 18px;
        &:after {
          left: 5px;
          top: 2px;
          height: 8px;
          width: 4px;
          border-width: 2px;
        }
      }
      .el-checkbox__label {
        padding-left: 15px;
        width: 100%;
      }
      & + .el-checkbox.is-bordered {
        margin-left: 5px;
      }

      .title, .meta {
        width: calc(100% - 20px);
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
      }

      .content {
        width: 100%;
      }
    }
  }
}
.footer-btn {
  display: flex;
  :global {
    button {
      flex: 1 0 auto;
    }
  }
}
</style>
