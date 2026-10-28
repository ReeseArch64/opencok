# Alliance gameplay

Alliance owns the existing queue-assistance workflow after
[#663](https://github.com/ReeseArch64/opencok/issues/663), part of #558 W08, under
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md).
Shared gifts follow in [#665](https://github.com/ReeseArch64/opencok/issues/665).
Research and donations follow in [#667](https://github.com/ReeseArch64/opencok/issues/667).
Its twenty-nine source modules and three test files cover help, gifts, research,
donations, native mapping and transactional persistence/recovery. Membership and
its broad coordinator remain subsequent domain slices.

## Responsibilities and composition

`services/help` handles `al.callhelp`, `al.renderhelp`, `al.helpall` and `al.showhelp`.
`rules/help-generation` validates the saved generation. `mappings/help` owns the
snapshot, helper result and per-member publication payload. Contracts contain only
help state, writes, record readers and required context operations. Command, push
and quest-action enums retain the existing strings.

`apps/server/src/composition/alliance.ts` injects the actual record readers, integer
validation, building catalog lookup, failure policy and UUID generator. The shared
Alliance coordinator receives the help factory through its constructor. Alliance
imports no broad Contracts, Rules, Services, Mappings or Repositories package.
Its only runtime dependencies are existing Messages, Drizzle and drizzle-orm.

`repositories/help` receives the enclosing transaction, locked participants and
record/check collaborators. Shared aggregate adapters delegate at the original
read, write and membership-invalidation positions. Gameplay reads retain the
4,097-row sentinel; publication retains its separate 4,096-row limit. Help, queue
and activity writes remain ordered and atomic with economic changes, receipts and
outbox. The activity update still checks the previous version and pending status.
This extraction introduces no separate process authority.

## Preserved behavior

New help requests bind the activity identity and start time to a version-one JSON
helper list. Legacy comma-separated helpers still require the same current queue
interval and matching helper count. Membership, no-self-help, one-help-per-helper,
capacity, queue checkpoint and current deadline checks remain unchanged. Request
creation retains supported activity types, embassy parameters and effects 161/142.

The stored `reduceSec` value retains its existing millisecond interpretation.
Helping clamps the deadline to the current time, increments the activity version
and records the quest action together. Help-all retains its 128-request bound.
Snapshot/result/publication preserve native field order, duplicate count keys,
long precision and response identities. Publication remains inside the existing
member loop between leadership and science notifications. The result mapper uses
a lazy profile reader to preserve the original evaluation order.

## Ownership and remaining migration

| Former source                                 | Owned destination                             | Integration                                                       |
| --------------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| Services `alliance-help`                      | Service, generation policy and help contracts | Required factory in the shared coordinator; legacy source removed |
| Help snapshot/result and publication objects  | `mappings/help`                               | Realm composition and existing per-member publication loop        |
| Aggregate help reads/writes and invalidations | `repositories/help`                           | Shared gameplay and publication repositories, same transaction    |
| Shared help state/write fields                | `contracts/help`                              | Contracts aggregate extends the owned interfaces                  |

There is no remaining `alliance-help` compatibility entrypoint. Shared Alliance
contracts still compose the help fields; shared repositories/publication and the
membership coordinator remain integration adapters. Their retirement
belongs to #558 W08/W20 after those consumers have migrated. Help, gift and science extraction
each remove two Service cycle entries from the architecture baseline; 73 existing
violations remain elsewhere. No baseline rule is relaxed.

## Verification and recovery

The five help tests cover malformed generations, repeated helpers after saved-state
reconstruction, legacy interval binding, coupled deadline/version/action updates,
request creation, native fields, deadline clamping and exact long values. Seventeen
disposable PostgreSQL alliance/social-economy/timed-economy tests with 158 assertions
pass before and after, covering the enclosing mutation, replay, rollback and timed
completion paths. Thirty-nine structural runtime comparisons cover extracted
algorithms and complete aggregate read/write/publication/coordinator flows; eight
additional comparisons verify moved and unchanged contract declarations.

Run the owned suite, affected workspace types, root package/architecture tests,
server tests, lint/format and realm build. Existing v12.06.0 fixtures are exercised;
native-device and production-load acceptance remain separate.

Deploy or roll back the complete realm artifact against unchanged alliance help,
queue, timed-activity, inventory, receipt and outbox storage. No schema migration,
configuration, save conversion, new workspace or client repackaging is required.
Keep committed receipts and player progress when rolling back.

## Shared gifts

`services/gifts` owns the existing trusted producer and `al.showgift`, `al.opengift`
and `al.cleargift` commands. `rules/gifts` prepares weighted choices from the existing
catalog without changing regex matching, source ordering, zero-weight handling or
quantity validation. The bounded catalog port retains string records; semantic
catalog definitions remain #558 W14 work. `mappings/gifts` owns snapshots, claim,
clear and producer responses, including the native `alliancegfitexp` spelling.
A lazy alliance accessor preserves repeated lookups in their original order.

The realm supplies actual record readers, integer/failure checks, weighted RNG,
UUID generation and the existing activity-economy adapter. The generic ledger port
requires only item addition; its concrete planner type stays in composition and
the shared coordinator. No broad package import or new dependency is added to
Alliance. Help and gifts now share `contracts/readers` and `contracts/persistence`;
the former help-specific reader name and transaction path have no remaining callers
and are removed. Their runtime and structural definitions are unchanged.

The producer still validates the saved event's alliance and type before returning
without rerolling. New events resolve the level-specific catalog before its base
fallback, pin one outcome per current member and store the event and recipient
rows together. Deterministic event/receipt identities, trusted entitlement checks
and mutation-event publication remain in the shared coordinator. Client commands
cannot create purchase or gameplay entitlements.

Claims retain recipient/alliance binding, exact expiry, valid-state checks and
resource, gold, honor or parameterized-item credits. They consume the gift and add
alliance experience in the same existing mutation. Clear accepts consumed or
expired gifts. Listing retains its 2,048-row bound and current filters, including
the original presentation of consumed but unexpired entries.

`repositories/gifts` owns producer-event reads, the 2,049-row recipient read
sentinel and event/recipient/claim/deletion writes. Shared aggregate adapters call
it at the original positions. Participant validation, membership locks, economic
postings, receipts and outbox remain in the enclosing transaction.

| Former source                              | Owned destination               | Composition and retirement                                                            |
| ------------------------------------------ | ------------------------------- | ------------------------------------------------------------------------------------- |
| Services `alliance-gifts` command/producer | `services/gifts`, `rules/gifts` | Required realm-composed gift factory in the shared coordinator; legacy source removed |
| Gift snapshot/result objects               | `mappings/gifts`                | Owned Service; native field and roundtrip checks                                      |
| Aggregate gift state/write fields          | `contracts/gifts`               | Shared Contracts aggregate extends the owned interfaces                               |
| Aggregate gift reads and writes            | `repositories/gifts`            | Shared transaction adapter; retire with the remaining Alliance aggregate in W08/W20   |

Six gift tests add 83 assertions for pinned outcomes, saved-event replay, catalog
validation, reward kinds, expiry/ownership gates, clear permissions, listing bounds
and exact wire representation. Help and gift suites have eleven tests and 120 assertions. The four disposable PostgreSQL alliance/social-economy/
timed-economy/activity-reward suites retain 28 tests and 284 assertions before and
after this extraction. Thirty-nine runtime and eight contract comparisons cover
gift workflows, whole aggregate read/write/coordinator flows and unchanged help
adapters. Root package tests discover both owned suites.

Deploy or roll back the complete realm artifact against unchanged `alliance_gift`
and `user_gift` rows, inventories, membership, receipts and outbox. Preserve pinned
recipient outcomes and committed claims across rollback. No configuration,
schema/save conversion, client artifact or dependency version changes.

## Research, donations and recovery

`services/science` owns the existing research lifecycle and donation commands.
`rules/science` owns catalog identity/level lookup, capped donation stages, default
science rows and counters. `mappings/science` owns initialization/publication,
offers, individual options, cooldown, targets, research and donation responses.
`contracts/science-catalog` exposes only the existing science and item catalogs;
named semantic catalog definitions remain W14 work. Commands and pushes use
owned enums; the ordered resource constant preserves native resource indices.

Realm composition injects actual record readers, integer/failure checks, randomInt,
the ranking calendar and the activity-economy adapter. The shared coordinator uses
a required science factory for initialization, completion and commands. Publication
receives the owned Mapper and retains the original per-member ordering. Alliance
still imports no broad horizontal package and adds no dependency. Rules declares
Alliance directly for the remaining compatibility binding.

Opening a saved offer does not reroll costs or progress. Donation preserves the
RNG draw order, bound-resource-first debits, cooldown and joining gates, honor,
alliance points, daily counters, weekly history and quest actions. Existing field
spellings such as `uerid` and `higprogress` remain unchanged. Research retains one
alliance slot, pinned duration and version/from/to/power payload. Legacy empty
payload recovery still checks the matching start time. Completion checks the
saved generation and uses its pinned power while marking all current members for
the existing production coordination. The outer transaction retains production
settlement and scheduling at saved deadlines; this extraction adds no scheduler
or separate authority process.

`repositories/science` owns science/research/history/donation reads and writes,
donation cleanup on membership changes and science cleanup on alliance deletion.
Aggregate adapters call each operation at its original position. `science-recovery`
keeps the asynchronous due query, current membership/profile/realm/ban checks,
64-alliance page, cursor and ordering. Realm composition and integration use the
owned reader directly; the former shared recovery module is removed.

| Former source                                       | Owned destination                               | Composition and retirement                                          |
| --------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| Services `alliance-science`                         | `services/science`, contracts and native Mapper | Required realm factory; legacy Service removed                      |
| Rules `alliance-science`                            | `rules/science`                                 | Two bound compatibility exports described below                     |
| Inline science/offer/donation/publication responses | `mappings/science`                              | Owned Service and realm-composed shared publication adapter         |
| Aggregate science/history/donation reads and writes | `repositories/science`                          | Same transaction, allowed alliances, participant locks and ordering |
| Repositories `alliance-recovery`                    | `repositories/science-recovery`                 | Realm recovery loop and PostgreSQL integration; legacy path removed |
| Shared science state/write fields                   | `contracts/science`                             | Shared Contracts aggregate extends the owned interfaces             |

The Rules facade retains only `allianceScienceRule` and `allianceScienceStage`,
bound to one owned Policy instance. Its remaining direct consumers are Production
`services/context.ts`, Rules `tests/alliance.test.ts` and Server
`integration/alliances.test.ts`. Alliance owns retirement under #558 W20: inject the
policy into Production and migrate these catalog tests before removing the binding.
The former row/count exports have no remaining consumers and are removed. Shared
membership coordination, power effects and aggregate publication still have their
own migration work; this slice does not claim their completion.

The 517-line science Service was reviewed against ADR-0016's size trigger. It
coordinates one coupled donation/research lifecycle through six methods and a
context accessor; policy, mapping, transaction operations and recovery have separate
classes. No catalogs or generated definitions are embedded. Keep this boundary
under review as membership and effects move rather than combining them into it.

The full Alliance suite has eighteen tests and 173 assertions. Seven science tests
add 53 assertions for stage boundaries, saved offers, debit
order, weekly rollover, pinned research, production-owner marking, legacy recovery,
cooldown/targets and wire projection. Existing Rules catalog tests retain actual
catalog coverage. Forty-eight runtime and six contract comparisons cover original
algorithms and complete aggregate reads/writes, cleanup, recovery, coordinator and
publication flows. Disposable PostgreSQL tests exercise the enclosing transaction,
receipt, production and outbox boundaries.

Deploy or roll back the complete realm artifact against unchanged science,
research, donation and history rows, production checkpoints, inventory, receipts
and outbox. Preserve saved offers and research payloads when rolling back. No
schema/save conversion, environment, client resource or third-party version change.
