import { outgoingTrace } from "@opencok/core/operation";
import { randomUUID } from "node:crypto";
import { and, asc, eq, inArray, lt, sql } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_res_new_dead } from "@opencok/drizzle/schema/opencok_kingdom/world_res_new_dead";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { long, num, text, type Row } from "@opencok/contracts/rows";
import type { WorldResourceNewExecutor } from "@opencok/contracts/world-resource-new";
import {
    parseWorldResourceNewClock,
    worldResourceNewFootprint,
    worldResourceNewIdentity,
} from "@opencok/rules/world-resource-new";
import { encode, sfs } from "@opencok/messages/sfs";
import type { DatabaseClient } from "@opencok/drizzle/contracts/database";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

const empty = {
    pointType: 0,
    pointItem: null,
    resLevel: 0,
    resInitValue: 0,
    resCostValue: 0,
    startTime: 0n,
    flushTime: 0n,
    monsterInfo: null,
    ownerMarchUUid: null,
    monsterCurrHP: 0,
    flushFlag: 0,
};

const owned = (point: Row) =>
    Boolean(
        text(point, "ownerId")
            || text(point, "ownerMarchUUid")
            || text(point, "territoryAlliance")
            || num(point, "territoryId")
            || long(point, "reserve")
            || text(point, "trap"),
    );

