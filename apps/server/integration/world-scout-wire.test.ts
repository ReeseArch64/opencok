import { expect, test } from "bun:test";
import { randomUUID } from "node:crypto";
import { and, eq, inArray } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_world } from "@opencok/drizzle/schema/opencok_kingdom/user_world";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { user_state } from "@opencok/drizzle/schema/opencok_kingdom/user_state";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { world_march } from "@opencok/drizzle/schema/opencok_kingdom/world_march";
import { world_march_checkpoint } from "@opencok/drizzle/schema/opencok_kingdom/world_march_checkpoint";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { mutation_outbox } from "@opencok/drizzle/schema/opencok_kingdom/mutation_outbox";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createCharacterCreator } from "@opencok/repositories/character-provisioning";
import { createProvisioningStore } from "@opencok/repositories/provisioning";
import { CharacterProvisioningService } from "@opencok/services/provisioning";
import { loadRules } from "@opencok/resources/rules";
import { worldBirthArea } from "@opencok/rules/world-birth";
import { worldFootprint } from "@opencok/rules/world-march-runtime";
import { decode, fields, sfs, str, type Fields } from "@opencok/messages/sfs";
import { Coordination } from "@opencok/storage/coordination";
import type { ServerConfig } from "@opencok/contracts/server";
import type { CharacterReservation } from "@opencok/contracts/provisioning";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres";
import { DisposableRedis } from "./support/redis";
import { seedSyntheticWorldBirth } from "./support/world-birth";
import { Client } from "./client";
import { startServer } from "../src/server";

async function eventually(check: () => Promise<boolean>, milliseconds = 15000)
{
    const end = Date.now() + milliseconds;
    do
    {
        if (await check())
        {
            return;
        }
        await Bun.sleep(50);
    }
    while (Date.now() < end);
    throw new Error("Synthetic scout transition timed out");
}
function pushes(client: Client, command: string)
{
    return client.received
        .map((packet) => fields(packet.p))
        .filter((packet) => str(packet, "c", "") === command)
        .map((packet) => fields(packet.p));
}

