(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-dc689ff0"],{7599:function(s,t,a){"use strict";a.r(t);var e=function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("el-card",{staticClass:"box-card",attrs:{shadow:"never"}},[a("div",{staticClass:"header",attrs:{slot:"header"},slot:"header"},[a("h3",{staticClass:"block-title"},[s._v("通知相關")])]),a("el-row",{attrs:{gutter:15}},[a("el-col",{directives:[{name:"loading",rawName:"v-loading",value:s.loading,expression:"loading"}],staticClass:"mb-2 mb-sm-0",attrs:{sm:6,span:24}},[a("el-card",{class:[s.$style["card-sms"],s.status]},[a("div",{staticClass:"card-sms-title"},[s._v("本月簡訊已發則數 / 可發則數")]),a("div",{staticClass:"card-sms-count Jost"},[s._v(s._s(s.smsInfo.usage)+" / "+s._s(s.smsInfo.available))])])],1),[a("el-col",{staticClass:"mb-2 mb-sm-0",attrs:{sm:6,span:24}},[a("el-button",{staticClass:"large-btn",attrs:{type:"primary"},on:{click:function(t){return s.redirectSettings("sms-record")}}},[s._v("檢視發送記錄"),a("BaseIcon",{attrs:{name:"paper-plane"}})],1)],1),a("el-col",{staticClass:"mb-2 mb-sm-0",attrs:{sm:6,span:24}},[a("el-button",{staticClass:"large-btn",attrs:{type:"primary"},on:{click:function(t){return s.redirectSettings("notification")}}},[s._v("通知設定"),a("BaseIcon",{attrs:{name:"cogs"}})],1)],1)]],2),void 0],2)},n=[],r=a("4795"),i=a.n(r),c=a("cb0c"),o={data:function(){return{loading:!1,smsInfo:{available:500,usage:0}}},computed:{status:function(){var s=(this.smsInfo.available-this.smsInfo.usage)/this.smsInfo.available,t=s<=.5?s<=.1?"danger":"warning":"";return this.$style[t]}},created:function(){this.tryToFetchSMSInfo()},methods:{tryToFetchSMSInfo:function(){var s=Object(c["a"])(i.a.mark(function s(){return i.a.wrap(function(s){while(1)switch(s.prev=s.next){case 0:return this.loading=!0,s.next=3,this.$store.dispatch("dashboard/fetchSMSInfo");case 3:this.smsInfo=s.sent,this.loading=!1;case 5:case"end":return s.stop()}},s,this)}));return function(){return s.apply(this,arguments)}}(),redirectSettings:function(){var s=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";this.$router.push({name:"settings",params:{activeTab:s}})}}},l=o,d=a("ea4c"),u=a("2877");function m(s){this["$style"]=d["default"].locals||d["default"]}var f=Object(u["a"])(l,e,n,!1,m,null,null);t["default"]=f.exports},d293:function(s,t,a){s.exports={slide:"SmsBlock_slide_3iYbY","slide-reverse":"SmsBlock_slide-reverse_2W5TC","card-sms":"SmsBlock_card-sms_2D9PD",warning:"SmsBlock_warning_2QFBK",danger:"SmsBlock_danger_2nFnp"}},ea4c:function(s,t,a){"use strict";var e=a("d293"),n=a.n(e);t["default"]=n.a}}]);
//# sourceMappingURL=chunk-dc689ff0.63f819d6.js.map