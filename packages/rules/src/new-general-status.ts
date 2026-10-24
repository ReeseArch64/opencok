import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { javaFloat } from "./java-float.ts";
import { javaIntHashMapOrder } from "./java-hash-map-order.ts";
import { mailBlank } from "./mail.ts";
import {
  generalContent,
  generalInteger,
  generalMap,
  generalSavedInteger,
  generalSavedLong,
  generalFeatureAvailable,
} from "./new-general-content.ts";

export interface NewGeneralStatus {
  stateId: number;
  startTime: bigint | null;
  endTime: bigint | null;
}

export function newGeneralStatusEffect(
  statuses: readonly NewGeneralStatus[],
  rules: Rules,
  effect: number,
  now: bigint,
): number {
  if (typeof now !== "bigint") throw new Error("Invalid new-general status clock");
  generalSavedLong(now);
  generalSavedInteger(effect);
  if (statuses.length > 4096) throw new Error("Too many new-general statuses");
  const selected = new Map<number, NewGeneralStatus>();
  for (const status of statuses) selected.set(generalSavedInteger(status.stateId), status);
  let value = 0;
  for (const id of javaIntHashMapOrder(selected.keys())) {
    const status = selected.get(id)!;
    if (now > generalSavedLong(status.endTime) || now < generalSavedLong(status.startTime))
      continue;
    const effects = generalMap(rules.power.statuses?.get(String(id))?.effect, javaFloat);
    value = Math.fround(value + (effects.get(effect) ?? 0));
  }
  return value;
}

export function newGeneralRefinementEffect(
  raw: string | null,
  rules: Rules,
  context: RuleContext,
  effect: number,
): number {
  try {
    if (!generalFeatureAvailable(rules, "general_random_effect", context)) return 0;
    generalSavedInteger(effect);
    const selected = new Map<number, string[]>();
    for (const entry of generalContent(raw, "|", 300)) {
      const parts = generalContent(entry, ";");
      if (parts.length < 2) continue;
      const members = parts[1]!.split("_").filter((member) => !mailBlank(member));
      selected.set(generalInteger(parts[0]), members);
    }
    let value = 0;
    for (const id of javaIntHashMapOrder(selected.keys())) {
      const members = selected.get(id)!;
      const amount = javaFloat(members[1]);
      const rule = rules.power.newGeneralRefinement?.get(members[0]!);
      if (!rule) throw new Error("Missing new-general refinement rule");
      const effects = new Set(generalContent(rule.effect, ";").map(generalInteger));
      if (effects.has(effect)) value = Math.fround(value + amount);
    }
    return value;
  } catch {
    return 0;
  }
}
