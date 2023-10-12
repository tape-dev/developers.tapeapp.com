"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[6443],{2317:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>m,contentTitle:()=>c,default:()=>h,frontMatter:()=>u,metadata:()=>f,toc:()=>g});var i=t(7462),a=t(3366),s=(t(7294),t(3905)),l=t(4757),r=t(9877),p=t(8215),o=t(7859),d=["components"],u={id:"user",title:"User Field",sidebar_label:"User"},c=void 0,f={unversionedId:"api/resource/field/user",id:"api/resource/field/user",title:"User Field",description:"There are two types of user fields: singleuser and multiuser.",source:"@site/docs/api/resource/field/user.md",sourceDirName:"api/resource/field",slug:"/api/resource/field/user",permalink:"/docs/api/resource/field/user",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/field/user.md",tags:[],version:"current",frontMatter:{id:"user",title:"User Field",sidebar_label:"User"},sidebar:"mainSidebar",previous:{title:"Text",permalink:"/docs/api/resource/field/text"},next:{title:"Category",permalink:"/docs/api/resource/field/category"}},m={},g=[{value:"App creation",id:"app-creation",level:2},{value:"App update",id:"app-update",level:2}],_={toc:g};function h(e){var n=e.components,t=(0,a.Z)(e,d);return(0,s.kt)("wrapper",(0,i.Z)({},_,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"There are two types of user fields: ",(0,s.kt)("inlineCode",{parentName:"p"},"single_user")," and ",(0,s.kt)("inlineCode",{parentName:"p"},"multi_user"),".\n",(0,s.kt)("inlineCode",{parentName:"p"},"single_user")," fields can only hold a reference to a single user while ",(0,s.kt)("inlineCode",{parentName:"p"},"multi_user")," fields can hold references to multiple users."),(0,s.kt)("p",null,"A user field definition consists only of the common field properties and has no settings."),(0,s.kt)("h2",{id:"app-creation"},"App creation"),(0,s.kt)(l.Z,{method:"POST",url:"https://api.tapeapp.com/v1/app",mdxType:"EndpointBadge"}),(0,s.kt)("p",null,"A user field can be created as part of an App creation. Here is an example request body for creating an excerpt for a meetings app within a workspace with ID 1.\nThe app contains a ",(0,s.kt)("inlineCode",{parentName:"p"},"single_user"),' field "Note taker", and a ',(0,s.kt)("inlineCode",{parentName:"p"},"multi_user"),' field "Participants". Other useful fields for a meetings app, like "Date", "Location" or "Notes" are omitted for brevity.'),(0,s.kt)(r.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,s.kt)(p.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,s.kt)(o.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X POST #BASE_URL/v1/app/ \\\n   -u #USER_API_KEY: \\\n   -H "Content-Type: application/json" \\\n   --data \'{\n    "workspace_id": 1,\n    "name": "Meetings",\n    "item_name": "Meeting",\n    "fields": [\n      {\n        "field_type": "single_user",\n        "config": {\n          "label": "Responsible for Note taking",\n          "description": "The person responsible for taking notes during the meeting.",\n          "required": false\n        }\n      },\n      {\n        "field_type": "multi_user",\n        "config": {\n          "label": "Participants",\n          "description": "The participants of the meeting.",\n          "required": false\n        }\n      }\n    ] \n  }\'\n')),(0,s.kt)(p.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "workspace_id": 1,\n  "name": "Meetings",\n  "item_name": "Meeting",\n  "fields": [\n    {\n      "field_type": "single_user",\n      "config": {\n        "label": "Responsible for Note taking",\n        "description": "The person responsible for taking notes during the meeting.",\n        "required": false\n      }\n    },\n    {\n      "field_type": "multi_user",\n      "config": {\n        "label": "Participants",\n        "description": "The participants of the meeting.",\n        "required": false\n      }\n    }\n  ]\n}\n')))),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "app_id": 1,\n  "workspace_id": 1,\n  "slug": "meetings",\n  "external_id": "meetings",\n  "name": "Meetings",\n  "record_name": "Meeting",\n  "item_name": "Meeting",\n  "position": 0,\n  "config": {\n    "item_name": "Meeting",\n    "name": "Meetings"\n  },\n  "fields": [\n    {\n      "field_id": 1,\n      "slug": "responsible_for_note_taking",\n      "label": "Responsible for Note taking",\n      "type": "contact",\n      "field_type": "single_user",\n      "config": {\n        "label": "Responsible for Note taking",\n        "slug": "responsible_for_note_taking",\n        "description": "The person responsible for taking notes during the meeting.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "multiple": false\n        }\n      }\n    },\n    {\n      "field_id": 2,\n      "slug": "participants",\n      "label": "Participants",\n      "type": "contact",\n      "field_type": "multi_user",\n      "config": {\n        "label": "Participants",\n        "slug": "participants",\n        "description": "The participants of the meeting.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "multiple": true\n        }\n      }\n    }\n  ]\n}\n')),(0,s.kt)("h2",{id:"app-update"},"App update"),(0,s.kt)(l.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/app/{appId}",mdxType:"EndpointBadge"}),(0,s.kt)("p",null,'A user field can be created or updated as part of an App update. Here is an example request body for updating the previously created meetings app with ID 1.\nThe update splits the "Participants" field into "Internal Participants" and "External Participants" fields. Therefore, the "Participants" field with ID 2 is being renamed (updated) to "Internal Participants" and a new field "External Participants" is being created.\nThe "Responsible for note taking" field is not provided in the request body and therefore remains unchanged.'),(0,s.kt)(r.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,s.kt)(p.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,s.kt)(o.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X PUT #BASE_URL/v1/app/1 \\\n   -u #USERAPI_KEY: \\\n   --data \'{\n    "app_id": 1,\n    "fields": [\n      {\n        "field_id": 2,\n        "config": {\n          "label": "Internal Participants",\n          "description": "The company-internal participants of the meeting.",\n          "required": false\n        }\n      },\n      {\n        "field_type": "multi_user",\n        "config": {\n          "label": "External Participants",\n          "description": "The company-external participants of the meeting.",\n          "required": false\n        }\n      }\n    ] \n  }\'\n')),(0,s.kt)(p.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "app_id": 1,\n  "fields": [\n    {\n      "field_id": 1,\n      "config": {\n        "label": "First Name",\n        "description": "The first name of the contact.",\n        "required": true\n      }\n    },\n    {\n      "field_type": "single_user",\n      "config": {\n        "label": "Last Name",\n        "description": "The last name of the contact.",\n        "required": true\n      }\n    }\n  ]\n}\n')))),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "app_id": 1,\n  "workspace_id": 1,\n  "slug": "meetings",\n  "external_id": "meetings",\n  "name": "Meetings",\n  "record_name": "Meeting",\n  "item_name": "Meeting",\n  "config": {\n    "item_name": "Meeting",\n    "name": "Meetings"\n  },\n  "fields": [\n    {\n      "field_id": 1,\n      "slug": "responsible_for_note_taking",\n      "label": "Responsible for Note taking",\n      "type": "contact",\n      "field_type": "single_user",\n      "config": {\n        "label": "Responsible for Note taking",\n        "slug": "responsible_for_note_taking",\n          "description": "The person responsible for taking notes during the meeting.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "multiple": false\n        }\n      }\n    },\n    {\n      "field_id": 2,\n      "slug": "participants",\n      "label": "Internal Participants",\n      "type": "contact",\n      "field_type": "multi_user",\n      "config": {\n        "label": "Internal Participants",\n        "slug": "participants",\n        "description": "The company-internal participants of the meeting.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "multiple": true\n        }\n      }\n    },\n    {\n      "field_id": 3,\n      "slug": "external_participants",\n      "label": "External Participants",\n      "type": "contact",\n      "field_type": "multi_user",\n      "config": {\n        "label": "External Participants",\n        "slug": "external_participants",\n        "description": "The company-external participants of the meeting.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "multiple": true\n        }\n      }\n    },\n  ]\n}```\n\n')))}h.isMDXComponent=!0}}]);