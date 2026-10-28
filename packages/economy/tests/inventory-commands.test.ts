import { expect, test } from "bun:test";
import type { InventorySnapshotRow } from "../src/contracts/inventory-ledger.ts";
import { InventoryService } from "../src/services/inventory.ts";
import { InventoryPlanner } from "../src/services/inventory-planner.ts";
import type {
    InventoryCommandState as InventoryState,
    InventoryPlan,
    InventoryExecutor,
} from "../src/contracts/inventory-planning.ts";
import type { InventoryPlanningCatalogs as Rules } from "../src/contracts/inventory-catalogs.ts";
import { inventoryReplay } from "../src/mappings/inventory.ts";
import { resource } from "../src/mappings/resources.ts";
import { encode, decode, fields, sfs, type Fields } from "@opencok/messages/sfs";

const operationId = "AAAAAAAA-BBBB-4CCC-8DDD-EEEEEEEEEEEE";
const effects = {
    feature: () => false,
    resourceBonus: async () => 0,
    confirmedSpending: () => undefined,
};

function fixture()
{
    const actions: string[] = [];
    const state = {
        profile: { uid: "owner", gold: 3n, paidSpecialGold: 4n, paidGold: 20n },
        resource: {},
        items: [{ uuid: "stack", itemId: "100", count: 1, value: 0, vanishTime: 0n }],
        cooldowns: new Map<string, bigint>(),
        buildings: [],
        effects: async (): Promise<never> => {
            throw new Error("Unexpected power read");
        },
        useEffect: undefined as InventoryState["useEffect"],
        recordAction: (async (kind, id, count) => {
            actions.push(`${kind}:${id}:${count}`);
        }) as InventoryState["recordAction"],
    };
    const rules = {
        kingdomId: 1,
        goods: new Map<string, Record<string, string>>([
            ["100", { id: "100", type: "21", price: "5", useall: "1" }],
            ["101", { id: "101", type: "21", price: "2" }],
            ["102", { id: "102", type: "4", cd_time: "1", useall: "1" }],
        ]),
        materials: new Map([["222", { material: "100;2", target: "101;1" }]]),
        items: new Map<string, Record<string, string>>(),
        features: new Map(),
        power: {},
    } as unknown as Rules;
    const captured: { command: Parameters<InventoryExecutor>[0]; plan?: InventoryPlan; }[] = [];
    const execute: InventoryExecutor = async (command, plan) => {
        const entry = { command, plan: undefined as InventoryPlan | undefined };
        captured.push(entry);
        await Promise.resolve();
        entry.plan = await plan(state);
        return Buffer.from(entry.plan.response);
    };

    return {
        state,
        rules,
        actions,
        captured,
        service: new InventoryService(execute, rules, effects, () => 100),
    };
}

test("inventory command validation rejects malformed inputs before executing a transaction", async () => {
    const { service, captured } = fixture();
    const valid = {
        itemId: sfs.string("100"),
        num: sfs.int(1),
        operationId: sfs.string(operationId),
    };
    const invalid: Fields[] = [
        { ...valid, num: sfs.long(1n) },
        { ...valid, count: sfs.int(-1) },
        { ...valid, batch: sfs.int(1.5) },
        { ...valid, id: sfs.int(2147483648) },
        { ...valid, itemId: sfs.int(100) },
        { ...valid, uuid: sfs.string("x".repeat(256)) },
        { ...valid, targetId: sfs.string("\ud800") },
        { ...valid, operationId: sfs.string("invalid") },
    ];
    for (const input of invalid)
    {
        await expect(service.command("owner", "item.buy", input)).rejects.toThrow();
    }
    await expect(service.command("owner", "unknown", valid)).rejects.toThrow();
    expect(captured).toEqual([]);
});

test("request capture removes transport fields, sorts keys and preserves receipt identity across awaits", async () => {
    const { service, captured } = fixture();
    const input = {
        num: sfs.int(1),
        itemId: sfs.string("100"),
        operationId: sfs.string(operationId),
        _cok_: sfs.string("transport"),
        cmdBaseTime: sfs.long(10n),
    };
    const pending = service.command("owner", "item.buy", input);
    input.num = sfs.int(9);
    const result = await pending;
    expect(captured[0]!.command).toMatchObject({
        owner: "owner",
        command: "item.buy",
        requestId: operationId.toLowerCase(),
    });
    expect(captured[0]!.command.request).toEqual(
        encode({ itemId: sfs.string("100"), num: sfs.int(1) }),
    );
    expect(result.body.operationId).toEqual(sfs.string(operationId.toLowerCase()));
    expect(result.body.costGold).toEqual(sfs.int(5));
    expect(result.pushes.map((push) => push.command)).toEqual(["push.useritem"]);
});

