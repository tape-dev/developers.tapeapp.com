"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[440],{4757:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7294);function r(e){var t,a=e.method,r=e.url;switch(a){case"GET":t="#007959";break;case"POST":t="#0071BB";break;case"PUT":t="#DEA700";break;case"DELETE":t="#DF245E"}return n.createElement("div",{style:{display:"flex",flexDirection:"row",fontSize:"15px",lineHeight:"15px",marginBottom:"13px"}},n.createElement("span",{style:{backgroundColor:t,color:"var(--tape-color-lightest)",borderRadius:"999px",padding:"4px 9px 3px 9px",fontWeight:700,fontSize:"11px",lineHeight:"11px"}},a.toUpperCase()),n.createElement("span",{style:{color:"var(--tape-color-darker)",marginLeft:"9px",marginTop:"2px"}},r))}},8215:(e,t,a)=>{a.d(t,{Z:()=>r});var n=a(7294);function r(e){var t=e.children,a=e.hidden,r=e.className;return n.createElement("div",{role:"tabpanel",hidden:a,className:r},t)}},9877:(e,t,a)=>{a.d(t,{Z:()=>s});var n=a(7462),r=a(7294),l=a(2389),i=a(3725),o=a(6010);const d="tabItem_LplD";function p(e){var t,a,l,p=e.lazy,s=e.block,u=e.defaultValue,m=e.values,c=e.groupId,k=e.className,f=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=m?m:f.map((function(e){var t=e.props;return{value:t.value,label:t.label,attributes:t.attributes}})),g=(0,i.lx)(h,(function(e,t){return e.value===t.value}));if(g.length>0)throw new Error('Docusaurus error: Duplicate values "'+g.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var v=null===u?u:null!=(t=null!=u?u:null==(a=f.find((function(e){return e.props.default})))?void 0:a.props.value)?t:null==(l=f[0])?void 0:l.props.value;if(null!==v&&!h.some((function(e){return e.value===v})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var N=(0,i.UB)(),b=N.tabGroupChoices,_=N.setTabGroupChoices,y=(0,r.useState)(v),x=y[0],T=y[1],C=[],E=(0,i.o5)().blockElementScrollPositionUntilNextRender;if(null!=c){var R=b[c];null!=R&&R!==x&&h.some((function(e){return e.value===R}))&&T(R)}var w=function(e){var t=e.currentTarget,a=C.indexOf(t),n=h[a].value;n!==x&&(E(t),T(n),null!=c&&_(c,n))},S=function(e){var t,a=null;switch(e.key){case"ArrowRight":var n=C.indexOf(e.currentTarget)+1;a=C[n]||C[0];break;case"ArrowLeft":var r=C.indexOf(e.currentTarget)-1;a=C[r]||C[C.length-1]}null==(t=a)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,o.Z)("tabs",{"tabs--block":s},k)},h.map((function(e){var t=e.value,a=e.label,l=e.attributes;return r.createElement("li",(0,n.Z)({role:"tab",tabIndex:x===t?0:-1,"aria-selected":x===t,key:t,ref:function(e){return C.push(e)},onKeyDown:S,onFocus:w,onClick:w},l,{className:(0,o.Z)("tabs__item",d,null==l?void 0:l.className,{"tabs__item--active":x===t})}),null!=a?a:t)}))),p?(0,r.cloneElement)(f.filter((function(e){return e.props.value===x}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},f.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==x})}))))}function s(e){var t=(0,l.Z)();return r.createElement(p,(0,n.Z)({key:String(t)},e))}},6229:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>k,contentTitle:()=>m,default:()=>g,frontMatter:()=>u,metadata:()=>c,toc:()=>f});var n=a(7462),r=a(3366),l=(a(7294),a(3905)),i=a(4757),o=a(9877),d=a(8215),p=a(7859),s=["components"],u={id:"record",title:"Record",sidebar_label:"Record"},m=void 0,c={unversionedId:"api/resource/record",id:"api/resource/record",title:"Record",description:"Records are the place where work gets done inside a Tape organization. Records can be created, retrieved, updated and deleted via the API.",source:"@site/docs/api/resource/record.md",sourceDirName:"api/resource",slug:"/api/resource/record",permalink:"/docs/api/resource/record",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/record.md",tags:[],version:"current",frontMatter:{id:"record",title:"Record",sidebar_label:"Record"},sidebar:"mainSidebar",previous:{title:"Date & Timezone",permalink:"/docs/api/date-timezone"},next:{title:"General",permalink:"/docs/api/resource/field-value/general"}},k={},f=[{value:"Create a record",id:"create-a-record",level:2},{value:"Retrieve a record",id:"retrieve-a-record",level:2},{value:"Update a Record",id:"update-a-record",level:2},{value:"Delete a record",id:"delete-a-record",level:2},{value:"Retrieve records for an app",id:"retrieve-records-for-an-app",level:2}],h={toc:f};function g(e){var t=e.components,a=(0,r.Z)(e,s);return(0,l.kt)("wrapper",(0,n.Z)({},h,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Records are the place where work gets done inside a Tape organization. Records can be created, retrieved, updated and deleted via the API."),(0,l.kt)("h2",{id:"create-a-record"},"Create a record"),(0,l.kt)(i.Z,{method:"POST",url:"https://api.tapeapp.com/v1/record/app/{app_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"To create a new record for the app with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"app_id"),", issue a POST request to this endpoint. The POST body specifies has to contain the ",(0,l.kt)("inlineCode",{parentName:"p"},"fields")," property with the key-value pairs of the field values to create for this record.\nThe following query paramters are available:"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"left"},"Query param"),(0,l.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,l.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"silent")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"boolean")),(0,l.kt)("td",{parentName:"tr",align:"left"},"Do not generate notifications for this operation (default: ",(0,l.kt)("inlineCode",{parentName:"td"},"false"),")")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"hook")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"boolean")),(0,l.kt)("td",{parentName:"tr",align:"left"},"Execute webhooks for this operation (default: ",(0,l.kt)("inlineCode",{parentName:"td"},"true"),")")))),(0,l.kt)(o.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(p.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/record/app/1 \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "first_name": "Adam Smith"\n    }\n  }\' \n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "first_name": "Adam Smith"\n  }\n}\n')))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Adam Smith",\n  "created_on": "2022-03-01 12:00:00",\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "full_name",\n      "label": "Full Name",\n      "type": "text",\n      "field_type": "single_text",\n      "values": [\n        {\n          "value": "Adam Smith"\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("p",null,"The example above only specifies a ",(0,l.kt)("inlineCode",{parentName:"p"},"single_text")," field value as part of the record creation. See the ",(0,l.kt)("a",{parentName:"p",href:"field-value/general"},"field value")," documentation section for examples of all supported field types."),(0,l.kt)("h2",{id:"retrieve-a-record"},"Retrieve a record"),(0,l.kt)(i.Z,{method:"GET",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Retrieve the record with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"record_id"),":"),(0,l.kt)(p.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Adam Smith",\n  "created_on": "2022-03-01 12:00:00",\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "full_name",\n      "label": "Full Name",\n      "type": "text",\n      "field_type": "single_text",\n      "values": [\n        {\n          "value": "Adam Smith"\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("p",null,"The example response above only contains a ",(0,l.kt)("inlineCode",{parentName:"p"},"single_text")," field value. See the ",(0,l.kt)("a",{parentName:"p",href:"field-value/general"},"field value")," documentation section for examples of all supported field types."),(0,l.kt)("p",null,"Attempting to retrieve a deleted record returns the following error:"),(0,l.kt)(p.Z,{language:"json",mdxType:"ContextCodeBlock"},'{\n"status_code": 400,\n"endpoint": "/v1/record/17",\n"error_code": "record_deleted",\n"error_message": "Record is deleted(17)!"\n}'),(0,l.kt)("h2",{id:"update-a-record"},"Update a Record"),(0,l.kt)(i.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Updates the record with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"record_id")," and returns the updated record.\nThe following query paramters are available:"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"left"},"Query param"),(0,l.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,l.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"silent")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"boolean")),(0,l.kt)("td",{parentName:"tr",align:"left"},"Do not generate notifications for this operation (default: ",(0,l.kt)("inlineCode",{parentName:"td"},"false"),")")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"hook")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"boolean")),(0,l.kt)("td",{parentName:"tr",align:"left"},"Execute webhooks for this operation (default: ",(0,l.kt)("inlineCode",{parentName:"td"},"true"),")")))),(0,l.kt)(o.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(p.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X PUT #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "first_name": "Andrea Lim"\n    }\n  }\' \n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "first_name": "Andrea Lim"\n  }\n}\n')))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Andrea Lim",\n  "created_on": "2022-03-01 12:00:00",\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "full_name",\n      "label": "Full Name",\n      "type": "text",\n      "field_type": "single_text",\n      "values": [\n        {\n          "value": "Andrea Lim"\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("p",null,"The example above only specifies a ",(0,l.kt)("inlineCode",{parentName:"p"},"single_text")," field value as part of the record update. See the ",(0,l.kt)("a",{parentName:"p",href:"field-value/general"},"field value")," documentation section for examples of all supported field types."),(0,l.kt)("h2",{id:"delete-a-record"},"Delete a record"),(0,l.kt)(i.Z,{method:"DELETE",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Delete the record with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"record_id"),".\nThe following query paramters are available:"),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:"left"},"Query param"),(0,l.kt)("th",{parentName:"tr",align:"left"},"Type"),(0,l.kt)("th",{parentName:"tr",align:"left"},"Description"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"silent")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"boolean")),(0,l.kt)("td",{parentName:"tr",align:"left"},"Do not generate notifications for this operation (default: ",(0,l.kt)("inlineCode",{parentName:"td"},"false"),")")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"hook")),(0,l.kt)("td",{parentName:"tr",align:"left"},(0,l.kt)("inlineCode",{parentName:"td"},"boolean")),(0,l.kt)("td",{parentName:"tr",align:"left"},"Execute webhooks for this operation (default: ",(0,l.kt)("inlineCode",{parentName:"td"},"true"),")")))),(0,l.kt)(p.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl -X DELETE #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY:\n"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},"{}\n")),(0,l.kt)("p",null,"If the record has already been deleted, the following error is returned:"),(0,l.kt)(p.Z,{language:"json",mdxType:"ContextCodeBlock"},'{\n  "status_code": 400,\n  "endpoint": "/v1/record/1",\n  "error_code": "record_deleted",\n  "error_message": "Record is deleted(1)!"\n}'),(0,l.kt)("h2",{id:"retrieve-records-for-an-app"},"Retrieve records for an app"),(0,l.kt)(i.Z,{method:"GET",url:"https://api.tapeapp.com/v1/record/app/{app_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"Retrieve records for the app with the specified ",(0,l.kt)("inlineCode",{parentName:"p"},"app_id"),":"),(0,l.kt)(p.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/record/app/1?limit=2 \\\n  -u #USER_API_KEY:"),(0,l.kt)(p.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'{\n  "total": 2,\n  "cursor": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJibGFiRGVmSWQiOjgsInZhbHVlcyI6WzE1OV0sImV4cCI6MTY1MDYxODc3OH0.iY5TnLSBDGCnFXbStcrLPTmP6MATnS_JKywbvC4tx3g",\n  "records": [\n    {\n      "record_id": 2,\n      "title": "Adam Smith",\n      "created_on": "2022-03-23 08:48:42",\n      "app": {\n        "app_id": 1,\n        "icon": "event_available",\n        "name": "Contacts",\n        "record_name": "Contact",\n        "workspace_id": 1\n      },\n      "fields": [\n        {\n          "field_id": 1,\n          "external_id": "full_name",\n          "label": "Full Name",\n          "type": "text",\n          "field_type": "single_text",\n          "values": [\n            {\n              "value": "Adam Smith"\n            }\n          ]\n        }\n      ]\n    },\n    {\n      "record_id": 1,\n      "title": "Andrea Lim",\n      "created_on": "2022-03-23 08:43:03",\n      "app": {\n        "app_id": 1,\n        "icon": "event_available",\n        "name": "Contacts",\n        "record_name": "Contact",\n        "workspace_id": 1\n      },\n      "fields": [\n        {\n          "field_id": 1,\n          "external_id": "full_name",\n          "label": "Full Name",\n          "type": "text",\n          "field_type": "single_text",\n          "values": [\n            {\n              "value": "Andrea Lim"\n            }\n          ]\n        }\n      ]\n    }\n  ]\n}'),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Query Parameters")),(0,l.kt)("table",null,(0,l.kt)("thead",{parentName:"table"},(0,l.kt)("tr",{parentName:"thead"},(0,l.kt)("th",{parentName:"tr",align:null},"Parameter"),(0,l.kt)("th",{parentName:"tr",align:null},"Type"),(0,l.kt)("th",{parentName:"tr",align:null},(0,l.kt)("strong",{parentName:"th"}," Type")),(0,l.kt)("th",{parentName:"tr",align:null},"Min"),(0,l.kt)("th",{parentName:"tr",align:null},"Max"))),(0,l.kt)("tbody",{parentName:"table"},(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"limit")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"integer")),(0,l.kt)("td",{parentName:"tr",align:null},"Number of records to return. Defaults to 50."),(0,l.kt)("td",{parentName:"tr",align:null},"0"),(0,l.kt)("td",{parentName:"tr",align:null},"500")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"cursor")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"string")),(0,l.kt)("td",{parentName:"tr",align:null},"Cursor for pagination"),(0,l.kt)("td",{parentName:"tr",align:null},"-"),(0,l.kt)("td",{parentName:"tr",align:null},"-")),(0,l.kt)("tr",{parentName:"tbody"},(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"sort_by")),(0,l.kt)("td",{parentName:"tr",align:null},(0,l.kt)("inlineCode",{parentName:"td"},"string")),(0,l.kt)("td",{parentName:"tr",align:null},"External ID of the field that should be sorted by."),(0,l.kt)("td",{parentName:"tr",align:null},"-"),(0,l.kt)("td",{parentName:"tr",align:null},"-")))))}g.isMDXComponent=!0}}]);