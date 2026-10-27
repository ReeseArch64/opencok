import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { num, long, text, type Row } from "@opencok/contracts/rows";
import type { HotItemOffer } from "@opencok/contracts/hot-item";
import { cityInteger } from "./city-progression";
import { eventTimestamp } from "./local-events";
import { versionAtLeast } from "./availability";
import { serverFeature } from "./power-context";
import type { Rule, Rules } from "./game";

export function hotItemFailure(): never {
  throw new GameError(errors.invalid, "city_progression");
}

export const hotResourceAssets = [
  "wood",
  "stone",
  "iron",
  "food",
  "silver",
  "gold",
  "chip",
  "diamond",
  "crystal",
  undefined,
  "dragon_food",
  "dragon_gold",
  "sandstone",
  "diamondstone",
  "marble",
  "granite",
  "limestone",
] as const;

export function hotItemType(id: string) {
  const value = cityInteger(id);

  return value < 19
    ? 0
    : (value >= 1000000 && value <= 1999999) || (value >= 10000004 && value <= 10050555)
      ? 2
      : 1;
}

export function hotItemOffer(row: Row): HotItemOffer {
  const goodsId = text(row, "goodsId");
  const match = /^(0|[1-9]\d{0,9});([1-9]\d{0,9})$/.exec(goodsId);

  if (!match || goodsId.length > 20 || text(row, "itemId") !== match[1]) hotItemFailure();

  const itemId = match[1]!,
    itemNum = cityInteger(match[2], 1),
    priceType = cityInteger(row.priceType),
    price = cityInteger(row.price, 1);
  const color = cityInteger(row.para1 ?? 0, 0, 127),
    kind = cityInteger(row.type ?? 0, 0, 127),
    quantity = cityInteger(row.num ?? 0),
    priceHot = cityInteger(row.price_hot ?? 0);
  const refreshTime = long(row, "refreshTime");

  if (
    refreshTime < 0n ||
    (hotItemType(itemId) === 0 && !hotResourceAssets[Number(itemId)]) ||
    (priceType < 19 && !hotResourceAssets[priceType])
  )
    hotItemFailure();

  return {
    goodsId,
    itemId,
    itemNum,
    priceType,
    price,
    priceHot,
    num: quantity,
    color,
    kind,
    refreshTime,
  };
}

export function hotOfferRow(owner: string, rule: Rule, now: bigint, kind = 0): Row {
  const goodsId = rule.item ?? "";
  const row = {
    uid: owner,
    goodsId,
    itemId: goodsId.split(";")[0] ?? "",
    num: cityInteger(rule.num, 1),
    priceType: cityInteger(rule.price_type),
    price: cityInteger(rule.price, 1),
    price_hot: cityInteger(rule.price_hot ?? 0),
    para1: cityInteger(rule.color ?? 0, 0, 127),
    refreshTime: now,
    type: kind,
  };
  hotItemOffer(row);

  return row;
}

export function hotItemVersion(rules: Rules, now: bigint): 2 | 3 {
  const store = rules.items.get("store");

  if (!store) hotItemFailure();

  const start = eventTimestamp(store.k10),
    end = eventTimestamp(store.k11);

  return start !== undefined &&
    end !== undefined &&
    start < now &&
    now < end &&
    versionAtLeast("12.06.0", rules.features.get("hotstore")?.version ?? "99999.0.0") &&
    serverFeature(rules, "hotstore", {
      kingdomId: rules.kingdomId,
      version: "12.06.0",
      now: Number(now),
    })
    ? 3
    : 2;
}

export function hotRefreshCost(rules: Rules, count: number) {
  cityInteger(count);
  const rows = (rules.items.get("store")?.k2 ?? "").split("|");

  if (!rows.length || rows.length > 64) hotItemFailure();

  let cost = 0;

  for (const [index, row] of rows.entries()) {
    const parts = row.split(";");

    if (parts.length !== 2) hotItemFailure();

    const threshold = cityInteger(parts[0], 1);
    cost = cityInteger(parts[1]);

    if (count < threshold || index === rows.length - 1) return cost;
  }

  return cost;
}

export interface HotItemFilter {
  now: bigint;
  level: number;
  castle: number;
  refreshCount: number;
  server: Row;
  scores: readonly Row[];
  purchases: readonly Row[];
  quantity: (id: string) => number;
  balance: (asset: string) => bigint;
}

function condition(type: number, raw: string, state: HotItemFilter, rules: Rules): boolean {
  const now = state.now;
  const value = () => cityInteger(raw);
  const ready = state.scores
    .filter((row) => long(row, "readyTime") <= now && long(row, "endTime") > now)
    .sort((a, b) => Number(long(b, "readyTime") - long(a, "readyTime")))[0];

  switch (type) {
    case 1:
      return new Date(Number(now)).getUTCDay() === value();
    case 2:
      return (
        !!ready &&
        num(ready, "id") === 48006 &&
        now / 86400000n - long(ready, "readyTime") / 86400000n === BigInt(value() + 1)
      );
    case 3:
      return !!ready && num(ready, "id") === value();
    case 4:
      return state.scores.some(
        (row) =>
          num(row, "id") === value() &&
          long(row, "readyTime") > (now / 86400000n - 1n) * 86400000n &&
          long(row, "readyTime") < (now / 86400000n) * 86400000n,
      );
    case 5:
    case 6: {
      const at = eventTimestamp(raw);

      if (at === undefined) hotItemFailure();

      return type === 5 ? now > at : now < at;
    }
    case 7:
      return state.castle >= value();
    case 8:
      return state.castle <= value();
    case 9:
    case 10: {
      const start = long(state.server, "shuaguaiActStart"),
        end = start + BigInt(value()) * 86400000n;

      return type === 9 ? now >= start && now <= end : now >= end;
    }
    case 11:
      return state.quantity(raw) > 0;
    case 12:
      return state.level <= value();
    case 13:
      return state.level >= value();
    case 14:
      return state.refreshCount >= value();
    case 15:
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22: {
      const asset = ["wood", "food", "iron", "stone"][Math.floor((type - 15) / 2)]!;
      const balance =
        state.balance(asset) + (asset === "silver" ? 0n : state.balance(`${asset}bind`));

      return type % 2 === 1 ? balance <= BigInt(value()) : balance >= BigInt(value());
    }
    case 23: {
      const rule = rules.advanced.hotItems?.get(raw);

      return !!rule && state.purchases.some((row) => text(row, "goodsId") === rule.item);
    }
    case 24:
    case 25: {
      const at = long(state.server, "lastMergeMillis") + BigInt(value()) * 3600000n;

      return type === 24 ? at > now : at <= now;
    }
    default:
      return hotItemFailure();
  }
}

