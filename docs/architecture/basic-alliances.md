# Basic alliances

Topic 23 implements realm-owned alliance creation, applications, invitations,
membership, ranks, leadership, editable permissions, queue assistance, science
contributions and shared gifts. The authenticated `GameService` routes the native
commands to `AllianceService`; initialization restores the alliance snapshot.
The private reference server is a read-only behavioral input, never a runtime
resource or a maintained dependency.

`createAllianceRepository` discovers the affected players and alliances, then the
mutation executor fences the realm and locks player profiles in UID order before
locking alliances in UID order. Membership is read again after locking. A changed
participant set aborts the operation for retry. Capacity uses current member rows,
including the completed expansion science effect. Profile, member, owned world
points and marches change together. A player has one membership row, and ordinary
rank changes cannot appoint a leader. Transfer changes both ranks atomically;
inactive-leader replacement uses the configured absence interval and gold cost.

Costs, contributions, native responses, receipts and outbox records commit in the
same PostgreSQL transaction. Only the actor's economy receives ledger postings.
Another member's balances cannot be credited through that ledger. First membership
creates the catalog system mail through an owned deterministic identity. Leaving,
expulsion or dissolution closes the first-join flag, including the donation waiting
period exception. Rejoining cannot create another first-membership reward.

Rank capabilities come from the maintained rank catalog. The six editable settings
control the source's low-rank presentation and messaging choices; they do not grant
invitation, research, expulsion or leadership capabilities. Applications expire
after eight hours. Invitation and application actions validate the actual mail's
recipient and type and consume its pending application. Imported mail identities
can differ from application identities; their stored alliance or applicant identity
provides the binding. Names and text use the existing runtime moderation provider.
Realm-local directory and candidate searches use parameter-bound SQL and bounded
pages. Cross-kingdom membership, global directory ownership, territory and war
orchestration remain separate systems.

## Governance ownership

After #669, the [Alliance package](../../packages/alliance/README.md) owns governance
commands, membership/permission policies, native governance mapping and
alliance/member/blacklist persistence. Realm composition supplies the actual
readers, validation and error behavior. The shared coordinator delegates after its
existing membership gate; aggregate persistence retains creation allowance
expansion, advisory locks, participant checks and original operation order.
Leave/kick/dissolve decisions use the existing member-removal port. Membership
entry/removal follows in #673; aggregate publication remains subsequent #558 work.
Applications and invitations follow in #671. This extraction changes no realm authority or saved-state contract.

## Application and invitation ownership

After #671, Alliance owns application/invitation workflows, active lookup, message
preparation, native lists/results and the existing mail-data decoder. A realm
factory supplies actual readers, UUIDs, errors and membership policy. The shared
coordinator delegates before its general membership gate. Application/selected-mail
reads, application writes and mail consumption remain at the same transaction
positions through the owned repository. The existing join port retains membership
mutations and first-join reward coordination; participant discovery, cleanup and
new-mail insertion remain in the aggregate pending subsequent #558 slices.

## Creation and membership ownership

After #673, Alliance owns creation validation/DTO, creation and membership Service,
first-join/native mapping and coupled membership/mail persistence. Realm composition
injects actual catalog, reward/RNG, economy, mail-byte and stable-identity behavior.
Shared join/remove context ports delegate to the owned Service. Lord/point/march
reads and member/profile/world/application/donation/first-join/mail writes retain
their transaction positions and participant checks. The existing aggregate still
coordinates production, receipts and outbox. Queries and snapshots follow in #675;
effects and aggregate/publication ownership remain later #558 slices.

## Query and snapshot ownership

After #675, Alliance owns initialization, directory/candidate/member queries,
first-join status and native snapshots. Realm composition supplies required query
and snapshot factories with actual record readers, failures and membership policy.
Shared context ports provide profile, power and science data. Snapshot assembly
projects pending member writes/removals, requires exactly one leader and preserves
native aliases, field order, long precision and science evaluation order.

The owned repository reads directory rows, totals and candidate players at their
original transaction positions, retaining exact/substring predicates, realm and
ban scopes, ordering and paging. Candidate language preference, application filters
and the existing database-plus-memory pagination remain unchanged. The former
single-consumer shared mapper and response declaration are removed. This changes
source ownership without introducing process authority or saved-state changes.

## Publication ownership

After #677, Alliance owns the mutation publication Service, dedicated native Mapper,
snapshot contracts and publication repository. Realm composition supplies existing
record/policy/science-effect behavior, Help/Science Mappers and the authority fence.
The reader retains repeatable-read isolation and fences before its first query;
current realm/profile/member checks and ordered reads are unchanged.

Delivery revalidates leave events against current profiles, handles missing alliances
and activity rewards before ordinary member updates, and preserves per-member
update/join/leadership/help/science ordering. Its payload remains distinct from query
snapshots. Failures propagate to the existing outbox relay. The former shared
publication modules are removed after realm and integration callers migrate.
Effects and aggregate ownership remain later #558 work; no new authority process,
worker or persistence contract is introduced by this extraction.

## Execution context ownership

After #679, Alliance owns its per-command context and specialized dispatch. Realm
composition injects bounded runtime/policy collaborators and the existing domain
factories. The outer mutation coordinator uses the composed factory for ordinary
commands and trusted gifts. Pending writes, production markers, profile/member
binding, defaults, exact power, cost debits and local science arithmetic retain
their existing behavior.

