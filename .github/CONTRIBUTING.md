# Contributing to OpenCok

## Branches

- Create every working branch from the latest `develop`, and open its pull
  request back into `develop`: `develop` → `feat/<slug>` → `develop`.
- The `main`, `develop`, and release branches matching `vX.X.X` are immutable.
  Never commit directly to any of these branches. All project changes must
  pass through a feature branch and pull request, including fixes,
  documentation, and maintenance work.
- Name working branches `feat/<slug>`, using a lowercase, hyphenated slug and
  no username (for example, `feat/my-feature`).
- Before branching, update the local `develop` from `origin/develop`. Before
  opening or updating the pull request, incorporate the latest
  `origin/develop` into the feature branch and resolve conflicts locally.
- Break every pull request into the smallest practical set of dependent pull
  requests, and organize them in a `gh stack` from the foundational change to
  the final integration change.
- Every pull request must be linked to a GitHub issue that describes the work
  and its acceptance criteria.

Consult the [Architecture Decision Records](../docs/decisions/README.md) before
changing an accepted technology boundary. ADR status, implementation TODOs and
verification evidence are tracked separately.

## Code quality

Comments are prohibited in tracked project files, including code, configuration,
scripts, SQL migrations, templates and embedded code examples. Do not add inline,
block, documentation or suppression comments. Keep explanations in prose
documentation and express constraints through names, types and tests. Interpreter
directives required to execute scripts are executable syntax and must be preserved.

Install the workspace dependencies with `bun install --frozen-lockfile`. Use the
Oxlint and Oxfmt versions bundled with `vite-plus` and the pinned dprint CLI and
TypeScript plugin from the root lockfile. Configure lint in `.oxlintrc.json`,
JS/TS formatting in `dprint.json`, and other formatting in `.oxfmtrc.json`.
[ADR-0014](../docs/decisions/0014-adopt-dprint-for-typescript-formatting.md) records
the confirmed policy and historical validation summary.

Run these commands from the repository root before submitting changes:

```sh
bun run lint
bun run format:check
```

Use `bun run lint:fix` for safe automatic lint fixes and `bun run format` to
apply formatting. Review the resulting diff. CI checks lint and formatting on
pull requests targeting any branch and pushes to all branches; lint warnings fail
the check. PostgreSQL database, PostgreSQL realm server and Chat and API media
run only on pushes to `main`, subject to their path filters.

JS/TS formatting uses four spaces, double quotes, semicolons, LF and a 100-column
print width. dprint exclusively owns JS/JSX/TS/TSX and c/m module variants; Oxfmt
owns its other supported formats, including JSON, YAML, Markdown, CSS and HTML,
with two-space indentation. Markdown embedded code remains part of its Oxfmt
ownership. Import/export and package-key sorting are disabled. Markdown keeps
its existing prose wrapping. Root commands invoke both disjoint owners.

Declaration and control-flow opening braces use Allman placement; `else`, `catch`
and `finally` start on a new line. Arrow callback block braces stay on the same
line, and object literals retain expression layout. Empty blocks may stay `{}`
after a line break. Oxlint `curly` requires braces for every control body, including
`do` bodies that dprint alone does not wrap. Use `lint:fix`, then `format` and
`lint` to correct these; repeated lint fixes may be needed for nested guards.
Multiline arguments, conditions, generic types and chains follow the pinned
plugin at 100 columns. Trailing commas appear only in multiline JS/TS constructs.

EditorConfig defines four-space source overrides and two-space other-format
defaults. VS Code recommends dprint and Oxc extensions and selects the local
dprint binary for JS/TS; select Oxfmt for the other supported languages. Editors
without these integrations must run root commands. CI uses the same frozen
dependencies and root commands; no global formatter or remote plugin is needed. Lint enables correctness rules for the
default TypeScript, Unicorn and Oxc plugins. Type checking remains separate;
use `bun run --cwd <workspace> check-types` for each implemented workspace.

