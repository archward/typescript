# 14. One plugin per language with architectures as composed config

Date: 2026-07-17

## Status

Accepted

## Context

ADR-0013 chose per-architecture package names (`@archward/ddd-eslint-plugin`) and implied one repository per architecture. But a senior-architect consultation ruled that clean, onion, and hexagonal are one dependency rule, and that DDD, CQRS, and events compose rather than rival it (the Explicit Architecture synthesis). Per-architecture packages would duplicate a large shared core and force the false either/or the standard exists to remove. The per-language axis is real — a linter is toolchain-bound — the per-architecture axis is not.

## Decision

One ESLint plugin per language, with architectures expressed as composed configuration, not separate packages. Drop the architecture prefix: `@archward/ddd-eslint-plugin` → `@archward/eslint-plugin`, `@archward/ddd-kernel` → `@archward/kernel`, `@archward/ddd-nestjs` → `@archward/nestjs`; `@archward/cli` is unchanged. The repository becomes `archward/typescript`. A fresh version line continues at 0.7.0 and the old `@archward/ddd-*` packages are deprecated with a pointer forward.

## Consequences

Adding an architecture becomes a config feature, not a package or repository, and the shared engine (default-deny, boundaries, layout, release tooling) is maintained once. Cost: a second rename soon after the archward rebrand — but consumers are ≈ 0 today and the name encoded the axis this abolishes, so it is cheapest now (ADR-0006's logic). npm has no rename, so migration is via deprecation and 0.6.1 stays on the old name. Deferred to follow-up ADRs: the primitive kit, the Projection Rule, presets, and the README rework. Supersedes ADR-0013's per-architecture package scheme.
