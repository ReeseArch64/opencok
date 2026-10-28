import { z } from "zod";
import { postgresUrl } from "./database.schema";
import { chatUrl, databaseName, port, timeout } from "./service.schema";
import { blankToUndefined, validateEnvironment } from "./validation";

const workerDatabaseUrl = postgresUrl.refine((value) => {
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

export const workersSchema = z.object({
    MAIL_INTEGRATION_MODE: z.literal("external"),
    KINGDOM_ID: z.coerce.number().int().positive().max(2147483647),
    KINGDOM_DATABASE_NAME: z.preprocess(blankToUndefined, databaseName.optional()),
    GLOBAL_DATABASE_NAME: databaseName.default("opencok_global"),
    MAIL_WORKER_KINGDOM_URL: workerDatabaseUrl,
    MAIL_WORKER_GLOBAL_URL: workerDatabaseUrl,
    CHAT_URL: chatUrl,
    MAIL_WORKER_CHAT_SECRET: z.preprocess(blankToUndefined, z.string().min(1).optional()),
    MAIL_WORKER_HEALTH_HOST: z.string().min(1).default("127.0.0.1"),
    MAIL_WORKER_HEALTH_PORT: port(18091),
    MAIL_WORKER_TIMEOUT_MS: timeout(5000),
    MAIL_WORKER_POLL_MS: z.coerce.number().int().min(1000).max(60000).default(5000),
    MAIL_WORKER_KINGDOM_POOL: z.coerce.number().int().min(1).max(4).default(2),
    MAIL_WORKER_GLOBAL_POOL: z.coerce.number().int().min(1).max(2).default(1),
}).refine((settings) => !settings.CHAT_URL || !!settings.MAIL_WORKER_CHAT_SECRET, {
    path: ["MAIL_WORKER_CHAT_SECRET"],
}).refine((settings) => {
    try
    {
        const url = new URL(settings.MAIL_WORKER_KINGDOM_URL);

        return decodeURIComponent(url.pathname.slice(1))
            === (settings.KINGDOM_DATABASE_NAME ?? `opencok_kingdom_${settings.KINGDOM_ID}`);
    }
    catch
    {
        return false;
    }
}, { path: ["MAIL_WORKER_KINGDOM_URL"] }).refine((settings) => {
    try
    {
        const url = new URL(settings.MAIL_WORKER_GLOBAL_URL);

        return decodeURIComponent(url.pathname.slice(1)) === settings.GLOBAL_DATABASE_NAME;
    }
    catch
    {
        return false;
    }
}, { path: ["MAIL_WORKER_GLOBAL_URL"] }).readonly();

export type WorkersEnvironment = z.infer<typeof workersSchema>;

export const parseWorkersEnvironment = (source: Readonly<Record<string, string | undefined>>) =>
    validateEnvironment(workersSchema, source);
