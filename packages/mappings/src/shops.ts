import type { ShopState } from "@opencok/contracts/shops";
import type { Rule } from "@opencok/rules/game";
import { shopCounters, shopPrice, shopWindow } from "@opencok/rules/shops";
import { sfs, type Fields } from "@opencok/messages/sfs";

export function shopOffer(rule: Rule, state: ShopState): Fields {
  const counters = shopCounters(rule, state);
  const result: Fields = {};

  for (const key of [
    "id",
    "item_id",
    "sale_type",
    "page",
    "sale",
    "price",
    "value1_type",
    "value1",
    "value1_a",
    "value2_type",
    "value2",
    "value2_a",
    "display",
    "total_times",
    "buy_times",
    "buy_times_daily",
    "value_item",
    "value_item_num",
    "type2",
    "svip_shop_level",
    "exp",
    "times_refresh",
    "buy_times_refresh_count",
    "discount",
    "prestige_level",
  ])
    {if (rule[key]) {result[key] = sfs.string(rule[key]);}}

  const { begin, end } = shopWindow(rule, state.now);
  result.todayBuy = sfs.int(counters.daily);
  result.totalBuy = sfs.int(counters.total);
  result.serverTotalBuy = sfs.int(Number(counters.server));
  result.beginTime = sfs.long(BigInt(begin));
  result.endTime = sfs.long(BigInt(end));

  try {
    const { index, tiers } = shopPrice(rule, counters.daily, 1);

    for (const key of ["value1", "value2"]) {
      const prices = (rule[key] ?? "0").split("|");
      const price = prices[Math.min(index, prices.length - 1)]!;
      result[key] = sfs.string(price);

      if (key === "value1" && price !== "0") {result.price = sfs.string(price);}
    }

    result.buy_times_daily = sfs.string(String(tiers[index]));
  } catch {
    result.buy_times_daily = sfs.string(String(counters.daily));
  }

  return result;
}
