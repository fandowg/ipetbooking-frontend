(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-c666bcee"],{2522:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("el-card",{staticClass:"box-card",attrs:{shadow:"never"}},[r("div",{staticClass:"header",attrs:{slot:"header"},slot:"header"},[r("h3",{staticClass:"block-title"},[t._v("\n      近七日熱門預約服務項目排行\n    ")]),r("div",{class:t.$style.headerRight},[[r("span",[r("el-button",{staticClass:"is-round",attrs:{type:"primary",plain:""},on:{click:function(e){return t.redirectPriceList("")}}},[r("BaseIcon",{attrs:{name:"th"}}),t._v(" 檢視所有服務項目\n          ")],1)],1),r("span",[r("el-button",{staticClass:"is-round",attrs:{type:"primary"},on:{click:function(e){return t.redirectPriceList("",!0)}}},[r("BaseIcon",{attrs:{name:"plus"}}),t._v(" 新增服務項目\n          ")],1)],1)]],2)]),r("span",[t._v("篩選： ")]),r("el-radio-group",{class:t.$style["sort-group"],on:{change:t.tryToFetchRanking},model:{value:t.filterProduct,callback:function(e){t.filterProduct=e},expression:"filterProduct"}},[r("el-radio-button",{attrs:{label:""}},[t._v("所有")]),t._l(t.filterProducts,function(e,n){return r("el-radio-button",{key:"filter-"+n,attrs:{label:e.id}},[t._v(t._s(e.title))])})],2),r("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],attrs:{"element-loading-text":"取得排行資訊中",data:t.list}},[r("el-table-column",{attrs:{label:"#",index:t.indexMethod,type:"index",width:"50"}}),r("el-table-column",{attrs:{label:"預約項目",prop:"title","min-width":"300"}}),r("el-table-column",{attrs:{label:"訂單數量",width:"190",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.row;return[r("div",[r("BaseIcon",{attrs:{name:"clipboard-list"}}),t._v(" "+t._s(n.orderCount))],1)]}}])}),r("el-table-column",{attrs:{width:"40"}})],1)],1)},a=[],i=r("4795"),o=r.n(i),s=r("cb0c"),l={data:function(){return{loading:!1,filterProduct:"",list:[],filterProducts:[]}},created:function(){this.tryToFetchRanking()},methods:{tryToFetchRanking:function(){var t=Object(s["a"])(o.a.mark(function t(){var e,r,n,a,i=arguments;return o.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=i.length>0&&void 0!==i[0]?i[0]:"",this.loading=!0,t.next=4,this.$store.dispatch("dashboard/fetchRanking",{productId:e});case 4:r=t.sent,n=r.filter,a=r.ranking,this.list=a,this.filterProducts=n,this.loading=!1;case 10:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),redirectPriceList:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:void 0;this.$router.push({name:"service",params:{priceInfo:t||void 0,createPrice:e}})},indexMethod:function(t){return"#"+(t+1)}}},c=l,d=r("a321"),u=r("2877");function h(t){this["$style"]=d["default"].locals||d["default"]}var f=Object(u["a"])(c,n,a,!1,h,null,null);e["default"]=f.exports},a321:function(t,e,r){"use strict";var n=r("af3b"),a=r.n(n);e["default"]=a.a},af3b:function(t,e,r){t.exports={slide:"BookingBlock_slide_k5At2","slide-reverse":"BookingBlock_slide-reverse_1PBXm","flex-center":"BookingBlock_flex-center_10fwf","sort-group":"BookingBlock_sort-group_28DYO",headerRight:"BookingBlock_headerRight_3717r"}}}]);
//# sourceMappingURL=chunk-c666bcee.025b60f4.js.map