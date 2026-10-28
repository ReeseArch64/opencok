import { readWorldScoutTargets, writeWorldScoutMails } from "./world-scout-report";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_pet_dragon } from "@opencok/drizzle/schema/opencok_kingdom/user_pet_dragon";
import { new_general_skill } from "@opencok/drizzle/schema/opencok_kingdom/new_general_skill";
import { writeWorldBarbarianActors } from "./world-barbarian-write";
import { readTreasureMaps, writeTreasureMaps, withTreasureMarchTimes } from "./treasure-map";
import { treasure_map } from "@opencok/drizzle/schema/opencok_kingdom/treasure_map";
import { t_worldboss } from "@opencok/drizzle/schema/opencok_kingdom/t_worldboss";
import { and, asc, eq, inArray, lte, sql, or, isNull } from "drizzle-orm";
import { totem_activation } from "@opencok/drizzle/schema/opencok_kingdom/totem_activation";
import { totemFootprint, restoreTotemConfiguration } from "@opencok/rules/totem";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { world_interest } from "@opencok/drizzle/schema/opencok_kingdom/world_interest";
import type { WorldMutationWrite } from "@opencok/contracts/world-march-runtime";
import { num, long, text } from "@opencok/contracts/rows";
import { decode, encode, int } from "@opencok/messages/sfs";
import { worldCityCandidates } from "@opencok/rules/world-city-geometry";
import { normalizeWorldCityGeometry } from "./world-city-geometry";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import type { MutationTransaction } from "./mutation";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import type { RealmAuthority } from "./realm-authority";
import { fenceRealmTransaction } from "./realm-authority";

