(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b0d2da58"],{"6b1a":function(t,e,a){t.exports={slide:"PetForm_slide_15txt","slide-reverse":"PetForm_slide-reverse_1fXvD",footer:"PetForm_footer_3niTu"}},"88df":function(t,e,a){"use strict";var i=a("6b1a"),s=a.n(i);e["default"]=s.a},eae8:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("el-form",{ref:"form",staticClass:"el-form--floating",attrs:{model:t.submitData,rules:t.submitRules,"label-position":"left","validate-on-rule-change":!1,"label-width":"100px"}},[a("el-form-item",{staticClass:"isAvatar"},[a("BaseUpload",{attrs:{resource:"pet",dir:"pet",circle:""},model:{value:t.submitData.avatar,callback:function(e){t.$set(t.submitData,"avatar",e)},expression:"submitData.avatar"}})],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{prop:"name",label:"寵物名"}},[a("el-input",{attrs:{placeholder:"請輸入寵物名"},model:{value:t.submitData.name,callback:function(e){t.$set(t.submitData,"name",e)},expression:"submitData.name"}})],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"類別",prop:"categoryId"}},[a("el-select",{on:{change:t.changeCategory},model:{value:t.submitData.categoryId,callback:function(e){t.$set(t.submitData,"categoryId",e)},expression:"submitData.categoryId"}},t._l(t.category,function(t,e){return a("el-option",{key:e,attrs:{value:t.id,label:t.title}})}),1)],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"體型",prop:"sizeId"}},[a("el-select",{model:{value:t.submitData.sizeId,callback:function(e){t.$set(t.submitData,"sizeId",e)},expression:"submitData.sizeId"}},[t.submitData.categoryId?t._l(t.category[t.parentCategoryIndex].children,function(t,e){return a("el-option",{key:e,attrs:{label:t.title,value:t.id}})}):t._e()],2)],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{prop:"breed",label:"品種"}},[a("el-input",{attrs:{placeholder:"請輸入品種"},model:{value:t.submitData.breed,callback:function(e){t.$set(t.submitData,"breed",e)},expression:"submitData.breed"}})],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"性別"}},[a("el-select",{model:{value:t.submitData.gender,callback:function(e){t.$set(t.submitData,"gender",e)},expression:"submitData.gender"}},[a("el-option",{attrs:{label:"母",value:"female"}}),a("el-option",{attrs:{label:"公",value:"male"}})],1)],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"生日"}},[a("el-date-picker",{attrs:{type:"date","value-format":"yyyy-MM-dd"},model:{value:t.submitData.birthday,callback:function(e){t.$set(t.submitData,"birthday",e)},expression:"submitData.birthday"}})],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"個性"}},[a("el-checkbox-group",{model:{value:t.submitData.questions.personality,callback:function(e){t.$set(t.submitData.questions,"personality",e)},expression:"submitData.questions.personality"}},t._l(t.questions.personality,function(e){return a("el-checkbox",{key:e.name,attrs:{label:e.title}},[t._v(t._s(e.title))])}),1)],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"健康狀況"}},[a("el-checkbox-group",{model:{value:t.healthy,callback:function(e){t.healthy=e},expression:"healthy"}},[t._l(t.questions.healthy,function(e){return[a("el-checkbox",{key:e.name,attrs:{label:e.title}},[t._v(t._s(e.title))]),t.healthy.includes("其他疾病")&&"other"===e.name?a("el-input",{key:e.title,attrs:{placeholder:"請填寫其他疾病"},model:{value:e.text,callback:function(a){t.$set(e,"text",a)},expression:"item.text"}}):t._e()]})],2)],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"行為"}},[a("el-checkbox-group",{model:{value:t.behavior,callback:function(e){t.behavior=e},expression:"behavior"}},[t._l(t.questions.behavior,function(e){return[a("div",{key:e.title,staticClass:"inline-checkbox-input"},[a("el-checkbox",{key:e.name,attrs:{label:e.title}},[t._v(t._s(e.title)+" ")]),a("el-input",{model:{value:e.text,callback:function(a){t.$set(e,"text",a)},expression:"item.text"}})],1)]})],2)],1),a("el-form-item",{staticClass:"el-form-item--normal-margin",attrs:{label:"疫苗"}},[a("el-radio",{attrs:{label:1},model:{value:t.submitData.questions.vaccine,callback:function(e){t.$set(t.submitData.questions,"vaccine",e)},expression:"submitData.questions.vaccine"}},[t._v("1 劑")]),a("el-radio",{attrs:{label:2},model:{value:t.submitData.questions.vaccine,callback:function(e){t.$set(t.submitData.questions,"vaccine",e)},expression:"submitData.questions.vaccine"}},[t._v("2 劑")]),a("el-radio",{attrs:{label:3},model:{value:t.submitData.questions.vaccine,callback:function(e){t.$set(t.submitData.questions,"vaccine",e)},expression:"submitData.questions.vaccine"}},[t._v("3 劑")])],1),a("el-form-item",{staticClass:"not-inline",attrs:{label:"內部備註"}},[a("el-input",{attrs:{type:"textarea",autosize:{minRows:3}},model:{value:t.submitData.note,callback:function(e){t.$set(t.submitData,"note",e)},expression:"submitData.note"}})],1)],1),a("div",{class:t.$style.footer},[a("el-button",{staticClass:"is-round",on:{click:t.emitClose}},[a("BaseIcon",{attrs:{name:"times"}}),t._v(" 取消")],1),a("el-button",{staticClass:"is-round",attrs:{type:"primary",loading:t.tryingStore},on:{click:t.tryToStore}},[a("BaseIcon",{attrs:{name:"check"}}),t._v(" 儲存")],1)],1)],1)},s=[],r=a("4795"),n=a.n(r),l=a("cb0c"),o=a("a315"),u=a("2ef0"),c=a("b155"),m={components:{BaseInputFloatingLabel:function(){return Object(o["a"])(a.e("chunk-2d0b235b").then(a.bind(null,"22af")))},BaseUpload:function(){return Object(o["a"])(a.e("chunk-3559b494").then(a.bind(null,"0ac6")))}},props:{defaultValue:{type:Object,default:function(){}},category:{type:Array,default:function(){return[]}}},data:function(){return{tryingStore:!1,questions:Object(u["cloneDeep"])(c["a"]),submitData:{categoryId:"",sizeId:"",name:"",birthday:"",avatar:"",gender:"",breed:"",note:"",memberId:this.defaultValue.id,questions:{personality:[],healthy:[],behavior:[],vaccine:0}},behavior:[],healthy:[],parentCategoryIndex:0}},computed:{submitRules:function(){return{avatar:[{required:!0,message:"請上傳頭像",trigger:"change"}],name:[{required:!0,message:"請填寫寵物名",trigger:"blur"}],categoryId:[{required:!0,message:"請選擇類別",trigger:"change"}],sizeId:[{required:!0,message:"請選擇體型"}],gender:[{required:!0,message:"請選擇性別",trigger:"change"}],birthday:[{required:!0,message:"請選擇生日",trigger:"blur"}]}}},watch:{"submitData.categoryId":function(){this.getParentCategoryIndex()},behavior:function(t){var e=this;t.length>0&&this.submitData.questions.behavior&&(this.submitData.questions.behavior=t.map(function(t){var a=e.questions.behavior.find(function(e){return e.title===t});return a}))},healthy:function(t){var e=this;t.length>0&&this.submitData.questions.healthy&&(this.submitData.questions.healthy=t.map(function(t){var a=e.questions.healthy.find(function(e){return e.title===t});return a}))}},created:function(){},methods:{tryToStore:function(){var t=Object(l["a"])(n.a.mark(function t(){var e=this;return n.a.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,this.$refs.form.validate();case 2:return this.tryingStore=!0,t.prev=3,this.submitData.questions.behavior.forEach(function(t){e.questions.behavior.forEach(function(e){t.title===e.title&&(t.text=e.text)})}),this.submitData.questions.healthy.forEach(function(t){e.questions.healthy.forEach(function(e){t.title===e.title&&(t.text=e.text)})}),t.next=8,this.$store.dispatch("member/storeSinglePet",this.submitData);case 8:this.behavior=[],this.healthy=[],this.questions.behavior.forEach(function(t){t.text=""}),this.questions.healthy.forEach(function(t){t.text=""}),this.submitData={categoryId:"",sizeId:"",name:"",birthday:"",avatar:"",gender:"",breed:"",note:"",memberId:this.defaultValue.id,questions:{personality:[],healthy:[],behavior:[]}},this.emitClose();case 14:return t.prev=14,this.tryingStore=!1,t.finish(14);case 17:case"end":return t.stop()}},t,this,[[3,,14,17]])}));return function(){return t.apply(this,arguments)}}(),emitClose:function(){this.$emit("close"),this.$refs.form.resetFields(),this.submitData.avatar=""},getParentCategoryIndex:function(){var t=this;this.category.forEach(function(e,a){t.submitData.categoryId===e.id&&(t.parentCategoryIndex=a)})},changeCategory:function(){this.submitData.sizeId=""}}},b=m,h=a("88df"),d=a("2877");function f(t){this["$style"]=h["default"].locals||h["default"]}var p=Object(d["a"])(b,i,s,!1,f,null,null);e["default"]=p.exports}}]);
//# sourceMappingURL=chunk-b0d2da58.7532abe5.js.map