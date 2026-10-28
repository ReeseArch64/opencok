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

for (const mode of ["local", "external"] as const)
{
    test(`realm uses the shared Chat key for mailbox delivery in ${mode} mode`, async () => {
        const settings = await Effect.runPromise(
            config.pipe(Effect.provideService(EnvironmentSource, {
                ...source,
                KINGDOM_ID: "2",
                MAIL_INTEGRATION_MODE: mode,
            })),
        );
        expect(settings.mailIntegrationMode).toBe(mode);
        expect(settings.mailChat).toEqual({
            url: "https://chat.internal/_internal/mailbox",
            signingSecret: "synthetic-backend",
        });
        expect(settings.chatSession?.signingSecret).toBe("synthetic-backend");
        expect(settings.nicknameChat?.signingSecret).toBe("synthetic-backend");
    });
}

test("realm preserves local delivery default with Chat disabled", async () => {
    const settings = await Effect.runPromise(
        config.pipe(Effect.provideService(EnvironmentSource, {
            DATABASE_URL: source.DATABASE_URL,
            GAME_SECRET: source.GAME_SECRET,
        })),
    );
    expect(settings.mailIntegrationMode).toBe("local");
    expect(settings.mailChat).toBeUndefined();
});
