# Research

This package owns ordinary and civilization research workflows extracted in
[#643](https://github.com/ReeseArch64/opencok/issues/643), under #558 W07 and
ADR-0016. It contains 12 source modules and one owned test file. The largest
handwritten implementation is below 250 lines; catalog data is not copied here.

## Ownership and composition

| Responsibility                                      | Source                                                       |
| --------------------------------------------------- | ------------------------------------------------------------ |
| Ordinary command/activity planning                  | `services/research.ts`                                       |
| Completion, power and troop/skill unlock plans      | `services/completion.ts`                                     |
| Civilization command/activity planning              | `services/civilization.ts`                                   |
| Prerequisites, definition selection and costs       | `rules/research.ts`, `rules/civilization.ts`                 |
| Native response projection                          | `mappings/research.ts`, `mappings/civilization.ts`           |
| Response shape and runtime validation               | `contracts/responses/research.ts`, `validations/research.ts` |
| Command identities                                  | `enums/command.ts`                                           |
| Structural city context and completion callbacks    | `contracts/context.ts`                                       |
| Bounded reads, level selection and aggregate writes | `repositories/progression.ts`                                |

The realm composes ordinary research in `apps/server/src/composition/research.ts`.
Target-task and expedition scoring retain their implementations and are injected
into completion; Hero scoring remains on the existing city plan. Civilization
research has no horizontal Service collaborator. Both domains inherit command
matching from the concrete shared need now implemented in `base`.

`ResearchRepository` receives the original realm transaction and owner in app
composition. City calls its reads and writes in their former order and retains
aggregate validation, transaction/receipt/outbox coordination and the production
settlement boundary. `writeValidated` accepts the ordinary plan only after city's
owner, duplicate, quantity and deadline validation; it does not define a new command
entrypoint. Civilization writes preserve their existing explicit owner check.
No adapter opens a separate transaction or uses a global database client.

City bootstrap uses the owned Mapper. Reconnect receives a structural projection
callback through `contracts/reconnect.ts`; realm composition supplies it to both
login and `user.lv` planning. Generic GameService callers that use reconnect must
provide this dependency or use `createRealmGameService`. Non-bootstrap command
tests may retain the generic Service. No horizontal research facade remains and
no cycle exception is added.

## Preserved behavior

Ordinary commands retain queue type 6 and civilization commands type 19. Definition
IDs, prerequisites, VIP/prestige checks, feature gates, discount order, payment and
item costs, saved activity payloads, duration arithmetic, cancel/refund, reschedule,
completion and unlocks retain their prior behavior. Response strings, integer and
float tags, exact long deadlines, snapshot ordering and bounds are unchanged.
The repository keeps ordered ordinary reads capped at 4097, civilization reads
capped at 4097, the original level query and serial upsert targets/values.

The shared Rules catalogs, city-state/plan contracts, aggregate bound checks and
common bootstrap/effect read providers remain transitional dependencies. Raw
science catalogs are still loaded by resources. Semantic named definitions and
versioned bindings remain W14 work; this change does not infer their identities,
claim complete W07, or establish a separate process authority.

## Verification and recovery

Existing ordinary/civilization research, reconnect, alliance and Hero suites retain
all assertions. Owned tests add strict mutation versus display selection, snapshot
bounds/duplicates, exact deadlines, discount evaluation, civilization float behavior
and command/base contracts. PostgreSQL coverage exercises concurrent retries,
completion, cancellation, recovery, production effects and rollback after an earlier
ordinary write followed by a foreign civilization rejection. Structural comparison
covers the migrated algorithms, schema, unchanged workflows and reconstructed city
query/write ordering; the response interface is byte-identical.

Run `bun run --cwd packages/research test` and `check-types`; root package tests
include the owned suite. Deploy the rebuilt realm against the existing schema.
There are no new settings, schema conversions, processes or client artifacts.
Rollback deploys the previous realm artifact against the same saved queues/data.
Native-device acceptance and production-load measurements remain separate work.
