import type { InventoryState, InventoryItem } from "@opencok/contracts/inventory";
import type { EconomyPosting, MutationEvent } from "@opencok/contracts/mutation";
import type { Rules } from "@opencok/rules/game";
import { continuedCostPeriod, continuedCostAmount } from "@opencok/rules/continued-cost";
import { continuedCostSpending } from "@opencok/mappings/continued-cost";
import { text, type Row } from "@opencok/contracts/rows";

export function confirmedContinuedCost(
  state: InventoryState,
  rules: Rules,
  now: number,
  items: readonly InventoryItem[],
) {
  const period = continuedCostPeriod(rules, state.profile, state.buildings, now);

  if (!period) return undefined;

  const owner = text(state.profile, "uid");

  return (postings: readonly EconomyPosting[]): MutationEvent | undefined => {
    if (postings.some((entry) => entry.account !== owner))
      throw new Error("Foreign continued-cost posting");

    const spent = continuedCostAmount(period.type, postings, items, rules);

    if (!spent.amount) return undefined;

    return {
      id: "continued-cost",
      type: "continuedcost.spend",
      payload: continuedCostSpending({ ...period, ...spent, owner, at: BigInt(now) }),
    };
  };
}

export function confirmedNicknameCost(rules: Rules) {
  return (
    profile: Row,
    buildings: readonly Row[],
    postings: readonly EconomyPosting[],
    now: number,
  ) => {
    const period = continuedCostPeriod(rules, profile, buildings, now);

    if (!period) return;

    const amount = continuedCostAmount(period.type, postings, [], rules);

    if (!amount.amount) return;

    return {
      id: "continued-cost",
      type: "continuedcost.spend",
      payload: continuedCostSpending({
        ...period,
        ...amount,
        owner: text(profile, "uid"),
        at: BigInt(now),
      }),
    };
  };
}
