import { expect, test } from "bun:test";
import { parseWorkersEnvironment } from "@opencok/env/workers/schema";
import { mailWorkerConfig } from "../src/config";

const base = {
    MAIL_INTEGRATION_MODE: "external",
    KINGDOM_ID: "1",
    MAIL_WORKER_KINGDOM_URL: "postgresql://worker:synthetic@localhost/opencok_kingdom_1",
    MAIL_WORKER_GLOBAL_URL: "postgresql://projection:synthetic@localhost/opencok_global",
};

test("worker configuration requires explicit scope and bounded independent pools", () => {
    const config = mailWorkerConfig(parseWorkersEnvironment(base));
    expect(config.kingdomId).toBe(1);
    expect(config.kingdomPool).toBe(2);
    expect(config.globalPool).toBe(1);
    expect(config.timeoutMs).toBe(5000);
    expect(config.intervalMs).toBe(5000);
    expect(config.chat).toBeUndefined();
    for (const field of Object.keys(base))
    {
        const source: Record<string, string | undefined> = { ...base, [field]: undefined };
        expect(() => parseWorkersEnvironment(source)).toThrow(field);
    }
    for (
        const [field, values] of Object.entries({
            MAIL_INTEGRATION_MODE: ["local", "yes"],
            KINGDOM_ID: ["0", "-1", "2147483648"],
            MAIL_WORKER_POLL_MS: ["0", "999", "60001"],
            MAIL_WORKER_TIMEOUT_MS: ["99", "30001"],
            MAIL_WORKER_KINGDOM_POOL: ["0", "5"],
            MAIL_WORKER_GLOBAL_POOL: ["0", "3"],
        })
    )
    {
        for (const value of values)
        {
            expect(() => parseWorkersEnvironment({ ...base, [field]: value })).toThrow(field);
        }
    }
});

test("worker connection URLs cannot override database identity or resource budgets", () => {
    for (const field of ["MAIL_WORKER_KINGDOM_URL", "MAIL_WORKER_GLOBAL_URL"] as const)
    {
        for (
            const query of [
                "options=-c%20transaction_timeout=0",
                "database=foreign",
                "host=foreign",
                "statement_timeout=0",
                "query_timeout=0",
                "max=99",
            ]
        )
        {
            expect(() => parseWorkersEnvironment({ ...base, [field]: `${base[field]}?${query}` }))
                .toThrow(field);
        }
        expect(
            parseWorkersEnvironment({
                ...base,
                [field]: `${base[field]}?sslmode=verify-full`,
            })[field],
        )
            .toBe(`${base[field]}?sslmode=verify-full`);
        expect(() => parseWorkersEnvironment({ ...base, [field]: "private-malformed-secret" }))
            .toThrow(field);
    }
    expect(() => parseWorkersEnvironment({ ...base, KINGDOM_ID: "2" })).toThrow(
        "MAIL_WORKER_KINGDOM_URL",
    );
    expect(
        parseWorkersEnvironment({
            ...base,
            KINGDOM_DATABASE_NAME: "custom_realm",
            MAIL_WORKER_KINGDOM_URL: "postgresql://worker:synthetic@localhost/custom_realm",
        }).KINGDOM_DATABASE_NAME,
    ).toBe("custom_realm");
});

test("worker publisher requires the shared Chat credential", () => {
    const chat = { ...base, CHAT_URL: "https://chat.internal" };
    for (const secret of [undefined, ""])
    {
        expect(() => parseWorkersEnvironment({ ...chat, CHAT_SECRET: secret })).toThrow(
            "CHAT_SECRET",
        );
    }
    expect(
        mailWorkerConfig(
            parseWorkersEnvironment({ ...chat, CHAT_SECRET: "shared-chat-secret" }),
        ).chat,
    ).toEqual({
        url: "https://chat.internal/_internal/mailbox",
        signingSecret: "shared-chat-secret",
    });
    try
    {
        parseWorkersEnvironment({ ...base, MAIL_WORKER_GLOBAL_URL: "sensitive-url" });
        throw new Error("Expected invalid worker configuration");
    }
    catch (error)
    {
        expect(String(error)).toContain("MAIL_WORKER_GLOBAL_URL");
        expect(String(error)).not.toContain("sensitive-url");
    }
});

test("worker preserves the exact shared Chat signing key", () => {
    const config = mailWorkerConfig(parseWorkersEnvironment({
        ...base,
        CHAT_URL: "https://chat.internal",
        CHAT_SECRET: " synthetic-shared-chat ",
    }));
    expect(config.chat?.signingSecret).toBe(" synthetic-shared-chat ");
});
