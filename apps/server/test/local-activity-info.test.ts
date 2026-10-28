import { test, expect } from "bun:test";
import { closedActivityPanels } from "@opencok/rules/local-activity-info";
import { Rules, type Rule } from "@opencok/rules/game";
import { loadRules } from "@opencok/resources/rules";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs, fields } from "@opencok/messages/sfs";
test("closed activity panels preserve native flags and exact UTC windows without activating malformed dates", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.power.activityPanels = new Map<string, Rule>([
        [
            "timed",
            {
                id: "timed",
                function_on: "1",
                close: "1",
                start: "2026-10-25-00-00",
                end: "2026-10-26-00-00",
            },
        ],
        ["always", { id: "always", function_on: "1", close: "1" }],
        ["disabled", { id: "disabled", function_on: "0", close: "1" }],
        ["visible", { id: "visible", function_on: "1", close: "0" }],
        [
            "invalid",
            {
                id: "invalid",
                function_on: "1",
                close: "1",
                start: "2026-02-30-00-00",
                end: "2026-10-26-00-00",
            },
        ],
    ]);
    const start = BigInt(Date.UTC(2026, 9, 25)),
        end = BigInt(Date.UTC(2026, 9, 26));
    expect(closedActivityPanels({}, rules, start)).toEqual(["timed", "always"]);
    expect(closedActivityPanels({}, rules, end)).toEqual(["timed", "always"]);
    expect(closedActivityPanels({}, rules, end + 1n)).toEqual(["always"]);
    expect(closedActivityPanels({ crossFightSrcServerId: 1 }, rules, start)).toEqual([]);
});
test("native reward previews and closed panel queries authenticate reads without granting inventory or invoking mutations", async () => {
    const rules = await loadRules();
    rules.reconnect.rewards!.set("synthetic", {
        id: "synthetic",
        wood: "123",
        gold: "9",
        item: "200300",
        num: "2",
        rate: "100",
        circle: "1",
    });
    const profile = Object.freeze({
        uid: "owner",
        name: "Synthetic",
        gold: 100n,
        banFlag: 0,
        serverId: 1,
        pf: "",
    });
    let reads = 0,
        mutations = 0;
    const game = createRealmGameService(
        {
            getProfileById: async () => {
                reads++;
                return profile;
            },
        } as unknown as GameStore,
        rules,
        { kingdomId: 1 },
        () => Date.UTC(2026, 9, 25),
        {
            cityProgression: async () => {
                mutations++;
                throw new Error("Unexpected mutation");
            },
        },
    );
    for (let index = 0; index < 5; index++)
    {
        const reply = await game.execute("owner", "resource.client.reward.get", {
            rewardId: sfs.string("synthetic"),
            _cok_: sfs.long(9007199254740993n),
        });
        expect(reply.body.rewardId).toEqual(sfs.string("synthetic"));
        expect(fields(reply.body.reward_list)).toEqual({
            item: sfs.string("200300"),
            num: sfs.string("2"),
            wood: sfs.string("123"),
            gold: sfs.string("9"),
        });
        expect(reply.body._cok_).toEqual(sfs.long(9007199254740993n));
    }
    expect((await game.execute("owner", "activity.close.info", {})).body.act_close).toBeDefined();
    await expect(
        game.execute("owner", "resource.client.reward.get", { rewardId: sfs.string("missing") }),
    ).rejects.toThrow();
    expect(profile.gold).toBe(100n);
    expect(mutations).toBe(0);
    expect(reads).toBe(7);
    const absent = createRealmGameService(
        { getProfileById: async () => undefined } as unknown as GameStore,
        rules,
        { kingdomId: 1 },
    );
    await expect(
        absent.execute("missing", "resource.client.reward.get", {
            rewardId: sfs.string("synthetic"),
        }),
    ).rejects.toThrow();
});
