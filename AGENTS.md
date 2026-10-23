# Agent Instructions

These instructions define how agents must work in the OpenCoK project.

## Required project context

Before contributing or changing the project:

1. Read and follow [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md).
2. Read [`PRODUCT.md`](PRODUCT.md) for the product goals, scope, and
   principles.
3. Read [`.github/ARCHITECTURE.md`](.github/ARCHITECTURE.md) for directory
   responsibilities, mobile client handling, and compatibility boundaries.
4. Check the Git status and relevant files before editing. Preserve unrelated
   changes, including files already staged by the user.

## Working rules

- Keep each change focused on the requested outcome. Follow existing
  conventions before introducing new dependencies or abstractions.
- Keep architecture details in `.github/ARCHITECTURE.md`, product decisions in
  `PRODUCT.md`, and contribution rules in `.github/CONTRIBUTING.md`. Link to
  these documents instead of duplicating their contents here.
- Treat ignored files as local inputs, not as files available to every
  contributor. Never force-add private game files, client artifacts, or keys.
- Respect the read-only mobile directories documented in the architecture.
  Use a separate working directory for extraction, patching, and packaging.
- Do not expose credentials, signing keys, session tokens, private Elex code,
  or player data in source, logs, documentation, or reports.
- Follow the principle of least privilege when accessing sensitive information.
- Document any assumptions, limitations, or dependencies introduced by your changes.
