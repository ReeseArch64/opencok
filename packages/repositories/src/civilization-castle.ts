import { eq } from "drizzle-orm";
import { civilization_castle } from "@opencok/drizzle/schema/opencok_kingdom/civilization_castle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { decode, str } from "@opencok/messages/sfs";
import { num, long, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

export async function readCivilizationCastle(
  tx: MutationTransaction,
  owner: string,
  request?: Uint8Array,
) {
  const [castle] = await tx
    .select()
    .from(civilization_castle)
    .where(eq(civilization_castle.uid, owner))
    .for("update");
  const params = request ? decode(Buffer.from(request)) : {};
  const target = str(params, "targetUid", owner);
  if (str(params, "M__REQUEST_ID__H", "") !== "info" || target === owner || !target)
    return { civilizationCastle: castle };
  const [profile] = await tx.select().from(userprofile).where(eq(userprofile.uid, target));
  if (!profile) throw new Error("Missing civilization castle owner");
  const [foreign] = await tx
    .select()
    .from(civilization_castle)
    .where(eq(civilization_castle.uid, target));
  return {
    civilizationCastle: castle,
    civilizationCastleTarget: { castle: foreign ?? { uid: target, level: 1 }, profile },
  };
}
export async function writeCivilizationCastle(tx: MutationTransaction, owner: string, row: Row) {
  if (row.uid !== owner) throw new Error("Foreign civilization castle write");
  const value = {
    uid: owner,
    level: num(row, "level"),
    pointId: num(row, "pointId"),
    def: num(row, "def"),
    resourceNum: Number(row.resourceNum ?? 0),
    lastOutputTime: long(row, "lastOutputTime"),
    lastSettleTime: long(row, "lastSettleTime"),
    robCount: num(row, "robCount"),
    beRobNum: num(row, "beRobNum"),
    lastRefreshDataTime: long(row, "lastRefreshDataTime"),
    status: num(row, "status"),
    buildTime: long(row, "buildTime"),
  };
  if (
    !Number.isFinite(value.resourceNum) ||
    value.resourceNum < 0 ||
    ![0, 1, 2].includes(value.status)
  )
    throw new Error("Invalid civilization castle");
  await tx
    .insert(civilization_castle)
    .values(value)
    .onConflictDoUpdate({ target: civilization_castle.uid, set: value });
}
