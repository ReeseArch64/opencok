import { MailIntegrationKind } from "@opencok/mail/enums/integration-kind";
import type { ServerConfig } from "@opencok/contracts/server";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { createChatMailboxPublisher } from "@opencok/connection/chat-mailbox";
import { logEvent } from "@opencok/core/logging";
import { observeJob } from "@opencok/core/operation";
import { MailIntegrationWorker } from "@opencok/mail/services/integration-worker";
import { relayMailGiftOpenings } from "@opencok/mail/repositories/gift-opening-relay";
import { relayMailChat } from "@opencok/mail/repositories/chat-relay";
import {
    mailIntegrationBacklog,
    checkMailGiftProjection,
} from "@opencok/mail/repositories/integration-backlog";

export function createRealmMailIntegrationWorker(
    config: Pick<
        ServerConfig,
        "mailIntegrationMode" | "mailChat" | "kingdomId" | "timeoutMs" | "diagnosticLogin"
    >,
    kingdom: DatabaseClient<"kingdom">,
    global: DatabaseClient<"global">,
): MailIntegrationWorker | undefined
{
    if (config.diagnosticLogin || config.mailIntegrationMode === "external")
    {
        return undefined;
    }

    const publish = config.mailChat
        ? createChatMailboxPublisher({ ...config.mailChat, timeoutMs: config.timeoutMs })
        : undefined;
    const worker = new MailIntegrationWorker({
        gift: {
            deliver: () =>
                observeJob("realm.mail_gift", () => relayMailGiftOpenings(kingdom, global)),
            backlog: async () => {
                await checkMailGiftProjection(global);

                return mailIntegrationBacklog(kingdom, MailIntegrationKind.Gift);
            },
        },
        chat: publish
            ? {
                deliver: () =>
                    observeJob(
                        "realm.mail_chat",
                        () => relayMailChat(kingdom, config.kingdomId, publish, config.timeoutMs),
                    ),
                backlog: () => mailIntegrationBacklog(kingdom, MailIntegrationKind.Chat),
            }
            : undefined,
        report: (queue) =>
            logEvent(
                queue === MailIntegrationKind.Gift
                    ? "mail_gift_relay_failed"
                    : "mail_chat_relay_failed",
                {
                    kingdom: config.kingdomId,
                    outcome: "failure",
                },
                "error",
            ),
    });
    void worker.start();

    return worker;
}
