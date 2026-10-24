import type { GeneralSkill, PlayerEffectSnapshot } from "@opencok/contracts/power";
import type { WorldResourceLoadEffects } from "@opencok/contracts/world-resource-detail";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { generalSkillEffects } from "./power-attributes.ts";
import { serverFeature } from "./power-context.ts";
import { playerGameEffect } from "./power-resolver.ts";

export function resourceOrdinaryLoadEffects(
  state: PlayerEffectSnapshot,
  rules: Rules,
  context: RuleContext,
  abilities: readonly (readonly GeneralSkill[])[],
  world: ReadonlyMap<number, number>,
  emperorVersion: number | null | undefined,
): Pick<WorldResourceLoadEffects, "worldLoad" | "worldLoadAdd" | "general"> {
  return {
    worldLoad: playerGameEffect(state, rules, context, abilities, world, emperorVersion, 78),
    worldLoadAdd: playerGameEffect(state, rules, context, abilities, world, emperorVersion, 2196),
    general: generalSkillEffects(abilities, rules).get(133) ?? 0,
  };
}

export function resourceExpeditionLoadEffect(
  rules: Rules,
  context: RuleContext,
  read: () => { mergeServer: boolean; stage: number; homeKingdomId: number },
  resolve: (effect: 895) => number,
): number {
  try {
    if (!serverFeature(rules, "tech_newEffect", context) || !serverFeature(rules, "17_wk", context))
      return 0;
    const state = read();
    if (state.mergeServer !== false || serverFeature(rules, "wk_switch_new", context)) return 0;
    if (state.stage !== 3 || state.homeKingdomId !== context.kingdomId) return 0;
    const value = resolve(895);
    return typeof value === "number" ? Math.fround(value) : 0;
  } catch {
    return 0;
  }
}
