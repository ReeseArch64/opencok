import { expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
import { BenchmarkWorldLocks } from "../scripts/benchmark-world-locks";
import { populationScenario } from "../scripts/benchmark-world-population-scenario";

test(
    "world lock measurements distinguish commit and rollback and restore instrumentation after workload failure",
    async () => {
        const postgres = new DisposablePostgres();
        const admin = await postgres.start();
        await admin.end();
        const db = createDatabase("kingdom", { ...postgres.options, database: "postgres", max: 1 });
        const observer = createDatabase("kingdom", {
            ...postgres.options,
            database: "postgres",
            max: 1,
        });
        try
        {
            const originalConnect = db.pool.connect;
            const originalListeners = db.pool.listenerCount("acquire");
            const originalClient = await db.pool.connect();
            const originalQuery = originalClient.query;
            originalClient.release();
            const metrics = new BenchmarkWorldLocks(db.pool);
            try
            {
                const client = await db.pool.connect();
                try
                {
                    await client.query("BEGIN");
                    await client.query({ text: "SELECT pg_advisory_xact_lock(728214,0)" });
                    await client.query("SELECT pg_sleep(0.02)");
                    await client.query("COMMIT");
                    await client.query("BEGIN");
                    await new Promise<void>((resolve, reject) => {
                        client.query(
                            "SELECT pg_advisory_xact_lock(728214, 0)",
                            (error) => error ? reject(error) : resolve(),
                        );
                    });
                    await expect(client.query("SELECT 1 / 0")).rejects.toThrow();
                    await client.query("ROLLBACK");
                    const report = metrics.report();
                    expect(report.commits).toBe(1);
                    expect(report.rollbacks).toBe(1);
                    expect(report.unfinished).toBe(0);
                    expect(report.acquisitionRoundTripMs.count).toBe(2);
                    expect(report.observedHoldMs.count).toBe(2);
                    expect(report.observedHoldMs.max).toBeGreaterThanOrEqual(15);
                }
                finally
                {
                    client.release();
                }
            }
            finally
            {
                metrics.close();
            }
            expect(originalClient.query).toBe(originalQuery);
            expect(db.pool.listenerCount("acquire")).toBe(originalListeners);
            await expect(
                populationScenario("rollback-failure", db.pool, observer.pool, [async () => {
                    const client = await db.pool.connect();
                    try
                    {
                        await client.query("BEGIN");
                        await client.query("SELECT pg_advisory_xact_lock(728214, 0)");
                        await client.query("SELECT 1 / 0");
                    }
                    finally
                    {
                        await client.query("ROLLBACK");
                        client.release();
                    }
                }], 1),
            ).rejects.toThrow("1 of 1 operations failed");
            expect(db.pool.connect).toBe(originalConnect);
            expect(originalClient.query).toBe(originalQuery);
            expect(db.pool.listenerCount("acquire")).toBe(originalListeners);
            const lock = await observer.pool.query<{ available: boolean; }>(
                "SELECT pg_try_advisory_xact_lock(728214, 0) AS available",
            );
            expect(lock.rows[0]!.available).toBe(true);
            expect((await db.pool.query("SELECT 1 AS value")).rows[0].value).toBe(1);
        }
        finally
        {
            await Promise.all([db.close(), observer.close()]);
            await postgres.stop();
        }
    },
    60000,
);
