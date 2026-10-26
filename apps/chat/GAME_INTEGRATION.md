# Basic game and chat integration

Topic 8 connects the existing realm session issuer, shared API discovery and Chat
room service. This scope covers kingdom, original kingdom, alliance, global and
language text rooms. It does not certify every legacy chat command. APK testing
is excluded by the current request; transport tests do not establish native UI
compatibility on v12.06.0 or other tracks.

## Configuration and activation

Apply the existing global and kingdom migrations before starting Chat. No new
migration is introduced by this integration. Chat uses the configured global
account directory to select each player's authoritative kingdom database.

| Process         | Configuration                                                      | Purpose                                                        |
| --------------- | ------------------------------------------------------------------ | -------------------------------------------------------------- |
| Chat            | `DATABASE_URL`, `CHAT_KINGDOM_DATABASES`, `GLOBAL_DATABASE_NAME`   | Persistent sessions/messages and authoritative room membership |
| Chat            | `CHAT_HOST`, `CHAT_PORT`, `CHAT_WEBSOCKET_URL`                     | Listener and client-reachable `ws(s)://host/chat/ws` endpoint  |
| Chat and realms | `CHAT_SIGNING_SECRET`                                              | Matching backend session signing secret                        |
| Realm           | `GAME_CHAT_SESSION_URL=http://chat.internal:8083/external/session` | Trusted internal session issuer                                |
| API             | `API_CHAT_URL=http://chat.internal:8083`                           | Origin for the three public metadata routes                    |

The local Compose stack starts one Chat instance and configures the realms and API
to reach it over service DNS. It publishes port 8083 and accepts `CHAT_WEBSOCKET_URL`
as the advertised client address. For separate deployments, use deployment-owned
URLs and secrets and start Chat with `bun run --cwd apps/chat start`. Its
WebSocket endpoint must be directly reachable by the client. The public API
proxies metadata only; it never forwards `/external/session`, internal mutation
routes or WebSocket traffic. Restrict the Chat session/internal routes to trusted
backend callers through the deployment's ingress/network policy. Use TLS or a
trusted private network between services; client endpoints require appropriate
TLS outside local development.

`/_health` on Chat becomes ready after schema checks and expiry cleanup. API
`/readyz` and game discovery remain independent of Chat availability. Public
`/api/v1global_config`, `/chat/server/links` and `/chat/server/all` return the
configured endpoint with no-store caching. Disabled discovery is 404; upstream
failure is 503. A metadata response is not proof the advertised public WebSocket
is reachable from a device.

## Player flow and guarantees

1. An authenticated realm connection calls `chat.session.create`. The current
   profile supplies identity and user information; caller-selected identity is
   ignored. Issuance requires the realm authority fence. The response contains an
   opaque `session` and second-based `expire`, valid for one day.
2. The client obtains the public Chat configuration and connects to `/chat/ws`
   with `session` and `uid` headers. Only a digest is stored in PostgreSQL. Neither
   secrets nor tokens belong in client configuration files or logs.
3. After `login.success`, bootstrap commands are acknowledged. Room discovery and
   `room.joinMulti` validate persisted realm/language/alliance membership. A failed
   join does not partially subscribe the connection.
4. `chat.room` persists a 1–500 Unicode-code-point text message before acknowledgment
   and durable distribution. NUL and malformed Unicode are rejected. A retry with the
   same sender, room and `sendTime` returns the existing sequence only if its body
   matches. Changed content returns `invalid_message` and leaves history intact.
5. `history.roomsv2` and `history.roomv2` require both a socket subscription and
   current authorization. History contains at most 100 unexpired messages in
   sequence order. Reconnect requires rejoining rooms, then fetching history.

Established sockets revalidate the persisted token before each command, including
bootstrap. Expired/revoked tokens produce `unauthorized` and close code 1008; an
unavailable verifier returns `unavailable` without executing the handler. Broadcast
recipients also revalidate their token before delivery. An idle socket is not
proactively disconnected at the expiry instant, but cannot act or receive new
room messages after a failed verification. These are operation-time checks, not
cross-database atomic revocation guarantees.

Room authorization is refreshed on send, history and delivery. Leaving an alliance
invalidates access even on an existing subscription. Realm/session HTTP exchanges
and WebSocket dependencies have bounded deadlines; a timeout may occur after a
message commits. Retry the same `sendTime` and body and reconcile history. An
accepted send survives receiver disconnection or process restart.

## Recovery and boundaries

Topic 24 replaces local fanout with a durable PostgreSQL event log, leased consumers,
a native realm delivery bridge and explicit sequence/archive history. It adds contacts,
blocks, direct mailboxes, private rooms, moderation, feeds, realm postbox/mines and paid
notice reconciliation. Authorization is checked again before delivery and on history;
logout revokes established tokens. Global/alliance retention is 24 hours recent plus an
archive until seven days; other channel policies are explicit.

Read the [topic-24 migration guide](../../docs/social-chat-migration.md) before deployment
or rollback. It documents both migrations, MongoDB configuration, original expiry
preservation, tombstones, replay recovery, bounded cleanup and compatibility limits.

## Verification

`apps/server/integration/chat-lifecycle.test.ts` runs actual realm TCP/SFS, Chat
HTTP/WebSocket, API metadata HTTP and disposable PostgreSQL/Redis/ZooKeeper. It
covers two realms, authoritative session identity, metadata/private-route
separation, kingdom/global/language messages, alliance membership removal,
idempotent retry/content conflict, empty/foreign-room history, Chat outage,
unrelated realm/API availability, Chat restart, reconnect and session expiry.
API account/directory collaborators in that test are synthetic because only the
Chat metadata path is under acceptance; existing API discovery tests cover their
own workflows. All test players and services are disposable.

The Chat PostgreSQL integration additionally verifies concurrent duplicate
inserts, exact expiration, invalid Unicode, mismatched receipt content and database
restart persistence. Unit tests cover forged identity, room authorization,
message/history bounds and expired broadcast recipients. Run suites separately
because server logging tests configure process-global logging state:

```sh
bun run --cwd apps/server test
bun run --cwd apps/api test
bun run --cwd apps/chat test
bun run --cwd apps/chat test:integration
bun --no-env-file test apps/server/integration/chat-lifecycle.test.ts
bun --no-env-file apps/chat/scripts/mutate-chat.ts
bun run lint
bun run format:check
```

The mutation check removes established-session validation and expired-recipient
filtering in temporary bundles; both mutants must fail tests. Original sources
are not modified. APK/emulator execution and client screenshots are intentionally
not part of this acceptance.
