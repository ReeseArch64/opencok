# Application build pilot

This public, synthetic pilot implements the measurement and artifact checks for
[issue #551](https://github.com/ReeseArch64/opencok/issues/551). Candidate tooling
is pinned in root development dependencies and the single `bun.lock`. It does
not change the package manager, deployed runtime or application build commands.
Production-only container installs do not need the candidate tools.

The [measured report](REPORT.md), [shortlist results](results.json),
[Rollup/SWC results](rollup-results.json) and
[proposed ADR-0015](../../docs/decisions/0015-adopt-measured-per-application-build-selection.md)
record the per-app recommendation and evidence limits. Both raw result files pin
the measured source and lockfile; compiler error paths/colors are normalized before
committing, without changing timing, memory or size measurements.

## Reproduce

Use Linux with `/proc`, Python 3 and the repository's Bun 1.4.2. Install separately
from timing, then check types and execute the selected baseline's emitted code:

```sh
bun install --frozen-lockfile
bun --no-env-file node_modules/typescript/bin/tsc --noEmit -p .github/build-pilot/tsconfig.json
bun --no-env-file .github/build-pilot/verify.ts
bun run --cwd apps/web build
bun --no-env-file .github/build-pilot/verify-web.ts apps/web/dist
python3 .github/build-pilot/benchmark.py --output /tmp/opencok-build-results.json
python3 .github/build-pilot/benchmark.py --apps api --candidates rollup-swc --output /tmp/opencok-rollup-results.json
```

Run the two benchmark commands sequentially with no other builds, tests or heavy
workloads. Default measurements cover API, Chat, server and web in minified and
unminified/linked-source-map modes. `--runs` must be at least five. `--apps` and
`--candidates` select smaller scenarios. Installation, type checking, gzip size
calculation, runtime resource copying and Docker work are outside compilation
timing. Outputs are created in a fresh temporary directory, removed before every
run and cleaned after the process exits normally. Deployment outputs and original
mobile inputs are never overwritten.

Each scenario records a first-use run and five fresh-process repetitions. The
first-use run is not a claim of a cold filesystem cache: OS caches and installed
dependencies remain warm. The report records median, minimum, maximum and all
individual failures. No persistent compiler service, watch mode or incremental
build is used. Process-tree resident memory is sampled from Linux `/proc` every
5 ms, including esbuild's child service. This is a sampled peak, not an exact
kernel high-water mark; sampling and process-start overhead are included equally
in wall time. Raw JS, source maps and other assets are counted separately. Gzip
level 9 bytes exclude maps and are calculated outside the timer, caching identical
contents. Gzip is frontend transfer evidence, not a backend deployment-size claim.

## Equivalent settings and exceptions

Backends use ESM, the current Bun runtime, native builtins as externals, bundled
workspace and third-party JS, Bun package conditions, modern syntax, no splitting
and no deployment-environment substitution. `platform: "node"` in esbuild and
Rolldown provides builtin resolution; it does not select Node execution. All
outputs still need their runtime/native dependencies, including Sharp. The
verification layout has its own workspace manifest and no `.env`, while linking
the installed dependencies just as current container images retain them.

Bun CLI measures the maintained command directly. Bun API uses the same settings
in a fresh worker. esbuild's frontend pilot explicitly builds `main.ts` and CSS,
copies imported images through file loaders and rewrites the current HTML script
reference; that small adapter is part of its timing and is specific to this page.
It is not general HTML plugin support. Raw Rolldown's HTML-entry failure is
recorded, rather than comparing a JS-only frontend output with the complete page.
Rollup/SWC bundles the API with node-resolve, CommonJS and JSON plugins, SWC
TypeScript transformation and SWC minification. Its measured time includes the
whole pipeline. It is one result shared by two candidate roles, not two independent
benchmark wins. Oxc is evaluated through Rolldown's integrated transformer and
minifier, not through the repository's formatter or linter.

## Executable checks

`verify.ts [bun-api|esbuild|rolldown|rollup-swc]` bundles existing API, Chat and realm
tests and executes the emitted JS, both minified and diagnostic. It covers actual
HTTP/WebSocket and SFS socket paths with synthetic injected dependencies, discovery,
login/session initialization, city/map operations, protocol snapshots, signed
BigInt values, numeric boundaries, shutdown and startup failure cleanup. Resource
checks exercise the default emitted `src/../data/badwords.json` URL. It also requires
an intentional diagnostic failure to map to its TypeScript file and line and
proves that emit accepts a deliberate type error while `tsc --noEmit` rejects it.
A nonzero exit is a compatibility failure, including a source-map failure; do not
weaken that check to qualify a candidate. The fixtures do not start a real database
or claim live deployment/native client certification.

`verify-web.ts <output>` serves built HTML, CSS, JS and images over HTTP and executes
the emitted client in a synthetic DOM. It requires three successfully loaded
images, completed progress and the online health state. This exercises asset paths
and the emitted loading flow; it is not a browser rendering/screenshot test.

Keep semantic workspace checking separate, including web's existing `check:types`
command. Required local checks are `bun run lint`, `bun run format:check`, each
affected workspace's type/test commands and the above artifact checks. Preserve
Bun's separate mutation instrumentation and isolated workspace fixture, then run:

```sh
bun --no-env-file apps/server/scripts/mutate-auth.ts
bun --no-env-file apps/chat/scripts/mutate-chat.ts
```

## Upstream references

Capabilities were checked against official documentation and installed pinned
package manifests; measured versions and the lock hash are embedded in each report.

- [Bun bundler and source maps](https://bun.com/docs/bundler)
- [esbuild options and TypeScript limits](https://esbuild.github.io/api/)
- [Rolldown platform, transformation and minification](https://rolldown.rs/guide/notable-features)
- [Rollup package resolution and CommonJS plugins](https://rollupjs.org/tools/)
- [SWC bundling limitations](https://swc.rs/docs/usage/bundling)
- [Oxc TypeScript transformation](https://oxc.rs/docs/guide/usage/transformer/typescript)
- [Oxc minification in Rolldown](https://oxc.rs/docs/guide/usage/minifier)
- [TypeScript semantic checking without emit](https://www.typescriptlang.org/tsconfig/noEmit.html)
