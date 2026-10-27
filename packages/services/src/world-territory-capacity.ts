import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import type { GameServices } from "@opencok/contracts/game";
import type { Rules } from "@opencok/rules/game";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import {
  resourceExpeditionConfigured,
  resourceMergeServer,
} from "@opencok/rules/world-resource-effects";
import { javaDecimal } from "@opencok/rules/java-integer";
import { legacyObjectOrder } from "@opencok/messages/legacy-object-order";
import { decodeWorldPowerEffects } from "./power.ts";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { resourceGeneralBuildingEffect } from "@opencok/hero/services/general-building-effects";
import { resourceOwnerRuleContext } from "./world-resource-owner-context.ts";
import { ownerInteger } from "./world-resource-owner-values.ts";

export async function territorySoldierCapacity(
  snapshot: WorldResourceOwnerSnapshot,
  rules: Rules,
  kingdomId: number,
  now: number,
  services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage">,
): Promise<number> {
  if (!services.worldPowerEffects) throw new Error("Missing territory effect reader");

  const context = resourceOwnerRuleContext(snapshot, { kingdomId, now });
  const state = snapshot.effects;
  const world = worldPowerEffects(
    decodeWorldPowerEffects(await services.worldPowerEffects(kingdomId)),
    rules,
    context,
  );
  const emperor = state.throneRewards.length
    ? await services.emperorVersion?.(kingdomId)
    : undefined;
  const abilities = generalSkillPoints(state.generals);
  const memo = new Map<number, number>();
  const effect = (id: Parameters<typeof playerGameEffect>[6]): number => {
    let result = memo.get(id);

    if (result === undefined) {
      result = playerGameEffect(state, rules, context, abilities, world, emperor, id);
      memo.set(id, result);
    }

    return result;
  };
  const general = (id: number, building: number) =>
    resourceGeneralBuildingEffect(
      snapshot,
      rules,
      context,
      id,
      effect,
      () => BigInt(now),
      building,
    );
  let phase: number | undefined;

  try {
    if (resourceExpeditionConfigured(rules, context, () => resourceMergeServer(rules, kingdomId)))
      phase = await services.expeditionStage?.(kingdomId);
  } catch {}

  const origin = ownerInteger(state.profile.crossFightSrcServerId);
  const home = origin === -1 ? ownerInteger(state.profile.serverId) : origin;
  const conditional = (id: 909 | 910 | 911 | 912 | 913 | 2600): number => {
    try {
      if (
        phase !== 8 ||
        ([909, 912].includes(id) && home !== kingdomId) ||
        ([910, 913].includes(id) && home === kingdomId)
      )
        return 0;

      return effect(id);
    } catch {
      return 0;
    }
  };
  const buildings = new Map(snapshot.buildings.map((row) => [String(row.uuid), row]));
  const ordered = legacyObjectOrder([...buildings.keys()]).map((id) => buildings.get(id)!);
  const parameter = (row: (typeof ordered)[number]) => {
    const definition = rules.building(
      String(row.itemId),
      ownerInteger(row.level),
      ownerInteger(row.star),
    );
    const value =
      row.itemId === 427000
        ? definition.effects?.reinforcementCapacity
        : definition.effects?.rallyCapacity;

    if (value === undefined) throw new Error("Missing building capacity");

    return ownerInteger(value);
  };
  const school = ordered
    .filter((row) => row.itemId === 427000)
    .reduce((sum, row) => (sum + parameter(row)) | 0, 0);
  const war = ordered.find((row) => row.itemId === 407000);
  const narrow = (n: number) =>
    Number.isNaN(n) ? 0 : Math.max(-2147483648, Math.min(2147483647, Math.trunc(n))) || 0;
  const add = (n: number, value: number) => narrow(Math.fround(Math.fround(n) + value));
  let maximum = (Number(javaDecimal(rules.items.get("building_base")?.k5, 32)) + school) | 0;
  maximum = add(maximum, Math.fround(effect(56) + effect(171)));
  maximum = add(maximum, general(56, 427000));
  maximum = add(maximum, conditional(911));
  maximum = add(maximum, conditional(2600));
  let extra = narrow(effect(882));
  extra = add(extra, general(882, 427000));
  extra = add(extra, conditional(909));
  extra = add(extra, conditional(910));
  const civilization = ownerInteger(state.profile.civilizationType);
  const civ =
    civilization >= 1 && civilization <= 4
      ? effect((2438 + civilization) as 2439 | 2440 | 2441 | 2442)
      : 0;
  const ratio = Math.fround(Math.fround(Math.fround(100 + effect(8)) + civ) / 100);
  maximum = (narrow(Math.fround(Math.fround(maximum) * ratio)) + extra) | 0;
  const warCapacity = war ? parameter(war) : -1;

  if (warCapacity !== -1) {
    maximum = (maximum + warCapacity) | 0;
    maximum = add(maximum, effect(144));
    maximum = add(maximum, general(144, 407000));
    maximum = add(maximum, conditional(912));
    maximum = add(maximum, conditional(913));
  }

  return maximum;
}
