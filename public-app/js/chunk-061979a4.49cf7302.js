(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-061979a4"],{"115b":function(t,e,a){t.exports={slide:"TabSellByPrepaid_slide_3MfsB","slide-reverse":"TabSellByPrepaid_slide-reverse_2XD0w",bottomInfo:"TabSellByPrepaid_bottomInfo_39iXm"}},3513:function(t,e,a){"use strict";var i=a("115b"),n=a.n(i);e["default"]=n.a},"466c":function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"btn-top-space-between",staticStyle:{"justify-content":"space-between"}},[a("div",[a("el-date-picker",{staticStyle:{width:"405px"},attrs:{type:"daterange",align:"left","unlink-panels":"","range-separator":"-","start-placeholder":"起始日期","end-placeholder":"結束日期","picker-options":t.pickerOptions,clearable:!1},on:{change:t.tryToFetchList},model:{value:t.filterDateRange,callback:function(e){t.filterDateRange=e},expression:"filterDateRange"}}),a("el-button",{staticClass:"is-round",class:{isActive:"day"===t.dateNow},staticStyle:{"margin-left":"10px"},on:{click:function(e){return t.quickSelectTime("day")}}},[t._v("\n        今日\n      ")]),a("el-button",{staticClass:"is-round",class:{isActive:"month"===t.dateNow},on:{click:function(e){return t.quickSelectTime("month")}}},[t._v("\n        最近一個月\n      ")])],1),a("el-button",{staticClass:"is-round",attrs:{plain:""},on:{click:t.handleExport}},[a("BaseIcon",{attrs:{name:"file-export"}}),t._v(" 數據匯出")],1)],1),a("BaseTableSearch",{staticClass:"isForTab",attrs:{"default-value":t.filterData,"hide-action":""},on:{"update:defaultValue":function(e){t.filterData=e},"update:default-value":function(e){t.filterData=e},reset:t.reset,handleExport:t.handleExport,tryToFetchList:t.tryToFetchList},scopedSlots:t._u([{key:"default",fn:function(e){var i=e.fields;return[a("el-form-item",{attrs:{prop:"status"}},[a("el-select",{attrs:{placeholder:"分店"},on:{change:t.tryToFetchList},model:{value:i.productId,callback:function(e){t.$set(i,"productId",e)},expression:"fields.productId"}},[a("el-option",{attrs:{label:"全部分店",value:""}}),t._l(t.merchantProducts,function(t,e){return a("el-option",{key:e,attrs:{label:t.name,value:t.id}})})],2)],1)]}}])}),a("div",{staticClass:"right-radio",staticStyle:{"padding-top":"30px"}},[a("div",{staticClass:"right-radio"},[a("el-radio-group",{on:{change:t.tryToFetchListUnit},model:{value:t.filterData.unit,callback:function(e){t.$set(t.filterData,"unit",e)},expression:"filterData.unit"}},[a("el-radio-button",{attrs:{label:"day",disabled:"year"===t.dateRangeMode||"month"===t.dateRangeMode}},[t._v("日")]),a("el-radio-button",{attrs:{label:"week",disabled:"year"===t.dateRangeMode||"day"===t.dateRangeMode}},[t._v("週")]),a("el-radio-button",{attrs:{label:"month",disabled:"week"===t.dateRangeMode||"day"===t.dateRangeMode}},[t._v("月")]),a("el-radio-button",{attrs:{label:"quarter",disabled:"year"!==t.dateRangeMode&&""!==t.dateRangeMode}},[t._v("季")]),a("el-radio-button",{attrs:{label:"year",disabled:"year"!==t.dateRangeMode&&""!==t.dateRangeMode}},[t._v("年")])],1)],1),a("el-radio-group",{staticStyle:{"margin-left":"30px"},model:{value:t.showMode,callback:function(e){t.showMode=e},expression:"showMode"}},[a("el-radio-button",{attrs:{label:"total"}},[t._v("顯示金額")]),a("el-radio-button",{attrs:{label:"orders"}},[t._v("顯示數量")])],1)],1),t.sales[t.activeDate]?a("div",["filterSeason"!==t.filterData.unit&&"filterYear"!==t.filterData.unit?a("div",{staticClass:"timeSelect"},[a("div",{staticClass:"timeSelect__arrow",class:{disabled:t.activeDate===t.dateGroup[0]},on:{click:function(e){return t.changeGroup(!1)}}},[a("BaseIcon",{attrs:{name:"angle-left"}})],1),a("div",{staticClass:"timeSelect__item isActive"},[t._v("\n        "+t._s(t.activeDate)+"\n      ")]),a("div",{staticClass:"timeSelect__arrow",class:{disabled:t.activeDate===t.dateGroup[t.dateGroup.length-1]},on:{click:function(e){return t.changeGroup(!0)}}},[a("BaseIcon",{attrs:{name:"angle-right"}})],1)]):t._e()]):t._e(),t.sales[t.activeDate]?a("div",[t.sales[t.activeDate].length>0?a("div",{staticClass:"el-table-wrapper"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.tryingFetchTime,expression:"tryingFetchTime"}],attrs:{"element-loading-text":"取得資訊中",data:t.sales[t.activeDate],"summary-method":t.getSummaries,"show-summary":t.showSum}},[a("el-table-column",{attrs:{label:"方案名稱","min-width":"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.row.title)+" \n            ")]}}],null,!1,1756198031)}),t._l(t.sales[t.activeDate][0].items,function(e,i){return a("el-table-column",{key:i,attrs:{label:t.deleteYear(e.date),"min-width":"110",align:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return["total"===t.showMode?a("span",[t._v("$")]):t._e(),t._v(t._s(e.row.items[i][t.showMode])+" ")]}}],null,!0)})})],2),a("BasePagination",{ref:"pagination",attrs:{"current-page":t.currentPage},on:{"update:currentPage":function(e){t.currentPage=e},"update:current-page":function(e){t.currentPage=e}}})],1):a("div",[a("el-alert",{staticClass:"flex-center",attrs:{title:"所選擇的條件與時間內沒有相關數據",type:"warning"}})],1)]):t._e()],1)},n=[],r=a("9395"),s=a("4795"),c=a.n(s),o=a("cb0c"),l=a("9161"),u=a("b127"),d=(a("a315"),a("1b80")),h=a("6bea"),f={page:{title:"銷售",meta:[{name:"description",content:"Customer Analytics"}]},components:{},mixins:[d["c"]],props:{merchantProducts:{type:Array,required:!0}},data:function(){return{filterData:{startDate:"",endDate:"",unit:"week",productId:"",type:"prepaid",petCategoryId:"",petSizeId:""},categoryList:[],pickerOptions:{shortcuts:[{text:"今日",onClick:function(t){var e=new Date,a=new Date;t.$emit("pick",[a,e])}},{text:"過去7日",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-6048e5),t.$emit("pick",[a,e])}},{text:"最近一個月",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-2592e6),t.$emit("pick",[a,e])}},{text:"最近一年",onClick:function(t){var e=new Date,a=new Date;a.setTime(a.getTime()-31536e6),t.$emit("pick",[a,e])}}]},sales:{},dateGroup:[],activeDate:"",activeDateIndex:0,dateRangeMode:"month",dateNow:"",activeCellData:"",showMode:"total",pageNum:0,tryingFetch:!1,tryingFetchTime:!1,showSum:!0,tryingToExport:!1}},computed:{activeSizeList:function(){var t=this;return this.categoryList.find(function(e){return e.id===t.filterData.petCategoryId})},filterDateRange:{get:function(){return[this.filterData.startDate,this.filterData.endDate]},set:function(t){var e=t||["",""],a=Object(u["a"])(e,2),i=a[0],n=a[1];this.filterData.startDate=i,this.filterData.endDate=n}},fetchDataParams:function(){var t=this.$route.query,e=Object.assign(t,this.pageQuery),a=this.filterData,i=a.startDate,n=a.endDate,r=Object(l["a"])(a,["startDate","endDate"]),s=i&&n,c=s?Object.assign(this.filterData,{startDate:Object(h["e"])(i),endDate:Object(h["e"])(n)}):r;return Object.assign(c,e)}},watch:{filterDateRange:function(t){if(void 0!==this.filterDateRange[0]){var e=(new Date(this.filterDateRange[1]).getTime()/1e3-new Date(this.filterDateRange[0]).getTime()/1e3)/86400,a=Math.floor((new Date).getTime()/1e3/86400)-new Date(this.filterDateRange[0]).getTime()/1e3/86400;switch(!0){case e>=0&&e<=7:this.dateRangeMode="day",this.filterData.unit="day";break;case e>7&&e<30:this.dateRangeMode="week",this.filterData.unit="day";break;case e>=30&&e<364:this.dateRangeMode="month",this.filterData.unit="week";break;case e>=365:this.dateRangeMode="year",this.filterData.unit="quarter";break}switch(!0){case 0===a:this.dateNow="day";break;case 30===a:this.dateNow="month";break;default:this.dateNow=""}}else this.dateRangeMode=""},showMode:function(){var t=this;this.showSum=!1,this.$nextTick(function(){t.showSum=!0})},"filterData.unit":function(){this.activeDateIndex=0,this.activeDate=this.dateGroup[this.activeDateIndex]}},created:function(){this.getDefaultDate(),this.tryToFetchList(),this.tryToFetchCategory()},methods:{getDefaultDate:function(){var t=new Date,e=new Date;e.setTime(e.getTime()-2592e6),this.filterData.startDate="".concat(e.getFullYear(),"/").concat(e.getMonth()+1,"/").concat(e.getDate()),this.filterData.endDate="".concat(t.getFullYear(),"/").concat(t.getMonth()+1,"/").concat(t.getDate())},tryToFetchCategory:function(){var t=Object(o["a"])(c.a.mark(function t(){return c.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch("product/fetchServiceCategory");case 2:this.categoryList=t.sent;case 3:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),tryToFetchList:function(){var t=Object(o["a"])(c.a.mark(function t(e){return c.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.tryingFetch=!0,this.tryingFetchTime=!0,t.next=4,this.$store.dispatch("analytics/fetchSales",this.fetchDataParams);case 4:this.sales=t.sent,this.dateGroup=Object.keys(this.sales),this.activeDateIndex=0,this.activeDate=this.dateGroup[this.activeDateIndex],this.tryingFetch=!1,this.tryingFetchTime=!1;case 10:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),tryToFetchListUnit:function(){var t=Object(o["a"])(c.a.mark(function t(){return c.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.tryingFetchTime=!0,t.next=3,this.$store.dispatch("analytics/fetchSales",this.fetchDataParams);case 3:this.sales=t.sent,this.tryingFetchTime=!1,this.dateGroup=Object.keys(this.sales),this.activeDateIndex=0,this.activeDate=this.dateGroup[this.activeDateIndex];case 8:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),changeMode:function(t){this.dateRangeMode=t},reset:function(){this.getDefaultDate(),this.dateRangeMode="month",this.filterData.unit="week",this.tryToFetchList()},selectData:function(t){this.activeCellData=t,this.changeCellClass()},deleteYear:function(t){var e=(new Date).getFullYear();if("quarter"===this.filterData.unit||"month"===this.filterData.unit)return t;var a=new RegExp("".concat(e,"-"),"g"),i=new RegExp("-","g");return t=t.replace(a,""),t=t.replace(i,"/"),t},changeGroup:function(t){t?(this.activeDateIndex++,this.activeDate=this.dateGroup[this.activeDateIndex]):(this.activeDateIndex--,this.activeDate=this.dateGroup[this.activeDateIndex])},getSummaries:function(t){var e=this,a=t.columns,i=t.data,n=[];return a.forEach(function(t,a){if(0!==a){var r=i.map(function(t){return Number(t.items[a-1][e.showMode])});r.every(function(t){return isNaN(t)})?n[a]="N/A":(n[a]=r.reduce(function(t,e){var a=Number(e);return isNaN(a)?t:t+e},0),n[a]="total"===e.showMode?"$"+n[a]:n[a])}else n[a]="加總"}),n},handleExport:function(){var t=Object(o["a"])(c.a.mark(function t(){var e,a,i,n,s,o,l,u,d,h,f,p=this;return c.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:if(!this.tryingToExport){t.next=2;break}return t.abrupt("return");case 2:return this.tryingToExport=!0,e={analyticsType:"sales",submitData:Object(r["a"])({},this.fetchDataParams,{export:1,count:"orders"===this.showMode?1:0})},t.next=6,this.$store.dispatch("analytics/analyticsExport",e);case 6:a=t.sent,i=a.fileName,n=a.csvData,s=n.map(function(t){return Object.values(t).join(",")}).join("\n"),o=new Blob(["\ufeff",s],{type:"text/csv;charset=utf-8;"}),l=window.URL.createObjectURL(o),u="".concat(this.filterDateRange[0]," 至 ").concat(this.filterDateRange[1]),d="",this.fetchDataParams.productId&&(d=this.merchantProducts.find(function(t){return t.id===p.fetchDataParams.productId}).name,d=" ".concat(d)),h="".concat(i," ( ").concat(u).concat(d," ).csv"),f=document.createElement("a"),f.download=h,f.href=l,f.click(),window.URL.revokeObjectURL(l),this.tryingToExport=!1;case 22:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),quickSelectTime:function(t){if("day"===t){var e=new Date,a=new Date;this.filterDateRange=[a,e]}if("month"===t){var i=new Date,n=new Date;n.setTime(n.getTime()-2592e6),this.filterDateRange=[n,i]}this.tryToFetchList()}}},p=f,g=a("3513"),D=a("2877");function m(t){this["$style"]=g["default"].locals||g["default"]}var v=Object(D["a"])(p,i,n,!1,m,null,null);e["default"]=v.exports},b127:function(t,e,a){"use strict";function i(t){if(Array.isArray(t))return t}function n(t,e){var a=[],i=!0,n=!1,r=void 0;try{for(var s,c=t[Symbol.iterator]();!(i=(s=c.next()).done);i=!0)if(a.push(s.value),e&&a.length===e)break}catch(o){n=!0,r=o}finally{try{i||null==c["return"]||c["return"]()}finally{if(n)throw r}}return a}function r(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function s(t,e){return i(t)||n(t,e)||r()}a.d(e,"a",function(){return s})}}]);
//# sourceMappingURL=chunk-061979a4.49cf7302.js.map