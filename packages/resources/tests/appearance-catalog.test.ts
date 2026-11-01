import { beforeAll, expect, test } from "bun:test";
import { loadRules } from "../src/rules";
import fixture from "./fixtures/appearance-catalog.json";
import { shopAvailable } from "@opencok/shop/rules/shops";
import type { ShopState } from "@opencok/shop/contracts/shops";

let rules: Awaited<ReturnType<typeof loadRules>>;
beforeAll(async () => {
    rules = await loadRules();
});

test("appearance catalog covers every published skin in the nine collections", () => {
    expect(fixture).toHaveLength(1627);
    expect(new Set(fixture.map((skin) => skin.wikiId)).size).toBe(1627);
    const counts: Record<string, number> = {};
    for (const skin of fixture)
    {
        const category = skin.type === 105 ? 103 : skin.type;
        counts[category] = (counts[category] ?? 0) + 1;
    }
    expect(counts).toEqual({
        100: 796,
        101: 121,
        102: 5,
        103: 41,
        104: 256,
        108: 49,
        109: 137,
        115: 181,
        116: 41,
    });
});

test("appearance items activate the status belonging to their catalog skin", () => {
    for (const skin of fixture)
    {
        const status = rules.power.statuses!.get(skin.statusId)!;
        const item = rules.goods.get(skin.itemId)!;
        expect(status.type2).toBe(String(skin.type));
        expect(item.para1).toBe(skin.statusId);
        expect(["4", "5"]).toContain(item.type ?? "");
    }
});

test("appearance offers are available with their exact bound item and a supported price", () => {
    const state: ShopState = {
        inventory: {
            profile: { uid: "catalog-buyer", level: 100, regTime: 0n, appVersion: "12.06.0" },
            resource: {},
            items: [],
            cooldowns: new Map(),
            buildings: [{ itemId: 400000, level: 100 }],
            effects: async () => {
                throw new Error("Unexpected catalog effect");
            },
        },
        purchases: [],
        stock: [],
        now: Date.UTC(2026, 0, 1),
    };
    for (const skin of fixture.filter((entry) => entry.enabled))
    {
        const offer = rules.shops.get(skin.offerId)!;
        expect(offer.item_id).toBe(skin.itemId);
        expect(offer.sale_type).toBe("15");
        expect(shopAvailable(offer, state, rules)).toBe(true);
    }
});

test("existing appearance offers retain gold diamond and fragment prices", () => {
    expect(rules.shops.get("2500001")).toMatchObject({
        item_id: "203001",
        value1_type: "1",
        value1: "5000",
    });
    expect(rules.shops.get("2400001")).toMatchObject({
        item_id: "205000",
        value1_type: "8",
        value1: "1000000",
    });
    expect(rules.shops.get("1500001")).toMatchObject({
        item_id: "203273",
        value1_type: "11",
        value1: "1000000",
        value_item: "215206",
        value_item_num: "1000000",
    });
});

test("test and empty skins are not published as new purchase offers", () => {
    const pending = fixture.filter((skin) => !skin.enabled);
    expect(pending).toHaveLength(6);
    for (const skin of pending.filter((entry) => entry.offerId.startsWith("1715")))
    {
        expect(rules.shops.has(skin.offerId)).toBe(false);
    }
});
