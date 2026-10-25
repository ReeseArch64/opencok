import type { Rule, Rules } from "./game";
import { eventRealmEnabled, versionAtLeast, type RuleContext } from "./availability";

export function eventTimestamp(value: string | undefined): bigint | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day, hour, minute] = value.split("-").map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ];
  if (year < 1970 || month < 1 || month > 12 || day < 1 || hour > 23 || minute > 59)
    return undefined;
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  )
    return undefined;
  return BigInt(date.getTime());
}
export function localEventWindow(rule: Rule | undefined, now: bigint) {
  const start = eventTimestamp(rule?.start),
    end = eventTimestamp(rule?.end);
  if (
    rule?.function_on !== "1" ||
    start === undefined ||
    end === undefined ||
    end < start ||
    now < start ||
    now > end
  )
    return undefined;
  return { start, end };
}

export function localEventControlOpen(rules: Rules, id: string, context: RuleContext): boolean {
  const control = rules.configuration.payControl?.get(id);
  return (
    !!control &&
    versionAtLeast(context.version, control.k1 ?? "") &&
    (context.testServer
      ? eventRealmEnabled(control.k72, context.kingdomId) &&
        eventRealmEnabled(control.k107, context.kingdomId)
      : eventRealmEnabled(control.k2, context.kingdomId))
  );
}
