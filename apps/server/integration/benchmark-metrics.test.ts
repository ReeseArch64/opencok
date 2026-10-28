import { expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
import { BenchmarkDatabase } from "../scripts/benchmark-database";
import { benchmarkScenario } from "../scripts/benchmark-scenario";
import { distribution } from "../scripts/benchmark-distribution";

test("benchmark distributions retain empty samples and nearest-rank tail observations", () => {
    expect(distribution([])).toEqual({
        count: 0,
        total: 0,
        p50: null,
        p95: null,
        p99: null,
        max: null,
    });
    const samples = Array.from({ length: 100 }, (_, index) => 100 - index);
    expect(distribution(samples)).toEqual({
        count: 100,
        total: 5050,
        p50: 50,
        p95: 95,
        p99: 99,
        max: 100,
    });
    expect(samples[0]).toBe(100);
});

test(
    "benchmark instrumentation measures real statements, callbacks, pool queues and locks",
    async () => {
        const postgres = new DisposablePostgres();
        const admin = await postgres.start();
        await admin.end();
        const db = createDatabase("kingdom", { ...postgres.options, database: "postgres", max: 2 });
        const observer = createDatabase("kingdom", {
            ...postgres.options,
            database: "postgres",
            max: 1,
        });

        try
        {
            const originalConnect = db.pool.connect;
            const metrics = new BenchmarkDatabase(db.pool);
            try
            {
                await db.pool.query("SELECT 1");
                const client = await db.pool.connect();
                try
                {
                    await new Promise<void>((resolve, reject) => {
                        client.query("SELECT 2", (error) => error ? reject(error) : resolve());
                    });
                    await expect(client.query("SELECT 1 / 0")).rejects.toThrow();
                }
                finally
                {
                    client.release();
                }
                const measured = metrics.report();
                expect(measured.statementRoundTripMs.count).toBe(3);
                expect(measured.poolAcquireMs.count).toBe(2);
                expect(measured.statementFailures).toBe(1);
                expect(measured.acquisitionFailures).toBe(0);
            }
            finally
            {
                metrics.close();
            }
            expect(db.pool.connect).toBe(originalConnect);
            await db.pool.query("SELECT 3");
            expect(metrics.report().statementRoundTripMs.count).toBe(3);

            const result = await benchmarkScenario(
                "synthetic-lock-contention",
                db.pool,
                observer.pool,
                Array.from({ length: 8 }, () => async () => {
                    const client = await db.pool.connect();
                    try
                    {
                        await client.query("BEGIN");
                        await client.query("SELECT pg_advisory_xact_lock(558)");
                        await client.query("SELECT pg_sleep(0.03)");
                        await client.query("COMMIT");
                    }
                    finally
                    {
                        client.release();
                    }
                }),
                8,
            );
            expect(result.database.statementRoundTripMs.count).toBe(32);
            expect(result.database.poolAcquireMs.count).toBe(8);
            expect(result.database.statementFailures).toBe(0);
            expect(result.sampling.samplesWithLockWaiters).toBeGreaterThan(0);
            expect(result.sampling.maximumPoolWaiting).toBeGreaterThan(0);
            expect(result.operationMs.count).toBe(8);
            expect(db.pool.connect).toBe(originalConnect);

            await expect(
                benchmarkScenario("failed-operation", db.pool, observer.pool, [async () => {
                    throw new Error("Synthetic operation failed");
                }], 1),
            ).rejects.toThrow("1 of 1 operations failed");
            expect(db.pool.connect).toBe(originalConnect);
            await expect(
                benchmarkScenario(
                    "invalid-concurrency",
                    db.pool,
                    observer.pool,
                    [async () => {}],
                    0,
                ),
            )
                .rejects.toThrow("positive integer concurrency");
        }
        finally
        {
            await Promise.all([db.close(), observer.close()]);
            await postgres.stop();
        }
    },
    60000,
);
