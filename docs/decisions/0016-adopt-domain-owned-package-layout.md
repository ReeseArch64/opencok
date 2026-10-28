---
status: accepted
date: 2026-10-27
decision-makers: ReeseArch64
---

# ADR-0016: Adopt domain-owned package layout

## Context and Problem Statement

Issue [#558](https://github.com/ReeseArch64/opencok/issues/558) identifies gameplay
implementations distributed across horizontal service, repository, contract, rule,
validation and mapping packages. Hero and Dragon already demonstrate parts of a
domain-owned model, but broad dependencies can point back into those domains.
Copying their directory layout without controlling dependencies would preserve
cycles. Empty workspace names also obscured ownership; the maintainer clarified
them in [package responsibilities](../../packages/README.md).

The maintainer confirmed this decision during #558 implementation.
Acceptance does not imply completed migration. This record governs source
organization and migration constraints, not deployment or game authority.

## Decision

Keep workspaces flat at `apps/*` and `packages/*`. Applications own composition,
transport attachment, resources and lifecycle. Move existing gameplay vertical
slices into cohesive medium-sized domain packages, following the confirmed names
in `packages/README.md`. Domain ownership does not require a separate process.

Within a package's `src`, use only responsibility directories that contain real
implementation: `domain`, `contracts`, `dtos`, `rules`, `services`, `validations`,
`mappings`, `controllers`, `repositories`, `resources`, `bindings`, `enums` and
`constants`. Use feature-first nesting only when a package README describes a
consistent layout for multiple cohesive features; do not mix layouts arbitrarily.

Services coordinate domain/rules and structural ports. Repositories implement
ports and are injected in applications. Controllers delegate to injected Services.
Pure models/rules must not import ORM, broker, socket, process composition or a
universal catalog registry. Packages must never import applications.

Domain-specific Controllers, enums and constants may move beside their domain,
including Hero and Dragon. Shared protocol alternatives remain in bounded
transport/compatibility packages. Native identities remain explicit versioned
bindings; moving a declaration does not change its value, persistence or wire type.
A transport dependency must not be loaded through a pure domain entrypoint.

Create/update DTOs retain the existing declaration-only class rules. Domain-local
DTOs live under `dtos`, response interfaces under `contracts/responses`, Zod schemas
under `validations`, and serializers under `mappings`. Existing centralized paths
remain compatible while consumers migrate. No decorator convention is changed.

Expose source through existing wildcard exports, preserving root entries and
non-source assets. Declare direct workspace dependencies. Keep temporary facades
as re-exports of one implementation, with no copied behavior or data. Each facade
must have an owner, remaining callers and a linked removal task. A cycle baseline
is evidence of debt, not permission to add cycles. Inspect both runtime and
import-type edges; migrated slices must not add a new dependency cycle.

Evaluate cohesion and separately count handwritten behavior, catalogs, schemas and
tests. Review a package approaching 10–15k handwritten lines or a behavioral file
approaching 400–600 lines. These are review triggers, not lint limits. A package
spanning unrelated domains needs review regardless of size. Do not create a class
per package or replace global layers with a giant player/world/activities package.

Non-goals: changing game rules, save keys, schema, process ownership, runtime,
framework, broker, private client distribution rights or the accepted PostgreSQL
and Redis boundaries. Named client-backed definition migration and cross-owner
protocols require their own decisions and verification. Do not create unimplemented
applications or empty responsibility directories to fill a diagram.

## Consequences

- Vertical ownership makes a mechanic's ports, rules and tests discoverable together; each extraction must update its package README and migration record.
- Temporary aliases add migration bookkeeping; track every caller and remove aliases only after public export and consumer checks pass.
- Colocated adapters can accidentally pull infrastructure into pure imports; use selective entrypoints and dependency checks instead of broad package barrels.
- Moving tests can silently reduce coverage; update affected test commands and prove relocated suites still run before removing old files.
- Size reviews require judgment and may split event families from Hero or world concerns; record exceptions with separate data/schema counts.

## Implementation Plan

- **Affected paths**: `.github/CONTRIBUTING.md`, `.github/ARCHITECTURE.md` section 4, `packages/README.md`, domain `packages/*/src`, existing horizontal package facades, affected package READMEs/manifests/tests, application composition and existing test scripts.
- **Dependencies**: No new third-party package, version change or toolchain is selected. Move direct workspace dependencies alongside implementations and update only required export/lockfile entries per reviewed slice.
- **Configuration**: No environment or runtime settings change. Existing checks remain enabled; protected manifests/configuration changes still require the repository's scoped authorization.
- **Patterns to follow**: Hero's responsibility directories, Dragon's selective domain/mapping modules, existing constructor injection and source wildcard exports. Preserve current Controller/Service and DTO semantics.
- **Patterns to avoid**: Copying Hero's broad dependency cycles, duplicate sources of truth, unbounded generic packages and a single cross-domain registry/barrel.

1. Link this decision from contribution rules and architecture while distinguishing the current implementation from the migration convention.
2. Complete W01 ownership inventory and W05 dependency guardrails in linked child issues before broad moves. Keep unclassified files explicit.
3. For each vertical slice, record old path, new owner, composing application, direct callers, tests, facade and removal issue. Reuse #552/#553 for avatar/postbox work.
4. Move real implementations and focused tests without changing wire behavior, database keys or authority. Update callers, direct dependencies and exports together; retain bounded re-exports where necessary.
5. Run structural and behavior verification before deleting any implementation or facade. Record benchmark evidence separately; source moves do not prove performance gains.

### Verification

- [ ] Contribution rules and architecture link this record without claiming all domains have migrated.
- [ ] Every migrated source/test has a recorded owner, destination and migration status; remaining callers/facades have linked removal work.
- [ ] Public exports resolve and direct imports match declared dependencies; packages do not import apps and the slice introduces no dependency cycle.
- [ ] Pure model/rule entrypoints do not import infrastructure or initialize unrelated catalogs.
- [ ] Moved tests remain in the existing discovery commands and pass; relevant persistence/protocol/recovery suites preserve behavior.
- [ ] Affected workspace types and application builds pass; root lint and formatting pass without relaxed rules.
- [ ] Saved keys, protocol field order/types, idempotency, economic invariants and authoritative writer ownership remain unchanged per slice.
- [ ] Medium-package reviews distinguish behavior from generated data/schema/tests and document exceptions.

## Alternatives Considered

- Keep horizontal technical-layer packages: minimizes path churn and preserves familiar imports, but leaves mechanics spread across large packages and does not resolve #558's ownership problem.
- One package per feature class or command: creates small units but expands exports/dependencies and fragments shared transactions; choose cohesive domains instead.
- One giant package per process: simplifies composition imports but mixes unrelated mechanics and ties source ownership to deployment topology.

## More Information

- Governing constraints: [ADR-0002](0002-adopt-postgresql-for-authoritative-state.md), [ADR-0005](0005-adopt-redis-for-cache.md), [ADR-0011](0011-adopt-typescript-for-application-code.md).
- Related work: [#558](https://github.com/ReeseArch64/opencok/issues/558), [#567](https://github.com/ReeseArch64/opencok/issues/567), [#568](https://github.com/ReeseArch64/opencok/issues/568).
- Implementation at proposal: package responsibilities are documented, unused workspaces have a retirement PR, and realm composition is being split inside its existing process. No full domain migration or new authority boundary is claimed.
- Revisit when measured dependency/import costs, transactional coupling or sustained cohesion problems require a different boundary. Acceptance does not close #558.
