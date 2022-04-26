<script>
import { DEFAULT_CURRENT_PAGE, DEFAULT_PAGE_SIZE } from '@src/mixins/pagination'

export default {
  props: {
    currentPage: {
      type: Number,
      default: DEFAULT_CURRENT_PAGE,
    },
    // pageSize: {
    //   type: Number,
    //   default: DEFAULT_PAGE_SIZE,
    // },
    showSize:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      total: 0,
      pageSize: DEFAULT_PAGE_SIZE,
    }
  },
  computed:{
    layoutType(){
      return this.showSize ? "sizes, prev, pager, next, jumper" : "prev, pager, next, jumper"
    }
  },
  methods: {
    updateTotal(total) {
      this.total = total
    },
    updateCurrentPage(page) {
      this.$emit('update:currentPage', page)
    },
    sizeChange(value){
      this.$emit('update:pageSize', value)
    }
  },
}
</script>

<template>
  <el-pagination
    :class="$style.wrapper"
    :current-page="currentPage"
    :page-sizes="[10, 20 ,50 ,100]"
    :page-size="pageSize"
    :total="total"
    :layout="layoutType"
    background
    :hide-on-single-page="!showSize"
    @current-change="updateCurrentPage"
    @size-change="sizeChange"
  ></el-pagination>
</template>

<style lang="scss" module>
@import '@design';
.wrapper {
  margin-top: 15px;
  text-align: center;
}
</style>
