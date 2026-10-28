import { hotBusinessManView } from "@opencok/mappings/hot-item";
import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { createHotItemDomain } from "@opencok/services/hot-item";
import { createPrayerDomain } from "@opencok/services/prayer";
import { user_hot_item_v2 } from "@opencok/drizzle/schema/opencok_kingdom/user_hot_item_v2";
import { user_hot_item_v3 } from "@opencok/drizzle/schema/opencok_kingdom/user_hot_item_v3";
import { hot_refresh_record } from "@opencok/drizzle/schema/opencok_kingdom/hot_refresh_record";
import { hot_buy_record } from "@opencok/drizzle/schema/opencok_kingdom/hot_buy_record";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { score_act } from "@opencok/drizzle/schema/opencok_kingdom/score_act";
import { hero_event } from "@opencok/drizzle/schema/opencok_kingdom/hero_event";
import { economy_posting } from "@opencok/drizzle/schema/opencok_kingdom/economy_posting";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { fields, sfs, int, str, type Fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([createHotItemDomain(() => 0), createPrayerDomain(() => 0)]);
    h.clock.now = Date.UTC(2030, 0, 1, 12);
    h.rules.items.set("store", {
        ...h.rules.items.get("store")!,
        k3: "2",
        k2: "2;0|3;5|2147483647;10",
    });
    h.rules.advanced.hotItems = new Map(
        ["200001", "200002", "200003", "200004"].map((id, index) => [
            String(index),
            {
                id: String(index),
                item: `${id};3`,
                num: "2",
                price_type: "5",
                price: "10",
                rate: "100;1",
                color: String(index + 1),
                merchantGoodsType: String((index % 2) + 1),
            },
        ]),
    );
    h.rules.advanced.campaignRules = [
        {
            id: "synthetic-hot",
            state: 2,
            openType: 2,
            events: [{ code: 84 }],
            conditions: [],
            actions: [{ code: 9, parameters: "P$long_hot_buys;+;1" }],
        },
    ];
    h.rules.advanced.campaignVariables!.set("P$long_hot_buys", {
        scope: "P",
        id: "long_hot_buys",
        initialValue: 0,
    });
    const original = h.rules.ranking.heroEvents!.get("9001000")!;
    const reward = original.reward!.split("|")[0]!.split(";")[0]!;
    h.rules.ranking.heroEvents!.set("synthetic-hot", {
        ...original,
        id: "synthetic-hot",
        score: "47075|47076",
        target: "1000000000",
        reward,
    });
    await h.db.db.insert(hero_event).values({
        uuid: "hot-hero",
        eventId: "synthetic-hot",
        activityId: "synthetic",
        type: 1,
        rewardType: 1,
        readyTime: 1n,
        startTime: 1n,
        endTime: BigInt(h.clock.now + 30 * 86400000),
        rewardStatus: 0,
    });
    const view = async (owner = "owner") => (await h.command("hot.item.v2.get", {}, owner)).body;
    const buy = (offer: Fields, params: Fields = {}, version = 2, owner = "owner") =>
        h.command(
            `hot.item.v${version}.buy`,
            {
                itemId: offer.itemId!,
                itemNum: offer.itemNum!,
                num: sfs.int(1),
                priceType: offer.priceType!,
                price: offer.price!,
                ...params,
            },
            owner,
        );
    const offers = (body: Fields) => (body.hotItem!.value as Value[]).map(fields);
    return { ...h, view, buy, offers };
}
test(
    "black-market offers persist, purchases atomically debit and grant with trusted hero/quest/campaign production, and retries never purchase twice",
    async () => {
        const h = await fixture();
        try
        {
            const body = await h.view(),
                offer = h.offers(body)[0]!;
            expect(body.refreshTime?.type).toBe(sfs.long(1).type);
            expect(h.offers(body)).toHaveLength(2);
            expect(str(offer, "itemId")).toBe("200001");
            expect(int(fields(body.bestItem), "color")).toBe(4);
            expect((await h.db.db.select().from(hot_refresh_record))[0]?.count).toBe(0);
            const operationId = sfs.string(randomUUID());
            const first = await h.buy(offer, { operationId });
            expect(await h.buy(offer, { operationId })).toEqual(first);
            const racing = await Promise.allSettled([h.buy(offer), h.buy(offer)]);
            expect(racing.filter((result) => result.status === "fulfilled")).toHaveLength(1);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]
                    ?.gold,
            ).toBe(99980n);
            expect(
                (
                    await h.db.db
                        .select()
                        .from(user_item)
                        .where(and(eq(user_item.ownerId, "owner"), eq(user_item.itemId, "200001")))
                )[0]?.count,
            ).toBe(6);
            expect((await h.db.db.select().from(score_act))[0]?.score).toBe(2000);
            expect((await h.db.db.select().from(hot_buy_record))[0]?.buyCount).toBe(2);
            expect(
                (await h.db.db.select().from(trigger_var).where(
                    eq(trigger_var.key, "long_hot_buys"),
                ))[0]
                    ?.value,
            ).toBe("2");
            const current = await h.view();
            expect(h.offers(current).some((row) => str(row, "itemId") === "200001")).toBe(false);
            expect(h.offers(current).some((row) => str(row, "itemId") === "200003")).toBe(true);
            await expect(h.buy(offer)).rejects.toThrow();
            await expect(h.buy(h.offers(current)[0]!, { price: sfs.int(9) })).rejects.toThrow();
            await expect(h.buy(h.offers(current)[0]!, { priceType: sfs.int(0) })).rejects.toThrow();
            await expect(h.buy(h.offers(current)[0]!, {}, 2, "other")).rejects.toThrow();
            const itemsBefore = await h.db.db.select().from(user_item);
            const rowsBefore = await h.db.db.select().from(user_hot_item_v2);
            const receiptsBefore = await h.db.db.select().from(command_receipt);
            await h.db.pool.query(
                "create function reject_hot_commit() returns trigger language plpgsql as $$ begin raise exception 'synthetic hot rollback'; end $$",
            );
            await h.db.pool.query(
                "create trigger reject_hot_commit before insert on opencok_kingdom.command_receipt for each row execute function reject_hot_commit()",
            );
            await expect(h.buy(h.offers(current)[0]!)).rejects.toThrow();
            expect(await h.db.db.select().from(user_hot_item_v2)).toEqual(rowsBefore);
            expect(await h.db.db.select().from(user_item)).toEqual(itemsBefore);
            expect(await h.db.db.select().from(command_receipt)).toEqual(receiptsBefore);
            expect((await h.db.db.select().from(score_act))[0]?.score).toBe(2000);
            await h.db.pool.query(
                "drop trigger reject_hot_commit on opencok_kingdom.command_receipt",
            );
            await h.db.db.insert(user_building).values({
                uid: "owner",
                uuid: "owner-altar",
                itemId: 428000,
                pos: 14,
                level: 1,
                opType: 0,
                refreshTime: BigInt(h.clock.now),
            });
            const prayer = await h.command("user.pray.info", {});
            await h.command("user.pray", {
                resource: sfs.int(0),
                gold: sfs.int(0),
                num: prayer.body.wood!,
            });
            expect((await h.db.db.select().from(score_act))[0]?.score).toBe(2001);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "daily budgets retain free refreshes, exclude early gold rerolls, charge escalation once and reset on the next actual day",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.advanced.hotItems!.set("resource", {
                id: "resource",
                item: "200010;2",
                num: "1",
                price_type: "0",
                price: "7",
                rate: "100",
                merchantGoodsType: "1",
            });
            await h.view();
            for (let index = 0; index < 3; index++)
            {
                const operationId = sfs.string(randomUUID());
                const result = await h.command("hot.item.refresh", { operationId });
                expect(await h.command("hot.item.refresh", { operationId })).toEqual(result);
                expect(int(result.body, "goldCost")).toBe(index === 0 ? 0 : index === 1 ? 5 : 10);
                if (index < 2)
                {
                    expect(h.offers(result.body).every((offer) => int(offer, "priceType") !== 5))
                        .toBe(true);
                }
            }
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]
                    ?.gold,
            ).toBe(99995n);
            expect((await h.db.db.select().from(hot_refresh_record))[0]?.count).toBe(3);
            const last = (await h.db.db.select().from(user_hot_item_v2))[0]!;
            h.clock.now += 86400000;
            await expect(
                h.buy({
                    itemId: sfs.string(last.itemId!),
                    itemNum: sfs.int(Number(last.goodsId.split(";")[1])),
                    priceType: sfs.int(last.priceType!),
                    price: sfs.int(last.price),
                }),
            ).rejects.toThrow();
            const view = await h.view();
            expect(int(view, "goldCost")).toBe(0);
            expect((await h.db.db.select().from(hot_refresh_record))[0]?.count).toBe(0);
            expect(
                (await h.db.db.select().from(user_hot_item_v2)).every(
                    (row) => row.refreshTime === BigInt(h.clock.now),
                ),
            ).toBe(true);
            expect(await h.db.db.select().from(hot_buy_record)).toHaveLength(0);
            await h.db.db.update(userprofile).set({ gold: 0n }).where(eq(userprofile.uid, "owner"));
            await h.command("hot.item.refresh", {});
            await h.command("hot.item.refresh", {});
            const before = await h.db.db.select().from(user_hot_item_v2);
            await expect(h.command("hot.item.refresh", {})).rejects.toThrow();
            expect(await h.db.db.select().from(user_hot_item_v2)).toEqual(before);
            expect((await h.db.db.select().from(hot_refresh_record))[0]?.count).toBe(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "V3 native dispatch preserves category quotas, endTime, costs and version/activity gates",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.items.set("store", {
                ...h.rules.items.get("store")!,
                k9: "1;1|2;1",
                k10: "2029-01-01-00-00",
                k11: "2031-01-01-00-00",
            });
            h.rules.features.set("hotstore", {
                id: "hotstore",
                version: "3.6.0",
                online: "all",
                test: "all",
            });
            const body = await h.view();
            expect(body.endTime).toEqual(sfs.long(Date.UTC(2031, 0, 1)));
            expect(h.offers(body).map((offer) => int(offer, "kind"))).toEqual([1, 2]);
            expect(await h.db.db.select().from(user_hot_item_v2)).toHaveLength(0);
            expect(await h.db.db.select().from(user_hot_item_v3)).toHaveLength(2);
            await expect(h.buy(h.offers(body)[0]!, {}, 2)).rejects.toThrow();
            await h.buy(h.offers(body)[0]!, {}, 3);
            expect(
                (await h.db.db.select().from(user_hot_item_v3)).find((row) =>
                    row.goodsId === "200001;3"
                )
                    ?.num,
            ).toBe(1);
            expect((await h.db.db.select().from(score_act))[0]?.score).toBe(1000);
            await expect(h.command("hot.item.refresh", {})).rejects.toThrow();
            h.clock.now = Date.UTC(2031, 0, 1);
            await expect(h.buy(h.offers(body)[0]!, {}, 3)).rejects.toThrow();
            await expect(h.command("hot.item.refreshV3", {})).rejects.toThrow();
            const expired = await h.view();
            expect(expired.endTime).toBeUndefined();
            expect(h.offers(expired).every((offer) => !offer.kind)).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "black-market costs cover bound resources, inventory tokens and crystal; real grants include resource packs and equipment",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.items.set("store", { ...h.rules.items.get("store")!, k3: "1" });
            await h.db.db.update(user_resource).set({ woodbind: 5n }).where(
                eq(user_resource.uid, "owner"),
            );
            await h.db.db.update(userprofile).set({ crystal: 100n }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.db.db.insert(user_item).values({
                uuid: "synthetic-token",
                ownerId: "owner",
                itemId: "987601",
                count: 20,
                value: 0,
                vanishTime: 0n,
            });
            const equipmentId = [...h.rules.power.equipment!.values()].find(
                (rule) =>
                    rule.show !== "no" && Number(rule.id) >= 10000004
                    && Number(rule.id) <= 10050555,
            )!.id!;
            const cases = [
                { item: "200001;3", price_type: "0", price: "7" },
                { item: "0;11", price_type: "987601", price: "4" },
                { item: `${equipmentId};1`, price_type: "8", price: "10" },
            ];
            for (const [index, entry] of cases.entries())
            {
                h.clock.now += 86400000;
                h.rules.advanced.hotItems = new Map([
                    ["offer", {
                        id: "offer",
                        ...entry,
                        num: "3",
                        rate: "100",
                        merchantGoodsType: "1",
                    }],
                ]);
                const before = (
                    await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner"))
                )[0]!;
                const offer = h.offers(await h.view())[0]!;
                const result = await h.buy(offer, { num: sfs.int(index === 0 ? 2 : 1) });
                if (index === 0)
                {
                    const after = (
                        await h.db.db.select().from(user_resource).where(
                            eq(user_resource.uid, "owner"),
                        )
                    )[0]!;
                    expect(after.woodbind).toBe(0n);
                    expect(before.wood! - after.wood!).toBe(2n);
                    expect(int(fields(result.body.hotItem), "num")).toBe(1);
                    expect(
                        (await h.db.db.select().from(user_item).where(
                            eq(user_item.itemId, "200001"),
                        ))[0]?.count,
                    ).toBe(3);
                }
                else if (index === 1)
                {
                    expect(
                        (await h.db.db.select().from(user_item).where(
                            eq(user_item.uuid, "synthetic-token"),
                        ))[0]
                            ?.count,
                    ).toBe(16);
                    expect(
                        (await h.db.db.select().from(user_resource).where(
                            eq(user_resource.uid, "owner"),
                        ))[0]!
                            .wood! - before.wood!,
                    ).toBe(11n);
                }
                else
                {
                    expect(
                        (await h.db.db.select().from(userprofile).where(
                            eq(userprofile.uid, "owner"),
                        ))[0]
                            ?.crystal,
                    ).toBe(90n);
                    expect(
                        await h.db.db.select().from(user_equip).where(eq(user_equip.uid, "owner")),
                    ).toHaveLength(1);
                    expect(result.body.equip!.value as Value[]).toHaveLength(1);
                }
            }
            expect((await h.db.db.select().from(score_act))[0]?.score).toBe(3000);
            const postings = await h.db.db.select().from(economy_posting);
            expect(postings.some((row) => row.asset === "profile.crystal" && row.delta === -10n))
                .toBe(
                    true,
                );
            expect(postings.some((row) => row.asset === "resource.woodbind" && row.delta === -5n))
                .toBe(
                    true,
                );
            expect(postings.some((row) => row.asset === "resource.wood" && row.delta === 11n)).toBe(
                true,
            );
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "curated catalogs generate real native offers and imported corruption or owner fencing prevents every economic side effect",
    async () => {
        const { loadRules } = await import("@opencok/resources/rules");
        const { acquireRealmAuthority } = await import("@opencok/repositories/realm-authority");
        const h = await fixture();
        try
        {
            const curated = await loadRules();
            h.rules.advanced.hotItems = curated.advanced.hotItems;
            h.rules.items.set("store", curated.items.get("store")!);
            expect(hotBusinessManView(h.rules, BigInt(h.clock.now)).isOpen).toEqual(sfs.int(0));
            const current = await h.view();
            expect(h.offers(current)).toHaveLength(4);
            expect(
                (await h.db.db.select().from(user_hot_item_v2)).every(
                    (row) => row.goodsId && row.price > 0 && row.num! > 0,
                ),
            ).toBe(true);
            const before = await h.db.db.select().from(userprofile);
            const postingsBefore = await h.db.db.select().from(economy_posting);
            await h.db.db.delete(user_hot_item_v2);
            await h.db.db.insert(user_hot_item_v2).values(
                Array.from({ length: 65 }, (_, index) => ({
                    uid: "owner",
                    goodsId: `${200000 + index};1`,
                    itemId: String(200000 + index),
                    num: 1,
                    priceType: 5,
                    price: 1,
                    refreshTime: BigInt(h.clock.now),
                })),
            );
            await expect(h.view()).rejects.toThrow();
            expect(await h.db.db.select().from(userprofile)).toEqual(before);
            await h.db.db.delete(user_hot_item_v2);
            await h.view();
            await acquireRealmAuthority(h.db.db, 1, () => true);
            await expect(h.view()).rejects.toThrow();
            await expect(h.buy(h.offers(current)[0]!)).rejects.toThrow();
            expect(await h.db.db.select().from(userprofile)).toEqual(before);
            expect(await h.db.db.select().from(economy_posting)).toEqual(postingsBefore);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
