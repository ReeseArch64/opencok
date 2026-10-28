import { expect, test } from "bun:test";
import { activityEconomy, debit } from "../src/services/activity-economy";
import type { ActivityLedger } from "../src/contracts/activity-ledger";
import type { EconomyPosting, MutationEvent } from "@opencok/ledger/contracts/mutation";
import type { InventoryFields } from "@opencok/economy/contracts/inventory";
import { encode, sfs } from "@opencok/messages/sfs";

function fixture(dmm = false)
{
    const profile: Record<string, bigint> = {};
    const saved: Record<string, bigint> = {
        gold: 3n,
        paidSpecialGold: 2n,
        paidGold: 4n,
        dmmGold: 7n,
        dmmPaidSpecialGold: 2n,
        dmmPaidGold: 4n,
        crystal: 1n,
        civilizationSorce: 2n,
    };
    const postings: EconomyPosting[] = [];
    const calls: unknown[][] = [];
    const ledger: ActivityLedger = {
        domainEvents: [] as MutationEvent[],
        pushes: [] as { command: string; body: InventoryFields; }[],
        items: [
            { uuid: "a", itemId: "100", count: 2, value: 0, vanishTime: 0n },
            { uuid: "b", itemId: "100", count: 3, value: 0, vanishTime: 200n },
            { uuid: "expired", itemId: "100", count: 8, value: 0, vanishTime: 100n },
            { uuid: "valued", itemId: "100", count: 9, value: 1, vanishTime: 0n },
        ],
        postings,
        campaignPostingCursor: 0,
        profile,
        resources: {},
        assets: {},
        resourceBalance: (asset) => asset === "wood" ? 20n : 0n,
        assetBalance: (asset) => asset === "winPoint" ? 5n : 0n,
        pools: () =>
            dmm
                ? ["dmmGold", "dmmPaidSpecialGold", "dmmPaidGold"]
                : ["gold", "paidSpecialGold", "paidGold"],
        balance: (key) => profile[key] ?? saved[key] ?? 0n,
        total: () => ledger.pools().reduce((sum, key) => sum + ledger.balance(key), 0n),
        post: (asset, before, after, reason) => {
            postings.push({ account: "owner", asset, before, after, reason });
        },
        valid: (item) => item.vanishTime === 0n || item.vanishTime > 100n,
        own: (uuid) => {
            const item = ledger.items.find((row) => row.uuid === uuid);
            if (!item || !ledger.valid(item))
            {
                throw new Error("Unknown item");
            }
            return item;
        },
        take: (item, count) => {
            calls.push(["take", item.uuid, count]);
        },
        spendItems: (id, count) => {
            calls.push(["spend", id, count]);
        },
        add: (id, count) => {
            calls.push(["add", id, count]);
        },
    };
    return { ledger, calls, postings, economy: activityEconomy(ledger) };
}

for (const dmm of [false, true])
{
    test(`gold debits follow ${dmm ? "DMM" : "ordinary"} pool order and credits return to the first pool`, () => {
        const { ledger, economy, postings } = fixture(dmm);
        const keys = ledger.pools();
        const original = ledger.total();
        debit(ledger, original - 1n, "cost");
        expect(ledger.total()).toBe(1n);
        expect(postings.map((row) => row.asset)).toEqual(keys.map((key) => `profile.${key}`));
        expect(postings.map((row) => row.after)).toEqual([0n, 0n, 1n]);
        economy.gold(2n);
        expect(ledger.balance(keys[0]!)).toBe(2n);
        expect(ledger.total()).toBe(3n);
        expect(postings.at(-1)?.reason).toBe("activity.credit");
        economy.gold(-1n);
        expect(ledger.total()).toBe(2n);
        expect(postings.at(-1)?.reason).toBe("activity.cost");
        const count = postings.length;
        economy.gold(0n);
        debit(ledger, 0n, "zero");
        expect(postings).toHaveLength(count);
    });
}

