import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { createExchangeActivityDomain } from "@opencok/services/exchange-activity";
import { anniversaryDomain } from "@opencok/services/anniversary";
import {
    monsterExchangeConfig,
    selectMonsterExchangeOffers,
    monsterExchangeOffersText,
} from "@opencok/rules/monster-exchange";
import { user_activity_new } from "@opencok/drizzle/schema/opencok_kingdom/user_activity_new";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { sfs, fields, type Fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([anniversaryDomain, createExchangeActivityDomain(() => 0)]);
    h.clock.now = Date.UTC(2024, 8, 15, 12);
    const enable = (id: string) =>
        h.rules.power.activityPanels!.set(id, {
            ...h.rules.power.activityPanels!.get(id)!,
            function_on: "1",
            start: "2024-09-13-00-00",
            end: "2024-09-20-00-00",
        });
    enable("57209");
    const command = (name: string, params: Fields, id = randomUUID()) =>
        h.command(name, { ...params, operationId: sfs.string(id) });
    const info = async (ids = "57209") => command("act.exchange", { ids: sfs.string(ids) });
    const state = async (id = 57209) =>
        (await h.db.db.select().from(user_activity_new).where(eq(user_activity_new.actId, id)))[0]!;
    return {
        ...h,
        enable,
        command,
        info,
        state,
        config: (id = "57209") => monsterExchangeConfig(h.rules.power.activityPanels!.get(id)!),
        fund: (count = 100000, itemId = "211658") =>
            h.db.db
                .insert(user_item)
                .values({ uuid: `tokens-${itemId}`, ownerId: "owner", itemId, count, value: 0 }),
        balance: async (itemId = "211658") =>
            (await h.db.db.select().from(user_item).where(eq(user_item.itemId, itemId)))[0]?.count
                ?? 0,
        claim: (level = 1, id = randomUUID(), panel = "57209") =>
            command("act.ex.reward", { id: sfs.string(panel), type: sfs.int(level) }, id),
        flush: (id = randomUUID(), panel = "57209") =>
            command("act.ex.flush", { actId: sfs.string(panel) }, id),
        counter: async (key: string) =>
            (await h.db.db.select().from(trigger_var)).find((row) => row.key === key)?.value,
        legacy: async (panel = "57209", receiveLevels = "") => {
            const config = monsterExchangeConfig(h.rules.power.activityPanels!.get(panel)!);
            await h.db.db.insert(user_activity_new).values({
                uid: "owner",
                actId: 6,
                level: receiveLevels ? Number(receiveLevels.split(",").at(-1)) : 0,
                rewards: monsterExchangeOffersText(selectMonsterExchangeOffers(config, () => 0)),
                updateTime: BigInt(h.clock.now),
                reserve_1: 0,
                reserve_2: "",
                flushTimes: 1,
                flushDate: BigInt(h.clock.now),
                receiveLevels,
            });
        },
    };
}
test(
    "native token and fragment projections share their command without sharing saved offers or daily budgets",
    async () => {
        const h = await fixture();
        try
        {
            h.enable("57006");
            const response = await h.info("57209|57006|57096"),
                list = response.body.exchange!.value as Value[];
            expect(list).toHaveLength(2);
            expect(fields(list[0]).actId).toEqual(sfs.string("57209"));
            expect(fields(fields(list[0]).activity).rewards?.type).toBe(17);
            expect(fields(list[1]).actId).toEqual(sfs.string("57006"));
            expect(fields(list[1]).info?.type).toBe(17);
            const saved = await h.state();
            expect(saved.actId).toBe(57209);
            expect(saved.reserve_1).toBe(6);
            await h.info();
            expect(await h.state()).toEqual(saved);
            expect(await h.db.db.select().from(user_item)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "saved token offers allow out-of-order claims, complete their cycle and score only funded native event six",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.advanced.campaignRules = [
                ...h.rules.advanced.campaignRules!,
                {
                    id: "synthetic-native-six",
                    state: 2,
                    openType: 2,
                    events: [{ code: 62, parameters: "6;-1" }],
                    conditions: [],
                    actions: [{ code: 9, parameters: "$kingwar_testitem_sent_2;+;1" }],
                },
            ];
            await h.info();
            await h.fund();
            const original = await h.state(),
                config = h.config(),
                id = randomUUID(),
                first = await h.claim(3, id);
            expect(first.body.level).toEqual(sfs.int(3));
            expect(first.body.actId).toBeUndefined();
            expect((await h.state()).receiveLevels).toBe("3");
            expect(await h.counter("long_3th_week2_score_count")).toBe("30");
            const items = await h.db.db.select().from(user_item);
            expect(await h.claim(3, id)).toEqual(first);
            expect(await h.db.db.select().from(user_item)).toEqual(items);
            await expect(h.claim(3)).rejects.toThrow();
            for (const level of [1, 5, 2])
            {
                await h.claim(level);
            }
            const complete = await h.claim(4);
            expect(complete.body.activity?.type).toBe(18);
            expect((await h.state()).receiveLevels).toBe("");
            expect((await h.state()).level).toBe(0);
            expect((await h.state()).updateTime).toBe(original.updateTime);
            expect(await h.balance()).toBe(
                100000 - config.gears.reduce((sum, gear) => sum + gear[0]!.count, 0),
            );
            expect(await h.counter("long_3th_week2_score_count")).toBe("120");
            expect(await h.counter("long_kingwar_testitem_sent_2")).toBe("5");
            expect(await h.counter("long_3th_anniversary_dragon_exchange_count")).toBe("5");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "manual token refresh consumes its graduated item costs only after free uses and replays without another draw or debit",
    async () => {
        const h = await fixture();
        try
        {
            await h.info();
            await h.fund();
            const original = await h.state();
            await h.flush();
            await h.flush();
            await h.flush();
            expect(await h.balance()).toBe(100000);
            const id = randomUUID(),
                first = await h.flush(id);
            expect(fields(first.body.item).count).toEqual(sfs.int(99995));
            expect(await h.flush(id)).toEqual(first);
            expect(await h.balance()).toBe(99995);
            await h.flush();
            expect(await h.balance()).toBe(99985);
            expect((await h.state()).updateTime).toBe(original.updateTime);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a saved UTC budget resets once even when the unchanged offer checkpoint remains on yesterday's date",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.power.activityPanels!.set("57209", {
                ...h.rules.power.activityPanels!.get("57209")!,
                refresh: "172800",
            });
            h.clock.now = Date.UTC(2024, 8, 15, 23, 59);
            await h.info();
            await h.fund();
            await h.flush();
            await h.flush();
            await h.flush();
            await h.flush();
            expect(await h.balance()).toBe(99995);
            h.clock.now = Date.UTC(2024, 8, 16, 0, 0, 1);
            await h.flush();
            await h.flush();
            await h.flush();
            await h.flush();
            expect(await h.balance()).toBe(99990);
            expect((await h.state()).flushTimes).toBe(4);
            expect((await h.state()).updateTime).toBe(BigInt(Date.UTC(2024, 8, 15, 23, 59)));
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "automatic refresh retains aligned deadlines and expired quotes cannot charge before a fresh projection",
    async () => {
        const h = await fixture();
        try
        {
            await h.info();
            await h.fund();
            const original = await h.state(),
                interval = h.config().interval;
            h.clock.now += Number(interval * 3n) + 1234;
            await expect(h.claim()).rejects.toThrow();
            expect(await h.balance()).toBe(100000);
            await h.info();
            expect((await h.state()).updateTime).toBe(original.updateTime + interval * 3n);
            await h.claim();
            expect(await h.balance()).toBeLessThan(100000);
            h.clock.now = Number((await h.state()).updateTime + interval - 10000n);
            const result = await h.flush();
            expect((await h.state()).updateTime).toBe(BigInt(h.clock.now));
            expect(fields(result.body.flush).refreshTime).toEqual(
                sfs.long(BigInt(h.clock.now) + interval),
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
    "a uniquely identified legacy shared list adopts its claims once while ambiguous lists remain untouched",
    async () => {
        const h = await fixture();
        try
        {
            await h.legacy("57209", "1");
            const original = await h.state(6);
            await h.info();
            expect((await h.state()).rewards).toBe(original.rewards);
            expect((await h.state()).receiveLevels).toBe("1");
            expect((await h.state(6)).reserve_2).toBe("monster-adopted:v1:57209");
            await h.fund();
            await expect(h.claim(1)).rejects.toThrow();
            await h.claim(2);
            expect((await h.state()).receiveLevels).toBe("1,2");
        }
        finally
        {
            await h.close();
        }
        const ambiguous = await fixture();
        try
        {
            ambiguous.enable("57171");
            ambiguous.enable("57180");
            await ambiguous.legacy("57171", "1");
            const original = await ambiguous.state(6);
            await ambiguous.info("57171|57180");
            expect(await ambiguous.state(6)).toEqual(original);
            expect((await ambiguous.state(57171)).receiveLevels).toBe("");
            expect((await ambiguous.state(57180)).receiveLevels).toBe("");
            expect(await ambiguous.db.db.select().from(user_item)).toHaveLength(0);
        }
        finally
        {
            await ambiguous.close();
        }
    },
    120000,
);
test(
    "a failed claim receipt rolls back tokens, rewards, completion flags and campaign points before retry",
    async () => {
        const h = await fixture();
        try
        {
            await h.info();
            await h.fund();
            const original = await h.state(),
                items = await h.db.db.select().from(user_item);
            await h.db.pool.query(
                `create function reject_token_receipt() returns trigger language plpgsql as $$ begin if new.command='act.ex.reward' then raise exception 'synthetic token claim failure'; end if; return new; end $$`,
            );
            await h.db.pool.query(
                `create trigger reject_token_receipt before insert on opencok_kingdom.command_receipt for each row execute function reject_token_receipt()`,
            );
            const id = randomUUID();
            await expect(h.claim(1, id)).rejects.toThrow();
            expect(await h.state()).toEqual(original);
            expect(await h.db.db.select().from(user_item)).toEqual(items);
            expect(await h.db.db.select().from(trigger_var)).toHaveLength(0);
            await h.db.pool.query(
                `drop trigger reject_token_receipt on opencok_kingdom.command_receipt`,
            );
            await h.claim(1, id);
            expect(await h.counter("long_3th_week2_score_count")).toBe("30");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "two token panels keep independent offers, tokens and claim flags despite their shared legacy category",
    async () => {
        const h = await fixture();
        try
        {
            h.enable("57170");
            await h.info("57209|57170");
            await h.fund();
            await h.fund(100000, "211659");
            await h.claim(1, randomUUID(), "57170");
            expect(await h.balance()).toBe(100000);
            expect(await h.balance("211659")).toBe(100000 - h.config("57170").gears[0]![0]!.count);
            expect((await h.state()).receiveLevels).toBe("");
            expect((await h.state(57170)).receiveLevels).toBe("1");
            await h.claim();
            expect((await h.state()).receiveLevels).toBe("1");
            expect(await h.balance()).toBe(98750);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "invalid selected reward metadata cannot consume paid refresh tokens and a colliding owned activity slot is preserved",
    async () => {
        const h = await fixture();
        try
        {
            await h.info();
            await h.fund();
            await h.flush();
            await h.flush();
            await h.flush();
            const original = await h.state(),
                config = h.rules.power.activityPanels!.get("57209")!;
            h.rules.power.activityPanels!.set("57209", { ...config, gear1: "24701201;1;1000;0" });
            const id = randomUUID();
            await expect(h.flush(id)).rejects.toThrow();
            expect(await h.state()).toEqual(original);
            expect(await h.balance()).toBe(100000);
            h.rules.power.activityPanels!.set("57209", config);
            await h.flush(id);
            expect(await h.balance()).toBe(99995);
            await h.db.db
                .update(user_activity_new)
                .set({ reserve_1: 0, reserve_2: "foreign-domain" })
                .where(eq(user_activity_new.actId, 57209));
            const foreign = await h.state();
            await expect(h.info()).rejects.toThrow();
            expect(await h.state()).toEqual(foreign);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a pending list retains its saved token binding until the original deadline admits the replacement configuration",
    async () => {
        const h = await fixture();
        try
        {
            await h.info();
            await h.fund();
            const original = await h.state(),
                interval = h.config().interval;
            h.rules.power.activityPanels!.set("57209", {
                ...h.rules.power.activityPanels!.get("57209")!,
                exchange_id: "211659",
            });
            await expect(h.claim()).rejects.toThrow();
            await expect(h.info()).rejects.toThrow();
            await expect(h.flush()).rejects.toThrow();
            expect(await h.state()).toEqual(original);
            expect(await h.balance()).toBe(100000);
            h.clock.now += Number(interval);
            await h.info();
            await h.fund(100000, "211659");
            await h.claim();
            expect(await h.balance()).toBe(100000);
            expect(await h.balance("211659")).toBe(98750);
            expect((await h.state()).reserve_2).toContain(":211659:");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
