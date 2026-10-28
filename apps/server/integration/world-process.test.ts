import { seedSyntheticWorldBirth } from "./support/world-birth";
import { test, expect } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_item } from "@opencok/drizzle/schema/opencok_kingdom/user_item";
import { user_pray } from "@opencok/drizzle/schema/opencok_kingdom/user_pray";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { receive_item } from "@opencok/drizzle/schema/opencok_kingdom/receive_item";
import { realm_authority } from "@opencok/drizzle/schema/opencok_kingdom/realm_authority";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createCharacterCreator } from "../src/character-provisioning";
import { createProvisioningStore } from "@opencok/account/repositories/provisioning";
import { CharacterProvisioningService } from "@opencok/player/services/character-provisioning";
import { loadRules } from "@opencok/resources/rules";
import { fields, sfs, str, Type, type Fields } from "@opencok/messages/sfs";
import type { CharacterReservation } from "@opencok/contracts/provisioning";
import type { ServerConfig } from "@opencok/contracts/server";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
import { Client } from "./client";
import { startWorldProcess } from "./support/world-process";
async function until(check: () => Promise<boolean>, milliseconds = 15000)
{
    const end = Date.now() + milliseconds;
    do
    {
        if (await check())
        {
            return;
        }
        await Bun.sleep(100);
    }
    while (Date.now() < end);
    throw new Error("Synthetic world transition timed out");
}
function pushes(client: Client, command: string, id?: string)
{
    return client.received
        .map((packet) => fields(packet.p))
        .filter((packet) => str(packet, "c", "") === command)
        .map((packet) => fields(packet.p))
        .filter((body) => !id || str(body, "uuid", "") === id);
}
test(
    "a killed realm recovers the same march and publishes native transitions only to interested players",
    async () => {
        const pg = new DisposablePostgres(),
            containers: string[] = [],
            clients: Client[] = [];
        let global: ReturnType<typeof createDatabase<"global">> | undefined,
            realm: ReturnType<typeof createDatabase<"kingdom">> | undefined,
            runtime: Awaited<ReturnType<typeof startWorldProcess>> | undefined;
        try
        {
            const admin = await pg.start();
            await admin.query("CREATE DATABASE \"world_global\"");
            await admin.query("CREATE DATABASE \"world_realm\"");
            await admin.end();
            global = createDatabase("global", { ...pg.options, database: "world_global", max: 4 });
            realm = createDatabase("kingdom", { ...pg.options, database: "world_realm", max: 8 });
            await Promise.all([
                migrate(global.db, {
                    migrationsFolder:
                        new URL("../../../packages/drizzle/migrations/global", import.meta.url)
                            .pathname,
                }),
                migrate(realm.db, {
                    migrationsFolder:
                        new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
                            .pathname,
                }),
            ]);
            const rules = await loadRules(),
                authority = await acquireRealmAuthority(realm.db, 1, () => true),
                creator = new CharacterProvisioningService(
                    createCharacterCreator(realm.db, authority, 100),
                    rules,
                ),
                store = createProvisioningStore(global.db),
                reservations: CharacterReservation[] = [];
            await realm.db.insert(worldpoint).values(
                [1, 2, 101, 102, 4, 5, 104, 105, 8081, 8082, 8181, 8182].map((id) => ({
                    id,
                    worldId: 0,
                    x: (id - 1) % 100,
                    y: Math.floor((id - 1) / 100),
                    areaId: 0,
                    resLevel: 0,
                    resInitValue: 0,
                    pointType: 0,
                    bornAreaId: (id - 1) % 100 < 60 ? 1 : 4,
                    gridType: 2,
                    grid2Type: 0,
                })),
            );
            rules.world.residential = new Map(
                Array.from({ length: 98 }, (_, index) => [
                    String(43000 + index),
                    { id: String(43000 + index), area_id: index === 0 ? "1" : "4" },
                ]),
            );
            await seedSyntheticWorldBirth(realm.db, authority, rules, 0);
            for (const subject of ["owner", "near", "far"])
            {
                const identity = {
                        issuer: "https://securetoken.google.com/synthetic-world",
                        subject,
                    },
                    input = {
                        kingdomId: 1,
                        deviceUuid: `synthetic-world-${subject}`,
                        country: "BR",
                        language: "pt",
                    },
                    reservation = (await store.reserve(identity, input)).reservation;
                await store.activate(identity, reservation, await creator.create(reservation));
                reservations.push(reservation);
            }
            const owner = reservations[0]!.gameUid;
            await realm.db.insert(user_army).values({
                uid: owner,
                armyId: "107000",
                level: 1,
                free: 100,
            });
            await realm.db.update(userprofile).set({ level: 3 }).where(eq(userprofile.uid, owner));
            await realm.db.insert(user_building).values({
                uuid: "synthetic-world-altar",
                uid: owner,
                itemId: 428000,
                level: 1,
                pos: 14,
                opType: 0,
                refreshTime: BigInt(Date.now()),
            });
            await realm.db.insert(user_item).values({
                uuid: "synthetic-world-prayer-credit",
                ownerId: owner,
                itemId: "200031",
                count: 1,
                value: 0,
            });
            await realm.db.insert(user_item).values({
                uuid: "synthetic-world-speed",
                ownerId: owner,
                itemId: "200220",
                count: 3,
                value: 0,
            });
            await realm.db.insert(user_item).values({
                uuid: "synthetic-world-gift",
                ownerId: owner,
                itemId: "210059",
                count: 2,
                value: 0,
            });
            await realm.db.insert(worldpoint).values({
                id: 10,
                worldId: 0,
                x: 9,
                y: 0,
                areaId: 0,
                gridType: 2,
                grid2Type: 0,
                pointType: 3,
                resLevel: 1,
                resInitValue: 5,
                flushTime: BigInt(Date.now()) + 21600000n,
                resCostValue: 0,
                pointItem: "0",
                ownerId: "",
                ownerName: "",
            });
            const endpoint = async (name: string, port: number) =>
                Number(
                    Buffer.from(await pg.docker(["port", name, `${port}/tcp`]))
                        .toString()
                        .trim()
                        .split(":")
                        .at(-1),
                );
            for (
                const [image, port] of [
                    ["redis:6.2.24-bookworm", 6379],
                    ["zookeeper:3.4.14", 2181],
                ] as const
            )
            {
                const name = `opencok-world-process-${randomUUID()}`;
                await pg.docker([
                    "run",
                    "--detach",
                    "--rm",
                    "--name",
                    name,
                    "--publish",
                    `127.0.0.1::${port}`,
                    image,
                ]);
                containers.push(name);
            }
            const url = new URL(`postgres://127.0.0.1:${pg.options.port}/postgres`);
            url.username = String(pg.options.user);
            url.password = String(pg.options.password);
            const config: ServerConfig = {
                host: "127.0.0.1",
                port: 0,
                healthPort: 0,
                kingdomId: 1,
                kingdomDatabase: "world_realm",
                globalDatabase: "world_global",
                databaseUrl: url.href,
                redisUrl: `redis://127.0.0.1:${await endpoint(containers[0]!, 6379)}/0`,
                zookeeper: `127.0.0.1:${await endpoint(containers[1]!, 2181)}`,
                zkPath: "/opencok-experiment/COK1",
                loginSecret: "synthetic-world-login",
                mapSize: 100,
                timeoutMs: 5000,
            };
            await Bun.sleep(1500);
            runtime = await startWorldProcess(config);
            const login = async (reservation: CharacterReservation) => {
                const client = new Client(runtime!.port);
                clients.push(client);
                await client.handshake();
                expect(
                    (
                        await client.login(
                            config.loginSecret,
                            reservation.gameUid,
                            reservation.deviceUuid,
                            "12.06.0",
                            String(Date.now()),
                            "Google",
                        )
                    ).zn?.value,
                ).toBe("COK1");
                const initial = fields((await client.next()).p);
                expect(str(initial, "c")).toBe("init");
                return client;
            };
            let commander = await login(reservations[0]!);
            const heroInfo = await commander.command("hero.event.info.get", {
                activityId: sfs.string("9000000"),
                _cok_: sfs.long(9007199254740993n),
            });
            expect(heroInfo._cok_).toEqual(sfs.long(9007199254740993n));
            expect(heroInfo.eventList?.type).toBe(Type.Array);
            const prayerInfo = await commander.command("user.pray.info", {});
            expect(prayerInfo.wood).toEqual(sfs.int(9000));
            const prayerBefore = (
                await realm.db.select().from(user_resource).where(eq(user_resource.uid, owner))
            )[0]!.wood;
            const prayerRequest = {
                resource: sfs.int(0),
                gold: sfs.int(0),
                num: sfs.int(9000),
                operationId: sfs.string(randomUUID()),
            };
            const prayerDraw = await commander.command("user.pray", prayerRequest);
            expect(prayerDraw.errorCode).toBeUndefined();
            expect([2, 5, 10]).toContain(Number(prayerDraw.hit?.value));
            expect(prayerDraw.WOOD).toEqual(
                sfs.long(prayerBefore + 9000n * BigInt(Number(prayerDraw.hit!.value))),
            );
            expect(
                (
                    await commander.command("item.use", {
                        uuid: sfs.string("synthetic-world-prayer-credit"),
                        num: sfs.int(1),
                        operationId: sfs.string(randomUUID()),
                    })
                ).errorCode,
            ).toBeUndefined();
            expect(
                (await realm.db.select().from(user_pray).where(eq(user_pray.uid, owner)))[0]!,
            ).toMatchObject({ prayCount: 1, freeFromItem: 1 });
            const offlineGift = {
                uid: sfs.string(reservations[2]!.gameUid),
                itemId: sfs.string("210059"),
                operationId: sfs.string(randomUUID()),
            };
            expect((await commander.command("item.send", offlineGift)).result).toEqual(
                sfs.bool(true),
            );
            expect(await realm.db.select().from(receive_item)).toHaveLength(1);
            const request: Fields = {
                    point: sfs.int(10),
                    type: sfs.int(0),
                    soldiers: sfs.object({ "107000": sfs.int(10) }),
                    operationId: sfs.string(randomUUID()),
                },
                departed = await commander.command("world.march", request),
                id = str(departed, "uuid");
            expect(id.length).toBeGreaterThan(0);
            const army = async () =>
                (await realm!.db.select().from(user_army).where(eq(user_army.uid, owner)))[0]!;
            const checkpoint = async () =>
                (
                    await realm!.db
                        .select()
                        .from(world_march_checkpoint)
                        .where(eq(world_march_checkpoint.id, id))
                )[0]!;
            const oldEpoch = (await realm.db.select().from(realm_authority))[0]!.ownerEpoch,
                saved = await checkpoint(),
                firstPid = runtime.pid;
            expect(await army()).toMatchObject({ free: 90, march: 10 });
            await runtime.crash();
            commander.close();
            expect((await checkpoint()).payload).toEqual(saved.payload);
            await Bun.sleep(20000);
            runtime = await startWorldProcess(config);
            expect(runtime.pid).not.toBe(firstPid);
            expect((await realm.db.select().from(realm_authority))[0]!.ownerEpoch).toBeGreaterThan(
                oldEpoch,
            );
            commander = await login(reservations[0]!);
            expect(
                (await commander.command("hero.event.info.get", {
                    activityId: sfs.string("9000000"),
                }))
                    .eventList?.type,
            ).toBe(Type.Array);
            expect((await commander.command("user.pray", prayerRequest)).WOOD).toEqual(
                prayerDraw.WOOD!,
            );
            expect(
                (await realm.db.select().from(user_pray).where(eq(user_pray.uid, owner)))[0]!,
            ).toMatchObject({ prayCount: 1, freeFromItem: 1 });
            const near = await login(reservations[1]!),
                far = await login(reservations[2]!);
            expect(pushes(far, "init")[0]!.item_allname).toEqual({
                type: Type.StringArray,
                value: [reservations[0]!.name],
            });
            expect(await realm.db.select().from(receive_item)).toHaveLength(0);
            expect((await commander.command("item.send", offlineGift)).result).toEqual(
                sfs.bool(true),
            );
            expect(
                (
                    await realm.db.select().from(user_item).where(
                        eq(user_item.uuid, "synthetic-world-gift"),
                    )
                )[0]!.count,
            ).toBe(1);
            expect(
                (
                    await commander.command("item.send", {
                        uid: sfs.string(reservations[1]!.gameUid),
                        itemId: sfs.string("210059"),
                        operationId: sfs.string(randomUUID()),
                    })
                ).result,
            ).toEqual(sfs.bool(true));
            await until(async () => pushes(near, "push.item.having").length > 0);
            expect(pushes(near, "push.item.having")[0]).toEqual({
                name: sfs.string(reservations[0]!.name),
                itemId: sfs.string("210059"),
            });
            expect(
                (
                    await realm.db
                        .select()
                        .from(user_item)
                        .where(
                            and(
                                eq(user_item.ownerId, reservations[1]!.gameUid),
                                eq(user_item.itemId, "210052"),
                            ),
                        )
                ).reduce((sum, row) => sum + row.count, 0),
            ).toBe(1);
            await near.command("world.get", {
                x: sfs.int(9),
                y: sfs.int(0),
                type: sfs.int(0),
                timeStamp: sfs.int(1),
            });
            await far.command("world.get", {
                x: sfs.int(80),
                y: sfs.int(80),
                type: sfs.int(0),
                timeStamp: sfs.int(2),
            });
            expect(str(await commander.command("world.march", request), "uuid")).toBe(id);
            expect(await army()).toMatchObject({ free: 90, march: 10 });
            expect(await realm.db.select().from(world_march)).toHaveLength(1);
            const baseline = (
                await realm.db.select().from(user_resource).where(eq(user_resource.uid, owner))
            )[0]!.wood;
            const speed = await commander.command("world.march.spd", {
                uuid: sfs.string(id),
                itemUUid: sfs.string("synthetic-world-speed"),
                operationId: sfs.string(randomUUID()),
            });
            expect(speed.errorCode).toBeUndefined();
            await until(
                async () =>
                    (await realm!.db.select().from(world_march).where(eq(world_march.uuid, id)))[0]
                        ?.state
                        === 1,
            );
            await until(
                async () =>
                    (await realm!.db.select().from(world_march).where(eq(world_march.uuid, id)))[0]
                        ?.state
                        === 2,
            );
            await commander.command("world.march.spd", {
                uuid: sfs.string(id),
                itemUUid: sfs.string("synthetic-world-speed"),
                operationId: sfs.string(randomUUID()),
            });
            await until(async () => (await checkpoint()).status === 1);
            expect(await army()).toMatchObject({ free: 100, march: 0 });
            expect(await realm.db.select().from(world_march)).toHaveLength(0);
            expect(
                (await realm.db.select().from(user_resource).where(eq(user_resource.uid, owner)))[
                    0
                ]!.wood,
            ).toBe(baseline + 5n);
            await until(async () => pushes(near, "push.world.march.del", id).length > 0);
            expect(pushes(near, "push.world.march", id).length).toBeGreaterThan(0);
            expect(pushes(near, "push.world.point").length).toBeGreaterThan(0);
            expect(pushes(far, "push.world.march", id)).toHaveLength(0);
            expect(pushes(far, "push.world.march.del", id)).toHaveLength(0);
            expect(pushes(far, "push.world.point")).toHaveLength(0);
            await commander.command("world.user.march", { operationId: sfs.string(randomUUID()) });
            expect(
                (await realm.db.select().from(user_resource).where(eq(user_resource.uid, owner)))[
                    0
                ]!.wood,
            ).toBe(baseline + 5n);
            expect(
                await realm.db
                    .select()
                    .from(worldpoint)
                    .where(and(eq(worldpoint.worldId, 0), eq(worldpoint.id, 10))),
            ).toMatchObject([{ resCostValue: 5, ownerMarchUUid: "" }]);
        }
        finally
        {
            for (const client of clients)
            {
                client.close();
            }
            await runtime?.close();
            await global?.close();
            await realm?.close();
            for (const name of containers)
            {
                await pg.docker(["stop", name]);
            }
            await pg.stop();
        }
    },
    180000,
);
