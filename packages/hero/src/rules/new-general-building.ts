import type { RuleContext } from "@opencok/rules/availability";
import type { Rule, Rules } from "@opencok/rules/game";
import { javaFloat } from "@opencok/rules/java-float";
import { javaIntHashMapOrder } from "@opencok/rules/java-hash-map-order";
import {
  generalContent,
  generalInteger,
  generalMap,
  generalSavedInteger,
  generalSavedLong,
  generalFeatureAvailable,
} from "./new-general-content.ts";

export interface NewGeneralOffice {
  id: number;
  officeId: string | null;
  position: number | null;
  startTime: bigint | null;
}

export interface NewGeneralBuildingState {
  buildingUuid: string | undefined;
  buildingUuids: ReadonlySet<string>;
  mainBuildingLevel: number;
  playerLevel: number;
  prestigeLevel: number;
  offices: readonly NewGeneralOffice[];
}

function unlocked(type: number, minimum: number, state: NewGeneralBuildingState): boolean {
  if (type === 1) return generalSavedInteger(state.mainBuildingLevel) >= minimum;

  if (type === 2) return generalSavedInteger(state.prestigeLevel) >= minimum;

  if (type === 3) return generalSavedInteger(state.playerLevel) >= minimum;

  return true;
}

function officeUnlocked(rule: Rule, position: number, state: NewGeneralBuildingState): boolean {
  const conditions = generalMap(rule.unlock, generalInteger);

  for (const type of javaIntHashMapOrder(conditions.keys()))
    if (!unlocked(type, conditions.get(type)!, state)) return false;

  const positions = generalContent(rule.pos_unlock, "|");

  if (positions.length < position) return false;

  for (const condition of positions) {
    const values = generalContent(condition, ";").map(generalInteger);

    if (values.length >= 3 && values[0] === position && !unlocked(values[1]!, values[2]!, state))
      return false;
  }

  return true;
}

export function newGeneralBuildingMultiplier(
  general: { id: number; state: number | null; buildingUuid: string | null },
  state: NewGeneralBuildingState,
  rules: Rules,
  context: RuleContext,
  effect: number,
): (() => number) | undefined {
  if (state.buildingUuid === undefined) return undefined;

  const currentState = generalSavedInteger(general.state);

  if (
    currentState === 2 &&
    general.buildingUuid !== null &&
    state.buildingUuids.has(general.buildingUuid) &&
    general.buildingUuid === state.buildingUuid
  )
    return () => 1;

  if (!generalFeatureAvailable(rules, "general_official", context)) return undefined;

  if (
    generalSavedInteger(state.mainBuildingLevel) <
    generalInteger(rules.items.get("general_official")?.k1)
  )
    return undefined;

  if (currentState !== 6) return undefined;

  if (state.offices.length > 4096) throw new Error("Too many new-general offices");

  const offices = new Map<number, NewGeneralOffice>();

  for (const office of state.offices) {
    const id = generalSavedInteger(office.id);

    if (!offices.has(id)) offices.set(id, office);
  }

  const office = offices.get(generalSavedInteger(general.id));

  if (office?.officeId == null || office.officeId === "") return undefined;

  if (typeof office.officeId !== "string" || office.officeId.length > 40)
    throw new Error("Invalid new-general office ID");

  const position = generalSavedInteger(office.position);

  if (position === 0 || generalSavedLong(office.startTime) === 0n) return undefined;

  const rule = rules.power.newGeneralOffices?.get(office.officeId);

  if (!rule) throw new Error("Missing new-general office rule");

  if (!officeUnlocked(rule, position, state)) return undefined;

  const effects = generalContent(rule.effect, "|");
  const counts = generalContent(rule.unlock_person_num, "|");

  if (effects.length !== counts.length) return undefined;

  for (let i = 0; i < effects.length; i++) {
    const id = generalInteger(effects[i]);
    const minimum = generalInteger(counts[i]);

    if (id !== effect) continue;

    if (
      minimum !== 1 &&
      [...offices.values()].filter((entry) => entry.officeId === office.officeId).length < minimum
    )
      return undefined;

    return () =>
      position >= 1 && position <= 3
        ? javaFloat(rules.items.get("general_official")?.[`k${position + 1}`])
        : 1;
  }

  return undefined;
}

export function newGeneralBuildingRate(
  general: { id: number; state: number | null; buildingUuid: string | null },
  state: NewGeneralBuildingState,
  rules: Rules,
  context: RuleContext,
  effect: number,
): number | undefined {
  return newGeneralBuildingMultiplier(general, state, rules, context, effect)?.();
}
