import { alias } from "drizzle-orm/pg-core";
import { and, asc, eq, inArray, lte, sql } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_totem } from "@opencok/drizzle/schema/opencok_kingdom/user_totem";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { totem_activation } from "@opencok/drizzle/schema/opencok_kingdom/totem_activation";
import { totem_delivery } from "@opencok/drizzle/schema/opencok_kingdom/totem_delivery";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { encode, sfs } from "@opencok/messages/sfs";
import { text, num, long } from "@opencok/contracts/rows";
import type { TotemEffectStore, TotemProgressionWrite } from "@opencok/contracts/totem";
import { restoreTotemConfiguration } from "@opencok/rules/totem";
import type { ActivityEconomy } from "@opencok/contracts/timed-activity";
import { insertSystemMail } from "./system-mail";
import { writePlayerEffects } from "./player-effects";
import type { ProgressionBoundary } from "./city-progression";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";

export async function readTotems(tx: MutationTransaction, owner: string) {
  await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
  const history = await tx
    .select()
    .from(user_totem)
    .where(eq(user_totem.uid, owner))
    .orderBy(asc(user_totem.totemId))
    .limit(1025);
  const active = await tx
    .select()
    .from(totem_activation)
    .where(eq(totem_activation.status, 0))
    .orderBy(asc(totem_activation.id))
    .limit(4097);
  if (history.length > 1024 || active.length > 4096)
    throw new Error("Totem aggregate exceeds bound");
  return { history, active };
}
export async function writeTotems(
  tx: MutationTransaction,
  owner: string,
  write: TotemProgressionWrite,
) {
  for (const row of write.history ?? []) {
    if (row.uid !== owner) throw new Error("Foreign totem history");
    const value = { uid: owner, totemId: num(row, "totemId"), putTime: long(row, "putTime") };
    await tx
      .insert(user_totem)
      .values(value)
      .onConflictDoUpdate({ target: [user_totem.uid, user_totem.totemId], set: value });
  }
  for (const row of write.activations ?? []) {
    if (row.expectedDueAt === undefined) {
      if (row.ownerUid !== owner || num(row, "status") !== 0)
        throw new Error("Foreign totem activation");
      restoreTotemConfiguration(row.payload as Buffer);
      await tx.insert(totem_activation).values({
        id: text(row, "id"),
        ownerUid: owner,
        pointId: num(row, "pointId"),
        totemId: num(row, "totemId"),
        allianceId: text(row, "allianceId"),
        startedAt: long(row, "startedAt"),
        dueAt: long(row, "dueAt"),
        status: 0,
        payload: row.payload as Buffer,
      });
    } else {
      const status = num(row, "status"),
        dueAt = long(row, "dueAt");
      if (
        ![0, 2].includes(status) ||
        (status === 2 && row.ownerUid !== owner) ||
        dueAt > long(row, "expectedDueAt")
      )
        throw new Error("Invalid totem transition");
      const saved = await tx
        .update(totem_activation)
        .set({ dueAt, status })
        .where(
          and(
            eq(totem_activation.id, text(row, "id")),
            eq(totem_activation.ownerUid, text(row, "ownerUid")),
            eq(totem_activation.status, 0),
            eq(totem_activation.dueAt, long(row, "expectedDueAt")),
          ),
        )
        .returning({ id: totem_activation.id });
      if (saved.length !== 1) throw new Error("Stale totem activation");
    }
  }
}
const untouchedEconomy: ActivityEconomy = {
  gold() {
    throw new Error("Unexpected totem currency write");
  },
  resource() {
    throw new Error("Unexpected totem resource write");
  },
  item() {
    throw new Error("Unexpected totem item write");
  },
};
export function createTotemEffectStore(
  tx: MutationTransaction,
  owner: string,
  now: bigint,
  size: number,
  kingdomId: number,
  boundary: ProgressionBoundary,
): TotemEffectStore {
  return {
    async due() {
      const [candidate] = await tx
        .select({ id: totem_activation.id })
        .from(totem_activation)
        .where(and(eq(totem_activation.status, 0), lte(totem_activation.dueAt, now)))
        .limit(1);
      if (!candidate) return [];
      await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
      const rows = await tx
        .select()
        .from(totem_activation)
        .where(and(eq(totem_activation.status, 0), lte(totem_activation.dueAt, now)))
        .orderBy(asc(totem_activation.dueAt), asc(totem_activation.id))
        .limit(64)
        .for("update");
      const result = [];
      for (const activation of rows) {
        const config = restoreTotemConfiguration(activation.payload);
        const x = (activation.pointId - 1) % size,
          y = Math.floor((activation.pointId - 1) / size);
        const cities = await tx
          .select({ uid: userprofile.uid, allianceId: userprofile.allianceId })
          .from(worldpoint)
          .innerJoin(userprofile, eq(userprofile.uid, worldpoint.ownerId))
          .where(
            and(
              eq(worldpoint.worldId, 0),
              eq(worldpoint.pointType, 1),
              eq(userprofile.serverId, kingdomId),
              sql`${worldpoint.x} between ${x - config.range} and ${x + config.range}`,
              sql`${worldpoint.y} between ${y - config.range} and ${y + config.range}`,
            ),
          )
          .limit(2049);
        if (cities.length > 2048) throw new Error("Totem recipient bound exceeded");
        result.push({ activation, cities });
      }
      return result;
    },
    async expire(activation, deliveries, points) {
      const saved = await tx
        .update(totem_activation)
        .set({ status: 1 })
        .where(
          and(
            eq(totem_activation.id, text(activation, "id")),
            eq(totem_activation.status, 0),
            eq(totem_activation.dueAt, long(activation, "dueAt")),
          ),
        )
        .returning({ id: totem_activation.id });
      if (saved.length !== 1) throw new Error("Stale totem expiry");
      const changed = await tx
        .update(worldpoint)
        .set({
          pointType: 0,
          pointItem: null,
          ownerId: "",
          ownerName: "",
          allianceId: "",
          monsterCurrHP: 0,
          fireTime: 0n,
        })
        .where(
          and(
            eq(worldpoint.worldId, 0),
            inArray(worldpoint.id, [...points]),
            inArray(worldpoint.pointType, [64, 65]),
            eq(worldpoint.ownerId, text(activation, "ownerUid")),
          ),
        )
        .returning({ id: worldpoint.id });
      if (changed.length !== points.length) throw new Error("Missing totem footprint");
      for (const delivery of deliveries)
        await tx.insert(totem_delivery).values({
          activationId: text(activation, "id"),
          targetUid: delivery.owner,
          stateId: delivery.stateId,
          appliedAt: 0n,
        });
      await tx.insert(mutation_outbox).values({
        kingdomId,
        ownerUid: text(activation, "ownerUid"),
        requestId: `totem:${text(activation, "id")}`,
        eventId: text(activation, "id"),
        eventType: "totem.world",
        payload: encode({
          owner: sfs.string(text(activation, "ownerUid")),
          origin: sfs.int(num(activation, "pointId")),
          points: sfs.array(points.map((id) => sfs.object({ id: sfs.int(id) }))),
          totems: sfs.array([
            sfs.object({
              pointId: sfs.int(num(activation, "pointId")),
              totemId: sfs.int(num(activation, "totemId")),
              status: sfs.int(3),
            }),
          ]),
        }),
        createdAt: now,
        publishedAt: 0n,
      });
    },
    async pending() {
      const deliveryTable = alias(totem_delivery, "delivery");
      const rows = await tx
        .select({ activation: totem_activation, delivery: deliveryTable })
        .from(deliveryTable)
        .innerJoin(totem_activation, eq(totem_activation.id, deliveryTable.activationId))
        .where(
          and(
            eq(deliveryTable.targetUid, owner),
            eq(deliveryTable.appliedAt, 0n),
            lte(totem_activation.dueAt, now),
          ),
        )
        .orderBy(asc(totem_activation.dueAt), asc(totem_activation.id))
        .limit(64)
        .for("update", { of: deliveryTable });
      return rows.map((row) => ({
        activation: { ...row.activation, targetUid: owner },
        stateId: row.delivery.stateId,
      }));
    },
    async states() {
      return tx.select().from(user_state).where(eq(user_state.uid, owner));
    },
    async apply(delivery, states, deleted, mail, push) {
      if (delivery.activation.targetUid !== owner || mail.owner !== owner)
        throw new Error("Foreign totem delivery");
      const at = long(delivery.activation, "dueAt");
      if (at > now) throw new Error("Early totem delivery");
      if (states.length || deleted.length)
        await boundary(
          tx,
          owner,
          at,
          () => writePlayerEffects(tx, owner, { states, deletedStates: deleted }),
          [],
          untouchedEconomy,
        );
      await insertSystemMail(tx, mail, owner, mail.uid.slice(0, 32), at);
      const changed = await tx
        .update(totem_delivery)
        .set({ appliedAt: now || 1n })
        .where(
          and(
            eq(totem_delivery.activationId, text(delivery.activation, "id")),
            eq(totem_delivery.targetUid, owner),
            eq(totem_delivery.appliedAt, 0n),
          ),
        )
        .returning({ id: totem_delivery.activationId });
      if (changed.length !== 1) throw new Error("Duplicate totem effect");
      if (states.length)
        await tx.insert(mutation_outbox).values({
          kingdomId,
          ownerUid: owner,
          requestId: `totem-state:${text(delivery.activation, "id")}`,
          eventId: text(delivery.activation, "id"),
          eventType: "totem.status",
          payload: Buffer.from(push),
          createdAt: now,
          publishedAt: 0n,
        });
    },
  };
}
export async function pendingTotemOwners(db: Database["kingdom"]["db"], now: bigint) {
  const due = await db
    .select({ owner: totem_activation.ownerUid })
    .from(totem_activation)
    .where(and(eq(totem_activation.status, 0), lte(totem_activation.dueAt, now)))
    .orderBy(asc(totem_activation.dueAt))
    .limit(1);
  const deliveries = await db
    .selectDistinct({ owner: totem_delivery.targetUid })
    .from(totem_delivery)
    .innerJoin(userprofile, eq(userprofile.uid, totem_delivery.targetUid))
    .where(
      and(
        eq(totem_delivery.appliedAt, 0n),
        eq(userprofile.banFlag, 0),
        lte(userprofile.banTime, now),
      ),
    )
    .limit(64);
  return [...new Set([...due, ...deliveries].map((row) => row.owner))];
}
