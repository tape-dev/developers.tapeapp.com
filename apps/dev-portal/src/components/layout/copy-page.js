import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { Copy, Check } from 'lucide-react';
import { ChatGptIcon, ClaudeIcon, PerplexityIcon, McpIcon, CursorIcon, VsCodeIcon, MarkdownIcon, ChevronIcon, ExternalIcon } from './copy-page-icons';

// "Copy page" button with a menu of eight actions, built after the reference docs (measured 15.11.2026).
// Styles: src/css/menue.css.

const MCP_URL = 'https://mcp.tapeapp.com/mcp';
const MCP_NAME = 'tape'; // same server name as in docs/mcp/connect.md
const COPIED_MS = 2000;
const GAP = 4; // menu below the button
const EDGE = 16; // menu keeps this distance to the window edge
const ANIM_MS = 100;

// Array.from instead of [...NodeList]: the Docusaurus Babel preset turns spread
// over NodeList/HTMLCollection into a broken copy (Nörgler B2, 15.11.2026).
const list = (x) => Array.from(x || []);

// Converts the rendered article to Markdown (dev server and offline copy, where no .md file exists)
function toMarkdown(root) {
  const out = [];
  const inline = (el) => list(el.childNodes).map((n) => {
    if (n.nodeType === 3) return n.textContent;
    if (n.nodeType !== 1) return '';
    const t = n.tagName;
    if (t === 'CODE') return '`' + n.textContent + '`';
    if (t === 'STRONG' || t === 'B') return '**' + inline(n) + '**';
    if (t === 'EM' || t === 'I') return '*' + inline(n) + '*';
    if (t === 'A') return n.classList.contains('hash-link') ? '' : `[${inline(n)}](${n.href})`;
    if (t === 'BUTTON' || t === 'svg' || t === 'NAV') return '';
    return inline(n);
  }).join('');
  const walk = (el, depth = 0) => {
    for (const n of list(el.children)) {
      const t = n.tagName;
      if (/^H[1-4]$/.test(t)) out.push('#'.repeat(+t[1]) + ' ' + inline(n).replace(/​/g, '').trim());
      else if (t === 'P') out.push(inline(n).trim());
      else if (t === 'PRE') out.push('```\n' + n.innerText.trim() + '\n```');
      else if (t === 'UL' || t === 'OL') list(n.children).forEach((li, i) => out.push('  '.repeat(depth) + (t === 'OL' ? `${i + 1}. ` : '- ') + inline(li).trim()));
      else if (t === 'TABLE') list(n.rows).forEach((r, i) => {
        const cells = list(r.cells);
        out.push('| ' + cells.map((c) => inline(c).trim()).join(' | ') + ' |');
        if (i === 0) out.push('|' + cells.map(() => ' --- |').join(''));
      });
      else if (t === 'A' && n.classList.contains('tp-card')) out.push(`- [${n.querySelector('.tp-card__title')?.innerText}](${n.href}): ${n.querySelector('.tp-card__text')?.innerText}`);
      else if (t === 'BUTTON' || t === 'NAV' || n.classList.contains('tp-copy') || n.classList.contains('tp-login')) continue;
      else walk(n, depth);
    }
  };
  walk(root);
  return out.filter(Boolean).join('\n\n');
}

