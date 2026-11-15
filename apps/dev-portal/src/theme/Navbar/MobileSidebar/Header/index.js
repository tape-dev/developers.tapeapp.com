import React from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemeSwitch from '@site/src/components/layout/theme-switch';

// Mobile menu head: logo + title, theme switch on the right (no close button: tap outside or Esc closes)
export default function NavbarMobileSidebarHeader() {
  const { navbar } = useThemeConfig();
  const logo = useBaseUrl(navbar.logo.src);
  return (
    <div className="navbar-sidebar__brand tp-drawer__head">
      <Link to="/docs/guide/api/getting-started" className="tp-brand tp-drawer__brand">
        <img src={logo} alt="" width="24" height="24" />
        <span>{navbar.title}</span>
      </Link>
      <ThemeSwitch />
    </div>
  );
}
