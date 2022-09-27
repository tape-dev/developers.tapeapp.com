"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[6902],{7859:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(2263),l=a(2792),r=a(1736),o=a(6010),i=a(7294);const u="codeBlock_FKPJ";function s(e){var t=e.children,a=e.language,s=e.title,d=(0,i.useState)((0,l.W5)()),c=d[0],p=d[1];(0,i.useEffect)((0,l.kw)((0,n.Z)(),p),[]);var v=(0,l.hd)(c),g=(0,l.jM)(c),m=(0,l.dz)(c),f=(0,l.xe)(c);function y(e){return(e||"").replace(new RegExp("#USER_API_KEY","g"),v).replace(new RegExp("#BASE_URL","g"),f).replace(new RegExp("#RECORD_ID","g"),g).replace(new RegExp("#RECORD_TITLE","g"),m)}var h=("string"==typeof t?[t]:Array.isArray(t)?t:[]).map((function(e){return"string"==typeof e?y(e):e})),b=y(s);return i.createElement("div",{className:(0,o.Z)(u)},i.createElement(r.Z,{title:b,language:a},h))}},4757:(e,t,a)=>{a.d(t,{Z:()=>l});var n=a(7294);function l(e){var t,a=e.method,l=e.url;switch(a){case"GET":t="#007959";break;case"POST":t="#0071BB";break;case"PUT":t="#DEA700";break;case"DELETE":t="#DF245E"}return n.createElement("div",{style:{display:"flex",flexDirection:"row",fontSize:"15px",lineHeight:"15px",marginBottom:"13px"}},n.createElement("span",{style:{backgroundColor:t,color:"var(--tape-color-lightest)",borderRadius:"999px",padding:"4px 9px 3px 9px",fontWeight:700,fontSize:"11px",lineHeight:"11px"}},a.toUpperCase()),n.createElement("span",{style:{color:"var(--tape-color-darker)",marginLeft:"9px",marginTop:"2px"}},l))}},8215:(e,t,a)=>{a.d(t,{Z:()=>l});var n=a(7294);function l(e){var t=e.children,a=e.hidden,l=e.className;return n.createElement("div",{role:"tabpanel",hidden:a,className:l},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>d});var n=a(7462),l=a(7294),r=a(2389),o=a(3725),i=a(6010);const u="tabItem_LplD";function s(e){var t,a,r,s=e.lazy,d=e.block,c=e.defaultValue,p=e.values,v=e.groupId,g=e.className,m=l.Children.map(e.children,(function(e){if((0,l.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:m.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),y=(0,o.lx)(f,(function(e,t){return e.value===t.value}));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var h=null===c?c:null!=(t=null!=c?c:null==(a=m.find((function(e){return e.props.default})))?void 0:a.props.value)?t:null==(r=m[0])?void 0:r.props.value;if(null!==h&&!f.some((function(e){return e.value===h})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,o.UB)(),k=b.tabGroupChoices,x=b.setTabGroupChoices,_=(0,l.useState)(h),E=_[0],C=_[1],T=[],R=(0,o.o5)().blockElementScrollPositionUntilNextRender;if(null!=v){var N=k[v];null!=N&&N!==E&&f.some((function(e){return e.value===N}))&&C(N)}var w=function(e){var t=e.currentTarget,a=T.indexOf(t),n=f[a].value;n!==E&&(R(t),C(n),null!=v&&x(v,n))},D=function(e){var t,a=null;switch(e.key){case"ArrowRight":var n=T.indexOf(e.currentTarget)+1;a=T[n]||T[0];break;case"ArrowLeft":var l=T.indexOf(e.currentTarget)-1;a=T[l]||T[T.length-1]}null==(t=a)||t.focus()};return l.createElement("div",{className:"tabs-container"},l.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,i.Z)("tabs",{"tabs--block":d},g)},f.map((function(e){var t=e.value,a=e.label,r=e.attributes;return l.createElement("li",(0,n.Z)({role:"tab",tabIndex:E===t?0:-1,"aria-selected":E===t,key:t,ref:function(e){return T.push(e)},onKeyDown:D,onFocus:w,onClick:w},r,{className:(0,i.Z)("tabs__item",u,null==r?void 0:r.className,{"tabs__item--active":E===t})}),null!=a?a:t)}))),s?(0,l.cloneElement)(m.filter((function(e){return e.props.value===E}))[0],{className:"margin-vert--md"}):l.createElement("div",{className:"margin-vert--md"},m.map((function(e,t){return(0,l.cloneElement)(e,{key:t,hidden:e.props.value!==E})}))))}function d(e){var t=(0,r.Z)();return l.createElement(s,(0,n.Z)({key:String(t)},e))}},7370:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>g,contentTitle:()=>p,default:()=>y,frontMatter:()=>c,metadata:()=>v,toc:()=>m});var n=a(7462),l=a(3366),r=(a(7294),a(3905)),o=a(4757),i=a(9877),u=a(8215),s=a(7859),d=["components"],c={id:"category",title:"Category Field Value",sidebar_label:"Category"},p=void 0,v={unversionedId:"api/resource/field-value/category",id:"api/resource/field-value/category",title:"Category Field Value",description:"A category field value consists of its value property which holds a reference to a category option. A category option has the properties id (unique ID), text (the label) and color (hexcolor value). A singlecategory field value holds at most one category option while a multicategory field value can hold multiple category options.",source:"@site/docs/api/resource/field-value/category.md",sourceDirName:"api/resource/field-value",slug:"/api/resource/field-value/category",permalink:"/docs/api/resource/field-value/category",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/field-value/category.md",tags:[],version:"current",frontMatter:{id:"category",title:"Category Field Value",sidebar_label:"Category"},sidebar:"mainSidebar",previous:{title:"User",permalink:"/docs/api/resource/field-value/user"},next:{title:"Date",permalink:"/docs/api/resource/field-value/date"}},g={},m=[{value:"Record creation",id:"record-creation",level:2},{value:"Record retrieval",id:"record-retrieval",level:2},{value:"Record update",id:"record-update",level:2}],f={toc:m};function y(e){var t=e.components,a=(0,l.Z)(e,d);return(0,r.kt)("wrapper",(0,n.Z)({},f,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"A category field value consists of its ",(0,r.kt)("inlineCode",{parentName:"p"},"value")," property which holds a reference to a category option. A category option has the properties ",(0,r.kt)("inlineCode",{parentName:"p"},"id")," (unique ID), ",(0,r.kt)("inlineCode",{parentName:"p"},"text")," (the label) and ",(0,r.kt)("inlineCode",{parentName:"p"},"color")," (hexcolor value). A ",(0,r.kt)("inlineCode",{parentName:"p"},"single_category")," field value holds at most one category option while a ",(0,r.kt)("inlineCode",{parentName:"p"},"multi_category")," field value can hold multiple category options."),(0,r.kt)("h2",{id:"record-creation"},"Record creation"),(0,r.kt)(o.Z,{method:"POST",url:"https://api.tapeapp.com/v1/record/app/{app_id}",mdxType:"EndpointBadge"}),(0,r.kt)("p",null,'A category field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Salutation" field with ID 2, type ',(0,r.kt)("inlineCode",{parentName:"p"},"single_category")," and external ID ",(0,r.kt)("inlineCode",{parentName:"p"},"salutation"),' and a value for the "Tags" field with ID 3, type ',(0,r.kt)("inlineCode",{parentName:"p"},"multi_category")," and external ID ",(0,r.kt)("inlineCode",{parentName:"p"},"tags"),":"),(0,r.kt)(i.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,r.kt)(u.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,r.kt)(s.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/record/app/1 \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "salutation": 1,\n      "tags": [4, 5]\n    }\n  }\' \n')),(0,r.kt)(u.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "salutation": 1,\n    "tags": [4, 5]\n  }\n}\n')))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "record_id": 1,\n  "title": "Mr.",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "salutation",\n      "label": "Salutation",\n      "type": "category",\n      "field_type": "single_category",\n      "values": [\n        {\n          "value": {\n            "id": 1,\n            "text": "Mr.",\n            "color": "CDCCC9"\n          }\n        }\n      ]\n    },\n    {\n      "field_id": 3,\n      "external_id": "tags",\n      "label": "Tags",\n      "field_type": "multi_category",\n      "type": "category",\n      "values": [\n        {\n          "value": {\n            "id": 4,\n            "color": "CDCCC9",\n            "text": "Interview outstanding"\n          }\n        },\n        {\n          "value": {\n            "id": 5,\n            "color": "6E7174",\n            "text": "Missing contact details"\n          }\n        }\n      ]\n    }\n  ]\n}\n')),(0,r.kt)("h2",{id:"record-retrieval"},"Record retrieval"),(0,r.kt)(o.Z,{method:"GET",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,r.kt)("p",null,"A category field value can be retrieved as part of a record retrieval:"),(0,r.kt)(s.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Mr.",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "salutation",\n      "label": "Salutation",\n      "type": "category",\n      "field_type": "single_category",\n      "values": [\n        {\n          "value": {\n            "id": 1,\n            "text": "Mr.",\n            "color": "CDCCC9"\n          }\n        }\n      ]\n    },\n    {\n      "field_id": 3,\n      "external_id": "tags",\n      "label": "Tags",\n      "field_type": "multi_category",\n      "type": "category",\n      "values": [\n        {\n          "value": {\n            "id": 4,\n            "color": "CDCCC9",\n            "text": "Interview outstanding"\n          }\n        },\n        {\n          "value": {\n            "id": 5,\n            "color": "6E7174",\n            "text": "Missing contact details"\n          }\n        }\n      ]\n    }\n  ]\n}\n')),(0,r.kt)("h2",{id:"record-update"},"Record update"),(0,r.kt)(o.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,r.kt)("p",null,"One or more category field values can be updated as part of a record update. Here is an example request body for updating multiple category field values of a record:"),(0,r.kt)(i.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,r.kt)(u.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,r.kt)(s.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X PUT #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "salutation": 2,\n      "tags": [5]\n    }\n  }\' \n')),(0,r.kt)(u.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "salutation": 2,\n    "tags": [5]\n  }\n}\n')))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Mrs.",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "salutation",\n      "label": "Salutation",\n      "type": "category",\n      "field_type": "single_category",\n      "values": [\n        {\n          "value": {\n            "id": 2,\n            "text": "Mrs.",\n            "color": "DC0080"\n          }\n        }\n      ]\n    },\n    {\n      "field_id": 3,\n      "external_id": "tags",\n      "label": "Tags",\n      "field_type": "multi_category",\n      "type": "category",\n      "values": [\n        {\n          "value": {\n            "id": 5,\n            "color": "6E7174",\n            "text": "Missing contact details"\n          }\n        }\n      ]\n    }\n  ]\n}\n')))}y.isMDXComponent=!0}}]);