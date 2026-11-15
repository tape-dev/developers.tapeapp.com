import { useEffect, useRef } from 'react';

// Keyboard and pointer handling for small menus (like the reference):
// open -> focus on the first entry, arrows / Home / End move, Esc closes and gives focus back to the button,
// click outside or Tab closes.
export default function useMenu(open, setOpen) {
  const btn = useRef(null);
  const menu = useRef(null);
  const wrap = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const items = () => Array.from((menu.current && menu.current.querySelectorAll('button, a[href]')) || []);
    const first = items()[0];
    if (first) first.focus();
    const onDown = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); if (btn.current) btn.current.focus(); return; }
      if (!menu.current || !menu.current.contains(document.activeElement)) return;
      const list = items();
      const i = list.indexOf(document.activeElement);
      const go = (n) => { e.preventDefault(); list[(n + list.length) % list.length].focus(); };
      if (e.key === 'ArrowDown') go(i + 1);
      else if (e.key === 'ArrowUp') go(i - 1);
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(list.length - 1);
      else if (e.key === 'Tab') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, setOpen]);
  return { btn, menu, wrap };
}
