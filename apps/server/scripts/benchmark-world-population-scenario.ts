import type { createDatabase } from "@opencok/drizzle";
import { benchmarkScenario } from "./benchmark-scenario";
import { BenchmarkWorldLocks } from "./benchmark-world-locks";

type Pool = ReturnType<typeof createDatabase>["pool"];

export async function populationScenario(
    name: string,
    pool: Pool,
    observer: Pool,
    operations: readonly (() => Promise<unknown>)[],
    concurrency: number,
)
{
    const locks = new BenchmarkWorldLocks(pool);
    try
    {
        const measured = await benchmarkScenario(name, pool, observer, operations, concurrency);
        return { ...measured, worldLock: locks.report() };
    }
    finally
    {
        locks.close();
    }
}
