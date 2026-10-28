# Alliance gameplay

Alliance owns the existing queue-assistance workflow after
[#663](https://github.com/ReeseArch64/opencok/issues/663), part of #558 W08, under
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md).
Shared gifts follow in [#665](https://github.com/ReeseArch64/opencok/issues/665).
Research and donations follow in [#667](https://github.com/ReeseArch64/opencok/issues/667).
Governance follows in [#669](https://github.com/ReeseArch64/opencok/issues/669).
Applications and invitations follow in [#671](https://github.com/ReeseArch64/opencok/issues/671).
Creation and membership follow in [#673](https://github.com/ReeseArch64/opencok/issues/673).
Queries and snapshots follow in [#675](https://github.com/ReeseArch64/opencok/issues/675).
Publication follows in [#677](https://github.com/ReeseArch64/opencok/issues/677).
Execution context and dispatch follow in [#679](https://github.com/ReeseArch64/opencok/issues/679).
Mutation coordination follows in [#681](https://github.com/ReeseArch64/opencok/issues/681).
Its eighty-four source modules and ten test files cover help, gifts, research,
donations, governance, applications/invitations, creation/membership, queries,
snapshots, publication, context/dispatch, mutation coordination, native mapping
and transactional persistence/recovery. Aggregate persistence remains a subsequent
domain slice.

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
Its runtime dependencies are existing Messages, Drizzle, drizzle-orm and Zod
for creation validation. Economy supplies only the bounded reward-preview type.

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
each remove two Service cycle entries from the architecture baseline. Governance
declares two direct realm dependencies and retires their two stale test exceptions;
71 existing violations remain elsewhere. No baseline rule is relaxed.

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

## Governance and membership policy

`services/governance` owns permissions, ranks, leadership, leave/kick/dissolve
admission, attributes, rank names, flags, diplomacy and blacklist commands.
`rules/membership` owns the existing text, membership, rank-capability, editable
permission, target, creation-cost, capacity and entry policies. Bounded contracts
expose the required catalog, readers, error behavior and context operations.
The realm injects actual readers, integer validation, alliance failures and the
original unsupported-command error. Its direct Constants and Errors dependencies
are declared; Alliance gains no broad package dependency.

Six editable settings retain their defaults and strict key/value validation.
They cannot grant gameplay capabilities from the rank catalog. Ordinary rank
changes retain no-self and superior-rank gates. Leadership transfer/replacement
requires exactly one current leader, local profiles and the existing rights or
rank-specific absence deadline and cost. Both member ranks and rally reset remain
in the enclosing transaction. Governance delegates removal to the existing
membership workflow, preserving its profile, world, march, production, first-join
reward and notification coordination.

Text checks, moderation in the outer coordinator, rename charges, first free
abbreviation change, recruitment and power/castle restrictions are unchanged.
Blacklist edits remain leader-only, bound to the current alliance, with validated
saved string arrays and the 500-character serialized limit. `mappings/governance`
preserves native field order and SFS types. Lazy snapshot/balance callbacks retain
the original evaluation order and exact long values.

`repositories/governance` owns blacklist reads and alliance/member/blacklist writes.
The shared transaction calls these at their original positions: alliance creation
expands the allowed set before the check closure; sorted name/abbreviation advisory
locks precede uniqueness checks and upserts; member writes validate the locked
participants; blacklist writes retain their later position. No query, lock,
receipt, outbox, save format or authority ownership changes.

| Former source                                               | Owned destination                                          | Composition and retirement                                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Services `alliances` governance command tail and attributes | `services/governance`, `mappings/governance`, command enum | Required realm-composed factory after the existing membership and specialized dispatch gates |
| Rules `alliance` policy functions                           | `rules/membership`                                         | Bound compatibility exports; existing error construction stays in Rules                      |
| Aggregate alliance/member/blacklist persistence             | `repositories/governance`                                  | Same transaction and operation order; retire shared adapter with W08/W20 aggregate migration |
| Shared governance state/write fields                        | `contracts/governance`                                     | Shared Contracts aggregate extends the owned interfaces                                      |

The Rules compatibility binding has direct consumers in Services `alliances`,
Services `alliance-publication`, Rules `alliance-science`, Rules
`tests/alliance.test.ts` and Server `src/composition/alliance.ts`. Alliance owns
retirement under #558 W20: migrate coordinator/publication policy injection and
catalog tests, then relocate the shared error binding. The unused free
`allianceCapacity` export is removed; the policy retains capacity and its default
entry evaluation. Application/invitation lifecycle follows in #671; directory/search,
membership mutations follow in #673, while aggregate orchestration and publication
still require later slices.

Seven governance tests add 92 assertions for permission isolation, rank and
leadership gates, exact absence boundaries, removal delegation, costs, restrictions,
saved blacklist reconstruction and native roundtrips. The full Alliance suite has
25 tests and 265 assertions. Fifty runtime comparisons verify all extracted policy
bodies and defaults, native mapper inlining, command admission order, coordinator
methods and complete aggregate read/write flows; six contract comparisons preserve
moved and unchanged fields. Existing PostgreSQL scenarios cover concurrency,
rollback, replay, leadership, membership and economy boundaries.

Deploy or roll back the complete realm artifact against unchanged alliance,
member, blacklist, profile, inventory, receipt and outbox storage. Keep committed
memberships, rewards and receipts across rollback. No migration, environment,
third-party version or client repackaging change. Native-device and production-load
acceptance remain separate from synthetic server validation.

## Applications and invitations

`services/applications` owns application/invitation commands, their active lookup,
notification preparation, application messages and paginated lists. Realm
composition injects actual record readers, UUID generation and failure behavior,
the existing membership policy and `mappings/applications`. Bounded context ports
retain the required catalog, membership facts and existing join operation. The
shared coordinator dispatches before its general membership gate, preserving entry
for players outside an alliance.

Applications retain the eight-hour exclusive deadline, eligibility/capacity checks,
open recruitment path and oldest-entry trimming before inserting a fourth pending
application. Active duplicates do not allocate another UUID or mail. Invitations
require catalog rights and a local eligible target; active applications, invitations
and refusal records still prevent another invitation. Cancellation keeps its
original type, player and alliance selection.

Acceptance/refusal validates the selected mail's recipient, type and unconsumed
deal, then binds it to an active application. Imported mail identities may differ
from application IDs: the saved alliance/applicant identity remains the fallback.
Selected mail is marked consumed in the same plan. Refused invitations retain their
type-three row; refused applications are deleted. Acceptance delegates to the
existing join port, which still coordinates profile, member, map, march, production,
first-membership rewards and application cleanup. No second writer is introduced.

Application messages preserve text validation and authorized reader checks. Lists
retain owner/alliance/type/expiry filters, UID ordering, ten-row pages and the
native default page value. The Mapper preserves field order, SFS types and exact
long values; a lazy page reader retains evaluation after row mapping. The existing
mail-data decoder moves here unchanged, including whitespace/NUL trimming and
scalar-only fields. Its two former consumers now use the owned implementation;
there is no decoder compatibility facade.

`repositories/applications` owns the scoped 8,193-row application query and
8,192-row guard, selected-mail query, application upsert/deletion and owned mail
consumption. The shared transaction delegates at the original read/write positions.
Participant discovery, application cleanup on membership/deletion and new mail
insertion remain in the aggregate until its lifecycle migration. In particular,
first-join system-mail grouping stays in the original transaction. Governance and
applications share the renamed pure `contracts/persistence-runtime` record/check
port; no runtime dependency or field changes accompany that promotion.

| Former source                                                                | Owned destination                                   | Composition and retirement                                                          |
| ---------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Services `alliances` membership/applications/application/mail methods        | `services/applications`, contracts and command enum | Required realm factory; legacy methods removed                                      |
| Application/invitation native results and lists                              | `mappings/applications`                             | Injected into the owned Service                                                     |
| Mappings `allianceMailData`                                                  | `AllianceApplicationsMapper.mailData`               | Owned Service and shared transaction discovery use the owned decoder directly       |
| Aggregate application/selected-mail reads and application/consumption writes | `repositories/applications`                         | Same transaction and ordering; aggregate cleanup/new-mail ownership remains W08/W20 |
| Shared application state/write fields                                        | `contracts/applications`                            | Shared Contracts aggregate extends owned interfaces                                 |

Eight tests add 73 assertions for entry gates, pending limits, saved-state duplicate
suppression, invitation/refusal expiry, imported mail binding and consumed-state
reconstruction, authorized messages, pagination, wire roundtrips and malformed mail.
The full Alliance suite contains 33 tests and 338 assertions. Thirty-five runtime
comparisons verify the extracted methods, native mapping, parameter defaults,
complete coordinator methods, command admission, decoder and aggregate read/write
flows; seven contract comparisons verify field preservation and the shared
persistence port. The existing four disposable PostgreSQL suites retain 28 tests
and 284 assertions against the parent baseline.

Deploy or roll back the complete realm artifact without schema, environment,
third-party version or client packaging changes. Preserve committed applications,
mail consumption, memberships, rewards, receipts and outbox. Synthetic fixtures do
not replace native-device or production-load acceptance. Creation and membership entry/removal follow in #673; directory and
aggregate/publication ownership remain later #558 work.

## Creation, entry and removal

`services/membership` owns creation, march admission, entry and removal. The
creation DTO and Zod schema move unchanged into the domain; their sole consumer
moves with them and the unused legacy modules are removed. Realm composition
injects actual numeric/failure behavior, UUID/RNG, reward preview, Java-compatible
mail bytes, activity economy and stable identities. The generic catalog and ledger
ports preserve concrete adapters at composition without importing broad Rules,
Services or Contracts into Alliance. Zod uses the existing pinned catalog version;
Economy supplies its existing leaf reward-preview contract.

Creation preserves castle thresholds/costs, text checks, native defaults, initial
leader rank and abbreviation collision fallback. Existing membership or cross-realm
profiles remain ineligible. Entry rejects team/foreign-alliance marches, incoming
active marches targeting the player or an owned point at or after the current time,
and the 8,193-row sentinel. Capacity uses current membership and truncated science
effect. Member initialization preserves prior honor, native counters and join time.
Quest action, membership, alliance count and production-owner marking stay together.

First membership uses template 10011, the actual reward preview with version
12.06.0 and RNG, original supported reward categories and unchanged Java mail bytes.
`mappings/membership` preserves reward serialization, stable mail identity plus the
00 category, claim status, native response field order and exact long values. Lazy
snapshot/first-join readers preserve evaluation order. Missing templates produce
no mail; unsupported reward kinds or missing message bytes still abort the plan.
Removal preserves march/cross-realm gates, clears membership, closes first-join
eligibility and marks the production owner. Shared context join/remove ports now
delegate to the realm-composed membership Service for applications and governance.

`repositories/membership` owns lord, owned-point and relevant-march reads, followed
by the original coupled writes: member clearing/help invalidation; profile and
world-point membership, application/donation cleanup and march membership; first-join
flags; and later new-mail insertion/system grouping. Participant and allowed-alliance
checks remain unchanged. A duplicate deterministic mail does not create another
system group. Calls retain their original positions among governance, science,
help, gifts, application consumption and blacklist operations inside one transaction.
No process authority, receipt, production schedule or outbox boundary changes.

| Former source                                               | Owned destination                                  | Composition and retirement                                                                              |
| ----------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Services `alliances` creation/checkMarch/join/remove        | `services/membership` and bounded ports            | Required realm factory; shared join/remove methods remain delegation ports until coordinator retirement |
| DTOs `create-alliance.dto`, Validations `alliance`          | `dtos/create-alliance.dto`, `validations/alliance` | Sole consumer migrated; legacy modules removed                                                          |
| First-join reward/mail and membership native objects        | `mappings/membership`                              | Owned Service with actual failure and stable-identity collaborators                                     |
| Aggregate lord/point/march reads and membership/mail writes | `repositories/membership`                          | Same transaction and operation order, including help/donation cleanup and mail-group idempotency        |
| Shared membership state/write fields                        | `contracts/membership`                             | Shared Contracts aggregate extends owned interfaces                                                     |

The unused Rules `newAllianceMember` export is removed; the owned policy remains
the single implementation. Remaining creation/join policy bindings still serve
Rules catalog tests. `allianceStableId` remains shared for the trusted gift producer,
realm research-recovery identity and this composed mail mapper. Alliance owns its eventual
relocation under #558 W20 with aggregate migration; hashes and saved identities must
remain unchanged. Directory/search, snapshot/effect assembly, transaction discovery,
aggregate orchestration/publication and semantic catalog definitions remain open.

Seven membership tests add 73 assertions for creation costs/defaults, UUID collision
order, membership/march gates, exact arrival boundary, population/science capacity,
honor preservation, deterministic first-join rewards, missing/unsupported mail data,
removal and native roundtrips. All Alliance tests total 40 tests and 411 assertions.
Thirty-eight structural comparisons cover extracted algorithms and mapping, full
coordinator methods, ordered aggregate reads/writes, schema, DTO and contract fields.
The four disposable PostgreSQL suites retain concurrent entry, last-slot admission,
first-membership mail, replay, rollback, production and receipt coverage.

Deploy or roll back the complete realm artifact with its updated workspace lockfile.
No schema, environment, save conversion, third-party version or client packaging
change. Preserve memberships, first-join flags/rewards, production checkpoints,
applications, receipts and outbox. Do not reset reward identities or player progress
during rollback. Native-device and production-load acceptance remain separate.

## Queries and native snapshots

`services/queries` owns initialization, alliance lookup, name/abbreviation checks,
candidate search, directory search, first-join status, profile view and member ranks.
`services/snapshot` projects current members plus pending additions, replacements
and removals, checks exactly one projected leader and composes profile, power and
science through bounded ports. Realm composition injects the actual readers,
failures, membership policy and native Mappers. Existing snapshot callers use the
shared delegation port until aggregate retirement.

Initialization retains saved-alliance/current-member/unique-leader checks and its
empty response for missing membership. Pending member writes retain precedence in
the default member selection. Capacity includes the truncated science effect and
power sums stay bigint. Native aliases, field order, SFS types and misspellings
`learderUid`/`learderName` remain unchanged. Science serialization is evaluated at
its original position; gift level, permissions and research targets retain their
existing interpretation.

Name and abbreviation queries still return true for invalid or unavailable values;
check-name returns true when no exact name matches. Candidates retain invitation
rights, application-type filtering and language-prefix preference with fallback.
The existing database pagination followed by in-memory pagination is preserved,
including later-page behavior. Rank rows retain descending rank, UID tie-breaking
and profile-before-power evaluation. First-join status uses the existing saved flag.

`repositories/queries` owns directory, total and candidate reads at their original
transaction positions. Exact/prefix-derived/substring predicates, directory totals,
UID ordering, page sizes and candidate realm/membership/ban scopes are unchanged.
No transaction, lock, receipt, outbox or authority boundary changes.

| Former source                                              | Owned destination                                           | Integration and retirement                             |
| ---------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| Services `alliances` query branches and snapshot assembly  | Query and snapshot Services, bounded ports and command enum | Required realm factories; shared coordinator delegates |
| Inline query/snapshot wire objects and Mappings `alliance` | `mappings/queries` and `mappings/snapshot`                  | Legacy mapper removed after its sole consumer migrated |
| Contracts `responses/alliance`                             | `contracts/responses/alliance`                              | Exact declaration move; legacy path removed            |
| Aggregate directory/total/candidate reads                  | `repositories/queries`                                      | Same transaction and read order                        |
| Shared selection and directory-state fields                | `contracts/queries`                                         | Shared aggregate contracts extend owned interfaces     |

Seven tests add 63 assertions covering projected leadership/membership, exact long
values, native roundtrips, initialization, availability semantics, candidate gates,
language fallback, existing pagination, directory totals, first-join flags and rank
evaluation order. All Alliance tests total 47 tests and 474 assertions. Thirty-six
structural comparisons verify workflows, inlined mapping, defaults, complete shared
coordinator methods, command admission, aggregate reads/writes and contract fields.
The four disposable PostgreSQL suites pass 28 tests and 284 assertions. Root package
tests pass 440 tests; server tests pass 1,501 tests. Six affected workspace type
checks, architecture tests/types, lint, formatting and realm build also pass.
The architecture baseline remains 71 existing violations; no rule is relaxed.

Deploy or roll back the complete realm artifact without dependency, configuration,
schema/save conversion or client packaging changes. Preserve memberships, science,
inventory, receipts and outbox. Effects, transaction discovery, aggregate/publication
ownership and semantic catalog definitions remain #558 work. Native-device and
production-load acceptance remain separate.

## Publication and current-membership reads

`services/publication` owns delivery of the existing alliance mutation event.
`mappings/publication` owns its distinct native update/join/leave/leadership/science
and point payloads. Publication intentionally keeps its existing shape, which
has different fields and leader fallback behavior from query snapshots. Bounded
contracts contain the snapshot, reader/publisher ports and actual science-effect
adapter; existing Help and Science Mappers remain injected collaborators.
Realm composition supplies the existing record readers, membership policy,
science effects, help/science mapping and publisher without broad package imports
into Alliance. No dependency or workspace change is needed.

Pending leave events revalidate the current profile before notifying a player;
a later membership prevents an old event from clearing it. A missing alliance
returns after eligible leave messages. Activity reward events publish the exact
absolute shared balance only to current non-actor members and return before other
updates or science evaluation. Ordinary delivery retains per-member order:
update, conditional join, leadership, matching help and science messages.
Publication failure propagates to the existing outbox owner without swallowing or
continuing to later recipients.

Join messages still require a changed current member bound to this alliance and
retain catalog order, level-zero filtering and default science rows. Help messages
require both current queue identity and sender ownership. Science messages retain
current research mapping and exact shared points. Native field order/types,
`learderUid`/`learderName`, permission defaults, targets, capacity truncation and
long precision are unchanged.

`repositories/publication` owns the complete repeatable-read transaction. The realm
injects the existing authority fence, called before the first query. Record,
current profile/member join, queues, help, science, research and selected profiles
are read in the original order with unchanged realm scopes and bounds. Realm and
two PostgreSQL integration consumers now use the composed reader factory. Outbox
relay, acknowledgments, retries and authority acquisition remain with their existing
owners; this does not introduce a worker or new process authority.

| Former source                           | Owned destination                                       | Integration and retirement                                              |
| --------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------- |
| Services `alliance-publication`         | `services/publication`, Mapper, runtime ports and enums | Realm composition constructs the Service; legacy module removed         |
| Repositories `alliance-publication`     | `repositories/publication`                              | Realm injects its existing fence; realm and integration imports migrate |
| Contracts `AlliancePublicationSnapshot` | `contracts/publication`                                 | Exact declaration move; no shared consumer or facade remains            |

Seven publication tests add 52 assertions for current-profile revalidation, early
exits, actor exclusion, native roundtrips, ordered recipients, join science defaults,
help binding and failure propagation. The full Alliance suite has 54 tests and 526
assertions; root package tests have 447 tests and 557,913 assertions. Four full
structural comparisons cover the entire publication workflow with native Mappers
inlined, the complete transaction, reader defaults and snapshot declaration; a
separate wiring check verifies the actual fence and science-effect injection.
Architecture tests retain 15 tests/42 assertions and 71 existing violations.
The four disposable PostgreSQL suites retain 28 tests/284 assertions; server tests
retain 1,501 tests/245,699 assertions. Five affected workspace type checks,
architecture types, frozen install, lint, formatting and realm build pass.

Deploy or roll back the complete realm artifact without schema/save conversion,
environment or client packaging changes. Keep pending outbox events, committed
receipts, current memberships and player progress. Effects, aggregate orchestration,
transaction discovery and semantic catalogs remain #558 work. Native-device,
production-load and separate process-authority acceptance remain open.

## Execution context and specialized dispatch

`services/context` owns the per-command Alliance execution context. Bounded
contracts compose existing domain state/write facets, catalog requirements,
ledger operations, runtime collaborators and subdomain factories. The context
holds its own pending writes and production markers; it does not import broad
Contracts, Rules, Services or Hero packages. Shared aggregate contracts retain
the actual inventory binding while extending the owned context fields.

Realm composition constructs the context with existing Services, membership
policy, record readers, integer/failure handling and activity-economy adapter.
The outer coordinator uses one required factory at both ordinary-command and
trusted-gift construction sites. Its mutation plans, receipts, deterministic
identities and outbox payloads remain unchanged. The former shared context class
has no remaining consumers and is removed without a facade.

Pending member writes override saved rows with the same player ID. Membership
still requires the current profile to identify the same alliance and a valid
rank; pending foreign/cleared membership cannot fall back to the old row. Alliance
reads prefer pending writes, while `list` intentionally retains saved members for
its existing callers. Castle identity, exact power, cost debits, default arguments
and local science arithmetic are preserved. Snapshot/membership/science delegation
passes the same context and retains shared production markers.

The actual player-effect adapter stays in realm composition: load inventory
effects, compute general skill points, await world effects, await emperor effects,
then evaluate the existing player rule with version 12.06.0 and current time.
The context retains the finite-result check and error propagation. Local alliance
science summation remains separate from the existing power-effect calculation;
this extraction does not replace either arithmetic policy.

Dispatch retains recovery, initialization, creation, queries and application
operations before the general membership gate. Science, help, gifts and governance
retain their original order after that gate. Existing subdomain Services still
own their command-specific admission and workflow. No validation or authority
check is broadened by context composition.

| Former source                                   | Owned destination                                | Integration and retirement                                                                                                |
| ----------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Services `alliances` context and dispatch class | `services/context` and bounded context contracts | Required realm-composed factory at both coordinator call sites; shared class removed                                      |
| Shared aggregate selection/state/write facets   | `contracts/context-state`                        | Shared aggregate extends owned fields and supplies concrete inventory; retire with outer coordinator/repository migration |
| Inline broad player-effect composition          | `apps/server/src/composition/alliance.ts`        | Actual inventory/general/world/emperor adapters injected; finite guard remains in owned context                           |

Seven context tests add 71 assertions for pending overlays, profile/rank binding,
exact power, costs, science arithmetic, effect failure handling, dispatch gates and
default delegation. All Alliance tests total 61 tests/597 assertions; root package
tests total 454 tests/557,984 assertions. Twenty-nine structural and wiring
comparisons cover moved methods/defaults, effect evaluation order, initial writes,
complete outer coordinator methods, command registry, stable identity, factory
wiring and aggregate contracts. The four disposable PostgreSQL suites retain
28 tests/284 assertions; server tests retain 1,501 tests/245,699 assertions.
Five affected workspace type checks, architecture tests/types, lint, formatting,
frozen install and build pass. The architecture baseline remains 71 violations.

Shared aggregate contracts still serve Services `alliances`, Repositories
`alliance-gameplay` and realm composition. Alliance owns retirement with their
remaining #558 W08/W20 migration. Generic catalogs and cross-domain effect rules
retain separate ownership work; this slice does not complete W14 or process
separation. Deploy or roll back the complete realm artifact with unchanged schema,
saves, environment and client resources. Preserve memberships, production,
inventory, receipts and outbox; native-device and production-load acceptance
remain separate.

## Mutation coordination, requests and event identity

`services/alliance` owns ordinary commands and trusted gift publication.
`validations/command` owns native field validation, sequential moderation,
operation identity admission, canonical request fields and read selection.
`mappings/mutation` owns request encoding and alliance mutation-event payloads.
The realm injects the existing inventory planner, context factory, gift Service,
record readers, UUID generator, errors and membership policy. Economy's existing
replay mapping retains the response and push contract.

Unsupported commands are rejected before recovery. Every accepted non-tick command
still runs a tick before parameter validation; a failed tick aborts the caller.
Field checks retain command-specific science ID types, integer/string bounds,
scalar admission and the correlation-field bypass. Moderation remains sequential
in its original field order, before operation identity validation. Canonical
requests sort keys and exclude operation/correlation IDs. Selection retains query
aliases, language fallback, page sizes, bounds and ID validation.

The owned Service keeps context/ledger construction and plans inside the existing
repository callback. Ordinary writes append the same event after existing events,
including created-alliance fallback and changed memberships. Empty writes do not
append an event. Production owners and deadlines retain their original plan fields.
Trusted gift publication keeps its separate path, admission limits, deterministic
receipt and publication condition, without adding command recovery. Receipts,
locking, inventory application and outbox delivery remain in their current owners.

`services/identity` retains the exact 32-character SHA-256 hex prefix. Gift receipts,
first-join mail and realm research-recovery identities now use this single owned
implementation. `constants/commands` retains the complete ordered command registry;
shared game dispatch imports it directly. The former shared `Services/alliances`
module has no remaining consumers and is removed. Ledger's existing leaf mutation
contracts are declared as a direct workspace dependency; no third-party version
changes. The lockfile adds only that workspace dependency entry.

| Former source                                       | Owned destination                                          | Integration and retirement                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Services `alliances` outer workflows                | `services/alliance` and bounded mutation/runtime contracts | Realm composition supplies actual adapters; legacy module removed                              |
| Inline field/moderation/identity/selection handling | `validations/command`                                      | Called after the existing recovery gate                                                        |
| Request/event encoding                              | `mappings/mutation`                                        | Same evaluation position, field order, payload and append conditions                           |
| Command registry and deterministic identity         | `constants/commands`, `services/identity`                  | Game dispatch, first-join mail and realm research recovery migrate directly                    |
| Shared plan/repository definitions                  | `contracts/mutation`                                       | Shared repository facade binds concrete inventory state; unused plan/selection aliases removed |

Eight tests add 66 assertions for recovery ordering, validation/moderation,
canonical fields, aliases, exact longs, operation IDs, event append conditions,
production markers, replay, trusted gifts, error propagation and fixed hash vectors.
The owned suite has 69 tests/663 assertions; package tests have 462 tests/558,050
assertions. Eight structural/wiring comparisons verify both full workflows with
validation and mapping inlined, registry, hash algorithm/arguments, plan/repository
contracts and actual unsupported-command errors. Four disposable PostgreSQL suites
retain 28 tests/284 assertions; server tests retain 1,501 tests/245,699 assertions.
Five affected workspace type checks, architecture tests/types, frozen install,
lint, formatting and build pass. The architecture baseline remains 71 violations.

The shared aggregate Repository and inventory-state binding remain W08/W20 work;
semantic catalogs and effect ownership remain W14 work. Deploy or roll back the
complete realm artifact and workspace lockfile. No schema/save conversion,
environment or client packaging change is required. Preserve operation receipts,
mail/gift/recovery identities, player progress and outbox. Native-device,
production-load and process-separation acceptance remain separate.
