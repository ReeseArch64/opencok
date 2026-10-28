# Stack and Tool Decisions

This catalog contains only stack/tool selections. System design, domain layout, semantic modeling and process authority belong in the [architecture](../../.github/ARCHITECTURE.md); product scope belongs in [PRODUCT.md](../../PRODUCT.md), and delivery rules in [CONTRIBUTING.md](../../.github/CONTRIBUTING.md).

## Conventions

- Use English, sequential `NNNN-adopt-topic.md` filenames and the ADR skill's simple template. One approved stack/tool group per record; keep each ADR change in its own commit.
- Include context, bounded decision/non-goals, consequences, concrete implementation paths/dependencies/patterns, testable verification checkboxes and alternatives.
- Status is `proposed`, `accepted`, `rejected`, `deprecated` or `superseded`. Human confirmation is required for acceptance. Acceptance records a choice, not completed implementation, deployment, security enforcement or verification.
- After this explicitly approved catalog consolidation, do not renumber records or rewrite accepted history. Append dated learnings; supersede with a new record and reciprocal links when choices change. Keep implementation tasks and verification evidence separate.
- Reference governing code paths and link records from component prose/PR metadata. Do not add source comments or create ADRs for routine implementation, bug fixes or architecture details already owned elsewhere.

## Current catalog

The maintainer confirmed this ordered catalog on 2026-10-28. New implementation, dependency installation and production deployment are not authorized by catalog acceptance alone.

| ADR                                           | Stack/tool group                                                    | Status and implementation boundary                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [0001](0001-adopt-typescript.md)              | TypeScript                                                          | Accepted; maintained application/shared source.                                                        |
| [0002](0002-adopt-bun.md)                     | Bun                                                                 | Accepted development toolchain; production runtime selection remains open.                             |
| [0003](0003-adopt-dprint-oxfmt-and-oxlint.md) | dprint, Oxfmt and Oxlint                                            | Accepted; disjoint formatter ownership plus independent lint checks.                                   |
| [0004](0004-adopt-maple.md)                   | Maple                                                               | Accepted local observability; production capacity and access enforcement require verification.         |
| [0005](0005-adopt-database-stack.md)          | MongoDB, Mongoose, Mongo Express, PostgreSQL, pgAdmin 4 and Drizzle | Accepted data stack; Mongoose ODM is a pending implementation, not the current MongoDB driver.         |
| [0006](0006-adopt-redis-and-insight.md)       | Redis and Redis Insight                                             | Accepted cache/ephemeral coordination and private inspection, not durable gameplay authority.          |
| [0007](0007-adopt-zookeeper.md)               | ZooKeeper                                                           | Accepted coordination; PostgreSQL remains authoritative writer fencing.                                |
| [0008](0008-adopt-effect.md)                  | Effect                                                              | Accepted process/resource composition; no gameplay or production-runtime rewrite.                      |
| [0009](0009-adopt-traefik.md)                 | Traefik                                                             | Accepted ingress; private routes and realm TCP remain explicit.                                        |
| [0010](0010-adopt-r2-and-minio.md)            | Cloudflare R2 and MinIO                                             | Accepted separate release-distribution/local private-object roles; R2 client delivery remains planned. |
| [0011](0011-adopt-docker-and-compose.md)      | Docker and Compose                                                  | Accepted reproducible local containers, not verified Kubernetes or high availability.                  |
| [0012](0012-adopt-husky-and-commitlint.md)    | Husky and commitlint                                                | Accepted local commit-message hooks plus independent workflow validation.                              |

Zod, Vite+, PostgreSQL/MongoDB drivers and SDKs remain governed as dependencies of these groups where applicable; their presence alone does not create another accepted architectural decision. RabbitMQ/BullMQ, Kubernetes, Firebase, Stripe and other target integrations are not newly adopted by this catalog.

## Consolidation provenance

The maintainer explicitly authorized replacing the former mixed catalog and renumbering these stack/tool groups. Former IDs below refer to the catalog at Git revision `edc7adf4`, not current IDs. Original records remain available in Git history; no history was rewritten. Original dates/statuses must not be inferred from the new acceptance date.

| Former records                                                  | Current home                                                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 0011 TypeScript                                                 | ADR-0001                                                                                                     |
| 0009 Bun                                                        | ADR-0002                                                                                                     |
| 0007 Oxlint, 0008 Oxfmt, 0014 dprint                            | ADR-0003                                                                                                     |
| 0013 Maple                                                      | ADR-0004; the formerly proposed choice is now confirmed.                                                     |
| 0001 MongoDB, 0002 PostgreSQL, 0003 Mongo Express, 0004 pgAdmin | ADR-0005, also documenting Drizzle and the confirmed pending Mongoose target.                                |
| 0005 Redis, 0006 Redis Insight                                  | ADR-0006                                                                                                     |
| 0012 Effect                                                     | ADR-0008; the formerly proposed choice is now confirmed.                                                     |
| 0010 Node.js production mandate                                 | Removed from the active catalog; the mandate remains suspended, with production runtime open under ADR-0002. |
| 0015 compiler evaluation                                        | Removed experiment; Bun application builds remain unchanged under ADR-0002.                                  |
| 0016 domain-owned package layout                                | [Domain layout policy](../../.github/ARCHITECTURE.md#domain-package-migration-convention).                   |
| 0017 fenced process authorities                                 | [Realm authority design](../../.github/ARCHITECTURE.md#9-authoritative-server-zookeeper-and-scaling).        |
| 0018 client-backed semantic definitions                         | [Semantic definition policy](../../.github/ARCHITECTURE.md#client-backed-semantic-definitions).              |

ZooKeeper, Traefik, R2/MinIO, Docker/Compose and Husky/commitlint now have explicit stack records rather than relying only on dispersed configuration/documentation. Implementation and pending gates remain recorded in each ADR and component guide.
