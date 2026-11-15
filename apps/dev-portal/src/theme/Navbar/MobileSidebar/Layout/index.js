import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ThemeClassNames, useThemeConfig } from '@docusaurus/theme-common';
import { useNavbarSecondaryMenu, useNavbarMobileSidebar, splitNavbarItems } from '@docusaurus/theme-common/internal';
import { useActiveDocContext } from '@docusaurus/plugin-content-docs/client';
import NavbarItem from '@theme/NavbarItem';
import { ChevronDown } from 'lucide-react';

// Section switch at the top of the mobile menu (the header tabs as a drop-down)
function DrawerTabs() {
  const { navbar } = useThemeConfig();
  const [tabs] = splitNavbarItems(navbar.items);
  const { activeDoc } = useActiveDocContext(undefined);
  const mobileSidebar = useNavbarMobileSidebar();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const active = tabs.find((t) => activeDoc && t.sidebarId === activeDoc.sidebar) || tabs[0];
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);
  if (!active) return null;
  return (
    <div className="tp-drawer__tabwrap" ref={ref} onKeyDown={(e) => { if (open && e.key === 'Escape') { e.stopPropagation(); setOpen(false); if (btnRef.current) btnRef.current.focus(); } }}>
      <button ref={btnRef} type="button" className="tp-drawer__tabs" aria-expanded={open} aria-controls="tp-drawer-sections" onClick={() => setOpen((o) => !o)}>
        <span>{active.label}</span>
        <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <ul id="tp-drawer-sections" className="tp-drawer__tablist menu__list" aria-label="Sections">
          {tabs.map((item, i) => (
            <NavbarItem key={i} mobile {...item} onClick={() => { setOpen(false); mobileSidebar.toggle(); }} />
          ))}
        </ul>
      )}
    </div>
  );
}

// Mobile menu like the reference: head, section switch, then the sidebar of the current section
export default function NavbarMobileSidebarLayout({ header, primaryMenu }) {
  const secondary = useNavbarSecondaryMenu();
  const mobileSidebar = useNavbarMobileSidebar();
  const panel = useRef(null);
  useEffect(() => {
    if (!mobileSidebar.shown) return undefined;
    const opener = document.activeElement;
    const focusables = () => Array.from((panel.current && panel.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')) || []).filter((e) => e.offsetParent !== null);
    const t = setTimeout(() => { const f = focusables()[0]; if (f) f.focus(); }, 50);
    const back = () => { const c = document.querySelector('.tp-mcrumb'); const target = c && c.offsetParent !== null ? c : opener; if (target && target.focus) target.focus(); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); mobileSidebar.toggle(); setTimeout(back, 30); return; }
      if (e.key !== 'Tab') return;
      const list = focusables();
      if (!list.length) return;
      const i = list.indexOf(document.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); list[list.length - 1].focus(); }
      else if (!e.shiftKey && (i === list.length - 1 || i === -1)) { e.preventDefault(); list[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); };
  }, [mobileSidebar.shown]);
  return (
    <div className={clsx(ThemeClassNames.layout.navbar.mobileSidebar.container, 'navbar-sidebar')} role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="tp-drawer" ref={panel}>
        {header}
        <DrawerTabs />
        <div className="menu tp-drawer__menu">{secondary.content || primaryMenu}</div>
      </div>
    </div>
  );
}
