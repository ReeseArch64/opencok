# AI Agent Guide

OpenCoK is a self-hosted game platform. Use this index to load only the guidance relevant to the task; the documents below are independent and do not form reading chains. Reuse context already read, inspect relevant headings, and reread only after changes or when verification requires it. Report missing sources without inventing their contents.

## Task references

| Source                                  | Scope                                                                |
| --------------------------------------- | -------------------------------------------------------------------- |
| [RULES](.agents/RULES.md)               | Authorization, protected tracked content, destinations and delivery. |
| [SECURITY](.github/SECURITY.md)         | Sensitive data, external transfers, incidents and private reporting. |
| [CONTRIBUTING](.github/CONTRIBUTING.md) | Branches, tests, commits and GitHub delivery.                        |
| [CONTEXT](CONTEXT.md)                   | Technical requirements, priorities and acceptance criteria.          |
| [ARCHITECTURE](.github/ARCHITECTURE.md) | Components, dependencies, state ownership and migration gates.       |
| [GLOSSARY](GLOSSARY.md)                 | Vocabulary, names, contracts and code presentation.                  |

[PRODUCT](PRODUCT.md) is the optional player/operator description, not required reading for technical tasks.

## Skills

- For every implementation, use [generate-tests](.agents/skills/generate-tests/SKILL.md) for unit coverage of changed behavior and acceptance criteria; complete other applicable test layers with existing project tools.
- After implementation and before opening/updating a PR, use [code-review](.agents/skills/code-review/SKILL.md) against the issue on Standards and Spec. Pin the intended base (the immediate parent for stacked work), resolve blockers, rerun after corrections and record results/limitations. Resolve missing issues/criteria before review.

## Local/private inputs

The inventory below describes possible inputs, not their presence or permission to scan them. Access only task-required files; keep originals read-only and derived writes within explicitly authorized destinations. Reading, enumerating or changing environment variables/files requires an explicit request. Do not automatically download, install, publish, synchronize, back up or rewrite local inputs.

| Path                                             | Purpose and boundary                                                          |
| ------------------------------------------------ | ----------------------------------------------------------------------------- |
| `data/resources/`                                | Legacy XML resources from v6.12.20, v9.27.0 and v12.06.0; read-only.          |
| `data/reference/server/`                         | Decompiled legacy Java server; read-only.                                     |
| `data/reference/server-jar/`                     | Original Java server JARs; read-only.                                         |
| `data/reference/http/`                           | Original PHP API; read-only.                                                  |
| `data/ios/`, `data/android/`                     | Original platform clients remain read-only outside the destinations below.    |
| `data/ios/extracted/`, `data/android/extracted/` | Extracted clients; inspect/modify only for an authorized client task.         |
| `data/ios/install/`, `data/android/install/`     | Latest installation artifact; an authorized update replaces the previous one. |
| `data/ios/patches/`, `data/android/patches/`     | Project client changes.                                                       |
| `data/cdn/`                                      | Original client assets remain read-only outside derived destinations.         |
| `data/cdn/data/`                                 | Serving assets; update only for an authorized asset task.                     |
| `data/cdn/extracteds/`                           | Extracted assets that may be modified on demand.                              |
| `data/backups/`                                  | Necessary task-scoped backups only; existing backups remain protected.        |
