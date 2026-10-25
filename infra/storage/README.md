# Local MinIO CDN

The development Compose stack has one MinIO service (`minio`) and one
idempotent initialization job (`minio-setup`), both in profiles `all` and `dev`.
Local development credentials, ports and bucket names are written directly in
Compose and the initialization script. Production deployment is separate.

The source is the repository-local ignored directory `data/cdn/data`:

```text
data/cdn/data/
  cok.eleximg.com/cok/...
  asset.cok.chat/100001/...
```

The initialization job mirrors these two extracted host trees into
`opencok-cdn`, preserving their host prefixes. It does not import root archives
such as `cok-cdn.zip`, delete source files or remove destination objects. The
source mount is read-only. The existing `minio-data` volume is retained.

Public bucket permissions allow object reads only beneath the two CDN host
prefixes. Bucket listing, root archives and the `opencok-uploads` bucket remain
private. Avatar uploads use the shared API, with their own private bucket and
[media configuration](../../apps/api/README.md#avatar-media).

The gateway serves `/cok/*` (excluding `/cok/img/*`) and `/100001/*`, preserving
Range, ETag and HEAD behavior. Requests use the MinIO upstream Host and fixed
bucket/host prefixes; they do not fall back to publisher infrastructure. Hidden
components, partial files and script paths have no public router. MinIO itself
is also published on port 9000; its authenticated console uses port 9001.

```sh
docker compose --profile dev up -d minio minio-setup
docker compose --profile dev logs minio-setup
```

Changing source assets requires rerunning the one-shot job:

```sh
docker compose --profile dev run --rm minio-setup
```

The gateway waits for successful initialization. No routine command removes
volumes, flushes the database or resets player progress. `bun run test:stack`
uses disposable volumes and synthetic files to verify object reads, Range/ETag,
private archives/uploads and the game discovery/login path together.
