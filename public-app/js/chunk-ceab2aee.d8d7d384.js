(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ceab2aee"],{"6f10":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{class:t.$style.addition},[0===t.defaultValue.addOrders.length?a("div",{staticStyle:{"margin-bottom":"50px"}},[t._v("目前無加購訂單")]):t._e(),t._l(t.defaultValue.addOrders,function(e,s){return a("div",{key:s,staticClass:"sub-order"},[a("div",{staticClass:"order-id Jost"},[t._v("#"+t._s(e.id))]),a("div",{class:t.$style.params},[a("div",{class:t.$style["params__item"]},[a("div",[t._v("加購項目")]),a("div",[t._v("訂單狀態")]),a("div",[t._v("金額")])]),t._l(e.addItems,function(e,s){return a("div",{key:s,class:t.$style["params__item"]},[a("div",[t._v(t._s(e.title))]),a("div",{staticClass:"Jost"},[a("BaseStateLabel",{attrs:{state:t._f("orderStatusFilter")(e.status,"color"),text:""}},[t._v(t._s(t._f("orderStatusFilter")(e.status,"text")))])],1),a("div",{staticClass:"Jost"},[t._v(t._s(e.price))])])}),a("div",{class:t.$style.total},[a("div",{class:t.$style["total__item"]},[a("div",[t._v("小計")]),a("div",{staticClass:"Jost"},[t._v(t._s(e.total))])]),t._l(e.addItems,function(s,i){return[0!==s.status||e.paidAt?t._e():a("div",{key:i,class:t.$style["params__item"]},[a("div",[t._v(t._s(s.title)+t._s(t._f("orderStatusFilter")(s.status,"text")))]),a("div",{staticClass:"Jost"})])]}),e.refundHistories.length>0?t._l(e.refundHistories,function(e,s){return a("div",{key:s,class:t.$style["total__item"]},[a("div",{staticClass:"alert-word"},[t._v(t._s(e.refundDate)+"退款")]),a("div",{staticClass:"Jost alert-word"},[t._v("-"+t._s(e.Amt))])])}):t._e()],2),a("div",{class:t.$style.total},[a("div",{class:t.$style["total__item"]},[a("div",[t._v("總計")]),e.paidAt?a("div",{staticClass:"Jost"},[t._v(t._s(e.backBalance))]):t._e(),e.paidAt||0===e.status?t._e():a("div",{staticClass:"Jost"},[t._v(t._s(e.total))]),e.paidAt||0!==e.status?t._e():a("div",{staticClass:"Jost"},[t._v(t._s(e.total))])]),0!==e.unpaidTotal?a("div",{class:[t.$style["total__item"],t.$style["total__item--discount"]]},[a("div",[t._v("未付款金額")]),a("div",{staticClass:"Jost"},[t._v(t._s(e.unpaidTotal))])]):t._e()])],2),a("BaseCollapse",{class:t.$style.payment,attrs:{title:"付款資訊"}},[a("ul",{staticStyle:{padding:"0 25px","padding-bottom":"10px"}},[a("li",[a("span",{staticClass:"title"},[t._v("付款方式")]),a("span",{staticClass:"content"},[t._v(t._s(t.orderPaymentMethodMap[e.paymentMethod]||"不指定"))])]),a("li",[a("span",{staticClass:"title"},[t._v("付款時間")]),a("span",{staticClass:"content"},[t._v(t._s(t.paidAt(e)))])]),"Vacc"!==e.paymentMethod?a("li",[a("span",{staticClass:"title"},[t._v("付款期限")]),a("span",{staticClass:"content"},[t._v(t._s(t.paymentExpiredDate(e)))])]):t._e(),e.Vacc?[a("li",{staticStyle:{"border-top":"1px solid #dcdfe6"}},[a("span",{staticClass:"title"},[t._v("轉帳銀行")]),a("span",{staticClass:"content"},[t._v(t._s(e.Vacc.Bank+" "+e.Vacc.BankCode))])]),a("li",[a("span",{staticClass:"title"},[t._v("轉帳帳號")]),a("span",{staticClass:"content"},[t._v(t._s(e.Vacc.VACCNo))])]),a("li",[a("span",{staticClass:"title"},[t._v("轉帳期限")]),a("span",{staticClass:"content"},[t._v(t._s(t._f("formatDate")(e.paymentExpiredDate,"dateTime")))])])]:t._e()],2)]),a("div",{staticClass:"btn-group-inline"},[0!==e.status?a("el-button",{staticClass:"is-round is-fullwidth",on:{click:function(a){return t.showEditOrder(e)}}},[t._v("編輯加購訂單")]):t._e(),2!==e.status&&e.paidAt&&0!==e.backBalance?a("el-button",{staticClass:"is-round",staticStyle:{"margin-top":"24px"},on:{click:function(a){return t.showEditRefund(e)}}},[t._v("退款記錄")]):t._e()],1)],1)}),t.showCreateBtn?a("el-button",{staticClass:"is-round is-fullwidth",attrs:{type:"primary"},on:{click:t.showCreateOrder}},[t._v("加購")]):t._e(),a("el-drawer",{ref:"drawer",staticClass:"no-header mobile",attrs:{visible:t.drawerVisible,"append-to-body":"",size:t.$root.isSmallDevice?"100%":"50%","destroy-on-close":""},on:{"update:visible":function(e){t.drawerVisible=e},closed:t.handleDrawerClosed}},[a("el-page-header",{attrs:{content:t.isEditMode?"編輯加購訂單":"加購"},on:{back:t.handleDrawerClosed}}),a("el-divider"),t.isEditMode?a("AdditionEditForm",{attrs:{"store-cashflow-setting":t.defaultValue.storeCashflowSetting,"default-value":t.drawerOrderData,"booking-order":t.defaultValue},on:{update:t.updateDefaultValue,close:t.handleDrawerClosed}}):a("AdditionForm",{attrs:{"default-value":t.defaultValue},on:{"update:defaultValue":function(e){t.defaultValue=e},"update:default-value":function(e){t.defaultValue=e},update:t.updateDefaultValue,close:t.handleDrawerClosed,scrollToTop:t.scrollToTop}})],1),a("el-dialog",{attrs:{title:"退款",visible:t.refundDialogVisible,top:"0","append-to-body":""},on:{"update:visible":function(e){t.refundDialogVisible=e}}},[a("el-form",{ref:"refundForm",staticClass:"el-form--floating",attrs:{rules:t.refundRules,model:t.refundSubmitData,"label-position":"top"}},[a("el-form-item",{staticStyle:{"margin-top":"20px"},attrs:{label:"退款金額",prop:"amount"}},[a("el-input",{attrs:{disabled:!t.canPartialRefund,placeholder:""},model:{value:t.refundSubmitData.amount,callback:function(e){t.$set(t.refundSubmitData,"amount",e)},expression:"refundSubmitData.amount"}},[a("span",{staticStyle:{"padding-right":"10px"},attrs:{slot:"suffix"},slot:"suffix"},[t._v("元")])]),a("span",{staticClass:"alert-word"},[t._v("上限為"+t._s(t.selectedOrder.backBalance)+"元")])],1),a("el-form-item",{attrs:{label:"退款日期",prop:"refundDate"}},[a("el-date-picker",{attrs:{type:"date",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",placeholder:"選擇日期"},model:{value:t.refundSubmitData.refundDate,callback:function(e){t.$set(t.refundSubmitData,"refundDate",e)},expression:"refundSubmitData.refundDate"}})],1),a("el-form-item",{staticStyle:{"margin-bottom":"20px"},attrs:{label:"退款原因"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:2},placeholder:""},model:{value:t.refundSubmitData.note,callback:function(e){t.$set(t.refundSubmitData,"note",e)},expression:"refundSubmitData.note"}}),a("p",[t._v("除「信用卡」付款之外，其他所有支付方式若需退款服務，皆須透過店家進行線下退款。")])],1)],1),a("div",{staticClass:"bottom-btn-center"},[a("el-button",{staticClass:"is-round",on:{click:function(e){t.refundDialogVisible=!1}}},[t._v("取消")]),a("el-button",{staticClass:"is-round",attrs:{type:"primary"},on:{click:t.tryToRefund}},[t._v("確認退款記錄")])],1)],1)],2)},i=[],n=a("4795"),r=a.n(n),d=a("cb0c"),l=a("9395"),o=a("a315"),u=a("7e02"),c=a("6bea"),f={components:{BaseCollapse:function(){return Object(o["a"])(a.e("chunk-f797d1f4").then(a.bind(null,"da06")))},AdditionForm:function(){return Object(o["a"])(Promise.all([a.e("chunk-3f4a3bbc"),a.e("chunk-d71aefc6")]).then(a.bind(null,"bd7e")))},AdditionEditForm:function(){return Object(o["a"])(Promise.all([a.e("chunk-f55c2908"),a.e("chunk-3f4a3bbc"),a.e("chunk-68b591e4")]).then(a.bind(null,"5c45")))},BaseStateLabel:function(){return Object(o["a"])(a.e("chunk-12bed50d").then(a.bind(null,"38d1")))}},filters:{formatDate:c["a"],orderStatusFilter:u["o"]},props:{defaultValue:{type:Object,default:function(){}}},data:function(){return{orderPaymentMethodMap:u["l"],mode:"add",drawerVisible:!1,drawerOrderData:{},refund:{total:3999},refundSubmitData:{refundDate:"",amount:"",note:""},refundDialogVisible:!1,isRefund:!0,tryingRefund:!1,selectedOrder:{id:"",backBalance:0},canPartialRefund:!0}},computed:{isEditMode:function(){return"edit"===this.mode},isMobile:function(){return/Mobi/.test(navigator.userAgent)},showCreateBtn:function(){return![0,5,6].includes(this.defaultValue.status)},refundRules:function(){return{refundDate:[{required:!0,message:"請選擇日期"}],amount:[{required:!0,message:"請輸入退款金額"}]}}},created:function(){},mounted:function(){this.scrollToTop()},methods:{scrollToTop:function(){var t=this;window.innerWidth<481&&this.$nextTick(function(){setTimeout(function(){t.$refs.drawer.$el.querySelector(".el-drawer").scrollTop=150},200)})},updateMode:function(t){this.mode=t},handleDrawerClosed:function(){this.$refs.drawer.handleClose()},updateDefaultValue:function(){this.$emit("update"),this.handleDrawerClosed()},paidAt:function(t){return!1===!!t.paidAt?"無":Object(c["a"])(t.paidAt,"dateTime")},paymentExpiredDate:function(t){return 1===t.allowExpired?"無（可逾期付款）":Object(c["a"])(t.paymentExpiredDate,"dateTime")},showCreateOrder:function(){this.updateMode("add"),this.drawerVisible=!0},showEditOrder:function(t){this.updateMode("edit"),this.drawerOrderData=t,this.drawerVisible=!0},showEditRefund:function(t){this.refundDialogVisible=!0,this.selectedOrder=Object(l["a"])({},t),void 0===this.selectedOrder.canPartialRefund||this.selectedOrder.canPartialRefund||(this.canPartialRefund=!1,this.refundSubmitData.amount=this.selectedOrder.backBalance)},tryToRefund:function(){var t=Object(d["a"])(r.a.mark(function t(){return r.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$refs.refundForm.validate();case 2:if(!(this.refundSubmitData.amount>this.selectedOrder.backBalance)){t.next=5;break}return this.$confirm("退款金額不能超過可退款金額","提示",{confirmButtonText:"確定",showCancelButton:!1,type:"warning",center:!0}),t.abrupt("return");case 5:return t.prev=5,this.tryingRefund=!0,t.next=9,this.$store.dispatch("order/refundOrder",{id:this.selectedOrder.id,refundData:this.refundSubmitData});case 9:this.$confirm("退款已完成","提示",{confirmButtonText:"關閉",showCancelButton:!1,type:"warning",center:!0}),this.$emit("update"),t.next=16;break;case 13:t.prev=13,t.t0=t["catch"](5),console.log("TCL: tryToCreateOrder -> error",t.t0);case 16:return t.prev=16,this.tryingRefund=!1,this.isRefund=!0,this.refundDialogVisible=!1,t.finish(16);case 21:case"end":return t.stop()}},t,this,[[5,13,16,21]])}));return function(){return t.apply(this,arguments)}}()}},p=f,_=a("7cfe"),m=a("2877");function v(t){this["$style"]=_["default"].locals||_["default"]}var b=Object(m["a"])(p,s,i,!1,v,null,null);e["default"]=b.exports},"7cfe":function(t,e,a){"use strict";var s=a("ee82"),i=a.n(s);e["default"]=i.a},ee82:function(t,e,a){t.exports={slide:"Addition_slide_1_uj9","slide-reverse":"Addition_slide-reverse_HZ8qn",addition:"Addition_addition_2lXfJ",params:"Addition_params_10jVY",params__item:"Addition_params__item_1eEwl",total:"Addition_total_hn9Cb",total__item:"Addition_total__item_A2eDg","total__item--discount":"Addition_total__item--discount_3qX6x",payment:"Addition_payment_2C-PG"}}}]);
//# sourceMappingURL=chunk-ceab2aee.d8d7d384.js.map