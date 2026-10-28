import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { Rules } from "@opencok/rules/game";
import {
    hotItemOffer,
    hotItemPool,
    hotItemVersion,
    hotRefreshCost,
    chooseHotItems,
    hotBusinessMan,
    type HotItemFilter,
} from "@opencok/rules/hot-item";
import { hotItemView, hotBestItemView, hotBusinessManView } from "@opencok/mappings/hot-item";
import { GameService } from "@opencok/services/game";
import { fields, sfs, encode, decode, type Fields } from "@opencok/messages/sfs";
import type { GameStore } from "@opencok/contracts/game";
import type { Rule } from "@opencok/rules/game";
const item = {
    uid: "synthetic",
    goodsId: "200001;3",
    itemId: "200001",
    num: 2,
    priceType: 5,
    price: 10,
    price_hot: 20,
    para1: 4,
    type: 2,
    refreshTime: 1000n,
};
test("native hot-item mapping preserves source scalar types, goods/equipment/resource categories and V3 kind", () => {
    expect(decode(encode(hotItemView(item, 3)))).toEqual({
        itemId: sfs.string("200001"),
        itemNum: sfs.int(3),
        num: sfs.int(2),
        priceType: sfs.int(5),
        price: sfs.int(10),
        price_hot: sfs.int(20),
        color: sfs.int(4),
        type: sfs.int(1),
        kind: sfs.int(2),
    });
    expect(hotItemView(item, 2).kind).toBeUndefined();
    expect(hotItemView({ ...item, goodsId: "0;3", itemId: "0" }, 2).type).toEqual(sfs.int(0));
    expect(hotItemView({ ...item, goodsId: "10000004;1", itemId: "10000004" }, 2).type).toEqual(
        sfs.int(2),
    );
    expect(
        hotBestItemView({ goodsId: "200001;3", color: 4, price_type: 5, price: 10, price_hot: 20 }),
    ).toEqual({
        goodsId: sfs.string("200001;3"),
        color: sfs.int(4),
        priceType: sfs.int(5),
        price: sfs.int(10),
        price_hot: sfs.int(20),
        type: sfs.int(1),
    });
    for (
        const row of [
            { ...item, itemId: "200002" },
            { ...item, goodsId: "200001;0" },
            { ...item, num: -1 },
            { ...item, price: 0 },
            { ...item, priceType: 9 },
            { ...item, type: 128 },
        ]
    )
    {
        expect(() => hotItemOffer(row)).toThrow();
    }
});
test("declared refresh tiers retain free quotas and strict V3 dates and feature/version gates", async () => {
    const rules = await loadRules();
    expect([0, 1, 2, 3, 4, 11, 12, 13, 200].map((count) => hotRefreshCost(rules, count))).toEqual([
        0,
        0,
        0,
        5,
        10,
        150,
        200,
        200,
        200,
    ]);
    const store = rules.items.get("store")!;
    const start = BigInt(Date.UTC(2017, 10, 15, 2)),
        end = BigInt(Date.UTC(2025, 10, 22, 2));
    expect(hotItemVersion(rules, start)).toBe(2);
    expect(hotItemVersion(rules, start + 1n)).toBe(3);
    expect(hotItemVersion(rules, end - 1n)).toBe(3);
    expect(hotItemVersion(rules, end)).toBe(2);
    rules.features.set("hotstore", {
        id: "hotstore",
        online: "close",
        test: "close",
        version: "3.6.0",
    });
    expect(hotItemVersion(rules, start + 1n)).toBe(2);
    rules.features.set("hotstore", {
        id: "hotstore",
        online: "all",
        test: "all",
        version: "13.0.0",
    });
    expect(hotItemVersion(rules, start + 1n)).toBe(2);
    expect(hotBusinessManView(rules, start).isOpen).toEqual(sfs.int(0));
    const window = hotBusinessMan(rules, BigInt(Date.UTC(2030, 0, 1)));
    expect(window.start).toBe(BigInt(Date.UTC(2030, 0, 1)));
    expect(window.end).toBe(BigInt(Date.UTC(2030, 0, 9)));
    rules.items.set("store", { ...store, k2: "0;0" });
    expect(() => hotRefreshCost(rules, 0)).toThrow();
});
test("weighted selection uses persisted purchase count, samples without replacement, bounds random draws and appends routine offers", () => {
    const pool: Rule[] = [
        { id: "first", item: "200001;1", rate: "0;100" },
        { id: "second", item: "200002;1", rate: "100;0" },
        { id: "routine", item: "200003;1", routine: "1" },
    ];
    expect(chooseHotItems(pool, 2, [], () => 0, true).map((rule) => rule.id)).toEqual([
        "second",
        "routine",
    ]);
    expect(
        chooseHotItems(pool, 1, [{ goodsId: "200001;1", buyCount: 1 }], () => 0, false).map(
            (rule) => rule.id,
        ),
    ).toEqual(["first"]);
    expect(() => chooseHotItems(pool, 1, [], (maximum) => maximum, false)).toThrow();
    expect(() => chooseHotItems(pool, 65, [], () => 0, false)).toThrow();
    expect(pool).toHaveLength(3);
});
test("eligibility checks respect owned inventory, resource totals, active score facts, dates, levels, purchase prerequisites and merge facts", () => {
    const rules = new Rules(new Map(), new Map(), new Map());
    const now = BigInt(Date.UTC(2030, 0, 1, 12));
    const state: HotItemFilter = {
        now,
        level: 10,
        castle: 12,
        refreshCount: 3,
        server: { shuaguaiActStart: now - 86400000n, lastMergeMillis: now - 3600000n },
        scores: [{ id: 48006, readyTime: now - 2n * 86400000n, endTime: now + 86400000n }],
        purchases: [{ goodsId: "200002;1", buyCount: 1 }],
        quantity: (id) => (id === "200001" ? 1 : 0),
        balance: (asset) => (asset === "wood" ? 5n : asset === "woodbind" ? 3n : 0n),
    };
    const supported = [
        "1;2",
        "2;1",
        "3;48006",
        "5;2029-12-31-00-00",
        "6;2030-01-02-00-00",
        "7;12",
        "8;12",
        "9;2",
        "10;1",
        "11;200001",
        "12;10",
        "13;10",
        "14;3",
        "15;8",
        "16;8",
        "17;0",
        "18;0",
        "19;0",
        "20;0",
        "21;0",
        "22;0",
        "23;prerequisite",
        "24;2",
        "25;1",
    ];
    const entries = supported.map(
        (condition, index) =>
            [String(index), {
                id: String(index),
                item: "200001;1",
                price_type: "0",
                condition,
            }] as [
                string,
                Rule,
            ],
    );
    rules.advanced.hotItems = new Map([
        ...entries,
        ["prerequisite", { id: "prerequisite", item: "200002;1", price_type: "0" }],
    ]);
    expect(hotItemPool(rules, state, false)).toHaveLength(25);
    rules.advanced.hotItems!.set("no", {
        id: "no",
        item: "200001;1",
        price_type: "5",
        condition: "11;missing",
    });
    expect(hotItemPool(rules, state, false).some((rule) => rule.id === "no")).toBe(false);
    rules.advanced.hotItems!.set("early-gold", { id: "early-gold", price_type: "5" });
    expect(
        hotItemPool(rules, { ...state, refreshCount: 1 }, true).some(
            (rule) => rule.id === "early-gold",
        ),
    ).toBe(false);
    rules.advanced.hotItems!.set("future", { id: "future", version: "13.0.0" });
    expect(hotItemPool(rules, state, false).some((rule) => rule.id === "future")).toBe(false);
    rules.advanced.hotItems!.set("invalid", { id: "invalid", condition: "26;1" });
    expect(() => hotItemPool(rules, state, false)).toThrow();
});
test("native get/refresh/buy commands reach the owned progression service and retain correlation", async () => {
    const seen: string[] = [];
    const service = new GameService(
        {} as GameStore,
        new Rules(new Map(), new Map(), new Map()),
        { kingdomId: 1 },
        () => 1,
        {
            async cityProgression(owner, command)
            {
                expect(owner).toBe("synthetic");
                seen.push(command);
                return { body: { remainGold: sfs.long(7) }, pushes: [] };
            },
        },
    );
    const commands = [
        "hot.item.v2.get",
        "hot.item.refresh",
        "hot.item.refreshV3",
        "hot.item.v2.buy",
        "hot.item.v3.buy",
    ];
    for (const command of commands)
    {
        const body: Fields = (
            await service.execute("synthetic", command, {
                _cok_: sfs.string("opaque"),
                cmdBaseTime: sfs.string("clock"),
            })
        ).body;
        expect(body._cok_).toEqual(sfs.string("opaque"));
        expect(body.cmdBaseTime).toEqual(sfs.string("clock"));
        expect(body.remainGold).toEqual(sfs.long(7));
    }
    expect(seen).toEqual(commands);
});

