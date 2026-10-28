import { expect, test } from "bun:test";
import { branchCityDomain } from "@opencok/services/branch-city";
import { Rules } from "@opencok/rules/game";
import { decode, sfs, type Fields } from "@opencok/messages/sfs";
import { cityFixture } from "./fixtures/city-progression";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";

function setup(level: number, state: number | null = null)
{
    const rules = new Rules(new Map(), new Map(), new Map());
    for (const id of ["subcity", "hero_building"])
    {
        rules.features.set(id, { id, online: "all", version: "1.0.0", pf: "all" });
    }
    rules.items.set("subcity_reward", { k4: "20", k5: "15" });
    const h = cityFixture(rules);
    h.state.branchCity = state === null ? null : { openstate: state };
    h.state.buildings = [{ itemId: 400000, level, star: 0 }];
    const run = async (command: string, params: Fields = {}) =>
        decode(Buffer.from((await branchCityDomain.prepare(h.context, command, params)).response));
    return { ...h, rules, run };
}

test("branch area opens in stages, never downgrades, and preserves typed login state", async () => {
    const h = setup(15);
    expect((await h.run("branchcity.init")).branchcityopen).toEqual(sfs.int(0));
    expect((await h.run("branchcity.open", { branchCityType: sfs.int(1) })).branchcityopen).toEqual(
        sfs.int(2),
    );
    expect(h.context.write.branchCityOpenState).toBe(2);
    const hero = setup(20, 2);
    expect(
        (await hero.run("branchcity.open", { branchCityType: sfs.int(2) })).branchcityopen,
    ).toEqual(sfs.int(1));
    expect(hero.context.write.branchCityOpenState).toBe(1);
    const full = setup(20, 1);
    expect(
        (await full.run("branchcity.open", { branchCityType: sfs.int(1) })).branchcityopen,
    ).toEqual(sfs.int(1));
    expect(full.context.write.branchCityOpenState).toBeUndefined();
    expect((await full.run("branchcity.init")).branchcityopen).toEqual(sfs.int(1));
});

test("branch opening enforces feature and castle gates without granting progress", async () => {
    for (
        const [level, type] of [
            [14, 1],
            [19, 2],
        ]
    )
    {
        const h = setup(level!);
        await expect(h.run("branchcity.open", { branchCityType: sfs.int(type!) })).rejects
            .toThrow();
        expect(h.context.write).toEqual({});
    }
    const h = setup(19);
    h.state.buildings[0]!.star = 1;
    expect((await h.run("branchcity.open", { branchCityType: sfs.int(2) })).branchcityopen).toEqual(
        sfs.int(1),
    );
    h.rules.features.get("subcity")!.online = "close";
    await expect(h.run("branchcity.open", { branchCityType: sfs.int(2) })).rejects.toThrow();
    await expect(h.run("branchcity.open", { branchCityType: sfs.string("2") })).rejects.toThrow();
});

test("legacy requests retain boolean wire types and do not upgrade existing hero state", async () => {
    const h = setup(20, 2);
    h.rules.features.get("hero_building")!.online = "close";
    expect((await h.run("branchcity.init")).branchcityopen).toEqual(sfs.bool(true));
    expect((await h.run("branchcity.open")).branchcityopen).toEqual(sfs.bool(true));
    expect(h.context.write.branchCityOpenState).toBeUndefined();
});

test("branch opening is routed with native correlation and initialization stays internal", async () => {
    const calls: string[] = [];
    const game = createRealmGameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1000,
        {
            cityProgression: async (_uid, command) => {
                calls.push(command);
                return { body: { branchcityopen: sfs.int(1) }, pushes: [] };
            },
        },
    );
    const result = await game.execute("owner", "branchcity.open", {
        branchCityType: sfs.int(2),
        _cok_: sfs.string("branch"),
    });
    expect(result.body.branchcityopen).toEqual(sfs.int(1));
    expect(result.body._cok_).toEqual(sfs.string("branch"));
    expect(calls).toEqual(["branchcity.open"]);
    await expect(game.execute("owner", "branchcity.init", {})).rejects.toThrow();
});

test("login and reconnect publish saved branch state at the init root", async () => {
    const h = setup(20, 1);
    h.rules.roles.set("100100", { id: "100100", player_exp: "100" });
    const profile = { uid: "owner" };
    const { emptyPowerState } = await import("./fixtures/power-state");
    const store = {
        getCityByPlayerId: async () => ({
            profile,
            resource: {},
            world: { worldId: 0 },
            buildings: [],
            queues: [],
            armies: [],
            items: [],
            hasMarches: false,
        }),
        getPowerByPlayerId: async () => emptyPowerState(profile),
    } as unknown as GameStore;
    const game = createRealmGameService(store, h.rules, { kingdomId: 1 }, () => 1000000, {
        cityProgression: async (_owner, command) => ({
            body: command === "branchcity.init" ? await h.run(command) : {},
            pushes: [],
        }),
    });
    for (let attempt = 0; attempt < 2; attempt++)
    {
        expect((await game.initialize("owner")).body.branchcityopen).toEqual(sfs.int(1));
    }
});
