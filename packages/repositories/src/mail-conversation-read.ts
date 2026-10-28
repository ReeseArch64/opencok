import { randomUUID } from "node:crypto";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_chat_read_intent } from "@opencok/drizzle/schema/opencok_kingdom/mail_chat_read_intent";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type {
    MailConversationReadQuery,
    MailConversationReadSnapshot,
} from "@opencok/contracts/mail";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import type { Database } from "./game.ts";

const integer = (value: number) =>
    Number.isInteger(value) && value >= -2147483648 && value <= 2147483647;

const identifier = (value: string) =>
    typeof value === "string" && value.length <= 40 && !value.includes("\0")
    && value.isWellFormed();

export function markMailConversationRead(
    db: Database["kingdom"]["db"],
    kingdomId: number,
    owner: string,
    query: MailConversationReadQuery,
): Promise<MailConversationReadSnapshot>
{
    if (
        !identifier(owner)
        || !owner.trim()
        || !integer(kingdomId)
        || kingdomId < 1
        || !Number.isSafeInteger(query.now)
        || query.now < 0
        || !Array.isArray(query.effects)
        || query.effects.length > 1002
    )
    {
        throw new Error("Invalid conversation read query");
    }

    const requestedAt = BigInt(query.now);
    const effects = query.effects.map((effect) => {
        if (!effect || !Array.isArray(effect.types))
        {
            throw new Error("Invalid conversation read effect");
        }

        if (effect.kind === "chat")
        {
            if (
                !identifier(effect.others)
                || !["1,20", "2", "3"].includes(effect.types.join(","))
                || effect.types.some(
                    (type: unknown) =>
                        typeof type !== "string" || !["1", "2", "3", "20"].includes(type),
                )
            )
            {
                throw new Error("Invalid conversation chat intent");
            }

            return { ...effect, types: [...effect.types] };
        }

        if (
            effect.kind !== "mail"
            || typeof effect.unreadOnly !== "boolean"
            || !effect.types.every(integer)
        )
        {
            throw new Error("Invalid conversation mail assignment");
        }

        if (effect.fromUser === undefined)
        {
            if (!effect.unreadOnly || effect.types.length !== 1)
            {
                throw new Error("Invalid conversation type assignment");
            }
        }
        else if (
            (effect.fromUser !== null && !identifier(effect.fromUser))
            || !(effect.unreadOnly ? ["20,21,22", "23,24"] : ["43,44"]).includes(
                effect.types.join(","),
            )
        )
        {
            throw new Error("Invalid conversation sender assignment");
        }

        return { ...effect, types: [...effect.types] };
    });
    const chat = effects.flatMap((effect, effectIndex) =>
        effect.kind === "chat"
            ? [{ effectIndex, others: effect.others, chatTypes: effect.types.join(",") }]
            : []
    );

    if (chat.length > 2)
    {
        throw new Error("Conversation chat intent capacity exceeded");
    }

    const assignments = effects.filter((effect) => effect.kind === "mail");

    return db.transaction(
        async (tx) => {
            const profile = (
                await tx
                    .select({
                        uid: userprofile.uid,
                        serverId: userprofile.serverId,
                        banTime: userprofile.banTime,
                        banFlag: userprofile.banFlag,
                    })
                    .from(userprofile)
                    .where(eq(userprofile.uid, owner))
                    .limit(1)
                    .for("update")
            )[0];

            if (
                !profile
                || profile.uid !== owner
                || profile.serverId !== kingdomId
                || (profile.banFlag ?? 0) !== 0
                || (profile.banTime ?? 0n) > requestedAt
            )
            {
                return { profile };
            }

            if (chat.length)
            {
                const counts = await tx
                    .select({ count: sql<string>`count(*)::text` })
                    .from(mail_chat_read_intent)
                    .where(eq(mail_chat_read_intent.ownerUid, owner));

                if (counts.length !== 1 || !/^(0|[1-9]\d*)$/.test(counts[0]!.count))
                {
                    throw new Error("Invalid conversation chat backlog");
                }

                if (BigInt(counts[0]!.count) + BigInt(chat.length) > 1000n)
                {
                    throw new Error("Conversation chat backlog capacity exceeded");
                }
            }

            if (assignments.length)
            {
                const predicates = assignments.map((effect) =>
                    and(
                        inArray(mail.type, [...effect.types]),
                        effect.fromUser === undefined
                            ? undefined
                            : effect.fromUser === null
                            ? sql`${mail.fromUser} = ${null}`
                            : eq(mail.fromUser, effect.fromUser),
                        effect.unreadOnly ? eq(mail.status, 0) : undefined,
                    )
                );
                await tx
                    .update(mail)
                    .set({ status: 1 })
                    .where(and(eq(mail.toUser, owner), or(...predicates)));
            }

            if (chat.length)
            {
                const commandId = randomUUID();
                await tx
                    .insert(mail_chat_read_intent)
                    .values(
                        chat.map((entry) => ({
                            ...entry,
                            ownerUid: owner,
                            requestedAt,
                            commandId,
                        })),
                    );
            }

            return { profile };
        },
        { isolationLevel: "read committed", accessMode: "read write" },
    );
}
