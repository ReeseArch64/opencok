# Repository method conventions

Persistence ports use CRUD verbs that describe the existing operation. Entity-scoped
stores use `create`, `getById` and `getAll`. Aggregate repositories include the
resource and lookup key in their method names, such as `getProfileById` or
`getCityByPlayerId`, so different snapshots are not confused with one another.
Use plural resource names or `ByIds` for batch reads.

This is an internal TypeScript API change. Contracts, application consumers,
fixtures and integration tests migrate together. The SQL, ordering, cardinality,
transactions, expiration, limits and wire protocols retain their existing behavior.
The old method names are removed rather than retained as parallel aliases.

## Current operations

| Repository      | Previous method | Method                     |
| --------------- | --------------- | -------------------------- |
| AccountStore    | valid           | getAll                     |
| Realm Database  | profile         | getProfileById             |
| Realm Database  | accounts        | getAccountsByPlayerId      |
| Realm Database  | city            | getCityByPlayerId          |
| Realm Database  | configuration   | getConfigurationByPlayerId |
| Realm Database  | power           | getPowerByPlayerId         |
| Realm Database  | playerSummaries | getPlayerSummariesByIds    |
| Realm Database  | world           | getWorldByPointIds         |
| Chat sessions   | save            | create                     |
| Chat sessions   | findByTokenHash | getById                    |
| Chat messages   | send            | create                     |
| Chat messages   | listRecent      | getAll                     |
| Chat messages   | listRange       | getAllByRange              |
| Chat repository | loadPlayerState | getPlayerStateById         |
| Chat repository | cleanup         | deleteExpired              |

AccountStore.getAll retains the mapping type/value and bound-account filters,
active-account rules and time ordering. Chat sessions.getById receives the existing
SHA-256 token hash primary key, never a raw token. Chat messages.getAll and
getAllByRange retain their room/time predicates, 100-message limit and chronological
result order. Chat messages.create retains idempotency handling and the inserted
flag; creating a session remains an insert. deleteExpired keeps the existing
500-record bound for each message/session cleanup batch.

The public snapshot helpers follow the same names: getConfigurationByPlayerId,
getPowerByPlayerId, getLocalPlayerSummariesByIds and getPlayerSummariesByIds.
The local player helper accepts one realm database; the aggregate helper retains
configured cross-realm routing and input order. Lifecycle methods start, health,
close and schema check helpers retain their specific meanings.

## Adding operations

Name supported writes `create`, `update` and `delete`; use `createAll` and
`updateAll` only when the repository actually supports a defined batch operation.
Use `remove` for detaching an association when that differs from deleting its
persisted entity. Specify the key, filters, transaction and ownership rules in
the contract and preserve them in tests.

A naming convention does not grant new write capabilities. The realm snapshot
repositories remain read-only. Add mutations only as separately scoped use cases
with their required ownership, atomicity and recovery semantics. Follow the
[package boundaries](../../.github/ARCHITECTURE.md#implemented-api-and-realm-package-boundaries)
and [PostgreSQL decision](../../docs/decisions/0002-adopt-postgresql-for-authoritative-state.md).

Run the existing server, API and Chat tests and type checks when changing these
ports. The Chat PostgreSQL integration suite verifies concurrent idempotent
creates, hashed session lookups, realm routing, expiration and restart behavior;
the realm integration suite verifies login/city/map reads and saved-state retention
across both kingdoms using disposable dependencies.
