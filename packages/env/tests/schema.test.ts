import { expect, test } from "bun:test";
import { EnvironmentError, parseEnvironment, requireEnvironment } from "../src/schema";

test("defaults and blank optional settings permit offline tools", () => {
  const env = parseEnvironment({ DATABASE_URL: " ", POSTGRES_ADMIN_URL: "", DATABASE_ROLE: "" });
  expect(env).toEqual({ NODE_ENV: "development", DATABASE_ROLE: undefined, DATABASE_URL: undefined, POSTGRES_ADMIN_URL: undefined });
  expect(Object.isFrozen(env)).toBe(true);
});

test("accepts supported modes, database roles and PostgreSQL URL formats", () => {
  for (const NODE_ENV of ["development", "test", "production"] as const) for (const DATABASE_ROLE of ["global", "kingdom"] as const) {
    const env = parseEnvironment({ NODE_ENV, DATABASE_ROLE, DATABASE_URL: "postgresql://synthetic:placeholder@localhost:5432/opencok_global?sslmode=require",
      POSTGRES_ADMIN_URL: "postgres://synthetic:placeholder@[::1]:5432/postgres" });
    expect(env.NODE_ENV).toBe(NODE_ENV); expect(env.DATABASE_ROLE).toBe(DATABASE_ROLE);
    expect(env.DATABASE_URL).toContain("sslmode=require");
  }
});

test("invalid values are aggregated by variable name without leaking input", () => {
  const privateValue = "synthetic-private-value";
  try {
    parseEnvironment({ NODE_ENV: privateValue, DATABASE_ROLE: privateValue, DATABASE_URL: `https://user:${privateValue}@localhost/db`, POSTGRES_ADMIN_URL: privateValue });
    throw new Error("Expected validation failure");
  } catch (error) {
    expect(error).toBeInstanceOf(EnvironmentError);
    expect((error as EnvironmentError).keys).toEqual(["NODE_ENV", "DATABASE_ROLE", "DATABASE_URL", "POSTGRES_ADMIN_URL"]);
    expect(String(error)).not.toContain(privateValue); expect(JSON.stringify(error)).not.toContain(privateValue);
  }
  for (const value of ["not-a-url", "https://localhost/db", "postgres://localhost", "postgresql://localhost/"]) {
    expect(() => parseEnvironment({ DATABASE_URL: value })).toThrow("DATABASE_URL");
  }
});

test("operation-specific requirements report missing keys and retain narrow types", () => {
  expect(() => requireEnvironment(parseEnvironment({}), "DATABASE_URL")).toThrow("Missing environment configuration: DATABASE_URL");
  expect(() => requireEnvironment(parseEnvironment({}), "POSTGRES_ADMIN_URL")).toThrow("POSTGRES_ADMIN_URL");
  const role: "global" | "kingdom" = requireEnvironment(parseEnvironment({ DATABASE_ROLE: "kingdom" }), "DATABASE_ROLE");
  expect(role).toBe("kingdom");
});
