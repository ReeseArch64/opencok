import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cpus, loadavg } from "node:os";
import { monitorEventLoopDelay } from "node:perf_hooks";
import { resolve } from "node:path";
import { createDatabase } from "@opencok/drizzle";
import { initializeLogging } from "@opencok/core/logging";
import { markMailConversationRead } from "@opencok/repositories/mail-conversation-read";
import { acquireRealmAuthority, fenceRealmDatabase } from "@opencok/repositories/realm-authority";
import { mailConversationReadQuery } from "@opencok/rules/mail-conversation-read";
import { createRealmMailIntegrationWorker } from "../../server/src/composition/mail-integration";
import { BenchmarkDatabase } from "../../server/scripts/benchmark-database";
import { distribution } from "../../server/scripts/benchmark-distribution";
import { mailHarness } from "../integration/support/fixture";
import { startMailProcess, eventually } from "../integration/support/process";
import { mailBenchmarkSources, type BaselineMailIntegration } from "./benchmark-mail-source";

export interface MailBenchmarkOptions
{
    output: string;
    mode: "baseline" | "local" | "isolated";
    count: number;
    delayMs: number;
    baseline?: BaselineMailIntegration;
}

export async function runMailIntegrationBenchmark(options: MailBenchmarkOptions)
{
    const { output, mode, count, delayMs, baseline } = options;
    if (
        !output || !["baseline", "local", "isolated"].includes(mode ?? "")
        || !Number.isInteger(count)
        || count < 5
        || count > 20 || !Number.isInteger(delayMs) || delayMs < 0 || delayMs > 500
        || (mode === "baseline") !== Boolean(baseline)
    )
    {
        throw new Error(
            "Invalid mail benchmark mode, workload or baseline factory",
        );
    }
    initializeLogging("mail-integration-benchmark");
    const root = new URL("../../../", import.meta.url).pathname;
    const sources = await mailBenchmarkSources(root);
    const setupStart = performance.now();
    const h = await mailHarness();
    const children: Awaited<ReturnType<typeof startMailProcess>>[] = [];
    const local: { close(): Promise<void>; }[] = [];
    const observers = h.names.kingdoms.map((database) =>
        createDatabase("kingdom", { ...h.postgres.options, database, max: 1 })
    );
    try
    {
        await h.provision();
        for (const [index, kingdom] of h.kingdoms.entries())
        {
            await kingdom.pool.query(
                "INSERT INTO opencok_kingdom.userprofile (uid,name,country,level,exp,\"serverId\") VALUES ('owner','Synthetic','BR',1,0,$1)",
                [index + 1],
            );
            await kingdom.pool.query(
                "INSERT INTO opencok_kingdom.mail (uid,\"toUser\",\"fromUser\",contents,type,\"createTime\") VALUES ('mail','owner','peer','',20,1)",
            );
            const authority = await acquireRealmAuthority(kingdom.db, index + 1, () => true);
            fenceRealmDatabase(kingdom.db, authority);
        }
        await h.global.pool.query(
            "INSERT INTO opencok_chat.chat_mailbox_message (kingdom_id,owner_uid,message_id,peer_uid,chat_type,created_at,body) VALUES (1,'owner','one','peer',1,1,'synthetic'),(2,'owner','two','peer',1,1,'synthetic')",
        );
        const setupMs = performance.now() - setupStart;
        const hostLoadBefore = loadavg();
        const start = performance.now();
        for (const id of [1, 2])
        {
            if (baseline)
            {
                local.push(
                    await baseline.start(
                        h.kingdoms[id - 1]!.db,
                        h.global.db,
                        id,
                        h.config(id).chat!,
                    ),
                );
            }
            else if (mode === "local")
            {
                const worker = createRealmMailIntegrationWorker(
                    { kingdomId: id, timeoutMs: 5000, mailChat: h.config(id).chat },
                    h.kingdoms[id - 1]!.db,
                    h.global.db,
                )!;
                local.push(worker);
                await eventually(async () => worker.isReady());
            }
            else
            {
                const worker = await startMailProcess({ ...h.config(id, 5000), intervalMs: 5000 });
                children.push(worker);
                await eventually(async () =>
                    (await fetch(`http://127.0.0.1:${worker.port}/health/ready`)).status === 200
                );
            }
        }
        const workerStartMs = performance.now() - start;
        h.chat.control.delayMs = delayMs;
        for (const id of [1, 2])
        {
            for (let index = 0; index < count; index++)
            {
                await h.gift(id);
                await h.intent(id);
            }
        }
        const initialChildren = await Promise.all(children.map((worker) => worker.sample()));
        const metrics = h.kingdoms.map((db) => new BenchmarkDatabase(db.pool));
        const globalMetrics = new BenchmarkDatabase(h.global.pool);
        const cpuBefore = process.cpuUsage();
        const memoryBefore = process.memoryUsage();
        const lag = monitorEventLoopDelay({ resolution: 10 });
        lag.enable();
        const started = performance.now();
        let stopping = false;
        let peakTotalRss = memoryBefore.rss
            + initialChildren.reduce((sum, sample) => sum + sample.memory.rss, 0);
        let samplingFailure: unknown;
        const backlogMaximum = [0, 0];
        const oldestAgeMaximumMs = [0, 0];
        const producerPoolWaitMaximum = [0, 0];
        const workerConnectionsMaximum = [0, 0];
        const drainMs: (number | null)[] = [null, null];
        let foregroundComplete = false;
        const sample = (async () => {
            try
            {
                while (!stopping)
                {
                    for (const [index, observer] of observers.entries())
                    {
                        const row = (await observer.pool.query<
                            { pending: number; age: string | null; connections: number; }
                        >(
                            "SELECT (SELECT count(*)::int FROM opencok_kingdom.mail_chat_read_intent) AS pending, (SELECT min(\"requestedAt\")::text FROM opencok_kingdom.mail_chat_read_intent) AS age, (SELECT count(*)::int FROM pg_stat_activity WHERE usename=$1) AS connections",
                            [h.roles[index]!.kingdom],
                        )).rows[0]!;
                        backlogMaximum[index] = Math.max(backlogMaximum[index]!, row.pending);
                        oldestAgeMaximumMs[index] = Math.max(
                            oldestAgeMaximumMs[index]!,
                            row.age === null ? 0 : Math.max(0, Date.now() - Number(row.age)),
                        );
                        producerPoolWaitMaximum[index] = Math.max(
                            producerPoolWaitMaximum[index]!,
                            h.kingdoms[index]!.pool.waitingCount,
                        );
                        workerConnectionsMaximum[index] = Math.max(
                            workerConnectionsMaximum[index]!,
                            row.connections,
                        );
                        if (foregroundComplete && !row.pending && drainMs[index] === null)
                        {
                            drainMs[index] = performance.now() - started;
                        }
                    }
                    const snapshots = await Promise.all(children.map((worker) => worker.sample()));
                    peakTotalRss = Math.max(
                        peakTotalRss,
                        process.memoryUsage().rss
                            + snapshots.reduce((sum, snapshot) => sum + snapshot.memory.rss, 0),
                    );
                    await Bun.sleep(100);
                }
            }
            catch (error)
            {
                samplingFailure = error;
            }
        })();
        const commandMs: number[][] = [[], []];
        try
        {
            await eventually(
                async () => h.chat.deliveries.some((entry) => entry.kingdom === 1),
                20000,
            );
            const pendingAtForeground = await Promise.all(
                [1, 2].map((id) => h.pending(id, "chat")),
            );
            let next = 0;
            await Promise.all(Array.from({ length: 4 }, async () => {
                while (next < count * 2)
                {
                    const index = next++ % 2;
                    const before = performance.now();
                    const result = await markMailConversationRead(
                        h.kingdoms[index]!.db,
                        index + 1,
                        "owner",
                        mailConversationReadQuery({ fromUser: "peer" }, Date.now()),
                    );
                    commandMs[index]!.push(performance.now() - before);
                    assert.equal(result.profile?.uid, "owner");
                }
            }));
            foregroundComplete = true;
            await eventually(
                async () =>
                    (await Promise.all(
                        [1, 2].map(async (id) =>
                            await h.pending(id, "chat") === 0 && await h.pending(id, "gift") === 0
                        ),
                    )).every(Boolean),
                60000,
            );
            const wallMs = performance.now() - started;
            const cpu = process.cpuUsage(cpuBefore);
            const finalChildren = await Promise.all(children.map((worker) => worker.sample()));
            const childCpu = finalChildren.map((snapshot, index) => ({
                user: (snapshot.cpu.user - initialChildren[index]!.cpu.user) / 1000,
                system: (snapshot.cpu.system - initialChildren[index]!.cpu.system) / 1000,
            }));
            stopping = true;
            lag.disable();
            await sample;
            if (samplingFailure)
            {
                throw samplingFailure;
            }
            const receipts = (await h.global.pool.query<{ kingdom: number; count: number; }>(
                "SELECT kingdom_id AS kingdom,count(*)::int AS count FROM opencok_chat.chat_mailbox_receipt GROUP BY kingdom_id ORDER BY kingdom_id",
            )).rows;
            assert.deepEqual(receipts, [{ kingdom: 1, count: count * 2 }, {
                kingdom: 2,
                count: count * 2,
            }]);
            assert.equal(
                (await h.global.pool.query(
                    "SELECT count(*)::int AS count FROM opencok_global.mail_gift_log WHERE \"isOpened\"=1",
                )).rows[0].count,
                count * 2,
            );
            const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], { cwd: root });
            const report = {
                schemaVersion: 1,
                measuredAt: new Date().toISOString(),
                revision: revision.stdout.toString().trim(),
                sourceSha256: sources.sha256,
                sources: sources.files,
                baseline: baseline
                    ? {
                        revision: baseline.revision,
                        sourceSha256: baseline.sources.sha256,
                        sources: baseline.sources.files,
                        resolutions: baseline.resolutions,
                        runnerSha256: baseline.runnerSha256,
                    }
                    : undefined,
                scenarioSha256: createHash("sha256").update(JSON.stringify({
                    kingdoms: 2,
                    count,
                    delayMs,
                    pollMs: 5000,
                    concurrency: 4,
                    command: "fenced-mail-conversation-read",
                    gift: "global-opening-projection",
                    chat: "signed-mailbox-read-per-realm-key",
                })).digest("hex"),
                mode,
                environment: {
                    bun: Bun.version,
                    cpu: cpus()[0]?.model,
                    platform: process.platform,
                    architecture: process.arch,
                    logicalCpus: cpus().length,
                    hostLoadBefore,
                    hostLoadAfter: loadavg(),
                },
                fixture: {
                    kingdoms: 2,
                    initialChatIntentsPerRealm: count,
                    giftIntentsPerRealm: count,
                    foregroundCommandsPerRealm: count,
                    foregroundConcurrency: 4,
                    chatDelayRealm: 1,
                    chatDelayMs: delayMs,
                    pollMs: 5000,
                    producerPoolMaximumPerRealm: 4,
                    receiverGlobalPoolMaximum: 4,
                    isolatedWorkerPoolsPerRealm: { kingdom: 2, global: 1 },
                    observerPoolsPerRealm: 1,
                },
                setupMs,
                workerStartMs,
                wallMs,
                foreground: commandMs.map((samples, index) => ({
                    kingdom: index + 1,
                    latencyMs: distribution(samples),
                    pendingAtStart: pendingAtForeground[index],
                })),
                queues: {
                    backlogMaximum,
                    oldestAgeMaximumMs,
                    producerPoolWaitMaximum,
                    workerConnectionsMaximum,
                    observedDrainMs: drainMs.map((value) => value ?? wallMs),
                },
                cpuMs: {
                    parent: { user: cpu.user / 1000, system: cpu.system / 1000 },
                    workers: childCpu,
                    aggregate: (cpu.user + cpu.system) / 1000
                        + childCpu.reduce((sum, value) => sum + value.user + value.system, 0),
                },
                memoryBytes: {
                    parentBefore: memoryBefore,
                    parentAfter: process.memoryUsage(),
                    workersAfter: finalChildren.map((snapshot) => snapshot.memory),
                    sampledPeakAggregateRss: peakTotalRss,
                },
                eventLoopP99Ms: {
                    parent: lag.count ? lag.percentile(99) / 1000000 : null,
                    workers: finalChildren.map((snapshot) => snapshot.eventLoopP99Ms),
                },
                database: {
                    producers: metrics.map((metric) => metric.report()),
                    receiverGlobal: globalMetrics.report(),
                },
                behavior: { receipts, pending: [0, 0], openedGiftLogs: count * 2 },
                limitations: [
                    "Three supported modes share two synthetic realms in three databases on one disposable PostgreSQL server: archived parent relay modules/polling lifecycle, current local relays, and current isolated workers. Parent mode loads its original gift/Chat relay functions, publisher and PollingWorker; it reproduces the prior 50-intent composition loop with current fenced producer/receiver fixtures, not the complete historical application.",
                    "Foreground uses the actual fenced conversation-read repository and query policy, not TCP/native clients or the complete gateway. Chat uses the actual signed HTTP receiver and PostgreSQL deduplication store.",
                    "Realm-one Chat delay is asynchronous receiver latency; it does not emulate heavy JavaScript calculation or pause realm-two delivery. Closed-loop command latency excludes external arrival queues.",
                    "Baseline and local workers share producer pools and realm fencing. Isolated workers add dedicated bounded pools and processes without producer authority; pool budgets differ explicitly and timings cannot attribute benefit solely to process isolation.",
                    "Aggregate CPU/RSS includes the parent, receiver, measurement and isolated worker processes, excluding PostgreSQL/container costs. Startup/setup and seeding are outside the measured delivery window.",
                    "Worker event-loop histogram covers its lifetime after startup; parent histogram covers delivery. Hundred-millisecond queue/RSS/connection sampling and IPC add overhead and may miss short spikes.",
                    "SQL metrics cover parent pools only. Isolated worker SQL is not included in these totals; connection maxima describe kingdom credentials only. No exact lock-hold duration is inferred.",
                    "One fresh-process trial per invocation; compare repeated runs without treating small tail samples as SLOs or evidence of universal speedup.",
                    "This is a shared host; unrelated workloads are not controlled. Host load averages are recorded and interleaved repetitions retain scheduling noise.",
                ],
            };
            await Bun.write(resolve(output), `${JSON.stringify(report, null, 2)}\n`);
            console.log(`Mail integration benchmark saved to ${resolve(output)}`);
        }
        finally
        {
            stopping = true;
            lag.disable();
            await sample;
            for (const metric of metrics)
            {
                metric.close();
            }
            globalMetrics.close();
        }
    }
    finally
    {
        try
        {
            await Promise.all([
                ...local.map((worker) => worker.close()),
                ...children.map((worker) => worker.close()),
            ]);
        }
        finally
        {
            await Promise.all(observers.map((observer) => observer.close()));
            await h.close();
        }
    }
}
