import React from 'react';
import Paginator from '@theme-original/DocItem/Paginator';
import Link from '@docusaurus/Link';

const LINKS = [
  ['Community', 'https://community.tapeapp.com'],
  ['Help Center', 'https://help.tapeapp.com/'],
  ['Privacy Policy', 'https://get.tapeapp.com/privacy-policy/'],
  ['Imprint', 'https://get.tapeapp.com/imprint/'],
];

export default function PaginatorWrapper(props) {
  return (
    <>
      <Paginator {...props} />
      <footer className="tp-footer">
        <nav className="tp-footer__links">
          {LINKS.map(([l, h]) => <Link key={l} href={h}>{l}</Link>)}
        </nav>
        <nav className="tp-footer__social" aria-label="Tape on social media">
          <Link href="https://twitter.com/Tape_HQ" aria-label="X">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M17.8 3h3.1l-6.8 7.7 8 10.3h-6.2l-4.9-6.3L5.4 21H2.3l7.2-8.3L1.8 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z"/></svg>
          </Link>
          <Link href="https://www.linkedin.com/company/tapehq" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4V9.75Z"/></svg>
          </Link>
        </nav>
      </footer>
    </>
  );
}
