---
'@ddd-arch/eslint-plugin': minor
---

Author the plugin in strict TypeScript and build it with tsup. The published package now ships compiled ESM `dist/` with bundled type declarations instead of raw `.mjs` sources.

`base/no-comments` is now TypeScript-native: it no longer allows the JS-only `@ts-check` pragma or JSDoc `@type` annotations (write real TypeScript types instead). The `@ts-expect-error` / `@ts-ignore` / `@ts-nocheck` pragmas and triple-slash references are still allowed.
