# 9. Configure layer boundaries by topology and source root

Date: 2026-07-02

## Status

Accepted

## Context

The layer and boundary rules must know where each layer folder lives, and backends differ. A single bounded-context service places `domain`, `application`, `infrastructure`, and `presentation` at the source root; a modular monolith nests them one level under a per-context folder. An any-depth glob conflates the two and lets a misplaced folder escape every check. The source folder is `src` by convention, but not always. This placement sits upstream of every layer rule, so it must be declared once and explicitly, never guessed.

## Decision

The architecture preset is a factory, `configs.architecture({ topology, sourceRoot })`. `topology` is required: `microservice` puts layers at the source root (`src/domain/**`), `modular-monolith` nests them one level under a bounded-context folder (`src/*/domain/**`). `sourceRoot` is optional, defaults to `src`, and when supplied must be a non-empty, non-whitespace string. Both fix the context depth and never use `**`. The factory throws at config load on a missing or unknown topology or a blank sourceRoot, so a wrong layout fails loudly instead of silently matching nothing.

## Consequences

Every layer and boundary rule derives placement from this one preset, so a consumer declares topology once per package. Monorepos need no special support: each backend package carries its own config and topology, and non-backend packages are simply not linted. The standard prescribes layers as folders under the source root; layouts where each layer is its own package, as in some Nx setups, are out of scope. Omitting the preset, or passing a bad topology or sourceRoot, is a config-load error, not a silent pass.
