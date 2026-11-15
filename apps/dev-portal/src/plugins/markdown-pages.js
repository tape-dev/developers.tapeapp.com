// After the build: one Markdown file per doc page (<page>.md), plus llms.txt and llms-full.txt.
// "Copy page" and "View as Markdown" use these files, like the reference docs.
// Source is the built HTML of the article, so imports, JSX and placeholders are already resolved.
const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const TurndownService = require('turndown');
const { gfm } = require('turndown-plugin-gfm');

const SITE = 'https://developers.tapeapp.com';

function prepare(article) {
  // drop page chrome and UI that is not content
  article.querySelectorAll('.tp-api-aside, .tp-params, .tp-copy, .tp-mcrumb, .tp-login, .hash-link, button, .theme-doc-toc-mobile, [class*="buttonGroup"]').forEach((n) => n.remove());
  // API sections: request and response right after the URL bar, as on the page below 1280 px
  article.querySelectorAll('.tp-api-sec').forEach((sec) => {
    const head = sec.querySelector('.tp-api-head'); const ex = sec.querySelector('.tp-api-ex');
    if (head && ex) { ex.remove(); head.insertAdjacentHTML('afterend', ex.outerHTML); }
  });
  // images with absolute URLs
  article.querySelectorAll('img').forEach((img) => { const s = img.getAttribute('src') || ''; if (s.startsWith('/')) img.setAttribute('src', SITE + s); });
  // code tabs: label every panel with its tab name
  article.querySelectorAll('.tabs-container').forEach((tc) => {
    const labels = tc.querySelectorAll('[role="tab"]').map((t) => t.text.trim());
    tc.querySelectorAll('[role="tabpanel"]').forEach((p, i) => {
      if (labels[i]) p.insertAdjacentHTML('afterbegin', `<p><strong>${labels[i]}</strong></p>`);
      p.removeAttribute('hidden');
    });
    tc.querySelectorAll('[role="tablist"]').forEach((n) => n.remove());
  });
  return article;
}

function converter() {
  const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-', emDelimiter: '*' });
  td.use(gfm);
  td.addRule('codeBlock', {
    filter: (n) => n.nodeName === 'DIV' && /\btheme-code-block\b/.test(n.getAttribute('class') || ''),
    replacement: (_, n) => {
      const lang = ((n.getAttribute('class') || '').match(/language-(\S+)/) || [, ''])[1];
      const title = n.querySelector('[class*="codeBlockTitle"]');
      const lines = Array.from(n.querySelectorAll('.token-line')).map((l) => l.textContent);
      const code = (lines.length ? lines.join('\n') : (n.querySelector('code') || n).textContent).replace(/\n+$/, '');
      return `\n\n${title && title.textContent.trim() ? `*${title.textContent.trim()}*\n\n` : ''}\`\`\`${lang}\n${code}\n\`\`\`\n\n`;
    },
  });
  td.addRule('urlBar', {
    filter: (n) => n.nodeName === 'DIV' && /\btp-url\b/.test(n.getAttribute('class') || ''),
    replacement: (_, n) => `\n\n\`${n.getAttribute('title') ? (n.querySelector('.tp-url__method') || {}).textContent + ' ' + n.getAttribute('title') : n.textContent}\`\n\n`,
  });
  td.addRule('card', {
    filter: (n) => n.nodeName === 'A' && /\btp-card\b/.test(n.getAttribute('class') || ''),
    replacement: (_, n) => {
      const t = (n.querySelector('.tp-card__title') || {}).textContent || '';
      const d = ((n.querySelector('.tp-card__text') || {}).textContent || '').trim();
      return `\n- [${t}](${SITE}${n.getAttribute('href')})${d ? ': ' + d : ''}`;
    },
  });
  td.addRule('admonition', {
    filter: (n) => n.nodeName === 'DIV' && /\btheme-admonition\b/.test(n.getAttribute('class') || ''),
    replacement: (content) => '\n\n' + content.trim().split('\n').map((l) => '> ' + l).join('\n') + '\n\n',
  });
  td.addRule('details', {
    filter: 'details',
    replacement: (content) => '\n\n' + content.trim() + '\n\n',
  });
  td.addRule('summary', { filter: 'summary', replacement: (content) => `**${content.trim()}**\n\n` });
  td.addRule('absLinks', {
    filter: (n) => n.nodeName === 'A' && (n.getAttribute('href') || '').startsWith('/'),
    replacement: (content, n) => `[${content}](${SITE}${n.getAttribute('href')})`,
  });
  td.remove(['script', 'style', 'svg']);
  return td;
}

module.exports = function markdownPages() {
  return {
    name: 'tp-markdown-pages',
    async postBuild({ outDir, routesPaths }) {
      const td = converter();
      const index = {};
      const TAB = { guide: 'Guides', mcp: 'Guides', contribute: 'Guides', api: 'API Reference', automations: 'Automations', calculation: 'Calculations' };
      const full = [];
      for (const route of routesPaths.filter((r) => r.startsWith('/docs/')).sort()) {
        const file = path.join(outDir, route, 'index.html');
        if (!fs.existsSync(file)) continue;
        const root = parse(fs.readFileSync(file, 'utf8'));
        const article = root.querySelector('.theme-doc-markdown');
        if (!article) continue;
        const title = (root.querySelector('.tp-head h1') || root.querySelector('h1') || { text: route }).text.trim();
        const desc = (root.querySelector('meta[name="description"]') || { getAttribute: () => '' }).getAttribute('content') || '';
        prepare(article);
        const md = `# ${title}\n\n${desc ? `> ${desc}\n\n` : ''}${td.turndown(article.innerHTML.replace(/<header[\s\S]*?<\/header>/, ''))}\n`.replace(/\n{3,}/g, '\n\n');
        const target = path.join(outDir, route.replace(/\/$/, '') + '.md');
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, md);
        const tab = TAB[route.split('/')[2]] || 'More';
        (index[tab] = index[tab] || []).push(`- [${title}](${SITE}${route.replace(/\/$/, '')}.md)${desc ? ': ' + desc : ''}`);
        full.push(md);
      }
      const order = ['Guides', 'API Reference', 'Automations', 'Calculations', 'More'].filter((t) => index[t]);
      fs.writeFileSync(path.join(outDir, 'llms.txt'), `# Tape Developer Docs\n\n> Build on Tape with the REST API, Tape MCP and automations.\n\n${order.map((t) => `## ${t}\n\n${index[t].join('\n')}`).join('\n\n')}\n`);
      fs.writeFileSync(path.join(outDir, 'llms-full.txt'), full.join('\n\n---\n\n'));
      console.log(`[tp-markdown-pages] ${full.length} Markdown pages, llms.txt, llms-full.txt`);
    },
  };
};
