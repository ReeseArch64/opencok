import { desc, eq, notInArray, sql } from "drizzle-orm";
import { vip_box_turntable } from "@opencok/drizzle/schema/opencok_kingdom/vip_box_turntable";
import { vip_box_history } from "@opencok/drizzle/schema/opencok_kingdom/vip_box_history";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { long, text } from "@opencok/contracts/rows";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import { vipBoxIndices } from "@opencok/rules/vip-box";
import type { VipBoxWrite } from "@opencok/contracts/vip-box";
import type { MutationTransaction } from "./mutation";
export async function readVipBox(tx: MutationTransaction, owner: string) {
  const records = await tx
    .select()
    .from(vip_box_turntable)
    .where(eq(vip_box_turntable.uid, owner))
    .limit(129)
    .for("update");
  if (records.length > 128) throw new Error("Too many owned VIP wheels");
  const history = await tx
    .select()
    .from(vip_box_history)
    .orderBy(desc(vip_box_history.createdAt), desc(vip_box_history.id))
    .limit(50);
  const [server] = await tx.select().from(server_info).where(eq(server_info.uid, "server"));
  return { records, history, openedAt: long(server ?? {}, "activityTime") };
}
export async function writeVipBox(tx: MutationTransaction, owner: string, write: VipBoxWrite) {
  const row = write.record;
  if (row.uid !== owner || text(row, "itemidlist").length > 255)
    throw new Error("Invalid VIP wheel owner");
  const indices = vipBoxIndices(text(row, "itemidlist"), 64),
    value = {
      uid: owner,
      vip: cityInteger(row.vip, 1, 255),
      tableid: cityInteger(row.tableid, 1),
      itemidlist: text(row, "itemidlist"),
      openCount: cityAmount(row.openCount),
      stepNum: cityInteger(row.stepNum, 0, 64),
      free: cityInteger(row.free, 0, 1),
      rewardTime: cityAmount(row.rewardTime),
      refreshTime: cityAmount(row.refreshTime),
    };
  if (indices.length !== value.stepNum || value.stepNum > 0 !== (value.free === 1))
    throw new Error("Invalid VIP wheel progress");
  await tx
    .insert(vip_box_turntable)
    .values(value)
    .onConflictDoUpdate({ target: [vip_box_turntable.uid, vip_box_turntable.vip], set: value });
  if (write.history) {
    const history = write.history;
    if (
      history.uid !== owner ||
      !text(history, "id") ||
      text(history, "id").length > 40 ||
      text(history, "name").length > 40 ||
      text(history, "itemId").length > 40
    )
      throw new Error("Invalid VIP wheel history");
    await tx.execute(
      sql`select pg_advisory_xact_lock(hashtextextended('opencok:vip-box:history', 0))`,
    );
    await tx.insert(vip_box_history).values({
      id: text(history, "id"),
      uid: owner,
      name: text(history, "name"),
      itemId: text(history, "itemId"),
      count: cityInteger(history.count, 1),
      createdAt: cityAmount(history.createdAt),
    });
    const keep = await tx
      .select({ id: vip_box_history.id })
      .from(vip_box_history)
      .orderBy(desc(vip_box_history.createdAt), desc(vip_box_history.id))
      .limit(50);
    await tx.delete(vip_box_history).where(
      notInArray(
        vip_box_history.id,
        keep.map((row) => row.id),
      ),
    );
  }
}
