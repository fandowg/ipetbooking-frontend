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
    <h5 class="tutorial__head"> 1. 取得粉絲專頁編號 </h5>
    <div class="tutorial__row">
      <div class="tutorial__item" style="width: 50%">
        <div class="tutorial__title">
          <span class="tutorial__step">1</span>
          進入您的粉絲專頁 點選【更多】，再於下拉選單中選擇【關於】
        </div>
        <img src="~@assets/images/tutorial/fbCode_1.jpg" alt="" />
      </div>
      <div class="tutorial__arrow">
        <BaseIcon name="arrow-right" />
      </div>
      <div class="tutorial__item" style="width: 50%">
        <div class="tutorial__title">
          <span class="tutorial__step">2</span>
          複製粉絲專頁編號 於後台【商店設定/Facebook粉絲專頁編號】欄位中貼上
        </div>
        <img src="~@assets/images/tutorial/fbCode_2.jpg" alt="" />
      </div>
    </div>
    <div class="tutorial__border"></div>
    <h5 class="tutorial__head"> 2. 於粉絲專頁中貼上網址 </h5>
    <div class="tutorial__row">
      <div class="tutorial__item" style="width: 25%">
        <div class="tutorial__title">
          <span class="tutorial__step">1</span>
          於左側選單點選 商務套件 -【收件匣】
        </div>
        <img src="~@assets/images/tutorial/fbCode_3.jpg" alt="" />
      </div>
      <div class="tutorial__arrow">
        <BaseIcon name="arrow-right" />
      </div>
      <div class="tutorial__item" style="width: 75%">
        <div class="tutorial__title">
          <span class="tutorial__step">2</span>
          點選【洽談外掛程式】分頁，於下方【設定你的洽談外掛程式】欄位中 填寫您的ipet訂購頁網址（https://xxxxx/ipetbooking.com/)，並按下發佈
        </div>
        <img src="~@assets/images/tutorial/fbCode_4.jpg" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" module>
</style>
