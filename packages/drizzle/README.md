# Legacy MariaDB baseline

`@opencok/drizzle` reconstructs the supplied Java deployment database for migration
planning. It targets **MariaDB 10.4.33**, using Drizzle's MySQL dialect and `mysql2`.
It does not redesign the model or migrate an existing deployment to PostgreSQL.
See [the architecture](../../.github/ARCHITECTURE.md#151-legacy-mariadb-baseline)
for the persistence and compatibility boundary.

| Database | Tables | Scope |
| --- | ---: | --- |
| `cokdb1` | 659 | Game state and audit tables, including 48 tables from the 2026/2027 patches |
| `cokdb_global` | 90 | Accounts and global state |
| `cokdb_pay` | 21 | Legacy payment storage |
| `opencok_chat` | 2 | Chat sessions and messages |
| **Total** | **772** | |

The schema exports preserve SQL table/column names, case, defaults, nullability,
primary keys, secondary/unique indexes and both foreign keys. `package` is a reserved
JavaScript word: its TypeScript export is `cokdb_pay.packageTable`; its SQL name stays
`package`. SQL identifiers such as `zh-Hans` remain quoted properties.

`inventory.json` records all seven input hashes, table counts, 49 `LIKE` expansions,
four triggers, three procedures, one function and one event. It contains no rows,
credentials, definers or stored-program bodies. Source inputs remain read-only and
outside Git. Use the same authorized local inputs to reproduce their private behavior.

## Use the typed schema

Run `bun install --frozen-lockfile` at the repository root. Consumers declare
`"@opencok/drizzle": "workspace:*"` in their own dependencies.

```ts
import { createLegacyDatabase } from "@opencok/drizzle";
import { chat_message } from "@opencok/drizzle/schema/opencok_chat";

const chat = createLegacyDatabase("opencok_chat", {
  host: process.env.MARIADB_HOST,
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  connectionLimit: 4,
});

try {
  const messages = await chat.db.select().from(chat_message).limit(10);
  // Serialize bigint values explicitly at application/transport boundaries.
} finally {
  await chat.close();
}
```

Each client selects one of the original databases; do not pass a table from another
database to that client. Importing the package opens no connections. Configure TLS
through the mysql2 `ssl` option when required by the deployment.

- `BIGINT` maps to JavaScript `bigint`, including unsigned chat sequence IDs.
- `DECIMAL` maps to string. `FLOAT`/`DOUBLE` retain their original dimensions and map
  to number; this baseline does not change their legacy floating-point behavior.
- `DATE`, `DATETIME` and `TIMESTAMP` map to strings, preserving zero dates and fractional
  seconds. The pool uses UTC conversion settings; configure MariaDB sessions/server
  timezone explicitly for a deployment. This is not a timestamp semantics migration.
- `BINARY`, `VARBINARY` and all blob sizes map to `Buffer`, preserving arbitrary bytes.
- SQL defaults use SQL literals, so 64-bit sentinels never pass through JS `Number`.

## Reproduce and check the baseline

From this package directory:

```sh
export LEGACY_SQL_DIR=/path/to/authorized/legacy/deploy/database
bun run db:generate
bun run db:check
bun run check-types
bun test tests/legacy-sql.test.ts
bun run test:integration
```

The directory must contain exactly the seven SQL files in `inventory.json`. Generation
reads DDL and writes `src/schema/*.ts`, schema-only migrations and the inventory. It
fails on unsupported syntax instead of silently omitting a table or column attribute.
Review generated diffs before accepting changed inputs. `db:check` only reads and
compares files. The importer is intentionally limited to these dump forms, not a
general MySQL/MariaDB SQL parser.

Integration requires Docker and `mariadb:10.4.33`. It creates two unique disposable
containers with random credentials and ephemeral loopback ports, imports originals
using MariaDB's own CLI, reconstructs the other instance through Drizzle, and compares
metadata, full table definitions and seed checksums. Program bodies are compared by
hash and never printed. Synthetic checks exercise bigint, decimal, bytes, dates,
constraints, rollback and persistence across a database restart. Only containers made
by the run are removed. It does not use `MARIADB_URL` or an existing database.

## Initialize a fresh local instance

Set `MARIADB_URL` privately to a fresh MariaDB instance. From this package directory:

```sh
bun run db:bootstrap
```

This creates the four databases, 772 tables and a `__drizzle_migrations` journal per
database. **All four databases must be absent** before it starts. It refuses an existing
database, even an empty one, and performs no drops or automatic reset. Do not point it
at a live deployment. There is no production migration/cutover in this package.

To include the original initialization statements, triggers, routines and event:

```sh
export LEGACY_SQL_DIR=/path/to/authorized/legacy/deploy/database
bun run db:bootstrap --with-local-inputs
```

All source hashes must match the reviewed inventory before any DDL runs. This optional
step executes original private SQL locally, including seed inserts and the
single-kingdom deletion in `99-single-kingdom.sql`. Explicit stored-program definers
remain as supplied; objects without a definer use the importing account, as in MariaDB's
native importer. The disposable comparison uses matching root-compatible TCP accounts.
Establish appropriate owners/privileges separately before any real deployment. The
bootstrap does not enable the MariaDB event scheduler. Program creation is not proof
that the legacy event or payment routines are appropriate for a new deployment.

MariaDB DDL commits implicitly. Failure can leave partial databases; bootstrap refuses
to resume over them. For a disposable experiment, remove only its own instance/volume
and start a new one. Existing player databases require separately designed migrations,
backups, reconciliation and restore procedures; never reimport this baseline over them.

## Drizzle and MariaDB fidelity

The checked-in `migrations/<database>/0000_legacy.sql` files are custom Drizzle
migrations containing only table DDL. They preserve integer display widths, table and
column collations/charsets, comments, engines (including MyISAM), auto-increment starting
values, prefix indexes, foreign-key names/actions and other source table options.
`CREATE TABLE ... LIKE` is expanded to a complete table definition so all tables are
visible in TypeScript. Original `ROW_FORMAT=COMPACT` becomes `DYNAMIC`, exactly as in
the legacy deployment importer; the widest tables cannot be initialized as COMPACT.

The TypeScript DSL cannot represent all those MariaDB options. Both representations
are generated from the same DDL and checked against MariaDB; the custom migration is
the executable reconstruction baseline. The database journal records table migrations,
not execution of optional private initialization statements.

An offline Drizzle Kit preview is available:

```sh
DRIZZLE_DATABASE=opencok_chat bun run db:preview
```

That preview is **not an equivalent replacement** for the custom MariaDB baseline.
Do not apply it or use `drizzle-kit push` to reconcile a legacy database: options omitted
by the DSL could change storage or comparison semantics. There are no Kit snapshots
for an incremental schema diff yet. Before authoring future migrations, establish and
review that snapshot strategy, keep MariaDB-specific DDL explicit, and rehearse on a
restored copy. Do not overwrite an already-applied `0000_legacy.sql`.

The parity suite proves reconstruction of these supplied SQL inputs, not coverage of
tables created dynamically by Java outside them, current live data, gameplay, stored
routine business logic, or another MariaDB version.

References: [Drizzle mysql2 adapter](https://orm.drizzle.team/docs/get-started/mysql-new),
[custom types](https://orm.drizzle.team/docs/custom-types),
[discussion #8](https://github.com/ReeseArch64/opencok/discussions/8),
[baseline issue #9](https://github.com/ReeseArch64/opencok/issues/9),
[validation issue #10](https://github.com/ReeseArch64/opencok/issues/10).
