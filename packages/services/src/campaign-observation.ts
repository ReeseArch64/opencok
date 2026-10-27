import { InventoryPlanner, type InventoryEffects } from "./inventory";
import { activityEconomy } from "./timed-activity";
import { encode } from "@opencok/messages/sfs";
import { campaignObservationFields } from "@opencok/mappings/campaign-observation";
import { campaignTimestamp } from "@opencok/rules/local-campaign";
import { cityInteger } from "@opencok/rules/city-progression";
import type { CampaignObservation } from "@opencok/contracts/campaign-observation";
import type { InventoryPlan, InventoryState } from "@opencok/contracts/inventory";
import type { ActivityEconomy } from "@opencok/contracts/timed-activity";
import type { Rules } from "@opencok/rules/game";

export function campaignInventoryObservations(
  inventory: InventoryPlan,
  semantic?: CampaignObservation,
): readonly CampaignObservation[] {
  const quantities = new Map<string, number>();

  for (const posting of inventory.postings) {
    if (!posting.asset.startsWith("item.") || posting.after <= posting.before) continue;

    const item = inventory.items.find((value) => `item.${value.uuid}` === posting.asset);

    if (!item) throw new Error("Missing confirmed campaign item grant");

    quantities.set(
      item.itemId,
      cityInteger((quantities.get(item.itemId) ?? 0) + Number(posting.after - posting.before), 1),
    );
  }

  return [
    ...[...quantities].map(([itemId, count]) => ({
      code: 40 as const,
      selector: itemId,
      attributes: { key_itemId: itemId, key_itemNum: count },
    })),
    ...(semantic ? [semantic] : []),
  ];
}

export function campaignObservationNeeded(
  rules: Rules,
  events: readonly CampaignObservation[],
  now: number,
) {
  const at = BigInt(now);

  return events.some((event) =>
    (rules.advanced.campaignRules ?? []).some((rule) => {
      if (
        (rule.state ?? 0) < 2 ||
        rule.openType !== 2 ||
        !rule.events.some(
          (candidate) =>
            candidate.code === event.code &&
            (!candidate.parameters || candidate.parameters === event.selector),
        )
      )
        return false;

      const first = rule.conditions[0];

      if (first?.code !== 9) return true;

      const [start, end] = (first.parameters ?? "").split(";");
      const begin = campaignTimestamp(start),
        until = campaignTimestamp(end);

      return begin !== undefined && until !== undefined && at > begin && at < until;
    }),
  );
}

export async function planCampaignObservation(
  state: InventoryState,
  rules: Rules,
  effects: InventoryEffects,
  now: number,
  events: readonly CampaignObservation[],
  dispatch: (request: Uint8Array, economy: ActivityEconomy) => Promise<unknown>,
) {
  const ledger = new InventoryPlanner(state, rules, effects, now);
  await dispatch(encode(campaignObservationFields(events)), activityEconomy(ledger));

  return ledger.result({});
}
