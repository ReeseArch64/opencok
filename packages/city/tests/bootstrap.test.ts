import { expect, test } from "bun:test";
import { CityBootstrapService } from "../src/services/bootstrap";
import { CityBootstrapMapper } from "../src/mappings/bootstrap";
import type { CityBootstrapServices, CityBootstrapReconnect } from "../src/contracts/bootstrap";
import type { CityState } from "@opencok/contracts/game";
import type { ReconnectProgressState, ReconnectProgressWrite } from "@opencok/contracts/reconnect";
import { Rules } from "@opencok/rules/game";
import { sfs, fields, type Fields } from "@opencok/messages/sfs";

function fixture(services: CityBootstrapServices = {}, reconnect?: CityBootstrapReconnect)
{
    const rules = new Rules(
        new Map(),
        new Map([["100100", { id: "100100", player_exp: "100" }]]),
        new Map(),
    );
    const state: CityState = {
        profile: { uid: "owner", civilizationType: 3, civilizationSorce: 9007199254740993n },
        resource: {},
        buildings: [],
        queues: [],
        world: { worldId: 0, pointId: 17 },
        armies: [],
        items: [],
        lord: undefined,
        hasMarches: false,
        civilizationPrestige: 9007199254740995n,
    };
    const calls: string[] = [];
    const hooks = {
        power: async () => {
            calls.push("power");
            return {};
        },
        features: () => {
            calls.push("features");
            return {};
        },
    };
    const mapper = new CityBootstrapMapper(rules, () => 1000, {
        kingdomId: 2,
        features: hooks.features,
        hasReconnect: () => Boolean(services.reconnect),
    });
    const service = new CityBootstrapService(
        {
            getCityByPlayerId: async (uid, now) => {
                expect(uid).toBe("owner");
                expect(now).toBe(1000);
                calls.push("state");
                return state;
            },
        },
        { kingdomId: 2 },
        () => 1000,
        services,
        hooks,
        mapper,
        reconnect ?? {
            plan: async () => {
                throw new Error("Unexpected reconnect planning");
            },
            validate: () => {
                throw new Error("Unexpected reconnect validation");
            },
        },
    );

    return { service, state, mapper, calls };
}

test("bootstrap preserves serial recovery, response precedence and initial push order", async () => {
    const actions: string[] = [];
    const command = async (_uid: string, name: string) => {
        actions.push(name);
        return { body: { winner: sfs.string(name) }, pushes: [{ command: name, body: {} }] };
    };
    const h = fixture({
        hotItemBusinessMan: async () => {
            actions.push("merchant");
            return {};
        },
        cityProgression: command,
        reconcileAlliance: async () => {
            actions.push("reconcile-alliance");
        },
        reconcileTimed: async () => {
            actions.push("reconcile-timed");
        },
        alliance: command,
        worldEffectBoard: async () => {
            actions.push("world-effects");
            return {};
        },
    });
    const before = structuredClone(h.state);
    const result = await h.service.initialize("owner");
    expect(actions).toEqual([
        "merchant",
        "egg.activity.init",
        "normal.recharge.init",
        "comeback.init",
        "prayer.init",
        "recall.task.init",
        "region.recall.init",
        "heart.init",
        "gift.init",
        "world.tick",
        "treasuremap.init",
        "reconcile-alliance",
        "reconcile-timed",
        "effects.init",
        "quest.init",
        "equipment.init",
        "general.init",
        "dragon.init",
        "civilization.science.data.init",
        "dragontower.init",
        "vip.box.init",
        "target.init",
        "new.sercum.init",
        "ordinary.box.init",
        "sevenday.init",
        "branchcity.init",
        "invest.init",
        "castle.event.init",
        "luckyday.init",
        "campaign.init",
        "lottery.init",
        "totem.init",
        "alliance.init",
        "world-effects",
    ]);
    expect(result.pushes.map((push) => push.command)).toEqual([
        "egg.activity.init",
        "prayer.init",
        "recall.task.init",
        "region.recall.init",
        "heart.init",
        "gift.init",
        "world.tick",
        "effects.init",
        "quest.init",
        "equipment.init",
        "general.init",
        "dragon.init",
        "dragontower.init",
        "vip.box.init",
        "luckyday.init",
        "castle.event.init",
        "invest.init",
        "sevenday.init",
        "ordinary.box.init",
        "new.sercum.init",
        "target.init",
        "civilization.science.data.init",
        "campaign.init",
        "lottery.init",
        "totem.init",
        "alliance.init",
        "world.effect.push",
    ]);
    expect(h.calls).toEqual(["state", "power", "features"]);
    expect(result.body.winner).toEqual(sfs.string("quest.init"));
    expect(fields(result.body.user).civilization_score).toEqual(sfs.long(9007199254740993n));
    expect(fields(result.body.user).civilization_prestige).toEqual(sfs.long(9007199254740995n));
    expect(result.body.newAccount).toEqual(sfs.bool(false));
    expect(h.state).toEqual(before);
});