All tools exclude private inputs under `data/`, generated Husky adapters under
`.husky/_/`, workspace `node_modules/`, `dist/`, coverage, TypeScript build metadata,
Drizzle migrations, snapshots and database fixture data. The former root
`mobile/` and `legacy/` input directories are no longer part of this checkout;
keep authorized originals in the ignored data area. Maintained application and
package source, Drizzle TypeScript schemas, agent skills and hook configuration
remain included. These exclusions preserve the
boundaries described in [the architecture](ARCHITECTURE.md).

Implemented TypeScript packages expose source modules with `"./*": "./src/*.ts"`
in their package export maps, including nested source paths. Preserve root entries,
non-source assets and compatibility aliases when updating these maps. New source
modules should not require individual export entries.

Controllers receive Services through constructor injection and delegate application
operations to them, following the NestJS Controller/Service pattern. Services own
use cases and coordinate rules and persistence through contracts. Compose the
instances in `apps/`; packages must not import applications. Keep transport
handling in Controllers and adapters and application workflows in Services.

Keep each implementation file focused on one responsibility and one class with
behavior. Use abstract classes for shared workflows, lifecycle ownership and
invariants, with concrete classes implementing the domain-specific steps. Inject
collaborators through constructors. Keep wire serialization in Mapper classes,
boundary checks in validations and structural ports and response shapes in contracts.
Follow [ADR-0016](../docs/decisions/0016-adopt-domain-owned-package-layout.md) for
domain-owned packages and responsibility directories. Domain-specific Controllers,
enums and constants may move with their domain, including Hero and Dragon, while
shared protocol declarations remain bounded. Preserve existing public paths through
temporary re-exports with tracked callers and removal tasks. Do not copy implementations
or introduce dependency cycles.
Use enums for finite named alternatives, including command names and protocol groups;
keep limits and durations as configuration values. Compatibility entrypoints may
delegate to concrete classes while callers migrate.

Separate imports from declarations, adjacent top-level declarations and class methods
with a blank line. Separate control-flow blocks and final returns from preceding
statements. Keep related field and local variable declarations together. dprint and Oxfmt
preserve existing meaningful blank lines and collapse decorative repetition.
Missing logical-stage padding remains a review requirement because the installed
Oxlint does not provide general padding enforcement. Do not compress source to
imitate the minified build.

Reserve DTO classes for create and update inputs, named `Create<Resource>Dto`
and `Update<Resource>Dto`, such as `CreateCityDto`. Declare explicit
`declare public readonly` data properties without decorators, constructors,
methods, static schemas, definite-assignment or non-null assertions. Use `?`
only for optional input fields. See the [DTO package](../packages/dtos/README.md).
Read queries, deletion selections, response payloads and protocol snapshots use
contracts, with response interfaces named `<Resource>Response` in
the owning domain's `contracts/responses`. Domain-local create/update DTOs,
Zod schemas and serializers belong in `dtos`, `validations` and `mappings`.
Existing centralized packages remain compatibility locations during migration.
Validate at the mapping or application boundary and preserve mobile wire types
and field order.

## Required pre-PR review

After completing every implementation and before opening its pull request, run
the [code-review skill](../.agents/skills/code-review/SKILL.md) against the originating
GitHub issue and its acceptance criteria. Pin the review baseline to the intended
PR base and review both axes: Standards and Spec. For stacked changes, use the
immediate parent branch as the base and the issue scope assigned to that PR.

Resolve blocking findings and rerun the review after corrections or subsequent
implementation changes, before opening or updating the PR. Include the reviewed
baseline, issue reference, results for both axes and any remaining limitations in
the PR's validation evidence. If the issue or acceptance criteria are unavailable,
resolve that gap before proceeding; skipping the Spec review does not satisfy this
requirement. Automated checks and the later GitHub review do not replace this step.

## Commits

Before completing any task that changes tracked project content, review and
validate the changes, then commit all changes belonging to that task. This applies
to code, tests, documentation and configuration. Do not wait for a separate request
to commit unless the user explicitly asks to leave the changes uncommitted.

