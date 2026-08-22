#!/usr/bin/env node
/**
 * Fails if any docs page links to another docs page with a relative path.
 *
 * Relative link targets are copied verbatim into the client bundle and are
 * resolved against `location` at runtime. Because GitHub Pages 301-redirects
 * directory URLs to their trailing-slash form, a reloaded page resolves them
 * one level too deep and lands on "Page Not Found" — with no build warning and
 * no console error. See CLAUDE.md.
 *
 * Skips fenced code blocks and Tape calculation formula syntax, e.g.
 * `@[Title](field_123)`, which is not a markdown link.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'apps', 'dev-portal', 'docs');

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? walk(p) : /\.mdx?$/.test(e.name) ? [p] : [];
  });

const violations = [];

for (const file of walk(ROOT)) {
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let fenced = false;

  lines.forEach((line, i) => {
    if (line.trim().startsWith('```')) {
      fenced = !fenced;
      return;
    }
    if (fenced) return;

    for (const m of line.matchAll(/(.?)\[([^\][]*)\]\(([^)\s]+)\)/g)) {
      const [, prev, , target] = m;
      if (prev === '@') continue; // Tape formula syntax, not a link
      if (/^(https?:|mailto:|tel:|#|\/)/.test(target)) continue;
      if (/^[a-z][a-z0-9+.-]*:/.test(target)) continue;
      violations.push({
        file: path.relative(process.cwd(), file),
        line: i + 1,
        target,
      });
    }
  });
}

if (violations.length) {
  console.error(
    `\n${violations.length} relative doc link(s) found. Use absolute paths starting with /docs/ — see CLAUDE.md.\n`
  );
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ](${v.target})`);
  }
  console.error('');
  process.exit(1);
}

console.log('All docs links are absolute.');
