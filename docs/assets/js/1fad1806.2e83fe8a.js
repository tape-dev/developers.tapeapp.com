"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[8625],{4232:(e,a,t)=>{t.r(a),t.d(a,{assets:()=>k,contentTitle:()=>c,default:()=>w,frontMatter:()=>d,metadata:()=>l,toc:()=>m});var n=t(7462),o=t(3366),s=(t(7294),t(3905)),p=t(4757),r=(t(9877),t(8215),t(7859)),i=["components"],d={id:"workspace",title:"Workspace",sidebar_label:"Workspace"},c=void 0,l={unversionedId:"api/resource/workspace",id:"api/resource/workspace",title:"Workspace",description:"Retrieve workspaces",source:"@site/docs/api/resource/workspace.md",sourceDirName:"api/resource",slug:"/api/resource/workspace",permalink:"/docs/api/resource/workspace",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/workspace.md",tags:[],version:"current",frontMatter:{id:"workspace",title:"Workspace",sidebar_label:"Workspace"},sidebar:"mainSidebar",previous:{title:"Number",permalink:"/docs/api/resource/field/number"},next:{title:"Organization",permalink:"/docs/api/resource/organization"}},k={},m=[{value:"Retrieve workspaces",id:"retrieve-workspaces",level:2},{value:"Create a workspace",id:"create-a-workspace",level:2},{value:"Update a workspace",id:"update-a-workspace",level:2},{value:"Delete a workspace",id:"delete-a-workspace",level:2},{value:"Notes",id:"notes",level:2}],u={toc:m};function w(e){var a=e.components,t=(0,o.Z)(e,i);return(0,s.kt)("wrapper",(0,n.Z)({},u,t,{components:a,mdxType:"MDXLayout"}),(0,s.kt)("h2",{id:"retrieve-workspaces"},"Retrieve workspaces"),(0,s.kt)(p.Z,{method:"GET",url:"https://api.tapeapp.com/v1/workspace/org",mdxType:"EndpointBadge"}),(0,s.kt)("p",null,"Retrieve all workspaces that you have access to (inside the active user organization with ID ",(0,s.kt)("inlineCode",{parentName:"p"},"1337"),"):"),(0,s.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl #BASE_URL/v1/workspace/org \\\n  -u #USER_API_KEY:"),(0,s.kt)(r.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'{\n  "total": 2,\n  "workspaces": [\n    {\n      "workspace_id": 1,\n      "name": "Task management",\n      "slug": "task-management",\n      "type": "closed",\n      "description": "Manage all tasks and projects inside this workspace.",\n      "org_id": 1337\n    },\n    {\n      "workspace_id": 2,\n      "name": "Contact directory",\n      "slug": "contact-directory",\n      "type": "default",\n      "description": "Keep track of our contacts here.",\n      "org_id": 1337\n    }\n  ]\n}'),(0,s.kt)("h2",{id:"create-a-workspace"},"Create a workspace"),(0,s.kt)(p.Z,{method:"POST",url:"https://api.tapeapp.com/v1/workspace",mdxType:"EndpointBadge"}),(0,s.kt)("p",null,"Create a new workspace:"),(0,s.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/workspace \\\n  -u #USER_API_KEY:\\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "name": "Task management",\n    "type": "closed",\n    "description": "Manage all tasks and projects inside this workspace."\n  }\' \n  '),(0,s.kt)("p",null,"The created workspace will be returned in the response:"),(0,s.kt)(r.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'\n  {\n    "workspace_id": 1,\n    "name": "Task management",\n    "slug": "task-management",\n    "type": "closed",\n    "description": "Manage all tasks and projects inside this workspace.",\n    "org_id": 1337\n  }\n'),(0,s.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"Workspace type")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"The ",(0,s.kt)("inlineCode",{parentName:"p"},"type")," property to create workspaces needs to be one of ",(0,s.kt)("inlineCode",{parentName:"p"},'"closed"'),", ",(0,s.kt)("inlineCode",{parentName:"p"},'"open"'),", ",(0,s.kt)("inlineCode",{parentName:"p"},'"default"')," and ",(0,s.kt)("inlineCode",{parentName:"p"},'"private"'),". This corresponds to the workspace types ",(0,s.kt)("a",{parentName:"p",href:"https://help.tapeapp.com/en/articles/8000930-intro-to-workspaces"},"documented in the help center"),"."))),(0,s.kt)("h2",{id:"update-a-workspace"},"Update a workspace"),(0,s.kt)(p.Z,{method:"PUT",url:"https://api.tapeapp.com/v1/workspace/{workspaceId}",mdxType:"EndpointBadge"}),(0,s.kt)("p",null,"Update an existing workspace via its ID:"),(0,s.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X PUT #BASE_URL/v1/workspace/1 \\\n  -u #USER_API_KEY:\\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "name": "Task management (NEW)",\n    "type": "closed",\n    "description": "Manage all tasks and projects inside this NEW workspace."\n  }\' \n  '),(0,s.kt)("p",null,"The updated workspace will be returned in the response:"),(0,s.kt)(r.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'\n  {\n    "workspace_id": 1,\n    "name": "Task management (NEW)",\n    "slug": "task-management-new",\n    "type": "closed",\n    "description": "Manage all tasks and projects inside this NEW workspace.",\n    "org_id": 1337\n  }\n'),(0,s.kt)("h2",{id:"delete-a-workspace"},"Delete a workspace"),(0,s.kt)(p.Z,{method:"DELETE",url:"https://api.tapeapp.com/v1/workspace/{workspaceId}",mdxType:"EndpointBadge"}),(0,s.kt)("p",null,"Delete a workspace via its ID:"),(0,s.kt)(r.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X DELETE #BASE_URL/v1/workspace/1 \\\n  -u #USER_API_KEY:\\\n  -H "Content-Type: application/json" \n  '),(0,s.kt)("p",null,"The deleted workspace will be returned in the response:"),(0,s.kt)(r.Z,{language:"json",title:"\u2b05\ufe0f \xa0\xa0   Response",mdxType:"ContextCodeBlock"},'\n  {\n    "workspace_id": 1,\n    "name": "Task management (NEW)",\n    "slug": "task-management-new",\n    "type": "closed",\n    "description": "Manage all tasks and projects inside this NEW workspace.",\n    "org_id": 1337\n  }\n'),(0,s.kt)("h2",{id:"notes"},"Notes"),(0,s.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"Note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"Currently it is not possible to change the type of a workspace via the API. Be sure to properly create workspaces with the desired type."))))}w.isMDXComponent=!0}}]);