import assert from "node:assert/strict";
import { cpus, totalmem } from "node:os";
import { resolve } from "node:path";
import { populationScenario } from "./benchmark-world-population-scenario";
import { populationSource } from "./benchmark-world-population-source";

const output = process.argv[2];
const pages = Number(process.argv[3] ?? 4);
if (!output || !Number.isInteger(pages) || pages < 1 || pages > 8)
{
    throw new Error(
        "Usage: benchmark-world-population.ts /tmp/report.json [1..8 backlog pages] [snapshot revision]",
    );
}
const importStarted = performance.now();
const importMemoryBefore = process.memoryUsage();
const { populationFixture } = await import("./benchmark-world-population-fixture");
const { createDatabase } = await import("@opencok/drizzle");
const { initializeLogging } = await import("@opencok/core/logging");
initializeLogging("world-population-benchmark");
const importMs = performance.now() - importStarted;
const importMemoryAfter = process.memoryUsage();
const setupStarted = performance.now();
const h = await populationFixture(pages);
const setupMs = performance.now() - setupStarted;
const observer = createDatabase("kingdom", { ...h.connection, max: 1 });
try
{
    const scenarios = [];
    const tick = async (backlog: boolean, contended: boolean) => {
        const work = await h.reset(backlog);
        const before = await h.state();
        const operations: (() => Promise<unknown>)[] = [];
        for (let index = 0; index < pages; index++)
        {
            operations.push(() => work(h.now));
            if (contended)
            {
                operations.push(async () => {
                    const client = await h.db.pool.connect();
                    try
                    {
                        await client.query("BEGIN");
                        await client.query("SELECT pg_advisory_xact_lock(728214, 0)");
                        await client.query("SELECT pg_sleep(0.005)");
                        await client.query("COMMIT");
                    }
                    catch (error)
                    {
                        await client.query("ROLLBACK");
                        throw error;
                    }
                    finally
                    {
                        client.release();
                    }
                });
            }
        }
        const result = await populationScenario(
            contended ? "expiry-with-world-lock-contender" : backlog ? "expiry-backlog" : "idle",
            h.db.pool,
            observer.pool,
            operations,
            contended ? 2 : 1,
        );
        const after = await h.state();
        assert.deepEqual(after.points, [{ type: 0, count: h.size ** 2 }]);
        assert.equal(after.tickets, 0);
        assert.equal(after.outbox, backlog ? pages * 3 : 0);
        assert.equal(result.worldLock.unfinished, 0);
        assert.equal(result.worldLock.commits, pages * (contended ? 4 : 3));
        scenarios.push({ ...result, before, after });
    };
    await tick(false, false);
    await tick(true, false);
    await tick(true, true);
    for (const blocked of [false, true])
    {
        const work = await h.generation(blocked);
        const before = await h.state();
        const result = await populationScenario(
            blocked ? "generation-blocked" : "generation-free",
            h.db.pool,
            observer.pool,
            Array.from({ length: 4 }, () => () => work(h.now)),
            1,
        );
        const after = await h.state();
        assert.deepEqual(
            after.points,
            blocked
                ? [{ type: 0, count: h.size ** 2 }]
                : [{ type: 0, count: h.size ** 2 - 140 }, { type: 3, count: 40 }, {
                    type: 9,
                    count: 100,
                }],
        );
        assert.equal(after.tickets, 0);
        assert.equal(result.worldLock.unfinished, 0);
        scenarios.push({ ...result, before, after });
    }
    const report = {
        schemaVersion: 1,
        measuredAt: new Date().toISOString(),
        source: await populationSource(output, process.argv[4]),
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
            kingdom: 1,
            mapSize: h.size,
            expiryPages: pages,
            expiryPerFamilyPerPage: 64,
            sharedCellsPerNode: 4,
            timestamp: String(h.now),
            poolMaximum: 8,
            observerPoolMaximum: 1,
            contenderHoldSeconds: 0.005,
            generationTicks: 4,
            generationResourceQuota: 40,
            generationMonsterQuota: 100,
            randomCallback: "always zero",
            worldEffects: "empty map",
        },
        initialization: { importMs, importMemoryBefore, importMemoryAfter, setupMs },
        scenarios,
        limitations: [
            "Real three-family executors and PostgreSQL; synthetic 64x64 realm, no network/native clients, other jobs or two-realm isolation.",
            "Expiry is deterministic with future realm opening and closed shared-resource event; generation exercises normal resources and field monsters, not all families or shared-resource spawning.",
            "JavaScript RNG is fixed; SQL ORDER BY random() and generated UUIDs are unchanged. Generation verifies counts and quotas, not identical selected cells or bytes.",
            "Closed-loop operations start at invocation, excluding external arrival queues. Contender is a synthetic transaction with five milliseconds pg_sleep under the real world lock, not a player command.",
            "Lock acquisition is client query round-trip including server execution and transport, not exact server wait. Observed hold runs from successful acquisition response through COMMIT/ROLLBACK response, excluding acquisition-response transit.",
            "CPU/RSS cover the Bun process and instrumentation, excluding PostgreSQL; aggregate SQL time is not pure database CPU and cannot be subtracted to derive JavaScript CPU.",
            "Ten-millisecond lag, RSS and waiter sampling may miss spikes and adds overhead. Reset/seeding/checks are outside measured scenarios; imports/setup are separate.",
            "One trial per scenario; small samples and generation warmup/progression make tail percentiles descriptive maxima, not SLOs or evidence for worker isolation.",
        ],
    };
    await Bun.write(resolve(output), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`World population benchmark saved to ${resolve(output)}`);
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
