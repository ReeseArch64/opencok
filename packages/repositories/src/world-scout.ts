import { and, eq, inArray } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import type { WorldScoutStore } from "@opencok/contracts/world-scout";
import { worldCityCandidates } from "@opencok/rules/world-city-geometry";
import { readWorldResourceOwner } from "./world-resource-owner";
import type { Database } from "./game";

export function createWorldScoutStore(
    db: Database["kingdom"]["db"],
    size: number,
): WorldScoutStore
{
    return {
        read(observer, point, kingdomId, now)
        {
            return db.transaction(
                async (tx) => {
                    const [profile] = await tx
                            .select()
                            .from(userprofile)
                            .where(eq(userprofile.uid, observer)),
                        [world] = await tx.select().from(user_world).where(
                            eq(user_world.uid, observer),
                        );

                    if (
                        !profile
                        || !world
                        || profile.uid !== observer
                        || world.uid !== observer
                        || profile.serverId !== kingdomId
                        || profile.banFlag !== 0
                        || (profile.banTime ?? 0n) > BigInt(now)
                        || world.worldId !== 0
                    )
                    {
                        return undefined;
                    }

                    const ids = [
                        ...new Set([
                            ...worldCityCandidates(world.pointId, size),
                            ...worldCityCandidates(point, size),
                        ]),
                    ];
                    const points = ids.length
                        ? await tx
                            .select()
                            .from(worldpoint)
                            .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, ids)))
                        : [];
                    const target = points.find((row) => row.id === point),
                        owner = await readWorldResourceOwner(tx, observer);

                    if (!target || !owner)
                    {
                        return undefined;
                    }

                    if (target.ownerId)
                    {
                        const [targetProfile] = await tx
                            .select({ serverId: userprofile.serverId })
                            .from(userprofile)
                            .where(eq(userprofile.uid, target.ownerId));

                        if (targetProfile && targetProfile.serverId !== kingdomId)
                        {
                            return undefined;
                        }
                    }

                    const buildings = await tx
                        .select()
                        .from(user_building)
                        .where(eq(user_building.uid, observer))
                        .limit(4097);
                    const targetCastles = target.ownerId
                        ? await tx
                            .select({ level: user_building.level })
                            .from(user_building)
                            .where(
                                and(
                                    eq(user_building.uid, target.ownerId),
                                    eq(user_building.itemId, 400000),
                                ),
                            )
                            .limit(2)
                        : [];
                    const [barbarian] = target.pointType === 44
                        ? await tx.select().from(world_barbarion).where(
                            eq(world_barbarion.pointId, point),
                        )
                        : [];

                    if (buildings.length > 4096 || targetCastles.length > 1)
                    {
                        throw new Error("Invalid scout quotation aggregate");
                    }

                    return {
                        profile,
                        world,
                        point: target,
                        points,
                        buildings,
                        owner,
                        targetCastle: targetCastles[0],
                        barbarian,
                    };
                },
                { isolationLevel: "repeatable read", accessMode: "read only" },
            );
        },
    };
}
