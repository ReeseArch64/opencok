import { asc, desc, eq } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import type {
    WorldDetailReader as Reader,
    WorldDetailReaders,
} from "../contracts/point-detail-persistence";
import type {
    WorldPointOwnerSnapshot,
    WorldCityEffects,
    WorldResourceOwnerIdentity,
} from "../contracts/world-point-detail";
import type { Row } from "../contracts/rows";
import { validText, blank, single } from "./point-detail-values";

export async function ownerRows(
    db: Reader,
    point: Row,
    remote: boolean,
    cityExtras: boolean,
): Promise<WorldPointOwnerSnapshot>
{
    if (!remote && (point.pointType === 6 || point.pointType === 15))
    {
        return {};
    }

    const uid = point.ownerId;

    if (uid == null || (typeof uid === "string" && blank(uid)))
    {
        return {};
    }

    if (!validText(uid, 255))
    {
        throw new Error("Invalid point owner");
    }

    const result: WorldPointOwnerSnapshot = {};
    result.profile = single(
        await db
            .select({
                uid: userprofile.uid,
                pic: userprofile.pic,
                regTime: userprofile.regTime,
                ...(cityExtras && point.pointType === 1
                    ? {
                        serverId: userprofile.serverId,
                        level: userprofile.level,
                        allianceId: userprofile.allianceId,
                        pf: userprofile.pf,
                        civilizationType: userprofile.civilizationType,
                        decomposeSuitEffect: userprofile.decomposesuiteffect,
                    }
                    : {}),
            })
            .from(userprofile)
            .where(eq(userprofile.uid, uid))
            .limit(2),
    );

    if (result.profile && result.profile.uid !== uid)
    {
        throw new Error("Foreign point owner");
    }

    const city = point.pointType === 1 || point.pointType === 2;

    if (result.profile)
    {
        result.registration = single(
            await db
                .select({ uid: stat_reg.uid, type: stat_reg.type, time: stat_reg.time })
                .from(stat_reg)
                .where(eq(stat_reg.uid, uid))
                .orderBy(desc(eq(stat_reg.type, 2)), desc(stat_reg.time), asc(stat_reg.type))
                .limit(1),
        );

        if (result.registration && result.registration.uid !== uid)
        {
            throw new Error("Foreign owner registration");
        }

        if (city)
        {
            result.statistics = single(
                await db
                    .select({
                        uid: playerinfo.uid,
                        power: playerinfo.power,
                        armyKill: playerinfo.armyKill,
                    })
                    .from(playerinfo)
                    .where(eq(playerinfo.uid, uid))
                    .limit(2),
            );

            if (result.statistics && result.statistics.uid !== uid)
            {
                throw new Error("Foreign owner statistics");
            }
        }
    }

    if (city || point.pointType === 3)
    {
        const allianceId = point.allianceId;

        if (allianceId != null && !(typeof allianceId === "string" && blank(allianceId)))
        {
            if (!validText(allianceId, 40))
            {
                throw new Error("Invalid point alliance");
            }

            result.alliance = single(
                await db
                    .select({ uid: alliance.uid, abbr: alliance.abbr })
                    .from(alliance)
                    .where(eq(alliance.uid, allianceId))
                    .limit(2),
            );

            if (result.alliance && result.alliance.uid !== allianceId)
            {
                throw new Error("Foreign point alliance");
            }

            result.member = single(
                await db
                    .select({ uid: alliance_member.uid, rank: alliance_member.rank })
                    .from(alliance_member)
                    .where(eq(alliance_member.uid, uid))
                    .limit(2),
            );

            if (result.member && result.member.uid !== uid)
            {
                throw new Error("Foreign owner membership");
            }
        }
    }

    return result;
}

export async function readCity<TEffects extends WorldCityEffects>(
    db: Reader,
    observer: string,
    profile: Row,
    kingdomId: number,
    runtime: Pick<WorldDetailReaders<TEffects, WorldResourceOwnerIdentity>, "readPlayerEffects">,
)
{
    if (profile.serverId !== kingdomId)
    {
        throw new Error("Invalid city realm");
    }

    const observerStatistics = single(
        await db
            .select({ uid: playerinfo.uid, power: playerinfo.power })
            .from(playerinfo)
            .where(eq(playerinfo.uid, observer))
            .limit(2),
    );

    if (!observerStatistics || observerStatistics.uid !== observer)
    {
        throw new Error("Foreign observer statistics");
    }

    const mixed = single(
        await db
            .select({ uid: user_mixed_info.uid, lastBeDuelTime: user_mixed_info.lastBeDuelTime })
            .from(user_mixed_info)
            .where(eq(user_mixed_info.uid, profile.uid as string))
            .limit(2),
    );

    if (!mixed || mixed.uid !== profile.uid)
    {
        throw new Error("Foreign city duel state");
    }

    const effects = await runtime.readPlayerEffects(db, profile, true);

    return { observerStatistics, mixed, effects };
}
