import { and, asc, eq } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import type {
    WorldDetailReader as Reader,
    WorldDetailReaders,
} from "../contracts/point-detail-persistence";
import type {
    WorldPointDetailSnapshot,
    WorldCityEffects,
    WorldResourceOwnerIdentity,
} from "../contracts/world-point-detail";
import { readResourceMarch } from "./point-detail-marches";
import { ownerRows } from "./point-detail-owner";
import { integer, blank, single } from "./point-detail-values";

export const pointColumns = {
    id: worldpoint.id,
    worldId: worldpoint.worldId,
    pointType: worldpoint.pointType,
    pointItem: worldpoint.pointItem,
    ownerId: worldpoint.ownerId,
    ownerName: worldpoint.ownerName,
    allianceId: worldpoint.allianceId,
    ownerMarchUUid: worldpoint.ownerMarchUUid,
    resInitValue: worldpoint.resInitValue,
    resCostValue: worldpoint.resCostValue,
    monsterCurrHP: worldpoint.monsterCurrHP,
    territoryAlliance: worldpoint.territoryAlliance,
    active: worldpoint.active,
    reserve: worldpoint.reserve,
};

export async function readPoint<
    TEffects extends WorldCityEffects,
    TOwner extends WorldResourceOwnerIdentity,
>(
    db: Reader,
    id: number,
    worldId: number,
    remote: boolean,
    cityExtras = false,
    resourceEffects = false,
    runtime: WorldDetailReaders<TEffects, TOwner>,
): Promise<
    Pick<WorldPointDetailSnapshot<TEffects, TOwner>, "owner" | "resource" | "resourceGroup"> & {
        point?: Pick<typeof worldpoint.$inferSelect, keyof typeof pointColumns>;
    }
>
{
    const point = single(
        await db
            .select(pointColumns)
            .from(worldpoint)
            .where(and(eq(worldpoint.id, id), eq(worldpoint.worldId, worldId)))
            .limit(2),
    );

    if (!point)
    {
        return {};
    }

    if (point.id !== id || point.worldId !== worldId || !integer(point.pointType))
    {
        throw new Error("Invalid world point");
    }

    const owner = await ownerRows(db, point, remote, cityExtras);
    const resource = (point.pointType === 3 || point.pointType === 37)
            && !blank(point.ownerId)
            && !blank(point.ownerMarchUUid)
        ? await readResourceMarch(db, point)
        : undefined;
    const resourceGroup = resourceEffects && point.pointType === 37
            && (!blank(point.ownerId) || !blank(point.ownerName))
        ? await db
            .select({
                uuid: world_march.uuid,
                targetId: world_march.targetId,
                worldId: world_march.worldId,
                state: world_march.state,
                collectSpd: world_march.collectSpd,
                marchArrivalTime: world_march.marchArrivalTime,
                collectedBeforeSpd: world_march.collectedBeforeSpd,
                changeCollectSpdTime: world_march.changeCollectSpdTime,
                occupyResourceEndTime: world_march.occupyResourceEndTime,
            })
            .from(world_march)
            .where(
                and(
                    eq(world_march.targetId, id),
                    eq(world_march.worldId, worldId),
                    eq(world_march.state, 1),
                ),
            )
            .orderBy(asc(world_march.uuid))
            .limit(4097)
        : undefined;

    if (
        resourceGroup
        && (resourceGroup.length > 4096
            || new Set(resourceGroup.map((row) => row.uuid)).size !== resourceGroup.length)
    )
    {
        throw new Error("Invalid shared resource marches");
    }

    const resourceOwner = resourceEffects && resource?.march
        ? await runtime.readResourceOwner(db, point.ownerId!)
        : undefined;

    return {
        point,
        owner,
        ...(resourceGroup ? { resourceGroup } : {}),
        ...(resource
            ? { resource: { ...resource, ...(resourceOwner ? { owner: resourceOwner } : {}) } }
            : {}),
    };
}
