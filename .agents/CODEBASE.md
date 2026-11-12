# OpenCoK Codebase

OpenCoK uses a Turborepo monorepo with Bun workspaces. This is the target organization; introduce directories only when needed and inspect implementation before claiming support.

## Ownership

| Location                                            | Responsibility                                                            |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| `app/`                                              | Flutter + Flame game; distinct from `apps/`.                              |
| `apps/api/`                                         | Global HTTP API.                                                          |
| `apps/realm/`                                       | Gameplay application reused by all kingdoms.                              |
| `apps/workers/`                                     | Background integrations and reconciliation.                               |
| `apps/automation/`                                  | Bots and NPCs.                                                            |
| `apps/admin/`, `apps/console/`, `apps/landing/`     | Operator, account and public React clients.                               |
| `gameserver/`                                       | Go WSS gateway, sessions and Chat.                                        |
| `wiki/`                                             | Markdown/MDX documentation; generator undecided.                          |
| `packages/`                                         | Shared TypeScript contracts, UI, adapters and tooling.                    |
| `bootstrap/`                                        | Reproducible local setup and infrastructure.                              |
| `.agents/`                                          | Context, product, vocabulary and codebase guidance.                       |
| `.github/`, `.devcontainer/`, `.husky/`, `.vscode/` | CI/architecture, development container, hooks and shared editor settings. |

## Workspaces and tools

Root `package.json` declares `apps/*`, `packages/*`, `app` and `gameserver`, repository tooling and common commands. Workspaces own their dependencies/scripts; internal TypeScript dependencies use `workspace:*` and public exports. Wiki joins when build tooling exists.

Turborepo owns task dependencies, outputs and cache inputs. Include relevant source, generated contracts, manifests, environment/configuration and tool versions. Generate contracts before dependent builds/checks. Never cache persistent development tasks or migrations, provisioning and deployment.

`mise.toml` owns runtime/SDK/tool versions. Bun, Dart and Go manifests/lockfiles own their respective dependencies. Small package scripts expose Flutter/Go commands to Turborepo without replacing native tooling or adding Bun to Go's runtime.

## Application boundaries

- TypeScript backends: `src/main.ts` starts/stops the process; `composition/` wires modules; each module has a public facade plus `application/`, `domain/` and `infrastructure/`. Domain code excludes transport, persistence implementations and startup. Application-owned migrations and integration/recovery tests stay with the application; unit tests may be colocated.
- React: feature-grouped `src/` with client-owned routing/composition. Shared UI may live in packages; backend dependencies cannot enter browser bundles. Routing/rendering choices remain open.
- Go: `cmd/gameserver/main.go`, private modules under `internal/`, generated bindings under `internal/contracts/generated/`, colocated `*_test.go` tests.
- Flutter: `lib/`, `test/`, platform projects, `lib/generated/` bindings and small bundled `assets/`. Separate confirmed state from presentation; downloaded assets/caches are untracked runtime data.

Each application owns its entrypoint, configuration, build and deployment. Modules expose explicit interfaces; shared packages never own application migrations or expose private tables.

## Shared code and repository support

Each `packages/` child is a lowercase kebab-case `@opencok/` workspace with its own manifest, exports and source. Dependencies are explicit and acyclic; packages never import applications. Keep gameplay implementations with their backend owner.

`packages/contracts/` owns Zod wire schemas, inferred types and export/generation tooling. Generate Dart/Go bindings reproducibly into their consuming applications; never hand-edit generated output or duplicate wire definitions. Each owner declares output policy; CI checks freshness.

Bootstrap covers prerequisites, dependencies, services, migrations, initial configuration and startup with documented inputs/order and safe reruns. Destructive reset is explicit; production automation has a separate scope. DevContainer reuses bootstrap, CI reuses local checks and hooks call repository commands.

Exclude secrets, local environments, volumes, downloaded assets, dependency/cache directories and build outputs from Git. Commit safe examples and dependency lockfiles. Keep documentation self-contained by scope and module documentation near implementation; avoid machine-specific editor paths or credentials.
