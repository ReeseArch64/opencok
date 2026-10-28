import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { treasure_map } from "@opencok/drizzle/schema/opencok_kingdom/treasure_map";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { createWorldMarchDomain } from "@opencok/services/world-march-runtime";
import { createTreasureMapDomain } from "@opencok/services/treasure-map";
import { publishWorldMutation } from "@opencok/services/world-publication";
import { decodeMailContent } from "@opencok/services/mail-contents";
import { MailRewardService } from "@opencok/services/mail-rewards";
import { createMailRewardExecutor } from "@opencok/repositories/mail-rewards";
import { readReconnectMarches } from "@opencok/repositories/reconnect-marches";
import {
    createWorldInterest,
    unregisteredWorldMarches,
} from "@opencok/repositories/world-march-runtime";
import { mailRewardEntries } from "@opencok/rules/mail-rewards";
import { encodeWorldMarchArmy } from "@opencok/messages/world-resource-army";
import { sfs, decode, Type, type Fields } from "@opencok/messages/sfs";
import { cityHarness } from "./support/city";

async function excavationHarness()
{
    const h = await cityHarness([createWorldMarchDomain(1200), createTreasureMapDomain(1200)]);
    h.rules.features.set("world_march", {
        id: "world_march",
        online: "all",
        test: "all",
        version: "1.0.0",
    });
    await h.db.db
        .insert(user_world)
        .values({ uid: "owner", pointId: 1202, worldId: 0, color: 1, lastCityDefTime: 0n });
    await h.db.db.insert(worldpoint).values(
        [1202, 1203, 2402, 2403, 10, 20].map((id) => ({
            id,
            worldId: 0,
            x: (id - 1) % 1200,
            y: Math.floor((id - 1) / 1200),
            areaId: 1,
            gridType: 2,
            grid2Type: 0,
            pointType: id === 1202 ? 1 : [1203, 2402, 2403].includes(id) ? 8 : 0,
            pointItem: [1203, 2402, 2403].includes(id) ? "1202" : null,
            ownerId: [1202, 1203, 2402, 2403].includes(id) ? "owner" : "",
            resLevel: 1,
            resInitValue: 0,
        })),
    );
    await h.db.db
        .insert(user_army)
        .values({ uid: "owner", armyId: "107000", level: 1, free: 100, march: 0 });
    await h.db.db.insert(user_item).values([
        { uuid: "maps", ownerId: "owner", itemId: "200042", count: 2, value: 0 },
        { uuid: "recall", ownerId: "owner", itemId: "200004", count: 2, value: 0 },
    ]);
    for (
        const [uuid, target] of [
            ["treasure-one", 10],
            ["treasure-two", 20],
        ] as const
    )
    {
        await h.db.db.insert(treasure_map).values({
            uuid,
            treasureId: "1001",
            currentOwner: "owner",
            originalOwner: "owner",
            targetId: target,
            time: 180,
            colour: 1,
            marchId: "",
            startTime: 0n,
            finishTime: 0n,
            state: 0,
        });
    }
    const start = (target = 10) =>
        h.command("world.march", {
            point: sfs.int(target),
            type: sfs.int(0),
            soldiers: sfs.object({ "107000": sfs.int(10) }),
        });
    const tick = () => h.command("world.tick", {});
    const checkpoint = async () =>
        (
            await h.db.db
                .select()
                .from(world_march_checkpoint)
                .where(eq(world_march_checkpoint.status, 0))
        )[0]!;
    const arrive = async () => {
        const saved = await checkpoint();
        h.clock.now = Number(saved.dueAt) + 1;
        await tick();
        return checkpoint();
    };
    return { ...h, start, tick, checkpoint, arrive };
}

