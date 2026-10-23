---
status: accepted
date: 2026-10-23
decision-makers: ReeseArch64
---

# ADR-0006: Adopt Redis Insight for development inspection

## Context and Problem Statement

Redis-backed sessions and caches need inspectable keys, TTLs and instance
identity during development. The architecture names Redis Insight, but the root
Compose stack has no Redis Insight service.

The maintainer confirmed this decision on 2026-10-23 to make the technology
boundaries explicit for subsequent implementation work. Acceptance records the
choice; it does not certify that the implementation tasks below are complete.

## Decision

Use Redis Insight as an optional development visualizer for local Redis.
Display each configured instance with an explicit role (cache, or a future
separate queue instance). Bind the interface to loopback/private access, require
authenticated access, and do not expose it through game routes. If the selected
release lacks suitable UI authentication, supply a private authenticated access
layer before enabling it.

UI inspection must not be required for gameplay or CI. Do not export session
values or player identifiers into screenshots, fixtures or logs. This decision
does not introduce a queue system or authorize production Redis access.

## Consequences

- Inspecting TTLs and key prefixes helps diagnose local session behavior; instance labels must keep cache and durable queues distinguishable.
- A Redis administration UI can alter application state; scoped credentials and reproducible diagnostic procedures are required.

## Implementation Plan

- **Affected paths**: `docker-compose.yml`, `infra/redis/README.md`, `infra/compose/README.md`, future tooling smoke checks.
- **Dependencies**: No application package. Pin a Redis Insight image that passes a smoke test with the local Redis version; selecting its exact release and authentication mechanism is an implementation prerequisite.
- **Patterns to follow and avoid**: Follow architecture section 23 and the isolated Redis service. Avoid public ingress, production credentials, Docker socket access and startup dependencies from applications to the UI.
- **Configuration**: Provide a separate development tool profile, private UI endpoint and internal Redis connection; document auth and optional persistent UI settings without committing secrets.

The following local TODOs track implementation until they are linked to GitHub
work through the [contribution process](../../.github/CONTRIBUTING.md). This
record does not authorize deployment or a database migration.

- [ ] TODO ADR-0006.1: Select/pin the UI image and authentication approach; add an optional Compose profile with loopback-only exposure.
- [ ] TODO ADR-0006.2: Document labeled cache connections and a synthetic TTL inspection workflow; add a queue connection only if queues are separately adopted.

### Verification

- [ ] An unauthenticated client cannot access the UI and Compose exposes no public game route to it.
- [ ] An authenticated developer can inspect the TTL of a synthetic cache key and identify its cache instance.
- [ ] API/realm startup and core tests pass without Redis Insight running.

## Alternatives Considered

These are tradeoff comparisons for this record, not a claim that a benchmark
or a historical evaluation was performed.

- `redis-cli` is suitable for automation but does not supply the requested graphical inspection.
- A generic Redis web console could inspect keys, but would introduce another UI choice instead of the tool already named by the architecture and maintainer.

## More Information

- **Implementation evidence at acceptance**: Planned tool; no current image, authentication layer or Compose integration is claimed.
- **Related decisions and architecture**: [ADR-0005](0005-adopt-redis-for-cache.md); [architecture section 23](../../.github/ARCHITECTURE.md#23-development-environment-and-administrative-tools).
- **Review again when**: the stated boundaries cannot be maintained, a required
  dependency becomes unsupported, or measured compatibility/operational results
  invalidate the choice. A replacement requires a linked superseding ADR.

### 2026-10-23: Include Redis Insight in both development profiles

The maintainer added a Redis Insight Compose service and subsequently requested
`dev` and `all` on every service. This replaces the planned separate tooling
profile for this local stack. A named `redisinsight-data` volume supplies its
persistent UI state. API/server do not depend directly on the visualizer.

- [ ] Verify both profiles include Redis Insight and its health endpoint, UI and
      database-list API respond in the isolated stack.

The smoke checks in `tests/stack/compose.test.ts` do not establish the original
UI-authentication or pinned-image criteria; those implementation tasks remain
open for the maintainer-supplied `latest` image configuration.