export async function readWorldMutationState(
    tx: MutationTransaction,
    owner: string,
    request: Uint8Array | undefined,
    size: number,
    command?: string,
)
{
    await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
    const [world] = await tx.select().from(user_world).where(eq(user_world.uid, owner)).for(
        "update",
    );

    if (!world || world.worldId !== 0)
    {
        throw new Error("Missing resident world owner");
    }

    const marches = await tx
        .select()
        .from(world_march)
        .where(eq(world_march.ownerUid, owner))
        .orderBy(asc(world_march.uuid))
        .limit(257)
        .for("update");
    const checkpoints = await tx
        .select()
        .from(world_march_checkpoint)
        .where(
            and(eq(world_march_checkpoint.ownerUid, owner), eq(world_march_checkpoint.status, 0)),
        )
        .limit(257)
        .for("update");

    if (marches.length > 256 || checkpoints.length > 256)
    {
        throw new Error("World march aggregate exceeds bound");
    }

    const params = request ? decode(Buffer.from(request)) : {};
    const [castle] = command === "civilizationCastle"
        ? await tx
            .select()
            .from(civilization_castle)
            .where(eq(civilization_castle.uid, owner))
            .for("update")
        : [];
    const geometry = await normalizeWorldCityGeometry(
        tx,
        owner,
        size,
        world,
        marches,
        checkpoints,
        castle,
        command !== "world.march.check",
    );
    const ids = new Set<number>();

    if (command === "totem")
    {
        const active = await tx
            .select({ point: totem_activation.pointId, payload: totem_activation.payload })
            .from(totem_activation)
            .where(eq(totem_activation.status, 0))
            .limit(4097);

        if (active.length > 4096)
        {
            throw new Error("Totem map bound exceeded");
        }

        for (const entry of active)
        {
            for (
                const id of totemFootprint(
                    entry.point,
                    restoreTotemConfiguration(entry.payload).width,
                    size,
                )
            )
            {
                ids.add(id);
            }
        }

        const target = int(params, "pointId", 1),
            x = (target - 1) % size,
            y = Math.floor((target - 1) / size);

        if (target > 0 && target <= size * size)
        {
            for (let dx = 0; dx < 4 && x + dx < size; dx++)
            {
                for (let dy = 0; dy < 4 && y + dy < size; dy++)
                {
                    ids.add(target + dx + dy * size);
                }
            }
        }
    }

    for (
        const point of [
            world.pointId,
            castle?.pointId ?? 0,
            ...marches.flatMap((row) => [row.ownerId, row.targetId]),
            int(params, "point", 0),
            command === "create.boss" ? int(params, "pointIndex", 0) : 0,
            command === "totem" ? 0 : int(params, "pointId", 0),
        ]
    )
    {
        if (point > 0)
        {
            for (const id of worldCityCandidates(point, size))
            {
                ids.add(id);
            }
        }
    }

    const points = await tx
        .select()
        .from(worldpoint)
        .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, [...ids])))
        .orderBy(asc(worldpoint.id))
        .for("update");
    const placementClaims = ["totem", "civilizationCastle"].includes(command ?? "") && points.length
        ? await tx
            .select({ id: worldpoint.id })
            .from(worldpoint)
            .where(
                and(
                    eq(worldpoint.worldId, 0),
                    inArray(
                        worldpoint.id,
                        points.map((point) => point.id),
                    ),
                    sql`(EXISTS(SELECT 1 FROM opencok_kingdom.world_march m WHERE m."worldId"=0 AND m."targetId" IN (${worldpoint.id},${worldpoint.id}+1,${worldpoint.id}+${size},${worldpoint.id}+${
                        size + 1
                    })) OR EXISTS(SELECT 1 FROM opencok_kingdom.t_worldboss b WHERE b.point=${worldpoint.id} AND b.status=1) OR EXISTS(SELECT 1 FROM opencok_kingdom.world_barbarion b WHERE b."pointId"=${worldpoint.id}))`,
                ),
            )
        : [];
    const sharedIds = points.filter((row) => row.pointType === 37).map((row) => row.id);
    const sharedMarches = sharedIds.length
        ? await tx
            .select()
            .from(world_march)
            .where(
                and(
                    eq(world_march.worldId, 0),
                    inArray(world_march.targetId, sharedIds),
                    eq(world_march.state, 1),
                ),
            )
            .orderBy(asc(world_march.marchArrivalTime), asc(world_march.uuid))
            .limit(4097)
            .for("update")
        : [];

    if (sharedMarches.length > 4096)
    {
        throw new Error("Shared resource party bound exceeded");
    }

    const sharedOwners = [
        ...new Set(
            sharedMarches.map((row) => row.ownerUid).filter((owner): owner is string =>
                Boolean(owner)
            ),
        ),
    ];
    const sharedCheckpoints = sharedMarches.length
        ? await tx
            .select()
            .from(world_march_checkpoint)
            .where(
                and(
                    inArray(
                        world_march_checkpoint.id,
                        sharedMarches.map((row) => row.uuid),
                    ),
                    eq(world_march_checkpoint.status, 0),
                ),
            )
            .for("update")
        : [];
    const sharedProfiles = sharedOwners.length
        ? await tx.select().from(userprofile).where(inArray(userprofile.uid, sharedOwners))
        : [];
    const sharedArmies = sharedOwners.length
        ? await tx.select().from(user_army).where(inArray(user_army.uid, sharedOwners)).limit(65537)
        : [];
    const sharedDragons = sharedOwners.length
        ? await tx
            .select()
            .from(user_pet_dragon)
            .where(inArray(user_pet_dragon.uid, sharedOwners))
            .limit(65537)
        : [];
    const sharedGeneralSkills = sharedOwners.length
        ? await tx
            .select()
            .from(new_general_skill)
            .where(inArray(new_general_skill.uid, sharedOwners))
            .limit(65537)
        : [];

    if ([sharedArmies, sharedDragons, sharedGeneralSkills].some((rows) => rows.length > 65536))
    {
        throw new Error("Shared resource companion bound exceeded");
    }

    const cityBosses = command === "buy.citydef" || command === "world.user.rcd"
        ? await tx
            .select({
                x: worldpoint.x,
                y: worldpoint.y,
                firerange: t_worldboss.firerange,
                firespeed: t_worldboss.firespeed,
                status: t_worldboss.status,
            })
            .from(t_worldboss)
            .innerJoin(
                worldpoint,
                and(eq(worldpoint.id, t_worldboss.point), eq(worldpoint.worldId, 0)),
            )
            .where(eq(t_worldboss.status, 1))
            .limit(1025)
        : undefined;

    if (cityBosses && cityBosses.length > 1024)
    {
        throw new Error("City fire source aggregate exceeds bound");
    }

    const [targetMarchCount] = command === "world.march.check"
        ? await tx
            .select({ count: sql<number>`count(*)::integer` })
            .from(world_march)
            .where(
                and(
                    eq(world_march.worldId, 0),
                    eq(world_march.targetId, int(params, "point", 0)),
                    inArray(world_march.state, [0, 1]),
                ),
            )
        : [];
    const scoutIds = command !== "world.march.check" && command !== "world.march.retreat"
        ? [
            ...new Set([
                ...marches
                    .filter((row) => row.type === 1 && row.state === 0)
                    .map((row) => row.targetId),
                ...(command === "world.march" && int(params, "type", -1) === 1
                    ? [int(params, "point")]
                    : []),
            ]),
        ]
        : [];
    const [actorRealm] = scoutIds.length
        ? await tx
            .select({ realm: userprofile.serverId })
            .from(userprofile)
            .where(eq(userprofile.uid, owner))
        : [];

    if (scoutIds.length && !actorRealm?.realm)
    {
        throw new Error("Missing scout actor realm");
    }

    return {
        mapSize: size,
        placementClaims: placementClaims.map((point) => point.id),
        scoutTargets: scoutIds.length
            ? await readWorldScoutTargets(tx, scoutIds, actorRealm!.realm!)
            : undefined,
        world,
        points,
        marches,
        checkpoints,
        ...geometry,
        targetMarchCount: targetMarchCount?.count,
        sharedMarches,
        sharedCheckpoints,
        sharedProfiles,
        sharedArmies,
        sharedDragons,
        sharedGeneralSkills,
        cityBosses,
        treasures: await readTreasureMaps(tx, owner),
    };
}

