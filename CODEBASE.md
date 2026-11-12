# OpenCoK Codebase

## Purpose

This document defines the repository layout, file ownership, application boundaries and dependency conventions. It contains the context needed to apply these conventions independently.

OpenCoK uses a Turborepo monorepo with Bun workspaces for TypeScript applications and shared packages. TypeScript applications live in `apps/`, the Flutter game in `app/` and the Go GameServer in `gameserver/`. The structure below is the target layout; directories and configuration files are introduced when their implementation is needed.

## Root layout

```text
opencok/
├── .devcontainer/       # Development container and its configuration
├── .git/                # Local Git metadata; managed by Git
├── .github/             # GitHub workflows, templates and architecture document
├── .husky/              # Git hooks
├── .vscode/             # Shared workspace settings, tasks and launch configurations
├── app/                 # Flutter + Flame game for mobile and web
├── apps/                # TypeScript applications
│   ├── api/             # Global HTTP API
│   ├── realm/           # Authoritative gameplay application, deployed per kingdom
│   ├── workers/         # Global background integrations and asynchronous tasks
│   ├── automation/      # TypeScript/Bun Bots and NPCs
│   ├── admin/           # React operator client
│   ├── console/         # React player account, purchases and automation client
│   ├── landing/         # React public website
│   └── wiki/            # Markdown/MDX documentation and generator configuration
├── gameserver/          # Go WSS gateway, sessions and Chat
├── bootstrap/           # Scripts and infrastructure definitions for initial setup
├── packages/            # Shared TypeScript code and tooling packages
├── .editorconfig        # Common editor formatting conventions
├── .gitignore           # Ignored local, generated and sensitive files
├── CHANGELOG.md         # Project release history
├── CODEBASE.md          # Repository structure and file ownership
├── LICENSE              # Project license
├── *.md                 # Other standalone project documents
├── mise.toml            # Language runtimes, SDKs and development tool versions
├── package.json         # Private root workspace, common commands and tooling
├── bun.lock             # Shared JavaScript/TypeScript dependency lockfile
└── turbo.json           # Task graph, dependencies, inputs and cached outputs
```

`app/` always means the Flutter game; `apps/` groups TypeScript applications. Each application has its own entrypoint, configuration, build and deployment boundary. Multiple kingdoms reuse `apps/realm/`; they do not create separate source directories. Wiki remains at `wiki/` while its generator is undecided.

## Workspaces and task execution

The root `package.json` lists `apps/*`, `packages/*`, `app` and `gameserver` as workspaces, declares Bun as the package manager and exposes common Turborepo commands. Wiki joins the workspace when its build tooling is introduced. Internal TypeScript dependencies use `workspace:*` and public package exports. Each workspace declares its own dependencies and scripts; root dependencies are repository tooling.

Turborepo coordinates tasks such as `dev`, `build`, `lint`, `typecheck`, `test` and `generate` when applicable. `turbo.json` declares their dependency graph and outputs. Persistent development tasks and tasks that mutate external systems, such as migrations, provisioning and deployment, are not cached. Environment variables and configuration affecting outputs must participate in task inputs.

`app/pubspec.yaml` remains the authority for Flutter dependencies, with `app/pubspec.lock` committed for reproducibility. A small `app/package.json` exposes Flutter commands to the workspace task graph; it does not replace Dart tooling. Contract generation declares its source dependencies and runs before dependent client checks/builds. Flutter source, manifests and relevant tool versions participate in cache inputs.

`gameserver/go.mod` and `gameserver/go.sum` own Go dependencies. A small `gameserver/package.json` exposes Go build, test and development commands to Turborepo without introducing a Bun runtime dependency for the service. Go source, module files, generated contracts and the Go toolchain version participate in task inputs. Go is also versioned through `mise.toml`.

`mise.toml` defines the language/tool versions used locally, in the DevContainer and in CI. Dependency manifests and lockfiles define library versions. Avoid competing tool-version files; tool upgrades update the shared definition and relevant validation together.

## Application layout

TypeScript backend applications follow this baseline, adding directories only when needed:

