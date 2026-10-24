# Migration review evidence

The migration is being published as dependent draft pull requests while validation
is restricted to unit tests. These publication branches preserve the implementation
commits and add review evidence; the original implementation stack remains intact.
No draft in this sequence claims completion of all eight migration topics.

## Configuration foundation: issue 52

Source commit: `c04c54e`. This first step introduces settings queries, the resource
loader foundation and clock-driven building-star previews. It does not contain the
later restoration of Java version parsing, lenient dates, declaration ordering or
failure boundaries. Those refinements remain required follow-up changes before this
foundation is treated as final legacy parity or the issue is closed.

Validation on the isolated publication branch, 2026-10-24:

- `bun --no-env-file test apps/server/test/availability.test.ts apps/server/test/settings.test.ts packages/resources/tests tests/packages/boundaries.test.ts`:
  12 tests across four files, 1,280 assertions, all passing.
- Type checks: rules, resources, DTOs, controllers and realm server passed.
- Repository lint, formatting and diff checks passed.

The tests use synthetic rules, injected player stores and temporary resource files.
They exercise settings wire types/correlation and clock-based previews without a
live database, service, socket, client/ADB or integration/E2E test.

Publication commits deliberately include `[skip ci]`. The repository's existing PR
workflows start integration suites, which the maintainer has not authorized during
this phase. Workflows and required checks are unchanged. Skipped required checks can
remain pending; these drafts are not merge-ready. A later authorized validation
commit without the marker must run the required checks before merge.

## Data-config foundation: issue 53

Source commit: `4de54e5`, dependent on the issue 52 foundation. This step expands
explicit catalog/scalar projections, player-level stamina selection and typed SFS
output. It is not the final restoration of catalog groups, Java numeric/date
failure semantics, general-sale declaration ordering or kingdom-skill tab sorting;
those changes are implemented later in the original migration stack and still
require publication as dependent refinements.

Validation on this isolated publication branch, 2026-10-24:

- `bun --no-env-file test apps/server/test/availability.test.ts apps/server/test/settings.test.ts apps/server/test/data-config.test.ts packages/resources/tests tests/packages/boundaries.test.ts`:
  21 tests across five files, 1,404 assertions, all passing.
- Type checks: rules, resources, DTOs, controllers and realm server passed.
- Repository lint, formatting and diff checks passed.

Synthetic authenticated/banned/missing profiles exercise explicit field mappings,
wire integer/long/string types, realm switches and stamina gates. The projection
performs no player-state mutation. No live services, clients or integration tests
were used. The draft CI deferral described above still applies.
