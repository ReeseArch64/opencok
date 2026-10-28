# Package responsibilities

The maintainer clarified these package names for [#558](https://github.com/ReeseArch64/opencok/issues/558).
These decisions establish intended responsibility; they do not claim implemented
features or approve process ownership changes. Existing gameplay authority remains
in the realm server. The other package dispositions in #558 remain proposals.

| Package          | Confirmed responsibility and disposition                                                                                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base`           | Domain base classes. Populate only from concrete domain needs.                                                                                                                                                 |
| `contexts`       | Reserved for the web application. Leave this package unchanged in the backend decomposition.                                                                                                                   |
| `custom`         | No intended responsibility. Remove the unused workspace.                                                                                                                                                       |
| `decorators`     | Retain for planned decorator use. No decorators are introduced by this decision; existing DTO conventions still apply.                                                                                         |
| `generators`     | Classes for generating monsters, construction, messages and other concrete outputs. This is not restricted to offline catalog tooling. Generation does not itself grant authority to persist gameplay effects. |
| `helpers`        | English placeholders, as specified by the maintainer. Populate when a concrete consumer establishes the required interface.                                                                                    |
| `utils`          | Formatting tools, such as input/display masks.                                                                                                                                                                 |
| `policy`         | Content policies, including the bad-word list. Existing filtering behavior and source location remain unchanged until a tested extraction.                                                                     |
| `prompts`        | No current use. Remove the unused workspace.                                                                                                                                                                   |
| `robot`          | Remove the unused package. A future robot application will consume domain packages directly; do not scaffold or rename an application in this slice.                                                           |
| `scripts`        | Remove the unused workspace. Existing application/package script directories are unrelated and remain intact.                                                                                                  |
| `share`          | Social sharing, including battle reports and related content.                                                                                                                                                  |
| `store` → `shop` | Rename the workspace to `shop` for the in-game shop. Existing shop workflows migrate in a later vertical slice.                                                                                                |
| `tasks`          | Player quests, event missions and related progression. Background work belongs to jobs, not this package; no new jobs workspace is implied.                                                                    |
| `billing`        | Orders, billing and provider reconciliation.                                                                                                                                                                   |
| `payments`       | Idempotent delivery of purchased benefits to the realm. Economic grants remain under the realm authority.                                                                                                      |
| `guard`          | Authentication and authorization at transport entrypoints.                                                                                                                                                     |
| `middlewares`    | HTTP/transport interception, including request context.                                                                                                                                                        |

## Migration boundaries

The first implementation step removes the four unused workspaces and renames
`store` to `shop`, updating workspace resolution without changing game behavior.
The initial inspection found only package and TypeScript configuration files in
those five directories and no maintained consumers of their package names.

Domain extraction, proposed architecture decisions, client-backed identities,
performance baselines and authority changes remain separate workstreams in #558.
This clarification does not complete its file/catalog/command inventory or accept
the remaining package proposals. Preserve existing public contracts and player data
through each subsequent slice.
