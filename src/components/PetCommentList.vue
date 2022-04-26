<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap } from '@utils/filter-value-to-text'
import { messageStroe, messageDelete } from '@utils/message'
import formatDate from '@utils/format-date'

// import { afterOrder, handle } from '@utils/pet-question'
export default {
  components: {
    ImageUpload: () => lazyLoadComponent(import('@components/ImageUpload')),
    // CountryCodePicker: () => lazyLoadComponent(import('@components/CountryCodePicker')),
  },
  filters: {
    formatDate,
    genderFilter,
  },
  props: {
    pet: {
      type: Number,
      default: null,
    },
    order: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // afterOrder,
      // handle,
      commentList: [],
      submitData: {
        images: [],
        content: '',
        uuid: '',
        questions: {
          afterOrderOption: [null, null, null, null, []],
          afterOrder: [],
          handle: [],
        },
      },

      mode: 'new',
      shareLink: '',
      commentId: '',
      fileList: [],
      drawerVisible: false,
      dialogSendVisible: false,
      dialogImgVisible: false,
      tryingFetchList: false,
      tryingSave: false,
      tryToGetLink: false,
      dialogImageUrl: '',
      listOrderId: '',
    }
  },
  computed: {
    // pet() {
    //   return this.order.pet.id
    // },
    orderId() {
      return this.order.id
    },
    submitRules() {
      // const noImages = this.fileList.length===0
      return {
        content: [
          {
            required: this.fileList.length === 0,
            message: '請填寫備註或上傳圖片',
            // trigger: 'blur',
          },
        ],
      }
    },
    isOwer() {
      return this.$store.state.auth.currentUser.groups.includes(7)
    },
    userId() {
      return this.$store.state.auth.currentUser.id
    },
  },
  watch: {},
  created() {
    this.tryToFetchList()
  },

  methods: {
    afterOrder(questions) {
      let string = []
      questions.afterOrder.forEach((item) => {
        if (item === '正常') {
          string.push('正常')
        }
        if (item === '皮膚病') {
          string.push('皮膚病')
        }
        if (item === '指甲流血') {
          string.push('指甲流血')
        }
        if (item === '剃傷') {
          string.push('剃傷')
        }
        if (item === '跳蚤') {
          let text = ''
          if (questions.afterOrderOption[0]) {
            text = `跳蚤(${questions.afterOrderOption[0]})`
          } else {
            text = '跳蚤'
          }

          string.push(text)
        }
        if (item === '璧蝨') {
          let text = ''
          if (questions.afterOrderOption[1]) {
            text = `璧蝨(${questions.afterOrderOption[1]})`
          } else {
            text = '璧蝨'
          }
          string.push(text)
        }
        if (item === '耳炎') {
          let text = ''
          if (questions.afterOrderOption[2]) {
            text = `耳炎(${questions.afterOrderOption[2]})`
          } else {
            text = '耳炎'
          }
          string.push(text)
        }
        if (item === '耳疥') {
          let text = ''
          if (questions.afterOrderOption[3]) {
            text = `耳疥(${questions.afterOrderOption[3]})`
          } else {
            text = '耳疥'
          }
          string.push(text)
        }
        if (item === '眼睛') {
          let text = ''
          if (questions.afterOrderOption[4].length>0) {
            text = `眼睛(${questions.afterOrderOption[4].join(',')})`
          } else {
            text = '眼睛'
          }
          string.push(text)
        }
      })
      return string.join('，')
    },
    async tryToFetchList(mode) {
      // console.log('取得資料')
      let query = {
        paginate: 0,
      }
      if (this.type === 'order') {
        query['orderId'] = this.orderId
      } else if (this.type === 'pet') {
        // console.log(this.pet)
        query['petId'] = this.pet
      }
      try {
        this.tryingFetchList = true
        this.commentList = await this.$store.dispatch('petComment/fetchList', query)
      } catch {
      } finally {
        this.tryingFetchList = false
      }
    },

    handleDrawerClosed() {
      this.$refs.drawer.handleClose()
    },
    async handleSave() {
      await this.$refs.form.validate()
      let orderNo = ''
      if (this.order) {
        orderNo = this.orderId
      } else {
        orderNo = this.listOrderId
      }
      try {
        let storeData = {}
        let oldImages = []
        this.fileList.forEach((item) => {
          if (item.url.indexOf('blob') === -1) {
            oldImages.push(item.url)
          }
        })
        // console.log(oldImages)
        // const oldImages = this.fileList.map(item=>item.url)
        if (this.$refs.upload.cacheList.length === 0) {
          if (this.submitData.uuid) {
            storeData = {
              orderNo,
              uuid: this.submitData.uuid,
              images: oldImages,
              questions: this.submitData.questions,
              content: this.submitData.content,
            }
          } else {
            storeData = {
              orderNo,
              images: oldImages,
              questions: this.submitData.questions,
              content: this.submitData.content,
            }
          }
        } else {
          const newImages = await this.$refs.upload.handleUpload()
          // console.log(newImages, this.submitData.images)
          // console.log(newImages)
          const filterImages = new Set([...oldImages, ...newImages])
          // console.log(filterImages)
          const images = [...filterImages]
          if (this.submitData.uuid) {
            storeData = {
              orderNo,
              images,
              questions: this.submitData.questions,
              uuid: this.submitData.uuid,
              content: this.submitData.content,
            }
          } else {
            storeData = {
              orderNo,
              images,
              questions: this.submitData.questions,
              content: this.submitData.content,
            }
          }
        }
        // console.log('執行')
        this.tryingSave = true
        await this.$store.dispatch('petComment/store', storeData)

        if (this.submitData.uuid) {
          messageStroe('edit')
        } else {
          messageStroe('add')
        }
        this.drawerVisible = false
        this.tryToFetchList()
        this.$emit('emitFetch')
      } catch (error) {
        // console.log(error)
      } finally {
        this.tryingSave = false
      }

      //  console.log(images)
    },
    openEdit(type, comment) {
      // console.log(444)
      if (type === 'edit') {
        this.mode = 'edit'
        this.drawerVisible = true
        if (!this.order) {
          this.listOrderId = comment.orderNo
        }
        this.$nextTick(() => {
          // this.$forceUpdate()

          this.submitData.images = comment.images
          this.submitData.content = comment.content
          this.submitData.uuid = comment.id
          if (comment.questions) {
            this.submitData.questions = comment.questions
          } else {
            this.submitData.questions = {
              afterOrderOption: [null, null, null, null, []],
              afterOrder: [],
              handle: [],
            }
          }

          this.tryToGetFileList(this.submitData.images)
        })
        // this.$refs.upload.tryToGetFileList()
      } else {
        this.mode = 'new'
        this.drawerVisible = true
        this.$nextTick(() => {
          // this.$refs.upload.clearFiles()
          this.submitData.uuid = ''
          this.submitData.images = []
          this.submitData.content = ''
          this.submitData.questions = {
            afterOrderOption: [null, null, null, null, []],
            afterOrder: [],
            handle: [],
          }
          this.tryToGetFileList([])
        })
      }
    },
    tryToGetFileList(images) {
      if (images.length === 0) {
        this.fileList = []
      } else {
        this.fileList = images.map((item) => {
          return {
            url: item,
          }
        })
        // this.$nextTick(() => {
        //   this.$refs.upload.checkPlusDisabled()
        // })
      }
    },
    updateFileList(catchItem) {
      // console.log(catchItem,this.fileList)
      this.fileList = [...this.fileList, catchItem]
    },
    async tryToSendComment(id) {
      // console.log(id)
      try {
        await this.$confirm('確定要發送簡訊', '提示', {
          confirmButtonText: '確定',
          showCancelButton: true,
          type: 'warning',
          center: true,
        })
        await this.$store.dispatch('petComment/sendComment', { uuid: id })
        this.$message({ message: '發送成功！', type: 'success' })
      } catch {
      } finally {
        this.dialogSendVisible = false
      }
    },
    handlePreview(url) {
      this.dialogImageUrl = url
      this.dialogImgVisible = true
    },
    openSendDialog(id) {
      this.dialogSendVisible = true
      this.commentId = id
      this.tryToGetShareLink(id)
    },
    async tryToGetShareLink(id) {
      this.tryToGetLink = true
      this.shareLink = await this.$store.dispatch('petComment/getLink', { uuid: id })
      this.tryToGetLink = false
    },
    copyShareLink() {
      // console.log(this.shareLink)
      const ghostInput = document.createElement('INPUT')
      document.body.appendChild(ghostInput)
      ghostInput.setAttribute('value', this.shareLink)
      ghostInput.select()
      document.execCommand('copy')
      document.body.removeChild(ghostInput)
      this.$message('連結複製成功')
    },
  },
}
</script>
<template>
  <div>
    <div v-if="commentList.length !== 0" :class="$style.CommentSection">
      <div v-loading="tryingFetchList" :class="$style.comment">
        <div v-for="comment in commentList" :key="comment.id" class="comment__item">
          <div class="comment__head">
            <div>
              <h4 class="comment__title">新增備註 - {{ comment.creator.name }}</h4>
              <div v-if="comment.orderNo" class="comment__tip text-muted">訂單編號：{{ comment.orderNo }}</div>
              <div class="comment__tip text-muted">{{ comment.updatedAt | formatDate('dateTime') }}</div>
            </div>
            <div class="comment__btn-group">
              <el-button v-if="isOwer || userId === comment.creator.id" class="is-round" type="primary" plain size="mini" style="cursor: pointer" @click="openEdit('edit', comment)">
                <BaseIcon name="edit" />
              </el-button>
              <el-button class="is-round" type="success" plain size="mini" style="cursor: pointer" @click="openSendDialog(comment.id)">
                <BaseIcon name="share" />
              </el-button>
            </div>
          </div>
          <div v-if="comment.images.length > 0" class="comment__img">
            <div v-for="img in comment.images" :key="img" class="comment__img__item" style="cursor: pointer" @click="handlePreview(img)">
              <img :src="img" alt="" />
            </div>
          </div>
          <div v-if="comment.questions">
            <div v-if="comment.questions.afterOrder.length > 0" style="margin-bottom:20px;line-height:1.5"
              >美容後問題：
              {{ afterOrder(comment.questions) }}
            </div>
            <div v-if="comment.questions.handle.length > 0" style="margin-bottom:20px;line-height:1.5"
              >善後處理：
              {{ comment.questions.handle.join('，') }}
            </div>
          </div>
          <div class="comment__content" v-text="comment.content"> </div>
        </div>
      </div>
      <el-dialog :visible.sync="dialogSendVisible" width="600px" title="選擇發送方式" top="0" append-to-body>
        <div :class="$style['share__buttons']" style="cursor: pointer">
          <div :class="$style['share__button']" @click="tryToSendComment(commentId)">
            <el-button type="text">
              <BaseIcon :class="$style['share__icon']" name="sms" />
            </el-button>
            <div :class="$style['share__label']">簡訊</div>
          </div>
          <div v-loading="tryToGetLink" :class="$style['share__button']" style="cursor: pointer">
            <el-button type="text" @click="copyShareLink">
              <BaseIcon name="copy" :class="$style['share__icon']" />
            </el-button>
            <div :class="$style['share__label']">複製連結</div>
          </div>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogImgVisible" width="800px" top="0" append-to-body>
        <img width="100%" :src="dialogImageUrl" />
      </el-dialog>
    </div>
    <div v-else>
      <p>還沒有寵物備註</p>
    </div>
    <el-drawer ref="drawer" class="no-header mobile" :visible.sync="drawerVisible" append-to-body :size="$root.isSmallDevice ? '100%' : '50%'" destroy-on-close>
      <el-page-header :content="mode === 'new' ? '新增寵物備註' : '編輯寵物備註'" @back="handleDrawerClosed"></el-page-header>
      <el-divider></el-divider>
      <div :class="$style.CommentSection">
        <el-form ref="form" :model="submitData" :rules="submitRules" label-position="top" :validate-on-rule-change="false">
          <el-form-item label="">
            <ImageUpload ref="upload" v-model="submitData.images" :trying-save.sync="tryingSave" :file-list="fileList" :class="$style.upload" :show-upload="true" @updateFileList="updateFileList"></ImageUpload>
          </el-form-item>
          <el-form-item label="美容後問題">
            <el-checkbox-group v-model="submitData.questions.afterOrder">
              <el-checkbox style="width: 50%" class="sp-ck" label="正常">正常</el-checkbox>
              <el-checkbox style="width: 50%" class="sp-ck" label="皮膚病">皮膚病</el-checkbox>
              <el-checkbox style="width: 50%" class="sp-ck" label="指甲流血">指甲流血</el-checkbox>
              <el-checkbox style="width: 50%" class="sp-ck" label="剃傷">剃傷</el-checkbox>
              <div class="inline-ck">
                <el-checkbox class="sp-ck" label="跳蚤">跳蚤 </el-checkbox>
                <div class="inline-ck-item">
                  <div class="is-show" style="padding-right: 20px">( </div>
                  <el-radio v-model="submitData.questions.afterOrderOption[0]" label="少量">少量</el-radio>
                  <el-radio v-model="submitData.questions.afterOrderOption[0]" label="多量">多量</el-radio>
                  <div class="is-show"> )</div>
                </div>
              </div>
              <div class="inline-ck">
                <el-checkbox class="sp-ck" label="璧蝨">璧蝨 </el-checkbox>
                <div class="inline-ck-item">
                  <div class="is-show" style="padding-right: 20px">( </div>
                  <el-radio v-model="submitData.questions.afterOrderOption[1]" label="少量">少量</el-radio>
                  <el-radio v-model="submitData.questions.afterOrderOption[1]" label="多量">多量</el-radio>
                  <div class="is-show"> )</div>
                </div>
              </div>
              <div class="inline-ck">
                <el-checkbox class="sp-ck" label="耳炎">耳炎</el-checkbox>

                <div class="inline-ck-item">
                  <div class="is-show" style="padding-right: 20px">( </div>
                  <el-radio v-model="submitData.questions.afterOrderOption[2]" label="輕微">輕微</el-radio>
                  <el-radio v-model="submitData.questions.afterOrderOption[2]" label="嚴重">嚴重</el-radio>
                  <div class="is-show"> )</div>
                </div>
              </div>
              <div class="inline-ck">
                <el-checkbox class="sp-ck" label="耳疥">耳疥 </el-checkbox>
                <div class="inline-ck-item">
                  <div class="is-show" style="padding-right: 20px">( </div>
                  <el-radio v-model="submitData.questions.afterOrderOption[3]" label="輕微">輕微</el-radio>
                  <el-radio v-model="submitData.questions.afterOrderOption[3]" label="嚴重">嚴重</el-radio>
                  <div class="is-show"> )</div>
                </div>
              </div>
              <div class="inline-ck">
                <el-checkbox class="sp-ck" label="眼睛">眼睛</el-checkbox>

                <el-checkbox-group v-model="submitData.questions.afterOrderOption[4]" class="inline-ck-item">
                  <div class="is-show" style="padding-right: 20px">( </div>
                  <el-checkbox label="紅眼">紅眼</el-checkbox>
                  <el-checkbox label="分泌物">分泌物</el-checkbox>
                  <el-checkbox label="毛渣凝塊">毛渣凝塊</el-checkbox>
                  <el-checkbox label="闔眼">闔眼</el-checkbox>
                  <div class="is-show" style="padding-left: 25px"> )</div>
                </el-checkbox-group>
              </div>
              <!-- <el-checkbox   :label='item'>{{item.title}}</el-checkbox>
                <el-checkbox-group  :key="index" v-model="afterOrderOption">
                  <el-checkbox   :label='item'>{{item.title}}</el-checkbox>
                </el-checkbox-group> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="善後處理">
            <el-checkbox-group v-model="submitData.questions.handle">
              <el-checkbox style="width: 50%" class="sp-ck" label="已上藥">已上藥</el-checkbox>
              <el-checkbox style="width: 50%" class="sp-ck" label="經醫師看診">經醫師看診</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="備註" prop="content">
            <el-input v-model="submitData.content" type="textarea" :autosize="{ minRows: 2 }" />
          </el-form-item>
        </el-form>
        <div class="btn-group-inline">
          <el-button plain class="is-round" @click="handleDrawerClosed">取消</el-button>
          <el-button :loading="tryingSave" :disabled="tryingSave" class="is-round" type="primary" @click="handleSave">儲存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<style lang="scss" module>
