<script>
import request from '@utils/request'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    resource: {
      type: String,
      required: true,
      validator: function(value) {
        return ['staff', 'merchant', 'product','prepaid','pet'].indexOf(value) !== -1
      },
    },
    circle: {
      type: Boolean,
      default: false,
    },
    onlyUpLoad:{
       type: Boolean,
      default: false,
    },
    suggestSize: {
      type: String,
      default: '',
    },
    imageSize:{
      type: String,
      default: '',
    },
    dir:{
      type: String,
      default: '',
    },
    noRemove:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      tryingToUpload: false,
    }
  },
  computed:{
    urlWithTimestamp(){
      const timestamp = Date.now()
      return `${this.value}?${timestamp}`
      // return this.value
    }
  },
  methods: {
    emitInput(value = '') {
      this.$emit('input', value)
    },
    beforeImageUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml'
      const isLt2M = file.size / 1024 / 1024 <= 10

      if (!isJPGOrPNG) {
        this.$message.error('上傳的頭像圖片只能是 JPG 或 PNG 格式')
      }
      if (!isLt2M) {
        this.$message.error('上傳的頭像圖片大小不能超過 10 MB')
      }
      return isJPGOrPNG && isLt2M
    },
    async handleUpload(params) {
      const formData = new FormData()
      formData.append('files[]', params.file)
      if(this.dir){
        formData.append('dir', this.dir)
      }
      this.tryingToUpload = true
      const uploadedValue = await request.post(
        '/admin/merchant/media/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      this.emitInput(uploadedValue)
      this.tryingToUpload = false
    },
    async handleRemove(path) {
      const isExternal = /^(https?:)/.test(path)
      if (!isExternal) {
        const formData = new FormData()
        formData.append('paths[]', path)
        formData.append('resource', this.resource)

        await request.post('/admin/merchant/media/delete', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }

      this.emitInput()
    },
    handlePreview(file) {
      this.dialogImageUrl = file
      this.dialogVisible = true
    },
    sendSuccess(){
      this.$emit('sendSuccess', true)
    }
  },
}
</script>

<template>
  <div>
    <div :class="[$style.container, { [$style['uploader--circle']]: circle }]">
      <el-upload
        v-loading="tryingToUpload"
        action="string"
        :on-success="sendSuccess"
        :http-request="handleUpload"
        :before-upload="beforeImageUpload"
        :show-file-list="false"
        :class="[$style.uploader, { [$style['is-emtpy']]: !value, [$style['uploader--circle']]: circle }]"
      >
        <el-image v-if="value" :src="value" fit="cover">
          <div slot="placeholder">
            載入中
            <span class="dot">...</span>
          </div>
        </el-image>
        <div v-else>
          <BaseIcon name="image" :class="$style['uploader__icon']" />
          <div>{{ $root.isTouchDevice ? '觸碰上傳圖片' : '點擊上傳圖片' }}</div>
        </div>
      </el-upload>
      <span v-if="value" :class="$style.actions">
        <el-tooltip effect="dark" content="預覽圖片" placement="top">
          <span @click="handlePreview(value)">
            <BaseIcon name="eye" />
          </span>
        </el-tooltip>
        <el-tooltip v-if="!noRemove" effect="dark" content="刪除圖片" placement="top">
          <span @click="handleRemove(value)">
            <BaseIcon name="trash-alt" />
          </span>
        </el-tooltip>
      </span>
    </div>
    <div v-if="!onlyUpLoad" :class="$style.uploader__limit">
      圖檔最大 10 MB，檔案格式限 JPG 或 PNG 或 SVG
      <template v-if="suggestSize">
        <br />
        <span v-if="imageSize">圖片比例：{{imageSize}}，</span>建議尺寸：{{ suggestSize.replace('/', '*')}}px
      </template>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="1135px" top="0" append-to-body>
      <img width="100%" :src="dialogImageUrl" />
    </el-dialog>
  </div>
</template>

<style lang="scss" module>
@import '@design';
.container {
  position: relative;
  margin-top: 10px;
}
.uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 200px;
  margin: auto;
  overflow: hidden;

  :global {
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
