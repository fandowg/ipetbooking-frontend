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
    <h5 class="tutorial__head"> 舊版GA </h5>
    <div class="tutorial__row">
      <div class="tutorial__item" style="width: 50%">
        <div class="tutorial__title">
          <span class="tutorial__step">1</span>
          請至【設定】頁面 點選資源列下方的【資源設定】
        </div>
        <img src="~@assets/images/tutorial/ga_1.jpg" alt="" />
      </div>
      <div class="tutorial__arrow">
        <BaseIcon name="arrow-right" />
      </div>
      <div class="tutorial__item" style="width: 50%">
        <div class="tutorial__title">
          <span class="tutorial__step">2</span>
          複製右側的追蹤ID（舊版為UA開頭） 於後台【商店設定/Google Analytics追蹤編號】欄位中貼上
        </div>
        <img src="~@assets/images/tutorial/ga_2.jpg" alt="" />
      </div>
    </div>
    <div class="tutorial__border"></div>
    <h5 class="tutorial__head"> 新版GA4 </h5>
    <div class="tutorial__row" style="margin-bottom:20px">
      <div class="tutorial__item" style="width: 50%">
        <div class="tutorial__title">
          <span class="tutorial__step">1</span>
          請至【設定】頁面， 點選資源列下方的【資料串流】
        </div>
        <img src="~@assets/images/tutorial/ga_3.jpg" alt="" />
      </div>
      <div class="tutorial__arrow">
        <BaseIcon name="arrow-right" />
      </div>
      <div class="tutorial__item" style="width: 50%">
        <div class="tutorial__title">
          <span class="tutorial__step">2</span>
          請於右方列表中 點選您的ipet專屬訂購網站
        </div>
        <img src="~@assets/images/tutorial/ga_4.jpg" alt="" />
      </div>
  
     
    </div>
    <div class="tutorial__row" style="justify-content:flex-start">
       <div class="tutorial__item" style="width: 50%">
        <div class="tutorial__title">
          <span class="tutorial__step">3</span>
          複製下圖中紅框處的評估ID（新版為G開頭） 於後台【商店設定/Google Analytics追蹤編號】欄位中貼上
        </div>
        <img src="~@assets/images/tutorial/ga_5.jpg" alt="" />
      </div>
    </div>

  </div>
</template>
<style lang="scss" module>
</style>
