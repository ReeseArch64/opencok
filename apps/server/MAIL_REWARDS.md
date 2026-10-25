# Durable mail rewards

Topic 11 connects `mail.reward` and `mail.reward.batch` to the
[persistent mutation foundation](MUTATION_FOUNDATION.md) and
[inventory transaction writer](INVENTORY.md). Mail marking and rewards now commit
in one authoritative realm transaction. No new dependency, schema or configuration
variable is introduced. This follows
[ADR-0002](../../docs/decisions/0002-adopt-postgresql-for-authoritative-state.md).

## Commands and compatibility

`mail.reward` accepts an owned mail `uid`. `mail.reward.batch` accepts comma-separated
`uids` and `types`. The latter contains legacy mailbox labels, not mail-type numbers:

| Label                       | Selected mail types  |
| --------------------------- | -------------------- |
| 0                           | Below 13 or above 16 |
| 1                           | 14 through 16        |
| 2                           | 13                   |
| 3                           | 6, 7, 8, 9, 30       |
| 4                           | 23, 24               |
| 5                           | 32                   |
| Other signed 32-bit integer | 13 through 16        |

Explicit IDs and categories form a union. Duplicates are removed before granting.
Selection and grant order are deterministic by mail UID. A batch contains at most
64 selected unclaimed messages and 256 KiB of attachment strings. Oversized batches
reject atomically; clients can submit bounded explicit ID groups. Already claimed
mail does not consume the category window. Empty/unavailable attachments and
ineligible upgrade notices are skipped in batches. Malformed or unsupported rewards
in an otherwise eligible message fail the whole batch without partial grants.

Upgrade notices reject the legacy excluded sender version 2.0.8 and versions newer
than the maintained v12.06.0 client. World Cup realm types 13/14 are rejected using
global realm metadata; the legacy realm-ID exemption above 999999 is retained.
Realm classification is operator metadata and must not be changed while its owner
is serving commands. Missing classification retains the existing normal-realm
behavior. The Java in-memory `mbLevel` gate has no persisted column or mapper field
in the audited mail schema; no unproven level metadata is inferred from contents.

Responses preserve absolute long resource/currency balances and the `goods` array
of inventory snapshots. Basic resource responses include bound balances separately;
mail credits are regular resources. `money` is the silver response key, and advanced
stone keys are `sand_stone` and `diamond_stone`. Batch responses add `successUids`.
Inventory and resource pushes reflect committed values. A direct claim also marks
the message read and updates the existing `mail_update` synchronization marker.

## Authoritative reward domains

The attachment is the persisted concrete string `category,itemId,count|...`.
Redemption does not reevaluate a reward catalog or reroll a reward. Accepted entries
have exactly three fields, a numeric item identifier and a positive signed 32-bit
quantity. A message has at most 64 entries. Duplicate category/item pairs aggregate
with overflow checks.

| Category                                                      | Atomic effect                                      |
| ------------------------------------------------------------- | -------------------------------------------------- |
| `goods`                                                       | Existing inventory stack, overlap and expiry rules |
| `gold`                                                        | Free gold in the player's normal or DMM pool       |
| `crystal`                                                     | Exact persisted crystal balance                    |
| `wood`, `stone`, `iron`, `food`                               | Regular signed 64-bit resource balance             |
| `money`, `chip`, `diamond`                                    | Signed 32-bit resource balance                     |
| `sandstone`, `diamondstone`, `marble`, `granite`, `limestone` | Signed 32-bit advanced resource balance            |

Negative balances, invalid catalogs and balance/quantity overflow reject before
commit. Only server-stored attachments determine grants; client-supplied rewards,
counts or item IDs cannot override them. Each batch retains per-message inventory
semantics, including separate non-overlapping stacks, instead of first collapsing
all messages into an anonymous reward string.

Experience with level/stamina/power effects, generals, equipment, quest power,
alliance points/honor, military progression and other domain rewards are not yet
implemented by this slice. These categories reject without consuming any attachment
or granting its supported siblings. Their authoritative planners must be migrated
before enabling such messages. This is atomic redemption for the supported domains,
not complete parity with every `RewardManager` branch. There is no public arbitrary
reward-grant endpoint.