export function hotItemPool(rules: Rules, state: HotItemFilter, manual: boolean): Rule[] {
  const rows = [...(rules.advanced.hotItems?.values() ?? [])];

  if (!rows.length || rows.length > 4096) hotItemFailure();

  return rows.filter((rule) => {
    if (rule.version && !versionAtLeast("12.06.0", rule.version)) return false;

    if (manual && state.refreshCount < 2 && rule.price_type === "5") return false;

    const clauses = (rule.condition ?? "").split("|").filter(Boolean);

    if (clauses.length > 32) hotItemFailure();

    return clauses.every((clause) => {
      const parts = clause.split(";");

      if (parts.length !== 2) hotItemFailure();

      return condition(cityInteger(parts[0], 1, 25), parts[1]!, state, rules);
    });
  });
}

export function chooseHotItems(
  pool: readonly Rule[],
  count: number,
  purchases: readonly Row[],
  random: (maximum: number) => number,
  routine: boolean,
): Rule[] {
  cityInteger(count, 1, 64);
  const available = pool.filter((rule) => rule.routine === undefined),
    result: Rule[] = [];
  const history = new Map(
    purchases.map((row) => [text(row, "goodsId"), cityInteger(row.buyCount ?? 0)]),
  );

  for (let step = 0; step < count && available.length; step++) {
    const weights = available.map((rule) => {
      const rates = (rule.rate ?? "").split(";");

      if (rates.length > 256) hotItemFailure();

      const index = Math.min(history.get(rule.item ?? "") ?? 0, rates.length - 1);

      return cityInteger(rates[index]);
    });
    const total = weights.reduce((sum, value) => sum + value, 0);

    if (total <= 0) break;

    if (total > 2147483647) hotItemFailure();

    let draw = random(total);

    if (!Number.isInteger(draw) || draw < 0 || draw >= total) hotItemFailure();

    for (let index = 0; index < weights.length; index++) {
      if (draw < weights[index]!) {
        result.push(available.splice(index, 1)[0]!);
        break;
      }

      draw -= weights[index]!;
    }
  }

  if (routine) result.push(...pool.filter((rule) => rule.routine !== undefined));

  if (result.length > 64) hotItemFailure();

  return result;
}

export function hotFallback(rules: Rules, version: 2 | 3, kind: number, count: number): Rule[] {
  const row = rules.items.get(version === 2 ? "new_store_v2" : `new_store_v3_${kind}`);

  if (!row || count > 64) hotItemFailure();

  const lists = ["k1", "k2", "k3", "k4", "k5", "k6"].map((key) => (row[key] ?? "").split("|"));

  return Array.from({ length: count }, (_, index) => ({
    item: lists[0]![index] ?? "",
    num: lists[1]![index] ?? "",
    price_type: lists[2]![index] ?? "",
    price: lists[3]![index] ?? "",
    price_hot: lists[4]![index] ?? "",
    color: lists[5]![index] ?? "",
    merchantGoodsType: String(kind),
  }));
}

export function hotBusinessMan(rules: Rules, now: bigint) {
  const row = rules.items.get("store");

  if (!row) hotItemFailure();

  const days = (row.k4 ?? "").split(";").map((entry) => cityInteger(entry, 0, 1));

  if (days.length !== 7 || !days.includes(1)) hotItemFailure();

  const fixedStart = eventTimestamp(row.k5),
    fixedEnd = eventTimestamp(row.k6);

  if (fixedStart === undefined || fixedEnd === undefined || fixedStart >= fixedEnd)
    hotItemFailure();

  const captured = now + 500n,
    weekday = new Date(Number(captured)).getUTCDay(),
    today = (captured / 86400000n) * 86400000n;
  let start: bigint, end: bigint;

  if (fixedStart <= captured && captured <= fixedEnd) {
    start = fixedStart;
    end = fixedEnd;
  } else {
    let offset = 0;

    while (days[(weekday + offset) % 7] !== 1 && offset < 7) offset++;

    start = today + BigInt(offset) * 86400000n;
    end = start + 86400000n;

    if (start > fixedStart && fixedStart > captured) {
      start = fixedStart;
      end = fixedEnd;
    }
  }

  for (let times = 0; times < 7; times++) {
    if (days[new Date(Number(end)).getUTCDay()] === 1) end += 86400000n;
    else if (end >= fixedStart && end < fixedEnd) end = fixedEnd;
    else break;
  }

  return { start, end, isOpen: cityInteger(row.k7, 0, 1), k8: cityInteger(row.k8) };
}
