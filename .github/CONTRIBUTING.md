# Contributing to OpenCok

## Branches and decisions

- Update local `develop` from `origin/develop`, then branch as `feat/<slug>`: lowercase, hyphenated, no username. Target `develop`; incorporate its latest remote changes and resolve conflicts locally before opening or updating a PR.
- Never commit directly to immutable `main`, `develop` or release branches matching `vX.X.X`. All changes, including fixes, documentation and maintenance, require a feature branch and PR.
- Split work into the smallest practical dependent PRs, one branch/PR per sub-task, ordered foundation-to-integration in a `gh stack`. Every PR needs a GitHub issue describing the work and acceptance criteria.
- Consult [ADRs](../docs/decisions/README.md) before changing accepted technology boundaries. Track decision status, implementation TODOs and verification evidence separately.

## Code quality

### Tools and checks

Install with `bun install --frozen-lockfile`. Use lockfile-pinned dprint CLI/TypeScript plugin and the Oxlint/Oxfmt bundled with `vite-plus`; no global formatter or remote plugin is required. Configuration: `.oxlintrc.json` for lint, `dprint.json` for TypeScript, `.oxfmtrc.json` for other formats. See [ADR-0003](../docs/decisions/0003-adopt-dprint-oxfmt-and-oxlint.md) for policy and historical validation.

Before submitting, run from the repository root:

```sh
bun run lint
bun run format:check
```

Run affected tests and `bun run --cwd <workspace> check-types` for each implemented workspace; type checking is separate from lint. Oxlint enables default TypeScript, Unicorn and Oxc correctness rules; warnings fail checks. CI uses frozen dependencies and the same root commands on PRs to any branch and all branch pushes. PostgreSQL database, PostgreSQL realm server, Chat and API media checks run only on pushes to `main`, subject to path filters.

Use `bun run lint:fix`, then `bun run format` and lint again; nested guards may need repeated safe lint fixes. Review every resulting diff and limit automatic writes to authorized paths.

### Formatting and comments

- Comments are prohibited in all tracked project files, including code, configuration, scripts, SQL migrations, templates and embedded examples: no inline, block, documentation or suppression comments. Explain intent in prose; express constraints through names, types and tests. Preserve executable interpreter directives.
- The C#-inspired presentation applies only to TypeScript files (TS/TSX and c/m TypeScript module variants). dprint exclusively owns these files: four spaces, double quotes, semicolons, LF, 100 columns, trailing commas only in multiline constructs. Let the pinned plugin wrap arguments, conditions, generics and chains.
- Oxfmt owns JavaScript/JSX and c/m JavaScript module variants plus other supported formats, including JSON, YAML, Markdown, CSS, HTML and Markdown embedded code, with the existing two-space, same-line-brace defaults. Do not apply the TypeScript presentation to these files. Preserve Markdown prose wrapping; import/export and package-key sorting stay disabled. Root commands invoke both disjoint owners.
- In TypeScript, use Allman braces for declarations/control flow; start `else`, `catch` and `finally` on new lines. Arrow callback braces stay inline, objects retain expression layout, and empty blocks may remain `{}` after a line break. Oxlint `curly` requires braces for every control body, including `do` bodies dprint does not wrap.
- In TypeScript, separate imports/declarations, adjacent top-level declarations, class methods, control-flow blocks and final returns with a blank line. Keep related fields/locals together. Preserve meaningful spacing, collapse decorative repetition and never imitate minified code. Logical-stage padding remains a review responsibility; Oxlint does not enforce it generally.
- EditorConfig specifies four-space TypeScript overrides and two-space defaults. VS Code uses recommended dprint/Oxc extensions and local dprint only for TypeScript; select Oxfmt for JavaScript and other supported languages. Editors without integrations must run root commands.

Tools exclude private `data/`, generated `.husky/_/`, workspace `node_modules/`, `dist/`, coverage, TypeScript build metadata, Drizzle migrations, snapshots and database fixtures. Former root `mobile/` and `legacy/` inputs are absent; authorized originals belong in ignored data. Maintained application/package source, Drizzle TypeScript schemas, agent skills and hook configuration remain included. Preserve [architecture boundaries](ARCHITECTURE.md).

