# Security and Privacy

OpenCoK follows zero-trust, least-privilege and data-minimization principles.
Operators retain control of their deployments and persistent data. These rules
apply to contributors, operators, automation and coding agents across source,
clients, infrastructure, documentation and operational tooling.

Read this policy alongside the [product definition](../PRODUCT.md),
[architecture](ARCHITECTURE.md) and [contribution guide](CONTRIBUTING.md).

## Protected data and permitted use

Access only the files, fields and environments necessary for the authorized task.
Player identities, account records, messages, media, device information, payment
records and database exports are protected data, not debugging fixtures. Do not
collect them merely because they are available. Prefer synthetic accounts and
isolated disposable resources for tests and reproductions.

Keep development, testing and production contexts separate, including identities,
credentials and storage. Preserve realm isolation and do not mix player or operator
data across contexts without an explicit operational need and authorization.
Permission to store or inspect data does not authorize disclosure.

Ignored files, including authorized references under `data/`, are local inputs,
not shared dependencies. Keep original mobile inputs read-only; extract, patch
and package in a separate directory. Never force-add private Elex code, client
artifacts, signing material or unauthorized third-party assets.

## Secrets

Never request or reproduce actual secrets in conversations, issues, pull requests,
notes, attachments, filenames, commits, test fixtures, build artifacts or logs.
This includes:

- Passwords, PINs and recovery answers.
- Seed phrases, private keys and secret cryptographic material.
- API keys, access or refresh tokens, session cookies and service credentials.
- Certificates containing private keys and configuration files containing secrets.
- TOTP/2FA seeds and authentication recovery or backup codes.

Generate and provision operational secrets only through an authorized secure
workflow, outside tracked files and conversational output. Keep them in an
operator-controlled secret store or protected runtime configuration. Use strong,
unique credentials per service, with narrowly scoped access. Configuration examples
must use unmistakable placeholders, not working credentials. Describe services,
purpose and status without recording their credentials.

Keep server-side credentials out of mobile and web clients, downloadable resources
and public configuration. In particular, storage credentials remain server-side;
authenticated, purpose-bound media authorization does not permit disclosing them.

## Transfers and external destinations

Do not send protected data, private inputs or secrets to external destinations.
This covers files, excerpts, attachments, metadata, summaries and derivatives sent
through searches, AI services, APIs, integrations, messages, forms, uploads,
remote repositories, synchronization, backups, error reporting or telemetry.
Installed tools, configured remotes and self-hosted destinations are not, by
themselves, authorization to transmit data. Summarization, encoding, presumed
anonymization and temporary files do not bypass this restriction.

Public, independently authored project code and documentation may follow the
normal contribution workflow after review for protected content. Deployment data
flows and backups require a defined purpose, minimum necessary data, authorized
destination, access controls and retention/recovery rules. Existing product
integrations are not blanket permission to export operational data.
If a task requires an unauthorized transfer, stop that step and inform the
responsible operator or maintainer before proceeding.

## Access, network and observability

- Authenticate state-changing operations, validate untrusted input and enforce
  ownership, realm and purpose boundaries on the server. Client claims alone do
  not establish authorization.
- Do not broaden permissions or expose services for convenience. Administrative
  interfaces such as pgAdmin, Redis Insight, Portainer, Mongo Express and gateway
  administration stay on local or private networks unless a specific change is
  justified, authorized and secured. They are not public game APIs.
- Keep private object storage private. Follow the documented media authorization
  and signed-URL rules; do not publish private receipts or bearer URLs as evidence.
- Exclude credentials, session tokens, device identifiers, private player
  identities, payloads, SQL and raw exception messages/stacks from operational
  reports and telemetry. Use controlled failure reasons and synthetic evidence.
- Use the documented filtered local observability path. Adding a remote exporter
  or integration requires a separate assessment of destination and data exposure.

## Files, history and recovery

These restrictions cover text, images, PDFs, archives and embedded metadata.
Evaluate documents and artifacts safely before importing them. Shell history,
packet captures, database dumps, backups and migration inputs may contain protected
content; do not copy them indiscriminately or use them as public evidence.

Check the staged diff and relevant artifacts for secrets and private data before
committing. Local history does not authorize pushing, publishing or synchronizing.
Removing a value from the current version does not remove it from Git history,
caches, logs or existing copies. Report known earlier exposure without reproducing
the value or automatically rewriting history.

Backups and migrations must preserve valid player progress without broad resets.
Sensitive recovery material belongs in separately protected operator-controlled
storage, never the repository or CI artifacts. Restore tests use isolated resources
and must not expose production records.

## Exposure or suspected exposure

1. Stop the affected operation and any writes, copies, uploads or commits that
   would propagate the data.
2. Notify the responsible operator or maintainer privately, without reproducing
   the value. Identify only the necessary location and data category.
3. Describe the known scope and uncertainties. Do not claim external access or
   compromise without evidence.
4. Propose revocation or rotation and controlled removal where appropriate,
   including affected history, artifacts and downstream copies.
5. Wait for specific authorization before deleting files, changing credentials,
   restoring versions or rewriting history. Preserve unrelated work and evidence
   without copying secrets.

Do not investigate unrelated data or include secrets as proof. When sensitivity,
authorization or destination is uncertain, stop and ask.

## Reporting vulnerabilities

Do not report sensitive vulnerability details through public Discussions, issues,
pull requests or CI logs. Use GitHub private vulnerability reporting from the
repository Security tab if available. If unavailable, ask a maintainer to establish
an appropriate private channel without disclosing vulnerability details publicly.
A private channel still does not authorize transmitting secrets or player data.

Provide affected components, client/server versions, impact and minimal synthetic
reproduction steps. Do not include production dumps, credentials, private client
artifacts or real player records. Test only environments you control or are
explicitly authorized to assess; do not exploit other operators or players.
Coordinate remediation and disclosure privately before publishing safe details.
The public discussion-before-issue workflow does not apply to sensitive reports.

Recognition of a client version is not a security-support guarantee. Consult
current compatibility and validation records; this policy promises no response
time, patch deadline or security coverage for unverified versions.

## Policy limits

This document defines requirements, not proof of technical enforcement. Do not
claim that plugins, agents, synchronization, network access, secret scanning,
backup controls or telemetry filtering are blocked or safe without verification.
Report unverified controls and limitations, and propose a separate assessment
where needed. Do not weaken checks or expand access to make a task pass.
