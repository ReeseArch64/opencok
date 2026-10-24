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

## Deferred-login foundation: issue 54

Source commit: `ef47dac`, dependent on the data-config foundation. This step adds
share metadata, saved preferences, switches, account-verification counter reads and
feature-announcement composition. Later reference-restoration commits change integer
and omission semantics, declaration ordering, service-specific overrides and the
missing world-news preference write. This initial read-only foundation must not be
confused with those completed refinements or with complete topic 1 parity.

Validation on this isolated publication branch, 2026-10-24:

- `bun --no-env-file test apps/server/test/availability.test.ts apps/server/test/settings.test.ts apps/server/test/data-config.test.ts apps/server/test/login-config.test.ts apps/server/test/configuration-adapters.test.ts packages/resources/tests tests/packages/boundaries.test.ts`:
  35 tests across seven files, 1,536 assertions, all passing.
- Type checks: rules, resources, DTOs, controllers, contracts, repositories, storage
  and realm server passed.
- Repository lint, formatting and diff checks passed.

The adapter tests inject fake SQL clients and override cache transport. No database,
Redis, listener, native client or integration suite is started. The draft CI deferral
and requirement to validate authorized full workflows before merge remain unchanged.

## Review step 4: migrate-player-summaries

Source implementation: `e541bc4`. Tracking: #55.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19156876).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 5: migrate-player-power

Source implementation: `4dc95a5`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157017).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 6: migrate-power-context

Source implementation: `43bd2fe`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157112).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 7: migrate-power-attributes

Source implementation: `1f37865`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157227).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 8: migrate-power-memberships

Source implementation: `46e124f`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157291).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 9: migrate-power-command

Source implementation: `264b430`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157291).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 10: migrate-power-progression

Source implementation: `b0c8cae`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157354).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 11: migrate-world-power-effects

Source implementation: `361087e`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157354).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 12: migrate-hero-dragon-effects

Source implementation: `43dce7f`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157432).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 13: migrate-office-power-effects

Source implementation: `06944ba`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157432).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 14: migrate-territory-power-effects

Source implementation: `c9ef7cd`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157472).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 15: migrate-research-power-effects

Source implementation: `2b5fd08`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157503).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 16: migrate-lucky-day-effects

Source implementation: `fa16476`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157503).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 17: migrate-throne-power-effects

Source implementation: `897b3f8`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157578).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 18: compose-player-power-effects

Source implementation: `ac2d33e`. Tracking: #56.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157578).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 19: migrate-public-profile-data

Source implementation: `4b1d3fd`. Tracking: #57.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157650).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 20: migrate-public-profile-fields

Source implementation: `a9e3f05`. Tracking: #57.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157678).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 21: migrate-public-profile-generals

Source implementation: `8b2bbd6`. Tracking: #57.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157708).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 22: migrate-public-profile-social-fields

Source implementation: `1dab177`. Tracking: #57.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157725).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 23: migrate-public-profile-alliance

Source implementation: `e254b3f`. Tracking: #57.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157838).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 24: migrate-public-profile-command

Source implementation: `2213a9a`. Tracking: #57.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157838).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 25: migrate-reconnect-state

Source implementation: `8612123`. Tracking: #58.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157922).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 26: migrate-reconnect-generals

Source implementation: `52d5842`. Tracking: #58.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157948).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 27: migrate-reconnect-mine

Source implementation: `665a09a`. Tracking: #58.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19157993).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 28: migrate-reward-previews

Source implementation: `597614f`. Tracking: #58.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158039).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 29: migrate-player-rankings

Source implementation: `f45e6d2`. Tracking: #59.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158141).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 30: migrate-alliance-rankings

Source implementation: `70f0118`. Tracking: #60.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158325).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 31: migrate-castle-ranking

Source implementation: `bd34031`. Tracking: #61.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158385).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 32: migrate-contribution-ranking

Source implementation: `699e9b9`. Tracking: #62.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158420).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 33: migrate-expedition-ranking

Source implementation: `02cdd1b`. Tracking: #63.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158506).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 34: restore-empty-command-ack

Source implementation: `60f35bc`. Tracking: #64.

[Tracking issue; no individual source-stage report located](https://github.com/ReeseArch64/opencok/issues/64).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 35: migrate-mail-status

Source implementation: `89a88f4`. Tracking: #64.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158587).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 36: migrate-mail-saving

Source implementation: `323a355`. Tracking: #65.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158707).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 37: migrate-mail-read-status

Source implementation: `c6af863`. Tracking: #66.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158795).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 38: migrate-mail-deletion

Source implementation: `28091e1`. Tracking: #67.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158884).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 39: migrate-conversation-mail-saving

Source implementation: `2328642`. Tracking: #68.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19158943).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 40: migrate-mail-contents

Source implementation: `3dd14fe`. Tracking: #69.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159042).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 41: complete-mail-content-numbers

Source implementation: `149dec7`. Tracking: #69.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159132).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 42: complete-mail-content-structures

Source implementation: `c985394`. Tracking: #69.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159132).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 43: restore-mail-helper-order

Source implementation: `f531e12`. Tracking: #69.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159172).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 44: migrate-mail-category-projection

Source implementation: `7c951fa`. Tracking: #70.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159258).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 45: connect-mail-category-listing

Source implementation: `256a01e`. Tracking: #70.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159338).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 46: migrate-mail-batch-reads

Source implementation: `575abea`. Tracking: #71.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159447).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 47: migrate-mail-group-projection

Source implementation: `2138fa5`. Tracking: #72.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159549).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 48: connect-mail-group-listing

Source implementation: `53ff16d`. Tracking: #72.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159696).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 49: migrate-chat-mail-listing

Source implementation: `f4b0cc3`. Tracking: #71.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159733).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 50: plan-conversation-read-marking

Source implementation: `ad61cec`. Tracking: #73.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159818).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Review step 51: persist-conversation-read-intents

Source implementation: `cc473d5`. Tracking: #73.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19159951).

The publication copies the source implementation without changing its files;
only this review-evidence document is added. Source-tree equality and diff checks
were inspected. No tests were rerun on this publication branch, following the
maintainer request to defer further execution. Historical results in the linked
report are evidence for the source stage, not a fresh result for this combined HEAD.

This dependent draft does not close its tracking issue or establish full-topic
parity. Required follow-ups and limitations remain in the linked source report.
The nonempty evidence commit retains `[skip ci]`; workflows and required checks
are unchanged, integration/client execution is deferred and merge readiness is
not claimed. No migration or gameplay write is executed by publication.

## Parallel lower block merge readiness

The current snapshot integrates PR #135 and the already merged descendant PRs in this parallel
block: #135, #136, #137, #138, #139, #140, #141, #142, #143.

The maintainer authorized readiness and merge after all applicable CI checks pass on the final head.
Original source-stage validation above remains historical; this record does not claim native-client,
deployment or complete legacy parity.
