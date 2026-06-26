# Changesets

This folder is managed by [`@changesets/cli`](https://github.com/changesets/changesets). Every change to a published package adds a markdown changeset here declaring the affected packages, the bump type, and a one-line summary.

- Add one for your change: `pnpm changeset` (pick packages + major/minor/patch + summary).
- Release (CI or local): `pnpm version` consumes the changesets — bumps each package independently and writes its `CHANGELOG.md`; `pnpm release` publishes.

Packages are versioned **independently**. The private workspace root is ignored (never versioned or published).
