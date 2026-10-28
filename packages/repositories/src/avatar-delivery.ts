import type { AvatarDeliveryKey } from "@opencok/contracts/files";
import { avatar_completion } from "@opencok/drizzle/schema/opencok_kingdom/avatar_completion";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { mail_group } from "@opencok/drizzle/schema/opencok_kingdom/mail_group";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { and, asc, eq, gt, or } from "drizzle-orm";
import type { Database } from "./game.ts";

export async function checkAvatarCompletionStore(db: Database["kingdom"]["db"]): Promise<void>
{
    for (const table of [avatar_completion, mail, mail_contents, mail_group])
    {
        await db.select().from(table).limit(0);
    }
}

export async function nextAvatarDelivery(
    db: Database["kingdom"]["db"],
    kingdomId: number,
    cursor?: AvatarDeliveryKey,
): Promise<AvatarDeliveryKey | undefined>
{
    if (
        !Number.isInteger(kingdomId)
        || kingdomId < 1
        || kingdomId > 2147483647
        || (cursor
            && (typeof cursor.owner !== "string"
                || !/^[0-9]{1,20}$/.test(cursor.owner)
                || !Number.isInteger(cursor.sequence)
                || cursor.sequence < 1
                || cursor.sequence > 999999))
    )
    {
        throw new Error("Invalid avatar delivery cursor");
    }

    const [entry] = await db
        .select({ owner: avatar_completion.ownerUid, sequence: avatar_completion.sequence })
        .from(avatar_completion)
        .innerJoin(userprofile, eq(userprofile.uid, avatar_completion.ownerUid))
        .where(
            and(
                gt(avatar_completion.pendingEffects, 0),
                eq(userprofile.serverId, kingdomId),
                cursor
                    ? or(
                        gt(avatar_completion.ownerUid, cursor.owner),
                        and(
                            eq(avatar_completion.ownerUid, cursor.owner),
                            gt(avatar_completion.sequence, cursor.sequence),
                        ),
                    )
                    : undefined,
            ),
        )
        .orderBy(asc(avatar_completion.ownerUid), asc(avatar_completion.sequence))
        .limit(1);

    if (
        entry
        && (!/^[0-9]{1,20}$/.test(entry.owner)
            || !Number.isInteger(entry.sequence)
            || entry.sequence < 1
            || entry.sequence > 999999)
    )
    {
        throw new Error("Invalid avatar delivery key");
    }

    return entry;
}
