"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[440],{7859:(e,t,n)=>{n.d(t,{Z:()=>u});var r=n(2263),a=n(1483),l=n(1736),i=n(6010),o=n(7294);const d="codeBlock_FKPJ";function u(e){var t=e.children,n=e.language,u=e.title,s=(0,o.useState)((0,a.W5)()),c=s[0],p=s[1];(0,o.useEffect)((0,a.kw)((0,r.Z)(),p),[]);var m=(0,a.hd)(c),v=(0,a.jM)(c),f=(0,a.dz)(c),h=(0,a.xe)(c);function g(e){return(e||"").replace(new RegExp("#USER_API_KEY","g"),m).replace(new RegExp("#BASE_URL","g"),h).replace(new RegExp("#RECORD_ID","g"),v).replace(new RegExp("#RECORD_TITLE","g"),f)}var k=("string"==typeof t?[t]:Array.isArray(t)?t:[]).map((function(e){return"string"==typeof e?g(e):e})),b=g(u);return o.createElement("div",{className:(0,i.Z)(d)},o.createElement(l.Z,{title:b,language:n},k))}},4757:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);function a(e){var t,n=e.method,a=e.url;switch(n){case"GET":t="#007959";break;case"POST":t="#0071BB";break;case"PUT":t="#DEA700";break;case"DELETE":t="#DF245E"}return r.createElement("div",{style:{display:"flex",flexDirection:"row",fontSize:"15px",lineHeight:"15px",marginBottom:"13px"}},r.createElement("span",{style:{backgroundColor:t,color:"var(--tape-color-lightest)",borderRadius:"999px",padding:"4px 9px 3px 9px",fontWeight:700,fontSize:"11px",lineHeight:"11px"}},n.toUpperCase()),r.createElement("span",{style:{color:"var(--tape-color-darker)",marginLeft:"9px",marginTop:"2px"}},a))}},1483:(e,t,n)=>{n.d(t,{hd:()=>E,M:()=>T,hU:()=>R,S$:()=>C,W5:()=>i,jM:()=>I,dz:()=>U,xe:()=>x,kw:()=>D});var r,a,l=(r=[],a={initializing:!1,runtime:"PRD",activeUserContext:void 0,activeUserContextIsLoading:!0,demoRecord:void 0,demoRecordIsLoading:!0},{get:function(){return a},set:function(e){a!==e&&(a=e,r.forEach((function(e){return e(a)})))},subscribe:function(e){return r.push(e),function(){return function(e){r=r.filter((function(t){return t!==e}))}(e)}}});function i(){return l.get()}function o(e){l.set(e)}var d=n(5861),u=n(7757),s=n.n(u);function c(e){return"DEV"===e?"http://localhost:3000":"https://tapeapp.com"}var p=JSON.stringify({operationName:null,variables:{},query:"{\n  getActiveUserDevPortalContext {\n    ... on ActiveUserDevPortalContextDto {\n      userId\n      apiKey\n      user {\n        id\n        primaryName\n      }\n    }\n  }\n}\n"}),m=JSON.stringify({operationName:null,variables:{},query:"{\n      getUserSessions {\n        active\n        userId\n      }\n    }\n"});function v(e,t){return fetch(e+"/graphql/getActiveUserDevPortalContext",{method:"POST",headers:{"content-type":"application/json",uid:t},credentials:"include",mode:"cors",body:p}).then((function(e){return e.text()})).then((function(e){var t,n=JSON.parse(e);return(null==n||null==(t=n.data)?void 0:t.getActiveUserDevPortalContext)||{}}))}function f(e){return fetch(e+"/graphql/getUserSessions",{method:"POST",headers:{"content-type":"application/json"},credentials:"include",mode:"cors",body:m}).then((function(e){return e.text()})).then((function(e){var t,n=JSON.parse(e);return(null==n||null==(t=n.data)?void 0:t.getUserSessions)||[]}))}function h(e){return g.apply(this,arguments)}function g(){return(g=(0,d.Z)(s().mark((function e(t){var n,r,a,l;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f(t);case 2:if(n=e.sent,(r=n.filter((function(e){return e.active}))).length){e.next=6;break}return e.abrupt("return",{});case 6:return a=r[0].userId,e.next=9,v(t,a);case 9:return l=e.sent,e.abrupt("return",l);case 11:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var k=JSON.stringify({operationName:null,variables:{},query:"{\n  getActiveUserDevPortalDemoBlabItem {\n    id\n    title\n  }\n}"});function b(e,t){return fetch(e+"/graphql/getActiveUserDevPortalDemoRecord",{method:"POST",headers:{"content-type":"application/json",uid:t},credentials:"include",mode:"cors",body:k}).then((function(e){return e.text()})).then((function(e){var t,n=JSON.parse(e);return(null==n||null==(t=n.data)?void 0:t.getActiveUserDevPortalDemoBlabItem)||{}}))}function _(){return(_=(0,d.Z)(s().mark((function e(t){var n,r,a,l,d;return s().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!i().initializing){e.next=2;break}return e.abrupt("return");case 2:return o(Object.assign({},i(),{initializing:!0})),n=c(t),e.prev=4,e.next=7,h(n);case 7:if(a=e.sent,o(Object.assign({},i(),{activeUserContext:a,activeUserContextIsLoading:!1})),!(l=null==(r=a.user)?void 0:r.id)){e.next=15;break}return e.next=13,b(n,l);case 13:d=e.sent,o(Object.assign({},i(),{demoRecord:d,demoRecordIsLoading:!1}));case 15:e.next=21;break;case 17:e.prev=17,e.t0=e.catch(4),console.error(e.t0),o(Object.assign({},i(),{activeUserContextIsLoading:!1,demoRecordIsLoading:!1}));case 21:case"end":return e.stop()}}),e,null,[[4,17]])})))).apply(this,arguments)}function y(e){return e.runtime}function x(e){return function(e){return"DEV"===e?"http://localhost:3000":"https://api.tapeapp.com"}(y(e))}function N(e){var t;return null!=(t=e.activeUserContext)?t:{}}function T(e){return e.activeUserContextIsLoading}function E(e){var t;return null!=(t=function(e){return N(e).apiKey}(e))?t:"user_key_replace_with_your_api_key"}function R(e){var t;return null==(t=N(e).user)?void 0:t.primaryName}function C(e){var t;return null!=(t=R(e))?t:"Developer"}function S(e){var t;return null!=(t=e.demoRecord)?t:{}}function I(e){var t;return null!=(t=function(e){return S(e).id}(e))?t:123}function U(e){var t;return null!=(t=function(e){return S(e).title}(e))?t:"Demo Record"}function D(e,t){var n,r,a=((null==e||null==(n=e.siteConfig)||null==(r=n.customFields)?void 0:r.runtime)||"PRD").trim().toUpperCase();return y(i())!==a&&o(Object.assign({},i(),{runtime:a})),function(e){_.apply(this,arguments)}(a),function(){return function(e){return l.subscribe(e)}(t)}}},8215:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(7294);function a(e){var t=e.children,n=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:n,className:a},t)}},9877:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(7462),a=n(7294),l=n(2389),i=n(3725),o=n(6010);const d="tabItem_LplD";function u(e){var t,n,l,u=e.lazy,s=e.block,c=e.defaultValue,p=e.values,m=e.groupId,v=e.className,f=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=p?p:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),g=(0,i.lx)(h,(function(e,t){return e.value===t.value}));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var k=null===c?c:null!=(t=null!=c?c:null==(n=f.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(l=f[0])?void 0:l.props.value;if(null!==k&&!h.some((function(e){return e.value===k})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+k+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var b=(0,i.UB)(),_=b.tabGroupChoices,y=b.setTabGroupChoices,x=(0,a.useState)(k),N=x[0],T=x[1],E=[],R=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var C=_[m];null!=C&&C!==N&&h.some((function(e){return e.value===C}))&&T(C)}var S=function(e){var t=e.currentTarget,n=E.indexOf(t),r=h[n].value;r!==N&&(R(t),T(r),null!=m&&y(m,r))},I=function(e){var t,n=null;switch(e.key){case"ArrowRight":var r=E.indexOf(e.currentTarget)+1;n=E[r]||E[0];break;case"ArrowLeft":var a=E.indexOf(e.currentTarget)-1;n=E[a]||E[E.length-1]}null==(t=n)||t.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":s},v)},h.map((function(e){var t=e.value,n=e.label,l=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:N===t?0:-1,"aria-selected":N===t,key:t,ref:function(e){return E.push(e)},onKeyDown:I,onFocus:S,onClick:S},l,{className:(0,o.Z)("tabs__item",d,null==l?void 0:l.className,{"tabs__item--active":N===t})}),null!=n?n:t)}))),u?(0,a.cloneElement)(f.filter((function(e){return e.props.value===N}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==N})}))))}function s(e){var t=(0,l.Z)();return a.createElement(u,(0,r.Z)({key:String(t)},e))}},6229:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>v,contentTitle:()=>p,default:()=>g,frontMatter:()=>c,metadata:()=>m,toc:()=>f});var r=n(7462),a=n(3366),l=(n(7294),n(3905)),i=n(4757),o=n(9877),d=n(8215),u=n(7859),s=["components"],c={id:"record",title:"Record",sidebar_label:"Record"},p=void 0,m={unversionedId:"api/resource/record",id:"api/resource/record",title:"Record",description:"Records are the place where work gets done inside a Tape organization. Records can be created, retrieved, updated and deleted via the API.",source:"@site/docs/api/resource/record.md",sourceDirName:"api/resource",slug:"/api/resource/record",permalink:"/docs/api/resource/record",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/record.md",tags:[],version:"current",frontMatter:{id:"record",title:"Record",sidebar_label:"Record"},sidebar:"mainSidebar",previous:{title:"Date & Timezone",permalink:"/docs/api/date-timezone"},next:{title:"General",permalink:"/docs/api/resource/field-value/general"}},v={},f=[{value:"Create a record",id:"create-a-record",level:2},{value:"Retrieve a record",id:"retrieve-a-record",level:2},{value:"Update a Record",id:"update-a-record",level:2},{value:"Delete a record",id:"delete-a-record",level:2},{value:"Retrieve records for an app",id:"retrieve-records-for-an-app",level:2}],h={toc:f};function g(e){var t=e.components,n=(0,a.Z)(e,s);return(0,l.kt)("wrapper",(0,r.Z)({},h,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Records are the place where work gets done inside a Tape organization. Records can be created, retrieved, updated and deleted via the API."),(0,l.kt)("h2",{id:"create-a-record"},"Create a record"),(0,l.kt)(i.Z,{method:"POST",url:"https://api.tapeapp.com/v1/record/app/{app_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"To create a new record for the app with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"app_id"),", issue a POST request to this endpoint. The POST body specifies has to contain the ",(0,l.kt)("inlineCode",{parentName:"p"},"fields")," property with the key-value pairs of the field values to create for this record."),(0,l.kt)(o.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/record/app/1  \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "first_name": "Adam Smith"\n    }\n  }\' \n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "first_name": "Adam Smith"\n  }\n}\n')))),(0,l.kt)("p",null,"The example above only specifies a ",(0,l.kt)("inlineCode",{parentName:"p"},"SINGLE_TEXT")," field value as part of the record creation. See the ",(0,l.kt)("a",{parentName:"p",href:"field-value/general"},"field value")," documentation section for examples of all supported field types."),(0,l.kt)("p",null,"Upon successful creation, the server returns the created record:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "id": 1,\n  "title": "Adam Smith",\n  "created_on": "2022-03-01 12:00:00",\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "full_name",\n      "label": "Full Name",\n      "type": "text",\n      "field_type": "SINGLE_TEXT",\n      "values": [\n        {\n          "value": "Adam Smith"\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("h2",{id:"retrieve-a-record"},"Retrieve a record"),(0,l.kt)(i.Z,{method:"GET",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Retrieve the record with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"record_id"),":"),(0,l.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "id": 1,\n  "title": "Adam Smith",\n  "created_on": "2022-03-01 12:00:00",\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "full_name",\n      "label": "Full Name",\n      "type": "text",\n      "field_type": "SINGLE_TEXT",\n      "values": [\n        {\n          "value": "Adam Smith"\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("p",null,"The example response above only contains a ",(0,l.kt)("inlineCode",{parentName:"p"},"SINGLE_TEXT")," field value. See the ",(0,l.kt)("a",{parentName:"p",href:"field-value/general"},"field value")," documentation section for examples of all supported field types."),(0,l.kt)("p",null,"Attempting to retrieve a deleted record returns the following error:"),(0,l.kt)(u.Z,{language:"json",mdxType:"ContextCodeBlock"},'{\n"status_code": 400,\n"endpoint": "/v1/record/17",\n"error_code": "record_deleted",\n"error_message": "Record is deleted(17)!"\n}'),(0,l.kt)("h2",{id:"update-a-record"},"Update a Record"),(0,l.kt)(i.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Updates the record with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"record_id")," and returns the updated record:"),(0,l.kt)(o.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X PUT #BASE_URL/v1/record/1  \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "first_name": "Andrea Lim"\n    }\n  }\' \n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "first_name": "Andrea Lim"\n  }\n}\n')))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "id": 1,\n  "title": "Andrea Lim",\n  "created_on": "2022-03-01 12:00:00",\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "full_name",\n      "label": "Full Name",\n      "type": "text",\n      "field_type": "SINGLE_TEXT",\n      "values": [\n        {\n          "value": "Andrea Lim"\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("h2",{id:"delete-a-record"},"Delete a record"),(0,l.kt)(i.Z,{method:"DELETE",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Delete the record with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"record_id"),":"),(0,l.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl -X DELETE #BASE_URL/v1/record/1  \\\n  -u #USER_API_KEY:\n"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},"{}\n")),(0,l.kt)("p",null,"If the record has already been deleted, the following error is returned:"),(0,l.kt)(u.Z,{language:"json",mdxType:"ContextCodeBlock"},'{\n  "status_code": 400,\n  "endpoint": "/v1/record/1",\n  "error_code": "record_deleted",\n  "error_message": "Record is deleted(1)!"\n}'),(0,l.kt)("h2",{id:"retrieve-records-for-an-app"},"Retrieve records for an app"),(0,l.kt)(i.Z,{method:"GET",url:"https://api.tapeapp.com/v1/record/app/{app_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Retrieve records for the app with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"app_id"),":"),(0,l.kt)(u.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/record/app/1?limit=2 \\\n  -u #USER_API_KEY:"),(0,l.kt)(u.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'{\n  "total": 2,\n  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",\n  "records": [\n    {\n      "id": 2,\n      "title": "Adam Smith",\n      "created_on": "2022-03-23 08:48:42",\n      "app": {\n        "app_id": 1,\n        "icon": "event_available",\n        "name": "Contacts",\n        "record_name": "Contact",\n        "workspace_id": 1\n      },\n      "fields": [\n        {\n          "field_id": 1,\n          "external_id": "full_name",\n          "label": "Full Name",\n          "type": "text",\n          "field_type": "SINGLE_TEXT",\n          "values": [\n            {\n              "value": "Adam Smith"\n            }\n          ]\n        }\n      ]\n    },\n    {\n      "id": 1,\n      "title": "Andrea Lim",\n      "created_on": "2022-03-23 08:43:03",\n      "app": {\n        "app_id": 1,\n        "icon": "event_available",\n        "name": "Contacts",\n        "record_name": "Contact",\n        "workspace_id": 1\n      },\n      "fields": [\n        {\n          "field_id": 1,\n          "external_id": "full_name",\n          "label": "Full Name",\n          "type": "text",\n          "field_type": "SINGLE_TEXT",\n          "values": [\n            {\n              "value": "Andrea Lim"\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}'),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Query Parameters")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"th"}," Type")),(0,l.kt)("th",{parentName:"tr",align:null},"Min"),(0,l.kt)("th",{parentName:"tr",align:null},"Max"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"limit")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"integer")),(0,l.kt)("td",{parentName:"tr",align:null},"Number of records to return. Defaults to 50."),(0,l.kt)("td",{parentName:"tr",align:null},"0"),(0,l.kt)("td",{parentName:"tr",align:null},"500")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"cursor")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"string")),(0,l.kt)("td",{parentName:"tr",align:null},"Cursor for pagination"),(0,l.kt)("td",{parentName:"tr",align:null},"-"),(0,l.kt)("td",{parentName:"tr",align:null},"-")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"sort_by")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"string")),(0,l.kt)("td",{parentName:"tr",align:null},"External ID of the field that should be sorted by."),(0,l.kt)("td",{parentName:"tr",align:null},"-"),(0,l.kt)("td",{parentName:"tr",align:null},"-")))))}g.isMDXComponent=!0}}]);