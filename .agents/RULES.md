# Rules and Operating Boundaries

Apply to agents, tools, scripts, generators and delegates. Permission to implement, test, format or organize does not authorize expanding scope or changing protected content.

## Scope and authorization

- Inspect Git and necessary paths before writing. Change only the request, without incidental refactoring, cleanup, dependency changes or reorganization. Preserve others' work, including untracked/staged changes; do not overwrite, revert, move or delete it. Report out-of-scope problems instead of fixing them.
- If destination, ownership or authorization is unclear, stop and ask the project owner.
- Creating, editing, deleting, moving or renaming protected content requires an **explicit request and subsequent confirmation**, after presenting paths/operations, changes/rationale and effects, including generated files. Wait: the initial request or a generic instruction is not confirmation.
- Authorization covers only the presented scope; new paths, changes and moves into/out of protected areas require fresh confirmation. Do not bypass through symlinks, indirect commands, generators or delegation; permission to execute tools does not authorize their writes.

## Protected content

Read-only by default, including files and subdirectories:

- `.github/` (including `ARCHITECTURE.md`, `SECURITY.md`, `CONTRIBUTING.md`), `.agents/` (including this file), `docs/` and `infra/`.
- Every `AGENTS.md`; root `PRODUCT.md`, `CONTEXT.md`, `DESIGN.md`, `GLOSSARY.md` and `RULES.md`, when present.
- Tool configuration, manifests and lockfiles, including `package.json`, `bun.lock`, TypeScript, lint, formatting and hooks.
- `data/resources/` and `data/reference/`, including `server/`, `server-jar/` and `http/`: original/reference XML, decompiled Java, original Java JARs and original PHP. Never edit these inputs in place.
- Original client files under `data/ios/` and `data/android/`, original asset inputs under `data/cdn/`, existing backups and credentials/signing keys. The scoped derived/install exceptions below do not authorize changing other originals.

Protection is not a reading instruction or permission to scan private inputs: consult only what the task needs. Environment reads additionally require an explicit request. Root/application/package READMEs may be edited within scope; READMEs inside protected directories are not exceptions. Existing tests, pilots and experiments authorize neither expansion nor automatic removal.

### Local data exceptions

- Client `extracted/` and `patches/` under `data/ios/` and `data/android/`, plus `data/cdn/extracteds/`, are task-scoped work areas, not immutable originals. Modify them only on demand within an authorized client/asset task.
- Client `install/` under each platform holds its latest installation artifact. An explicitly authorized update replaces the previous artifact; do not accumulate outdated versions there or automatically download/install updates. Preserve reference originals and signing keys elsewhere.
- `data/cdn/data/` holds assets ready for serving; changes require an authorized asset-preparation task, not permission to publish or deploy them.
- `data/backups/` is for necessary task-scoped backups, not routine copying or a substitute for authorization. Existing backups are read-only unless the owner explicitly authorizes their modification/removal. Do not copy secrets/private data to an unapproved destination.

## Destinations and temporary files

- `apps/`: applications/composition; `packages/`: contracts, rules and reusable components. Tests follow the component (`tests/`, `integration/` or beside code only where conventional); permanent tests/minimal fixtures belong there, not in temporary storage or `.github/`. Do not recreate root `tests/`.
- Do not create directories at the repository root unless the owner explicitly requests that directory and authorizes its purpose. Reuse an existing component destination; tools, generators, test runners and delegates must not create root folders indirectly. A generic implementation/test/organization request is not permission.
- Respect `docs/` and `infra/` responsibilities/authorization. `.agents/` holds only instructions, skills and configuration, never temporary work. `.github/` is not for application tests, benchmarks, pilots, reports, logs, caches or builds; legitimate automation/CI-specific tests require prior authorization and a presented destination.
- Look for existing destinations before creating directories. Do not invent parallel structures, planned applications, generic experiment areas, reorganizations or artificial depth limits.
- Exploratory scripts, disposable reproductions, benchmarks, logs and intermediate reports use a task-specific system temporary directory outside the repository, without secrets/private inputs. Remove only known task-owned temporary files; never broadly clean ignored/untracked files.
- Normal artifacts stay in configured destinations (`dist/`, `coverage/`); check write effects before commands. Do not version caches, builds, coverage, compilation metadata or intermediate results, or modify `.gitignore` to hide misplaced files.

## Formats, tools and data

- This is a software repository, not a vault: use component-adopted formats, not a Markdown/PDF restriction; prefer Markdown for editable documentation.
- Reuse tools/dependencies; installing tools, changing manifests/lockfiles or replacing technology requires authorization. Avoid persistent helpers when commands/temporary files suffice; images, binaries and exports require an explicit need.
- Run relevant checks, preferring non-writing ones. Do not weaken rules, exclusions or tests to pass. Limit automatic fixes to authorized paths; no global fixes/formatting that alter other files.
- Original client inputs, private game files and local references are read-only, with only the scoped derived/install exceptions above; extraction/transformation requires a separate authorized destination. Never expose credentials, keys, tokens, private Elex code or player data in source, fixtures, logs, reports or external services. Do not force-add ignored files or use private inputs as shared dependencies.
- Destructive cleanup, discarding changes and rewriting history require specific authorization, including `git reset --hard`, `git clean` and restores overwriting work. Testing authorizes neither production access, messages, charges, deployment nor real-data mutations: use local resources or explicitly authorized tests.

## Environment variables and configuration

- Do not read, enumerate, create or change environment variables or environment files without the owner's explicit request. This includes shell environment dumps, `.env` inspection/writes, exports and new ambient `process.env`, `Bun.env` or equivalent reads. Do not bypass the restriction through scripts, subprocesses, tools or delegates.
- Prefer hardcoded nonsecret constants/defaults for stable settings instead of introducing environment variables. Keys and secrets must never be hardcoded; they and URLs that vary by deployment need an appropriate external configuration/secret source, explicitly requested before reading or adding variables. If a required value is missing, ask rather than inventing it or inspecting the environment.
- This policy does not authorize migrating or deleting existing runtime configuration. Preserve it unless the owner requests that separate change; never expose secret values in source, logs or reports.

## References and delivery

- Use relative internal Markdown links and verify destinations/sections; no Obsidian links. Centralize reading instructions in `AGENTS.md`, without mandatory recursive chains.
- Do not invent URLs, tests or evidence; distinguish verified execution, environment failure and hypothesis.
- Review diff/Git before finishing; report paths, checks and limitations. Follow commit/delivery workflows for task changes only; delivery requirements do not expand protected-file authorization.
