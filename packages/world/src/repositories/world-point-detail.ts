import { readSpecialWorldDetail, checkSpecialWorldDetail } from "./world-special-detail";
import { readPoint, pointColumns } from "./point-detail-target";
import { readCity } from "./point-detail-owner";
import {
    readBarbarian,
    readExploration,
    readNeutralResource,
    barbarianColumns,
    marchColumns,
    resourceMarchColumns,
} from "./point-detail-marches";
import { integer, validText, blank, authorized, single } from "./point-detail-values";
import type { WorldDetailReaders } from "../contracts/point-detail-persistence";
import type {
    WorldCityEffects,
    WorldResourceOwnerIdentity,
    WorldPointDetailStore,
} from "../contracts/world-point-detail";
import type { createDatabases } from "@opencok/drizzle";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { stat_reg } from "@opencok/drizzle/schema/opencok_kingdom/stat_reg";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { DependencyError } from "@opencok/errors/dependency";
import { eq } from "drizzle-orm";

type Databases = Pick<ReturnType<typeof createDatabases>, "getKingdom" | "kingdoms">;

type Db = ReturnType<Databases["getKingdom"]>["db"];

const options = { isolationLevel: "repeatable read", accessMode: "read only" } as const;

const profileColumns = {
    uid: userprofile.uid,
    serverId: userprofile.serverId,
    banTime: userprofile.banTime,
    banFlag: userprofile.banFlag,
    allianceId: userprofile.allianceId,
    appVersion: userprofile.appVersion,
};

export function createWorldPointDetailStore<
    TEffects extends WorldCityEffects,
    TOwner extends WorldResourceOwnerIdentity,
>(
    databases: Databases,
    kingdomId: number,
    runtime: WorldDetailReaders<TEffects, TOwner>,
): WorldPointDetailStore<TEffects, TOwner>
{
    if (!integer(kingdomId) || kingdomId < 1 || !databases.kingdoms.has(kingdomId))
    {
        throw new Error("Invalid world detail realm");
    }

    return {
        async read(observer, input, selectExploration, turret)
        {
            const query = Object.freeze({ ...input });

            if (
                !validText(observer, 255)
                || !observer
                || !integer(query.point)
                || !integer(query.kingdomId)
                || query.kingdomId < 1
                || !Number.isSafeInteger(query.now)
                || query.now < 0
                || (query.cityExtras !== undefined && typeof query.cityExtras !== "boolean")
                || (query.resourceEffects !== undefined
                    && typeof query.resourceEffects !== "boolean")
            )
            {
                throw new Error("Invalid world detail query");
            }

            const remote = query.kingdomId !== kingdomId;

            try
            {
                const local = await databases.getKingdom(kingdomId).db.transaction(async (tx) => {
                    const profile = single(
                        await tx
                            .select(profileColumns)
                            .from(userprofile)
                            .where(eq(userprofile.uid, observer))
                            .limit(2),
                    );
                    const snapshot = { profile, kingdomId: query.kingdomId, remote };

                    if (!authorized(profile, observer, kingdomId, query.now) || query.point <= 0)
                    {
                        return snapshot;
                    }

                    const world = single(
                        await tx
                            .select({ uid: user_world.uid, worldId: user_world.worldId })
                            .from(user_world)
                            .where(eq(user_world.uid, observer))
                            .limit(2),
                    );

                    if (!world || world.uid !== observer || !integer(world.worldId))
                    {
                        throw new Error("Missing observer world");
                    }

                    const result = { ...snapshot, world };

                    if (remote)
                    {
                        return result;
                    }

                    const detail = await readPoint(
                        tx,
                        query.point,
                        world.worldId,
                        false,
                        query.cityExtras,
                        query.resourceEffects,
                        runtime,
                    );
                    const special = detail.point
                        ? await readSpecialWorldDetail(
                            tx,
                            detail.point,
                            profile!,
                            kingdomId,
                            false,
                            turret,
                            runtime,
                        )
                        : undefined;
                    const exploration = detail.point?.pointType === 6 && selectExploration
                        ? await readExploration(tx, observer, detail.point, selectExploration)
                        : undefined;
                    const neutralResource =
                        detail.point?.pointType === 60 && !blank(detail.point.pointItem)
                            ? await readNeutralResource(tx, detail.point)
                            : undefined;
                    const barbarian = detail.point?.pointType === 44
                        ? await readBarbarian(tx, detail.point)
                        : undefined;
                    const city =
                        query.cityExtras && detail.point?.pointType === 1 && detail.owner?.profile
                            ? await readCity(tx, observer, detail.owner.profile, kingdomId, runtime)
                            : undefined;

                    return {
                        ...result,
                        ...detail,
                        ...(special ? { special } : {}),
                        ...(exploration ? { exploration } : {}),
                        ...(neutralResource ? { neutralResource } : {}),
                        ...(city ? { city } : {}),
                        ...(barbarian ? { barbarian } : {}),
                    };
                }, options);

                if (
                    !authorized(local.profile, observer, kingdomId, query.now)
                    || query.point <= 0
                    || !remote
                )
                {
                    return local;
                }

                if (!databases.kingdoms.has(query.kingdomId))
                {
                    throw new Error("Unconfigured world detail realm");
                }

                const detail = await databases.getKingdom(query.kingdomId).db.transaction(
                    async (tx) => {
                        const result = await readPoint(
                            tx,
                            query.point,
                            0,
                            true,
                            false,
                            query.resourceEffects,
                            runtime,
                        );
                        const special = result.point
                            ? await readSpecialWorldDetail(
                                tx,
                                result.point,
                                local.profile!,
                                query.kingdomId,
                                true,
                                turret,
                                runtime,
                            )
                            : undefined;

                        return { ...result, ...(special ? { special } : {}) };
                    },
                    options,
                );

                return { ...local, ...detail };
            }
            catch
            {
                throw new DependencyError("world point detail");
            }
        },
    };
}

