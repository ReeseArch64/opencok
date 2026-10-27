import { asc, eq, inArray, and } from "drizzle-orm";
import { receive_item } from "@opencok/drizzle/schema/opencok_kingdom/receive_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { str, decode } from "@opencok/messages/sfs";
import { cityAmount, cityInteger } from "@opencok/rules/city-progression";
import { playerItemGiftRecipient } from "@opencok/rules/player-item-gifts";
import type { PlayerItemGiftWrite } from "@opencok/contracts/player-item-gifts";
import type { MutationTransaction } from "./mutation";
import type { Database } from "./game";

export async function readPlayerItemGifts(
  tx: MutationTransaction,
  owner: string,
  command: string,
  request?: Uint8Array,
) {
  if (command === "item.send") {
    const uid = playerItemGiftRecipient(str(request ? decode(Buffer.from(request)) : {}, "uid"));
    const [recipient] = await tx
      .select({ uid: userprofile.uid, realm: userprofile.serverId })
      .from(userprofile)
      .where(eq(userprofile.uid, uid));

    return { recipient, pending: [] };
  }

  const pending = await tx
    .select()
    .from(receive_item)
    .where(eq(receive_item.uid, owner))
    .orderBy(asc(receive_item.id))
    .limit(64)
    .for("update");

  if (!pending.length) return { pending: [] };

  const senders = await tx
    .select({ uid: userprofile.uid, name: userprofile.name })
    .from(userprofile)
    .where(inArray(userprofile.uid, [...new Set(pending.map((row) => row.senduid))]));
  const names = new Map(senders.map((row) => [row.uid, row.name]));

  return { pending: pending.map((row) => ({ ...row, senderName: names.get(row.senduid) ?? "" })) };
}

export async function writePlayerItemGifts(
  tx: MutationTransaction,
  owner: string,
  write: PlayerItemGiftWrite,
) {
  if (write.send) {
    const gift = write.send;
    playerItemGiftRecipient(gift.uid);

    if (!gift.itemId || gift.itemId.length > 50) throw new Error("Invalid sent gift item");

    await tx.insert(receive_item).values({
      uid: gift.uid,
      senduid: owner,
      itemId: gift.itemId,
      itemNum: 1,
      createTime: cityAmount(gift.createdAt),
    });
  }

  if (write.delivered?.length) {
    const ids = write.delivered.map((id) => cityInteger(id, 1));

    if (ids.length > 64 || new Set(ids).size !== ids.length)
      throw new Error("Invalid received gift selection");

    const removed = await tx
      .delete(receive_item)
      .where(and(eq(receive_item.uid, owner), inArray(receive_item.id, ids)))
      .returning({ id: receive_item.id });

    if (removed.length !== ids.length) throw new Error("Stale received gift selection");
  }
}

export async function pendingPlayerItemGiftOwners(
  db: Database["kingdom"]["db"],
  online: readonly string[],
) {
  if (!online.length) return [];

  if (online.length > 128 || online.some((uid) => playerItemGiftRecipient(uid) !== uid))
    throw new Error("Invalid online gift owner selection");

  const rows = await db
    .selectDistinct({ uid: receive_item.uid })
    .from(receive_item)
    .where(inArray(receive_item.uid, [...online]))
    .orderBy(asc(receive_item.uid))
    .limit(128);

  return rows.map((row) => row.uid);
}
