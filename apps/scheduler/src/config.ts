import type { SchedulerEnvironment } from "@opencok/env/scheduler/schema";
import { activityDeadlinePath } from "@opencok/queues/contracts/deadline";

export interface SchedulerConfig
{
    kingdomId: number;
    databaseUrl: string;
    ownerUrl: string;
    signingSecret: string;
    healthHost: string;
    healthPort: number;
    timeoutMs: number;
    intervalMs: number;
    poolSize: number;
    batchSize: number;
    ownerBudget: number;
}

export function schedulerConfig(settings: SchedulerEnvironment): SchedulerConfig
{
    return {
        kingdomId: settings.KINGDOM_ID,
        databaseUrl: settings.SCHEDULER_DATABASE_URL,
        ownerUrl: new URL(activityDeadlinePath, settings.SCHEDULER_OWNER_URL).href,
        signingSecret: settings.ACTIVITY_SCHEDULER_SECRET,
        healthHost: settings.SCHEDULER_HEALTH_HOST,
        healthPort: settings.SCHEDULER_HEALTH_PORT,
        timeoutMs: settings.SCHEDULER_TIMEOUT_MS,
        intervalMs: settings.SCHEDULER_POLL_MS,
        poolSize: settings.SCHEDULER_POOL,
        batchSize: settings.SCHEDULER_BATCH_SIZE,
        ownerBudget: settings.SCHEDULER_OWNER_BUDGET,
    };
}
