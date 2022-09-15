"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[8580],{1803:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>u,toc:()=>d});var n=o(7462),i=o(3366),a=(o(7294),o(3905)),r=["components"],l={id:"introduction",title:"Workflow Automations",sidebar_label:"Introduction"},s=void 0,u={unversionedId:"automations/introduction",id:"automations/introduction",title:"Workflow Automations",description:"Execution environment",source:"@site/docs/automations/introduction.md",sourceDirName:"automations",slug:"/automations/introduction",permalink:"/docs/automations/introduction",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/automations/introduction.md",tags:[],version:"current",frontMatter:{id:"introduction",title:"Workflow Automations",sidebar_label:"Introduction"},sidebar:"mainSidebar",previous:{title:"Email",permalink:"/docs/api/resource/email"},next:{title:"Code Editor",permalink:"/docs/automations/code-editor"}},c={},d=[{value:"Execution environment",id:"execution-environment",level:3},{value:"Synchronous execution environment",id:"synchronous-execution-environment",level:2},{value:"Asynchronous execution environment",id:"asynchronous-execution-environment",level:2},{value:"Tape API client",id:"tape-api-client",level:3},{value:"HTTP client",id:"http-client",level:3},{value:"Custom Variables",id:"custom-variables",level:2},{value:"Silent actions",id:"silent-actions",level:2},{value:"Triggering other flows &amp; webhooks",id:"triggering-other-flows--webhooks",level:2},{value:"Useful execution variables",id:"useful-execution-variables",level:2},{value:"Logging &amp; Debugging",id:"logging--debugging",level:2},{value:"Limitations",id:"limitations",level:2}],p={toc:d};function m(e){var t=e.components,o=(0,i.Z)(e,r);return(0,a.kt)("wrapper",(0,n.Z)({},p,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h3",{id:"execution-environment"},"Execution environment"),(0,a.kt)("p",null,"All custom scripts inside Tape's workflow automations are written in JavaScript, consistent with the ",(0,a.kt)("a",{parentName:"p",href:"/docs/calculation/introduction"},"calculation field"),'. Within code filters and the "perform calculation" action, only syncronous JavaScript is valid, while the "execute script" action also allows asynchronous code.'),(0,a.kt)("h2",{id:"synchronous-execution-environment"},"Synchronous execution environment"),(0,a.kt)("p",null,'Insite filters and the "perform calculation" action, use synchronous code to perform your filter assertions or assign your variable.'),(0,a.kt)("p",null,"Valid custom filter scripts could be (where the returning expression is being used to evaluate to true or false):"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"some_number_field_value >= 1000\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"(some_number_field_value % 2 === 0) && (some_number_field_value < 50)\n")),(0,a.kt)("p",null,'Valid "perform calculation" action block scripts could look similar (where the returned expression is being stored in a custom variable for later use)'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"some_number_field_value * 1000\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"some_number_field_value < 100 ? some_number_field_value : 100;\n")),(0,a.kt)("p",null,'It is not allowed to use Promises or async/await syntax in this context. When needed, perform your work inside an "execute script" action that uses the asynchronous execution environment.'),(0,a.kt)("p",null,"Hint: If you need a more complex syntax or would like to declare functions that you invoke later, use an immediately invoked function expression (IIFE), as shown below (",(0,a.kt)("inlineCode",{parentName:"p"},"yourFunctionName")," could be any arbritrary function name of your choice):"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"(yourFunctionName(){\n    let variable1 = 1337;\n\n    function yourSubFunctionName1() {\n        return false;\n    }\n\n    function yourSubFunctionName2() {\n        return true;\n    }\n\n    // ... more code\n\n    return yourSubFunctionName1() || yourSubFunctionName2();\n})();\n")),(0,a.kt)("h2",{id:"asynchronous-execution-environment"},"Asynchronous execution environment"),(0,a.kt)("p",null,'When using the "execute script" action block, developers are free to run their own asynchronous JavaScript code. While it is possible to use the classic Promise syntax, we recommend using ',(0,a.kt)("a",{parentName:"p",href:"https://nodejs.dev/learn/modern-asynchronous-javascript-with-async-and-await"},"Async/Await"),"."),(0,a.kt)("p",null,"Inside this context, more APIs, modules and functions are exposed. The ",(0,a.kt)("a",{parentName:"p",href:"/docs/automations/code-editor"},"code editor")," provides auto-completion and typing info to assist developers, some more details are described in the next sections."),(0,a.kt)("h3",{id:"tape-api-client"},"Tape API client"),(0,a.kt)("p",null,"The editor exposes the client side Tape SDK that allows to consume the ",(0,a.kt)("a",{parentName:"p",href:"/docs/api/introduction"},"developer API"),". Use it to perform operations that are not available (yet) as dedicated graphical action blocks, or if you need more control over the behavior."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"const { data, headers } = await tape.Record.get(1234);\n\nconsole.log({ record: data.record });\n")),(0,a.kt)("h3",{id:"http-client"},"HTTP client"),(0,a.kt)("p",null,'Similar to the "HTTP call" action block, it is also possible to perform HTTP requests using the provided HTTP client inside the "execute script" action.\nThe following code sample could be used to extract the response body and header for a request to an external API, logging them to the console afterwards:'),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"const { data, headers } = await http.get('https://jsonplaceholder.typicode.com/posts');\n\nconsole.log({ data });\nconsole.log({ headers });\n")),(0,a.kt)("h2",{id:"custom-variables"},"Custom Variables"),(0,a.kt)("p",null,"You may introduce custom variables that can be used globally by using one of the following action blocks:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"perform calculation"),(0,a.kt)("li",{parentName:"ul"},"execute script"),(0,a.kt)("li",{parentName:"ul"},"HTTP request")),(0,a.kt)("p",null,"Variables will become available inside the flow, but only after that action inside the execution order. No block scope applies, and variables will be reassigned and overwritten if you give them an equal name."),(0,a.kt)("h2",{id:"silent-actions"},"Silent actions"),(0,a.kt)("p",null,'Use the "silent" settings option for mutating action blocks to skip notifications for this change. This can be useful when migrating large data sets, where notifications would bloat the inbox of the involved users.'),(0,a.kt)("h2",{id:"triggering-other-flows--webhooks"},"Triggering other flows & webhooks"),(0,a.kt)("p",null,"Every mutating action block provides options to specify whether this action will trigger other flows, and/or trigger webhooks in Tape. Both options can be checked individually and need to be set for each action explicitly."),(0,a.kt)("p",null,'If the option "Trigger other automations" is not set, a potential mutation performed inside this action will not yield another workflow run. Let\'s say the flow updates a record and the option is set to false, other flows with the "Record updated" trigger will not be run.'),(0,a.kt)("p",null,'The Tape SDK also provides respective options when used directly inside an "execute script" action block, check the typing info inside the editor to configure your requests properly.'),(0,a.kt)("h2",{id:"useful-execution-variables"},"Useful execution variables"),(0,a.kt)("p",null,"Some variables are provided by the system when a worklow is executed. A list of some of them (but not limited to):"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current_workflow_is_simulation"),": useful to execute or skip certain logic when the current execution is a simulation (that should ideally not affect data inside Tape or external systems)"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current_workflow_id"),": the ID of the current workflow, may be included when hitting external systems for debugging purposes"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current_workflow_name"),": the name of the current workflow, may be included when hitting external systems for debugging purposes"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current_workflow_timezone"),": the timezone the current workflow is executed in. Can be configured in the workflow editor."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current_date")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current_datetime")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"current_time"))),(0,a.kt)("p",null,"Note that some variables depend on the ",(0,a.kt)("a",{parentName:"p",href:"/docs/automations/execution-types"},"execution type")," of the current workflow."),(0,a.kt)("h2",{id:"logging--debugging"},"Logging & Debugging"),(0,a.kt)("p",null,"Use regular console log statements to log any variable during worklow execution. Your logs will show up inside the workflow run logs, enabling quick debugging and live feedback."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"console.log('initial field value was: ' + task_field_estimation_days_value)\nconsole.log('result of calculation was:' + var_calculation_result)\n")),(0,a.kt)("h2",{id:"limitations"},"Limitations"),(0,a.kt)("p",null,"Tape applies limits to all executed workflows regarding utilized computation power and time."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"The maximum time a flow can run is currently 3 minutes"),(0,a.kt)("li",{parentName:"ul"},"Maximum number of actions consumed for a single run: 1000 (One thousand)"),(0,a.kt)("li",{parentName:"ul"},"Memory & CPU limitations apply"),(0,a.kt)("li",{parentName:"ul"},"There is a limit for parallel async operations")),(0,a.kt)("p",null,"Flows that exceed any of the above limits fail with a proper error message. Split your work into multiple flows or avoid heavy computations, e.g. for large amounts of records."))}m.isMDXComponent=!0}}]);