(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0c9347"],{"57c2":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("el-card",{staticStyle:{"margin-bottom":"20px"}},[a("el-form-item",{staticStyle:{"margin-top":"20px"},attrs:{prop:"addressRestrictions."+e.itemIndex+".city",rules:{required:!0,message:"請選擇縣市"},label:"縣市"}},[a("el-select",{attrs:{placeholder:"請選擇縣市"},on:{change:e.onSelectCity},model:{value:e.defaultValue.city,callback:function(t){e.$set(e.defaultValue,"city",t)},expression:"defaultValue.city"}},e._l(e.citys,function(e,t){return a("el-option",{key:"member-city-"+t,attrs:{label:e.name,value:e.name}})}),1)],1),a("el-form-item",{staticStyle:{"margin-bottom":"20px"},attrs:{prop:"addressRestrictions."+e.itemIndex+".district",rules:{required:!0,message:"請選擇區域"},label:"區域（可複選）"}},[a("el-select",{attrs:{placeholder:"請選擇鄉鎮市區",multiple:""},model:{value:e.defaultValue.district,callback:function(t){e.$set(e.defaultValue,"district",t)},expression:"defaultValue.district"}},e._l(e.districts,function(e,t){return a("el-option",{key:"member-district-"+t,attrs:{label:e.name,value:e.name}})}),1)],1),e.showRemove?a("el-button",{staticClass:"is-round",attrs:{type:"danger"},on:{click:e.onRemove}},[a("BaseIcon",{attrs:{name:"trash-alt"}}),e._v(" 移除")],1):e._e()],1)},l=[],s=a("7e02"),n={props:{itemIndex:{type:Number,default:0},defaultValue:{type:Object,default:function(){}},citys:{type:Array,required:!0},showRemove:{type:Boolean,required:!0}},data:function(){return{taiwanCitys:s["A"],submitData:Object.assign({city:"",region:[]},this.defaultValue)}},computed:{districts:function(){return Object(s["f"])(this.defaultValue.city)}},methods:{onSelectCity:function(e){this.defaultValue.district=[]},onRemove:function(){this.$emit("remove",this.itemIndex)}}},r=n,c=a("2877"),u=Object(c["a"])(r,i,l,!1,null,null,null);t["default"]=u.exports}}]);
//# sourceMappingURL=chunk-2d0c9347.b8a32d4a.js.map