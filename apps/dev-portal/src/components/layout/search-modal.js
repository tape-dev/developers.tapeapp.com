import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePluginData } from '@docusaurus/useGlobalData';
import { useHistory } from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Search, FileText, Hash, AlignLeft, CornerDownLeft } from 'lucide-react';
import { loadFulltext, searchFulltext, marks, MIN_TERM } from './fulltext';

const SECTION = { guide: 'Guides', api: 'API Reference', mcp: 'Guides', automations: 'Automations', calculation: 'Calculations', contribute: 'Guides' };

function score(q, s) {
  s = (s || '').toLowerCase();
  if (!s) return 0;
  if (s === q) return 100;
  if (s.startsWith(q)) return 60;
  if (s.includes(' ' + q)) return 40;
  if (s.includes(q)) return 25;
  return 0;
}

// Fallback without the full-text index (offline copy opened by double-click): titles and headings only
function titleSearch(pages, q) {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  const hits = [];
  for (const p of pages) {
    const ps = score(term, p.t) * 2 + score(term, p.d);
    if (ps) hits.push({ key: p.u, kind: 'page', title: p.t, crumb: SECTION[p.s] || 'Docs', text: p.d, url: p.u, s: ps + 10 });
    for (const h of p.h) {
      const hs = score(term, h.t);
      if (hs) hits.push({ key: p.u + '#' + h.a, kind: 'heading', title: h.t, crumb: (SECTION[p.s] || 'Docs') + ' › ' + p.t, url: p.u + '#' + h.a, s: hs });
    }
  }
  return hits.sort((a, b) => b.s - a.s).slice(0, 12);
}

const ICON = { page: FileText, heading: Hash, content: AlignLeft };

function Marked({ text, q }) {
  return marks(text, q).map((m, i) => (m.hit ? <mark key={i}>{m.t}</mark> : <React.Fragment key={i}>{m.t}</React.Fragment>));
}

export default function SearchModal({ onClose }) {
  const { pages } = usePluginData('tp-search-index');
  const base = useBaseUrl('/');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const [full, setFull] = useState(null); // null = loading, false = not available
  const input = useRef(null);
  const history = useHistory();

  useEffect(() => {
    let on = true;
    loadFulltext(base).then((p) => on && setFull(p)).catch(() => on && setFull(false));
    return () => { on = false; };
  }, [base]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    // one-letter queries: titles and headings only, the full text would match nearly everything
    const longEnough = (q.toLowerCase().match(/[^-\s]+/g) || []).some((t) => t.length >= MIN_TERM);
    return full && longEnough ? searchFulltext(full, q) : titleSearch(pages, q);
  }, [q, pages, full]);

  // After choosing a result the focus must not jump back to the search pill: the Enter key that chose the
  // result would then activate the pill and reopen an empty dialog over the new page.
  const navigated = useRef(false);
  useEffect(() => {
    const before = document.activeElement;
    input.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; if (!navigated.current && before && before.focus) before.focus(); };
  }, []);
  // Escape closes the dialog even when the focus is not inside it (e.g. after a click on the backdrop area)
  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape' && !e.isComposing) { e.preventDefault(); onClose(); } };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);
  // keep the selected result in view while using the arrow keys
  useEffect(() => { document.querySelector('.tp-sm__item.is-sel')?.scrollIntoView({ block: 'nearest' }); }, [sel]);
  useEffect(() => setSel(0), [q]);

  const go = (r) => { navigated.current = true; onClose(); history.push(r.url); };
  const onKey = (e) => {
    if (e.isComposing || e.keyCode === 229) return; // Enter confirms an input-method composition, not a result
    if (e.key === 'Tab') { e.preventDefault(); input.current?.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(s + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (results[sel]) go(results[sel]); }
  };

  return createPortal(
    <div className="tp-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tp-sm__box" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKey}>
        <div className="tp-sm__bar">
          <Search size={18} strokeWidth={1.75} />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." aria-label="Search the docs" />
          <kbd onClick={onClose}>Esc</kbd>
        </div>
        <div className="tp-sm__list">
          {q && !results.length && <div className="tp-sm__empty">{full === null ? 'Loading…' : <>No results for “{q}”</>}</div>}
          {!q && <div className="tp-sm__empty">Search all pages, sections and text</div>}
          {results.map((r, i) => {
            const Icon = ICON[r.kind] || FileText;
            return (
              <button key={r.key} type="button" className={'tp-sm__item' + (i === sel ? ' is-sel' : '')} onMouseEnter={() => setSel(i)} onClick={() => go(r)}>
                <Icon size={16} />
                <span className="tp-sm__txt">
                  {r.crumb && <span className="tp-sm__crumb">{r.crumb}</span>}
                  <span className="tp-sm__title"><Marked text={r.title} q={q} /></span>
                  {r.text && <span className="tp-sm__sub"><Marked text={r.text} q={q} /></span>}
                </span>
                {i === sel && <CornerDownLeft size={14} className="tp-sm__enter" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
}
