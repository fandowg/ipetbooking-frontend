(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-74a0d6eb"],{"760c3":function(e,r,t){"use strict";t.r(r);var a=function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("div",[t("div",{staticClass:"el-table-wrapper"},[t("el-table",{directives:[{name:"loading",rawName:"v-loading.fullscreen.lock",value:e.tryingToGetOrder,expression:"tryingToGetOrder",modifiers:{fullscreen:!0,lock:!0}}],attrs:{"element-loading-text":"取得訂單資訊中",data:e.loadedOrders,"default-sort":{prop:"created",order:"descending"},"row-class-name":e.calcRowClassName},on:{"row-click":e.tryToGetOrder,"sort-change":e.sortChange}},[t("el-table-column",{attrs:{prop:"created_at","min-width":"160",label:"#編號與成立時間",sortable:"custom"},scopedSlots:e._u([{key:"default",fn:function(r){var a=r.row;return[t("span",[e._v("#"+e._s(a.id)+" "),t("br"),e._v("\n          "+e._s(e._f("formatDate")(a.created))+"\n\n          "+e._s(e._f("formatDate")(a.created,"time"))+"\n        ")])]}}])}),t("el-table-column",{attrs:{prop:"startDate","min-width":"200",label:"服務項目 / 服務時間",sortable:"custom"},scopedSlots:e._u([{key:"default",fn:function(r){var a=r.row;return[t("div",[e._v(e._s(a.productName)+" "+e._s(a.params[0].title))]),t("div",[e._v(e._s(e._f("formatDate")(a.date))+" "+e._s(a.time))]),t("div",[e._v("$"+e._s(a.allActualPayTotal))])]}}])})],1)],1),t("BasePagination",{ref:"pagination",attrs:{"current-page":e.currentPage},on:{"update:currentPage":function(r){e.currentPage=r},"update:current-page":function(r){e.currentPage=r}}}),t("el-drawer",{ref:"orderFormEdit",staticClass:"only-close",attrs:{visible:e.drawerVisible,"append-to-body":"",size:e.$root.isSmallDevice?"100%":"90%","destroy-on-close":"","wrapper-closable":!1,"custom-class":"order-drawer"},on:{"update:visible":function(r){e.drawerVisible=r},closed:function(r){e.componentKey++}}},[t("OrderForm",{key:e.componentKey,ref:"orderDetail",attrs:{"default-value":e.drawerOrderData},on:{"update:defaultValue":function(r){e.drawerOrderData=r},"update:default-value":function(r){e.drawerOrderData=r},update:e.tryToSearchOrder}})],1)],1)},n=[],o=t("4795"),i=t.n(o),s=t("cb0c"),d=t("a315"),c=t("7e02"),l=t("6bea"),u=t("1b80"),f=t("2b88"),p={components:{PortalTarget:f["PortalTarget"],BaseStateLabel:function(){return Object(d["a"])(t.e("chunk-12bed50d").then(t.bind(null,"38d1")))},OrderDetail:function(){return Object(d["a"])(t.e("chunk-1542bfb8").then(t.bind(null,"2fe5")))},OrderForm:function(){return Object(d["a"])(Promise.resolve().then(t.bind(null,"40c0")))}},filters:{orderStatusFilter:c["o"],orderSourceFilter:c["m"],orderPaymentMethodFilter:c["k"],formatDate:l["a"],bookingStatusFilter:c["a"],paymentStatusMapFilter:c["q"]},mixins:[u["c"]],props:{memberInfoId:{type:String,default:""}},data:function(){return{componentKey:0,loadedOrders:[],tryingToGetOrder:!1,drawerVisible:!1,drawerOrderData:"",filterData:{order_by:"created_at",order:"desc"}}},watch:{currentPage:{handler:"tryToSearchOrder",immediate:!0}},methods:{calcRowClassName:function(e){var r=e.row,t=r.status,a=r.groupSize/r.usedSize;return 0===t?"order--canceled":1===a?"order--used":void 0},tryToGetOrder:function(){var e=Object(s["a"])(i.a.mark(function e(r){return i.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.tryingToGetOrder=!0,e.next=3,this.$store.dispatch("order/fetchSingle",r.id);case 3:this.drawerOrderData=e.sent,this.tryingToGetOrder=!1,this.drawerVisible=!0;case 6:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),tryToSearchOrder:function(){var e=Object(s["a"])(i.a.mark(function e(){var r,t,a,n=this;return i.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$store.dispatch("order/fetchList",Object.assign({memberId:this.memberInfoId,paymentMethod:"All",order_by:this.filterData.order_by,order:this.filterData.order},this.pageQuery));case 2:r=e.sent,t=r.items,a=r.total,this.loadedOrders=t,this.$nextTick(function(){n.$refs.pagination.updateTotal(a)});case 7:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),sortChange:function(e){e.column;var r=e.prop,t=e.order;t&&(this.filterData.order_by=r,this.filterData.order="ascending"===t?"asc":"desc",this.currentPage=1,this.tryToSearchOrder())}}},h=p,m=t("2877"),b=Object(m["a"])(h,a,n,!1,null,null,null);r["default"]=b.exports}}]);
//# sourceMappingURL=chunk-74a0d6eb.48d2b990.js.map