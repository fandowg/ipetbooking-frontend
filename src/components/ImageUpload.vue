<script>
import request from '@utils/request'

export default {
  props: {
    tryingSave:{
      type: Boolean,
      default: false,
    },
    value: {
      type: Array,
      default: () => [],
    },
    showUpload: {
      type: Boolean,
      default: false,
    },

    single: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    // const toList = ()=>{
    //   if(!this.value){
    //     return []
    //   }
    //   return this.value.map(item =>{
    //       return {
    //         url:item
    //       }
    //     })
    // }
    return {
      // fileList: Object.assign([], this.value),
      // fileList:toList(),
      tryingToUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      cacheList: [],
    }
  },
  computed: {
    showUploadBtn() {
      return this.single ? this.value.length === 0 : true
    },
  },
  watch: {
    // fileList() {
    //   this.$nextTick(() => {
    //     this.checkPlusDisabled()
    //   })
    // },
  },
  created() {
    // console.log(666)
    // this.tryToGetFileList()
  },
  mounted() {
    // this.$nextTick(()=>{
    //   this.checkPlusDisabled()
    // })
  },
  // updated() {
  //   this.tryToGetFileList()
  // },
  methods: {
    // tryToGetFileList(){
    //    if(!this.value){
    //     this.fileList = []
    //   }else{
    //     this.fileList = this.value.map(item =>{
    //       return {
    //         url:item
    //       }
    //     })
    //   }

    // },
    // emitInput() {
    //   this.$emit('input', [...this.fileList])
    // },
    beforeImageUpload(fileList) {
      // console.log(fileList)
      let pass = true
      fileList.forEach((file) => {
        // console.log(file.size)
        if (pass) {
          const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png'
          const isLt2M = file.size / 1024 / 1024 <= 10
          if (!isJPGOrPNG) {
            this.$message.error('上傳的圖片只能是 JPG 或 PNG 格式')
          }
          if (!isLt2M) {
            this.$message.error('上傳的圖片大小不能超過 10 MB')
          }
          pass = isJPGOrPNG && isLt2M
        }
      })

      return pass
    },
    async handleUpload(params) {
      // if(!this.beforeImageUpload()){
      //   return
      // }
      const pass = this.beforeImageUpload(this.cacheList)
      if (!pass) {
        return Promise.reject(new Error('Error'))
      }
      // console.log(this.$refs.upload.uploadFiles[0].raw,params.file)
      // const images = this.$refs.upload.uploadFiles.map(item => item.raw)
      const formData = new FormData()
      //  formData.append('images[]',this.cacheList[0])
      this.cacheList.forEach((item, index) => {
        formData.append('images[]', item, index)
      })
      this.tryingToUpload = true
      this.$emit('update:tryingSave',true)
      const uploadedValue = await request.post('/admin/comment/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      // this.$refs.upload.clearFiles()
      const images = uploadedValue.items.images
      // images.forEach((url) => {
      //   this.fileList.push({
      //     type: 'image',
      //     path: url,
      //   })
      // })

      this.tryingToUpload = false
      this.$emit('update:tryingSave',false)
      this.cacheList = []
      // this.emitInput()
      return images
    },
    // async handleRemove(path) {
    //   const isExternal = /^(https?:)/.test(path)
    //   if (!isExternal) {
    //     const formData = new FormData()
    //     formData.append('paths[]', path)
    //     formData.append('resource', this.resource)

    //     request.post('/admin/merchant/media/delete', formData, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data',
    //       },
    //     })
    //   }
    //   this.afterHandleRemove(path)
    // },
    // afterHandleRemove(path) {
    //   this.fileList.some((file, index) => {
    //     if (file.path === path) {
    //       this.fileList.splice(index, 1)
    //       return true
    //     }
    //     return false
    //   })
    //   this.emitInput()
    // },
    handlePreview(file) {
      this.dialogImageUrl = file
      this.dialogVisible = true
    },
    // clearFileList() {
    //   this.fileList = []
    //   this.emitInput()
    // },
    // tryToUpload() {
    //   // this.$refs.upload.submit()
    // },
    // checkPlusDisabled() {
    //   // console.log(this.fileList.length)
    //   if (this.fileList.length === 5) {
    //     document.querySelector('.el-upload--picture-card').style.display = 'none'
    //   } else {
    //     document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
    //   }
    // },
    changeUpload(val) {
      // this.cacheList = [...this.fileList]
      this.cacheList.push(val.raw)
      this.cacheList = this.cacheList.filter((item, index) => {
        return this.cacheList.indexOf(item) === index
      })
      // console.log(val.raw)
      const updateImage = {
        url: val.url,
        uid: val.uid,
      }
      this.$emit('updateFileList', updateImage)

      // console.log(val)
      // console.log(val.raw)
    },
    // clearFiles() {
    //   this.$refs.upload.clearFiles()
    // },
    tryToRemove(file) {
      // console.log(file)
      this.fileList.forEach((item, index) => {
        if (file.url === item.url) this.fileList.splice(index, 1)
      })
      this.$refs.upload.uploadFiles.forEach((item, index) => {
        if (file.url === item.url) this.$refs.upload.uploadFiles.splice(index, 1)
      })
      // console.log(this.cacheList)
      this.cacheList.forEach((item, index) => {
        // console.log(item,file)
        if (file.uid === item.uid) this.cacheList.splice(index, 1)
      })
    },
    handleExceed(){
      this.$message({ message: '一次最多上傳5張照片', type: 'error' })
    }
  },
}
</script>

<template>
  <div v-show="showUpload" :class="$style.wrap">
    <!-- <div v-for="(file, index) in fileList" :key="`image-and-action--${index}`" :class="[$style.uploader, 'image-and-action']">
      <el-image v-if="file.path" :src="file.path" fit="cover">
        <div slot="placeholder">
          載入中
          <span class="dot">...</span>
        </div>
      </el-image>
      <span v-if="file.path" :class="$style.actions">
        <el-tooltip effect="dark" content="預覽圖片" placement="top">
          <span @click="handlePreview(file.path)">
            <BaseIcon name="eye" />
          </span>
        </el-tooltip>
        <el-tooltip effect="dark" content="刪除圖片" placement="top">
          <span @click="handleRemove(file.path)">
            <BaseIcon name="trash-alt" />
          </span>
        </el-tooltip>
      </span>
    </div> -->

    <el-upload
      ref="upload"
      action="#"
      list-type="picture-card"
      :auto-upload="false"
      :http-request="handleUpload"
      :before-upload="beforeImageUpload"
      :file-list="fileList"
      :on-change="changeUpload"
      :clear-files="false"
      multiple
      :limit="5"
      :on-exceed="handleExceed"
      :class="{ isLimit: fileList.length === 5 }"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <!-- {{file}} -->
        <!-- <img v-if="file.path" class="el-upload-list__item-thumbnail" :src="file.path" alt="" /> -->
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePreview(file.url)">
            <i class="el-icon-zoom-in"></i>
          </span>

          <span v-if="!disabled" class="el-upload-list__item-delete" @click="tryToRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <p style="color:#c0c4cc;margin:0">圖檔最大 10 MB，檔案格式限 JPG 或 PNG</p>
    <!-- <el-upload
      v-if="showUploadBtn"
      ref="el-upload"
      v-loading="tryingToUpload"
      list-type="picture-card"
      action="#"
      :http-request="handleUpload"
      :before-upload="beforeImageUpload"
      :auto-upload="false"
     
   
      :class="[$style.uploader, $style['add-btn']]"
    > <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt=""
      >
      </div>
      <BaseIcon name="image" />
      <div class="text">點擊上傳圖片</div>
    </el-upload> -->
    <el-dialog :visible.sync="dialogVisible" width="800px" top="0" append-to-body>
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
:global {
}
.wrap {
  // display: flex;
  // flex-wrap: wrap;
  // border-top: 1px solid #dcdfe6;
  // padding: 10px 5px 0px;
  // background: white;
  :global {
    .isLimit{
      .el-upload--picture-card{
        display: none;
      }
    }
    .el-upload--picture-card {
      width: calc(20% - 8px) !important;
      height: 8.6vw !important;
      // min-height: 120px;
      line-height: 8.6vw !important;
    }
    .el-upload-list__item {
      width: calc(20% - 8px);
      height: 8.6vw;
    }
    // .image-and-action {
    //   position: relative;
    // }
  }
}

// .uploader {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 23%;
//   height: 130px;
//   margin: 0;
//   overflow: hidden;
//   margin: 0 5px 10px;

//   :global {
//     .el-upload,
//     .el-image {
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       width: 100%;
//       height: 100%;
//       color: $color-text-placeholder;
//     }
//   }
//   &__icon {
//     font-size: ms(12);
//   }
//   &__limit {
//     margin-top: 10px;
//     line-height: 1.5;
//     color: $color-text-placeholder;
//   }
//   &--circle {
//     width: 150px;
//     height: 150px;
//     margin: auto;
//     border-radius: 50%;
//     .actions {
//       border-radius: 50%;
//     }
//   }
//   &.is-emtpy {
//     border: 1px dashed $color-text-placeholder;
//     &:hover :global {
//       .el-upload,
//       .el-image {
//         color: darken($color-text-placeholder, 20);
//       }
//     }
//   }
// }

// .add-btn {
//   :global {
//     .el-upload {
//       flex-direction: column;
//       svg {
//         font-size: 30px;
//       }
//       .text {
//         height: auto;
//         line-height: 31px;
//         font-size: 14px;
//       }
//     }
//   }
// }

// .actions {
//   position: absolute;
//   top: 0;
//   left: 0;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 100%;
//   font-size: ms(8);
//   color: white;
//   background-color: rgba(0, 0, 0, 0.5);
//   opacity: 0;
//   transition: $fade-transition;
//   span {
//     cursor: pointer;
//     + span {
//       margin-left: 25px;
//     }
//   }
//   &:hover {
//     opacity: 1;
//   }
// }
</style>
