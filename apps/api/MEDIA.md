# API media

Migrated from the authored TypeScript avatar application in the prior OpenCok
checkout and consolidated into `apps/api`. Application code composes the shared Effect runtime and package exports:
`api/files` handles HTTP/multipart, `identity/avatar` verifies grants, `validations/image`
decodes/re-encodes images, `contracts/files` defines storage ports and limits, and
`storage/images` implements S3. Configuration lives in `env/files`.

## Development and configuration

Install with `bun install --frozen-lockfile`. Start the existing local MinIO service
with `docker compose --profile dev up -d minio`. Provision a private bucket named
`opencok-uploads` with the MinIO console or S3 tooling; do not enable anonymous reads.
Set the following values in the root `.env` or process environment, then run
`bun run --cwd apps/api start`:

| Setting                                      | Meaning                                                               |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `API_FILES_ENABLED`                          | Set `true` to enable media on the API listener; default `false`       |
| `API_HOST`, `API_PORT`                       | API listener, defaults `127.0.0.1:8082`                               |
| `FILES_SIGNING_KEY_FILE`                     | Default `/run/opencok/image-upload-key`; required existing key file   |
| `S3_BUCKET`                                  | Required existing private bucket                                      |
| `S3_ENDPOINT`                                | Optional custom HTTP(S) endpoint; use `http://127.0.0.1:9000` locally |
| `S3_REGION`                                  | Default `us-east-1`                                                   |
| `S3_FORCE_PATH_STYLE`                        | `true` for MinIO, default `false`                                     |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Optional explicit pair; otherwise AWS provider chain                  |
| `AWS_SESSION_TOKEN`                          | Optional temporary-credential token                                   |

Use the local credentials configured on `minio` in the development Compose file.
External deployments should use a scoped identity with GetObject/PutObject access,
without bucket listing or public policies. S3 uses one attempt and a five-second deadline.
The adapter disables connection reuse after an isolated Bun/MinIO test reproduced
`ECONNRESET` on the read following concurrent conditional writes. This costs a fresh
connection per operation; revisit when selecting and validating a production runtime. The
[SDK agent configuration](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html)
supports explicit HTTP/HTTPS agents.
The validated root environment supplies explicit credentials to the adapter; workload
identity remains available through the SDK provider chain when the pair is omitted.

Generate a 32-byte random key encoded as 64 lowercase hex characters in a protected
file, optionally with one final newline. Mount it read-only and share it only with the
trusted backend issuing upload grants. The service never generates or replaces keys.
The imported fixed key path remains the default; `FILES_SIGNING_KEY_FILE` makes local
operation possible without writing into `/run`. `FILES_HOST` and `FILES_PORT` are
removed; media uses the API listener. With media disabled, the API does not load
the signing key or require S3 configuration. Invalid enabled configuration fails startup.

Build the shared Bun development image with
`docker build -f apps/api/Dockerfile -t opencok-api:dev .`. The production Node.js
mandate is suspended by [ADR-0010](../../docs/decisions/0010-adopt-nodejs-for-production.md);
no replacement production runtime is selected.

For local Compose, provision the private bucket first and set
`FILES_SIGNING_KEY_FILE` to an existing absolute host key path readable by the
container user. Enable the checked-in overlay:

```sh
docker compose -f docker-compose.yml -f infra/compose/api-media.yml --profile dev up --build -d api gateway
```

The overlay uses local MinIO credentials and mounts the key read-only. It does not
provision a public uploads bucket or enable realm completion. External S3 endpoints
need an allowed egress network in the deployment. The gateway routes the exact upload
and JPEG paths to the API; `/_internal/avatars/...` remains unreachable through it.

## Contracts and boundaries

`POST /gameservice/www/gateway/json.php` accepts the imported multipart `data` and
single `file` contract, with an `X-Upload-Grant` binding owner/sequence for at most
120 seconds. It decodes JPEG/PNG, checks actual part MIME and bytes, limits inputs to
2 MiB, 4096 pixels per axis and 4194304 pixels total, and re-encodes JPEG without
metadata. Animated formats are rejected. Total request size is 2112 KiB; the shared
API listener accepts this cap when media is enabled; discovery POST bodies remain
limited to 64 KiB, including streamed requests without Content-Length.

Objects use `{last-six-owner-digits}/{md5(owner_sequence)}.jpg`. S3 conditional creation
makes each sequence immutable; duplicate uploads return 409. Owner, sequence and
SHA-256 metadata support authenticated confirmation. `GET`/`HEAD /cok/img/...jpg`
proxies public avatar bytes from the private bucket. Missing objects return 404;
provider failures return 503 without provider details.

Keep `GET /_internal/avatars/{owner}/{sequence}` private. It requires a separate
30-second `X-Avatar-Confirmation` HMAC and checks stored owner/sequence, JPEG marker
and actual SHA-256. A client upload grant cannot authorize confirmation.
The shared `/healthz` and `/readyz` replace the standalone `/_health` endpoint.
Readiness checks PostgreSQL and Redis, not S3; storage failures return 503 on media
requests while discovery remains available.

The TypeScript realm can issue grants and inspect pending receipts when explicitly
configured with `GAME_FILES_URL` pointing to the private API origin (for example
`http://api:8080`) and the same protected `FILES_SIGNING_KEY_FILE`; see
[realm avatar grants](../server/README.md#realm-avatar-grants). The private confirmation
route must be reachable only by trusted backend services. Grant-only configuration does
not enable completion. The realm supports `user.avatar.finish` when its separate
`GAME_AVATAR_CHAT_URL` and chat signing configuration are also supplied; see the
[completion runtime](../server/README.md#avatar-completion-runtime). Picture-version allocation is a separate realm operation; see its runbook.
Independently restored object/profile reconciliation remains unvalidated.
S3 receipts have no historical filesystem `completed` marker; restoring profile and object
state independently or resetting versions has not been validated.
No Android track is validated by this migration. GIF support, asynchronous processing,
orphan collection and the full media state machine remain future work. No private Java
adapters, client assets, historical uploads or signing keys are imported.

## Verification and recovery

Run `bun run --cwd apps/api check-types`, `bun run --cwd apps/api test` and
`bun run --cwd apps/api test:media`. Tests exercise grants, owner mismatch,
expiry, MIME/byte rejection, limits, JPEG delivery, private confirmation and failures.
Integration starts disposable MinIO and checks concurrent conditional writes,
metadata integrity and persistence across container restart; local volumes are untouched.

Back up the bucket, authoritative profile database and signing key consistently.
Restarting the service preserves objects and receipts. Roll back code/configuration
together while keeping the same bucket/key. No schema migration or object deletion
occurs. Reusing an existing sequence remains a conflict after rollback.

When upgrading an existing standalone Files deployment, keep the bucket and signing
key, move its S3/key settings into the API environment and set `API_FILES_ENABLED=true`.
Change `GAME_FILES_URL` to the private API origin and move the public upload/image
upstreams to API before retiring the old process. API liveness uses `/healthz`.
To roll back, restore the old Files image/upstream and realm URL with the same
bucket/key; do not reset avatar sequences or delete receipts.