test("curated draws retain bounded distinct persisted offer identities across varied random choices", async () => {
    const { createHotItemDomain } = await import("@opencok/services/hot-item");
    const { CityProgressionContext } = await import("@opencok/services/city-progression");
    const rules = await loadRules();
    for (let seed = 1; seed <= 64; seed++)
    {
        let state = seed;
        const random = (maximum: number) => {
            state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
            return state % maximum;
        };
        const snapshot = {
            profile: { uid: "synthetic", level: 1 },
            resource: {},
            buildings: [{ itemId: 400000, level: 1 }],
            hotItem: { v2: [], v3: [], purchases: [], server: {}, scores: [] },
        } as unknown as import("@opencok/contracts/city-progression").CityProgressionState;
        const context = new CityProgressionContext(
            snapshot,
            rules,
            BigInt(Date.UTC(2030, 0, 1)),
            {
                gold()
                {},
                resource()
                {},
                item()
                {},
                balance: () => 1000000n,
                quantity: () => 0,
            },
            () => 0,
        );
        await createHotItemDomain(random).prepare(context, "hot.item.v2.get", {});
        const offers = context.write.hotItem!.offers;
        expect(offers).toHaveLength(4);
        expect(new Set(offers.map((offer) => `${offer.goodsId}:${offer.price}`)).size).toBe(
            offers.length,
        );
    }
});

