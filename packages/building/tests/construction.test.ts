import { expect, test } from "bun:test";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs } from "@opencok/messages/sfs";
import { TimedActivityAction } from "@opencok/enums/timed-activity-action";
import type { TimedActivity } from "@opencok/base/contracts/activity";
import type { BuildingState } from "../src/contracts/building";
import type { ConstructionCatalog, ConstructionContext } from "../src/contracts/construction";
import type { ConstructionRuntime } from "../src/contracts/construction-runtime";
import { ConstructionPolicy } from "../src/rules/construction";
import { ConstructionCompletion } from "../src/services/completion";
import { ConstructionDomain } from "../src/services/construction";
import { buildingQueueType } from "../src/rules/queues";

function unexpected(): never
{
    throw new Error("Unexpected collaborator call");
}

function fixture()
{
    const calls: string[] = [];
    const definition: BuildingState = {
        id: 400001,
        buildingId: 400000,
        level: 1,
        starLevel: 0,
        starProgress: 0,
        experience: 10,
        power: 20,
    };
    const rules: ConstructionCatalog = {
        kingdomId: 1,
        positions: new Map([["first", { position: "1", building: "400000;403000", unlock: "0" }]]),
        reconnect: {},
        building: (_id, level) => ({ ...definition, level, power: level * 20 }),
        nextBuilding: () => ({ ...definition, level: 2 }),
    };
    const context: ConstructionContext<ConstructionCatalog> = {
        state: {
            profile: { civilizationType: 1 },
            buildings: [],
            queues: [],
            buildingExperience: {},
        },
        rules,
        owner: "owner",
        now: 1000n,
        write: {},
        economy: { gold: unexpected, resource: unexpected, item: unexpected },
        effect: unexpected,
        generalEffect: unexpected,
        ownBuilding: unexpected,
        idleBuilding: unexpected,
        balance: () => 30n,
        spend: unexpected,
        spendItem: unexpected,
        accelerate: unexpected,
        data: unexpected,
        refund: unexpected,
        resource: () => ({}),
        checkPower: unexpected,
        power: (delta, building) => calls.push(`power:${delta}:${building}`),
        experience: (value) => calls.push(`experience:${value}`),
    };
    const runtime: ConstructionRuntime<ConstructionCatalog, typeof context> = {
        text: (row, key) => String(row[key] ?? ""),
        num: (row, key) => Number(row[key] ?? 0),
        long: (row, key) => BigInt(String(row[key] ?? 0)),
        cityInteger: (value) => {
            const number = Number(value);
            if (!Number.isSafeInteger(number) || number < 0)
            {
                throw new GameError(errors.invalid, "city_progression");
            }
            return number;
        },
        cityLevel: (row) => Number(row.level),
        cityDuration: unexpected,
        reducedCityCost: unexpected,
        progressionActivityData: () => undefined,
        cityAssets: [],
        idleDeadline: -1n,
        prestige: () => {
            calls.push("prestige");
            return 2;
        },
        cityUnlockCount: unexpected,
        building: () => {
            calls.push("mapping");
            return {};
        },
        previewRewards: unexpected,
        rewardPreviewArray: unexpected,
        refreshPrayerBuilding: () => {
            calls.push("prayer");
        },
        recordTargetTask: () => {
            calls.push("task");
        },
        enrollCastleLevel: () => {
            calls.push("castle");
        },
        recordExpeditionScore: (_context, type, parameter, count) => {
            calls.push(`score:${type}:${parameter}:${count}`);
        },
    };
    return { calls, context, definition, runtime };
}

test("prerequisites reject in native order and defer prestige until structural requirements pass", () => {
    const { context, definition, runtime, calls } = fixture();
    const policy = new ConstructionPolicy(runtime);
    const rule = {
        ...definition,
        limit: 1,
        civilizationLevel: 3,
        requiredBuildings: [{ buildingId: 400000, level: 2 }],
        requiredStarBuildings: [{ levelId: 403002, quantity: 2 }],
    };
    expect(() => policy.requirements(context, rule)).toThrow(errors.buildingLimited);
    rule.limit = 0;
    expect(() => policy.requirements(context, rule)).toThrow(errors.resource);
    const state = { ...context.state, buildings: [{ itemId: 400000, level: 2, star: 0 }] };
    expect(() => policy.requirements({ ...context, state }, rule)).toThrow(errors.resource);
    expect(calls).toEqual([]);
    state.buildings.push({ itemId: 403000, level: 30, star: 2 }, {
        itemId: 403000,
        level: 30,
        star: 3,
    });
    expect(() => policy.requirements({ ...context, state }, rule)).toThrow(errors.prestige);
    expect(calls).toEqual(["prestige"]);
    rule.civilizationLevel = 2;
    expect(() => policy.requirements({ ...context, state }, rule)).not.toThrow();
    context.state.profile.civilizationType = 0;
    calls.length = 0;
    expect(() => policy.requirements({ ...context, state }, rule)).toThrow(errors.prestige);
    expect(calls).toEqual([]);
});

