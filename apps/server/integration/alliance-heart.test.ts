import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import {
    createRealmAllianceHeartDomain,
    publishAllianceHeartMutation,
    pendingAllianceHeartOwners,
} from "../src/composition/alliance-heart";
import { receive_heart } from "@opencok/drizzle/schema/opencok_kingdom/receive_heart";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { alliance_member } from "@opencok/drizzle/schema/opencok_kingdom/alliance_member";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { compactPoint } from "@opencok/services/world";
import { cityHarness } from "./support/city";
async function fixture(online = false)
{
    const h = await cityHarness([createRealmAllianceHeartDomain(() => online)]);
    await h.db.db.insert(user_item).values([
        { uuid: "heart-first", ownerId: "owner", itemId: "209818", count: 3, value: 0 },
        { uuid: "heart-selected", ownerId: "owner", itemId: "209818", count: 3, value: 0 },
    ]);
    for (
        const [uid, id] of [
            ["owner", 1],
            ["other", 4],
        ] as const
    )
    {
        await h.db.db
            .insert(alliance_member)
            .values({ uid, allianceId: "synthetic-alliance", rank: 1 });
        await h.db.db.insert(user_world).values({
            uid,
            pointId: id,
            worldId: 0,
            lastCityDefTime: 0n,
        });
        await h.db.db.insert(worldpoint).values({
            id,
            worldId: 0,
            x: id - 1,
            y: 0,
            areaId: 0,
            gridType: 2,
            grid2Type: 0,
            pointType: 1,
            resLevel: 1,
            resInitValue: 0,
            ownerId: uid,
        });
    }
    return {
        ...h,
        send: (params: Fields = {}) =>
            h.command("heart.send", {
                uid: sfs.string("other"),
                itemId: sfs.string("209818"),
                uuid: sfs.string("heart-selected"),
                ...params,
            }),
        count: async (uuid = "heart-selected") =>
            (await h.db.db.select().from(user_item).where(eq(user_item.uuid, uuid)))[0]!.count,
    };
}
test(
    "allied heart sends consume the exact UUID once and persist both city effects with the offline queue",
    async () => {
        const h = await fixture();
        try
        {
            const request = { operationId: sfs.string(randomUUID()), duration: sfs.int(99999) };
            const replies = await Promise.all(Array.from({ length: 4 }, () => h.send(request)));
            expect(
                replies.every(
                    (row) =>
                        row.body.worldpoint?.type === Type.String
                        && row.body.worldpoint.value === "4",
                ),
            ).toBe(true);
            expect(await h.count()).toBe(2);
            expect(await h.count("heart-first")).toBe(3);
            const cities = await h.db.db.select().from(worldpoint);
            expect(
                cities.every((row) => row.sendHeartDurationTime === 1060n && row.heartType === "1"),
            ).toBe(true);
            expect(JSON.parse(compactPoint(cities[0]!)).sendHeartDurationTime).toBe(1060);
            expect(await h.db.db.select().from(receive_heart)).toHaveLength(1);
            expect(await pendingAllianceHeartOwners(h.db.db, ["owner"])).toEqual([]);
            expect(await pendingAllianceHeartOwners(h.db.db, ["other"])).toEqual(["other"]);
            h.clock.now += 120000;
            const receipt = { operationId: sfs.string(randomUUID()) };
            const deliveries = await Promise.all(
                Array.from({ length: 3 }, () => h.command("heart.init", receipt, "other")),
            );
            expect(deliveries[0]!.body.heart_allsender).toEqual(sfs.string("Synthetic"));
            expect(deliveries[0]!.body.heart_effecttype).toEqual(sfs.string("1"));
            expect(deliveries[0]!.body.heart_time).toEqual(sfs.long(1180000n));
            expect(await h.db.db.select().from(receive_heart)).toHaveLength(0);
            expect((await h.command("heart.init", {}, "other")).body).toMatchObject({
                heart_allsender: sfs.string("-1"),
                heart_effecttype: sfs.string("-1"),
                heart_time: sfs.long(0n),
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
    "heart sends reject foreign alliance, unowned UUID, wrong goods and invalid target before charging",
    async () => {
        const h = await fixture();
        try
        {
            await expect(h.send({ uuid: sfs.string("missing") })).rejects.toThrow();
            await expect(h.send({ itemId: sfs.string("210059") })).rejects.toThrow();
            await h.db.db
                .update(alliance_member)
                .set({ allianceId: "foreign" })
                .where(eq(alliance_member.uid, "other"));
            await expect(h.send()).rejects.toMatchObject({ code: "152027" });
            expect(await h.count()).toBe(3);
            expect(await h.db.db.select().from(receive_heart)).toHaveLength(0);
            expect(
                (await h.db.db.select().from(worldpoint)).every((row) =>
                    row.sendHeartDurationTime === 0n
                ),
            ).toBe(true);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test("receipt failure rolls back heart costs, map effects and queue acknowledgments", async () => {
    const h = await fixture();
    try
    {
        await h.db.db.execute(
            sql`CREATE FUNCTION opencok_kingdom.reject_heart_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic receipt failure'; END $$`,
        );
        const reject = () =>
            h.db.db.execute(
                sql`CREATE TRIGGER reject_heart_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_heart_receipt()`,
            );
        const allow = () =>
            h.db.db.execute(
                sql`DROP TRIGGER reject_heart_receipt ON opencok_kingdom.command_receipt`,
            );
        await reject();
        await expect(h.send()).rejects.toThrow();
        expect(await h.count()).toBe(3);
        expect(await h.db.db.select().from(receive_heart)).toHaveLength(0);
        expect(
            (await h.db.db.select().from(worldpoint)).every((row) =>
                row.sendHeartDurationTime === 0n
            ),
        ).toBe(true);
        await allow();
        await h.send();
        await reject();
        await expect(h.command("heart.init", {}, "other")).rejects.toThrow();
        expect(await h.db.db.select().from(receive_heart)).toHaveLength(1);
        await allow();
        await h.command("heart.init", {}, "other");
        expect(await h.db.db.select().from(receive_heart)).toHaveLength(0);
    }
    finally
    {
        await h.close();
    }
}, 120000);
test(
    "online heart outbox sends private UTF fields and map observers without duplicate target effects",
    async () => {
        const h = await fixture(true);
        try
        {
            await h.send();
            expect(await h.db.db.select().from(receive_heart)).toHaveLength(0);
            const events = await h.db.db
                .select()
                .from(mutation_outbox)
                .where(eq(mutation_outbox.eventType, "heart.send"));
            expect(events).toHaveLength(1);
            const pushes: { uid: string; body: Fields; }[] = [];
            await publishAllianceHeartMutation(
                events[0]!.payload,
                async () => ["owner", "other", "near"],
                async (uid, command, body) => {
                    expect(command).toBe("push.heart.having");
                    pushes.push({ uid, body });
                },
            );
            const direct = pushes.filter((push) =>
                push.uid === "other" && push.body.point?.value === "4"
            );
            expect(direct).toHaveLength(1);
            expect(direct[0]!.body).toEqual({
                point: sfs.string("4"),
                effecttype: sfs.string("1"),
                time: sfs.string("1060000"),
                name: sfs.string("Synthetic"),
                receiveuid: sfs.string("other"),
            });
            expect(pushes.filter((push) => push.uid === "near")).toHaveLength(2);
            expect(pushes.some((push) => push.uid === "far")).toBe(false);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "heart recovery drains selected batches and a missing recipient city keeps the sender-only reference behavior",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.insert(receive_heart).values(
                Array.from({ length: 65 }, () => ({
                    uid: "other",
                    senduid: "owner",
                    duration: 60,
                    effecttype: "1",
                })),
            );
            const result = await h.command("heart.init", { notify: sfs.bool(true) }, "other");
            expect(String(result.body.heart_allsender?.value).split(",")).toHaveLength(64);
            expect(await h.db.db.select().from(receive_heart)).toHaveLength(1);
            await h.command("heart.init", {}, "other");
            await h.db.db.delete(user_world).where(eq(user_world.uid, "other"));
            expect((await h.send()).body.worldpoint).toEqual(sfs.string("1"));
            expect(await h.db.db.select().from(receive_heart)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
