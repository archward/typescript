# base/no-comments

📝 Disallow comments except tool directives; rationale belongs in commit messages, ADRs, or docs.

<!-- end auto-generated rule header -->

Disallow comments, with one exception: **tool directives**. Rationale belongs in commit messages, ADRs, or docs — not in the code, where it drifts out of sync with what it describes and is rarely read.

## What it allows

- **Tool directives** — `eslint*` / `eslint-disable*`, `global`, `globals`, `exported`, the TypeScript pragmas `@ts-expect-error`, `@ts-ignore`, `@ts-nocheck`, and triple-slash `/// <reference … />` directives. These are machine-read instructions, not prose.

## What it rejects

Everything else: line comments (`// note`), block comments (`/* note */`), all JSDoc (`/** @type {number} */`, `/** just prose */`), and the JS-only `@ts-check` pragma. The standard is TypeScript-native, so JSDoc typing and `@ts-check` are redundant — write real TypeScript types instead.

## Options

### `allow`

An array of regular-expression patterns, tested against each comment's trimmed text. A comment that matches any of them is allowed — an escape hatch for project conventions such as `TODO`/`FIXME` markers:

```js
'arch/base/no-comments': ['error', { allow: ['^TODO', '^FIXME'] }];
```

## Why

Comments are unversioned claims about code that no test enforces; they rot. A decision worth recording is an ADR; a rationale worth keeping is a commit message; everything else should be expressed in names and structure.

## Examples

```js
// validate the input        ← rejected (prose)
/* TODO: revisit */          ← rejected (prose)
/** the user id */           ← rejected (tag-less JSDoc)

// @ts-expect-error legacy   ← allowed (directive)
// @ts-check                 ← rejected (JS-only pragma)
/** @type {number} */        ← rejected (use a real TypeScript type)
```
