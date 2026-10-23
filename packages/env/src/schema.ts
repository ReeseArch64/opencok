export interface Environment {
  readonly NODE_ENV: "development" | "test" | "production";
  readonly DATABASE_ROLE: "global" | "kingdom" | undefined;
  readonly DATABASE_URL: string | undefined;
  readonly POSTGRES_ADMIN_URL: string | undefined;
}

export class EnvironmentError extends Error {
  constructor(readonly keys: readonly string[], reason: "invalid" | "missing" = "invalid") {
    super(`${reason === "missing" ? "Missing" : "Invalid"} environment configuration: ${keys.join(", ")}`);
    this.name = "EnvironmentError";
  }
}

function postgresUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "postgres:" || parsed.protocol === "postgresql:") && !!parsed.hostname && parsed.pathname.length > 1;
  } catch { return false; }
}

/** Validate known server settings without putting untrusted values into errors. */
export function parseEnvironment(source: Readonly<Record<string, string | undefined>>): Environment {
  const optional = (key: string) => source[key]?.trim() || undefined;
  const node = optional("NODE_ENV") ?? "development";
  const role = optional("DATABASE_ROLE");
  const database = optional("DATABASE_URL");
  const admin = optional("POSTGRES_ADMIN_URL");
  const invalid: string[] = [];
  if (!["development", "test", "production"].includes(node)) invalid.push("NODE_ENV");
  if (role !== undefined && role !== "global" && role !== "kingdom") invalid.push("DATABASE_ROLE");
  if (database !== undefined && !postgresUrl(database)) invalid.push("DATABASE_URL");
  if (admin !== undefined && !postgresUrl(admin)) invalid.push("POSTGRES_ADMIN_URL");
  if (invalid.length) throw new EnvironmentError(Object.freeze(invalid));
  return Object.freeze({ NODE_ENV: node as Environment["NODE_ENV"], DATABASE_ROLE: role as Environment["DATABASE_ROLE"], DATABASE_URL: database, POSTGRES_ADMIN_URL: admin });
}

export function requireEnvironment<K extends keyof Environment>(environment: Environment, key: K): NonNullable<Environment[K]> {
  const value = environment[key];
  if (value === undefined) throw new EnvironmentError([key], "missing");
  return value as NonNullable<Environment[K]>;
}
