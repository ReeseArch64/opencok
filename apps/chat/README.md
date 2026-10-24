# Chat service

Migrated from the independently maintained TypeScript chat application in the prior
OpenCok checkout. Apps compose services; shared contracts live in `contracts/chat`,
identity and room authorization in `identity/chat-*`, handlers in `controllers/chat-*`,
HTTP/WebSocket transport in `connection/chat-*`, PostgreSQL adapters in
`repositories/chat`, and configuration in `env/chat`. Imports use public package exports.

## Development

Install with `bun install --frozen-lockfile`. Run the root Compose `dev` profile to
provision PostgreSQL and the existing global/kingdom migrations. Configure the root
`.env` or process environment, then run `bun run --cwd apps/chat start`.

| Setting                  | Meaning                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `DATABASE_URL`           | Required PostgreSQL connection URL; topology selects physical databases         |
| `CHAT_SIGNING_SECRET`    | Required shared secret for trusted backend session and avatar metadata requests |
| `CHAT_WEBSOCKET_URL`     | Required public `ws(s)://host/chat/ws`, without credentials/query/fragment      |
| `CHAT_HOST`, `CHAT_PORT` | Listen address, default `127.0.0.1:8083`                                        |
| `GLOBAL_DATABASE_NAME`   | Default `opencok_global`                                                        |
| `CHAT_KINGDOM_DATABASES` | Default `1:opencok_kingdom_1,2:opencok_kingdom_2`                               |

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

The imported commands cover bootstrap, global/language room discovery, atomic room
joins, room sends, and history. Every room operation checks persisted membership;
player lookup uses the authoritative global account's realm, never a fixed kingdom.
An unset original realm falls back to the current realm. Messages remain 1–500 Unicode
code points, history is capped at 100, frames/forms at 16 KiB. Concurrent duplicate sends
share one database receipt and produce one local broadcast. Numeric wire sequences
fail closed if PostgreSQL values exceed JavaScript's safe integer range.

The imported retention is 24 hours for all messages and sessions. Expiry filters apply
before cleanup, which deletes up to 500 of each every minute. Maintenance runs cannot
overlap. Database queries have bounded deadlines. SIGTERM/SIGINT close sockets and pools.

## Validation and limits

Run `bun run --cwd apps/chat check-types`, `bun run --cwd apps/chat test` and
`bun run --cwd apps/chat test:integration`. Integration creates disposable PostgreSQL
containers, applies the real migrations, checks both realm lookups, concurrent writes,
Unicode, exact expiry and persistence after restart. It does not touch local game data.

Android tracks are untested. The TypeScript realm now supports `chat.session.create`
when `GAME_CHAT_SESSION_URL` targets this service's internal `/external/session` route and
`CHAT_SIGNING_SECRET` matches. It binds issuance to the authenticated realm profile and
returns the opaque token and second-based expiry. Socket-free units compose both sides
with the existing token verifier; live cross-service and native-client behavior remain
unverified. The shared API/gateway now exposes the three public metadata GET routes
when `API_CHAT_URL` points to this service's HTTP origin. Chat remains the source of
configuration and readiness; the proxy forwards no caller credentials or query strings.
The advertised `CHAT_WEBSOCKET_URL` must be directly reachable because the shared gateway
does not proxy `/chat/ws` or expose `/external/session`. See the
[API discovery contract](../api/README.md#public-chat-discovery) and the
[realm session contract](../server/README.md#realm-chat-sessions) for bounds and errors.
Broadcast is process-local: deploy one chat instance until cross-instance
fanout is implemented. Seven-day archives, durable replay receipts after cleanup,
moderation and direct messages remain future work; the imported 24-hour behavior does
not satisfy the full target architecture. Production Node execution remains pending
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
chat API. `CHAT_SIGNING_SECRET` authenticates it with HMAC-SHA256 over the protocol domain,
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
match all captured fields; a smaller sequence is acknowledged as superseded without writes.
`find` reads the projection only while the global routing row still points to its realm.

This is an avatar-event projection, not a general current-profile authority: name edits,
other profile mutations, transfer reconciliation and restoring databases independently
need their own protocols. Old realm snapshots are not exposed after routing changes and
are retained without automatic deletion. Public room frames and session userinfo handling
do not consume or expose this projection yet. The receiver and readiness check are
composed by `apps/chat`; realm command/relay composition is still pending. Unit evidence
uses the real adapters with synthetic SQL clients and in-memory HTTP handlers. Migration
application, real transaction concurrency and client integration remain unvalidated.
