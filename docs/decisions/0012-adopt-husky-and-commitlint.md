---
status: accepted
date: 2026-10-28
decision-makers: ReeseArch64
---

# ADR-0012: Adopt Husky and commitlint for commit-message validation

## Context and Problem Statement

Contributors need immediate commit-message feedback while CI independently checks
messages that arrive without local hooks. The repository already uses Husky and
commitlint with Conventional Commits. CI must validate new branch work without
replaying inherited history, including first pushes and diverged pull requests.

Acceptance records the maintainer's tool selection. This ADR installs no packages,
changes no hooks or workflows and does not assert that verification is complete.

## Decision

Use Husky 9 for the local `commit-msg` hook and commitlint for both local and
independent CI validation. Keep `.husky/commit-msg` invoking
`bunx commitlint --edit "$1"` against the supplied message file, including paths
with spaces. Never rewrite messages, stage files or disable checks to obtain a pass.

Keep `commitlint.config.cjs` as the shared policy extending
`@commitlint/config-conventional`; contribution prose defines required types,
scopes, English imperative subjects and the 100-character header limit. Preserve
existing policy while documenting any gap between prose and automated enforcement;
this ADR does not silently add rules, exceptions or bypasses.

Keep CI validation in `.github/workflows/commitlint.yml` with full history and
checkout of the pull-request head or event SHA. The workflow inlines the same existing range-selection shell logic; do not make
it depend on a removed helper script. Preserve strict shell error handling and these semantics:

- Use an available `BASE_SHA` directly when it is an ancestor of HEAD.
- For a pull request with a diverged target SHA, use that SHA's merge base with HEAD.
- With no usable range base, including first pushes and rewritten push history, use the remote default-branch merge base; never replay inherited branch history.
- If the chosen base equals HEAD, validate the tip message; otherwise validate commits in `base..HEAD`.

Non-goals: release automation, changing Git history, enforcing hook installation
on other machines or treating local hooks as a security boundary. Script-free
container/CI dependency installation does not remove independent CI validation.

## Consequences

- Local rejection shortens feedback loops but hooks can be absent; CI remains authoritative and must run even when installation skips lifecycle scripts.
- Shared configuration avoids local/CI rule drift; maintainers must test both invocation forms on upgrades and surface any prose-policy enforcement gap separately.
- Correct merge-base selection avoids unrelated historical failures; full history and remote default-branch availability remain workflow prerequisites.
- Inlining removes a helper dependency but places range logic in YAML; disposable Git graph fixtures must guard behavior during future workflow changes.

## Implementation Plan

- **Affected paths**: `package.json`, `bun.lock`, `commitlint.config.cjs`, `.husky/commit-msg`, `.github/workflows/commitlint.yml`, `.github/CONTRIBUTING.md`. The maintained CI target is the workflow, not the removed helper.
- **Dependencies**: Retain `husky` 9.1.7 and lockfile-resolved `@commitlint/cli` / `@commitlint/config-conventional` (`^21.2.4` manifests). No dependencies are installed or changed by this record.
- **Patterns**: Root `prepare` runs `husky`; generated `.husky/_/` adapters stay ignored. The maintained hook passes the quoted message path to local dependencies; CI installs frozen dependencies with `--ignore-scripts` and explicitly invokes commitlint.
- **Configuration**: Keep workflow `BASE_SHA`, `EVENT_NAME` and `DEFAULT_BRANCH` inputs and strict `set -euo pipefail` behavior. Inline the same range logic without simplifying away merge-base or tip validation.
- [ ] Compare local edit-file and CI stdin/range invocations on synthetic valid and invalid messages, preserving the current shared configuration.
- [ ] Exercise disposable Git repositories for ancestor pushes, zero/missing first-push bases, rewritten history, diverged PR targets and default-branch tip runs.
- [ ] Review the workflow after helper removal to ensure no stale invocation remains, and retain independent validation on pushes, pull requests and manual dispatches.

### Verification

- [ ] A valid Conventional Commit passes locally and in CI; invalid messages fail both with nonzero exit status and no file/history changes.
- [ ] The hook handles a message-file path containing spaces without rewriting its contents or staging anything.
- [ ] First-push and rewritten-history fixtures exclude inherited commits using the default merge base; ordinary pushes validate only commits after the usable ancestor base.
- [ ] A PR whose target advanced validates from its merge base with HEAD, excluding target-only and inherited commits.
- [ ] Default-branch/manual runs with no distinct range validate the tip; an invalid tip fails rather than producing an empty success.
- [ ] The workflow contains executable range logic, no removed-helper reference and no disabled validation; it works independently of generated local hooks.

## Alternatives Considered

These are tradeoff comparisons, not claims of historical tool trials.

- CI-only commitlint avoids hook setup but delays feedback until publication and increases corrective pushes.
- Custom Git hooks avoid Husky but require manual installation/versioning across contributors; independent CI remains necessary either way.
- A custom regular-expression validator can be small but duplicates parsing and policy maintenance already supplied by commitlint.

## More Information

See [commit-message validation](../../.github/CONTRIBUTING.md#commit-message-validation)
and the [maintained workflow](../../.github/workflows/commitlint.yml).
Revisit if message conventions or supported tooling change; preserve range semantics through executable fixtures.