test("placement preserves first matching rule, exact membership and opened-position separators", () => {
    const { context, runtime } = fixture();
    const policy = new ConstructionPolicy(runtime);
    expect(() => policy.position(context, 1, "400000")).toThrow(errors.locked);
    expect(() => policy.position(context, 1, "40000")).toThrow(errors.invalid);
    expect(() => policy.position(context, 1.5, "400000")).toThrow(errors.invalid);
    expect(() => policy.position(context, -1, "400000")).toThrow(errors.invalid);
    for (const openedPos of ["2;1", "2|1", "2,1"])
    {
        context.state.profile.openedPos = openedPos;
        expect(() => policy.position(context, 1, "400000")).not.toThrow();
    }
    context.state.profile.openedPos = "11";
    const rules = {
        ...context.rules,
        positions: new Map([
            ...context.rules.positions,
            ["second", { position: "1", building: "400000", unlock: "1" }],
        ]),
    };
    expect(() => policy.position({ ...context, rules }, 1, "400000")).toThrow(errors.locked);
});

test("completion preserves callback order, historic experience ceiling and recovery task suppression", () => {
    for (const recovering of [false, true])
    {
        const { context, runtime, calls } = fixture();
        const row = { uuid: "castle", itemId: 400000, level: 1, refreshTime: 50n };
        const state = {
            ...context.state,
            buildings: [row],
            buildingExperience: { currentMax: 10n, historyMax: 15n },
        };
        const completing = recovering ? { type: 0, itemId: "castle" } : undefined;
        new ConstructionCompletion(runtime).complete(
            { ...context, state, completing },
            row,
            undefined,
        );
        expect(calls).toEqual([
            "power:20:20",
            "score:3:1:20",
            "experience:5",
            "prayer",
            ...(recovering ? [] : ["task"]),
            "castle",
            "mapping",
        ]);
        expect(context.write.buildingExperience).toEqual({ currentMax: 20n, historyMax: 20n });
        expect(context.write.buildings?.[0]).toMatchObject({
            uuid: "castle",
            level: 2,
            opType: 0,
            unlockFlag: 0,
            reward: 1,
            refreshTime: 50n,
            updateTime: 1000n,
        });
    }
});

test("rebuilding below the history ceiling never grants experience again", () => {
    const { context, runtime, calls } = fixture();
    const row = { uuid: "castle", itemId: 400000, level: 1 };
    const state = {
        ...context.state,
        buildings: [row],
        buildingExperience: { currentMax: 10n, historyMax: 100n },
    };
    new ConstructionCompletion(runtime).complete({ ...context, state }, row, undefined);
    expect(calls.some((call) => call.startsWith("experience:"))).toBe(false);
    expect(context.write.buildingExperience).toEqual({ currentMax: 20n, historyMax: 100n });
});

test("domain queue creation retains queue IDs and does not replace an existing primary queue", () => {
    const { context, runtime } = fixture();
    const completion = new ConstructionCompletion(runtime);
    const entries = [
        [403000, 6],
        [411000, 3],
        [416000, 2],
        [423000, 1],
        [424000, 8],
        [425000, 9],
        [426000, 10],
        [429000, 11],
        [436000, 16],
        [439000, 17],
        [440000, 18],
    ];
    for (const [itemId, type] of entries)
    {
        expect(buildingQueueType(itemId!)).toBe(type);
    }
    expect(buildingQueueType(400000)).toBeUndefined();
    completion.makeDomainQueue(context, { itemId: 403000 });
    expect(context.write.queues?.[0]).toMatchObject({
        ownerId: "owner",
        type: 6,
        qid: 1,
        endTime: -1n,
        itemId: "",
    });
    context.write.queues = undefined;
    completion.makeDomainQueue({
        ...context,
        state: { ...context.state, queues: [{ type: 6, qid: 1 }] },
    }, { itemId: 403000 });
    expect(context.write.queues).toBeUndefined();
});

test("command dispatch and detached activity callbacks retain the construction contract", async () => {
    const { context, runtime } = fixture();
    const domain = new ConstructionDomain(runtime);
    expect(domain.commands.map(String)).toEqual([
        "build.create",
        "build.upgrade",
        "build.destroy",
        "build.move",
        "buildingUnlock",
        "miracle.unlock",
        "buildingUnlock.info",
        "buildingUnlock.glory",
        "building.reward",
    ]);
    expect(domain.types).toEqual([0]);
    expect(domain.handles("build.create")).toBe(true);
    expect(domain.handles("build.create.extra")).toBe(false);
    const { prepare, apply } = domain;
    await expect(prepare(context, "buildingUnlock", { M__REQUEST_ID__H: sfs.string("invalid") }))
        .rejects.toThrow(errors.invalid);
    const activity: TimedActivity = {
        id: "activity",
        ownerId: "owner",
        queueId: "queue",
        type: 0,
        itemId: "building",
        startedAt: 1n,
        dueAt: 2n,
        version: 1,
        status: 0,
    };
    const refunds: unknown[] = [];
    const active = {
        ...context,
        ownBuilding: () => ({ uuid: "building", itemId: 403000, level: 0, opType: 1 }),
        refund: (data: unknown) => {
            refunds.push(data);
        },
    };
    await apply(active, TimedActivityAction.Cancel, activity);
    expect(refunds).toEqual([undefined]);
    expect(context.write.deletedBuildings).toEqual(["building"]);
});
