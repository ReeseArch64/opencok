import { javaDecimal } from "@opencok/rules/java-integer";
import { mailBlank } from "@opencok/rules/mail";
import { legacyPlayerVersionAtLeast, type RuleContext } from "@opencok/rules/availability";
import type { Rules } from "@opencok/rules/game";
import { serverFeature } from "@opencok/rules/power-context";

export function generalFeatureAvailable(rules: Rules, key: string, context: RuleContext): boolean {
  const rule = rules.features.get(key);

  if (!rule || mailBlank(rule.version) || mailBlank(context.testServer ? rule.test : rule.online))
    {return false;}

  if (!legacyPlayerVersionAtLeast(context.version, rule.version)) {return false;}

  return serverFeature(rules, key, context);
}

export function generalContent(
  raw: string | null | undefined,
  separator: string,
  limit = 65535,
): string[] {
  if (raw != null && (typeof raw !== "string" || raw.length > limit))
    {throw new Error("Invalid new-general content");}

  if (mailBlank(raw)) {return [];}

  const values = raw!
    .split(separator)
    .filter((value, i, all) => value.length > 0 || i === all.length - 1);

  if (values.length > 4096) {throw new Error("Too many new-general values");}

  return values;
}

export function generalInteger(raw: unknown): number {
  return Number(javaDecimal(raw, 32));
}

export function generalMap<T>(
  raw: string | null | undefined,
  convert: (value: string) => T,
  limit = 65535,
): Map<number, T> {
  const result = new Map<number, T>();

  for (const entry of generalContent(raw, "|", limit)) {
    const parts = generalContent(entry, ";");

    if (parts.length === 2) {result.set(generalInteger(parts[0]), convert(parts[1]!));}
  }

  return result;
}

export function generalSavedInteger(value: number | null): number {
  const restored = value ?? 0;

  if (!Number.isInteger(restored) || restored < -2147483648 || restored > 2147483647)
    {throw new Error("Invalid saved new-general integer");}

  return restored;
}

export function generalSavedLong(value: bigint | null): bigint {
  const restored = value ?? 0n;

  if (typeof restored !== "bigint" || BigInt.asIntN(64, restored) !== restored)
    {throw new Error("Invalid saved new-general long");}

  return restored;
}
