# Alliance member help

Alliance owns the existing queue-assistance workflow after
[#663](https://github.com/ReeseArch64/opencok/issues/663), part of #558 W08, under
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md).
Its ten source modules and one test file cover help commands, persisted generation
validation, native mapping and transactional help persistence. Membership, science,
gifts and their broad coordinator remain subsequent domain slices.

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
membership/science/gift coordinator remain integration adapters. Their retirement
belongs to #558 W08/W20 after those consumers have migrated. Two removed Service
cycle entries are deleted from the architecture baseline; 77 existing violations
remain elsewhere. No baseline rule is relaxed.

## Verification and recovery

Five owned tests cover malformed generations, repeated helpers after saved-state
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
