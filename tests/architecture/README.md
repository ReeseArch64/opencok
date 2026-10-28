# Domain migration guardrails

This shared integration suite implements the first dependency checks for
[ADR-0016](../../docs/decisions/0016-adopt-domain-owned-package-layout.md) and
[#578](https://github.com/ReeseArch64/opencok/issues/578), under #558 W01/W05.
It inspects maintained workspace files without importing applications, catalogs
or private inputs. Use `bun --no-env-file test tests/architecture` directly.

## What is checked

- SWC parses static imports, re-exports, import types, import-equals, literal dynamic imports and `require` calls. Runtime and type-only dependencies both participate in the graphs.
- Relative source paths and public workspace exports are resolved against maintained files. Exact aliases and more-specific wildcard exports take precedence; all conditional target branches are inspected.
- Cross-workspace and external imports must be direct declared dependencies. Development dependencies count for this structural check; production-only installation is a separate build concern.
- Strongly connected components produce explicit cyclic edges for both modules and workspaces. Adding an edge inside an already cyclic component still creates a new violation.
- Package implementation source cannot import applications. Domain/rule source cannot transitively reach the enumerated database, transport, controller, storage, runtime or universal catalog entrypoints.
- Computed module loads and unresolved paths are explicit evidence gaps rather than silently accepted edges.

The scanner uses Git's tracked and nonignored workspace file list, including
unstaged edits, and excludes removed paths. No ignored assets are read. It treats
package test/support imports as dependencies but applies the app-import prohibition
to package `src` only. The suite and fixtures live outside application packages.

## Existing debt and removal

`baseline.json` is a deliberate test fixture recording existing violations at its
named revision, not a generated report to refresh automatically. Every new
violation fails the repository test. Removed violations must be removed from the
baseline in the same reviewed change. Do not regenerate or enlarge this fixture
to pass a migration; fix the new dependency or obtain an explicit separate decision.
The baseline includes existing type cycles, missing direct test dependencies,
type-level HTTP coupling and the experimental web client's three ignored artwork
imports. Those exceptions do not make private inputs a CI dependency.

This check does not prove that existing cycles or boundary violations are resolved.
Their elimination remains tracked by #558's domain slices and facade retirement.
An alias needs a named owner, a caller inventory and a removal issue before it is
introduced; this suite supplies dependency evidence, not automatic approval.

## Inventory

Run `bun --no-env-file tests/architecture/inventory.ts` and redirect stdout into a
task-owned temporary directory outside the repository. The deterministic report
lists every maintained workspace file, current workspace owner, source imports,
direct dependents and graph violations. Root workspace documentation has the
explicit owner `repository`; path-based roles distinguish source, catalog data,
schemas, tests, tooling, documentation, configuration and assets. The revision
identifies HEAD, while file contents include current nonignored working-tree edits.
`sourceLines` counts physical lines for code files only; roles allow separate
catalog/schema/test totals. This is not an automatic measure of handwritten behavior.

Reverse dependency traversal supplies `applicationSourceConsumers` and
`verificationCandidates`. These include type-only edges and are static candidates,
not proof that a module executes in those processes or that a test fully covers it.
Source evidence records command arrays/sets, command-enum values, command switches,
comparisons and includes/has checks, plus GameplayCatalog membership. Imported
registries, spread elements and computed values stay explicit unresolved references.
Other routing styles require manual review; test-file evidence is not a production
handler declaration. Native catalog values preserve their exact strings.

`proposedOwner: null` and
`migrationStatus: unreviewed` are intentional: package/domain meaning must be
reviewed, not inferred from filenames. The report is an input to W01, not proof
that W01's catalog/command/application assignment is complete.

The graph is static and conservatively includes conditional export branches.
It does not execute code, evaluate arbitrary computed paths, resolve third-party
package internals, discover reflective service loading or prove native-client
compatibility. Asset URLs, `require.resolve` calls and process-spawn strings are not module imports.
The purity destination policy is explicit in `ArchitectureAudit`; extend it with
tests when adopting a new infrastructure boundary. Source-level findings must be
combined with tests, builds and runtime evidence for each migration.

## Verification of the checker

Synthetic tests cover parser forms, wildcard specificity, missing/excluded exports,
runtime versus declaration branches, indirect infrastructure access, application
imports, undeclared dependencies and new edges within an existing cycle. The
repository test compares exact findings against the fixture, preventing an existing
cyclic package group from becoming a blanket exemption for new code.