```text
apps/realm/
├── src/
│   ├── main.ts          # Process startup and shutdown
│   ├── composition/     # Explicit dependency wiring and module composition
│   └── modules/
│       └── city/
│           ├── facade.ts
│           ├── application/    # Commands, queries and repository interfaces
│           ├── domain/         # Entities, value objects and gameplay rules
│           └── infrastructure/ # Repository implementations and external adapters
├── migrations/         # Migrations owned by this application
├── tests/              # Integration and application-level recovery scenarios
├── package.json
└── tsconfig.json
```

Modules communicate through explicit public interfaces. Domain code does not import transport, persistence implementations or process startup. Unit tests may sit beside the code they exercise; integration tests remain with their owning application. A shared package does not take ownership of application migrations or expose another application's private tables.

React clients keep source under `src/`, grouped by feature, with routing and application composition owned by that client. Shared React components may live in `packages/`; backend-only dependencies must not enter browser bundles. Router packages and rendering conventions remain undecided; each client owns its routing configuration and rendering entrypoints.

The Go GameServer uses `gameserver/cmd/gameserver/main.go` as its entrypoint and `gameserver/internal/` for private session, routing, Chat and transport modules. Generated Go contract bindings live under `gameserver/internal/contracts/generated/`; tests use Go's colocated `*_test.go` convention. Go modules communicate through explicit interfaces and do not import TypeScript implementations.

The Flutter game keeps Dart source under `app/lib/`, tests under `app/test/` and platform projects under `app/android/`, `app/ios/` and `app/web/`. Feature code separates confirmed game state from Flutter/Flame presentation. Generated contract bindings live under `app/lib/generated/`. Small bundled assets live under `app/assets/`; downloaded content and local caches are runtime data outside version control.

Wiki source belongs to `wiki/`; its build tooling is introduced after the generator is selected. The repository layout does not select a Wiki generator.

## Shared packages

Each direct child of `packages/` is a named TypeScript workspace with its own `package.json`, public exports and `src/`. Use lowercase kebab-case directory names and the `@opencok/` package scope. Create packages for concrete shared responsibilities rather than collecting unrelated code in a general utilities package.

- `packages/contracts/` owns Zod wire schemas, inferred TypeScript types, message definitions and contract-export tooling. Dart and Go bindings are generated from these definitions; Go bindings belong to `gameserver/`, not the shared TypeScript packages directory.
- Additional packages may hold shared React UI, infrastructure adapters or TypeScript/lint configuration when consumers need them.
- Applications may depend on packages; packages never import executable applications. Package dependencies are explicit and acyclic.
- Gameplay implementations stay with their owning backend modules. Sharing contracts with clients or automation does not share gameplay authority.

Generated bindings and exported schemas have a reproducible generation command. Do not edit generated files manually or maintain a second handwritten copy of a contract. Generated output policy is declared by its owning workspace, and CI checks that consumers use current contracts.

## Bootstrap and repository support

`bootstrap/` contains the scripts and infrastructure definitions needed to bring a clean checkout to a running local game: prerequisite checks, dependency setup, local services, migrations, initial configuration and startup orchestration. Use named scripts and a concise README describing execution order and required inputs. Scripts must support safe reruns; destructive reset is a separate explicit operation. Production deployment automation is added here in a clearly separate scope when its mechanism is chosen.

`.devcontainer/` defines the containerized development environment and invokes shared setup rather than duplicating bootstrap logic. `.github/workflows/` runs the same workspace checks used locally. `.husky/` contains lightweight hooks calling repository commands. `.vscode/` contains portable shared settings without machine-specific paths or credentials.

Keep secrets, local environment files, database volumes, downloaded assets, `node_modules/`, `.turbo/`, `.dart_tool/` and build outputs out of version control. Commit safe configuration examples and the appropriate dependency lockfiles. `.git/` is generated by Git and is never a source directory to maintain manually.

Root documentation is organized by scope: product requirements, technical orientation, repository conventions and release history. Each document must explain its scope independently, without requiring another root document to supply essential context. Module documentation stays near its implementation.

Workspace/task integration follows the Turborepo documentation for [repository structure](https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository) and [multiple languages](https://turborepo.dev/docs/guides/multi-language).
