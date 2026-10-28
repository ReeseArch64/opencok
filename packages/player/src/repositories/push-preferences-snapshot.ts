import type { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { parse_info } from "@opencok/drizzle/schema/opencok_kingdom/parse_info";
import type { LoginConfigurationState } from "@opencok/contracts/game";
import { asc, eq } from "drizzle-orm";

export function getConfigurationByPlayerId(
    db: ReturnType<typeof createDatabase<"kingdom">>["db"],
    uid: string,
): Promise<LoginConfigurationState>
{
    return db.transaction(
        async (tx) => {
            const profile = (
                await tx.select().from(userprofile).where(eq(userprofile.uid, uid)).limit(1)
            )[0];
            const pushSettings = await tx
                .select({
                    type: parse_info.type,
                    status: parse_info.status,
                    audio: parse_info.audio,
                })
                .from(parse_info)
                .where(eq(parse_info.uid, uid))
                .orderBy(asc(parse_info.type));

            return { profile, switches: undefined, pushSettings };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
    );
}
