# 6. Neutralize package names for multiple backends

Date: 2026-06-27

## Status

Superseded by [ADR-0013](0013-adopt-the-archward-brand-and-per-language-package-names.md)

## Context

The domain and application layers — most of the rule set — are framework-agnostic by the dependency rule; only composition-root and presentation wiring is NestJS-specific. A `nestjs-ddd-*` name undersells that and blocks reuse across other JS/TS backends such as Express, Fastify, and Hono. Package names are the one expensive-to-reverse choice, and the project is still unpublished with zero consumers, so neutralizing now is free.

## Decision

Publish a scoped family under one org: `@ddd-arch/eslint-plugin`, `@ddd-arch/kernel`, and `@ddd-arch/nestjs`. The kernel stays framework-free; each backend ships as a separate package selected by a config preset (`configs.nestjs`), never a runtime flag. NestJS is the first preset and the thesis scope. `@ddd` is taken and would imply authority over DDD, so `@ddd-arch` is used — free, honest, and cohesive across both lint and runtime packages.

## Consequences

Rules group as `arch/domain/*` and `arch/application/*` (universal) versus `arch/nestjs/*` (wiring), so the framework seam is explicit and a new backend is a preset reusing the core, not a fork. The repository is renamed to `ddd-arch`. Cost: an npm org must be created before the first publish, and every reference to the old names is updated in one pass.
