import { expect, test } from "bun:test";
import { eq } from "drizzle-orm";
import { cityHarness } from "./support/city";
import { createWorldMarchInspectionStore } from "@opencok/repositories/world-march-inspection";
import { createRealmGameService } from "../src/composition/game";
import type { GameStore } from "@opencok/contracts/game";
import { encodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { sfs, encode, decode, type Fields } from "@opencok/messages/sfs";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { ob_user } from "@opencok/drizzle/schema/opencok_kingdom/ob_user";
async function harness()
{
    const h = await cityHarness();
    try
    {
        await h.db.db.update(userprofile).set({ allianceId: "A" });
        await h.db.db
            .insert(user_army)
            .values({ uid: "other", armyId: "107000", level: 7, free: 90, march: 10 });
        await h.db.db.insert(worldpoint).values({
            id: 10,
            worldId: 0,
            x: 9,
            y: 0,
            gridType: 2,
            grid2Type: 0,
            areaId: 1,
            pointType: 3,
            pointItem: "0",
            resLevel: 1,
            resInitValue: 1000,
            resCostValue: 0,
        });
        const army = encodeWorldMarchArmy({
            owner: "other",
            cachedLoad: 0,
            soldiers: [
                {
                    owner: "other",
                    armsId: "107000",
                    total: 10,
                    dead: 0,
                    loadEffect: 0,
                    basicArm: null,
                    level: 2,
                },
            ],
            dragons: [],
            general: null,
        });
        await h.db.db.insert(world_march).values({
            uuid: "party",
            ownerUid: "other",
            ownerId: 100,
            ownerName: "Other",
            type: 0,
            targetId: 10,
            targetType: 3,
            state: 0,
            worldId: 0,
            marchStartTime: 1000000n,
            marchArrivalTime: 1100000n,
            arrivalTime: 1100000n,
            marchTime: 100000,
            armyInfo: army,
            collectSpd: 1.25,
        });
        const game = createRealmGameService(
            {} as GameStore,
            h.rules,
            { kingdomId: 1 },
            () => h.clock.now,
            {
                worldMarchInspection: createWorldMarchInspectionStore(h.db.db),
                worldPowerEffects: async () => new Map(),
                reconcileAlliance: async () => {
                    throw new Error("Inspection entered alliance mutation domain");
                },
                cityProgression: async () => {
                    throw new Error("Inspection entered owned mutation domain");
                },
            },
        );
        const query = (params: Fields = {}, observer = "owner") =>
            game.execute(observer, "world.get.march", {
                uid: sfs.string("other"),
                uuid: sfs.string("party"),
                ...params,
            });
        const saved = async () => ({
            marches: await h.db.db.select().from(world_march),
            armies: await h.db.db.select().from(user_army),
            points: await h.db.db.select().from(worldpoint),
            checkpoints: await h.db.db.select().from(world_march_checkpoint),
            receipts: await h.db.db.select().from(command_receipt),
            outbox: await h.db.db.select().from(mutation_outbox),
        });
        return { ...h, query, saved };
    }
    catch (error)
    {
        await h.close();
        throw error;
    }
}
test(
    "same-alliance native march inspection reads actual troop snapshots and load without settling or requiring a checkpoint",
    async () => {
        const h = await harness();
        try
        {
            const before = await h.saved();
            h.clock.now = 2000000;
            const reply = await h.query();
            expect(reply.pushes).toEqual([]);
            const body = decode(encode(reply.body));
            expect(body.uid).toEqual(sfs.string("other"));
            expect(body.endStamp).toEqual(sfs.long(1100000n));
            expect(body.actionMax).toEqual(sfs.int(80));
            expect(body.actionSpeed!.type).toBe(6);
            const soldiers = body.soldiers!.value as { value: Fields; }[];
            expect(soldiers[0]!.value).toEqual({
                armyId: sfs.string("107000"),
                star: sfs.int(2),
                count: sfs.int(10),
            });
            const correlation = {
                _cok_: sfs.string("own-inspection"),
                cmdBaseTime: sfs.long(9007199254740993n),
            };
            const owned = await h.query(correlation, "other");
            expect(owned.body._cok_).toEqual(correlation._cok_);
            expect(owned.body.cmdBaseTime).toEqual(correlation.cmdBaseTime);
            expect(owned.body.uid).toEqual(sfs.string("other"));
            expect(owned.body.actionMax).toEqual(sfs.int(80));
            expect(await h.saved()).toEqual(before);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "native observer rows allow resident inspection while foreign alliances, empty alliances and mismatched owners stay private",
    async () => {
        const h = await harness();
        try
        {
            await h.db.db.update(userprofile).set({ allianceId: "B" }).where(
                eq(userprofile.uid, "owner"),
            );
            await expect(h.query()).rejects.toThrow();
            await h.db.db.update(userprofile).set({ allianceId: "" });
            await expect(h.query()).rejects.toThrow();
            await h.db.db.insert(ob_user).values({ uid: "owner", worldId: 0, createTime: 1n });
            expect((await h.query()).body.uuid).toEqual(sfs.string("party"));
            await expect(h.query({ uid: sfs.string("missing") })).rejects.toThrow();
            await expect(h.query({ uuid: sfs.string("missing") })).rejects.toThrow();
            await expect(h.query({ msFlag: sfs.int(1) })).rejects.toThrow();
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "owner"),
            );
            await expect(h.query()).rejects.toThrow();
            await h.db.db
                .update(userprofile)
                .set({ serverId: 1, banFlag: 1 })
                .where(eq(userprofile.uid, "owner"));
            await expect(h.query()).rejects.toThrow();
            await h.db.db
                .update(userprofile)
                .set({ banFlag: 0, banTime: BigInt(h.clock.now + 1) })
                .where(eq(userprofile.uid, "owner"));
            await expect(h.query()).rejects.toThrow();
            await h.db.db.update(userprofile).set({ banTime: 0n }).where(
                eq(userprofile.uid, "owner"),
            );
            await h.db.db.update(userprofile).set({ serverId: 2 }).where(
                eq(userprofile.uid, "other"),
            );
            await expect(h.query()).rejects.toThrow();
            expect(await h.db.db.select().from(command_receipt)).toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
test(
    "occupied and returning native inspections use saved timestamps and actual remaining stock without fabricating actor or team state",
    async () => {
        const h = await harness();
        try
        {
            await h.db.db.update(world_march).set({ state: 1 });
            const collecting = (await h.query()).body;
            expect(collecting.startStamp).toEqual(sfs.long(1100000n));
            expect(collecting.endStamp).toEqual(sfs.long(1164000n));
            await h.db.db.update(worldpoint).set({ resInitValue: 1 }).where(eq(worldpoint.id, 10));
            await h.db.db.update(world_march).set({ collectSpd: 10 });
            const fractional = (await h.query()).body;
            expect(fractional.actionMax).toEqual(sfs.int(1));
            expect(fractional.endStamp).toEqual(sfs.long(1100100n));
            await h.db.db.update(worldpoint).set({ resInitValue: 1000 }).where(
                eq(worldpoint.id, 10),
            );
            await h.db.db.update(world_march).set({ collectSpd: 1.25 });
            await h.db.db.update(world_march).set({
                state: 2,
                returnStartTime: 1200000n,
                arrivalTime: 1300000n,
                plunderRes: "[{\"t\":0,\"v\":60}]",
            });
            const returning = (await h.query()).body;
            expect(returning.startStamp).toEqual(sfs.long(1200000n));
            expect(returning.endStamp).toEqual(sfs.long(1300000n));
            expect(returning.actionMax).toEqual(sfs.int(20));
            await h.db.db.update(world_march).set({ type: 4 });
            await expect(h.query()).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
