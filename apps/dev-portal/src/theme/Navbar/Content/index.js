import React, { useState } from 'react';
import useMenu from '@site/src/components/layout/use-menu';
import { EllipsisVertical, X } from 'lucide-react';
import { useThemeConfig, ErrorCauseBoundary } from '@docusaurus/theme-common';
import { splitNavbarItems, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import ThemeMenu from '@site/src/components/layout/theme-menu';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import SearchButton from '@site/src/components/layout/search';
import SearchBar from '@theme/SearchBar';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function Items({ items }) {
  return items.map((item, i) => (
    <ErrorCauseBoundary key={i} onError={(e) => new Error('navbar item failed', { cause: e })}>
      <NavbarItem {...item} />
    </ErrorCauseBoundary>
  ));
}

// Phones: the header buttons move into a small "More actions" menu (three dots)
function MoreMenu({ items }) {
  const [open, setOpen] = useState(false);
  const { btn, menu, wrap } = useMenu(open, setOpen);
  return (
    <div className="tp-more" ref={wrap}>
      <button ref={btn} type="button" className="tp-more__btn" aria-label="More actions" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <EllipsisVertical size={16} strokeWidth={2} aria-hidden="true" />
      </button>
      {open && <div className="tp-more__backdrop" aria-hidden="true" onClick={() => setOpen(false)} />}
      {open && (
        <div ref={menu} className="tp-more__menu" role="menu">
          <button type="button" className="tp-more__close" aria-label="Close" onClick={() => { setOpen(false); if (btn.current) btn.current.focus(); }}><X size={16} strokeWidth={1.75} aria-hidden="true" /></button>
          {items.map((item, i) => (
            <a key={i} role="menuitem" href={item.href} className="tp-more__item" onClick={() => setOpen(false)}>{item.label}</a>
          ))}
        </div>
      )}
    </div>
  );
}

// Two rows:
// row 1 = logo + "Developer Docs", search pill in the middle, buttons right; row 2 = tabs
export default function NavbarContent() {
  const mobileSidebar = useNavbarMobileSidebar();
  const { navbar } = useThemeConfig();
  const [left, right] = splitNavbarItems(navbar.items);
  const logo = useBaseUrl(navbar.logo.src);
  const plugin = useDocusaurusContext().siteConfig.customFields.search === 'easyops';
  return (
    <div className="tp-nav">
      <div className="tp-nav__row">
        <div className="tp-nav__left">
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <Link to="/docs/guide/api/getting-started" className="tp-brand">
            <img src={logo} alt="" width="24" height="24" />
            <span>{navbar.title}</span>
          </Link>
        </div>
        <div className="tp-nav__center">{plugin ? <div className="tp-plugin-search"><SearchBar /></div> : <SearchButton />}</div>
        <div className="tp-nav__right"><Items items={right} /><ThemeMenu /><MoreMenu items={right} /></div>
      </div>
      <div className="tp-nav__tabs"><Items items={left} /></div>
    </div>
  );
}
