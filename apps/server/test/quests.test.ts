import { describe, test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { questPeriod } from "@opencok/tasks/rules/period";
import { createRealmQuestPolicy } from "../src/composition/quests";
import { createRealmQuestsDomain } from "../src/composition/quests";
import { sfs, decode } from "@opencok/messages/sfs";
import { cityFixture } from "./fixtures/city-progression";

const { progressQuests } = createRealmQuestPolicy();

const questsDomain = createRealmQuestsDomain();
const rules = await loadRules();
function fixture()
{
    const fixture = cityFixture(rules);
    fixture.state.buildings = [
        ...fixture.state.buildings,
        { uid: "owner", uuid: "castle", itemId: 400000, level: 1 },
    ];
    fixture.state.quests = {
        legacy: [],
        fresh: {},
        lord: { newDailyTaskFlushTime: 700000n },
        mixed: {},
        signIn: {},
        story: [],
        daily: [],
        alliance: {},
    };
    return fixture;
}
describe("quest progression", () => {
    test("initializes main and story progress using owned state", () => {
        const { state } = fixture();
        const plan = progressQuests(state, rules, 1000000n, () => 0);
        expect(plan.tasks?.length).toBeGreaterThan(0);
        expect(plan.story?.length).toBe(57);
        expect(plan.tasks?.every((row) => row.uid === "owner")).toBe(true);
    });
    test("retains claimed main and story rewards", () => {
        const { state } = fixture();
        const first = progressQuests(state, rules, 1000000n, () => 0);
        const task = first.tasks![0]!;
        task.state = 2;
        task.num = 2147483647;
        state.tasks = [task];
        state.quests!.story = first.story!;
        const next = progressQuests(state, rules, 1000000n, () => 0);
        expect(next.tasks?.find((row) => row.id === task.id)?.state).toBe(2);
    });
    test("resets daily state at five minutes after midnight", () => {
        const { state } = fixture();
        state.quests!.lord = { newDailyTaskFlushTime: 86400000n };
        state.quests!.daily = [{ uid: "owner", id: 170000, type: 0, num: 1, state: 2 }];
        expect(progressQuests(state, rules, 172800000n + 299999n, () => 0).resetDaily).toBe(false);
        expect(progressQuests(state, rules, 172800000n + 300000n, () => 0).resetDaily).toBe(true);
        expect(questPeriod(172800000n)).toBe(2n);
    });
    test("sign-in grants once per server day", async () => {
        const { context, state } = fixture();
        const info = await questsDomain.prepare(context, "signIn.info", {});
        expect(decode(Buffer.from(info.response)).loginReward).toBeDefined();
        state.quests!.signIn = { ...context.write.quests!.signIn! };
        await questsDomain.prepare(context, "signIn.reward", {});
        expect(context.write.quests!.signIn?.day).toBe(1);
        state.quests!.signIn = { ...context.write.quests!.signIn! };
        await expect(questsDomain.prepare(context, "signIn.reward", {})).rejects.toThrow();
    });
    test("rejects fabricated progress and future chapter claims", async () => {
        const { context } = fixture();
        await expect(
            questsDomain.prepare(context, "story.task.reward", {
                id: sfs.int(2906530),
                num: sfs.int(2147483647),
            }),
        ).rejects.toThrow();
        await expect(
            questsDomain.prepare(context, "task.reward.get", { id: sfs.string("not-a-quest") }),
        ).rejects.toThrow();
    });
});
