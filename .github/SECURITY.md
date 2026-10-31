# Security and Privacy

Zero trust, least privilege and data minimization apply to contributors, operators, automation and agents across source, clients, infrastructure, documentation and tooling. Operators control deployments/persistent data.

## Protected data

Access only files/fields/environments required by the authorized task. Player identities, accounts, messages, media, devices, payments and database exports are protected, not debugging fixtures; prefer synthetic accounts/isolated disposable resources.

Separate development/testing/production identities, credentials and storage. Preserve realm isolation; cross-context player/operator data requires explicit operational need/authorization. Storage/inspection permission does not authorize disclosure.

Ignored files, including authorized `data/` references, are local inputs, never shared dependencies. Keep mobile originals read-only; extract/patch/package separately. Never force-add private Elex code, client artifacts, signing material or unauthorized third-party assets.

## Secrets

Never request/reproduce actual secrets in conversations, issues, PRs, notes, attachments, filenames, commits, fixtures, builds or logs. Includes passwords/PINs/recovery answers; seed phrases/private keys/secret cryptographic material; API/access/refresh/session/service credentials; private-key certificates/secret configuration; TOTP/2FA seeds and recovery/backup codes.

Generate/provision secrets only through authorized secure workflows outside tracked files/conversational output. Use operator-controlled secret storage/protected runtime configuration, strong unique per-service credentials and narrowly scoped access. Examples use unmistakable placeholders; describe purpose/status without credentials.

Server/storage credentials stay outside clients, downloadable resources and public configuration. Purpose-bound authenticated media authorization never permits credential disclosure.

## Transfers

Never send protected data/private inputs/secrets externally, including excerpts, attachments, metadata, summaries and derivatives through searches, AI, APIs, integrations, messages, forms, uploads, remotes, synchronization, backups, error reporting or telemetry. Installed tools, configured remotes and self-hosting do not authorize transmission; encoding, presumed anonymization and temporary files do not bypass restrictions.

Reviewed public, independently authored code/documentation may follow contribution workflows. Deployment flows/backups require purpose, minimum necessary data, authorized destination, access controls and retention/recovery rules; existing integrations grant no blanket export permission. Stop unauthorized transfer steps and inform the responsible operator/maintainer.

## Access and observability

- Authenticate state changes, validate untrusted input and enforce server-side ownership/realm/purpose boundaries; client claims do not establish authorization.
- Never broaden permissions/exposure for convenience. Administrative interfaces (pgAdmin, Redis Insight, Portainer, Mongo Express, gateway administration) stay local/private unless specifically justified, authorized and secured; they are not public game APIs.
- Keep object storage private; follow documented media authorization/signed-URL rules. Never publish private receipts/bearer URLs as evidence.
- Exclude credentials, sessions, device/player identifiers, payloads, SQL and raw exceptions/stacks from operational reports/telemetry; use controlled failure reasons/synthetic evidence.
- Use documented filtered local observability; remote exporters/integrations require separate destination/exposure assessment.

## Files, history and recovery

Restrictions include images, PDFs, archives and embedded metadata. Evaluate imports safely; histories, packet captures, dumps, backups and migration inputs may contain protected content and must not be copied indiscriminately or used as public evidence.

Check staged diffs/artifacts for secrets/private data before commits. Local history does not authorize pushing/publishing/syncing; current-version removal does not erase history/caches/logs/copies. Report earlier exposure without reproducing values or automatically rewriting history.

Backups/migrations preserve valid progress without broad resets. Sensitive recovery material stays in separately protected operator storage, never repositories/CI artifacts. Restore tests use isolated resources without exposing production records.

## Exposure or suspected exposure

1. Stop affected operations and writes/copies/uploads/commits that propagate data.
2. Notify the responsible operator/maintainer privately; disclose only necessary location/category, never the value.
3. Describe known scope/uncertainties; claim external access/compromise only with evidence.
4. Propose appropriate revocation/rotation and controlled removal, including history/artifacts/downstream copies.
5. Await specific authorization before deletion, credential changes, restores or history rewrites. Preserve unrelated work/evidence without copying secrets.

Never investigate unrelated data or provide secrets as proof. Stop and ask when sensitivity, authorization or destination is unclear.

## Reporting vulnerabilities

Never publish sensitive details in Discussions/issues/PRs/CI logs. Use GitHub private reporting in the repository Security tab if available; otherwise ask a maintainer for a private channel without public details. Private channels still do not authorize transmitting secrets/player data.

Provide affected components/versions, impact and minimal synthetic reproduction, without production dumps, credentials, private client artifacts or player records. Test only controlled/explicitly authorized environments; never exploit other operators/players. Coordinate remediation/disclosure privately before safe publication. Sensitive reports bypass public discussion-before-issue requirements.

Recognized client versions do not guarantee security support; consult compatibility/validation records. No response-time, patch-deadline or unverified-version coverage is promised.

## Policy limits

Requirements do not prove enforcement. Verify controls before claiming plugins/agents/synchronization/network/secret scanning/backups/telemetry are blocked or safe. Report unverified controls/limitations and propose separate assessment as needed; never weaken checks or expand access to pass.
