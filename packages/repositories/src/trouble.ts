import { and, desc, eq, notInArray } from "drizzle-orm";
import { trouble_log } from "@opencok/drizzle/schema/opencok_kingdom/trouble_log";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import type { TroubleHistoryWrite } from "@opencok/contracts/trouble";
import type { MutationTransaction } from "./mutation";
export async function readTrouble(tx: MutationTransaction, owner: string, history: boolean) {
  const [world] = await tx
    .select({ point: user_world.pointId, world: user_world.worldId })
    .from(user_world)
    .where(eq(user_world.uid, owner));
  if (world && world.world !== 0) throw new Error("Foreign trouble world");
  return {
    point: world?.point ?? 0,
    history: history
      ? await tx
          .select()
          .from(trouble_log)
          .where(eq(trouble_log.uid, owner))
          .orderBy(desc(trouble_log.id))
          .limit(10)
      : [],
  };
}
export async function writeTrouble(
  tx: MutationTransaction,
  owner: string,
  entry: TroubleHistoryWrite,
) {
  if (entry.username.length > 255 || !/^\d{1,12}$/.test(entry.item))
    throw new Error("Invalid trouble history");
  cityInteger(entry.status, 1);
  await tx.insert(trouble_log).values({
    uid: owner,
    username: entry.username,
    usetime: cityAmount(entry.at),
    statusid: entry.status,
    itemid: entry.item,
  });
  const keep = await tx
    .select({ id: trouble_log.id })
    .from(trouble_log)
    .where(eq(trouble_log.uid, owner))
    .orderBy(desc(trouble_log.id))
    .limit(10);
  await tx.delete(trouble_log).where(
    and(
      eq(trouble_log.uid, owner),
      notInArray(
        trouble_log.id,
        keep.map((row) => row.id),
      ),
    ),
  );
}
