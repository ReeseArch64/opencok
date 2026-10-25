# Account and initial-city provisioning

The API owns verified identity and global character reservations. Each realm
owns its city, player progression and starter economy credits. The two physical
PostgreSQL databases use independent transactions and a recoverable reservation
protocol. This implements the normal-start backend for topic 13; it does not
certify all legacy accelerated registration branches or an APK identity bridge.

## Normal preset

`normal-v1` starts at player level 1, zero experience, 1,000 gold and zero
crystals. Wood and food start at 100,000 each; stone, iron, silver and bound
resources start at zero. This is an explicit product choice, not a claim about
the original game's historical balances.

The ordinary default catalog positions provide eleven level-1 buildings:
castle, wall, two towers, watchtower, barracks, stables, cellar, farm, woodcamp
and hospital. Stars and upgrade progress start at zero. Advanced facilities,
research unlocks, accelerated level-100 initialization and mass hero grants are
excluded. Required catalog entries must exist; missing definitions fail the
transaction instead of silently creating an incomplete city.

The seed includes building and supported production queues, default common
quests evaluated against the new city, the catalog starter general, lord and
VIP records, player power, registration/assets records and world state. Quest
completion does not redeem rewards. The catalog's three-day beginner shield
starts at the actual realm commit attempt, even if the reservation is older.
VIP has no active paid period. These defaults use the maintained catalog; the
explicit starter currency amounts override accelerated catalog balances.

A city consumes four existing neutral tiles in a 2-by-2 rectangle in world 0.
The realm locks all four rows and records one city and three city-range points.
Tiles occupied by a player, reservation or alliance territory are unavailable.
The configured map size must match the imported map. A new empty database needs
a valid map before creation can succeed; this endpoint does not generate a map.

## Authentication and configuration

Creation is disabled unless explicitly configured. The API requires all three
settings together:

| Variable                      | Meaning                                                |
| ----------------------------- | ------------------------------------------------------ |
| `FIREBASE_PROJECT_ID`         | Firebase project whose ID tokens are accepted          |
| `PROVISIONING_SIGNING_SECRET` | At least 32 characters, shared with the trusted realms |
| `API_PROVISIONING_REALMS`     | JSON array of one or two distinct `{id,url}` entries   |

For example, the realm list can be
`[{"id":1,"url":"http://server:18090/_internal/characters"}]`.
URLs are operator configuration, never a request input. Each realm also needs
`PROVISIONING_SIGNING_SECRET`. The internal route uses its existing health HTTP
port and requires readiness and signed requests. Keep that port on the private
service network and use HTTPS across untrusted networks. API traffic carrying
ID tokens must use HTTPS outside a local test environment.

