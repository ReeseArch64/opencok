import { expect, test } from "bun:test";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-resource-owner";
import type { GameServices } from "@opencok/contracts/game";
import type { RuleContext } from "@opencok/rules/availability";
import { ruleAvailable } from "@opencok/rules/availability";
import { readResourceOwnerLoadEffects } from "@opencok/services/world-resource-owner-effects";
import { resourceRawArmyLoad } from "@opencok/rules/world-resource-detail";
import { Rules, type Rule } from "@opencok/rules/game";

function fixture()
{
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("effect", { k1: "78;10|2196;20|214;10|207;20|218;50|895;8" });
    rules.items.set("merge_server", { k5: "" });
    rules.power.equipment = new Map<string, Rule>([
        ["9001", { para1: "214", num1: "5" }],
        ["9002", { site: "0", color: "2", para1: "78", num1: "2" }],
    ]);
    rules.power.generalSkills = new Map([["5001", {
        type: "0",
        para1: "133",
        base: "3",
        add: "2",
    }]]);
    for (const key of ["tech_newEffect", "17_wk"])
    {
        rules.features.set(key, { version: "99.0.0", online: "2" });
    }
    const snapshot: WorldResourceOwnerSnapshot = {
        effects: {
            profile: {
                uid: "owner",
                level: 20,
                civilizationType: 2,
                appVersion: "12.6.0",
                serverId: 99,
                crossFightSrcServerId: 2,
                decomposeSuitEffect: null,
            },
            generals: [{ ability: Buffer.from("[{\"5001\":2}]") }],
            sciences: [],
            civilizationSciences: [],
            sagaSciences: [],
            foreignSciences: [],
            equipment: [{ itemId: 9001, on: 1 }],
            heroes: [],
            dragons: [],
            dragonSkills: [],
            states: [],
            vip: undefined,
            allianceSciences: [],
            prestige: [],
            military: undefined,
            miracle: undefined,
            office: undefined,
            kingdomFights: [],
            territoryTrees: [],
            luckyDay: undefined,
            powerServer: undefined,
            throneRewards: [],
        },
        buildings: [{ uuid: "a", itemId: 400000, level: 30, star: 0 }],
        newGenerals: {
            moved: false,
            generals: [
                {
                    id: 7,
                    state: 2,
                    buildingUuid: "a",
                    star: 1,
                    baseSkill: null,
                    talent: null,
                    opTime: null,
                    refinement: null,
                },
            ],
            statuses: [],
            offices: [],
            equipment: [{ generalId: 7, itemId: 9002, extraProperty: "78,3" }],
        },
    };
    const world = new Map([
        ["78", "{\"value\":\"1.25\",\"endTime\":9007199254740993}"],
        ["2196", "{\"value\":\"3.5\"}"],
        ["133", "{\"value\":\"999\"}"],
        ["895", "{\"value\":\"1\"}"],
    ]);
    const calls: [string, number | undefined][] = [];
    const state = {
        emperor: undefined as number | null | undefined,
        expeditionStage: 3,
        failExpedition: false,
        ticks: 0,
        expeditionReads: 0,
    };
    const services: Pick<GameServices, "worldPowerEffects" | "emperorVersion" | "expeditionStage"> =
        {
            expeditionStage: async () => {
                state.expeditionReads++;
                if (state.failExpedition)
                {
                    throw new Error("Synthetic expedition failure");
                }
                return state.expeditionStage;
            },
            worldPowerEffects: async (realm) => {
                calls.push(["world", realm]);
                return world;
            },
            emperorVersion: async (realm) => {
                calls.push(["emperor", realm]);
                return state.emperor;
            },
        };
    const resolve = (patch: Partial<RuleContext> = {}) => {
        const context = { now: 1000, kingdomId: 2, version: "0.0.0", ...patch };
        return readResourceOwnerLoadEffects(snapshot, rules, context, services, () => {
            state.ticks++;
            return 1000n;
        });
    };
    return { rules, snapshot, world, calls, state, services, resolve };
}

const expected = {
    worldLoad: 11.25,
    worldLoadAdd: 23.5,
    general: 5,
    newGeneral: 10.3125,
    expedition: 9,
};

