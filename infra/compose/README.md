# Local database and pgAdmin environment

The root `docker-compose.yml` runs PostgreSQL 17.11, a Bun 1.4.2 initialization job
and pgAdmin 4. The setup job prepares `opencok_global` and both default kingdom
databases with the maintained Drizzle migrations, then writes the pgAdmin server
registration without storing the database password. See the
[architecture](../../.github/ARCHITECTURE.md#151-postgresql-database-package) for
database ownership and namespace boundaries.

## Start

From the repository root:

```sh
docker compose --profile dev config --quiet
docker compose --profile dev up --build -d
docker compose --profile dev logs database-setup
docker compose --profile dev ps -a
```

The services belong to profiles `dev` and `all`; starting without a profile does
not select them. The current Compose file explicitly defines local development
credentials, container names, platform and published ports. PostgreSQL is available
on port 5432 and pgAdmin at <http://localhost:5050>. Sign in using the pgAdmin
credentials configured in that file. The pgAdmin login and PostgreSQL login are
separate accounts. Port mappings currently bind all host interfaces as configured
in Compose; access follows the host's network/firewall settings.

PostgreSQL must become healthy before `database-setup` starts. That job should
finish with exit code 0; its stopped container is expected. pgAdmin waits for the
job to succeed. Its own healthcheck checks the HTTP endpoint. Check both service
health and initialization completion before using the database.

The server `OpenCok local PostgreSQL` is automatically registered in pgAdmin under
`OpenCok`, using the internal address `database:5432`. Enter the PostgreSQL password
when connecting. The global database and both kingdom databases appear on that
server. The generated registration contains the username and connection metadata,
without a password. Registration is imported when pgAdmin initializes its own
configuration database; edit an existing saved server in pgAdmin if you later
change its connection settings.

## Configuration and boundaries

The PostgreSQL container and setup job share the username/password explicitly
configured in Compose. Setup validates these through `@opencok/env/database` and
uses URL setters to encode special characters. Host-side tools continue using the
single root `.env`: set `DATABASE_URL` for the target application database and
`POSTGRES_ADMIN_URL` for the maintenance database. No package-local env file is
required. See the [environment guide](../../packages/env/README.md).

The database and setup job use the internal network. pgAdmin also uses the external
network for its interface. The fixed network/container names represent one local
installation; use overrides with unique names/ports for another copy. The image
build context includes only workspace manifests and database runtime code/migrations;
private env files, mobile artifacts, Git metadata, data and tests are excluded.
No root env file is copied into the image.

## Persistence and maintenance

The `postgres-data` volume mounts `/var/lib/postgresql/data`; PostgreSQL stores its
cluster in the configured `pgdata` subdirectory. The PostgreSQL-specific volume name
avoids reusing the legacy MariaDB `opencok_database-data` volume. That legacy volume
is preserved; this setup does not import or convert its data.
`pgadmin-data` stores the pgAdmin account and saved settings; `pgadmin-servers` shares
the generated registration from setup to pgAdmin with a read-only consumer mount.
Routine stop/recreation and `docker compose --profile dev down` retain these volumes.
Adding `--volumes` deletes the local state; use it only for an intentional reset of
disposable data.

```sh
# Apply pending migrations after changing source/migrations.
docker compose --profile dev up --build -d
docker compose --profile dev run --rm database-setup

# Stop the environment while preserving volumes.
docker compose --profile dev down
```

Initialization creates missing databases and applies pending migrations; reruns
preserve existing records. A partial failure can be retried after correcting the
cause. Back up existing databases before applying new migrations. Reverting an image
does not reverse already-applied SQL; preserve immutable migration history and use
forward corrections or a verified backup when recovery is needed.

PostgreSQL initialization credentials apply only to a new cluster. Changing Compose
values does not change credentials already stored in a volume. Rotate credentials
in PostgreSQL and update configuration together; do not delete the volume to resolve
authentication errors. pgAdmin's initial login settings likewise initialize a new
configuration store; manage an existing account through pgAdmin.

This is the implemented local persistence environment. Application services and other
infrastructure adapters will be added when their runtime entry points exist. It is a
single PostgreSQL instance, without replicas or a production HA claim.

## Verification

Verification uses an isolated Compose project and overrides for unique container/network
names, loopback ports, synthetic credentials and disposable volumes. It checks image
build, healthchecks, initialization, expected database/table counts, repeated setup,
persistence after recreation, pgAdmin login/server import and private build exclusions.
Only the verification project's resources are removed afterward.
