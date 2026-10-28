---
status: proposed
date: 2026-10-27
decision-makers: ReeseArch64
---

# ADR-0015: Adopt measured per-application build selection

## Current applicability

The project owner requested removal of the compiler evaluation infrastructure,
its artifact CI workflow and the dependent standalone mutation harnesses. They
are no longer maintained or available for reproduction in the current tree.
The historical measurements remain in Git history; do not recreate the removed
infrastructure from this proposal. Its status remains proposed, not accepted.
The formatting policy in ADR-0014 and the maintained application builds are unchanged.

The implementation plan and checked evidence below describe the original evaluation,
not current CI coverage or authorization to restore it.

## Context and Problem Statement

[Issue #551](https://github.com/ReeseArch64/opencok/issues/551) asks whether another
TypeScript pipeline improves the current application builds. The maintainer permits
different tools for different applications and confirmed a minimum 20% improvement
in time or memory, with separate semantic checking and unchanged runtime boundaries.
The original report supplied no latency or memory regression reproduction.

API, Chat and realm builds bundle ESM for their existing Bun adapters. Web builds
HTML, CSS and images as well as TypeScript. Libraries expose workspace source;
there is no declaration publishing requirement. Bun's mutation-test plugins are a
separate pipeline. A faster transformer alone cannot replace these outputs.

The pilot found a reproducible correctness limitation: Bun could embed the source
`__dirname` in environment loading, so a relocated bundle found the build workspace
instead of its deployment workspace. Using the executing ESM module URL fixes this
without selecting another runtime or rewriting gameplay.

## Decision

Retain the maintained Bun 1.4.2 CLI build for API, Chat, server and web. Evaluate
each application separately when reconsidering this choice. The original measured
evidence, failures and limitations are retained in Git history.
This is a recommendation pending human acceptance; no new production runtime is
selected. [ADR-0009](0009-adopt-bun-for-development.md) and
[ADR-0011](0011-adopt-typescript-for-application-code.md) remain active, while the
Node mandate in [ADR-0010](0010-adopt-nodejs-for-production.md) remains deprecated.

A replacement must improve median wall time or sampled process-tree peak resident
memory by at least 20% over the same application's baseline across at least five
measured runs. Report the other metric, artifact sizes and spread, and explain any
tradeoff. Correctness, useful diagnostic source maps, runtime assets, environment
isolation, semantic checking and mutation instrumentation are mandatory. Faster
emit with a failed compatibility check does not qualify. These gates apply per
application; backend and browser tooling need not match.

Keep application `build` commands, runtime/container instructions and workspace
exports unchanged. Retain TypeScript `tsc --noEmit` separately, using the existing
`check-types` commands and web's `check:types`. Keep production bundles minified
without public maps and create unminified linked maps only in the diagnostic pilot.
Do not introduce bytecode, a package manager change, native-client repackaging,
resource changes, a database migration or a production deployment through this ADR.

## Consequences

- Build selection has repeatable measurements and executable rejection criteria;
  it can change per app when a compatible pipeline demonstrates the required gain.
- Retaining Bun avoids replacing native HTML handling or the `onLoad` mutation API.
  It does not claim universal speed superiority or fix unrelated gameplay/DB issues.
- Seven pinned development packages support candidate reproduction and increase
  development installation size. Production-only dependency installs omit them;
  retain frozen installs and the single root lockfile.
- Process-tree memory sampling and a shared workstation limit precision. Repeat
  measurements on release hardware when workloads, compiler versions or deployment
  requirements change. Docker size/startup and native client certification remain
  release concerns, not conclusions inferred from JS bytes.

## Implementation Plan

- **Original scope**: root `package.json` and `bun.lock`,
  `packages/env/src/load.ts`, `packages/env/tests/load.test.ts`, the environment
  guide and the now-removed evaluation scripts, artifact CI workflow and
  standalone mutation harnesses.
- **Dependencies**: Keep Bun 1.4.2 and TypeScript 7.0.2. Pin evaluation-only
  `esbuild@0.28.2`, `rolldown@1.2.15`, `rollup@4.65.1`, `@swc/core@1.16.20`,
  `@rollup/plugin-node-resolve@16.0.3`, `@rollup/plugin-commonjs@29.0.3` and
  `@rollup/plugin-json@6.1.0` as root development dependencies. Preserve inherited
  dependencies required by existing tools rather than upgrading their consumers.
- **Patterns to follow**: Preserve current ESM source exports, runtime adapters,
  injected synthetic test collaborators and the root `.env` policy. Resolve the
  environment from the executing module URL, and test moved bundles independently
  of the original workspace and current working directory.
  Use the shared synthetic mutation workspace manifest/dependency fixture for
  temporary emitted tests; it must not read the original workspace's `.env`.
  Build browser fixtures in an empty temporary copy of maintained source with
  committed synthetic images. Prepared local artwork remains ignored and must
  not become a CI dependency or be overwritten by fixture generation.
- **Patterns to avoid**: No arbitrary secret definitions, private fixtures,
  unminified-versus-minified rankings, counting SWC/Rollup or Oxc/Rolldown as
  independent wins, or weakening checks to qualify a candidate.
- **Configuration**: Add an artifact CI quality gate with the existing frozen
  toolchain, individual workspace type checks, emitted backend/web checks and
  mutation verification. Do not gate CI on machine-dependent benchmark timings.
- **Delivery and rollback**: Ship the environment correction, evaluation/decision
  and CI integration as separate stacked PRs linked to #551. Existing build
  commands and images remain the fallback; reverting evaluation/CI wiring needs
  no player-data rollback. A later compiler migration needs new measured evidence
  and reviewed changes to build stages and deployment contents.

### Verification

- [x] Reproduction records source commit, lock hash, tool versions, host, five runs,
      median/spread, memory and JS/map/asset sizes for each measured scenario.
- [x] All seven requested candidates have measured roles or explicit non-equivalence.
- [x] Relocated minified and diagnostic ESM fixtures read only the deployed root
      environment, retain process precedence and tolerate an absent file.
- [x] Emitted backend suites pass login/init, HTTP/WebSocket, city/map, numeric and
      protocol checks with synthetic state; emitted real entrypoints reject missing
      configuration without consulting the original workspace.
- [x] An intentional diagnostic failure identifies its TypeScript source line;
      transpilation accepts a deliberate type error while the semantic gate rejects it.
- [x] Built HTML/CSS/JS/assets finish the synthetic loading/health flow, and the
      server's default `dist/data/badwords.json` path resolves.
- [x] Auth and Chat mutation harnesses kill their expected mutations through Bun's
      existing `onLoad` API; affected type/tests, lint and formatting checks pass.

## Alternatives Considered

- **esbuild**: A complete backend bundler and an explicit HTML/CSS frontend adapter
  are measured. Runtime source-map compatibility remains an independent gate;
  emitting a `.map` file alone is insufficient evidence.
- **Rolldown with Oxc**: Measures the integrated TypeScript transformer/minifier.
  Raw HTML entry handling and the existing JSON surrogate fixture are executable
  compatibility probes; standalone Oxc components do not constitute another bundler.
- **Rollup with SWC**: Measures the full resolution/CommonJS/JSON/transform/minify
  pipeline on API. Dynamic import initialization must preserve existing behavior.
  SWC's standalone bundler is discouraged upstream; transformer-only timing is
  not compared with complete application packaging.
- **TypeScript emit**: Retain semantic checking, but exclude unbundled emit from
  optimized-bundle rankings. Source package exports, runtime imports and HTML/assets
  still require a packaging stage. No declaration emitter is required by these apps.

## More Information

The original protocol, references and report are retained in Git history rather
than the current tree. They describe evaluation settings, retained OS caches,
sampled memory and frontend exceptions, separating compiler measurements from
installation, type checking, container transfer/startup and deployment size.

These checked verification items describe historical synthetic checks, not current
CI coverage, human acceptance or deployment.

Revisit when a measured app exceeds its agreed build budget, a candidate fixes the
observed compatibility failures, the entry graph changes materially, or a separately
accepted production-runtime decision changes the target. Human review of this
record does not certify an untested client track or a live release.