test("expedition selector failures remain local while early matching selectors reach the saved phase", async () => {
    const f = fixture();
    f.rules.features.set("17_wk", { version: "99.0.0", online: "+２;bad" });
    expect(await f.resolve()).toEqual(expected);
    expect(f.state.expeditionReads).toBe(1);
    f.rules.features.set("17_wk", { version: "99.0.0", online: "bad;2" });
    expect(await f.resolve()).toEqual({ ...expected, expedition: 0 });
    expect(f.state.expeditionReads).toBe(1);
});

test("saved owner abilities and realm effects feed all five load contributions and concrete general equipment modifiers", async () => {
    const f = fixture();
    const before = structuredClone(f.snapshot);
    const effects = await f.resolve();
    expect(effects).toEqual(expected);
    expect(f.calls).toEqual([["world", 2]]);
    expect(f.state.ticks).toBe(1);
    expect(f.state.expeditionReads).toBe(1);
    expect(f.snapshot).toEqual(before);
    f.rules.arms.set("troop", { load: "100" });
    expect(
        resourceRawArmyLoad(
            {
                cachedLoad: 0,
                residentOwner: true,
                soldiers: [{ armsId: "troop", total: 1, dead: 0, loadEffect: 0 }],
                effects,
            },
            f.rules,
        ),
    ).toBe(159);
});

test("resource effects route both cache reads to the execution realm and only read emperor state for reward records", async () => {
    const f = fixture();
    f.snapshot.effects.throneRewards = [{ version: 7, rewardId: 1001 }];
    f.rules.power.monarchTitles = new Map([["1001", { effect: "78|214|895", num: "4|10|2" }]]);
    f.state.emperor = 7;
    expect(await f.resolve()).toEqual({
        ...expected,
        worldLoad: 15.25,
        newGeneral: 11.0625,
        expedition: 11,
    });
    expect(f.calls).toEqual([
        ["world", 2],
        ["emperor", 2],
    ]);
    f.calls.length = 0;
    f.state.emperor = null;
    expect(await f.resolve({ kingdomId: 3 })).toEqual({ ...expected, expedition: 0 });
    expect(f.calls).toEqual([
        ["world", 3],
        ["emperor", 3],
    ]);
    f.state.emperor = undefined;
    await expect(f.resolve()).rejects.toThrow();
    delete f.services.emperorVersion;
    await expect(f.resolve()).rejects.toThrow();
    f.snapshot.effects.throneRewards = [];
    expect(await f.resolve()).toEqual(expected);
});

test("ordinary owner feature gates use saved legacy versions including blanks rather than the observer version", async () => {
    const f = fixture();
    f.rules.features.set("civilization", { version: "12.6.0", online: "2" });
    f.rules.power.prestigeLevelRecords = [{ reputation_point: "100", reputation_level: "1" }];
    f.rules.power.civilizationFeatures = new Map([
        ["p", { type: "2", reputation_level: "1", effect: "78;4|214;10" }],
    ]);
    f.snapshot.effects.prestige = [{ civilizationType: 2, prestigeValue: 100n }];
    for (const version of ["12.6.0", "13", ".12..6.0.", null, "", "\u2000"])
    {
        f.snapshot.effects.profile.appVersion = version;
        expect(await f.resolve({ version: "0.0.0" })).toEqual({
            ...expected,
            worldLoad: 15.25,
            newGeneral: 11.0625,
        });
    }
    f.snapshot.effects.profile.appVersion = "11";
    expect(await f.resolve({ version: "99.0.0" })).toEqual(expected);
    f.snapshot.effects.profile.appVersion = "13.bad";
    await expect(f.resolve()).rejects.toThrow();
});

test("ordinary feature gates share the restored-owner version behavior", () => {
    const rule = { version: "12.6.0", online: "2" };
    const context = { now: 1000, kingdomId: 2, version: "" };
    expect(ruleAvailable(rule, context)).toBe(true);
    expect(ruleAvailable(rule, { ...context, version: "13" })).toBe(true);
    expect(ruleAvailable(rule, { ...context, version: "11" })).toBe(false);
    expect(() => ruleAvailable(rule, { ...context, version: "13.bad" })).toThrow();
    expect(ruleAvailable({ ...rule, online: "" }, { ...context, version: "bad" })).toBe(false);
    expect(ruleAvailable({ ...rule, version: "" }, context)).toBe(false);
});

