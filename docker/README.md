# Development stack

Run from the repository root:

```sh
docker compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml up --build -d
```

`postgres-setup` waits for PostgreSQL, creates and migrates the global and realm
databases, and writes pgAdmin connection definitions to `pgadmin-servers`.
`minio-setup` waits for MinIO and mirrors the existing `data/cdn/data/cok.eleximg.com/`
and `data/cdn/data/asset.cok.chat/` directories into the CDN bucket. Prepare these
local inputs before starting the stack; originals are mounted read-only.
The upload bucket stays private. The web app mounts `apps/web/assets/` read-only;
the `www` site serves the previously built `apps/www/dist/` directory.

The gateway exports sanitized access logs and metrics to Maple. Its development
ingest key matches the Maple default; set `MAPLE_LOCAL_INGEST_KEY` consistently to
override it. HTTP discovery uses port 80, native game traffic 9933, `www` 8080,
and the client web app 5173. Development settings are fixed in the Compose file;
only secrets and database URLs containing credentials use environment interpolation.

Scheduler and mail processing run inside the realm server by default. To run the
separate services, enable profiles `scheduler` and `mail-workers`, change the
server's `ACTIVITY_SCHEDULER_MODE` and `MAIL_INTEGRATION_MODE` to `external` in
`docker-compose.dev.yml`, and provide
`SCHEDULER_DATABASE_URL`, `MAIL_WORKER_KINGDOM_URL` and `MAIL_WORKER_GLOBAL_URL`.
These URLs require dedicated database roles with the service-specific grants and
role bindings validated by the applications; the setup job does not provision
those roles. Administrative PostgreSQL credentials are not valid worker credentials.
The `all` profile also selects the optional services and requires these settings.
