# Mail domain

Mail owns the existing system-mail leaf contract and the gift-opening/Chat mailbox
integration delivery workflows. `AvatarSystemMail` moved unchanged to
`src/contracts/system-mail.ts` in [#653](https://github.com/ReeseArch64/opencok/issues/653)
so Tasks can describe rollover mail without depending on broad shared Contracts.
The historical interface name is retained. Mailbox gameplay mutations, reward
claims and avatar/postbox workflows remain with their current owners under
#552/#553 and #558 W11.

## Integration delivery ownership

`repositories/gift-opening-relay` owns the existing global gift-log projection and
realm queue acknowledgment. `repositories/chat-relay` owns delivery of already
committed read/delete intents to Chat. `contracts/chat-mailbox` describes the
unchanged update and publisher port; the existing connection adapter signs the
HTTP request and checks its acknowledgment. The new integration Service owns
bounded, independent polling queues, readiness, backlog observations and drain.
Application composition supplies the actual databases and publisher.

Gift delivery locks up to 100 realm `mail_gift_opening` rows in their existing
order with `FOR UPDATE SKIP LOCKED`. It commits the global `mail_gift_log` updates
before deleting those realm rows. Matching still uses mail ID, send time and
recipient; only `isOpened` and `receiveTime` change. Missing logs remain acknowledged
no-ops. A crash after the global commit leaves the realm intent available, and
replay applies the same projection again. This is not a distributed transaction
or exactly-once transport, and it never grants a gift reward.

The global gift log has no kingdom column. Its two projection fields have one
explicit global integration responsibility across realms. Per-realm queue
credentials do not create row-level realm isolation inside that global table.
Gameplay fields such as rewards, thanks and balances remain outside this worker's
write permissions.

Chat delivery locks one intent while posting to the signed mailbox endpoint. Chat
commits its own deduplicated update/receipt before acknowledging; only a valid
acknowledgment permits deletion of the realm intent. The operation/effect identity,
realm, recipient, action, cutoff and request bytes retain their existing behavior.
Lost acknowledgment, timeout or process death leaves durable work for replay.
Chat continues owning messages and replay receipts; Workers have no direct Chat
DML or gameplay authority. External delivery uses a distinct mailbox signing key per realm;
Chat retains separate credentials for its other private integrations.

The standalone [Workers application](../../apps/workers/README.md) owns process
lifecycle and restricted connections. The realm retains a default local mode using
the same Service; external mode removes its two local mail delivery loops while
leaving transactional intent creation unchanged. No RealmAuthority token, Rules
catalog or Redis connection is shared with the worker. This implements a bounded
W15 integration slice under [realm authority design](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling),
not separate player/world authorities or complete W11/W15 migration.

## Compatibility and deployment

The former horizontal gift relay and chat delivery function and the Database relay
methods are retired. `repositories/mail-chat-intents` still owns intent creation
inside the current gameplay transaction. Queue/global schemas, identities, stored
payloads and native responses remain unchanged. Deploy matching Server/Workers
artifacts, provision the restricted roles and follow the explicit drain/cutover
procedure in the Workers guide; do not reset queues or reward state.

`contracts/chat-mailbox` retains its current encoder, decoder and Chat store
contracts, re-exporting the two Mail-owned structural declarations temporarily.
Its direct consumers are the connection publisher and HTTP router, identity
signature, Chat controller/repository and their Server/Chat boundary tests;
`contracts/chat` also uses its store contract locally. Retire that facade only when
these transport/Chat owners are migrated together under W20, preserving native
validation and replay bytes.

## System-mail compatibility and retirement

`contracts/src/files.ts` imports and re-exports the same declaration, and embeds it
in its avatar contracts. Mail owns retirement of that facade under #558 W20.
Migrate these 22 direct external consumers, verify the remaining avatar public
exports and then remove the alias:

- Contracts: `comeback`, `expedition-treasury`, `nickname-alliance`, `paid-gifts`
  (an import type expression), `reconnect`, `regional-recall`, `totem`.
- Hero Services: `hero-ranking-rewards`, `hero-score`.
- Mappings: `avatar-mail`.
- Player contracts: `nickname-persistence`.
- Repositories: `system-mail`.
- Rules: `avatar-mail`, `avatar-version`.
- Services: `continued-cost-rewards`, `egg-activity`, `expedition-stage-rewards`,
  `gold-eggs`, `local-campaign`, `red-packets`, `totem`, `treasure-excavation`.

Tasks consumes the owned declaration directly. The old and new declarations are
structurally identical, including bytes, bigint time, optional item flag and literal
alternatives. Mail/Contracts/API/realm type checks and existing PostgreSQL rollover
mail tests verify the boundary. Those checks establish the behavior-free declaration boundary; they do not cover
the later integration runtime. Worker unit/integration tests exercise delivery,
permissions and lifecycle separately. No player-data conversion is introduced.