test("businessman login shares the realm calendar, keeps its board until the next boundary, and delivers native refreshes to eligible subscribers", async () => {
    const { createHotBusinessMan, publishHotBusinessMan } = await import(
        "@opencok/services/hot-item"
    );
    const rules = await loadRules();
    let now = Date.UTC(2030, 0, 1);
    const calendar = createHotBusinessMan(rules, () => now);
    const first = calendar.current()!;
    now += 86400000;
    expect(calendar.current()).toEqual(first);
    now = Number(first.body.endTime!.value);
    const current = calendar.current()!;
    expect(current.key).not.toBe(first.key);
    expect(current.body.startTime).toEqual(sfs.long(now));
    const sent: string[] = [];
    await publishHotBusinessMan(
        ["owner", "owner", "other", "blocked"],
        {
            async select(owners)
            {
                return owners.filter((owner) => owner !== "blocked");
            },
        },
        () => calendar.current()!.body,
        async (owner, command, body) => {
            expect(command).toBe("push.businessman.refresh");
            expect(body).toEqual(current.body);
            sent.push(owner);
        },
        () => now,
    );
    expect(sent).toEqual(["owner", "other"]);
    const store = {
        async getPowerByPlayerId()
        {
            const { emptyPowerState } = await import("./fixtures/power-state");
            return emptyPowerState({ uid: "synthetic" });
        },
        async getCityByPlayerId()
        {
            return {
                profile: { uid: "synthetic" },
                resource: {},
                world: { worldId: 0 },
                buildings: [],
                queues: [],
                armies: [],
                items: [],
                hasMarches: false,
            };
        },
    } as unknown as GameStore;
    const basic = new Rules(
        new Map(),
        new Map([["100100", { id: "100100", player_exp: "100" }]]),
        new Map(),
    );
    const game = new GameService(store, basic, { kingdomId: 1 }, () => now, {
        hotItemBusinessMan: async () => calendar.current()!.body,
    });
    expect(fields((await game.initialize("synthetic")).body.businessMan)).toEqual(current.body);
});
