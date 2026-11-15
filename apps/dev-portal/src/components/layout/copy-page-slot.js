import React from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import CopyPage from './copy-page';

// Second "Copy page" button below the lead text; shown only below 1024 px (CSS), the one next to the H1 above
export default function CopyPageSlot() {
  const { metadata, frontMatter, contentTitle } = useDoc();
  const title = !frontMatter.hide_title && typeof contentTitle === 'undefined' ? metadata.title : null;
  if (!title) return null;
  return <div className="tp-copy-m"><CopyPage title={title} /></div>;
}
