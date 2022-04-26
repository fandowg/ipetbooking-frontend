<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    showDetail: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onEmitClose() {
      this.$emit('close')
    },
    onEmitEdit() {
      // this.data.userGroupIds=[]
      this.$emit('edit', this.data)
    },
    onEmitView() {
      this.$emit('view', this.data)
    },
  },
}
</script>

<template>
  <div :class="$style.container">
    <div :class="[$style.block, { [$style['is-disabled']]: data.block }]">{{ data.block === 0 ? '啟用中' : '停權中' }}</div>
    <div :class="$style.inner" @click="onEmitView">
      <el-avatar :src="data.avatar" :size="100"></el-avatar>

      <h5>{{ data.name }}</h5>
      <div :class="$style.title">{{ data.title }} <span style="padding:0 5px">|</span> <span v-if="data.userGroups.length > 0">{{data.userGroups[0].title}}</span></div>
      <template v-if="showDetail">
        <p>{{ `${data.phoneCode} ${data.phoneNumber}` }}</p>
        <p v-if="data.certificate">證照：{{ data.certificate }}</p>
        <p v-if="data.specialty">專長：{{ data.specialty }}</p>
        <p>{{ data.description }}</p>
      </template>
    </div>
    <div v-if="data.storeTitles.length > 0" class="badge-outline">{{data.storeTitles[0]}}</div>
    <el-button v-if="showDetail" @click="onEmitClose">關閉</el-button>
    <el-button class="is-round icon-left-top" type="primary" plain @click="onEmitEdit">編輯</el-button>
    <!-- <el-button class="is-round icon-left-top" type="primary" plain @click="onEmitEdit"><BaseIcon name="edit" /></el-button> -->
  </div>
</template>

<style lang="scss" module>
@import '@design';
:global{
  .icon-left-top{
    position: absolute;
    left: 10px;
    top: 10px;
    border: 0;
    padding: 10px 13px !important;

  }
}
.container {
  text-align: center;
  position: relative;
}
.inner {
  margin-bottom: 15px;
}
.title {
  color: $color-text-secondary;
}
.block {
  position: absolute;
  top: 10px;
  right: 0;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  color: white;
  background: #60a32f;
  padding: 6px 8px;
  font-size: 12px;
  &.is-disabled {
    background: #e35d5d;
  }
}
</style>
