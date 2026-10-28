import { and, asc, eq } from "drizzle-orm";
import { mail_chat_read_intent } from "@opencok/drizzle/schema/opencok_kingdom/mail_chat_read_intent";
import type { ChatMailboxPublisher, ChatMailboxUpdate } from "../contracts/chat-mailbox";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
type Db = DatabaseClient<"kingdom">;

export async function relayMailChat(
    db: Db,
    kingdomId: number,
    publish: ChatMailboxPublisher,
    timeoutMs: number,
): Promise<number>
{
    if (
        !Number.isInteger(kingdomId)
        || kingdomId < 1
        || !Number.isInteger(timeoutMs)
        || timeoutMs < 100
        || timeoutMs > 30000
    )
    {
        throw new Error("Invalid mailbox relay");
    }

    return db.transaction(
        async (tx) => {
            const pending = await tx
                .select()
                .from(mail_chat_read_intent)
                .orderBy(
                    asc(mail_chat_read_intent.requestedAt),
                    asc(mail_chat_read_intent.commandId),
                    asc(mail_chat_read_intent.effectIndex),
                )
                .limit(1)
                .for("update", { skipLocked: true });
            const entry = pending[0];

            if (!entry)
            {
                return 0;
            }

            const update: ChatMailboxUpdate = {
                owner: entry.ownerUid,
                kingdomId,
                operationId: entry.commandId,
                effectIndex: entry.effectIndex,
                action: entry.action as "read" | "delete",
                others: entry.others,
                types: entry.chatTypes.split(",").map(Number),
                requestedAt: Number(entry.requestedAt),
            };
            const abort = new AbortController();
            let timer: ReturnType<typeof setTimeout> | undefined;

            try
            {
                await Promise.race([
                    publish(update, abort.signal),
                    new Promise<never>((_, reject) => {
                        timer = setTimeout(() => {
                            abort.abort();
                            reject(new Error("Mailbox relay timeout"));
                        }, timeoutMs);
                    }),
                ]);
                abort.signal.throwIfAborted();
                await tx
                    .delete(mail_chat_read_intent)
                    .where(
                        and(
                            eq(mail_chat_read_intent.commandId, entry.commandId),
                            eq(mail_chat_read_intent.effectIndex, entry.effectIndex),
                        ),
                    );

                return 1;
            }
            finally
            {
                clearTimeout(timer);
                abort.abort();
            }
        },
        { isolationLevel: "read committed", accessMode: "read write" },
    );
}
