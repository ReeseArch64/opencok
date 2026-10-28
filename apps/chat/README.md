# Chat service

Migrated from the independently maintained TypeScript chat application in the prior
OpenCok checkout. Apps compose services; shared contracts live in `contracts/chat`,
identity and room authorization in `identity/chat-*`, handlers in `controllers/chat-*`,
HTTP/WebSocket transport in `connection/chat-*`, PostgreSQL adapters in
`repositories/chat`, and configuration in `env/chat`. Imports use public package exports.

Server integration and operating evidence are recorded in the
[game integration guide](GAME_INTEGRATION.md). APK testing is explicitly excluded.

## Development

Install with `bun install --frozen-lockfile`. Run the root Compose `dev` profile to
start Chat, PostgreSQL and the existing global/kingdom migrations. The local stack
configures API discovery and realm session issuance automatically and publishes Chat
on port 8083. The advertised WebSocket URL is fixed at
`ws://192.168.1.104:8083/chat/ws` in code; see the
[stack guide](../../infra/compose/README.md). To run Chat on the host instead, stop
the Compose Chat service, configure the root `.env` or process environment, and run
`bun run --cwd apps/chat start`.

| Setting                  | Meaning                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------- |
| `DATABASE_URL`           | Required PostgreSQL connection URL; topology selects physical databases                 |
| `CHAT_SECRET`            | Required shared secret for trusted backend session, avatar and nickname requests        |
| `CHAT_MAILBOX_SECRET`    | Optional mailbox fallback for unmapped realms; otherwise uses `CHAT_SECRET`             |
| `CHAT_MAILBOX_SECRETS`   | JSON realm-to-key map; mapped realms accept only their selected key                     |
| `MONGO_URI`              | Authenticated MongoDB archive URI; PostgreSQL fallback remains available during outages |
| `GLOBAL_DATABASE_NAME`   | Default `opencok_global`                                                                |
| `CHAT_KINGDOM_DATABASES` | Default `1:opencok_kingdom_1,2:opencok_kingdom_2`                                       |

The entrypoint binds to `0.0.0.0:8083` with consumer ID `chat-local`; these values
are fixed in code. This entrypoint runs one Chat consumer per deployment. Additional
instances require distinct IDs supplied through application composition so each
consumer retains its own lease and cursor.

Configuration uses the shared root environment loader. Legacy MariaDB variables and
secret-file settings are replaced by these validated settings. Credentials are never
reported by startup errors. The database identity needs chat writes and read access
to the global account directory and configured kingdoms' profiles/alliance membership.
Avatar metadata publication also locks the account routing row; a restricted database
role needs the PostgreSQL UPDATE privilege on at least one `account_new` column for
`SELECT FOR UPDATE`, although this path never changes account fields.
The existing Drizzle migrations own the schema; startup never creates or resets it.

`/_health` reports maintenance readiness. `/api/v1global_config`, `/chat/server/links`
and `/chat/server/all` advertise the configured endpoint. Keep `POST /external/session`
private to trusted backend callers: it exchanges the signed legacy form for a random
one-day token, storing only its SHA-256 digest. `/chat/ws` requires `session` and `uid`
headers and binds the token to that identity.

Commands cover bootstrap, public/private room discovery and lifecycle, sends, sequence
history, contacts, blocks, moderation, reports, private mailboxes and social feeds.
The native SFS bridge and realm delivery consumer use the same persisted authority.
Each operation checks current identity, room membership and the authorized join interval.
Messages remain 1–500 Unicode code points; history pages are capped at 100. WebSocket
input is bounded at 16 KiB and output at 256 KiB. Duplicate sends share a persisted
message identity; cross-instance consumers deliver durable events after commit.

Global/alliance recent history closes at 24 hours and a verified MongoDB copy remains
available until seven elapsed days. Other public channels retain 24 hours; private
rooms/mailbox copies retain 30 days. Expiry is filtered before cleanup. Small tombstones
and receipts prevent replay resurrection. Maintenance is bounded, and MongoDB outages
preserve PostgreSQL bodies for archive fallback. See the complete
[topic-24 workflow, deployment and retention guide](../../docs/social-chat-migration.md).

## Operational telemetry

