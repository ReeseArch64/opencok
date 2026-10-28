import { createServer } from "node:http";
import type { createDatabase } from "@opencok/drizzle";
import { createChatMailboxStore } from "@opencok/repositories/chat-mailbox";
import { createChatMailboxHandler } from "@opencok/controllers/chat-mailbox";

export async function chatReceiver(
    database: ReturnType<typeof createDatabase<"global">>,
    secret: string,
    signingSecrets?: Readonly<Record<string, string>>,
)
{
    const store = createChatMailboxStore(database.db);
    const control = {
        delayMs: 0,
        delayKingdom: 1,
        loseNextAck: false,
        afterApply: undefined as (() => Promise<void>) | undefined,
    };
    const deliveries: { kingdom: number; operation: string; result: string; at: number; }[] = [];
    const server = createServer((request, response) => {
        const handler = createChatMailboxHandler({
            signingSecret: secret,
            signingSecrets,
            timeoutMs: 30000,
            mailboxes: {
                list: store.list,
                async apply(update)
                {
                    if (control.delayMs && update.kingdomId === control.delayKingdom)
                    {
                        await Bun.sleep(control.delayMs);
                    }
                    const result = await store.apply(update);
                    deliveries.push({
                        kingdom: update.kingdomId,
                        operation: update.operationId,
                        result,
                        at: performance.now(),
                    });
                    await control.afterApply?.();
                    if (control.loseNextAck)
                    {
                        control.loseNextAck = false;
                        response.destroy();
                    }
                    return result;
                },
            },
        });
        void handler(request, response).catch(() => response.destroy());
    });
    await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(0, "127.0.0.1", () => {
            server.off("error", reject);
            resolve();
        });
    });
    const address = server.address();
    if (!address || typeof address === "string")
    {
        throw new Error("Missing synthetic Chat address");
    }
    return {
        control,
        deliveries,
        store,
        url: `http://127.0.0.1:${address.port}/_internal/mailbox`,
        async close()
        {
            await new Promise<void>((resolve, reject) => {
                server.close((error) => error ? reject(error) : resolve());
                server.closeAllConnections();
            });
        },
    };
}
