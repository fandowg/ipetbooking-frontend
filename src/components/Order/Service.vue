<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, taxTypeMap, carrierTypeMap } from '@utils/filter-value-to-text'
import formatDate from '@utils/format-date'

export default {
  components: {
    BaseCollapse: () => lazyLoadComponent(import('@components/BaseCollapse')),
    Addition: () => lazyLoadComponent(import('@components/Order/Addition')),
    HistoryNote: () => lazyLoadComponent(import('@components/HistoryNote')),
    PetCommentList: () => lazyLoadComponent(import('@components/PetCommentList'))
  },
  filters: {
    genderFilter,
    formatDate
  },
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      taxTypeMap,
      carrierTypeMap,
      drawerVisible: false,
      commentList:[],
      dialogVisible:false
    }
  },
  computed: {
    isEmptyByOrderExtrafields() {
      return this.defaultValue.byOrderExtrafields instanceof Array
    },
    isMobile() {
      return /Mobi/.test(navigator.userAgent)
    },
    personalityContent(){
      return this.defaultValue.pet.questions.personality.join('，')
    },
    healthyContent(){
      const content = this.defaultValue.pet.questions.healthy.map(item =>{
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content.join('，')
    },
    behaviorContent(){
      const content = this.defaultValue.pet.questions.behavior.map(item =>{
        return `${item.title}${item.text?' ( ':''} ${item.text?item.text:''}${item.text?' )':''}`
      })
      return content
    },
    vaccineContent(){
      let vaccine = ''
      switch (this.defaultValue.pet.questions.vaccine) {
        case 1:
          vaccine = '1 劑'
          break;
        case 2:
          vaccine = '2 劑'
          break;
        case 3:
          vaccine = '3 劑'
          break;
        default:
          break;
      }
      return vaccine
    },
    childrenOrdersHaveInvoice() {
      return this.defaultValue.childrenOrders.filter(item=>{
        return item.invoice.InvoiceNumber
      })
      // return this.defaultValue.childrenOrders.length > 0 ? this.defaultValue.childrenOrders : []
    },
  },
  created() {
    // console.log(111)
    this.tryToFetchCommentListAll()
  },
  methods: {
    handleDrawerClosed() {
      this.$refs.drawer.handleClose()
    },
    openEdit(){
      this.$refs.comment.openEdit()
    },
    async tryToFetchCommentListAll() {
      // console.log(345)
      try {
        this.commentList = await this.$store.dispatch('petComment/fetchList', {
          // pet_id: this.pet,
          petId: this.defaultValue.pet.id,
          paginate: 0,
        })
      } catch {
        
      }
    },
    emitFetch(){
      this.tryToFetchCommentListAll()
    },
    openCommentList(){
      this.dialogVisible=true
      this.$nextTick(()=>{
        this.$refs.commentAll.tryToFetchList()
      })
      // console.log(789)
    }
  },
}
</script>

<template>
  <div :class="$style.service">
    <BaseCollapse title="使用人資訊與備註" :order-theme="true">
      <h5 :class="$style.title">使用人資訊</h5>
      <ul :class="$style.info">
        <li>{{ defaultValue.fullName }} {{ defaultValue.gender | genderFilter }}</li>
        <li>{{ `${defaultValue.phoneCode} ${defaultValue.phoneNumber}` }}</li>
        <li>{{ defaultValue.member.email }}</li>
        <li v-if="defaultValue.member.lineId">LINE ID: {{ defaultValue.member.lineId }}</li>
      </ul>
      <h5 :class="$style.title">使用人備註</h5>
      <p>{{ defaultValue.note || '目前尚無備註' }}</p>
    </BaseCollapse>
    <BaseCollapse v-if="defaultValue.pet" title="寵物資訊" expanded :order-theme="true">
  
      <ul :class="$style.box">
        <li>{{defaultValue.pet.name}}</li>
        <li v-if="defaultValue.pet.birthday">{{defaultValue.pet.birthday }}</li>
        <li>{{defaultValue.pet.gender === "male" ? '公' : "母" }}</li>
        <li>{{defaultValue.pet.categoryTitle}}/{{defaultValue.pet.sizeTitle}}</li>
       
        <li v-if="defaultValue.pet.note" class="row-line">{{defaultValue.pet.note}}</li>
        
        <template v-if="defaultValue.pet.questions">
          <li v-if="defaultValue.pet.questions" class="row-line"></li>
          <li v-if="defaultValue.pet.questions.personality.length > 0 " class="row-line">個性：{{personalityContent}}</li>
          <li v-if="defaultValue.pet.questions.healthy.length > 0 " class="row-line">健康狀況：{{healthyContent}}</li>
          <li v-if="defaultValue.pet.questions.behavior.length > 0 " class="row-line indentList">
            <span class="title">行為：</span>
            <template v-if="behaviorContent.length > 0">
              <span class="content">
                <span v-for="n in behaviorContent" :key="n" class="content__item">{{n}}</span>
              </span>
            </template>
          </li>
          <li v-if="defaultValue.pet.questions.vaccine" class="row-line">疫苗：{{vaccineContent}}</li>
          <!-- 疫苗：{{ defaultValue.pet.questions.vaccine ? vaccineContent : '未填寫' }} -->
        </template>
      </ul>
       <div class="btn-group-inline" style="margin-bottom: 20px">
      <el-button v-if="commentList.length !== 0" plain class="is-round" @click="openCommentList">查看歷史備註</el-button>
      <el-button class="is-round" type="primary" @click="openEdit"><BaseIcon name="plus" /> 新增寵物備註</el-button>
    </div>
      <PetCommentList ref="comment" type="order"  :order="defaultValue" @emitFetch="emitFetch" />
      <el-dialog :visible.sync="dialogVisible" :pet="defaultValue.pet.id" title="寵物備註" width="800px" top="0" append-to-body>
        <PetCommentList ref="commentAll" :pet="defaultValue.pet.id" type="pet" :order="defaultValue" />
      </el-dialog>
 
    </BaseCollapse>
    <BaseCollapse v-if="!isEmptyByOrderExtrafields" title="服務資訊" :order-theme="true">
      <ul v-for="(byOrderExtrafield, byOrderExtrafieldIndex) in defaultValue.byOrderExtrafields" :key="`byOrderExtrafieldIndex-${byOrderExtrafieldIndex}`" :class="$style.question">
        <li class="title">{{ byOrderExtrafield.title }}</li>
        <li>{{ byOrderExtrafield.value }}</li>
      </ul>
    </BaseCollapse>
    <!-- <BaseCollapse title="加購項目" :order-theme="true">
      <Addition :default-value="defaultValue" @update="$emit('update')"></Addition>
    </BaseCollapse> -->
    <template v-if="defaultValue.status === 6 && defaultValue.invoice.InvoiceNumber">
      <BaseCollapse title="發票資訊" :order-theme="true">
        <div :class="$style.invoice">
          <div class="order-id Jost">{{ `預約訂單#${defaultValue.id}` }}</div>
          <div class="info">
            <el-row :gutter="20">
              <el-col :span="12" :xs="24">
                <div class="info-item">
                  <span class="title">發票日期</span>
                  <span>{{ defaultValue.invoice.CreateTime | formatDate }}</span>
                </div>
                <div class="info-item">
                  <span class="title">發票號碼</span>
                  <span>{{ defaultValue.invoice.InvoiceNumber }}</span>
                </div>
                <div class="info-item">
                  <span class="title">隨機碼</span>
                  <span>{{ defaultValue.invoice.RandomNum }}</span>
                </div>
              </el-col>
              <el-col :span="12" :xs="24">
                <div class="info-item">
                  <span class="title">發票形式</span>
                  <span>{{ taxTypeMap[defaultValue.invoice.taxType] }}</span>
                </div>
                <div v-if="defaultValue.invoice.taxType === 'B2C'" class="info-item">
                  <span class="title">載具類別</span>
                  <span>{{ carrierTypeMap[defaultValue.invoice.CarrierType] }}</span>
                </div>
                <div v-if="defaultValue.invoice.taxType === 'B2C' && ['0', '1'].includes(defaultValue.invoice.CarrierType)" :span="12" :xs="24" class="info-item">
                  <span class="title">載具編號</span>
                  <span>{{ defaultValue.invoice.CarrierNum }}</span>
                </div>
                <div v-if="defaultValue.invoice.taxType === 'B2B'" class="info-item">
                  <span class="title">統一編號</span>
                  <span>{{ defaultValue.invoice.taxId }}</span>
                </div>
                <div v-if="defaultValue.invoice.taxType === 'DONATE'" class="info-item">
                  <span class="title">捐贈碼</span>
                  <span>{{ defaultValue.invoice.LoveCode }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <template v-if="childrenOrdersHaveInvoice.length > 0">
                    
          <div v-for="addOrder in childrenOrdersHaveInvoice"  :key="addOrder.invoice.InvoiceNumber" :class="$style.invoice">
            <div class="order-id Jost">{{ `加購訂單#${addOrder.id}` }}</div>
            <!-- <div style="margin-bottom:10px"> 加購訂單 {{addOrder.id}}</div> -->
            <div class="info">
              <el-row :gutter="20">
                <el-col :span="12" :xs="24">
                  <div class="info-item">
                    <span class="title">發票日期</span>
                    <span>{{ addOrder.invoice.CreateTime | formatDate }}</span>
                  </div>
                  <div class="info-item">
                    <span class="title">發票號碼</span>
                    <span>{{ addOrder.invoice.InvoiceNumber }}</span>
                  </div>
                  <div class="info-item">
                    <span class="title">隨機碼</span>
                    <span>{{ addOrder.invoice.RandomNum }}</span>
                  </div>
                </el-col>
                <el-col :span="12" :xs="24">
                  <div class="info-item">
                    <span class="title">發票形式</span>
                    <span>{{ taxTypeMap[addOrder.invoice.taxType] }}</span>
                  </div>
                  <div v-if="addOrder.invoice.taxType === 'B2C'" class="info-item">
                    <span class="title">載具類別</span>
                    <span>{{ carrierTypeMap[addOrder.invoice.CarrierType] }}</span>
                  </div>
                  <div v-if="addOrder.invoice.taxType === 'B2C' && ['0', '1'].includes(addOrder.invoice.CarrierType)" :span="12" :xs="24" class="info-item">
                    <span class="title">載具編號</span>
                    <span>{{ addOrder.invoice.CarrierNum }}</span>
                  </div>
                  <div v-if="addOrder.invoice.taxType === 'B2B'" class="info-item">
                    <span class="title">統一編號</span>
                    <span>{{ addOrder.invoice.taxId }}</span>
                  </div>
                  <div v-if="addOrder.invoice.taxType === 'DONATE'" class="info-item">
                    <span class="title">捐贈碼</span>
                    <span>{{ addOrder.invoice.LoveCode }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </template>
      </BaseCollapse>
    </template>
    <BaseCollapse v-if="defaultValue.status === 6" title="簽名" :order-theme="true">
      <el-image :src="defaultValue.signature" :class="$style.image">
        <div slot="error"> 圖片載入失敗 </div>
      </el-image>
    </BaseCollapse>

    <el-button class="icon-text" @click="drawerVisible = true"><BaseIcon name="pencil" :icon-style="'fal'"></BaseIcon>內部備註</el-button>
    <el-drawer ref="drawer" class="no-header mobile" :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <el-page-header content="內部備註" @back="handleDrawerClosed"></el-page-header>
      <el-divider></el-divider>
      <HistoryNote :default-value="defaultValue" @update="$emit('update')" />
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.service {
  :global {
  }
}
.title:not(:first-child) {
  margin-top: 30px;
}
.info {
  padding-inline-start: 0;
  > li {
    padding: 5px 0;
  }
}
.box{
  display: flex;
  flex-wrap: wrap;
  padding: 20px 20px 10px;
  background: #fff;
  margin-bottom: 20px;
   :global {
     li{
      //  width: 50%;
       margin-bottom: 15px;
       margin-right: 30px;
     }
     .row-line{
       width:100%;
     }
  }
}
.question {
  padding-left: 24.2px;
  padding-bottom: 10px;
  margin-bottom: 15px;
  :global {
    .title {
      margin-bottom: 10px;
      color: darkgray;
    }
  }
}
.image {
  height: 300px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(211 211 211 / 0.2);
  margin-bottom: 10px;
}
.invoice {
  :global {
    .order-id {
      font-size: 16px;
      letter-spacing: 1.6px;
      line-height: 18px;
      margin-bottom: 20px;
      font-weight: 500;
    }
    .info {
      padding: 22.5px 20px;
      background: white;
      @include touch {
        border: 1px solid #c6c6ba;
      }
      .el-col {
        padding-top: 7.5px;
        padding-bottom: 7.5px;
      }
      .info-item {
        .title {
          width: 60px;
          display: inline-block;
          color: #919191;
          margin-right: 20px;
        }
        & + .info-item {
          margin-top: 15px;
        }
      }
    }
  }
  & + .invoice {
    margin-top: 40px;
  }
}
</style>
