"use strict";(self.webpackChunkdev_portal=self.webpackChunkdev_portal||[]).push([[8610],{6299:(e,a,t)=>{t.d(a,{Z:()=>s});var l=t(7294),n=t(5999),r=t(1750);function s(e){var a=e.metadata,t=a.previousPage,s=a.nextPage;return l.createElement("nav",{className:"pagination-nav","aria-label":(0,n.I)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"})},l.createElement("div",{className:"pagination-nav__item"},t&&l.createElement(r.Z,{permalink:t,title:l.createElement(n.Z,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)"},"Newer Entries")})),l.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},s&&l.createElement(r.Z,{permalink:s,title:l.createElement(n.Z,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)"},"Older Entries")})))}},9404:(e,a,t)=>{t.r(a),t.d(a,{default:()=>p});var l=t(7294),n=t(9960),r=t(8665),s=t(8561),i=t(5999),o=t(3725),g=t(6299);function p(e){var a,t=e.metadata,p=e.items,m=e.sidebar,c=e.listMetadata,d=t.allTagsPath,u=t.name,h=t.count,b=(a=(0,o.c2)().selectMessage,function(e){return a(e,(0,i.I)({id:"theme.blog.post.plurals",description:'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One post|{count} posts"},{count:e}))}),v=(0,i.I)({id:"theme.blog.tagTitle",description:"The title of the page for a blog tag",message:'{nPosts} tagged with "{tagName}"'},{nPosts:b(h),tagName:u});return l.createElement(r.Z,{title:v,wrapperClassName:o.kM.wrapper.blogPages,pageClassName:o.kM.page.blogTagPostListPage,searchMetadata:{tag:"blog_tags_posts"},sidebar:m},l.createElement("header",{className:"margin-bottom--xl"},l.createElement("h1",null,v),l.createElement(n.Z,{href:d},l.createElement(i.Z,{id:"theme.tags.tagsPageLink",description:"The label of the link targeting the tag list page"},"View All Tags"))),p.map((function(e){var a=e.content;return l.createElement(s.Z,{key:a.metadata.permalink,frontMatter:a.frontMatter,assets:a.assets,metadata:a.metadata,truncated:!0},l.createElement(a,null))})),l.createElement(g.Z,{metadata:c}))}}}]);