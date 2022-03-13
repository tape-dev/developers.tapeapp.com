// https://docusaurus.io/docs/sidebar
module.exports = {
  mainSidebar: [
    {
      type: 'category',
      label: 'Tape Developer API',
      collapsed: false,
      items: ['api/api-reference', 'api/api-reference-new'],
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
      ],
    },
    'contribute',
  ],
};
