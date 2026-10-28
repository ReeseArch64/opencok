import { expect, test } from "bun:test";
import { parseChatEnvironment } from "../src/chat";
import { parseServerEnvironment } from "../src/server.schema";

const base = {
    DATABASE_URL: "postgresql://example:synthetic@localhost/opencok_global",
    GAME_SECRET: "synthetic-login",
    CHAT_URL: "https://chat.internal",
    CHAT_SECRET: "synthetic-shared-chat",
};

test("Chat and realm configuration accept a single shared Chat credential", () => {
    expect(parseChatEnvironment(base).CHAT_SECRET).toBe("synthetic-shared-chat");
    expect(parseServerEnvironment(base).CHAT_SECRET).toBe("synthetic-shared-chat");
});

for (const secret of [undefined, ""])
{
    test(`Chat integration rejects a ${secret === undefined ? "missing" : "blank"} shared key`, () => {
        expect(() => parseChatEnvironment({ ...base, CHAT_SECRET: secret })).toThrow("CHAT_SECRET");
        expect(() => parseServerEnvironment({ ...base, CHAT_SECRET: secret })).toThrow(
            "CHAT_SECRET",
        );
    });
}
