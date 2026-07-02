---
'@ddd-arch/eslint-plugin': minor
---

Add the `configs.architecture({ topology, sourceRoot })` preset factory. It requires a `topology` (`microservice` or `modular-monolith`) and takes an optional `sourceRoot` (defaults to `src`, must be non-blank), then resolves the per-layer globs — layers at the source root for a microservice, or one level under a bounded-context folder for a modular monolith. Invalid input throws at config-load time.
