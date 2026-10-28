# Profile and preferences

Topic 6 exposes `user.modify.nickName` through the authenticated realm command service.
It completes the existing nickname cost, journal, refund and delivery foundations.
`user.check.nickName`, `pushSetting.get`, `parse.push.set`, `equip.show`, `medal.show`,
`march.soldier.show`, `colorblind.set`, `equip.scroll`, `banner.set` and `speed.cd.open`
retain their existing persisted behavior. Avatar changes remain topic 7.

## Rename contract

The caller supplies a String `nickName`. The authenticated session supplies the owner
and realm; request fields cannot select another player. Missing, foreign and banned
profiles fail before validation or payment. Normalization, reserved-name filtering,
bad-word filtering, GBK-weighted length, permitted characters and global availability
precede payment. Newline normalization and validation order follow the legacy handler.

The server consumes goods `200021` first, with the established gold fallback and
rename counter semantics. Realm preparation and the global receipt preserve the
outcome across uncertain commits. Replies retain typed Long `gold` when applicable,
Bool `status`, and the original `_cok_` correlation value. The optional String
`operationId` accepts a canonical UUID for owner-scoped replay without another debit.
Legacy clients can omit it; the server generates an operation ID. `_cok_` is not a
deduplication key. Repeating the current name without the original operation ID goes
through availability validation and does not charge again.

Committed changes update the account, realm profile and owned world point. Durable
bits track notifications, alliance LORDNAME tasks and completion mail, signed Chat
publication, current throne holders, and the complete shared-user Redis projection.
A dependency failure preserves its bit. A cursor relay retries prepared operations
and pending effects after restart, once every five seconds per selected operation.
Delivery uses current authoritative names, so an old operation cannot restore an old
name. Global throne commit precedes realm acknowledgment; a lost commit reply is
safe to replay. Only the latest persisted version of each throne configuration and
king type 1 or 2 is current; historical holders and other owners are untouched.

Alliance completion uses the existing template `10113` and its fixed goods reward
catalog. The resolver accepts one unlinked goods row with one draw. Linked, weighted
multi-outcome or customized reward structures fail delivery and retain the effect;
they require a separate general reward engine. Mail attachment redemption is separate.

## Reserved-name patterns

The Redis `forbidden_words_name` list is evaluated in order after lowercase, Java
trim, ASCII space collapse and full-width conversion. The matcher supports literals,
classes, alternatives, captures and noncapturing groups, lookarounds, ordinary and
reluctant quantifiers, Java quoting, ASCII predefined classes, Java 8 word boundaries,
anchors, hexadecimal escapes and leading `i`, `m`, `s` flags. It does not substitute
JavaScript Unicode case folding for Java's ASCII case-insensitive mode.

Class intersections, nested classes, possessive quantifiers, backreferences, Unicode
property escapes and scoped flags are unsupported. Invalid or unsupported expressions
fail closed when reached; an earlier matching entry still wins. Operators must check
custom lists before enabling rename. This is not a general Java Pattern interpreter.
Limits are 10,000 entries, 4,096 source characters per expression and 4 MiB of translated
plans. Matching runs in a worker with a one-second deadline; a pathological expression
cannot keep the realm event loop inside a regex match. Existing bad-word snapshot and
Redis reload behavior remain unchanged.

The 340 public synthetic cases in [`packages/policy/tests/fixtures/nickname-reserved-vectors.json`](../../packages/policy/tests/fixtures/nickname-reserved-vectors.json) were
computed independently with `java.util.regex.Pattern` on Temurin Java 8. They cover
Unicode boundaries and combining marks, quoting, CRLF/NEL anchors, flags, lookarounds
and escapes. The fixture contains no private implementation or player data.

## CN1 restoration

Global migration `0007_cn1_profile_sessions` adds `cn1_profile_session`. Operators can
import authoritative CN1 eligibility and elapsed minutes keyed by the realm profile UID.
No client request can create or modify eligibility. `isAddict` is 0 for exempt, 1 for
restricted and 2 for temporary eligibility; expired mode 2 becomes exempt. `authAt`,
`sampledAt` and `offlineAt` are epoch milliseconds. `onlineMinutes` is a signed Java
integer. A missing row is known absence and uses ratio 1; a failed database read is
unavailable state and must not silently use ratio 1.

Login restores the row and fences it with the connection UUID. Refresh before rename
or recovery and connection close accrue whole online minutes. A replacement connection
in the same runtime accounts for the previous active interval; a late close cannot
end its successor. The configured `69036.k4` offline interval resets elapsed minutes.
The existing version, realm and reward-band gates and Float32 arithmetic determine
CN1 gold refunds. The provider reads before economic locks to avoid pool exhaustion
when global and realm pools have one connection.

After a crash, only persisted minutes are restored; unknown offline intervals are not
invented as play time. This explicit self-hosted policy replaces an in-memory legacy
session object. External age verification, external identity linkage and historical
eligibility import are not implemented here. Active/restored snapshots are bounded at
8,192 entries per realm process; inactive snapshots are evicted first.

## Activation and recovery

Apply all global and kingdom migrations with the maintained Drizzle migration runner
before starting the new server. Back up both databases first. Set
`CHAT_URL` to the private Chat HTTP(S) origin; the server appends `/_internal/nickname`.
Configure the same `CHAT_SECRET` on realm and Chat. The private URL must
not contain credentials, query parameters or fragments. The existing goods, item,
mail, reward, alliance-task and VIP catalogs must be available. Redis and PostgreSQL
remain authoritative dependencies. Startup verifies the required journal, receipt,
throne and CN1 tables. Without the Chat configuration the mutation remains unsupported;
preference reads and writes continue to work.

Monitor `nickname_delivery_failed` and `nickname_recovery_failed`, and inspect prepared
journal entries and nonzero `pendingEffects` without logging names or account data.
Repair the failing dependency or catalog and let the relay retry. Do not delete journals,
receipts or pending bits to silence failures. To roll back binaries, first stop accepting
renames, drain prepared and pending work, and preserve all new tables and receipts.
A committed rename is not undone by rolling back a binary. A database restore must
restore global and kingdom state together and account for already delivered Chat/mail
and cache projections.

## Validation

The server tests exercise exact typed replies, invalid owners, realms and bans,
validation order, reserved words and hostile regex deadlines. Disposable
PostgreSQL integration covers payment, concurrent reservation, uncertain commits,
refunds, restart recovery, notifications, throne history isolation, CN1 restoration,
alliance mail and shared-user fencing. A command integration uses actual Chat HTTP and
Redis and confirms every effect is acknowledged with one debit across replay.

`integration/core.test.ts` sends real TCP/SFS packets to two realm processes with
PostgreSQL, Redis, ZooKeeper and Chat. It verifies rename, replay, persisted equipment
visibility, connection replacement and server restart. Native Android/iOS validation
and production-scale query/relay benchmarking remain untested.
