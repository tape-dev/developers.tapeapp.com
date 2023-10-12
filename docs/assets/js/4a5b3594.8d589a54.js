"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[3406],{173:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>f,contentTitle:()=>m,default:()=>_,frontMatter:()=>c,metadata:()=>u,toc:()=>g});var a=t(7462),i=t(3366),o=(t(7294),t(3905)),l=t(4757),s=t(9877),p=t(8215),d=t(7859),r=["components"],c={id:"location",title:"Location Field",sidebar_label:"Location"},m=void 0,u={unversionedId:"api/resource/field/location",id:"api/resource/field/location",title:"Location Field",description:"There is only type of location field: single_location.",source:"@site/docs/api/resource/field/location.md",sourceDirName:"api/resource/field",slug:"/api/resource/field/location",permalink:"/docs/api/resource/field/location",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/field/location.md",tags:[],version:"current",frontMatter:{id:"location",title:"Location Field",sidebar_label:"Location"},sidebar:"mainSidebar",previous:{title:"Date",permalink:"/docs/api/resource/field/date"},next:{title:"Email",permalink:"/docs/api/resource/field/email"}},f={},g=[{value:"App creation",id:"app-creation",level:2},{value:"App update",id:"app-update",level:2}],h={toc:g};function _(e){var n=e.components,t=(0,i.Z)(e,r);return(0,o.kt)("wrapper",(0,a.Z)({},h,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"There is only type of location field: ",(0,o.kt)("inlineCode",{parentName:"p"},"single_location"),"."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"single_location")," fields can only hold a single location, including the address properties and a map preview."),(0,o.kt)("p",null,"In addition to the common field properties, a location field has the following settings:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"has_map: boolean flag, whether the google maps embed should be shown in the location field values of this field. (default: false)")),(0,o.kt)("h2",{id:"app-creation"},"App creation"),(0,o.kt)(l.Z,{method:"POST",url:"https://api.tapeapp.com/v1/app",mdxType:"EndpointBadge"}),(0,o.kt)("p",null,"A location field can be created as part of an App creation. Here is an example request body for creating an excerpt for a meetings app within a workspace with ID 1.\nThe app contains a ",(0,o.kt)("inlineCode",{parentName:"p"},"single_location"),' field "Location". Other useful fields for a meetings app, like "Date", "Participants" or "Notes" are omitted for brevity.'),(0,o.kt)(s.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,o.kt)(p.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,o.kt)(d.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X POST #BASE_URL/v1/app/ \\\n   -u #USER_API_KEY: \\\n   -H "Content-Type: application/json" \\\n   --data \'{\n    "workspace_id": 1,\n    "name": "Meetings",\n    "item_name": "Meeting",\n    "fields": [\n      {\n        "field_type": "single_location",\n        "config": {\n          "label": "Location",\n          "description": "The location of the meeting.",\n          "required": false,\n          "settings": {\n            "has_map": true\n          }\n        }\n      }\n    ] \n  }\'\n')),(0,o.kt)(p.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "workspace_id": 1,\n  "name": "Meetings",\n  "item_name": "Meeting",\n  "fields": [\n    {\n      "field_type": "single_location",\n      "config": {\n        "label": "Location",\n        "description": "The location of the meeting.",\n        "required": false,\n        "settings": {\n          "has_map": true\n        }\n      }\n    }\n  ]\n}\n')))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "app_id": 1,\n  "workspace_id": 1,\n  "slug": "meetings",\n  "name": "Meetings",\n  "record_name": "Meeting",\n  "item_name": "Meeting",\n  "position": 0,\n  "config": {\n    "item_name": "Meeting",\n    "name": "Meetings"\n  },\n  "fields": [\n    {\n      "field_id": 1,\n      "slug": "location",\n      "label": "Location",\n      "type": "location",\n      "field_type": "single_location",\n      "config": {\n        "label": "Location",\n        "slug": "location",\n        "description": "The location of the meeting.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "has_map": true\n        }\n      }\n    }\n  ]\n}\n')),(0,o.kt)("h2",{id:"app-update"},"App update"),(0,o.kt)(l.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/app/{appId}",mdxType:"EndpointBadge"}),(0,o.kt)("p",null,"A location field can be created or updated as part of an App update. Here is an example request body for updating the previously created meetings app with ID 1.\nThe update sets the show_map flag to false."),(0,o.kt)(s.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,o.kt)(p.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,o.kt)(d.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X PUT #BASE_URL/v1/app/1 \\\n  -u #USER_API_KEY: \\\n   -H "Content-Type: application/json"    --data \'{\n    "app_id": 1,\n    "name": "Meetings",\n    "item_name": "Meeting",\n    "fields": [\n      {\n        "field_id": 1,\n        "config": {\n          "label": "Location",\n          "description": "The location of the meeting.",\n          "required": false,\n          "settings": {\n            "has_map": false\n          }\n        }\n      }\n    ] \n  }\'\n')),(0,o.kt)(p.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "app_id": 1,\n  "name": "Meetings",\n  "item_name": "Meeting",\n  "fields": [\n    {\n      "field_id": 1,\n      "config": {\n        "label": "Location",\n        "description": "The location of the meeting.",\n        "required": false,\n        "settings": {\n          "has_map": false\n        }\n      }\n    }\n  ]\n}\n')))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n    "app_id": 1,\n    "workspace_id": 1,\n    "slug": "meetings",\n    "name": "Meetings",\n    "record_name": "Meeting",\n    "item_name": "Meeting",\n    "position": 0,\n    "config": {\n      "item_name": "Meeting",\n      "name": "Meetings"\n    },\n    "fields": [\n      {\n        "field_id": 1,\n        "external_id": "location",\n        "slug": "location",\n        "label": "Location",\n        "type": "location",\n        "field_type": "single_location",\n        "config": {\n          "label": "Location",\n          "slug": "location",\n          "description": "The location of the meeting.",\n          "required": false,\n          "always_hidden": false,\n          "hidden_if_empty": false,\n          "settings": {\n            "has_map": false\n          }\n        }\n      }\n    ]\n}```\n\n')))}_.isMDXComponent=!0}}]);