test("new-general restoration failure clears only that contribution and keeps ordinary and expedition effects", async () => {
    const f = fixture();
    f.snapshot.newGenerals.generals[0]!.talent = "1;bad";
    expect(await f.resolve()).toEqual({ ...expected, newGeneral: 0 });
    expect(f.state.ticks).toBe(0);
    f.snapshot.newGenerals.generals[0]!.talent = null;
    f.rules.power.equipment!.delete("9002");
    expect(await f.resolve()).toEqual({ ...expected, newGeneral: 0 });
    f.snapshot.newGenerals.equipment = [];
    f.snapshot.newGenerals.generals[0]!.state = 1;
    expect(await f.resolve()).toEqual({ ...expected, newGeneral: 0 });
});

test("expedition dependencies are consumed only after gates and preserve their local exception fallback", async () => {
    const f = fixture();
    f.state.failExpedition = true;
    expect(await f.resolve()).toEqual({ ...expected, expedition: 0 });
    expect(f.state.expeditionReads).toBe(1);
    f.rules.features.delete("17_wk");
    expect(await f.resolve()).toEqual({ ...expected, expedition: 0 });
    expect(f.state.expeditionReads).toBe(1);
    f.state.failExpedition = false;
    f.rules.features.set("17_wk", { version: "99.0.0", online: "2" });
    f.snapshot.effects.profile.crossFightSrcServerId = 99;
    expect(await f.resolve()).toEqual({ ...expected, expedition: 0 });
});

test("missing or failed world metadata is not replaced by empty owner effects", async () => {
    const f = fixture();
    delete f.services.worldPowerEffects;
    await expect(f.resolve()).rejects.toThrow();
    expect(f.calls).toEqual([]);
    f.services.worldPowerEffects = async () => {
        throw new Error("Synthetic cache failure");
    };
    await expect(f.resolve()).rejects.toThrow("Synthetic cache failure");
    f.services.worldPowerEffects = async () => new Map([["78", "{\"value\":1}"]]);
    await expect(f.resolve()).rejects.toThrow();
    f.services.worldPowerEffects = async () => new Map([["78", "{\"value\":\"bad\"}"]]);
    await expect(f.resolve()).rejects.toThrow();
});

test("owner skill decoding is bounded and fails before realm metadata reads; ordinary calculation failures remain visible", async () => {
    const f = fixture();
    f.snapshot.effects.generals = [{ ability: Buffer.from("[{\"5001\":\"2\"}]") }];
    await expect(f.resolve()).rejects.toThrow();
    expect(f.calls).toEqual([]);
    f.snapshot.effects.generals = Array(4097).fill({ ability: null });
    await expect(f.resolve()).rejects.toThrow();
    expect(f.calls).toEqual([]);
    f.snapshot.effects.generals = [];
    f.rules.power.equipment!.delete("9001");
    await expect(f.resolve()).rejects.toThrow();
});

test("invalid execution realm or time rejects before any dependency or effect callback", async () => {
    const f = fixture();
    for (const kingdomId of [0, -1, 1.5, NaN, 2147483648])
    {
        await expect(f.resolve({ kingdomId })).rejects.toThrow();
    }
    for (const now of [NaN, Infinity, 0.5, 9007199254740992])
    {
        await expect(f.resolve({ now })).rejects.toThrow();
    }
    expect(f.calls).toEqual([]);
    expect(f.state.ticks).toBe(0);
    expect(f.state.expeditionReads).toBe(0);
});

test("world expiration and moved-owner associations affect only their own contributions", async () => {
    const f = fixture();
    f.world.set("78", "{\"value\":\"bad\",\"endTime\":1000}");
    f.snapshot.newGenerals.moved = true;
    expect(await f.resolve()).toEqual({ ...expected, worldLoad: 10, newGeneral: 0 });
    f.world.set("78", "{\"value\":\"1.25\",\"endTime\":1001}");
    expect(await f.resolve()).toEqual({ ...expected, newGeneral: 0 });
});
