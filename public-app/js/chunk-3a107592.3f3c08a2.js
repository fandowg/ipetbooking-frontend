(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3a107592","chunk-2d0e2286"],{"1a67":function(e,t,n){e.exports={slide:"OrderBlock_slide_Wn2Hr","slide-reverse":"OrderBlock_slide-reverse_1BnSD","order-expanded":"OrderBlock_order-expanded_3oKeH"}},"2b88":function(e,t,n){"use strict";
/*! 
  * portal-vue © Thorsten Lünborg, 2019 
  * 
  * Version: 2.1.7
  * 
  * LICENCE: MIT 
  * 
  * https://github.com/linusborg/portal-vue
  * 
 */function a(e){return e&&"object"===typeof e&&"default"in e?e["default"]:e}Object.defineProperty(t,"__esModule",{value:!0});var i=a(n("2b0e"));function r(e){return r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function s(e){return o(e)||p(e)||m()}function o(e){if(Array.isArray(e)){for(var t=0,n=new Array(e.length);t<e.length;t++)n[t]=e[t];return n}}function p(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function m(){throw new TypeError("Invalid attempt to spread non-iterable instance")}var c="undefined"!==typeof window;function l(e){return Array.isArray(e)||"object"===r(e)?Object.freeze(e):e}function d(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return e.reduce(function(e,n){var a=n.passengers[0],i="function"===typeof a?a(t):n.passengers;return e.concat(i)},[])}function u(e,t){return e.map(function(e,t){return[t,e]}).sort(function(e,n){return t(e[1],n[1])||e[0]-n[0]}).map(function(e){return e[1]})}function z(e,t){return t.reduce(function(t,n){return e.hasOwnProperty(n)&&(t[n]=e[n]),t},{})}var f={},h={},v={},g=i.extend({data:function(){return{transports:f,targets:h,sources:v,trackInstances:c}},methods:{open:function(e){if(c){var t=e.to,n=e.from,a=e.passengers,r=e.order,s=void 0===r?1/0:r;if(t&&n&&a){var o={to:t,from:n,passengers:l(a),order:s},p=Object.keys(this.transports);-1===p.indexOf(t)&&i.set(this.transports,t,[]);var m=this.$_getTransportIndex(o),d=this.transports[t].slice(0);-1===m?d.push(o):d[m]=o,this.transports[t]=u(d,function(e,t){return e.order-t.order})}}},close:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=e.to,a=e.from;if(n&&(a||!1!==t)&&this.transports[n])if(t)this.transports[n]=[];else{var i=this.$_getTransportIndex(e);if(i>=0){var r=this.transports[n].slice(0);r.splice(i,1),this.transports[n]=r}}},registerTarget:function(e,t,n){c&&(this.trackInstances&&!n&&this.targets[e]&&console.warn("[portal-vue]: Target ".concat(e," already exists")),this.$set(this.targets,e,Object.freeze([t])))},unregisterTarget:function(e){this.$delete(this.targets,e)},registerSource:function(e,t,n){c&&(this.trackInstances&&!n&&this.sources[e]&&console.warn("[portal-vue]: source ".concat(e," already exists")),this.$set(this.sources,e,Object.freeze([t])))},unregisterSource:function(e){this.$delete(this.sources,e)},hasTarget:function(e){return!(!this.targets[e]||!this.targets[e][0])},hasSource:function(e){return!(!this.sources[e]||!this.sources[e][0])},hasContentFor:function(e){return!!this.transports[e]&&!!this.transports[e].length},$_getTransportIndex:function(e){var t=e.to,n=e.from;for(var a in this.transports[t])if(this.transports[t][a].from===n)return+a;return-1}}}),y=new g(f),b=1,_=i.extend({name:"portal",props:{disabled:{type:Boolean},name:{type:String,default:function(){return String(b++)}},order:{type:Number,default:0},slim:{type:Boolean},slotProps:{type:Object,default:function(){return{}}},tag:{type:String,default:"DIV"},to:{type:String,default:function(){return String(Math.round(1e7*Math.random()))}}},created:function(){var e=this;this.$nextTick(function(){y.registerSource(e.name,e)})},mounted:function(){this.disabled||this.sendUpdate()},updated:function(){this.disabled?this.clear():this.sendUpdate()},beforeDestroy:function(){y.unregisterSource(this.name),this.clear()},watch:{to:function(e,t){t&&t!==e&&this.clear(t),this.sendUpdate()}},methods:{clear:function(e){var t={from:this.name,to:e||this.to};y.close(t)},normalizeSlots:function(){return this.$scopedSlots.default?[this.$scopedSlots.default]:this.$slots.default},normalizeOwnChildren:function(e){return"function"===typeof e?e(this.slotProps):e},sendUpdate:function(){var e=this.normalizeSlots();if(e){var t={from:this.name,to:this.to,passengers:s(e),order:this.order};y.open(t)}else this.clear()}},render:function(e){var t=this.$slots.default||this.$scopedSlots.default||[],n=this.tag;return t&&this.disabled?t.length<=1&&this.slim?this.normalizeOwnChildren(t)[0]:e(n,[this.normalizeOwnChildren(t)]):this.slim?e():e(n,{class:{"v-portal":!0},style:{display:"none"},key:"v-portal-placeholder"})}}),w=i.extend({name:"portalTarget",props:{multiple:{type:Boolean,default:!1},name:{type:String,required:!0},slim:{type:Boolean,default:!1},slotProps:{type:Object,default:function(){return{}}},tag:{type:String,default:"div"},transition:{type:[String,Object,Function]}},data:function(){return{transports:y.transports,firstRender:!0}},created:function(){var e=this;this.$nextTick(function(){y.registerTarget(e.name,e)})},watch:{ownTransports:function(){this.$emit("change",this.children().length>0)},name:function(e,t){y.unregisterTarget(t),y.registerTarget(e,this)}},mounted:function(){var e=this;this.transition&&this.$nextTick(function(){e.firstRender=!1})},beforeDestroy:function(){y.unregisterTarget(this.name)},computed:{ownTransports:function(){var e=this.transports[this.name]||[];return this.multiple?e:0===e.length?[]:[e[e.length-1]]},passengers:function(){return d(this.ownTransports,this.slotProps)}},methods:{children:function(){return 0!==this.passengers.length?this.passengers:this.$scopedSlots.default?this.$scopedSlots.default(this.slotProps):this.$slots.default||[]},noWrapper:function(){var e=this.slim&&!this.transition;return e&&this.children().length>1&&console.warn("[portal-vue]: PortalTarget with `slim` option received more than one child element."),e}},render:function(e){var t=this.noWrapper(),n=this.children(),a=this.transition||this.tag;return t?n[0]:this.slim&&!a?e():e(a,{props:{tag:this.transition&&this.tag?this.tag:void 0},class:{"vue-portal-target":!0}},n)}}),x=0,S=["disabled","name","order","slim","slotProps","tag","to"],C=["multiple","transition"],T=i.extend({name:"MountingPortal",inheritAttrs:!1,props:{append:{type:[Boolean,String]},bail:{type:Boolean},mountTo:{type:String,required:!0},disabled:{type:Boolean},name:{type:String,default:function(){return"mounted_"+String(x++)}},order:{type:Number,default:0},slim:{type:Boolean},slotProps:{type:Object,default:function(){return{}}},tag:{type:String,default:"DIV"},to:{type:String,default:function(){return String(Math.round(1e7*Math.random()))}},multiple:{type:Boolean,default:!1},targetSlim:{type:Boolean},targetSlotProps:{type:Object,default:function(){return{}}},targetTag:{type:String,default:"div"},transition:{type:[String,Object,Function]}},created:function(){if("undefined"!==typeof document){var e=document.querySelector(this.mountTo);if(e){var t=this.$props;if(y.targets[t.name])t.bail?console.warn("[portal-vue]: Target ".concat(t.name," is already mounted.\n        Aborting because 'bail: true' is set")):this.portalTarget=y.targets[t.name];else{var n=t.append;if(n){var a="string"===typeof n?n:"DIV",i=document.createElement(a);e.appendChild(i),e=i}var r=z(this.$props,C);r.slim=this.targetSlim,r.tag=this.targetTag,r.slotProps=this.targetSlotProps,r.name=this.to,this.portalTarget=new w({el:e,parent:this.$parent||this,propsData:r})}}else console.error("[portal-vue]: Mount Point '".concat(this.mountTo,"' not found in document"))}},beforeDestroy:function(){var e=this.portalTarget;if(this.append){var t=e.$el;t.parentNode.removeChild(t)}e.$destroy()},render:function(e){if(!this.portalTarget)return console.warn("[portal-vue] Target wasn't mounted"),e();if(!this.$scopedSlots.manual){var t=z(this.$props,S);return e(_,{props:t,attrs:this.$attrs,on:this.$listeners,scopedSlots:this.$scopedSlots},this.$slots.default)}var n=this.$scopedSlots.manual({to:this.to});return Array.isArray(n)&&(n=n[0]),n||e()}});function O(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};e.component(t.portalName||"Portal",_),e.component(t.portalTargetName||"PortalTarget",w),e.component(t.MountingPortalName||"MountingPortal",T)}var k={install:O};t.default=k,t.Portal=_,t.PortalTarget=w,t.MountingPortal=T,t.Wormhole=y},"7e02":function(e,t,n){"use strict";n.d(t,"h",function(){return i}),n.d(t,"z",function(){return r}),n.d(t,"y",function(){return s}),n.d(t,"x",function(){return o}),n.d(t,"w",function(){return p}),n.d(t,"i",function(){return m}),n.d(t,"d",function(){return c}),n.d(t,"p",function(){return l}),n.d(t,"o",function(){return d}),n.d(t,"q",function(){return z}),n.d(t,"b",function(){return f}),n.d(t,"a",function(){return h}),n.d(t,"u",function(){return g}),n.d(t,"n",function(){return y}),n.d(t,"m",function(){return b}),n.d(t,"l",function(){return _}),n.d(t,"k",function(){return w}),n.d(t,"e",function(){return S}),n.d(t,"v",function(){return T}),n.d(t,"j",function(){return O}),n.d(t,"r",function(){return $}),n.d(t,"s",function(){return P}),n.d(t,"t",function(){return B}),n.d(t,"B",function(){return F}),n.d(t,"c",function(){return j}),n.d(t,"A",function(){return I}),n.d(t,"f",function(){return M}),n.d(t,"g",function(){return D});var a=n("f210");function i(e){var t={female:"小姐",male:"先生"};return t[e]}var r={activity:{name:"活動",icon:"icons"},course:{name:"課程",icon:"graduation-cap"},service:{name:"服務",icon:"hand-receiving"},reservation:{name:"餐飲訂位",icon:"utensils"},guide:{name:"導覽",icon:"headset"}};function s(e){return r[e].name}var o={0:{color:"info",text:"未上架",buttons:["edit","on","orders","calendarUrl"]},1:{color:"success",text:"上架中",buttons:["edit","off","orders","calendarUrl"]},2:{color:"warning",text:"新增中",buttons:["add"]}};function p(e,t){return o[e][t]}function m(e,t,n){if(n)return"".concat(e," / 無限");var a=0===e&&0===t,i=e>=t;return a?"未設定庫存":i?"已額滿":"".concat(e," / ").concat(t)}var c=["日","一","二","三","四","五","六"];var l={0:{color:"info",text:"已取消"},1:{color:"success",text:"已付款"},2:{color:"danger",text:"未付款"},3:{color:"success",text:"已付款"},4:{color:"success",text:"已付款"},5:{color:"success",text:"已付款"},6:{color:"success",text:"已付款"}};function d(e,t){return l[e][t]}var u={PAID:{color:"success",text:"已付款"},UNPAID:{color:"danger",text:"未付款"}};function z(e,t){var n="";return e?n=u[e][t]:"color"===t?n="info":"text"===t&&(n=""),n}var f={0:{color:"info",text:"已取消"},1:{color:"warning",text:"已確認"},2:{color:"warning",text:"已保留"},3:{color:"warning",text:"待報到"},4:{color:"success",text:"已報到"},5:{color:"danger",text:"未報到"},6:{color:"finish",text:"已完成"}};function h(e,t){return f[e][t]}var v={0:{color:"info",text:"已取消"},1:{color:"success",text:"已抵扣"},2:{color:"success",text:"已抵扣"},3:{color:"success",text:"已抵扣"},4:{color:"success",text:"已抵扣"},5:{color:"success",text:"已抵扣"},6:{color:"success",text:"已抵扣"}};function g(e,t){return v[e][t]}var y={manual:"手動",site:"線上"};function b(e){return y[e]}var _={Free:"免費",Cash:"到店付款(現金)",StoreCredit:"現場刷卡",Credit:"信用卡付款",Prepaid:"抵扣包月方案",Atm:"線下匯款",Vacc:"ATM虛擬帳戶"};function w(e){return _[e]}var x={0:{color:"danger",text:"未開放"},1:{color:"success",text:"開放中"}};function S(e,t){return x[e]&&x[e][t]}var C={0:{color:"danger",text:"已下架"},1:{color:"success",text:"上架中"}};function T(e,t){return C[e]&&C[e][t]}function O(e){return"fixed"===e?"元":e}var k={month:"月",year:"年",twoYear:"2年"};function $(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=k[e];return t?"/".concat(n):"".concat(n,"付")}function P(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=e.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");return"0"===n?"客製化方案":t?"NT$ ".concat(n):n}function B(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,t=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0;return 1===e?"".concat(t," / 無上限"):t===n?"已售完":"".concat(t," / ").concat(n)}var F={B2C:"個人",B2B:"公司",DONATE:"捐贈發票"},j={null:"無",0:"手機條碼",1:"自然人憑證條碼",2:"ezPay 電子發票載具"},I=[{districts:[{zip:"100",name:"中正區"},{zip:"103",name:"大同區"},{zip:"104",name:"中山區"},{zip:"105",name:"松山區"},{zip:"106",name:"大安區"},{zip:"108",name:"萬華區"},{zip:"110",name:"信義區"},{zip:"111",name:"士林區"},{zip:"112",name:"北投區"},{zip:"114",name:"內湖區"},{zip:"115",name:"南港區"},{zip:"116",name:"文山區"}],name:"臺北市"},{districts:[{zip:"200",name:"仁愛區"},{zip:"201",name:"信義區"},{zip:"202",name:"中正區"},{zip:"203",name:"中山區"},{zip:"204",name:"安樂區"},{zip:"205",name:"暖暖區"},{zip:"206",name:"七堵區"}],name:"基隆市"},{districts:[{zip:"207",name:"萬里區"},{zip:"208",name:"金山區"},{zip:"220",name:"板橋區"},{zip:"221",name:"汐止區"},{zip:"222",name:"深坑區"},{zip:"223",name:"石碇區"},{zip:"224",name:"瑞芳區"},{zip:"226",name:"平溪區"},{zip:"227",name:"雙溪區"},{zip:"228",name:"貢寮區"},{zip:"231",name:"新店區"},{zip:"232",name:"坪林區"},{zip:"233",name:"烏來區"},{zip:"234",name:"永和區"},{zip:"235",name:"中和區"},{zip:"236",name:"土城區"},{zip:"237",name:"三峽區"},{zip:"238",name:"樹林區"},{zip:"239",name:"鶯歌區"},{zip:"241",name:"三重區"},{zip:"242",name:"新莊區"},{zip:"243",name:"泰山區"},{zip:"244",name:"林口區"},{zip:"247",name:"蘆洲區"},{zip:"248",name:"五股區"},{zip:"249",name:"八里區"},{zip:"251",name:"淡水區"},{zip:"252",name:"三芝區"},{zip:"253",name:"石門區"}],name:"新北市"},{districts:[{zip:"209",name:"南竿鄉"},{zip:"210",name:"北竿鄉"},{zip:"211",name:"莒光鄉"},{zip:"212",name:"東引鄉"}],name:"連江縣"},{districts:[{zip:"260",name:"宜蘭市"},{zip:"263",name:"壯圍鄉"},{zip:"261",name:"頭城鎮"},{zip:"262",name:"礁溪鄉"},{zip:"264",name:"員山鄉"},{zip:"265",name:"羅東鎮"},{zip:"266",name:"三星鄉"},{zip:"267",name:"大同鄉"},{zip:"268",name:"五結鄉"},{zip:"269",name:"冬山鄉"},{zip:"270",name:"蘇澳鎮"},{zip:"272",name:"南澳鄉"},{zip:"290",name:"釣魚臺"}],name:"宜蘭縣"},{districts:[{zip:"300",name:"東區"},{zip:"300",name:"北區"},{zip:"300",name:"香山區"}],name:"新竹市"},{districts:[{zip:"308",name:"寶山鄉"},{zip:"302",name:"竹北市"},{zip:"303",name:"湖口鄉"},{zip:"304",name:"新豐鄉"},{zip:"305",name:"新埔鎮"},{zip:"306",name:"關西鎮"},{zip:"307",name:"芎林鄉"},{zip:"310",name:"竹東鎮"},{zip:"311",name:"五峰鄉"},{zip:"312",name:"橫山鄉"},{zip:"313",name:"尖石鄉"},{zip:"314",name:"北埔鄉"},{zip:"315",name:"峨眉鄉"}],name:"新竹縣"},{districts:[{zip:"320",name:"中壢區"},{zip:"324",name:"平鎮區"},{zip:"325",name:"龍潭區"},{zip:"326",name:"楊梅區"},{zip:"327",name:"新屋區"},{zip:"328",name:"觀音區"},{zip:"330",name:"桃園區"},{zip:"333",name:"龜山區"},{zip:"334",name:"八德區"},{zip:"335",name:"大溪區"},{zip:"336",name:"復興區"},{zip:"337",name:"大園區"},{zip:"338",name:"蘆竹區"}],name:"桃園市"},{districts:[{zip:"350",name:"竹南鎮"},{zip:"351",name:"頭份市"},{zip:"352",name:"三灣鄉"},{zip:"353",name:"南庄鄉"},{zip:"354",name:"獅潭鄉"},{zip:"356",name:"後龍鎮"},{zip:"357",name:"通霄鎮"},{zip:"358",name:"苑裡鎮"},{zip:"360",name:"苗栗市"},{zip:"361",name:"造橋鄉"},{zip:"362",name:"頭屋鄉"},{zip:"363",name:"公館鄉"},{zip:"364",name:"大湖鄉"},{zip:"365",name:"泰安鄉"},{zip:"366",name:"銅鑼鄉"},{zip:"367",name:"三義鄉"},{zip:"368",name:"西湖鄉"},{zip:"369",name:"卓蘭鎮"}],name:"苗栗縣"},{districts:[{zip:"400",name:"中區"},{zip:"401",name:"東區"},{zip:"402",name:"南區"},{zip:"403",name:"西區"},{zip:"404",name:"北區"},{zip:"406",name:"北屯區"},{zip:"407",name:"西屯區"},{zip:"408",name:"南屯區"},{zip:"411",name:"太平區"},{zip:"412",name:"大里區"},{zip:"413",name:"霧峰區"},{zip:"414",name:"烏日區"},{zip:"420",name:"豐原區"},{zip:"421",name:"后里區"},{zip:"422",name:"石岡區"},{zip:"423",name:"東勢區"},{zip:"424",name:"和平區"},{zip:"426",name:"新社區"},{zip:"427",name:"潭子區"},{zip:"428",name:"大雅區"},{zip:"429",name:"神岡區"},{zip:"432",name:"大肚區"},{zip:"433",name:"沙鹿區"},{zip:"434",name:"龍井區"},{zip:"435",name:"梧棲區"},{zip:"436",name:"清水區"},{zip:"437",name:"大甲區"},{zip:"438",name:"外埔區"},{zip:"439",name:"大安區"}],name:"臺中市"},{districts:[{zip:"500",name:"彰化市"},{zip:"502",name:"芬園鄉"},{zip:"503",name:"花壇鄉"},{zip:"504",name:"秀水鄉"},{zip:"505",name:"鹿港鎮"},{zip:"506",name:"福興鄉"},{zip:"507",name:"線西鄉"},{zip:"508",name:"和美鎮"},{zip:"509",name:"伸港鄉"},{zip:"510",name:"員林市"},{zip:"511",name:"社頭鄉"},{zip:"512",name:"永靖鄉"},{zip:"513",name:"埔心鄉"},{zip:"514",name:"溪湖鎮"},{zip:"515",name:"大村鄉"},{zip:"516",name:"埔鹽鄉"},{zip:"520",name:"田中鎮"},{zip:"521",name:"北斗鎮"},{zip:"522",name:"田尾鄉"},{zip:"523",name:"埤頭鄉"},{zip:"524",name:"溪州鄉"},{zip:"525",name:"竹塘鄉"},{zip:"526",name:"二林鎮"},{zip:"527",name:"大城鄉"},{zip:"528",name:"芳苑鄉"},{zip:"530",name:"二水鄉"}],name:"彰化縣"},{districts:[{zip:"540",name:"南投市"},{zip:"541",name:"中寮鄉"},{zip:"542",name:"草屯鎮"},{zip:"544",name:"國姓鄉"},{zip:"545",name:"埔里鎮"},{zip:"546",name:"仁愛鄉"},{zip:"551",name:"名間鄉"},{zip:"552",name:"集集鎮"},{zip:"553",name:"水里鄉"},{zip:"555",name:"魚池鄉"},{zip:"556",name:"信義鄉"},{zip:"557",name:"竹山鎮"},{zip:"558",name:"鹿谷鄉"}],name:"南投縣"},{districts:[{zip:"600",name:"西區"},{zip:"600",name:"東區"}],name:"嘉義市"},{districts:[{zip:"602",name:"番路鄉"},{zip:"603",name:"梅山鄉"},{zip:"604",name:"竹崎鄉"},{zip:"605",name:"阿里山鄉"},{zip:"606",name:"中埔鄉"},{zip:"607",name:"大埔鄉"},{zip:"608",name:"水上鄉"},{zip:"611",name:"鹿草鄉"},{zip:"612",name:"太保市"},{zip:"613",name:"朴子市"},{zip:"614",name:"東石鄉"},{zip:"615",name:"六腳鄉"},{zip:"616",name:"新港鄉"},{zip:"621",name:"民雄鄉"},{zip:"622",name:"大林鎮"},{zip:"623",name:"溪口鄉"},{zip:"624",name:"義竹鄉"},{zip:"625",name:"布袋鎮"}],name:"嘉義縣"},{districts:[{zip:"630",name:"斗南鎮"},{zip:"631",name:"大埤鄉"},{zip:"632",name:"虎尾鎮"},{zip:"633",name:"土庫鎮"},{zip:"634",name:"褒忠鄉"},{zip:"635",name:"東勢鄉"},{zip:"636",name:"臺西鄉"},{zip:"637",name:"崙背鄉"},{zip:"638",name:"麥寮鄉"},{zip:"640",name:"斗六市"},{zip:"643",name:"林內鄉"},{zip:"646",name:"古坑鄉"},{zip:"647",name:"莿桐鄉"},{zip:"648",name:"西螺鎮"},{zip:"649",name:"二崙鄉"},{zip:"651",name:"北港鎮"},{zip:"652",name:"水林鄉"},{zip:"653",name:"口湖鄉"},{zip:"654",name:"四湖鄉"},{zip:"655",name:"元長鄉"}],name:"雲林縣"},{districts:[{zip:"700",name:"中西區"},{zip:"701",name:"東區"},{zip:"702",name:"南區"},{zip:"704",name:"北區"},{zip:"708",name:"安平區"},{zip:"709",name:"安南區"},{zip:"710",name:"永康區"},{zip:"711",name:"歸仁區"},{zip:"712",name:"新化區"},{zip:"713",name:"左鎮區"},{zip:"714",name:"玉井區"},{zip:"715",name:"楠西區"},{zip:"716",name:"南化區"},{zip:"717",name:"仁德區"},{zip:"718",name:"關廟區"},{zip:"719",name:"龍崎區"},{zip:"720",name:"官田區"},{zip:"721",name:"麻豆區"},{zip:"722",name:"佳里區"},{zip:"723",name:"西港區"},{zip:"724",name:"七股區"},{zip:"725",name:"將軍區"},{zip:"726",name:"學甲區"},{zip:"727",name:"北門區"},{zip:"730",name:"新營區"},{zip:"731",name:"後壁區"},{zip:"732",name:"白河區"},{zip:"733",name:"東山區"},{zip:"734",name:"六甲區"},{zip:"735",name:"下營區"},{zip:"736",name:"柳營區"},{zip:"737",name:"鹽水區"},{zip:"741",name:"善化區"},{zip:"744",name:"新市區"},{zip:"742",name:"大內區"},{zip:"743",name:"山上區"},{zip:"745",name:"安定區"}],name:"臺南市"},{districts:[{zip:"800",name:"新興區"},{zip:"801",name:"前金區"},{zip:"802",name:"苓雅區"},{zip:"803",name:"鹽埕區"},{zip:"804",name:"鼓山區"},{zip:"805",name:"旗津區"},{zip:"806",name:"前鎮區"},{zip:"807",name:"三民區"},{zip:"811",name:"楠梓區"},{zip:"812",name:"小港區"},{zip:"813",name:"左營區"},{zip:"814",name:"仁武區"},{zip:"815",name:"大社區"},{zip:"817",name:"東沙群島"},{zip:"819",name:"南沙群島"},{zip:"820",name:"岡山區"},{zip:"821",name:"路竹區"},{zip:"822",name:"阿蓮區"},{zip:"823",name:"田寮區"},{zip:"824",name:"燕巢區"},{zip:"825",name:"橋頭區"},{zip:"826",name:"梓官區"},{zip:"827",name:"彌陀區"},{zip:"828",name:"永安區"},{zip:"829",name:"湖內區"},{zip:"830",name:"鳳山區"},{zip:"831",name:"大寮區"},{zip:"832",name:"林園區"},{zip:"833",name:"鳥松區"},{zip:"840",name:"大樹區"},{zip:"842",name:"旗山區"},{zip:"843",name:"美濃區"},{zip:"844",name:"六龜區"},{zip:"845",name:"內門區"},{zip:"846",name:"杉林區"},{zip:"847",name:"甲仙區"},{zip:"848",name:"桃源區"},{zip:"849",name:"那瑪夏區"},{zip:"851",name:"茂林區"},{zip:"852",name:"茄萣區"}],name:"高雄市"},{districts:[{zip:"880",name:"馬公市"},{zip:"881",name:"西嶼鄉"},{zip:"882",name:"望安鄉"},{zip:"883",name:"七美鄉"},{zip:"884",name:"白沙鄉"},{zip:"885",name:"湖西鄉"}],name:"澎湖縣"},{districts:[{zip:"890",name:"金沙鎮"},{zip:"891",name:"金湖鎮"},{zip:"892",name:"金寧鄉"},{zip:"893",name:"金城鎮"},{zip:"894",name:"烈嶼鄉"},{zip:"896",name:"烏坵鄉"}],name:"金門縣"},{districts:[{zip:"900",name:"屏東市"},{zip:"901",name:"三地門鄉"},{zip:"902",name:"霧臺鄉"},{zip:"903",name:"瑪家鄉"},{zip:"904",name:"九如鄉"},{zip:"905",name:"里港鄉"},{zip:"906",name:"高樹鄉"},{zip:"907",name:"鹽埔鄉"},{zip:"908",name:"長治鄉"},{zip:"909",name:"麟洛鄉"},{zip:"911",name:"竹田鄉"},{zip:"912",name:"內埔鄉"},{zip:"913",name:"萬丹鄉"},{zip:"920",name:"潮州鎮"},{zip:"921",name:"泰武鄉"},{zip:"922",name:"來義鄉"},{zip:"923",name:"萬巒鄉"},{zip:"924",name:"崁頂鄉"},{zip:"925",name:"新埤鄉"},{zip:"926",name:"南州鄉"},{zip:"927",name:"林邊鄉"},{zip:"928",name:"東港鎮"},{zip:"929",name:"琉球鄉"},{zip:"931",name:"佳冬鄉"},{zip:"932",name:"新園鄉"},{zip:"940",name:"枋寮鄉"},{zip:"941",name:"枋山鄉"},{zip:"942",name:"春日鄉"},{zip:"943",name:"獅子鄉"},{zip:"944",name:"車城鄉"},{zip:"945",name:"牡丹鄉"},{zip:"946",name:"恆春鎮"},{zip:"947",name:"滿州鄉"}],name:"屏東縣"},{districts:[{zip:"950",name:"臺東市"},{zip:"951",name:"綠島鄉"},{zip:"952",name:"蘭嶼鄉"},{zip:"953",name:"延平鄉"},{zip:"954",name:"卑南鄉"},{zip:"955",name:"鹿野鄉"},{zip:"956",name:"關山鎮"},{zip:"957",name:"海端鄉"},{zip:"958",name:"池上鄉"},{zip:"959",name:"東河鄉"},{zip:"961",name:"成功鎮"},{zip:"962",name:"長濱鄉"},{zip:"963",name:"太麻里鄉"},{zip:"964",name:"金峰鄉"},{zip:"965",name:"大武鄉"},{zip:"966",name:"達仁鄉"}],name:"臺東縣"},{districts:[{zip:"970",name:"花蓮市"},{zip:"971",name:"新城鄉"},{zip:"972",name:"秀林鄉"},{zip:"973",name:"吉安鄉"},{zip:"974",name:"壽豐鄉"},{zip:"975",name:"鳳林鎮"},{zip:"976",name:"光復鄉"},{zip:"977",name:"豐濱鄉"},{zip:"978",name:"瑞穗鄉"},{zip:"979",name:"萬榮鄉"},{zip:"981",name:"玉里鎮"},{zip:"982",name:"卓溪鄉"},{zip:"983",name:"富里鄉"}],name:"花蓮縣"}];function M(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(!e)return[];var t=[];return I.some(function(n){return n.name===e&&(t=Object(a["a"])(n.districts),!0)}),t}function D(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return e&&t?M(e).filter(function(e){return e.name===t})[0].zip:""}},daf7:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("el-card",{staticClass:"box-card",attrs:{shadow:"never"}},[n("div",{attrs:{slot:"header"},slot:"header"},[n("el-row",{staticClass:"Jost",attrs:{gutter:15}},[n("el-col",{staticClass:"mb-2 mb-sm-0",attrs:{sm:6,span:24}},[n("el-button",{staticClass:"large-btn",attrs:{type:"primary"},on:{click:e.redirectOrders}},[e._v("查看訂單紀錄"),n("BaseIcon",{attrs:{name:"file-invoice-dollar"}})],1)],1),n("el-col",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"mb-2 mb-sm-0",attrs:{sm:6,span:24}},[n("el-card",{staticClass:"card-statistics"},[n("div",{staticClass:"card-statistics-info"},[n("div",{staticClass:"card-statistics-title"},[e._v("近七日預約次數")]),n("div",{staticClass:"card-statistics-count"},[e._v(e._s(e.orderInfo.ordersCount))])]),n("el-avatar",{attrs:{size:50}},[n("BaseIcon",{attrs:{name:"flag"}})],1)],1)],1),n("el-col",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"mb-2 mb-sm-0",attrs:{sm:6,span:24}},[n("el-card",{staticClass:"card-statistics"},[n("div",{staticClass:"card-statistics-info"},[n("div",{staticClass:"card-statistics-title"},[e._v("包月方案銷售次數")]),n("div",{staticClass:"card-statistics-count"},[e._v(e._s(e.orderInfo.prepaidOrdersCount))])]),n("el-avatar",{attrs:{size:50}},[n("BaseIcon",{attrs:{name:"piggy-bank"}})],1)],1)],1),n("el-col",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"mb-2 mb-sm-0",attrs:{sm:6,span:24}},[n("el-card",{staticClass:"card-statistics"},[n("div",{staticClass:"card-statistics-info"},[n("div",{staticClass:"card-statistics-title"},[e._v("近七日銷售總額")]),n("div",{staticClass:"card-statistics-count"},[e._v("$"+e._s(e.orderInfo.totalSales))])]),n("el-avatar",{attrs:{size:50}},[n("BaseIcon",{attrs:{name:"dollar-sign"}})],1)],1)],1)],1)],1),n("div",{staticClass:"header"},[n("h3",{staticClass:"block-title"},[e._v("\n      最新預約紀錄\n    ")])]),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{"element-loading-text":"取得訂單資訊中",data:e.orderInfo.orders,"default-sort":{prop:"created",order:"descending"},"row-class-name":e.tableRowClassName,"row-key":e.getRowKeys,"expand-row-keys":e.expandRowKeys},on:{"cell-click":e.onCellClick,"expand-change":e.handleExpand}},[n("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[n("div",{class:e.$style["order-expanded"]},[n("div",{staticClass:"item"},[n("div",[n("div",{staticClass:"Jost"},[e._v(e._s("#"+a.id))])]),n("div",[0===a.status?[n("BaseStateLabel",{attrs:{state:"info",text:""}},[e._v(e._s(e._f("bookingStatusFilter")(a.status,"text")))])]:[n("BaseStateLabel",{attrs:{state:e._f("paymentStatusMapFilter")(a.paymentStatus,"color"),text:""}},[e._v(e._s(e._f("paymentStatusMapFilter")(a.paymentStatus,"text")))])]],2),n("div",{staticStyle:{width:"30%"}},[n("BaseStateLabel",{attrs:{state:"info",text:""}},[e._v(e._s(e._f("orderPaymentMethodFilter")(a.paymentMethod)))])],1),n("div",{staticClass:"order-table-items"},[e._l(a.params,function(t,a){return n("div",{key:a,staticClass:"order-item"},[n("div",[n("div",{staticStyle:{color:"#41695b"}},["coupon"===t.type?n("span",[e._v("優惠券")]):e._e(),"+"===t.type?n("span",[e._v("加價")]):e._e(),"-"===t.type?n("span",[e._v("減價")]):e._e(),"%"===t.type?n("span",[e._v("折扣")]):e._e(),e._v("\n                    "+e._s(t.title)+"\n                  ")])]),n("div",[n("div",{staticClass:"Jost"},[e._v(e._s(t.total))])])])}),n("div",{staticClass:"order-item"},[n("div",[e._v("小計")]),n("div",[e._v(e._s(a.payTotal))])])],2)]),e._l(a.childrenOrders,function(t,a){return n("div",{key:a,staticClass:"item"},[n("div",[n("div",{staticClass:"Jost"},[e._v(e._s("#"+t.id))])]),n("div",[n("BaseStateLabel",{attrs:{state:e._f("orderStatusFilter")(t.status,"color"),text:""}},[e._v(e._s(e._f("orderStatusFilter")(t.status,"text")))])],1),n("div",{staticStyle:{width:"30%"}},[n("BaseStateLabel",{attrs:{state:"info",text:""}},[e._v(e._s(e._f("orderPaymentMethodFilter")(t.paymentMethod)))])],1),n("div",{staticClass:"order-table-items"},[e._l(t.items,function(t,a){return n("div",{key:a,staticClass:"order-item"},[n("div",[n("div",{staticStyle:{color:"#41695b"}},["coupon"===t.type?n("span",[e._v("優惠券")]):e._e(),"+"===t.type?n("span",[e._v("加價")]):e._e(),"-"===t.type?n("span",[e._v("減價")]):e._e(),"%"===t.type?n("span",[e._v("折扣")]):e._e(),e._v("\n                    "+e._s(t.title)+"\n                  ")])]),n("div",[n("div",{staticClass:"Jost"},[e._v(e._s(t.total))])])])}),n("div",{staticClass:"order-item"},[n("div",[e._v("小計")]),n("div",[e._v(e._s(t.payTotal))])])],2)])}),n("div",{staticClass:"footer"},[n("div",{staticClass:"total Jost"},[e._v("應付總額 $"+e._s(a.allPayTotal)+" ")]),a.allRefundTotal>0?n("div",{staticClass:"total Jost alert-word"},[e._v("退款 - "+e._s(a.allRefundTotal))]):e._e(),n("div",{staticClass:"total Jost"},[e._v("實付總額 $"+e._s(a.allActualPayTotal)+" ")]),a.allUnpaidTotal>0?n("div",{staticClass:"unpaid Jost"},[e._v("未付款金額 $"+e._s(a.allUnpaidTotal))]):e._e()])],2)]}}])}),n("el-table-column",{attrs:{label:"#訂單編號",prop:"created","min-width":"150",sortable:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[n("div",{staticClass:"Jost"},[e._v(e._s("#"+a.id))]),n("div",[e._v(e._s(e._f("formatDate")(a.created,"dateTime")))])]}}])}),n("el-table-column",{attrs:{label:"付款狀態與方式",prop:"paymentMethod","min-width":"150",sortable:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[0===a.status?[n("BaseStateLabel",{attrs:{state:"info",text:""}},[e._v(e._s(e._f("bookingStatusFilter")(a.status,"text")))])]:[n("BaseStateLabel",{attrs:{state:e._f("paymentStatusMapFilter")(a.paymentStatus,"color"),text:""}},[e._v(e._s(e._f("paymentStatusMapFilter")(a.paymentStatus,"text")))]),n("br"),n("BaseStateLabel",{attrs:{state:"info",text:""}},[e._v(e._s(e._f("orderPaymentMethodFilter")(a.paymentMethod)))])]]}}])}),n("el-table-column",{attrs:{label:"預約狀態",prop:"status","min-width":"120",sortable:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[n("BaseStateLabel",{attrs:{state:"info",text:""}},[e._v(e._s(e._f("bookingStatusFilter")(a.status,"text")))])]}}])}),n("el-table-column",{attrs:{label:"使用人資訊",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[n("div",[e._v(e._s(a.fullName)+" "+e._s(e._f("genderFilter")(a.gender)))]),n("div",[e._v(e._s(a.phoneCode+" "+a.phoneNumber))])]}}])}),n("el-table-column",{attrs:{label:"訂購項目",prop:"date","min-width":"140",sortable:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[n("div",[n("b",[e._v(e._s(a.productName))]),n("br"),e._v("\n          "+e._s(a.params[0].title)+"\n        ")]),n("div",[e._v(e._s(e._f("formatDate")(a.date))+" "+e._s(a.time))])]}}])}),n("el-table-column",{attrs:{label:"總金額","min-width":"80"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[n("div",{staticClass:"Jost"},[e._v("$"+e._s(a.allActualPayTotal))])]}}])}),n("el-table-column",{attrs:{"min-width":"40"}},[n("el-tooltip",{attrs:{content:"查看訂單詳情",placement:"top"}},[n("el-button",{attrs:{type:"text"}},[n("BaseIcon",{attrs:{name:"ellipsis-v"}})],1)],1)],1)],1),n("el-drawer",{ref:"orderFormEdit",staticClass:"only-close",attrs:{visible:e.drawerVisible,"append-to-body":"",size:e.$root.isSmallDevice?"100%":"90%","destroy-on-close":"","wrapper-closable":!1,"custom-class":"order-drawer"},on:{"update:visible":function(t){e.drawerVisible=t},closed:function(t){e.componentKey++}}},[n("OrderForm",{key:e.componentKey,ref:"orderDetail",attrs:{"default-value":e.drawerOrderData},on:{"update:defaultValue":function(t){e.drawerOrderData=t},"update:default-value":function(t){e.drawerOrderData=t},update:e.tryToFetchOrders}})],1)],1)},i=[],r=n("4795"),s=n.n(r),o=n("cb0c"),p=n("a315"),m=n("7e02"),c=n("6bea"),l=n("2b88"),d={components:{BaseStateLabel:function(){return Object(p["a"])(n.e("chunk-12bed50d").then(n.bind(null,"38d1")))},OrderDetail:function(){return Object(p["a"])(n.e("chunk-1542bfb8").then(n.bind(null,"2fe5")))},OrderForm:function(){return Object(p["a"])(Promise.all([n.e("chunk-f55c2908"),n.e("chunk-3f4a3bbc"),n.e("chunk-0bd33b9d"),n.e("chunk-177d8412")]).then(n.bind(null,"40c0")))},PortalTarget:l["PortalTarget"]},filters:{genderFilter:m["h"],orderStatusFilter:m["o"],bookingStatusFilter:m["a"],orderPaymentMethodFilter:m["k"],orderSourceFilter:m["m"],formatDate:c["a"],paymentStatusMapFilter:m["q"]},data:function(){return{componentKey:0,loading:!1,drawerVisible:!1,drawerOrderData:"",getRowKeys:function(e){return e.id},expandRowKeys:[],orderInfo:{ordersCount:0,prepaidOrdersCount:0,totalSales:0,orders:[]}}},created:function(){this.tryToFetchOrders()},methods:{tryToFetchOrders:function(){var e=Object(o["a"])(s.a.mark(function e(){return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.loading=!0,e.next=3,this.$store.dispatch("dashboard/fetchOrders");case 3:this.orderInfo=e.sent,this.loading=!1;case 5:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),redirectOrders:function(){this.$router.push({name:"orders"})},tableRowClassName:function(e){var t=e.row,n=t.status,a=t.groupSize/t.usedSize;return 0===n?"order--canceled":1===a?"order--used":t.id===this.expandRowKeys[0]?"expandedRow":void 0},tryToFetchList:function(){var e=Object(o["a"])(s.a.mark(function e(){return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$store.dispatch("order/fetchList");case 2:this.orderInfo=e.sent;case 3:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),onCellClick:function(e,t,n){"expand"!==t.type&&this.tryToGetOrder(e.id)},tryToGetOrder:function(){var e=Object(o["a"])(s.a.mark(function e(t){return s.a.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return this.tryingToGetOrder=!0,e.next=3,this.$store.dispatch("order/fetchSingle",t);case 3:this.drawerOrderData=e.sent,this.tryingToGetOrder=!1,this.drawerVisible=!0;case 6:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}(),excludeCanceledPrice:function(e){var t=e.allTotal;return e.addOrders.length&&(t=e.addOrders.map(function(e){return e.items}).flat().reduce(function(e,t){return 0===t.status?e+t.price:e},t)),t},handleExpand:function(e){this.expandRowKeys[0]===e.id?this.expandRowKeys=[]:this.expandRowKeys=[e.id]}}},u=d,z=n("e26a"),f=n("2877");function h(e){this["$style"]=z["default"].locals||z["default"]}var v=Object(f["a"])(u,a,i,!1,h,null,null);t["default"]=v.exports},e26a:function(e,t,n){"use strict";var a=n("1a67"),i=n.n(a);t["default"]=i.a}}]);
//# sourceMappingURL=chunk-3a107592.3f3c08a2.js.map