# 8. Author the plugin in TypeScript, built with tsup

Date: 2026-06-30

## Status

Accepted

## Context

The rules were authored in untyped `.mjs` and type-checked only at the config file. Phase 2 adds many rules that walk the TypeScript AST, where an untyped node graph is most error-prone. A long-term, public, contributor-facing plugin benefits from typed AST nodes, messages, and options, and from matching the wider typescript-eslint ecosystem.

## Decision

Author all source, test, script, and config files in strict TypeScript, with `strictTypeChecked` lint and strict compiler flags. Rules use `ESLintUtils.RuleCreator` for typed messages and options. The published package is built with tsup as bundled ESM plus declarations: `@eslint/markdown` is ESM-only, and a bundler is what lets us drop import extensions and resolve the `@eslint-plugin/*` alias. Vitest runs the tests, tsx runs the scripts, and jiti loads the flat config.

## Consequences

The package now ships compiled `dist/` instead of raw sources, and the toolchain lints its own code with typescript-eslint and sorts imports automatically. A build step now precedes lint, doc generation, and publish. Cross-package imports use real package names, not source aliases, so a package cannot reach past another's public exports. Because the standard is TypeScript-native, `no-comments` drops its JS-only `@ts-check` and JSDoc-type allowances.
