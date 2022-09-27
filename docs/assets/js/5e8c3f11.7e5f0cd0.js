"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[6613],{7859:(e,t,n)=>{n.d(t,{Z:()=>u});var r=n(2263),a=n(2792),i=n(1736),l=n(6010),o=n(7294);const s="codeBlock_FKPJ";function u(e){var t=e.children,n=e.language,u=e.title,d=(0,o.useState)((0,a.W5)()),c=d[0],p=d[1];(0,o.useEffect)((0,a.kw)((0,r.Z)(),p),[]);var m=(0,a.hd)(c),v=(0,a.jM)(c),b=(0,a.dz)(c),f=(0,a.xe)(c);function h(e){return(e||"").replace(new RegExp("#USER_API_KEY","g"),m).replace(new RegExp("#BASE_URL","g"),f).replace(new RegExp("#RECORD_ID","g"),v).replace(new RegExp("#RECORD_TITLE","g"),b)}var k=("string"==typeof t?[t]:Array.isArray(t)?t:[]).map((function(e){return"string"==typeof e?h(e):e})),g=h(u);return o.createElement("div",{className:(0,l.Z)(s)},o.createElement(i.Z,{title:g,language:n},k))}},4757:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);function a(e){var t,n=e.method,a=e.url;switch(n){case"GET":t="#007959";break;case"POST":t="#0071BB";break;case"PUT":t="#DEA700";break;case"DELETE":t="#DF245E"}return r.createElement("div",{style:{display:"flex",flexDirection:"row",fontSize:"15px",lineHeight:"15px",marginBottom:"13px"}},r.createElement("span",{style:{backgroundColor:t,color:"var(--tape-color-lightest)",borderRadius:"999px",padding:"4px 9px 3px 9px",fontWeight:700,fontSize:"11px",lineHeight:"11px"}},n.toUpperCase()),r.createElement("span",{style:{color:"var(--tape-color-darker)",marginLeft:"9px",marginTop:"2px"}},a))}},8215:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);function a(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>d});var r=n(7462),a=n(7294),i=n(2389),l=n(3725),o=n(6010);const s="tabItem_LplD";function u(e){var t,n,i,u=e.lazy,d=e.block,c=e.defaultValue,p=e.values,m=e.groupId,v=e.className,b=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=p?p:b.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),h=(0,l.lx)(f,(function(e,t){return e.value===t.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===c?c:null!=(t=null!=c?c:null==(n=b.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(i=b[0])?void 0:i.props.value;if(null!==k&&!f.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+f.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=(0,l.UB)(),w=g.tabGroupChoices,y=g.setTabGroupChoices,_=(0,a.useState)(k),T=_[0],x=_[1],E=[],R=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var N=w[m];null!=N&&N!==T&&f.some((function(e){return e.value===N}))&&x(N)}var C=function(e){var t=e.currentTarget,n=E.indexOf(t),r=f[n].value;r!==T&&(R(t),x(r),null!=m&&y(m,r))},Z=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=E.indexOf(e.currentTarget)+1;n=E[r]||E[0];break;case"ArrowLeft":var a=E.indexOf(e.currentTarget)-1;n=E[a]||E[E.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":d},v)},f.map((function(e){var t=e.value,n=e.label,i=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:T===t?0:-1,"aria-selected":T===t,key:t,ref:function(e){return E.push(e)},onKeyDown:Z,onFocus:C,onClick:C},i,{className:(0,o.Z)("tabs__item",s,null==i?void 0:i.className,{"tabs__item--active":T===t})}),null!=n?n:t)}))),u?(0,a.cloneElement)(b.filter((function(e){return e.props.value===T}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},b.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==T})}))))}function d(e){var t=(0,i.Z)();return a.createElement(u,(0,r.Z)({key:String(t)},e))}},1582:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>v,contentTitle:()=>p,default:()=>h,frontMatter:()=>c,metadata:()=>m,toc:()=>b});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),l=n(4757),o=n(9877),s=n(8215),u=n(7859),d=["components"],c={id:"link",title:"Link Field Value",sidebar_label:"Link"},p=void 0,m={unversionedId:"api/resource/field-value/link",id:"api/resource/field-value/link",title:"Link Field Value",description:"A link field value consists of its value property which holds one or multiple link entries. An entry contains the link url itself, plus link preview meta information, such as a website title or a description. These previews are generated by the server asynchronously, so they are not instantly available after creation / update.",source:"@site/docs/api/resource/field-value/link.md",sourceDirName:"api/resource/field-value",slug:"/api/resource/field-value/link",permalink:"/docs/api/resource/field-value/link",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/field-value/link.md",tags:[],version:"current",frontMatter:{id:"link",title:"Link Field Value",sidebar_label:"Link"},sidebar:"mainSidebar",previous:{title:"Number",permalink:"/docs/api/resource/field-value/number"},next:{title:"Calculation",permalink:"/docs/api/resource/field-value/calculation"}},v={},b=[{value:"Record creation",id:"record-creation",level:2},{value:"Record retrieval",id:"record-retrieval",level:2},{value:"Record update",id:"record-update",level:2}],f={toc:b};function h(e){var t=e.components,n=(0,a.Z)(e,d);return(0,i.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"A link field value consists of its ",(0,i.kt)("inlineCode",{parentName:"p"},"value")," property which holds one or multiple link entries. An entry contains the link url itself, plus link preview meta information, such as a website title or a description. These previews are generated by the server asynchronously, so they are not instantly available after creation / update."),(0,i.kt)("h2",{id:"record-creation"},"Record creation"),(0,i.kt)(l.Z,{method:"POST",url:"https://api.tapeapp.com/v1/record/app/{app_id}",mdxType:"EndpointBadge"}),(0,i.kt)("p",null,"A link field value can be created as part of a record creation. It is possible to provide either a url string, or an array of such."),(0,i.kt)("p",null,'Here is an example request body for creating a record with a value for the "Customer website" field with ID 2, type ',(0,i.kt)("inlineCode",{parentName:"p"},"multi_link")," and external ID ",(0,i.kt)("inlineCode",{parentName:"p"},"customer_website")," :"),(0,i.kt)(o.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,i.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/record/app/1  \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "customer_website": \n        [\n          "https://somecustomerwebsite.com"\n        ]\n    }\n  }\' \n')),(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "customer_website": [{ "url": "https://somecustomerwebsite.com" }]\n  }\n}\n')))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "record_id": 1,\n  "title": "Tape Technologies GmbH",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "customer_website",\n      "label": "Customer website",\n      "type": "link",\n      "field_type": "multi_link",\n      "values": [\n        {\n          "embed_id": 100,\n          "url": "https://somecustomerwebsite.com"\n        }\n      ]\n    }\n  ]\n}\n')),(0,i.kt)("p",null,"Note that the individual link address entries contain an ",(0,i.kt)("inlineCode",{parentName:"p"},"embed_id"),". Be sure to include them in updates, to keep existing link entries. If you omit it, new entries will be created instead and the respective existing ones will be removed. Individual link entries can not be updated, only removed."),(0,i.kt)("p",null,"After the link preview has been fully generated, it will contain meta info. The body will contain more information in that case, follow the next section about record retrieval:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response (after link preview has been generated)"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,Response:!0,"(after":!0,link:!0,preview:!0,has:!0,been:!0,'generated)"':!0},'{\n  "record_id": 1,\n  "title": "Tape Technologies GmbH",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "customer_website",\n      "label": "Customer website",\n      "type": "link",\n      "field_type": "multi_link",\n      "values": [\n        {\n          "embed_id": 100,\n          "url": "https://somecustomerwebsite.com",\n          "title": "Some awesome customer website",\n          "description": "Welcome, Find our products and services here.",\n          "type": "link"\n        }\n      ]\n    }\n  ]\n}\n')),(0,i.kt)("h2",{id:"record-retrieval"},"Record retrieval"),(0,i.kt)(l.Z,{method:"GET",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,i.kt)("p",null,"A link field value can be retrieved as part of a record retrieval:"),(0,i.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Tape Technologies GmbH",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "customer_website",\n      "label": "Customer website",\n      "type": "link",\n      "field_type": "multi_link",\n      "values": [\n        {\n          "embed_id": 100,\n          "url": "https://somecustomerwebsite.com",\n          "title": "Some awesome customer website",\n          "description": "Welcome, Find our products and services here.",\n          "type": "link"\n        }\n      ]\n    }\n  ]\n}\n')),(0,i.kt)("h2",{id:"record-update"},"Record update"),(0,i.kt)(l.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,i.kt)("p",null,"One or more link field values can be updated as part of a record update, while omitted entries will be removed. Be sure to include the ID of existing entries, to prevent them from being recreated and regenerated. Here is an example request body for updating the link entries of an link field with external ID ",(0,i.kt)("inlineCode",{parentName:"p"},"customer_website")," of a record, keeping one existing entry and adding another one via URL:"),(0,i.kt)(o.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,i.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X PUT #BASE_URL/v1/record/1  \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "customer_website": \n      [\n        {\n          "embed_id": 100,\n          "url": "https://somecustomerwebsite.com",\n          "title": "Some awesome customer website",\n          "description": "Welcome, Find our products and services here."\n        },\n        "https://secondcustomerwebsite.com"\n      ]\n    }\n  }\' \n')),(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "customer_website": [\n      {\n        "embed_id": 100,\n        "url": "https://somecustomerwebsite.com",\n        "title": "Some awesome customer website",\n        "description": "Welcome, Find our products and services here."\n      },\n      "https://secondcustomerwebsite.com"\n    ]\n  }\n}\n')))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Tape Technologies GmbH",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "customer_website",\n      "label": "Customer website",\n      "type": "link",\n      "field_type": "multi_link",\n      "values": [\n        {\n          "embed_id": 100,\n          "url": "https://somecustomerwebsite.com",\n          "title": "Some awesome customer website",\n          "description": "Welcome, Find our products and services here.",\n          "type": "link"\n        },\n        {\n          "embed_id": 101,\n          "url": "https://secondcustomerwebsite.com",\n          "title": "Another awesome customer website",\n          "description": "Welcome, Find our more and other products and services here.",\n          "type": "link"\n        }\n      ]\n    }\n  ]\n}\n')))}h.isMDXComponent=!0}}]);