export async function writeWorldMutation(
    tx: MutationTransaction,
    owner: string,
    write: WorldMutationWrite,
)
{
    await writeWorldBarbarianActors(tx, write);
    await writeTreasureMaps(tx, owner, write);

    if (write.scoutMails)
    {
        await writeWorldScoutMails(tx, owner, write.scoutMails);
    }

    if (write.world)
    {
        if (write.world.uid !== owner)
        {
            throw new Error("Foreign world write");
        }

        await tx
            .update(userprofile)
            .set({ worldPoint: num(write.world, "pointId") })
            .where(eq(userprofile.uid, owner));
        await tx
            .update(user_world)
            .set({
                pointId: num(write.world, "pointId"),
                lastMoveCityTime: long(write.world, "lastMoveCityTime"),
                lastCityDefTime: long(write.world, "lastCityDefTime"),
            })
            .where(eq(user_world.uid, owner));
    }

    for (const row of write.points ?? [])
    {
        if (num(row, "worldId") !== 0)
        {
            throw new Error("Foreign world point");
        }

        await tx
            .update(worldpoint)
            .set({
                pointType: num(row, "pointType"),
                flushFlag: row.flushFlag == null ? undefined : num(row, "flushFlag"),
                sendHeartDurationTime: row.sendHeartDurationTime == null
                    ? undefined
                    : long(row, "sendHeartDurationTime"),
                heartType: row.heartType == null ? undefined : text(row, "heartType"),
                monsterCurrHP: num(row, "monsterCurrHP"),
                pointItem: row.pointItem == null ? null : text(row, "pointItem"),
                ownerId: row.ownerId == null ? null : text(row, "ownerId"),
                ownerName: row.ownerName == null ? null : text(row, "ownerName"),
                allianceId: row.allianceId == null ? null : text(row, "allianceId"),
                ownerMarchUUid: row.ownerMarchUUid == null ? null : text(row, "ownerMarchUUid"),
                resCostValue: num(row, "resCostValue"),
                resInitValue: num(row, "resInitValue"),
                resLevel: num(row, "resLevel"),
                startOccupyTime: long(row, "startOccupyTime"),
                startTime: long(row, "startTime"),
                fireTime: long(row, "fireTime"),
                flushTime: long(row, "flushTime"),
                shieldTime: long(row, "shieldTime"),
                cityDefValue: num(row, "cityDefValue"),
            })
            .where(and(eq(worldpoint.id, num(row, "id")), eq(worldpoint.worldId, 0)));
    }

    for (const row of write.marches ?? [])
    {
        if (row.ownerUid !== owner)
        {
            throw new Error("Foreign march write");
        }

        const value = {
            uuid: text(row, "uuid"),
            ownerUid: owner,
            ownerId: num(row, "ownerId"),
            ownerName: text(row, "ownerName"),
            ownerColor: num(row, "ownerColor"),
            allianceId: text(row, "allianceId"),
            type: num(row, "type"),
            honourWatchtower: num(row, "honourWatchtower"),
            slowDown: num(row, "slowDown"),
            targetId: num(row, "targetId"),
            targetType: num(row, "targetType"),
            targetUid: text(row, "targetUid"),
            marchStartTime: long(row, "marchStartTime"),
            marchTime: num(row, "marchTime"),
            marchArrivalTime: long(row, "marchArrivalTime"),
            returnStartTime: long(row, "returnStartTime"),
            arrivalTime: long(row, "arrivalTime"),
            collectSpd: Number(row.collectSpd ?? 0),
            occupyResourceEndTime: long(row, "occupyResourceEndTime"),
            changeCollectSpdTime: long(row, "changeCollectSpdTime"),
            collectedBeforeSpd: long(row, "collectedBeforeSpd"),
            state: num(row, "state"),
            worldId: 0,
            armyInfo: row.armyInfo as Buffer,
            plunderRes: text(row, "plunderRes"),
            blackLandMarchTime: text(row, "blackLandMarchTime"),
            retrieveRes: text(row, "retrieveRes"),
            resLevel: num(row, "resLevel"),
        };
        const [existing] = await tx
            .select({ owner: world_march.ownerUid })
            .from(world_march)
            .where(eq(world_march.uuid, value.uuid));

        if (existing && existing.owner !== owner)
        {
            throw new Error("Foreign march identity");
        }

        await tx
            .insert(world_march)
            .values(value)
            .onConflictDoUpdate({ target: world_march.uuid, set: value });
    }

    for (const timing of write.sharedTimings ?? [])
    {
        if (timing.owner === owner || timing.version !== timing.expectedVersion + 1)
        {
            throw new Error("Invalid shared resource timing");
        }

        const [march] = await tx
            .select()
            .from(world_march)
            .where(
                and(
                    eq(world_march.uuid, timing.id),
                    eq(world_march.ownerUid, timing.owner),
                    eq(world_march.worldId, 0),
                    eq(world_march.targetId, timing.target),
                    eq(world_march.targetType, 37),
                    eq(world_march.state, 1),
                ),
            )
            .for("update");
        const [target] = await tx
            .select()
            .from(worldpoint)
            .where(
                and(
                    eq(worldpoint.worldId, 0),
                    eq(worldpoint.id, timing.target),
                    eq(worldpoint.pointType, 37),
                ),
            );
        const [prior] = await tx
            .select()
            .from(world_march_checkpoint)
            .where(
                and(
                    eq(world_march_checkpoint.id, timing.id),
                    eq(world_march_checkpoint.ownerUid, timing.owner),
                    eq(world_march_checkpoint.version, timing.expectedVersion),
                    eq(world_march_checkpoint.status, 0),
                ),
            )
            .for("update");

        if (!march || !target || !prior)
        {
            throw new Error("Stale shared resource timing");
        }

        const before = decode(prior.payload),
            after = decode(Buffer.from(timing.payload));

        if (
            before.id?.value !== timing.id
            || before.owner?.value !== timing.owner
            || before.target?.value !== timing.target
            || before.targetType?.value !== 37
            || before.phase?.value !== "gathering"
            || after.version?.value !== timing.version
            || after.dueAt?.value !== timing.dueAt
        )
        {
            throw new Error("Invalid shared resource checkpoint");
        }

        const normalize = (body: typeof before) => {
            const { version: _version, dueAt: _dueAt, ...rest } = body;

            return Buffer.from(encode(rest));
        };

        if (!normalize(before).equals(normalize(after)))
        {
            throw new Error("Foreign shared resource mutation");
        }

        await tx
            .update(world_march_checkpoint)
            .set({
                version: timing.version,
                dueAt: timing.dueAt,
                payload: Buffer.from(timing.payload),
            })
            .where(
                and(
                    eq(world_march_checkpoint.id, timing.id),
                    eq(world_march_checkpoint.version, timing.expectedVersion),
                ),
            );
        await tx
            .update(world_march)
            .set({
                occupyResourceEndTime: timing.dueAt,
            })
            .where(eq(world_march.uuid, timing.id));
    }

    for (const row of write.checkpoints ?? [])
    {
        if (row.ownerUid !== owner)
        {
            throw new Error("Foreign march checkpoint");
        }

        const value = {
            id: text(row, "id"),
            ownerUid: owner,
            version: num(row, "version"),
            status: num(row, "status"),
            dueAt: long(row, "dueAt"),
            payload: row.payload as Buffer,
        };

        if (num(row, "expectedVersion") === 0)
        {
            await tx.insert(world_march_checkpoint).values(value);
        }
        else
        {
            const saved = await tx
                .update(world_march_checkpoint)
                .set(value)
                .where(
                    and(
                        eq(world_march_checkpoint.id, value.id),
                        eq(world_march_checkpoint.ownerUid, owner),
                        eq(world_march_checkpoint.version, num(row, "expectedVersion")),
                        eq(world_march_checkpoint.status, 0),
                    ),
                )
                .returning({ id: world_march_checkpoint.id });

            if (saved.length !== 1)
            {
                throw new Error("Stale march checkpoint");
            }
        }
    }

    if (write.deletedMarches?.length)
    {
        await tx
            .delete(world_march)
            .where(
                and(
                    eq(world_march.ownerUid, owner),
                    inArray(world_march.uuid, [...write.deletedMarches]),
                ),
            );
    }
}

