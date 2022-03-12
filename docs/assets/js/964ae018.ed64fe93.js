"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[491],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),u=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(r),f=a,h=d["".concat(l,".").concat(f)]||d[f]||p[f]||o;return r?n.createElement(h,i(i({ref:t},c),{},{components:r})):n.createElement(h,i({ref:t},c))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var u=2;u<o;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6312:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>f,frontMatter:()=>s,metadata:()=>u,toc:()=>p});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],s={id:"api-reference",title:"API Reference",sidebar_label:"API Reference"},l="API Reference",u={unversionedId:"api-reference",id:"api-reference",title:"API Reference",description:"The Tape API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.",source:"@site/docs/api-reference.md",sourceDirName:".",slug:"/api-reference",permalink:"/docs/api-reference",editUrl:"https://github.com/tape-dev/developers.tapeapp.com/edit/main/apps/dev-portal/docs/api-reference.md",tags:[],version:"current",frontMatter:{id:"api-reference",title:"API Reference",sidebar_label:"API Reference"},sidebar:"someSidebar"},c={},p=[{value:"Base URL",id:"base-url",level:2},{value:"Authentication",id:"authentication",level:2},{value:"Personal API keys",id:"personal-api-keys",level:3},{value:"OAuth2 Authentication Flow",id:"oauth2-authentication-flow",level:3},{value:"Rate Limiting",id:"rate-limiting",level:2}],d={toc:p};function f(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},d,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"api-reference"},"API Reference"),(0,o.kt)("p",null,"The Tape API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs."),(0,o.kt)("p",null,"You can use the Tape API in test mode, which does not affect your live data or interact with the banking networks. The API key you use to authenticate the request determines whether the request is live mode or test mode."),(0,o.kt)("p",null,"The Tape API differs for every account as we release new versions and tailor functionality. Log in to see docs customized to your version of the API, with your test key and data."),(0,o.kt)("h2",{id:"base-url"},"Base URL"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"https://api.tapeapp.com\n")),(0,o.kt)("h2",{id:"authentication"},"Authentication"),(0,o.kt)("h3",{id:"personal-api-keys"},"Personal API keys"),(0,o.kt)("p",null,"The Tape API uses personal API keys to authenticate requests. You can view and manage your API keys in your ",(0,o.kt)("a",{parentName:"p",href:"https://tapeapp.com/tape/(focus//root-modal:user-settings/profile)"},"Tape user settings"),"."),(0,o.kt)("p",null,"Your personal API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth."),(0,o.kt)("p",null,"Authentication to the API is performed via HTTP Basic Auth. Provide your API key as the basic auth username value. You do not need to provide a password."),(0,o.kt)("p",null,'If you need to authenticate via bearer auth (e.g., for a cross-origin request), use -H "Authorization: Bearer YOUR_API_KEY" instead of -u YOUR_API_KEY.'),(0,o.kt)("p",null,"All API requests must be made over HTTPS. Calls made over plain HTTP will fail. API requests without authentication will also fail."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"$ curl https://api.tapeapp.com/v1/charges -u YOUR_API_KEY:\n\n# The colon prevents curl from asking for a password.\n")),(0,o.kt)("h3",{id:"oauth2-authentication-flow"},"OAuth2 Authentication Flow"),(0,o.kt)("p",null,"In order to develop scalable integrations and applications around Tape, there will be an OAuth2 authentication flow in the future."),(0,o.kt)("h2",{id:"rate-limiting"},"Rate Limiting"),(0,o.kt)("p",null,"Currently a global rate limit of X is enforced for all personal API keys. Contact us if you require a different limit."))}f.isMDXComponent=!0}}]);