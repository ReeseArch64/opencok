# City appearances

Skins owns the existing city appearance workflows after
[#661](https://github.com/ReeseArch64/opencok/issues/661), part of #558 W08, under
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md).
Its 17 source modules and one test file cover city skins, bubbles and overlap
appearances. Media uploads and player profile avatars remain with their existing
owners; this package does not introduce a new content catalog or native identity.

## Responsibilities and composition

`services/ownership` combines stored and pending avatar ownership and cosmetic
states. `rules/projection` selects active appearance statuses. `mappings/cosmetics`
and `mappings/interaction` own native responses and mutation-event encoding, with
owned response contracts and strict schemas. `services/participants` selects the
existing actor/target pair. `services/publication` validates and delivers private
status updates before world appearance notifications.

`services/activation` specializes Base's activity lifecycle for `avatar.activate`.
The realm factory in `apps/server/src/composition/skins.ts` injects existing record
readers, numeric/feature checks, recipient validation, temporary effects, RNG and
campaign event 59. Campaign/effect algorithms remain single implementations in
their current owners. Skins imports no broad Contracts, Rules, Services, Mappings
or Repositories package. Structural contexts and catalog ports contain only the
appearance requirements. Semantic catalog authoring remains #558 W14 work.

`repositories/cosmetics` uses the realm transaction and owner supplied by
`composition/skin-persistence.ts`. City delegates at the original conditional read
and write positions through its session adapter. The repository reads profile and
world location, then locks states and avatar ownership with the same ordering and
4,097-row sentinels/4,096-row bounds. Writes retain target checks, the other-player
effect writer and 64-avatar bound. Existing actor/target locking, fencing, economic
changes, receipts and outbox remain in the enclosing realm transaction.

## Preserved behavior

Ownership retains subgroup/type selection, exact expiry, permanent `-1` ownership,
pending overrides and overlap-five counters. City skins extend owned duration;
bubbles retain their prior duration. Owned permanent appearances retain the signed
long maximum in authoritative state. Projection preserves temporary appearance
priority, permanent-time presentation and signed 32-bit seconds.

Activation retains campaign recording before the temporary-effect plan, prior state
removal, ownership expiry, `effectiveSign` and response/event order. Publication
validates status/effect shapes and bounds, sends private `status.push` and the city
server-action update first, then deduplicates actor, target and interested players
for world updates. A zero world point still skips world publication. These are
existing behaviors, not new balancing or security guarantees.

## Source ownership and compatibility

| Former source                                                       | Owned destination                                   | Composition and verification                                                   |
| ------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
| Services `city-cosmetics` ownership/access/participants/publication | `services/ownership`, `participants`, `publication` | Realm factories and remaining campaign bindings; ownership and recipient tests |
| Services `city-cosmetics` mutation encoding                         | `mappings/interaction`                              | Activation/campaign events; publication, protocol and PostgreSQL tests         |
| Services `avatar-activation`                                        | `services/activation`, `enums/command`              | Realm domain factory and campaign-appearance integration                       |
| Rules `city-cosmetics`                                              | `rules/projection`, `enums/kind`                    | Realm policy and remaining world/trouble binding; signed expiry tests          |
| Mappings/response Contracts/Validations `city-cosmetics`            | Owned Mapper, response contracts and schemas        | Exact field/schema comparison and wire tests                                   |
| Repositories `city-cosmetics`                                       | `repositories/cosmetics`                            | Realm transaction factory and City session; target isolation/rollback tests    |
| Contracts `city-cosmetics`                                          | `contracts/cosmetics`                               | Shared aggregate facade and workspace types                                    |

Skins owns the remaining aliases under #558 W20. Migrate the named consumers to
injected owned collaborators, verify public exports and remove each unused alias:

- Services `city-cosmetics.ts` binds only ownership, target-state access and event
  encoding. `local-campaign.ts` consumes ownership/access; `anniversary.ts` consumes
  event encoding. The binding retains the legacy City context type.
- Rules `city-cosmetics.ts` binds projection for Services `trouble.ts` and
  `world.service.ts`.
- Mappings `city-cosmetics.ts` binds only `cityCosmeticFields` for Services
  `trouble.ts`. Update/activation response consumers now use the owned Mapper.
- Contracts `city-cosmetics.ts` re-exports target state/write and status-change
  declarations embedded by the shared City aggregate. Retire with that aggregate
  boundary and its public-export audit; no other direct consumer remains.

The former activation Service, cosmetic Repository, response and validation paths
have no maintained consumers and are removed. Applications, City, Contracts, Rules,
Mappings and Services declare their direct Skins dependency. The workspace reuses
existing pinned Base, Messages, Drizzle, drizzle-orm and Zod dependencies. Root
package tests include its suite; no third-party version or new workspace is added.

## Verification and recovery

Run `bun --no-env-file test packages/skins/tests`, Skins/affected workspace types,
root package/architecture suites, lint/format and the realm build. Five owned tests
cover pending expiry, permanent/counter behavior, exact signed projection, activation
callbacks and ordered/deduplicated publication. App tests retain actual catalogs and
shared algorithms. Disposable PostgreSQL city-cosmetics/campaign-appearance suites
exercise cross-owner writes, receipt replay, rollback, campaign points/mail and
interested-player delivery: ten tests/77 assertions before and after. Twenty-seven
structural comparisons cover original algorithms, declarations, schemas, activation
command/type lists and complete City snapshot/write/session construction flows.

Deploy or roll back the realm artifact against unchanged avatar storage, effects,
inventory, receipts and outbox. No environment, schema, save conversion or native
resource change is introduced. Native-device, production-load and separate process
authority acceptance remain outside this structural slice.
