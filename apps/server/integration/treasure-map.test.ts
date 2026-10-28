import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { treasure_map } from "@opencok/drizzle/schema/opencok_kingdom/treasure_map";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { createTreasureMapDomain } from "@opencok/services/treasure-map";
import { treasureMapCandidates } from "@opencok/rules/treasure-map";
import { sfs, Type, encode, decode, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function treasureHarness()
{
    const h = await cityHarness([createTreasureMapDomain(20)]);
    await h.db.db
        .insert(user_world)
        .values({ uid: "owner", pointId: 211, worldId: 0, lastCityDefTime: 0n });
    const ids = [211, ...treasureMapCandidates(211, 20, 5, 30)];
    await h.db.db.insert(worldpoint).values(
        ids.map((id) => ({
            id,
            worldId: 0,
            x: (id - 1) % 20,
            y: Math.floor((id - 1) / 20),
            areaId: 1,
            gridType: 2,
            grid2Type: 0,
            pointType: id === 211 ? 1 : 0,
            resLevel: 0,
            resInitValue: 0,
            ownerId: id === 211 ? "owner" : "",
        })),
    );
    await h.db.db
        .insert(user_item)
        .values({ uuid: "maps", ownerId: "owner", itemId: "200042", count: 2, value: 0 });
    return h;
}

test(
    "treasure map generation pins owned hints without consuming items and destroy consumes exactly one",
    async () => {
        const h = await treasureHarness();
        try
        {
            const request = { itemid: sfs.string("200042"), operationId: sfs.string(randomUUID()) };
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("treasuremap.get", request)),
            );
            const maps = await h.db.db.select().from(treasure_map);
            expect(maps).toHaveLength(2);
            expect(new Set(maps.map((row) => row.uuid)).size).toBe(2);
            const body = decode(encode(replies[0]!.body));
            const entries = body.treasureMap!.value as { value: Fields; }[];
            expect(entries).toHaveLength(2);
            expect(Object.keys(entries[0]!.value)).toEqual([
                "uuid",
                "treasureId",
                "currentOwner",
                "originalOwner",
                "targetId",
                "time",
                "colour",
                "state",
            ]);
            expect(entries[0]!.value.targetId!.type).toBe(Type.Int);
            expect(entries[0]!.value.treasureId!.type).toBe(Type.String);
            expect(
                maps.every(
                    (row) =>
                        row.currentOwner === "owner"
                        && row.originalOwner === "owner"
                        && row.colour === 1
                        && row.time === 180
                        && row.state === 0,
                ),
            ).toBe(true);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "maps")))[0]!
                    .count,
            ).toBe(2);
            expect(
                (await h.command("treasuremap.get", { itemid: sfs.string("200042") })).body
                    .treasureMap,
            ).toBeUndefined();
            expect(
                (await h.command("treasuremap.init", {})).body.treasureMap!.value as unknown[],
            ).toHaveLength(2);
            const destroy = {
                treasureuuid: sfs.string(maps[0]!.uuid),
                operationId: sfs.string(randomUUID()),
            };
            const removed = await Promise.all(
                Array.from({ length: 4 }, () => h.command("treasuremap.destroy", destroy)),
            );
            expect(removed[0]!.body.treasureuuid!.value).toBe(maps[0]!.uuid);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "maps")))[0]!
                    .count,
            ).toBe(1);
            expect(await h.db.db.select().from(treasure_map)).toHaveLength(1);
            await expect(
                h.command("treasuremap.destroy", {
                    ...destroy,
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            await h.db.db.insert(treasure_map).values({
                uuid: "foreign-map",
                treasureId: "1001",
                currentOwner: "other",
                originalOwner: "other",
                targetId: 1,
                time: 180,
                colour: 1,
                state: 0,
            });
            await expect(
                h.command("treasuremap.destroy", { treasureuuid: sfs.string("foreign-map") }),
            ).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "treasure generation preserves the source color hint geometry and fails atomically without usable terrain",
    async () => {
        const h = await treasureHarness();
        try
        {
            await h.db.db
                .insert(user_item)
                .values({ uuid: "purple", ownerId: "owner", itemId: "200044", count: 1, value: 0 });
            const purple = await h.command("treasuremap.get", { itemid: sfs.string("200044") });
            const entry = (purple.body.treasureMap!.value as { value: Fields; }[])[0]!.value;
            expect(entry.treasureId!.value).toBe("1007");
            expect(entry.time!.value).toBe(600);
            await h.db.db
                .update(worldpoint)
                .set({ pointType: 3, resInitValue: 100 })
                .where(eq(worldpoint.pointType, 0));
            await expect(h.command("treasuremap.get", { itemid: sfs.string("200042") })).rejects
                .toThrow();
            expect(await h.db.db.select().from(treasure_map)).toHaveLength(1);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "maps")))[0]!
                    .count,
            ).toBe(2);
            await h.db.db.update(user_world).set({ worldId: 3 }).where(eq(user_world.uid, "owner"));
            await expect(h.command("treasuremap.get", { itemid: sfs.string("200042") })).rejects
                .toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
