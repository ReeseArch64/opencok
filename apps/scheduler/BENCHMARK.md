# Timed-activity discovery benchmark

This benchmark compares the archived parent discovery job, current local recovery
and isolated Scheduler discovery against the same current two-realm owner fixture.
It uses disposable migrated PostgreSQL, actual activity Services and transactions,
real child processes, and signed HTTP for isolated dispatch. It is a bounded
synthetic catch-up experiment, not a complete historical Server benchmark or a
production capacity assessment.

## Workload and interpretation

Each realm starts the requested number of construction activities on distinct
synthetic owners and a separate foreground owner. The default is 80 activities
and 30 foreground commands per realm, crossing the 64-row discovery page boundary.
The fixture first holds its owner clock at 1,000,000, then advances it to the latest
saved deadline plus one hour. Both realms recover while `build.move` commands run
on their foreground owners. Recovery passes are explicitly gated with a 100 ms
pause; the real application defaults to a one-second delay after a completed pass.

The outcome check requires every activity to finish once, one completion receipt,
level two, cleared construction state and resource/production checkpoints at the
original saved deadline. The normalized outcome digest compares persisted results
across modes. Twelve-handler registration and the broader correctness suite are
separate evidence: this performance workload exercises construction.

`completion` percentiles measure wall time from the shared recovery gate to
observed completion. They are not absolute live deadline jitter: the logical clock
was deliberately advanced into an overdue backlog. Completion observation polls
PostgreSQL approximately every 20 ms. Foreground percentiles combine both realms;
retain raw samples before deriving additional summaries.

CPU deltas cover the measured recovery/foreground window, excluding process
startup and fixture seeding. Sampled RSS includes resident fixture state. The raw
output records owner and scheduler samples separately, including event-loop and
Scheduler pool observations. Event-loop histograms cover process lifetime, so they include
setup rather than isolating only the measured window. PostgreSQL and the benchmark
controller process are excluded from process resource totals. These instrumentation
limits prevent host-wide resource or production latency claims.

All modes use the current fixture, realm transaction execution, domain handlers,
contracts and migrated schema, including the additive discovery index. Parent mode
replaces only `ActivityRecoveryJob` and its repository selectors with archived
parent source. It invokes the parent's original restore/finish callbacks against
the same owner fixture. It does not reconstruct the whole parent application.

## Run current modes

Use Docker, the repository's pinned Bun and frozen dependencies. Store outputs
outside the checkout and run one trial at a time on an otherwise quiet host:

```sh
bun --no-env-file apps/scheduler/scripts/benchmark-discovery.ts local /tmp/scheduler-local 80 30
bun --no-env-file apps/scheduler/scripts/benchmark-discovery.ts isolated /tmp/scheduler-isolated 80 30
```

The supported count is 65–256 activities per realm; foreground count is 1–1,000.
Each output directory receives `result.json`, containing raw command/completion
latencies, sweeps, samples, normalized outcomes and relevant source hashes. Use a
fresh output directory for every trial rather than overwriting evidence.

## Reproduce the parent adapter

Create an isolated archive of the exact parent and link the current checkout.
The two small adapters below use literal imports so module resolution cannot
silently substitute current code for the archived job/selectors.

```sh
scheduler_bench_dir=$(mktemp -d /tmp/opencok-scheduler-bench.XXXXXX)
mkdir "$scheduler_bench_dir/base"
git archive 8198719716f48ba1293d7c294ab1f3c657c15446 | tar -x -C "$scheduler_bench_dir/base"
bun install --cwd "$scheduler_bench_dir/base" --frozen-lockfile --ignore-scripts
ln -s "$PWD" "$scheduler_bench_dir/current"
```

Save the following exact adapter as `$scheduler_bench_dir/parent-owner.ts`:

```ts
import { ActivityRecoveryJob } from "./base/apps/server/src/activity-recovery-job.ts";
import {
  dueActivities,
  unregisteredActivities,
} from "./base/packages/repositories/src/timed-activity.ts";
import {
  runOwnerProcess,
  type OwnerProcessConfig,
} from "./current/apps/scheduler/integration/support/owner-worker.ts";

try {
  await runOwnerProcess(
    JSON.parse(process.env.OPENCOK_SCHEDULER_TEST_CONFIG!) as OwnerProcessConfig,
    ({ harness: h, now }) =>
      new ActivityRecoveryJob(
        () => h.authority.assertReady(),
        () => [...h.handlers.domains.keys()],
        (types, limit, owner, after) => unregisteredActivities(h.db.db, types, limit, owner, after),
        (types, at, limit, owner, after) => dueActivities(h.db.db, types, at, limit, owner, after),
        (owner, operation, queue) => h.service.restore(owner, operation, queue),
        (owner, command, params) => h.service.command(owner, command, params),
        (event) => process.send?.({ type: "failure", event }),
        now,
      ),
  );
} catch {
  process.send?.({ type: "failed" });
  process.exit(1);
}
```