test("invalid debits and resource/scalar bounds preserve balances before recording postings", () => {
    const { ledger, economy, postings } = fixture();
    for (const amount of [-1n, 10n])
    {
        expect(() => debit(ledger, amount, "bad")).toThrow();
    }
    expect(() => economy.resource("unknown" as "wood", 1n)).toThrow("Invalid activity resource");
    expect(() => economy.resource("wood", -21n)).toThrow("Invalid activity balance");
    expect(() => economy.resource("wood", 9223372036854775807n)).toThrow(
        "Invalid activity balance",
    );
    expect(() => economy.crystal!(-2n)).toThrow("Invalid activity balance");
    expect(() => economy.civilizationScore!(-3n)).toThrow("Invalid activity balance");
    expect(() => economy.winPoints!(-6n)).toThrow("Invalid activity balance");
    expect(ledger.profile).toEqual({});
    expect(ledger.resources).toEqual({});
    expect(ledger.assets).toEqual({});
    expect(postings).toEqual([]);
});

test("staged balances and saved fallbacks retain exact scalar and resource postings", () => {
    const { ledger, economy, postings } = fixture();
    expect(economy.balance!("gold")).toBe(9n);
    economy.crystal!(2n);
    economy.civilizationScore!(3n);
    economy.winPoints!(4n);
    economy.winPoints!(-1n);
    economy.resource("wood", -20n);
    economy.resource("wood", 9223372036854775807n);
    expect(economy.balance!("crystal")).toBe(3n);
    expect(economy.balance!("civilizationSorce")).toBe(5n);
    expect(economy.balance!("wood")).toBe(9223372036854775807n);
    expect(ledger.assets.winPoint).toBe(8n);
    expect(postings.map((row) => [row.asset, row.before, row.after, row.reason])).toEqual([
        ["profile.crystal", 1n, 3n, "activity.crystal"],
        ["profile.civilizationSorce", 2n, 5n, "activity.civilization"],
        ["assets.winPoint", 5n, 9n, "activity.reward"],
        ["assets.winPoint", 9n, 8n, "activity.reward"],
        ["resource.wood", 20n, 0n, "activity.resource"],
        ["resource.wood", 0n, 9223372036854775807n, "activity.resource"],
    ]);
});

test("item observations filter expiration/value, return copies and delegate mutations", () => {
    const { ledger, economy, calls } = fixture();
    expect(economy.quantity!("100")).toBe(5);
    const selected = economy.itemState!("100")!;
    selected.count = 99;
    expect(ledger.items[0]!.count).toBe(2);
    expect(economy.itemState!("missing")).toBeUndefined();
    expect(economy.ownedItem!("a")).toEqual({ itemId: "100", count: 2 });
    expect(() => economy.ownedItem!("expired")).toThrow("Unknown item");
    economy.consumeItem!("a", 1);
    economy.item("100", -2);
    economy.item("100", 3);
    expect(calls).toEqual([["take", "a", 1], ["spend", "100", 2], ["add", "100", 3]]);
    for (const count of [0, 1.5, Number.NaN, Number.POSITIVE_INFINITY])
    {
        expect(() => economy.item("100", count)).toThrow("Invalid activity item change");
    }
    expect(calls).toHaveLength(3);
});

test("campaign item observations advance once and count only positive grants", () => {
    const { ledger, economy, postings } = fixture();
    ledger.post("profile.gold", 0n, 5n, "reward");
    ledger.post("item.a", 0n, 2n, "reward");
    ledger.post("item.b", 0n, 3n, "reward");
    ledger.post("item.a", 2n, 1n, "cost");
    expect(economy.takeItemGrants!()).toEqual([{ itemId: "100", count: 5 }]);
    expect(ledger.campaignPostingCursor).toBe(4);
    expect(economy.takeItemGrants!()).toEqual([]);
    ledger.post("item.missing", 0n, 1n, "reward");
    expect(() => economy.takeItemGrants!()).toThrow("Missing campaign item grant");
    expect(ledger.campaignPostingCursor).toBe(4);
    postings.pop();
    ledger.post("item.b", 3n, 4n, "reward");
    expect(economy.takeItemGrants!()).toEqual([{ itemId: "100", count: 1 }]);
});

test("events retain payloads and pushes retain native fields without accepting malformed bytes", () => {
    const { ledger, economy } = fixture();
    const event = { id: "id", type: "reward", payload: Buffer.from([0, 255]) };
    economy.event!(event);
    expect(ledger.domainEvents).toEqual([event]);
    const body = { gold: sfs.long(9007199254740993n), count: sfs.int(2) };
    economy.push!("push.test", encode(body));
    expect(ledger.pushes).toEqual([{ command: "push.test", body }]);
    expect(() => economy.push!("bad", Buffer.from([255]))).toThrow();
    expect(ledger.pushes).toHaveLength(1);
});
