import { javaCalendarDate } from "./java-calendar-date.ts";
import { javaDecimal } from "./java-integer.ts";
import { mailBlank } from "./mail.ts";

export interface RuleContext {
  kingdomId: number;
  version: string;
  now: number;
  testServer?: boolean;
  utcOffsetMinutes?: number;
}

export function legacyPlayerVersionAtLeast(actual: string, required: string | undefined): boolean {
  if (mailBlank(required)) return false;
  if (mailBlank(actual)) return true;
  return versionAtLeast(actual, required!);
}

export function versionAtLeast(actual: string, required: string): boolean {
  const parse = (raw: string): number[] => {
    if (raw.length > 65535) throw new Error("Oversized feature version");
    const parts = raw.split(".").filter(Boolean);
    if (parts.length > 4096) throw new Error("Too many feature version parts");
    return parts.map((part) => Number(javaDecimal(part, 32)));
  };
  const current = parse(actual);
  const minimum = parse(required);
  for (let index = 0; index < 3; index++) {
    const value = current[index];
    const target = minimum[index];
    if (value === undefined || target === undefined)
      throw new Error("Missing feature version part");
    if (value !== target) return value > target;
  }
  return true;
}

function realmEntries(selector: string | undefined, kingdomId: number): string[] {
  if (
    typeof selector !== "string" ||
    selector.length > 65535 ||
    !Number.isInteger(kingdomId) ||
    kingdomId < -2147483648 ||
    kingdomId > 2147483647
  )
    throw new Error("Invalid realm selector");
  const entries = selector.split(";").filter(Boolean);
  if (entries.length > 4096) throw new Error("Too many realm selectors");
  return entries;
}

export function featureRealmEnabled(selector: string | undefined, kingdomId: number): boolean {
  const entries = realmEntries(selector, kingdomId);
  if (selector === "all") return true;
  if (selector === "close") return false;
  for (const entry of entries) {
    if (/^[0-9]+-[0-9]+/.exec(entry)?.[0] === entry) {
      const [lower, upper] = entry.split("-");
      if (
        kingdomId >= Number(javaDecimal(lower, 32)) &&
        kingdomId <= Number(javaDecimal(upper, 32))
      )
        return true;
    } else if (kingdomId === Number(javaDecimal(entry, 32))) return true;
  }
  return false;
}

export function switchRealmEnabled(selector: string | undefined, kingdomId: number): boolean {
  return featureRealmEnabled(selector === "0" ? "close" : selector, kingdomId);
}

export function eventRealmEnabled(selector: string | undefined, kingdomId: number): boolean {
  const entries = realmEntries(selector, kingdomId);
  if (selector === "all") return true;
  if (selector === "close") return false;
  for (const entry of entries) {
    const range = entry.split("-").filter(Boolean);
    if (range.length === 2) {
      if (
        kingdomId >= Number(javaDecimal(range[0], 32)) &&
        kingdomId <= Number(javaDecimal(range[1], 32))
      )
        return true;
    } else if (kingdomId === Number(javaDecimal(entry, 32))) return true;
  }
  return false;
}

export function worldActivityRealmEnabled(
  selector: string | undefined,
  kingdomId: number,
): boolean {
  const entries = realmEntries(selector, kingdomId);
  if (selector === "all") return true;
  if (selector === "0") return false;
  for (const entry of entries) {
    const range = entry.split("-").filter(Boolean);
    const lower = Number(javaDecimal(range[0], 32));
    const upper = range.length === 2 ? Number(javaDecimal(range[1], 32)) : lower;
    if (kingdomId >= lower && kingdomId <= upper) return true;
  }
  return false;
}

export function ruleTime(value: string, utcOffsetMinutes = 0): bigint {
  return javaCalendarDate(value, 5, utcOffsetMinutes) ?? 0n;
}

export function ruleTimeWindow(
  rule: Readonly<Record<string, string>>,
  context: RuleContext,
): boolean {
  if (!Number.isSafeInteger(context.now)) return false;
  const now = BigInt(context.now);
  if (rule.start !== undefined && now < ruleTime(rule.start, context.utcOffsetMinutes))
    return false;
  if (rule.end !== undefined && now > ruleTime(rule.end, context.utcOffsetMinutes)) return false;
  return true;
}

export function ruleAvailable(
  rule: Readonly<Record<string, string>> | undefined,
  context: RuleContext,
): boolean {
  if (
    !rule ||
    !Number.isSafeInteger(context.now) ||
    mailBlank(context.testServer ? rule.test : rule.online) ||
    !legacyPlayerVersionAtLeast(context.version, rule.version) ||
    !featureRealmEnabled(context.testServer ? rule.test : rule.online, context.kingdomId)
  )
    return false;
  return ruleTimeWindow(rule, context);
}