export function createWorldResourceNewExecutor(
    db: DatabaseClient<"kingdom">,
    authority: RealmAuthority,
    size: number,
    areas: number,
    captureTime = Date.now,
): WorldResourceNewExecutor
{
    return {
        async execute(at, work)
        {
            await db.transaction(async (tx) => {
                await fenceRealmTransaction(tx, authority);
                await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
                authority.assertReady();
                const now = at ?? BigInt(captureTime());

                if (now < 0n || now > BigInt(Number.MAX_SAFE_INTEGER))
                {
                    throw new Error("Invalid shared resource clock");
                }

                const identity = and(
                    eq(trigger_var.type, worldResourceNewIdentity.type),
                    eq(trigger_var.uid, worldResourceNewIdentity.uid),
                    eq(trigger_var.key, worldResourceNewIdentity.key),
                );
                const [saved] = await tx.select().from(trigger_var).where(identity).for("update");
                const clock = saved ? parseWorldResourceNewClock(saved.value, areas) : undefined,
                    changed = new Set<number>();
                const footprint = async (point: Row) => {
                    const id = num(point, "id"),
                        ids = worldResourceNewFootprint(id, size);

                    if (
                        !ids.length
                        || num(point, "x") !== (id - 1) % size
                        || num(point, "y") !== Math.floor((id - 1) / size)
                    )
                    {
                        throw new Error("Invalid shared resource footprint");
                    }

                    return tx
                        .select()
                        .from(worldpoint)
                        .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, ids)))
                        .orderBy(asc(worldpoint.id))
                        .for("update");
                };
                const matches = (point: Row, main: Row) =>
                    num(point, "pointType") === 38
                    && num(point, "x") === (num(point, "id") - 1) % size
                    && num(point, "y") === Math.floor((num(point, "id") - 1) / size)
                    && text(point, "pointItem") === text(main, "pointItem")
                    && num(point, "resInitValue") === num(main, "resInitValue")
                    && !owned(point);
                await work({
                    now,
                    clock,
                    expired: () =>
                        tx
                            .select()
                            .from(worldpoint)
                            .where(
                                and(
                                    eq(worldpoint.worldId, 0),
                                    eq(worldpoint.pointType, 37),
                                    lt(worldpoint.flushTime, now),
                                ),
                            )
                            .orderBy(asc(worldpoint.flushTime), asc(worldpoint.id))
                            .limit(64)
                            .for("update"),
                    async occupied(point)
                    {
                        if (num(point, "monsterCurrHP") !== 0 || owned(point))
                        {
                            return true;
                        }

                        const rows = await footprint(point);

                        if (
                            rows.length !== 4
                            || rows.some((row) =>
                                row.id !== num(point, "id") && !matches(row, point)
                            )
                        )
                        {
                            return true;
                        }

                        const [party] = await tx
                            .select({ id: world_march.uuid })
                            .from(world_march)
                            .where(
                                and(
                                    eq(world_march.worldId, 0),
                                    eq(world_march.targetId, num(point, "id")),
                                    sql`(${world_march.state} IS NULL OR ${world_march.state}<>2)`,
                                ),
                            )
                            .limit(1);

                        return Boolean(party);
                    },
                    async postpone(point, deadline)
                    {
                        if (deadline < 0n || deadline > BigInt(Number.MAX_SAFE_INTEGER))
                        {
                            throw new Error("Invalid shared resource deadline");
                        }

                        const rows = await footprint(point);

                        for (const row of rows)
                        {
                            if (row.id !== num(point, "id") && !matches(row, point))
                            {
                                continue;
                            }

                            await tx
                                .update(worldpoint)
                                .set({ flushTime: deadline })
                                .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, row.id)));
                            changed.add(row.id);
                        }
                    },
                    async clear(point)
                    {
                        const rows = await footprint(point);

                        if (
                            rows.length !== 4
                            || rows.some((row) =>
                                row.id !== num(point, "id") && !matches(row, point)
                            )
                        )
                        {
                            throw new Error("Changed shared resource footprint");
                        }

                        for (const row of rows)
                        {
                            await tx
                                .update(worldpoint)
                                .set(empty)
                                .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, row.id)));
                            changed.add(row.id);
                        }
                    },
                    async clearOrphans()
                    {
                        const rows = await tx
                            .select()
                            .from(worldpoint)
                            .where(
                                and(
                                    eq(worldpoint.worldId, 0),
                                    eq(worldpoint.pointType, 38),
                                    lt(worldpoint.flushTime, now),
                                    sql`${worldpoint.x}>=0 AND ${worldpoint.x}<${size} AND ${worldpoint.y}>=0 AND ${worldpoint.y}<${size} AND ${worldpoint.id}=1+${worldpoint.x}+${worldpoint.y}*${size}`,
                                    sql`coalesce(${worldpoint.ownerId},'')='' AND coalesce(${worldpoint.ownerMarchUUid},'')='' AND coalesce(${worldpoint.territoryAlliance},'')='' AND coalesce(${worldpoint.territoryId},0)=0 AND coalesce(${worldpoint.reserve},0)=0 AND coalesce(${worldpoint.trap},'')='' AND coalesce(${worldpoint.monsterCurrHP},0)=0`,
                                    sql`NOT EXISTS (SELECT 1 FROM opencok_kingdom.worldpoint m WHERE m."worldId"=0 AND m."pointType"=37 AND m.x BETWEEN ${worldpoint.x} AND ${worldpoint.x}+1 AND m.y BETWEEN ${worldpoint.y} AND ${worldpoint.y}+1 AND m.id=1+m.x+m.y*${size})`,
                                ),
                            )
                            .orderBy(asc(worldpoint.flushTime), asc(worldpoint.id))
                            .limit(64)
                            .for("update");

                        for (const row of rows)
                        {
                            if (owned(row))
                            {
                                continue;
                            }

                            await tx
                                .update(worldpoint)
                                .set(empty)
                                .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, row.id)));
                            changed.add(row.id);
                        }

                        return rows.length;
                    },
                    pending: () =>
                        tx
                            .select()
                            .from(world_res_new_dead)
                            .where(lt(world_res_new_dead.deadFinishTime, now))
                            .orderBy(
                                asc(world_res_new_dead.deadFinishTime),
                                asc(world_res_new_dead.id),
                            )
                            .limit(64)
                            .for("update"),
                    async population(area)
                    {
                        const result = await tx.execute<{ count: string; }>(
                            sql`SELECT (SELECT count(*) FROM opencok_kingdom.worldpoint WHERE "worldId"=0 AND "pointType"=37 AND coalesce("flushFlag",0)=0 AND "areaId"=${area} AND coalesce("pointItem",'') IN ('','0','1','2','3','4','5')) + (SELECT count(*) FROM opencok_kingdom.world_res_new_dead WHERE "areaId"=${area} AND coalesce("pointItem",'') IN ('','0','1','2','3','4','5')) AS count`,
                        );

                        return Number(result.rows[0]!.count);
                    },
                    async ticket(point)
                    {
                        await tx.insert(world_res_new_dead).values({
                            id: randomUUID().replaceAll("-", ""),
                            areaId: num(point, "areaId"),
                            level: num(point, "resLevel"),
                            pointItem: text(point, "pointItem") || "0",
                            deadFinishTime: now,
                        });
                    },
                    async retry(ticket)
                    {
                        await tx
                            .update(world_res_new_dead)
                            .set({ deadFinishTime: now + 1800000n })
                            .where(eq(world_res_new_dead.id, text(ticket, "id")));
                    },
                    async removeTicket(ticket)
                    {
                        await tx
                            .delete(world_res_new_dead)
                            .where(eq(world_res_new_dead.id, text(ticket, "id")));
                    },
                    async spawn(area, amount, slots, deadline)
                    {
                        if (deadline > BigInt(Number.MAX_SAFE_INTEGER))
                        {
                            throw new Error("Invalid shared resource deadline");
                        }

                        const free = (name: string) => {
                            const p = sql.raw(name);

                            return sql`${p}."worldId"=0 AND ${p}."areaId"=${area} AND ${p}."pointType"=0 AND ${p}."gridType"=2 AND ${p}."grid2Type"=0 AND ${p}."resInitValue"=0 AND coalesce(${p}."ownerId",'')='' AND coalesce(${p}."ownerMarchUUid",'')='' AND coalesce(${p}."territoryAlliance",'')='' AND coalesce(${p}."territoryId",0)=0 AND coalesce(${p}."reserve",0)=0 AND coalesce(${p}."trap",'')=''`;
                        };
                        const result = await tx.execute<{ id: number; }>(
                            sql`SELECT p.id FROM opencok_kingdom.worldpoint p JOIN opencok_kingdom.worldpoint w ON w.id=p.id-1 AND w."worldId"=0 JOIN opencok_kingdom.worldpoint n ON n.id=p.id-${size} AND n."worldId"=0 JOIN opencok_kingdom.worldpoint nw ON nw.id=p.id-${size}-1 AND nw."worldId"=0 WHERE ${
                                free("p")
                            } AND ${free("w")} AND ${free("n")} AND ${
                                free("nw")
                            } AND p.x>0 AND p.y>0 AND p.x<${size} AND p.y<${size} ORDER BY random() LIMIT 1`,
                        );
                        const candidate = result.rows[0];

                        if (!candidate)
                        {
                            return false;
                        }

                        const ids = worldResourceNewFootprint(candidate.id, size),
                            rows = await tx
                                .select()
                                .from(worldpoint)
                                .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, ids)))
                                .orderBy(asc(worldpoint.id))
                                .for("update");

                        if (
                            rows.length !== 4
                            || rows.some(
                                (row) =>
                                    row.pointType !== 0
                                    || row.gridType !== 2
                                    || row.grid2Type !== 0
                                    || row.resInitValue !== 0
                                    || row.areaId !== area
                                    || row.x !== (row.id - 1) % size
                                    || row.y !== Math.floor((row.id - 1) / size)
                                    || owned(row),
                            )
                        )
                        {
                            return false;
                        }

                        for (const row of rows)
                        {
                            await tx
                                .update(worldpoint)
                                .set({
                                    pointType: row.id === candidate.id ? 37 : 38,
                                    pointItem: "1",
                                    resInitValue: amount,
                                    resCostValue: 0,
                                    resLevel: row.id === candidate.id ? slots : row.resLevel,
                                    flushTime: deadline,
                                    monsterCurrHP: 0,
                                    flushFlag: 0,
                                })
                                .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, row.id)));
                            changed.add(row.id);
                        }

                        return true;
                    },
                    async save(value)
                    {
                        parseWorldResourceNewClock(JSON.stringify(value), areas);
                        await tx
                            .insert(trigger_var)
                            .values({
                                ...worldResourceNewIdentity,
                                value: JSON.stringify(value),
                                refreshtime: now,
                            })
                            .onConflictDoUpdate({
                                target: [trigger_var.type, trigger_var.uid, trigger_var.key],
                                set: { value: JSON.stringify(value), refreshtime: now },
                            });
                    },
                });

                if (changed.size)
                {
                    const id = randomUUID().replaceAll("-", "");
                    await tx.insert(mutation_outbox).values({
                        traceparent: outgoingTrace(new Headers()).get("traceparent"),
                        kingdomId: authority.kingdomId,
                        ownerUid: "",
                        requestId: `shared-resources:${id}`,
                        eventId: id,
                        eventType: "world.resources",
                        payload: Buffer.from(
                            encode({
                                owner: sfs.string(""),
                                origin: sfs.int(0),
                                points: sfs.array(
                                    [...changed].map((id) => sfs.object({ id: sfs.int(id) })),
                                ),
                            }),
                        ),
                        createdAt: now,
                        publishedAt: 0n,
                    });
                }

                authority.assertReady();
            });
        },
    };
}
