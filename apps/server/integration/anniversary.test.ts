import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, and } from "drizzle-orm";
import { anniversaryDomain } from "@opencok/services/anniversary";
import { questsDomain } from "@opencok/services/quests";
import { InventoryService } from "@opencok/services/inventory";
import { createInventoryExecutor } from "@opencok/repositories/inventory";
import { trigger_var } from "@opencok/drizzle/schema/opencok_kingdom/trigger_var";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { sfs, encode, fields, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function fixture()
{
    const h = await cityHarness([anniversaryDomain, questsDomain]);
    h.clock.now = Date.UTC(2017, 8, 5, 12);
    h.rules.goods.set("991003", {
        id: "991003",
        type: "3",
        para1: "101",
        para2: "10",
        useall: "1",
    });
    const claim = h.rules.advanced.campaignRules!.find((rule) => rule.id === 2207)!;
    h.rules.advanced.campaignRules = [
        {
            ...claim,
            conditions: [{ code: 9, parameters: "2017-09-04 02:00:00;2017-09-07 02:00:00" }],
        },
        {
            id: "synthetic-use",
            state: 2,
            openType: 2,
            events: [{ code: 54, parameters: "991003" }],
            conditions: [
                {
                    code: 7,
                    parameters: "$3th_anniversary_cake_count;<;$3th_anniversary_cake_count_max",
                },
            ],
            actions: [
                {
                    code: 21,
                    actions: [
                        { code: 9, parameters: "$3th_anniversary_cake_count;+;1" },
                        { code: 9, parameters: "$3th_week1_score_count;+;100" },
                    ],
                },
            ],
        },
    ];
    const inventory = new InventoryService(
        createInventoryExecutor(h.db.db, h.authority, () => h.clock.now, {
            before: async (tx, owner, at) => {
                await h.preparation.prepare(tx, owner, at);
            },
            recordAction: async (tx, owner, kind, itemId, count, at, economy) => {
                await h.handlers.command(
                    tx,
                    owner,
                    "quest.action",
                    encode({
                        kind: sfs.string(kind),
                        itemId: sfs.string(itemId),
                        count: sfs.int(count),
                    }),
                    at,
                    economy,
                );
            },
        }),
        h.rules,
        h.effects,
        () => h.clock.now,
    );
    await h.db.db.insert(user_item).values({
        uuid: "synthetic-cake",
        ownerId: "owner",
        itemId: "991003",
        count: 2,
        value: 0,
        vanishTime: 0n,
    });
    const command = (name: string, params: Fields = {}) =>
        h.command(name, { operationId: sfs.string(randomUUID()), ...params });
    const use = (operationId = sfs.string(randomUUID())) =>
        inventory.command("owner", "item.use", {
            uuid: sfs.string("synthetic-cake"),
            num: sfs.int(1),
            operationId,
        });
    return { ...h, command, use };
}

test(
    "anniversary scores come from committed item use and box claims replay without duplicated rewards",
    async () => {
        const h = await fixture();
        try
        {
            const before = await h.command("third.anniversary");
            expect(before.body.curr_week_id!.value).toBe(9055501);
            await expect(h.command("third.anniversary.reward", { boxIdx: sfs.int(1) })).rejects
                .toThrow();
            const id = sfs.string(randomUUID());
            await Promise.all(Array.from({ length: 4 }, () => h.use(id)));
            const variables = await h.db.db.select().from(trigger_var).where(
                eq(trigger_var.uid, "owner"),
            );
            expect(variables.find((row) => row.key === "long_3th_week1_score_count")?.value).toBe(
                "100",
            );
            expect(variables.find((row) => row.key === "long_3th_anniversary_cake_count")?.value)
                .toBe("1");
            expect(
                (await h.db.db.select().from(user_item).where(
                    eq(user_item.uuid, "synthetic-cake"),
                ))[0]!
                    .count,
            ).toBe(1);
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!
                    .woodbind,
            ).toBe(10n);
            const operationId = sfs.string(randomUUID());
            const responses = await Promise.all(
                Array.from(
                    { length: 4 },
                    () =>
                        h.command("third.anniversary.reward", { boxIdx: sfs.int(1), operationId }),
                ),
            );
            expect(responses.every((r) => r.body.success!.value === "1")).toBe(true);
            expect(
                responses[0]!.pushes.some(
                    (push) =>
                        push.command === "push.server.action"
                        && fields(push.body.params!).reward_list,
                ),
            ).toBe(true);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "211724")))[0]!
                    .count,
            ).toBe(20);
            await expect(h.command("third.anniversary.reward", { boxIdx: sfs.int(1) })).rejects
                .toThrow();
            const after = await h.command("third.anniversary");
            const first = (after.body.anniversary_array!.value as { value: Fields; }[])[0]!.value;
            expect(first.box_score!.value).toBe(100);
            expect((first.box_already_taken!.value as { value: number; }[])[0]!.value).toBe(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "anniversary validates owned counters, shared limits, exact end time and control versus trigger windows",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(trigger_var).values([
                {
                    type: 1,
                    uid: "other",
                    key: "long_3th_week1_score_count",
                    value: "9999",
                    refreshtime: 0n,
                },
                {
                    type: 2,
                    uid: "1",
                    key: "long_3th_anniversary_cake_count_max",
                    value: "1",
                    refreshtime: 0n,
                },
            ]);
            await h.use();
            await h.use();
            expect(
                (
                    await h.db.db
                        .select()
                        .from(trigger_var)
                        .where(
                            and(
                                eq(trigger_var.uid, "owner"),
                                eq(trigger_var.key, "long_3th_week1_score_count"),
                            ),
                        )
                )[0]!.value,
            ).toBe("100");
            const query = await h.command("get.activity.value", {
                keys: sfs.string(
                    "P$long_3th_anniversary_cake_count;S$long_3th_anniversary_cake_count_max",
                ),
            });
            expect(query.body.values!.value).toBe(
                "P$long_3th_anniversary_cake_count=1;S$long_3th_anniversary_cake_count_max=1",
            );
            await expect(
                h.command("get.activity.value", { keys: sfs.string("P$long_other_user_secret") }),
            ).rejects.toThrow();
            for (const index of [0, -1, 6])
            {
                await expect(
                    h.command("third.anniversary.reward", { boxIdx: sfs.int(index) }),
                ).rejects.toThrow();
            }
            h.rules.advanced.campaignRules = [];
            await expect(h.command("third.anniversary.reward", { boxIdx: sfs.int(1) })).rejects
                .toThrow();
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "211724")))
                    .length,
            ).toBe(0);
            h.clock.now = Date.UTC(2017, 8, 7, 2);
            await expect(h.command("third.anniversary.reward", { boxIdx: sfs.int(1) })).rejects
                .toThrow();
            expect((await h.command("third.anniversary")).body.curr_week_id!.value).toBe(9055502);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test("failed campaign actions roll back already planned rewards and claim flags", async () => {
    const h = await fixture();
    try
    {
        await h.use();
        const [claim] = h.rules.advanced.campaignRules!;
        h.rules.advanced.campaignRules = [
            { ...claim!, actions: [claim!.actions[0]!, { code: 99999 }] },
        ];
        await expect(h.command("third.anniversary.reward", { boxIdx: sfs.int(1) })).rejects
            .toThrow();
        expect(
            (await h.db.db.select().from(user_item).where(eq(user_item.itemId, "211724"))).length,
        ).toBe(0);
        expect(
            (
                await h.db.db
                    .select()
                    .from(trigger_var)
                    .where(
                        and(
                            eq(trigger_var.uid, "owner"),
                            eq(trigger_var.key, "long_3th_anniversary_week1_box_1_flag"),
                        ),
                    )
            ).length,
        ).toBe(0);
    }
    finally
    {
        await h.close();
    }
}, 120000);

