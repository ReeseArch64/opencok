import { createHash } from "node:crypto";
import { serverFeature } from "./power-context";
import { eventTimestamp } from "./local-events";
import { cityInteger } from "./city-progression";
import { versionAtLeast } from "./availability";
import type { Rules } from "./game";
import type { CostRankingPeriod } from "@opencok/contracts/continued-cost-ranking";

export function costRankingPeriodId(start: bigint, end: bigint, type: number) {
  if (start <= 0n || end <= start || end > 9223372036854775807n)
    throw new Error("Invalid consumption ranking window");

  cityInteger(type, 1, 6);

  return createHash("sha256")
    .update(JSON.stringify([String(start), String(end), type]))
    .digest("hex")
    .slice(0, 32);
}

export function costRankingBands(raw: string) {
  if (!raw || raw.length > 8192) throw new Error("Missing consumption ranking rewards");

  const covered = new Set<number>();
  const bands = raw.split("|").map((part) => {
    const values = part.split(";");

    if (values.length !== 3 || !/^\d{1,12}$/.test(values[2]!))
      throw new Error("Invalid consumption ranking rewards");

    const min = cityInteger(values[0], 1, 100),
      max = cityInteger(values[1], min, 100);

    for (let rank = min; rank <= max; rank++) {
      if (covered.has(rank)) throw new Error("Overlapping consumption ranking rewards");

      covered.add(rank);
    }

    return { min, max, reward: values[2]! };
  });

  if (bands.length > 100) throw new Error("Consumption ranking reward bound exceeded");

  return bands;
}

export function costRankingPlan(
  rules: Rules,
  configured: readonly number[],
): CostRankingPeriod | undefined {
  const panel = rules.power.activityPanels?.get("57159"),
    config = rules.items.get("continued_cost"),
    start = eventTimestamp(panel?.start),
    end = eventTimestamp(panel?.end);

  if (!config || start === undefined || end === undefined || start <= 0n || end <= start) return;

  const type = cityInteger(config.k2, 1, 6),
    rewards = config.k5 ?? "";
  costRankingBands(rewards);
  const census = [...new Set(configured.map((id) => cityInteger(id, 1)))]
    .toSorted((a, b) => a - b)
    .filter((kingdomId) =>
      ["continued_cost", "new_rank_cost"].every(
        (key) =>
          serverFeature(rules, key, { kingdomId, version: "12.06.0", now: Number(start) }) &&
          versionAtLeast("12.06.0", rules.features.get(key)?.version ?? ""),
      ),
    );

  if (census.length > 128) throw new Error("Consumption ranking realm bound exceeded");

  if (!census.includes(rules.kingdomId)) return;

  return {
    id: costRankingPeriodId(start, end, type),
    startTime: start,
    endTime: end,
    type,
    rewards,
    expectedRealms: census,
  };
}

export function verifyCostFactCoverage(
  value: import("@opencok/contracts/continued-cost").ContinuedCostSpending,
  postings: readonly import("@opencok/contracts/rows").Row[],
) {
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
  let amount = 0n,
    paid = 0n,
    free = 0n;

  for (const row of postings) {
    if (row.accountUid !== value.owner) continue;

    const spent = BigInt(String(row.before)) - BigInt(String(row.after)),
      asset = String(row.asset);

    if (spent <= 0n) continue;

    if (value.type === 1 && gold.has(asset)) {
      amount += spent;

      if (["profile.gold", "profile.dmmGold"].includes(asset)) free += spent;
      else paid += spent;
    } else if (value.type === 2 && asset.startsWith("item.")) amount += spent;
    else if (assets[value.type]?.includes(asset)) amount += spent;
  }

  if (
    (value.type === 2 ? amount < value.amount : amount !== value.amount) ||
    paid !== value.paid ||
    free !== value.free
  )
    throw new Error("Consumption fact is not backed by its owned debit postings");
}
