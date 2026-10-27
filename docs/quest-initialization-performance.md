# Quest initialization persistence

Issue [#544](https://github.com/ReeseArch64/opencok/issues/544) records repeated
full quest writes during login and an unclassified PostgreSQL failure. This
change reduces that write amplification; the original incident's database
failure and native-client login deadline still require confirmation.

## Persistence and recovery

Each city command compares its quest plan with an independent copy of the
quest state read inside the same owned transaction. Main, story, daily and
legacy daily rows are written only when their persisted fields change. Daily
identity includes its type. A daily or legacy reset compares with an empty
set so replacement rows are inserted after deletion. Full rule plans remain
available for response mapping, unlocks, reward claims and subsequent actions.

Required upserts use sequential batches of at most 256 rows, with each row's
own conflict values. Repeated keys preserve the final planned value. Existing
player serialization, receipt handling, reward calculation and transaction
ownership remain authoritative. No tables, accounts or saved progress are reset.

Socket closure aborts initialization between city commands. Replacing a local
session closes the earlier socket; its initialization cannot send success or
start another city stage after observing cancellation. An already running city
transaction finishes under its existing ownership and database timeout rules.
This is cooperative cancellation, not interruption of an active PostgreSQL query.
The final reconnect planner checks cancellation inside its transaction before
returning its mutation plan. Session release remains conditional on the token.

PostgreSQL failures now emit the known operation, table, database role, a
controlled reason and a five-character SQLSTATE when supplied by the driver.
Query text, parameters, raw error messages and account data are excluded.
Classification follows bounded, cycle-safe error causes through Drizzle wrappers.
For example, SQLSTATE 57014 becomes database_query_cancelled. This diagnoses
a new failure without asserting that a timeout caused the original incident.

Deploy the server artifact normally; no configuration, migration or dependency
changes are required. Preserve ordinary database backups. To roll back, deploy
the previous server artifact; no data conversion is needed.

## Reproducible evidence

Run from the repository root:

```sh
bun --no-env-file apps/server/scripts/benchmark-quest-writes.ts
bun --no-env-file test apps/server/test/quest-persistence.test.ts apps/server/test/login-session.test.ts apps/server/test/login-civilization.test.ts packages/core/tests
bun --no-env-file test apps/server/integration/quests.test.ts
```

The benchmark models nine stable initialization stages, 955 main quests and 73
story quests with a simulated 2 ms round trip. It executes the previous sequential
write pattern and the new repository function against the same asynchronous
adapter. No gameplay catalog, private state, production database or native client
is involved. Observed on 2026-10-27:

| Stable quest persistence |    Before | After |
| ------------------------ | --------: | ----: |
| Changed rows             |         0 |     0 |
| Written rows             |     9,252 |     0 |
| Queries                  |     9,252 |     0 |
| Wall time                | 19,747 ms | 10 ms |
| Simulated database wait  | 19,711 ms |  0 ms |

These are quest-persistence timings, not complete login or real database
measurements. Timer scheduling affects wall time. A separate regression verifies
that all 1,028 newly required main/story rows use five statements, while changing
one existing row writes exactly that row.

Disposable PostgreSQL 17 tests cover 600 synthetic quest rows, preservation of
existing row versions on repeated initialization, failure after an earlier batch,
rollback, concurrent claims, receipt replay, cross-owner isolation and daily
rollover mail delivery once. Initialization can legitimately unlock additional
quests on later passes; unchanged existing rows must retain their versions.
A real statement timeout is induced with SET LOCAL statement_timeout and pg_sleep;
its wrapped error is classified and its preceding mutation is rolled back.

Synthetic TCP tests use the established 12.06.0 authentication track and verify
handshake, SFS login success before init, exact delivery of the supplied init
payload, session replacement, cancellation and token release. Their two-second
deadline is a local transport regression budget. Their initializer is a fixture;
this does not establish full GameService latency or the native client's deadline.

## Outstanding incident verification

Keep #544 open until a complete deployed login is measured with a representative
synthetic account, real database/network latency and active transaction durations.
Correlate database_failed with login_rejected to identify the original failure
class or reproduce its trigger. A deliberately induced statement timeout verifies
diagnostics and rollback, but does not identify the historical cause.

Native confirmation must record the installed APK build, compatibility track,
numbered patches, device/emulator and the complete login/init exchange within a
measured client deadline. Server target 12.06.0 alone does not prove the installed
client version. Other client tracks remain unverified.
