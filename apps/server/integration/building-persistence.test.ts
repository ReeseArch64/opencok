import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { BuildingRepository } from "@opencok/building/repositories/progression";
import type { UpdateBuildingDto } from "@opencok/building/dtos/update-building.dto";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_building_exp } from "@opencok/drizzle/schema/opencok_kingdom/user_building_exp";
import { cityHarness } from "./support/city";

function input(uuid: string): UpdateBuildingDto
{
    return {
        uuid,
        itemId: 413000,
        pos: 20,
        level: 2,
        opType: 0,
        star: 0,
        progress: 0,
        reward: 0,
        refreshTime: 9007199254740993n,
        updateTime: 9007199254740994n,
        effectTime: 9007199254740995n,
        putId: "",
        unlockFlag: 1,
        costUnlockTimes: 2,
    };
}

test(
    "typed building writes and experience roll back on foreign UUID ownership and retain exact committed values",
    async () => {
        const h = await cityHarness();
        try
        {
            const own = await h.building("owner-413000");
            const foreign = await h.building("other-413000");
            const beforeExperience = await h.db.db.select().from(user_building_exp).where(
                eq(user_building_exp.uid, "owner"),
            );
            const experience = { currentMax: 9007199254740996n, historyMax: 9007199254740997n };
            await expect(h.db.db.transaction(async (tx) => {
                const repository = new BuildingRepository(tx, "owner");
                await repository.write(input("owner-413000"));
                await repository.writeExperience(experience);
                expect((await repository.read()).find((row) => row.uuid === "owner-413000"))
                    .toMatchObject({ level: 2, updateTime: 9007199254740994n });
                expect((await repository.readExperience())[0]).toMatchObject(experience);
                await repository.write(input("other-413000"));
            })).rejects.toThrow("Foreign building");
            expect(await h.building("owner-413000")).toEqual(own);
            expect(await h.building("other-413000")).toEqual(foreign);
            expect(
                await h.db.db.select().from(user_building_exp).where(
                    eq(user_building_exp.uid, "owner"),
                ),
            ).toEqual(beforeExperience);
            await h.db.db.transaction(async (tx) => {
                const repository = new BuildingRepository(tx, "owner");
                await repository.write(input("owner-413000"));
                await repository.writeExperience(experience);
            });
            expect(await h.building("owner-413000")).toEqual({
                ...input("owner-413000"),
                uid: "owner",
            });
            expect(
                (await h.db.db.select().from(user_building_exp).where(
                    eq(user_building_exp.uid, "owner"),
                ))[0],
            ).toEqual({ uid: "owner", ...experience });
            await h.db.db.transaction(async (tx) => {
                const repository = new BuildingRepository(tx, "owner");
                await repository.write({ ...input("new-owned") });
                await repository.delete(["new-owned", "other-413000"]);
                expect((await repository.read()).every((row) => row.uid === "owner")).toBe(true);
            });
            expect(await h.building("new-owned")).toBeUndefined();
            expect(await h.building("other-413000")).toEqual(foreign);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "building snapshots retain deterministic owner-scoped ordering and the aggregate overflow sentinel",
    async () => {
        const h = await cityHarness();
        try
        {
            const values = Array.from({ length: 258 }, (_, index) => ({
                ...input(`000-${String(257 - index).padStart(4, "0")}`),
                uid: "owner",
            }));
            await h.db.db.insert(user_building).values(values);
            await h.db.db.transaction(async (tx) => {
                const repository = new BuildingRepository(tx, "owner");
                const rows = await repository.read();
                expect(rows).toHaveLength(257);
                expect(rows[0]!.uuid).toBe("000-0000");
                expect(rows.at(-1)!.uuid).toBe("000-0256");
                expect(rows.every((row) => row.uid === "owner")).toBe(true);
                expect(rows.some((row) => row.uuid.startsWith("other-"))).toBe(false);
            });
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
