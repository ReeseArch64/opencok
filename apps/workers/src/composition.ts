import { MailIntegrationKind } from "@opencok/mail/enums/integration-kind";
import { createDatabase } from "@opencok/drizzle/client";
import { createChatMailboxPublisher } from "@opencok/connection/chat-mailbox";
import { logEvent } from "@opencok/core/logging";
import { observeJob } from "@opencok/core/operation";
import { relayMailGiftOpenings } from "@opencok/mail/repositories/gift-opening-relay";
import { relayMailChat } from "@opencok/mail/repositories/chat-relay";
import {
    mailIntegrationBacklog,
    checkMailGiftProjection,
} from "@opencok/mail/repositories/integration-backlog";
import { checkMailWorkerPermissions } from "@opencok/mail/repositories/worker-permissions";
import { MailIntegrationWorker } from "@opencok/mail/services/integration-worker";
import { MailWorkerApplication } from "./application";
import type { MailWorkerConfig } from "./config";

export async function createMailWorkerApplication(
    config: MailWorkerConfig,
): Promise<MailWorkerApplication>
{
    const publish = config.chat
        ? createChatMailboxPublisher({ ...config.chat, timeoutMs: config.timeoutMs })
        : undefined;
    const budgets = {
        connectionTimeoutMillis: config.timeoutMs,
        statement_timeout: config.timeoutMs,
        query_timeout: config.timeoutMs,
        options: `-c transaction_timeout=${
            config.timeoutMs * 2
        } -c idle_in_transaction_session_timeout=${config.timeoutMs * 2}`,
    };
    const kingdom = createDatabase("kingdom", {
        ...budgets,
        connectionString: config.kingdomUrl,
        max: config.kingdomPool,
    });
    const global = createDatabase("global", {
        ...budgets,
        connectionString: config.globalUrl,
        max: config.globalPool,
    });
    const check = () => checkMailWorkerPermissions(kingdom.db, global.db, config.kingdomId);
    const worker = new MailIntegrationWorker({
        validate: check,
        gift: {
            deliver: () =>
                observeJob("worker.mail_gift", () => relayMailGiftOpenings(kingdom.db, global.db)),
            backlog: async () => {
                await checkMailGiftProjection(global.db);

                return mailIntegrationBacklog(kingdom.db, MailIntegrationKind.Gift);
            },
        },
        chat: publish
            ? {
                deliver: () =>
                    observeJob(
                        "worker.mail_chat",
                        () =>
                            relayMailChat(kingdom.db, config.kingdomId, publish, config.timeoutMs),
                    ),
                backlog: () => mailIntegrationBacklog(kingdom.db, MailIntegrationKind.Chat),
            }
            : undefined,
        intervalMs: config.intervalMs,
        report: (queue) =>
            logEvent("mail_integration_delivery_failed", {
                kingdom: config.kingdomId,
                queue,
                outcome: "failure",
            }, "error"),
    });
    const app = new MailWorkerApplication({
        worker,
        check,
        closeResources: () => Promise.all([kingdom.close(), global.close()]).then(() => undefined),
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

        throw new Error("Mail worker startup failed");
    }
}
