# Testing Guide

The types and tools below are references for selection, not a mandatory checklist per component. Each test protects relevant behavior; categories without a concrete need may remain absent. Packages containing only shared configuration, such as `packages/config`, do not need dedicated test suites by default.

## Test types

| Type                     | Purpose                                                                                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit                     | Domain rules, calculations, validation, permissions and state transitions in isolation; fakes and mocks represent external boundaries.                                                 |
| Widget / component       | Local rendering, interaction and UI state without the complete application or backend.                                                                                                 |
| Contract                 | Public names, types, numeric widths, optionality, enums, binary order and invalid messages; shared reference vectors cover TypeScript, Go and Dart encoding/decoding.                  |
| Integration              | Real adapters and services: queries, indexes, constraints, transactions, migrations, caching, concurrency and realm isolation. Mocked databases do not establish database integration. |
| E2E                      | Complete critical journeys through the relevant real client, gateway, backend and persistence boundaries. Package-level exchanges establish only package-boundary coverage.            |
| Mutation                 | Assertion strength measured through deliberate code mutations. Equivalent mutants, uncovered code, timeouts and infrastructure failures are distinct outcomes.                         |
| Structural snapshot      | Small, stable serialized structures with controlled timestamps, IDs and ordering; complements behavioral assertions.                                                                   |
| Visual / golden          | Appearance against reviewed image baselines under fixed fonts, viewport, scale, locale, animations and rendering conditions.                                                           |
| Property-based / fuzzing | Invariants, numeric boundaries, malformed inputs and serialization round-trips, with reproducible seeds and minimized failures.                                                        |
| Load / performance       | Latency, throughput, connections and resource use under a declared workload, environment and limits.                                                                                   |
| Resilience / recovery    | Persisted state and consistency after disconnects, retries, repeated messages, restarts and partial failures.                                                                          |
| Security                 | Server-side authorization, realm isolation, resource ownership and rejection of invalid inputs. External scanners complement behavioral checks.                                        |

Test types describe objectives, not runners. Expected contract results are independent of the codec under test. E2E evidence is limited to the real boundaries and platforms covered.

## Tools by ecosystem

- TypeScript / TSX: Bun Test for units and components; Vitest for other functional suites; `@vitest/snapshot` for structural snapshots; `fast-check` for properties; StrykerJS with `@stryker-mutator/vitest-runner` for mutation. Playwright provides browser automation where needed; visual comparison requires explicit integration with Vitest. Stryker's Vitest runner does not cover Bun unit tests automatically.
- Go: `testing`, reference fixtures, native fuzzing and benchmarks. A mutation tool remains unselected.
- Dart / Flutter: Flutter Test, `testWidgets`, `matchesGoldenFile`, deterministic generated cases and `mutation_test`; `integration_test` for device-based journeys and recovery; profile-mode measurements for performance.
- Potential additions: k6 for compatible load scenarios and OWASP ZAP for compatible security surfaces. Listing a tool does not establish installation, configuration or working coverage.

## Quality and game priorities

Useful coverage checks observable behavior, success, rejection, boundaries and relevant failures. Tests are independent, deterministic and based on synthetic data; infrastructure tests use isolated resources. Snapshots complement assertions, and coverage percentages and mutation scores describe only their measured scopes.

Initial game scenarios concern realm entry, correct city loading, construction costs charged once, rejection without partial effects, idempotent retries, progress across disconnects and restarts, concurrent commands, ownership isolation and cross-language message compatibility. Map, marches, gathering, combat and Bot/NPC/Farm restrictions follow their implementation. The server decides outcomes.
