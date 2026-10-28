import { expect, test } from "bun:test";
import { parseSchedulerEnvironment } from "@opencok/env/scheduler/schema";
import { EnvironmentError } from "@opencok/env/validation";
import { schedulerConfig } from "../src/config";

const base = {
    ACTIVITY_SCHEDULER_MODE: "external",
    ACTIVITY_SCHEDULER_SECRET: "synthetic-scheduler-realm-one-key-32",
    KINGDOM_ID: "1",
    SCHEDULER_DATABASE_URL:
        "postgresql://scheduler:synthetic-db-secret@localhost/opencok_kingdom_1",
    SCHEDULER_OWNER_URL: "https://realm.internal:18090",
};

test("scheduler configuration requires explicit external scope and maps bounded defaults", () => {
    expect(schedulerConfig(parseSchedulerEnvironment(base))).toEqual({
        kingdomId: 1,
        databaseUrl: base.SCHEDULER_DATABASE_URL,
        ownerUrl: "https://realm.internal:18090/_internal/activity-deadlines",
        signingSecret: base.ACTIVITY_SCHEDULER_SECRET,
        healthHost: "127.0.0.1",
        healthPort: 18092,
        timeoutMs: 5000,
        intervalMs: 1000,
        poolSize: 2,
        batchSize: 64,
        ownerBudget: 4,
    });
    for (const field of Object.keys(base))
    {
        expect(() => parseSchedulerEnvironment({ ...base, [field]: undefined })).toThrow(field);
    }
    expect(() => parseSchedulerEnvironment({ ...base, ACTIVITY_SCHEDULER_MODE: "local" })).toThrow(
        "ACTIVITY_SCHEDULER_MODE",
    );
    for (const ACTIVITY_SCHEDULER_SECRET of [undefined, "", "short", " ".repeat(32)])
    {
        expect(() =>
            parseSchedulerEnvironment({
                ...base,
                GAME_SECRET: base.ACTIVITY_SCHEDULER_SECRET,
                ACTIVITY_SCHEDULER_SECRET,
            })
        ).toThrow("ACTIVITY_SCHEDULER_SECRET");
    }
});

test("scheduler accepts configured budgets only within pool, scan, timeout and realm bounds", () => {
    expect(schedulerConfig(parseSchedulerEnvironment({
        ...base,
        SCHEDULER_HEALTH_HOST: "0.0.0.0",
        SCHEDULER_HEALTH_PORT: "18095",
        SCHEDULER_TIMEOUT_MS: "30000",
        SCHEDULER_POLL_MS: "60000",
        SCHEDULER_POOL: "4",
        SCHEDULER_BATCH_SIZE: "256",
        SCHEDULER_OWNER_BUDGET: "256",
    }))).toMatchObject({
        healthHost: "0.0.0.0",
        healthPort: 18095,
        timeoutMs: 30000,
        intervalMs: 60000,
        poolSize: 4,
        batchSize: 256,
        ownerBudget: 256,
    });
    for (
        const [field, values] of Object.entries({
            KINGDOM_ID: ["0", "-1", "1.5", "2147483648"],
            SCHEDULER_HEALTH_PORT: ["-1", "65536", "1.5"],
            SCHEDULER_TIMEOUT_MS: ["99", "30001", "1.5"],
            SCHEDULER_POLL_MS: ["99", "60001"],
            SCHEDULER_POOL: ["0", "5", "1.5"],
            SCHEDULER_BATCH_SIZE: ["0", "257"],
            SCHEDULER_OWNER_BUDGET: ["0", "257"],
        })
    )
    {
        for (const value of values)
        {
            expect(() => parseSchedulerEnvironment({ ...base, [field]: value })).toThrow(field);
        }
    }
    expect(() =>
        parseSchedulerEnvironment({
            ...base,
            SCHEDULER_BATCH_SIZE: "2",
            SCHEDULER_OWNER_BUDGET: "3",
        })
    ).toThrow("SCHEDULER_OWNER_BUDGET");
    expect(() => parseSchedulerEnvironment({ ...base, KINGDOM_ID: "2" })).toThrow(
        "SCHEDULER_DATABASE_URL",
    );
    const custom = parseSchedulerEnvironment({
        ...base,
        KINGDOM_ID: "2",
        KINGDOM_DATABASE_NAME: "custom_realm",
        SCHEDULER_DATABASE_URL: "postgresql://scheduler:synthetic@localhost/custom_realm",
    });
    expect(schedulerConfig(custom).kingdomId).toBe(2);
    expect(schedulerConfig(custom).databaseUrl).toEndWith("/custom_realm");
});

test("scheduler database URL rejects driver overrides while retaining supported TLS parameters", () => {
    for (
        const query of [
            "options=-c%20default_transaction_read_only=off",
            "database=foreign",
            "host=foreign",
            "port=1234",
            "user=administrator",
            "statement_timeout=0",
            "query_timeout=0",
            "max=99",
            "sslmode=verify-full&options=-c%20transaction_timeout=0",
        ]
    )
    {
        expect(() =>
            parseSchedulerEnvironment({
                ...base,
                SCHEDULER_DATABASE_URL: `${base.SCHEDULER_DATABASE_URL}?${query}`,
            })
        ).toThrow("SCHEDULER_DATABASE_URL");
    }
    for (
        const query of [
            "sslmode=verify-full",
            "sslcert=%2Fsynthetic%2Fclient.pem&sslkey=%2Fsynthetic%2Fclient.key&sslrootcert=%2Fsynthetic%2Fca.pem",
        ]
    )
    {
        const value = `${base.SCHEDULER_DATABASE_URL}?${query}`;
        expect(
            schedulerConfig(parseSchedulerEnvironment({ ...base, SCHEDULER_DATABASE_URL: value }))
                .databaseUrl,
        ).toBe(value);
    }
});

test("scheduler rejects invalid or credential-bearing routes without exposing supplied values", () => {
    for (
        const [field, values] of Object.entries({
            SCHEDULER_OWNER_URL: [
                "private-invalid-secret",
                "ftp://realm.internal",
                "https://user:private-url-secret@realm.internal",
                "https://realm.internal/path",
                "https://realm.internal/?token=private-url-secret",
                "https://realm.internal/#private-url-secret",
                "https://realm.internal/%E0%A4%A",
            ],
            SCHEDULER_DATABASE_URL: [
                "private-invalid-secret",
                "https://user:private-db-secret@db.internal/opencok_kingdom_1",
                "postgresql://user:private-db-secret@localhost/%E0%A4%A",
                "postgresql://user:private-db-secret@localhost/%",
                "postgresql://user:private-db-secret@localhost/foreign",
            ],
        })
    )
    {
        for (const value of values)
        {
            let failure: unknown;
            try
            {
                parseSchedulerEnvironment({ ...base, [field]: value });
            }
            catch (error)
            {
                failure = error;
            }
            expect(failure).toBeInstanceOf(EnvironmentError);
            expect(String(failure)).toContain(field);
            expect(String(failure)).not.toContain(value);
            expect(String(failure)).not.toContain("private-");
        }
    }
});
