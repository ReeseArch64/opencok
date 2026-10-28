# Social sharing

`@opencok/share` owns the existing social feed after #687, a package-level W08/W20
migration under #558 and [domain layout policy](../../.github/ARCHITECTURE.md#domain-package-migration-convention). The four commands are `chat.feed.send`,
`chat.feed.get`, `chat.feed.del` and `chat.feed.notice.del`. Share accepts the
existing opaque feed data; this does not establish a dedicated battle-report
renderer or emulate the legacy Firebase reader.

| Responsibility                                        | Owner                           |
| ----------------------------------------------------- | ------------------------------- |
| Feed send/read/delete/notice use cases                | `services/feed`                 |
| Send admission and owner/alliance visibility          | `rules/feed`                    |
| Normalized feed fields and persisted/response objects | `mappings/feed`                 |
| Six feed-specific input fields                        | `validations/feed`              |
| Feed state, transaction, runtime and envelope ports   | `contracts`                     |
| Transactional rows and notices                        | `repositories/feed`             |
| Existing bounded expiration and health check          | `repositories/feed-maintenance` |

## Composition and transaction boundaries

`apps/chat/src/composition/share.ts` supplies the real UUID generator and
`ChatCommandError`. `composition/chat-persistence.ts` supplies both repositories.
Chat application and signed realm-social composition construct the shared social
service with the owned planner and feed normalizer. All repository consumers,
including integration fixtures and the separate Chat worker, use this composition.

Chat retains identity loading, legacy relation import, ban/mute gates, the
`chat:append` lock, receipt lookup/hash/conflict handling, transaction clock,
generic event writing and process authority. Feed planning executes at its
original position after admission. The shared transaction binds the six owned
persistence methods without moving other social operations. Contacts, rooms,
moderation and HTTP/WebSocket/SFS transport keep their existing owners.

The complete 19-field operation object still reaches receipt hashing in its
original property order. The owned normalizer supplies only the same six final
feed properties; aliases, cursor validation, member deduplication and other fields
remain present even for feed commands. Read-only feed queries retain their receipt
exception. Existing saved receipts are not reinterpreted.

## Preserved feed behavior

Feed IDs retain owner, transaction timestamp and the UUID prefix. Expiration stays
30 days from that timestamp. Owner visibility and alliance visibility retain the
current realm and membership checks. The numeric values 101 and 102 still require
an accessible root parent; only 101 permits an empty message. Their semantic names
are not inferred. Feed data remains an uninterpreted string with the same bound.

Notice validation retains the 50-entry check before deduplication, membership
checks, blocking and event order. Notice eligibility retains its existing lack of
a separate realm predicate; feed visibility still enforces the realm check.
Deletion retains its distinct truthy GM and
moderation test. Soft deletion updates the selected feed and its children, clearing
the stored body. Listing retains expiry/deletion filtering, descending time/ID
ordering and the 100-row limit. Physical cleanup selects at most 500 expired rows,
removes their notices first and then removes the feeds, using the same sequential
database calls. It introduces no transaction or fence.

## Migration and remaining adapters

| Former implementation                                             | Destination                       | Remaining integration                                                        |
| ----------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- |
| Feed branches and access predicate in Services `chat-social-plan` | Owned Service, policy and Mapper  | Shared planner delegates at the original position after common gates         |
| Feed fields in Services/Validations `chat-social`                 | Owned envelope Mapper and schemas | Shared normalizer/schema retain other commands and compose the owned fields  |
| `SocialFeed` and six shared transaction methods                   | Owned feed/store contracts        | Shared Chat transaction extends the owned port; old feed declaration removed |
| Six Repositories `chat-social` method bodies                      | Owned transactional repository    | Shared receipt transaction binds application-supplied instance               |
| Feed cleanup and health in Repositories `chat`                    | Owned maintenance repository      | Existing maintenance and health sequence calls application-supplied instance |

The global Chat command registry remains a transport declaration. Shared Chat
adapters remain necessary while contacts, rooms and moderation are migrated; they
do not retain a second feed implementation. Their eventual retirement is #558
W20 work. Share imports no horizontal Services, Repositories, Rules or Contracts.
Its direct dependencies are existing Drizzle, Drizzle ORM and Zod versions.

## Validation and operations

The previous maintained suites had no direct `chat.feed.*` cases. This delivery
adds owned and PostgreSQL feed tests and retains the existing Chat/Server suites.
Run Chat and Server suites in separate processes because logging configuration is
global. Parent comparisons cover complete planning/normalization, schemas,
transaction and maintenance flows, including SQL bodies and operation order.

Owned Share tests pass seven cases/59 assertions; four new PostgreSQL/WebSocket
cases pass 50 assertions. The complete Chat integration suite passes six cases/151
assertions; Chat unit tests pass nine/52. Package tests pass 475 cases/558,182
assertions, and Server tests pass 1,506 cases/245,728 assertions with one snapshot.
Core/chat/nickname integrations pass 29 cases; avatar passes its isolated retry
with 26 assertions. The initial avatar attempts encountered a game-initialization
timeout and MinIO startup 503 respectively; no code or timeout was changed to
obtain the passing retry. Eight Service and 27 persistence comparisons pass.
Seven affected workspace type checks, architecture tests/types, frozen install,
lint, formatting and both builds pass; the architecture baseline remains 69.

Deploy or roll back the complete Chat and realm artifacts and lockfile. No SQL
schema, saved identity, environment or client asset conversion is introduced.
Preserve feeds, notices, operation receipts and pending Chat events. Source
ownership does not move the authoritative process or establish native-device,
production-load or dedicated report-presentation acceptance.
