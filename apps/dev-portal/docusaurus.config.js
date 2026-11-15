const { themes } = require('prism-react-renderer');
const { preserveExpressionIndentation } = require('./mdx-preprocessor');

module.exports = {
  // TP_OFFLINE=1: hash router, so the built site opens by double-click (file://)
  ...(process.env.TP_OFFLINE ? { future: { experimental_router: 'hash' } } : {}),
  title: 'Tape Developers',
  tagline: 'Connect, simplify, and automate your work using Tape.',
  url: 'https://developers.tapeapp.com',
  baseUrl: '/',
  staticDirectories: ['static'],
  onBrokenLinks: 'throw',
  markdown: {
    // Undo MDX 3's indent stripping in <ContextCodeBlock> code, see the module
    preprocessor: ({ fileContent }) =>
      preserveExpressionIndentation(fileContent),
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },
  favicon: 'img/favicon.svg',
  organizationName: 'tape',
  projectName: 'developers.tapeapp.com',
  customFields: {
    runtime: process.env.runtime ?? '',
    search: process.env.TP_SEARCH ?? 'own',
  },
  themeConfig: {
    navbar: {
      title: 'Developer Docs',
      logo: { alt: 'Tape', src: 'img/logo.svg' },
      items: [
        { type: 'docSidebar', sidebarId: 'guides', label: 'Guides', position: 'left' },
        { type: 'docSidebar', sidebarId: 'apiReference', label: 'API Reference', position: 'left' },
        { type: 'docSidebar', sidebarId: 'automations', label: 'Automations', position: 'left' },
        { href: 'https://community.tapeapp.com', label: 'Community', position: 'right', className: 'tp-nav-ghost' },
        { href: 'https://tapeapp.com', label: 'Go to Tape', position: 'right', className: 'tp-nav-primary' },
      ],
    },
    // Footer is rendered by src/theme/DocItem/Footer inside the content column
    footer: { style: 'light', links: [] },
    docs: { sidebar: { hideable: false, autoCollapseCategories: false } },
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    // Light and dark like the reference: follows the system, switch in the header
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      // prism-react-renderer v2 no longer bundles bash (incl. `shell`) or toml
      additionalLanguages: ['php', 'http', 'bash', 'toml'],
      // Alternatives: themes.vsDark, themes.vsLight, themes.duotoneLight
      theme: require('./src/prism/tape-light.js'),
      darkTheme: require('./src/prism/tape-dark.js'),
    },
  },
  plugins: [require.resolve('./src/plugins/search-index.js'), require.resolve('./src/plugins/markdown-pages.js'), require.resolve('./src/plugins/breakpoint-1024.js'),
    // Opt every page out of Cloudflare's email obfuscation (from main d5061f83)
    './plugins/cloudflare-email-off'],
  // Local full-text index (search-index.json), shown in our own search dialog (src/components/layout/fulltext.js).
  // TP_SEARCH=easyops shows the plugin's own search bar instead (test only). Not in the offline build (file:// cannot fetch).
  themes: !process.env.TP_OFFLINE ? [[require.resolve('@easyops-cn/docusaurus-search-local'), {
    hashed: true, indexDocs: true, indexBlog: false, indexPages: false, docsRouteBasePath: '/docs',
    language: ['en'], searchBarShortcutKeymap: 'mod+k', highlightSearchTermsOnTargetPage: true,
    explicitSearchResultPath: true, ignoreCssSelectors: ['.tp-api-aside', '.tp-md-only'], searchResultLimits: 10, searchResultContextMaxLength: 60,
  }]] : [],
  clientModules: [require.resolve('./src/client/fonts.js'), require.resolve('./src/client/behaviour.js'), require.resolve('./src/client/zoom.js'), require.resolve('./src/client/api-aside.js')],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          remarkPlugins: [require('./src/remark/api-params'), require('./src/remark/doc-layout')],
        },
        blog: false,
        theme: {
          customCss: [
            require.resolve('./src/css/custom.css'),
            require.resolve('./src/css/layout.css'),
            require.resolve('./src/css/medien.css'),
            require.resolve('./src/css/menue.css'),
            require.resolve('./src/css/api.css'),
          ],
        },
      },
    ],
  ],
};
