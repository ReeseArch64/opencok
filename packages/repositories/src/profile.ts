import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { user_military_rank } from "@opencok/drizzle/schema/opencok_kingdom/user_military_rank";
import { kingdom_position } from "@opencok/drizzle/schema/opencok_kingdom/kingdom_position";
import { flower_ranking } from "@opencok/drizzle/schema/opencok_kingdom/flower_ranking";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { user_skill } from "@opencok/drizzle/schema/opencok_kingdom/user_skill";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { user_honor } from "@opencok/drizzle/schema/opencok_kingdom/user_honor";
import { user_achievement } from "@opencok/drizzle/schema/opencok_kingdom/user_achievement";
import { and, asc, count, eq, inArray } from "drizzle-orm";
import type { PublicProfileState, RoutedPublicProfile } from "@opencok/contracts/profile";
import type { createDatabases } from "@opencok/drizzle";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { alliance_vedio } from "@opencok/drizzle/schema/opencok_kingdom/alliance_vedio";
import { DependencyError } from "@opencok/errors/dependency";
import type { Database } from "./game.ts";
import { readProfileAlliance } from "./profile-alliance.ts";

export async function checkPublicProfileStore(db: Database["kingdom"]["db"])
{
    for (const table of [user_skill, user_honor, user_achievement, flower_ranking, alliance_vedio])
    {
        await db.select().from(table).limit(0);
    }
}

export async function loadPublicProfile(
    databases: ReturnType<typeof createDatabases>,
    localKingdomId: number,
    uid: string,
    observerAllianceId: string,
): Promise<RoutedPublicProfile | undefined>
{
    if (!/^[0-9]{1,40}$/.test(uid))
    {
        return undefined;
    }

    const account = (
        await databases.global.db
            .select({ server: account_new.server })
            .from(account_new)
            .where(eq(account_new.gameUid, uid))
            .limit(1)
    )[0];
    const server = account?.server ?? String(localKingdomId);

    if (!/^[+-]?\d+$/.test(server))
    {
        throw new DependencyError("player realm");
    }

    const kingdomId = Number(server);

    if (
        !Number.isInteger(kingdomId)
        || kingdomId <= 0
        || kingdomId > 2147483647
        || !databases.kingdoms.has(kingdomId)
    )
    {
        throw new DependencyError("player realm");
    }

    const state = await readPublicProfile(
        databases.getKingdom(kingdomId).db,
        uid,
        observerAllianceId,
    );

    if (!state.profile)
    {
        return undefined;
    }

    if (state.profile.uid !== uid || Number(state.profile.serverId) !== kingdomId)
    {
        throw new DependencyError("player realm");
    }

    return { state, kingdomId };
}

