// Mobile layout below 1024 px like the reference (Docusaurus default: below 997 px).
// JS: replace the hard-coded breakpoint in useWindowSize. CSS: rewrite every 996/997 px media query (Infima, theme, own CSS).
const path = require('path');

const rewrite = () => ({
  postcssPlugin: 'tp-breakpoint-1024',
  AtRule: {
    media(at) {
      at.params = at.params.replace(/\b996(\.\d+)?px\b/g, '1023px').replace(/\b997px\b/g, '1024px');
    },
  },
});
rewrite.postcss = true;

module.exports = function breakpoint1024() {
  return {
    name: 'tp-breakpoint-1024',
    configurePostCss(options) {
      options.plugins.push(rewrite);
      return options;
    },
    configureWebpack(config, isServer, utils, content) {
      const webpack = require('webpack');
      return {
        plugins: [
          new webpack.NormalModuleReplacementPlugin(/hooks[\\/]useWindowSize(\.js)?$/, (res) => {
            if (/@docusaurus[\\/]theme-common/.test(res.context || '') || /theme-common/.test(res.request || '')) {
              res.request = path.resolve(__dirname, '../breakpoint/useWindowSize.js');
            }
          }),
        ],
      };
    },
  };
};
