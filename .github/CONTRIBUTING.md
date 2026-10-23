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
