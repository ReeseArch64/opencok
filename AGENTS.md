# Agent Instructions

## Context

- Follow [the contribution guide](.github/CONTRIBUTING.md) for Git, GitHub and
  delivery requirements. Reuse context already read during the session.
- Consult [the product definition](PRODUCT.md) when a task affects goals, scope
  or player/operator behavior.
- Consult [the architecture](.github/ARCHITECTURE.md) when a task involves service
  boundaries, directory responsibilities, infrastructure or client compatibility.
  Search for relevant headings and read only the applicable sections.
- Check [accepted ADRs](docs/decisions/README.md) before changing a technology
  choice. Keep rationale in ADRs, system design in the architecture, product
  decisions in the product definition and contribution rules in the guide.

## Workflow

- Inspect Git status and relevant code before editing. Preserve unrelated work
  and existing staged changes.
- Keep changes focused on the request and follow established patterns before
  adding dependencies or abstractions.
- Respect the project's Oxlint and Oxfmt rules. Run `bun run lint` and
  `bun run format:check`, plus tests and type checks relevant to the change.
  Fix violations introduced by your work; do not weaken checks to make them pass.
- Review the final diff and report what changed, validation performed and any
  remaining limitations. Document assumptions and new dependencies where they belong.

## Protected inputs and data

- Treat ignored files as local inputs, not shared project dependencies. Never
  force-add private game files, client artifacts or keys.
- Keep original mobile inputs read-only. Consult the relevant architecture
  section before client work; extract, patch and package in a separate directory.
- Access sensitive information only as needed. Keep credentials, signing keys,
  session tokens, private Elex code and player data out of source, logs and reports.
