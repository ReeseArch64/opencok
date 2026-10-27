import { eq } from "drizzle-orm";
import { user_activity_new } from "@opencok/drizzle/schema/opencok_kingdom/user_activity_new";
import { cityInteger, cityAmount } from "@opencok/rules/city-progression";
import {
  readMonsterExchangeOffers,
  readMonsterExchangeHeader,
  monsterExchangeClaims,
} from "@opencok/rules/monster-exchange";
import { text, num, type Row } from "@opencok/contracts/rows";
import type { MutationTransaction } from "./mutation";

export async function readMonsterExchanges(tx: MutationTransaction, owner: string) {
  const rows = await tx
    .select()
    .from(user_activity_new)
    .where(eq(user_activity_new.uid, owner))
    .limit(65)
    .for("update");

  if (rows.length > 64) {throw new Error("Token exchange aggregate exceeds bound");}

  return rows;
}

export async function writeMonsterExchanges(
  tx: MutationTransaction,
  owner: string,
  rows: readonly Row[],
) {
  if (rows.length > 64 || new Set(rows.map((row) => row.actId)).size !== rows.length)
    {throw new Error("Invalid token exchange writes");}

  for (const row of rows) {
    const id = cityInteger(row.actId, 1),
      offers = readMonsterExchangeOffers(text(row, "rewards")),
      claims = text(row, "receiveLevels"),
      tag = text(row, "reserve_2");

    if (row.uid !== owner) {throw new Error("Foreign token exchange write");}

    if (id === 6) {
      if (!/^monster-adopted:v1:\d{1,10}$/.test(tag))
        {throw new Error("Invalid legacy token exchange adoption");}
    } else {
      if (num(row, "reserve_1") !== 6) {throw new Error("Foreign token exchange slot");}

      readMonsterExchangeHeader(tag);
    }

    monsterExchangeClaims(claims, offers.length);
    const value = {
      level: cityInteger(row.level, 0, offers.length),
      rewards: text(row, "rewards"),
      updateTime: cityAmount(row.updateTime),
      reserve_1: cityInteger(row.reserve_1),
      reserve_2: tag,
      flushTimes: cityInteger(row.flushTimes ?? 0),
      flushDate: cityAmount(row.flushDate ?? 0),
      receiveLevels: claims,
    };
    await tx
      .insert(user_activity_new)
      .values({ uid: owner, actId: id, ...value })
      .onConflictDoUpdate({ target: [user_activity_new.uid, user_activity_new.actId], set: value });
  }
}
