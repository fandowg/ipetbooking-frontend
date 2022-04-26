<script>
import lazyLoadComponent from '@router/lazyload-component'

export default {
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},

  methods: {},
}
</script>

<template>
  <div class="tutorial">
    <div class="tutorial__row">
      <div class="tutorial__item">
        <div class="tutorial__title">
          <span class="tutorial__step">1</span>
          在官方帳號主頁 點選【增加好友人數】
        </div>
        <img src="~@assets/images/tutorial/lineFriend_1.jpg" alt="" />
      </div>
      <div class="tutorial__arrow">
        <BaseIcon name="arrow-right" />
      </div>
      <div class="tutorial__item">
        <div class="tutorial__title">
          <span class="tutorial__step">2</span>
          點選下方【網址】鍵
        </div>
        <img src="~@assets/images/tutorial/lineFriend_2.jpg" alt="" />
      </div>
      <div class="tutorial__arrow">
        <BaseIcon name="arrow-right" />
      </div>
      <div class="tutorial__item">
        <div class="tutorial__title">
          <span class="tutorial__step">3</span>
          點選【複製網址】 即可貼上後台欄位囉！
        </div>
        <img src="~@assets/images/tutorial/lineFriend_3.jpg" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
</style>
