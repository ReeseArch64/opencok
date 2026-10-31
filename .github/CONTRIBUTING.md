# Contributing to OpenCok

## Branches

- Update local `develop` from `origin/develop`; create `feat/<slug>` (lowercase, hyphenated, no username), target `develop`, incorporate remote updates and resolve conflicts locally before opening/updating PRs.
- Never commit directly to `main`, `develop` or `vX.X.X` release branches. All work requires a feature branch/PR; split practical sub-tasks into dependent PRs, foundation-to-integration, in a `gh stack`. Each PR requires an issue with scope/acceptance criteria.

## Tools and checks

Install with `bun install --frozen-lockfile`. Use lockfile-pinned dprint CLI/TypeScript plugin and `vite-plus` Oxlint/Oxfmt, without global formatters/remote plugins. Configuration: `.oxlintrc.json`, `dprint.json`, `.oxfmtrc.json`.

Run affected tests for each implemented workspace. Oxlint's default TypeScript/Unicorn/Oxc correctness rules treat warnings as failures; lint does not replace type checks. PostgreSQL database/realm-server, Chat and API media checks run only on `main` pushes with path filters.

Review diffs and restrict writes to authorized paths, never repository-wide fixes for scoped work.

## Presentation and responsibilities

[Glossary](../GLOSSARY.md) owns vocabulary, naming, DTO constraints and TypeScript layout; [architecture](ARCHITECTURE.md) owns boundaries. In particular:

- No inline/block/documentation/suppression comments in tracked code, configuration, scripts, SQL, templates or embedded examples. Explain intent in prose and constraints through names/types/tests; preserve interpreter directives.
- Pinned dprint exclusively formats TypeScript (TS/TSX/c/m variants): four spaces, double quotes, semicolons, LF, 100 columns, multiline trailing commas, formatter-controlled wrapping and Allman declaration/control braces. Arrow callbacks/objects retain expression layout; Oxlint `curly` covers every control body, including `do`.
- Oxfmt exclusively formats JavaScript/JSX/c/m variants and other supported formats (JSON/YAML/Markdown/CSS/HTML/embedded code), retaining two-space/same-line braces. Preserve Markdown prose wrapping; import/export and package-key sorting remain disabled.
- EditorConfig uses TypeScript four-space overrides/two-space defaults. VS Code uses recommended dprint/Oxc extensions, local dprint for TypeScript and Oxfmt elsewhere. Logical-stage spacing requires review.

Tools exclude private `data/`, generated `.husky/_/`, `node_modules/`, `dist/`, coverage, TypeScript build metadata, Drizzle migrations, snapshots and database fixtures. Maintained app/package source, Drizzle TypeScript schemas, skills and hook configuration remain included. Former root `mobile/`/`legacy/` inputs are absent; authorized originals belong in ignored data.

