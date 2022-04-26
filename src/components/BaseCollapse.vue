<script>
export default {
  props: {
    title: String,
    icon: {
      type: String,
      default: 'arrow',
    },
    orderTheme: {
      type: Boolean,
      default: false,
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    isTable:{
      type: Boolean,
      default: false,
    },
    smallTitle:{
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      isActive: this.expanded,
      id: Math.floor(Math.random() * 10000),
    }
  },
  methods: {
    handleHeaderClick() {
      this.isActive = !this.isActive
    },
  },
}
</script>

<template>
  <div>
    <div v-if="isTable">
      <div @click="handleHeaderClick"><slot name="title"></slot></div>
      <div v-show="isActive">
        <slot></slot>
      </div>
    </div>
    <div v-else role="tab" :aria-expanded="isActive" :aria-controls="`el-collapse-content-${id}`" :aria-describedby="`el-collapse-content-${id}`" :class="[$style.wrapper, { [$style.trans]: orderTheme },{ [$style.isOrder]: isOrder }]">
      <div :id="`el-collapse-head-${id}`" role="button" :class="[$style.header,{ isOrder: isOrder }]" @click="handleHeaderClick">
        <BaseIcon v-if="icon !== 'arrow'" :class="$style['header-icon']" :name="isActive ? 'minus' : 'plus'" />
        <slot name="title">{{ title }}</slot>
        <BaseIcon v-if="icon === 'arrow'" :class="$style['header-icon-right']" :icon-style="'fal'" :name="isActive ? 'chevron-down' : 'chevron-right'" />
      </div>
      <div v-show="isActive" :id="`el-collapse-content-${id}`" role="tabpanel" :aria-hidden="!isActive" :aria-labelledby="`el-collapse-head-${id}`" :class="$style.content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.wrapper {
  background: white;
  &.trans {
    background: transparent;
    border-bottom: 1px solid #c6c6ba;
    > .header {
      padding: 31px 0;
      font-size: 16px;
      letter-spacing: 1.6px;
      font-weight:normal;
      cursor: pointer;
    
    
      &-icon {
        margin-right: 10px;
      }
    }
    > .content {
      padding: 0;
      padding-bottom: 40px;
    }
  }
  &.isOrder{
    //  margin-bottom: 20px;
    border-bottom: 1px solid $color-border-base;
    > .header {
      padding:30px 0 30px ;
          font-size: 14px;
          // font-size: 1.015534104em;
          font-weight: 500;
    }
    > .content {
      padding: 0;
      padding-bottom:0;
     
    }
  }
}
.header {
  padding: 15px;
  font-size: ms(1);
  font-weight: normal;
  cursor: pointer;

  &-icon {
    margin-right: 10px;
  }
}
.header-icon-right {
  float: right;
  margin: 0;
}
.content {
  padding: 5px 15px;
}
</style>
