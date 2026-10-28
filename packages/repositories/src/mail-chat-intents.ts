import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { mail_chat_read_intent } from "@opencok/drizzle/schema/opencok_kingdom/mail_chat_read_intent";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";

type Db = DatabaseClient<"kingdom">;

type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export interface MailChatEffect
{
    action: "read" | "delete";
    others: string;
    types: readonly number[];
}

export async function enqueueMailChat(
    tx: Tx,
    owner: string,
    now: number,
    effects: readonly MailChatEffect[],
)
{
    if (!effects.length)
    {
        return;
    }

    if (
        effects.length > 1000
        || effects.some(
            (effect) =>
                !["read", "delete"].includes(effect.action)
                || typeof effect.others !== "string"
                || effect.others.length > 40
                || effect.others.includes("\0")
                || !effect.others.isWellFormed()
                || !["1,20", "2", "3", "1,2,20"].includes(effect.types.join(",")),
        )
    )
    {
        throw new Error("Invalid mail chat effect");
    }

    const [count] = await tx
        .select({ count: sql<string>`count(*)::text` })
        .from(mail_chat_read_intent)
        .where(eq(mail_chat_read_intent.ownerUid, owner));

    if (
        !count || !/^\d+$/.test(count.count) || BigInt(count.count) + BigInt(effects.length) > 1000n
    )
    {
        throw new Error("Mail chat backlog exceeded");
    }

    const commandId = randomUUID();
    await tx.insert(mail_chat_read_intent).values(
        effects.map((effect, effectIndex) => ({
            commandId,
            effectIndex,
            ownerUid: owner,
            action: effect.action,
            others: effect.others,
            chatTypes: effect.types.join(","),
            requestedAt: BigInt(now),
        })),
    );
}
