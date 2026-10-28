import { expect, test } from "bun:test";
import { parseServerEnvironment } from "../src/server.schema";

const key = "synthetic-activity-scheduler-key-32";
const base = { GAME_SECRET: "synthetic-game" };

test("realm scheduler cutover requires a dedicated credential and preserves local default", () => {
    expect(parseServerEnvironment(base).ACTIVITY_SCHEDULER_MODE).toBe("local");
    expect(
        parseServerEnvironment({
            ...base,
            ACTIVITY_SCHEDULER_MODE: "external",
            ACTIVITY_SCHEDULER_SECRET: key,
        }).ACTIVITY_SCHEDULER_SECRET,
    ).toBe(key);
    for (const secret of [undefined, "", "short"])
    {
        expect(() =>
            parseServerEnvironment({
                ...base,
                ACTIVITY_SCHEDULER_MODE: "external",
                ACTIVITY_SCHEDULER_SECRET: secret,
            })
        ).toThrow("ACTIVITY_SCHEDULER_SECRET");
    }
    expect(() => parseServerEnvironment({ ...base, ACTIVITY_SCHEDULER_MODE: "other" })).toThrow(
        "ACTIVITY_SCHEDULER_MODE",
    );
});

test("realm scheduler keys cannot reuse game, provisioning or any Chat integration credential", () => {
    for (
        const field of [
            "GAME_SECRET",
            "PROVISIONING_SIGNING_SECRET",
            "CHAT_SECRET",
            "CHAT_MAILBOX_SECRET",
        ]
    )
    {
        expect(() =>
            parseServerEnvironment({ ...base, [field]: key, ACTIVITY_SCHEDULER_SECRET: key })
        ).toThrow("ACTIVITY_SCHEDULER_SECRET");
    }
    expect(() =>
        parseServerEnvironment({
            ...base,
            CHAT_MAILBOX_SECRETS: JSON.stringify({ "2": key }),
            ACTIVITY_SCHEDULER_SECRET: key,
        })
    ).toThrow("ACTIVITY_SCHEDULER_SECRET");
});
