// POC search index: title, description, H2/H3 headings and group of every doc page.
// Small enough for global data; full-text search would come from a local search plugin.
const fs = require('fs');
const path = require('path');

// Same slugger as Docusaurus (github-slugger), one instance per page so duplicates get -1, -2 …
const GithubSlugger = require('github-slugger');
const plain = (s) => s.replace(/<[^>]+>/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[`*]/g, '');

function walk(dir, base, out) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, base, out);
    else if (/\.mdx?$/.test(f)) out.push(p);
  }
  return out;
}

module.exports = function searchIndexPlugin(context) {
  return {
    name: 'tp-search-index',
    async contentLoaded({ actions }) {
      const docsDir = path.join(context.siteDir, 'docs');
      const pages = walk(docsDir, docsDir, []).map((file) => {
        const src = fs.readFileSync(file, 'utf8');
        const fm = (src.match(/^---\n([\s\S]*?)\n---/) || [, ''])[1];
        const get = (k) => ((fm.match(new RegExp('^' + k + ':\\s*(.*)$', 'm')) || [, ''])[1] || '').replace(/^['"]|['"]$/g, '');
        const rel = path.relative(docsDir, file).replace(/\.mdx?$/, '');
        const id = get('id') ? path.join(path.dirname(rel), get('id')) : rel;
        const body = src.replace(/^---[\s\S]*?---/, '').replace(/```[\s\S]*?```/g, '');
        const slugger = new GithubSlugger();
        const headings = Array.from(body.matchAll(/^(#{2,3})\s+(.+?)(?:\s+\{#([\w-]+)\})?\s*$/gm)).map((m) => ({ t: plain(m[2]), a: m[3] || slugger.slug(plain(m[2])) }));
        return { u: '/docs/' + id.replace(/\\/g, '/'), t: get('title') || get('sidebar_label') || id, d: get('description'), s: rel.split('/')[0], h: headings };
      });
      actions.setGlobalData({ pages });
    },
  };
};
