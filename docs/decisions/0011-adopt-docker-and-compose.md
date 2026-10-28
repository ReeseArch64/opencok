---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0011: Adopt Docker and Compose for the local development stack

## Context and Problem Statement

API, realm, Chat and their dependencies need a repeatable local topology with
explicit startup ordering, network boundaries and persistent state. Existing
Dockerfiles and Compose files already describe this environment; the decision
records their role without treating a local startup as a production qualification.

The production target is a European single-node Kubernetes VPS with external
services. Kubernetes integration, resource sizing and release validation remain
future work. One host is one failure domain, not a high-availability guarantee.
Acceptance does not certify deployment or external-provider compatibility.

## Decision

Use Docker images for the maintained application services and Docker Compose v2
for local orchestration. Run development with `docker-compose.yml` plus
`docker-compose.dev.yml`, following the existing profile and service-DNS patterns.
Keep the root environment convention and validated application configuration.

Retain the current separation: the base defines services and accepts configured
external dependencies; the development override adds local PostgreSQL setup,
Redis/MinIO readiness and CDN initialization ordering. Omitting the override does
not remove local services defined by base profiles. A profile named `prod` is not
proof that this stack is a production deployment.

Preserve named volumes and setup-job completion semantics. Gateway HTTP/TCP ports
remain separate, API/realm listeners are not directly host-published, and tooling
is optional. Development-published administration ports require a trusted local
network; they are not approved public game endpoints.

Non-goals: selecting a production runtime, deploying Kubernetes, guaranteeing
high availability, installing dependencies or changing images/configuration here.
Do not broaden Docker socket access beyond separately scoped administration needs.

## Consequences

- A shared topology makes service ordering reproducible, but healthchecks demonstrate bounded readiness, not complete native-client or dependency compatibility.
- Persistent volumes support recreation without data loss; migrations and backup/restore must be tested rather than using volume deletion as a repair.
- Production-only installs skip lifecycle scripts; build inputs must exclude private originals, local secrets and generated operational data.
- Local image tags and direct development addresses require maintenance; production must select validated immutable artifacts and secure ingress separately.

## Implementation Plan

- **Affected paths**: `docker-compose.yml`, `docker-compose.dev.yml`, `apps/api/Dockerfile`, `apps/server/Dockerfile`, `apps/chat/Dockerfile`, `.dockerignore`, `infra/compose/README.md`, `.github/ARCHITECTURE.md`.
- **Dependencies**: Use Docker Engine and Compose v2 supporting profiles, health conditions and `up --wait`. Retain existing service image baselines and current `oven/bun:1.4.2` build / `1.4.2-slim` runtime images pending separately validated updates; no installation occurs here.
- **Patterns**: Preserve multi-stage builds, frozen production dependency installation with `--ignore-scripts`, non-root application execution, service DNS, readiness checks and one-shot setup jobs. Do not copy ignored private inputs into images.
- **Configuration**: Preserve root environment injection, internal/external network roles, named-volume identities and external `DATABASE_URL`/`REDIS_URL`/S3 endpoints. Do not print interpolated secrets as validation evidence.
- [ ] Validate merged Compose configuration and profile selection with synthetic environment values; document required authorized CDN inputs without copying them into source.
- [ ] Exercise builds, readiness ordering, dependency outages and clean shutdown against disposable data; extend existing application/integration tests where contracts change.
- [ ] Test recreation and backup/restore of synthetic databases and objects without `down -v`; document safe image and schema rollback constraints.
- [ ] Keep Kubernetes, managed-provider compatibility, production resource budgets and rollout/drain/reconnect checks as separate release prerequisites, not implied Compose deliverables.

### Verification

- [ ] `docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev config --quiet` succeeds with synthetic required settings.
- [ ] Merged development configuration waits for local setup/health; base app definitions alone do not require local PostgreSQL, Redis or MinIO startup.
- [ ] Isolated `up --build -d --wait` completes with authorized test inputs; one-shot setup jobs exit zero and application readiness reports dependency failures accurately.
- [ ] Recreating containers preserves synthetic database/object state and volume names; graceful shutdown and reconnect tests pass.
- [ ] Images start as non-root users with built artifacts, contain no private inputs/secrets and do not require Husky lifecycle setup.
- [ ] API/realm ports are not directly published; inspection tools remain optional and no new public administration route is introduced.

## Alternatives Considered

These comparisons do not assert prior benchmark or deployment results.

- Native host processes avoid a container engine but require manual dependency versions, networking and readiness coordination across operator machines.
- Kubernetes locally would resemble the production target but adds cluster operational overhead before release manifests and resource budgets are established.
- Podman Compose can reduce Docker daemon coupling but needs its own validation of networking, health conditions and build behavior; it is not assumed drop-in compatible.

## More Information

See the [local stack guide](../../infra/compose/README.md),
[architecture](../../.github/ARCHITECTURE.md) and
[contribution rules](../../.github/CONTRIBUTING.md).
Revisit if supported development environments cannot reproduce the documented topology.
