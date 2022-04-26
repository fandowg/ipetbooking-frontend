<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  components: {},
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
    }
  },
  props: {
    fileList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    isSingleImage() {
      let count = 0
      this.fileList.forEach((file) => {
        if (file.type === 'image') count++
      })
      return count === 1
    },
  },
  methods: {
    handlePreview(file) {
      this.dialogImageUrl = file
      this.dialogVisible = true
    },
  },
}
</script>

<template>
  <div v-show="fileList.length" :class="$style.wrap">
    <div v-for="(file, index) in fileList" :class="[$style.uploader, isSingleImage ? $style['full-size'] : '', 'image-and-action']" :key="`image-and-action--${index}`">
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
      </span>
    </div>

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
  :global {
    .image-and-action {
      position: relative;
    }
  }
}

.uploader {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 116px;
  height: 116px;
  margin: 0;
  overflow: hidden;
  margin: 0 5px 10px;

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

.full-size {
  width: auto;
  height: 300px;
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
