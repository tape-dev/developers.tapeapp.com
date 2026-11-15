// Docs layout: one sidebar per tab in the header.
// Built from the original sidebar (sidebars.orig.js), so no page or URL changes.
const orig = require('./sidebars.orig.js');

const find = (items, label) => items.find((i) => typeof i === 'object' && i.label === label);
const api = find(orig.mainSidebar, 'Developer API').items;
const resources = find(api, 'Resources').items;
const automation = find(resources, 'Automation').items;
const mcp = find(orig.mainSidebar, 'MCP server').items;
const auto = find(orig.mainSidebar, 'Automations').items;
const guideAuto = find(orig.guidesSidebar, 'Automations').items;

// Level-1 group: grey heading, not collapsible
const group = (label, items) => ({
  type: 'category',
  label,
  collapsible: false,
  collapsed: false,
  className: 'sb-group',
  items,
});
// Missing ids are skipped, so the layout follows content changes in the release branch
const pick = (items, ids) => ids.map((id) => items.find((i) => i === id || i.label === id)).filter(Boolean);

// Like the reference: a category with an overview page opens it when clicked (and expands).
const withOverview = (items) => items.map((i) => {
  if (!i || typeof i !== 'object' || !i.items) return i;
  const out = { ...i, items: withOverview(i.items) };
  const first = out.items[0];
  if (!out.link && out.className !== 'sb-group' && typeof first === 'string' && /\/overview$/.test(first)) {
    out.link = { type: 'doc', id: first };
    out.items = out.items.slice(1);
  }
  return out;
});

const sidebars = {
  guides: [
    group('Tape API', [
      'guide/api/getting-started',
      'guide/api/coming-from-podio',
      'api/authentication',
      'api/personal-access-tokens',
      find(api, 'OAuth'),
      'guide/api/working-with-webhooks',
    ]),
    group('Tape MCP', mcp),
    group('Automation recipes', guideAuto),
    group('Resources', [
      'contribute',
      { type: 'link', label: 'Roadmap', href: 'https://get.tapeapp.com/roadmap/' },
      { type: 'link', label: 'Community', href: 'https://community.tapeapp.com' },
      { type: 'link', label: 'Calculation field', href: 'https://help.tapeapp.com/en/articles/18449157-calculation-syntax-examples' },
      { type: 'link', label: 'Help Center', href: 'https://help.tapeapp.com/' },
    ]),
  ],
  apiReference: [
    group('Tape API', [
      'api/introduction',
      'api/capabilities',
      'api/pagination',
      'api/versioning',
      'api/errors',
      'api/request-limits',
      'api/date-timezone',
    ]),
    group('Records', pick(resources, [
      'api/resource/search',
      'api/resource/record',
      'api/resource/filter',
      'Field value',
      'api/resource/record-comment',
      'api/resource/record-revision',
      'api/resource/record-permissions',
      'api/resource/record-follow',
    ])),
    group('Apps and views', pick(resources, ['api/resource/app', 'api/resource/view', 'Field'])),
    group('Organization', pick(resources, [
      'api/resource/workspace',
      'api/resource/organization',
      'api/resource/user',
    ])),
    group('Automation API', [
      ...automation,
      'api/resource/automation-run',
      'api/resource/automation-usage-report',
    ]),
    group('More', pick(resources, [
      'api/resource/webhook',
      'api/resource/file',
      'api/resource/icon',
      'api/resource/email',
    ])),
  ],
  automations: [
    group('Get started', pick(auto, [
      'automations/introduction',
      'automations/code-editor',
      'automations/execution-types',
    ])),
    group('Scripting', pick(auto, [
      'automations/libraries',
      'automations/date-timezone',
      'automations/limitations',
    ])),
    group('Troubleshooting', find(auto, 'Troubleshooting').items),
  ],
};

module.exports = Object.fromEntries(Object.entries(sidebars).map(([k, v]) => [k, withOverview(v)]));
