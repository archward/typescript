# 13. Adopt the archward brand and per-language package names

Date: 2026-07-10

## Status

Superseded by [ADR-0014](0014-one-plugin-per-language-with-architectures-as-composed-config.md)

## Context

ADR-0006 chose the scope `@ddd-arch` under one organization, framed around TypeScript and NestJS. But the standard generalizes on two orthogonal axes — architecture style (DDD, hexagonal, layered) and implementation language (TypeScript, Python, Go, .NET). A DDD-specific brand cannot umbrella that, and a growing family needs a neutral name plus a scheme that encodes both axes. npm forbids renaming an organization or a published package, so the move is a fresh scope with the old one deprecated, not an in-place rename.

## Decision

The umbrella brand and organization is `archward` (architecture + ward, to guard) — free on GitHub, npm, PyPI, and crates. Packages are scoped `@archward/<architecture>-<artifact>` (e.g. `@archward/ddd-eslint-plugin`, `@archward/ddd-cli`): the architecture is the prefix, the language is implied by the registry. The TypeScript implementation lives in `archward/ddd-typescript`; other languages get sibling repositories conforming to a shared, language-neutral spec. The old `@ddd-arch/*` packages are deprecated with a pointer forward, and a fresh version line starts under the new scope.

## Consequences

One brand spans every architecture and language without implying authority over DDD, and adding a language or an architecture is a new repository or package following the scheme, not a fork. Cost: npm has no rename, so consumers migrate via deprecation notices and the versions already published stay on `@ddd-arch/*` (not transportable to the new names). Cross-repository ADR consistency — implementation ADRs citing a pinned spec version — is deferred until the second language repository exists. Supersedes ADR-0006.
