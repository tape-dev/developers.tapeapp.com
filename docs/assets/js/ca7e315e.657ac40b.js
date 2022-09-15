"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[6906],{4757:(e,n,r)=>{r.d(n,{Z:()=>t});var a=r(7294);function t(e){var n,r=e.method,t=e.url;switch(r){case"GET":n="#007959";break;case"POST":n="#0071BB";break;case"PUT":n="#DEA700";break;case"DELETE":n="#DF245E"}return a.createElement("div",{style:{display:"flex",flexDirection:"row",fontSize:"15px",lineHeight:"15px",marginBottom:"13px"}},a.createElement("span",{style:{backgroundColor:n,color:"var(--tape-color-lightest)",borderRadius:"999px",padding:"4px 9px 3px 9px",fontWeight:700,fontSize:"11px",lineHeight:"11px"}},r.toUpperCase()),a.createElement("span",{style:{color:"var(--tape-color-darker)",marginLeft:"9px",marginTop:"2px"}},t))}},7681:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>v,contentTitle:()=>c,default:()=>g,frontMatter:()=>u,metadata:()=>m,toc:()=>_});var a=r(7462),t=r(3366),l=(r(7294),r(3905)),i=r(4757),s=r(9877),d=r(8215),o=r(7859),p=["components"],u={id:"user",title:"User Field Value",sidebar_label:"User"},c=void 0,m={unversionedId:"api/resource/field-value/user",id:"api/resource/field-value/user",title:"User Field Value",description:"A user field value consists of its value property which holds a reference to a user. A user has the properties userid (unique ID), name (the username), orgId (ID of the user's organization) and others.",source:"@site/docs/api/resource/field-value/user.md",sourceDirName:"api/resource/field-value",slug:"/api/resource/field-value/user",permalink:"/docs/api/resource/field-value/user",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/field-value/user.md",tags:[],version:"current",frontMatter:{id:"user",title:"User Field Value",sidebar_label:"User"},sidebar:"mainSidebar",previous:{title:"Status",permalink:"/docs/api/resource/field-value/status"},next:{title:"Category",permalink:"/docs/api/resource/field-value/category"}},v={},_=[{value:"Record creation",id:"record-creation",level:2},{value:"Record retrieval",id:"record-retrieval",level:2},{value:"Record update",id:"record-update",level:2}],f={toc:_};function g(e){var n=e.components,r=(0,t.Z)(e,p);return(0,l.kt)("wrapper",(0,a.Z)({},f,r,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"A user field value consists of its ",(0,l.kt)("inlineCode",{parentName:"p"},"value")," property which holds a reference to a user. A user has the properties ",(0,l.kt)("inlineCode",{parentName:"p"},"user_id")," (unique ID), ",(0,l.kt)("inlineCode",{parentName:"p"},"name")," (the username), ",(0,l.kt)("inlineCode",{parentName:"p"},"org_Id")," (ID of the user's organization) and others.\nA ",(0,l.kt)("inlineCode",{parentName:"p"},"single_user")," field value holds at most one user reference while a ",(0,l.kt)("inlineCode",{parentName:"p"},"multi_user")," field value can hold multiple user references."),(0,l.kt)("h2",{id:"record-creation"},"Record creation"),(0,l.kt)(i.Z,{method:"POST",url:"https://api.tapeapp.com/v1/record/app/{app_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,'A user field value can be created as part of a record creation. Here is an example request body for creating a record with a value for the "Supervisor" field with ID 2, type ',(0,l.kt)("inlineCode",{parentName:"p"},"single_user")," and external ID ",(0,l.kt)("inlineCode",{parentName:"p"},"supervisor"),' and a value for the "Interviewed by" field with ID 3, type ',(0,l.kt)("inlineCode",{parentName:"p"},"multi_user")," and external ID ",(0,l.kt)("inlineCode",{parentName:"p"},"interviewed_by"),":"),(0,l.kt)(s.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(o.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/record/app/1 \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "supervisor": 1,\n      "interviewed_by": [4, 5]\n    }\n  }\' \n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "supervisor": 1,\n    "interviewed_by": [4, 5]\n  }\n}\n')))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "record_id": 1,\n  "title": "Zoe Maxwell",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "supervisor",\n      "label": "Supervisor",\n      "type": "user",\n      "field_type": "single_user",\n      "values": [\n        {\n          "value": {\n            "user_id": 1,\n            "mail": ["zoe@tapeapp.com"],\n            "image": null,\n            "name": "Zoe Maxwell",\n            "org_id": 1,\n            "type": "user"\n          }\n        }\n      ]\n    },\n    {\n      "field_id": 3,\n      "external_id": "interviewed_by",\n      "label": "Interviewed by",\n      "field_type": "multi_user",\n      "type": "user",\n      "values": [\n        {\n          "value": {\n            "user_id": 4,\n            "mail": ["dan@tapeapp.com"],\n            "image": null,\n            "name": "Dan Jacob",\n            "org_id": 1,\n            "type": "user"\n          }\n        },\n        {\n          "value": {\n            "user_id": 5,\n            "mail": ["sierra@tapeapp.com"],\n            "image": null,\n            "name": "Sierra Johns",\n            "org_id": 1,\n            "type": "user"\n          }\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("h2",{id:"record-retrieval"},"Record retrieval"),(0,l.kt)(i.Z,{method:"GET",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"A user field value can be retrieved as part of a record retrieval:"),(0,l.kt)(o.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Zoe Maxwell",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "supervisor",\n      "label": "Supervisor",\n      "type": "user",\n      "field_type": "single_user",\n      "values": [\n        {\n          "value": {\n            "user_id": 1,\n            "mail": ["zoe@tapeapp.com"],\n            "image": null,\n            "name": "Zoe Maxwell",\n            "org_id": 1,\n            "type": "user"\n          }\n        }\n      ]\n    },\n    {\n      "field_id": 3,\n      "external_id": "interviewed_by",\n      "label": "Interviewed by",\n      "field_type": "multi_user",\n      "type": "user",\n      "values": [\n        {\n          "value": {\n            "user_id": 4,\n            "mail": ["dan@tapeapp.com"],\n            "image": null,\n            "name": "Dan Jacob",\n            "org_id": 1,\n            "type": "user"\n          }\n        },\n        {\n          "value": {\n            "user_id": 5,\n            "mail": ["sierra@tapeapp.com"],\n            "image": null,\n            "name": "Sierra Johns",\n            "org_id": 1,\n            "type": "user"\n          }\n        }\n      ]\n    }\n  ]\n}\n')),(0,l.kt)("h2",{id:"record-update"},"Record update"),(0,l.kt)(i.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/record/{record_id}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"One or more user field values can be updated as part of a record update. Here is an example request body for updating multiple user field values of a record:"),(0,l.kt)(s.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(o.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X PUT #BASE_URL/v1/record/1 \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "fields": {\n      "supervisor": 2,\n      "interviewed_by": [5]\n    }\n  }\' \n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": {\n    "supervisor": 2,\n    "interviewed_by": [5]\n  }\n}\n')))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "record_id": 1,\n  "title": "Delaney Beatty",\n  "fields": [\n    {\n      "field_id": 2,\n      "external_id": "supervisor",\n      "label": "Supervisor",\n      "type": "user",\n      "field_type": "single_user",\n      "values": [\n        {\n          "value": {\n            "user_id": 2,\n            "mail": ["delaney@tapeapp.com"],\n            "image": null,\n            "name": "Delaney Beatty",\n            "org_id": 1,\n            "type": "user"\n          }\n        }\n      ]\n    },\n    {\n      "field_id": 3,\n      "external_id": "interviewed_by",\n      "label": "Interviewed by",\n      "field_type": "multi_user",\n      "type": "user",\n      "values": [\n        {\n          "value": {\n            "user_id": 5,\n            "mail": ["sierra@tapeapp.com"],\n            "image": null,\n            "name": "Sierra Johns",\n            "org_id": 1,\n            "type": "user"\n          }\n        }\n      ]\n    }\n  ]\n}\n')))}g.isMDXComponent=!0}}]);