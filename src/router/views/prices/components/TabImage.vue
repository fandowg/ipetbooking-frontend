<script>
import lazyLoadComponent from '@router/lazyload-component'

// import { messageStroe, messageDelete } from '@utils/message'
// import { messageBoxDelete } from '@utils/message-box'
// import { notification } from '@utils/notification'

// const initData = () => {
//   return {
//     title: '',
//     alias: '',
//     state: 1,
//     serviceTime: 90,
//     bufferTime: 30,
//     introtext: '',
//     description: '',
//     content: '',
//     notice: '',
//     basePrice: '0',
//     price: '0',
//     productId: '',
//     images: [],
//     categoryIds: [],
//     // categoryIds: 2,
//   }
// }

export default {
  components: {
    ImageUpload: () => lazyLoadComponent(import('@views/chat/components/FileUpload')),
  
  },
  props: {
    products: {
      type: Array,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
     
    }
  },
  computed: {
   submitData:{
      get(){
        return this.defaultValue
      },
      set(value) {
        this.$emit('update:defaultValue', value)
      },
    },
  },
  watch: {
  
  },
  created() {

  },
  methods: {
    validate() {
     
    },
  },
}
</script>

<template>
 
<div>

<el-form ref="form" :model="submitData" label-position="top">
  <el-form-item :label="`服務項目圖片（圖檔最大 2 MB，檔案格式限 JPG 或 PNG，圖片比例：16：9，建議尺寸：${!$hasSpecial() ? '800*450px' : '720*520px'}）`">
    <!-- <el-alert title="第一張圖片將會是服務項目首圖" type="warning" show-icon style="padding: 0 16px; margin-top: 5px"> </el-alert> -->
    <ImageUpload v-model="submitData.images" type="service" :class="$style.upload" :show-upload="true" :resource="'product'"></ImageUpload>
  </el-form-item>
</el-form>


</div>
   
</template>

<style lang="scss" module>
@import '@design';
@import '@src/design/layout_detail_steps.scss';
%img-size {
  width: calc(33.333333% - 10px);
  height: 175px;
  @include max-sm {
    width: calc(100% - 10px);
  }
}
:global {
  :local(.upload) {
    margin: 0 -10px;
    border-top: none !important;
    > div {
      @extend %img-size;
    }

    .image-and-action {
      @extend %img-size;
      & + div {
        @extend %img-size;
      }
    }
  }
}

</style>
