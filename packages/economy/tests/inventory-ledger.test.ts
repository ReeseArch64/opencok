import { expect, test } from "bun:test";
import { InventoryLedger } from "../src/domain/inventory-ledger.ts";
import type { InventoryLedgerState } from "../src/contracts/inventory-ledger.ts";
import type { InventoryCatalogs, InventoryRule } from "../src/contracts/inventory-catalogs.ts";
import type { InventoryItem } from "../src/contracts/inventory.ts";
import { GameError } from "@opencok/errors/game";

function createLedger(state: InventoryLedgerState, rules: InventoryCatalogs, now: number)
{
    return new InventoryLedger(state, rules, now);
}

function fixture(items: readonly InventoryItem[] = [], now = 100)
{
    const state: InventoryLedgerState = {
        profile: { uid: "owner", pf: "", gold: 3n, paidSpecialGold: "4", paidGold: 5 },
        resource: { wood: "9007199254740993" },
        assets: { winPoint: "9223372036854775807" },
        items,
    };
    const rules: InventoryCatalogs = {
        goods: new Map<string, InventoryRule>([
            ["100", { id: "100" }],
            ["200", { id: "200", overlap: "1" }],
            ["300", { id: "300", time_type: "1", vanishTime: "2" }],
            ["400", { id: "400", time_type: "1", vanishTime: "invalid" }],
        ]),
    };

    return { state, rules, ledger: createLedger(state, rules, now) };
}

const item = (uuid: string, count = 2, vanishTime = 0n, value = 0): InventoryItem => ({
    uuid,
    itemId: "100",
    count,
    value,
    vanishTime,
});

test("ledger validates the clock, copies input items and owns independent staging collections", () => {
    const saved = [item("first")];
    const { state, rules, ledger } = fixture(saved);
    expect(ledger.state).toBe(state);
    expect(ledger.rules).toBe(rules);
    expect(ledger.now).toBe(100);
    expect(ledger.items).toEqual(saved);
    expect(ledger.items).not.toBe(saved);
    expect(ledger.items[0]).not.toBe(saved[0]);
    ledger.items[0]!.count = 7;
    expect(saved[0]!.count).toBe(2);
    expect(ledger.postings).toEqual([]);
    expect(ledger.changed.size).toBe(0);
    expect(ledger.campaignPostingCursor).toBe(0);
    const other = createLedger(state, rules, 100);
    expect(other.profile).not.toBe(ledger.profile);
    expect(other.assets).not.toBe(ledger.assets);
    expect(other.resources).not.toBe(ledger.resources);
    expect(other.pushes).not.toBe(ledger.pushes);
    expect(other.domainEvents).not.toBe(ledger.domainEvents);
    expect(other.cooldowns).not.toBe(ledger.cooldowns);
    for (const now of [-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])
    {
        expect(() => createLedger(state, rules, now)).toThrow("Invalid inventory clock");
    }
    expect(createLedger(state, rules, 0).now).toBe(0);
    expect(createLedger(state, rules, Number.MAX_SAFE_INTEGER).now).toBe(Number.MAX_SAFE_INTEGER);
});

test("item validity and lookup preserve the exact expiration deadline", () => {
    const { ledger } = fixture([
        item("permanent"),
        item("expires", 2, 100n),
        item("future", 2, 101n),
    ]);
    expect(ledger.valid(ledger.items[0]!)).toBe(true);
    expect(ledger.valid(ledger.items[1]!)).toBe(false);
    expect(ledger.valid(ledger.items[2]!)).toBe(true);
    expect(ledger.own("permanent")).toBe(ledger.items[0]!);
    expect(ledger.own("future")).toBe(ledger.items[2]!);
    expect(() => ledger.own("expires")).toThrow(new GameError("E100166"));
    expect(() => ledger.own("missing")).toThrow(new GameError("E100166"));
});

test("grants reuse only matching valid stacks and preserve posting order and expiration refresh", () => {
    const { ledger, state } = fixture([
        item("expired", 9, 100n),
        item("valued", 5, 0n, 1),
        item("active"),
    ]);
    const grant = ledger.add("100", 3);
    expect(grant).toBe(ledger.items[2]!);
    expect(grant.count).toBe(5);
    expect(ledger.changed.get("active")).toBe(grant);
    expect(state.items[2]!.count).toBe(2);
    expect(ledger.postings).toEqual([{
        account: "owner",
        asset: "item.active",
        before: 2n,
        after: 5n,
        reason: "inventory.grant",
    }]);
    expect(ledger.add("100", 2, 1)).toBe(ledger.items[1]!);
    expect(ledger.items[1]!.count).toBe(7);
    const separate = ledger.add("200", 1);
    const second = ledger.add("200", 1);
    expect(second.uuid).not.toBe(separate.uuid);
    expect(separate.uuid).toMatch(/^[0-9a-f-]{36}$/);
    expect(separate.value).toBe(0);
    const timed = ledger.add("300", 1);
    expect(timed.vanishTime).toBe(120100n);
    timed.vanishTime = 101n;
    expect(ledger.add("300", 2)).toBe(timed);
    expect(timed.vanishTime).toBe(120100n);
    expect(timed.count).toBe(3);
    expect(ledger.postings.at(-1)).toMatchObject({
        before: 1n,
        after: 3n,
        reason: "inventory.grant",
    });
});

