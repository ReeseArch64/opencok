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

## Commits

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

### Issue and pull request labels

Use the labels defined in [`.github/settings.yml`](settings.yml) when
classifying issues and pull requests. Available labels are:

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

### Community and project management

Use the repository's GitHub features as the primary collaboration channels:

- **[GitHub Discussions](https://github.com/ReeseArch64/opencok/discussions):**
  use discussions for questions, proposals, ideas, announcements, and
  conversations that do not yet describe actionable work.

- **[GitHub Issues](https://github.com/ReeseArch64/opencok/issues):** use
  issues for confirmed bugs, feature requests, and concrete tasks. Search for
  an existing issue before creating a new one and link related discussions,
  pull requests, and project items.

- **[GitHub Projects](https://github.com/ReeseArch64/opencok/projects):** use
  the repository project to plan, prioritize, assign, and track issues and
  pull requests through their lifecycle. Keep the status of each item current
  as work progresses.
  
- **[GitHub Wiki](https://github.com/ReeseArch64/opencok/wiki):** use the
  repository wiki for long-lived project knowledge, operational guides,
  architecture notes, and documentation that does not belong next to the
  source code. Keep wiki pages linked to the relevant issues and repository
  documentation.

When a discussion results in actionable work, create or link an issue. Pull
requests should reference the issue they address and be added to the relevant
project when applicable.

---

Questions? Open a discussion on GitHub at
<https://github.com/ReeseArch64/opencok/discussions>.
