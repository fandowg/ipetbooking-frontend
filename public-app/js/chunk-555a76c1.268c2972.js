(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-555a76c1"],{a0ff:function(t,e,n){"use strict";var a=n("fd56"),i=n.n(a);e["default"]=i.a},d749:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("h5",[t._v("內部備註")]),n("p",{staticStyle:{"line-height":"25px"},domProps:{innerHTML:t._s(t.defaultValue.member.merchantNote||"目前尚無備註")}}),t.edit?[n("el-input",{staticClass:"is-round is-light is-border",attrs:{type:"textarea",rows:4,placeholder:"請輸入備註"},model:{value:t.note,callback:function(e){t.note=e},expression:"note"}}),n("el-row",{staticStyle:{"margin-top":"20px"},attrs:{gutter:10}},[n("el-col",{attrs:{span:12}},[n("el-button",{staticClass:"is-round is-fullwidth",on:{click:t.onCancel}},[t._v("取消")])],1),n("el-col",{attrs:{span:12}},[n("el-button",{staticClass:"is-round is-fullwidth",attrs:{type:"primary"},on:{click:t.onSubmit}},[t._v("儲存")])],1)],1)]:n("el-button",{staticClass:"is-round is-fullwidth is-border",staticStyle:{"margin-top":"20px"},attrs:{type:"primary",plain:""},on:{click:function(e){return t.updateMode(!0)}}},[n("BaseIcon",{attrs:{name:"plus"}}),t._v(" 新增備註")],1)],2)},i=[],s=n("4795"),r=n.n(s),o=n("cb0c"),u=n("6bea"),c=n("2b88"),l={name:"HistoryNote",components:{Portal:c["Portal"]},filters:{formatDate:u["a"]},props:{defaultValue:{type:Object,default:function(){}}},data:function(){return{edit:!1,note:""}},methods:{tryToStoreNote:function(){var t=Object(o["a"])(r.a.mark(function t(){return r.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$store.dispatch("order/storeMerchantNote",{id:this.defaultValue.id,note:this.note});case 2:this.$emit("update");case 3:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),updateMode:function(t){this.edit=t,this.$emit("update-mode",t?"edit":"view")},onSubmit:function(){var t=Object(o["a"])(r.a.mark(function t(){return r.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.tryToStoreNote();case 2:this.note="",this.updateMode(!1);case 4:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),onCancel:function(){this.note="",this.updateMode(!1)}}},d=l,p=n("a0ff"),f=n("2877");function h(t){this["$style"]=p["default"].locals||p["default"]}var m=Object(f["a"])(d,a,i,!1,h,null,null);e["default"]=m.exports},fd56:function(t,e,n){t.exports={slide:"HistoryNote_slide_Ev4CE","slide-reverse":"HistoryNote_slide-reverse_3OcQz"}}}]);
//# sourceMappingURL=chunk-555a76c1.268c2972.js.map