(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1542bfb8"],{"2fe5":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-tabs",{class:e.$style.tabs,model:{value:e.activeTab,callback:function(t){e.activeTab=t},expression:"activeTab"}},e._l(e.tabList,function(e,t){return a("el-tab-pane",{key:t,attrs:{label:e.label,name:e.name}})}),1),a("Info",{attrs:{"default-value":e.defaultValue,"assign-list":e.assignList,loading:e.tryingAssign},on:{"update:loading":function(t){e.tryingAssign=t},update:e.handleStore}}),a(e.activeTab,{tag:"component",class:e.$style["tab-content"],attrs:{"default-value":e.defaultValue},on:{update:e.handleStore}}),a("Portal",{attrs:{to:"drawer-header"}},[0!==e.defaultValue.status?[4===e.defaultValue.status&&e.isAllPaid?a("el-button",{staticClass:"is-round",attrs:{type:"primary"},on:{click:e.showSignDialog}},[e._v("簽名請款")]):e._e(),4!==e.defaultValue.status||e.isAllPaid||"Credit"===e.defaultValue.paymentMethod?e._e():a("el-alert",{staticStyle:{display:"inline-block",width:"auto",top:"14px",left:"-10px"},attrs:{type:"error",closable:!1}},[a("span",{attrs:{slot:"title"},slot:"title"},[e._v("請將訂單及加購款項結清，"),a("br"),e._v("始可完成簽名請款")])]),4!==e.defaultValue.status||e.isAllPaid||"Credit"!==e.defaultValue.paymentMethod?e._e():a("el-alert",{staticStyle:{display:"inline-block",width:"auto",top:"14px",left:"-10px"},attrs:{type:"error",closable:!1}},[a("span",{attrs:{slot:"title"},slot:"title"},[e._v("客戶選定線上信用卡結帳，"),a("br"),e._v("無法快速付款")])]),"UNPAID"===e.defaultValue.paymentStatus&&"Credit"!==e.defaultValue.paymentMethod&&"Vacc"!==e.defaultValue.paymentMethod&&"Prepaid"!==e.defaultValue.paymentMethod?a("el-button",{staticClass:"is-round",attrs:{type:"success"},on:{click:e.openPaidDialog}},[e._v("\n        付款\n      ")]):e._e(),3===e.defaultValue.status?a("el-button",{staticClass:"is-round",attrs:{loading:e.tryingCheckIn,disabled:e.tryingCheckIn||e.tryingAssign,type:"primary"},on:{click:e.openCheckDialog}},[e._v("報到")]):e._e(),3===e.defaultValue.status?a("el-button",{staticClass:"is-round",attrs:{loading:e.tryingCheckIn,disabled:e.tryingCheckIn||e.tryingAssign,type:"danger"},on:{click:function(t){e.noShowDialogVisible=!0}}},[e._v("未報到")]):e._e(),6!==e.defaultValue.status?a("el-button",{staticClass:"is-round",attrs:{type:"info"},on:{click:e.tryToCancel}},[e._v("取消")]):e._e()]:e._e()],2),a("SignatureDialog",{key:e.signDialogKey,attrs:{visible:e.signDialogVisible,order:Object.assign({},e.defaultValue)},on:{"update:visible":function(t){e.signDialogVisible=t},update:e.handleStore}}),a("el-dialog",{attrs:{title:"請說明未報到情況",visible:e.noShowDialogVisible,top:"0","append-to-body":""},on:{"update:visible":function(t){e.noShowDialogVisible=t}}},[a("el-form",{ref:"form",attrs:{model:e.submitData,rules:{note:[{required:!0,message:"請輸入情況！",trigger:"blur"}]}}},[a("el-form-item",{attrs:{prop:"note"}},[a("el-input",{staticClass:"is-round is-light is-border",attrs:{type:"textarea",rows:4,placeholder:"請輸入備註"},model:{value:e.submitData.note,callback:function(t){e.$set(e.submitData,"note",t)},expression:"submitData.note"}})],1)],1),a("el-row",{staticStyle:{"margin-top":"20px"},attrs:{gutter:20}},[a("el-col",{attrs:{span:12}},[a("el-button",{staticClass:"is-round is-fullwidth",on:{click:function(t){e.noShowDialogVisible=!1}}},[e._v("返回")])],1),a("el-col",{attrs:{span:12}},[a("el-button",{staticClass:"is-round is-fullwidth",attrs:{loading:e.tryingNoShow,disabled:e.tryingNoShow,type:"danger"},on:{click:e.onClickNoShow}},[e._v("未報到")])],1)],1)],1),a("el-dialog",{attrs:{title:"請選擇付款方式",visible:e.paidDialogVisible,top:"0","append-to-body":""},on:{"update:visible":function(t){e.paidDialogVisible=t}}},[a("div",{staticClass:"bottom-btn-center"},e._l(e.payMethods,function(t,i){return a("el-button",{key:i,staticClass:"is-round",on:{click:function(t){return e.tryToPayOrder(i)}}},[e._v(e._s(t))])}),1)]),e.defaultValue.scheduleItem?a("el-dialog",{attrs:{title:"確認將此訂單改為「已報到」",visible:e.checkDialogVisible,top:"0","append-to-body":""},on:{"update:visible":function(t){e.checkDialogVisible=t}}},[a("el-form",{ref:"beauticianForm",staticClass:"el-form-item--normal-margin",attrs:{model:e.check,rules:e.submitRules,"label-width":"100px","label-position":"left"}},[a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"美容師"}},[e._v("\n        "+e._s(e.defaultValue.scheduleItem?e.defaultValue.scheduleItem.name:"")+"\n        ")]),a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.tryingAssign,expression:"tryingAssign"}],attrs:{"element-loading-background":"rgba(0, 0, 0,0)"}},[e.assignList.length>0?a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"助理",prop:"assistant"}},[a("el-select",{model:{value:e.check.helperId,callback:function(t){e.$set(e.check,"helperId",t)},expression:"check.helperId"}},[a("el-option",{attrs:{label:"不指派",value:""}}),e._l(e.assignList,function(e,t){return a("el-option",{key:t,attrs:{value:e.id,label:e.name+" "+(e.sameStore?"(同分店)":"(不同分店)")}})})],2)],1):e._e(),0!==e.assignList.length||e.tryingAssign?e._e():a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"助理",prop:"assistant"}},[a("el-alert",{attrs:{title:"目前無人員可指派",type:"warning",closable:!1}})],1)],1)],1),a("div",{staticClass:"bottom-btn-center"},[a("el-button",{staticClass:"is-round",on:{click:function(t){e.checkDialogVisible=!1}}},[e._v("取消")]),a("el-button",{staticClass:"is-round",attrs:{type:"primary"},on:{click:e.tryToStoreAssignAndCheckIn}},[e._v("確認")])],1)],1):e._e(),a("OrderChangeStatusDialog",{attrs:{visible:e.statusDialogVisible,order:Object.assign({},e.defaultValue,{status:0})},on:{"update:visible":function(t){e.statusDialogVisible=t},cancelled:e.emitStore}})],1)},n=[],s=a("4795"),r=a.n(s),l=a("cb0c"),o=a("9395"),u=a("a315"),c=a("2b88"),d=a("7e02"),h=a("4d77"),f={name:"OrderDetail",components:{Info:function(){return Object(u["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-af7ea718")]).then(a.bind(null,"cb6f")))},Service:function(){return Object(u["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-2d48e48b")]).then(a.bind(null,"a890")))},Orders:function(){return Object(u["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-f55c2908"),a.e("chunk-11920d24")]).then(a.bind(null,"bd32")))},More:function(){return Object(u["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-3c8e61d5")]).then(a.bind(null,"3cd9")))},BaseCollapse:function(){return Object(u["a"])(a.e("chunk-f797d1f4").then(a.bind(null,"da06")))},Portal:c["Portal"],SignatureDialog:function(){return Object(u["a"])(Promise.all([a.e("chunk-0badaf9f"),a.e("chunk-dc85eaa2")]).then(a.bind(null,"8d15")))},OrderChangeStatusDialog:function(){return Object(u["a"])(a.e("chunk-2d0e6716").then(a.bind(null,"9988")))}},filters:{orderStatusFilter:d["o"],genderFilter:d["h"],orderSourceFilter:d["m"],bookingStatusFilter:d["a"]},props:{defaultValue:{type:Object,default:function(){}}},data:function(){return{mode:"view",cancelDialogVisible:!1,signDialogVisible:!1,signDialogKey:0,tryingCheckIn:!1,noShowDialogVisible:!1,tryingNoShow:!1,submitData:{note:""},activeTab:"service",tabList:[{name:"service",label:"服務"},{name:"orders",label:"訂單"},{name:"more",label:"更多"}],payMethods:{Cash:"到店付款(現金)",StoreCredit:"現場刷卡",Atm:"線下匯款"},check:{helperId:""},assignList:[],checkDialogVisible:!1,helperId:"",tryingAssign:!1,paidDialogVisible:!1,statusDialogVisible:!1}},computed:Object(o["a"])({},h["b"],{isPaid:function(){return 1===this.defaultValue.status},isEmptyBySizeExtrafields:function(){return 0===this.defaultValue.customerInfos.length||this.defaultValue.customerInfos[0].bySizeExtrafields instanceof Array},submitRules:function(){return{helperId:[{required:!0,message:"請選擇助理",trigger:"change"}]}},isAddOrdersCanceled:function(){return this.defaultValue.childrenOrders.every(function(e){return 1!==e.status})},isAllPaid:function(){var e="PAID"===this.defaultValue.paymentStatus,t=this.defaultValue.childrenOrders.every(function(e){return 2!==e.status});return e&&t}}),created:function(){this.$parent.$el.querySelector(".el-drawer__header").style.borderBottom="none",this.$parent.$el.querySelector(".el-drawer__header").style.minHeight="82px",this.tryToFetchHelperList(),this.check.helperId=this.defaultValue.helper?this.defaultValue.helper.id:""},methods:{updateMode:function(e){this.mode=e},handleStore:function(){var e=Object(l["a"])(r.a.mark(function e(){var t;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$store.dispatch("order/fetchSingle",this.defaultValue.id);case 2:t=e.sent,this.$emit("update:defaultValue",t),this.$emit("update"),this.updateMode("view");case 6:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),showCancelDialog:function(){this.cancelDialogVisible=!0},tryToCheckIn:function(){var e=Object(l["a"])(r.a.mark(function e(){return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$refs.beauticianForm.validate();case 2:return this.checkDialogVisible=!1,e.prev=3,this.tryingCheckIn=!0,e.next=7,this.$store.dispatch("order/verifySingleCode",{codeId:this.defaultValue.params[0].codes[0].id,orderId:this.defaultValue.id});case 7:this.$message({type:"success",message:"報到成功！"}),this.handleStore(),e.next=13;break;case 11:e.prev=11,e.t0=e["catch"](3);case 13:return e.prev=13,this.tryingCheckIn=!1,e.finish(13);case 16:case"end":return e.stop()}},e,this,[[3,11,13,16]])}));return function(){return e.apply(this,arguments)}}(),onClickNoShow:function(){var e=Object(l["a"])(r.a.mark(function e(){var t;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$refs.form.validate();case 2:return e.next=4,this.$confirm("確定將此訂單改為「未報到」？","警告",{confirmButtonText:"確定",cancelButtonText:"取消",type:"warning",center:!0});case 4:return this.tryingNoShow=!0,t=Object(o["a"])({},this.defaultValue,{status:5,merchantNote:this.submitData.note}),e.next=8,this.$store.dispatch("order/store",t);case 8:this.handleStore(),this.submitData.note="",this.noShowDialogVisible=!1,this.tryingNoShow=!1;case 12:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),showSignDialog:function(){this.signDialogKey++,this.signDialogVisible=!0},tryToFetchHelperList:function(){var e=Object(l["a"])(r.a.mark(function e(){var t,a,i=this;return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.tryingAssign=!0,e.next=3,this.$store.dispatch("order/fetchHelperList",this.defaultValue.id);case 3:t=e.sent,a=t.items,this.assignList=a,this.assignList.forEach(function(e,t){e.id===i.defaultValue.scheduleItem.id&&i.assignList.splice(t,1)}),this.tryingAssign=!1;case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),tryToStoreAssignAndCheckIn:function(){var e=Object(l["a"])(r.a.mark(function e(){return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.tryingCheckIn=!0,e.next=3,this.$store.dispatch("order/storeAssignHelper",{id:this.defaultValue.id,itemId:this.check.helperId});case 3:this.tryToCheckIn();case 4:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),openCheckDialog:function(){this.checkDialogVisible=!0,this.check.helperId=this.defaultValue.helper?this.defaultValue.helper.id:""},openPaidDialog:function(){this.paidDialogVisible=!0},tryToPayOrder:function(){var e=Object(l["a"])(r.a.mark(function e(t){return r.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,this.$confirm("確認付款方式為「 ".concat(this.payMethods[t]," 」？"),"提示",{confirmButtonText:"確定",showCancelButton:!0,type:"warning",center:!0});case 3:return e.next=5,this.$store.dispatch("order/store",Object(o["a"])({},this.defaultValue,{paymentMethod:t,paymentStatus:"PAID"}));case 5:this.$message({type:"success",message:"編輯成功！"}),this.handleStore(),this.paidDialogVisible=!1,e.next=12;break;case 10:e.prev=10,e.t0=e["catch"](0);case 12:return e.prev=12,e.finish(12);case 14:case"end":return e.stop()}},e,this,[[0,10,12,14]])}));return function(t){return e.apply(this,arguments)}}(),tryToCancel:function(){this.isAddOrdersCanceled?this.statusDialogVisible=!0:this.$confirm("請先將加購訂單全數取消","提示",{confirmButtonText:"確定",showCancelButton:!1,type:"warning",center:!0})},emitStore:function(){this.handleStore()}}},p=f,b=a("a821"),g=a("2877");function m(e){this["$style"]=b["default"].locals||b["default"]}var y=Object(g["a"])(p,i,n,!1,m,null,null);t["default"]=y.exports},"647b":function(e,t,a){e.exports={slide:"OrderDetail_slide_Ig5DM","slide-reverse":"OrderDetail_slide-reverse_Ma5RR",meta:"OrderDetail_meta_1Crwb",header:"OrderDetail_header_2WXNo",title:"OrderDetail_title_2-n-L",info:"OrderDetail_info_1It2v",params:"OrderDetail_params_Dn2KN",params__item:"OrderDetail_params__item_2KK1f",total:"OrderDetail_total_3X0_J",total__item:"OrderDetail_total__item_BlIaP","total__item--discount":"OrderDetail_total__item--discount_2CsKK",buttons:"OrderDetail_buttons_SKGpb","info-byOrder":"OrderDetail_info-byOrder_2d14i","question-list":"OrderDetail_question-list_2Idrc",question:"OrderDetail_question_KT0VY",payment:"OrderDetail_payment_99XFO",chat:"OrderDetail_chat_2WBgi",tabs:"OrderDetail_tabs_ULRa1","tab-content":"OrderDetail_tab-content_wn00l"}},a821:function(e,t,a){"use strict";var i=a("647b"),n=a.n(i);t["default"]=n.a}}]);
//# sourceMappingURL=chunk-1542bfb8.e06bb8f6.js.map