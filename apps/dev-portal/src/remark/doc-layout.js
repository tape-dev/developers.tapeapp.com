/**
 * Docs layout: turns existing Markdown patterns into layout components,
 * so the 146 pages need no content change.
 *
 * 1. "## Next steps" + bullet list of "[Title](/docs/...): text"  -> <NextSteps> card grid
 * 2. "## Step N: ..." + the first ordered list after it              -> numbered steps (class tp-steps)
 * 3. Consecutive admonitions titled "Getting ... error?"           -> one <details> "Getting an error?"
 * 4. <video> in a page                                             -> framed like <MediaFrame>
 */

const text = (node) =>
  node.value != null ? node.value : (node.children || []).map(text).join('');

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });

// Description of a card: drop the leading ": " and turn nested links into plain text
function cardDescription(nodes) {
  const out = [];
  for (const n of nodes) {
    if (n.type === 'link') out.push(...n.children);
    else out.push(n);
  }
  while (out.length && out[0].type === 'text') {
    out[0] = { ...out[0], value: out[0].value.replace(/^\s*[:\-–—]\s*/, '') };
    if (out[0].value) break;
    out.shift();
  }
  return out;
}

function toCards(list) {
  const cards = [];
  for (const item of list.children) {
    const para = item.children && item.children[0];
    const first = para && para.type === 'paragraph' && para.children[0];
    if (!first || first.type !== 'link') return null; // not a link list: keep as is
    cards.push({
      type: 'mdxJsxFlowElement',
      name: 'NextStepCard',
      attributes: [attr('href', first.url), attr('title', text(first))],
      children: [{ type: 'paragraph', children: cardDescription(para.children.slice(1)) }],
    });
  }
  return { type: 'mdxJsxFlowElement', name: 'NextSteps', attributes: [], children: cards };
}

const isErrorAdmonition = (n) =>
  n.type === 'containerDirective' &&
  n.data && n.data.hName === 'admonition' &&
  /^Getting .*error/i.test((n.data.hProperties && n.data.hProperties.title) || '');

function errorAccordion(nodes) {
  const children = [{ type: 'mdxJsxFlowElement', name: 'summary', attributes: [], children: [{ type: 'text', value: 'Getting an error?' }] }];
  for (const n of nodes) {
    const title = n.data.hProperties.title.replace(/^Getting (an? )?/i, '').replace(/\?$/, '');
    children.push({
      type: 'paragraph',
      data: { hProperties: { className: 'tp-acc-item' } },
      children: [{ type: 'strong', children: [{ type: 'text', value: title.charAt(0).toUpperCase() + title.slice(1) }] }],
    });
    children.push(...n.children);
  }
  return { type: 'mdxJsxFlowElement', name: 'details', attributes: [], children };
}


