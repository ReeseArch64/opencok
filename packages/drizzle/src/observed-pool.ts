import type { Pool } from "pg";
import { observeDependencyOperation } from "@opencok/core/operation";
import { errorReason, logEvent } from "@opencok/core/logging";

export function observePostgresPool(pool: Pool, role: string): void
{
    const connect = pool.connect.bind(pool);
    pool.connect = function(this: Pool, callback?: Parameters<Pool["connect"]>[0])
    {
        const fields = { component: "postgresql", databaseRole: role };
        const started = performance.now();
        const finish = (error?: Error) =>
            logEvent("database_pool_acquired", {
                ...fields,
                operation: `postgresql.${role}.pool_acquire`,
                durationMs: performance.now() - started,
                outcome: error ? "failure" : "success",
                reason: error ? errorReason(error) : undefined,
                waitingCount: this.waitingCount,
                idleCount: this.idleCount,
                totalCount: this.totalCount,
            }, error ? "error" : "info");

        if (callback)
        {
            return connect((error, client, release) => {
                finish(error);
                callback(error, client, release);
            });
        }

        return observeDependencyOperation(`postgresql.${role}.pool_acquire`, async () => {
            try
            {
                const client = await connect();
                finish();

                return client;
            }
            catch (error)
            {
                finish(error instanceof Error ? error : new Error("Pool acquisition failed"));
                throw error;
            }
        }, fields);
    } as Pool["connect"];
}
