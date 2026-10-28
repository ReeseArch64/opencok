import { and, asc, eq } from "drizzle-orm";
import { world_barbarion } from "@opencok/drizzle/schema/opencok_kingdom/world_barbarion";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import type { WorldDetailReader as Reader } from "../contracts/point-detail-persistence";
import type { WorldExplorationSelector } from "../contracts/world-point-detail";
import type { Row } from "../contracts/rows";
import { integer, validText, single } from "./point-detail-values";

export const barbarianColumns = {
    pointId: world_barbarion.pointId,
    configId: world_barbarion.configId,
    lastArmyMapByteArray: world_barbarion.lastArmyMapByteArray,
    lastBeAttackedTime: world_barbarion.lastBeAttackedTime,
};

export async function readBarbarian(db: Reader, point: Row)
{
    const row = single(
        await db
            .select(barbarianColumns)
            .from(world_barbarion)
            .where(eq(world_barbarion.pointId, point.id as number))
            .limit(2),
    );

    if (
        row
        && (row.pointId !== point.id
            || !validText(row.configId, 255)
            || (row.lastArmyMapByteArray !== null
                && (!Buffer.isBuffer(row.lastArmyMapByteArray)
                    || row.lastArmyMapByteArray.length > 65535)))
    )
    {
        throw new Error("Invalid barbarian state");
    }

    return { row };
}

export const marchColumns = {
    uuid: world_march.uuid,
    ownerUid: world_march.ownerUid,
    targetId: world_march.targetId,
    worldId: world_march.worldId,
    state: world_march.state,
    marchStartTime: world_march.marchStartTime,
    arrivalTime: world_march.arrivalTime,
    exploreTime: world_march.exploreTime,
};

export const resourceMarchColumns = {
    uuid: world_march.uuid,
    ownerUid: world_march.ownerUid,
    targetId: world_march.targetId,
    worldId: world_march.worldId,
    state: world_march.state,
    armyInfo: world_march.armyInfo,
    collectSpd: world_march.collectSpd,
    arrivalTime: world_march.arrivalTime,
    marchArrivalTime: world_march.marchArrivalTime,
    collectedBeforeSpd: world_march.collectedBeforeSpd,
    changeCollectSpdTime: world_march.changeCollectSpdTime,
    occupyResourceEndTime: world_march.occupyResourceEndTime,
    plunderRes: world_march.plunderRes,
};

export async function readResourceMarch(db: Reader, point: Row)
{
    const id = point.ownerMarchUUid;

    if (!validText(id, 40) || !id)
    {
        throw new Error("Invalid resource march pointer");
    }

    const march = single(
        await db
            .select(resourceMarchColumns)
            .from(world_march)
            .where(eq(world_march.uuid, id))
            .limit(2),
    );

    if (march)
    {
        if (
            march.uuid !== id
            || march.ownerUid !== point.ownerId
            || !integer(march.targetId)
            || !integer(march.worldId)
            || (march.state !== null && !integer(march.state))
            || (march.armyInfo !== null
                && (!Buffer.isBuffer(march.armyInfo) || march.armyInfo.length > 65535))
            || (march.plunderRes !== null && !validText(march.plunderRes, 2048))
            || (march.collectSpd !== null
                && (typeof march.collectSpd !== "number"
                    || (Number.isFinite(march.collectSpd)
                        && !Number.isFinite(Math.fround(march.collectSpd)))))
        )
        {
            throw new Error("Invalid resource march state");
        }

        for (
            const field of [
                "arrivalTime",
                "marchArrivalTime",
                "collectedBeforeSpd",
                "changeCollectSpdTime",
                "occupyResourceEndTime",
            ] as const
        )
        {
            const value = march[field];

            if (value !== null && (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value))
            {
                throw new Error("Invalid resource march time");
            }
        }
    }

    return {
        march: march
            ? {
                ...march,
                collectSpd: march.collectSpd === null ? null : Math.fround(march.collectSpd),
            }
            : undefined,
    };
}

export async function readExploration(
    db: Reader,
    observer: string,
    point: Row,
    select: WorldExplorationSelector,
)
{
    const rows = await db
        .select(marchColumns)
        .from(world_march)
        .where(eq(world_march.ownerUid, observer))
        .orderBy(asc(world_march.uuid))
        .limit(4097);

    if (
        rows.length > 4096
        || rows.some((row) => row.ownerUid !== observer || !validText(row.uuid, 40) || !row.uuid)
        || new Set(rows.map((row) => row.uuid)).size !== rows.length
    )
    {
        throw new Error("Invalid exploration marches");
    }

    const id = select(
        Object.freeze({ ...point }),
        Object.freeze(rows.map((row) => Object.freeze({ ...row }))),
    );

    if (id === undefined)
    {
        return { march: undefined };
    }

    const selected = rows.find((row) => row.uuid === id);

    if (!selected || selected.targetId !== point.id || selected.state !== 1)
    {
        throw new Error("Invalid exploration selection");
    }

    const report = single(
        await db
            .select({
                uuid: world_march.uuid,
                ownerUid: world_march.ownerUid,
                exploreReport: world_march.exploreReport,
            })
            .from(world_march)
            .where(and(eq(world_march.uuid, id), eq(world_march.ownerUid, observer)))
            .limit(2),
    );

    if (
        !report
        || report.uuid !== id
        || report.ownerUid !== observer
        || (report.exploreReport !== null
            && (!Buffer.isBuffer(report.exploreReport) || report.exploreReport.length > 65535))
    )
    {
        throw new Error("Invalid exploration report");
    }

    return { march: { ...selected, exploreReport: report.exploreReport } };
}

export async function readNeutralResource(db: Reader, point: Row)
{
    const march = single(
        await db
            .select({
                uuid: world_march.uuid,
                targetId: world_march.targetId,
                worldId: world_march.worldId,
                state: world_march.state,
                occupyResourceEndTime: world_march.occupyResourceEndTime,
            })
            .from(world_march)
            .where(and(eq(world_march.targetId, point.id as number), eq(world_march.state, 1)))
            .orderBy(asc(world_march.uuid))
            .limit(1),
    );

    if (
        march
        && (!validText(march.uuid, 40)
            || !march.uuid
            || march.targetId !== point.id
            || march.state !== 1
            || !integer(march.worldId))
    )
    {
        throw new Error("Invalid neutral resource march");
    }

    return { march };
}
