import { expect, test } from "bun:test";
import { Effect } from "effect";
import { EnvironmentSource } from "@opencok/env/effect";
import { config } from "../src/config";

const source = {
    DATABASE_URL: "postgresql://example:synthetic@localhost/opencok_global",
    GAME_SECRET: "synthetic-login",
    CHAT_URL: "https://chat.internal",
    CHAT_SECRET: "synthetic-backend",
};

test("realm selects its own mailbox key without changing other integration credentials", async () => {
    for (const mode of ["local", "external"] as const)
    {
        const settings = await Effect.runPromise(
            config.pipe(Effect.provideService(EnvironmentSource, {
                ...source,
                KINGDOM_ID: "2",
                MAIL_INTEGRATION_MODE: mode,
                CHAT_MAILBOX_SECRET: "synthetic-mailbox-fallback",
                CHAT_MAILBOX_SECRETS: JSON.stringify({
                    "1": "synthetic-one",
                    "2": "synthetic-two",
                }),
            })),
        );
        expect(settings.mailIntegrationMode).toBe(mode);
        expect(settings.mailChat?.signingSecret).toBe("synthetic-two");
        expect(settings.chatSession?.signingSecret).toBe("synthetic-backend");
        expect(settings.nicknameChat?.signingSecret).toBe("synthetic-backend");
    }
});

test("realm preserves legacy local default and optional dedicated mailbox fallback", async () => {
    for (const dedicated of [undefined, "synthetic-mailbox-fallback"])
    {
        const settings = await Effect.runPromise(
            config.pipe(Effect.provideService(EnvironmentSource, {
                ...source,
                CHAT_MAILBOX_SECRET: dedicated,
                CHAT_MAILBOX_SECRETS: JSON.stringify({ "2": "synthetic-two" }),
            })),
        );
        expect(settings.mailIntegrationMode).toBe("local");
        expect(settings.mailChat?.signingSecret).toBe(dedicated ?? "synthetic-backend");
    }
});
