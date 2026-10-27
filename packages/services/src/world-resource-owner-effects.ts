import type { GameServices } from "@opencok/contracts/game";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import type { WorldResourceLoadEffects } from "@opencok/contracts/world-resource-detail";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import type { RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import { playerGameEffect } from "@opencok/rules/power-resolver";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { resourceOrdinaryLoadEffects } from "@opencok/rules/world-resource-effects";
import { readResourceExpeditionLoadEffect } from "./world-resource-expedition.ts";
import { decodeWorldPowerEffects } from "./power.ts";
import { generalSkillPoints } from "@opencok/hero/services/general-power";
import { resourceGeneralBuildingEffect } from "@opencok/hero/services/general-building-effects";
import { resourceOwnerRuleContext } from "./world-resource-owner-context.ts";

export async function readResourceOwnerLoadEffects(
  snapshot: WorldResourceOwnerSnapshot,
  rules: Rules,
  environment: Omit<RuleContext, "version">,
  services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage">,
  clock: () => bigint,
): Promise<WorldResourceLoadEffects> {
  if (
    !Number.isInteger(environment.kingdomId) ||
    environment.kingdomId < 1 ||
    environment.kingdomId > 2147483647 ||
    !Number.isSafeInteger(environment.now) ||
    !services.worldPowerEffects ||
    snapshot.effects.generals.length > 4096
  )
    {throw new GameError(errors.unsupported, "power_state");}

  const context = resourceOwnerRuleContext(snapshot, environment);
  const state = snapshot.effects;
  const abilities = generalSkillPoints(state.generals);
  const world = worldPowerEffects(
    decodeWorldPowerEffects(await services.worldPowerEffects(context.kingdomId)),
    rules,
    context,
  );
  const emperor = state.throneRewards.length
    ? await services.emperorVersion?.(context.kingdomId)
    : undefined;
  const resolve = (effect: Parameters<typeof playerGameEffect>[6]) =>
    playerGameEffect(state, rules, context, abilities, world, emperor, effect);

  return {
    ...resourceOrdinaryLoadEffects(state, rules, context, abilities, world, emperor),
    newGeneral: resourceGeneralBuildingEffect(snapshot, rules, context, 78, resolve, clock),
    expedition: await readResourceExpeditionLoadEffect(
      state.profile,
      rules,
      context,
      services,
      resolve,
    ),
  };
}
