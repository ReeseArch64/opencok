# Build pipeline evaluation for issue #551

Retain Bun CLI for API, Chat, server and web. Every app was considered separately;
no measured alternative met the confirmed 20% time-or-memory improvement threshold.
The tested alternatives also exposed compatibility failures. This is a project
measurement on one host, not a universal compiler ranking. The recommendation is
recorded in [proposed ADR-0015](../../docs/decisions/0015-adopt-measured-per-application-build-selection.md).

## Requirement and reproducible limitation

The original complaint had no supplied build latency, memory exhaustion or
transformation-failure reproduction. The agreed measurable requirement is at least
20% lower median build time or sampled process-tree resident memory on the same
app, without correctness/diagnostic regressions. Artifact size, spread and the other
performance metric must also be disclosed. A runtime or database symptom does not
establish a compiler defect; source formatting is a separate concern.

Artifact execution found a concrete packaging limitation: Bun replaced the env
loader's `__dirname` with its build-time source directory. A relocated ESM bundle
could therefore consult the build workspace's root `.env`. The synthetic relocation
test in `packages/env/tests/load.test.ts` failed before the change and passed after
resolving from `import.meta.url`. It uses conflicting synthetic source/deployment
settings, an unrelated working directory, process overrides and an absent deployed
file, in minified and diagnostic builds. The fix is independent of compiler choice
and does not claim a speed improvement. No gameplay or database rules changed.

## Reproduction and environment

[The protocol](README.md) gives the exact commands and configuration. Backend shortlist and Rollup/SWC results pin application/tooling source to commit
`24b570d17cfcf5c468f80983a206ba8c6e607d7b`, after the environment correction.
Public-fixture web results pin source to `06f8b157f9b3432bd71a791cdb36b7defff4163b`;
maintained application code and compiler options are unchanged, while browser input
images are the generated public fixtures in `web-assets.json`. No prepared private
artwork is required or overwritten. Each report records its exact source and lock.
The lock SHA-256 is
`97fa75265eb0c6515ee36157b75e429e60e2f788793912b64a43296c65771db9`.
Measurements began on 2026-10-28 UTC (2026-10-27 locally), on Linux
6.18.55-1-cachyos-lts x86_64/glibc 2.44, AMD Ryzen 5 5500, 12 logical CPUs,
and 33,529,372,672 bytes of host RAM. Bun is 1.4.2. Node 26.10.0 was available
for tooling, but application artifacts were executed with Bun; no Node production
compatibility is claimed. The host was shared, not CPU-isolated.

Each scenario has one recorded first-use run followed by five fresh-process runs.
Outputs are cleaned each time; installed dependency and OS caches are retained.
These are not cold-cache results, and there is no watch/incremental build claim.
No other builds or tests from this investigation ran concurrently with measurements.
Memory is summed process-tree RSS sampled every 5 ms, including esbuild's service;
shared pages can be counted more than once and short peaks can be missed.
Web results additionally record the kernel `wait4` high-water mark and use it as
a floor; their table reports the greater observation. Backend reports retain the
original sampled tree RSS. These are not exact simultaneous tree memory peaks. Polling
materially quantizes the 5–17 ms Bun web scenarios: tiny CLI/API differences are
not meaningful. Installation, type checking, resource copy, compression and Docker
work are excluded from compilation timing. First-use values and every measured
run, including failures, are retained in [shortlist results](results.json) and
[public-fixture web results](web-results.json) and
[Rollup/SWC results](rollup-results.json). Only ANSI colors and absolute path prefixes
in compiler failure diagnostics were normalized after measurement.

## Seven requested candidates

Versions and licenses were checked against installed pinned manifests; capabilities
were checked against the official references in the protocol. This table describes
the tested integrations, not arbitrary future plugins or versions.

