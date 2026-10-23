import { z } from "zod";

export class EnvironmentError extends Error {
  constructor(readonly keys: readonly string[], reason: "invalid" | "missing" = "invalid") {
    super(`${reason === "missing" ? "Missing" : "Invalid"} environment configuration: ${keys.join(", ")}`);
    this.name = "EnvironmentError";
  }
}

export const blankToUndefined = (value: unknown) => typeof value === "string" ? value.trim() || undefined : value;

/** Keep Zod errors and rejected secret values out of public diagnostics. */
export function validateEnvironment<T extends z.ZodType>(schema: T, source: Readonly<Record<string, string | undefined>>): z.output<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const keys = [...new Set(result.error.issues.map(issue => String(issue.path[0])))];
    throw new EnvironmentError(Object.freeze(keys));
  }
  return result.data;
}

export function requireEnvironment<E extends object, K extends keyof E>(environment: E, key: K): NonNullable<E[K]> {
  const value = environment[key];
  if (value === undefined || value === null) throw new EnvironmentError([String(key)], "missing");
  return value as NonNullable<E[K]>;
}