:global {
  .el-checkbox-group {
    .is-show {
      font-size: 12px;
    }
  }
  .sp-ck {
    margin-right: 0;
  }
  .inline-ck {
    display: flex;
    justify-content: flex-start;
    .sp-ck {
      width: auto;
    }
    // justify-content: space-between;
  }
  .inline-ck-item {
    display: flex;
    align-items: center;
    margin-left: 25px;
    width: 100%;
    flex-wrap: wrap;
  }
}
@import '@design';
.CommentSection {
  padding: 20px;
  background-color: #fff;
  @include max-sm {
    padding: 0;
  }
}
.comment {
  :global {
    .comment {
      &__item {
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: $color-border-base 1px dashed;
      }
      &__img {
        margin-bottom: 20px;
        display: flex;
        &__item {
          width: 100%;
        }
        // padding-bottom: 10px;
        img {
          width: 100%;
        }
      }
      &__content {
        white-space: pre;
      }
      &__head {
        display: flex;
        justify-content: space-between;
        // align-items: center;
        margin-bottom: 20px;
      }
      &__title {
        margin: 0;
        margin-bottom: 10px;
        font-size: 14px;
      }
      &__tip {
        margin-bottom: 4px;
      }
      &__btn-group {
        min-width: 80px;
      }
    }
  }
}
.share {
  &__buttons {
    display: flex;
    padding: 30px 0;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  &__button {
    width: 30%;
    // flxex: 1;
  }
  &__icon {
    font-size: 3rem;
  }
  &__label {
    margin-top: 10px;
  }
}
// %img-size {
//   width: calc(33.333333% - 10px);
//   height: 175px;
//   @include max-sm {
//     width: calc(100% - 10px);
//   }
// }
// :global {
//   :local(.upload) {
//     margin: 0 -10px;
//     border-top: none !important;
//     > div {
//       @extend %img-size;
//     }

//     .image-and-action {
//       @extend %img-size;
//       & + div {
//         @extend %img-size;
//       }
//     }
//   }
// }
</style>