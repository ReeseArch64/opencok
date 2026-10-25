import { progressionEffectIds, type ProgressionEffectId } from "./city-progression";
import type { GeneralSkill, PlayerEffectSnapshot } from "@opencok/contracts/power";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import type { NewGeneralEquipmentModifier } from "./new-general-equipment.ts";
import { equipmentEffects, equipmentSetEffects, generalSkillEffects } from "./power-attributes.ts";
import { heroEffects, dragonSkillEffects } from "./power-companions.ts";
import { storedPowerEffects } from "./power-effects.ts";
import { luckyDayEffects } from "./power-lucky-day.ts";
import { allianceScienceEffects, vipEffects } from "./power-memberships.ts";
import { officeEffects } from "./power-office.ts";
import { militaryEffects, miracleEffects, prestigeEffects } from "./power-progression.ts";
import { territoryTreeEffects } from "./power-territory.ts";
import { personalThroneEffect } from "./power-throne.ts";
import { effectFloat as float, invalidEffect as invalid } from "./power-values.ts";

export function playerGameEffect(
  state: PlayerEffectSnapshot,
  rules: Rules,
  context: RuleContext,
  abilities: readonly (readonly GeneralSkill[])[],
  world: ReadonlyMap<number, number>,
  emperorVersion: number | null | undefined,
  effect:
    | 158
    | 159
    | 160
    | 100
    | 101
    | 102
    | 103
    | 104
    | 8
    | 56
    | 144
    | 171
    | 882
    | 909
    | 910
    | 911
    | 912
    | 913
    | 2439
    | 2440
    | 2441
    | 2442
    | 2600
    | 37
    | 38
    | 50
    | 51
    | 52
    | 53
    | 64
    | 72
    | 78
    | 487
    | 895
    | 899
    | 2024
    | 2196
    | 2804
    | 2805
    | 2806
    | 2807
    | NewGeneralEquipmentModifier
    | ProgressionEffectId,
): number {
  if (
    ![
      158,
      159,
      160,
      100,
      101,
      102,
      103,
      104,
      8,
      56,
      144,
      171,
      882,
      909,
      910,
      911,
      912,
      913,
      2439,
      2440,
      2441,
      2442,
      2600,
      37,
      38,
      50,
      51,
      52,
      53,
      64,
      72,
      78,
      207,
      208,
      209,
      210,
      211,
      212,
      213,
      ...progressionEffectIds,
      214,
      215,
      216,
      217,
      218,
      487,
      895,
      899,
      2024,
      2196,
      2804,
      2805,
      2806,
      2807,
    ].includes(effect)
  )
    return invalid();
  const vip = vipEffects(state.vip, rules, context.now);
  const general = generalSkillEffects(abilities, rules);
  const alliance = allianceScienceEffects(state.allianceSciences, rules);
  const office = officeEffects(state.office, state.kingdomFights, world, rules, context);
  const territory = territoryTreeEffects(state.profile, state.territoryTrees, rules);
  const hero = heroEffects(state.heroes, rules, context);
  const dragon = dragonSkillEffects(state.dragons, state.dragonSkills, rules, context);
  const military = militaryEffects(state.military, rules, context);
  const prestige = prestigeEffects(state.profile, state.prestige, rules, context);
  const miracle = miracleEffects(state.miracle, rules, context);
  const lucky = luckyDayEffects(state.profile, state.luckyDay, state.powerServer, rules, context);
  const early = { ...state, sagaSciences: [], foreignSciences: [], civilizationSciences: [] };
  const earlyEffects = new Map<number, ReturnType<typeof storedPowerEffects>>();
  const finalEffects = new Map<number, ReturnType<typeof storedPowerEffects>>();
  const stored = (id: number, loadingEquipment: boolean) => {
    const cache = loadingEquipment ? earlyEffects : finalEffects;
    let result = cache.get(id);
    if (!result) {
      result = storedPowerEffects(loadingEquipment ? early : state, rules, context.now, id);
      cache.set(id, result);
    }
    return result;
  };
  const resolve = (
    id: number,
    equipment: ReadonlyMap<number, number>,
    loadingEquipment: boolean,
  ): number => {
    const base = stored(id, loadingEquipment);
    let equipped = equipment.get(id) ?? 0;
    if (id !== 218)
      equipped = float(
        equipped * float(1 + float(resolve(218, equipment, loadingEquipment) / 100)),
      );
    let other = float((vip.get(id) ?? 0) + float(base.status));
    for (const value of [
      general.get(id),
      alliance.get(id),
      office.get(id),
      equipped,
      territory.get(id),
      world.get(id),
      hero.get(id),
    ])
      other = float(other + float(value ?? 0));
    other = float(other + float(loadingEquipment ? 0 : (lucky.get(id) ?? 0)));
    other = float(other + (dragon.get(id) ?? 0));
    other = float(other + float(loadingEquipment ? 0 : (military.get(id) ?? 0)));
    other = float(other + (prestige.get(id) ?? 0));
    other = float(other + (miracle.get(id) ?? 0));
    const initial = loadingEquipment
      ? base.initialAndScience
      : personalThroneEffect(
          state.throneRewards,
          emperorVersion,
          rules,
          id,
          base.initialAndScience,
        );
    return float(initial + other);
  };
  const equipment = equipmentEffects(state.equipment, rules, (id, loaded) =>
    resolve(id, loaded, true),
  );
  const selection = state.profile.decomposeSuitEffect ?? state.profile.decomposesuiteffect;
  if (selection !== undefined && selection !== null && typeof selection !== "string")
    return invalid();
  const complete = equipmentSetEffects(state.equipment, selection, rules, context, equipment);
  return resolve(effect, complete, false);
}

export function dragonAttackEffect(
  state: PlayerEffectSnapshot,
  rules: Rules,
  context: RuleContext,
  abilities: readonly (readonly GeneralSkill[])[],
  world: ReadonlyMap<number, number>,
  emperorVersion: number | null | undefined,
): number {
  return playerGameEffect(state, rules, context, abilities, world, emperorVersion, 487);
}
