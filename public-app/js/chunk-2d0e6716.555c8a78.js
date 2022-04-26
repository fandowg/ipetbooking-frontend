(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0e6716"],{9988:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-dialog",{attrs:{visible:e.visible,"show-close":!1,top:"0","append-to-body":""}},[a("h5",{staticStyle:{"margin-bottom":"0"},attrs:{slot:"title"},slot:"title"},[a("i",{staticClass:"el-icon-warning",staticStyle:{"font-size":"24px","margin-bottom":"15px",color:"#E2B550"}}),a("br"),e._v("\n  "+e._s(e.dialogTitle))]),a("el-form",{ref:"form",staticClass:"el-form-item--normal-margin",attrs:{model:e.submitData,rules:e.submitRules}},[e.isPaidStatus?[e.isNotPayPrepaid?[a("p",{staticStyle:{"margin-top":"0","text-align":"center"}},[e._v("抵用的包月方案 "),a("span",{staticClass:"alert-text"},[e._v("尚未付款")]),e._v("。"),a("br"),e._v("請問是否要將此筆訂單的狀態修改為【已付款】？")]),a("el-form-item",{attrs:{prop:"note",label:""}},[a("el-input",{attrs:{type:"textarea",rows:2,placeholder:"請輸入付款備註"},model:{value:e.submitData.note,callback:function(t){e.$set(e.submitData,"note",t)},expression:"submitData.note"}})],1)]:e._e(),e.isNotPayPrepaid?e._e():[a("el-form-item",{attrs:{prop:"note",label:"付款備註"}},[a("el-input",{attrs:{type:"textarea",rows:2,placeholder:"請輸入付款備註"},model:{value:e.submitData.note,callback:function(t){e.$set(e.submitData,"note",t)},expression:"submitData.note"}})],1)]]:e._e(),e.isPaidStatus?e._e():[e.isPaidByCreditCard?[e.canOnlineRefund?[0===e.newebpayStatus?a("el-alert",{attrs:{title:"此訂單目前授權成功但尚未正式扣款，僅能整筆退款，無法部分退款。",type:"error",closable:!1}}):e._e(),1===e.newebpayStatus?a("el-alert",{attrs:{title:"此訂單目前金流尚在請款流程中，暫無法取消訂單，請稍後再試。",type:"error",closable:!1}}):e._e(),3===e.newebpayStatus?a("el-alert",{attrs:{title:"產生非預期之錯誤，請通知我們。",type:"error",closable:!1}}):e._e(),2===e.newebpayStatus?[a("small",[e._v("退訂單的\n              20％，退款種類請選「訂單總金額的百分比（％）」，退款百分比請輸入「20」。")]),a("br"),a("small",[e._v("退 150\n              元，退款種類請選「指定金額」，退款金額請輸入「150」。")]),a("el-form-item",{attrs:{prop:"refundUnit",label:"退款種類"}},[a("el-select",{model:{value:e.submitData.refundUnit,callback:function(t){e.$set(e.submitData,"refundUnit",t)},expression:"submitData.refundUnit"}},[a("el-option",{attrs:{label:"訂單總金額的百分比（％）",value:"%"}}),a("el-option",{attrs:{label:"指定金額",value:"fixed"}})],1)],1),a("el-form-item",{attrs:{prop:"refundNumber",label:"退款"+(e.isRefundPercentage?"百分比":"金額")}},[a("small",[e._v("訂單金額 "+e._s(e.order.priceTotal)+" 元")]),a("el-input",{attrs:{min:"0",placeholder:"請輸入退款金額"},scopedSlots:e._u([{key:"append",fn:function(){return[e._v(e._s(e._f("formatUnitText")(e.submitData.refundUnit)))]},proxy:!0}],null,!1,2908787069),model:{value:e.submitData.refundNumber,callback:function(t){e.$set(e.submitData,"refundNumber",e._n(t))},expression:"submitData.refundNumber"}}),e.isRefundPercentage&&e.submitData.refundNumber>=0?a("small",[e._v("經四捨五入計算，將會退 "+e._s(e.refundValue)+" 元給客戶")]):e._e()],1)]:e._e()]:a("el-alert",{attrs:{title:"此訂單非線上付款，請自行處理退款事宜。",type:"warning",closable:!1}})]:e._e(),1!==e.newebpayStatus||3!==e.newebpayStatus?a("el-form-item",{attrs:{prop:"note",label:"僅作取消訂單說明使用；若有退款請另行操作[退款紀錄]"}},[a("el-input",{attrs:{type:"textarea",rows:2,placeholder:"請輸入取消原因"},model:{value:e.submitData.note,callback:function(t){e.$set(e.submitData,"note",t)},expression:"submitData.note"}})],1):e._e()]],2),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.handleClose}},[e._v("放棄")]),e.isNotPayPrepaid&&e.isPaidStatus?a("el-button",{on:{click:function(t){return e.goToPrepaidOrder(e.prepaidOrderUuid)}}},[e._v("查看包月方案")]):e._e(),1===e.newebpayStatus||3===e.newebpayStatus?a("el-button",{attrs:{type:"primary"},on:{click:e.handleClose}},[e._v("關閉")]):a("el-button",e._g({attrs:{type:"primary",loading:e.tryingCancel}},{click:e.isPaidStatus?e.emitPaid:e.handleCancel}),[e._v("確定")])],1)],1)},n=[],i=a("4795"),s=a.n(i),o=a("9395"),u=a("cb0c"),l=function(e){return"%"===e?"%":"元"},d=function(e,t,a){return"".concat("%"===t?c(e,a):e)},c=function(e,t){return Math.round(t*e/100)||0},p={filters:{formatUnitText:l},props:{visible:{type:Boolean,default:!1},order:{type:Object,required:!0},prepaidOrder:{type:Object,default:function(){}},paidMode:{type:Boolean,default:!1},isNotPayPrepaid:{type:Boolean,default:!1},prepaidOrderUuid:{type:String,default:""}},data:function(){return{tryingCancel:!1,submitData:{note:"",refundUnit:"%",refundNumber:""}}},computed:{dialogTitle:function(){var e={0:"確定取消此訂單及授權？",1:"此筆訂單尚在金流請款中",2:"確定取消此筆訂單？",3:"取消訂單時產生非預期之錯誤"};return this.isPaidStatus?"將訂單狀態改為已付款":e[this.newebpayStatus]||"確定取消此筆 ".concat(this.order.orderNo?this.order.orderNo:this.order.id," 訂單？")},refundNumberMax:function(){return this.isRefundPercentage?100:this.order.priceTotal},refundValue:function(){return d(this.submitData.refundNumber,this.submitData.refundUnit,this.order.priceTotal)},newebpayStatus:function(){return this.order.newebpayStatus},isPaidStatus:function(){var e=!1;return e=this.prepaidOrder?0!==this.order.status&&1===this.prepaidOrder.status||"PAID"===this.order.paymentStatus||1===this.order.status:0!==this.order.status&&"PAID"===this.order.paymentStatus||1===this.order.status,e},isPaidByCreditCard:function(){return"Credit"===this.order.paymentMethod},canOnlineRefund:function(){return 1===this.order.refund},isRefundPercentage:function(){return"%"===this.submitData.refundUnit},isPrepaidOrder:function(){return this.order.hasOwnProperty("prepaidTitle")},submitRules:function(){return{refundUnit:[{required:this.canOnlineRefund,message:"請選擇退款種類",trigger:"change"}],refundNumber:[{required:this.canOnlineRefund,message:"請輸入退款金額",trigger:"change"},{type:"number",min:0,max:this.refundNumberMax,message:"請輸入小於 ".concat(this.refundNumberMax," 之數字")}]}}},watch:{newebpayStatus:{handler:function(e){0===e&&(this.submitData.refundNumber=100)},immediate:!0}},created:function(){},methods:{handleClose:function(){this.$refs.form.resetFields(),this.$emit("update:visible",!1)},emitPaid:function(){this.$emit("paid",this.submitData.note),this.handleClose()},emitCancelled:function(){this.$emit("cancelled"),this.handleClose()},tryToCancel:function(){var e=Object(u["a"])(s.a.mark(function e(){var t;return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return t=this.isPrepaidOrder?"prepaid/cancelOrder":"order/cancel",this.tryingCancel=!0,e.prev=2,e.next=5,this.$store.dispatch(t,{orderId:this.order.id,cancelData:Object(o["a"])({},this.submitData,{refundValue:this.refundValue})});case 5:this.$message({message:"取消成功！",type:"success"}),this.emitCancelled(),e.next=12;break;case 9:e.prev=9,e.t0=e["catch"](2),console.log("TCL: tryToCancel -> error",e.t0);case 12:return e.prev=12,this.tryingCancel=!1,e.finish(12);case 15:case"end":return e.stop()}},e,this,[[2,9,12,15]])}));return function(){return e.apply(this,arguments)}}(),handleCancel:function(){var e=this;this.$refs.form.validate(function(t){t&&e.tryToCancel()})},goToPrepaidOrder:function(e){this.$router.push({name:"orders",query:{type:"prepaidOrder",id:e}})}}},m=p,f=a("2877"),b=Object(f["a"])(m,r,n,!1,null,null,null);t["default"]=b.exports}}]);
//# sourceMappingURL=chunk-2d0e6716.555c8a78.js.map