- TypeScript packages expose source through `"./*": "./src/*.ts"`, including nested paths, without per-module entries; preserve root exports, assets and aliases.
- NestJS-style Controllers delegate transport operations to constructor-injected Services; Services coordinate use cases/rules/persistence through contracts; adapters handle transport/infrastructure. Compose in `apps/`; packages never import applications.
- One responsibility/behavioral class per implementation file. Abstract classes own shared workflows/lifecycle/invariants; concrete classes supply domain steps. Mappers serialize wire data, validations check boundaries, contracts define structural ports/responses.
- Follow [domain layout](../.github/ARCHITECTURE.md#domain-package-migration-convention). Controllers/enums/constants, including Hero/Dragon, may migrate with domains; bound shared protocol declarations. Preserve public paths through temporary re-exports, tracked callers/removal tasks and delegating compatibility entrypoints; no copied implementations/cycles.
- Use enums for finite alternatives, including commands/protocol groups; limits/durations are configuration.
- DTOs are create/update input classes only; follow glossary constraints. Queries/deletion selections/responses/snapshots use contracts; response interfaces belong in domain `contracts/responses`.
- Domain DTOs/Zod schemas/serializers belong in `dtos`/`validations`/`mappings`; centralized packages remain migration compatibility locations. Validate mapping/application boundaries and preserve mobile wire types/field order.

## Implementation tests and pre-PR review

Every implementation must use [generate-tests](../.agents/skills/generate-tests/SKILL.md) to derive/extend unit tests from changed behavior and issue acceptance criteria. Complete coverage by layer:

| Layer       | Focus                                                                                  |
| ----------- | -------------------------------------------------------------------------------------- |
| Unit        | Domain rules, boundaries, validation, failures.                                        |
| E2E         | Observable affected application workflows.                                             |
| Integration | Persistence/messaging/component interactions in isolated disposable resources.         |
| Mutation    | Meaningful changes to critical rules, authorization, transitions, economic invariants. |
| Snapshot    | Reviewed deterministic outputs; never blindly accept regressions.                      |
| Contract    | Service/package/client field names, types, optionality, serialization order.           |

The skill covers unit tests; use existing tools/conventions elsewhere. Reuse suites/synthetic fixtures; new frameworks/dependencies require authorization. Execute/review relevant suites before pre-PR review; record commands/results/coverage per layer. Justify inapplicable layers; unavailable tools/environments are blocked, not passed. Never weaken assertions, disable failures or change expectations to accept issue violations; report/resolve defects within scope.

After implementation, before opening/updating its PR, run [code-review](../.agents/skills/code-review/SKILL.md) against the originating issue/criteria on **Standards** and **Spec**. Pin the intended base; stacked PRs use their immediate parent and own issue scope. Resolve blockers and rerun after corrections/subsequent implementation changes. Record baseline, issue, both results and limitations. Resolve missing issues/criteria first; automated checks/later GitHub reviews do not replace this step.

## Commits

Before completing tracked-content work, review, validate and commit task changes unless explicitly asked to leave them uncommitted. Preserve unrelated work; stage only task paths, inspect staged diffs, never create empty commits.

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

- Required lowercase type: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Required scope: `app`, `api`, `infra`, `ci`, `deps`, `docs`, `config`, `release`.
- English (en-US), imperative subject, no trailing period, header ≤ 100 characters; body explains why. No `Co-Authored-By:` or agent/tool attribution.

Example: `fix(app): correct menu focus on keyboard`.

Husky 9 manages `commit-msg`. `bun install` runs `prepare` (`husky`), setting `core.hooksPath` to `.husky/_/`; adapters stay ignored, `.husky/commit-msg` is maintained. After `--ignore-scripts`, enable hooks with `bun run prepare`. Setup can be disabled with `HUSKY=0`/`--ignore-scripts`; container builds use `--ignore-scripts`, including production-only installs without Husky.

Installed workspace dependencies let `bunx commitlint --edit "$1"` resolve locally using `commitlint.config.cjs`. Validate the supplied path, including spaces, without rewriting messages/staging files. CI validates new commits: first pushes/rewritten history use default-branch merge base; PRs use target merge base when it advances; without a distinct range (including manual default-branch runs), validate the tip. Never replay inherited history on first push. References: [Husky](https://typicode.github.io/husky/how-to.html), [commitlint](https://commitlint.js.org/guides/local-setup.html).

## GitHub workflow

Use **`gh` CLI** for PR/branch operations and `gh stack`, not raw `git push` plus web UI.

### Discussions and issues

- Before any issue, search Discussions/issues and open or meaningfully participate in a relevant discussion; reading alone is insufficient. Applies to bugs/features/docs/maintenance; sensitive vulnerabilities follow private [security reporting](SECURITY.md#reporting-vulnerabilities).
- All discussion titles/bodies/replies, announcements and follow-ups use English (en-US). Choose the appropriate category and `discussion` label plus relevant `question`/`enhancement`/component/client-release labels. Categories do not replace labels; verify after publishing, including API/template-external creation.
- Once actionable, use the appropriate issue form, link the discussion/comment, confirm participation, summarize findings/need and carry labels. Link back from discussion. Maintainers verify relevance/participation beyond form validation.

[settings.yml](settings.yml) owns labels for issues/PRs/discussions: match type/components/client releases, maintain status and add `needs review` when ready.

### PR metadata

- Complete every [PR template](PULL_REQUEST_TEMPLATE.md) section, including docs/maintenance; explain Not applicable entries and pass the completed file to `gh pr create --body-file`.
- Issue field: `Closes #<number>` only for completion; otherwise `Refs #<number>` with remaining work.
- Label both issue/PR; add both to [OpenCok project](https://github.com/users/ReeseArch64/projects/6) and maintain status.
- Request `ReeseArch64` review; if author, document GitHub's self-review limitation. Assign yourself and `ReeseArch64`, once if identical.
- Set the intended-release milestone on both: [v1](https://github.com/ReeseArch64/opencok/milestone/1) initially, corresponding releases thereafter; never unrelated milestones.
- Verify issue/template/labels/project/reviewer/assignees/milestone before requesting review and after updates.

### Channels

- [Discussions](https://github.com/ReeseArch64/opencok/discussions): questions/proposals/announcements before actionable work.
- [Issues](https://github.com/ReeseArch64/opencok/issues): confirmed tasks after discussion; deduplicate and link discussions/PRs/project items.
- [Project](https://github.com/users/ReeseArch64/projects/6): priorities/planning/delivery status.
- [Wiki](https://github.com/ReeseArch64/opencok/wiki): enduring operational/architectural knowledge outside source; link issues/repository docs.
