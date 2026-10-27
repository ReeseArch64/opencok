import { and, eq, inArray, sql } from "drizzle-orm";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { user_lord } from "@opencok/drizzle/schema/opencok_kingdom/user_lord";
import { user_vip } from "@opencok/drizzle/schema/opencok_kingdom/user_vip";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_task } from "@opencok/drizzle/schema/opencok_kingdom/user_task";
import { user_general } from "@opencok/drizzle/schema/opencok_kingdom/user_general";
import { playerinfo } from "@opencok/drizzle/schema/opencok_kingdom/playerinfo";
import { user_assets } from "@opencok/drizzle/schema/opencok_kingdom/user_assets";
import { user_reg } from "@opencok/drizzle/schema/opencok_kingdom/user_reg";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import type { CharacterCreator, ProvisionReceipt } from "@opencok/contracts/provisioning";
import { long } from "@opencok/contracts/rows";
import { provisionHash } from "@opencok/rules/provisioning";
import { fenceRealmTransaction, type RealmAuthority } from "./realm-authority.ts";
import { appendMutationRecords } from "./mutation.ts";
import type { Database } from "./game.ts";

export function createCharacterCreator(
  db: Database["kingdom"]["db"],
  authority: RealmAuthority,
  mapSize: number,
  now = Date.now,
): CharacterCreator {
  if (!Number.isInteger(mapSize) || mapSize < 2 || mapSize > 32767)
    throw new Error("Invalid realm map size");
  return (reservation, plan) =>
    db.transaction(async (tx) => {
      if (reservation.kingdomId !== authority.kingdomId)
        throw new Error("Wrong provisioning realm");
      await fenceRealmTransaction(tx, authority);
      const uid = reservation.gameUid,
        requestHash = provisionHash(reservation);
      await tx.execute(
        sql`select pg_advisory_xact_lock(hashtextextended(${`character:${uid}`}, 0))`,
      );
      const [receipt] = await tx
        .select()
        .from(command_receipt)
        .where(
          and(
            eq(command_receipt.kingdomId, authority.kingdomId),
            eq(command_receipt.ownerUid, uid),
            eq(command_receipt.requestId, "character.create"),
          ),
        );
      if (receipt) {
        if (receipt.command !== "character.create" || receipt.request.toString() !== requestHash)
          throw new Error("Character creation conflict");
        authority.assertReady();
        return JSON.parse(receipt.response.toString()) as ProvisionReceipt;
      }
      if (
        (
          await tx
            .select({ uid: userprofile.uid })
            .from(userprofile)
            .where(eq(userprofile.uid, uid))
        ).length
      )
        throw new Error("Existing character cannot be initialized");
      const captured = now();
      if (!Number.isSafeInteger(captured) || captured < reservation.createdAt)
        throw new Error("Invalid provisioning clock");
      const seed = plan(captured);
      const result = await tx.execute<{ id: number }>(sql`
      SELECT p.id FROM opencok_kingdom.worldpoint p
      JOIN opencok_kingdom.worldpoint e ON e.id = p.id - 1 AND e."worldId" = 0 AND e.x = p.x - 1 AND e.y = p.y
      JOIN opencok_kingdom.worldpoint s ON s.id = p.id - ${mapSize} AND s."worldId" = 0 AND s.x = p.x AND s.y = p.y - 1
      JOIN opencok_kingdom.worldpoint c ON c.id = p.id - ${mapSize + 1} AND c."worldId" = 0 AND c.x = p.x - 1 AND c.y = p.y - 1
      WHERE p."worldId" = 0 AND p.x > 0 AND p.y > 0 AND p.x < ${mapSize} AND p.y < ${mapSize}
      AND p.id = 1 + p.x + p.y * ${mapSize}
      AND p."pointType" = 0 AND e."pointType" = 0 AND s."pointType" = 0 AND c."pointType" = 0
      AND p."gridType" = 0 AND e."gridType" = 0 AND s."gridType" = 0 AND c."gridType" = 0
      AND p."grid2Type" = 0 AND e."grid2Type" = 0 AND s."grid2Type" = 0 AND c."grid2Type" = 0
      AND coalesce(p."ownerId", '') = '' AND coalesce(e."ownerId", '') = '' AND coalesce(s."ownerId", '') = '' AND coalesce(c."ownerId", '') = ''
      AND coalesce(p."territoryAlliance", '') = '' AND coalesce(e."territoryAlliance", '') = '' AND coalesce(s."territoryAlliance", '') = '' AND coalesce(c."territoryAlliance", '') = ''
      AND coalesce(p.reserve, 0) = 0 AND coalesce(e.reserve, 0) = 0 AND coalesce(s.reserve, 0) = 0 AND coalesce(c.reserve, 0) = 0
      ORDER BY p.id LIMIT 1 FOR UPDATE OF p,e,s,c SKIP LOCKED
    `);
      const point = result.rows[0]?.id;
      if (!point) throw new Error("No available initial city location");
      await tx
        .insert(userprofile)
        .values({ ...seed.profile, worldPoint: point } as typeof userprofile.$inferInsert);
      await tx.insert(user_resource).values(seed.resource as typeof user_resource.$inferInsert);
      await tx
        .insert(user_building)
        .values(seed.buildings as (typeof user_building.$inferInsert)[]);
      await tx.insert(queue).values(seed.queues as (typeof queue.$inferInsert)[]);
      await tx.insert(user_lord).values(seed.lord as typeof user_lord.$inferInsert);
      await tx.insert(user_vip).values(seed.vip as typeof user_vip.$inferInsert);
      await tx.insert(user_state).values(seed.shield as typeof user_state.$inferInsert);
      if (seed.tasks.length)
        await tx.insert(user_task).values(seed.tasks as (typeof user_task.$inferInsert)[]);
      if (seed.generals.length)
        await tx.insert(user_general).values(seed.generals as (typeof user_general.$inferInsert)[]);
      await tx.insert(playerinfo).values(seed.player as typeof playerinfo.$inferInsert);
      await tx.insert(user_assets).values({ uid, lastUpdateTime: BigInt(captured) });
      await tx.insert(user_reg).values({
        uid,
        appVersion: String(seed.profile.appVersion),
        deviceId: reservation.deviceUuid,
      });
      await tx.insert(user_world).values({
        uid,
        pointId: point,
        worldId: 0,
        color: seed.color,
        lastCityDefTime: BigInt(captured),
        attMonsterStamina: seed.stamina,
        lastStaminaTime: 9223372036854775807n,
      });
      await tx
        .update(worldpoint)
        .set({
          pointType: 1,
          sendHeartDurationTime: 0n,
          heartType: "",
          ownerId: uid,
          ownerName: reservation.name,
          allianceId: "",
          resLevel: 1,
          cityDefValue: seed.cityDefense,
          shieldTime: seed.shieldEnd,
          resourceShieldTime: 0n,
          startOccupyTime: 0n,
          fireTime: 0n,
          ownerMarchUUid: null,
        })
        .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, point)));
      await tx
        .update(worldpoint)
        .set({ pointType: 8, ownerId: uid, pointItem: String(point) })
        .where(
          and(
            eq(worldpoint.worldId, 0),
            inArray(worldpoint.id, [point - 1, point - mapSize, point - mapSize - 1]),
          ),
        );
      const response: ProvisionReceipt = {
        gameUid: uid,
        kingdomId: authority.kingdomId,
        requestHash,
      };
      await appendMutationRecords(
        tx,
        authority,
        {
          owner: uid,
          requestId: "character.create",
          command: "character.create",
          request: Buffer.from(requestHash),
        },
        {
          response: Buffer.from(JSON.stringify(response)),
          postings: [
            {
              account: uid,
              asset: "profile.gold",
              before: 0n,
              after: long(seed.profile, "gold"),
              reason: "character.create",
            },
            {
              account: uid,
              asset: "resource.wood",
              before: 0n,
              after: long(seed.resource, "wood"),
              reason: "character.create",
            },
            {
              account: uid,
              asset: "resource.food",
              before: 0n,
              after: long(seed.resource, "food"),
              reason: "character.create",
            },
          ],
          events: [
            {
              id: "character",
              type: "character.created",
              payload: Buffer.from(JSON.stringify(response)),
            },
          ],
        },
        BigInt(captured),
      );
      authority.assertReady();
      return response;
    });
}
