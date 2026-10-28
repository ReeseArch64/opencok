import { z } from "zod";
import { postgresUrl } from "./database.schema";
import { databaseName, port, timeout } from "./service.schema";
import { blankToUndefined, validateEnvironment } from "./validation";

const schedulerDatabaseUrl = postgresUrl.refine((value) => {
    const allowed = new Set(["sslmode", "sslcert", "sslkey", "sslrootcert"]);

    try
    {
        return [...new URL(value).searchParams.keys()].every((key) => allowed.has(key));
    }
    catch
    {
        return false;
    }
});

const ownerUrl = z.url({ protocol: /^https?$/ }).refine((value) => {
    try
    {
        const url = new URL(value);
        return url.pathname === "/" && !url.username && !url.password && !url.search && !url.hash;
    }
    catch
    {
        return false;
    }
});

export const schedulerSchema = z.object({
    ACTIVITY_SCHEDULER_MODE: z.literal("external"),
    ACTIVITY_SCHEDULER_SECRET: z.preprocess(blankToUndefined, z.string().min(32)),
    KINGDOM_ID: z.coerce.number().int().positive().max(2147483647),
    KINGDOM_DATABASE_NAME: z.preprocess(blankToUndefined, databaseName.optional()),
    SCHEDULER_DATABASE_URL: schedulerDatabaseUrl,
    SCHEDULER_OWNER_URL: ownerUrl,
    SCHEDULER_HEALTH_HOST: z.string().min(1).default("127.0.0.1"),
    SCHEDULER_HEALTH_PORT: port(18092),
    SCHEDULER_TIMEOUT_MS: timeout(5000),
    SCHEDULER_POLL_MS: z.coerce.number().int().min(100).max(60000).default(1000),
    SCHEDULER_POOL: z.coerce.number().int().min(1).max(4).default(2),
    SCHEDULER_BATCH_SIZE: z.coerce.number().int().min(1).max(256).default(64),
    SCHEDULER_OWNER_BUDGET: z.coerce.number().int().min(1).max(256).default(4),
}).refine((settings) => settings.SCHEDULER_OWNER_BUDGET <= settings.SCHEDULER_BATCH_SIZE, {
    path: ["SCHEDULER_OWNER_BUDGET"],
}).refine((settings) => {
    try
    {
        return decodeURIComponent(new URL(settings.SCHEDULER_DATABASE_URL).pathname.slice(1))
            === (settings.KINGDOM_DATABASE_NAME ?? `opencok_kingdom_${settings.KINGDOM_ID}`);
    }
    catch
    {
        return false;
    }
}, {
    path: ["SCHEDULER_DATABASE_URL"],
}).readonly();

export type SchedulerEnvironment = z.infer<typeof schedulerSchema>;

export const parseSchedulerEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
    validateEnvironment(schedulerSchema, source);