export function readPublicProfile(
    db: Database["kingdom"]["db"],
    uid: string,
    observerAllianceId = "",
): Promise<PublicProfileState>
{
    if (!uid.trim() || uid.length > 40)
    {
        throw new Error("Invalid public profile identity");
    }

    return db.transaction(
        async (tx) => {
            const profile = (
                await tx
                    .select({
                        uid: userprofile.uid,
                        name: userprofile.name,
                        level: userprofile.level,
                        exp: userprofile.exp,
                        pic: userprofile.pic,
                        picVer: userprofile.picVer,
                        picfraId: userprofile.picfraId,
                        gmFlag: userprofile.gmFlag,
                        allianceId: userprofile.allianceId,
                        serverId: userprofile.serverId,
                    })
                    .from(userprofile)
                    .where(eq(userprofile.uid, uid))
                    .limit(1)
            )[0];

            if (!profile)
            {
                return {
                    profile: undefined,
                    statistics: undefined,
                    vip: undefined,
                    lord: undefined,
                    mixed: undefined,
                    military: undefined,
                    office: undefined,
                    flowers: undefined,
                    alliance: undefined,
                    taverns: [],
                    generals: [],
                    skills: [],
                    equipment: [],
                    honors: [],
                    completedAchievements: 0,
                };
            }

            const statistics = (
                await tx
                    .select({
                        battlesWin: playerinfo.battlesWin,
                        battlesLose: playerinfo.battlesLose,
                        attacksWin: playerinfo.attacksWin,
                        attacksLose: playerinfo.attacksLose,
                        defensesWin: playerinfo.defensesWin,
                        detectNum: playerinfo.detectNum,
                        armyKill: playerinfo.armyKill,
                        armyDead: playerinfo.armyDead,
                        armyCure: playerinfo.armyCure,
                        cityDestroyed: playerinfo.cityDestroyed,
                        power: playerinfo.power,
                    })
                    .from(playerinfo)
                    .where(eq(playerinfo.uid, uid))
                    .limit(1)
            )[0];
            const vip = (
                await tx
                    .select({
                        score: user_vip.score,
                        vipEndTime: user_vip.vipEndTime,
                    })
                    .from(user_vip)
                    .where(eq(user_vip.uid, uid))
                    .limit(1)
            )[0];
            const lord = (
                await tx
                    .select({
                        medal: user_lord.medal,
                    })
                    .from(user_lord)
                    .where(eq(user_lord.uid, uid))
                    .limit(1)
            )[0];
            const mixed = (
                await tx
                    .select({
                        showEquip: user_mixed_info.showEquip,
                        showMedal: user_mixed_info.showMedal,
                        marchSoldierShow: user_mixed_info.marchSoldierShow,
                    })
                    .from(user_mixed_info)
                    .where(eq(user_mixed_info.uid, uid))
                    .limit(1)
            )[0];
            const military = (
                await tx
                    .select({
                        militaryRank: user_military_rank.militaryRank,
                    })
                    .from(user_military_rank)
                    .where(eq(user_military_rank.uid, uid))
                    .limit(1)
            )[0];
            const office = (
                await tx
                    .select({
                        positionId: kingdom_position.positionId,
                        serverId: kingdom_position.serverId,
                    })
                    .from(kingdom_position)
                    .where(eq(kingdom_position.uid, uid))
                    .limit(1)
            )[0];
            const taverns = await tx
                .select({
                    level: user_building.level,
                })
                .from(user_building)
                .where(and(eq(user_building.uid, uid), eq(user_building.itemId, 401000)))
                .orderBy(asc(user_building.uuid))
                .limit(2);

            if (taverns.length > 1)
            {
                throw new Error("Ambiguous public profile tavern");
            }

            const generals = await tx
                .select({
                    uuid: user_general.uuid,
                    generalId: user_general.generalId,
                    level: user_general.level,
                    status: user_general.status,
                    ability: user_general.ability,
                    abilityIndex: user_general.abilityIndex,
                    plusSkillPoint: user_general.plusSkillPoint,
                })
                .from(user_general)
                .where(eq(user_general.uid, uid))
                .orderBy(asc(user_general.uuid))
                .limit(32768);

            if (generals.length > 32767)
            {
                throw new Error("Public profile collection exceeds wire limit");
            }

            const skills = generals.length
                ? await tx
                    .select({
                        uuid: user_skill.uuid,
                        ownerId: user_skill.ownerId,
                        skillId: user_skill.skillId,
                        startTime: user_skill.startTime,
                        endTime: user_skill.endTime,
                        actTime: user_skill.actTime,
                        stat: user_skill.stat,
                        param1: user_skill.param1,
                        param2: user_skill.param2,
                    })
                    .from(user_skill)
                    .where(eq(user_skill.ownerId, uid))
                    .orderBy(asc(user_skill.endTime), asc(user_skill.uuid))
                    .limit(32768)
                : [];

            if (skills.length > 32767)
            {
                throw new Error("Public profile collection exceeds wire limit");
            }

            const equipment = await tx
                .select({
                    uuid: user_equip.uuid,
                    itemId: user_equip.itemId,
                    on: user_equip.on,
                    extraProperty: user_equip.extraProperty,
                    refineProperty: user_equip.refineProperty,
                    reforgeCount: user_equip.reforgeCount,
                    strengthLevel: user_equip.strengthLevel,
                    lockProperty: user_equip.lockProperty,
                })
                .from(user_equip)
                .where(and(eq(user_equip.uid, uid), eq(user_equip.on, 1)))
                .orderBy(asc(user_equip.uuid))
                .limit(32768);

            if (equipment.length > 32767)
            {
                throw new Error("Public profile collection exceeds wire limit");
            }

            const honors = await tx
                .select({
                    id: user_honor.id,
                    level: user_honor.level,
                })
                .from(user_honor)
                .where(eq(user_honor.uid, uid))
                .orderBy(asc(user_honor.id))
                .limit(32768);

            if (honors.length > 32767)
            {
                throw new Error("Public profile collection exceeds wire limit");
            }

            const achievementCounts = await tx
                .select({ count: count() })
                .from(user_achievement)
                .where(and(eq(user_achievement.uid, uid), inArray(user_achievement.state, [1, 2])));
            const completedAchievements = achievementCounts[0]?.count;

            if (!Number.isSafeInteger(completedAchievements) || completedAchievements! < 0)
            {
                throw new Error("Invalid public achievement count");
            }

            const flowers = (
                await tx
                    .select({ flowerVal: flower_ranking.flowerVal, eggVal: flower_ranking.eggVal })
                    .from(flower_ranking)
                    .where(eq(flower_ranking.uid, uid))
                    .limit(1)
            )[0];
            const allianceId = profile.allianceId;
            const alliance = allianceId?.trim()
                ? await readProfileAlliance(tx, allianceId, allianceId !== observerAllianceId)
                : undefined;

            return {
                profile,
                statistics,
                vip,
                lord,
                mixed,
                military,
                office,
                flowers,
                alliance,
                taverns,
                generals,
                skills,
                equipment,
                honors,
                completedAchievements: completedAchievements!,
            };
        },
        { isolationLevel: "repeatable read", accessMode: "read only" },
    );
}
