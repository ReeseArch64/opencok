import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { t_worldboss } from "@opencok/drizzle/schema/opencok_kingdom/t_worldboss";
import { cityDefenseDomain } from "@opencok/services/city-defense";
import { sfs, Type, encode, decode } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function defenseHarness(black = false)
{
    const h = await cityHarness([cityDefenseDomain]);
    const point = black ? 721201 : 1202;
    await h.db.db
        .insert(user_world)
        .values({ uid: "owner", pointId: point, worldId: 0, lastCityDefTime: 0n });
    await h.db.db.insert(worldpoint).values({
        id: point,
        worldId: 0,
        x: black ? 600 : 1,
        y: black ? 600 : 1,
        areaId: 1,
        gridType: black ? 0 : 2,
        grid2Type: 0,
        pointType: 1,
        ownerId: "owner",
        resLevel: 1,
        resInitValue: 0,
        cityDefValue: 500,
        startOccupyTime: 900000n,
        fireTime: 1300000n,
    });
    return { ...h, point };
}

test(
    "extinguishing settles native fire damage and charges once across concurrent receipt retries",
    async () => {
        const h = await defenseHarness();
        try
        {
            const operationId = sfs.string(randomUUID());
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("buy.citydef", { operationId })),
            );
            const body = decode(encode(replies[0]!.body));
            expect(Object.keys(body)).toEqual(["remainGold", "cityDef", "operationId"]);
            expect(body.remainGold!.type).toBe(Type.Long);
            expect(body.remainGold!.value).toBe(99950n);
            expect(body.cityDef!.type).toBe(Type.Int);
            expect(body.cityDef!.value).toBe(495);
            const [point] = await h.db.db.select().from(worldpoint).where(
                eq(worldpoint.id, h.point),
            );
            expect(point!.cityDefValue).toBe(495);
            expect(point!.startOccupyTime).toBe(0n);
            expect(point!.fireTime).toBe(0n);
            await expect(h.command("buy.citydef", {})).rejects.toThrow();
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .gold,
            ).toBe(99950n);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "city repairs enforce saved cooldown, wall maximum and native black-land probe without granting assets",
    async () => {
        const h = await defenseHarness();
        try
        {
            await expect(h.command("world.user.rcd", {})).rejects.toThrow();
            h.effects.world = async () => new Map([[125, 70]]);
            const maximum = Number(h.rules.building("419000", 1).clientParameters![1]!.value) + 70;
            await h.db.db
                .update(worldpoint)
                .set({ cityDefValue: maximum - 40, startOccupyTime: 0n, fireTime: 0n })
                .where(eq(worldpoint.id, h.point));
            h.clock.now = 2000000;
            const operationId = sfs.string(randomUUID());
            const replies = await Promise.all(
                Array.from({ length: 4 }, () => h.command("world.user.rcd", { operationId })),
            );
            const body = decode(encode(replies[0]!.body));
            expect(Object.keys(body)).toEqual(["lastCityDefTime", "cityDefValue", "operationId"]);
            expect(body.lastCityDefTime!.type).toBe(Type.Long);
            expect(body.cityDefValue!.type).toBe(Type.Int);
            expect(body.cityDefValue!.value).toBe(maximum);
            expect((await h.db.db.select().from(user_world))[0]!.lastCityDefTime).toBe(2000000n);
            await expect(h.command("world.user.rcd", {})).rejects.toThrow();
            h.clock.now += Number(h.rules.items.get("world_fire1")!.k2) * 60000;
            await h.command("world.user.rcd", {});
            expect(
                (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, h.point)))[0]!
                    .cityDefValue,
            ).toBe(maximum);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .gold,
            ).toBe(100000n);
        }
        finally
        {
            await h.close();
        }
        const black = await defenseHarness(true);
        try
        {
            const body = (await black.command("world.user.rcd", { repairType: sfs.int(1) })).body;
            expect(body.recover!.value).toBe("isBlackLand");
            expect((await black.db.db.select().from(user_world))[0]!.lastCityDefTime).toBe(0n);
            expect((await black.db.db.select().from(worldpoint))[0]!.cityDefValue).toBe(500);
        }
        finally
        {
            await black.close();
        }
    },
    120000,
);

test(
    "saved active world-boss fire rates apply and insufficient gold preserves fire checkpoints",
    async () => {
        const h = await defenseHarness();
        try
        {
            await h.db.db.insert(worldpoint).values({
                id: 10,
                worldId: 0,
                x: 9,
                y: 0,
                areaId: 1,
                gridType: 2,
                grid2Type: 0,
                pointType: 49,
                resLevel: 1,
                resInitValue: 0,
            });
            await h.db.db
                .insert(t_worldboss)
                .values({ status: 1, point: 10, firerange: 20, firespeed: 3600 });
            await h.db.db.update(userprofile).set({ gold: 0n }).where(eq(userprofile.uid, "owner"));
            await expect(h.command("buy.citydef", {})).rejects.toThrow();
            const [unchanged] = await h.db.db.select().from(worldpoint).where(
                eq(worldpoint.id, h.point),
            );
            expect(unchanged!.cityDefValue).toBe(500);
            expect(unchanged!.startOccupyTime).toBe(900000n);
            expect(unchanged!.fireTime).toBe(1300000n);
            await h.db.db.update(userprofile).set({ gold: 50n }).where(
                eq(userprofile.uid, "owner"),
            );
            expect((await h.command("buy.citydef", {})).body.cityDef!.value).toBe(400);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
