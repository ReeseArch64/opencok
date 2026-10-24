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

## Review step 52: connect-realm-chat-sessions

Source implementation: `44925fe`. Tracking: #74.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19160037).

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

## Review step 53: expose-chat-discovery

Source implementation: `662115e`. Tracking: #75.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19160156).

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

## Review step 54: connect-avatar-grants

Source implementation: `46c2e29`. Tracking: #76.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19160448).

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

## Review step 55: persist-avatar-completions

Source implementation: `b0669d2`. Tracking: #77.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19160568).

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

## Review step 56: deliver-avatar-system-mail

Source implementation: `ef9cf89`. Tracking: #78.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19160660).

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

## Review step 57: publish-avatar-profile-updates

Source implementation: `e16046a`. Tracking: #79.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19160736).

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

## Review step 58: deliver-avatar-chat-metadata

Source implementation: `6a4c5d5`. Tracking: #80.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19160844).

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

## Review step 59: connect-avatar-completion

Source implementation: `b83121f`. Tracking: #81.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161040).

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

## Review step 60: restore-world-favorites

Source implementation: `24d8182`. Tracking: #82.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161148).

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

## Review step 61: restore-world-player-search

Source implementation: `e5a04b0`. Tracking: #83.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161239).

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

## Review step 62: restore-player-search-policy

Source implementation: `c8c0add`. Tracking: #84.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161421).

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

## Review step 63: connect-player-search

Source implementation: `c2433dd`. Tracking: #84.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161582).

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

## Review step 64: restore-world-resource-details

Source implementation: `7d66601`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161698).

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

## Review step 65: restore-world-point-owner-reads

Source implementation: `955ea8c`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161774).

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

## Review step 66: restore-world-monster-details

Source implementation: `886a72d`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19161890).

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

## Review step 67: connect-local-world-point-details

Source implementation: `657906e`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162013).

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

## Review step 68: restore-neutral-resource-details

Source implementation: `b868622`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162098).

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

## Review step 69: restore-world-city-details

Source implementation: `caba2b9`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162166).

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

## Review step 70: restore-barbarian-point-details

Source implementation: `3fed9ef`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162287).

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

## Review step 71: connect-remote-world-point-details

Source implementation: `8b08cc9`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162395).

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

## Review step 72: restore-resource-troop-load

Source implementation: `d48c02d`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162429).

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

## Review step 73: decode-saved-resource-troops

Source implementation: `8c22720`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162475).

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

## Review step 74: read-occupied-resource-marches

Source implementation: `fdb02b7`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162552).

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

## Review step 75: restore-resource-plunder-state

Source implementation: `9dbe83e`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162676).

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

## Review step 76: restore-resource-owner-effects

Source implementation: `4ef7d94`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162759).

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

## Review step 77: restore-new-general-skills

Source implementation: `bed980e`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162873).

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

## Review step 78: restore-new-general-building-effects

Source implementation: `4a494bc`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19162986).

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

## Review step 79: restore-new-general-equipment

Source implementation: `f8ae39c`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163085).

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

## Review step 80: read-resource-owner-effects

Source implementation: `46eb648`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163151).

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

## Review step 81: restore-resource-generals

Source implementation: `81225cf`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163285).

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

## Review step 82: restore-resource-owner-context

Source implementation: `9eae56b`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163386).

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

## Review step 83: compose-resource-owner-modifiers

Source implementation: `85d2aab`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163487).

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

## Review step 84: read-resource-expedition-stage

Source implementation: `e6f3993`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163610).

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

## Review step 85: compose-resource-army-load

Source implementation: `9926433`. Tracking: #85.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163675).

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

## Review step 86: restore-feature-realm-selectors

Source implementation: `9db7aa1`. Tracking: #53.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163757).

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

## Review step 87: restore-item-event-realm-selectors

Source implementation: `15c2c01`. Tracking: #53.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19163820).

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

## Review step 88: restore-kingdom-skill-records

Source implementation: `7058757`. Tracking: #53.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19164006).

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

## Review step 89: restore-feature-version-comparison

Source implementation: `543656b`. Tracking: #53.

[Source-stage implementation and validation report](https://github.com/ReeseArch64/opencok/discussions/27#discussioncomment-19164066).

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

## Parallel bridge merge readiness

The current snapshot integrates PR #179 and the already merged descendant PRs in this parallel
block: #179, #180, #181, #182, #183.

The maintainer authorized readiness and merge after all applicable CI checks pass on the final head.
Original source-stage validation above remains historical; this record does not claim native-client,
deployment or complete legacy parity.
