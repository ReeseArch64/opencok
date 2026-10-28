import { expect, test } from "bun:test";
import { inventoryItem } from "@opencok/economy/mappings/inventory-item";
import {
    inventoryPurchase,
    inventoryUse,
    inventoryBuyUse,
    inventoryComposition,
    inventoryChanges,
    inventoryEvent,
    inventoryResponse,
    inventoryReplay,
    mergeInventoryResponses,
} from "@opencok/economy/mappings/inventory";
import { encode, decode, fields, sfs, type Fields } from "@opencok/messages/sfs";
import type { InventoryCatalogs } from "../src/contracts/inventory-catalogs.ts";

const item = { uuid: "stack", itemId: "001", count: 2, value: 0, vanishTime: 9007199254740993n };
const rules = {
    goods: new Map([
        ["001", { para1: "0", para2: "", para9: "last" }],
        ["1", { para1: "ordinary" }],
    ]),
} as InventoryCatalogs;

const expectedItem = {
    uuid: sfs.string("stack"),
    itemId: sfs.string("001"),
    count: sfs.int(2),
    vanishTime: sfs.long(9007199254740993n),
    para1: sfs.string("0"),
    para9: sfs.string("last"),
};

test("inventory serialization preserves native fields, catalog identities and saved-row conversions", () => {
    expect(encode(inventoryItem({ ...item }, rules))).toEqual(encode(expectedItem));
    expect(Object.keys(inventoryItem({ ...item }, rules))).toEqual(Object.keys(expectedItem));
    expect(inventoryItem({ ...item, itemId: "1" }, rules).para1).toEqual(sfs.string("ordinary"));
    expect(inventoryItem({ ...item, itemId: " 001 " }, rules).itemId).toEqual(sfs.string(" 001 "));
    expect(inventoryItem({ itemId: "001", count: "2", vanishTime: "9007199254740993" }, rules))
        .toEqual({ ...expectedItem, uuid: sfs.string("") });
    expect(inventoryItem({ itemId: "001", count: null, vanishTime: null }, rules)).toEqual({
        ...expectedItem,
        uuid: sfs.string(""),
        count: sfs.int(0),
        vanishTime: sfs.long(0n),
    });
    for (
        const invalid of [
            { ...item, itemId: "missing" },
            { ...item, count: 2147483648 },
            { ...item, count: 0.5 },
            { ...item, vanishTime: 9223372036854775808n },
            { ...item, vanishTime: "invalid" },
        ]
    )
    {
        expect(() => inventoryItem(invalid, rules)).toThrow();
    }
});

test("inventory purchase, use, composition and changes retain protocol shapes and ordering", () => {
    const purchase = inventoryPurchase(item, rules, 9007199254740993n, 7);
    expect(encode(purchase)).toEqual(encode({
        item: sfs.object(expectedItem),
        remainGold: sfs.long(9007199254740993n),
        costGold: sfs.int(7),
    }));
    const effect = { gained: sfs.long(5n) };
    const use = inventoryUse(item, effect);
    expect(encode(use)).toEqual(encode({
        itemId: sfs.string("001"),
        count: sfs.int(2),
        itemEffectObj: sfs.object(effect),
    }));
    expect(inventoryBuyUse(purchase, use)).toEqual({
        buyRet: sfs.object(purchase),
        useRet: sfs.object(use),
    });
    expect(inventoryComposition([item])).toEqual({
        itemlist: sfs.array([sfs.object({
            uuid: sfs.string("stack"),
            itemId: sfs.string("001"),
            count: sfs.int(2),
        })]),
    });
    expect(inventoryChanges([item], rules)).toEqual({
        useritemlist: sfs.array([sfs.object(expectedItem)]),
    });
    expect(inventoryComposition([])).toEqual({ itemlist: sfs.array([]) });
    expect(inventoryChanges([], rules)).toEqual({ useritemlist: sfs.array([]) });
});

test("inventory events and receipt replay retain exact signed balances and ordered pushes", () => {
    expect(inventoryEvent([{
        account: "owner",
        asset: "gold",
        before: 9007199254740993n,
        after: 9007199254740992n,
        reason: "purchase",
    }])).toEqual(encode({
        changes: sfs.array([sfs.object({
            asset: sfs.string("gold"),
            before: sfs.long(9007199254740993n),
            after: sfs.long(9007199254740992n),
            reason: sfs.string("purchase"),
        })]),
    }));
    const body = { count: sfs.int(2), operationId: sfs.string("old") };
    const pushes = [
        { command: "first", body: { value: sfs.int(1) } },
        { command: "second", body: { value: sfs.int(2) } },
    ];
    const receipt = inventoryResponse(body, pushes);
    const before = Buffer.from(receipt);
    expect(inventoryReplay(receipt, "operation")).toEqual({
        body: { ...body, operationId: sfs.string("operation") },
        pushes,
    });
    expect(receipt).toEqual(before);
    expect(body.operationId).toEqual(sfs.string("old"));
    expect(fields(decode(receipt).body)).toEqual(body);
});

test("chained inventory replies keep the primary body and append pushes without rewriting inputs", () => {
    const first = { command: "first", body: { n: sfs.int(1) } };
    const second = { command: "second", body: { n: sfs.int(2) } };
    const body = { count: sfs.int(3) };
    const primary = inventoryResponse(body, [first]);
    const secondary = inventoryResponse({ ignored: sfs.bool(true) }, [second]);
    const saved = [Buffer.from(primary), Buffer.from(secondary)];
    expect(mergeInventoryResponses(primary, secondary)).toEqual(
        inventoryResponse(body, [first, second]),
    );
    expect([primary, secondary]).toEqual(saved);
    expect(mergeInventoryResponses(inventoryResponse({}, []), inventoryResponse({}, [])))
        .toEqual(inventoryResponse({}, []));
    for (
        const invalid of [
            {},
            { body: sfs.int(1), pushes: sfs.array([]) },
            { body: sfs.object({}), pushes: sfs.int(1) },
        ] as Fields[]
    )
    {
        expect(() => mergeInventoryResponses(encode(invalid), secondary)).toThrow(
            "Invalid chained inventory response",
        );
        expect(() => mergeInventoryResponses(primary, encode(invalid))).toThrow(
            "Invalid chained inventory response",
        );
    }
});
