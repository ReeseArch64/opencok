import { expect, test } from "bun:test";
import { getTableName, type Table, type SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import {
    createInventoryExecutor,
    executeInventoryTransaction,
} from "../src/repositories/inventory.ts";
import type {
    InventoryTransaction,
    InventoryTransactionExecutor,
    InventoryTransactionRuntime,
} from "../src/repositories/inventory-transaction.ts";
import type { InventoryPlan, InventoryCommandState } from "../src/contracts/inventory-planning.ts";
import type { InventorySnapshotRow } from "../src/contracts/inventory-ledger.ts";
import type { MutationResult } from "@opencok/ledger/contracts/mutation";
import { inventoryResponse } from "../src/mappings/inventory.ts";

const response = inventoryResponse({}, []);
const empty = (): InventoryPlan => ({
    response,
    items: [],
    profile: {},
    resource: {},
    cooldowns: new Map(),
    postings: [],
});
const posting = (asset: string, before: bigint, after: bigint) => ({
    account: "owner",
    asset,
    before,
    after,
    reason: "test",
});

function fixture()
{
    const rows: Record<string, InventorySnapshotRow[]> = {
        user_assets: [],
        userprofile: [{ uid: "owner", gold: 9007199254740993n }],
        user_resource: [{ uid: "owner", wood: 10n, silver: 1 }],
        user_item: [{
            uuid: "stack",
            ownerId: "owner",
            itemId: "100",
            count: 3,
            value: null,
            vanishTime: null,
        }],
        user_item_cd: [{ uid: "owner", itemId: "100", useTime: 1n }],
        user_building: [{ uid: "owner", uuid: "castle", itemId: 400000, level: 1 }],
    };
    const reads: { table: string; params: unknown[]; lock?: string; order?: string; }[] = [];
    const writes: {
        table: string;
        fields: Record<string, unknown>;
        params?: unknown[];
        conflict?: unknown;
    }[] = [];
    const dialect = new PgDialect();
    const tx = {
        select: () => ({
            from: (table: Table) => ({
                where: (predicate: SQL) => {
                    const entry = {
                        table: getTableName(table),
                        params: dialect.sqlToQuery(predicate).params,
                    } as typeof reads[number];
                    const result = Promise.resolve().then(() => {
                        reads.push(entry);
                        return rows[entry.table] ?? [];
                    });
                    Object.assign(result, {
                        orderBy: (order: SQL) => {
                            entry.order = dialect.sqlToQuery(order).sql;
                            return result;
                        },
                        for: (lock: string) => {
                            entry.lock = lock;
                            return result;
                        },
                    });
                    return result;
                },
            }),
        }),
        update: (table: Table) => ({
            set: (fields: Record<string, unknown>) => ({
                where: async (predicate: SQL) => {
                    writes.push({
                        table: getTableName(table),
                        fields: { ...fields },
                        params: dialect.sqlToQuery(predicate).params,
                    });
                },
            }),
        }),
        insert: (table: Table) => ({
            values: (fields: Record<string, unknown>) => {
                const entry = {
                    table: getTableName(table),
                    fields: { ...fields },
                } as typeof writes[number];
                const result = Promise.resolve().then(() => {
                    writes.push(entry);
                });
                Object.assign(result, {
                    onConflictDoUpdate: (conflict: unknown) => {
                        entry.conflict = conflict;
                        return result;
                    },
                });
                return result;
            },
        }),
    } as unknown as InventoryTransaction;
    const runtime: InventoryTransactionRuntime<InventoryCommandState> = {
        extendState: (_tx, _profile, state) => state,
        mergeConfirmation: () => {
            throw new Error("Unexpected confirmation merge");
        },
    };
    const run = (
        plan: (state: InventoryCommandState) => Promise<InventoryPlan>,
        confirmed?: (plan: InventoryPlan) => Promise<MutationResult | undefined>,
    ) => executeInventoryTransaction(
        tx,
        runtime,
        "owner",
        plan,
        "test",
        undefined,
        undefined,
        confirmed,
    );
    return { rows, reads, writes, tx, runtime, run };
}

test("inventory snapshots retain owner selection, read order, locks, null defaults and frozen copies", async () => {
    const h = fixture();
    const result = await h.run(async (state) => {
        expect(state.profile.gold).toBe(9007199254740993n);
        expect(state.assets).toEqual({});
        expect(state.cooldowns.get("100")).toBe(1n);
        expect(state.buildings).toBe(h.rows.user_building!);
        expect(Object.isFrozen(state.profile)).toBe(true);
        expect(Object.isFrozen(state.resource)).toBe(true);
        expect(Object.isFrozen(state.items[0]!)).toBe(true);
        expect(state.items[0]).toMatchObject({ value: 0, vanishTime: 0n, count: 3 });
        expect(state.profile).not.toBe(h.rows.userprofile![0]!);
        expect(state.resource).not.toBe(h.rows.user_resource![0]);
        expect(h.rows.user_item![0]!.value).toBeNull();
        return empty();
    });
    expect(h.reads.map((entry) => entry.table)).toEqual([
        "user_assets",
        "userprofile",
        "user_resource",
        "user_item",
        "user_item_cd",
        "user_building",
    ]);
    expect(h.reads.every((entry) => entry.params.length === 1 && entry.params[0] === "owner")).toBe(
        true,
    );
    expect(h.reads.filter((entry) => entry.lock).map((entry) => [entry.table, entry.lock])).toEqual(
        [["user_resource", "update"], ["user_item", "update"]],
    );
    expect(h.reads[3]!.order).toContain("\"uuid\" asc");
    expect(h.writes).toEqual([]);
    expect(result).toEqual({ response, postings: [], events: [] });
});

test("inventory writes preserve item identity, exact balances, owner predicates and upsert order", async () => {
    const h = fixture();
    const plan: InventoryPlan = {
        ...empty(),
        items: [{ uuid: "stack", itemId: "100", count: 2, value: 0, vanishTime: 5n }, {
            uuid: "new",
            itemId: "101",
            count: 4,
            value: 7,
            vanishTime: 0n,
        }],
        profile: { gold: 9007199254740992n },
        resource: { wood: 11n },
        assets: { winPoint: 2n },
        cooldowns: new Map([["100", 7n]]),
        postings: [
            posting("item.stack", 3n, 2n),
            posting("item.new", 0n, 4n),
            posting("profile.gold", 9007199254740993n, 9007199254740992n),
            posting("resource.wood", 10n, 11n),
            posting("assets.winPoint", 0n, 2n),
        ],
    };
    const result = await h.run(async () => plan);
    expect(result.postings).toBe(plan.postings);
    expect(h.writes.map((entry) => entry.table)).toEqual([
        "user_item",
        "user_item",
        "user_assets",
        "userprofile",
        "user_resource",
        "user_item_cd",
    ]);
    expect(h.writes[0]).toEqual({
        table: "user_item",
        fields: { count: 2, vanishTime: 5n },
        params: ["stack", "owner"],
    });
    expect(h.writes[1]!.fields).toEqual({ ...plan.items[1], ownerId: "owner" });
    expect(h.writes[2]!.fields).toEqual({ uid: "owner", winPoint: 2n });
    expect(h.writes[2]!.conflict).toBeDefined();
    expect(h.writes[3]).toEqual({ table: "userprofile", fields: plan.profile, params: ["owner"] });
    expect(h.writes[4]).toEqual({
        table: "user_resource",
        fields: plan.resource,
        params: ["owner"],
    });
    expect(h.writes[5]!.fields).toEqual({ uid: "owner", itemId: "100", useTime: 7n });
    expect(h.writes[5]!.conflict).toBeDefined();
});

test("missing inventory accounts stop before planning or item reads", async () => {
    for (const table of ["userprofile", "user_resource"])
    {
        const h = fixture();
        h.rows[table] = [];
        let planned = false;
        await expect(h.run(async () => {
            planned = true;
            return empty();
        })).rejects.toThrow("Missing inventory account");
        expect(planned).toBe(false);
        expect(h.reads.map((entry) => entry.table)).toEqual([
            "user_assets",
            "userprofile",
            "user_resource",
        ]);
        expect(h.writes).toEqual([]);
    }
});

test("invalid item identities and mutation sizes reject before any inventory write", async () => {
    const item = { uuid: "stack", itemId: "100", count: 3, value: 0, vanishTime: 0n };
    const invalid: InventoryPlan[] = [
        { ...empty(), items: [{ ...item, itemId: "changed" }] },
        { ...empty(), items: [{ ...item, value: 1 }] },
        { ...empty(), items: [{ ...item, uuid: "" }] },
        { ...empty(), items: [{ ...item, uuid: "x".repeat(41) }] },
        { ...empty(), items: [{ ...item, count: -1 }] },
        { ...empty(), items: [{ ...item, count: 0.5 }] },
        { ...empty(), items: [{ ...item, count: 2147483648 }] },
        { ...empty(), items: [{ ...item, vanishTime: 9223372036854775808n }] },
        { ...empty(), items: Array.from({ length: 129 }, () => item) },
        { ...empty(), cooldowns: new Map(Array.from({ length: 129 }, (_, i) => [String(i), 1n])) },
    ];
    for (const plan of invalid)
    {
        const h = fixture();
        await expect(h.run(async () => plan)).rejects.toThrow();
        expect(h.writes).toEqual([]);
    }
});

test("invalid balances, cooldowns and ledger chains cannot reach confirmation", async () => {
    const invalid: InventoryPlan[] = [
        { ...empty(), profile: { unknown: 1n } },
        { ...empty(), profile: { gold: -1n } },
        { ...empty(), profile: { gold: 9223372036854775808n } },
        { ...empty(), resource: { silver: 2147483648n } },
        { ...empty(), cooldowns: new Map([["", 1n]]) },
        { ...empty(), cooldowns: new Map([["100", -1n]]) },
        { ...empty(), cooldowns: new Map([["100", 9223372036854775808n]]) },
        {
            ...empty(),
            postings: Array.from({ length: 257 }, () => posting("resource.wood", 10n, 10n)),
        },
        { ...empty(), postings: [posting("resource.wood", 10n, 11n)] },
        { ...empty(), resource: { wood: 11n }, postings: [posting("resource.wood", 9n, 11n)] },
        { ...empty(), resource: { wood: 11n }, postings: [posting("resource.wood", 10n, 12n)] },
        {
            ...empty(),
            resource: { wood: 11n },
            postings: [{ ...posting("resource.wood", 10n, 11n), account: "foreign" }],
        },
    ];
    for (const plan of invalid)
    {
        const h = fixture();
        let confirmed = false;
        await expect(h.run(async () => plan, async () => {
            confirmed = true;
            return undefined;
        })).rejects.toThrow();
        expect(confirmed).toBe(false);
    }
});

test("confirmation observes final writes and chained postings after spending evidence", async () => {
    const h = fixture();
    const order: string[] = [];
    const event = { id: "spending", type: "confirmed", payload: Buffer.from([1]) };
    const plan: InventoryPlan = {
        ...empty(),
        resource: { wood: 12n },
        postings: [posting("resource.wood", 10n, 11n), posting("resource.wood", 11n, 12n)],
        confirmedSpending: (postings) => {
            expect(postings).toBe(plan.postings);
            expect(h.writes[0]!.fields).toEqual({ wood: 12n });
            order.push("spending");
            return event;
        },
    };
    const result = await h.run(async () => plan, async (observed) => {
        expect(observed).toBe(plan);
        order.push("confirmed");
        return undefined;
    });
    expect(order).toEqual(["spending", "confirmed"]);
    expect(result).toEqual({ response, postings: plan.postings, events: [event] });
});

test("transaction ports preserve request capture, preparation timing and callback context", async () => {
    const h = fixture();
    const order: string[] = [];
    let captured: Parameters<InventoryTransactionExecutor>[0] | undefined;
    const execute: InventoryTransactionExecutor = async (command, apply) => {
        captured = command;
        await Promise.resolve();
        return Buffer.from((await apply(h.tx)).response);
    };
    const run = createInventoryExecutor(
        execute,
        {
            ...h.runtime,
            extendState: (tx, profile, state) => {
                expect(tx).toBe(h.tx);
                expect(profile).toBe(h.rows.userprofile![0]!);
                expect(Object.isFrozen(state.profile)).toBe(true);
                order.push("snapshot");
                return state;
            },
        },
        () => 123,
        {
            before: async (tx, owner, at) => {
                expect([tx, owner, at]).toEqual([h.tx, "owner", 123n]);
                expect(h.reads).toEqual([]);
                order.push("before");
            },
            useEffect: async (tx, owner, itemId, count, at, economy) => {
                expect([tx, owner, itemId, count, at, economy]).toEqual([
                    h.tx,
                    "owner",
                    "100",
                    2,
                    123n,
                    activity,
                ]);
                order.push("effect");
                return {};
            },
            recordAction: async (tx, owner, kind, itemId, count, at, economy) => {
                expect([tx, owner, kind, itemId, count, at, economy]).toEqual([
                    h.tx,
                    "owner",
                    "use",
                    "100",
                    2,
                    123n,
                    activity,
                ]);
                order.push("action");
            },
        },
    );
    const activity = {} as Parameters<NonNullable<InventoryCommandState["useEffect"]>>[2];
    const input = {
        owner: "owner",
        requestId: "request",
        command: "item.use",
        request: Buffer.from([0, 128, 255]),
    };
    const pending = run(input, async (state) => {
        order.push("plan");
        await state.useEffect!("100", 2, activity);
        await state.recordAction!("use", "100", 2, activity);
        return empty();
    });
    input.owner = "changed";
    input.request[0] = 1;
    expect(await pending).toEqual(response);
    expect(captured).toEqual({
        owner: "owner",
        requestId: "request",
        command: "item.use",
        request: Buffer.from([0, 128, 255]),
    });
    expect(order).toEqual(["before", "snapshot", "plan", "effect", "action"]);
});

test("snapshot extension and preparation failures stop before planning or persistence", async () => {
    const h = fixture();
    let planned = false;
    const plan = async () => {
        planned = true;
        return empty();
    };
    h.runtime.extendState = () => {
        throw new Error("Snapshot rejected");
    };
    await expect(h.run(plan)).rejects.toThrow("Snapshot rejected");
    expect(planned).toBe(false);
    expect(h.writes).toEqual([]);
    h.reads.length = 0;
    const run = createInventoryExecutor(
        async (_command, apply) => Buffer.from((await apply(h.tx)).response),
        h.runtime,
        () => 123,
        {
            before: async () => {
                throw new Error("Preparation rejected");
            },
        },
    );
    await expect(
        run(
            { owner: "owner", requestId: "request", command: "item.use", request: Buffer.from([]) },
            plan,
        ),
    ).rejects.toThrow("Preparation rejected");
    expect(h.reads).toEqual([]);
    expect(planned).toBe(false);
});

test("confirmation merging receives the validated base and observer result without copying either", async () => {
    const h = fixture();
    const order: string[] = [];
    const event = { id: "spending", type: "confirmed", payload: Buffer.from([1]) };
    const observed = { response: Buffer.from([7]), events: [] };
    const merged = { response: Buffer.from([8]), events: [event] };
    const plan: InventoryPlan = {
        ...empty(),
        confirmedSpending: () => {
            order.push("spending");
            return event;
        },
    };
    h.runtime.mergeConfirmation = (base, result) => {
        expect(base).toEqual({ response, events: [event], postings: [] });
        expect(base.response).toBe(plan.response);
        expect(base.postings).toBe(plan.postings);
        expect(result).toBe(observed);
        order.push("merge");
        return merged;
    };
    expect(
        await h.run(async () => plan, async (result) => {
            expect(result).toBe(plan);
            order.push("observe");
            return observed;
        }),
    ).toBe(merged);
    expect(order).toEqual(["spending", "observe", "merge"]);
    h.runtime.mergeConfirmation = () => {
        throw new Error("Merge rejected");
    };
    await expect(h.run(async () => plan, async () => observed)).rejects.toThrow("Merge rejected");
});
