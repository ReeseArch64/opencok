# Tracked Repository Rules

These rules govern Git-tracked content and proposed additions, including changes made by tools, generators or delegates.

## Scope and authorization

- Inspect Git and relevant paths before writing. Stay within the request; preserve staged, unstaged and untracked work. Report unrelated problems and ask about unclear ownership or destinations.
- Protected changes require an explicit request and subsequent confirmation after presenting paths, operations, rationale and effects, including generated files. Expanded scope requires fresh confirmation.
- Discarding work, destructive cleanup, removing existing tests/experiments and rewriting history require specific authorization. This includes `git reset --hard`, `git clean` and overwriting restores.
- Tests and delivery do not authorize production access, messages, charges, deployment or real-data mutations.

## Protected tracked content

Read-only unless authorized: `.github/`, `.agents/`, `docs/`, `docker/`; agent guides; root product, context, design, glossary and rules documents; tool configuration, manifests and lockfiles. Protection does not require scanning or reading unrelated content.

## Destinations

- Reuse established locations. New root directories require an explicit request naming their purpose; avoid parallel structures and empty planned applications.
- Permanent tests/minimal fixtures belong with their component, without a root `tests/` directory. `.agents/` holds agent configuration; `.github/` holds repository automation, not application tests. CI-specific tests require prior authorization and a presented destination.
- Disposable scripts, reproductions, benchmarks, logs and intermediate reports belong in task-specific system temporary directories outside the repository. Remove only known task-owned files.
- Keep builds/caches/intermediates out of Git and in configured destinations. Never change `.gitignore` to conceal misplaced files or force-add ignored inputs.

## Tools and configuration

- Reuse adopted formats/tools/dependencies; installations and technology changes require authorization. Prefer temporary commands over persistent helpers; images, binaries and exports need an explicit purpose.
- Restrict automatic fixes to authorized paths. Never weaken rules, exclusions, assertions or failure handling to pass checks.
- Changes to tracked environment bindings, templates or runtime configuration require an explicit request. Prefer nonsecret constants/defaults for stable settings; request missing deployment-specific values instead of inventing them.

## Delivery

Use relative internal Markdown links, not Obsidian links. Verify targets/sections. Review the diff and report changed paths, actual validation and limitations; never invent URLs, execution results or evidence.
