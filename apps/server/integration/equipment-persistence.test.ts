import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { EquipmentRepository } from "@opencok/equipment/repositories/progression";
import { text, num, long } from "@opencok/contracts/rows";
import { user_equip } from "@opencok/drizzle/schema/opencok_kingdom/user_equip";
import { user_mixed_info } from "@opencok/drizzle/schema/opencok_kingdom/user_mixed_info";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { queue } from "@opencok/drizzle/schema/opencok_kingdom/queue";
import { cityHarness } from "./support/city";

function equipment(uuid: string)
{
    return {
        uuid,
        uid: "owner",
        itemId: 1001010,
        on: 1,
        generalid: 2,
        cost: "201060;1",
        extraProperty: "10,2",
        refineProperty: "11,3",
        lockProperty: "",
        showSign: 0,
        strengthLevel: 3,
        reforgeCount: 4,
        crystalCharge: 5,
        darkCrystalCharge: 6,
        chargeType: 7,
    };
}

test(
    "equipment ownership failures roll back earlier writes and preserve foreign rows",
    async () => {
        const h = await cityHarness();
        try
        {
            await h.db.db.insert(user_equip).values([
                { uuid: "owned", uid: "owner", itemId: 1001010 },
                { uuid: "foreign", uid: "other", itemId: 1001010 },
            ]);
            const before = await h.db.db.select().from(user_equip).orderBy(user_equip.uuid);
            await expect(h.db.db.transaction(async (tx) => {
                const repository = new EquipmentRepository(tx, "owner", { text, num, long });
                await repository.writeEquipment({
                    equipment: [equipment("owned"), equipment("foreign")],
                });
            })).rejects.toThrow("Foreign equipment write");
            expect(await h.db.db.select().from(user_equip).orderBy(user_equip.uuid)).toEqual(
                before,
            );
            await expect(h.db.db.transaction(async (tx) => {
                const repository = new EquipmentRepository(tx, "owner", { text, num, long });
                await repository.writeEquipment({ deletedEquipment: ["owned", "foreign"] });
            })).rejects.toThrow("Foreign equipment removal");
            expect(await h.db.db.select().from(user_equip).orderBy(user_equip.uuid)).toEqual(
                before,
            );
            await h.db.db.transaction(async (tx) => {
                const repository = new EquipmentRepository(tx, "owner", { text, num, long });
                await repository.writeEquipment({ equipment: [equipment("owned")] });
                expect(await repository.read()).toEqual([{
                    ...equipment("owned"),
                    lockProperty: null,
                    showSign: 1,
                }]);
            });
            expect(
                (await h.db.db.select().from(user_equip).where(eq(user_equip.uuid, "foreign")))[0],
            ).toEqual(before[0]);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "material queue failure rolls back suit and acceleration changes and valid plans keep bigint times",
    async () => {
        const h = await cityHarness();
        try
        {
            const instant = 9007199254740993n;
            const beforeMixed = await h.db.db.select().from(user_mixed_info).where(
                eq(user_mixed_info.uid, "owner"),
            );
            const beforeProfile = await h.db.db.select().from(userprofile).where(
                eq(userprofile.uid, "owner"),
            );
            const plan = {
                equipment: [equipment("new")],
                suitDecompositions: [{ owner: "owner", suitid: "suit", item1: "1001010" }],
                equipmentSelection: "suit;0;0",
                materialBackup: 4,
                materialAcceleration: { materialCdNum: 2, materialCdTime: instant },
                queueUpdates: [{
                    uuid: "material-queue",
                    ownerId: "owner",
                    type: 12,
                    itemId: "201060;201070;",
                    para: 1,
                    updateTime: instant,
                }],
            };
            await expect(h.db.db.transaction(async (tx) => {
                await new EquipmentRepository(tx, "owner", { text, num, long }).writeEquipment(
                    plan,
                );
            })).rejects.toThrow("Missing material queue");
            expect(await h.db.db.select().from(user_equip).where(eq(user_equip.uuid, "new")))
                .toEqual([]);
            expect(
                await h.db.db.select().from(user_mixed_info).where(
                    eq(user_mixed_info.uid, "owner"),
                ),
            ).toEqual(beforeMixed);
            expect(await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))
                .toEqual(beforeProfile);
            await h.db.db.insert(queue).values({
                uuid: "material-queue",
                ownerId: "owner",
                qid: 2,
                type: 12,
                endTime: -1n,
                updateTime: -1n,
            });
            await h.db.db.transaction(async (tx) => {
                const repository = new EquipmentRepository(tx, "owner", { text, num, long });
                expect(await repository.readSuitDecompositions()).toEqual([]);
                await repository.writeEquipment(plan);
                expect(await repository.readSuitDecompositions()).toEqual([{
                    owner: "owner",
                    suitid: "suit",
                    item1: "1001010",
                    item2: "",
                    item3: "",
                    item4: "",
                    item5: "",
                    item6: "",
                }]);
            });
            expect(
                (await h.db.db.select().from(user_mixed_info).where(
                    eq(user_mixed_info.uid, "owner"),
                ))[0],
            ).toMatchObject({ materialBackup: 4, materialCdNum: 2, materialCdTime: instant });
            expect((await h.db.db.select().from(queue).where(eq(queue.uuid, "material-queue")))[0])
                .toMatchObject({ itemId: "201060;201070;", para: 1, updateTime: instant });
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .decomposesuiteffect,
            ).toBe("suit;0;0");
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
