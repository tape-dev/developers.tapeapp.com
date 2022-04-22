"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[4074],{9699:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>u,contentTitle:()=>h,default:()=>b,frontMatter:()=>c,metadata:()=>m,toc:()=>k});var n=o(7462),a=o(3366),i=(o(7294),o(3905)),l=o(7859),r=o(4757),p=o(9877),s=o(8215),d=["components"],c={id:"webhook",title:"Webhook",sidebar_label:"Webhook"},h=void 0,m={unversionedId:"api/resource/webhook",id:"api/resource/webhook",title:"Webhook",description:"A webhook enables Tape to push real-time notifications to your app. Tape uses HTTP or HTTPS to send these notifications to your app as a JSON payload. You can then use these notifications to execute actions in your backend systems.",source:"@site/docs/api/resource/webhook.md",sourceDirName:"api/resource",slug:"/api/resource/webhook",permalink:"/docs/api/resource/webhook",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/webhook.md",tags:[],version:"current",frontMatter:{id:"webhook",title:"Webhook",sidebar_label:"Webhook"},sidebar:"mainSidebar",previous:{title:"Link Preview",permalink:"/docs/api/resource/link-preview"},next:{title:"Introduction",permalink:"/docs/calculation/introduction"}},u={},k=[{value:"Create a webhook",id:"create-a-webhook",level:2},{value:"Request hook verification",id:"request-hook-verification",level:2},{value:"Validate hook verification",id:"validate-hook-verification",level:2},{value:"Delete a webhook",id:"delete-a-webhook",level:2},{value:"Webhook types",id:"webhook-types",level:2},{value:"Record created",id:"record-created",level:3},{value:"Record updated",id:"record-updated",level:3},{value:"Record deleted",id:"record-deleted",level:3},{value:"Record restored",id:"record-restored",level:3},{value:"Comment created",id:"comment-created",level:3},{value:"Comment deleted",id:"comment-deleted",level:3},{value:"Error handling",id:"error-handling",level:2},{value:"Rate Limits",id:"rate-limits",level:2}],g={toc:k};function b(e){var t=e.components,o=(0,a.Z)(e,d);return(0,i.kt)("wrapper",(0,n.Z)({},g,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"A webhook enables Tape to push real-time notifications to your app. Tape uses HTTP or HTTPS to send these notifications to your app as a JSON payload. You can then use these notifications to execute actions in your backend systems."),(0,i.kt)("h2",{id:"create-a-webhook"},"Create a webhook"),(0,i.kt)("p",null,"A webhook can be created via the API by providing a URL and the type of events you want to get notified for. See the list of available webhook types ",(0,i.kt)("a",{parentName:"p",href:"#webhook-types"},"below"),"."),(0,i.kt)(r.Z,{method:"POST",url:"https://api.tapeapp.com/v1/hook/app/{app_id}",mdxType:"EndpointBadge"}),(0,i.kt)(p.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,i.kt)(l.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/hook/app/1 \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "type": "record.create",\n    "url": "https://webhook.example.org/example-webhook-endpoint"\n  }\' \n')),(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "type": "record.create",\n  "url": "https://webhook.example.org/example-webhook-endpoint"\n}\n')))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "hook_id": 1,\n  "url": "https://webhook.example.org/example-webhook-endpoint",\n  "status": "inactive"\n}\n')),(0,i.kt)("h2",{id:"request-hook-verification"},"Request hook verification"),(0,i.kt)(r.Z,{method:"POST",url:"https://api.tapeapp.com/v1/hook/{hook_id}/verify/request",mdxType:"EndpointBadge"}),(0,i.kt)("p",null,"To avoid potential abuse of webhooks and increase security, every webhook URL must be verified first before Tape starts sending requests to that URL. You can request the verification code via the API. This will cause the webhook to send a request to the URL with the parameter ",(0,i.kt)("inlineCode",{parentName:"p"},"type")," set to ",(0,i.kt)("inlineCode",{parentName:"p"},"hook.verify")," and ",(0,i.kt)("inlineCode",{parentName:"p"},"code")," set to the verification code. The endpoint must then call the validate method with the code to complete the verification."),(0,i.kt)(l.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl -X POST #BASE_URL/v1/hook/1/verify/request \\\n  -u #USER_API_KEY:\n"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "hook_id": 1,\n  "url": "https://webhook.example.org/example-webhook-endpoint",\n  "status": "inactive"\n}\n')),(0,i.kt)("p",null,"The Tape server will send a POST request to the provided URL with the following body:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'{\n  "hook_id": 1,\n  "type": "hook.verify",\n  "code": "f43d05e6"\n}\n')),(0,i.kt)("h2",{id:"validate-hook-verification"},"Validate hook verification"),(0,i.kt)("p",null,"Validates the hook using the code received from the verify call. On successful validation the hook will become active."),(0,i.kt)(r.Z,{method:"POST",url:"https://api.tapeapp.com/v1/hook/{hook_id}/verify/validate",mdxType:"EndpointBadge"}),(0,i.kt)(p.Z,{defaultValue:"curl",mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"curl",label:"cURL",mdxType:"TabItem"},(0,i.kt)(l.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},'curl -X POST #BASE_URL/v1/hook/1/verify/validate \\\n  -u #USER_API_KEY: \\\n  -H "Content-Type: application/json" \\\n  --data \'{\n    "code": "f43d05e6"\n  }\' \n')),(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:'title="\u27a1\ufe0f \xa0\xa0   Request">',title:'"\u27a1\ufe0f',"\xa0\xa0":!0,"":!0,'Request">':!0},'{\n  "code": "f43d05e6"\n}\n')))),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "hook_id": 1,\n  "url": "https://webhook.example.org/example-webhook-endpoint",\n  "status": "active"\n}\n')),(0,i.kt)("h2",{id:"delete-a-webhook"},"Delete a webhook"),(0,i.kt)(r.Z,{method:"DELETE",url:"https://api.tapeapp.com/v1/hook/{hook_id}",mdxType:"EndpointBadge"}),(0,i.kt)("p",null,"A webhook can be deleted via the API by providing the ID of the webhook."),(0,i.kt)(l.Z,{language:"shell",title:"\u27a1\ufe0f \xa0\xa0   Request",mdxType:"ContextCodeBlock"},"curl -X DELETE #BASE_URL/v1/hook/1 \\\n  -u #USER_API_KEY:\n"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Response'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,"Response'":!0},'{\n  "hook_id": 1\n}\n')),(0,i.kt)("h2",{id:"webhook-types"},"Webhook types"),(0,i.kt)("p",null,"Webhooks have to specify a ",(0,i.kt)("inlineCode",{parentName:"p"},"type"),", which indicates which events should be sent to this webhook. The types of webhooks currently available are the following:"),(0,i.kt)("h3",{id:"record-created"},"Record created"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"record.create")," webhook type allows you to get notified whenever a record was created in the app the webhook is registered for. Here is an example incoming POST request payload:"),(0,i.kt)(p.Z,{mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.create"\n}\n'))),(0,i.kt)(s.Z,{value:"http",label:"HTTP",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-http",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'POST https://webhook.example.org/example-webhook-endpoint\n\nAccept          application/json, text/plain, */*\nContent-type    application/json;charset=utf-8\nUser-agent      Tape Webhook\nContent-length  51\nHost            localhost:3009\nConnection      close\n\n{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.create"\n}\n')))),(0,i.kt)("h3",{id:"record-updated"},"Record updated"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"record.update")," webhook type allows you to get notified whenever a record was updated in the app the webhook is registered for. Here is an example incoming POST request payload:"),(0,i.kt)(p.Z,{mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.update"\n}\n'))),(0,i.kt)(s.Z,{value:"http",label:"HTTP",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-http",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'POST https://webhook.example.org/example-webhook-endpoint\n\nAccept          application/json, text/plain, */*\nContent-type    application/json;charset=utf-8\nUser-agent      Tape Webhook\nContent-length  51\nHost            localhost:3009\nConnection      close\n\n{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.update"\n}\n')))),(0,i.kt)("h3",{id:"record-deleted"},"Record deleted"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"record.delete")," webhook type allows you to get notified whenever a record was deleted in the app the webhook is registered for. Here is an example incoming POST request payload:"),(0,i.kt)(p.Z,{mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.delete"\n}\n'))),(0,i.kt)(s.Z,{value:"http",label:"HTTP",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-http",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'POST https://webhook.example.org/example-webhook-endpoint\n\nAccept          application/json, text/plain, */*\nContent-type    application/json;charset=utf-8\nUser-agent      Tape Webhook\nContent-length  51\nHost            localhost:3009\nConnection      close\n\n{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.delete"\n}\n')))),(0,i.kt)("h3",{id:"record-restored"},"Record restored"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"record.restore")," webhook type allows you to get notified whenever a record was restored in the app the webhook is registered for. Here is an example incoming POST request payload:"),(0,i.kt)(p.Z,{mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.restore"\n}\n'))),(0,i.kt)(s.Z,{value:"http",label:"HTTP",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-http",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'POST https://webhook.example.org/example-webhook-endpoint\n\nAccept          application/json, text/plain, */*\nContent-type    application/json;charset=utf-8\nUser-agent      Tape Webhook\nContent-length  51\nHost            localhost:3009\nConnection      close\n\n{\n  "hook_id": 1,\n  "record_id": 100,\n  "type": "record.restore"\n}\n')))),(0,i.kt)("h3",{id:"comment-created"},"Comment created"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"comment.create")," webhook type allows you to get notified whenever a comment was created for a record in the app the webhook is registered for. Here is an example incoming POST request payload:"),(0,i.kt)(p.Z,{mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'{\n  "hook_id": 1,\n  "record_id": 100,\n  "comment_id": 500,\n  "type": "comment.create"\n}\n'))),(0,i.kt)(s.Z,{value:"http",label:"HTTP",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-http",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'POST https://webhook.example.org/example-webhook-endpoint\n\nAccept          application/json, text/plain, */*\nContent-type    application/json;charset=utf-8\nUser-agent      Tape Webhook\nContent-length  51\nHost            localhost:3009\nConnection      close\n\n{\n  "hook_id": 1,\n  "record_id": 100,\n  "comment_id": 500,\n  "type": "comment.create"\n}\n')))),(0,i.kt)("h3",{id:"comment-deleted"},"Comment deleted"),(0,i.kt)("p",null,"The ",(0,i.kt)("inlineCode",{parentName:"p"},"comment.delete")," webhook type allows you to get notified whenever a comment was deleted for a record in the app the webhook is registered for. Here is an example incoming POST request payload:"),(0,i.kt)(p.Z,{mdxType:"Tabs"},(0,i.kt)(s.Z,{value:"json",label:"JSON",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'{\n  "hook_id": 1,\n  "record_id": 100,\n  "comment_id": 500,\n  "type": "comment.delete"\n}\n'))),(0,i.kt)(s.Z,{value:"http",label:"HTTP",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-http",metastring:"title='\u2b05\ufe0f \xa0\xa0   Incoming request'",title:"'\u2b05\ufe0f","\xa0\xa0":!0,"":!0,Incoming:!0,"request'":!0},'POST https://webhook.example.org/example-webhook-endpoint\n\nAccept          application/json, text/plain, */*\nContent-type    application/json;charset=utf-8\nUser-agent      Tape Webhook\nContent-length  51\nHost            localhost:3009\nConnection      close\n\n{\n  "hook_id": 1,\n  "record_id": 100,\n  "comment_id": 500,\n  "type": "comment.delete"\n}\n')))),(0,i.kt)("h2",{id:"error-handling"},"Error handling"),(0,i.kt)("p",null,"The webhook must respond with a 2xx status code. If the status code is different from 2xx more than 50 consecutive times the webhook will return to being unverified and will have to be verified again to be active. Additionally, your webhook may return to unverified if you do not send responses in a timely manner (5 seconds). You should handle any heavy processing asynchronously."),(0,i.kt)("p",null,"Only hooks on port 80 and 443 are supported, i.e. you cannot use ",(0,i.kt)("inlineCode",{parentName:"p"},"http://www.example.org/webhook:8080"),", only ",(0,i.kt)("inlineCode",{parentName:"p"},"http://www.example.org/webhook")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"https://www.example.org/webhook"),"."),(0,i.kt)("h2",{id:"rate-limits"},"Rate Limits"),(0,i.kt)("p",null,"Webhook executions are rate limited. The current rate limit is 100 webhook executions per minute per app."),(0,i.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"Rate limits may change")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"In the future, Tape plans to adjust rate limits to balance for demand and reliability. Tape may also introduce distinct rate limits for organizations in different pricing plans."))))}b.isMDXComponent=!0}}]);