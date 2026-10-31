# Rules and Operating Boundaries

Apply to agents, tools, scripts, generators and delegates, including indirect execution.

## Scope and authorization

- Inspect Git and relevant paths before writing. Change only the request; preserve existing/staged/untracked work and report unrelated problems. Ask the owner about unclear destinations, ownership or authorization.
- Protected changes require an **explicit request and subsequent confirmation** after presenting paths, operations, rationale and effects, including generated files. The initial request is not confirmation; expanded scope requires fresh confirmation.
- Destructive cleanup, discarding changes and history rewrites require specific authorization, including `git reset --hard`, `git clean`, overwriting restores and removing existing tests/experiments.
- Testing authorizes neither production access, messages, charges, deployment nor real-data mutations; use local resources or explicitly authorized tests.

## Protection and selective reading

Read-only recursively: `.github/`, `.agents/`, `docs/`, `infra/`; every `AGENTS.md`; root `PRODUCT.md`, `CONTEXT.md`, `DESIGN.md`, `GLOSSARY.md`, `RULES.md`; tool configuration, manifests and lockfiles; `data/reference/`, `data/resources/`, original client/asset inputs, existing backups, credentials and signing keys. READMEs outside protected directories may be edited within scope.

Protection does not require reading. Access only relevant files/sections; never routinely browse, scan, index or reread these directories during startup/general exploration:

- `data/reference/`, `data/resources/`: legacy information on demand; prefer current code/documentation for current behavior.
- `data/android/`, `data/ios/`: only for necessary client adjustments.
- `data/cdn/`: several gigabytes; only for client-asset work.

Authorized data exceptions:

- Client `extracted/` and `patches/`, plus `data/cdn/extracteds/`: scoped client/asset work. Extract/transform originals into separate authorized destinations, never in place.
- Client `install/`: latest installation artifact only; explicitly authorized updates replace it, without automatic downloads/installs. Preserve reference originals and signing keys elsewhere.
- `data/cdn/data/`: asset preparation, without publishing/deployment authorization.
- `data/backups/`: necessary task-scoped backups only; existing backups remain protected.

## Destinations and artifacts

- `apps/`: applications/composition; `packages/`: reusable contracts/rules/components. Permanent tests/minimal fixtures follow component conventions; no root `tests/`.
- Reuse destinations. New root directories require an explicit request naming their purpose; avoid parallel structures, planned applications, generic experiment areas and artificial depth limits.
- `.agents/`: instructions/skills/configuration; `.github/`: repository automation, with CI-specific tests requiring prior authorization and a presented destination. Neither holds application tests or temporary work.
- Disposable scripts/reproductions, benchmarks, logs and intermediate reports belong in task-specific system temporary directories outside the repository, without private inputs. Remove only known task-owned files, never broadly clean ignored/untracked files.
- Inspect command write effects. Keep normal artifacts in configured destinations (`dist/`, `coverage/`); never version builds/caches/intermediates or change `.gitignore` to hide misplaced files.

## Tools and data

- Use component-adopted formats; prefer Markdown for editable documentation. Reuse tools/dependencies; installations or technology changes require authorization. Prefer commands/temporary files over persistent helpers; images/binaries/exports need an explicit purpose.
- Run relevant checks, preferably without writes; never weaken rules/exclusions/tests. Restrict fixes/formatting to authorized paths.
- Never expose credentials, keys, tokens, private Elex code or player data in source, fixtures, logs, reports or external services, or copy private data to unapproved destinations. Never force-add ignored files or make private inputs shared dependencies.

## Environment and configuration

- Reading, enumerating, creating or changing environment variables/files requires the owner's explicit request, including dumps, `.env`, exports and new `process.env`/`Bun.env` equivalents.
- Prefer nonsecret constants/defaults for stable settings. Never hardcode secrets; secrets/deployment-specific URLs require external configuration and explicit authorization before reading/adding variables. Ask for missing values. Preserve existing runtime configuration unless migration/removal is separately requested.

## Delivery

- Verify relative internal Markdown links/sections; no Obsidian links. Centralize reading instructions in `AGENTS.md`, without recursive reading requirements.
- Never invent URLs, tests or evidence; distinguish verified execution, environment failures and hypotheses.
- Review diff/Git; report paths, checks and limitations. Delivery workflows do not expand authorization.
