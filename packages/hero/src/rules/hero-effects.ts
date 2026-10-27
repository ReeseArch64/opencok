import type { Row } from "@opencok/contracts/rows";
import { text } from "@opencok/contracts/rows";
import type { RuleContext } from "@opencok/rules/availability";
import { javaCalendarDate } from "@opencok/rules/java-calendar-date";
import type { Rules } from "@opencok/rules/game";

import {
  effectInteger as integer,
  effectFloat as float,
  invalidEffect as invalid,
} from "@opencok/rules/power-values";

export function selectHeroes(heroes: readonly Row[]): readonly Row[] {
  const selected = new Map<number, { row: Row; index: number }>();

  for (const [index, row] of heroes.entries()) {
    const family = Math.trunc(integer(row.heroid) / 100);
    const previous = selected.get(family);
    const level = integer(row.level ?? 0);
    const exp = integer(row.exp ?? 0);

    if (
      !previous ||
      level > integer(previous.row.level ?? 0) ||
      (level === integer(previous.row.level ?? 0) && exp >= integer(previous.row.exp ?? 0))
    )
      selected.set(family, { row, index });
  }

  const indices = new Set([...selected.values()].map((entry) => entry.index));

  return heroes.filter((_row, index) => indices.has(index));
}

export function heroEffects(
  heroes: readonly Row[],
  rules: Rules,
  context: RuleContext,
): ReadonlyMap<number, number> {
  const effects = new Map<number, number>();
  const event = rules.power.activityEvents?.get("9005005");

  if (!Number.isSafeInteger(context.now)) return effects;

  let start = 0n;
  let end = 0n;

  if (event && Object.keys(event).length) {
    const parsedStart = javaCalendarDate(event.k1!, 5, context.utcOffsetMinutes);

    if (parsedStart !== undefined) {
      const parsedEnd = javaCalendarDate(event.k2!, 5, context.utcOffsetMinutes, parsedStart);

      if (parsedEnd !== undefined) {
        start = parsedStart;
        end = parsedEnd;
      }
    }
  }

  const now = BigInt(context.now);

  if (now < start || now > end) return effects;

  for (const hero of selectHeroes(heroes)) {
    const rule = rules.power.heroes?.get(text(hero, "heroid"));

    if (!rule) return invalid();

    const contribution = new Map<number, number>();

    for (let index = 1; rule[`para${index}`] !== undefined; index++) {
      for (const segment of rule[`para${index}`]!.split("|").filter(Boolean)) {
        const [id, raw] = segment.split(";").filter(Boolean);
        const effect = integer(id);
        contribution.set(effect, float((contribution.get(effect) ?? 0) + float(raw)));
      }
    }

    for (const [id, value] of contribution) effects.set(id, float((effects.get(id) ?? 0) + value));
  }

  return effects;
}
