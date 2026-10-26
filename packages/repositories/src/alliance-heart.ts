import { and, asc, eq, inArray, sql } from "drizzle-orm";
import { receive_heart } from "@opencok/drizzle/schema/opencok_kingdom/receive_heart";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { decode, str } from "@opencok/messages/sfs";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import { cityInteger } from "@opencok/rules/city-progression";
import type { AllianceHeartState, AllianceHeartWrite } from "@opencok/contracts/alliance-heart";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";
export async function readAllianceHeart(
  tx: MutationTransaction,
  owner: string,
  command: string,
  request?: Uint8Array,
): Promise<AllianceHeartState> {
  if (command === "heart.send") {
    const uid = playerItemGiftRecipient(str(request ? decode(Buffer.from(request)) : {}, "uid"));
    await tx.execute(sql`select pg_advisory_xact_lock(728214, 0)`);
    const [recipient] = await tx
      .select({ uid: userprofile.uid, serverId: userprofile.serverId })
      .from(userprofile)
      .where(eq(userprofile.uid, uid));
    const worlds = await tx
      .select()
      .from(user_world)
      .where(inArray(user_world.uid, [owner, uid]));
    const ids = worlds.map((row) => row.pointId).filter((id) => id > 0);
    const points = ids.length
      ? await tx
          .select()
          .from(worldpoint)
          .where(and(eq(worldpoint.worldId, 0), inArray(worldpoint.id, ids)))
          .orderBy(asc(worldpoint.id))
          .for("update")
      : [];
    const members = await tx
      .select({ uid: alliance_member.uid, allianceId: alliance_member.allianceId })
      .from(alliance_member)
      .where(inArray(alliance_member.uid, [owner, uid]));
    return { recipient, worlds, points, members, pending: [] };
  }
  const pending = await tx
    .select()
    .from(receive_heart)
    .where(eq(receive_heart.uid, owner))
    .orderBy(asc(receive_heart.id))
    .limit(64)
    .for("update");
  const senders = pending.length
    ? await tx
        .select({ uid: userprofile.uid, name: userprofile.name })
        .from(userprofile)
        .where(inArray(userprofile.uid, [...new Set(pending.map((row) => row.senduid))]))
    : [];
  const names = new Map(senders.map((row) => [row.uid, row.name]));
  const worlds = await tx.select().from(user_world).where(eq(user_world.uid, owner));
  return {
    worlds,
    points: [],
    members: [],
    pending: pending.map((row) => ({ ...row, senderName: names.get(row.senduid) ?? "" })),
  };
}
export async function writeAllianceHeart(
  tx: MutationTransaction,
  owner: string,
  write: AllianceHeartWrite,
) {
  for (const point of write.points ?? []) {
    const changed = await tx
      .update(worldpoint)
      .set({ sendHeartDurationTime: point.until / 1000n, heartType: point.effect })
      .where(
        and(
          eq(worldpoint.worldId, 0),
          eq(worldpoint.id, point.id),
          eq(worldpoint.ownerId, point.uid),
          eq(worldpoint.pointType, 1),
        ),
      )
      .returning({ id: worldpoint.id });
    if (changed.length !== 1) throw new Error("Stale heart city");
  }
  if (write.pending)
    await tx.insert(receive_heart).values({
      uid: write.pending.uid,
      senduid: owner,
      duration: write.pending.duration,
      effecttype: write.pending.effect,
    });
  if (write.delivered?.length) {
    const ids = write.delivered.map((id) => cityInteger(id, 1));
    if (ids.length > 64 || new Set(ids).size !== ids.length)
      throw new Error("Invalid heart delivery selection");
    const removed = await tx
      .delete(receive_heart)
      .where(and(eq(receive_heart.uid, owner), inArray(receive_heart.id, ids)))
      .returning({ id: receive_heart.id });
    if (removed.length !== ids.length) throw new Error("Stale heart delivery selection");
  }
}
export async function pendingAllianceHeartOwners(
  db: Database["kingdom"]["db"],
  online: readonly string[],
) {
  if (!online.length) return [];
  if (online.length > 128) throw new Error("Heart owner selection exceeds bound");
  const rows = await db
    .selectDistinct({ uid: receive_heart.uid })
    .from(receive_heart)
    .where(inArray(receive_heart.uid, online.map(playerItemGiftRecipient)))
    .orderBy(asc(receive_heart.uid))
    .limit(128);
  return rows.map((row) => row.uid);
}
