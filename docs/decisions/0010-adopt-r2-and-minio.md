---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0010: Adopt R2 for releases and MinIO for local S3-compatible storage

## Context and Problem Statement

Release distribution and private player media have different trust, lifecycle and
availability requirements. Product plans call for Cloudflare R2 distribution of
signed Android application packages (APKs) and Lua releases. Current avatar media
already uses an S3-compatible interface with MinIO as the local development baseline.
Neither current local storage nor a downloaded artifact proves native installation.

Acceptance selects these separate responsibilities; it does not verify an R2
account, external hosting, native update bridge or production media provider.

## Decision

Use R2 for planned signed APK/Lua release distribution. Require immutable release
objects, authenticated manifests, hash/package/certificate/version checks and
recoverable activation. Native APK installation additionally requires a validated
Android bridge, platform consent and signing-identity continuity. Preserve Guest
account recovery and player progress across updates; downloading is not installation.

Retain MinIO for local S3-compatible storage and private avatar uploads, not as a
mandated production provider. Keep release artifacts, private media and the current
client CDN in distinct buckets and authorization policies. The local CDN uses its
fixed path layout; it is not the private upload bucket or the future R2 release store.
Chat attachments are not implicitly moved into release distribution.

Private media stays behind server-side credentials, realm-issued purpose-bound
tickets and five-minute presigned S3 reads. `S3_ENDPOINT` selects the API's internal
origin; `S3_PUBLIC_ENDPOINT` selects the client-reachable signing origin. Keep all
five required media settings together; with none supplied, discovery remains usable.
Choose and validate production private storage separately through these interfaces.

Non-goals: deploying buckets, migrating existing objects, installing an updater,
publishing private client inputs/signing keys or making private buckets public.

## Consequences

- Separate stores prevent release publication from granting access to player objects; operators must maintain distinct permissions, retention and recovery procedures.
- S3 interfaces reduce local/provider coupling but do not guarantee R2 or production-provider parity; signing, CORS, checksums and failure behavior need explicit tests.
- Signed releases need a protected publishing/signing process and rollback policy; the client must reject invalid artifacts before activation.
- Local media persistence requires preserved volumes and receipts; production object backups must be coordinated with authoritative metadata rather than resetting player state.

## Implementation Plan

- **Affected paths**: `packages/storage/src/images.ts`, `packages/storage/src/avatar-tickets.ts`, `packages/env/src/api.schema.ts`, `apps/api/tests/files.test.ts`, `apps/api/integration/s3.test.ts`, `docker-compose.yml`, `docker-compose.dev.yml`, `apps/api/README.md`.
- **Release planning paths**: Maintain the release manifest, validation and recovery contract in `PRODUCT.md` and `.github/ARCHITECTURE.md` before separately authorized publisher/client implementation. Original mobile inputs remain read-only, outside tracked source.
- **Dependencies**: Reuse lockfile-resolved `@aws-sdk/client-s3` (`^3.0.0`) and `@aws-sdk/s3-request-presigner` (`^3.1156.0`) for current media. Retain the current `ghcr.io/coollabsio/minio` local baseline; pin a validated image digest before reproducible promotion. No dependency or image is installed by this record.
- **Patterns**: Preserve `S3ImageStore`, immutable owner/sequence keys, metadata hashes, idempotent replacement cleanup and ticket ownership/purpose/TTL checks. Never log bearer URLs or credentials.
- **Configuration**: Preserve `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` and both endpoint roles. Release credentials/configuration must be separate and selected in authorized release work, not inferred from media variables.
- [ ] Extend synthetic media tests for private access, expiring URLs, retries, provider failures and restart persistence without changing buckets or journals in place.
- [ ] Define and exercise a synthetic signed-release fixture matrix for corrupt manifests, hashes, certificates, versions, interrupted downloads and recoverable activation before enabling an updater.
- [ ] Record provider compatibility, backup/restore and rollback evidence separately from this accepted choice.

### Verification

- [ ] API unit and isolated S3 integration tests pass; anonymous private-media reads fail while authorized presigned reads expire after five minutes.
- [ ] Internal storage operations use `S3_ENDPOINT`; signed URLs use `S3_PUBLIC_ENDPOINT` and contain no server credential disclosure.
- [ ] Wrong-owner, wrong-purpose and expired media tickets are rejected; replacement retries preserve receipts and immutable sequence behavior.
- [ ] A disposable MinIO restart preserves synthetic objects; absent media configuration does not prevent discovery.
- [ ] Release validation rejects tampered artifacts and restores the previous working version after interrupted activation; native APK installation is verified separately on Android.
- [ ] Release, CDN and private-media bucket policies are reviewed independently; no production or R2 compatibility claim rests only on local MinIO tests.

## Alternatives Considered

These are design tradeoffs, not evidence of historical provider comparisons.

- Amazon S3 could serve both workloads with mature tooling, but would change the selected release provider and still require separate buckets, permissions and compatibility testing.
- Self-hosting release downloads alongside MinIO gives operators infrastructure control but adds public distribution capacity and availability work; it does not remove signing or Android installation requirements.

## More Information

See [avatar media](../../apps/api/README.md#avatar-media),
[mobile transition](../../PRODUCT.md#mobile-transition) and
[architecture](../../.github/ARCHITECTURE.md).
Revisit for verified provider incompatibility, release constraints or changed storage requirements.
