// https://docusaurus.io/docs/sidebar
module.exports = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Developer API',
      collapsed: true,
      items: [
        'api/introduction',
        'api/authentication',
        'api/pagination',
        'api/versioning',
        'api/errors',
        'api/rate-limiting',
        'api/date-timezone',
        {
          type: 'category',
          label: 'Resources',
          collapsed: false,
          items: [
            'api/resource/record',
            'api/resource/app',
            'api/resource/workspace',
            'api/resource/files',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Calculation Field',
      collapsed: true,
      items: [
        'calculation/intro',
        'calculation/libraries',
        'calculation/markdown',
        'calculation/html',
        {
          type: 'category',
          label: 'Components',
          collapsed: false,
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
