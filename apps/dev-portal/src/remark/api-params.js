/**
 * API reference pages: parameter tables become field lists (name, pills, description),
 * like an endpoint page of the reference docs. The Markdown stays unchanged.
 *
 * Applies to every table on a page with an <EndpointBadge>. Recognised columns:
 *   Type -> grey pill, Required (yes) -> red "required" pill, "Where it goes" / In / Location -> grey pill,
 *   Description (or Meaning, Effect, ...) -> text below the name, any other column -> "Label value" line.
 * A row whose name starts with the name of an earlier row plus "." or "[]" is a child attribute and goes
 * into a collapsible "Show child attributes" box under that row.
 * The original table stays in the HTML (class tp-md-only, not shown) for "Copy page" and llms.txt.
 */

const attr = (name, value) => ({ type: 'mdxJsxAttribute', name, value });
const el = (name, className, children, extra = []) => ({
  type: 'mdxJsxFlowElement', name, attributes: [attr('className', className), ...extra], children,
});
const span = (className, children) => ({ type: 'mdxJsxTextElement', name: 'span', attributes: [attr('className', className)], children });
const para = (className, children) => ({ type: 'paragraph', data: { hProperties: { className } }, children });

const text = (n) => (n.value != null ? n.value : (n.children || []).map(text).join(''));
const clean = (s) => s.replace(/`/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
// code in names and pills: plain text (the field name and the pills are set in mono anyway)
const uncode = (nodes) => nodes.map((n) => (n.type === 'inlineCode' ? { type: 'text', value: n.value }
  : n.children ? { ...n, children: uncode(n.children) } : n));
const empty = (cell) => !cell || /^\s*(|-|–|—)\s*$/.test(text(cell));

const DESC = /^(description|meaning|effect|what it is|what it covers|orders by|filters on|notes?)$/;
const PLACE = /^(where it goes|in|location)$/;

function roles(header) {
  const h = header.map((c) => clean(text(c)));
  let desc = h.findIndex((x, i) => i > 0 && DESC.test(x));
  // no description column: two columns -> the second one; with a Type column -> the last one;
  // otherwise (a matrix) every column is a "Label value" line
  if (desc < 0) desc = h.length === 2 ? 1 : h.includes('type') ? h.length - 1 : -1;
  return h.map((x, i) => (i === 0 ? 'name' : i === desc ? 'desc' : x === 'type' ? 'type' : x === 'required' ? 'req' : PLACE.test(x) ? 'pill' : 'meta'));
}

// every table with a header and at least two columns (an API page has no room for tables)
const isParamTable = (table) => table.children.length > 1 && table.children[0].children.length >= 2;

// the name is code (parameter, property, value): mono, code marks dropped; otherwise plain text
const startsWithCode = (cell) => {
  const first = cell.children.find((n) => !(n.type === 'text' && !n.value.trim()));
  return first && (first.type === 'inlineCode' || (first.type === 'link' && first.children[0] && first.children[0].type === 'inlineCode'));
};

function field(row, role, header) {
  const cells = row.children;
  const head = [startsWithCode(cells[0])
    ? span('tp-param__name', uncode(cells[0].children))
    : span('tp-param__name tp-param__name--text', cells[0].children)];
  const pills = [];
  const body = [];
  const metas = [];
  cells.forEach((c, i) => {
    if (i === 0 || empty(c)) return;
    const r = role[i];
    if (r === 'type' || r === 'pill') pills.push(span('tp-param__pill', uncode(c.children)));
    else if (r === 'req') {
      const v = text(c).trim();
      if (/^yes/i.test(v)) pills.push(span('tp-param__pill tp-param__pill--req', [{ type: 'text', value: 'required' + (v.includes('*') ? '*' : '') }]));
      else if (!/^no$/i.test(v)) pills.push(span('tp-param__pill', uncode(c.children)));
    } else if (r === 'desc') body.push(para('tp-param__text', c.children));
    else metas.push(para('tp-param__meta', [span('tp-param__label', [{ type: 'text', value: text(header[i]).trim() }]), { type: 'text', value: ' ' }, ...c.children]));
  });
  if (pills.length) head.push(span('tp-param__pills', pills));
  const kids = [para('tp-param__head', head)];
  if (body.length || metas.length) kids.push(el('div', 'tp-param__desc', [...body, ...metas]));
  return { node: el('div', 'tp-param', kids), name: text(cells[0]).replace(/`/g, '').trim() };
}

function toFieldList(table) {
  const header = table.children[0].children;
  const role = roles(header);
  const top = [];
  const all = [];
  for (const row of table.children.slice(1)) {
    if (!row.children.length) continue;
    const f = field(row, role, header);
    f.kids = [];
    // parent = longest earlier name that this name extends with "." or "[]"
    const parent = all
      .filter((p) => p.name && (f.name.startsWith(p.name + '.') || f.name.startsWith(p.name + '[]')))
      .sort((a, b) => b.name.length - a.name.length)[0];
    (parent ? parent.kids : top).push(f);
    all.push(f);
  }
  const build = (list) => el('div', 'tp-params', list.map((f) => {
    if (f.kids.length) f.node.children.push({ type: 'mdxJsxFlowElement', name: 'ParamKids', attributes: [], children: [build(f.kids)] });
    return f.node;
  }));
  return [build(top), el('div', 'tp-md-only', [table], [attr('hidden', null)])];
}

module.exports = function remarkApiParams() {
  return (tree) => {
    if (!tree.children.some((n) => n.type === 'mdxJsxFlowElement' && n.name === 'EndpointBadge')) return;
    const walk = (n) => {
      if (!n.children) return;
      const out = [];
      for (const c of n.children) {
        if (c.type === 'table' && isParamTable(c)) out.push(...toFieldList(c));
        else { walk(c); out.push(c); }
      }
      n.children = out;
    };
    walk(tree);
  };
};
