// https://docusaurus.io/docs/sidebar
module.exports = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Developer API',
      collapsed: false,
      items: [
        'api/api-reference',
        'api/pagination',
        'api/files',
        'api/rate-limiting',
        'api/date-timezone',
        'api/errors',
      ],
    },
    {
      type: 'category',
      label: 'Calculation Field',
      collapsed: false,
      items: [
        'calculation/intro',
        'calculation/libraries',
        'calculation/markdown',
        'calculation/html',
        {
          type: 'category',
          label: 'Components',
          collapsed: true,
          items: ['calculation/component/link', 'calculation/component/button'],
        },
      ],
    },
    'contribute',
  ],
  guidesSidebar: [
    {
      type: 'doc',
      label: 'Getting Started',
      id: 'guide/getting-started',
    },
  ],
};
