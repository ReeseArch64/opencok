import type { WorkersEnvironment } from "@opencok/env/workers/schema";

export interface MailWorkerConfig
{
    kingdomId: number;
    kingdomUrl: string;
    globalUrl: string;
    healthHost: string;
    healthPort: number;
    timeoutMs: number;
    intervalMs: number;
    kingdomPool: number;
    globalPool: number;
    chat?: { url: string; signingSecret: string; };
}

export function mailWorkerConfig(settings: WorkersEnvironment): MailWorkerConfig
{
    return {
        kingdomId: settings.KINGDOM_ID,
        kingdomUrl: settings.MAIL_WORKER_KINGDOM_URL,
        globalUrl: settings.MAIL_WORKER_GLOBAL_URL,
        healthHost: settings.MAIL_WORKER_HEALTH_HOST,
        healthPort: settings.MAIL_WORKER_HEALTH_PORT,
        timeoutMs: settings.MAIL_WORKER_TIMEOUT_MS,
        intervalMs: settings.MAIL_WORKER_POLL_MS,
        kingdomPool: settings.MAIL_WORKER_KINGDOM_POOL,
        globalPool: settings.MAIL_WORKER_GLOBAL_POOL,
        chat: settings.CHAT_URL
            ? {
                url: new URL("/_internal/mailbox", settings.CHAT_URL).href,
                signingSecret: settings.CHAT_SECRET!,
            }
            : undefined,
    };
}
