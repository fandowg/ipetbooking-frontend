(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0adbc6a9"],{1407:function(e,t,a){e.exports={slide:"calendar_slide_1dhMH","slide-reverse":"calendar_slide-reverse_dYlUZ",tab:"calendar_tab_1UMd3",wrap:"calendar_wrap_2nEcB",mobile:"calendar_mobile_1UY42"}},"28d7":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("Layout",{class:e.$style.wrap},[a("BasePageHeader",{attrs:{center:!0,"large-title":!0},scopedSlots:e._u([{key:"title",fn:function(){return[e._v("行事曆")]},proxy:!0},{key:"center",fn:function(){return[a("div",{class:e.$style.tabs,staticStyle:{"text-align":"center"}},[a("el-radio-group",{class:e.$style.tab,model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[a("el-radio-button",{attrs:{label:"Week"}},[e._v("週")]),a("el-radio-button",{attrs:{label:"Day"}},[e._v("天")]),a("el-radio-button",{attrs:{label:"Schedule"}},[e._v("行程表")])],1)],1)]},proxy:!0},{key:"right",fn:function(){return[a("el-button",{staticClass:"is-round is-dark",staticStyle:{"line-height":"20px"},on:{click:function(t){e.dialogCalendarVisible=!0}}},[e._v("同步至其他行事曆")])]},proxy:!0}])}),a("el-radio-group",{class:[e.$style.tab,e.$style.mobile],model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},[a("el-radio-button",{attrs:{label:"Day"}},[e._v("日排程")]),a("el-radio-button",{attrs:{label:"Schedule"}},[e._v("行程表")])],1),a("transition",{attrs:{name:e.isForward?e.$style["slide-reverse"]:e.$style.slide,mode:"out-in"}},[a(e.activeTab,{key:e.keyName,tag:"component",attrs:{mode:e.activeTab.toLowerCase()}})],1),a("el-dialog",{attrs:{title:"同步行事曆",visible:e.dialogCalendarVisible,"append-to-body":!0,top:"0",width:"680px"},on:{"update:visible":function(t){e.dialogCalendarVisible=t}}},[a("el-input",{ref:"CalendarUrlInput",attrs:{value:e.staffCalendarURL,readonly:!0}},[a("el-button",{attrs:{slot:"append"},on:{click:e.copyCalendarUrl},slot:"append"},[e._v("複製此網址")])],1),a("p",{staticStyle:{"margin-top":"50px"}},[e._v("行事曆設定教學")]),a("div",{staticStyle:{"margin-bottom":"15px"}},[a("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary",plain:""},on:{click:function(t){return e.openExternal("https://support.apple.com/zh-tw/guide/iphone/iph3d1110d4/ios")}}},[e._v("設定於 Apple 行事曆")])],1),a("div",[a("el-button",{staticStyle:{width:"100%"},attrs:{type:"primary",plain:""},on:{click:function(t){return e.openExternal("https://support.google.com/calendar/answer/37100?co=GENIE.Platform%3DDesktop&hl=zh-Hant")}}},[e._v("設定於 Google 行事曆")])],1)],1)],1)},i=[],o=a("9395"),l=a("4d77"),s=a("fe2d"),r=a("a315"),c={page:{title:"行事曆",meta:[{name:"description",content:"Booking List"}]},components:{Layout:s["a"],Week:function(){return Object(r["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-3f4a3bbc"),a.e("chunk-74a31df9"),a.e("chunk-25a148c0")]).then(a.bind(null,"5aa3")))},Day:function(){return Object(r["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-3f4a3bbc"),a.e("chunk-74a31df9"),a.e("chunk-25a148c0")]).then(a.bind(null,"5aa3")))},Schedule:function(){return Object(r["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-3f4a3bbc"),a.e("chunk-74a31df9"),a.e("chunk-9f5b6ec2")]).then(a.bind(null,"9ebf")))}},data:function(){return{activeTab:"Day",previousTab:"",dialogCalendarVisible:!1}},watch:{activeTab:function(e,t){this.previousTab=t}},computed:Object(o["a"])({},l["b"],{staffCalendarURL:function(){return"".concat(window.location.origin,"/api/").concat(this.currentUser.merchantAlias,"/schedule/item/").concat(this.currentUser.scheduleItemId,"/ical")},isForward:function(){switch(this.activeTab){case"Week":return!0;case"Day":if("Week"===this.previousTab)return!1;if("Schedule"===this.previousTab)return!0;break;case"Schedule":return!1}return!0},keyName:function(){var e="Tab-".concat(this.activeTab,"--").concat(Math.floor(5e3*Math.random()));return e}}),methods:{copyCalendarUrl:function(){this.$refs.CalendarUrlInput.select(),document.execCommand("copy"),this.$message("連結複製成功")},openExternal:function(e){window.open(e,"_blank")}}},u=c,d=a("372c"),p=a("2877");function m(e){this["$style"]=d["default"].locals||d["default"]}var f=Object(p["a"])(u,n,i,!1,m,null,null);t["default"]=f.exports},"2d66":function(e,t,a){e.exports=a.p+"img/logo-dark.9cbb0fa3.svg"},"372c":function(e,t,a){"use strict";var n=a("1407"),i=a.n(n);t["default"]=i.a},"86ec":function(e,t,a){"use strict";var n=a("a616"),i=a.n(n);t["default"]=i.a},a616:function(e,t,a){e.exports={slide:"mainEmployee_slide_3QDGL","slide-reverse":"mainEmployee_slide-reverse_38YAk",main:"mainEmployee_main_1vaV9",header:"mainEmployee_header_2-f-F",action:"mainEmployee_action_3lBV-",sidebar:"mainEmployee_sidebar_16CVv",menu:"mainEmployee_menu_1d3Id",menu__item:"mainEmployee_menu__item_N0GDd",menu__link:"mainEmployee_menu__link_1aplz",content:"mainEmployee_content_2x5Hj","wrapper--collapsed":"mainEmployee_wrapper--collapsed_3BWY-",logo:"mainEmployee_logo_1JifW"}},fe2d:function(e,t,a){"use strict";var n=function(){var e,t=this,n=t.$createElement,i=t._self._c||n;return i("div",{class:[t.$style.wrapper,(e={},e[t.$style["wrapper--collapsed"]]=!t.collapsed,e)]},[i("el-header",{class:t.$style.header},[i("div",[i("div",{class:t.$style.logo},[i("img",{attrs:{src:a("2d66"),alt:""}})]),i("el-dropdown",{class:t.$style.action,attrs:{trigger:"click"},on:{command:t.onClickDropdown}},[i("span",[t._v("\n          "+t._s(t.currentUserName)+"\n          "),i("BaseIcon",{attrs:{name:"angle-down"}})],1),i("el-dropdown-menu",{class:t.$style["action-menu"],attrs:{slot:"dropdown"},slot:"dropdown"},[i("el-dropdown-item",{attrs:{command:"logout"}},[t._v("\n            登出\n            "),i("BaseIcon",{attrs:{name:"sign-out"}})],1)],1)],1)],1),i("el-menu",{attrs:{"default-active":t.$route.name,mode:"horizontal",router:!0}},t._l(t.userMenuList,function(e,a){return i("el-menu-item",{key:"menu-"+a,attrs:{index:e.name}},[i("BaseIcon",{attrs:{"icon-style":"fal",name:e.icon}}),t._v(t._s(e.title))],1)}),1),i("div",{staticStyle:{"text-align":"right","padding-right":"10px"},on:{click:t.onRemoveAllDeliveredNotifications}},[i("router-link",{attrs:{to:{name:"employee-notification"}}},[i("span",{staticClass:"d-none d-sm-block bell",class:{isActive:t.isUnread}},[i("el-button",{staticClass:"top-link",attrs:{type:"text"}},[t._v("\n          推播中心\n          "),i("BaseIcon",{attrs:{name:"bell"}})],1)],1),i("span",{staticClass:"d-sm-none bell bell--icon",class:{isActive:t.isUnread},staticStyle:{cursor:"pointer"}},[i("i",{staticClass:"fal fa-bell fa-lg"})])])],1)],1),i("el-main",{ref:"main",class:[t.$style.main,{"no-top":t.isNoTop}]},[t._t("default")],2)],1)},i=[],o=a("9395"),l=a("4d77"),s=(a("daf4"),[{name:"employee-booking",title:"預約列表",description:"預約列表",icon:"clipboard-list"},{name:"employee-calendar",title:"行事曆",description:"行事曆",icon:"calendar"},{name:"employee-staff",title:"我的帳戶",description:"我的帳戶",icon:"users-class"}]),r=a("2f62"),c=a("6ac3"),u={props:{isNoTop:{type:Boolean,default:!1}},data:function(){return{current:["home"],collapsed:!0,menus:[]}},computed:Object(o["a"])({},l["b"],Object(r["d"])("push",["isUnread","isFirst"]),{userMenuList:function(){return s},currentUserName:function(){return this.currentUser&&"".concat(this.currentUser.firstName," ").concat(this.currentUser.lastName)}}),created:function(){window.addEventListener("resize",this.getHeight),this.isFirst&&"employee-notification"!==this.$route.name&&this.fetchPushes({type:null,nextCursorRequest:null})},mounted:function(){this.getHeight()},methods:Object(o["a"])({},Object(r["b"])("push",["fetchPushes","clearUnRead"]),{toggle:function(){this.collapsed=!this.collapsed},onClickDropdown:function(e){this.$router.push({name:e})},getHeight:function(){var e=this,t=window.innerHeight,a=window.innerWidth;this.$nextTick(function(){e.$refs.main.$el.style.height=a<481?"".concat(t,"px"):"auto"})},onRemoveAllDeliveredNotifications:function(){this.clearUnRead(),c["a"].removeAllDeliveredNotifications()},goToNotification:function(){this.clearUnRead(),this.$router.push({name:"employee-notification"})}})},d=u,p=a("86ec"),m=a("2877");function f(e){this["$style"]=p["default"].locals||p["default"]}var h=Object(m["a"])(d,n,i,!1,f,null,null);t["a"]=h.exports}}]);
//# sourceMappingURL=chunk-0adbc6a9.4ec6357a.js.map