import { expect, test } from "bun:test";
import { parseChatEnvironment } from "@opencok/env/chat";
const base = {
    DATABASE_URL: "postgres://synthetic:synthetic@127.0.0.1/global",
    CHAT_SECRET: "synthetic-secret",
};
test("blank optional archive settings keep PostgreSQL fallback available", () => {
    const config = parseChatEnvironment({ ...base, MONGO_URI: "" });
    expect(config.MONGO_URI).toBeUndefined();
    for (const key of ["CHAT_HOST", "CHAT_PORT", "CHAT_INSTANCE_ID", "CHAT_WEBSOCKET_URL"])
    {
        expect(config).not.toHaveProperty(key);
    }
});
test("archive configuration requires a database", () => {
    expect(
        parseChatEnvironment({
            ...base,
            MONGO_URI: "mongodb://synthetic:synthetic@127.0.0.1/opencok_chat",
        }).MONGO_URI,
    ).toBe("mongodb://synthetic:synthetic@127.0.0.1/opencok_chat");
    expect(() => parseChatEnvironment({ ...base, MONGO_URI: "mongodb://127.0.0.1" })).toThrow(
        "MONGO_URI",
    );
});
