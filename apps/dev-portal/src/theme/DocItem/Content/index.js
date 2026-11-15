import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import { useDoc, useSidebarBreadcrumbs } from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';
import CopyPage from '@site/src/components/layout/copy-page';
import breakable from '@site/src/components/layout/breakable';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';

// Page head: grey group label, H1 with "Copy page" on the right.
// The first paragraph of the page is styled as lead text (CSS).
export default function DocItemContent({ children }) {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const mobileSidebar = useNavbarMobileSidebar();
  const crumbs = useSidebarBreadcrumbs() || [];
  const group = crumbs.length > 1 ? crumbs[0].label : null;
  const title = !frontMatter.hide_title && typeof contentTitle === 'undefined' ? metadata.title : null;
  return (
    <div className={clsx(ThemeClassNames.docs.docMarkdown, 'markdown')}>
      {title && (
        <button type="button" className="tp-mcrumb" aria-expanded={mobileSidebar.shown} aria-haspopup="dialog" onClick={() => mobileSidebar.toggle()}>
          <svg className="tp-mcrumb__menu" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M2.75 3.75h10.5M2.75 8h10.5M2.75 12.25h10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          {group && <span>{group}</span>}
          {group && <svg className="tp-mcrumb__sep" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          <b>{title}</b>
        </button>
      )}
      {title && (
        <header className="tp-head">
          {group && <div className="tp-head__group">{group}</div>}
          <div className="tp-head__row">
            <Heading as="h1">{breakable(title)}</Heading>
            <CopyPage title={title} />
          </div>
        </header>
      )}
      <MDXContent>{children}</MDXContent>
    </div>
  );
}
