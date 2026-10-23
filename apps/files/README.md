# Files service

Migrated from the authored TypeScript avatar application in the prior OpenCok
checkout. Application code composes the shared Effect runtime and package exports:
`api/files` handles HTTP/multipart, `identity/avatar` verifies grants, `validations/image`
decodes/re-encodes images, `contracts/files` defines storage ports and limits, and
`storage/images` implements S3. Configuration lives in `env/files`.

## Development and configuration

Install with `bun install --frozen-lockfile`. Start the existing local MinIO service
with `docker compose --profile dev up -d storage`. Provision a private bucket named
`opencok-uploads` with the MinIO console or S3 tooling; do not enable anonymous reads.
Set the following values in the root `.env` or process environment, then run
`bun run --cwd apps/files start`:

| Setting                                      | Meaning                                                               |
| -------------------------------------------- | --------------------------------------------------------------------- |
| `FILES_HOST`, `FILES_PORT`                   | Defaults `127.0.0.1:8084`                                             |
| `FILES_SIGNING_KEY_FILE`                     | Default `/run/opencok/image-upload-key`; required existing key file   |
| `S3_BUCKET`                                  | Required existing private bucket                                      |
| `S3_ENDPOINT`                                | Optional custom HTTP(S) endpoint; use `http://127.0.0.1:9000` locally |
| `S3_REGION`                                  | Default `us-east-1`                                                   |
| `S3_FORCE_PATH_STYLE`                        | `true` for MinIO, default `false`                                     |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Optional explicit pair; otherwise AWS provider chain                  |
| `AWS_SESSION_TOKEN`                          | Optional temporary-credential token                                   |

Use the local credentials configured on `storage` in the development Compose file.
External deployments should use a scoped identity with GetObject/PutObject access,
without bucket listing or public policies. S3 uses one attempt and a five-second deadline.
The adapter disables connection reuse after an isolated Bun/MinIO test reproduced
`ECONNRESET` on the read following concurrent conditional writes. This costs a fresh
connection per operation; revisit after the production runtime migration. The
[SDK agent configuration](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/node-configuring-maxsockets.html)
supports explicit HTTP/HTTPS agents.
The validated root environment supplies explicit credentials to the adapter; workload
identity remains available through the SDK provider chain when the pair is omitted.

Generate a 32-byte random key encoded as 64 lowercase hex characters in a protected
file, optionally with one final newline. Mount it read-only and share it only with the
trusted backend issuing upload grants. The service never generates or replaces keys.
The imported fixed key path remains the default; `FILES_SIGNING_KEY_FILE` makes local
operation possible without writing into `/run`. Legacy `PORT` becomes `FILES_PORT`.

The Dockerfile is a Bun development image, matching API/server. Build with
`docker build -f apps/files/Dockerfile -t opencok-files:dev .`, pass the configuration
above, and mount the signing key read-only for the container user. Root Compose does
not yet start or publicly route this app. Production Node execution remains pending
[ADR-0010](../../docs/decisions/0010-adopt-nodejs-for-production.md).

## Contracts and boundaries

`POST /gameservice/www/gateway/json.php` accepts the imported multipart `data` and
single `file` contract, with an `X-Upload-Grant` binding owner/sequence for at most
120 seconds. It decodes JPEG/PNG, checks actual part MIME and bytes, limits inputs to
2 MiB, 4096 pixels per axis and 4194304 pixels total, and re-encodes JPEG without
metadata. Animated formats are rejected. Total request size is 2112 KiB; the shared
HTTP adapter accepts this cap without changing API/server defaults.

Objects use `{last-six-owner-digits}/{md5(owner_sequence)}.jpg`. S3 conditional creation
makes each sequence immutable; duplicate uploads return 409. Owner, sequence and
SHA-256 metadata support authenticated confirmation. `GET`/`HEAD /cok/img/...jpg`
proxies public avatar bytes from the private bucket. Missing objects return 404;
provider failures return 503 without provider details.

Keep `GET /_internal/avatars/{owner}/{sequence}` private. It requires a separate
30-second `X-Avatar-Confirmation` HMAC and checks stored owner/sequence, JPEG marker
and actual SHA-256. A client upload grant cannot authorize confirmation.
`/_health` is process liveness, not a bucket readiness check.

The TypeScript realm does not yet issue grants or commit avatar confirmations.
No Android track is validated by this migration. GIF support, asynchronous processing,
orphan collection and the full media state machine remain future work. No private Java
adapters, client assets, historical uploads or signing keys are imported.

## Verification and recovery

Run `bun run --cwd apps/files check-types`, `bun run --cwd apps/files test` and
`bun run --cwd apps/files test:integration`. Tests exercise grants, owner mismatch,
expiry, MIME/byte rejection, limits, JPEG delivery, private confirmation and failures.
Integration starts disposable MinIO and checks concurrent conditional writes,
metadata integrity and persistence across container restart; local volumes are untouched.

Back up the bucket, authoritative profile database and signing key consistently.
Restarting the service preserves objects and receipts. Roll back code/configuration
together while keeping the same bucket/key. No schema migration or object deletion
occurs. Reusing an existing sequence remains a conflict after rollback.