test(
    "owned excavation consumes a map at arrival, pins reward mail, restores timers and returns troops exactly once",
    async () => {
        const h = await excavationHarness();
        try
        {
            await h.start();
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "maps")))[0]!
                    .count,
            ).toBe(2);
            const active = await h.arrive(),
                state = decode(active.payload);
            expect(state.purpose!.value).toBe("treasure");
            expect(state.phase!.value).toBe("gathering");
            expect(state.treasureReward!.type).toBe(Type.String);
            const reward = state.treasureReward!.value as string;
            expect(reward.length).toBeGreaterThan(0);
            const [map] = await h.db.db
                .select()
                .from(treasure_map)
                .where(eq(treasure_map.uuid, "treasure-one"));
            expect(map!.state).toBe(1);
            expect(map!.marchId).toBe(active.id);
            expect(map!.finishTime).toBe(active.dueAt);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "maps")))[0]!
                    .count,
            ).toBe(1);
            expect(
                (await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0]!
                    .pointType,
            ).toBe(2);
            const [encamp] = await h.db.db.select().from(mail);
            expect(encamp!.type).toBe(9);
            expect(encamp!.itemIdFlag).toBe(0);
            const content = decodeMailContent({ ...encamp!, extra: null })!.body;
            expect(content.isTreasureMap!.value).toBe(true);
            expect(content.pointId!.value).toBe("10");
            const row = (await readReconnectMarches(h.db.db, "owner")).rows[0]!;
            expect(row.treasureMapTime).toBe(180);
            expect(row.treasureMapFinishTime).toBe(active.dueAt);
            const visible = await createWorldInterest(
                h.db.db,
                h.authority,
                1200,
                () => h.clock.now,
            ).marches([10]);
            expect(visible[0]!.treasureMapFinishTime).toBe(active.dueAt);
            const view = (await h.command("world.user.march", {})).body.m!.value as {
                value: Fields;
            }[];
            expect(view[0]!.value.treasureMapTime!.type).toBe(Type.Int);
            expect(view[0]!.value.treasureMapFinishTime!.type).toBe(Type.Long);
            expect(view[0]!.value.treasureMapFinishTime!.value).toBe(active.dueAt);
            const win: Fields[] = [];
            for (
                const event of (await h.db.db.select().from(mutation_outbox)).filter((row) =>
                    row.eventType.startsWith("world.")
                )
            )
            {
                await publishWorldMutation(
                    event.payload,
                    event.eventType,
                    1,
                    async () => ["owner"],
                    async (_owner, command, body) => {
                        if (command === "push.world.march.win")
                        {
                            win.push(body);
                        }
                    },
                );
            }
            expect(win).toHaveLength(1);
            expect(Object.keys(win[0]!)).toEqual(["uuid", "o", "treasureMap"]);
            expect(win[0]!.fight).toBeUndefined();
            h.rules.reconnect.rewards!.delete("241008");
            h.clock.now = Number(active.dueAt) + Number(state.returnDuration!.value) + 1;
            const operationId = sfs.string(randomUUID());
            await Promise.all(
                Array.from({ length: 4 }, () => h.command("world.tick", { operationId })),
            );
            await h.tick();
            expect(await h.db.db.select().from(world_march)).toHaveLength(0);
            expect((await h.db.db.select().from(user_army))[0]).toMatchObject({
                free: 100,
                march: 0,
            });
            expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0])
                .toMatchObject(
                    { pointType: 0, ownerId: "", ownerMarchUUid: "" },
                );
            const completed = (await h.db.db.select().from(mail)).filter((row) => row.type === 2);
            expect(completed).toHaveLength(1);
            expect(completed[0]!.rewardId).toBe(reward);
            expect(completed[0]!.rewardStatus).toBe(0);
            const entries = mailRewardEntries(reward);
            const claims = new MailRewardService(
                createMailRewardExecutor(h.db.db, h.authority, () => h.clock.now),
                h.rules,
            );
            const claim = {
                uid: sfs.string(completed[0]!.uid),
                operationId: sfs.string(randomUUID()),
            };
            await Promise.all(
                Array.from({ length: 3 }, () => claims.command("owner", "mail.reward", claim)),
            );
            for (const entry of entries)
            {
                if (entry.category === "goods")
                {
                    expect(
                        (await h.db.db.select().from(user_item).where(
                            eq(user_item.itemId, entry.itemId),
                        ))[0]!
                            .count,
                    ).toBe(entry.count);
                }
            }
            await claims.command("owner", "mail.reward", {
                ...claim,
                operationId: sfs.string(randomUUID()),
            });
            for (const entry of entries)
            {
                if (entry.category === "goods")
                {
                    expect(
                        (await h.db.db.select().from(user_item).where(
                            eq(user_item.itemId, entry.itemId),
                        ))[0]!
                            .count,
                    ).toBe(entry.count);
                }
            }
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "treasure acceleration charges once, failed costs preserve the deadline and recall abandons the consumed map",
    async () => {
        const h = await excavationHarness();
        try
        {
            await h.start();
            const active = await h.arrive();
            await h.db.db.update(userprofile).set({ gold: 0n }).where(eq(userprofile.uid, "owner"));
            await expect(
                h.command("treasuremap.spd", { marchid: sfs.string(active.id) }),
            ).rejects.toThrow();
            expect((await h.checkpoint()).dueAt).toBe(active.dueAt);
            expect(
                (await h.db.db.select().from(treasure_map).where(
                    eq(treasure_map.uuid, "treasure-one"),
                ))[0]!
                    .finishTime,
            ).toBe(active.dueAt);
            await h.db.db.update(userprofile).set({ gold: 100000n }).where(
                eq(userprofile.uid, "owner"),
            );
            const request = {
                marchid: sfs.string(active.id),
                operationId: sfs.string(randomUUID()),
            };
            const replies = await Promise.all(
                Array.from({ length: 3 }, () => h.command("treasuremap.spd", request)),
            );
            const paid = replies[0]!.body.gold!.value as bigint;
            expect(paid).toBeLessThan(100000n);
            expect(paid).toBeGreaterThan(0n);
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 2))
                .toHaveLength(1);
            expect((await h.db.db.select().from(treasure_map)).map((row) => row.uuid)).toEqual([
                "treasure-two",
            ]);
            const returning = await h.checkpoint();
            h.clock.now = Number(returning.dueAt) + 1;
            await h.tick();
            await h.start(20);
            await h.arrive();
            const second = await h.checkpoint();
            await h.command("world.march.retreat", { uuid: sfs.string(second.id) });
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 2))
                .toHaveLength(1);
            expect(await h.db.db.select().from(treasure_map)).toHaveLength(0);
            const recall = await h.checkpoint();
            h.clock.now = Number(recall.dueAt) + 1;
            await h.tick();
            expect((await h.db.db.select().from(user_army))[0]).toMatchObject({
                free: 100,
                march: 0,
            });
            expect(
                (await h.db.db.select().from(userprofile).where(eq(userprofile.uid, "owner")))[0]!
                    .gold,
            ).toBe(paid);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "claimed legacy treasure camps recover saved deadlines without charging the map item again",
    async () => {
        const h = await excavationHarness();
        try
        {
            const id = "legacy-treasure";
            await h.db.db.update(user_army).set({ free: 90, march: 10 }).where(
                eq(user_army.uid, "owner"),
            );
            await h.db.db.update(user_item).set({ count: 1 }).where(eq(user_item.uuid, "maps"));
            await h.db.db
                .update(treasure_map)
                .set({ state: 1, marchId: id, startTime: 900000n, finishTime: 1000100n })
                .where(eq(treasure_map.uuid, "treasure-one"));
            await h.db.db
                .update(worldpoint)
                .set({ pointType: 2, ownerId: "owner", ownerMarchUUid: id })
                .where(eq(worldpoint.id, 10));
            await h.db.db.insert(world_march).values({
                uuid: id,
                ownerUid: "owner",
                ownerId: 1202,
                ownerName: "Synthetic",
                ownerColor: 1,
                type: 0,
                targetId: 10,
                targetType: 2,
                state: 1,
                worldId: 0,
                marchStartTime: 800000n,
                marchArrivalTime: 900000n,
                arrivalTime: 900000n,
                marchTime: 5000,
                armyInfo: encodeWorldMarchArmy({
                    owner: "owner",
                    cachedLoad: 0,
                    soldiers: [
                        {
                            owner: "owner",
                            armsId: "107000",
                            total: 10,
                            dead: 0,
                            loadEffect: 0,
                            basicArm: null,
                        },
                    ],
                    dragons: [],
                    general: null,
                }),
            });
            expect(await unregisteredWorldMarches(h.db.db)).toHaveLength(1);
            await h.tick();
            expect((await h.checkpoint()).dueAt).toBe(1000100n);
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "maps")))[0]!
                    .count,
            ).toBe(1);
            h.clock.now = 1010000;
            await h.tick();
            await h.tick();
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 2))
                .toHaveLength(1);
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 9))
                .toHaveLength(0);
            expect((await h.db.db.select().from(user_army))[0]).toMatchObject({
                free: 100,
                march: 0,
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
    "an occupied target returns an outbound treasure party without spending its map or fabricating combat",
    async () => {
        const h = await excavationHarness();
        try
        {
            await h.start();
            const active = await h.checkpoint();
            await h.db.db
                .update(worldpoint)
                .set({ pointType: 2, ownerId: "other", ownerMarchUUid: "foreign" })
                .where(eq(worldpoint.id, 10));
            h.clock.now = Number(active.dueAt)
                + Number(decode(active.payload).returnDuration!.value) + 1;
            await h.tick();
            expect(
                (await h.db.db.select().from(user_item).where(eq(user_item.uuid, "maps")))[0]!
                    .count,
            ).toBe(2);
            expect(await h.db.db.select().from(mail)).toHaveLength(0);
            expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0])
                .toMatchObject(
                    { ownerId: "other", ownerMarchUUid: "foreign", pointType: 2 },
                );
            expect((await h.db.db.select().from(user_army))[0]).toMatchObject({
                free: 100,
                march: 0,
            });
            expect(
                (await h.db.db.select().from(treasure_map).where(
                    eq(treasure_map.uuid, "treasure-one"),
                ))[0]!
                    .state,
            ).toBe(0);
            await expect(h.start()).rejects.toThrow();
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "a changed occupied camp cannot fund a treasure reward or clear its foreign owner",
    async () => {
        const h = await excavationHarness();
        try
        {
            await h.start();
            const active = await h.arrive(),
                saved = decode(active.payload);
            await h.db.db
                .update(worldpoint)
                .set({ pointType: 2, ownerId: "other", ownerMarchUUid: "foreign" })
                .where(eq(worldpoint.id, 10));
            h.clock.now = Number(active.dueAt) + Number(saved.returnDuration!.value) + 1;
            await h.tick();
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 2))
                .toHaveLength(0);
            expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0])
                .toMatchObject(
                    { pointType: 2, ownerId: "other", ownerMarchUUid: "foreign" },
                );
            expect((await h.db.db.select().from(user_army))[0]).toMatchObject({
                free: 100,
                march: 0,
            });
            expect((await h.db.db.select().from(treasure_map)).map((row) => row.uuid)).toEqual([
                "treasure-two",
            ]);
            await h.tick();
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 2))
                .toHaveLength(0);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);

test(
    "late recovery settles arrival, excavation and return in one transaction without dropping the funded reward",
    async () => {
        const h = await excavationHarness();
        try
        {
            await h.start();
            h.clock.now += 3600000;
            await h.tick();
            expect((await h.db.db.select().from(user_army))[0]).toMatchObject({
                free: 100,
                march: 0,
            });
            expect(await h.db.db.select().from(world_march)).toHaveLength(0);
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 2))
                .toHaveLength(1);
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 9))
                .toHaveLength(1);
            expect((await h.db.db.select().from(worldpoint).where(eq(worldpoint.id, 10)))[0])
                .toMatchObject(
                    { pointType: 0, ownerId: "", ownerMarchUUid: "" },
                );
            await h.tick();
            expect((await h.db.db.select().from(mail)).filter((row) => row.type === 2))
                .toHaveLength(1);
        }
        finally
        {
            await h.close();
        }
    },
    120000,
);
