import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { user_wall } from "@opencok/drizzle/schema/opencok_kingdom/user_wall";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { createRealmTrainingDomain } from "../src/composition/troops";
import { createRealmHospitalDomain } from "../src/composition/troops";
import { createRealmFortificationDomain } from "../src/composition/troops";
import { sfs } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";
import { TroopsRepository } from "@opencok/troops/repositories/progression";

const trainingDomain = createRealmTrainingDomain();
const hospitalDomain = createRealmHospitalDomain();
const fortificationDomain = createRealmFortificationDomain();

const domains = [trainingDomain, hospitalDomain, fortificationDomain];

test(
    "owned military persistence shares rollback and isolates the bound owner across all three tables",
    async () => {
        const h = await cityHarness(domains);
        try
        {
            await h.db.db.insert(user_army).values({ uid: "foreign", armyId: "107000", free: 99 });
            const deadline = 9007199254740993n;
            const persist = async (repository: TroopsRepository) => {
                await repository.writeArmiesValidated([
                    { uid: "owner", armyId: "107001", free: 2 },
                    {
                        uid: "owner",
                        armyId: "107000",
                        free: 3,
                        train: 4,
                        finishTime: deadline,
                        foodCostTime: deadline,
                    },
                ]);
                await repository.writeHospitalValidated([{
                    uid: "owner",
                    armyId: "107000",
                    dead: 5,
                    heal: 6,
                    finishTime: deadline,
                }]);
                await repository.writeFortsValidated([{
                    uid: "owner",
                    armyId: "107900",
                    num: 7,
                    build: 8,
                    level: 1,
                    finishTime: deadline,
                }]);
            };
            await expect(h.db.db.transaction(async (tx) => {
                const repository = new TroopsRepository(tx, "owner");
                await persist(repository);
                expect((await repository.readArmies()).map((row) => row.armyId)).toEqual([
                    "107000",
                    "107001",
                ]);
                expect((await repository.readHospital())[0]).toMatchObject({ dead: 5, heal: 6 });
                expect((await repository.readForts())[0]).toMatchObject({ num: 7, build: 8 });
                throw new Error("rollback military writes");
            })).rejects.toThrow("rollback military writes");
            expect(await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))
                .toEqual([]);
            expect(await h.db.db.select().from(user_hospital).where(eq(user_hospital.uid, "owner")))
                .toEqual([]);
            expect(await h.db.db.select().from(user_wall).where(eq(user_wall.uid, "owner")))
                .toEqual([]);
            await h.db.db.transaction(async (tx) => {
                const repository = new TroopsRepository(tx, "owner");
                await persist(repository);
                expect((await repository.readArmies())[0]).toMatchObject({
                    uid: "owner",
                    armyId: "107000",
                    free: 3,
                    train: 4,
                    finishTime: deadline,
                    foodCostTime: deadline,
                });
                expect((await repository.readHospital())[0]).toMatchObject({
                    finishTime: deadline,
                });
                expect((await repository.readForts())[0]).toMatchObject({ finishTime: deadline });
            });
            expect(
                (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner"))).length,
            ).toBe(2);
            expect(
                (await h.db.db.select().from(user_hospital).where(eq(user_hospital.uid, "owner")))
                    .length,
            ).toBe(1);
            expect(
                (await h.db.db.select().from(user_wall).where(eq(user_wall.uid, "owner"))).length,
            ).toBe(1);
            expect((await h.db.db.select().from(user_army).where(eq(user_army.uid, "foreign")))[0])
                .toMatchObject({ free: 99 });
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "training, dismissal, healing and defenses conserve quantities under retry and recovery",
    async () => {
        const h = await cityHarness(domains);
        try
        {
            const army = async () =>
                (
                    await h.db.db
                        .select()
                        .from(user_army)
                        .where(and(eq(user_army.uid, "owner"), eq(user_army.armyId, "107000")))
                )[0]!;
            const wounds = async () =>
                (await h.db.db.select().from(user_hospital).where(eq(user_hospital.uid, "owner")))[
                    0
                ]!;
            const fort = async () =>
                (await h.db.db.select().from(user_wall).where(eq(user_wall.uid, "owner")))[0]!;
            const operationId = sfs.string(randomUUID()),
                params = {
                    id: sfs.string("107000"),
                    num: sfs.int(5),
                    gold: sfs.bool(false),
                    guideStep: sfs.string("military-guide"),
                    operationId,
                };
            await Promise.all(Array.from({ length: 5 }, () => h.command("army.add", params)));
            expect((await army()).train).toBe(5);
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .guideStep,
            ).toBe("military-guide");
            await expect(
                h.command("army.add", {
                    id: sfs.string("107000"),
                    num: sfs.int(21),
                    gold: sfs.bool(false),
                }),
            ).rejects.toThrow();
            await h.finish(1);
            expect((await army()).free).toBe(5);
            expect((await army()).train).toBe(0);
            await expect(
                h.command("army.fire", { id: sfs.string("107000"), num: sfs.int(6) }),
            ).rejects.toThrow();
            await h.command("army.fire", { id: sfs.string("107000"), num: sfs.int(2) });
            expect((await army()).free).toBe(3);
            await h.db.db
                .insert(user_hospital)
                .values({ uid: "owner", armyId: "107000", dead: 20, heal: 0 });
            await h.command("hospital.cure", { "107000": sfs.int(10) });
            expect(await wounds()).toMatchObject({ dead: 10, heal: 10 });
            const healing = await h.active(3);
            await h.service.command("owner", "hospital.cancel", {
                uuid: sfs.string(healing.queueId),
                activityId: sfs.string(healing.id),
                operationId: sfs.string(randomUUID()),
            });
            expect(await wounds()).toMatchObject({ dead: 20, heal: 0 });
            await h.command("hospital.cure", { "107000": sfs.int(10) });
            await h.command("hospital.cd", { "107000": sfs.int(3) });
            expect(await wounds()).toMatchObject({ dead: 7, heal: 10 });
            expect((await army()).free).toBe(6);
            await h.finish(3);
            expect(await wounds()).toMatchObject({ dead: 7, heal: 0 });
            expect((await army()).free).toBe(16);
            await expect(
                h.command("hospital.fire", { id: sfs.string("107000"), num: sfs.int(8) }),
            ).rejects.toThrow();
            await h.command("hospital.fire", { id: sfs.string("107000"), num: sfs.int(7) });
            expect((await wounds()).dead).toBe(0);
            await h.command("fort.build", {
                id: sfs.string("107900"),
                num: sfs.int(3),
                gold: sfs.bool(false),
            });
            expect((await fort()).build).toBe(3);
            const defense = await h.active(2);
            await expect(
                h.service.command("owner", "fort.build.done", {
                    id: sfs.string("107901"),
                    uuid: sfs.string(defense.queueId),
                    operationId: sfs.string(randomUUID()),
                }),
            ).rejects.toThrow();
            await h.finish(2);
            expect(await fort()).toMatchObject({ num: 3, build: 0 });
            await h.command("fort.destory", { id: sfs.string("107900"), num: sfs.int(1) });
            expect((await fort()).num).toBe(2);
            await h.command("army.cd", {
                id: sfs.string("107000"),
                num: sfs.int(2),
                complete: sfs.bool(true),
            });
            expect((await army()).free).toBe(18);
            await h.command("army.cd", { id: sfs.string("107000"), num: sfs.int(2) });
            expect((await h.active(1)).dueAt).toBe(BigInt(h.clock.now));
            await h.finish(1);
            expect((await army()).free).toBe(20);
            await h.command("fort.cd", { id: sfs.string("107900"), num: sfs.int(2) });
            await h.finish(2);
            expect((await fort()).num).toBe(4);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test("pending military power is reserved before another batch is charged", async () => {
    const { playerinfo } = await import("@opencok/drizzle/schema/opencok_kingdom/playerinfo");
    const h = await cityHarness(domains);
    try
    {
        const before =
            (await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner")))[0]!
                .power!;
        h.rules.configuration.serverConfig!.set("power_limit", {
            id: "power_limit",
            enabled: "1",
            max_power: String(before + 4n),
        });
        await expect(
            h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(5),
                gold: sfs.bool(false),
            }),
        ).rejects.toThrow();
        await h.command("army.add", {
            id: sfs.string("107000"),
            num: sfs.int(3),
            gold: sfs.bool(false),
        });
        await expect(
            h.command("fort.build", {
                id: sfs.string("107900"),
                num: sfs.int(2),
                gold: sfs.bool(false),
            }),
        ).rejects.toThrow();
        await h.command("fort.build", {
            id: sfs.string("107900"),
            num: sfs.int(1),
            gold: sfs.bool(false),
        });
        await h.finish(1);
        await h.finish(2);
        expect(
            (await h.db.db.select().from(playerinfo).where(eq(playerinfo.uid, "owner")))[0]!.power,
        ).toBe(before + 4n);
    }
    finally
    {
        await h.close();
    }
}, 120000);

test(
    "overdue training establishes troop consumption at the saved completion deadline",
    async () => {
        const { user_resource } = await import(
            "@opencok/drizzle/schema/opencok_kingdom/user_resource"
        );
        const h = await cityHarness(domains);
        try
        {
            await h.command("army.add", {
                id: sfs.string("107000"),
                num: sfs.int(5),
                gold: sfs.bool(false),
            });
            const activity = await h.active(1);
            h.clock.now = Number(activity.dueAt) + 3600000;
            await h.finish(1);
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!
                    .lastUpdateTime,
            ).toBe(activity.dueAt);
            const army =
                (await h.db.db.select().from(user_army).where(eq(user_army.uid, "owner")))[0]!;
            expect(army.foodCostTime).toBe(activity.dueAt);
            expect(army.free).toBe(5);
            await h.production.command("owner", "production.settle", {});
            expect(
                (await h.db.db.select().from(user_resource).where(eq(user_resource.uid, "owner")))[
                    0
                ]!
                    .lastUpdateTime,
            ).toBe(BigInt(h.clock.now));
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
