# Tape Developers

Welcome to the Tape Developers portal repository. It contains everything needed for the Tape Developer Portal: https://developers.tapeapp.com/.

## Getting Started

Execute the following commands to get a local version of the developer portal up and running:

```shell
# Clone the repository
git clone git@github.com:tape-dev/developers.tapeapp.com.git

# Navigate into the newly created folder
cd developers.tapeapp.com

# Install NPM dependencies
npm install

# Start the documentation webserver
npm run start

# Publish the documentation
npm run publish

```

## Writing documentation

Links between docs pages **must be absolute** (`/docs/api/errors`), never relative
(`errors`). Relative links are baked into the client bundle unresolved and break
on any page reload, because GitHub Pages redirects to a trailing-slash URL and the
router then resolves them one level too deep. The failure is silent — no build
warning, no console error, and it never reproduces on the dev server.

See [CLAUDE.md](CLAUDE.md) for the full rule and rationale.
