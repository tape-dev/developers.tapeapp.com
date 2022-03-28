"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[247],{2457:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>d,default:()=>f,frontMatter:()=>o,metadata:()=>p,toc:()=>c});var i=a(7462),r=a(3366),l=(a(7294),a(3905)),n=["components"],o={id:"general",title:"Field Value",sidebar_label:"General"},d=void 0,p={unversionedId:"api/resource/field-value/general",id:"api/resource/field-value/general",title:"Field Value",description:"A record object consist of its static properties like id, title or created_on and its field values. For each field of the record's app, the record can have a field value.",source:"@site/docs/api/resource/field-value/general.md",sourceDirName:"api/resource/field-value",slug:"/api/resource/field-value/general",permalink:"/docs/api/resource/field-value/general",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api/resource/field-value/general.md",tags:[],version:"current",frontMatter:{id:"general",title:"Field Value",sidebar_label:"General"},sidebar:"mainSidebar",previous:{title:"Record",permalink:"/docs/api/resource/record"},next:{title:"Text",permalink:"/docs/api/resource/field-value/text"}},s={},c=[{value:"Field type",id:"field-type",level:2}],u={toc:c};function f(e){var t=e.components,a=(0,r.Z)(e,n);return(0,l.kt)("wrapper",(0,i.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"A record object consist of its static properties like ",(0,l.kt)("inlineCode",{parentName:"p"},"id"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"title")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"created_on"),' and its field values. For each field of the record\'s app, the record can have a field value.\nAn example "Contacts" app could have the fields "First name" (text), "Last Name" (text) and "Phone number" (phone). Adding a record to this app includes specifying its field values for each of the fields "First Name", "Last Name" and "Phone number".'),(0,l.kt)("p",null,"Each field value object can be uniquely identified via its ",(0,l.kt)("inlineCode",{parentName:"p"},"record_id")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"field_id"),". Field values can be returned as part of a record or as the result of a field value update endpoint."),(0,l.kt)("h2",{id:"field-type"},"Field type"),(0,l.kt)("p",null,"The API returns the ",(0,l.kt)("inlineCode",{parentName:"p"},"type")," property as well as the ",(0,l.kt)("inlineCode",{parentName:"p"},"field_type")," property for a field value. The ",(0,l.kt)("inlineCode",{parentName:"p"},"type")," property refers to the the kind of data return like ",(0,l.kt)("inlineCode",{parentName:"p"},"text"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"category")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"phone"),". The ",(0,l.kt)("inlineCode",{parentName:"p"},"field_type")," property specifies the type of the field like ",(0,l.kt)("inlineCode",{parentName:"p"},"single_text"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"multi_text"),", ",(0,l.kt)("inlineCode",{parentName:"p"},"single_category")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"MULTI_PHONE"),". The ",(0,l.kt)("inlineCode",{parentName:"p"},"field_type")," always specifies the information whether only one value is allowed or multiple values are allowed. Tape distinguishes between these field types down to the database level so that a field value for a field of type ",(0,l.kt)("inlineCode",{parentName:"p"},"single_category")," can never have multiple category options selected. Therefore, switching from e.g., ",(0,l.kt)("inlineCode",{parentName:"p"},"single_category"),"to ",(0,l.kt)("inlineCode",{parentName:"p"},"multi_category")," requires a field conversion where all field values are migrated."))}f.isMDXComponent=!0}}]);