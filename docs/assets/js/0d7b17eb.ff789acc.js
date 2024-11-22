"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[1066],{8327:(e,i,n)=>{n.r(i),n.d(i,{assets:()=>h,contentTitle:()=>c,default:()=>b,frontMatter:()=>m,metadata:()=>u,toc:()=>k});var r=n(7462),s=n(3366),t=(n(7294),n(3905)),a=n(4757),o=n(9877),p=n(8215),d=n(7859),l=["components"],m={id:"record-permissions",title:"Record Permissions",sidebar_label:"Record Permissions"},c=void 0,u={unversionedId:"api/resource/record-permissions",id:"api/resource/record-permissions",title:"Record Permissions",description:"Records are the place where work gets done inside a Tape organization. Records permissions can be changed via the developer API.",source:"@site/docs/api/resource/record-permissions.md",sourceDirName:"api/resource",slug:"/api/resource/record-permissions",permalink:"/docs/api/resource/record-permissions",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/record-permissions.md",tags:[],version:"current",frontMatter:{id:"record-permissions",title:"Record Permissions",sidebar_label:"Record Permissions"},sidebar:"mainSidebar",previous:{title:"Record Revision",permalink:"/docs/api/resource/record-revision"},next:{title:"App",permalink:"/docs/api/resource/app"}},h={},k=[{value:"Batch update multiple records&#39; permissions",id:"batch-update-multiple-records-permissions",level:2}],v={toc:k};function b(e){var i=e.components,n=(0,s.Z)(e,l);return(0,t.kt)("wrapper",(0,r.Z)({},v,n,{components:i,mdxType:"MDXLayout"}),(0,t.kt)("p",null,"Records are the place where work gets done inside a Tape organization. Records permissions can be changed via the developer API."),(0,t.kt)("h2",{id:"batch-update-multiple-records-permissions"},"Batch update multiple records' permissions"),(0,t.kt)(a.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/record/permission/batch",isNew:"true",mdxType:"EndpointBadge"}),(0,t.kt)("p",null,"To update record permissions, issue a PUT request to this endpoint. The PUT body has to contain the ",(0,t.kt)("inlineCode",{parentName:"p"},"inputs")," property with an array of objects that have a ",(0,t.kt)("inlineCode",{parentName:"p"},"record_id")," property to specify for which record permissions should be alterered, and two arrays ",(0,t.kt)("inlineCode",{parentName:"p"},"add_permissions")," and ",(0,t.kt)("inlineCode",{parentName:"p"},"remove_permissions"),"."),(0,t.kt)("p",null,"Optionally specifying ",(0,t.kt)("inlineCode",{parentName:"p"},"add_permissions"),", each entry must contain either a ",(0,t.kt)("inlineCode",{parentName:"p"},"user_id")," or an ",(0,t.kt)("inlineCode",{parentName:"p"},"email")," property for the respective organization user to be added. If there is no user inside the organization that matches ",(0,t.kt)("inlineCode",{parentName:"p"},"email"),", a new one will be created and an invitation to join Tape will be sent. Additionally, a numeric ",(0,t.kt)("inlineCode",{parentName:"p"},"permission_level")," needs to be specified."),(0,t.kt)("p",null,"Valid permission levels to be specified for the ",(0,t.kt)("inlineCode",{parentName:"p"},"permission_level")," property are:"),(0,t.kt)("ul",null,(0,t.kt)("li",{parentName:"ul"},"5 / (full access)"),(0,t.kt)("li",{parentName:"ul"},"4 / (can share)"),(0,t.kt)("li",{parentName:"ul"},"3 / (can edit)"),(0,t.kt)("li",{parentName:"ul"},"2 / (can comment)"),(0,t.kt)("li",{parentName:"ul"},"1 / (can view)"),(0,t.kt)("li",{parentName:"ul"},"0 / (no access)")),(0,t.kt)("p",null,"Optionally specifying ",(0,t.kt)("inlineCode",{parentName:"p"},"remove_permissions"),", each entry must be either a user ID or an email. Access for the respective user will be removed, if it was added prior. This does not affect access that a user might have via workspace memberships or app permissions."),(0,t.kt)("p",null,"Currently, only for a maximum of ",(0,t.kt)("strong",{parentName:"p"},"50 records")," the permissions can be batch updated at the same time. An error will be thrown if the ",(0,t.kt)("inlineCode",{parentName:"p"},"inputs")," array exceeds that limit. If you need more, issue seperate requests."),(0,t.kt)(o.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,t.kt)(p.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,t.kt)(d.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X PUT #BASE_URL/v1/record/permission/batch \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "inputs": [\n      {\n        "record_id": 1,\n        "add_permissions": [\n          {\n            "user_id": 100,\n            "permission_level": 5\n          }\n        ],\n        "remove_permissions": [101]\n      },\n      {\n        "record_id": 2,\n        "add_permissions": [\n          {\n            "user_id": 100,\n            "permission_level": 5\n          },\n          {\n            "email": "john@doe.com",\n            "permission_level": 4\n          },\n        ],\n        "remove_permissions": [101]\n      }\n    ]\n  }\' \n')),(0,t.kt)(p.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "input": [\n    {\n      "record_id": 1,\n      "add_permissions": [\n        {\n          "user_id": 100,\n          "permission_level": 5\n        }\n      ],\n      "remove_permissions": [101]\n    },\n    {\n      "record_id": 2,\n      "add_permissions": [\n        {\n          "user_id": 100,\n          "permission_level": 5\n        },\n        {\n          "email": "john@doe.com",\n          "permission_level": 4\n        }\n      ],\n      "remove_permissions": [101]\n    }\n  ]\n}\n')))),(0,t.kt)("pre",null,(0,t.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},"{}\n")),(0,t.kt)("p",null,"The example above alters permissions for two records with id ",(0,t.kt)("inlineCode",{parentName:"p"},"1")," and ",(0,t.kt)("inlineCode",{parentName:"p"},"2"),", adding the user with ID ",(0,t.kt)("inlineCode",{parentName:"p"},"100")," two both records gaining full access, and additionally adding a second user gaining access to record with ID ",(0,t.kt)("inlineCode",{parentName:"p"},"2")," via email. The user would be created and invited if there is no user matching the email in the active organization. Further, user with ID ",(0,t.kt)("inlineCode",{parentName:"p"},"101")," is revoked the access two both records."))}b.isMDXComponent=!0}}]);