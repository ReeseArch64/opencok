import { outgoingTrace } from "@opencok/core/operation";
import { randomUUID } from "node:crypto";
import { and, asc, eq, lte, sql, inArray } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { black_land_res_dead } from "@opencok/drizzle/schema/opencok_kingdom/black_land_res_dead";
import { world_res_dead } from "@opencok/drizzle/schema/opencok_kingdom/world_res_dead";
import { world_resource_runtime } from "@opencok/drizzle/schema/opencok_kingdom/world_resource_runtime";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { encode, sfs } from "@opencok/messages/sfs";
import { num, text, long } from "@opencok/contracts/rows";
import type { WorldResourceRefreshExecutor } from "@opencok/contracts/world-resource-refresh";
import type { Database } from "./game";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority";

export function createWorldResourceRefreshExecutor(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  size = 1201,
  captureTime = Date.now,
): WorldResourceRefreshExecutor {
  let nextExpiry = 0n;

  return {
    async execute(at, work) {
      const next = await db.transaction(async (tx) => {
        await fenceRealmTransaction(tx, authority);
        await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
        const now = at ?? BigInt(captureTime());

        if (now < 0n || now > BigInt(Number.MAX_SAFE_INTEGER))
          throw new Error("Invalid resource clock");

        const [info] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));
        const ready = Boolean(info?.activityTime && info.activityTime <= now);

        if (!ready && now < nextExpiry) return;

        const [clock] = await tx
          .select()
          .from(world_resource_runtime)
          .where(eq(world_resource_runtime.worldId, 0))
          .for("update");
        const changed: number[] = [];
        let expiredCount = 0;
        await work({
          now,
          opening: info?.activityTime ?? 0n,
          goldBonusUntil: info?.resGoldAddEndTime ?? 0n,
          clock,
          expired: async () => {
            const candidates: { id: number; flushTime: bigint | null }[] = [];

            for (let type = 0; type < 6; type++)
              candidates.push(
                ...(await tx
                  .select({ id: worldpoint.id, flushTime: worldpoint.flushTime })
                  .from(worldpoint)
                  .where(
                    and(
                      eq(worldpoint.worldId, 0),
                      eq(worldpoint.pointType, 3),
                      eq(worldpoint.pointItem, String(type)),
                      lte(worldpoint.flushTime, now),
                    ),
                  )
                  .orderBy(asc(worldpoint.flushTime))
                  .limit(64)),
              );

            const selected = candidates
              .sort((a, b) =>
                a.flushTime! < b.flushTime! ? -1 : a.flushTime! > b.flushTime! ? 1 : a.id - b.id,
              )
              .slice(0, 64)
              .map((row) => row.id);
            const rows = selected.length
              ? await tx
                  .select()
                  .from(worldpoint)
                  .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, selected)))
                  .orderBy(asc(worldpoint.flushTime), asc(worldpoint.id))
                  .for("update")
              : [];
            expiredCount = rows.length;

            return rows;
          },
          async pending() {
            const normal = await tx
              .select()
              .from(world_res_dead)
              .where(lte(world_res_dead.deadFinishTime, now))
              .orderBy(asc(world_res_dead.deadFinishTime), asc(world_res_dead.id))
              .limit(64)
              .for("update");
            const black = await tx
              .select()
              .from(black_land_res_dead)
              .where(lte(black_land_res_dead.deadFinishTime, now))
              .orderBy(asc(black_land_res_dead.deadFinishTime), asc(black_land_res_dead.id))
              .limit(64)
              .for("update");

            return [...normal, ...black.map((row) => ({ ...row, areaId: 0, blackLand: 1 }))]
              .sort((a, b) =>
                long(a, "deadFinishTime") < long(b, "deadFinishTime")
                  ? -1
                  : long(a, "deadFinishTime") > long(b, "deadFinishTime")
                    ? 1
                    : text(a, "id").localeCompare(text(b, "id")),
              )
              .slice(0, 64);
          },
          async population(area) {
            if (area === 0) {
              const result = await tx.execute<{ count: string }>(
                sql`SELECT (SELECT count(*) FROM opencok_kingdom.worldpoint WHERE "worldId"=0 AND "pointType"=3 AND "pointItem" IN ('0','1','2','3','4','5') AND coalesce("flushFlag",0)=0 AND x BETWEEN 575 AND 625 AND y BETWEEN 575 AND 625) + (SELECT count(*) FROM opencok_kingdom.black_land_res_dead) AS count`,
              );

              return Number(result.rows[0]!.count);
            }

            const result = await tx.execute<{ count: string }>(
              sql`SELECT (SELECT count(*) FROM opencok_kingdom.worldpoint WHERE "worldId"=0 AND "areaId"=${area} AND "pointType"=3 AND "pointItem" IN ('0','1','2','3','4','5') AND coalesce("flushFlag",0)=0 AND NOT (x BETWEEN 575 AND 625 AND y BETWEEN 575 AND 625)) + (SELECT count(*) FROM opencok_kingdom.world_res_dead WHERE "areaId"=${area}) AS count`,
            );

            return Number(result.rows[0]!.count);
          },
          async free(area) {
            if (area === 0) {
              const [point] = await tx
                .select()
                .from(worldpoint)
                .where(
                  sql`${worldpoint.worldId}=0 AND ${worldpoint.pointType}=0 AND ${worldpoint.gridType}=0 AND ${worldpoint.grid2Type}=0 AND ${worldpoint.resInitValue}=0 AND coalesce(${worldpoint.ownerId},'')='' AND coalesce(${worldpoint.ownerMarchUUid},'')='' AND coalesce(${worldpoint.territoryAlliance},'')='' AND coalesce(${worldpoint.reserve},0)=0 AND coalesce(${worldpoint.trap},'')='' AND ${worldpoint.x} BETWEEN 575 AND 625 AND ${worldpoint.y} BETWEEN 575 AND 625`,
                )
                .orderBy(sql`random()`)
                .limit(1)
                .for("update");

              return point;
            }

            const [point] = await tx
              .select()
              .from(worldpoint)
              .where(
                sql`${worldpoint.worldId}=0 AND ${worldpoint.areaId}=${area} AND ${worldpoint.pointType}=0 AND ${worldpoint.gridType}=2 AND ${worldpoint.grid2Type}=0 AND ${worldpoint.resInitValue}=0 AND NOT (${worldpoint.x}=${Math.trunc((size - 1) / 2)} AND ${worldpoint.y}=${Math.trunc((size - 1) / 2)}) AND coalesce(${worldpoint.ownerId},'')='' AND coalesce(${worldpoint.ownerMarchUUid},'')='' AND coalesce(${worldpoint.territoryAlliance},'')='' AND coalesce(${worldpoint.reserve},0)=0 AND coalesce(${worldpoint.trap},'')='' AND NOT (${worldpoint.x} BETWEEN 575 AND 625 AND ${worldpoint.y} BETWEEN 575 AND 625)`,
              )
              .orderBy(sql`random()`)
              .limit(1)
              .for("update");

            return point;
          },
          async postpone(point, deadline) {
            await tx
              .update(worldpoint)
              .set({ flushTime: deadline })
              .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, num(point, "id"))));
          },
          async clear(point) {
            const id = num(point, "id");
            await tx
              .update(worldpoint)
              .set({
                pointType: 0,
                pointItem: null,
                resLevel: 0,
                resInitValue: 0,
                resCostValue: 0,
                startTime: 0n,
                flushTime: 0n,
                ownerId: "",
                ownerName: "",
                allianceId: "",
                ownerMarchUUid: null,
                monsterInfo: null,
                monsterCurrHP: 0,
                flushFlag: 0,
              })
              .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, id)));
            changed.push(id);
          },
          async ticket(area, level, type, deadline) {
            if (area === 0) {
              await tx.insert(black_land_res_dead).values({
                id: randomUUID().replaceAll("-", ""),
                areaId: 0,
                level,
                deadFinishTime: deadline,
              });

              return;
            }

            await tx.insert(world_res_dead).values({
              id: randomUUID().replaceAll("-", ""),
              areaId: area,
              level,
              pointItem: type,
              deadFinishTime: deadline,
            });
          },
          async retry(ticket, deadline) {
            if (ticket.blackLand) {
              await tx
                .update(black_land_res_dead)
                .set({ deadFinishTime: deadline })
                .where(eq(black_land_res_dead.id, text(ticket, "id")));

              return;
            }

            await tx
              .update(world_res_dead)
              .set({ deadFinishTime: deadline })
              .where(eq(world_res_dead.id, text(ticket, "id")));
          },
          async removeTicket(ticket) {
            if (ticket.blackLand) {
              await tx
                .delete(black_land_res_dead)
                .where(eq(black_land_res_dead.id, text(ticket, "id")));

              return;
            }

            await tx.delete(world_res_dead).where(eq(world_res_dead.id, text(ticket, "id")));
          },
          async spawn(point, type, level, amount, deadline) {
            const id = num(point, "id");
            await tx
              .update(worldpoint)
              .set({
                pointType: 3,
                pointItem: String(type),
                resLevel: level,
                resInitValue: amount,
                resCostValue: 0,
                flushTime: deadline,
                startTime: 0n,
              })
              .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, id)));
            changed.push(id);
          },
          async save(value) {
            await tx
              .insert(world_resource_runtime)
              .values(value)
              .onConflictDoUpdate({ target: world_resource_runtime.worldId, set: value });
          },
        });

        if (changed.length) {
          const id = randomUUID().replaceAll("-", "");
          await tx.insert(mutation_outbox).values({
            traceparent: outgoingTrace(new Headers()).get("traceparent"),
            kingdomId: authority.kingdomId,
            ownerUid: "",
            requestId: `resources:${id}`,
            eventId: id,
            eventType: "world.resources",
            payload: Buffer.from(
              encode({
                owner: sfs.string(""),
                origin: sfs.int(0),
                points: sfs.array(
                  [...new Set(changed)].map((id) => sfs.object({ id: sfs.int(id) })),
                ),
              }),
            ),
            createdAt: now,
            publishedAt: 0n,
          });
        }

        return ready ? undefined : expiredCount === 64 ? now : now + 1800000n;
      });

      if (next !== undefined) nextExpiry = next;
    },
  };
}
