import { javaDecimal } from "./java-integer.ts";
import { mailBlank } from "./mail.ts";
import type { RuleContext } from "./availability.ts";
import type { Rules } from "./game.ts";
import { serverFeature } from "./power-context.ts";

export function generalFeatureAvailable(rules: Rules, key: string, context: RuleContext): boolean {
  const rule = rules.features.get(key);
  if (!rule || mailBlank(rule.version) || mailBlank(context.testServer ? rule.test : rule.online))
    return false;
  if (!mailBlank(context.version)) {
    const parse = (raw: string): number[] => {
      if (raw.length > 65535) throw new Error("Oversized general feature version");
      const parts = raw.split(".").filter(Boolean);
      if (parts.length > 4096) throw new Error("Too many general feature version parts");
      return parts.map(generalInteger);
    };
    const current = parse(context.version);
    const minimum = parse(rule.version!);
    for (let index = 0; index < 3; index++) {
      const actual = current[index];
      const required = minimum[index];
      if (actual === undefined || required === undefined)
        throw new Error("Missing general feature version part");
      if (actual < required) return false;
      if (actual > required) break;
    }
  }
  return serverFeature(rules, key, context);
}

export function generalContent(
  raw: string | null | undefined,
  separator: string,
  limit = 65535,
): string[] {
  if (raw != null && (typeof raw !== "string" || raw.length > limit))
    throw new Error("Invalid new-general content");
  if (mailBlank(raw)) return [];
  const values = raw!
    .split(separator)
    .filter((value, i, all) => value.length > 0 || i === all.length - 1);
  if (values.length > 4096) throw new Error("Too many new-general values");
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
    if (parts.length === 2) result.set(generalInteger(parts[0]), convert(parts[1]!));
  }
  return result;
}

export function generalSavedInteger(value: number | null): number {
  const restored = value ?? 0;
  if (!Number.isInteger(restored) || restored < -2147483648 || restored > 2147483647)
    throw new Error("Invalid saved new-general integer");
  return restored;
}

export function generalSavedLong(value: bigint | null): bigint {
  const restored = value ?? 0n;
  if (typeof restored !== "bigint" || BigInt.asIntN(64, restored) !== restored)
    throw new Error("Invalid saved new-general long");
  return restored;
}