// 4. API reference: every H2 section with an <EndpointBadge> becomes two columns
//    (text left, request + response right, sticky).
const cls = (c) => [attr('className', c)];
// request on top, response below: the rows share the height equally, each at most as high as its code
const grid = (children) => ({ type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-api-grid'), children });
function apiSections(tree) {
  const kids = tree.children;
  if (!kids.some((n) => n.type === 'mdxJsxFlowElement' && n.name === 'EndpointBadge')) return;
  const out = [];
  const panels = [];
  let i = 0;
  while (i < kids.length) {
    const n = kids[i];
    if (!(n.type === 'heading' && n.depth === 2)) { out.push(n); i++; continue; }
    let j = i + 1;
    while (j < kids.length && !(kids[j].type === 'heading' && kids[j].depth <= 2)) j++;
    const sec = kids.slice(i, j);
    const isBadge = (x) => x && x.type === 'mdxJsxFlowElement' && x.name === 'EndpointBadge';
    let b = sec.findIndex(isBadge);
    if (b < 0) { out.push(...sec); i = j; continue; }
    while (isBadge(sec[b + 1])) b++; // several URL bars in a row (list variants) belong to the head
    const titleOf = (x) => String((x.attributes || []).find((t) => t.name === 'title')?.value || '');
    const titled = (x, re) => (x.type === 'mdxJsxFlowElement' && x.name === 'ContextCodeBlock' && re.test(titleOf(x)))
      || (x.type === 'code' && new RegExp('title=["\']?' + re.source.replace('^', '')).test(x.meta || ''));
    const isReq = (x) => (x.type === 'mdxJsxFlowElement' && x.name === 'Tabs') || titled(x, /^Request/i);
    const req = sec.findIndex((x, k) => k > b && isReq(x));
    const res = sec.findIndex((x, k) => k > b && titled(x, /^Response/i));
    const ex = [req, res].filter((k) => k >= 0).sort((a, c) => a - c);
    // head = heading, intro and URL bar; below 1280 px the examples follow right after it (inline copy)
    const head = sec.filter((_, k) => k <= b);
    const main = sec.filter((_, k) => k > b && !ex.includes(k));
    const nr = String(panels.length);
    const exNodes = ex.map((k) => sec[k]);
    out.push({
      type: 'mdxJsxFlowElement', name: 'div', attributes: [...cls('tp-api-sec'), attr('data-sec', nr)],
      children: [
        { type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-api-head'), children: head },
        ...(exNodes.length ? [{ type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-api-ex'), children: [grid(exNodes)] }] : []),
        { type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-api-main'), children: main },
      ],
    });
    // >= 1280 px: one example column for the whole page (sticky, never moves); it shows the panel
    // of the endpoint in view (src/client/api-aside.js), like an endpoint page of the reference
    panels.push({
      type: 'mdxJsxFlowElement', name: 'div', attributes: [...cls('tp-api-panel'), attr('data-sec', nr)],
      children: exNodes.length ? [grid(structuredClone(exNodes))] : [],
    });
    i = j;
  }
  if (panels.length) {
    out.unshift({
      type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-api-aside'),
      children: [{ type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-api-stick'), children: panels }],
    });
  }
  tree.children = out;
}

module.exports = function remarkDocLayout() {
  return (tree) => {
    const kids = tree.children;
    let inStep = false;
    for (let i = 0; i < kids.length; i++) {
      const n = kids[i];
      if (n.type === 'heading' && n.depth === 2) {
        const t = text(n).trim();
        inStep = /^Step \d+/i.test(t);
        if (/^Next steps$/i.test(t)) {
          for (let j = i + 1; j < kids.length && kids[j].type !== 'heading'; j++) {
            if (kids[j].type === 'list' && !kids[j].ordered) {
              const grid = toCards(kids[j]);
              if (grid) kids[j] = grid;
              break;
            }
          }
        }
        continue;
      }
      if (inStep && n.type === 'list' && n.ordered) {
        n.data = n.data || {};
        n.data.hProperties = { ...(n.data.hProperties || {}), className: 'tp-steps' };
        inStep = false;
      }
      if (isErrorAdmonition(n)) {
        let j = i;
        while (j < kids.length && isErrorAdmonition(kids[j])) j++;
        kids.splice(i, j - i, errorAccordion(kids.slice(i, j)));
      }
    }
    const NAMES = { tip: 'Tip', note: 'Note', info: 'Info', caution: 'Caution', danger: 'Danger', warning: 'Warning', success: 'Success' };
    const titleAdmonitions = (n) => {
      if (n.type === 'containerDirective' && n.data && n.data.hName === 'admonition' && !n.data.hProperties.title && !(n.children[0] && n.children[0].type === 'mdxAdmonitionTitle')) {
        n.data.hProperties.title = NAMES[n.name] || n.name;
      }
      (n.children || []).forEach(titleAdmonitions);
    };
    titleAdmonitions(tree);
    apiSections(tree);
    // phones: "Copy page" sits below the lead text (first paragraph), like the reference
    const lead = tree.children.findIndex((c) => c.type === 'paragraph');
    tree.children.splice(lead + 1, 0, { type: 'mdxJsxFlowElement', name: 'CopyPageSlot', attributes: [], children: [] });
    // wide tables scroll inside their own box, never the page (Nörgler B1)
    const wrapTables = (n) => {
      if (!n.children) return;
      n.children = n.children.map((c) => (c.type === 'table'
        ? { type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-table'), children: [c] }
        : (wrapTables(c), c)));
    };
    wrapTables(tree);
    // videos sit in the same frame as screenshots (<MediaFrame>), like the reference;
    // they carry the same baked-in macOS title bar (28/1920), cropped like the screenshots
    const frameVideos = (n) => {
      if (!n.children) return;
      n.children = n.children.map((c) => (c.type === 'mdxJsxFlowElement' && c.name === 'video'
        ? { type: 'mdxJsxFlowElement', name: 'figure', attributes: cls('tp-frame'), children: [
          { type: 'mdxJsxFlowElement', name: 'div', attributes: cls('tp-frame__media tp-frame__media--crop'), children: [c] }] }
        : (frameVideos(c), c)));
    };
    frameVideos(tree);
    // code tabs: same language everywhere and remembered (groupId), like the reference
    const visit = (n) => {
      if (n.type === 'mdxJsxFlowElement' && n.name === 'Tabs' && !n.attributes.some((x) => x.name === 'groupId')) {
        n.attributes.push(attr('groupId', 'tp-code'));
      }
      (n.children || []).forEach(visit);
    };
    visit(tree);
  };
};
