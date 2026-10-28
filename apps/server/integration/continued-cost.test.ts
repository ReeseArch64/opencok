import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { cityHarness } from "./support/city";
import { continuedCostDomain, continuedCostOperation } from "@opencok/services/continued-cost";
import { readContinuedCostSpending } from "@opencok/mappings/continued-cost";
import { InventoryService } from "@opencok/services/inventory";
import { ShopService } from "@opencok/services/shops";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { createShopRepository } from "@opencok/repositories/shops";
import { relayMutationEvent } from "@opencok/repositories/mutation";
import { pendingContinuedCosts } from "@opencok/repositories/continued-cost";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createActivityExecutor, type ActivityDomain } from "@opencok/repositories/timed-activity";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { activity_cost } from "@opencok/drizzle/schema/opencok_kingdom/activity_cost";
import { activity_cost_log } from "@opencok/drizzle/schema/opencok_kingdom/activity_cost_log";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { sfs, decode } from "@opencok/messages/sfs";
import type { CityDomain } from "@opencok/services/city-progression";
const spender: CityDomain = {
    commands: ["synthetic.spend"],
    types: [],
    async prepare(context, _command, params)
    {
        if (params.gold)
        {
            context.economy.gold(-BigInt(params.gold.value as bigint));
        }
        if (params.wood)
        {
            context.economy.resource("wood", -BigInt(params.wood.value as bigint));
        }
        if (params.item)
        {
            context.economy.consumeItem!(String(params.item.value), Number(params.count!.value));
        }
        return { response: new Uint8Array([0x12, 0, 0]), event: null };
    },
    async apply()
    {
        throw new Error("unused synthetic activity");
    },
};
async function fixture()
{
    const h = await cityHarness([continuedCostDomain, spender]);
    h.clock.now = Date.UTC(2023, 0, 2);
    h.rules.features.set("continued_cost", {
        id: "continued_cost",
        online: "all",
        test: "all",
        version: "1.0.0",
    });
    h.rules.power.activityPanels!.set("57159", {
        ...h.rules.power.activityPanels!.get("57159")!,
        start: "2023-01-01-00-00",
        end: "2023-01-10-00-00",
    });
    h.rules.advanced.continuedCosts = new Map(
        [...(h.rules.advanced.continuedCosts ?? [])].map(([key, rule]) => [
            key,
            { ...rule, point: String(Number(rule.level) * 10) },
        ]),
    );
    const inventory = new InventoryService(
        createInventoryExecutor(h.db.db, h.authority, () => h.clock.now),
        h.rules,
        h.effects,
        () => h.clock.now,
    );
    h.rules.shops.set("cost-shop", {
        id: "cost-shop",
        onsale: "1",
        item_id: "200300",
        sale_type: "10",
        value1_type: "1",
        value1: "10",
        buy_times_daily: "100",
        total_times: "100",
    });
    const shop = new ShopService(
        createShopRepository(h.db.db, h.authority, () => h.clock.now),
        h.rules,
    );
    const events = () =>
        h.db.db
            .select()
            .from(mutation_outbox)
            .where(eq(mutation_outbox.eventType, "continuedcost.spend"));
    const deliver = async (
        owner: string,
        event: { owner: string; requestId: string; id: string; payload: Buffer; },
        service = h.service,
    ) => {
        const fact = readContinuedCostSpending(event.payload);
        if (fact.owner !== owner)
        {
            throw new Error("Foreign spending fact");
        }
        return service.domainCommand(owner, "continuedcost.apply", {
            ...decode(event.payload),
            operationId: sfs.string(continuedCostOperation(owner, event.requestId, event.id)),
        });
    };
    const flush = async (owner = "owner") => {
        for (let index = 0; index < 64; index++)
        {
            const delivered = await relayMutationEvent(
                h.db.db,
                h.authority,
                (event) => deliver(owner, event).then(() => {}),
                () => h.clock.now,
                "continuedcost.spend",
                0,
                owner,
            );
            if (!delivered)
            {
                break;
            }
        }
    };
    const spend = (amount: bigint, operationId = randomUUID()) =>
        h.command("synthetic.spend", {
            gold: sfs.long(amount),
            operationId: sfs.string(operationId),
        });
    return { ...h, inventory, shop, events, deliver, flush, spend };
}
test(
    "confirmed spending covers final shop postings, native inventory purchases and activity debits without counting retry or preview",
    async () => {
        const h = await fixture();
        try
        {
            const initial = await h.command("continuedcost.info", {});
            expect(initial.body.costPoint).toEqual(sfs.int(0));
            expect(initial.body.costType).toEqual(sfs.int(1));
            await expect(h.command("continuedcost.reward", { getLv: sfs.int(1) })).rejects
                .toMatchObject({
                    code: "E000000",
                });
            expect(await h.events()).toHaveLength(0);
            const operationId = sfs.string(randomUUID());
            await Promise.all(
                Array.from({ length: 3 }, () =>
                    h.shop.command("owner", "shoppingMall.buy", {
                        id: sfs.string("cost-shop"),
                        num: sfs.int(1),
                        operationId,
                    })),
            );
            const first = await h.events();
            expect(first).toHaveLength(1);
            expect(readContinuedCostSpending(first[0]!.payload)).toMatchObject({
                amount: 10n,
                free: 10n,
                paid: 0n,
            });
            await h.inventory.command("owner", "item.buy", {
                itemId: sfs.string("200001"),
                num: sfs.int(1),
                operationId: sfs.string(randomUUID()),
            });
            await h.spend(10n);
            const expected = (await h.events()).reduce(
                (sum, event) => sum + readContinuedCostSpending(event.payload).amount,
                0n,
            );
            expect(expected).toBeGreaterThan(20n);
            expect(await pendingContinuedCosts(h.db.db, 1, "owner")).toBe(true);
            await h.flush();
            const [row] = await h.db.db.select().from(activity_cost);
            expect(row!.total).toBe(expected);
            expect(row!.para2).toBe(expected);
            expect(row!.getLv).toBe(",1,2,3,4,5,6,7,8,9,10,11,12,13");
            expect(await h.db.db.select().from(mail)).toHaveLength(13);
            expect(await h.db.db.select().from(activity_cost_log)).toHaveLength(13);
            const info = await h.command("continuedcost.info", {});
            expect(info.body.costPoint).toEqual(sfs.long(expected));
            expect(info.body.reachLv).toEqual(sfs.int(13));
            await h.flush();
            expect(await h.db.db.select().from(mail)).toHaveLength(13);
            await expect(h.command("continuedcost.reward", { getLv: sfs.int(1) })).rejects
                .toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "spending records the original eligibility and is recovered after close under replacement authority exactly once",
    async () => {
        const h = await fixture();
        try
        {
            await h.spend(25n);
            const [event] = await h.events(),
                fact = readContinuedCostSpending(event!.payload);
            await h.db.db
                .update(userprofile)
                .set({ crossFightSrcServerId: 99 })
                .where(eq(userprofile.uid, "owner"));
            h.clock.now = Date.UTC(2023, 0, 11);
            const authority = await acquireRealmAuthority(h.db.db, 1, () => true);
            const service = new TimedActivityService(
                createActivityExecutor(
                    h.db.db,
                    authority,
                    h.handlers.domains as ReadonlyMap<number, ActivityDomain>,
                    () => h.clock.now,
                    { command: h.handlers.command },
                ),
                h.rules,
                h.effects,
            );
            const entry = {
                owner: "owner",
                requestId: event!.requestId,
                id: event!.eventId,
                payload: event!.payload,
            };
            await Promise.all(Array.from({ length: 3 }, () => h.deliver("owner", entry, service)));
            const [row] = await h.db.db.select().from(activity_cost);
            expect(row).toMatchObject({
                total: 25n,
                lv: 2,
                getLv: ",1,2",
                periodStart: fact.start,
                updateTime: fact.at,
            });
            expect(await h.db.db.select().from(mail)).toHaveLength(2);
            expect(await h.db.db.select().from(activity_cost_log)).toHaveLength(2);
            await h.deliver("owner", entry, service);
            expect((await h.db.db.select().from(activity_cost))[0]!.total).toBe(25n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "period rows preserve late old spending alongside a newer period and import legacy claim flags once",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(activity_cost).values({
                uid: "owner",
                type: 1,
                total: 15n,
                para1: 0n,
                para2: 15n,
                lv: 1,
                updateTime: BigInt(h.clock.now),
                getLv: ",1",
            });
            await h.spend(10n);
            const [old] = await h.events();
            h.clock.now = Date.UTC(2023, 1, 2);
            h.rules.power.activityPanels!.set("57159", {
                ...h.rules.power.activityPanels!.get("57159")!,
                start: "2023-02-01-00-00",
                end: "2023-02-10-00-00",
            });
            await h.spend(10n);
            const all = await h.events(),
                recent = all.find((event) => event.requestId !== old!.requestId)!;
            await h.deliver("owner", {
                owner: "owner",
                requestId: recent.requestId,
                id: recent.eventId,
                payload: recent.payload,
            });
            await h.deliver("owner", {
                owner: "owner",
                requestId: old!.requestId,
                id: old!.eventId,
                payload: old!.payload,
            });
            const rows = await h.db.db.select().from(activity_cost);
            expect(rows).toHaveLength(3);
            expect(rows.find((row) => row.periodStart === BigInt(Date.UTC(2023, 0, 1))))
                .toMatchObject({
                    total: 25n,
                    lv: 2,
                    getLv: ",1,2",
                });
            expect(rows.find((row) => row.periodStart === BigInt(Date.UTC(2023, 1, 1))))
                .toMatchObject({
                    total: 10n,
                    lv: 1,
                    getLv: ",1",
                });
            expect((await h.command("continuedcost.info", {})).body.costPoint).toEqual(
                sfs.long(10n),
            );
            expect(await h.db.db.select().from(mail)).toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "receipt failures roll back spending evidence, reward mail, period state and claims",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_cost_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_cost_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_cost_receipt()`,
            );
            await expect(h.spend(25n)).rejects.toThrow();
            expect(await h.events()).toHaveLength(0);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .gold,
            ).toBe(100000n);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_cost_receipt ON opencok_kingdom.command_receipt`,
            );
            await h.spend(25n);
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_cost_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_cost_receipt()`,
            );
            await expect(h.flush()).rejects.toThrow();
            expect(await h.db.db.select().from(activity_cost)).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            expect(await h.db.db.select().from(activity_cost_log)).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_cost_receipt ON opencok_kingdom.command_receipt`,
            );
            await h.flush();
            expect(await h.db.db.select().from(mail)).toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "outside-period, low-castle and cross-world spending is excluded before committing its evidence",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.items.set("continued_cost", {
                ...h.rules.items.get("continued_cost")!,
                k1: "2",
            });
            await h.spend(10n);
            h.rules.items.set("continued_cost", {
                ...h.rules.items.get("continued_cost")!,
                k1: "1",
            });
            await h.db.db
                .update(userprofile)
                .set({ crossFightSrcServerId: 10 })
                .where(eq(userprofile.uid, "owner"));
            await h.spend(10n);
            await h.db.db
                .update(userprofile)
                .set({ crossFightSrcServerId: -1 })
                .where(eq(userprofile.uid, "owner"));
            h.clock.now = Date.UTC(2023, 0, 10);
            await h.spend(10n);
            expect(await h.events()).toHaveLength(0);
            expect((await h.command("continuedcost.info", {})).body.operationId).toBeDefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "legacy earned rewards can be claimed once and owner-scoped relays leave other players pending",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(activity_cost).values({
                uid: "owner",
                type: 1,
                total: 35n,
                para1: 0n,
                para2: 35n,
                lv: 3,
                updateTime: BigInt(h.clock.now),
                getLv: ",1",
            });
            const operationId = sfs.string(randomUUID());
            await Promise.all(
                Array.from(
                    { length: 3 },
                    () => h.command("continuedcost.reward", { getLv: sfs.int(2), operationId }),
                ),
            );
            expect((await h.command("continuedcost.info", {})).body.getLv).toEqual(
                sfs.string("1,2"),
            );
            expect(await h.db.db.select().from(activity_cost_log)).toHaveLength(1);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            expect(await h.db.db.select().from(user_item)).not.toHaveLength(0);
            await expect(h.command("continuedcost.reward", { getLv: sfs.int(2) })).rejects
                .toThrow();
            await h.spend(10n);
            await h.command("synthetic.spend", { gold: sfs.long(10n) }, "other");
            await h.flush("other");
            expect(await pendingContinuedCosts(h.db.db, 1, "other")).toBe(false);
            expect(await pendingContinuedCosts(h.db.db, 1, "owner")).toBe(true);
            await h.flush();
            expect((await h.command("continuedcost.info", {})).body.costPoint).toEqual(
                sfs.long(45n),
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
    "resource and speed-item periods count confirmed quantities in their own saved rows",
    async () => {
        const h = await fixture();
        try
        {
            const original = [...h.rules.advanced.continuedCosts!];
            const setType = (type: number) => {
                h.rules.items.set("continued_cost", {
                    ...h.rules.items.get("continued_cost")!,
                    k2: String(type),
                });
                h.rules.advanced.continuedCosts = new Map(
                    original.map(([id, rule]) => [
                        id,
                        { ...rule, type: String(type), point: String(Number(rule.level)) },
                    ]),
                );
            };
            await h.db.db
                .insert(user_item)
                .values({ uuid: "speed", ownerId: "owner", itemId: "200220", count: 4, value: 0 });
            setType(2);
            await h.command("synthetic.spend", { item: sfs.string("speed"), count: sfs.int(2) });
            await h.flush();
            expect(
                (await h.db.db.select().from(activity_cost)).find((row) => row.type === 2)!.total,
            ).toBe(
                2n,
            );
            setType(3);
            await h.command("synthetic.spend", { wood: sfs.long(5n) });
            await h.flush();
            expect(
                (await h.db.db.select().from(activity_cost)).find((row) => row.type === 3)!.total,
            ).toBe(
                5n,
            );
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "speed")))[0]!
                    .count,
            ).toBe(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "ranking privacy toggles once per receipt and global rank prizes remain a preview",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.features.set("new_rank_cost", {
                id: "new_rank_cost",
                online: "all",
                test: "all",
                version: "1.0.0",
            });
            expect((await h.command("continuedcost.hideking", {})).body.myHide).toBeUndefined();
            await h.db.db
                .insert(user_mixed_info)
                .values({ uid: "owner", mdata: "synthetic-preserved", shippingTradeInvestGold: 17 })
                .onConflictDoUpdate({
                    target: user_mixed_info.uid,
                    set: { mdata: "synthetic-preserved", shippingTradeInvestGold: 17, costHide: 0 },
                });
            const operationId = sfs.string(randomUUID());
            const replies = await Promise.all(
                Array.from(
                    { length: 3 },
                    () => h.command("continuedcost.hideking", { operationId }),
                ),
            );
            expect(replies.map((reply) => reply.body.myHide)).toEqual([
                sfs.int(1),
                sfs.int(1),
                sfs.int(1),
            ]);
            expect((await h.command("continuedcost.hideking", {})).body.myHide).toEqual(sfs.int(0));
            expect((await h.db.db.select().from(user_mixed_info))[0]).toMatchObject({
                mdata: "synthetic-preserved",
                shippingTradeInvestGold: 17,
            });
            const result = await h.command("continuedcost.global.reward", {});
            expect(result.body.rewardArr?.value).toHaveLength(3);
            expect(await h.db.db.select().from(user_item)).toHaveLength(0);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            h.rules.features.set("new_rank_cost", {
                id: "new_rank_cost",
                online: "close",
                test: "close",
                version: "1.0.0",
            });
            expect((await h.command("continuedcost.hideking", {})).body.myHide).toBeUndefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