Compose supplies `OTEL_EXPORTER_OTLP_ENDPOINT=http://maple:4318` and the shared
`MAPLE_LOCAL_INGEST_KEY`. Chat uses the same validated telemetry settings and Evlog
exporter as server/API, under service name `chat`. HTTP/WebSocket operational logs,
HTTP latency and process metrics, and controlled error spans are exported without
message bodies, player identities or credentials. Existing shared database
instrumentation contributes dependency spans. The exporter starts before application
resources and flushes after resource cleanup, including startup failure. Maple
availability does not gate Chat readiness. Without an OTLP endpoint, console logging
continues. See the [local Maple guide](../../infra/compose/README.md#observability).

## Validation and limits

Run `bun run --cwd apps/chat check-types`, `bun run --cwd apps/chat test` and
`bun run --cwd apps/chat test:integration`. Integration creates disposable PostgreSQL and MongoDB
containers, applies the real migrations, checks both realm lookups, concurrent writes,
Unicode, exact expiry and persistence after restart. It does not touch local game data.

Android tracks are untested. The TypeScript realm supports `chat.session.create`
when `CHAT_URL` selects this service's HTTP origin and
`CHAT_SECRET` matches. It binds issuance to the authenticated realm profile and
returns the opaque token and second-based expiry. Units compose both sides with the token verifier; actual realm TCP, Chat HTTP/WebSocket,
API metadata and disposable database acceptance now exercise the full server flow.
Native-client behavior remains unverified. The shared API/gateway now exposes the three public metadata GET routes
when `CHAT_URL` points to this service's HTTP origin. Chat remains the source of
configuration and readiness; the proxy forwards no caller credentials or query strings.
The advertised WebSocket URL fixed in the entrypoint must be directly reachable because the shared gateway
does not proxy `/chat/ws` or expose `/external/session`. See the
[API discovery contract](../api/README.md#public-chat-discovery) and the
[realm session contract](../server/README.md#realm-chat-sessions) for bounds and errors.
Topic 24 implements durable cross-instance fanout, private workflows, moderation and the
seven-day global/alliance archive. See the linked migration guide for operating limits.
Production Node execution remains pending
[ADR-0010](../../docs/decisions/0010-adopt-nodejs-for-production.md); the Dockerfile is
for Bun development, matching the existing API/server images.

Back up the global database and kingdom databases consistently. Roll back the service
image/code and configuration together. The additive global migration described below
must be applied through the normal deployment workflow before this version becomes ready;
startup only checks it and never applies it.
Existing MariaDB data is not imported. Keep session issuance secrets stable across
restarts; rotate only with coordinated backend configuration.

## Internal avatar metadata

[Issue #80](https://github.com/ReeseArch64/opencok/issues/80) adds exact
`POST /_internal/avatar-profile`, private to trusted backends and excluded from the
public discovery gateway. This maintained service protocol is not the legacy external
chat API. `CHAT_SECRET` authenticates it with HMAC-SHA256 over the protocol domain,
method, path, timestamp and complete UTF-8 JSON body. `x-opencok-timestamp` carries canonical
milliseconds and must be within 30 seconds of the receiver clock; `x-opencok-signature`
carries lowercase hexadecimal HMAC. Session MD5 compatibility remains separate. Use a
trusted private network or TLS; the shared secret authenticates trusted backend callers,
not individual realms independently. Rotate both service configurations together.

Requests contain owner, realm, avatar sequence/version, captured millisecond time, exact
second marker, user name and platform. Bodies are limited to 4 KiB, names/platforms to
255 UTF-16 units and the whole handler to three seconds, including body consumption.
Responses expose only the acknowledged owner/realm/sequence and disposition; errors
contain no supplied metadata or dependency details. A timed-out database write may still
commit, so callers retry the same captured intent rather than generate a new one.

`repositories/chat-avatar-profile` owns `opencok_chat.chat_avatar_profile` in the global
database. Generated migration `0002_chat_avatar_profiles` adds seven non-null fields with
a compound owner/realm primary key and range checks. Publication locks the global account
row before the projection, requires the canonical current realm string and serializes
first inserts for that owner. No cross-database atomicity is assumed. A larger avatar
sequence replaces the snapshot even if its clock time decreased; an equal sequence must
match captured version, timestamp and platform, plus the name until a rename receipt
exists. A smaller sequence is acknowledged as superseded without writes.
`find` reads the projection only while the global routing row still points to its realm.

This remains an avatar-event projection with the nickname protocol below. Other profile
mutations, transfer reconciliation and restoring databases independently need their own
protocols. Old realm snapshots are not exposed after routing changes and
are retained without automatic deletion. Public room frames and session userinfo handling
do not consume or expose this projection yet. The receiver and readiness check are
composed by `apps/chat`; the realm now supplies opt-in command and recovery composition
through `GAME_AVATAR_CHAT_URL` as described in the [realm runbook](../server/README.md#avatar-completion-runtime). Unit evidence
uses the real adapters with synthetic SQL clients and in-memory HTTP handlers. Migration
application and concurrency now have disposable PostgreSQL evidence; mobile client
integration remains unvalidated.

## Internal nickname updates

Exact `POST /_internal/nickname` is private to trusted backends. The public gateway does
not forward it. It uses the existing `CHAT_SECRET` and timestamp/signature
headers with a distinct `opencok-chat-nickname-v1` HMAC domain, method, path and complete
UTF-8 body. The 4 KiB body and three-second receiver deadline match the avatar endpoint.
Keep this endpoint on a trusted private network or TLS and rotate both service secrets
together. There is no new public client endpoint or configuration variable.

The strict JSON body contains `owner`, `kingdomId` and `operationId` only. The UUID must
identify a global `nickname_change_receipt` owned by that player and kingdom. The receiver
locks the global account, checks its current route and reads the current account name;
it never accepts a name supplied by the caller. It refreshes only `user_name` in an
existing Chat avatar projection and reports `applied` or `unchanged`. An absent projection
requires no insert: its first avatar publication will use the committed account name.

After any committed rename receipt exists for that owner/kingdom, avatar publication
reads the current account name after acquiring the account lock, in a new read-committed
statement. Old or higher-sequence avatar events cannot replace that name with a captured
pre-rename name. Avatar versions, timestamps and platforms retain their existing
conflict checks. Older nickname operation retries also project the current account name,
so delayed delivery cannot undo a later successful rename.

Apply global migrations `0003_nickname_change_receipts` and
`0004_nickname_receipt_owner_lookup` before this Chat version. Readiness verifies the
receipt table. The owner/kingdom index bounds receipt lookup work; there is no new table
or field beyond the rename journal/receipt migration. Keep these additive migrations
when rolling application code back, and retain receipts for safe replay.

The realm publisher checks the acknowledged owner/kingdom/UUID/disposition before the
owned journal's Chat bit can clear. HTTP loss, SQL acknowledgment failure and timeouts
leave retryable work. Real Chat application HTTP and disposable PostgreSQL tests cover
these failures, concurrent account-lock/rename publication, delayed avatars, separate
kingdoms, no-avatar owners and restart persistence. The nickname command, remaining
effects and background relay are still pending under
[issue #89](https://github.com/ReeseArch64/opencok/issues/89). Public room frames and
session userinfo do not yet consume this projection.

## Mailbox read and deletion effects

`POST /_internal/mailbox` accepts realm-signed, owner-scoped mailbox read/delete
operations. Its domain-separated HMAC covers the exact body and timestamp; requests
expire after 30 seconds. The receiver bounds JSON bodies to 4 KiB, enforces strict
operation fields, and acknowledges only committed effects with the same realm,
owner, operation ID and effect index.

For isolated mail Workers, configure `CHAT_MAILBOX_SECRETS` as a JSON object mapping
positive realm IDs to distinct nonempty keys. Provide only the selected realm key
as `MAIL_WORKER_CHAT_SECRET` to its Workers process. Chat uses the signed payload's
realm to select the expected mailbox key. A mapped realm accepts only that key;
another mapped realm's key or either fallback key is rejected. Session, avatar
and nickname routes continue using `CHAT_SECRET`.

Unmapped realms retain `CHAT_MAILBOX_SECRET`, falling back to `CHAT_SECRET` when
the optional mailbox route key is absent. This permits gradual local-delivery
rollout. Every external-worker realm must have a map entry, and its worker must
receive only the mapped key. Mapped values must differ from one another and from
both fallback keys; configuration rejects duplicates.

Deploy matching Chat and Server support first. Configure the map on Chat and the
matching realm key on Server through `CHAT_MAILBOX_SECRET` or its optional map
while delivery remains local, then follow the [Workers cutover](../workers/README.md#cutover-and-rollback).
Keep entries for every external-worker realm that still delivers mailbox effects.
Retain the appropriate fallback for remaining local realms during the transition.

Global migration `0005_chat_mailbox_effects.sql` adds owned private-message copies
and durable operation receipts. The consumer marks or removes matching
`chat_mailbox_message` rows within the owner/realm, peer and chat categories at or
before the request's cutoff. Empty peer selects all conversations in those
categories. Later messages and other owners' copies are untouched. Receipt and
message changes commit together; replay returns unchanged, while a reused operation
identity with a different payload is rejected. The maintained mailbox reader reads
these same affected rows. No public room message is targeted.

These tables hold the maintained representation of authorized historical private
message copies. Existing legacy copies require an explicit owner/realm import before
cutover; creating the table does not migrate legacy messages. Topic 24 adds sending, current permissions, blocks and explicit 30-day private retention.
The legacy mailbox import boundary remains explicit; source reference files are not
player-data fixtures.

The realm stores outgoing intents atomically with mailbox mutations and retries
after outages or lost acknowledgments. Apply the global migration before enabling
the realm publisher. Keep receipts for replay recovery; do not truncate them while
an older realm intent can still be retried. Rollback should disable new admission,
drain pending intents and retain both receipts and message state before reverting
binaries. No existing message body or reward is modified by the schema migration.
