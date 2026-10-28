import { createHash, randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { mkdir, readFile } from "node:fs/promises";
import { and, eq } from "drizzle-orm";
import { sfs } from "@opencok/messages/sfs";
import { timed_activity } from "@opencok/drizzle/schema/opencok_kingdom/timed_activity";
import { schedulerHarness } from "../integration/support/fixture";
import type { ProcessSample } from "../integration/support/process";

export enum DiscoveryBenchmarkMode
{
    Baseline = "baseline",
    Local = "local",
    Isolated = "isolated",
}

export interface DiscoveryBenchmarkOptions
{
    mode: DiscoveryBenchmarkMode;
    output: string;
    count: number;
    foreground: number;
    ownerPath?: string;
    baselineRoot?: string;
}

function percentile(values: readonly number[], fraction: number): number
{
    const ordered = [...values].sort((a, b) => a - b);
    return ordered[Math.min(ordered.length - 1, Math.floor(ordered.length * fraction))] ?? 0;
}

async function sourceManifest(root: string, paths: readonly string[])
{
    return Promise.all(paths.map(async (path) => ({
        path,
        sha256: createHash("sha256").update(await readFile(resolve(root, path))).digest("hex"),
    })));
}

export async function runDiscoveryBenchmark(options: DiscoveryBenchmarkOptions)
{
    if (
        !Object.values(DiscoveryBenchmarkMode).includes(options.mode)
        || !Number.isInteger(options.count) || options.count < 65 || options.count > 256
        || !Number.isInteger(options.foreground) || options.foreground < 1
        || options.foreground > 1000
        || (options.mode === DiscoveryBenchmarkMode.Baseline
            && (!options.ownerPath || !options.baselineRoot))
    )
    {
        throw new Error("Invalid discovery benchmark configuration");
    }
    const root = new URL("../../../", import.meta.url).pathname;
    const output = resolve(options.output);
    await mkdir(output, { recursive: true });
    const sources = await sourceManifest(root, [
        "apps/scheduler/scripts/benchmark-discovery.ts",
        "apps/scheduler/integration/support/fixture.ts",
        "apps/scheduler/integration/support/owner-worker.ts",
        "apps/scheduler/integration/support/scheduler-worker.ts",
        "apps/scheduler/src/composition.ts",
        "apps/server/src/activity-recovery-job.ts",
        "apps/server/src/composition/activity-deadlines.ts",
        "packages/queues/src/services/discovery.ts",
        "packages/queues/src/repositories/discovery.ts",
        "packages/services/src/timed-activity.ts",
        "packages/repositories/src/timed-activity.ts",
    ]);
    const baseline = options.baselineRoot
        ? await sourceManifest(options.baselineRoot, [
            "apps/server/src/activity-recovery-job.ts",
            "packages/repositories/src/timed-activity.ts",
        ])
        : null;
    const adapter = options.ownerPath
        ? {
            sha256: createHash("sha256").update(await readFile(options.ownerPath)).digest("hex"),
            source: await readFile(options.ownerPath, "utf8"),
        }
        : null;
    const h = await schedulerHarness(options.ownerPath);
    const rows: { realm: number; id: string; owner: string; dueAt: bigint; }[] = [];
    const commandLatencies: number[] = [];
    const completionLatencies: number[] = [];
    const sweeps: { realm: number; durationMs: number; status: unknown; }[] = [];
    const samples: { atMs: number; owner: ProcessSample[]; scheduler: ProcessSample[]; }[] = [];
    try
    {
        await h.startOwner(1, true, 1000000);
        await h.startOwner(2, true, 1000000);
        await h.provision();
        for (const realm of [1, 2])
        {
            for (let offset = 0; offset < options.count; offset += 4)
            {
                await Promise.all(
                    Array.from(
                        { length: Math.min(4, options.count - offset) },
                        async (_, within) => {
                            const owner = `bench-${String(offset + within).padStart(3, "0")}`;
                            await h.seedOwner(realm, owner, 1000000);
                            await h.command(realm, "build.upgrade", {
                                uuid: sfs.string(`${owner}-413000`),
                                gold: sfs.int(0),
                                operationId: sfs.string(`start-${owner}`),
                            }, owner);
                            const row = await h.active(realm, 0, owner);
                            rows.push({ realm, id: row.id, owner, dueAt: row.dueAt });
                        },
                    ),
                );
            }
            await h.seedOwner(realm, "foreground", 1000000);
        }
        const clock = Math.max(...rows.map(row => Number(row.dueAt))) + 3600000;
        const schedulers = options.mode === DiscoveryBenchmarkMode.Isolated
            ? [await h.startScheduler(1, false), await h.startScheduler(2, false)]
            : [];
        const before = {
            owner: await Promise.all([h.owner(1).sample(), h.owner(2).sample()]),
            scheduler: await Promise.all(schedulers.map(child => child.sample())),
        };
        await Promise.all([
            h.owner(1).request("clock", { now: clock }),
            h.owner(2).request("clock", { now: clock }),
        ]);
        const started = performance.now();
        let finished = false;
        const completed = new Set<string>();
        const sample = async () =>
            samples.push({
                atMs: performance.now() - started,
                owner: await Promise.all([h.owner(1).sample(), h.owner(2).sample()]),
                scheduler: await Promise.all(schedulers.map(child => child.sample())),
            });
        const monitor = async () => {
            while (!finished)
            {
                for (const realm of [1, 2])
                {
                    const result = await h.kingdoms[realm - 1]!.pool.query(
                        `SELECT id FROM opencok_kingdom.timed_activity WHERE status=1 AND "ownerId" LIKE 'bench-%'`,
                    );
                    for (const row of result.rows)
                    {
                        const key = `${realm}:${row.id}`;
                        if (!completed.has(key))
                        {
                            completed.add(key);
                            completionLatencies.push(performance.now() - started);
                        }
                    }
                }
                if (samples.length < 1 || performance.now() - started - samples.at(-1)!.atMs > 250)
                {
                    await sample();
                }
                await Bun.sleep(20);
            }
        };
        const foreground = async (realm: number) => {
            for (let index = 0; index < options.foreground; index++)
            {
                const at = performance.now();
                await h.command(realm, "build.move", {
                    pos1: sfs.int(index % 2 === 0 ? 17 : 20),
                    pos2: sfs.int(index % 2 === 0 ? 20 : 17),
                    gold: sfs.int(1),
                    operationId: sfs.string(`move-${index}-${randomUUID()}`),
                }, "foreground");
                commandLatencies.push(performance.now() - at);
                await Bun.sleep(20);
            }
        };
        const dispatch = async (realm: number) => {
            for (let pass = 0; pass < 32; pass++)
            {
                const at = performance.now();
                const status = await (options.mode === DiscoveryBenchmarkMode.Isolated
                    ? schedulers[realm - 1]!.request("run")
                    : h.owner(realm).request("run"));
                sweeps.push({ realm, durationMs: performance.now() - at, status });
                const count = await h.kingdoms[realm - 1]!.db.select({ id: timed_activity.id })
                    .from(timed_activity).where(
                        and(eq(timed_activity.status, 0), eq(timed_activity.type, 0)),
                    );
                if (!count.length)
                {
                    return;
                }
                await Bun.sleep(100);
            }
            throw new Error("Synthetic discovery backlog did not drain");
        };
        const monitoring = monitor();
        try
        {
            await Promise.all([dispatch(1), dispatch(2), foreground(1), foreground(2)]);
            while (completed.size < rows.length)
            {
                if (performance.now() - started > 120000)
                {
                    throw new Error("Synthetic completion monitoring timed out");
                }
                await Bun.sleep(20);
            }
        }
        finally
        {
            finished = true;
            await monitoring;
        }
        const elapsedMs = performance.now() - started;
        const after = {
            owner: await Promise.all([h.owner(1).sample(), h.owner(2).sample()]),
            scheduler: await Promise.all(schedulers.map(child => child.sample())),
        };
        const outcomes: unknown[] = [];
        for (const realm of [1, 2])
        {
            const result = await h.kingdoms[realm - 1]!.pool.query(
                `SELECT a."ownerId",a.type,a.status,a.version,a."startedAt"::text,a."dueAt"::text,b.level,b."opType",r."lastUpdateTime"::text,r.wood::text,r.food::text,p."settledAt"::text,(SELECT count(*)::integer FROM opencok_kingdom.command_receipt c WHERE c."ownerUid"=a."ownerId" AND c."requestId" LIKE 'finish:%') AS receipts FROM opencok_kingdom.timed_activity a JOIN opencok_kingdom.user_building b ON b.uuid=a."itemId" JOIN opencok_kingdom.user_resource r ON r.uid=a."ownerId" LEFT JOIN opencok_kingdom.building_production p ON p."buildingId"=b.uuid WHERE a."ownerId" LIKE 'bench-%' ORDER BY a."ownerId"`,
            );
            if (
                result.rows.length !== options.count
                || result.rows.some(row =>
                    row.status !== 1 || row.level !== 2 || row.opType !== 0 || row.receipts !== 1
                    || row.lastUpdateTime !== row.dueAt || row.settledAt !== row.dueAt
                )
            )
            {
                throw new Error("Synthetic discovery outcome or checkpoint mismatch");
            }
            outcomes.push({ realm, rows: result.rows });
        }
        const cpu = (group: keyof typeof before) =>
            after[group].reduce(
                (sum, row, index) =>
                    sum + row.cpu.user + row.cpu.system - before[group][index]!.cpu.user
                    - before[group][index]!.cpu.system,
                0,
            ) / 1000;
        const result = {
            mode: options.mode,
            countPerRealm: options.count,
            foregroundPerRealm: options.foreground,
            scope:
                "Phase-gated overdue construction recovery with current real owner composition; parent mode replaces only RecoveryJob and selectors. PostgreSQL and parent controller resource usage excluded.",
            logicalOwnerClock: clock,
            pollGateMs: 100,
            batchSize: 64,
            isolatedOwnerBudget: 4,
            elapsedMs,
            command: {
                count: commandLatencies.length,
                p50Ms: percentile(commandLatencies, .5),
                p95Ms: percentile(commandLatencies, .95),
                p99Ms: percentile(commandLatencies, .99),
            },
            completion: {
                count: completionLatencies.length,
                p50Ms: percentile(completionLatencies, .5),
                p95Ms: percentile(completionLatencies, .95),
                p99Ms: percentile(completionLatencies, .99),
            },
            cpuMs: { owner: cpu("owner"), scheduler: cpu("scheduler") },
            peakRssBytes: {
                owner: Math.max(
                    ...samples.map(row =>
                        row.owner.reduce((sum, entry) => sum + entry.memory.rss, 0)
                    ),
                ),
                scheduler: Math.max(
                    0,
                    ...samples.map(row =>
                        row.scheduler.reduce((sum, entry) => sum + entry.memory.rss, 0)
                    ),
                ),
            },
            outcomeSha256: createHash("sha256").update(JSON.stringify(outcomes)).digest("hex"),
            sources,
            baseline,
            adapter,
            before,
            after,
            samples,
            sweeps,
            outcomes,
            commandLatencies,
            completionLatencies,
        };
        await Bun.write(resolve(output, "result.json"), JSON.stringify(result, null, 2));
        process.stdout.write(
            JSON.stringify({
                mode: options.mode,
                output,
                elapsedMs,
                outcomeSha256: result.outcomeSha256,
            }) + "\n",
        );
        return result;
    }
    finally
    {
        await h.close();
    }
}

if (import.meta.main)
{
    const mode = process.argv[2];
    if (mode !== DiscoveryBenchmarkMode.Local && mode !== DiscoveryBenchmarkMode.Isolated)
    {
        throw new Error("Expected local or isolated benchmark mode");
    }
    await runDiscoveryBenchmark({
        mode,
        output: process.argv[3] ?? "/tmp/opencok-scheduler-benchmark",
        count: Number(process.argv[4] ?? 80),
        foreground: Number(process.argv[5] ?? 30),
    });
}