test("an aborted bootstrap stops before work or immediately after an awaited mechanic", async () => {
    const controller = new AbortController();
    const commands: string[] = [];
    const h = fixture({
        cityProgression: async (_uid, command) => {
            commands.push(command);
            if (command === "prayer.init")
            {
                controller.abort(new Error("stop login"));
            }
            return { body: {}, pushes: [] };
        },
    });
    await expect(h.service.initialize("owner", {}, controller.signal)).rejects.toThrow(
        "stop login",
    );
    expect(commands).toEqual([
        "egg.activity.init",
        "normal.recharge.init",
        "comeback.init",
        "prayer.init",
    ]);
    expect(h.calls).toEqual([]);
    await expect(h.service.initialize("owner", {}, controller.signal)).rejects.toThrow(
        "stop login",
    );
    expect(commands).toHaveLength(4);
});

test("missing and banned city state is rejected before projection, and marches require reconnect", async () => {
    const h = fixture();
    h.state.profile = undefined;
    await expect(h.service.state("owner")).rejects.toMatchObject({ code: "E100169" });
    h.state.profile = { uid: "owner", banTime: 1001n };
    await expect(h.service.state("owner")).rejects.toMatchObject({ code: "E000000" });
    h.state.profile = { uid: "owner", banFlag: 1 };
    await expect(h.service.state("owner")).rejects.toMatchObject({ code: "E000000" });
    h.state.profile = { uid: "owner", banTime: 1000n };
    expect((await h.service.state("owner")).profile).toBe(h.state.profile);
    h.state.hasMarches = true;
    await expect(h.service.initialize("owner")).rejects.toMatchObject({ reason: "world_state" });
    expect(h.calls).not.toContain("power");
});

test("queue projection retains variant payloads and the forever sentinel", async () => {
    const h = fixture();
    const state = { ...h.state, profile: h.state.profile!, resource: h.state.resource! };
    for (const type of [1, 8, 9, 10, 17])
    {
        const row = { type, itemId: "target", endTime: 9223372036854775807n };
        const result = h.mapper.queueFields(row, state, false);
        expect(fields(result.itemObj)).toEqual({
            itemId: sfs.string("target"),
            allId: sfs.string("target"),
        });
        expect(result.endTime).toEqual(sfs.long(0n));
        expect(result.isHelped).toBeUndefined();
    }
    for (const type of [2, 3, 6])
    {
        expect(fields(h.mapper.queueFields({ type, itemId: "target" }, state).itemObj))
            .toEqual({ itemId: sfs.string("target") });
    }
    state.equipment = [{ uuid: "gear", itemId: "definition", cost: "saved-cost" }];
    expect(fields(h.mapper.queueFields({ type: 11, itemId: "gear" }, state).itemObj))
        .toEqual({ itemId: sfs.string("definition"), cost: sfs.string("saved-cost") });
    expect(fields(h.mapper.queueFields({ type: 11, itemId: "absent" }, state).itemObj)).toEqual({});
    expect(
        fields(h.mapper.queueFields({ type: 12, itemId: "first;second", para: 7 }, state).itemObj),
    )
        .toEqual({
            itemId: sfs.string("first"),
            allId: sfs.string("first;second"),
            para: sfs.int(7),
        });
    expect(() => h.mapper.queueFields({ type: 99, itemId: "unknown" }, state)).toThrow();
});

test("reconnect projection retains transaction identity, settled state, correlation and ordered pushes", async () => {
    let committed = false;
    const progress = {
        profile: { uid: "owner", civilizationType: 3 },
        resource: {},
        buildings: [],
        queues: [],
        world: { worldId: 0, pointId: 29 },
        effects: {
            prestige: [{ civilizationType: 3, prestigeValue: 9007199254740997n }],
            sciences: [],
        },
    } as unknown as ReconnectProgressState;
    const planned = {
        write: {
            resource: { food: 17n },
            buildingRefreshes: [],
        } as unknown as ReconnectProgressWrite,
        result: {
            body: { winner: sfs.string("planned"), worldMarch: sfs.array() } as Fields,
            pushes: [{ command: "reconnected", body: {} }],
        },
    };
    const correlation = sfs.long(9007199254740999n);
    const h = fixture({
        cityProgression: async (_uid, command) => ({
            body: {},
            pushes: command === "quest.init" ? [{ command: "quest", body: {} }] : [],
        }),
        reconnect: async (uid, now, plan) => {
            expect(uid).toBe("owner");
            expect(now).toBe(1000);
            const result = await plan(progress);
            expect(Object.is(result, planned)).toBe(true);
            committed = true;
            return result.result;
        },
    }, {
        plan: async (state, context) => {
            expect(state).toBe(progress);
            expect(context.kingdomId).toBe(2);
            expect(context.now).toBe(1000);
            return planned;
        },
        validate: (result, command) => {
            expect(command).toBe("init");
            expect(committed).toBe(false);
            expect(result.body._cok_).toBe(correlation);
        },
    });
    h.state.hasMarches = true;
    const result = await h.service.initialize("owner", { _cok_: correlation });
    expect(committed).toBe(true);
    expect(result).toBe(planned.result);
    expect(result.body.winner).toEqual(sfs.string("planned"));
    expect(fields(result.body.world).point).toEqual(sfs.int(29));
    expect(fields(result.body.world).m).toBe(planned.result.body.worldMarch);
    expect(fields(result.body.user).civilization_prestige).toEqual(sfs.long(9007199254740997n));
    expect(result.pushes.map((push) => push.command)).toEqual(["quest", "reconnected"]);
});
