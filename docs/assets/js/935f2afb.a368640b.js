"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[53],{5601:e=>{e.exports=JSON.parse('{"pluginId":"default","version":"current","label":"Next","banner":null,"badge":false,"className":"docs-version-current","isLast":true,"docsSidebars":{"mainSidebar":[{"type":"category","label":"Developer API","collapsed":true,"items":[{"type":"link","label":"Introduction","href":"/docs/api/introduction","docId":"api/introduction"},{"type":"link","label":"Authentication","href":"/docs/api/authentication","docId":"api/authentication"},{"type":"link","label":"Pagination","href":"/docs/api/pagination","docId":"api/pagination"},{"type":"link","label":"Versioning","href":"/docs/api/versioning","docId":"api/versioning"},{"type":"link","label":"Errors","href":"/docs/api/errors","docId":"api/errors"},{"type":"link","label":"Request Limits","href":"/docs/api/request-limits","docId":"api/request-limits"},{"type":"link","label":"Date & Timezone","href":"/docs/api/date-timezone","docId":"api/date-timezone"},{"type":"category","label":"Resources","collapsed":false,"items":[{"type":"link","label":"Record","href":"/docs/api/resource/record","docId":"api/resource/record"},{"type":"category","label":"Field Value","collapsed":true,"items":[{"type":"link","label":"General","href":"/docs/api/resource/field-value/general","docId":"api/resource/field-value/general"},{"type":"link","label":"Text","href":"/docs/api/resource/field-value/text","docId":"api/resource/field-value/text"},{"type":"link","label":"Status","href":"/docs/api/resource/field-value/status","docId":"api/resource/field-value/status"},{"type":"link","label":"User","href":"/docs/api/resource/field-value/user","docId":"api/resource/field-value/user"},{"type":"link","label":"Category","href":"/docs/api/resource/field-value/category","docId":"api/resource/field-value/category"},{"type":"link","label":"Date","href":"/docs/api/resource/field-value/date","docId":"api/resource/field-value/date"},{"type":"link","label":"Relation","href":"/docs/api/resource/field-value/relation","docId":"api/resource/field-value/relation"},{"type":"link","label":"Attachment","href":"/docs/api/resource/field-value/attachment","docId":"api/resource/field-value/attachment"},{"type":"link","label":"Checklist","href":"/docs/api/resource/field-value/checklist","docId":"api/resource/field-value/checklist"},{"type":"link","label":"Number","href":"/docs/api/resource/field-value/number","docId":"api/resource/field-value/number"},{"type":"link","label":"Link","href":"/docs/api/resource/field-value/link","docId":"api/resource/field-value/link"},{"type":"link","label":"Calculation","href":"/docs/api/resource/field-value/calculation","docId":"api/resource/field-value/calculation"},{"type":"link","label":"Email","href":"/docs/api/resource/field-value/email","docId":"api/resource/field-value/email"},{"type":"link","label":"Phone","href":"/docs/api/resource/field-value/phone","docId":"api/resource/field-value/phone"}],"collapsible":true},{"type":"link","label":"App","href":"/docs/api/resource/app","docId":"api/resource/app"},{"type":"link","label":"Workspace","href":"/docs/api/resource/workspace","docId":"api/resource/workspace"},{"type":"link","label":"File","href":"/docs/api/resource/file","docId":"api/resource/file"},{"type":"link","label":"Link Preview","href":"/docs/api/resource/link-preview","docId":"api/resource/link-preview"}],"collapsible":true}],"collapsible":true},{"type":"category","label":"Calculation Field","collapsed":true,"items":[{"type":"link","label":"Introduction","href":"/docs/calculation/introduction","docId":"calculation/introduction"},{"type":"link","label":"Libraries","href":"/docs/calculation/libraries","docId":"calculation/libraries"},{"type":"link","label":"Markdown","href":"/docs/calculation/markdown","docId":"calculation/markdown"},{"type":"link","label":"HTML & CSS","href":"/docs/calculation/html","docId":"calculation/html"},{"type":"category","label":"Components","collapsed":false,"items":[{"type":"link","label":"Links","href":"/docs/calculation/component/link","docId":"calculation/component/link"},{"type":"link","label":"Buttons","href":"/docs/calculation/component/button","docId":"calculation/component/button"}],"collapsible":true}],"collapsible":true},{"type":"link","label":"Contribute","href":"/docs/contribute","docId":"contribute"},{"type":"link","label":"Roadmap","href":"https://get.tapeapp.com/roadmap/"}],"guidesSidebar":[{"type":"link","label":"Getting Started","href":"/docs/guide/getting-started","docId":"guide/getting-started"},{"type":"link","label":"Contribute","href":"/docs/contribute","docId":"contribute"},{"type":"link","label":"Roadmap","href":"https://get.tapeapp.com/roadmap/"}]},"docs":{"api/authentication":{"id":"api/authentication","title":"Authentication","description":"Requests use the HTTP Authorization header to both authenticate and authorize operations. The Tape API accepts bearer tokens in this header. Each Tape user has an user API key associated with it that acts as a bearer token to authentciate with the API.","sidebar":"mainSidebar"},"api/date-timezone":{"id":"api/date-timezone","title":"Date & Timezone","description":"Datetime format","sidebar":"mainSidebar"},"api/errors":{"id":"api/errors","title":"Errors","description":"Responses from the API use HTTP response codes to indicate general classes of success and error. Error responses contain more detail about the error in the response body, in the errorcode and errormessage properties.","sidebar":"mainSidebar"},"api/introduction":{"id":"api/introduction","title":"Tape Developer API","description":"Developers use the API to access Tape\'s core resources like records, apps and workspaces. Developers can connect services to Tape and build interactive experiences for users within Tape. Using the navigation on the left, you\'ll find details for each endpoint and type of resource used in the API.","sidebar":"mainSidebar"},"api/pagination":{"id":"api/pagination","title":"Pagination","description":"Endpoints which return a list of objects use pagination. Pagination allows an integration to request a part of the list, receiving an array of results and a cursor in the response. The integration can use the cursor in another request to receive the next part of the list. Using this technique, the integration can continue to make requests to receive the whole list (or just the parts the integration needs).","sidebar":"mainSidebar"},"api/request-limits":{"id":"api/request-limits","title":"Request Limits","description":"To ensure a consistent developer experience for all API users, the Tape API is rate limited and basic size limits apply to request parameters.","sidebar":"mainSidebar"},"api/resource/app":{"id":"api/resource/app","title":"App","description":"App endpoints are not available. Contact us if those are important for your integrations.","sidebar":"mainSidebar"},"api/resource/field-value/attachment":{"id":"api/resource/field-value/attachment","title":"Attachment Field Value","description":"A attachment field value consists of its value property which holds a reference to an attachment. An attachment has the properties id (unique ID), filename (the filename), size (filesize in bytes), download_url (URL to download the file) and others.","sidebar":"mainSidebar"},"api/resource/field-value/calculation":{"id":"api/resource/field-value/calculation","title":"Calculation Field Value","description":"A calculation field value consists of its value property of type string or number. The value can be a plaintext string (\'Example text\'), a rich-text string containing Markdown/ HTML (\'# Red Headline\') or a number (123.456)","sidebar":"mainSidebar"},"api/resource/field-value/category":{"id":"api/resource/field-value/category","title":"Category Field Value","description":"A category field value consists of its value property which holds a reference to a category option. A category option has the properties id (unique ID), text (the label) and color (hexcolor value). A SINGLECATEGORY field value holds at most one category option while a MULTICATEGORY field value can hold multiple category options.","sidebar":"mainSidebar"},"api/resource/field-value/checklist":{"id":"api/resource/field-value/checklist","title":"Checklist Field Value","description":"This field value type is still in development. Please check back later!","sidebar":"mainSidebar"},"api/resource/field-value/date":{"id":"api/resource/field-value/date","title":"Date Field Value","description":"A date field value consists of its value property which holds a start date and optionally an end date. A start date has the properties start (datetime string), startdate (date string), starttime (HHss formatted string), an end date is structured in the same way. A SINGLEDATE field value can only hold a start date while a RANGEDATE field value can hold an additional end date.","sidebar":"mainSidebar"},"api/resource/field-value/email":{"id":"api/resource/field-value/email","title":"Email Field Value","description":"This field value type is still in development. Please check back later!","sidebar":"mainSidebar"},"api/resource/field-value/general":{"id":"api/resource/field-value/general","title":"Field Value","description":"A record object consist of its static properties like id, title or created_on and its field values. For each field of the record\'s app, the record can have a field value.","sidebar":"mainSidebar"},"api/resource/field-value/link":{"id":"api/resource/field-value/link","title":"Link Field Value","description":"This field value type is still in development. Please check back later!","sidebar":"mainSidebar"},"api/resource/field-value/number":{"id":"api/resource/field-value/number","title":"Number Field Value","description":"A number field value consists of its value property of type number. The value is a decimal like 1, 1.0 or 1.5. A NUMBER field value holds at most one value.","sidebar":"mainSidebar"},"api/resource/field-value/phone":{"id":"api/resource/field-value/phone","title":"Phone Field Value","description":"This field value type is still in development. Please check back later!","sidebar":"mainSidebar"},"api/resource/field-value/relation":{"id":"api/resource/field-value/relation","title":"Relation Field Value","description":"A relation field value consists of its value property which holds a reference to another record. A relation to another record has the properties recordid (unique record ID), appid (unique ID of the record\'s app), title (title of the record) and others.","sidebar":"mainSidebar"},"api/resource/field-value/status":{"id":"api/resource/field-value/status","title":"Status Field Value","description":"A status field value consists of its value property which holds a reference to a status option. A status option has the properties id (unique ID), text (the label), color (hexcolor value) and means_completed (whether the status indicates completion). A STATUS field value holds at most one status option.","sidebar":"mainSidebar"},"api/resource/field-value/text":{"id":"api/resource/field-value/text","title":"Text Field Value","description":"A text field value consists of its value property of type string. The value is plaintext if the type of its corresponding field is SINGLETEXT and rich-text (HTML) if the field\'s type is MULTITEXT.","sidebar":"mainSidebar"},"api/resource/field-value/user":{"id":"api/resource/field-value/user","title":"User Field Value","description":"A user field value consists of its value property which holds a reference to a user. A user has the properties userid (unique ID), name (the username), orgId (ID of the user\'s organization) and others.","sidebar":"mainSidebar"},"api/resource/file":{"id":"api/resource/file","title":"File","description":"A file is a container for data and primarily identified by its file name. A file could be a spreadsheet, an image, PDF, video, or just binary data. Tape supports various file formats to be attached to resources like records, comments and chat messages.","sidebar":"mainSidebar"},"api/resource/link-preview":{"id":"api/resource/link-preview","title":"Link Preview","description":"Tape generates link previews for URLs inside link fields or that are shared via comments, replies and chat messages. A link preview always has the id and url properties, all other properties (title, description, previewImage) are optional, depending on whether Tape was able to access the provided URL.","sidebar":"mainSidebar"},"api/resource/record":{"id":"api/resource/record","title":"Record","description":"Records are the place where work gets done inside a Tape organization. Records can be created, retrieved, updated and deleted via the API.","sidebar":"mainSidebar"},"api/resource/workspace":{"id":"api/resource/workspace","title":"Workspace","description":"Workspace endpoints are not available. Contact us if those are important for your integrations.","sidebar":"mainSidebar"},"api/versioning":{"id":"api/versioning","title":"Versioning","description":"The Tape API is versioned. A new API version is released when we introduce a backwards-incompatible change to the API. For example, changing a property\'s name. The current version is v1.","sidebar":"mainSidebar"},"calculation/component/button":{"id":"calculation/component/button","title":"Buttons","description":"The calculation field has support for HTML buttons. The \\"type\\" attribute can be used to pick one of the available colors & styles:","sidebar":"mainSidebar"},"calculation/component/iframe":{"id":"calculation/component/iframe","title":"iframe","description":""},"calculation/component/link":{"id":"calculation/component/link","title":"Links","description":"It is quite easy to generate a clickable link inside the calculation field:","sidebar":"mainSidebar"},"calculation/component/timespan":{"id":"calculation/component/timespan","title":"Timespan","description":"A common use-case is to calculate how many days something took."},"calculation/html":{"id":"calculation/html","title":"HTML & CSS Support","description":"HTML (HyperText Markup Language) is the most basic building block of the Web. It defines the meaning and structure of web content. Cascading Style Sheets (CSS) describes how elements should be rendered on screen or on other media.","sidebar":"mainSidebar"},"calculation/introduction":{"id":"calculation/introduction","title":"Calculation Field","description":"Calculated fields can be used to easily manipulate data added to an app. With this very powerful tool, you can not only do math on numbers in your app, but also concatenate values \u200b\u200bin specific fields. Use variables to add values \u200b\u200bto calculated fields. Use the \\"@\\" symbol to search for variables in your app. You can reference any field in your app, and any field in the referenced app.","sidebar":"mainSidebar"},"calculation/libraries":{"id":"calculation/libraries","title":"Available Libraries","description":"Tape makes several Node.js libraries available for you to reference inside your calculation field script:","sidebar":"mainSidebar"},"calculation/markdown":{"id":"calculation/markdown","title":"Markdown Support","description":"Markdown is a lightweight markup language for creating formatted text. The Tape calculation field supports Markdown syntax inside the result of a calculation. The result will be run through a markdown parser when the client displays it (both web and mobile).","sidebar":"mainSidebar"},"contribute":{"id":"contribute","title":"Contribute","description":"Tape is about community, and evolution. If you would like to help us improve the docs, use the \\"Edit this page\\" button and open a pull request on GitHub. Your help is much appreciated and all changes will be live right after they are approved by a team member.","sidebar":"guidesSidebar"},"guide/getting-started":{"id":"guide/getting-started","title":"Getting Started","description":"If you\'re new to the Tape API, you\'ve come to the right place. In this guide you\'ll learn how to use the Tape API by interacting with a record.","sidebar":"guidesSidebar"}}}')}}]);