---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0003: Adopt Mongo Express for development inspection

## Context and Problem Statement

MongoDB document work needs a repeatable inspection interface for synthetic
local data. The architecture names Mongo Express, but the current Compose stack
does not provision either MongoDB or Mongo Express.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use Mongo Express as an optional development interface for local MongoDB.
Require authentication, bind any published interface port to loopback and connect
to MongoDB over the internal Compose network. Give it only the database access
needed for the development task. Never add it to the production game ingress or
make it a startup dependency of application services.

UI edits are disposable diagnostic actions; schema/index changes and data repair
procedures must be reproducible in versioned scripts. This decision neither
selects a production administration tool nor authorizes use of real player data.

## Consequences

- Developers can inspect document and expiration fields through a shared interface; reproducible scripts are still required for changes.
- The UI adds an administrative attack surface and version compatibility work; optional profiles, authentication and loopback binding contain exposure.

## Implementation Plan

- **Affected paths**: `docker-compose.yml`, `infra/compose/README.md`, `packages/env/` if validation is needed, future document integration tests.
- **Dependencies**: No application dependency. Before enabling the profile, pin a Mongo Express image compatible with the MongoDB server selected for ADR-0001; do not use a floating `latest` tag.
- **Patterns to follow and avoid**: Follow optional development tooling boundaries in architecture section 23. Do not grant Docker socket access, publish it via Traefik or reuse production credentials.
- **Configuration**: Document separate local UI credentials and a server-side MongoDB connection setting; use the existing root `.env` convention without committing its values.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0003.1: Add Mongo Express in an optional tooling profile after ADR-0001 provisioning, with pinned image, authentication and loopback port.
- [ ] TODO ADR-0003.2: Document login, database scope, synthetic sample inspection and reproduction of any UI-originated change.

### Verification

- [ ] Compose configuration inspection shows a loopback host binding and no public gateway route.
- [ ] The UI rejects an unauthenticated request and an authenticated session can inspect a synthetic document.
- [ ] Core application startup and CI tests succeed when Mongo Express is omitted.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- MongoDB Compass provides a desktop workflow but does not deliver the selected Compose-hosted browser interface.
- `mongosh` remains useful for scripts and automation, but alone does not provide the requested visual inspection workflow.

## More Information

- **Implementation evidence at acceptance**: Target tool only; no Compose service or image version is currently configured.
- **Related decisions and architecture**: [ADR-0001](0001-adopt-mongodb-for-documents.md); [architecture section 23](../../.github/ARCHITECTURE.md#23-development-environment-and-administrative-tools).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.
