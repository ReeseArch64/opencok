import { expect, test } from "bun:test";
import { parseChatEnvironment } from "../src/chat";
import { parseServerEnvironment } from "../src/server.schema";

const base = {
    DATABASE_URL: "postgresql://example:synthetic@localhost/opencok_global",
    GAME_SECRET: "synthetic-login",
    CHAT_SECRET: "synthetic-backend",
};

test("mailbox realm maps require valid unique realm keys and distinct credentials", () => {
    for (const parse of [parseChatEnvironment, parseServerEnvironment])
    {
        expect(parse(base).CHAT_MAILBOX_SECRETS).toBeUndefined();
        expect(parse({ ...base, CHAT_MAILBOX_SECRETS: "" }).CHAT_MAILBOX_SECRETS).toBeUndefined();
        expect(
            parse({ ...base, CHAT_MAILBOX_SECRETS: "{\"1\":\"one\",\"2147483647\":\"two\"}" })
                .CHAT_MAILBOX_SECRETS,
        )
            .toEqual({ "1": "one", "2147483647": "two" });
        for (
            const value of [
                "invalid",
                "null",
                "[]",
                "{\"0\":\"one\"}",
                "{\"01\":\"one\"}",
                "{\"2147483648\":\"one\"}",
                "{\"1\":\"\"}",
                "{\"1\":null}",
                "{\"1\":\"same\",\"2\":\"same\"}",
            ]
        )
        {
            expect(() => parse({ ...base, CHAT_MAILBOX_SECRETS: value })).toThrow(
                "CHAT_MAILBOX_SECRETS",
            );
        }
    }
    expect(() =>
        parseChatEnvironment({ ...base, CHAT_MAILBOX_SECRETS: "{\"1\":\"synthetic-backend\"}" })
    ).toThrow("CHAT_MAILBOX_SECRETS");
    expect(() =>
        parseChatEnvironment({
            ...base,
            CHAT_MAILBOX_SECRET: "fallback",
            CHAT_MAILBOX_SECRETS: "{\"1\":\"fallback\"}",
        })
    ).toThrow("CHAT_MAILBOX_SECRETS");
});

test("mailbox realm keys cannot reuse a backend key even with a separate fallback", () => {
    expect(() =>
        parseChatEnvironment({
            ...base,
            CHAT_MAILBOX_SECRET: "synthetic-fallback",
            CHAT_MAILBOX_SECRETS: JSON.stringify({ "1": base.CHAT_SECRET }),
        })
    ).toThrow("CHAT_MAILBOX_SECRETS");
});
