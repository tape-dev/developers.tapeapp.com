import React from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';

// Callout like the reference: icon column, then title (bold first line) and text in one column.
// The title is wrapped in one element so inline code in it stays on the same line.
export default function AdmonitionLayout({ type, icon, title, children, className, id }) {
  return (
    <div className={clsx(ThemeClassNames.common.admonition, ThemeClassNames.common.admonitionType(type), className)} id={id}>
      {(title || icon) && (
        <div className="admonitionHeading">
          <span className="admonitionIcon">{icon}</span>
          {title && <span className="tp-co__title">{title}</span>}
        </div>
      )}
      {children && <div className="admonitionContent">{children}</div>}
    </div>
  );
}
