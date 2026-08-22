# Tape Developers Portal — repository rules

Docusaurus 2 site. Markdown sources live in `apps/dev-portal/docs/`; the compiled
site is committed to the repo-root `docs/` folder, which GitHub Pages serves.

## MANDATORY: internal doc links must be absolute

Every link from one docs page to another **must** use an absolute path starting
with `/docs/`.

```md
<!-- REQUIRED -->
[Connect to Tape MCP](/docs/mcp/connect)
[Rate limits](/docs/api/request-limits#rate-limits)

<!-- FORBIDDEN — silently breaks in production -->
[Connect to Tape MCP](connect)
[Rate limits](request-limits#rate-limits)
```

### Why this is mandatory

Relative link targets are **copied verbatim into the client JavaScript bundle**.
They are not resolved to permalinks at build time. At runtime React Router
resolves them against `location`, and on production `location` frequently carries
a trailing slash:

1. `trailingSlash` is not set, so Docusaurus emits pages as
   `docs/mcp/overview/index.html` but links to them as `/docs/mcp/overview`.
2. Serving a directory, GitHub Pages **301-redirects to the trailing-slash form**.
   So any reload, bookmark, or shared link puts `/docs/mcp/overview/` in the URL bar.
3. Relative resolution then walks one level too deep:

   | `location` | link target | resolves to |
   |---|---|---|
   | `/docs/mcp/overview`  | `connect` | `/docs/mcp/connect` ✅ |
   | `/docs/mcp/overview/` | `connect` | `/docs/mcp/overview/connect` ❌ |

The result is a **Page Not Found with no console error and no build warning**.
It only reproduces after a refresh, and never on `npm run start` — the dev server
serves routes directly and issues no redirect. That combination makes it very
easy to ship and very hard to notice.

Absolute paths are immune: React Router pushes them as-is, so the URL shape of
the current page is irrelevant.

### Scope and exemptions

- Applies to links between docs pages, including anchors (`/docs/api/errors#codes`).
- External links (`https://…`), `mailto:`, and same-page anchors (`#section`) are unaffected.
- **Never rewrite anything inside fenced code blocks.**
- **Never rewrite Tape calculation formula syntax** — `@[Title](field_123)` looks like a
  markdown link but is not one. It is identified by the leading `@`.

### Verifying

`onBrokenLinks: 'throw'` in `apps/dev-portal/docusaurus.config.js` fails the build
on an absolute path that points nowhere, so `npm run build` validates these links.
It cannot validate relative ones — another reason they are forbidden.

To find violations, run the checker — it exits non-zero and lists every offender:

```shell
npm run check-links
```

It skips fenced code blocks and `@[...](...)` formula syntax, so a clean run means
there are genuinely no relative links. Source: `tools/check-doc-links.js`.

## Build and deploy

- `npm run start` — dev server on :3100. Note it does **not** reproduce the
  trailing-slash behaviour described above; only a real build does.
- `npm run build` — compiles into the repo-root `docs/` folder.
- `npm run publish` — builds, rewrites `docs/CNAME`, and runs `git add .`.
  There is no CI; deploying means committing the built output and pushing to `main`.
- Because the build output is committed, every deploy replaces the hashed JS
  chunks and deletes the previous ones. Pages and assets are served with
  `max-age=600`, so for roughly ten minutes after a push a client running the
  previous build can 404 on its chunks. Avoid rapid successive deploys.