### Responsibilities and compatibility

- Implemented TypeScript packages expose source via `"./*": "./src/*.ts"`, including nested paths, without per-module entries. Preserve root exports, non-source assets and compatibility aliases.
- Controllers handle transport and delegate to constructor-injected Services following the NestJS Controller/Service pattern. Services own use cases and coordinate rules/persistence through contracts; adapters handle transport/infrastructure. Compose instances in `apps/`; packages must not import applications.
- Keep implementation files focused on one responsibility and one class with behavior. Use abstract classes for shared workflows, lifecycle and invariants, concrete classes for domain-specific steps, and constructor injection for collaborators. Mapper classes own wire serialization, validations own boundary checks, and contracts own structural ports/response shapes.
- Follow [domain layout policy](../.github/ARCHITECTURE.md#domain-package-migration-convention) for domain ownership and responsibility directories. Domain Controllers, enums and constants, including Hero/Dragon, may move with their domain; keep shared protocol declarations bounded. Preserve public paths with temporary re-exports, tracked callers and removal tasks. No copied implementations or dependency cycles. Compatibility entrypoints may delegate while callers migrate.
- Use enums for finite named alternatives, including command names/protocol groups; limits and durations remain configuration.
- Reserve DTO classes for create/update inputs: `Create<Resource>Dto`, `Update<Resource>Dto`, e.g. `CreateCityDto`. Use explicit `declare public readonly` properties, `?` only for optional inputs, and no decorators, constructors, methods, static schemas, definite-assignment or non-null assertions. See the [DTO package](../packages/dtos/README.md).
- Queries, deletion selections, responses and protocol snapshots use contracts, with `<Resource>Response` interfaces in the owning domain's `contracts/responses`. Domain-local DTOs, Zod schemas and serializers belong in `dtos`, `validations` and `mappings`; centralized packages remain migration compatibility locations. Validate at mapping/application boundaries, preserving mobile wire types and field order.

## Required implementation tests

For every implementation, use [generate-tests](../.agents/skills/generate-tests/SKILL.md) to analyze changed behavior, derive cases from the issue/acceptance criteria and generate or extend unit tests. Complete coverage across these layers:

| Layer       | Required focus                                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| Unit        | Domain rules, boundaries, validation and failures.                                                                |
| E2E         | Observable behavior across affected application workflows.                                                        |
| Integration | Persistence, messaging and component interactions in isolated disposable resources.                               |
| Mutation    | Assertions detect meaningful changes to critical rules, authorization, state transitions and economic invariants. |
| Snapshot    | Reviewed, deterministic outputs; never blindly update snapshots to accept regressions.                            |
| Contract    | Service, package and client protocol compatibility: field names, types, optionality and serialization order.      |

The skill specializes in unit tests; use existing repository tools/conventions for other layers, not assumed skill support. Reuse suites and synthetic fixtures; new frameworks/dependencies require authorization.

Generate, execute and review relevant suites before pre-PR review. Record commands, results and coverage per layer in PR validation evidence. Justify genuinely inapplicable layers; unavailable tooling/environments are blocked, not passed. Never weaken assertions, disable failures or change expectations to match implementation that violates the issue; report defects and resolve them within authorized scope before proceeding.

## Required pre-PR review

After every implementation and before opening its PR, run [code-review](../.agents/skills/code-review/SKILL.md) against the originating GitHub issue and acceptance criteria, covering **Standards** and **Spec**. Pin the baseline to the intended PR base; for stacks, use the immediate parent branch and that PR's issue scope.

Resolve blockers and rerun after corrections or subsequent implementation changes before opening/updating the PR. Record baseline, issue, both axes' results and limitations in validation evidence. Missing issues/criteria must be resolved first: skipping Spec is insufficient. Automated checks and later GitHub review do not replace this step.

## Commits

Before completing any tracked-content task, review, validate and commit all task-related changes unless explicitly asked to leave them uncommitted. This includes code, tests, docs and configuration. Preserve unrelated working/staged changes, stage only task paths and inspect the staged diff. No empty commits.

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

- Required lowercase type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Required scope: `app`, `api`, `infra`, `ci`, `deps`, `docs`, `config`, `release`.
- Required subject, no trailing period, header ≤ 100 characters. English (en-US), imperative mood; body explains why, not how.
- No `Co-Authored-By:` or other agent/tool attribution.

Example: `fix(app): correct menu focus on keyboard`.

### Commit-message validation

Husky 9 manages `commit-msg`: `bun install` runs `prepare` (`husky`), setting `core.hooksPath` to `.husky/_/`. Generated adapters stay ignored; `.husky/commit-msg` is maintained. After installing with `--ignore-scripts`, enable hooks with `bun run prepare`. Disable setup with `HUSKY=0` or `--ignore-scripts`; container builds use `--ignore-scripts`, including production-only installs without Husky.

Install workspace dependencies so `bunx commitlint --edit "$1"` resolves locally using root `commitlint.config.cjs`. The hook validates the supplied message path, including spaces, without rewriting messages or staging files. CI independently applies the same rules to new commits: first pushes/rewritten history use the default-branch merge base, PRs use the target merge base when it advances, and runs without a distinct range (including manual default-branch runs) validate the tip. Never replay inherited history for a branch's first push.

See [Husky setup](https://typicode.github.io/husky/how-to.html) and [commitlint local setup](https://commitlint.js.org/guides/local-setup.html).

## GitHub workflow

Always use **`gh` CLI** for PR/branch operations, not raw `git push` plus web UI. Keep changes in `gh stack` as described above.

### Discussions and issues

- Before any issue, search existing Discussions and issues; open a relevant discussion or participate meaningfully in one. Reading alone is insufficient. This applies to bugs, regressions, features, documentation and maintenance. Sensitive vulnerabilities instead use private security reporting; never post their details publicly.
- Write every discussion title/body/reply in English (en-US), including announcements and follow-ups. Select the appropriate category and the `discussion` label plus applicable labels from [settings](settings.yml): `question` for questions, `enhancement` for proposals, and relevant component/client-release labels. Categories do not replace labels; verify labels after publishing, including API/template-external creation, and keep them current.
- Once work is concrete, use the appropriate issue form, link the discussion/comment, confirm participation, summarize findings and explain why the issue is needed. Link the issue back from the discussion and carry relevant labels. Forms require the reference/confirmation; maintainers verify relevance and actual participation, not form validation alone.

Use [`.github/settings.yml`](settings.yml) as the authoritative label list for issues, PRs and discussions. Match change type, components and client releases; keep status labels current and add `needs review` when a PR is ready.

### Required PR metadata

- Use [PULL_REQUEST_TEMPLATE.md](PULL_REQUEST_TEMPLATE.md) for every PR, including docs/maintenance. Complete all sections and explain Not applicable entries; pass the completed file via `gh pr create --body-file`.
- Reference the issue in its template field: `Closes #<number>` only when completing it; otherwise `Refs #<number>` and explain remaining work.
- Apply appropriate [labels](settings.yml) to both issue and PR. Add both to the [OpenCok project](https://github.com/users/ReeseArch64/projects/6) and maintain their status.
- Request review from `ReeseArch64`; if that account authors the PR, document GitHub's self-review limitation instead. Assign yourself and `ReeseArch64`, once if identical.
- Set the intended-release milestone on both issue and PR: [v1](https://github.com/ReeseArch64/opencok/milestone/1) for initial release, corresponding milestones thereafter; never choose an unrelated milestone just to fill the field.
- Verify issue, template, labels, project, reviewer, assignees and milestone before requesting review and after PR updates.

### Collaboration channels

| Channel                                                            | Purpose                                                                                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [Discussions](https://github.com/ReeseArch64/opencok/discussions)  | Questions, proposals, ideas, announcements and conversations before actionable work.                                     |
| [Issues](https://github.com/ReeseArch64/opencok/issues)            | Confirmed defects, features and concrete tasks after discussion; deduplicate and link discussion, PRs and project items. |
| [OpenCok project](https://github.com/users/ReeseArch64/projects/6) | Priorities, planning and delivery status for linked issues/PRs.                                                          |
| [Wiki](https://github.com/ReeseArch64/opencok/wiki)                | Long-lived operational/architectural knowledge not belonging beside source; link relevant issues and repository docs.    |
