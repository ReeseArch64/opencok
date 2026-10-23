# PostgreSQL compatibility baseline

This port retains all **772 tables / 6,316 fields** and their original SQL names,
case and database provenance. `manifest.json` records each source/target mapping;
`src/postgresql/schema/<namespace>/<table>.ts` contains one Drizzle model per table.
The MariaDB schema, migrations and independent native metadata fixture remain intact.

## Physical placement

| Physical database role | Legacy namespaces | Tables |
| --- | --- | ---: |
| Global | `cokdb_global`, `cokdb_pay`, transitional `opencok_chat` | 113 |
| Realm (one database per realm) | `cokdb1` | 659 |

Create empty physical databases with deployment-selected names, then initialize
each using its role. Repeating realm initialization in another empty database
creates an isolated realm with identical names. Global and realm pools connect to
different physical databases. No cross-database atomic commit is implied.

Tested target: **PostgreSQL 17.11**, Docker `postgres:17.11-bookworm` with ICU.
The bootstrap accepts 17.11+ in the 17.x family. It refuses preexisting application
tables, views or sequences, creates no physical databases and performs no drops.

From `packages/drizzle`:

```sh
bun run pg:generate        # public baseline SQL -> models, manifest and migrations
bun run pg:check           # read-only deterministic comparison
bun run check-types
bun test tests/postgresql.unit.test.ts
bun test tests/postgresql.bootstrap.test.ts  # disposable Docker only

# Set POSTGRES_URL privately to an already-created empty physical database.
bun run pg:bootstrap --global
# Select a different empty database through POSTGRES_URL for each realm.
bun run pg:bootstrap --realm
```

Use `@opencok/drizzle/postgresql` for the client and
`@opencok/drizzle/postgresql/schema/<namespace>/<table>` for a single table.
`createPostgresDatabase(role, poolConfig)` returns a Drizzle client and owned pool;
close it after use. Connections use UTC. Models always qualify schema names.

## Explicit mappings

| Source | PostgreSQL representation and application value |
| --- | --- |
| Signed integers | Native integer/smallint/bigint, preserving source ranges; tinyint has a range check. Bigints use TypeScript bigint. |
| Unsigned int | Bounded bigint storage, exact TypeScript number within the uint32 range. |
| Unsigned bigint | Bounded `numeric(20,0)`, exact TypeScript bigint; a locked numeric counter supports the full unsigned identity range. |
| Decimal | Numeric with original precision/scale, TypeScript string. |
| FLOAT/DOUBLE(M,D) | Numeric with declared precision/scale, TypeScript number matching the rounded driver value. This intentionally does not reproduce every binary32/64 intermediate in future gameplay calculations. Unbounded float/double use real/double precision. |
| Varchar/char/text | UTF-8 text/varchar preserving stored spelling and trailing spaces. Fixed char becomes varchar to avoid PostgreSQL blank padding. Source encoding is decoded during transfer. |
| Binary/varbinary/blob | Bytea/Buffer, including zero bytes and high bytes; fixed/declared byte limits are checked. |
| Date/datetime/timestamp | Validated canonical text strings, preserving zero/partial-zero dates, fractional precision, NULL and sentinel meanings. No unproven instant/local-time conversion. |
| AUTO_INCREMENT | Generated-by-default identity for signed/int ranges, numeric counter for uint64; imported explicit IDs require sequence synchronization. |
| TIMESTAMP NULL / ON UPDATE | Independently authored database triggers preserve NULL-to-current UTC time and distinguish explicitly supplied timestamps from omitted timestamps on UPDATE. |
| MyISAM / ROW_FORMAT | PostgreSQL storage; every table now supports transactions. Original engine/options remain in the source reference and manifest provenance. |

Index names are table-qualified and hash-suffixed when necessary to stay within
63 bytes. Table and field names are never shortened. Prefix indexes use `left`
or byte substring expressions. Declared primary keys remain primary keys;
additional unique PAD SPACE expression indexes protect legacy text-key equality.
The 34 tables without a primary key receive no invented key. Both foreign keys
retain their declared actions. Migration SQL also retains source column comments.

`legacyTextEquals(column, value)` applies PAD SPACE lookup semantics. Use it for
legacy text comparisons; plain `eq` does not trim trailing spaces. ICU primary
collation handles case/accents (Swedish where applicable), while binary collations
use C. ICU and MariaDB collation versions are not universally equivalent. A data
transfer must compare actual equality groups and stop on a mismatch rather than
assuming that a successful insert proves lookup compatibility. Future text/query
behavior needs the same per-domain validation, especially pattern matching.

PostgreSQL text cannot hold NUL characters, and individual PostgreSQL values have
different size limits from MariaDB long text/blob values. Such source values must
be reported and blocked rather than removed, truncated or replaced. Opaque binary
NUL bytes remain fully supported. A different representation needs its own reviewed
mapping; it is not silently introduced by this port.

## Business dependencies and release boundary

