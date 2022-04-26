<script>
import request from '@utils/request'

export default {
  props: {
    isDeleteSave:{
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
    resource: {
      type: String,
      required: true,
      validator: function(value) {
        return ['staff', 'merchant', 'product','prepaid'].indexOf(value) !== -1
      },
    },
    single: {
      type: Boolean,
      default: false,
    },
    type:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      fileList: Object.assign([], this.value),
      tryingToUpload: false,
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  computed: {
    showUploadBtn() {
      return this.single ? this.value.length === 0 : true
    },
  },
  methods: {
    emitInput() {
      this.$emit('input', [...this.fileList])
    },
    beforeImageUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 <= 25

      if (!isJPGOrPNG) {
        this.$message.error('上傳的圖片只能是 JPG 或 PNG 格式')
      }
      if (!isLt2M) {
        this.$message.error('上傳的圖片大小不能超過 25 MB')
      }
      return isJPGOrPNG && isLt2M
    },
    async handleUpload(params) {
      const formData = new FormData()
      formData.append('files[]', params.file)

      this.tryingToUpload = true
      const uploadedValue = await request.post('/admin/merchant/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      this.fileList.push({
        type: 'image',
        path: uploadedValue,
      })

      this.tryingToUpload = false
      this.emitInput()
    },
    async handleRemove(path) {
      const isExternal = /^(https?:)/.test(path)
      if (!isExternal) {
        const formData = new FormData()
        formData.append('paths[]', path)
        formData.append('resource', this.resource)

        request.post('/admin/merchant/media/delete', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      this.afterHandleRemove(path)
    },
    afterHandleRemove(path) {
      this.fileList.some((file, index) => {
        if (file.path === path) {
          this.fileList.splice(index, 1)
          return true
        }
        return false
      })
      this.emitInput()
      if(this.isDeleteSave){
        this.$emit('deleteSave')
      }
    },
    handlePreview(file) {
      this.dialogImageUrl = file
      this.dialogVisible = true
    },
    clearFileList() {
      this.fileList = []
      this.emitInput()
    },
  },
}
</script>

<template>
  <div v-show="showUpload" :class="$style.wrap">
    <div v-for="(file, index) in fileList" :key="`image-and-action--${index}`" :class="[$style.uploader, 'image-and-action']">
      <el-image v-if="file.path" :src="file.path" fit="cover">
        <div slot="placeholder">
          載入中
          <span class="dot">...</span>
        </div>
      </el-image>
      <span v-if="index === 0 && type === 'service'" class="first" style="font-size: 12px; color: darkgray"><BaseIcon name="flag" /> 此為服務項目首圖</span>
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
    </div>

    <el-upload
      v-if="showUploadBtn"
      ref="el-upload"
      v-loading="tryingToUpload"
      list-type="picture-card"
      action="string"
      :http-request="handleUpload"
      :before-upload="beforeImageUpload"
      :show-file-list="false"
      :class="[$style.uploader, $style['add-btn']]"
    >
      <BaseIcon name="image" />
      <div class="text">點擊上傳圖片</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" width="1135px" top="0" append-to-body>
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.wrap {
  display: flex;
  flex-wrap: wrap;
  border-top: 1px solid #dcdfe6;
  padding: 10px 5px 0px;
  background: white;
  :global {
    .image-and-action {
      position: relative;
    }
  }
}

.uploader {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  width: 23%;
  height: 130px;
  margin: 0;
  // overflow: hidden;
  margin: 0 5px 50px;

  :global {
    .first{
      width: 100%;
      text-align: left;
      // position:absolute;
      // bottom:-25px
    }
    .el-upload,
    .el-image {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      color: $color-text-placeholder;
    }
  }
  &__icon {
    font-size: ms(12);
  }
  &__limit {
    margin-top: 10px;
    line-height: 1.5;
    color: $color-text-placeholder;
  }
  &--circle {
    width: 150px;
    height: 150px;
    margin: auto;
    border-radius: 50%;
    .actions {
      border-radius: 50%;
    }
  }
  &.is-emtpy {
    border: 1px dashed $color-text-placeholder;
    &:hover :global {
      .el-upload,
      .el-image {
        color: darken($color-text-placeholder, 20);
      }
    }
  }
}

.add-btn {
  :global {
    .el-upload {
      flex-direction: column;
      svg {
        font-size: 30px;
      }
      .text {
        height: auto;
        line-height: 31px;
        font-size: 14px;
      }
    }
  }
}

.actions {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: ms(8);
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: $fade-transition;
  span {
    cursor: pointer;
    + span {
      margin-left: 25px;
    }
  }
  &:hover {
    opacity: 1;
  }
}
</style>
