(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-41b7eed2"],{"82da":function(e,t,s){e.exports={slide:"ListItem_slide_1ygww","slide-reverse":"ListItem_slide-reverse_Dxoh2",config:"ListItem_config_3lFvY"}},c1f1:function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{class:e.$style.config},[s("div",{staticClass:"sms"},[s("h5",{staticClass:"title"},[e._v("簡訊設定 "),s("BaseIcon",{attrs:{name:"comment-dots"}})],1),s("div",{staticClass:"enable-disable"},[s("div",{staticClass:"disable"},[s("el-radio",{attrs:{label:0},model:{value:e.defaultValue.sms.receive,callback:function(t){e.$set(e.defaultValue.sms,"receive",t)},expression:"defaultValue.sms.receive"}},[e._v("關閉簡訊通知")])],1),s("div",{staticClass:"enable"},[s("el-radio",{attrs:{label:1},model:{value:e.defaultValue.sms.receive,callback:function(t){e.$set(e.defaultValue.sms,"receive",t)},expression:"defaultValue.sms.receive"}},[e._v("啟用簡訊通知")]),s("span",{staticStyle:{color:"#aaaaaa"}},[e._v("－"+e._s(e.mapEnableMessage[e.itemName].sms))])],1)]),s("el-divider"),s("div",{directives:[{name:"show",rawName:"v-show",value:e.isSmsEnable,expression:"isSmsEnable"}]},[s("div",[s("el-radio",{attrs:{label:0},model:{value:e.defaultValue.sms.useCustomTemplate,callback:function(t){e.$set(e.defaultValue.sms,"useCustomTemplate",t)},expression:"defaultValue.sms.useCustomTemplate"}},[e._v("預設內容：")])],1),s("div",{staticClass:"content",domProps:{innerHTML:e._s(e.mapDefaultPreview[e.itemName].sms)}},[e._v(" 您已向[店家名稱]購買包月方案「[包月方案名稱]」，請點以下連結立即付款完成結帳[訂單短網址]")]),s("div",[s("el-radio",{attrs:{label:1},model:{value:e.defaultValue.sms.useCustomTemplate,callback:function(t){e.$set(e.defaultValue.sms,"useCustomTemplate",t)},expression:"defaultValue.sms.useCustomTemplate"}},[e._v("自訂內容：")])],1),s("div",{class:["content",e.isSmsUseTemplate?"":"disabled"]},[s("At",{ref:"smsTemplate",attrs:{"fixed-phrase":e.mapFixedPhrase[e.itemName],content:e.smsContent},on:{update:function(t){return e.updateTemplate("sms")}}}),s("el-alert",{staticStyle:{"margin-top":"10px"},attrs:{title:"提醒您，簡訊實際字數計算會因參數長度有所不同。每則簡訊字數依實際計算為準。",type:"info","show-icon":"",closable:!0}}),s("div",{staticStyle:{"margin-top":"30px"}},[s("div",[e._v("樣式預覽：")]),s("div",{staticStyle:{"margin-bottom":"30px"},domProps:{innerHTML:e._s(e.previewContent(e.defaultValue.sms.templateContent))}})])],1)])],1),s("el-button",{staticStyle:{width:"100%","margin-top":"50px"},attrs:{loading:e.tryingStore,type:"primary"},on:{click:e.save}},[e._v("儲存變更")])],1)},i=[],l=s("88d8"),n=s("2ef0"),m=s("a315"),r={components:{At:function(){return Object(m["a"])(s.e("chunk-0bde6144").then(s.bind(null,"1acc")))}},props:{itemName:{type:String,default:""},defaultValue:{type:Object,default:function(){return{}}}},data:function(){return{tryingStore:!1,mapTemplateString:{"姓名":"黃大明","訂單成立時間":" 2021/01/01 00:00 ","店家名稱":"小捲尾寵物美容","預約時間":" 2021/01/03 13:00 ","訂單付款時間":" 2021/01/01 10:00 ","服務項目":"小捲尾美容SPA","人數":" 1 ","數量":" 1 ","短網址":" ipbk.in/yoga ","包月方案項目":"招牌沐浴超值特惠組","店家電話":"02-27422526","店家地址":"台北市松山區健康路239號","店家網址":"https://j-tails.com","訂單取消時間":" 2021/01/02 09:00 ","訂單短網址":"ipbk.in/12345","服務類型":"到店服務","訂單付款期限":" 2021/01/02 23:59 ","原始預約時間":" 2021/01/03 10:00 ","帳號":"account@01","密碼":"password@01","分店名稱":"中山店","分店電話":"002-274225262","分店地址":"台北市松山區健康路239號","舊預約時間":"2021/01/03 10:00"},mapEnableMessage:{order_Qrcode:{sms:"客戶會在付款後收到確認簡訊",email:"客戶會在付款後收到確認電子郵件"},order_CheckoutLink:{sms:"客戶會在付款前收到繳款連結簡訊",email:"客戶會在付款前收到繳款連結電子郵件"},order_Remind:{sms:"客戶會在行前收到行程提醒簡訊",email:"客戶會在行前收到行程提醒電子郵件"},order_Cancel:{sms:"客戶會在預約被取消時收到提醒簡訊",email:"客戶會在行前收到行程提醒電子郵件"},order_ChangeTime:{sms:"客戶會在預約改期時收到提醒簡訊",email:"客戶會在行前收到行程提醒電子郵件"},order_RequestDeduct:{sms:"客戶會在訂單折抵時收到提醒簡訊",email:"客戶會在行前收到行程提醒電子郵件"},prepaid_Qrcode:{sms:"客戶會在包月方案付款完成後收到購買完成簡訊",email:"客戶會在包月方案付款完成後收到購買完成電子郵件"},prepaid_CheckoutLink:{sms:"客戶會在選購包月方案後收到付款連結簡訊",email:"客戶會在選購包月方案後收到付款連結電子郵件"},prepaid_Cancel:{sms:"客戶會在退款完成時收到提醒簡訊",email:"客戶會在選購包月方案後收到付款連結電子郵件"},member_SendPassword:{sms:"客戶會在註冊成功時收到提醒簡訊",email:""},orderAdd_PaySuccess:{sms:"客戶會在加購訂單付款完成後收到購買完成簡訊",email:"客戶會在加購訂單付款完成後收到購買完成電子郵件"},orderAdd_CheckoutLink:{sms:"客戶會在選購加購項目後收到付款連結簡訊",email:"客戶會在選購加購項目後收到付款連結電子郵件"},orderAdd_Cancel:{sms:"客戶會在加購訂單退款完成時收到提醒簡訊",email:""}},mapFixedPhrase:{order_Qrcode:["姓名","店家名稱","分店名稱","服務項目","預約時間","分店電話","分店地址","店家網址","訂單短網址","訂單付款時間"],order_CheckoutLink:["姓名","店家名稱","分店名稱","服務項目","預約時間","分店電話","分店地址","訂單付款期限","訂單短網址","訂單成立時間"],order_Remind:["姓名","店家名稱","分店名稱","服務項目","預約時間","分店電話","分店地址","訂單短網址"],order_Cancel:["姓名","店家名稱","分店名稱","服務項目","預約時間","分店電話","分店地址","訂單短網址","訂單取消時間"],order_ChangeTime:["姓名","店家名稱","分店名稱","服務項目","預約時間","舊預約時間","分店電話","分店地址","訂單付款期限","訂單短網址"],order_RequestDeduct:["姓名","店家名稱","服務類型","服務項目","預約時間","店家電話","店家地址","店家網址","訂單成立時間","訂單短網址"],prepaid_Qrcode:["姓名","店家名稱","分店名稱","分店電話","分店地址","訂單短網址","包月方案項目","訂單付款時間"],prepaid_CheckoutLink:["姓名","店家名稱","分店名稱","分店電話","分店地址","訂單付款期限","訂單短網址","訂單成立時間","包月方案項目"],prepaid_Cancel:["姓名","店家名稱","分店名稱","分店電話","分店地址","訂單短網址","包月方案項目","訂單取消時間"],member_SendPassword:["帳號","密碼","店家名稱","店家電話","店家地址","店家網址"],orderAdd_PaySuccess:["姓名","店家名稱","分店名稱","服務項目","預約時間","分店電話","分店地址","訂單短網址","訂單付款時間"],orderAdd_CheckoutLink:["姓名","店家名稱","分店名稱","服務項目","預約時間","分店電話","分店地址","訂單短網址","訂單成立時間","訂單付款期限"],orderAdd_Cancel:["姓名","店家名稱","分店名稱","服務項目","預約時間","分店電話","分店地址","訂單短網址","訂單取消時間"]},mapDefaultPreview:{order_Qrcode:{sms:"您預約{店家名稱}{分店名稱}{預約時間}{服務項目}，詳情請見以下連結:{訂單短網址}",email:""},order_CheckoutLink:{sms:"您已預約{店家名稱}{分店名稱}的{預約時間}{服務項目}，請點連結立即付款:{訂單短網址}",email:""},order_Remind:{sms:"提醒您已預約{店家名稱}{分店名稱}的{預約時間} {服務項目}，若不克前往請提前與我們聯繫。",email:""},order_Cancel:{sms:"您於{店家名稱}{分店名稱}{預約時間}的預約已於{訂單取消時間}取消，倘若有任何問題，歡迎與我們聯繫!",email:""},order_ChangeTime:{sms:"您於{店家名稱}{分店名稱}的預約{服務項目}已改期到{預約時間}，如有問題請與我們聯繫！",email:""},order_RequestDeduct:{sms:"您已在{訂單成立時間}使用{包月方案名稱}預約{服務類型}{服務項目}，請點擊連結確認折抵:{訂單短網址}",email:""},prepaid_Qrcode:{sms:"您於{店家名稱}{分店名稱}購買的{包月方案項目}付款完成，您可開始使用您的包月方案",email:""},prepaid_CheckoutLink:{sms:"您已購買{店家名稱}的{包月方案項目}，請點連結立即付款:{訂單短網址}",email:""},prepaid_Cancel:{sms:"您於{店家名稱}{分店名稱}購買的{包月方案項目}已於{訂單取消時間}取消，如有任何疑問請聯繫我們",email:""},member_SendPassword:{sms:"感謝您註冊成為小捲尾寵物美容的會員，您的帳號：{帳號}密碼：{密碼}，請儘速登入會員中心修改密碼！",email:""},orderAdd_PaySuccess:{sms:"您的加購訂單已付款完成！點擊查看詳情：{訂單短網址}",email:""},orderAdd_CheckoutLink:{sms:"您的加購訂單已成立，請點連結立即付款:{訂單短網址}",email:""},orderAdd_Cancel:{sms:"您的加購訂單已於{訂單取消時間}取消，如有任何疑問請聯繫商家，點擊查看詳情:{訂單短網址}",email:""}}}},computed:{isSmsEnable:function(){return 1===this.defaultValue.sms.receive},isEmailEnable:function(){return 1===this.defaultValue.email.receive},isSmsUseTemplate:function(){return 1===this.defaultValue.sms.useCustomTemplate},isEmailUseTemplate:function(){return 1===this.defaultValue.email.useCustomTemplate},smsContent:function(){return this.defaultValue.sms.templateContentHTML?this.defaultValue.sms.templateContentHTML:this.defaultValue.sms.templateContent}},methods:{emitClose:function(){this.$emit("close"),this.$refs.form.resetFields()},updateSubmitData:function(){this.submitData=Object.assign({},this.defaultValue)},save:function(){var e=this;this.tryingStore=!0,this.$emit("save",this.getSubmitData(),function(){e.tryingStore=!1})},getSubmitData:function(){var e={},t=this.itemName.split("_")[0],s=this.itemName.split("_")[1];return this.defaultValue.sms.templateContent=this.$refs.smsTemplate.getTemplateContent(),this.defaultValue.sms.templateContentHTML=this.$refs.smsTemplate.getTemplateContentHTML(),Object(n["forOwn"])(this.defaultValue,function(a,i){void 0===e[i]&&(e[i]={}),e[i][t]=Object(l["a"])({},s,a)}),e},previewContent:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",s=t;return null===s?"":(Object.keys(this.mapTemplateString).forEach(function(t){s=s.replace(new RegExp("{".concat(t,"}"),"g"),e.mapTemplateString[t])}),s=s.replace(/\n/g,"<br>"),s)},updateTemplate:function(e){var t=this;this.defaultValue[e].templateContent=this.$refs["".concat(e,"Template")].getTemplateContent(),this.defaultValue[e].templateContentHTML=this.$refs["".concat(e,"Template")].getTemplateContentHTML(),this.$nextTick(function(){t.$forceUpdate()})}}},o=r,d=s("fd56d"),u=s("2877");function c(e){this["$style"]=d["default"].locals||d["default"]}var p=Object(u["a"])(o,a,i,!1,c,null,null);t["default"]=p.exports},fd56d:function(e,t,s){"use strict";var a=s("82da"),i=s.n(a);t["default"]=i.a}}]);
//# sourceMappingURL=chunk-41b7eed2.575a2b0d.js.map