(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8b9823b0"],{"2acd":function(t,e,i){"use strict";var s=i("4785"),a=i.n(s);e["default"]=a.a},"31d7":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("h4",{staticClass:"form-block-title"},[t._v("販售設定")]),i("el-form",{ref:"form",attrs:{model:t.submitData,"label-position":"top"}},t._l(t.submitData.prepaids,function(e,s){return i("div",{key:s},[i("div",{class:t.$style.switch},[t.isEditMode?i("span",[t._v(t._s(e.sizeTitle))]):i("span",[t._v(t._s(e.title))]),i("el-form-item",{attrs:{prop:"state"}},[i("el-switch",{attrs:{"active-text":"開放","inactive-text":"關閉","active-value":1,"inactive-value":0},model:{value:e.state,callback:function(i){t.$set(e,"state",i)},expression:"item.state"}})],1)],1),i("el-row",{attrs:{gutter:20}},[i("el-col",{attrs:{span:12}},[i("el-form-item",{attrs:{prop:"basePrice",label:"原價"}},[i("el-input",{model:{value:e.basePrice,callback:function(i){t.$set(e,"basePrice",t._n(i))},expression:"item.basePrice"}},[i("span",{staticStyle:{"margin-right":"10px"},attrs:{slot:"suffix"},slot:"suffix"},[t._v("元")])])],1)],1),i("el-col",{attrs:{span:12}},[i("el-form-item",{attrs:{prop:"prepaids["+s+"].price",rules:{type:"number",min:0,message:"請輸入數字",trigger:"blur"},label:"售價"}},[i("el-input",{model:{value:e.price,callback:function(i){t.$set(e,"price",t._n(i))},expression:"item.price"}},[i("span",{staticStyle:{"margin-right":"10px"},attrs:{slot:"suffix"},slot:"suffix"},[t._v("元")])])],1)],1)],1)],1)}),0)],1)},a=[],r={filters:{},props:{products:{type:Array,required:!0},category:{type:Array,required:!0},prices:{type:Array,required:!0},defaultValue:{type:Object,default:function(){}}},data:function(){return{}},computed:{submitData:{get:function(){return this.defaultValue},set:function(t){this.$emit("update:defaultValue",t)}},isEditMode:function(){return!!this.defaultValue.groupOrdering}},watch:{"submitData.categoryId":{handler:function(t){this.doSetSizes()}}},created:function(){this.isEditMode||this.doSetSizes()},mounted:function(){},methods:{doSetSizes:function(){var t=this,e=this.category.find(function(e){return e.id===t.submitData.categoryId}).children;this.submitData.prepaids=e.map(function(t){return{sizeId:t.id,title:t.categoryTitle,basePrice:0,price:0,state:0}})},validate:function(){return this.$refs.form.validate()}}},n=r,l=i("2acd"),c=i("2877");function u(t){this["$style"]=l["default"].locals||l["default"]}var o=Object(c["a"])(n,s,a,!1,u,null,null);e["default"]=o.exports},4785:function(t,e,i){t.exports={slide:"Step4Prices_slide_niFGH","slide-reverse":"Step4Prices_slide-reverse_1diAc",switch:"Step4Prices_switch_9u3oS"}}}]);
//# sourceMappingURL=chunk-8b9823b0.e23e00a0.js.map