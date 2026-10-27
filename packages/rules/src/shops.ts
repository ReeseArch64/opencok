import type { ShopState } from "@opencok/contracts/shops";
import { long, num, text } from "@opencok/contracts/rows";
import { errors, MOBILE_CLIENT_VERSION } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { Rule, Rules } from "./game.ts";
import { versionAtLeast, featureRealmEnabled } from "./availability.ts";
import { inventoryCount } from "./inventory.ts";

export function shopInteger(value: string | undefined, fallback = 0): number {
  if (value === undefined || value === "") return fallback;

  if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) > 2147483647)
    throw new GameError(errors.unsupported);

  return Number(value);
}

function values(raw: string | undefined): number[] {
  return raw ? raw.split("|").map((value) => shopInteger(value)) : [0];
}

export function shopItemSupported(rules: Rules, id: string | undefined): boolean {
  if (!id || !/^\d+$/.test(id)) return false;

  const item = rules.goods.get(id);
  const numeric = Number(id);

  return Boolean(
    item &&
    !(numeric >= 1000000 && numeric <= 1999999) &&
    !(numeric >= 10000004 && numeric <= 10050555) &&
    !rules.power.equipment?.has(item.para1 ?? ""),
  );
}

export function shopCounters(rule: Rule, state: ShopState) {
  const row = state.purchases.find((entry) => text(entry, "id") === rule.id);
  const time = row ? long(row, "buyTime") : 0n;
  let cycle = row ? long(row, "flushTotalTime") : 0n;
  let total = row ? num(row, "buyTotal") : 0;
  const daily =
    time / 86400000n === BigInt(Math.floor(state.now / 86400000)) && row ? num(row, "buyDaily") : 0;

  if (rule.buy_times_refresh === "2") {
    const start = Number(rule.begin_time ?? "0");
    const interval = inventoryCount(shopInteger(rule.times_refresh)) * 86400000;

    if (!Number.isSafeInteger(start) || start < 0 || start > state.now)
      throw new GameError(errors.unsupported);

    const current = BigInt(start + Math.floor((state.now - start) / interval) * interval);

    if (cycle !== current) total = 0;

    cycle = current;
  }

  const stock = state.stock.find((entry) => text(entry, "id") === rule.id);
  const server = stock ? long(stock, "purchased") : 0n;

  if (
    ![daily, total].every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 2147483647,
    ) ||
    server < 0n ||
    server > 2147483647n ||
    cycle < 0n
  )
    throw new GameError(errors.invalid);

  return { daily, total, cycle, server };
}

export function shopPrice(rule: Rule, daily: number, count: number) {
  inventoryCount(count);
  const tiers = values(rule.buy_times_daily);
  let index = tiers.findIndex((limit) => limit === 0 || daily + count <= limit);

  if (index < 0) throw new GameError(errors.invalid);

  let gold = 0;

  for (const key of ["value1", "value2"]) {
    const prices = values(rule[key]);
    const type = shopInteger(rule[`${key}_type`]);

    if (type !== 0 && type !== 1) throw new GameError(errors.unsupported);

    if (!type && prices.some(Boolean)) throw new GameError(errors.unsupported);

    gold += (prices[Math.min(index, prices.length - 1)] ?? 0) * count;
  }

  if (!Number.isSafeInteger(gold) || gold > 2147483647) throw new GameError(errors.invalid);

  return { gold, index, tiers };
}

export function shopLimit(rule: Rule, state: ShopState, count: number) {
  const counters = shopCounters(rule, state);
  const maximum = shopInteger(
    rule.buy_times_refresh === "2" ? rule.buy_times_refresh_count : rule.buy_times,
  );
  const daily = values(rule.buy_times_daily).at(-1)!;
  const server = shopInteger(rule.total_times);

  if (
    (maximum && counters.total + count > maximum) ||
    (daily && counters.daily + count > daily) ||
    (server && counters.server + BigInt(count) > BigInt(server))
  )
    throw new GameError(errors.invalid);

  if (
    counters.server + BigInt(count) > 2147483647n ||
    counters.total + count > 2147483647 ||
    counters.daily + count > 2147483647
  )
    throw new GameError(errors.invalid);

  return counters;
}