| Candidate           | Version / license                    | Evaluation and outcome                                                                                                                                                                                                                                                                                                                                   |
| ------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bun CLI / Bun.build | 1.4.2 / MIT                          | Current CLI and equivalent fresh API worker measured on all four apps, both modes. CLI retained; API differences do not justify script replacement.                                                                                                                                                                                                      |
| esbuild             | 0.28.2 / MIT                         | Full backend bundling plus an explicit current-page HTML/CSS/image adapter measured on all four apps. Slower and more memory for the backend shortlist; emitted suite passes, but Bun does not map the tested linked diagnostic failure to TS.                                                                                                           |
| Rolldown            | 1.2.15 / MIT                         | Backend transforms, bundling and minification measured; slower and more memory. Raw HTML input fails in every web run. The emitted-suite build also rejects an existing JSON fixture containing a lone surrogate.                                                                                                                                        |
| Rollup              | 4.65.1 / MIT                         | Complete API pipeline with node-resolve 16.0.3, CommonJS 29.0.3, JSON 6.1.0 and SWC, with builtin externals and dynamic native requires retained. Much slower than baseline; the tested single-output pipeline fails catalog initialization. Not extended to other apps because it loses the initial timing/memory comparison and fails compatibility.   |
| SWC                 | @swc/core 1.16.20 / Apache-2.0       | Measured inside the same Rollup pipeline for TS transformation and minification. This is one complete pipeline result shared by two roles. Standalone transformer timing is not an equivalent bundle; upstream discourages using swcpack as the application bundler.                                                                                     |
| tsc                 | TypeScript 7.0.2 / Apache-2.0        | Mandatory semantic checks and deliberate TS2322 rejection verified separately. Unbundled emit is excluded from optimized-bundle timing: it does not package HTML/CSS or resolve deployed workspace source exports into a self-contained JS graph. No declaration publishing is required here.                                                            |
| Oxc                 | 0.155.0 integrated in Rolldown / MIT | The exact transformer/minifier integration is the measured Rolldown binary; its version is verified in the [v1.2.15 Cargo lock](https://github.com/rolldown/rolldown/blob/v1.2.15/Cargo.lock). Standalone Oxc components are not another complete application bundler, and are not counted as an independent result. Oxlint/Oxfmt are outside this role. |

esbuild is a new pinned evaluation dependency; the lock retains versions required
by existing consumers. Candidate dependencies are development-only. Rollup's
`inlineDynamicImports` setting matches the baseline's single-file backend output;
its initialization failure does not prove that a different chunked Rollup pipeline
could never work. Such a pipeline would need another equivalence/asset evaluation.

## Measured build results

Wall time is milliseconds. RSS is MiB. Each range is minimum–maximum across the
five measured runs; the separate first-use run is excluded from medians. JS and
map sizes below are KiB. Failed HTML attempts are not reported as fast builds.

### Minified application builds

| App    | Pipeline   | Wall median [range] ms    | RSS median [range] MiB | JS KiB  | Maps KiB | Failures |
| ------ | ---------- | ------------------------- | ---------------------- | ------- | -------- | -------- |
| api    | bun-cli    | 152.9 [149.2–160.8]       | 233.9 [233.0–234.6]    | 2360.7  | 0.0      | 0/5      |
| api    | bun-api    | 157.4 [151.4–174.7]       | 243.5 [243.2–244.4]    | 2360.7  | 0.0      | 0/5      |
| api    | esbuild    | 523.7 [394.7–563.1]       | 362.3 [326.2–374.6]    | 3024.8  | 0.0      | 0/5      |
| api    | rolldown   | 757.7 [735.4–932.4]       | 834.1 [821.2–844.4]    | 2426.3  | 0.0      | 0/5      |
| chat   | bun-cli    | 146.4 [131.5–194.2]       | 195.7 [194.9–198.2]    | 2035.2  | 0.0      | 0/5      |
| chat   | bun-api    | 131.1 [128.1–145.2]       | 205.4 [204.9–206.8]    | 2035.2  | 0.0      | 0/5      |
| chat   | esbuild    | 328.0 [304.6–345.4]       | 280.5 [270.5–286.5]    | 2520.3  | 0.0      | 0/5      |
| chat   | rolldown   | 587.7 [493.0–632.6]       | 697.0 [672.7–706.2]    | 2106.2  | 0.0      | 0/5      |
| server | bun-cli    | 534.8 [483.2–693.9]       | 915.2 [911.0–917.8]    | 39572.1 | 0.0      | 0/5      |
| server | bun-api    | 539.0 [482.3–567.8]       | 925.0 [920.4–931.7]    | 39572.1 | 0.0      | 0/5      |
| server | esbuild    | 1633.4 [1422.1–1737.2]    | 1577.5 [1545.2–1659.6] | 39922.7 | 0.0      | 0/5      |
| server | rolldown   | 2579.2 [2283.7–2709.3]    | 2648.2 [2574.0–2655.5] | 38989.6 | 0.0      | 0/5      |
| web    | bun-cli    | 11.2 [5.8–11.4]           | 25.4 [25.4–25.4]       | 3.0     | 0.0      | 0/5      |
| web    | bun-api    | 16.6 [16.4–16.8]          | 28.5 [28.4–29.3]       | 3.0     | 0.0      | 0/5      |
| web    | esbuild    | 77.2 [49.8–104.4]         | 55.8 [54.2–57.0]       | 3.1     | 0.0      | 0/5      |
| web    | rolldown   | Failed                    | —                      | —       | —        | 5/5      |
| api    | rollup-swc | 11254.0 [10707.2–12094.3] | 1684.0 [1643.0–1732.8] | 2177.1  | 0.0      | 0/5      |

### Unminified builds with linked diagnostic maps

| App    | Pipeline   | Wall median [range] ms    | RSS median [range] MiB | JS KiB  | Maps KiB | Failures |
| ------ | ---------- | ------------------------- | ---------------------- | ------- | -------- | -------- |
| api    | bun-cli    | 180.1 [174.8–209.6]       | 284.4 [283.9–285.4]    | 4409.8  | 11747.2  | 0/5      |
| api    | bun-api    | 189.1 [185.0–204.6]       | 295.3 [295.0–296.2]    | 4399.5  | 11747.2  | 0/5      |
| api    | esbuild    | 568.1 [504.4–748.2]       | 549.5 [505.3–608.1]    | 6209.9  | 17816.4  | 0/5      |
| api    | rolldown   | 385.4 [350.4–550.5]       | 806.4 [792.2–833.3]    | 5437.1  | 12095.9  | 0/5      |
| chat   | bun-cli    | 156.4 [147.2–176.2]       | 233.7 [232.8–234.2]    | 3432.3  | 7251.7   | 0/5      |
| chat   | bun-api    | 166.9 [164.1–207.4]       | 244.8 [244.3–245.2]    | 3423.6  | 7251.7   | 0/5      |
| chat   | esbuild    | 456.0 [437.5–665.5]       | 451.7 [433.6–469.8]    | 4768.7  | 9693.6   | 0/5      |
| chat   | rolldown   | 312.1 [300.1–382.5]       | 695.2 [678.4–710.7]    | 4184.9  | 7585.9   | 0/5      |
| server | bun-cli    | 1278.7 [1128.0–1559.4]    | 1603.5 [1602.0–1609.4] | 76975.1 | 178166.8 | 0/5      |
| server | bun-api    | 1267.2 [1096.9–1544.2]    | 1616.4 [1612.4–1620.7] | 76955.1 | 178166.8 | 0/5      |
| server | esbuild    | 2566.2 [1994.8–2719.4]    | 2708.2 [2668.5–2774.2] | 91804.2 | 184536.6 | 0/5      |
| server | rolldown   | 1817.8 [1507.1–1911.6]    | 2845.9 [2840.0–2867.5] | 63638.2 | 151423.5 | 0/5      |
| web    | bun-cli    | 12.3 [11.2–17.3]          | 25.4 [25.4–25.4]       | 4.9     | 11.2     | 0/5      |
| web    | bun-api    | 30.5 [23.5–59.5]          | 28.9 [28.6–29.0]       | 5.3     | 11.2     | 0/5      |
| web    | esbuild    | 55.1 [49.0–60.1]          | 54.3 [53.7–55.7]       | 5.3     | 17.6     | 0/5      |
| web    | rolldown   | Failed                    | —                      | —       | —        | 5/5      |
| api    | rollup-swc | 10434.7 [10200.9–10934.5] | 1890.8 [1818.9–2198.1] | 5598.2  | 13350.1  | 0/5      |

All successful repeated builds emitted stable byte counts within their scenario.
The CLI/API diagnostic outputs can differ slightly in path/debug metadata; their
minified backend bytes match. Production scripts remain minified without maps.

### Frontend assets and compression

Browser measurements copy only maintained source into an isolated temporary
workspace and decode three committed public solid-color image fixtures there.
The ignored local game artwork is neither read nor copied. These tiny fixtures
measure compiler/HTML/asset plumbing, not production image transfer or rendering
performance. Their digest is recorded in `web-results.json`.

These totals include all emitted JS, HTML, CSS and image files, but exclude maps.
Gzip level 9 is computed per file, then summed; these are not browser cache traces.
Bun can inline the CSS background image while esbuild's adapter emits a file URL,
so their CSS/asset packaging is not byte-identical. Both emitted loading flows
were executed against the same three image resources. The small compressed-byte
difference does not meet the agreed time-or-memory criterion.

| Pipeline / mode      | Other assets bytes | JS + assets bytes | Gzip bytes | Source maps bytes |
| -------------------- | ------------------ | ----------------- | ---------- | ----------------- |
| bun-cli / minified   | 6349               | 9467              | 4285       | 0                 |
| bun-api / minified   | 6349               | 9467              | 4286       | 0                 |
| esbuild / minified   | 5470               | 8613              | 3939       | 0                 |
| bun-cli / diagnostic | 7205               | 12185             | 4808       | 11447             |
| bun-api / diagnostic | 7273               | 12686             | 4885       | 11447             |
| esbuild / diagnostic | 6415               | 11861             | 4545       | 18039             |

## Graph diagnosis and deployment footprint

The [Bun metafile summary](graph-summary.json) records 3,427 unique inputs totaling
93,637,674 source bytes. `packages/resources/` accounts for 1,050 inputs and
82,206,565 input bytes. Its contribution is 37,214,382 of 40,521,802 emitted bytes
(91.84%). The realm artifact is large principally because it includes maintained
catalog data; a generic minifier ranking cannot remove required data. Catalog
externalization/lazy-loading would be a separate packaging/behavior decision and
was not attempted here.

The summary records the exact untimed profiling command. Create its output directory
first; Bun's metafile option uses `--metafile=<path>`. The diagnostic mode emits
roughly 182 MB of maps for the realm. Diagnostic versus minified measurements
change both maps and minification, so they do not isolate minifier cost. Type
checking is separate and was not folded into build latency. There is no measured
Docker bottleneck or image-size claim in this report.

Runtime assets remain required: `dist/data/badwords.json` is 87,465 bytes and is
copied by the existing realm build script. Backend gzip is not a deployment-size
metric. Bundles retain native/dynamic dependencies, including Sharp; current images
still install production dependencies and copy the workspace. Container instruction,
runtime and dependency installation strategy are unchanged, so no new build-stage
or build-time production dependency is required. Final image size, image startup,
context transfer and live rollout were not benchmarked or performed. Retain the
existing image/configuration as the operational rollback; no player state is migrated.

## Executable preservation checks

| Check                        | Evidence                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root env relocation          | New regression fails before the fix; all 28 env tests pass after it, including source and moved minified/diagnostic bundles, unrelated cwd, process precedence and absent file.                                                                                                                                                                            |
| Selected backend pipeline    | `verify.ts` executes 100 tests and 6,394 assertions per emitted minified/diagnostic suite, including real HTTP/WebSocket and SFS socket paths using synthetic injected dependencies, discovery, login/init, city/map commands, protocol snapshots, BigInt/numeric boundaries, persistence-effect assertions and shutdown/startup cleanup. Both modes pass. |
| Real application entrypoints | Minified API, Chat and server entrypoints execute in an isolated workspace layout and reject missing configuration. They do not fail module resolution or consult the original build workspace. Valid HTTP/socket behavior is checked through emitted composition fixtures rather than a live database deployment.                                         |
| Runtime asset                | The copied default `src/../data/badwords.json` resolves and its filter is applied; a swallowed read failure cannot satisfy the assertion.                                                                                                                                                                                                                  |
| Source maps                  | Bun's intentional synthetic failure points to `synthetic-failure.ts:1`. esbuild 0.28.2 passes all 100 emitted tests in both modes, then fails this required map check with an emitted JS location. A map file alone is not treated as success.                                                                                                             |
| Rolldown correctness         | Emitted-suite build rejects `mail-helper-order-vectors.json` at its lone `\ud800` surrogate fixture. No fixture was removed or normalized to make the candidate qualify. Raw HTML entry attempts fail 5/5 in both measured modes, in addition to their first-use failures.                                                                                 |
| Rollup/SWC correctness       | The configured no-splitting pipeline fails an existing dynamically imported catalog initialization before tests can run. Resolution/native-require support was configured, but this ordering failure remains a rejection.                                                                                                                                  |
| Type safety                  | API/Chat/server `check-types`, web `check:types`, env and pilot semantic checks pass. The synthetic wrong-type assignment bundles successfully and is separately rejected with TS2322 by `tsc --noEmit`. Strictness is unchanged.                                                                                                                          |
| Web output                   | Maintained Bun build and esbuild adapter output both load their HTML/CSS/JS and three images over HTTP; emitted client reaches 100% progress and online health state with a synthetic DOM. No full-browser rendering or native mobile test is claimed.                                                                                                     |
| Mutation API                 | Seven auth, three Chat and four profile mutations are killed through the retained Bun `onLoad` harness. All 13 mutation harnesses create isolated workspace manifests with linked runtime dependencies. Chat's stale source path and formatting-sensitive target are repaired in the foundational PR; no authorization/gameplay code changes.              |
| Source suites and quality    | API, Chat and web unit suites pass; server has 1,632 passing tests. Relevant semantic checks, `bun run lint`, `bun run format:check` and frozen installation pass.                                                                                                                                                                                         |

No real player fixture, gameplay refactor, schema/data migration, private client
extraction, live persistence/restart experiment or native client track certification
was performed. The source suites and emitted synthetic persistence assertions do
not replace full deployment verification. Because the existing compiler/runtime is
retained, those are not evidence of a new runtime migration or a changed data contract.

## Recommendation and follow-through

Bun CLI is the supported selection for every measured app. The per-app option
remains open: choosing different backends/frontend tools is permitted when one
passes the same measured and executable gates. In this run the 20% threshold did
not justify a replacement; no unsupported universal fastest/smallest claim is needed.
The useful implementation changes are the corrected environment relocation and
repeatable emitted-artifact checks, not a forced bundler migration.

Clean-checkout CI builds web in the same isolated public-fixture workspace,
using its unchanged build command. Prepared game artwork remains an ignored
local input and is not a shared project dependency.

The stack separates the env correction, this evaluation/ADR proposal and CI
integration. The proposed decision has explicit affected paths, pinned dependencies,
measurable gates, rollback and revisit triggers. The ADR review found those items
complete; shared-host sampling, synthetic DOM and untested live/native deployment
remain explicit evidence limits. Human acceptance of the ADR is pending PR review.
CI checks semantic types, maintained builds, env relocation, emitted behavior and
mutation plugins; it does not impose machine-dependent benchmark timing thresholds
or upload diagnostic maps. Revisit with new compatible tooling or changed graphs,
build budgets, runtime requirements or release hardware.
