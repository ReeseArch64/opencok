# Mail integration delivery benchmark

This comparison measures the delivery boundary in three modes: archived parent
relays/polling, current local delivery and current isolated Workers. It uses two
synthetic realms in three databases on one disposable PostgreSQL server, with the
same current fenced conversation-read producer and real signed Chat receiver/store.
The baseline is not a complete historical application: the adapter loads the old
relay functions, publisher and PollingWorker and reproduces the old 50-intent loop.

Run one trial at a time on an otherwise idle host with the pinned Bun dependencies
and Docker available. Keep the source unchanged throughout a comparison. The
scenario accepts 5–20 commands per realm and 0–500 ms of additional asynchronous
Chat response delay for realm one; the recorded fixture uses 10 and 150. Every
trial creates and removes its own disposable infrastructure. Never substitute
player queues or administrative production connections.

## Current local and isolated modes

From the repository root:

```sh
mail_benchmark_dir=$(mktemp -d /tmp/opencok-mail-benchmark.XXXXXX)
bun --no-env-file apps/workers/scripts/benchmark-mail-integration.ts "$mail_benchmark_dir/local-1.json" local 10 150
bun --no-env-file apps/workers/scripts/benchmark-mail-integration.ts "$mail_benchmark_dir/isolated-1.json" isolated 10 150
```

Repeat with distinct output names. Interleave baseline/local/isolated trials and
retain every successful report and failed-attempt diagnostic; a selected best run
does not establish a performance improvement. Setup and startup time are reported
separately from the delivery window.

## Archived parent adapter

Create an isolated archive of the exact parent revision and install its own frozen
workspace dependencies. Do not point its workspace package links at the current
checkout; the adapter rejects archived aliases resolving outside the archive.
The `current` link below is only for the shared benchmark fixture imports.

```sh
mkdir "$mail_benchmark_dir/base"
git archive a7bb675fdc6faeccf492dbc07550c53525bb458e | tar -x -C "$mail_benchmark_dir/base"
(cd "$mail_benchmark_dir/base" && bun install --frozen-lockfile --ignore-scripts)
ln -s "$PWD" "$mail_benchmark_dir/current"
```

Save this adapter as `benchmark-parent.ts` inside `mail_benchmark_dir`. Its literal
imports preserve the architecture guardrail against maintained computed imports.
The report records its exact hash, the archived source manifest and dependency
resolution paths as well as the current benchmark/runtime manifest.

```ts
import { createHash } from "node:crypto";
import { realpathSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { MailGiftRelay } from "./base/apps/server/src/mail-gift-relay.ts";
import { relayMailGiftOpenings } from "./base/packages/repositories/src/mail-gift-relay.ts";
import { relayMailChat } from "./base/packages/repositories/src/mail-chat-intents.ts";
import { createChatMailboxPublisher } from "./base/packages/connection/src/chat-mailbox.ts";
import { initializeLogging } from "./base/packages/core/src/logging.ts";
import {
  mailBenchmarkSources,
  type BaselineMailIntegration,
} from "./current/apps/workers/scripts/benchmark-mail-source.ts";
import { runMailIntegrationBenchmark } from "./current/apps/workers/scripts/benchmark-mail-scenario.ts";
import { bounded } from "./current/apps/workers/integration/support/process.ts";

const sourceRoot = realpathSync(new URL("./base/", import.meta.url).pathname);
const resolutions = [];
for (const specifier of [
  "@opencok/core/polling-worker",
  "@opencok/drizzle/schema/opencok_kingdom/mail_chat_read_intent",
  "@opencok/drizzle/schema/opencok_kingdom/mail_gift_opening",
  "@opencok/drizzle/schema/opencok_global/mail_gift_log",
  "@opencok/contracts/chat-mailbox",
  "@opencok/contracts/chat",
  "@opencok/identity/chat-mailbox",
]) {
  const path = realpathSync(Bun.resolveSync(specifier, resolve(sourceRoot, "apps/server/src")));
  if (!path.startsWith(`${sourceRoot}${sep}`)) {
    throw new Error("Baseline dependency resolves outside its source snapshot");
  }
  resolutions.push({ specifier, path: relative(sourceRoot, path) });
}
initializeLogging("mail-integration-benchmark");
const baseline: BaselineMailIntegration = {
  revision: "a7bb675fdc6faeccf492dbc07550c53525bb458e",
  sources: await mailBenchmarkSources(sourceRoot),
  resolutions,
  runnerSha256: createHash("sha256")
    .update(await Bun.file(import.meta.path).text())
    .digest("hex"),
  async start(kingdom, global, kingdomId, chatConfig) {
    const giftStarted = Promise.withResolvers<void>();
    const chatStarted = Promise.withResolvers<void>();
    const publish = createChatMailboxPublisher({ ...chatConfig, timeoutMs: 5000 });
    const gift = new MailGiftRelay(
      async () => {
        const delivered = await relayMailGiftOpenings(kingdom, global);
        giftStarted.resolve();
        return delivered;
      },
      () => giftStarted.reject(new Error("Baseline gift relay failed")),
    );
    const chat = new MailGiftRelay(
      async () => {
        let delivered = 0;
        while (delivered < 50 && (await relayMailChat(kingdom, kingdomId, publish, 5000))) {
          delivered++;
        }
        chatStarted.resolve();
        return delivered;
      },
      () => chatStarted.reject(new Error("Baseline Chat relay failed")),
    );
    const close = () => Promise.all([gift.close(), chat.close()]).then(() => {});
    try {
      await bounded(Promise.all([giftStarted.promise, chatStarted.promise]));
      return { close };
    } catch (error) {
      await close();
      throw error;
    }
  },
};
await runMailIntegrationBenchmark({
  output: process.argv[2]!,
  mode: "baseline",
  count: Number(process.argv[3] ?? 10),
  delayMs: Number(process.argv[4] ?? 150),
  baseline,
});
```