test("buy/use spends ordered pools, grants and consumes once, then records the campaign action", async () => {
    const { service, captured, state, actions } = fixture();
    const result = await service.command("owner", "item.buyUse", {
        itemId: sfs.string("100"),
        num: sfs.int(2),
        operationId: sfs.string(operationId),
    });
    const plan = captured[0]!.plan!;
    expect(plan.postings.slice(0, 3)).toEqual([
        {
            account: "owner",
            asset: "profile.gold",
            before: 3n,
            after: 0n,
            reason: "inventory.purchase",
        },
        {
            account: "owner",
            asset: "profile.paidSpecialGold",
            before: 4n,
            after: 0n,
            reason: "inventory.purchase",
        },
        {
            account: "owner",
            asset: "profile.paidGold",
            before: 20n,
            after: 17n,
            reason: "inventory.purchase",
        },
    ]);
    expect(plan.postings.slice(3).map((entry) => [entry.before, entry.after, entry.reason]))
        .toEqual([
            [1n, 3n, "inventory.grant"],
            [3n, 1n, "inventory.consume"],
        ]);
    expect(fields(result.body.buyRet).remainGold).toEqual(sfs.long(17n));
    expect(fields(result.body.useRet).count).toEqual(sfs.int(1));
    expect(actions).toEqual(["use:100:2"]);
    expect(state.items[0]!.count).toBe(1);
    expect(state.profile.gold).toBe(3n);
    expect(plan.items[0]!.count).toBe(1);
});

test("delegated item effects run before consumption and failed effects cannot record an action", async () => {
    const { state, rules, actions } = fixture();
    state.items[0]!.itemId = "102";
    state.useEffect = async () => {
        throw new Error("Rejected effect");
    };
    const planner = new InventoryPlanner(state, rules, effects, 100);
    await expect(planner.command("item.use", { uuid: sfs.string("stack"), num: sfs.int(1) }))
        .rejects.toThrow("Rejected effect");
    expect(planner.postings).toEqual([]);
    expect(planner.cooldowns.get("102")).toBe(100n);
    expect(planner.items[0]!.count).toBe(1);
    expect(state.cooldowns.size).toBe(0);
    expect(actions).toEqual([]);
});

test("material composition records exact costs and rewards while preserving saved item quantities", async () => {
    const { service, captured, state, actions } = fixture();
    state.items[0]!.count = 6;
    await service.command("owner", "item.compose2", {
        id: sfs.int(222),
        count: sfs.int(2),
        operationId: sfs.string(operationId),
    });
    const plan = captured[0]!.plan!;
    expect(plan.items.map((entry) => [entry.itemId, entry.count])).toEqual([["100", 2], [
        "101",
        2,
    ]]);
    expect(plan.postings.map((entry) => [entry.before, entry.after, entry.reason])).toEqual([
        [6n, 2n, "inventory.consume"],
        [0n, 2n, "inventory.grant"],
    ]);
    expect(actions).toEqual(["compose:222:2"]);
    expect(state.items[0]!.count).toBe(6);
});

test("grant validation and projection preserve input identity and exact request bytes", async () => {
    const { service, captured } = fixture();
    await expect(service.grant("owner", "grant", "100", 0)).rejects.toThrow();
    await expect(service.grant("owner", "grant", "100", 1, -1)).rejects.toThrow();
    expect(captured).toEqual([]);
    const result = await service.grant("owner", "grant", "100", 2, 0);
    expect(captured[0]!.command).toMatchObject({
        owner: "owner",
        command: "inventory.grant",
        requestId: "grant",
    });
    expect(decode(Buffer.from(captured[0]!.command.request))).toEqual({
        itemId: sfs.string("100"),
        count: sfs.int(2),
        value: sfs.int(0),
    });
    expect(result.count).toEqual(sfs.int(3));
    expect(result.uuid).toEqual(sfs.string("stack"));
});

test("resource projection preserves field order, signed bound balances and legacy clamping", () => {
    const zero = resource({});
    expect(Object.keys(zero)).toEqual([
        "wood",
        "wood_bind",
        "stone",
        "stone_bind",
        "iron",
        "iron_bind",
        "food",
        "food_bind",
        "silver",
        "chip",
        "diamond",
        "sandstone",
        "diamondstone",
        "marble",
        "granite",
        "limestone",
        "dragonFood",
        "dragonGold",
    ]);
    const result = resource({
        wood: "9007199254740993",
        woodbind: -2n,
        stone: -5n,
        silver: -3,
        dragon_food: -4,
        dragon_gold: 7,
    });
    expect(result.wood).toEqual(sfs.long(9007199254740993n));
    expect(result.wood_bind).toEqual(sfs.long(-2n));
    expect(result.stone).toEqual(sfs.long(0n));
    expect(result.silver).toEqual(sfs.int(0));
    expect(result.dragonFood).toEqual(sfs.int(-4));
    expect(result.dragonGold).toEqual(sfs.int(7));
    expect(encode(zero)).toEqual(
        encode(
            Object.fromEntries(
                Object.keys(zero).map((key, i) => [key, i < 8 ? sfs.long(0n) : sfs.int(0)]),
            ),
        ),
    );
    for (
        const invalid of [
            { wood: 9223372036854775808n },
            { woodbind: -9223372036854775809n },
            { silver: 2147483648 },
            { dragon_food: -2147483649 },
            { chip: 0.5 },
        ] as InventorySnapshotRow[]
    )
    {
        expect(() => resource(invalid)).toThrow();
    }
});

