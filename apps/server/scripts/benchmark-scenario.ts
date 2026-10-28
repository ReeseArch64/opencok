import { monitorEventLoopDelay } from "node:perf_hooks";
import type { createDatabase } from "@opencok/drizzle";
import { BenchmarkDatabase } from "./benchmark-database";
import { distribution } from "./benchmark-distribution";

type DatabasePool = ReturnType<typeof createDatabase>["pool"];

export async function benchmarkScenario(
    name: string,
    pool: DatabasePool,
    observer: DatabasePool,
    operations: readonly (() => Promise<unknown>)[],
    concurrency: number,
)
{
    if (!Number.isInteger(concurrency) || concurrency < 1 || operations.length === 0)
    {
        throw new Error("A scenario requires operations and positive integer concurrency");
    }

    const database = new BenchmarkDatabase(pool);
    const lag = monitorEventLoopDelay({ resolution: 10 });
    const samples: number[] = [];
    const cpuBefore = process.cpuUsage();
    const memoryBefore = process.memoryUsage();
    let peakRss = memoryBefore.rss;
    let maximumPoolWaiting = 0;
    let lockSamples = 0;
    let samplesWithLockWaiters = 0;
    let maximumLockWaiters = 0;
    let stopped = false;
    let next = 0;
    let failed = 0;
    let samplingFailure: unknown;
    lag.enable();
    const sampling = (async () => {
        try
        {
            while (!stopped)
            {
                peakRss = Math.max(peakRss, process.memoryUsage().rss);
                maximumPoolWaiting = Math.max(maximumPoolWaiting, pool.waitingCount);
                const result = await observer.query(
                    "SELECT count(*)::int AS waiting FROM pg_stat_activity "
                        + "WHERE datname = current_database() AND pid <> pg_backend_pid() "
                        + "AND backend_type = 'client backend' AND wait_event_type = 'Lock'",
                );
                const waiting = Number(result.rows[0]!.waiting);
                lockSamples++;
                samplesWithLockWaiters += Number(waiting > 0);
                maximumLockWaiters = Math.max(maximumLockWaiters, waiting);
                await Bun.sleep(10);
            }
        }
        catch (error)
        {
            samplingFailure = error;
        }
    })();
    const started = performance.now();

    try
    {
        await Promise.all(
            Array.from({ length: Math.min(concurrency, operations.length) }, async () => {
                while (next < operations.length)
                {
                    const operation = operations[next++]!;
                    const start = performance.now();
                    try
                    {
                        await operation();
                    }
                    catch
                    {
                        failed++;
                    }
                    finally
                    {
                        samples.push(performance.now() - start);
                    }
                }
            }),
        );
        const wallMs = performance.now() - started;
        const cpu = process.cpuUsage(cpuBefore);
        const memoryAfter = process.memoryUsage();
        peakRss = Math.max(peakRss, memoryAfter.rss);
        stopped = true;
        lag.disable();
        await sampling;
        if (samplingFailure)
        {
            throw samplingFailure;
        }
        if (failed)
        {
            throw new Error(`${name}: ${failed} of ${operations.length} operations failed`);
        }

        return {
            name,
            concurrency,
            operations: operations.length,
            wallMs,
            operationsPerSecond: operations.length * 1000 / wallMs,
            operationMs: distribution(samples),
            cpuMs: { user: cpu.user / 1000, system: cpu.system / 1000 },
            memoryBytes: { before: memoryBefore, after: memoryAfter, sampledPeakRss: peakRss },
            eventLoopDelayMs: {
                count: lag.count,
                p95: lag.count ? lag.percentile(95) / 1000000 : null,
                p99: lag.count ? lag.percentile(99) / 1000000 : null,
                max: lag.count ? lag.max / 1000000 : null,
            },
            database: database.report(),
            sampling: {
                minimumIntervalMs: 10,
                lockSamples,
                samplesWithLockWaiters,
                maximumLockWaiters,
                maximumPoolWaiting,
            },
        };
    }
    finally
    {
        stopped = true;
        lag.disable();
        await sampling;
        database.close();
    }
}
