import type { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { parse_info } from "@opencok/drizzle/schema/opencok_kingdom/parse_info";
import { WORLD_NEWS_PUSH_TYPE } from "@opencok/constants/game";
import { DependencyError } from "@opencok/errors/dependency";
import { eq } from "drizzle-orm";

export async function initializeWorldNewsPreference(
    db: ReturnType<typeof createDatabase<"kingdom">>["db"],
    uid: string,
    kingdomId: number,
    now: number,
): Promise<void>
{
    if (
        !uid
        || uid.length > 40
        || !Number.isSafeInteger(now)
        || now < 0
        || !Number.isInteger(kingdomId)
        || kingdomId < 1
    )
    {
        throw new DependencyError("configuration preference input");
    }

    await db.transaction(
        async (tx) => {
            const profile = (
                await tx
                    .select({
                        uid: userprofile.uid,
                        serverId: userprofile.serverId,
                        banFlag: userprofile.banFlag,
                        banTime: userprofile.banTime,
                    })
                    .from(userprofile)
                    .where(eq(userprofile.uid, uid))
                    .limit(1)
                    .for("update")
            )[0];

            if (
                !profile
                || profile.uid !== uid
                || profile.serverId !== kingdomId
                || (profile.banFlag ?? 0) !== 0
                || (profile.banTime ?? 0n) > BigInt(now)
            )
            {
                throw new DependencyError("configuration preference owner");
            }

            await tx.insert(parse_info).values({
                uid,
                type: WORLD_NEWS_PUSH_TYPE,
                status: 0,
                audio: 1,
            });
        },
        { isolationLevel: "read committed", accessMode: "read write" },
    );
}
