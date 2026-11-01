import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { alliance } from "@opencok/drizzle/schema/opencok_kingdom/alliance";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { sfs, type Value } from "@opencok/messages/sfs";
import { worldCosmeticKinds } from "@opencok/skins/enums/kind";
import { createRealmWorldService } from "../src/composition/world";
import { readWorldMap } from "@opencok/world/repositories/map";
import { cityHarness } from "./support/city";

type MapPoint = Record<string, unknown> & { readonly i: number; };

function castle(id: number, x: number, owner: string, allianceId?: string)
{
    return {
        id,
        x,
        y: 10,
        areaId: 0,
        gridType: 2,
        grid2Type: 0,
        pointType: 1,
        resLevel: 1,
        resInitValue: 0,
        ownerId: owner,
        ownerName: "Synthetic",
        allianceId: allianceId ?? null,
    };
}

async function fixture()
{
    const h = await cityHarness([], false, undefined, 20);
    await h.db.db
        .insert(user_world)
        .values({ uid: "owner", pointId: 211, worldId: 0, lastCityDefTime: 0n });
    await h.db.db.insert(alliance).values([
        { uid: "guild-a", abbr: "ABC", createtime: 1n, bannerStyle: "" },
        { uid: "guild-b", abbr: "联盟", createtime: 1n, bannerStyle: "" },
        { uid: "blank", abbr: "", createtime: 1n, bannerStyle: "" },
    ]);
    await h.db.db.insert(worldpoint).values([
        castle(211, 10, "owner", "guild-a"),
        castle(212, 11, "other", "guild-a"),
        castle(213, 12, "other"),
        castle(214, 13, "other", "missing"),
        castle(215, 14, "other", "guild-b"),
        castle(216, 15, "other", "blank"),
    ]);
    const world = createRealmWorldService(
        { getWorldByPointIds: (uid, ids) => readWorldMap(h.db.db, uid, ids, worldCosmeticKinds) },
        20,
        1,
        {
            rules: h.rules,
            now: () => h.clock.now,
            subscribe: async () => {},
            marches: async () => [],
        },
    );
    const points = async () => {
        const reply = await world.get("owner", {
            x: sfs.int(10),
            y: sfs.int(10),
            type: sfs.int(0),
            timeStamp: sfs.int(1),
        });
        const sections = reply.points!.value as Value[];

        return new Map(
            sections
                .flatMap((section) => JSON.parse(String(section.value)) as MapPoint[])
                .map((point) => [point.i, point]),
        );
    };

    return { ...h, points };
}

test("initial world snapshots label allied castles from bounded alliance projections", async () => {
    const h = await fixture();
    try
    {
        const points = await h.points();

        expect(points.get(211)).toMatchObject({ ai: "guild-a", asn: "ABC" });
        expect(points.get(212)).toMatchObject({ ai: "guild-a", asn: "ABC" });
        expect(points.get(213)?.ai).toBeUndefined();
        expect(points.get(213)?.asn).toBeUndefined();
        expect(points.get(214)).toMatchObject({ ai: "missing" });
        expect(points.get(214)?.asn).toBeUndefined();
        expect(points.get(215)).toMatchObject({ ai: "guild-b", asn: "联盟" });
        expect(points.get(216)).toMatchObject({ ai: "blank", asn: "" });
        const projection = await readWorldMap(
            h.db.db,
            "owner",
            [211, 212, 213, 214, 215, 216],
            worldCosmeticKinds,
        );
        expect(projection.alliances?.map((row) => row.uid).sort()).toEqual([
            "blank",
            "guild-a",
            "guild-b",
        ]);
    }
    finally
    {
        await h.close();
    }
});

test("alliance joins, abbreviation changes and disbanding refresh castle labels without stale text", async () => {
    const h = await fixture();
    try
    {
        await h.db.db.update(alliance).set({ abbr: "XYZ" }).where(eq(alliance.uid, "guild-a"));
        await h.db.db.update(worldpoint).set({ allianceId: "guild-a" }).where(
            eq(worldpoint.id, 213),
        );
        let points = await h.points();
        expect(points.get(211)).toMatchObject({ ai: "guild-a", asn: "XYZ" });
        expect(points.get(213)).toMatchObject({ ai: "guild-a", asn: "XYZ" });
        await h.db.db.update(worldpoint).set({ allianceId: null }).where(eq(worldpoint.id, 211));
        points = await h.points();
        expect(points.get(211)?.ai).toBeUndefined();
        expect(points.get(211)?.asn).toBeUndefined();
        await h.db.db.delete(alliance).where(eq(alliance.uid, "guild-b"));
        points = await h.points();
        expect(points.get(215)).toMatchObject({ ai: "guild-b" });
        expect(points.get(215)?.asn).toBeUndefined();
    }
    finally
    {
        await h.close();
    }
});

test("world alliance projection rejects more than the bounded alliance set", async () => {
    const h = await fixture();
    try
    {
        const ids = Array.from({ length: 1025 }, (_, index) => 3000 + index);
        await h.db.db.insert(alliance).values(
            ids.map((id) => ({
                uid: `bulk-${id}`,
                abbr: `G${id}`,
                createtime: 1n,
                bannerStyle: "",
            })),
        );
        await h.db.db.insert(worldpoint).values(
            ids.map((id, index) => castle(id, index % 20, "other", `bulk-${id}`)),
        );

        await expect(readWorldMap(h.db.db, "owner", ids, worldCosmeticKinds)).rejects.toThrow(
            "World alliance projection exceeds bound",
        );
    }
    finally
    {
        await h.close();
    }
});
