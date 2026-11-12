# Security and Privacy

Zero trust, least privilege and data minimization apply to source, clients, infrastructure, tooling and operations. Operators control deployments and persistent data.

## Protected data and secrets

- Access only task-required files, fields and environments. Accounts, identities, messages, media, devices, payments and database exports are protected; use synthetic accounts and disposable test resources.
- Separate development, test and production credentials/storage. Cross-realm or cross-context access requires an explicit operational purpose; inspection permission does not authorize disclosure.
- Never request or reproduce actual passwords, recovery answers/codes, seed phrases, private keys, signing material, API/access/refresh/session credentials, private-key certificates, secret configuration or TOTP seeds in conversations, source, commits, fixtures, builds, filenames or logs.
- Provision secrets through authorized secure workflows and operator-controlled storage. Use unique per-service credentials, narrow permissions and unmistakable example placeholders. Server/storage credentials never belong in clients or public resources; signed media access does not permit credential disclosure.
- Never commit private Elex code, unauthorized third-party assets, player records or private client artifacts. Evaluate archives, images, PDFs, histories and embedded metadata before importing or sharing them.

## Transfers and access

Protected data, secrets and derivatives must not leave authorized destinations through searches, AI tools, APIs, messages, uploads, remotes, synchronization, backups or telemetry. Installed integrations, self-hosting, encoding and presumed anonymization do not authorize transfer. Stop unauthorized transfers and inform the responsible operator/maintainer.

Reviewed public, independently authored work may be shared within its authorized workflow. Deployment/backups require purpose, minimum necessary data, access controls and retention/recovery rules; an existing integration grants no blanket export permission.

Authenticate state changes, validate untrusted input and enforce ownership, realm and purpose boundaries server-side. Never broaden permissions for convenience. Administrative interfaces remain private unless specifically authorized and secured; object storage stays private behind purpose-bound access.

Operational reports omit credentials, sessions, device/player identifiers, payloads, SQL and raw exception messages/stacks. Use controlled failure reasons and synthetic evidence. External exporters require separate destination/exposure assessment.

## History and recovery

Inspect staged content/artifacts for protected data before committing. A local commit does not authorize publication; deleting a current file does not erase history, caches or downstream copies. Do not automatically rewrite history after exposure.

Backups/migrations preserve valid progress without broad resets. Recovery material belongs in protected operator storage, outside repositories/CI artifacts; restore tests use isolated resources.

## Exposure response

1. Stop affected operations and propagation through writes, copies, uploads or commits.
2. Notify the responsible operator/maintainer privately with location/category, never the value.
3. Describe known scope and uncertainty; claim compromise only with evidence.
4. Propose revocation/rotation and controlled removal across history/artifacts/copies.
5. Obtain specific authorization before deletion, credential changes, restores or history rewrites; preserve evidence without copying secrets.

Do not investigate unrelated data or use secrets as proof. Ask when sensitivity, authorization or destination is unclear.

## Vulnerability reporting

Use GitHub private reporting in the repository Security tab when available; otherwise request a private maintainer channel without public details. Private channels still do not authorize transmitting secrets or player records.

Provide affected components/versions, impact and a minimal synthetic reproduction. Test only controlled, authorized environments; coordinate remediation/disclosure before safe publication. Sensitive reports bypass public discussion-before-issue requirements.

Recognized client editions do not imply security support. No response deadline, patch deadline or coverage for unverified versions is promised. Verify enforcement before claiming network, agent, telemetry, backup or scanning controls are effective; report unverified controls without weakening them.
