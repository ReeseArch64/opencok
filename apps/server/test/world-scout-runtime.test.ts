import {
    scoutRoute,
    scoutSoldierLimit,
    scoutExpeditionEffect,
    scoutWatchtower,
} from "@opencok/services/world-scout-runtime";
import type { CityProgressionContext } from "@opencok/services/city-progression";
import savedMarch from "./fixtures/reconnect-march-army.json";
import {
    decodeWorldMarchSpeedEffects,
    encodeWorldMarchArmy,
} from "@opencok/messages/world-resource-army";
import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
    reserveMarch,
    arriveForGathering,
    completeMarchReturn,
    recallOutbound,
} from "@opencok/rules/world-march-lifecycle";
import { ordinaryMarchRoute } from "@opencok/rules/world-march-runtime";

const rules = await loadRules();
test("empty scout parties cannot gather or acquire cargo and return without troop manufacture", () => {
    const outbound = reserveMarch(
        {
            id: "scout",
            owner: "owner",
            purpose: "scout",
            worldId: 0,
            origin: 1202,
            target: 10,
            startedAt: 1000n,
            dueAt: 2000n,
            returnDuration: 1000n,
            troops: [],
        },
        [],
    );
    expect(outbound.troops).toEqual([]);
    expect(() => arriveForGathering(outbound.march, "owner", 1, 2000n, 1000n)).toThrow();
    const returning = recallOutbound(outbound.march, "owner", 1, 1500n, 500n);
    expect(
        completeMarchReturn(returning.march, "owner", 2, returning.march.dueAt, []).credit,
    ).toBeNull();
});
test("scout reverse routes retain Source Java edge coordinates without requiring a city at the target", () => {
    const configured = rules.items.get("world_marchtime")!;
    rules.items.set("world_marchtime", { ...configured, k1: "1", k3: "100", k5: "1" });
    try
    {
        const route = ordinaryMarchRoute(
            rules,
            1200,
            10,
            1202,
            1,
            0,
            true,
            false,
            0,
            true,
            [10, 9, -1, -1],
            [1202],
            true,
        );
        expect(route.duration).toBe(316000n);
        expect(route.segments).toEqual([]);
    }
    finally
    {
        rules.items.set("world_marchtime", configured);
    }
});

test("native scout import retains Java saved speed effects and rejects corrupt stream tails", () => {
    const bytes = Buffer.from(savedMarch.companions, "base64");
    expect([...decodeWorldMarchSpeedEffects(bytes)!]).toEqual([["100001", 0]]);
    expect(() => decodeWorldMarchSpeedEffects(Buffer.concat([bytes, Buffer.from([0])]))).toThrow();
    expect(
        decodeWorldMarchSpeedEffects(
            encodeWorldMarchArmy({
                owner: "owner",
                cachedLoad: 0,
                soldiers: [],
                dragons: [],
                general: null,
            }),
        ),
    ).toBeUndefined();
});

test("scout troop quota uses the owned school, real effects, float percentages and Source one-unit tolerance", () => {
    const effects = new Map([
        [56, 100],
        [171, 50],
        [882, 7],
        [8, 20],
        [2071, 5],
        [2439, 10],
    ]);
    const context = {
        state: { profile: { civilizationType: 1 }, buildings: [{ itemId: 427000, level: 1 }] },
        rules,
        now: 1000n,
        effect: (id: number) => effects.get(id) ?? 0,
        generalEffect: (id: number) => (id === 56 ? 20 : id === 882 ? 3 : 0),
    } as unknown as CityProgressionContext;
    expect(scoutSoldierLimit(context)).toBe(5640);
    expect(
        scoutSoldierLimit({
            ...context,
            state: { ...context.state, buildings: [] },
        } as unknown as CityProgressionContext),
    ).toBe(1590);
});
test("scout expedition capacity requires an admitted live fighting phase and actual Source controls", () => {
    for (const id of ["17_wk", "tech_newEffect"])
    {
        rules.features.set(id, { id, online: "all", test: "all", version: "1.0.0" });
    }
    rules.features.set("wk_switch_new", {
        id: "wk_switch_new",
        online: "close",
        test: "close",
        version: "1.0.0",
    });
    const context = {
        state: {
            expedition: {
                period: { periodId: "factual-period" },
                phase: { stage: 8, startTime: 1000n, endTime: 2000n },
            },
        },
        rules,
        now: 1500n,
        effect: () => 2,
    } as unknown as CityProgressionContext;
    expect(scoutExpeditionEffect(context, 908)).toBe(2);
    expect(
        scoutExpeditionEffect({ ...context, now: 2000n } as unknown as CityProgressionContext, 908),
    ).toBe(0);
    expect(
        scoutExpeditionEffect(
            {
                ...context,
                state: {
                    ...context.state,
                    expedition: { ...context.state.expedition!, projectionOnly: true },
                },
            } as unknown as CityProgressionContext,
            908,
        ),
    ).toBe(0);
    expect(
        scoutExpeditionEffect(
            {
                ...context,
                state: {
                    ...context.state,
                    expedition: {
                        ...context.state.expedition!,
                        phase: { stage: 7, startTime: 1000n, endTime: 2000n },
                    },
                },
            } as unknown as CityProgressionContext,
            908,
        ),
    ).toBe(0);
});

test("legacy native scout return keeps the Source type-six destination footprint", () => {
    const configured = rules.items.get("world_marchtime")!;
    rules.items.set("world_marchtime", { ...configured, k1: "1", k3: "100", k5: "1" });
    try
    {
        const context = {
            state: {
                buildings: [],
                worldMutation: {
                    world: { pointId: 1202 },
                    points: [],
                    cityFootprint: [1, 2, 1201, 1202],
                },
            },
            rules,
            now: 1000n,
            effect: () => 0,
        } as unknown as CityProgressionContext;
        const target = {
            point: { id: 10, pointType: 6 },
            reinforcements: [],
            rallies: [],
            cityBosses: [],
        };
        expect(scoutRoute(context, target, 1200, 1, true).duration).toBe(200000n);
    }
    finally
    {
        rules.items.set("world_marchtime", configured);
    }
});

test("scout execution watchtower values use the actual caller version", () => {
    const context = {
        state: {
            profile: { appVersion: "1.0.0" },
            buildings: [{ itemId: 417000, level: 30, star: 5, progress: 0, effectTime: 0n }],
        },
        rules,
        now: 200000000n,
    } as unknown as CityProgressionContext;
    expect(scoutWatchtower(context).speed).toBe(0);
    expect(scoutWatchtower(context).ready).toBe(false);
    context.state.profile.appVersion = "12.06.0";
    expect(scoutWatchtower(context).speed).toBe(100);
    expect(scoutWatchtower(context).ready).toBe(true);
    context.state.profile.appVersion = "";
    expect(scoutWatchtower(context).speed).toBe(100);
});
