---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0004: Adopt pgAdmin 4 for development inspection

## Context and Problem Statement

The local PostgreSQL topology has a global database and two kingdom databases.
The current setup job already generates password-free pgAdmin registrations and
Compose provides a persistent pgAdmin volume. The interface needs a documented
development-only boundary.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Keep pgAdmin 4 as the optional PostgreSQL visualizer in development. Retain the
`dpage/pgadmin4:9.18` local baseline and existing `all` profile; it is not required
by the `dev` profile or application startup. Use setup-generated registrations
without embedded passwords. Restrict the published interface to loopback/private
developer access and use credentials scoped to the target environment.

Inspecting SQL or executing a local diagnostic query does not replace Drizzle
migrations. This decision does not approve exposing pgAdmin on public game routes
or using it as the product administration panel.

## Consequences

- Generated registrations keep the three database targets consistent; the setup script must remain aligned with topology changes.
- Persisted UI state and administrative access need lifecycle and access checks; a UI action cannot become the sole record of a schema change.

## Implementation Plan

- **Affected paths**: `docker-compose.yml`, `packages/drizzle/scripts/setup-compose.ts`, `infra/compose/README.md`, `tests/stack/compose.test.ts`.
- **Dependencies**: Keep the existing pinned `dpage/pgadmin4:9.18` image; no JavaScript package is added.
- **Patterns to follow and avoid**: Follow setup-generated password-free registrations and named volumes. Avoid hardcoding player database passwords in registration JSON or bypassing versioned migrations.
- **Configuration**: Retain `PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` configuration and the generated server-registration volume; verify published bindings before enabling the interface.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0004.1: Audit/restrict the UI host binding and document development credentials and persistence without altering player databases.
- [ ] TODO ADR-0004.2: Keep server registrations for global and both kingdoms derived from the same validated topology.

### Verification

- [ ] `docker compose --profile all config` includes pgAdmin; the `dev` profile omits it and no public gateway route targets it.
- [ ] Generated registration JSON lists the three configured databases and contains no database password.
- [ ] An authenticated local UI can connect to a synthetic database; recreating the UI preserves its named-volume settings.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- DBeaver is a capable desktop client but requires individual installation instead of the existing shared Compose configuration.
- `psql` remains the preferred scriptable diagnostic interface, but does not replace the requested graphical database inspection.

## More Information

- **Implementation evidence at acceptance**: Compose, setup-generated registration and persistent volumes already exist; their existence does not prove production access restrictions or a deployment.
- **Related decisions and architecture**: [ADR-0002](0002-adopt-postgresql-for-authoritative-state.md); [architecture section 23](../../.github/ARCHITECTURE.md#23-development-environment-and-administrative-tools).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.

### 2026-10-23: Include pgAdmin in both development profiles

The maintainer subsequently requested `dev` and `all` on every Compose service.
This operational amendment supersedes the initial `all`-only profile choice and
the verification criterion that `dev` omits pgAdmin. Both profiles now include
pgAdmin and the same complete service set. pgAdmin remains outside the public
game ingress and is not a direct dependency of API/server startup.

- [ ] Verify both profiles include pgAdmin, its ping/login page responds, and the
      setup-generated registration contains the synthetic database user without a password.

These checks are implemented in `tests/stack/compose.test.ts`; a passing run is
evidence for the tested disposable stack, not a production deployment.