test(
    "campaign variable pushes retain the native version, detail flag and string-valued projection",
    async () => {
        const h = await fixture();
        try
        {
            h.rules.advanced.campaignRules = [
                {
                    id: "synthetic-variable-view",
                    state: 2,
                    openType: 2,
                    events: [{ code: 8 }],
                    conditions: [],
                    actions: [{ code: 29, parameters: "$3th_anniversary_cake_count;1;claim|info" }],
                },
            ];
            const result = await h.command("campaign.init");
            const push = result.pushes.find((push) => push.command === "push.server.action")!;
            expect(push.body.type!.value).toBe(16);
            expect(fields(push.body.params!)).toEqual({
                version: sfs.string("0.2"),
                detail: sfs.bool(false),
                vars: sfs.object({ $3th_anniversary_cake_count: sfs.string("0") }),
                type: sfs.int(1),
                command: sfs.string("claim|info"),
            });
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "historical anniversary projections preserve long counters and resolve only the owned battle history",
    async () => {
        const h = await fixture();
        try
        {
            const { anniversary_userinfo } = await import(
                "@opencok/drizzle/schema/opencok_kingdom/anniversary_userinfo"
            );
            const { anniversary_allianceinfo } = await import(
                "@opencok/drizzle/schema/opencok_kingdom/anniversary_allianceinfo"
            );
            const { atk_time } = await import("@opencok/drizzle/schema/opencok_kingdom/atk_time");
            const { logrecord } = await import("@opencok/drizzle/schema/opencok_kingdom/logrecord");
            const { userprofile } = await import(
                "@opencok/drizzle/schema/opencok_kingdom/userprofile"
            );
            await h.db.db.insert(anniversary_userinfo).values({
                uid: "owner",
                regtop: 9007199254740993n,
                power: 9007199254740995n,
                powerpercent: 12.34,
                food: 9868000000n,
                wood: 9446600000n,
                train: 123n,
                armytype: 2,
                maxtrain: 100n,
                maxtrainpercent: 45.67,
                dead: 20,
                deadpercent: 34.5,
                kill: 50,
                killpercent: 78.9,
            });
            await h.db.db.insert(anniversary_allianceinfo).values({ allnum: 10, num: 4 });
            await h.db.db.insert(atk_time).values({ uid: "owner", time: 1234567890123n });
            await h.db.db.insert(logrecord).values([
                {
                    uid: "first-attack",
                    user: "synthetic-battle",
                    timeStamp: 1234567890123n,
                    category: 1,
                    data1: "owner",
                },
                {
                    uid: "first-target",
                    user: "synthetic-battle",
                    timeStamp: 1234567890124n,
                    category: 1,
                    param1: 2,
                    data1: "other",
                },
            ]);
            await h.db.db
                .update(userprofile)
                .set({ name: "Synthetic defender" })
                .where(eq(userprofile.uid, "other"));
            const result = await h.command("1year.info");
            expect(result.body.regTop).toEqual(sfs.long(9007199254740993n));
            expect(result.body.power).toEqual(sfs.long(9007199254740995n));
            expect(result.body.feedPeople).toEqual(sfs.long(4n));
            expect(result.body.cutTree).toEqual(sfs.long(2n));
            expect(result.body.powerPercent).toEqual(sfs.double(12.34));
            expect(result.body.killPercent).toEqual(sfs.string("78.90"));
            expect(result.body.atkName).toEqual(sfs.string("Synthetic defender"));
            expect(result.body.atkTime).toEqual(sfs.long(1234567890123n));
            expect(result.body.worldWarPercent).toEqual(sfs.int(0));
            expect(result.body.allianceNum).toEqual(sfs.int(4));
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "maintained historical campaign dates do not grant rewards or block current logins",
    async () => {
        const h = await cityHarness([anniversaryDomain]);
        try
        {
            h.clock.now = Date.UTC(2026, 9, 25, 12);
            await h.command("campaign.init", {});
            expect((await h.db.db.select().from(user_item)).length).toBe(0);
            expect((await h.db.db.select().from(trigger_var)).length).toBe(0);
            const result = await h.command("third.anniversary", {});
            expect(result.body.curr_week_id!.value).toBe(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
