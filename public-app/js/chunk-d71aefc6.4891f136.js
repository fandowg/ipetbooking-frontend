(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-d71aefc6"],{"8b4c":function(t,e,a){"use strict";function s(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=r(t);a.scrollTo({top:n(t)-e,behavior:"smooth"})}function i(t){var e=t.scrollHeight>t.clientHeight,a=window.getComputedStyle(t).overflowY,s=["scroll","auto"].includes(a);return e&&s}function r(t){return i(t)?t:r(t.parentElement)}function n(t){var e=0;if(t.offsetParent){do{e+=t.offsetTop}while(t=t.offsetParent);return e}}a.d(e,"a",function(){return s})},ba10:function(t,e,a){"use strict";var s=a("c089"),i=a.n(s);e["default"]=i.a},bd7e:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:t.$style["create-addition"]},[a("el-form",{ref:"form",staticClass:"el-form-item--normal-margin el-form-item--white-bg",attrs:{model:t.submitData,rules:t.submitRules,"label-position":"top"}},[a("div",{staticClass:"header"},[a("div",[t._v("目前排程")]),a("div",[t._v("美容師："+t._s(t.defaultValue.scheduleItem.name))])]),a("div",{staticClass:"schedule-group-wrap"},[a("div",{staticClass:"schedule"},[a("div",[t._v("本服務(含緩衝)時間")]),a("div",{staticClass:"date"},[a("span",{staticClass:"today"},[t._v("今天")]),a("br"),a("span",{staticClass:"time Jost"},[t._v(t._s(t.defaultValue.time)+"－"),a("span",{style:"color:"+(0===t.totalMinute?"":t.differMinute>0?"#C79484":"#E35D5D")+";"},[a("span",{staticClass:"text-primary"},[t._v(t._s(t.serviceEndTime))])])])]),a("div",{staticClass:"service"},[a("span",{staticClass:"title"},[t._v(t._s(t.defaultValue.productName)+" "+t._s(t.defaultValue.params[0].title))]),a("br"),a("span",{staticClass:"size"},[t._v(t._s(t.defaultValue.params[0].introtext))])])]),a("div",{staticClass:"schedule"},[a("BaseIcon",{attrs:{name:"angle-double-right","icon-style":"fal"}}),a("div",[t._v("下個服務開始時間")]),t.hasNextOrder?[a("div",{staticClass:"date"},[a("span",{staticClass:"today"},[t._v("今天")]),a("br"),a("span",{staticClass:"time Jost"},[t._v(t._s(t._f("formatDate")(t.defaultValue.scheduleItem.nextOrder.startDate,"time")))])]),a("div",{staticClass:"service"},[a("span",{staticClass:"title"},[t._v(t._s(t.defaultValue.scheduleItem.nextOrder.productName)+" "+t._s(t.defaultValue.scheduleItem.nextOrder.priceTitle))]),a("br"),a("span",{staticClass:"size"},[t._v(t._s(t.defaultValue.scheduleItem.nextOrder.priceIntrotext))])])]:a("div",{staticClass:"date"},[a("span",{staticClass:"today vs-hide"},[t._v("今天")]),a("br"),a("span",{staticClass:"no-booking"},[t._v("暫無預約")])])],2)]),a("div",{staticClass:"alert Jost",class:{danger:t.differMinute<=0}},[t._v("本次加購時間 "),a("span",{staticClass:"text-secondary"},[t._v(t._s(t.totalMinute))]),t._v(" 分\n      "),t.hasNextOrder?a("span",[t.differMinute>0?a("span",[t._v("\n         ，空檔時間剩餘 "),a("span",{staticClass:"text-secondary"},[t._v(t._s(t.differMinute))]),t._v(" 分\n        ")]):a("span",[t._v("\n          ，已與下個預約重疊\n        ")])]):t._e()]),a("el-form-item",{attrs:{label:"選擇加購項目",prop:"addItems"}},[a("div",{class:t.$style.addItems},[a("div",{staticClass:"wrap"},t._l(t.priceList,function(e,s){return a("div",{key:s,staticClass:"item"},[a("el-checkbox-group",{model:{value:t.submitData.addItems,callback:function(e){t.$set(t.submitData,"addItems",e)},expression:"submitData.addItems"}},[a("el-checkbox",{attrs:{label:e.id,border:""}},[a("div",[a("span",{staticClass:"name"},[t._v(t._s(e.title))]),a("br"),a("span",{staticClass:"size"},[t._v(t._s(e.introtext))])]),a("div",{staticClass:"price"},[t._v("$"+t._s(e.price)+"/"+t._s(e.serviceTime)+"分")])])],1)],1)}),0),a("div",{staticClass:"total"},[a("div",[t._v("加購總計")]),a("div",[t._v("$"+t._s(t.total)+"，共 "+t._s(t.totalMinute)+" 分")])])])]),a("el-form-item",{attrs:{prop:"status",label:"訂單狀態"}},[a("el-select",{attrs:{placeholder:"訂單狀態"},on:{change:t.onStatusChange},model:{value:t.submitData.status,callback:function(e){t.$set(t.submitData,"status",e)},expression:"submitData.status"}},[t._l(t.filteredStatusMap,function(e,s){return[[1,2].includes(+s)?a("el-option",{key:s,attrs:{value:+s,label:e.text,disabled:1===+s&&t.isHomeService&&t.isEmployee}}):t._e()]})],2)],1),a("el-form-item",{attrs:{label:"付款方式"}},[t.total>0?a("el-radio-group",{staticClass:"hidden-mobile",class:t.$style["payment-methods"],model:{value:t.submitData.paymentMethod,callback:function(e){t.$set(t.submitData,"paymentMethod",e)},expression:"submitData.paymentMethod"}},[2!==t.submitData.status||t.isEmployee&&t.isHomeService?t._e():a("el-radio",{attrs:{label:"",border:""}},[t._v("不指定")]),t.isEmployee||t.isHomeService?t._e():[a("el-radio",{attrs:{label:"Cash",border:""}},[t._v("到店付款(現金)")]),a("el-radio",{attrs:{label:"StoreCredit",border:""}},[t._v("現場刷卡")])],a("el-radio",{attrs:{label:"Atm",border:""}},[t._v("線下匯款")]),2===t.submitData.status&&1===t.storeCashflowSetting?a("el-radio",{attrs:{label:"Credit",border:""}},[t._v("信用卡付款")]):t._e(),2===t.submitData.status&&0!==t.storeCashflowSetting?a("el-radio",{attrs:{label:"Vacc",border:""}},[t._v("ATM虛擬帳戶")]):t._e()],2):t._e(),t.total>0?a("el-select",{staticClass:"visible-mobile",model:{value:t.submitData.paymentMethod,callback:function(e){t.$set(t.submitData,"paymentMethod",e)},expression:"submitData.paymentMethod"}},[2!==t.submitData.status||t.isEmployee&&t.isHomeService?t._e():a("el-option",{attrs:{value:"",label:"不指定"}}),t.isEmployee||t.isHomeService?t._e():[a("el-option",{attrs:{value:"Cash",label:"到店付款(現金)"}}),a("el-option",{attrs:{value:"StoreCredit",label:"現場刷卡"}})],a("el-option",{attrs:{value:"Atm",label:"線下匯款"}}),2===t.submitData.status&&1===t.storeCashflowSetting?a("el-option",{attrs:{value:"Credit",label:"信用卡付款"}}):t._e(),2===t.submitData.status&&0!==t.storeCashflowSetting?a("el-option",{attrs:{value:"Vacc",label:"ATM虛擬帳戶"}}):t._e()],2):a("el-alert",{attrs:{title:"請先選擇加購項目",type:"warning",closable:!1}})],1),"Vacc"===t.submitData.paymentMethod?a("el-form-item",{attrs:{prop:"bankType",label:"轉帳銀行"}},[a("el-select",{model:{value:t.submitData.bankType,callback:function(e){t.$set(t.submitData,"bankType",e)},expression:"submitData.bankType"}},t._l(t.bankTypeList,function(t,e){return a("el-option",{key:"bank-"+e,attrs:{value:t.id,label:t.title}})}),1)],1):t._e()],1),a("el-row",{staticClass:"footer",staticStyle:{"margin-top":"40px"},attrs:{gutter:20}},[a("el-col",{attrs:{span:12,xs:24}},[a("el-button",{staticClass:"is-round is-fullwidth",on:{click:function(e){return t.$emit("close")}}},[t._v("取消加購")])],1),a("el-col",{attrs:{span:12,xs:24}},[a("el-button",{staticClass:"is-round is-fullwidth",attrs:{loading:t.tryingToCreteOrder,type:"primary"},on:{click:t.createOrder}},[t._v("確定加購")])],1)],1)],1)},i=[],r=a("4795"),n=a.n(r),l=a("cb0c"),o=a("9395"),u=a("7e02"),d=a("6bea"),c=a("340b"),m=a("8b4c"),f=a("4d77"),p={components:{},filters:{orderStatusMap:u["p"],formatDate:d["a"]},props:{defaultValue:{type:Object,default:function(){}}},data:function(){return{submitData:{status:2,paymentMethod:"",addItems:[]},priceList:[],tryingToCreteOrder:!1,bankTypeList:[{id:"BOT",title:"台灣銀行"},{id:"Taishin",title:"台新"},{id:"HNCB",title:"華南"}]}},created:function(){this.tryToFetchPrice(),this.isEmployee&&this.isHomeService&&(this.submitData.paymentMethod="Credit")},mounted:function(){this.$emit("scrollToTop")},computed:Object(o["a"])({},f["b"],{submitRules:function(){return{bankType:[{required:this.isRequiredBankType,message:"請選擇轉帳銀行"}],addItems:[{required:!0,message:"請選擇服務項目"}]}},hasNextOrder:function(){return null!==this.defaultValue.scheduleItem.nextOrder},filteredStatusMap:function(){var t=this,e=Object.keys(u["p"]).filter(function(e){switch(t.defaultValue.status){case 1:return+e<2;case 2:return(1!==+e||"Vacc"!==t.defaultValue.paymentMethod)&&+e<=2;case 3:return 0===+e||3===+e;case 4:return 4===+e;case 5:return 0===+e||5===+e;case 6:return 6===+e;default:return!1}}).reduce(function(t,e){return t[e]=u["p"][e],t},{});return this.isEditMode?e:u["p"]},serviceEndTime:function(){return Object(d["a"])(Object(c["addMinutes"])(this.defaultValue.endDate,this.totalMinute),"time")},differMinute:function(){if(!this.hasNextOrder)return 1e4;var t=this.defaultValue.endDate,e=this.defaultValue.scheduleItem.nextOrder.startDate,a=Object(c["differenceInMinutes"])(e,t);return a-this.totalMinute},selectedItem:function(){var t=this;return this.priceList.filter(function(e){return t.submitData.addItems.includes(e.id)})},total:function(){return this.selectedItem.reduce(function(t,e){return t+e.price},0)},totalMinute:function(){return this.selectedItem.reduce(function(t,e){return t+e.serviceTime},0)},filterSubmitData:function(){var t=this,e=this.submitData,a=e.status,s=e.paymentMethod,i=e.bankType,r=this.selectedItem.map(function(e){return{id:"",addId:e.id,status:t.submitData.status}});return{addItems:r,orderId:this.defaultValue.id,total:this.total,status:a,paymentMethod:s,bankType:i}},isHomeService:function(){return"home"===this.defaultValue.storeType},isEmployee:function(){return!!this.currentUser.scheduleItemId},showVacc:function(){var t=new Date(Object(d["a"])(new Date(this.defaultValue.date))),e=new Date(Object(d["a"])(new Date));return Object(c["differenceInDays"])(t,e)>1},isRequiredBankType:function(){return"Vacc"===this.submitData.paymentMethod},storeCashflowSetting:function(){return this.defaultValue.storeCashflowSetting}}),methods:{tryToFetchPrice:function(){var t=Object(l["a"])(n.a.mark(function t(){var e,a,s=this;return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch("product/fetchAdditionalPrices",{state:1,order_by:"groupOrdering",productId:this.defaultValue.productId,introtext:this.defaultValue.params[0].introtext,limit:1e4});case 2:e=t.sent,a=e.items,this.priceList=a.filter(function(t){return t.categoryIds[0]===s.defaultValue.sizeId});case 5:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),onStatusChange:function(t){this.isEditMode||1!==t||(this.submitData.paymentMethod="Cash")},createOrder:function(){var t=this;this.$refs.form.validate(function(e){e?t.tryToCreateOrder():t.$nextTick(function(){Object(m["a"])(t.$refs.form.$el.querySelector(".el-form-item__error"),182)})})},tryToCreateOrder:function(){var t=Object(l["a"])(n.a.mark(function t(){return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.tryingToCreteOrder=!0,t.next=3,this.$store.dispatch("order/storeAdditionalOrder",this.filterSubmitData);case 3:this.tryingToCreteOrder=!1,this.$emit("update");case 5:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}()}},h=p,b=a("ba10"),v=a("2877");function _(t){this["$style"]=b["default"].locals||b["default"]}var y=Object(v["a"])(h,s,i,!1,_,null,null);e["default"]=y.exports},c089:function(t,e,a){t.exports={slide:"AdditionForm_slide_1C7l-","slide-reverse":"AdditionForm_slide-reverse_2xkiV","create-addition":"AdditionForm_create-addition_3Brwd",addItems:"AdditionForm_addItems_20PZD","payment-methods":"AdditionForm_payment-methods_2jAH-"}}}]);
//# sourceMappingURL=chunk-d71aefc6.4891f136.js.map