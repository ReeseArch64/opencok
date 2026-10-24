import type { Row } from "@opencok/contracts/rows";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { serverFeature } from "./power-context.ts";
import {
  effectInteger as integer,
  effectLong as long,
  invalidEffect as invalid,
} from "./power-values.ts";

export function kingdomFightActive(activities: readonly Row[], now: number): boolean {
  const fights = activities.filter(
    (row) => integer(row.type) === 0 && long(row.openTime ?? 0) > 0n,
  );
  if (fights.length > 1) return invalid();
  const fight = fights[0];
  if (!fight) return false;
  const instant = long(now);
  const open = long(fight.openTime);
  const start = long(fight.startTime ?? 0);
  const end = long(fight.endTime ?? 0);
  return open <= instant && start > 0n && start <= instant && end > 0n && instant < end - 5000n;
}

export function officeEffects(
  office: Row | undefined,
  activities: readonly Row[],
  worldEffects: ReadonlyMap<number, number>,
  rules: Rules,
  context: RuleContext,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();
  if (!office) return effects;
  if (serverFeature(rules, "officials", context) && kingdomFightActive(activities, context.now))
    return effects;
  if ((worldEffects.get(306) ?? 0) > 0) return effects;
  const position = integer(office.positionId);
  if (position === 216000000 && integer(office.serverId ?? 0) === context.kingdomId) return effects;
  const ordinal = position % 100;
  if (ordinal < 0 || ordinal > 16) return effects;
  const rule = rules.power.offices?.get(String(216000 + ordinal));
  if (!rule) return invalid();
  if (rule.para1 === undefined || rule.para2 === undefined) return effects;
  const ids = rule.para1.split(";").filter(Boolean);
  const values = rule.para2.split(";").filter(Boolean);
  if (ids.length !== values.length) return effects;
  for (let index = 0; index < ids.length; index++) {
    const id = integer(ids[index]);
    if (!effects.has(id)) effects.set(id, integer(values[index]));
  }
  return effects;
}