The manifest inventories the nine original trigger/routine/event objects, hashes
and required TypeScript replacements. Their private bodies and seed rows are not
included. Account provisioning, daily/event progression, purchase/grant delivery,
payment accounting and password flows therefore need their own implementation
and application E2E before release. Compatibility timestamp triggers are new
project-authored SQL, independent of those private business programs.

This is a faithful schema baseline and migration foundation. It neither removes
unused legacy tables nor chooses their final domain/NoSQL design. Planning and
acceptance criteria: [issue #17](https://github.com/ReeseArch64/opencok/issues/17).

## Transfer, reconciliation and recovery

The transfer tool operates on an **authorized restored MariaDB copy** and newly
initialized, offline PostgreSQL targets. It never initializes/drops a target or
overwrites an untracked nonempty table. Keep every application writer stopped and
target credentials restricted to the migrator until the complete run is accepted.
The physical target names remain configuration, not fixed names in the command.

```sh
# Set these URLs privately; do not put them in shell history, issues or logs:
# MIGRATION_SOURCE_URL: authorized restored MariaDB instance
# PG_GLOBAL_URL: initialized global PostgreSQL database
# PG_REALM_URL: initialized PostgreSQL database for this realm
bun run pg:transfer --restored-source
bun run pg:transfer --restored-source --resume
bun run pg:transfer --restored-source --verify-only

# Copy another realm without copying global tables again:
bun run pg:transfer --restored-source --scope realm
```

`--restored-source` explicitly acknowledges the supported source environment. The
source event scheduler must be OFF. The dedicated source account needs SELECT on
the four source databases and metadata access, plus the privilege needed for
`FLUSH TABLES WITH READ LOCK` (RELOAD for the pinned MariaDB). That connection holds
the global read lock throughout the run, covering MyISAM and InnoDB alike; the
finally path unlocks it and a disconnected session releases it. Run only on the
restored copy: this deliberately blocks all source writes. No source rows are
modified. PostgreSQL credentials require reads/writes on the target application
tables, sequence synchronization, temporary tables and `legacy_meta`; do not give
the transfer process unrelated deployment privileges.

Preflight checks the complete source field/default/index/FK contract and target
manifest, role and catalog fingerprint. Target advisory locks prevent two transfer
processes from sharing a target. Each table is copied in bounded parameterized
batches (128 rows by default, reduced for PostgreSQL's parameter limit) inside one
target transaction. This is a **table checkpoint**, not a row checkpoint: an
interruption rolls back the current table and a retry starts that table again.
Earlier committed tables remain. Global and realm commits are independent.
Do not release either database to applications during a partial run.

The same transaction records a manifest hash, count and order-independent SHA-256
multiset digest of every canonicalized field, retaining duplicate multiplicity in
tables without unique keys. Resume checks completed tables against both source and
target before continuing. Verification rereads every field and requires all
checkpoints; it never treats count equality alone as reconciliation. Numeric values,
decimal strings, bytes, NULL and temporal strings have explicit canonical codecs.
Unsupported values and constraint failures identify a public table/column and error
code, without logging the value or raw driver exception. A checksum mismatch blocks
the run; investigate privately and do not clear receipts to force acceptance.

Temporary target tables also compare source `WEIGHT_STRING(RTRIM(value))` equality
groups with the mapped PostgreSQL collation for every imported text field. A
coarser or finer equality partition is refused. For example, MariaDB general_ci's
`s`/`ß` behavior differs from the chosen ICU candidate. This validates the imported
population, not every future Unicode input or sort ordering. Report such mismatches
for an explicit per-domain collation decision; never merge/drop colliding rows.
Large indexed values can also hit different PostgreSQL index/value limits and must
be investigated rather than truncated.

Imported AUTO_INCREMENT fields synchronize generators with the highest imported
value, the source's current next value (including deleted-ID gaps), and the baseline
start. Exhausted ranges remain exhausted. Native sequence changes are not rolled
back by PostgreSQL; an interrupted table must be resumed/reconciled before enabling
writers. The unsigned numeric counter and receipts are transactionally updated.

Before any proposed cutover, take and restore backups of the source and both target
roles in isolated environments; rerun `--verify-only` on restored targets. The
automated transfer suite rehearses interruption/resume, all-table reconciliation,
schema/data drift refusal, sequence advancement, restart and pg_dump/pg_restore.
CI uses only public DDL and synthetic fixtures. Repeat on the authorized restored
dataset to discover actual invalid dates, collations, limits, duplicates and orphans.

Keep source authoritative until the rehearsal and application validation are
accepted. A later deployment plan must define a write freeze, final copy/reconcile,
operator acceptance and write enablement. Before target writes begin, recovery can
retain the unchanged source and rebuild only the isolated target. After PostgreSQL
accepts writes, switching back to a stale MariaDB backup loses those writes; require
an audited reverse/delta reconciliation or forward recovery. No automatic live
cutover or destructive rollback is provided by these commands.
