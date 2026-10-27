import type { RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import {
  newGeneralBuildingMultiplier,
  type NewGeneralBuildingState,
} from "./new-general-building.ts";
import { generalMap, generalInteger, generalSavedInteger } from "./new-general-content.ts";
import { javaDecimal } from "@opencok/rules/java-integer";
import { newGeneralSkillEffects, type NewGeneralSkillState } from "./new-general-skills.ts";
import {
  newGeneralStatusEffect,
  newGeneralRefinementEffect,
  type NewGeneralStatus,
} from "./new-general-status.ts";

export interface NewGeneralEffectState extends NewGeneralSkillState {
  state: number | null;
  buildingUuid: string | null;
  statuses: readonly NewGeneralStatus[];
  refinement: string | null;
  opTime: string | null;
}

export function validateNewGeneralContent(
  general: Pick<NewGeneralEffectState, "talent" | "opTime" | "baseSkill">,
): void {
  generalMap(general.talent, generalInteger, 5000);
  generalMap(general.opTime, (value) => javaDecimal(value, 64), 200);
  generalMap(general.baseSkill, generalInteger, 256);
}

export function newGeneralBuildingEffect<T extends NewGeneralEffectState>(
  read: () => {
    orderedGenerals: readonly T[];
    building: NewGeneralBuildingState;
  },
  rules: Rules,
  context: RuleContext,
  effect: number,
  equipment: (general: T, effect: number) => number,
  clock: () => bigint,
): number {
  try {
    const { orderedGenerals, building } = read();

    if (building.buildingUuid === undefined) return 0;

    if (orderedGenerals.length > 4096) throw new Error("Too many new-generals");

    const ids = new Set<number>();

    for (const general of orderedGenerals) {
      const id = generalSavedInteger(general.id);

      if (ids.has(id)) throw new Error("Duplicate new-general traversal entry");

      ids.add(id);
      validateNewGeneralContent(general);
    }

    let result = 0;

    for (const general of orderedGenerals) {
      const rate = newGeneralBuildingMultiplier(general, building, rules, context, effect);

      if (rate === undefined) continue;

      let value = newGeneralStatusEffect(general.statuses, rules, effect, clock());
      const skills = newGeneralSkillEffects(general, rules);

      if (skills.skills.has(effect)) value = Math.fround(value + skills.skills.get(effect)!);

      value = Math.fround(value + Math.fround(0 + (skills.talents.get(effect) ?? 0)));
      const equipped = equipment(general, effect);

      if (typeof equipped !== "number") throw new Error("Invalid new-general equipment effect");

      value = Math.fround(value + Math.fround(0 + Math.fround(equipped)));
      value = Math.fround(
        value + newGeneralRefinementEffect(general.refinement, rules, context, effect),
      );
      result = Math.fround(result + Math.fround(value * rate()));
    }

    return result;
  } catch {
    return 0;
  }
}
