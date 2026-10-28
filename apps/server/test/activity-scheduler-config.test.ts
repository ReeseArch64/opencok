import { expect, test } from "bun:test";
import { validateRealmActivitySchedulerConfig } from "../src/composition/activity-deadlines";

const key = "synthetic-activity-scheduler-key-32";
const base = { loginSecret: "synthetic-game", activitySchedulerSecret: key };

test("direct realm composition rejects external discovery without a dedicated owner endpoint key", () => {
    expect(() => validateRealmActivitySchedulerConfig({ loginSecret: "synthetic-game" })).not
        .toThrow();
    expect(() =>
        validateRealmActivitySchedulerConfig({ ...base, activitySchedulerMode: "external" })
    ).not.toThrow();
    expect(() =>
        validateRealmActivitySchedulerConfig({
            loginSecret: "synthetic-game",
            activitySchedulerMode: "external",
        })
    ).toThrow();
    expect(() =>
        validateRealmActivitySchedulerConfig({ ...base, activitySchedulerSecret: "short" })
    ).toThrow();
    for (
        const collision of [
            { loginSecret: key },
            { provisioningSecret: key },
            { avatarChat: { signingSecret: key } },
            { nicknameChat: { signingSecret: key } },
            { mailChat: { signingSecret: key } },
            { chatSession: { signingSecret: key } },
        ]
    )
    {
        expect(() => validateRealmActivitySchedulerConfig({ ...base, ...collision })).toThrow();
    }
});