Run the archived delivery boundary against the same fixture:

```sh
bun --no-env-file "$mail_benchmark_dir/benchmark-parent.ts" "$mail_benchmark_dir/baseline-1.json" 10 150
```

The `runnerSha256` changes when the adapter text or paths change; compare its
recorded source and dependency manifest rather than assuming a revision label
proves what was loaded. Retain the reports and exact adapter before removing your
own temporary directory.

## Interpretation limits

Foreground commands use the actual fenced conversation-read repository and query
policy, not TCP/native clients or a complete gateway. Receiver delay is asynchronous
HTTP latency, not heavy JavaScript computation. Closed-loop command latency omits
an external arrival queue. Small samples and shared-host scheduling do not establish
production tail-latency SLOs.

The old/current local consumers share producer pools and realm fencing. Isolated
Workers add their own pools, processes and recurring permission scans. Each trial
reports those explicit budgets; a timing difference cannot be attributed solely
to process separation. Aggregate CPU/RSS includes the parent, Chat fixture,
measurement overhead and every isolated worker child, but excludes PostgreSQL and
container costs. Startup, setup and seed creation are outside the measured window.

Queue age, RSS and connections are sampled every 100 ms and may miss short peaks.
Worker event-loop histograms span child lifetime after startup; the parent
histogram spans delivery. SQL counters cover parent pools, excluding isolated
worker SQL; sampled connection maxima track only realm credentials. No exact
lock-hold duration or equal total SQL cost is inferred. Receipts, opened gift logs
and empty queues are asserted in every successful trial.

## Recorded comparison for #697

On 2026-10-28, nine fresh-process trials ran in balanced order:
baseline/local/isolated, isolated/baseline/local, local/isolated/baseline. The
published adapter above was extracted unchanged and exercised directly. The
archived parent manifest's 4,010 files matched that revision's Git tree. Current
runtime/benchmark manifests contained 4,032 files and remained identical across
all nine trials. All trials produced 20 Chat receipts per realm, 20 opened gift
logs in total and empty queues. Random IDs and timestamps differ; declared
workload parameters and canonical asserted outcomes match.

The host was Linux x64, Bun 1.4.2, AMD Ryzen 5 5500 with 12 logical CPUs. Recorded
one-minute host load before trials ranged from 4.20 to 6.80, so this is shared-host
evidence. Each realm began with 10 Chat intents and 10 gift intents; 10 foreground
commands per realm ran at combined concurrency four. Realm-one Chat responses
had 150 ms extra delay, with five-second polling. Producer pools allowed four
connections per realm, the receiver/global pool four and observer pools one per
realm. Isolated mode additionally allowed two realm and one global connection per
worker. It sampled two live realm-worker connections for each realm; sampled
producer pool waiting counts remained zero in all modes.