## Exactly-once effect and replay

Two durable identities are stored in the existing `command_receipt` table:

- A UUID command `operationId` binds the normalized selection and command to its
  response. Matching retries replay it; changed selections conflict.
- The reserved `mail-claim:<mailUid>` identity, scoped by realm and owner, records
  each granted source message. It survives mailbox deletion and prevents another
  credit when the same message is retried under a different command ID or restored.

Per-message claim receipts have no expiry and must outlive source rows. Future
archival must preserve an equivalent durable claim guard.

The TCP adapter derives connection-scoped command UUIDs from legacy `_cok_` values,
as for inventory. Explicit operation IDs support whole-batch replay after reconnect.
Without them, a fresh individual request still replays the message claim, while a
fresh batch skips already claimed messages and returns only newly successful UIDs.
The returned operation ID is public; the `mail-claim:` namespace is reserved for the
repository and must never be used by other trusted command producers.

The foundation locks the realm epoch and player before message selection. Selected
mail rows are locked. Inventory, balance credits, mailbox flags, synchronization
markers, individual postings, per-message receipts and outbox events commit together
with the outer command receipt. Batch failure rolls back earlier messages in that
same batch. Existing claimed legacy mail without a durable receipt is never reissued.
Receipts are checked before relying on a restored unclaimed flag.

`mail.reward.claimed` outbox events retain the source UID, type, title, sender,
creation time and concrete attachment for future gift-log/achievement consumers.
Those downstream consumers are not activated here. They must deduplicate the full
realm/owner/request/event identity; at-least-once event delivery is not itself an
exactly-once consumer. `mail_update` supplies current read/reward flags independently
of optional notification delivery.

A replay returns its original snapshots, which can be older than subsequent player
activity. Reconnect or current-state queries refresh the authoritative values.
Do not reuse a mail UID for a new reward. Restoring a row with a used UID does not
restore redemption eligibility; operators must investigate inconsistent restores.

## Deployment and recovery

Deploy the complete stack after kingdom migration 0013 from topic 9 on every realm.
No migration is added here. Back up inventories, resources, profiles, mail,
mail-update markers, receipts, postings and outbox together. Do not run a legacy
mail writer beside the authoritative realm owner.

A timeout or lost reply after commit is resolved by retrying the operation/message,
not by resetting its claimed flag, deleting receipts or issuing a compensating grant.
Rollback the application artifact while retaining committed state and all durable
records. Restore complete consistent snapshots, never the mailbox alone. Older
artifacts can read the mailbox but lack this redemption implementation.

The exported inventory transaction helper requires a transaction already protected
by the foundation's realm fence and player lock. Mail redemption uses it inside that
transaction, not through a separately committing inventory grant. This distinction
is necessary for atomic reward source consumption.

## Audit and verification

The read-only Java audit covered the two registered mail reward handlers,
`MailFunction.receiveReward/rewardBatch`, concrete attachment construction,
`RewardManager.sendActivityReward`, mail label SQL, update-notice restrictions,
resource wire keys and world-cup classification. Legacy separate grant/flag commits
and silent unknown-category loss are deliberately not reproduced. No private Java,
mobile inputs or player data are included in the change.

The disposable PostgreSQL suite verifies concurrent independent command IDs,
overlapping single/batch selection, ledger and outbox cardinality, ownership,
legacy claimed state, rollback after an injected SQL marker failure, unsupported
mixed rewards, lost replies, deletion/restoration, numeric overflow, upgrade notices,
regular/advanced resources, DMM gold, PostgreSQL restart and stale owner rejection.
The core integration suite exercises actual authenticated SFS redemption and replay
in both realms. Rule tests cover parsing, aggregation and label bounds. The critical
mutation runner removes per-mail identity, claimed flags, owner selection and reward
credit; all must be detected. Existing inventory mutation tests guard the extracted
transaction helper against regressions.

Evidence targets maintained v12.06.0 server contracts. Native APK rendering and
other client tracks are untested. Pending reward domains above remain explicit
migration work; passing transaction tests does not certify those effects.
