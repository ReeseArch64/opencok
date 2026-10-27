import { asc, eq, gte } from "drizzle-orm";
import { user_hot_item_v2 } from "@opencok/drizzle/schema/opencok_kingdom/user_hot_item_v2";
import { user_hot_item_v3 } from "@opencok/drizzle/schema/opencok_kingdom/user_hot_item_v3";
import { user_hot_item_best } from "@opencok/drizzle/schema/opencok_kingdom/user_hot_item_best";
import { user_hot_item_best_v3 } from "@opencok/drizzle/schema/opencok_kingdom/user_hot_item_best_v3";
import { hot_refresh_record } from "@opencok/drizzle/schema/opencok_kingdom/hot_refresh_record";
import { hot_buy_record } from "@opencok/drizzle/schema/opencok_kingdom/hot_buy_record";
import { server_info } from "@opencok/drizzle/schema/opencok_kingdom/server_info";
import { server_score } from "@opencok/drizzle/schema/opencok_kingdom/server_score";
import type { HotItemState, HotItemWrite } from "@opencok/contracts/hot-item";
import { long, num, text } from "@opencok/contracts/rows";
import { hotItemOffer } from "@opencok/rules/hot-item";
import { cityInteger } from "@opencok/rules/city-progression";
import type { MutationTransaction } from "./mutation";

export async function readHotItems(
  tx: MutationTransaction,
  owner: string,
  now: bigint,
): Promise<HotItemState> {
  const v2 = await tx
    .select()
    .from(user_hot_item_v2)
    .where(eq(user_hot_item_v2.uid, owner))
    .orderBy(asc(user_hot_item_v2.goodsId), asc(user_hot_item_v2.price))
    .limit(65)
    .for("update");
  const v3 = await tx
    .select()
    .from(user_hot_item_v3)
    .where(eq(user_hot_item_v3.uid, owner))
    .orderBy(asc(user_hot_item_v3.goodsId), asc(user_hot_item_v3.price))
    .limit(65)
    .for("update");
  const [bestV2] = await tx
    .select()
    .from(user_hot_item_best)
    .where(eq(user_hot_item_best.uid, owner));
  const [bestV3] = await tx
    .select()
    .from(user_hot_item_best_v3)
    .where(eq(user_hot_item_best_v3.uid, owner));
  const [refresh] = await tx
    .select()
    .from(hot_refresh_record)
    .where(eq(hot_refresh_record.uid, owner))
    .for("update");
  const purchases = await tx
    .select()
    .from(hot_buy_record)
    .where(eq(hot_buy_record.uid, owner))
    .limit(2049)
    .for("update");
  const [server] = await tx
    .select()
    .from(server_info)
    .where(eq(server_info.uid, "server"))
    .for("share");
  const scores = await tx
    .select()
    .from(server_score)
    .where(gte(server_score.endTime, (now / 86400000n - 1n) * 86400000n))
    .orderBy(asc(server_score.uid))
    .limit(129);

  if (v2.length > 64 || v3.length > 64 || purchases.length > 2048 || scores.length > 128)
    throw new Error("Hot item aggregate exceeds bound");

  return { v2, v3, bestV2, bestV3, refresh, purchases, server: server ?? {}, scores };
}

export async function writeHotItems(tx: MutationTransaction, owner: string, write: HotItemWrite) {
  if (write.offers.length > 64 || write.purchases.length > 2048 || ![2, 3].includes(write.version))
    throw new Error("Invalid hot item writes");

  const keys = new Set<string>();

  for (const row of write.offers) {
    const offer = hotItemOffer(row);
    const key = `${offer.goodsId}:${offer.price}`;

    if (row.uid !== owner || keys.has(key)) throw new Error("Foreign or duplicate hot offer");

    keys.add(key);
  }

  if (write.version === 2) {
    await tx.delete(user_hot_item_v2).where(eq(user_hot_item_v2.uid, owner));

    for (const row of write.offers)
      await tx.insert(user_hot_item_v2).values({
        uid: owner,
        goodsId: text(row, "goodsId"),
        itemId: text(row, "itemId"),
        num: num(row, "num"),
        priceType: num(row, "priceType"),
        price: num(row, "price"),
        price_hot: num(row, "price_hot"),
        refreshTime: long(row, "refreshTime"),
        para1: num(row, "para1"),
      });
  } else {
    await tx.delete(user_hot_item_v3).where(eq(user_hot_item_v3.uid, owner));

    for (const row of write.offers)
      await tx.insert(user_hot_item_v3).values({
        uid: owner,
        goodsId: text(row, "goodsId"),
        itemId: text(row, "itemId"),
        num: num(row, "num"),
        priceType: num(row, "priceType"),
        price: num(row, "price"),
        price_hot: num(row, "price_hot"),
        refreshTime: long(row, "refreshTime"),
        para1: num(row, "para1"),
        type: num(row, "type"),
      });
  }

  if (write.best) {
    const row = write.best;

    if (row.uid !== owner || text(row, "goodsId").length > 20)
      throw new Error("Invalid hot best offer");

    const value = {
      uid: owner,
      goodsId: text(row, "goodsId"),
      color: cityInteger(row.color ?? 0, 0, 127),
      price_type: cityInteger(row.price_type),
      price: cityInteger(row.price),
      price_hot: cityInteger(row.price_hot ?? 0),
    };

    if (write.version === 2)
      await tx
        .insert(user_hot_item_best)
        .values(value)
        .onConflictDoUpdate({ target: user_hot_item_best.uid, set: value });
    else
      await tx
        .insert(user_hot_item_best_v3)
        .values(value)
        .onConflictDoUpdate({ target: user_hot_item_best_v3.uid, set: value });
  }

  await tx
    .insert(hot_refresh_record)
    .values({
      uid: owner,
      count: cityInteger(write.refresh.count),
      todayTime: write.refresh.todayTime,
    })
    .onConflictDoUpdate({ target: hot_refresh_record.uid, set: write.refresh });
  await tx.delete(hot_buy_record).where(eq(hot_buy_record.uid, owner));

  for (const row of write.purchases) {
    if (row.uid !== owner || !/^\d{1,10};\d{1,10}$/.test(text(row, "goodsId")))
      throw new Error("Invalid hot purchase history");

    await tx
      .insert(hot_buy_record)
      .values({ uid: owner, goodsId: text(row, "goodsId"), buyCount: cityInteger(row.buyCount) });
  }
}
