import { worldCosmeticKinds } from "@opencok/skins/enums/kind";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq, sql } from "drizzle-orm";
import { anniversaryDomain } from "@opencok/services/anniversary";
import {
    cosmeticInteractionParticipants,
    publishCosmeticInteractionMutation,
} from "../src/composition/skins";
import { Database } from "@opencok/repositories/game";
import { createRealmWorldService } from "../src/composition/world";
import { readWorldMap } from "@opencok/world/repositories/map";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { avatar_storage } from "@opencok/drizzle/schema/opencok_kingdom/avatar_storage";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
async function fixture()
{
    const h = await cityHarness([anniversaryDomain], false, cosmeticInteractionParticipants);
    h.clock.now = Date.UTC(2024, 8, 5, 12);
    for (
        const [uid, point] of [
            ["owner", 1],
            ["other", 4],
        ] as const
    )
    {
        await h.db.db
            .insert(user_world)
            .values({ uid, pointId: point, worldId: 0, lastCityDefTime: 0n });
        await h.db.db.insert(worldpoint).values({
            id: point,
            worldId: 0,
            x: point - 1,
            y: 0,
            areaId: 0,
            gridType: 2,
            grid2Type: 0,
            pointType: 1,
            resLevel: 1,
            resInitValue: 0,
            ownerId: uid,
        });
        await h.db.db
            .insert(user_item)
            .values({ uuid: `${uid}-cakes`, ownerId: uid, itemId: "212024", count: 3, value: 0 });
    }
    const url = new URL(`postgres://127.0.0.1:${h.connection.port}/postgres`);
    url.username = String(h.connection.user);
    url.password = String(h.connection.password);
    const adapter = new Database({
        kingdomId: 1,
        kingdomDatabase: "city",
        globalDatabase: "unused_cosmetic_global",
        databaseUrl: url.href,
        timeoutMs: 5000,
    });
    const world = createRealmWorldService(
        {
            getWorldByPointIds: (uid, ids) =>
                readWorldMap(adapter.kingdom.db, uid, ids, worldCosmeticKinds),
        },
        1200,
        1,
        {
            rules: h.rules,
            now: () => h.clock.now,
            subscribe: async () => {},
            marches: async () => [],
        },
    );
    const map = async () => {
        const reply = await world.get("owner", {
            x: sfs.int(3),
            y: sfs.int(0),
            type: sfs.int(1),
            timeStamp: sfs.int(1),
        });
        const section = (reply.points!.value as Value[])[0]!;
        return JSON.parse(String(section.value))[0]!;
    };
    const send = (owner = "owner", target = "other", operationId = randomUUID()) =>
        h.command(
            "trigger.activity",
            { type: sfs.int(45), uid: sfs.string(target), operationId: sfs.string(operationId) },
            owner,
        );
    const stock = async (uid: string) =>
        (await h.db.db.select().from(user_item).where(eq(user_item.ownerId, uid)))[0]!.count;
    return {
        ...h,
        adapter,
        map,
        send,
        stock,
        async close()
        {
            await adapter.close();
            await h.close();
        },
    };
}
test(
    "cake interactions update the selected player atomically and survive opposing concurrent sends",
    async () => {
        const h = await fixture();
        try
        {
            const receipt = randomUUID();
            await Promise.all(Array.from({ length: 3 }, () => h.send("owner", "other", receipt)));
            expect(await h.stock("owner")).toBe(2);
            expect(
                (await h.db.db.select().from(user_state).where(eq(user_state.uid, "other"))).find(
                    (row) => row.stateId === 509877,
                ),
            ).toMatchObject({ count: 1, endTime: BigInt(Date.UTC(2024, 8, 19, 12)) });
            expect(await h.db.db.select().from(user_state).where(eq(user_state.uid, "owner")))
                .toHaveLength(
                    0,
                );
            await Promise.all([h.send("owner", "other"), h.send("other", "owner")]);
            const states = await h.db.db.select().from(user_state);
            expect(states.find((row) => row.uid === "other" && row.stateId === 509877)!.count).toBe(
                2,
            );
            expect(states.find((row) => row.uid === "owner" && row.stateId === 509877)!.count).toBe(
                1,
            );
            expect(await h.stock("owner")).toBe(1);
            expect(await h.stock("other")).toBe(2);
            expect(
                await h.db.db.select().from(avatar_storage).where(eq(avatar_storage.uid, "other")),
            ).toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "missing, foreign-realm and unsupported effect targets reject without charging the sender",
    async () => {
        const h = await fixture();
        try
        {
            await expect(h.send("owner", "missing")).rejects.toThrow();
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "other"),
            );
            await expect(h.send()).rejects.toThrow();
            await h.db.db.update(userprofile).set({ serverId: 1 }).where(
                eq(userprofile.uid, "other"),
            );
            const rule = h.rules.power.statuses!.get("509876")!;
            h.rules.power.statuses!.set("509876", { ...rule, effect: "101;100" });
            await expect(h.send()).rejects.toThrow();
            expect(await h.stock("owner")).toBe(3);
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            expect(await h.db.db.select().from(avatar_storage)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "receipt failure restores both accounts, stored cosmetics and the notification outbox",
    async () => {
        const h = await fixture();
        try
        {
            await h.db.db.execute(
                sql`CREATE FUNCTION opencok_kingdom.reject_cosmetic_receipt() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$`,
            );
            await h.db.db.execute(
                sql`CREATE TRIGGER reject_cosmetic_receipt BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_cosmetic_receipt()`,
            );
            await expect(h.send()).rejects.toThrow();
            expect(await h.stock("owner")).toBe(3);
            expect(await h.db.db.select().from(user_state)).toHaveLength(0);
            expect(await h.db.db.select().from(avatar_storage)).toHaveLength(0);
            expect(await h.db.db.select().from(mutation_outbox)).toHaveLength(0);
            await h.db.db.execute(
                sql`DROP TRIGGER reject_cosmetic_receipt ON opencok_kingdom.command_receipt`,
            );
            await h.send();
            expect(await h.stock("owner")).toBe(2);
            expect(await h.db.db.select().from(user_state)).toHaveLength(2);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "owned map projections retain permanent catalog skins, timed bubbles and target-only database selection",
    async () => {
        const h = await fixture();
        try
        {
            await h.send();
            await h.db.db.update(user_state).set({ count: 49 }).where(
                eq(user_state.stateId, 509877),
            );
            await h.send();
            const point = await h.map();
            expect(point.overlap).toEqual({
                sid: 509877,
                set: Date.UTC(2024, 8, 19, 12) / 1000,
                count: 50,
            });
            expect(point.bubble).toEqual({
                sid: 509876,
                set: Date.UTC(2024, 8, 5, 12, 0, 5) / 1000,
            });
            expect(point.sid).toBe(509878);
            expect(point.set).toBe(2147000000);
            expect(
                (await h.db.db.select().from(user_state).where(eq(user_state.stateId, 509878)))[0]!
                    .endTime,
            ).toBe(9223372036854775807n);
            const snapshot = await readWorldMap(
                h.adapter.kingdom.db,
                "owner",
                [4],
                worldCosmeticKinds,
            );
            expect(snapshot.cosmetics.every((row) => row.uid === "other")).toBe(true);
            h.clock.now += 6000;
            expect((await h.map()).bubble).toBeUndefined();
            h.clock.now = Date.UTC(2024, 8, 5, 13, 0, 1);
            expect((await h.map()).sid).toBe(509878);
            expect((await h.map()).overlap.count).toBe(50);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "committed cosmetic notifications reach the recipient and nearby observers with no private status disclosure",
    async () => {
        const h = await fixture();
        try
        {
            await h.send();
            const [event] = await h.db.db
                .select()
                .from(mutation_outbox)
                .where(eq(mutation_outbox.eventType, "trigger.activity"));
            expect(event).toBeDefined();
            const delivered: { uid: string; command: string; body: Fields; }[] = [];
            await publishCosmeticInteractionMutation(
                event!.payload,
                async () => ["owner", "other", "near"],
                async (uid, command, body) => {
                    delivered.push({ uid, command, body });
                },
            );
            expect(
                delivered.filter((row) => row.command === "status.push").every((row) =>
                    row.uid === "other"
                ),
            ).toBe(true);
            expect(delivered.filter((row) => row.uid === "near").map((row) => row.command)).toEqual(
                [
                    "push.overlap.status",
                    "push.bubble.status",
                ],
            );
            expect(delivered.some((row) => row.uid === "far")).toBe(false);
            const overlap = delivered.find(
                (row) => row.uid === "near" && row.command === "push.overlap.status",
            )!;
            expect(Object.keys(overlap.body)).toEqual(["overlap", "uid", "worldpointid"]);
            expect(overlap.body.uid).toEqual(sfs.string("other"));
            expect(overlap.body.worldpointid).toEqual(sfs.int(4));
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "world map reload includes independently active wings, aura, effects, nameplate and frame",
    async () => {
        const h = await fixture();
        try
        {
            for (
                const [type, field] of [[104, "npavatar"], [108, "castleEffect"], [109, "wings"], [
                    115,
                    "avatarframe",
                ], [116, "aura"]] as const
            )
            {
                const rule = [...h.rules.power.statuses!.values()].find((entry) =>
                    Number(entry.type2) === type
                )!;
                expect(rule).toBeDefined();
                await h.db.db.insert(user_state).values({
                    uid: "other",
                    stateId: Number(rule.id),
                    type2: type,
                    startTime: BigInt(h.clock.now),
                    endTime: BigInt(h.clock.now + 60000),
                    count: 1,
                });
                expect((await h.map())[field]).toEqual({
                    sid: Number(rule.id),
                    set: (h.clock.now + 60000) / 1000,
                });
            }
            const reloaded = await readWorldMap(
                h.adapter.kingdom.db,
                "owner",
                [4],
                worldCosmeticKinds,
            );
            expect(reloaded.cosmetics.map((row) => row.type2).sort()).toEqual([
                104,
                108,
                109,
                115,
                116,
            ]);
            h.clock.now += 60001;
            expect((await h.map()).wings).toBeUndefined();
            expect((await h.map()).aura).toBeUndefined();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