async function writeClipboard(text) {
  try { await navigator.clipboard.writeText(text); } catch (e) {
    const ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
}

// base64 of a UTF-8 string (Cursor install link)
const b64 = (s) => window.btoa(unescape(encodeURIComponent(s)));

let uid = 0;

export default function CopyPage() {
  const { siteConfig } = useDocusaurusContext();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState('start'); // start | open | end (enter and exit animation)
  const [pos, setPos] = useState(null);
  const [id] = useState(() => `tp-cp-${++uid}`);
  const chev = useRef(null);
  const wrap = useRef(null);
  const menu = useRef(null);
  const viaKeyboard = useRef(false);
  const timer = useRef(null);

  // Built site: <page>.md is written by src/plugins/markdown-pages.js. Dev server and offline copy: convert the page in the browser.
  const hasMdFile = () => process.env.NODE_ENV === 'production' && window.location.protocol !== 'file:';
  const pagePath = () => window.location.pathname.replace(/\/$/, '');
  const origin = () => (/^https?:$/.test(window.location.protocol) ? window.location.origin : siteConfig.url);
  const pageUrl = () => origin() + window.location.pathname;
  const mdUrl = () => origin() + pagePath() + '.md';
  const pageMarkdown = async () => {
    if (hasMdFile()) {
      try { const r = await fetch(pagePath() + '.md'); if (r.ok) return await r.text(); } catch (e) { /* fall back */ }
    }
    return toMarkdown(document.querySelector('.theme-doc-markdown'));
  };

  const flash = () => {
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const close = useCallback((focusButton = true) => {
    setOpen(false);
    if (focusButton && chev.current) chev.current.focus({ preventScroll: true });
  }, []);

  // mount / unmount with the short scale and fade of the reference
  useEffect(() => {
    if (open) { setPos(null); setMounted(true); setPhase('start'); return undefined; }
    if (!mounted) return undefined;
    setPhase('end');
    const t = setTimeout(() => setMounted(false), ANIM_MS);
    return () => clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // position: below the button, right edges aligned; flips to the left edge and stays 16 px inside the window
  const place = useCallback(() => {
    const a = chev.current?.getBoundingClientRect();
    const m = menu.current;
    if (!a || !m) return;
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    const mw = m.offsetWidth;
    const mh = m.offsetHeight;
    let align = 'end';
    let left = a.right - mw;
    if (left < EDGE) {
      align = 'start';
      left = a.left;
      if (left + mw > vw - EDGE) left = Math.max(EDGE, vw - EDGE - mw);
    }
    let side = 'bottom';
    let top = a.bottom + GAP;
    if (top + mh > vh - EDGE && a.top - GAP - mh >= EDGE) { side = 'top'; top = a.top - GAP - mh; }
    const ox = align === 'end' ? '100%' : `${a.left + a.width / 2 - left}px`;
    const oy = side === 'bottom' ? `-${GAP}px` : `calc(100% + ${GAP}px)`;
    setPos({ x: left + window.scrollX, y: top + window.scrollY, side, align, origin: `${ox} ${oy}` });
  }, []);

  useLayoutEffect(() => {
    if (!mounted || !open) return;
    place();
  }, [mounted, open, place]);

  useEffect(() => {
    if (!mounted || !open || !pos) return undefined;
    const r = requestAnimationFrame(() => setPhase('open'));
    return () => cancelAnimationFrame(r);
  }, [mounted, open, pos]);

  // focus when opened: keyboard -> first (or last) entry, pointer -> the menu itself
  useEffect(() => {
    if (!open || !pos || !menu.current) return;
    if (document.activeElement && menu.current.contains(document.activeElement)) return;
    const all = list(menu.current.querySelectorAll('[role="menuitem"]'));
    if (viaKeyboard.current === 'last') all[all.length - 1]?.focus({ preventScroll: true });
    else if (viaKeyboard.current) all[0]?.focus({ preventScroll: true });
    else menu.current.focus({ preventScroll: true });
  }, [open, pos]);

  // outside click and resize; on scroll the menu stays open and moves with the page (like the reference)
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (wrap.current?.contains(e.target) || menu.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onResize = () => place();
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open, place]);

  const items = () => list(menu.current?.querySelectorAll('[role="menuitem"]'));
  const onMenuKey = (e) => {
    const all = items();
    const i = all.indexOf(document.activeElement);
    const go = (n) => { e.preventDefault(); all[(n + all.length) % all.length]?.focus({ preventScroll: true }); };
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowDown') go(i < 0 ? 0 : i + 1);
    else if (e.key === 'ArrowUp') go(i < 0 ? all.length - 1 : i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(all.length - 1);
    else if (e.key === 'Tab') close(); // focus goes back to the button, the browser then moves on from there
    else if ((e.key === 'Enter' || e.key === ' ') && i >= 0) { e.preventDefault(); all[i].click(); }
  };
  const onChevKey = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); viaKeyboard.current = e.key === 'ArrowUp' ? 'last' : true; setOpen(true);
    }
  };

  const openTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');
  const ask = (url) => encodeURIComponent(`Read this page so I can ask you questions about it: ${url}`);
  const run = async (action) => {
    if (open) close();
    if (action === 'copy') { await writeClipboard(await pageMarkdown()); flash(); }
    else if (action === 'markdown') {
      if (hasMdFile()) { openTab(pagePath() + '.md'); return; }
      // no .md file (dev server, offline copy): show the converted page as plain text
      const win = window.open('', '_blank');
      if (win) win.location.href = URL.createObjectURL(new Blob([await pageMarkdown()], { type: 'text/plain;charset=utf-8' }));
    }
    else if (action === 'chatgpt') openTab(`https://chatgpt.com/?hints=search&q=${ask(pageUrl())}`);
    else if (action === 'claude') openTab(`https://claude.ai/new?q=${ask(mdUrl())}`);
    else if (action === 'perplexity') openTab(`https://www.perplexity.ai/search?q=${ask(mdUrl())}`);
    else if (action === 'mcp') { await writeClipboard(MCP_URL); flash(); }
    else if (action === 'cursor') openTab(`cursor://anysphere.cursor-deeplink/mcp/install?name=${encodeURIComponent(MCP_NAME)}&config=${encodeURIComponent(b64(JSON.stringify({ url: MCP_URL })))}`);
    else if (action === 'vscode') openTab(`vscode:mcp/install?${encodeURIComponent(JSON.stringify({ name: MCP_NAME, type: 'http', url: MCP_URL }))}`);
  };

  const entries = [
    { key: 'copy', icon: <Copy size={16} strokeWidth={2} aria-hidden="true" />, title: 'Copy page', text: 'Copy this page as Markdown for AI' },
    { key: 'markdown', icon: <MarkdownIcon />, title: 'View as Markdown', text: 'Open this page as plain text', ext: true },
    { key: 'chatgpt', icon: <ChatGptIcon />, title: 'Open in ChatGPT', text: 'Ask ChatGPT about this page', ext: true },
    { key: 'claude', icon: <ClaudeIcon />, title: 'Open in Claude', text: 'Ask Claude about this page', ext: true },
    { key: 'perplexity', icon: <PerplexityIcon />, title: 'Open in Perplexity', text: 'Ask Perplexity about this page', ext: true },
    { key: 'mcp', icon: <McpIcon />, title: 'Copy MCP server', text: 'Copy the Tape MCP server URL' },
    { key: 'cursor', icon: <CursorIcon />, title: 'Connect to Cursor', text: 'Add the MCP server to Cursor', ext: true },
    { key: 'vscode', icon: <VsCodeIcon />, title: 'Connect to VS Code', text: 'Add the MCP server to VS Code', ext: true },
  ];

  return (
    <div className="tp-copy" ref={wrap}>
      <button type="button" className="tp-cp__btn" aria-label="Copy page" onClick={() => run('copy')}>
        <div className="tp-cp__in">
          <Copy className="tp-cp__icon" size={16} strokeWidth={2} aria-hidden="true" />
          <span className="tp-cp__label">
            <span aria-hidden="true" className="tp-cp__ghost">Copy page</span>
            <span aria-live="polite">{copied ? 'Copied' : 'Copy page'}</span>
          </span>
        </div>
      </button>
      <button
        type="button"
        ref={chev}
        id={`${id}-btn`}
        className="tp-cp__chev"
        aria-label="More actions"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        data-open={open ? '' : undefined}
        onKeyDown={onChevKey}
        onClick={(e) => { viaKeyboard.current = e.detail === 0; setOpen(!open); }}
      >
        <ChevronIcon />
      </button>
      {mounted && createPortal(
        <div className="tp-cp__pos" style={{ transform: `translate(${pos ? pos.x : -9999}px, ${pos ? pos.y : 0}px)` }}>
          <div
            ref={menu}
            id={`${id}-menu`}
            role="menu"
            tabIndex={-1}
            aria-labelledby={`${id}-btn`}
            className="tp-cp__menu"
            data-side={pos?.side}
            data-align={pos?.align}
            data-phase={phase}
            style={{ transformOrigin: pos?.origin }}
            onKeyDown={onMenuKey}
          >
            {entries.map((x) => (
              <div
                key={x.key}
                role="menuitem"
                tabIndex={-1}
                className="tp-cp__item"
                data-action={x.key}
                onClick={() => run(x.key)}
                onMouseMove={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.focus({ preventScroll: true }); }}
              >
                <div className="tp-cp__box">{x.icon}</div>
                <div className="tp-cp__text">
                  <div className="tp-cp__title">{x.title}{x.ext && <ExternalIcon />}</div>
                  <div className="tp-cp__sub">{x.text}</div>
                </div>
                <Check className="tp-cp__tick" size={14} aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
