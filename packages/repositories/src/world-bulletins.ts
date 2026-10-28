import { eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mailBlank } from "@opencok/rules/mail";
import type { WorldBulletinStore } from "@opencok/contracts/world-bulletins";
import type { Database } from "./game";

export function createWorldBulletinStore(db: Database["kingdom"]["db"]): WorldBulletinStore
{
    return {
        alliance(observer, kingdomId, now)
        {
            if (
                !observer
                || observer.length > 40
                || observer.includes("\0")
                || !observer.isWellFormed()
                || !Number.isSafeInteger(now)
                || now < 0
            )
            {
                throw new Error("Invalid world bulletin principal");
            }

            return db.transaction(
                async (tx) => {
                    const [profile] = await tx
                        .select({
                            uid: userprofile.uid,
                            serverId: userprofile.serverId,
                            banTime: userprofile.banTime,
                            banFlag: userprofile.banFlag,
                            alliance: userprofile.allianceId,
                        })
                        .from(userprofile)
                        .where(eq(userprofile.uid, observer));

                    if (
                        !profile
                        || profile.uid !== observer
                        || profile.serverId !== kingdomId
                        || profile.banFlag !== 0
                        || (profile.banTime ?? 0n) > BigInt(now)
                        || mailBlank(profile.alliance)
                    )
                    {
                        return undefined;
                    }

                    return profile.alliance!;
                },
                { isolationLevel: "repeatable read", accessMode: "read only" },
            );
        },
    };
}
