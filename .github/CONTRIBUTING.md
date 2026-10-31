# Contributing to OpenCoK

## Branches and scope

- Update local `develop`, then create `feat/<slug>`: lowercase, hyphenated, no username. Target `develop` and incorporate its latest remote changes before opening/updating a PR.
- Never commit directly to `main`, `develop` or `vX.X.X` release branches. Split practical dependent sub-tasks into foundation-to-integration PRs in a `gh stack`; each needs an issue and acceptance criteria.
- Install frozen dependencies with `bun install --frozen-lockfile`. Reuse adopted tools and synthetic fixtures; new frameworks/dependencies require authorization.

## Validation and review

Run affected tests and record commands, outcomes, coverage and limitations. Cover these layers where applicable:

| Layer       | Evidence                                                                   |
| ----------- | -------------------------------------------------------------------------- |
| Unit        | Rules, boundaries, validation and failures.                                |
| Integration | Persistence, messaging and component interactions in disposable resources. |
| E2E         | Observable application workflows and real entrypoints.                     |
| Mutation    | Critical authorization, transitions and economic invariants.               |
| Snapshot    | Reviewed deterministic outputs.                                            |
| Contract    | Package/service/client names, types, optionality and wire order.           |

Justify inapplicable layers; unavailable tools/environments are blocked, not passed. Never weaken assertions, disable failures or accept snapshots to conceal regressions. Formatting does not establish behavioral or native-client compatibility.

Before opening/updating a PR, review against its issue on Standards and Spec. Record the fixed base, criteria, findings and limitations; stacked PRs use their immediate parent. Resolve blockers and repeat review after implementation corrections. Missing issues/criteria must be resolved before review.

## Commits

Review, validate and commit task changes before delivery unless asked to leave them uncommitted. Stage only task paths, preserve unrelated work and never create empty commits.

Use Conventional Commits: `<type>(<scope>): <subject>` with optional body/footer.

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Scopes: `app`, `api`, `infra`, `ci`, `deps`, `docs`, `config`, `release`.
- English (en-US), imperative subject, no trailing period, header at most 100 characters; body explains why. No `Co-Authored-By:` or agent/tool attribution.

Example: `fix(app): correct menu focus on keyboard`.

Husky adapters remain ignored. Dependency installation runs `prepare`; after installation with `--ignore-scripts`, enable hooks with `bun run prepare`. Container/production-only dependency installs use `--ignore-scripts`.

Commit-message validation uses local `commitlint.config.cjs`. Preserve supplied message paths, including spaces, without rewriting messages or staging files. CI validates new commits against the relevant merge base, or the tip when no distinct range exists; do not replay inherited history on first push.

## GitHub workflow

Use `gh` for PR/branch operations and `gh stack`. All public titles, bodies, replies and announcements use English (en-US).

- Before an issue, search Discussions/issues and meaningfully participate in a relevant discussion. For sensitive vulnerabilities, use private reporting instead of public discussion.
- Once actionable, select the issue form, link the discussion/comment, summarize findings and acceptance criteria, and link back. Verify the category, `discussion` label and applicable question/enhancement/component/client-release labels after publishing.
- Match labels to `.github/settings.yml`; keep issue/PR status current and add `needs review` when ready.
- Complete `.github/PULL_REQUEST_TEMPLATE.md`, including justified Not applicable entries, and pass the file through `gh pr create --body-file`.
- Use `Closes #<number>` only for completed issues; otherwise use `Refs #<number>` and describe remaining work.
- Label both issue and PR; add them to [OpenCok project](https://github.com/users/ReeseArch64/projects/6).
- Request `ReeseArch64` review; if self-review is unavailable, record that limitation. Assign yourself and `ReeseArch64`, once if identical.
- Set the intended-release milestone on both: [v1](https://github.com/ReeseArch64/opencok/milestone/1) initially, corresponding releases thereafter.
- Verify template, labels, project, review, assignees and milestone before requesting review and after updates.

Discussions hold proposals/questions, issues hold accepted work, the project tracks delivery, and the Wiki holds enduring operational knowledge outside source.
