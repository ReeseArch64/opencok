export interface RuleContext {
  kingdomId: number;
  version: string;
  now: number;
  testServer?: boolean;
  utcOffsetMinutes?: number;
}

export function versionAtLeast(actual: string, required: string): boolean {
  const parse = (value: string) =>
    /^\d+\.\d+\.\d+$/.test(value) ? value.split(".").map(Number) : [];
  const current = parse(actual);
  const minimum = parse(required);
  if (
    current.length !== 3 ||
    minimum.length !== 3 ||
    ![...current, ...minimum].every(Number.isSafeInteger)
  )
    return false;
  for (let index = 0; index < 3; index++) {
    if (current[index] !== minimum[index]) return current[index]! > minimum[index]!;
  }
  return true;
}

export function realmEnabled(selector: string | undefined, kingdomId: number): boolean {
  if (!Number.isSafeInteger(kingdomId) || kingdomId < 1) return false;
  if (selector === "all") return true;
  if (!selector || selector === "close" || selector === "0") return false;
  const ranges = selector.split(";").filter(Boolean);
  if (!ranges.length) return false;
  let enabled = false;
  for (const range of ranges) {
    if (!/^\d+(?:-\d+)?$/.test(range)) return false;
    const [start, end = start] = range.split("-").map(Number);
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start! > end!) return false;
    enabled ||= kingdomId >= start! && kingdomId <= end!;
  }
  return enabled;
}

export function ruleTime(value: string, utcOffsetMinutes = 0): number | undefined {
  if (
    !/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}$/.test(value) ||
    !Number.isInteger(utcOffsetMinutes) ||
    Math.abs(utcOffsetMinutes) > 14 * 60
  )
    return undefined;
  const [year, month, day, hour, minute] = value.split("-").map(Number) as [
    number,
    number,
    number,
    number,
    number,
  ];
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, 0, 0);
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getUTCHours() !== hour ||
    date.getUTCMinutes() !== minute
  )
    return undefined;
  return date.getTime() - utcOffsetMinutes * 60_000;
}

export function ruleAvailable(
  rule: Readonly<Record<string, string>> | undefined,
  context: RuleContext,
): boolean {
  if (
    !rule ||
    !Number.isSafeInteger(context.now) ||
    !versionAtLeast(context.version, rule.version ?? "") ||
    !realmEnabled(context.testServer ? rule.test : rule.online, context.kingdomId)
  )
    return false;
  const start =
    rule.start === undefined ? -Infinity : ruleTime(rule.start, context.utcOffsetMinutes);
  const end = rule.end === undefined ? Infinity : ruleTime(rule.end, context.utcOffsetMinutes);
  return (
    start !== undefined &&
    end !== undefined &&
    start <= end &&
    context.now >= start &&
    context.now <= end
  );
}