export async function dueWorldMarches(
    db: DatabaseClient<"kingdom">,
    now: bigint,
    after?: { dueAt: bigint; id: string; },
)
{
    return db
        .select({
            id: world_march_checkpoint.id,
            owner: world_march_checkpoint.ownerUid,
            version: world_march_checkpoint.version,
            dueAt: world_march_checkpoint.dueAt,
        })
        .from(world_march_checkpoint)
        .where(
            and(
                eq(world_march_checkpoint.status, 0),
                lte(world_march_checkpoint.dueAt, now),
                after
                    ? sql`(${world_march_checkpoint.dueAt},${world_march_checkpoint.id}) > (${after.dueAt},${after.id})`
                    : undefined,
            ),
        )
        .orderBy(asc(world_march_checkpoint.dueAt), asc(world_march_checkpoint.id))
        .limit(64);
}

export function createWorldInterest(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    size: number,
    now = Date.now,
)
{
    return {
        async subscribe(owner: string, x: number, y: number)
        {
            if (
                !Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= size
                || y >= size
            )
            {
                throw new Error("Invalid world interest");
            }

            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                const [world] = await tx.select().from(user_world).where(eq(user_world.uid, owner));

                if (!world || world.worldId !== 0)
                {
                    throw new Error("Foreign world interest");
                }

                const value = { ownerUid: owner, worldId: 0, x, y, updatedAt: BigInt(now()) };
                await tx
                    .insert(world_interest)
                    .values(value)
                    .onConflictDoUpdate({ target: world_interest.ownerUid, set: value });
            });
        },
        async interested(points: readonly number[], owner: string, target: string)
        {
            const rows = await db
                .select()
                .from(world_interest)
                .where(
                    and(
                        eq(world_interest.worldId, 0),
                        sql`${world_interest.updatedAt} >= ${BigInt(now() - 300000)}`,
                    ),
                );

            return [
                ...new Set([
                    owner,
                    ...(target ? [target] : []),
                    ...rows
                        .filter((row) =>
                            points.some(
                                (point) =>
                                    Math.abs(((point - 1) % size) - row.x) < 26
                                    && Math.abs(Math.floor((point - 1) / size) - row.y) < 26,
                            )
                        )
                        .map((row) => row.ownerUid),
                ]),
            ];
        },
        async marches(ids: readonly number[])
        {
            if (!ids.length)
            {
                return [];
            }

            const rows = await db
                .select()
                .from(world_march)
                .where(
                    and(
                        eq(world_march.worldId, 0),
                        or(
                            inArray(world_march.ownerId, [...ids]),
                            inArray(world_march.targetId, [...ids]),
                        ),
                    ),
                )
                .orderBy(asc(world_march.uuid))
                .limit(1025);

            return withTreasureMarchTimes(db, rows);
        },
    };
}

export async function unregisteredWorldMarches(db: DatabaseClient<"kingdom">, after?: string)
{
    return db
        .select({ id: world_march.uuid, owner: world_march.ownerUid })
        .from(world_march)
        .leftJoin(world_march_checkpoint, eq(world_march_checkpoint.id, world_march.uuid))
        .where(
            and(
                eq(world_march.worldId, 0),
                or(
                    and(eq(world_march.type, 1), inArray(world_march.state, [0, 2])),
                    and(
                        eq(world_march.type, 0),
                        or(
                            inArray(world_march.targetType, [3, 37]),
                            and(
                                eq(world_march.targetType, 2),
                                eq(world_march.state, 1),
                                sql`exists (select 1 from ${treasure_map} where ${treasure_map.currentOwner}=${world_march.ownerUid} and ${treasure_map.marchId}=${world_march.uuid} and ${treasure_map.targetId}=${world_march.targetId} and ${treasure_map.state}=1)`,
                            ),
                        ),
                    ),
                ),
                isNull(world_march_checkpoint.id),
                after ? sql`${world_march.uuid}>${after}` : undefined,
            ),
        )
        .orderBy(asc(world_march.uuid))
        .limit(64);
}
