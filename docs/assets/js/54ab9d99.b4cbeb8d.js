"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[9937],{5338:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>u,contentTitle:()=>m,default:()=>f,frontMatter:()=>s,metadata:()=>p,toc:()=>k});var i=a(7462),n=a(3366),l=(a(7294),a(3905));const r=a.p+"assets/images/automations-date-timezone-flow-03751f587613983a4aa1b09aee697849.png";var o,d=["components"],s={id:"date-timezone",title:"Date, Time & Timezone",sidebar_label:"Date, Time & Timezones"},m="Date, Time & Timezones",p={unversionedId:"automations/date-timezone",id:"automations/date-timezone",title:"Date, Time & Timezone",description:"Datetime format",source:"@site/docs/automations/date-timezone.md",sourceDirName:"automations",slug:"/automations/date-timezone",permalink:"/docs/automations/date-timezone",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/automations/date-timezone.md",tags:[],version:"current",frontMatter:{id:"date-timezone",title:"Date, Time & Timezone",sidebar_label:"Date, Time & Timezones"},sidebar:"mainSidebar",previous:{title:"Libraries",permalink:"/docs/automations/libraries"},next:{title:"IP Addresses",permalink:"/docs/automations/troubleshooting/ip-addresses"}},u={},k=[{value:"Datetime format",id:"datetime-format",level:2},{value:"Variables",id:"variables",level:2},{value:"Formatting dates",id:"formatting-dates",level:2},{value:"Interactive playground",id:"interactive-playground",level:3},{value:"Timezones",id:"timezones",level:2}],h=(o="MediaFrame",function(e){return console.warn("Component "+o+" was not imported, exported, or provided by MDXProvider as global scope"),(0,l.kt)("div",e)}),c={toc:k};function f(e){var t=e.components,a=(0,n.Z)(e,d);return(0,l.kt)("wrapper",(0,i.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h1",{id:"date-time--timezones"},"Date, Time & Timezones"),(0,l.kt)("h2",{id:"datetime-format"},"Datetime format"),(0,l.kt)("p",null,"Tape automations use the same date and time format used when working with ",(0,l.kt)("a",{parentName:"p",href:"/docs/api/date-timezone"},"date & time using the Tape API"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"2022-02-01 15:00\n")),(0,l.kt)("p",null,"which would be equal to the following in standardized ISO 8601:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"2022-02-01T15:00Z\n")),(0,l.kt)("h2",{id:"variables"},"Variables"),(0,l.kt)("p",null,"When working with Tape date fields inside automations, multiple variables will be available to work with."),(0,l.kt)("p",null,"A date field named ",(0,l.kt)("inlineCode",{parentName:"p"},"Date")," in Tape, with time and without an end date, produces these available record field value variables (where the app is called ",(0,l.kt)("inlineCode",{parentName:"p"},"Tasks"),"):"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"current_task_date_start_time"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Contains the date field value's time in the user's timezone"),(0,l.kt)("li",{parentName:"ul"},"Example value: ",(0,l.kt)("inlineCode",{parentName:"li"},"15:00")))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"current_task_date_start_time_utc")," - ",(0,l.kt)("inlineCode",{parentName:"li"},"14:00"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Contains the date field value's time in UTC"),(0,l.kt)("li",{parentName:"ul"},"Example value: ",(0,l.kt)("inlineCode",{parentName:"li"},"14:00")))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"current_task_date_start_date"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Contains the date field value's date in the user's timezone"),(0,l.kt)("li",{parentName:"ul"},"Example value: ",(0,l.kt)("inlineCode",{parentName:"li"},"2023-02-01")))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"current_task_date_start_date_utc"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Contains the date field value's date in UTC"),(0,l.kt)("li",{parentName:"ul"},"Example value: ",(0,l.kt)("inlineCode",{parentName:"li"},"2023-02-01")))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"current_task_date_start_date_formatted"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"Contains the date field value's date and time as formatted string in the user's timezone"),(0,l.kt)("li",{parentName:"ul"},"Example value: ",(0,l.kt)("inlineCode",{parentName:"li"},"2023-02-01 15:00"))))),(0,l.kt)("p",null,"Users are free to compose those above variable to yield different results, based on requirements. Be sure to use the UTC values when setting / updating field values, and also check below information on timezone handling"),(0,l.kt)("h2",{id:"formatting-dates"},"Formatting dates"),(0,l.kt)("p",null,"Tape exposed several ways of formatting dates, the preferred option is using the integrated ",(0,l.kt)("inlineCode",{parentName:"p"},"date_fns")," library."),(0,l.kt)("p",null,"Use the ",(0,l.kt)("inlineCode",{parentName:"p"},"format")," for your custom date variables:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"date_fns.format(your_app_field_value, 'y') // yields the year\n")),(0,l.kt)("h3",{id:"interactive-playground"},"Interactive playground"),(0,l.kt)("p",null,"The most convenient way to test your date formatting is ",(0,l.kt)("a",{parentName:"p",href:"https://date-fns-interactive.netlify.app/"},"the interactive date_fns playground"),"."),(0,l.kt)("h2",{id:"timezones"},"Timezones"),(0,l.kt)("p",null,"Tape workflows run in UTC to be universally applicable and non-opinionated. When using the built in Tape actions, all date and time data will thereby yield the expected results, e.g. when a record is updated and set to another record's date field value, that value will match the date and time the user sees when opening the record in Tape."),(0,l.kt)("p",null,'Be careful when setting dates using code, e.g. via the "Perform Calculation" or "Execute script" workflow actions. Without futher steps, unexpected results may be encountered.'),(0,l.kt)("p",null,"See this example below, where a user in Central European Time (UTC+1) utilized Tape workflows to set a record date field's date and time:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"var_target_datetime = new Date('2023-02-01 15:00');\n")),(0,l.kt)("p",null,"When updating the record and setting the date / time to the variable's value, the record's field value will actually be updated to this value:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"2023-02-01 14:00\n")),(0,l.kt)("p",null,"This happens due to the fact that the execution environment of the worklow runs in UTC, and will interpret inputs in UTC respectively. While there are many solutions to this, the simplest is for you to transform the data first using the date-fns-timezone library's ",(0,l.kt)("inlineCode",{parentName:"p"},"zonedTimeToUtc")," function and the respective timezone identifier:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre"},"var_target_datetime = date_fns_tz.zonedTimeToUtc(new Date('2023-02-01 15:00'), 'Europe/Amsterdam');\n")),(0,l.kt)("p",null,"Now, the record will be updated to Feb 1st, 2023 15:00 in the user's timezone as expected and this change will be reflected properly when opening the record in Tape."),(0,l.kt)("p",null,"A resulting example flow may look like to this one:"),(0,l.kt)(h,{mdxType:"MediaFrame"},(0,l.kt)("img",{src:r})))}f.isMDXComponent=!0}}]);