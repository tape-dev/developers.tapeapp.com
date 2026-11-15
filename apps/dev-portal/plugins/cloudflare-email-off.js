/**
 * Keeps Cloudflare from rewriting the email addresses in our pages.
 *
 * developers.tapeapp.com is proxied through Cloudflare. Its Email Address
 * Obfuscation replaces every address in an HTML response with
 * `[email protected]` plus a decode script. Browsers run the script, so readers
 * never notice, but crawlers, curl and AI fetch tools get `[email protected]`,
 * including inside the JSON request and response samples.
 *
 * Cloudflare leaves anything between `<!--email_off-->` and `<!--/email_off-->`
 * untouched, so this wraps every built HTML file in those markers. The fix
 * ships with the HTML itself: it needs no dashboard setting and no response
 * header, so it holds on any static host behind Cloudflare.
 *
 * The markers sit outside `#__docusaurus`, so React hydration never sees them.
 * This runs in postBuild, after HTML minification, so it does not depend on
 * the minifier keeping comments.
 */
const fs = require('fs/promises');
const path = require('path');

const OPEN = '<!--email_off-->';
const CLOSE = '<!--/email_off-->';

const wrap = (html, file) => {
  if (html.includes(OPEN)) return html;
  const open = html.match(/<html\b[^>]*>/i);
  const close = html.toLowerCase().lastIndexOf('</html>');
  if (!open || close === -1) {
    throw new Error(`cloudflare-email-off: no <html> element in ${file}`);
  }
  const afterOpen = open.index + open[0].length;
  return (
    html.slice(0, afterOpen) +
    OPEN +
    html.slice(afterOpen, close) +
    CLOSE +
    html.slice(close)
  );
};

module.exports = function cloudflareEmailOffPlugin() {
  return {
    name: 'cloudflare-email-off',
    async postBuild({ outDir }) {
      const files = (await fs.readdir(outDir, { recursive: true })).filter(
        (f) => f.endsWith('.html')
      );
      await Promise.all(
        files.map(async (rel) => {
          const file = path.join(outDir, rel);
          const html = await fs.readFile(file, 'utf8');
          const wrapped = wrap(html, rel);
          if (wrapped !== html) await fs.writeFile(file, wrapped);
        })
      );
    },
  };
};