Firebase Admin uses Application Default Credentials supplied by the operator,
including the standard `GOOGLE_APPLICATION_CREDENTIALS` mechanism. Credentials
and signing secrets are local deployment inputs, never repository content.
The verifier checks Firebase ID tokens with revocation checking enabled;
invalid/revoked/disabled identities return 401, while verification infrastructure
failure returns 503. Authentication through the Firebase emulator is rejected
by this production adapter. See Firebase's
[ID-token verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens)
and [session management](https://firebase.google.com/docs/auth/admin/manage-sessions)
documentation. The SDK is pinned in the identity package and lockfile.

For Docker Compose, opt in with
`docker compose -f docker-compose.yml -f infra/compose/api-provisioning.yml --profile dev up -d`.
Set the three variables above plus `FIREBASE_CREDENTIALS_FILE`, an absolute path
to the local ADC JSON file. The overlay mounts it read-only and gives the API
outbound connectivity for Firebase verification. The base stack does not need
Firebase credentials or outbound identity access. Configure additional realm
instances with the same signing secret and matching realm IDs separately.

## Public contract

`POST /api/v1/characters` accepts `Authorization: Bearer <Firebase ID token>`
and a strict JSON object with `kingdomId`, `deviceUuid`, `country` and `language`.
Country is a two-letter uppercase code. Language accepts a two-letter language
with an optional region. The client cannot select a game UID, nickname, preset,
starting resources or map coordinates. Device UUID is a binding value and never
an authentication credential.

A ready response contains `gameUid`, `kingdomId` and `state: "ready"` with HTTP 200. A reserved character whose realm is temporarily unavailable returns the
same identifiers with `state: "pending"` and HTTP 202. Retry the same operation
with bounded backoff and a valid identity token. Other dependency failures may
return 503; the same retry remains safe. All responses prohibit caching.

The verified issuer and subject identify the internal account. It has one
immutable reservation per realm and at most two realm characters. Replaying a
request returns the existing reservation and preserves its original device and
locale. This endpoint does not rebind devices or import an existing legacy
account. A device already reserved or published for a different identity in the
same realm is rejected with 409. Existing account recovery/linking requires its
own authenticated flow.

## Commit and recovery protocol

1. Lock the global identity and reserve an immutable UID and `normal-v1` payload.
   Global discovery mappings are not yet published.
2. Send the bounded request body with timestamp and HMAC to the configured realm.
   Request and response signatures use separate domains and expire after 30
   seconds, so operators must keep clocks synchronized.
3. The realm fences its transaction by ownership epoch, serializes the new UID,
   allocates map rows and creates all starter state, three economy credit
   postings, the creation receipt and outbox event in one transaction.
4. Return a signed receipt tied to a hash of every reservation field. Only after
   verifying that receipt does the API publish `account_new` and the device/name
   mappings and mark the reservation ready in one global transaction.

Failure before realm commit leaves no partial city or credits. Failure after
realm commit leaves a durable receipt; replay returns it without resetting
progress or granting rewards again. Failure after global commit returns the
existing ready reservation on retry. A different payload for an existing
creation receipt is rejected. An existing profile without a matching creation
receipt cannot be initialized through this flow. A realm that loses ownership
cannot create or replay through its stale writer. A disabled global identity
cannot reserve or activate a character.

Retain pending reservations and receipts through operational failures. Correct
unavailable dependencies, catalog/map problems, credentials or clock skew, then
retry with the same identity and realm. Do not delete pending rows to force a
new grant. If the realm committed while the API was unavailable, a pending
reservation is expected and converges after retry. No cross-database rollback
or distributed transaction is claimed.

## Migration and rollback

Apply global migration `0009_character_provisioning` before enabling the API.
It adds `game_identity` and `character_provisioning` and their uniqueness/state
constraints. The realm requires the existing mutation foundation migrations;
there is no new realm schema migration. Back up both database roles before
rolling out. Existing accounts, resources, inventories and queues are unchanged.

Disable API provisioning and the realm signing configuration to stop new
creation. Roll back application code while retaining both new global tables,
realm receipts and all created players. Dropping these records would destroy
recovery and identity bindings. A destructive database restore requires a
coordinated restore of both roles; restoring only one can separate published
accounts from their realm characters.

## Verification scope

Automated tests use synthetic verified identities at the API seam and exercise
actual PostgreSQL transactions, signed realm HTTP calls, Redis/ZooKeeper-backed
realm startup and an SFS 12.06.0 login/init with the generated account. They check
normal balances/buildings, retries and concurrent creation, lost responses,
rollback, disabled identity, capacity failure, ownership fencing and database
restart. Unit tests reject invalid input, unsigned receipts, modified or expired
signatures and authentication failures.

The focused check is `bun --no-env-file test apps/server/integration/provisioning.test.ts`.
`bun --no-env-file apps/server/scripts/mutate-provisioning.ts` verifies that the
tests reject removal of receipt replay, reservation hash binding and epoch
fencing, and detect an incorrect initial gold grant.

Live Firebase credential verification and native APK registration are not
certified by these tests. The native client still needs its Firebase identity
bridge to obtain an ID token, call creation, wait for ready and use the returned
game UID in the existing login protocol. Other client versions are untested.
