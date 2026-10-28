---
status: accepted
date: 2026-10-27
decision-makers: ReeseArch64
---

# ADR-0018: Adopt client-backed semantic gameplay definitions

## Context and Problem Statement

Issue [#558](https://github.com/ReeseArch64/opencok/issues/558), section 8, directs
extension of the maintained Hero/Dragon model to gameplay families. Existing typed
catalogs preserve native records but many still expose opaque IDs, field names and
encoded relationships. Moving those records into classes alone would leave the
same modeling problem. Client names can identify entities, but cannot prove their
server mechanics, availability or configuration.

This record captures the modeling direction already requested in #558 and the
maintainer's authorization to implement that issue. It does not claim individual
review of new archetype names, completed catalog migration or native-device support.
[ADR-0016](0016-adopt-domain-owned-package-layout.md) governs package ownership and
size review; [ADR-0017](0017-adopt-fenced-realm-process-authorities.md) separately
governs future process authority. Neither is replaced by this decision.

## Decision

Maintain gameplay archetypes in their owning domain packages. Use an abstract base
where it owns meaningful shared invariants or workflows and a named concrete class
for each factual archetype with distinct configuration or policy. Follow `Hero` /
`Mulan` and `Dragon` / `BlueDragon`. Do not create a subclass for each level, reward
cell or homogeneous table row; validated typed curves and matrices remain ordinary
domain data. Do not force inheritance without shared behavior or invariants.

Author explicit semantic properties with units, typed relationships, stable English
string/enum identities and deterministic ordered rosters. Keep native numeric or
string identifiers in separate version-scoped bindings. Preserve the distinction
between numeric 123, string "123", string "00123", aliases and cross-version reuse.
Definition objects describe archetypes, not saved player instances. Save keys and
native database IDs remain unchanged unless a separate data migration is approved.

Resolve names through actual authorized client linkage: native record, referenced
entity/localization key, localized name and structural relationships. Cross-check
mechanics against maintained server consumers. A similar icon, ID prefix, guessed
translation or display-name match is insufficient. Duplicate display names require
factual variant/alias evidence; locale/name changes do not automatically rename or
merge stable identities.

Record the client release and resource fingerprint, source category and safe
relative reference, native identity, localization key, semantic identity and
relationship evidence. Keep originals read-only. Offline discovery/import tooling
belongs in `packages/catalog-tools` once it contains real implementation. Public
reports contain selected provenance metadata and unresolved/collision/coverage
findings, not absolute private paths, private code, binaries, secrets, player data
or bulk localization content. Runtime, tests and builds use maintained artifacts
and synthetic fixtures and work without ignored client inputs.

Unresolved bindings remain explicit and block promotion of the affected family.
Client-only entries may have named definitions but must remain unavailable when
server configuration is absent; preserve the existing Vildrin boundary. Do not
invent initial values, effects, rewards or completion states to make a roster pass.
Discovery reports verify recorded relationships and coverage; they do not substitute
for semantic review or prove implemented gameplay.

Choose one authoritative authoring representation per family during migration.
After cutover, derive native compatibility records through an injected Mapper from
validated semantic definitions and verified bindings. Preserve exact native IDs,
values, units, leading zeros, optional/default fields, ordering and intentional
aliases. Reject imports that introduce unknown archetypes or overwrite named
models without verified bindings. Do not independently edit generated/native records
and semantic definitions for the same mechanic.

Migrate Services to the semantic model as well as the definitions. A Mapper that
recreates an XML-shaped bag while every consumer still reasons in raw IDs does not
complete a family. Use selective domain imports; neither runtime nor an unrelated
startup path should load a universal catalog registry. Offline audit tools may
inspect the full catalog deliberately without becoming runtime dependencies.

Non-goals: rebalancing, schema/save-key changes, enabling unsupported entries,
client patching/distribution, selecting a new runtime/framework/parser technology,
new process ownership, or replacing all regular data tables with classes.

## Consequences

- Semantic review becomes an explicit migration cost. Track every catalog and unresolved record so low-coverage families cannot disappear behind a sampled report.
- Versioned bindings add maintenance work. Check fingerprints, typed ID collisions, references, aliases and roster coverage before publication; changed client inputs require renewed evidence.
- Compatibility Mappers make authoring changes testable. Keep pre-cutover fixtures and compare all records/fields/order rather than a few named examples.
- Client facts and server behavior can disagree. Preserve unavailable states and reject incomplete imports instead of filling defaults.
- Domain ownership reduces broad import coupling only when consumers also migrate. Track remaining raw-ID consumers and remove facades after caller and dependency verification.

## Implementation Plan

- **Affected paths:** `packages/catalog-tools/src` and tests for read-only discovery, validation and reports; each owning package's `domain`, `contracts`, `enums`, `bindings`, `validations`, `mappings` and tests as needed; current `packages/resources/src/catalogs`, `packages/resources/scripts`, Hero/Dragon bindings and semantic consumers; `packages/MIGRATION.md` for exhaustive ownership/disposition.
- **Dependencies:** reuse the existing pinned XML parser/toolchain where parsing is needed; declare direct dependencies. No new parser version, broker, database or application is selected. No runtime environment variable or deployment change is required by this policy.
- **Patterns:** inspect `hero/domain/hero.ts`, `hero/domain/mulan.ts`, `dragon/domain/dragon.ts`, `dragon/domain/blue-dragon.ts`, ordered rosters, `dragon/mappings/dragon-definition.ts`, resource roster tests and import rejection paths.
- **Sequence:** inventory every catalog/family and consumer; establish native parity fixtures; discover exact client links; review identities and unresolved cases; author meaningful definitions and validated typed tables; introduce domain Mappers; migrate consumers; verify full parity and availability; retire obsolete authoring/facades only after coverage and caller checks.
- **Tooling:** use explicit family/linkage descriptors and source fingerprints. Preserve source ID types and record order. Report missing links, duplicate IDs/names, aliases, version collisions, client-only entries and unresolved references deterministically. A discovery command must not silently rewrite maintained source.
- **Tracking:** #558 W01 inventories every catalog; W13 implements discovery/provenance; W14 performs all family migrations and semantic consumer cutovers. Buildings, research, troops, inventory/equipment, NPCs/resources, skills/effects, quests/events and remaining catalogs all require dispositions; Hero/Dragon examples do not exempt their remaining consumers or level/skill catalogs.

### Verification

- [ ] Every maintained catalog has an owner, authoring source, client track and migration/defer/unresolved disposition; no unaccounted catalog remains.
- [ ] Synthetic parser/discovery tests cover exact keys, numeric/string/leading-zero IDs, missing/duplicate localization, variants, aliases, cross-version reuse and malformed inputs.
- [ ] Repeated discovery from identical inputs yields identical reports, identifies input fingerprints and leaves original inputs byte-identical.
- [ ] Reports and errors contain only approved metadata; runtime/tests/builds work without private artifacts.
- [ ] Each migrated family has reviewed identities and complete binding/reference/roster coverage; unresolved required links prevent cutover.
- [ ] Native compatibility fixtures cover every record and field, scalar type, omitted/default value, alias and order, with explicit review of any intentional difference.
- [ ] Client-only/incomplete archetypes remain unavailable; importers and Mappers reject fabricated or missing configuration.
- [ ] Semantic consumers replace raw-ID behavior and generated compatibility data has a single authoring source.
- [ ] Architecture checks reject new cycles, app imports, infrastructure in pure definitions and universal runtime catalog imports.
- [ ] Relevant domain, protocol, persistence, type, build, lint and formatting checks pass before each family is delivered.

## Alternatives Considered

- **Retain native-shaped typed records everywhere:** smallest immediate migration and straightforward parity, but leaves opaque identities and encoded relationships in business logic. Retain this only as an explicitly tracked transitional representation.
- **Generate a named class for every native row:** broad mechanical coverage, but invents object hierarchies for level curves and does not establish semantic meaning. Use meaningful archetypes with validated data tables instead.
- **Derive names or merge variants from IDs/display strings:** low discovery effort, but confuses collisions, aliases and client-only entries. Require explicit reference evidence and reviewed identities.

## More Information

See the [Hero and Dragon authoring evidence](../../packages/resources/README.md),
[package migration register](../../packages/MIGRATION.md) and #558 verification
matrix. Revisit this decision if factual family structure requires a different
semantic model or supported client releases have incompatible concepts; do not
silently reinterpret a native ID or change persisted meaning.
