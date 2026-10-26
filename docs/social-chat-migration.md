# Topic 24: social and chat workflows

Tracking: [issue 384](https://github.com/ReeseArch64/opencok/issues/384), following
[the migration discussion](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19182381).
The implementation follows [chat ownership and retention](architecture/clients-and-services.md#20-global-and-alliance-chat-delivery-archiving-and-deletion).
Reference inputs remain read-only and are not runtime dependencies.

## Ownership and behavior

Chat owns contacts, favorites, blocks, private rooms, reports, moderation, feeds,
private mailbox copies and public transcripts in the global PostgreSQL database.
Rules and application plans live in Services/Rules; transaction adapters implement
contracts in Repositories. Controllers handle HTTP, WebSocket and SFS boundaries.
The global account directory selects each player's current realm. Every command,
history request and delivery checks current identity and membership. Alliance history
also excludes messages preceding the current membership interval. Private rooms use
the current join interval, enforce founder permissions and transfer ownership to the
oldest remaining member when the founder leaves.

Native commands include contact application, acceptance, favorites, descriptions,
deletion, Facebook favorites backed by verified account bindings, shields, private
messages, reporting, chat/notice bans, private room lifecycle, feeds and history.
Direct sends persist separate owned sender/recipient mailbox copies, including an
explicit sender identity. Existing mailbox read/delete intents remain authoritative;
cutoff records prevent a late insert or replay from restoring a deleted copy.

On first access, Chat imports an owner's existing contact shards and shields once.
The import marker survives contact/block deletion, so old realm rows cannot recreate
removed relationships. Imported shield IDs remain valid for unblocking. Client-supplied
names and Facebook names never replace the authoritative sender identity.

Postbox, friendship mines and notice costs remain realm-owned. Postbox distribution,
item/gold expenses, daily counters, reward draws, seal grants and command receipts
commit together. Foreign mailbox/relation IDs cannot authorize access. Bundled postbox
configuration retains its original closed seasonal dates; migration does not reopen
that event. Tests open a synthetic period to exercise the workflows.

Friendship helpers are conserved per mine generation. Digging consumes the completed
helper requirement once, records the selected rewards once, advances experience and
starts the configured cooldown. Cross-realm help enters a durable Chat inbox. The
owner realm applies it with its current fencing epoch and an idempotent receipt;
expired or superseded generation commands cannot contribute to a later cycle.
Call-help notifications also use the realm outbox and durable Chat distribution.

Paid notices check current Chat permission before charging. The realm commits the
expense and publication intent together and returns pending status. Chat publishes
only an intent proven by the realm's stored receipt/outbox, using the original server
confirmation time. Retries preserve that time and cost. After the original deadline,
Chat checks its retained message identity: an unpublished notice is refunded once to
the original item or gold pools, while an already published notice is not refunded.
Unavailable verification leaves reconciliation pending. Retry scheduling lets other
notices continue past a temporarily undeliverable intent.

## Delivery and authorization

Every accepted message and its distribution event commit in one PostgreSQL transaction.
An append lock orders event allocation and commit, avoiding a cursor advancing past
an earlier uncommitted sequence. Each Chat instance has a leased, fenced consumer and
persisted cursor. Polling recovers without Redis; Redis is not an authoritative log.
Stable event/message IDs allow clients to deduplicate delivery after uncertain acknowledgments.

Both Chat WebSocket consumers and the native realm socket bridge consume that log.
The realm bridge verifies the current PostgreSQL realm epoch and instance, including
ordinary social commands, polling and acknowledgments. Replacing a realm invalidates
its previous producer and consumer. Recipient lists come from active realm connections;
Chat checks their current realm and visibility before returning message bodies.
Owner chunks share a captured event boundary before the realm acknowledges its cursor.

History supports a stable exclusive sequence cursor and an explicit archive selector.
Expired/deleted messages are filtered independently of physical cleanup. Blocks and
membership revocation apply to history, archive and delivery. Session logout deletes
opaque tokens and publishes revocation; established sockets revalidate the session
before commands and events. Permanent account flags and timed account bans also revoke
access. Chat mutes prevent sending while preserving authorized reads.

Input queues are serialized and limited to 32 commands per socket. WebSocket output is
bounded at 256 KiB; slow clients close with 1013 and reconcile history. Cursor gaps
request resynchronization. HTTP/SFS exchanges have bounded input, output and dependency
deadlines. A transport timeout may follow a committed operation: reuse its operation ID
or send time, then reconcile persisted state.

## Retention and storage

| Data                                            | Application visibility                                      | Body storage and cleanup                                                          |
| ----------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Global/alliance messages                        | Recent before 24 hours; archive from 24 hours to seven days | PostgreSQL body until verified MongoDB copy; original expiry at 168 elapsed hours |
| Country/original/language messages              | 24 elapsed hours                                            | PostgreSQL, with body removal after expiry                                        |
| Private-room messages and direct mailbox copies | 30 elapsed days                                             | PostgreSQL; owned deletion takes effect immediately                               |
| Postbox letters, replies and relations          | 30 elapsed days                                             | Realm PostgreSQL, including redaction of expiring command/outbox bodies           |
| Social feeds and reports                        | 30 elapsed days                                             | Chat PostgreSQL                                                                   |
| Distribution events and mine inbox commands     | 24 elapsed hours                                            | PostgreSQL; transcript bodies are referenced rather than duplicated               |
| Chat session tokens                             | 24 elapsed hours or explicit revocation                     | SHA-256 digest in PostgreSQL                                                      |

Dates use UTC elapsed durations, never a calendar-day approximation. Small message
identity/hash/tombstone records remain for replay protection. Economic ledger postings
remain audit records. Expired pending notice intents keep only routing/confirmation
metadata for refund reconciliation; expired request/response text is redacted.

MongoDB writes preserve message ID, version, content hash and original deadline. Chat
reads the copy back and verifies it before compacting the PostgreSQL body. During a
MongoDB outage, the recent view still closes at 24 hours and the archive can read the
pending PostgreSQL copy. Deletion persists a PostgreSQL tombstone and a body-free MongoDB
version barrier, preventing a delayed archive upsert from recreating removed content.
Application filters enforce expiry even when MongoDB TTL cleanup is delayed.

The first adapter pins `mongo:8.0.34` and Node driver `mongodb@6.21.0`, exercised under
Bun 1.4.2. See the [MongoDB 8.0 release notes](https://www.mongodb.com/docs/manual/release-notes/8.0/)
and [driver compatibility documentation](https://www.mongodb.com/docs/drivers/node/v6.21/reference/compatibility/).
This implements the accepted MongoDB archive decision without adding an ODM or changing
PostgreSQL authority.

Maintenance runs every minute with bounded batches and a bounded archive budget.
`chat.archive/unavailable`, `chat.archive/retention_backlog`,
`chat.retention/retention_backlog` and `social_retention_backlog` identify work requiring
operator attention. Alert on repeated failures or backlog lasting five minutes; restore
the dependency and let reconciliation resume. Cleanup throughput is finite, so sustained
traffic/backlog needs monitoring and capacity appropriate to the deployment.

## Deployment and recovery

Apply the topic-24 global and kingdom migrations before starting the new Chat/realm
binaries. They add social/distribution state, nullable archived message bodies, mailbox
sender/expiry data and expiring/retryable realm outbox records. Existing global/alliance
rows derive their deadlines from their original timestamps, not migration time. Existing
mailbox copies receive an explicit 30-day deadline.

Stop Chat consumers and affected realm writers for the coordinated binary/migration
upgrade; do not mix older chat retention code with the new writers. No player reset,
inventory reset or queue reset is part of deployment. PostgreSQL remains the authority.
Back up global and realm databases consistently before applying migrations.

Configure `MONGODB_URI` with a database name and authentication. Local Compose supplies
an authenticated MongoDB service, an internal network and a named data volume, with no
host port. `MONGODB_USER`/`MONGODB_PASSWORD` configure local initialization; use URI-safe
credentials or an explicitly encoded URI. `CHAT_INSTANCE_ID` must be stable and unique
per running Chat instance; its lease prevents simultaneous consumers sharing an ID.
The development Compose default is `chat-local`. Keep `CHAT_SIGNING_SECRET` coordinated
with realm configuration and keep `/_internal/social` private or behind trusted TLS.

MongoDB is optional for readiness: an outage preserves PostgreSQL bodies and produces
an archive failure signal. It does not turn the optional Chat dependency into a realm
login requirement. Redis loss does not remove the persisted distribution cursor.

Restore into an isolated deployment first, run expiry/reconciliation, then serve players.
A backup may contain already expired content; application filtering applies immediately,
and physical cleanup must complete after restore. Rollback requires coordinated compatible
binaries and a reviewed data plan: older Chat code does not understand compacted bodies,
new retention, cursors or tombstones. Do not drop social tables or recreate volumes to
roll back. Session secret rotation alone does not revoke existing opaque tokens.

## Validation and compatibility limits

Automated acceptance uses disposable PostgreSQL and MongoDB containers and synthetic
players in two realms. It exercises concurrent receipts, restart recovery, contact and
block state, private copies, private room revocation, moderation expiry, original archive
deadlines, MongoDB copy verification, real WebSocket delivery across two separate Bun processes and history recovery after a consumer process restart,
signed SFS calls, native room/message envelopes and control history, distinct legacy/sequence channel values, mixed chat/mail polling, native realm delivery, cross-realm helper processing, session revocation
and stale realm rejection. Realm integration also verifies postbox costs/seals/daily limits,
notice compensation, mine helper conservation, random reward replay and economic fencing.

Run the Chat and server suites separately because logging configuration is process-global.
Run `bun run lint`, `bun run format:check`, workspace type checks, Chat integration and the
new realm social integration tests. The existing full Chat lifecycle acceptance remains
a compatibility check for the earlier API/session/discovery integration.

Android/APK execution, client UI rendering, production load and real account transfers
between realms are not validated here. Translation, translation feedback and Mi account
binding explicitly report provider unavailability; this migration does not impersonate
external services. The legacy Firebase feed reader is not emulated; maintained feed
commands use Chat-owned storage and require corresponding client/provider integration.
Existing media ownership and storage stay with the API file lifecycle.