Save this launcher as `$scheduler_bench_dir/run-parent.ts`:

```ts
import {
  DiscoveryBenchmarkMode,
  runDiscoveryBenchmark,
} from "./current/apps/scheduler/scripts/benchmark-discovery.ts";
await runDiscoveryBenchmark({
  mode: DiscoveryBenchmarkMode.Baseline,
  output: process.argv[2]!,
  count: Number(process.argv[3] ?? 80),
  foreground: Number(process.argv[4] ?? 30),
  ownerPath: new URL("./parent-owner.ts", import.meta.url).pathname,
  baselineRoot: new URL("./base/", import.meta.url).pathname,
});
```

Run the parent with the same counts and foreground workload:

```sh
bun --no-env-file "$scheduler_bench_dir/run-parent.ts" "$scheduler_bench_dir/parent-trial" 80 30
```

The exported benchmark API accepts the baseline mode only with the archived root
and explicit owner adapter. Its output retains the selected parent source hashes
and complete adapter text/hash. Verify the archived files against the fixed commit
and retain the exact current source manifest with the results before comparing
trials. Do not run benchmarks concurrently with integration tests, builds or other
benchmarks.

Use at least three interleaved trials per mode, rotating the order
parent/local/isolated, isolated/parent/local, local/isolated/parent. Compare identical
outcome digests first; then report medians and ranges alongside aggregate process
and pool costs. Differences in fixture timing, polling phases or instrumentation
must remain explicit. A separate process or a lower single timing does not itself
establish a performance improvement.

## Recorded nine-trial result

Three balanced, interleaved trials per mode used 80 activities and 30 foreground
commands per realm. Every trial completed all 160 activities and 60 foreground
commands with the identical normalized outcome digest
`f8f9e4fe88fa0c5d024dd4a5d774f70684b16e9e6055b6e93ceec7aa86cfd04f`.
The host used Bun 1.4.2 on Linux with 12 logical CPUs; observed host load varied,
so these are bounded synthetic observations rather than a controlled capacity lab.

Values are median (minimum–maximum) across three trials per mode:

| Measurement                            | Archived parent              | Current local                | Isolated Scheduler           |
| -------------------------------------- | ---------------------------- | ---------------------------- | ---------------------------- |
| Foreground p95 (ms)                    | 199.47 (170.65–239.94)       | 192.78 (169.24–229.99)       | 215.42 (207.46–221.10)       |
| Foreground p99 (ms)                    | 240.63 (214.28–290.81)       | 290.37 (226.19–371.72)       | 261.67 (220.30–285.44)       |
| Gate-relative completion p95 (ms)      | 11276.68 (9872.71–11293.52)  | 11221.57 (10063.81–13667.88) | 11245.08 (10287.20–11914.16) |
| Owner CPU, two processes (ms)          | 16244.34 (14827.48–16338.10) | 16125.02 (15368.32–18737.16) | 16493.00 (15712.16–16853.94) |
| Scheduler CPU, two processes (ms)      | 0.00 (0.00–0.00)             | 0.00 (0.00–0.00)             | 579.44 (505.03–580.24)       |
| Owner group sampled peak RSS (MiB)     | 1439.12 (1355.63–1476.04)    | 1327.32 (1300.37–1353.15)    | 1380.35 (1359.71–1407.75)    |
| Scheduler group sampled peak RSS (MiB) | 0.00 (0.00–0.00)             | 0.00 (0.00–0.00)             | 249.12 (244.71–251.98)       |

These measurements demonstrate no latency, CPU or memory benefit from isolation.
The isolated mode adds Scheduler CPU, resident memory and database connections;
the behavioral gain established here is the restricted discovery/failure boundary.
Owner and Scheduler RSS values are separately sampled group peaks, not a claim
that both peaks occurred simultaneously. Startup is excluded from CPU deltas.
Scheduler pool samples are recorded; owner pool activity was not instrumented, so
this experiment does not establish measured aggregate pool occupancy or wait.

The eleven runtime-source hashes recorded in every trial match; the independent
4,980-file TS/JSON/SQL/TOML/lock manifest also had no source changes during trials.
Its SHA-256 is
`02bc2b89db743270487415deaa3eafa496f2081346939eb01e0977886f24e22a`.
The executed documentation adapter hashes are
`c0d0193c73b4ff2f7949bc19085ff2de62fd126f858a375b7c5a3f07cd175110`
(owner) and `14e9e5204834504384cacf11fde1fd351de77b49b8255599bc0740c55d621095`
(launcher). The archived job, selectors and lockfile were checked against the
fixed parent commit, and workspace aliases resolved inside that frozen archive.
Raw trial reports, source manifests and migration-plan evidence are retained with
the delivery audit; the recipe above regenerates the workload independently.
