import { planRealmProductionContext } from "../src/composition/production.ts";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { createRealmCityProgressionHandlers } from "../src/composition/city.ts";
import { createCityProgressionStore } from "@opencok/repositories/city-progression";
import { createCityProductionBoundary } from "@opencok/production/repositories/city-boundary";
import { readReconnectProgress } from "@opencok/repositories/reconnect-progress";
import { persistReconnectProgress } from "@opencok/repositories/reconnect-write";
import { num, text } from "@opencok/contracts/rows";
import { test, expect } from "bun:test";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { cityHarness } from "./support/city";
import {
    troubleDomain,
    deliverWorldTroubles,
    publishTroubleMutation,
} from "@opencok/services/trouble";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createActivityExecutor, type ActivityDomain } from "@opencok/repositories/timed-activity";
import { TimedActivityService } from "@opencok/services/timed-activity";
import { troubleRemovalGold } from "@opencok/rules/trouble";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { trouble_log } from "@opencok/drizzle/schema/opencok_kingdom/trouble_log";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
async function fixture()
{
    const h = await cityHarness([troubleDomain, createWorldMarchDomain(1200)]);
    h.rules.features.set("world_march", {
        id: "world_march",
        online: "all",
        test: "all",
        version: "1.0.0",
    });
    for (
        const [uid, point] of [
            ["owner", 1],
            ["other", 10],
        ] as const
    )
    {
        await h.db.db
            .insert(user_world)
            .values({ uid, pointId: point, worldId: 0, lastCityDefTime: 0n });
        for (const id of [point, point + 1, point + 1200, point + 1201])
        {
            await h.db.db.insert(worldpoint).values({
                id,
                worldId: 0,
                x: (id - 1) % 1200,
                y: Math.floor((id - 1) / 1200),
                areaId: 0,
                gridType: 2,
                grid2Type: 0,
                pointType: id === point ? 1 : 2,
                resLevel: 1,
                resInitValue: 0,
                ownerId: uid,
            });
        }
    }
    await h.db.db.insert(user_item).values([
        { uuid: "trouble", ownerId: "owner", itemId: "210097", count: 2, value: 0 },
        { uuid: "foreign", ownerId: "other", itemId: "210097", count: 2, value: 0 },
        { uuid: "ordinary", ownerId: "owner", itemId: "200001", count: 1, value: 0 },
        { uuid: "speed", ownerId: "owner", itemId: "200220", count: 2, value: 0 },
        { uuid: "recall", ownerId: "owner", itemId: "200004", count: 2, value: 0 },
    ]);
    const start = (operationId = randomUUID(), item = "trouble", command = "world.march") =>
        h.command(command, {
            operationId: sfs.string(operationId),
            point: sfs.int(10),
            type: sfs.int(13),
            itemUuid: sfs.string(item),
        });
    const arrivals = () =>
        h.db.db.select().from(mutation_outbox).where(eq(mutation_outbox.eventType, "world.tick"));
    const deliver = (owner: string, params: Fields) => h.command("trouble.deliver", params, owner);
    return { ...h, start, arrivals, deliver };
}
test(
    "trouble departures consume the exact owned item once without reserving troops and reject invalid items",
    async () => {
        const h = await fixture();
        try
        {
            await expect(h.start(randomUUID(), "foreign")).rejects.toThrow();
            await expect(h.start(randomUUID(), "ordinary")).rejects.toThrow();
            await h.start(randomUUID(), "trouble", "world.march.check");
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "trouble")))[0]!
                    .count,
            ).toBe(2);
            const id = randomUUID();
            const replies = await Promise.all(Array.from({ length: 3 }, () => h.start(id)));
            expect(new Set(replies.map((row) => row.body.uuid!.value)).size).toBe(1);
            const [march] = await h.db.db.select().from(world_march);
            expect(march).toMatchObject({ type: 13, targetType: 1, targetUid: "other" });
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "trouble")))[0]!
                    .count,
            ).toBe(1);
            const [outbox] = await h.db.db
                .select()
                .from(mutation_outbox)
                .where(eq(mutation_outbox.eventType, "world.march"));
            const pushed: { owner: string; command: string; body: Fields; }[] = [];
            await publishWorldMutation(
                outbox!.payload,
                "world.march",
                1,
                async () => ["owner", "near"],
                async (owner, command, body) => {
                    pushed.push({ owner, command, body });
                },
            );
            expect(pushed.filter((row) => row.command === "push.item.del")).toEqual([
                {
                    owner: "owner",
                    command: "push.item.del",
                    body: {
                        uuid: sfs.string("trouble"),
                        itemId: sfs.string("210097"),
                        count: sfs.int(1),
                    },
                },
            ]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "a recovered arrival returns its march and delivers one durable target effect despite replay and authority replacement",
    async () => {
        const h = await fixture();
        try
        {
            await h.start();
            const [checkpoint] = await h.db.db.select().from(world_march_checkpoint);
            h.clock.now = Number(checkpoint!.dueAt) + 1000000;
            await h.command("world.tick", {});
            expect(await h.db.db.select().from(world_march)).toHaveLength(0);
            expect((await h.db.db.select().from(world_march_checkpoint))[0]!.status).toBe(1);
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            const [event] = await h.arrivals();
            const authority = await acquireRealmAuthority(h.db.db, 1, () => true);
            const boundary = createCityProductionBoundary(
                {
                    async prepare(tx, owner, at)
                    {
                        const snapshot = await readReconnectProgress(tx, owner, 1, at);
                        const plan = await planRealmProductionContext(snapshot, h.rules, at, {
                            worldPowerEffects: async () => new Map<string, string>(),
                            emperorVersion: async () => null,
                        });
                        await persistReconnectProgress(tx, snapshot, plan.write, authority, at);
                        return plan.rates;
                    },
                },
                (row) => {
                    const rule = h.rules.building(
                        text(row, "itemId"),
                        num(row, "level"),
                        num(row, "star"),
                        num(row, "progress"),
                    );
                    return rule.effects?.productionPerHour === undefined
                        ? undefined
                        : [
                            "wood",
                            "stone",
                            "iron",
                            "food",
                        ][rule.effects.productionResourceId ?? -1];
                },
            );
            const handlers = createRealmCityProgressionHandlers(
                (tx: Parameters<typeof readReconnectProgress>[0], owner, at) =>
                    createCityProgressionStore(tx, owner, at, boundary),
                [troubleDomain],
                h.rules,
                h.effects,
            );
            const service = new TimedActivityService(
                createActivityExecutor(
                    h.db.db,
                    authority,
                    handlers.domains as ReadonlyMap<number, ActivityDomain>,
                    () => h.clock.now,
                    { command: handlers.command },
                ),
                h.rules,
                h.effects,
            );
            const deliver = (owner: string, params: Fields) =>
                service.domainCommand(owner, "trouble.deliver", params);
            const arrivalAt = h.clock.now;
            h.clock.now += 10000;
            await expect(h.command("trouble.deliver", {}, "other")).rejects.toThrow();
            await Promise.all(
                Array.from({ length: 3 }, () => deliverWorldTroubles(event!.payload, deliver)),
            );
            const [state] = await h.db.db.select().from(user_state);
            expect(state).toMatchObject({
                uid: "other",
                stateId: 500586,
                endTime: BigInt(arrivalAt + 300000),
            });
            expect(await h.db.db.select().from(trouble_log)).toHaveLength(1);
            await deliverWorldTroubles(event!.payload, deliver);
            expect(await h.db.db.select().from(trouble_log)).toHaveLength(1);
            expect((await h.db.db.select().from(user_state))[0]!.endTime).toBe(state!.endTime);
            const [notification] = await h.db.db
                .select()
                .from(mutation_outbox)
                .where(eq(mutation_outbox.eventType, "trouble.deliver"));
            const pushed: { owner: string; command: string; body: Fields; }[] = [];
            await publishTroubleMutation(
                notification!.payload,
                "trouble.deliver",
                async () => ["owner", "other", "near"],
                async (owner, command, body) => {
                    pushed.push({ owner, command, body });
                },
            );
            expect(pushed.map((row) => row.owner)).toEqual(["other", "owner", "near"]);
            expect(pushed[0]!.body).toMatchObject({
                statusId: sfs.int(500586),
                endTime: sfs.long(state!.endTime),
                username: sfs.string("Synthetic"),
                useItemId: sfs.string("210097"),
                targetUserId: sfs.string("other"),
                cityIndex: sfs.int(10),
            });
            expect(pushed.every((row) => row.command === "push.trouble.avatar")).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test("recalled and moved-target trouble marches never apply an effect", async () => {
    const h = await fixture();
    try
    {
        const first = await h.start();
        h.clock.now += 1000;
        await h.command("world.march.retreat", { uuid: first.body.uuid! });
        h.clock.now += 1000000;
        await h.command("world.tick", {});
        const second = await h.start();
        expect(second.body.uuid).toBeDefined();
        await h.db.db.update(worldpoint).set({ ownerId: "new-owner" }).where(eq(worldpoint.id, 10));
        h.clock.now += 1000000;
        await h.command("world.tick", {});
        for (const row of await h.arrivals())
        {
            await deliverWorldTroubles(row.payload, h.deliver);
        }
        expect(await h.db.db.select().from(user_state)).toHaveLength(0);
        expect(await h.db.db.select().from(trouble_log)).toHaveLength(0);
    }
    finally
    {
        await h.close();
    }
}, 120000);
test(
    "trouble history retains ten structured records and paid removal rolls back on receipt failure",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_trouble_delivery() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_trouble_delivery BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_trouble_delivery()`,
            );
            await expect(
                h.deliver("other", {
                    item: sfs.string("210097"),
                    sender: sfs.string("owner"),
                    username: sfs.string("Synthetic"),
                    at: sfs.long(BigInt(h.clock.now)),
                }),
            ).rejects.toThrow();
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            expect(await h.db.db.select().from(trouble_log)).toHaveLength(0);
            expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_trouble_delivery ON opencok_kingdom.command_receipt`,
            );
            for (let n = 0; n < 12; n++)
            {
                await h.deliver("other", {
                    item: sfs.string("210097"),
                    sender: sfs.string("owner"),
                    username: sfs.string(`Sender, ${n}`),
                    at: sfs.long(BigInt(h.clock.now)),
                });
            }
            expect(await h.db.db.select().from(trouble_log)).toHaveLength(10);
            const response = await h.command("get.trouble.list", {}, "other"),
                rows = response.body.array!.value as Value[];
            expect(rows).toHaveLength(10);
            expect(Object.keys(rows[0]!.value as Fields)).toEqual([
                "stateid",
                "username",
                "usetime",
                "itemid",
            ]);
            expect((rows[0]!.value as Fields).username).toEqual(sfs.string("Sender, 11"));
            expect((rows[9]!.value as Fields).username).toEqual(sfs.string("Sender, 2"));
            const [state] = await h.db.db.select().from(user_state),
                cost = troubleRemovalGold(h.rules, state!.endTime, BigInt(h.clock.now));
            await h.db.db
                .update(userprofile)
                .set({ gold: 0n, paidGold: 0n })
                .where(eq(userprofile.uid, "other"));
            await expect(h.command("trouble.speed", {}, "other")).rejects.toThrow();
            expect(await h.db.db.select().from(user_state)).toHaveLength(1);
            await h.db.db.update(userprofile).set({ gold: 100000n }).where(
                eq(userprofile.uid, "other"),
            );
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_trouble_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_trouble_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_trouble_receipt()`,
            );
            await expect(h.command("trouble.speed", {}, "other")).rejects.toThrow();
            expect(await h.db.db.select().from(user_state)).toHaveLength(1);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "other")))[0]!
                    .gold,
            ).toBe(100000n);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_trouble_receipt ON opencok_kingdom.command_receipt`,
            );
            const operationId = sfs.string(randomUUID());
            const replies = await Promise.all(
                Array.from(
                    { length: 3 },
                    () => h.command("trouble.speed", { operationId }, "other"),
                ),
            );
            expect(replies[0]!.body).toMatchObject({
                remainGold: sfs.long(100000n - cost),
                statusid: sfs.int(500586),
            });
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            await expect(h.command("trouble.speed", {}, "other")).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "trouble history migration retains old numeric owners, null owners and duplicate rows",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.execute(sql`DROP TABLE opencok_kingdom.trouble_log`);
            await h.db.db.execute(
                sql`CREATE TABLE opencok_kingdom.trouble_log(uid bigint, username varchar(255), usetime bigint, statusid varchar(255))`,
            );
            await h.db.db.execute(
                sql`CREATE INDEX trouble_log_trouble_log_uid_index ON opencok_kingdom.trouble_log(uid)`,
            );
            await h.db.db.execute(
                sql`INSERT INTO opencok_kingdom.trouble_log VALUES (9007199254740993,'Synthetic',1,'500586'),(9007199254740993,'Synthetic',1,'500586'),(null,null,null,null)`,
            );
            const migration = await readFile(
                new URL(
                    "../../../packages/drizzle/migrations/kingdom/0028_trouble_history.sql",
                    import.meta.url,
                ),
                "utf8",
            );
            await h.db.db.execute(sql.raw(migration));
            const rows = await h.db.db.select().from(trouble_log);
            expect(rows).toHaveLength(3);
            expect(rows.filter((row) => row.uid === "9007199254740993")).toHaveLength(2);
            expect(new Set(rows.map((row) => row.id)).size).toBe(3);
            expect(rows.every((row) => row.itemid === "")).toBe(true);
            expect(rows.some((row) => row.uid === null)).toBe(true);
            await h.db.db
                .insert(trouble_log)
                .values({
                    uid: "0123456789abcdef0123456789abcdef",
                    username: "New",
                    itemid: "210097",
                });
            expect(await h.db.db.select().from(trouble_log)).toHaveLength(4);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "trouble marches use actual glory watchtower speed and black-ground scout speed outside black land",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db
                .update(userprofile)
                .set({ appVersion: "12.06.0" })
                .where(eq(userprofile.uid, "owner"));
            await h.db.db.insert(user_building).values({
                uuid: "owner-watchtower",
                uid: "owner",
                itemId: 417000,
                pos: 13,
                level: 30,
                star: 5,
                progress: 0,
            });
            h.effects.world = async () => new Map([[402, 100]]);
            const reply = await h.start();
            expect(reply.body.mt).toEqual(sfs.int(5000));
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "trouble")))[0]!
                    .count,
            ).toBe(1);
            expect((await h.db.db.select().from(world_march))[0]!.type).toBe(13);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
