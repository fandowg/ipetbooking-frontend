(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5016736a"],{"99a4":function(t,e,a){t.exports={slide:"TabIncome_slide_rFC7q","slide-reverse":"TabIncome_slide-reverse_11lwz",bottomInfo:"TabIncome_bottomInfo_1SQDT"}},a0cd6:function(t,e,a){"use strict";var i=a("99a4"),n=a.n(i);e["default"]=n.a},b127:function(t,e,a){"use strict";function i(t){if(Array.isArray(t))return t}function n(t,e){var a=[],i=!0,n=!1,s=void 0;try{for(var c,o=t[Symbol.iterator]();!(i=(c=o.next()).done);i=!0)if(a.push(c.value),e&&a.length===e)break}catch(r){n=!0,s=r}finally{try{i||null==o["return"]||o["return"]()}finally{if(n)throw s}}return a}function s(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function c(t,e){return i(t)||n(t,e)||s()}a.d(e,"a",function(){return c})},fee5:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"btn-top-space-between",staticStyle:{"justify-content":"space-between"}},[a("div",[a("el-date-picker",{staticStyle:{width:"405px"},attrs:{type:"daterange",align:"left","unlink-panels":"","range-separator":"-","start-placeholder":"起始日期","end-placeholder":"結束日期","picker-options":t.pickerOptions,clearable:!1},on:{change:t.tryToFetchList},model:{value:t.filterDateRange,callback:function(e){t.filterDateRange=e},expression:"filterDateRange"}}),a("el-button",{staticClass:"is-round",class:{isActive:"day"===t.dateNow},staticStyle:{"margin-left":"10px"},on:{click:function(e){return t.quickSelectTime("day")}}},[t._v("\n          今日\n        ")]),a("el-button",{staticClass:"is-round",class:{isActive:"month"===t.dateNow},on:{click:function(e){return t.quickSelectTime("month")}}},[t._v("\n          最近一個月\n        ")])],1),a("el-button",{staticClass:"is-round",attrs:{plain:""},on:{click:t.handleExport}},[a("BaseIcon",{attrs:{name:"file-export"}}),t._v(" 數據匯出")],1)],1),a("BaseTableSearch",{staticClass:"isForTab",attrs:{"default-value":t.filterData,"hide-action":""},on:{"update:defaultValue":function(e){t.filterData=e},"update:default-value":function(e){t.filterData=e},reset:t.reset,handleExport:t.handleExport,tryToFetchList:t.tryToFetchList},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.fields;return[a("el-form-item",{attrs:{prop:"status"}},[a("el-select",{attrs:{placeholder:"分店"},on:{change:t.tryToFetchList},model:{value:i.productId,callback:function(e){t.$set(i,"productId",e)},expression:"fields.productId"}},[a("el-option",{attrs:{label:"全部分店",value:""}}),t._l(t.merchantProducts,function(t,e){return a("el-option",{key:e,attrs:{label:t.name,value:t.id}})})],2)],1)]}}])}),a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.tryingFetch,expression:"tryingFetch"}],staticClass:"infoBox"},[a("div",{staticClass:"infoBox__item",class:{isActive:"銷售總額"===t.activeCellData},on:{click:function(e){return t.selectData("銷售總額")}}},[a("div",{staticClass:"infoBox__title"},[t._v(" 銷售總額 ")]),a("div",{staticClass:"infoBox__content"},[t._v(" $"+t._s(t.income.salesFigures)+" ")])]),a("div",{staticClass:"infoBox__item",class:{isActive:"退款"===t.activeCellData},on:{click:function(e){return t.selectData("退款")}}},[a("div",{staticClass:"infoBox__title"},[t._v(" 退款 ")]),a("div",{staticClass:"infoBox__content"},[t._v(" $"+t._s(t.income.refundTotal)+" ")])]),a("div",{staticClass:"infoBox__item",class:{isActive:"優惠券"===t.activeCellData},on:{click:function(e){return t.selectData("優惠券")}}},[a("div",{staticClass:"infoBox__title"},[t._v(" 優惠券 ")]),a("div",{staticClass:"infoBox__content"},[t._v(" $"+t._s(t.income.couponTotal)+" ")])]),a("div",{staticClass:"infoBox__item",class:{isActive:"銷售淨額"===t.activeCellData},on:{click:function(e){return t.selectData("銷售淨額")}}},[a("div",{staticClass:"infoBox__title"},[t._v(" 銷售淨額 ")]),a("div",{staticClass:"infoBox__content"},[t._v(" $"+t._s(t.income.netSales)+" ")])]),a("div",{staticClass:"infoBox__item",class:{isActive:"稅金"===t.activeCellData},on:{click:function(e){return t.selectData("稅金")}}},[a("div",{staticClass:"infoBox__title"},[t._v(" 稅金 ")]),a("div",{staticClass:"infoBox__content"},[t._v(" $"+t._s(t.income.taxTotal)+" ")])]),a("div",{staticClass:"infoBox__item",class:{isActive:"稅後淨額"===t.activeCellData},on:{click:function(e){return t.selectData("稅後淨額")}}},[a("div",{staticClass:"infoBox__title"},[t._v(" 稅後淨額 ")]),a("div",{staticClass:"infoBox__content"},[t._v(" $"+t._s(t.income.niat)+" ")])]),a("div",{staticClass:"infoBox__item",class:{isActive:"平均訂單銷售淨額"===t.activeCellData},on:{click:function(e){return t.selectData("平均訂單銷售淨額")}}},[a("div",{staticClass:"infoBox__title"},[t._v("\n          平均訂單銷售淨額 "),a("el-tooltip",{attrs:{content:"平均訂單銷售淨額 = 銷售淨額 / 訂單數",placement:"right"}},[a("BaseIcon",{attrs:{name:"info-circle"}})],1)],1),a("div",{staticClass:"infoBox__content"},[t._v(" $"+t._s(t.income.avgOrderPrice)+" ")])]),a("div",{staticClass:"infoBox__item",class:{isActive:"訂單數"===t.activeCellData},on:{click:function(e){return t.selectData("訂單數")}}},[a("div",{staticClass:"infoBox__title"},[t._v(" 平均訂單數 ")]),a("div",{staticClass:"infoBox__content"},[t._v("\n          "+t._s(t.income.avgOrderCount)+"\n        ")])])]),a("div",{staticClass:"right-radio"},[a("el-radio-group",{on:{change:t.tryToFetchListUnit},model:{value:t.filterData.unit,callback:function(e){t.$set(t.filterData,"unit",e)},expression:"filterData.unit"}},[a("el-radio-button",{attrs:{label:"day",disabled:"year"===t.dateRangeMode||"month"===t.dateRangeMode}},[t._v("日")]),a("el-radio-button",{attrs:{label:"week",disabled:"year"===t.dateRangeMode||"day"===t.dateRangeMode}},[t._v("週")]),a("el-radio-button",{attrs:{label:"month",disabled:"week"===t.dateRangeMode||"day"===t.dateRangeMode}},[t._v("月")]),a("el-radio-button",{attrs:{label:"quarter",disabled:"year"!==t.dateRangeMode&&""!==t.dateRangeMode}},[t._v("季")]),a("el-radio-button",{attrs:{label:"year",disabled:"year"!==t.dateRangeMode&&""!==t.dateRangeMode}},[t._v("年")])],1)],1),a("div",{staticClass:"el-table-wrapper"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.tryingFetchTime,expression:"tryingFetchTime"}],attrs:{"show-summary":"","sum-text":"總計","element-loading-text":"取得資訊中",data:t.income.table,"cell-class-name":t.changeCellClass,"header-cell-class-name":t.changeCellClass}},[a("el-table-column",{attrs:{label:"日期",prop:"date",width:"200"}}),a("el-table-column",{attrs:{label:"訂單數",prop:"ordersCount",align:"right","min-width":"80"}}),a("el-table-column",{attrs:{label:"銷售總額",prop:"salesFigures",align:"right","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" $"+t._s(e.row.salesFigures)+" ")]}}])},[a("template",{slot:"header"},[t._v("\n            銷售總額 "),a("el-tooltip",{attrs:{content:"計算已付款和未付款訂單的售價金額。金額含稅、不含退款＆優惠",placement:"right"}},[a("BaseIcon",{attrs:{name:"info-circle"}})],1)],1)],2),a("el-table-column",{attrs:{prop:"refundTotal",label:"退款",align:"right","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" $"+t._s(e.row.refundTotal)+" ")]}}])},[a("template",{slot:"header"},[t._v("退款")])],2),a("el-table-column",{attrs:{prop:"couponTotal",label:"優惠券",align:"right","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" $"+t._s(e.row.couponTotal)+" ")]}}])},[a("template",{slot:"header"},[t._v("優惠券")])],2),a("el-table-column",{attrs:{prop:"netSales",label:"銷售淨額",align:"right","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" $"+t._s(e.row.netSales)+" ")]}}])},[a("template",{slot:"header"},[t._v("\n            銷售淨額\n            "),a("el-tooltip",{attrs:{content:"扣掉退款、優惠後，即是現在訂單列表上的總金額。\n銷售淨額 = 銷售總額 - 退款 - 優惠券金額",placement:"right"}},[a("BaseIcon",{attrs:{name:"info-circle"}})],1)],1)],2),a("el-table-column",{attrs:{prop:"taxTotal",label:"稅金",align:"right","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" $"+t._s(e.row.taxTotal)+" ")]}}])},[a("template",{slot:"header"},[t._v("稅金5% "),a("el-tooltip",{attrs:{content:"稅金= 銷售淨額 x 5%",placement:"right"}},[a("BaseIcon",{attrs:{name:"info-circle"}})],1)],1)],2),a("el-table-column",{attrs:{prop:"niat",label:"稅後淨額",align:"right","min-width":"100"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" $"+t._s(e.row.niat)+" ")]}}])},[a("template",{slot:"header"},[t._v("稅後淨額"),a("el-tooltip",{attrs:{content:"稅後淨額 = 銷售淨額 - 稅金",placement:"right"}},[a("BaseIcon",{attrs:{name:"info-circle"}})],1)],1)],2)],1)],1)],1)},n=[],s=a("9395"),c=a("4795"),o=a.n(c),r=a("cb0c"),l=a("9161"),u=a("b127"),d=(a("a315"),a("1b80")),f=a("6bea"),h={page:{title:"數據分析",meta:[{name:"description",content:"Customer Analytics"}]},components:{},mixins:[d["c"]],props:{merchantProducts:{type:Array,required:!0}},data:function(){return{filterData:{startDate:"",endDate:"",unit:"week",productId:""},pickerOptions:{shortcuts:[{text:"今日",onClick:function(t){var e=new Date,a=new Date;t.$emit("pick",[a,e])}},{text:"過去7日",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-6048e5),t.$emit("pick",[a,e])}},{text:"最近一個月",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-2592e6),t.$emit("pick",[a,e])}},{text:"最近一年",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-31536e6),t.$emit("pick",[a,e])}}]},income:{},dateRangeMode:"month",dateNow:"",activeCellData:"",tryingFetch:!1,tryingFetchTime:!1,tryingToExport:!1}},computed:{filterDateRange:{get:function(){return[this.filterData.startDate,this.filterData.endDate]},set:function(t){var e=t||["",""],a=Object(u["a"])(e,2),i=a[0],n=a[1];this.filterData.startDate=i,this.filterData.endDate=n}},fetchDataParams:function(){var t=this.$route.query,e=Object.assign(t,this.pageQuery),a=this.filterData,i=a.startDate,n=a.endDate,s=Object(l["a"])(a,["startDate","endDate"]),c=i&&n,o=c?Object.assign(this.filterData,{startDate:Object(f["e"])(i),endDate:Object(f["e"])(n)}):s;return Object.assign(o,e)}},watch:{filterDateRange:function(t){if(void 0!==this.filterDateRange[0]){var e=(new Date(this.filterDateRange[1]).getTime()/1e3-new Date(this.filterDateRange[0]).getTime()/1e3)/86400,a=Math.floor((new Date).getTime()/1e3/86400)-new Date(this.filterDateRange[0]).getTime()/1e3/86400;switch(!0){case e>=0&&e<=7:this.dateRangeMode="day",this.filterData.unit="day";break;case e>7&&e<30:this.dateRangeMode="week",this.filterData.unit="day";break;case e>=30&&e<364:this.dateRangeMode="month",this.filterData.unit="week";break;case e>=365:this.dateRangeMode="year",this.filterData.unit="quarter";break}switch(!0){case 0===a:this.dateNow="day";break;case 30===a:this.dateNow="month";break;default:this.dateNow=""}}else this.dateRangeMode=""}},created:function(){this.getDefaultDate(),this.tryToFetchList()},methods:{getDefaultDate:function(){var t=new Date,e=new Date;e.setTime(e.getTime()-2592e6),this.filterData.startDate="".concat(e.getFullYear(),"/").concat(e.getMonth()+1,"/").concat(e.getDate()),this.filterData.endDate="".concat(t.getFullYear(),"/").concat(t.getMonth()+1,"/").concat(t.getDate())},tryToFetchList:function(){var t=Object(r["a"])(o.a.mark(function t(e){return o.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.tryingFetch=!0,this.tryingFetchTime=!0,t.next=4,this.$store.dispatch("analytics/fetchIncome",this.fetchDataParams);case 4:this.income=t.sent,this.tryingFetch=!1,this.tryingFetchTime=!1;case 7:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),tryToFetchListUnit:function(){var t=Object(r["a"])(o.a.mark(function t(){return o.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.tryingFetchTime=!0,t.next=3,this.$store.dispatch("analytics/fetchIncome",this.fetchDataParams);case 3:this.income=t.sent,this.tryingFetchTime=!1;case 5:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),changeMode:function(t){this.dateRangeMode=t},reset:function(){this.getDefaultDate(),this.dateRangeMode="month",this.filterData.unit="week",this.tryToFetchList()},selectData:function(t){this.activeCellData=t,this.changeCellClass()},changeCellClass:function(t,e,a,i){return t.column.label===this.activeCellData?"active":""},handleExport:function(){var t=Object(r["a"])(o.a.mark(function t(){var e,a,i,n,c,r,l,u,d,f,h,m=this;return o.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!this.tryingToExport){t.next=2;break}return t.abrupt("return");case 2:return this.tryingToExport=!0,e={analyticsType:"income",submitData:Object(s["a"])({},this.fetchDataParams,{export:1})},t.next=6,this.$store.dispatch("analytics/analyticsExport",e);case 6:a=t.sent,i=a.fileName,n=a.csvData,c=n.map(function(t){return Object.values(t).join(",")}).join("\n"),r=new Blob(["\ufeff",c],{type:"text/csv;charset=utf-8;"}),l=window.URL.createObjectURL(r),u="".concat(this.filterDateRange[0]," 至 ").concat(this.filterDateRange[1]),d="",this.fetchDataParams.productId&&(d=this.merchantProducts.find(function(t){return t.id===m.fetchDataParams.productId}).name,d=" ".concat(d)),f="".concat(i," ( ").concat(u).concat(d," ).csv"),h=document.createElement("a"),h.download=f,h.href=l,h.click(),window.URL.revokeObjectURL(l),this.tryingToExport=!1;case 22:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),quickSelectTime:function(t){if("day"===t){var e=new Date,a=new Date;this.filterDateRange=[a,e]}if("month"===t){var i=new Date,n=new Date;n.setTime(n.getTime()-2592e6),this.filterDateRange=[n,i]}this.tryToFetchList()}}},m=h,v=a("a0cd6"),p=a("2877");function g(t){this["$style"]=v["default"].locals||v["default"]}var _=Object(p["a"])(m,i,n,!1,g,null,null);e["default"]=_.exports}}]);
//# sourceMappingURL=chunk-5016736a.9e254a5a.js.map