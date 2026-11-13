/**
 * Markdown preprocessor (`markdown.preprocessor` in docusaurus.config.js).
 *
 * Keeps the indentation of multi-line template literals in JSX expressions,
 * i.e. the code passed to <ContextCodeBlock>:
 *
 *   <ContextCodeBlock language="shell">
 *   {`curl #BASE_URL/v1/record/#RECORD_ID \\
 *     -u #USER_API_KEY:`}
 *   </ContextCodeBlock>
 *
 * MDX 3 strips up to two leading spaces from every continuation line of an
 * expression (a fixed line prefix in micromark-factory-mdx-expression), which
 * shifts every line after the first one to the left: `-u` above would lose
 * its indent, and JSON bodies would lose one nesting level. Adding two spaces
 * to those lines before MDX parses the file cancels that out exactly, so doc
 * sources keep natural indentation and the rendered code matches them.
 *
 * Only expressions whose `{` opens a line are touched, and fenced code blocks
 * are left alone. Line numbers are unchanged.
 */

const FENCE_OPEN = /^[ \t]*(`{3,}|~{3,})/;
const TEMPLATE_LITERAL_EXPRESSION = /^[ \t]*\{\s*`(?:[^`\\]|\\[\s\S])*`\s*\}/gm;
const MDX_EXPRESSION_LINE_PREFIX = '  ';

/** Split content into fenced code blocks and everything else, losslessly. */
function splitByFences(content) {
  const segments = [];
  let lines = [];
  let fence = null;

  const flush = (fenced) => {
    if (lines.length) segments.push({ text: lines.join('\n'), fenced });
    lines = [];
  };

  for (const line of content.split('\n')) {
    if (fence) {
      lines.push(line);
      if (fence.test(line)) {
        flush(true);
        fence = null;
      }
      continue;
    }
    const open = line.match(FENCE_OPEN);
    if (open) {
      flush(false);
      const marker = open[1];
      fence = new RegExp(`^[ \\t]*\\${marker[0]}{${marker.length},}[ \\t]*$`);
    }
    lines.push(line);
  }
  flush(Boolean(fence));
  return segments;
}

function preserveExpressionIndentation(content) {
  return splitByFences(content)
    .map(({ text, fenced }) =>
      fenced
        ? text
        : text.replace(TEMPLATE_LITERAL_EXPRESSION, (expression) =>
            expression.replace(/\n/g, `\n${MDX_EXPRESSION_LINE_PREFIX}`)
          )
    )
    .join('\n');
}

module.exports = { preserveExpressionIndentation };