Values below are the median of three per-trial statistics, followed by the full
observed range. They are not pooled samples or confidence intervals. Each trial
has only 10 foreground observations per realm, so its p99 is the observed maximum,
not an estimate of a production percentile.

| Metric                          | Archived parent             | Current local                | Current isolated          |
| ------------------------------- | --------------------------- | ---------------------------- | ------------------------- |
| Delivery-process startup, ms    | 28.86 (27.41–39.19)         | 62.25 (42.06–63.07)          | 1104.54 (1055.32–1195.07) |
| Delivery window, ms             | 10183.66 (8528.36–10208.05) | 10167.05 (10154.12–10202.40) | 7654.59 (7568.74–7760.92) |
| Aggregate process CPU, ms       | 973.50 (887.06–1047.26)     | 850.02 (839.87–984.20)       | 1115.59 (1062.25–1120.30) |
| Sampled peak aggregate RSS, MiB | 171.05 (168.90–195.63)      | 163.57 (146.80–166.59)       | 427.98 (413.51–429.08)    |
| Realm 1 foreground p50, ms      | 18.67 (13.20–29.60)         | 13.73 (11.15–16.47)          | 13.46 (12.38–23.03)       |
| Realm 2 foreground p50, ms      | 13.81 (9.93–22.96)          | 9.78 (7.62–13.33)            | 13.78 (11.10–23.87)       |
| Realm 1 foreground p99, ms      | 34.24 (29.23–76.30)         | 25.39 (21.60–25.46)          | 27.52 (26.80–50.71)       |
| Realm 2 foreground p99, ms      | 22.84 (15.15–73.73)         | 17.51 (14.72–21.82)          | 25.85 (22.04–57.55)       |
| Realm 1 pool-acquire p99, ms    | 0.69 (0.24–16.12)           | 0.28 (0.20–0.64)             | 3.71 (1.16–9.22)          |
| Realm 2 pool-acquire p99, ms    | 1.22 (1.08–1.58)            | 0.64 (0.56–0.90)             | 0.96 (0.90–2.31)          |
| Parent event-loop p99, ms       | 2.09 (1.38–2.26)            | 1.40 (1.39–1.95)             | 1.50 (1.16–2.16)          |

Isolated mode's shorter delivery window is not evidence of higher throughput.
Independent worker startup shifted poll phases: realm two had 10 initial intents
pending when foreground work began in every isolated trial, versus zero in both
local modes except three in the final baseline trial. These different overlap
points change when new intents enter a five-second poll cycle. The final baseline
trial's higher foreground/pool latency and shorter wall time remain in the ranges;
no run was discarded.

Sampled oldest Chat intent ages reached 6,765/5,190 ms for baseline realms one/two,
6,551/5,080 ms for current local and 6,154/5,081 ms for isolated. Sampled maximum
backlogs were 19/10, 19/10 and 19/20 respectively. These are fixture observations,
not configured production admission budgets. Isolated worker event-loop p99
observations ranged from 0.86 to 1.63 ms; their lifetime window differs from the
parent's measurement window.

The isolated process/pool arrangement has a clear aggregate memory and startup
cost in these trials. Latency and CPU observations do not establish a general
performance gain or equivalence. The change supplies an independently managed
integration boundary; production capacity, stable phase-controlled throughput and
representative full-realm command mixes remain separate evidence.

Reproduction identifiers:

| Artifact                                    | SHA-256                                                            |
| ------------------------------------------- | ------------------------------------------------------------------ |
| Measured current runtime/benchmark manifest | `100c59832c718d61482b27d28e37f0338c064d02f06491cbd92d96decc6b1e24` |
| Declared scenario                           | `7e019624accc3055782ba48012705cd35488b02d4fa900c187445c5487a08628` |
| Archived parent manifest                    | `28d06e2db4739cb0e547675b18e701006ac2d570882bea84552343f2e7b7b2fb` |
| Executed documented adapter                 | `e66f0e832719acd8115068f4ce97a9aee6c334788cdb3305bd69f92305f16713` |

After measurement, one benchmark-only input guard was tightened to reject a
baseline mode without a baseline factory, or a local/isolated mode with one, and
to correct its diagnostic. All nine measured calls supplied matching inputs; the
measured execution path is unchanged. The other 4,031 manifest files match exactly.
The final runtime/benchmark manifest is
`ffd397210e7f9d32b8750a13498d0a359d6b0cf3f164932e88728e2681cada58`;
the measurements above retain the explicitly identified pre-guard manifest.
