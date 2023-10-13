"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[9550],{9013:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>f,contentTitle:()=>m,default:()=>h,frontMatter:()=>c,metadata:()=>u,toc:()=>k});var i=a(7462),t=a(3366),l=(a(7294),a(3905)),o=a(4757),p=a(9877),d=a(8215),s=a(7859),r=["components"],c={id:"link",title:"Link Field",sidebar_label:"Link"},m=void 0,u={unversionedId:"api/resource/field/link",id:"api/resource/field/link",title:"Link Field",description:"There is only type of link field: multi_link.",source:"@site/docs/api/resource/field/link.md",sourceDirName:"api/resource/field",slug:"/api/resource/field/link",permalink:"/docs/api/resource/field/link",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/field/link.md",tags:[],version:"current",frontMatter:{id:"link",title:"Link Field",sidebar_label:"Link"},sidebar:"mainSidebar",previous:{title:"Number",permalink:"/docs/api/resource/field/number"},next:{title:"Checklist",permalink:"/docs/api/resource/field/checklist"}},f={},k=[{value:"App creation",id:"app-creation",level:2},{value:"App update",id:"app-update",level:2}],_={toc:k};function h(e){var n=e.components,a=(0,t.Z)(e,r);return(0,l.kt)("wrapper",(0,i.Z)({},_,a,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"There is only type of link field: ",(0,l.kt)("inlineCode",{parentName:"p"},"multi_link"),"."),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"multi_link")," fields-values can hold a one or more link entries."),(0,l.kt)("p",null,"A ",(0,l.kt)("inlineCode",{parentName:"p"},"multi_link")," field definition consists only of the common field properties and has no settings."),(0,l.kt)("h2",{id:"app-creation"},"App creation"),(0,l.kt)(o.Z,{method:"POST",url:"https://api.tapeapp.com/v1/app",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"A multi_link field can be created as part of an App creation. Here is an example request body for creating an excerpt for a contacts app within a workspace with ID 1.\nThe app contains a ",(0,l.kt)("inlineCode",{parentName:"p"},"multi_link"),' field "Social Media". Other useful fields for a contacts app, like "First Name", "Last Name" or "Notes" are omitted for brevity.'),(0,l.kt)(p.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(s.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X POST #BASE_URL/v1/app/ \\\n   -u #USER_API_KEY: \\\n   -H "Content-Type: application/json" \\\n   --data \'{\n    "workspace_id": 1,\n    "name": "Contacts",\n    "item_name": "Contact",\n    "fields": [\n      {\n        "field_type": "multi_link",\n        "config": {\n          "label": "Social Media",\n          "description": "The social media profiles of the contact.",\n          "required": false\n        }\n      }\n    ] \n  }\'\n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "workspace_id": 1,\n  "name": "Contacts",\n  "item_name": "Contact",\n  "fields": [\n    {\n      "field_type": "multi_link",\n      "config": {\n        "label": "Social Media",\n        "description": "The social media profiles of the contact.",\n        "required": false\n      }\n    }\n  ]\n}\n')))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "app_id": 1,\n  "workspace_id": 1,\n  "slug": "contacts",\n  "name": "Contacts",\n  "item_name": "Contact",\n  "position": 0,\n  "config": {\n    "item_name": "Contact",\n    "name": "Contacts"\n  },\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "social_media",\n      "slug": "social_media",\n      "label": "Social Media",\n      "field_type": "multi_link",\n      "type": "embed",\n      "config": {\n        "label": "Social Media",\n        "slug": "social_media",\n        "description": "The social media profiles of the contact.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false\n      }\n    }\n  ]\n}\n')),(0,l.kt)("h2",{id:"app-update"},"App update"),(0,l.kt)(o.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/app/{appId}",mdxType:"EndpointBadge"}),(0,l.kt)("p",null,"A ",(0,l.kt)("inlineCode",{parentName:"p"},"multi_link"),' field can be created or updated as part of an App update. Here is an example request body for updating the previously created contacts app with ID 1.\nThe update changes the name of the "Social Media" field to "Social Media Profiles".'),(0,l.kt)(p.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,l.kt)(d.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,l.kt)(s.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X PUT #BASE_URL/v1/app/1 \\\n   -u #BASE_URL: \\\n   --data \'{\n    "app_id": 1,\n    "fields": [\n      {\n        "field_id": 1,\n        "config": {\n          "label": "Social Media Profiles",\n          "description": "The social media profiles of the contact.",\n          "required": false\n        }\n      }\n    ] \n  }\'\n')),(0,l.kt)(d.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "app_id": 1,\n  "fields": [\n    {\n      "field_id": 1,\n      "config": {\n        "label": "Social Media Profiles",\n        "description": "The social media profiles of the contact.",\n        "required": false\n      }\n    }\n  ]\n}\n')))),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "app_id": 1,\n  "workspace_id": 1,\n  "slug": "contacts",\n  "external_id": "contacts",\n  "name": "Contacts",\n  "record_name": "Contact",\n  "item_name": "Contact",\n  "position": 0,\n  "config": {\n    "item_name": "Contact",\n    "name": "Contacts"\n  },\n  "fields": [\n    {\n      "field_id": 1,\n      "external_id": "social_media",\n      "slug": "social_media",\n      "label": "Social Media Profiles",\n      "field_type": "multi_link",\n      "type": "embed",\n      "config": {\n        "label": "Social Media Profiles",\n        "slug": "social_media",\n        "description": "The social media profiles of the contact.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false\n      }\n    }\n  ]\n}```\n\n')))}h.isMDXComponent=!0}}]);