test("grant failures preserve existing error and partial-plan behavior for transaction rollback", () => {
    const { ledger } = fixture([item("full", 2147483647)]);
    expect(() => ledger.add("missing", 1)).toThrow(new GameError("E100166"));
    for (const count of [0, -1, 0.5, 2147483648])
    {
        expect(() => ledger.add("100", count)).toThrow();
    }
    expect(() => ledger.add("100", 1)).toThrow();
    expect(ledger.items[0]!.count).toBe(2147483647);
    expect(ledger.postings).toEqual([]);
    expect(ledger.changed.size).toBe(0);
    expect(() => ledger.add("400", 1)).toThrow();
    const partial = ledger.items.find((entry) => entry.itemId === "400")!;
    expect(partial.count).toBe(1);
    expect(partial.vanishTime).toBe(0n);
    expect(ledger.postings).toHaveLength(1);
    expect(ledger.changed.has(partial.uuid)).toBe(false);
});

test("consumption filters valued, expired, empty and foreign items while retaining original order", () => {
    const { ledger, state } = fixture([
        item("valued", 9, 0n, 1),
        item("expired", 9, 100n),
        item("empty", 0),
        { ...item("foreign", 9), itemId: "200" },
        item("first", 2),
        item("second", 3),
    ]);
    ledger.spendItems("100", 4);
    expect(ledger.items.map((entry) => entry.count)).toEqual([9, 9, 0, 9, 0, 1]);
    expect(state.items.map((entry) => entry.count)).toEqual([9, 9, 0, 9, 2, 3]);
    expect([...ledger.changed.keys()]).toEqual(["first", "second"]);
    expect(ledger.postings).toEqual([
        {
            account: "owner",
            asset: "item.first",
            before: 2n,
            after: 0n,
            reason: "inventory.consume",
        },
        {
            account: "owner",
            asset: "item.second",
            before: 3n,
            after: 1n,
            reason: "inventory.consume",
        },
    ]);
    expect(() => ledger.take(ledger.items[1]!, 1)).toThrow(new GameError("E100165"));
    expect(() => ledger.take(ledger.items[5]!, 2)).toThrow(new GameError("E100165"));
    expect(ledger.postings).toHaveLength(2);
    expect(() => ledger.spendItems("100", 2)).toThrow(new GameError("E100165"));
    expect(ledger.items[5]!.count).toBe(0);
    expect(ledger.postings).toHaveLength(3);
    expect(() => ledger.spendItems("100", 0)).toThrow();
    expect(() => ledger.take(ledger.items[0]!, 0)).toThrow();
});

test("currency pools, exact saved reads, staged zero and signed total limits retain their semantics", () => {
    const { ledger, state } = fixture();
    expect(ledger.pools()).toEqual(["gold", "paidSpecialGold", "paidGold"]);
    expect(ledger.total()).toBe(12n);
    expect(ledger.resourceBalance("wood")).toBe(9007199254740993n);
    expect(ledger.assetBalance("winPoint")).toBe(9223372036854775807n);
    expect(ledger.balance("missing")).toBe(0n);
    ledger.profile.gold = 0n;
    expect(ledger.total()).toBe(9n);
    ledger.resources.wood = 1n;
    ledger.assets.winPoint = 1n;
    expect(ledger.resourceBalance("wood")).toBe(9007199254740993n);
    expect(ledger.assetBalance("winPoint")).toBe(9223372036854775807n);
    state.assets = undefined;
    expect(ledger.assetBalance("missing")).toBe(0n);
    state.profile.pf = "dmm";
    Object.assign(state.profile, { dmmGold: 1n, dmmPaidSpecialGold: 2n, dmmPaidGold: 3n });
    expect(ledger.pools()).toEqual(["dmmGold", "dmmPaidSpecialGold", "dmmPaidGold"]);
    expect(ledger.total()).toBe(6n);
    ledger.profile.dmmGold = 9223372036854775802n;
    expect(ledger.total()).toBe(9223372036854775807n);
    ledger.profile.dmmGold++;
    expect(() => ledger.total()).toThrow();
    ledger.profile.dmmGold = -6n;
    expect(() => ledger.total()).toThrow();
    state.profile.uid = null;
    ledger.post("gold", 2n, 1n, "test");
    expect(ledger.postings.at(-1)).toEqual({
        account: "",
        asset: "gold",
        before: 2n,
        after: 1n,
        reason: "test",
    });
});
