import type { GeneralSkill } from "@opencok/hero/contracts/generals";
import type { PlayerEffectSnapshot } from "@opencok/contracts/power";
import type { WorldResourceLoadEffects } from "@opencok/contracts/world-resource-detail";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { generalSkillEffects } from "@opencok/hero/rules/general-skill-effects";
import { serverFeature } from "./power-context.ts";
import { playerGameEffect } from "./power-resolver.ts";
import { generalContent, generalInteger } from "@opencok/hero/rules/new-general-content";

export function resourceExpeditionConfigured(
  rules: Rules,
  context: RuleContext,
  mergeServer: () => boolean,
): boolean {
  return (
    serverFeature(rules, "tech_newEffect", context) &&
    serverFeature(rules, "17_wk", context) &&
    mergeServer() === false &&
    !serverFeature(rules, "wk_switch_new", context)
  );
}

export function resourceMergeServer(rules: Rules, kingdomId: number): boolean {
  const rule = rules.items.get("merge_server");

  if (!rule) throw new Error("Missing resource merge-server rule");

  return generalContent(rule.k5, ";").map(generalInteger).includes(kingdomId);
}

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
    let state: ReturnType<typeof read> | undefined;

    if (!resourceExpeditionConfigured(rules, context, () => (state = read()).mergeServer)) return 0;

    if (!state) return 0;

    if (state.stage !== 3 || state.homeKingdomId !== context.kingdomId) return 0;

    const value = resolve(895);

    return typeof value === "number" ? Math.fround(value) : 0;
  } catch {
    return 0;
  }
}