The player-effect adapter stays in realm composition and preserves inventory,
general, world and emperor evaluation order; the context rejects nonfinite results.
Recovery/initialization/creation/query/application dispatch still precedes the
general membership gate. Other domain commands follow it. Shared aggregate
contracts extend owned fields while retaining the actual inventory binding until
the outer coordinator and transactional aggregate migrate. No saved-state,
receipt, outbox or process-authority boundary changes.

## Queue assistance

After #663, the [Alliance package](../../packages/alliance/README.md) owns help
commands, generation validation, mapping and persistence under ADR-0016. Realm
composition injects the help factory into the shared coordinator and supplies the
publication mapper. Shared aggregate repositories delegate help operations within
the same transaction and at the same read/write/invalidation positions. Membership
remains in its existing owner pending subsequent #558 slices.

A new help request records the running timed-activity identity, start time and
helpers. Queue IDs and client-supplied helper identities confer no authority.
Every helper must currently belong to the sender's alliance, cannot help themself,
and can help that generation once. Embassy parameters and composed player effects
fix the helper capacity and reduction when the request is created. Assistance
updates the activity version and native deadline and calls the existing domain's
reschedule operation, preserving research and hospital mirrors. Normal timed
completion consumes the resulting deadline. Supported activity types are building,
research, healing and equipment; troop training and fortifications are excluded by
the source rules.

Imported comma-separated helper lists can bind only to an overlapping, still
running queue generation. Ambiguous or stale requests cannot accelerate a reused
queue. Leaving invalidates that player's outstanding help requests.

## Research and effects

After #667, Alliance owns the science Service, policies, native Mapper, bounded
contracts and research/donation persistence and recovery reader. Realm composition
injects actual numeric, RNG, calendar and economy collaborators. Shared aggregates
retain their transaction and publication ordering; Production and catalog tests
retain a tracked binding to the owned policy until their consumers migrate.

Donation offers persist their costs, contribution and progress outcomes. Opening
an existing offer does not reroll it. A successful donation consumes resources or
gold, refreshes the offers, advances bounded progress and updates member honor,
alliance points, daily counters and weekly donation history atomically. Weekly
history is filtered by alliance and period; rollover does not reset unrelated
player state. The existing quest foundation receives join, donate and help actions.

Research requires an authorized rank, completed donations, a valid next catalog
level and the single alliance research slot. Its duration and target level/power
are persisted. Production boundaries run for every current member when research
starts and completes. Production schedules include the future research deadline,
so a delayed recovery applies the bonus at the original deadline. Completion does
not compound that bonus. Membership changes also settle the old production schedule
before rebuilding it with the new membership effects. Existing queues retain their
pinned durations; future activities resolve the current composed effects.

A bounded background scan recovers overdue research, and authenticated commands
reconcile the actor's alliance before ordinary gameplay. Research recovery uses a
deterministic receipt identity. Legacy research rows with an empty acceleration
payload recover only when the stored start and current science agree.
Client operation identities are UUIDs, keeping them separate from internal worker
receipt keys. Recovery keys include the saved research payload and duration so a
clock rollback cannot alias a later research generation.

## Shared rewards and notifications

After #665, Alliance owns the gift Service, weighted-choice preparation, native
Mapper, bounded state/write/catalog ports and transactional gift repository.
Realm composition injects the existing economy and RNG collaborators. The shared
coordinator retains stable event/receipt identity and mutation publication, while
aggregate persistence delegates gift operations at their original positions.

`AllianceService.publishGift` is a trusted server producer. Its caller must already
have verified the gameplay or purchase entitlement and supply its stable event ID.
It snapshots current recipients and stores one weighted catalog outcome per member.
The event identity prevents another producer, replay or restart from generating a
second set. Membership added later does not receive an earlier gift. The client
cannot generate an entitlement through `al.gengift`.

Opening a gift checks its recipient, original alliance, validity and expiry, then
credits the actor and consumes the entitlement in the same transaction. Alliance
experience changes once per claim. A claimed or expired gift can be cleared.

The filtered mutation outbox relay publishes alliance updates and help/research
notifications through the existing realm notification adapter. It reads current
membership before delivery and leaves other domains' pending events untouched.
Acceptance by another member emits the native join snapshot with initial science
data. Removal notifications check the recipient's current profile, so a delayed
leave cannot clear a later membership. Capacity, permissions and research targets
use the current state and native field representation. Governance also requires the
profile and membership rows to identify the same alliance.

Publication retries do not repeat economic or progression mutations. PostgreSQL
remains authoritative when a recipient is offline; initialization reconstructs
membership, science and available rewards from saved state.

No new external dependency, service, environment setting or schema migration is
required. Back up the existing kingdom database before deployment. Deploy the
complete stack together. Rollback means restoring the prior server build while
retaining committed memberships, receipts, deadlines and reward claims; do not
clear receipts or reset player progress to retry an operation. New help-generation
and research payloads belong to the maintained server and should not be handed back
to an unmodified private reference runtime.

Disposable PostgreSQL scenarios cover concurrent entry, the last capacity slot,
leadership and permission checks, owned invitation mail, economic replay, overdue
research, production deadline schedules, helper generation reuse, recipient-bound
shared gifts, first-membership mail and outbox recovery. Native 12.06.0 wire commands
are exercised through server adapters; an interactive mobile playthrough and other
client release tracks still require device validation.
