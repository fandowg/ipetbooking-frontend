<script>
import lazyLoadComponent from '@router/lazyload-component'
import { genderFilter, orderStatusMap } from '@utils/filter-value-to-text'
import { mapActions } from 'vuex'

export default {
  components: {},
  filters: {
    genderFilter,
  },
  props: {
    type:{
      type:String,
      default:''
    },
    item: {
      type: Object,
      default: () => {},
    },
    index: {
      type:Number,
      default:0
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    ...mapActions('push', ['readPushPage','checkIsRead']),
    async tryToRead(item,index) {
      const url =item.data.aps.data.url
      if(!item.readAt){
        await this.readPushPage({ pushId: item.id,index,type:this.type })
        // this.$store.dispatch('push/updateReadState',index)
        // this.checkIsRead()
      }
      if(url){
        this.$router.push({
          path:url
        })
      }
    },
  },
}
</script>
<template>
  <div :class="[$style.item, { isRead: item.readAt },{ hasUrl: item.data.aps.data.url }]" @click="tryToRead(item,index)">
    <span v-if="item.data.aps.data.body.text" v-html="item.data.aps.data.body.text" />
    <span v-else v-html="item.data.aps.data.body.message" />
  </div>
</template>

<style lang="scss" module>
.item {
  & + .item {
    border-top: $color-border-base 1px solid;
  }

  padding: 35px 30px;
  @include touch {
    padding: 25px 20px;
  }
  &:global {
    &.isRead {
      background-color: #f5f7fa;
    }
    &.hasUrl{
      cursor: pointer;
    }
  }
  :global {
    .item {
      &__link {
      }
    }
  }
}
</style>