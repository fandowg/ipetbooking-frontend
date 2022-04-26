<script>
import { throttle } from 'lodash'
export default {
  props: {
    defaultValue: {
      type: Object,
      default: () => {},
    },
    border: {
      type: Boolean,
      default: false,
    },
    hideReset: {
      type: Boolean,
      default: false,
    },
    isExport:{
      type: Boolean,
      default: false,
    },
    otherMode:{
      type: String,
      default:'',
    },
    hideAction:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      originData: Object.assign({}, this.defaultValue),
      fake:''
    }
  },
  methods: {
    onReset: throttle(function() {
      this.$emit('update:defaultValue', Object.assign({}, this.originData))
      this.$refs['search-form'].resetFields()
      this.$emit('reset')
    }, 2000),
    handleExport(){
      this.$emit('handleExport')
    },
    tryToFetchList(){
      this.$emit('tryToFetchList')
    }
  },
}
</script>

<template>
  <el-form ref="search-form" :model="defaultValue" :class="[$style.wrapper, { [$style.border]: border }]" class="el-form-item--normal-margin" inline>
    <div :class="$style.fields">
      <slot :fields="defaultValue"></slot>
    </div>
     <div class="btn-box-inline">
       <el-button v-if="!hideReset && !hideAction" type="primary" class="is-round"  @click="tryToFetchList">篩選</el-button>
      <el-button v-if="!hideReset" class="is-round"  @click="onReset">重置</el-button>
      <!-- <el-button v-if="!hideReset && isExport"  class="is-round" type="primary" plain @click="handleExport">匯出訂單</el-button> -->
      <el-input v-if="otherMode === 'coupon'" v-model.trim="fake" placeholder="搜尋優惠券" style="margin-left:20px">
        <i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" ></i>
      </el-input>
      <el-input v-if="otherMode === 'staff'" v-model.trim="fake" placeholder="搜尋服務人員" style="margin-left:20px">
        <i slot="suffix" style="cursor: pointer" class="el-input__icon el-icon-search" ></i>
      </el-input>
      <el-button  v-if="!hideReset && isExport" class="is-round" plain @click="handleExport"><BaseIcon name="file-export" /> 數據匯出</el-button>
     </div>
  </el-form>
</template>

<style lang="scss" module>
@import '@design';
.wrapper {
  @include max-sm {
    flex-direction: column;
  }

  &:global {
    &.isForTab{
      padding: 15px 0 20px;
    }
  }

  :global {
    .el-form-item {
      margin-bottom: 10px;
    }
     .el-input__inner{
       border:$color-border-base 1px solid;
       border-radius: $border-radius;
     }
    // .el-select {
    //   width: initial;
    // }


    .btn-box-inline {
      @include max-sm {
        display: flex;
        flex-direction: column;
        margin-top: 0.5rem;
      }

      .el-button + .el-button {
        @include max-sm {
          margin-left: 0;
          margin-top: 0.5rem;
        }

      }
    }

    .el-form-item__content {
      @include max-sm {
        width: 100% !important;
      }

      .el-select, .el-input {
        @include max-sm {
          width: 100% !important;
        }
      }
    }
  }

  // @include layer-elevation(4);

  display: flex;
  justify-content: space-between;
  padding: 15px 15px 20px;
  // margin-bottom: 10px;
  background: white;

}
.fields {
  @include max-sm {
    flex-direction: column;
  }
  :global {
    .el-form-item {
      margin-bottom: 0;
      & + & {
        padding-left: 10px;
        border-left: 1px solid $color-border-base;
      }

      @include max-sm {
        margin-bottom: 0.5rem;
        margin-right: 0 !important;
      }
    }
    .el-input__inner {
      background-color: transparent;
    }
  }

  display: flex;

  @include max-sm {
    flex-direction: column;
  }
}

.border {
  box-shadow: none;
  padding:10px 0;
  background-color: transparent;

  @include max-sm {
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .fields {
    flex-grow: 1;
    flex-basis: 0;
  }
  :global {
    .el-form-item {
      flex-grow: 1;
      flex-basis: 0;

      .el-form-item__content {
        width: 100%;
        .el-input__inner {
          background-color: white;
          border-color: #C6C6BA;  
          border-radius: 8px;
        }
      }
    }
  }
}


</style>