test(
    "real TCP scout quotation, inspection, intel mail and return preserve troops and charge only the scout food",
    async () => {
        const pg = new DisposablePostgres(),
            redis = new DisposableRedis(),
            zk = `opencok-scout-zk-${randomUUID()}`,
            clients: Client[] = [];
        let zkCreated = false,
            global: ReturnType<typeof createDatabase<"global">> | undefined,
            realm: ReturnType<typeof createDatabase<"kingdom">> | undefined,
            runtime: Awaited<ReturnType<typeof startServer>> | undefined;
        try
        {
            const admin = await pg.start();
            try
            {
                await admin.query("CREATE DATABASE \"scout_global\"");
                await admin.query("CREATE DATABASE \"scout_realm\"");
            }
            finally
            {
                await admin.end();
            }
            global = createDatabase("global", { ...pg.options, database: "scout_global", max: 4 });
            realm = createDatabase("kingdom", { ...pg.options, database: "scout_realm", max: 8 });
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
                size = 1201,
                anchors = [1 + 181 + 361 * size, 1 + 201 + 361 * size],
                authority = await acquireRealmAuthority(realm.db, 1, () => true),
                creator = new CharacterProvisioningService(
                    createCharacterCreator(realm.db, authority, size),
                    rules,
                ),
                store = createProvisioningStore(global.db),
                reservations: CharacterReservation[] = [];
            await realm.db.insert(worldpoint).values(
                anchors.flatMap((anchor) =>
                    worldFootprint(anchor, size).map((id) => ({
                        id,
                        worldId: 0,
                        x: (id - 1) % size,
                        y: Math.floor((id - 1) / size),
                        areaId: 1,
                        bornAreaId: worldBirthArea(id, size, 60),
                        pointType: 0,
                        gridType: 2,
                        grid2Type: 0,
                        resLevel: 0,
                        resInitValue: 0,
                        startTime: 0n,
                    }))
                ),
            );
            await seedSyntheticWorldBirth(realm.db, authority, rules, 0);
            for (const subject of ["commander", "defender"])
            {
                const identity = {
                        issuer: "https://securetoken.google.com/synthetic-scout",
                        subject,
                    },
                    input = {
                        kingdomId: 1,
                        deviceUuid: `synthetic-scout-${subject}`,
                        country: "BR",
                        language: "pt",
                    },
                    reservation = (await store.reserve(identity, input)).reservation;
                await store.activate(identity, reservation, await creator.create(reservation));
                reservations.push(reservation);
            }
            const owner = reservations[0]!.gameUid,
                defender = reservations[1]!.gameUid;
            await realm.db.delete(user_state).where(inArray(user_state.uid, [owner, defender]));
            await realm.db.update(worldpoint).set({ shieldTime: 0n });
            await realm.db
                .update(user_building)
                .set({ level: 10 })
                .where(and(eq(user_building.uid, owner), eq(user_building.itemId, 417000)));
            await realm.db.insert(user_army).values([
                { uid: owner, armyId: "107000", level: 1, free: 100 },
                { uid: defender, armyId: "107000", level: 3, free: 42 },
            ]);
            const [target] = await realm.db.select().from(user_world).where(
                eq(user_world.uid, defender),
            );
            expect(target).toBeDefined();
            await pg.docker([
                "run",
                "--detach",
                "--rm",
                "--name",
                zk,
                "--publish",
                "127.0.0.1::2181",
                "zookeeper:3.4.14",
            ]);
            zkCreated = true;
            const zkPort = Number(
                    Buffer.from(await pg.docker(["port", zk, "2181/tcp"]))
                        .toString()
                        .trim()
                        .split(":")
                        .at(-1),
                ),
                url = new URL(`postgres://127.0.0.1:${pg.options.port}/postgres`);
            url.username = String(pg.options.user);
            url.password = String(pg.options.password);
            const config: ServerConfig = {
                host: "127.0.0.1",
                port: 0,
                healthPort: 0,
                kingdomId: 1,
                kingdomDatabase: "scout_realm",
                globalDatabase: "scout_global",
                databaseUrl: url.href,
                redisUrl: await redis.start(),
                zookeeper: `127.0.0.1:${zkPort}`,
                zkPath: "/opencok-experiment/COK1",
                loginSecret: "synthetic-scout-secret",
                mapSize: size,
                timeoutMs: 5000,
            };
            await eventually(async () => {
                const probe = new Coordination({
                    ...config,
                    zkPath: "/opencok-experiment/scout_probe",
                });
                try
                {
                    await probe.start();
                    return probe.ready;
                }
                catch
                {
                    return false;
                }
                finally
                {
                    probe.close();
                }
            });
            runtime = await startServer(config, rules);
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
                    ).zn,
                ).toEqual(sfs.string("COK1"));
                expect(str(fields((await client.next()).p), "c")).toBe("init");
                return client;
            };
            const commander = await login(reservations[0]!),
                defenderClient = await login(reservations[1]!),
                resources = async () =>
                    (await realm!.db.select().from(user_resource).where(
                        eq(user_resource.uid, owner),
                    ))[0]!,
                armies = async () =>
                    await realm!.db.select().from(user_army).orderBy(user_army.uid),
                before = await resources(),
                troops = await armies(),
                points = await realm.db.select().from(worldpoint).orderBy(worldpoint.id),
                gold =
                    (await realm.db.select().from(userprofile).where(eq(userprofile.uid, owner)))[
                        0
                    ]!.gold,
                correlation = {
                    _cok_: sfs.long(9007199254740993n),
                    cmdBaseTime: sfs.string("scout-wire"),
                },
                quote = await commander.command("world.scout.detail", {
                    point: sfs.int(target!.pointId),
                    ...correlation,
                });
            expect(quote.errorCode).toBeUndefined();
            expect(quote).toMatchObject({ ...correlation, point: sfs.int(target!.pointId) });
            expect(Number(quote.scoutTime!.value)).toBeGreaterThan(0);
            expect(Number(quote.scoutCost!.value)).toBe(501);
            expect(await resources()).toEqual(before);
            expect(await armies()).toEqual(troops);
            const request: Fields = {
                    point: sfs.int(target!.pointId),
                    type: sfs.int(1),
                    soldiers: sfs.object({ "107000": sfs.int(10) }),
                    operationId: sfs.string(randomUUID()),
                },
                departed = await commander.command("world.march", request);
            expect(departed.errorCode).toBeUndefined();
            const id = str(departed, "uuid"),
                checkpoint = async () =>
                    (
                        await realm!.db
                            .select()
                            .from(world_march_checkpoint)
                            .where(eq(world_march_checkpoint.id, id))
                    )[0]!,
                march = async () =>
                    (await realm!.db.select().from(world_march).where(eq(world_march.uuid, id)))[0];
            expect(id.length).toBeGreaterThan(0);
            expect(await march()).toMatchObject({
                type: 1,
                state: 0,
                targetType: 1,
                targetUid: defender,
            });
            expect((await resources()).food).toBe(
                before.food - BigInt(Number(quote.scoutCost!.value)),
            );
            expect((await armies()).find((row) => row.uid === owner)).toMatchObject({
                free: 90,
                march: 10,
            });
            const outbound = await checkpoint(),
                beforeInspection = await march(),
                inspector = { uid: sfs.string(owner), uuid: sfs.string(id), ...correlation },
                inspected = await commander.command("world.get.march", inspector);
            expect(inspected.errorCode).toBeUndefined();
            expect(inspected).toMatchObject({
                ...correlation,
                uuid: sfs.string(id),
                uid: sfs.string(owner),
                marchType: sfs.int(1),
                marchState: sfs.int(0),
                totalTroops: sfs.int(10),
                targetPointIndex: sfs.int(target!.pointId),
            });
            expect(await march()).toEqual(beforeInspection);
            expect(await checkpoint()).toEqual(outbound);
            expect(
                await realm.db
                    .select()
                    .from(command_receipt)
                    .where(
                        inArray(command_receipt.command, ["world.scout.detail", "world.get.march"]),
                    ),
            ).toHaveLength(0);
            expect(str(await commander.command("world.march", request), "uuid")).toBe(id);
            expect((await resources()).food).toBe(before.food - 501n);
            await eventually(async () => (await march())?.state === 2);
            const returning = await checkpoint();
            expect(decode(returning.payload).phase).toEqual(sfs.string("returning"));
            const intel = (await realm.db.select().from(mail).where(eq(mail.type, 8)))[0]!;
            expect(intel).toMatchObject({ toUser: owner, rewardStatus: 1 });
            expect(JSON.parse(Buffer.from(intel.contents).toString())).toMatchObject({
                name: reservations[1]!.name,
                pointId: target!.pointId,
                pointType: 1,
            });
            expect(
                await realm.db
                    .select()
                    .from(mutation_outbox)
                    .where(eq(mutation_outbox.eventType, "world.scout.mail")),
            ).toHaveLength(2);
            await eventually(async () => (await checkpoint()).status === 1);
            expect(await march()).toBeUndefined();
            expect(await armies()).toEqual(troops);
            const after = await resources();
            expect(after.wood).toBe(before.wood);
            expect(after.stone).toBe(before.stone);
            expect(after.iron).toBe(before.iron);
            expect(after.silver).toBe(before.silver);
            expect(after.food).toBe(before.food - 501n);
            expect(
                (await realm.db.select().from(userprofile).where(eq(userprofile.uid, owner)))[0]!
                    .gold,
            ).toBe(gold);
            expect(await realm.db.select().from(worldpoint).orderBy(worldpoint.id)).toEqual(points);
            expect(await realm.db.select().from(mail).where(eq(mail.type, 8))).toHaveLength(1);
            expect(await realm.db.select().from(mail).where(eq(mail.type, 6))).toHaveLength(1);
            const [defenderMail] = await realm.db
                .select()
                .from(mail)
                .where(and(eq(mail.type, 6), eq(mail.toUser, defender)));
            expect(defenderMail).toMatchObject({
                toUser: defender,
                fromUser: owner,
                rewardStatus: 1,
            });
            await eventually(async () =>
                pushes(commander, "push.mail").some(
                    (body) => body.uid?.value === intel.uid && body.type?.value === 8,
                )
            );
            await eventually(async () =>
                pushes(defenderClient, "push.mail").some(
                    (body) => body.uid?.value === defenderMail!.uid && body.type?.value === 6,
                )
            );
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
            await redis.stop();
            if (zkCreated)
            {
                await pg.docker(["rm", "--force", "--volumes", zk]);
            }
            await pg.stop();
        }
    },
    180000,
);
