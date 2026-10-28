import { createDatabase } from "@opencok/drizzle/client";
import { logEvent } from "@opencok/core/logging";
import { ActivityDiscoveryRepository } from "@opencok/queues/repositories/discovery";
import { ActivityDiscoveryService } from "@opencok/queues/services/discovery";
import { checkSchedulerPermissions } from "@opencok/queues/repositories/scheduler-permissions";
import { createActivityDeadlinePublisher } from "@opencok/queues/connection/deadline";
import { ActivitySchedulerApplication } from "./application";
import type { SchedulerConfig } from "./config";

export function createSchedulerResources(config: SchedulerConfig)
{
    const dispatcher = createActivityDeadlinePublisher({
        url: config.ownerUrl,
        kingdomId: config.kingdomId,
        signingSecret: config.signingSecret,
        timeoutMs: config.timeoutMs,
    });
    const kingdom = createDatabase("kingdom", {
        connectionString: config.databaseUrl,
        max: config.poolSize,
        connectionTimeoutMillis: config.timeoutMs,
        statement_timeout: config.timeoutMs,
        query_timeout: config.timeoutMs,
        options: `-c default_transaction_read_only=on -c transaction_timeout=${
            config.timeoutMs * 2
        }`,
    });
    const checkPermissions = () => checkSchedulerPermissions(kingdom.db, config.kingdomId);
    const service = new ActivityDiscoveryService({
        reader: new ActivityDiscoveryRepository(kingdom.db),
        dispatcher,
        validate: checkPermissions,
        report: () =>
            logEvent("activity_discovery_failed", {
                kingdom: config.kingdomId,
                outcome: "failure",
            }, "error"),
        intervalMs: config.intervalMs,
        batchSize: config.batchSize,
        ownerBudget: config.ownerBudget,
    });
    let closing: Promise<void> | undefined;

    return {
        service,
        checkPermissions,
        poolState: () => ({
            total: kingdom.pool.totalCount,
            idle: kingdom.pool.idleCount,
            waiting: kingdom.pool.waitingCount,
        }),
        close: () => closing ??= service.close().finally(() => kingdom.close()),
    };
}

export async function createSchedulerApplication(config: SchedulerConfig)
{
    const resources = createSchedulerResources(config);
    const app = new ActivitySchedulerApplication({
        service: resources.service,
        check: resources.checkPermissions,
        closeResources: resources.close,
        host: config.healthHost,
        port: config.healthPort,
    });
    try
    {
        await app.start();

        return app;
    }
    catch
    {
        await app.close();

        throw new Error("Scheduler startup failed");
    }
}
