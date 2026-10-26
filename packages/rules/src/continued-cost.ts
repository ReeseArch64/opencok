import { cityAmount, cityInteger } from "./city-progression";
import { eventTimestamp } from "./local-events";
import { serverFeature } from "./power-context";
import { num, type Row } from "@opencok/contracts/rows";
import type { Rules } from "./game";
import type { EconomyPosting } from "@opencok/contracts/mutation";
import type { InventoryItem } from "@opencok/contracts/inventory";
import type { ContinuedCostPeriod } from "@opencok/contracts/continued-cost";
export function continuedCostPeriod(
  rules: Rules,
  profile: Row,
  buildings: readonly Row[],
  now: number,
): ContinuedCostPeriod | undefined {
  const config = rules.items.get("continued_cost"),
    panel = rules.power.activityPanels?.get("57159");
  if (
    !config ||
    !serverFeature(rules, "continued_cost", {
      kingdomId: rules.kingdomId,
      version: "12.06.0",
      now,
    }) ||
    num(profile, "crossFightSrcServerId") > 0
  )
    return;
  const start = eventTimestamp(panel?.start),
    end = eventTimestamp(panel?.end),
    castle = buildings.find((row) => num(row, "itemId") === 400000);
  if (
    start === undefined ||
    end === undefined ||
    start <= 0n ||
    start >= end ||
    BigInt(now) < start ||
    BigInt(now) >= end ||
    num(castle ?? {}, "level") < cityInteger(config.k1 ?? 0)
  )
    return;
  const type = cityInteger(config.k2, 1, 6),
    tiers = [...(rules.advanced.continuedCosts?.values() ?? [])]
      .filter((row) => Number(row.type) === type)
      .map((row) => ({
        level: cityInteger(row.level, 1),
        point: cityAmount(row.point),
        reward: String(row.item ?? ""),
        important: row.important ?? "",
      }))
      .sort((a, b) => a.level - b.level);
  if (
    !tiers.length ||
    tiers.length > 128 ||
    tiers.some(
      (tier, i) =>
        tier.level !== i + 1 ||
        !/^\d{1,12}$/.test(tier.reward) ||
        (i > 0 && tier.point < tiers[i - 1]!.point),
    )
  )
    throw new Error("Invalid continued-cost reward tiers");
  return { start, end, type, face: config.k3 ?? "", tiers };
}
export function continuedCostAmount(
  type: number,
  postings: readonly EconomyPosting[],
  items: readonly InventoryItem[],
  rules: Rules,
) {
  let amount = 0n,
    paid = 0n,
    free = 0n;
  const gold = new Set([
      "profile.gold",
      "profile.paidGold",
      "profile.paidSpecialGold",
      "profile.dmmGold",
      "profile.dmmPaidGold",
      "profile.dmmPaidSpecialGold",
    ]),
    assets: Record<number, readonly string[]> = {
      3: ["resource.wood", "resource.woodbind"],
      4: ["resource.food", "resource.foodbind"],
      5: ["resource.iron", "resource.ironbind"],
      6: ["resource.stone", "resource.stonebind"],
    };
  for (const entry of postings) {
    const spent = entry.before - entry.after;
    if (spent <= 0n) continue;
    if (type === 1 && gold.has(entry.asset)) {
      amount += spent;
      if (["profile.gold", "profile.dmmGold"].includes(entry.asset)) free += spent;
      else paid += spent;
    } else if (type === 2 && entry.asset.startsWith("item.")) {
      const item = items.find((item) => `item.${item.uuid}` === entry.asset);
      if (item && rules.goods.get(item.itemId)?.type === "2") amount += spent;
    } else if (assets[type]?.includes(entry.asset)) amount += spent;
  }
  return { amount: cityAmount(amount), paid: cityAmount(paid), free: cityAmount(free) };
}
export function continuedCostClaims(raw: unknown) {
  const text = String(raw ?? "");
  if (text.length > 40 || (text && !/^(?:,\d+)+$/.test(text)))
    throw new Error("Invalid continued-cost claim flags");
  const values = text
    .split(",")
    .filter(Boolean)
    .map((value) => cityInteger(value, 1));
  if (new Set(values).size !== values.length) throw new Error("Duplicate continued-cost claims");
  return new Set(values);
}