export function shopWindow(rule: Rule, now = Date.now()) {
  if (rule.onsale_type === "2") {
    if (rule.buy_times_refresh === "2" || !rule.begin_time) throw new GameError(errors.unsupported);

    const days = rule.begin_time.split(",").map((value) => shopInteger(value));

    if (!days.length || days.some((day) => day < 1 || day > 7))
      throw new GameError(errors.unsupported);

    const date = new Date(now);

    if (!Number.isFinite(date.getTime())) throw new GameError(errors.unsupported);

    if (!days.includes(date.getUTCDay() + 1)) return { begin: 0, end: 0, closed: true };

    const begin = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const end = begin + shopInteger(rule.sale_life) * 3600000;

    if (!Number.isSafeInteger(end)) throw new GameError(errors.unsupported);

    return { begin, end, closed: false };
  }

  if (!rule.begin_time || rule.begin_time === "0" || rule.buy_times_refresh === "2")
    return { begin: 0, end: 0, closed: false };

  if (!/^\d{12}$/.test(rule.begin_time)) throw new GameError(errors.unsupported);

  const raw = rule.begin_time;
  const begin = Date.UTC(
    Number(raw.slice(0, 4)),
    Number(raw.slice(4, 6)) - 1,
    Number(raw.slice(6, 8)),
    Number(raw.slice(8, 10)),
    Number(raw.slice(10, 12)),
  );
  const end = begin + shopInteger(rule.sale_life) * 3600000;

  if (!Number.isSafeInteger(begin) || !Number.isSafeInteger(end))
    throw new GameError(errors.unsupported);

  return { begin, end, closed: false };
}

export function shopAvailable(rule: Rule, state: ShopState, rules: Rules): boolean {
  if (rule.onsale !== "1") return false;

  if (!rule.id || rule.id.length > 40 || !shopItemSupported(rules, rule.item_id)) return false;

  if (
    rule.value_item &&
    rule.value_item !== "0" &&
    (!shopItemSupported(rules, rule.value_item) || shopInteger(rule.value_item_num) < 1)
  )
    return false;

  if (rule.type2 && rule.type2 !== "0") return false;

  if (["13", "14", "19"].includes(rule.sale_type ?? "")) return false;

  if (
    ["military_rank", "svip_shop_level", "prestige_level", "exp", "discount"].some(
      (key) => rule[key] && rule[key] !== "0",
    )
  )
    return false;

  const profile = state.inventory.profile;

  if (
    rule.version &&
    !versionAtLeast(text(profile, "appVersion") || MOBILE_CLIENT_VERSION, rule.version)
  )
    return false;

  if (rule.server && !featureRealmEnabled(rule.server, rules.kingdomId)) return false;

  const range = (raw: string | undefined, value: number) => {
    if (!raw || raw === "0") return true;

    const limits = raw.split(/[;|]/).map((part) => shopInteger(part));

    return (
      limits.length <= 2 && value >= limits[0]! && (limits.length === 1 || value <= limits[1]!)
    );
  };
  const castle = state.inventory.buildings.find((row) => num(row, "itemId") === 400000);

  if (
    !range(rule.level, num(profile, "level")) ||
    !range(rule.castle_level, castle ? num(castle, "level") + num(castle, "star") : 0)
  )
    return false;

  if (
    rule.civilizations &&
    rule.civilizations !== "0" &&
    !rule.civilizations.split(";").includes(String(num(profile, "civilizationType")))
  )
    return false;

  if (
    rule.country &&
    rule.country !== "0" &&
    !rule.country.split(";").includes(text(profile, "country"))
  )
    return false;

  if (
    (!rule.country || rule.country === "0") &&
    rule.uncountry &&
    rule.uncountry.split(";").includes(text(profile, "country"))
  )
    return false;

  if (state.now < Number(long(profile, "regTime")) + shopInteger(rule.register) * 3600000)
    return false;

  const { begin, end, closed } = shopWindow(rule, state.now);

  if (closed || ((begin || rule.onsale_type === "2") && (state.now < begin || state.now >= end)))
    return false;

  const { gold } = shopPrice(rule, 0, 1);

  if (!gold && (!rule.value_item || rule.value_item === "0")) return false;

  return true;
}