export async function checkWorldPointDetailStore(
    db: Db,
    runtime: Pick<
        WorldDetailReaders<WorldCityEffects, WorldResourceOwnerIdentity>,
        "checkResourceOwner"
    >,
): Promise<void>
{
    await runtime.checkResourceOwner(db);
    await checkSpecialWorldDetail(db);
    await db.select(barbarianColumns).from(world_barbarion).limit(0);
    await db
        .select({ uid: user_mixed_info.uid, lastBeDuelTime: user_mixed_info.lastBeDuelTime })
        .from(user_mixed_info)
        .limit(0);
    await db
        .select({
            ...marchColumns,
            ...resourceMarchColumns,
            exploreReport: world_march.exploreReport,
            occupyResourceEndTime: world_march.occupyResourceEndTime,
        })
        .from(world_march)
        .limit(0);
    await db
        .select({
            ...profileColumns,
            pic: userprofile.pic,
            regTime: userprofile.regTime,
            level: userprofile.level,
            pf: userprofile.pf,
            civilizationType: userprofile.civilizationType,
            decomposeSuitEffect: userprofile.decomposesuiteffect,
        })
        .from(userprofile)
        .limit(0);
    await db.select({ uid: user_world.uid, worldId: user_world.worldId }).from(user_world).limit(0);
    await db.select(pointColumns).from(worldpoint).limit(0);
    await db
        .select({ uid: playerinfo.uid, power: playerinfo.power, armyKill: playerinfo.armyKill })
        .from(playerinfo)
        .limit(0);
    await db
        .select({ uid: stat_reg.uid, type: stat_reg.type, time: stat_reg.time })
        .from(stat_reg)
        .limit(0);
    await db.select({ uid: alliance.uid, abbr: alliance.abbr }).from(alliance).limit(0);
    await db
        .select({ uid: alliance_member.uid, rank: alliance_member.rank })
        .from(alliance_member)
        .limit(0);
}
