import assert from "node:assert/strict";
import { cpus, totalmem } from "node:os";
import { resolve } from "node:path";
import { benchmarkScenario } from "./benchmark-scenario";

const output = process.argv[2];
const count = Number(process.argv[3] ?? 100);

if (!output || !Number.isInteger(count) || count < 10 || count > 1000)
{
    throw new Error("Usage: benchmark-realm-production.ts /tmp/report.json [10..1000 operations]");
}

const importMemoryBefore = process.memoryUsage();
const importStarted = performance.now();
const { cityHarness } = await import("../integration/support/city");
const { sfs, encode } = await import("@opencok/messages/sfs");
const { createDatabase } = await import("@opencok/drizzle");
const { initializeLogging } = await import("@opencok/core/logging");
initializeLogging("realm-production-benchmark");
const importMs = performance.now() - importStarted;
const importMemoryAfter = process.memoryUsage();
const setupStarted = performance.now();
const h = await cityHarness();
const setupMs = performance.now() - setupStarted;
const afterSetup = process.memoryUsage();
const observer = createDatabase("kingdom", { ...h.connection, max: 1 });

try
{
    const state = async () => {
        const resources = await h.db.pool.query(
            "SELECT uid, wood::text, food::text FROM opencok_kingdom.user_resource ORDER BY uid",
        );
        const accounts = await h.db.pool.query(
            "SELECT \"buildingId\", amount::text, remainder::text, \"settledAt\"::text "
                + "FROM opencok_kingdom.building_production ORDER BY \"buildingId\"",
        );
        const receipts = await h.db.pool.query(
            "SELECT count(*)::int AS total, "
                + "count(*) FILTER (WHERE command = 'build.collect')::int AS collections, "
                + "count(*) FILTER (WHERE command = 'production.settle')::int AS settlements "
                + "FROM opencok_kingdom.command_receipt",
        );

        return {
            resources: resources.rows,
            accounts: accounts.rows,
            receipts: receipts.rows[0] as {
                total: number;
                collections: number;
                settlements: number;
            },
        };
    };
    const collect = (owner: string, operationId: string) =>
        h.production.command(owner, "build.collect", {
            uuid: sfs.string(`${owner}-413000`),
            operationId: sfs.string(operationId),
        });
    const scenarios: Awaited<ReturnType<typeof benchmarkScenario>>[] = [];
    const run = async (
        name: string,
        operations: readonly (() => Promise<unknown>)[],
        concurrency: number,
    ) => {
        scenarios.push(
            await benchmarkScenario(name, h.db.pool, observer.pool, operations, concurrency),
        );
    };

    for (const owner of ["owner", "other"])
    {
        await h.production.command(owner, "production.settle", {
            operationId: sfs.string(`warmup:${owner}`),
        });
    }
    const before = await state();
    await run(
        "collect-sequential",
        Array.from({ length: count }, (_, index) => async () => {
            h.clock.now += 60000;
            await collect("owner", `sequential:${index}`);
        }),
        1,
    );
    const afterSequential = await state();
    assert.equal(afterSequential.receipts.collections - before.receipts.collections, count);
    assert(BigInt(afterSequential.resources[1].wood) > BigInt(before.resources[1].wood));

    h.clock.now += 3600000;
    await run(
        "collect-one-owner-contention",
        Array.from({ length: count }, (_, index) => () => collect("owner", `contended:${index}`)),
        16,
    );
    const afterContended = await state();
    assert.equal(afterContended.receipts.collections - afterSequential.receipts.collections, count);

    h.clock.now += 3600000;
    await run(
        "collect-two-owner-contention",
        Array.from(
            { length: count },
            (_, index) => () => collect(index % 2 ? "owner" : "other", `two-owner:${index}`),
        ),
        16,
    );
    const afterTwoOwners = await state();
    assert.equal(afterTwoOwners.receipts.collections - afterContended.receipts.collections, count);

    const original = await collect("owner", "replay:stable");
    const expectedBody = encode(original.body);
    const beforeReplay = await state();
    await run(
        "collect-receipt-replay",
        Array.from({ length: count }, () => async () => {
            const replay = await collect("owner", "replay:stable");
            assert.deepEqual(encode(replay.body), expectedBody);
        }),
        16,
    );
    assert.deepEqual(await state(), beforeReplay);

    h.clock.now += 7 * 24 * 3600000;
    await run(
        "production-seven-day-catch-up",
        ["owner", "other"].map((owner) => () =>
            h.production.command(owner, "production.settle", {
                operationId: sfs.string(`catchup:${owner}`),
            })
        ),
        2,
    );
    const afterCatchup = await state();
    assert.equal(afterCatchup.receipts.settlements - beforeReplay.receipts.settlements, 2);
    assert(afterCatchup.accounts.length > 0);
    assert(
        afterCatchup.accounts.every((account) => BigInt(account.settledAt) === BigInt(h.clock.now)),
    );
    assert.deepEqual(afterCatchup.resources, beforeReplay.resources);

    const revision = Bun.spawnSync(["git", "rev-parse", "HEAD"], {
        cwd: new URL("../../../", import.meta.url).pathname,
    });
    assert.equal(revision.exitCode, 0);
    const status = Bun.spawnSync(["git", "status", "--porcelain"], {
        cwd: new URL("../../../", import.meta.url).pathname,
    });
    assert.equal(status.exitCode, 0);
    const report = {
        schemaVersion: 1,
        measuredAt: new Date().toISOString(),
        revision: revision.stdout.toString().trim(),
        workingTreeDirty: status.stdout.length > 0,
        environment: {
            bun: Bun.version,
            platform: process.platform,
            architecture: process.arch,
            cpuModel: cpus()[0]?.model,
            logicalCpus: cpus().length,
            hostMemoryBytes: totalmem(),
            postgresImage: "postgres:17.11-bookworm",
        },
        fixture: {
            owners: 2,
            kingdom: 1,
            poolMaximum: 8,
            observerPoolMaximum: 1,
            commandsPerScenario: count,
            warmupOperations: 2,
            source: "apps/server/integration/support/city.ts",
            worldEffects: "empty synthetic map",
            emperorEffects: null,
            targetQuests: "disabled by city fixture",
            logging: "structured stdout, 100 percent sampling, no telemetry exporter",
        },
        initialization: {
            importMs,
            importMemoryBefore,
            importMemoryAfter,
            setupMs,
            afterSetup,
        },
        scenarios,
        behavior: {
            uniqueCollectionReceipts: count * 3,
            replayBodyBytesEqual: true,
            replayPreservesResourcesAccountsAndReceipts: true,
            catchupAccountsSettledAtSyntheticClock: true,
            catchupDoesNotCollectResources: true,
        },
        limitations: [
            "In-process Services and real PostgreSQL; excludes TCP/SFS transport and native clients.",
            "Closed-loop fixed concurrency; latency starts at invocation, not external arrival.",
            "CPU and RSS describe this Bun process including measurement, not PostgreSQL or a deployed realm.",
            "Import measures city harness modules in this fresh process, not full realm startup or isolated catalog cost.",
            "Pool acquisition includes connection establishment; statement time includes network/client overhead.",
            "Lock and pool-queue samples may miss brief waits; lock duration is not measured.",
            "Ten-millisecond event-loop histogram and sampling add overhead; RSS peak is sampled.",
            "Catch-up has two operations; its tail percentiles are descriptive maxima, not an SLO estimate.",
            "No independent-trial confidence interval, restart, world jobs, combat or cross-realm coverage.",
        ],
    };
    await Bun.write(resolve(output), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Synthetic production baseline saved to ${resolve(output)}`);
}
finally
{
    try
    {
        await observer.close();
    }
    finally
    {
        await h.close();
    }
}
