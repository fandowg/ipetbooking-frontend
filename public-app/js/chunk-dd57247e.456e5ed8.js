(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dd57247e","chunk-2d0b235b"],{"22af":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("el-input",t._g(t._b({ref:"input",attrs:{value:t.value},on:{focus:t.onFocus,input:function(e){return t.onInput(t.value)},blur:function(e){return t.onBlur(t.value)}},scopedSlots:t._u([{key:"prepend",fn:function(){return[t._t("prepend")]},proxy:!0},{key:"append",fn:function(){return[t._t("append")]},proxy:!0},{key:"suffix",fn:function(){return[t._t("suffix")]},proxy:!0}],null,!0)},"el-input",t.$attrs,!1),t.$listeners))},n=[],r={inheritAttrs:!1,props:{value:{type:[String,Number],default:""}},data:function(){return{isFloating:!1}},watch:{value:{handler:"onBlur",immediate:!0},isFloating:{handler:"toggleFormItemClass",immediate:!0}},methods:{toggleFormItemClass:function(t){var e=this;this.$nextTick(function(){var a=e.$refs.input.$el.parentNode.previousElementSibling;a.classList.add("floating-label"),t||e.$slots.prepend?a.classList.add("is-floating"):a.classList.remove("is-floating")})},onBlur:function(t){this.isFloating=""!==t&&null!==t},onFocus:function(){this.isFloating=!0},onInput:function(t){this.isFloating=""!==t&&null!==t}}},s=r,o=a("2877"),u=Object(o["a"])(s,i,n,!1,null,null,null);e["default"]=u.exports},"3fa5":function(t,e,a){"use strict";a.d(e,"b",function(){return n}),a.d(e,"a",function(){return r});var i=a("5c96");function n(t){"add"===t&&Object(i["Message"])({message:"已新增",type:"success"}),"edit"===t&&Object(i["Message"])({message:"已儲存",type:"success"})}function r(){Object(i["Message"])({message:"已刪除",type:"success"})}},"4e21":function(t,e,a){"use strict";var i=a("b89c"),n=a.n(i);e["default"]=n.a},"8aff":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:t.$style.page},[a("BasePageHeader",{attrs:{title:"編輯優惠券"}}),a("el-tabs",{attrs:{stretch:"",type:"border-card"},model:{value:t.activeTab,callback:function(e){t.activeTab=e},expression:"activeTab"}},t._l(t.tabList,function(e,i){return a("el-tab-pane",{key:i,attrs:{label:e.title,name:""+(i+1)}},[a(e.component,{ref:"step"+(i+1),refInFor:!0,tag:"component",attrs:{"default-value":t.defaultValue},on:{store:t.getCoupon}}),a("div",{class:t.$style.footer},[a("el-button",{staticClass:"is-round",attrs:{type:"danger",loading:t.tryingToRemove,disabled:t.tryingToRemove},on:{click:t.tryToRemove}},[t._v("刪除")]),a("el-button",{staticClass:"is-round",attrs:{type:"primary",plain:"",loading:t.tryingToSave},on:{click:function(e){return t.$router.push({name:"coupon"})}}},[t._v("取消")]),a("el-button",{staticClass:"is-round",attrs:{type:"primary",loading:t.tryingToSave},on:{click:t.onClickSave}},[t._v("儲存變更")]),"3"===t.activeTab?a("el-button",{staticClass:"is-round",attrs:{loading:t.tryingToSave},on:{click:function(e){return t.changePage(2)}}},[t._v("查看名單")]):t._e(),"3"===t.activeTab?a("el-button",{staticClass:"is-round",attrs:{loading:t.tryingToSave},on:{click:t.tryToSend}},[t._v("儲存並發送")]):t._e()],1)],1)}),1)],1)},n=[],r=a("4795"),s=a.n(r),o=a("cb0c"),u=a("fdf0"),c=a("0644"),l=a.n(c),d=a("3fa5"),p=a("df73"),m={components:{CouponForm:u["default"]},props:{defaultValue:{type:Object,default:function(){}},isAssigned:{type:Boolean,default:!1}},data:function(){return{activeTab:"1",couponData:l()(this.defaultValue),tabList:Object.freeze([{title:"基本資訊",component:function(){return Promise.resolve().then(a.bind(null,"fdf0"))}},{title:"適用項目",component:function(){return a.e("chunk-10a343e6").then(a.bind(null,"c062"))}},{title:"適用對象",component:function(){return a.e("chunk-5c7d4f2e").then(a.bind(null,"66dd"))}}]),tryingToSave:!1,tryingToSend:!1,tryingToRemove:!1,allMembers:[]}},computed:{availableMembers:function(){var t=[];if(0===this.defaultValue.availableTags.length&&0===this.defaultValue.availableMembers.length)t=this.allMembers;else{var e=this.defaultValue.availableTags.map(function(t){return t.id}),a=this.defaultValue.availableMembers.map(function(t){return t.id}),i=this.defaultValue.blockMembers.map(function(t){return t.id});t=this.allMembers.filter(function(t){var n=t.tags.map(function(t){return t.id}),r=n.some(function(t){return e.includes(t)});return!(!r||i.includes(t.id))||(!!a.includes(t.id)||void 0)})}return t}},watch:{isAssigned:function(){this.activeTab="3"}},created:function(){this.tryToSearch()},methods:{tryToSearch:function(){var t=Object(o["a"])(s.a.mark(function t(){var e,a;return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch("member/fetchList");case 2:e=t.sent,a=e.items,this.allMembers=a;case 5:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),getCoupon:function(){var t=this;this.$store.dispatch("coupon/fetchSingle",this.$route.params.couponId).then(function(e){t.$emit("update:defaultValue",e)})},onClickSave:function(){var t=Object(o["a"])(s.a.mark(function t(){var e;return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(this.tryingToSave=!0,t.prev=1,0!==this.$refs.step2[0].submitData.priceIds.length){t.next=6;break}return this.$confirm("請至少選擇一個適用項目","提示",{confirmButtonText:"確定",showCancelButton:!1,type:"warning",center:!0}),this.tryingToSave=!1,t.abrupt("return");case 6:return e=Object.assign({},this.$refs.step1[0].submitData,this.$refs.step2[0].submitData,this.$refs.step3[0].filterSubmitData),t.next=9,this.$store.dispatch("coupon/store",e);case 9:Object(d["b"])("edit"),this.tryingToSave=!1,this.getCoupon(),t.next=17;break;case 14:t.prev=14,t.t0=t["catch"](1),this.tryingToSave=!1;case 17:case"end":return t.stop()}},t,this,[[1,14]])}));return function(){return t.apply(this,arguments)}}(),tryToSend:function(){var t=Object(o["a"])(s.a.mark(function t(){var e;return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(0!==this.availableMembers.length){t.next=4;break}return t.next=3,this.$confirm("沒有適用的會員",{confirmButtonText:"確定",showCancelButton:!1,center:!0});case 3:return t.abrupt("return");case 4:return t.next=6,this.$confirm("確定發送".concat(this.availableMembers.length,"張優惠券"),{confirmButtonText:"確定",cancelButtonText:"取消",center:!0});case 6:return this.tryingToSend=!0,e={memberIds:this.availableMembers.map(function(t){return t.id}),router:"all",sendWhoType:"all",mode:"byMember",templateContent:"寄送全部優惠券",subject:"店家名稱"},t.next=10,this.$store.dispatch("merchant/sendNoti",e);case 10:this.$message({message:"發送成功！",type:"success"}),this.tryingToSend=!1;case 12:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),tryToRemove:function(){var t=Object(o["a"])(s.a.mark(function t(){return s.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,Object(p["a"])("該優惠券");case 3:return t.prev=3,this.tryingToRemove=!0,t.next=7,this.$store.dispatch("coupon/remove",{ids:[this.defaultValue.id]});case 7:Object(d["a"])(),this.$router.push({name:"coupon"});case 9:return t.prev=9,this.tryingToRemove=!1,t.finish(9);case 12:t.next=16;break;case 14:t.prev=14,t.t0=t["catch"](0);case 16:case"end":return t.stop()}},t,this,[[0,14],[3,,9,12]])}));return function(){return t.apply(this,arguments)}}(),changePage:function(t){this.$emit("changePage",t)}}},f=m,b=a("e59e"),h=a("2877");function v(t){this["$style"]=b["default"].locals||b["default"]}var g=Object(h["a"])(f,i,n,!1,v,null,null);e["default"]=g.exports},b89c:function(t,e,a){t.exports={slide:"CouponForm_slide_1AJjQ","slide-reverse":"CouponForm_slide-reverse_28HP2",toggler:"CouponForm_toggler_1MvK4","form-item--split":"CouponForm_form-item--split_5diN8","product-list":"CouponForm_product-list_3dPew","product-list__header":"CouponForm_product-list__header_S0MtW","product-list__button":"CouponForm_product-list__button_3hblj","product-list__body":"CouponForm_product-list__body_M_x9g","product-list__item":"CouponForm_product-list__item_23fWU",footer:"CouponForm_footer_1fVE9"}},c3ee:function(t,e,a){t.exports={slide:"DetailEdit_slide_1U73C","slide-reverse":"DetailEdit_slide-reverse_3uko9",page:"DetailEdit_page_1WXoM","card-wrapper":"DetailEdit_card-wrapper_3Tqs6",footer:"DetailEdit_footer_2IV8o"}},df73:function(t,e,a){"use strict";a.d(e,"b",function(){return n}),a.d(e,"a",function(){return r});var i=a("5c96");function n(t){return i["MessageBox"].confirm("尚未完成新增，請問是否確定離開新增".concat(t),"您將離開此頁面",{confirmButtonText:"確定",cancelButtonText:"取消",type:"warning",center:!0,showClose:!1})}function r(t){return i["MessageBox"].confirm("您確定要刪除".concat(t,"嗎？"),"確認刪除",{confirmButtonText:"刪除",cancelButtonText:"取消",type:"warning",center:!0,showClose:!1})}},e59e:function(t,e,a){"use strict";var i=a("c3ee"),n=a.n(i);e["default"]=n.a},fdf0:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-form",{ref:"form",staticClass:"el-form--floating",attrs:{model:t.submitData,rules:t.submitRules,"validate-on-rule-change":!1,"label-position":"top",autocomplete:"off"}},[a("h4",{staticClass:"form-block-title"},[t._v("是否開放使用")]),a("el-switch",{attrs:{"active-text":"是","inactive-text":"否","active-value":1,"inactive-value":0},model:{value:t.submitData.state,callback:function(e){t.$set(t.submitData,"state",e)},expression:"submitData.state"}}),a("h4",{staticClass:"form-block-title"},[t._v("基本設定")]),a("el-form-item",{attrs:{label:"優惠券名稱",prop:"title",required:""}},[a("el-input",{model:{value:t.submitData.title,callback:function(e){t.$set(t.submitData,"title",e)},expression:"submitData.title"}})],1),a("el-form-item",{attrs:{label:"優惠券代碼",prop:"code",required:""}},[a("el-input",{model:{value:t.submitData.code,callback:function(e){t.$set(t.submitData,"code",e)},expression:"submitData.code"}},[a("el-button",{attrs:{slot:"append"},on:{click:t.generateCode},slot:"append"},[t._v("自動產生代碼")])],1)],1),a("el-row",{attrs:{gutter:10}},[a("el-col",{attrs:{sm:12,span:24}},[a("el-form-item",{attrs:{label:"優惠類型",prop:"type",required:""}},[a("el-radio-group",{model:{value:t.submitData.type,callback:function(e){t.$set(t.submitData,"type",e)},expression:"submitData.type"}},[a("el-radio",{attrs:{label:"fixed"}},[t._v("固定金額")]),a("el-radio",{attrs:{label:"%"}},[t._v("按訂單總額比例")])],1)],1)],1),a("el-col",{attrs:{sm:12,span:24}},[a("el-form-item",{attrs:{label:"數值",prop:"discount",required:""}},[a("el-input",{attrs:{min:"0"},scopedSlots:t._u([{key:"append",fn:function(){return[t._v(t._s(t._f("numberUnitFilter")(t.submitData.type)))]},proxy:!0}]),model:{value:t.submitData.discount,callback:function(e){t.$set(t.submitData,"discount",t._n(e))},expression:"submitData.discount"}})],1)],1)],1),a("h4",{staticClass:"form-block-title"},[t._v("使用限制 "),a("el-checkbox",{staticClass:"check-by-head",attrs:{"true-label":"FirstUse","false-label":"Normal"},model:{value:t.submitData.rules.type,callback:function(e){t.$set(t.submitData.rules,"type",e)},expression:"submitData.rules.type"}},[t._v("限定初次使用")])],1),a("el-row",{attrs:{gutter:40}},[a("el-col",{attrs:{sm:12,span:24}},[a("el-form-item",{attrs:{label:"發放張數",prop:"infinity",required:""}},[a("div",{class:t.$style["form-item--split"]},[a("el-radio-group",{model:{value:t.submitData.infinity,callback:function(e){t.$set(t.submitData,"infinity",e)},expression:"submitData.infinity"}},[a("el-radio",{attrs:{label:1}},[t._v("無上限")]),a("el-radio",{attrs:{label:0}},[t._v("限量")])],1),t.submitData.infinity?t._e():a("el-form-item",{staticStyle:{"margin-bottom":"0"},attrs:{prop:"limit",required:""}},[a("el-input",{staticStyle:{width:"120px"},attrs:{min:"0",size:"small"},scopedSlots:t._u([{key:"append",fn:function(){return[t._v("張")]},proxy:!0}],null,!1,3833748390),model:{value:t.submitData.limit,callback:function(e){t.$set(t.submitData,"limit",t._n(e))},expression:"submitData.limit"}})],1)],1)])],1)],1),a("el-row",{attrs:{gutter:40}},[a("el-col",{attrs:{sm:12,span:24}},[a("el-form-item",{attrs:{label:"最低消費金額",prop:"rebatePrice"}},[a("el-input",{scopedSlots:t._u([{key:"append",fn:function(){return[t._v("元")]},proxy:!0}]),model:{value:t.submitData.rebatePrice,callback:function(e){t.$set(t.submitData,"rebatePrice",t._n(e))},expression:"submitData.rebatePrice"}})],1)],1),"FirstUse"!==t.submitData.rules.type?a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{label:"每人可使用次數",prop:"rules.value"}},[a("el-input",{attrs:{min:"1"},scopedSlots:t._u([{key:"append",fn:function(){return[t._v("次")]},proxy:!0}],null,!1,2868036018),model:{value:t.submitData.rules.value,callback:function(e){t.$set(t.submitData.rules,"value",t._n(e))},expression:"submitData.rules.value"}})],1)],1):t._e()],1),a("el-row",{attrs:{gutter:40}},[a("el-col",{attrs:{sm:12,span:24}},[a("el-form-item",{attrs:{label:"開始使用日期",prop:"startDate"}},[a("el-date-picker",{attrs:{format:"yyyy/MM/dd","value-format":"yyyy-MM-dd",type:"date",placeholder:"若開放優惠券即可使用"},model:{value:t.submitData.startDate,callback:function(e){t.$set(t.submitData,"startDate",e)},expression:"submitData.startDate"}})],1)],1),a("el-col",{attrs:{sm:12,span:24}},[a("el-form-item",{attrs:{label:"停止使用日期",prop:"endDate"}},[a("el-date-picker",{attrs:{format:"yyyy/MM/dd","value-format":"yyyy-MM-dd",type:"date",placeholder:"無使用期限"},model:{value:t.submitData.endDate,callback:function(e){t.$set(t.submitData,"endDate",e)},expression:"submitData.endDate"}})],1)],1)],1)],1)],1)},n=[],r=a("f210"),s=a("4795"),o=a.n(s),u=a("cb0c"),c=a("9395"),l=a("2ef0"),d=a("4d77"),p=a("22af"),m=a("ed08"),f=a("7e02"),b=a("6bea"),h=function(){return{title:"",code:"",type:"fixed",discount:"",state:1,infinity:1,limit:1,rebatePrice:0,startDate:"",endDate:"",productAssign:1,productIds:[],priceIds:[],rules:{type:"Normal",value:1}}},v={components:{BaseInputFloatingLabel:p["default"]},filters:{numberUnitFilter:f["j"]},props:{defaultValue:{type:Object,default:function(){return h()}}},data:function(){return{tryingStore:!1,submitData:Object.assign(h(),this.defaultValue)}},computed:Object(c["a"])({},d["d"],{isEditMode:function(){return this.defaultValue.id},submitRules:function(){var t=this,e="",a=function(e,a,i){t.$refs.form.validateField("discount"),i()},i=this;return{title:[{required:!0,message:"請輸入優惠券名稱"}],code:[{required:!0,message:"請輸入優惠券代碼"},{validator:function(a,n,r){n!==i.defaultValue.code?(clearTimeout(e),""===n&&r(new Error("請輸入優惠券代碼")),e=setTimeout(function(){return t.$store.dispatch("coupon/checkCode",{code:n,id:i.defaultValue.id}).then(function(){return r()}).catch(function(){return r(new Error("您輸入的優惠券代碼已存在"))})},500)):r()},trigger:"change"}],priceIds:[{type:"array",required:this.submitData.productAssign,message:"請至少指定一個項目",trigger:"change"}],type:[{validator:a,trigger:"change"}],discount:[{type:"number",min:0,max:"%"===this.submitData.type?100:null,message:"%"===this.submitData.type?"請輸入小於 100 之數字":"請輸入欲折扣之數值"}],rebatePrice:[{type:"number",min:0,message:"請輸入最低消費金額"}],"rules.value":[{type:"number",min:0,message:"請輸入每人可使用次數"}],limit:[{type:"number",min:0,message:"請輸入張數"}]}},productsAssigned:function(){var t=this;return Object.values(this.cachedProductsById).filter(function(e){return-1===t.submitData.productIds.indexOf(e.id)})},pricesAssigned:function(){var t=this,e=Object.values(this.cachedPricesById).filter(function(e){return-1===t.submitData.priceIds.indexOf(e.id)});return Object(l["chain"])(e).groupBy("productTitle").map(function(t,e){return{title:e,children:t}}).value()}}),created:function(){this.$store.dispatch("product/fetchServicePrices",{limit:1e3}),this.isEditMode&&this.updateProductAssign()},methods:{updateProductAssign:function(){0===this.submitData.productAssign&&(this.submitData.productAssign=1)},tryToStore:function(){var t=Object(u["a"])(o.a.mark(function t(){return o.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$refs.form.validate();case 2:return this.submitData=Object(c["a"])({},this.submitData,{startDate:Object(b["e"])(this.submitData.startDate)||"",endDate:Object(b["e"])(this.submitData.endDate)||""}),this.tryingStore=!0,t.prev=4,t.next=7,this.$store.dispatch("coupon/store",this.submitData);case 7:this.emitStore(),t.next=13;break;case 10:t.prev=10,t.t0=t["catch"](4),console.log("TCL: tryToStore -> error",t.t0);case 13:return t.prev=13,this.tryingStore=!1,t.finish(13);case 16:case"end":return t.stop()}},t,this,[[4,10,13,16]])}));return function(){return t.apply(this,arguments)}}(),emitStore:function(){this.$emit("store"),this.emitBack()},emitBack:function(){this.$emit("back")},generateCode:function(){var t="".concat(this.currentUser.merchantAlias,"_").concat(Object(m["a"])(5));this.submitData.code=t.toUpperCase()},onSelectPrice:function(t){this.submitData.priceIds=Object(r["a"])(this.submitData.priceIds).concat(Object(r["a"])(t))},onDeselectPrice:function(t){this.submitData.priceIds=this.submitData.priceIds.filter(function(e){return e!==t})},validate:function(){return this.$refs.form.validate()}}},g=v,y=a("4e21"),_=a("2877");function D(t){this["$style"]=y["default"].locals||y["default"]}var x=Object(_["a"])(g,i,n,!1,D,null,null);e["default"]=x.exports}}]);
//# sourceMappingURL=chunk-dd57247e.456e5ed8.js.map