Keep commits focused. Preserve unrelated working-tree and staged changes; stage
only the task's changes and inspect the staged diff before committing. Do not
create an empty commit when a task produces no changes.

Write commit messages using [Conventional Commits](https://www.conventionalcommits.org/)
with the following format and rules:

```text
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

- **Type:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
  `build`, `ci`, `chore`, `revert`. Required, lowercase.
- **Scope:** required. Use `app`, `api`, `infra`, `ci`, `deps`, `docs`,
  `config`, or `release` to identify the area affected by the change.
- **Subject:** required, no trailing period. Header ≤ 100 characters.
- **Body:** explains the _why_, not the _how_.
- **No co-authorship.** No `Co-Authored-By:` or other agent/tool
  attribution.
- **Language:** English (en-US), imperative mood.

```text
fix(app): correct menu focus on keyboard
```

### Local commit-message hook

Husky 9 manages the repository-local `commit-msg` hook. `bun install` runs the
root `prepare` script (`husky`); after an installation with `--ignore-scripts`, enable it
explicitly with `bun run prepare`. Git's `core.hooksPath` points to `.husky/_`.
The generated adapters stay ignored; `.husky/commit-msg` is a maintained project
file.

The hook runs `bunx commitlint --edit "$1"` with the root
`commitlint.config.cjs`. Install workspace dependencies before committing so
`bunx` resolves the local CLI. It validates
the message file supplied by Git, including paths containing spaces. It does not
rewrite messages or stage files. CI continues validating committed messages
independently of local hooks. CI validates the event's new commit range.
For a branch's first push or rewritten history, it compares against the merge
base with the repository's default branch rather than replaying inherited
history. Pull requests use their target's merge base when the target has advanced.
A run with no distinct range, including a manual run on the default branch,
validates the tip commit. The same Conventional Commit rules apply in every case.

Use `HUSKY=0` when hook setup should be disabled, or install with
`--ignore-scripts`. Existing container builds use `--ignore-scripts`, including
production-only dependency installs where Husky is not installed. Run
`bun run prepare` to install the hooks locally. See the
[Husky setup](https://typicode.github.io/husky/how-to.html)
and [commitlint local setup](https://commitlint.js.org/guides/local-setup.html).

### Issue, pull request, and discussion labels

Use the labels defined in [`.github/settings.yml`](settings.yml) when
classifying issues, pull requests, and discussions. Available labels are:

`documentation`, `release/v9.27.0`, `release/v5.36.0`, `release/v6.12.20`,
`release/v12.06.0`,
`infrastructure`, `bug`, `enhancement`, `question`, `discussion`, `help wanted`,
`accessibility`, `security`, `performance`,
`duplicate`, `wontfix`, `wontdo`, `invalid`, `blocked`, `wontmerge`,
`needs review`, `blocked review`, `good first issue`, `hotfix`, `dependencies`,
`refactoring`, `testing`, `ci/cd`, `maintenance`, `regression`,
`compatibility`, `database`, `server`, `client`, `networking`, `investigation`,
`needs triage`, `needs reproduction`, and `needs information`.

## GitHub

- Always use the **`gh` CLI** for PR and branch operations — not raw
  `git push` plus the web UI.
- Keep every change set in a `gh stack`, with one small branch and pull request
  per sub-task, ordered from bottom to top.

### Required pull request metadata

- Always use [`.github/PULL_REQUEST_TEMPLATE.md`](PULL_REQUEST_TEMPLATE.md)
  for every pull request, including documentation and maintenance changes.
  Complete every section; explain any entry marked Not applicable. When using
  `gh pr create`, prepare a completed copy and pass it with `--body-file`.
- Always reference the corresponding issue in the template's Issue field.
  Use `Closes #<number>` only when the pull request completes that issue;
  otherwise use `Refs #<number>` and describe the remaining work.
- Apply the relevant labels from [`.github/settings.yml`](settings.yml) to
  both the issue and pull request. Select labels for the actual change type,
  affected components, and applicable client releases. Add `needs review`
  when a pull request is ready for review, and keep status labels current.
- Add both the issue and pull request to the
  [OpenCok project](https://github.com/users/ReeseArch64/projects/6), linked to
  this repository, and keep their project status current.
- Always request review from `ReeseArch64`. GitHub does not allow authors to
  review their own pull requests: when `ReeseArch64` is the author, record
  this limitation in the pull request instead of requesting self-review.
- Assign the pull request to yourself (the authenticated contributor) and
  `ReeseArch64`. When these are the same account, assign `ReeseArch64` once.
- Always select the milestone that matches the intended release for both
  the issue and pull request. Use [v1](https://github.com/ReeseArch64/opencok/milestone/1)
  for initial-release work; use the corresponding milestone for later work.
  Do not assign an unrelated milestone merely to fill the field.
- Verify the issue reference, template, labels, project, reviewer, assignees,
  and milestone before requesting review and after updating a pull request.

### Community and project management

#### Discuss before opening an issue

- Before opening any issue, search existing discussions and either open a
  discussion about the topic or participate meaningfully in an existing one.
  Reading a discussion alone does not satisfy this requirement.
- Discuss the report, proposal, or task in English and use the required
  discussion labels. Search existing issues as well to avoid duplicates.
- Once there is concrete work to track, use the appropriate issue form.
  Include the discussion or comment URL, confirm your participation, and
  summarize the findings and why an issue is needed. Link the resulting issue
  back from the discussion so participants can follow the work.
- This requirement applies to all issue types, including bug reports,
  regressions, feature requests, documentation, and maintenance tasks.
  Security vulnerabilities must continue through private security reporting;
  never open a public discussion containing sensitive vulnerability details.
- Issue forms require a discussion reference and participation confirmation.
  Maintainers verify that the link is relevant and participation occurred;
  form validation does not independently verify GitHub discussion activity.

#### Discussion language and labels

- Write every discussion title, body, and reply in English (en-US), including
  announcements, welcome posts, questions, proposals, and follow-up updates.
- Every discussion must have the `discussion` label and any additional labels
  from [`.github/settings.yml`](settings.yml) that match its subject. Use
  `question` for questions, `enhancement` for feature proposals, and relevant
  component or client-release labels only when applicable.
- Select the appropriate discussion category as well as labels; a category
  does not replace labels. Verify labels after publishing, including discussions
  created through the API or outside a discussion template.
- Keep labels accurate as the conversation develops. When discussion work
  becomes an issue, link both records and apply the relevant issue labels.

#### Collaboration channels

Use the repository's GitHub features as the primary collaboration channels:

- **[GitHub Discussions](https://github.com/ReeseArch64/opencok/discussions):**
  use discussions for questions, proposals, ideas, announcements, and
  conversations that do not yet describe actionable work.

- **[GitHub Issues](https://github.com/ReeseArch64/opencok/issues):** use
  issues for confirmed bugs, feature requests, and concrete tasks after
  opening or participating in a related discussion. Search for an existing
  issue before creating a new one and link the required prior discussion,
  pull requests, and project items.

- **[OpenCok project](https://github.com/users/ReeseArch64/projects/6):** use
  the linked repository project to plan, prioritize, assign, and track issues and
  pull requests through their lifecycle. Keep the status of each item current
  as work progresses.

- **[GitHub Wiki](https://github.com/ReeseArch64/opencok/wiki):** use the
  repository wiki for long-lived project knowledge, operational guides,
  architecture notes, and documentation that does not belong next to the
  source code. Keep wiki pages linked to the relevant issues and repository
  documentation.

When a discussion results in actionable work, create or link an issue. Pull
requests must reference the issue they address and be added to the OpenCok
project with the metadata required above.

---

Questions? Open a discussion on GitHub at
<https://github.com/ReeseArch64/opencok/discussions>.