test("purchase gates short circuit and pass the original runtime context before staging", () => {
    const { state, rules } = fixture();
    const calls: unknown[] = [];
    const catalogs = {
        ...rules,
        goods: new Map([...rules.goods, ["200065", { id: "200065", type: "21", price: "1" }]]),
    };
    const planner = new InventoryPlanner(state, catalogs, {
        ...effects,
        feature: (received, key, context) => {
            expect(received).toBe(catalogs);
            calls.push([key, context]);
            return true;
        },
    }, 123);
    expect(() => planner.buy("100", 1, { hasCDTime: sfs.bool(true) })).toThrow();
    expect(calls).toEqual([]);
    expect(() => planner.buy("200065", 1, {})).toThrow();
    expect(calls).toEqual([["sale_badge1", { kingdomId: 1, version: "12.06.0", now: 123 }]]);
    expect(planner.postings).toEqual([]);
    expect(planner.items).toEqual(state.items);
});

test("resource runtime precedes consumption and confirmation observes the completed plan", async () => {
    const { state: initial, rules: initialRules } = fixture();
    const sequence: string[] = [];
    const state: InventoryState = {
        ...initial,
        resource: { woodbind: 9007199254740993n },
        recordAction: async (kind, itemId, count) => {
            sequence.push(`${kind}:${itemId}:${count}`);
            expect(planner.items[0]!.count).toBe(0);
        },
    };
    const rules = {
        ...initialRules,
        goods: new Map([["100", { id: "100", type: "3", para1: "101", para2: "7" }]]),
    };
    const observer = () => undefined;
    const planner = new InventoryPlanner(state, rules, {
        ...effects,
        resourceBonus: async (receivedState, receivedRules, now, id) => {
            expect(receivedState).toBe(state);
            expect(receivedRules).toBe(rules);
            expect([now, id]).toEqual([100, 101]);
            expect(planner.postings).toEqual([]);
            sequence.push("bonus");
            return 42.85714;
        },
        confirmedSpending: (receivedState, receivedRules, now, items) => {
            expect(receivedState).toBe(state);
            expect(receivedRules).toBe(rules);
            expect(now).toBe(100);
            expect(items[0]!.count).toBe(0);
            sequence.push("confirmation");
            return observer;
        },
    }, 100);
    const body = await planner.command("item.use", { uuid: sfs.string("stack"), num: sfs.int(1) });
    const plan = planner.result(body);
    expect(sequence).toEqual(["bonus", "use:100:1", "confirmation"]);
    expect(plan.confirmedSpending).toBe(observer);
    expect(plan.resource.woodbind).toBe(9007199254741003n);
    expect(plan.postings.map((entry) => entry.reason)).toEqual([
        "inventory.effect",
        "inventory.consume",
    ]);
    expect(state.resource.woodbind).toBe(9007199254740993n);
    expect(state.items[0]!.count).toBe(1);
    const { pushes } = inventoryReplay(Buffer.from(plan.response), "operation");
    expect(pushes[0]!.body.wood_bind).toEqual(sfs.long(9007199254741003n));
});

test("rejected or invalid resource bonuses cannot consume items or record campaign actions", async () => {
    for (const bonus of [new Error("Unavailable effect"), NaN, Infinity, 214748364700])
    {
        const { state, rules: initial, actions } = fixture();
        const rules = {
            ...initial,
            goods: new Map([["100", { id: "100", type: "3", para1: "101", para2: "10" }]]),
        };
        const planner = new InventoryPlanner(state, rules, {
            ...effects,
            resourceBonus: async () => {
                if (bonus instanceof Error)
                {
                    throw bonus;
                }
                return bonus;
            },
        }, 100);
        await expect(planner.command("item.use", { uuid: sfs.string("stack"), num: sfs.int(1) }))
            .rejects.toThrow();
        expect(planner.items[0]!.count).toBe(1);
        expect(planner.postings).toEqual([]);
        expect(actions).toEqual([]);
    }
});
