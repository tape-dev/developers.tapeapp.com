"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[2443],{4890:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>f,contentTitle:()=>m,default:()=>k,frontMatter:()=>c,metadata:()=>u,toc:()=>h});var a=t(7462),i=t(3366),p=(t(7294),t(3905)),o=t(4757),l=t(9877),s=t(8215),r=t(7859),d=["components"],c={id:"app",title:"App",sidebar_label:"App"},m=void 0,u={unversionedId:"api/resource/app",id:"api/resource/app",title:"App",description:"Retrieve apps for a workspace",source:"@site/docs/api/resource/app.md",sourceDirName:"api/resource",slug:"/api/resource/app",permalink:"/docs/api/resource/app",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/app.md",tags:[],version:"current",frontMatter:{id:"app",title:"App",sidebar_label:"App"},sidebar:"mainSidebar",previous:{title:"Record Revision",permalink:"/docs/api/resource/record-revision"},next:{title:"Overview",permalink:"/docs/api/resource/field/overview"}},f={},h=[{value:"Retrieve apps for a workspace",id:"retrieve-apps-for-a-workspace",level:2},{value:"Retrieve all available apps",id:"retrieve-all-available-apps",level:2},{value:"Retrieve a single app",id:"retrieve-a-single-app",level:2},{value:"Create an App",id:"create-an-app",level:2},{value:"Update an App",id:"update-an-app",level:2},{value:"Delete an App",id:"delete-an-app",level:2}],_={toc:h};function k(e){var n=e.components,t=(0,i.Z)(e,d);return(0,p.kt)("wrapper",(0,a.Z)({},_,t,{components:n,mdxType:"MDXLayout"}),(0,p.kt)("h2",{id:"retrieve-apps-for-a-workspace"},"Retrieve apps for a workspace"),(0,p.kt)(o.Z,{method:"GET",url:"https://api.tapeapp.com/v1/app/workspace/{workspaceId}",mdxType:"EndpointBadge"}),(0,p.kt)("p",null,"Retrieve all apps for the workspace with ID ",(0,p.kt)("inlineCode",{parentName:"p"},"200")," (Note that the response does not contain the fields):"),(0,p.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/app/workspace/200 \\\n  -u #USER_API_KEY:"),(0,p.kt)(r.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'{\n  "total": 2,\n  "apps": [\n    {\n      "app_id": 1,\n      "workspace_id": 200,\n      "name": "Tasks",\n      "slug": "tasks",\n      "config": {\n        "item_name": "Task",\n        "name": "Tasks",\n        "description": ""\n      }\n    },\n    {\n      "app_id": 2,\n      "workspace_id": 200,\n      "name": "Projects",\n      "slug": "projects",\n      "config": { \n        "item_name": "Project",\n        "name": "Projects",\n        "description": ""\n      }\n    }\n  ]\n}'),(0,p.kt)("h2",{id:"retrieve-all-available-apps"},"Retrieve all available apps"),(0,p.kt)(o.Z,{method:"GET",url:"https://api.tapeapp.com/v1/app/workspace/{workspaceId}",mdxType:"EndpointBadge"}),(0,p.kt)("p",null,"Retrieve all apps inside the workspaces that you have access to (Note that the response does not contain the fields):"),(0,p.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/app \\\n  -u #USER_API_KEY:"),(0,p.kt)(r.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'{\n  "total": 3,\n  "apps": [\n    {\n      "app_id": 1,\n      "workspace_id": 200,\n      "name": "Tasks",\n      "slug": "tasks",\n      "config": {\n        "item_name": "Task",\n        "name": "Tasks",\n        "description": ""\n      }\n    },\n    {\n      "app_id": 2,\n      "workspace_id": 200,\n      "name": "Projects",\n      "slug": "projects",\n      "config": { \n        "item_name": "Project",\n        "name": "Projects",\n        "description": ""\n      },\n    },\n    {\n    "app_id": 3,\n    "workspace_id": 300,\n    "name": "Contacts",\n    "slug": "contacts",\n    "config": { \n      "item_name": "Contact",\n      "name": "Contacts",\n      "description": ""\n    }\n  }\n]\n}'),(0,p.kt)("h2",{id:"retrieve-a-single-app"},"Retrieve a single app"),(0,p.kt)(o.Z,{method:"GET",url:"https://api.tapeapp.com/v1/app/{appId}",mdxType:"EndpointBadge"}),(0,p.kt)("p",null,"Retrieve an app with fields by its ID ",(0,p.kt)("inlineCode",{parentName:"p"},"1"),":"),(0,p.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/app/1 \\\n  -u #USER_API_KEY:"),(0,p.kt)(r.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'\n  {\n    "app_id": 1,\n    "workspace_id": 200,\n    "name": "Tasks",\n    "slug": "tasks",\n    "config": {\n      "item_name": "Task",\n      "name": "Tasks",\n      "description": ""\n    },\n    "fields": [\n      {\n        "field_id": 1,\n        "external_id": "full_name",\n        "label": "Full Name",\n        "type": "text",\n        "field_type": "single_text",\n        "config": {\n          "description": null,\n          "required": false,\n          "label": "FST",\n          "settings": {\n            "format": "plain",\n            "size": "small"\n          }\n        },\n      }\n    ]\n  }\n'),(0,p.kt)("h2",{id:"create-an-app"},"Create an App"),(0,p.kt)(o.Z,{method:"POST",url:"https://api.tapeapp.com/v1/app",mdxType:"EndpointBadge"}),(0,p.kt)("p",null,"Create a new app within a workspace. The request body contains the following fields:"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},'workspace_id: The ID of the workspace to create the app in. The requesting user needs to have permission to "create and edit" apps in this workspace.'),(0,p.kt)("li",{parentName:"ul"},"name (required): Name of the app."),(0,p.kt)("li",{parentName:"ul"},"item_name (required): Name of the records within the app."),(0,p.kt)("li",{parentName:"ul"},"description (optional): Description of the app."),(0,p.kt)("li",{parentName:"ul"},"fields (optional): An array of fields to create with the app. See the ",(0,p.kt)("a",{parentName:"li",href:"/docs/api/resource/field/overview"},"field documentation")," for more information. The provided fields will be created with the same order as provided in the array."),(0,p.kt)("li",{parentName:"ul"},"icon (optional): Icon of the app. See the ",(0,p.kt)("a",{parentName:"li",href:"/docs/api/resource/icon"},"icon documentation")," for more information."),(0,p.kt)("li",{parentName:"ul"},"item_icon (optional): Icon of the records within the app. See the ",(0,p.kt)("a",{parentName:"li",href:"/docs/api/resource/icon"},"icon documentation")," for more information.")),(0,p.kt)("p",null,"Here is an example request body for creating a contacts app within a workspace with ID 1.\nThe app contains a ",(0,p.kt)("inlineCode",{parentName:"p"},"single_text"),' field "Name", and a ',(0,p.kt)("inlineCode",{parentName:"p"},"multi_text"),' field "Notes"'),(0,p.kt)(l.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,p.kt)(s.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,p.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X POST #BASE_URL/v1/app/ \\\n   -u #USER_API_KEY: \\\n   -H "Content-Type: application/json" \\\n   --data \'{\n    "workspace_id": 1,\n    "name": "Contacts",\n    "item_name": "Contact",\n    "description": "A simple contact app.",\n    "icon": {\n      "id": "person",\n      "type": "graphic"\n    },\n    "item_icon": {\n      "emoji": "\ud83e\uddd1",\n      "type": "emoji"\n    },\n    "fields": [\n      {\n        "field_type": "single_text",\n        "config": {\n          "label": "Name",\n          "description": "The full name of the contact.",\n          "required": true\n        }\n      },\n      {\n        "field_type": "multi_text",\n        "config": {\n          "label": "Notes",\n          "description": "Notes about the contact.",\n          "required": false\n        }\n      }\n    ] \n  }\'\n')),(0,p.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "workspace_id": 1,\n  "name": "Contacts",\n  "item_name": "Contact",\n  "description": "A simple contact app.",\n  "icon": {\n    "id": "person",\n    "type": "graphic"\n  },\n  "item_icon": {\n    "emoji": "\ud83e\uddd1",\n    "type": "emoji"\n  },\n  "fields": [\n    {\n      "field_type": "single_text",\n      "config": {\n        "label": "Name",\n        "description": "The full name of the contact.",\n        "required": true\n      }\n    },\n    {\n      "field_type": "multi_text",\n      "config": {\n        "label": "Notes",\n        "description": "Notes about the contact.",\n        "required": false\n      }\n    }\n  ]\n}\n')))),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "app_id": 1,\n  "workspace_id": 1,\n  "slug": "contacts",\n  "external_id": "contacts",\n  "name": "Contacts",\n  "record_name": "Contact",\n  "item_name": "Contact",\n  "description": "A simple contact app.",\n  "position": 0,\n  "config": {\n    "description": "A simple contact app.",\n    "item_name": "Contact",\n    "name": "Contacts",\n    "icon": {\n      "type": "graphic",\n      "id": "person"\n    },\n    "item_icon": {\n      "emoji": "\ud83e\uddd1",\n      "type": "emoji"\n    }\n  },\n  "fields": [\n    {\n      "field_id": 10,\n      "external_id": "name",\n      "slug": "name",\n      "label": "Name",\n      "type": "text",\n      "field_type": "single_text",\n      "config": {\n        "label": "Name",\n        "slug": "name",\n        "external_id": "name",\n        "delta": "O1",\n        "position": "O1",\n        "description": "The full name of the contact.",\n        "required": true,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "formatted": false\n        }\n      }\n    },\n    {\n      "field_id": 20,\n      "external_id": "notes",\n      "slug": "notes",\n      "label": "Notes",\n      "type": "text",\n      "field_type": "multi_text",\n      "config": {\n        "label": "Notes",\n        "slug": "notes",\n        "external_id": "notes",\n        "delta": "f{",\n        "position": "f{",\n        "description": "Notes about the contact.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "formatted": true\n        }\n      }\n    }\n  ]\n}\n')),(0,p.kt)("h2",{id:"update-an-app"},"Update an App"),(0,p.kt)(o.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/app/{appId}",mdxType:"EndpointBadge"}),(0,p.kt)("p",null,"Update an existing app. The request body contains the following fields:"),(0,p.kt)("ul",null,(0,p.kt)("li",{parentName:"ul"},"name (optional): Name of the app."),(0,p.kt)("li",{parentName:"ul"},"item_name (optional): Name of the records within the app."),(0,p.kt)("li",{parentName:"ul"},"description (optional): Description of the app."),(0,p.kt)("li",{parentName:"ul"},"fields (optional): An array of fields to create with the app. See the ",(0,p.kt)("a",{parentName:"li",href:"/docs/api/resource/field/overview"},"field documentation")," for more information. The provided fields will be created with the same order as provided in the array."),(0,p.kt)("li",{parentName:"ul"},"fields_to_delete (optional): An array of fields to delete within the request. Existing elements from the fields property can be added to this array to delete them. The field_id of the field to delete needs to be provided."),(0,p.kt)("li",{parentName:"ul"},"icon (optional): Icon of the app. See the ",(0,p.kt)("a",{parentName:"li",href:"/docs/api/resource/icon"},"icon documentation")," for more information."),(0,p.kt)("li",{parentName:"ul"},"item_icon (optional): Icon of the records within the app. See the ",(0,p.kt)("a",{parentName:"li",href:"/docs/api/resource/icon"},"icon documentation")," for more information.")),(0,p.kt)("p",null,"Here is an example request body for updating the previously created contacts app."),(0,p.kt)("p",null,'The request removes the "Name" field and adds a new ',(0,p.kt)("inlineCode",{parentName:"p"},"single_text"),' field "First Name" and a ',(0,p.kt)("inlineCode",{parentName:"p"},"single_text"),' field "Last Name".\nThe Notes field is neither provided within the fields array nor the fields_to_delete array, so it will not be changed.'),(0,p.kt)(l.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,p.kt)(s.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,p.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'\ncurl -X PUT #BASE_URL/v1/app/1 \\\n   -u #USER_API_KEY: \\\n   -H "Content-Type: application/json" \\\n   --data \'{\n    "fields": [\n      {\n        "field_type": "single_text",\n        "config": {\n          "label": "First Name",\n          "description": "The first name of the contact.",\n          "required": true\n        }\n      },\n      {\n        "field_type": "single_text",\n        "config": {\n          "label": "Last Name",\n          "description": "The last name of the contact.",\n          "required": true\n        }\n      }\n    ], \n    "fields_to_delete": [\n      {\n        "field_id": 10\n      }\n    ]\n  }\'\n')),(0,p.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "fields": [\n    {\n      "field_type": "single_text",\n      "config": {\n        "label": "First Name",\n        "description": "The first name of the contact.",\n        "required": true\n      }\n    },\n    {\n      "field_type": "single_text",\n      "config": {\n        "label": "Last Name",\n        "description": "The last name of the contact.",\n        "required": true\n      }\n    }\n  ],\n  "fields_to_delete": [\n    {\n      "field_id": 10\n    }\n  ]\n}\n')))),(0,p.kt)("pre",null,(0,p.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u2b05\ufe0f \xa0\xa0   Response"',title:'"\u2b05\ufe0f',"\xa0\xa0":!0,"":!0,'Response"':!0},'{\n  "app_id": 1,\n  "workspace_id": 1,\n  "slug": "contacts",\n  "name": "Contacts",\n  "item_name": "Contact",\n  "description": "A simple contact app.",\n  "position": 0,\n  "config": {\n    "description": "A simple contact app.",\n    "item_name": "Contact",\n    "name": "Contacts",\n    "icon": {\n      "type": "graphic",\n      "id": "person"\n    }\n  },\n  "fields": [\n    {\n      "field_id": 3,\n      "slug": "first_name",\n      "label": "First Name",\n      "type": "text",\n      "field_type": "single_text",\n      "config": {\n        "label": "First Name",\n        "slug": "first_name",\n        "description": "The first name of the contact.",\n        "required": true,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "formatted": false\n        }\n      }\n    },\n    {\n      "field_id": 4,\n      "external_id": "last_name",\n      "slug": "last_name",\n      "label": "Last Name",\n      "type": "text",\n      "field_type": "single_text",\n      "config": {\n        "label": "Last Name",\n        "slug": "last_name",\n        "description": "The last name of the contact.",\n        "required": true,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "formatted": false\n        }\n      }\n    },\n    {\n      "field_id": 20,\n      "external_id": "notes",\n      "slug": "notes",\n      "label": "Notes",\n      "type": "text",\n      "field_type": "multi_text",\n      "config": {\n        "label": "Notes",\n        "slug": "notes",\n        "description": "Notes about the contact.",\n        "required": false,\n        "always_hidden": false,\n        "hidden_if_empty": false,\n        "settings": {\n          "formatted": true\n        }\n      }\n    }\n  ]\n}\n')),(0,p.kt)("h2",{id:"delete-an-app"},"Delete an App"),(0,p.kt)(o.Z,{method:"DELETE",url:"https://api.tapeapp.com/v1/app/{appId}",mdxType:"EndpointBadge"}),(0,p.kt)("p",null,"Deleting an existing app. ATTENTION: This action cannot be undone. All records and fields will be deleted as well."),(0,p.kt)(l.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,p.kt)(s.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,p.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"\ncurl -X DELETE #BASE_URL/v1/app/1 \\\n   -u #USER_API_KEY: "))))}k.isMDXComponent=!0}}]);