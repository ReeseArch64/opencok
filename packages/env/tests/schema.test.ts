import { expect, test } from "bun:test";
import { parseEnvironment, environmentSchema } from "../src/schema";
import { parseDatabaseEnvironment, databaseSchema } from "../src/database.schema";
import { EnvironmentError, requireEnvironment } from "../src/validation";

test("general and database Zod schemas expose only their own domain", () => {
    expect(environmentSchema.safeParse({ NODE_ENV: "testing" }).success).toBe(true);
    expect(databaseSchema.safeParse({ DATABASE_ROLE: "kingdom" }).success).toBe(true);
    expect(parseEnvironment({ NODE_ENV: "testing", DATABASE_URL: "invalid" })).toEqual({
        NODE_ENV: "testing",
    });
    const database = parseDatabaseEnvironment({ NODE_ENV: "invalid", DATABASE_ROLE: "global" });
    expect(database).toEqual({ DATABASE_ROLE: "global", POSTGRES_USER: "postgres" });
    expect(Object.isFrozen(database)).toBe(true);
    expect(Object.isFrozen(parseEnvironment({}))).toBe(true);
});

test("defaults and blank optional settings permit offline tools", () => {
    expect(parseEnvironment({ NODE_ENV: " " })).toEqual({ NODE_ENV: "development" });
    expect(
        parseDatabaseEnvironment({ DATABASE_URL: " ", POSTGRES_ADMIN_URL: "", DATABASE_ROLE: "" }),
    ).toEqual({
        DATABASE_ROLE: undefined,
        DATABASE_URL: undefined,
        POSTGRES_ADMIN_URL: undefined,
        POSTGRES_USER: "postgres",
    });
});

test("accepts supported modes, database roles and PostgreSQL URL formats", () => {
    for (const NODE_ENV of ["development", "testing", "production"] as const)
    {
        expect(parseEnvironment({ NODE_ENV }).NODE_ENV).toBe(NODE_ENV);
    }
    for (const DATABASE_ROLE of ["global", "kingdom"] as const)
    {
        const env = parseDatabaseEnvironment({
            DATABASE_ROLE,
            DATABASE_URL:
                "postgresql://synthetic:placeholder@localhost:5432/opencok_global?sslmode=require",
            POSTGRES_ADMIN_URL: "postgres://synthetic:placeholder@[::1]:5432/postgres",
        });
        expect(env.DATABASE_ROLE).toBe(DATABASE_ROLE);
        expect(env.DATABASE_URL).toContain("sslmode=require");
    }
});

test("invalid Zod results expose variable names without leaking input or raw issues", () => {
    const privateValue = "synthetic-private-value";
    expect(() => parseEnvironment({ NODE_ENV: privateValue })).toThrow("NODE_ENV");
    try
    {
        parseDatabaseEnvironment({
            DATABASE_ROLE: privateValue,
            DATABASE_URL: `https://user:${privateValue}@localhost/db`,
            POSTGRES_ADMIN_URL: privateValue,
        });
        throw new Error("Expected validation failure");
    }
    catch (error)
    {
        expect(error).toBeInstanceOf(EnvironmentError);
        expect((error as EnvironmentError).keys).toEqual([
            "DATABASE_ROLE",
            "DATABASE_URL",
            "POSTGRES_ADMIN_URL",
        ]);
        expect(String(error)).not.toContain(privateValue);
        expect(JSON.stringify(error)).not.toContain(privateValue);
        expect(error).not.toHaveProperty("issues");
        expect(error).not.toHaveProperty("cause");
    }
    for (
        const value of [
            "not-a-url",
            "https://localhost/db",
            "postgres://localhost",
            "postgresql://localhost/",
        ]
    )
    {
        expect(() => parseDatabaseEnvironment({ DATABASE_URL: value })).toThrow("DATABASE_URL");
    }
});

test("operation-specific requirements report missing keys and retain narrow types", () => {
    expect(() => requireEnvironment(parseDatabaseEnvironment({}), "DATABASE_URL")).toThrow(
        "Missing environment configuration: DATABASE_URL",
    );
    expect(() => requireEnvironment(parseDatabaseEnvironment({}), "POSTGRES_ADMIN_URL")).toThrow(
        "POSTGRES_ADMIN_URL",
    );
    const role: "global" | "kingdom" = requireEnvironment(
        parseDatabaseEnvironment({ DATABASE_ROLE: "kingdom" }),
        "DATABASE_ROLE",
    );
    expect(role).toBe("kingdom");
    const separatedDomains: [
        "DATABASE_URL" extends keyof ReturnType<typeof parseEnvironment> ? false : true,
        "NODE_ENV" extends keyof ReturnType<typeof parseDatabaseEnvironment> ? false : true,
    ] = [true, true];
    expect(separatedDomains).toEqual([true, true]);
});

test("Compose credentials preserve special characters and require a password per operation", () => {
    const password = " synthetic@value:/?#$ ";
    const env = parseDatabaseEnvironment({
        POSTGRES_USER: "compose_check",
        POSTGRES_PASSWORD: password,
    });
    expect(env.POSTGRES_PASSWORD).toBe(password);
    expect(env.POSTGRES_USER).toBe("compose_check");
    expect(() =>
        requireEnvironment(parseDatabaseEnvironment({ POSTGRES_PASSWORD: "" }), "POSTGRES_PASSWORD")
    ).toThrow("POSTGRES_PASSWORD");
});
