// Full-text search for the search dialog.
// Uses the index that @easyops-cn/docusaurus-search-local writes at build time
// (search-index.json, lunr 2). Parts: 0 page titles, 1 headings, 2 descriptions, 3 keywords, 4 content.
import lunr from 'lunr';

let cache = null;

export function loadFulltext(baseUrl) {
  if (!cache) {
    cache = fetch(`${baseUrl}search-index.json`)
      .then((r) => { if (!r.ok) throw new Error('no index'); return r.json(); })
      .then((parts) => parts.map((p) => ({
        docs: new Map(p.documents.map((d) => [String(d.i), d])),
        index: lunr.Index.load(p.index),
      })))
      .catch((e) => { cache = null; throw e; });
  }
  return cache;
}

const stem = (t) => lunr.stemmer(new lunr.Token(t)).toString();

// Speed (15.11.2026): a term with a leading AND trailing wildcard matches most of the vocabulary of the large
// content index, and lunr merges the match data quadratically: one typed letter took more than a minute and froze
// the page. So inside-word matches (e.g. "hook" finds "Webhook") only run on the small title and heading indexes,
// the content is searched by word prefix, and one-letter terms are left out of the full-text search.
export const MIN_TERM = 2;
const INNER_FROM = 3;

function run(part, tokens, inner) {
  try {
    return part.index.query((q) => tokens.forEach((t) => q.term(stem(t), {
      presence: lunr.Query.presence.REQUIRED,
      wildcard: inner && t.length >= INNER_FROM ? lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING : lunr.Query.wildcard.TRAILING,
      usePipeline: false,
    })));
  } catch (e) {
    return [];
  }
}

function snippet(text, tokens) {
  const low = text.toLowerCase();
  let at = -1;
  for (const t of tokens) { at = low.indexOf(t); if (at >= 0) break; }
  let start = Math.max(0, at - 50);
  if (start > 0) { const sp = text.lastIndexOf(' ', start); start = sp > 0 && start - sp < 25 ? sp + 1 : start; }
  let s = (start > 0 ? '…' : '') + text.slice(start, start + 140) + (text.length > start + 140 ? '…' : '');
  return s;
}

// → [{ key, kind: 'page'|'heading'|'content', title, crumb, url, text }]
export function searchFulltext(parts, query, limit = 14) {
  const tokens = (query.toLowerCase().match(/[^-\s]+/g) || []).filter((t) => t.length >= MIN_TERM);
  if (!tokens.length || !parts) return [];
  const pageOf = (id) => parts[0].docs.get(String(id));
  const out = [];
  const seen = new Set();
  const add = (item) => { if (!seen.has(item.url) && out.length < limit) { seen.add(item.url); out.push(item); } };
  run(parts[0], tokens, true).slice(0, 4).forEach((r) => {
    const d = parts[0].docs.get(r.ref);
    if (d) add({ key: 't' + d.i, kind: 'page', title: d.t, crumb: (d.b || []).join(' › '), url: d.u });
  });
  run(parts[1], tokens, true).slice(0, 6).forEach((r) => {
    const d = parts[1].docs.get(r.ref); const pg = d && pageOf(d.p);
    if (d) add({ key: 'h' + d.i, kind: 'heading', title: d.t, crumb: [...((pg && pg.b) || []), pg && pg.t].filter(Boolean).join(' › '), url: d.u + (d.h || '') });
  });
  [2, 4].forEach((n) => {
    if (!parts[n]) return;
    run(parts[n], tokens).slice(0, 20).forEach((r) => {
      const d = parts[n].docs.get(r.ref); const pg = d && pageOf(d.p);
      if (d) add({ key: 'c' + n + d.i, kind: 'content', title: d.s || (pg && pg.t) || '', crumb: [...((pg && pg.b) || []), pg && pg.t].filter(Boolean).join(' › '), url: d.u + (d.h || ''), text: snippet(d.t, tokens) });
    });
  });
  return out;
}

// Splits text into [{ t, hit }] for highlighting
export function marks(text, query) {
  const tokens = (query.toLowerCase().match(/[^-\s]+/g) || []).filter((t) => t.length > 1);
  if (!text || !tokens.length) return [{ t: text || '', hit: false }];
  const re = new RegExp('(' + tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'gi');
  return text.split(re).filter(Boolean).map((t) => ({ t, hit: tokens.includes(t.toLowerCase()) }));
}
