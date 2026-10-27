import { seedSyntheticWorldBirth } from "./support/world-birth";
import { user_army } from "@opencok/drizzle/schema/opencok_kingdom/user_army";
import { user_hospital } from "@opencok/drizzle/schema/opencok_kingdom/user_hospital";
import { randomUUID } from "node:crypto";
import { startServer } from "../src/server";
import { Client } from "./client";
import { fields, str, sfs } from "@opencok/messages/sfs";
import { expect, test } from "bun:test";
import { eq, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_resource } from "@opencok/drizzle/schema/opencok_kingdom/user_resource";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { worldpoint } from "@opencok/drizzle/schema/opencok_kingdom/worldpoint";
import { command_receipt } from "@opencok/drizzle/schema/opencok_kingdom/command_receipt";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { game_identity } from "@opencok/drizzle/schema/opencok_global/game_identity";
import { character_provisioning } from "@opencok/drizzle/schema/opencok_global/character_provisioning";
import { acquireRealmAuthority } from "@opencok/repositories/realm-authority";
import { createCharacterCreator } from "@opencok/repositories/character-provisioning";
import { createProvisioningStore } from "@opencok/repositories/provisioning";
import { CharacterProvisioningService, ProvisioningService } from "@opencok/services/provisioning";
import {
  CharacterProvisioningController,
  ProvisioningController,
} from "@opencok/controllers/provisioning";
import {
  characterProvisioningHandler,
  provisioningHandler,
  realmProvisioner,
} from "@opencok/connection/provisioning";
import { loadRules } from "@opencok/resources/rules";
import { provisionHash } from "@opencok/rules/provisioning";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

test("creation coordinates durable global reservations and atomic realm seeds across retries and ownership changes", async () => {
  const pg = new DisposablePostgres();
  const containers: string[] = [];
  let runtime: Awaited<ReturnType<typeof startServer>> | undefined;
  let client: Client | undefined;
  let global: ReturnType<typeof createDatabase<"global">> | undefined;
  let otherRealm: ReturnType<typeof createDatabase<"kingdom">> | undefined;
  let realm: ReturnType<typeof createDatabase<"kingdom">> | undefined;
  try {
    const admin = await pg.start();
    await admin.query('CREATE DATABASE "creation_global"');
    await admin.query('CREATE DATABASE "creation_realm"');
    await admin.query('CREATE DATABASE "creation_other"');
    await admin.end();
    global = createDatabase("global", { ...pg.options, database: "creation_global", max: 8 });
    realm = createDatabase("kingdom", { ...pg.options, database: "creation_realm", max: 8 });
    await Promise.all([
      migrate(global.db, {
        migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
          .pathname,
      }),
      migrate(realm.db, {
        migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
          .pathname,
      }),
    ]);
    otherRealm = createDatabase("kingdom", { ...pg.options, database: "creation_other", max: 4 });
    await migrate(otherRealm.db, {
      migrationsFolder: new URL("../../../packages/drizzle/migrations/kingdom", import.meta.url)
        .pathname,
    });
    const rules = await loadRules();
    let ready = true;
    const authority = await acquireRealmAuthority(realm.db, 1, () => ready);
    await seedSyntheticWorldBirth(realm.db, authority, rules);
    const creator = createCharacterCreator(realm.db, authority, 10);
    const service = new CharacterProvisioningService(creator, rules);
    let store = createProvisioningStore(global.db);
    const identity = { issuer: "https://securetoken.google.com/synthetic", subject: "first" };
    const input = { kingdomId: 1, deviceUuid: "synthetic-first", country: "BR", language: "pt" };
    const secret = "synthetic-provisioning-secret-for-tests";
    const handler = characterProvisioningHandler(
      new CharacterProvisioningController(service),
      secret,
    );
    const send = async (url: URL, init?: RequestInit) => handler(new Request(url.href, init));
    const connector = realmProvisioner("http://realm/_internal/characters", secret, 3000, send);
    const application = new ProvisioningService(
      { verify: async () => identity },
      store,
      new Map([[1, connector]]),
    );
    const api = provisioningHandler(new ProvisioningController(application));
    const call = () =>
      api(
        new Request("http://api/api/v1/characters", {
          method: "POST",
          headers: { Authorization: "Bearer synthetic" },
          body: JSON.stringify(input),
        }),
      );
    expect((await call()).status).toBe(202);
    expect(await global.db.select().from(account_new)).toHaveLength(0);
    const reservation = (await store.reserve(identity, input)).reservation;
    expect(await realm.db.select().from(userprofile)).toHaveLength(0);
    await realm.db.insert(worldpoint).values(
      Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        worldId: 0,
        x: index % 10,
        y: Math.floor(index / 10),
        areaId: 0,
        resLevel: 0,
        resInitValue: 0,
        pointType: 0,
        gridType: 0,
        grid2Type: 0,
      })),
    );
    expect((await call()).status).toBe(202);
    expect(await realm.db.select().from(userprofile)).toHaveLength(0);
    await realm.db.update(worldpoint).set({ gridType: 2 });
    const lost = new ProvisioningService(
      { verify: async () => identity },
      store,
      new Map([
        [
          1,
          {
            async create(value) {
              await connector.create(value);
              throw new Error("Synthetic lost response");
            },
          },
        ],
      ]),
    );
    expect((await lost.create("synthetic", input)).state).toBe("pending");
    expect(await global.db.select().from(account_new)).toHaveLength(0);
    expect(await realm.db.select().from(command_receipt)).toHaveLength(1);
    await global.db.execute(
      sql`CREATE FUNCTION opencok_global.reject_creation_mapping() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN RAISE EXCEPTION ''synthetic global rollback''; END'`,
    );
    await global.db.execute(
      sql`CREATE TRIGGER reject_creation_mapping BEFORE INSERT ON opencok_global.usermapping FOR EACH ROW EXECUTE FUNCTION opencok_global.reject_creation_mapping()`,
    );
    expect((await call()).status).toBe(503);
    expect(await global.db.select().from(account_new)).toHaveLength(0);
    expect((await global.db.select().from(character_provisioning))[0]!.state).toBe(0);
    await global.db.execute(
      sql`DROP TRIGGER reject_creation_mapping ON opencok_global.usermapping`,
    );
    const answers = await Promise.all(Array.from({ length: 8 }, () => call()));
    expect(answers.every((response) => response.status === 200)).toBe(true);
    const replies = await Promise.all(
      answers.map((response) => response.json() as Promise<{ gameUid: string }>),
    );
    expect(new Set(replies.map((reply) => reply.gameUid))).toEqual(new Set([reservation.gameUid]));
    expect(await global.db.select().from(account_new)).toHaveLength(1);
    expect(await realm.db.select().from(command_receipt)).toHaveLength(1);
    const [profile] = await realm.db.select().from(userprofile);
    const [resources] = await realm.db.select().from(user_resource);
    expect(profile).toMatchObject({
      uid: reservation.gameUid,
      level: 1,
      exp: 0,
      gold: 1000n,
      crystal: 0n,
    });
    expect(resources).toMatchObject({
      wood: 100000n,
      food: 100000n,
      stone: 0n,
      iron: 0n,
      silver: 0,
    });
    const buildings = await realm.db.select().from(user_building);
    expect(buildings).toHaveLength(11);
    expect(buildings.every((building) => building.level === 1 && building.star === 0)).toBe(true);
    expect(
      (await realm.db.select().from(worldpoint).where(eq(worldpoint.ownerId, reservation.gameUid)))
        .map((point) => point.pointType)
        .sort(),
    ).toEqual([1, 8, 8, 8]);
    const nativeCity = await realm.db
      .select()
      .from(worldpoint)
      .where(eq(worldpoint.ownerId, reservation.gameUid));
    const nativeAnchor = nativeCity.find((point) => point.pointType === 1)!.id;
    expect(nativeAnchor).toBeGreaterThan(10);
    expect(profile!.worldPoint).toBe(nativeAnchor);
    expect(nativeCity.map((point) => point.id).sort((a, b) => a - b)).toEqual([
      nativeAnchor - 11,
      nativeAnchor - 10,
      nativeAnchor - 1,
      nativeAnchor,
    ]);
    expect(
      nativeCity
        .filter((point) => point.pointType === 8)
        .every((point) => point.pointItem === String(nativeAnchor)),
    ).toBe(true);
    await realm.db
      .update(userprofile)
      .set({ gold: 17n, level: 2 })
      .where(eq(userprofile.uid, reservation.gameUid));
    await service.create(reservation);
    expect((await realm.db.select().from(userprofile))[0]).toMatchObject({ gold: 17n, level: 2 });
    await expect(service.create({ ...reservation, country: "US" })).rejects.toThrow();
    await expect(store.reserve({ ...identity, subject: "other" }, input)).rejects.toThrow(
      "Device already bound",
    );
    const second = (
      await store.reserve({ ...identity, subject: "second" }, { ...input, deviceUuid: "second" })
    ).reservation;
    await realm.db.execute(
      sql`CREATE FUNCTION opencok_kingdom.reject_creation() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN RAISE EXCEPTION ''synthetic rollback''; END'`,
    );
    await realm.db.execute(
      sql`CREATE TRIGGER reject_creation BEFORE INSERT ON opencok_kingdom.command_receipt FOR EACH ROW EXECUTE FUNCTION opencok_kingdom.reject_creation()`,
    );
    await expect(service.create(second)).rejects.toThrow();
    expect(await realm.db.select().from(userprofile)).toHaveLength(1);
    expect(
      await realm.db.select().from(worldpoint).where(eq(worldpoint.ownerId, second.gameUid)),
    ).toHaveLength(0);
    await realm.db.execute(sql`DROP TRIGGER reject_creation ON opencok_kingdom.command_receipt`);
    await expect(
      store.activate(identity, reservation, {
        gameUid: reservation.gameUid,
        kingdomId: 1,
        requestHash: "0".repeat(64),
      }),
    ).rejects.toThrow("receipt mismatch");
    await expect(service.create({ ...second, gameUid: reservation.gameUid })).rejects.toThrow();
    await service.create(second);
    await expect(service.create({ ...second, kingdomId: 2 })).rejects.toThrow();
    const otherReservation = (await store.reserve(identity, { ...input, kingdomId: 2 }))
      .reservation;
    await otherRealm.db.insert(worldpoint).values(
      [0, 1, 10, 11].map((offset) => ({
        id: offset + 1,
        worldId: 0,
        x: offset % 10,
        y: Math.floor(offset / 10),
        areaId: 0,
        gridType: 2,
        grid2Type: 0,
        pointType: 0,
        resLevel: 0,
        resInitValue: 0,
      })),
    );
    const otherAuthority = await acquireRealmAuthority(otherRealm.db, 2, () => true);
    await seedSyntheticWorldBirth(otherRealm.db, otherAuthority, rules);
    const otherService = new CharacterProvisioningService(
      createCharacterCreator(otherRealm.db, otherAuthority, 10),
      await loadRules(undefined, 2),
    );
    const otherReceipt = await otherService.create(otherReservation);
    await store.activate(identity, otherReservation, otherReceipt);
    expect((await otherRealm.db.select().from(userprofile))[0]).toMatchObject({
      uid: otherReservation.gameUid,
      serverId: 2,
      gold: 1000n,
    });
    expect(
      await realm.db
        .select()
        .from(userprofile)
        .where(eq(userprofile.uid, otherReservation.gameUid)),
    ).toHaveLength(0);
    await otherRealm.close();
    otherRealm = undefined;
    await expect(store.reserve(identity, { ...input, kingdomId: 3 })).rejects.toThrow("limit");
    await global.db
      .update(game_identity)
      .set({ disabled: 1 })
      .where(eq(game_identity.id, reservation.identityId));
    await expect(application.create("synthetic", input)).rejects.toThrow("Identity unavailable");
    ready = false;
    await expect(service.create(second)).rejects.toThrow();
    ready = true;
    const replacement = await acquireRealmAuthority(realm.db, 1, () => true);
    await expect(service.create(second)).rejects.toThrow();
    const replacementService = new CharacterProvisioningService(
      createCharacterCreator(realm.db, replacement, 10),
      rules,
    );
    expect(await replacementService.create(second)).toEqual({
      gameUid: second.gameUid,
      kingdomId: 1,
      requestHash: provisionHash(second),
    });
    expect(
      (await global.db.select().from(character_provisioning)).filter((row) => row.state === 1),
    ).toHaveLength(2);
    const distinct = await Promise.all(
      Array.from({ length: 6 }, async (_, index) => {
        const value = (
          await store.reserve(
            { ...identity, subject: `parallel-${index}` },
            { ...input, deviceUuid: `parallel-${index}` },
          )
        ).reservation;
        await replacementService.create(value);
        return value;
      }),
    );
    for (const value of distinct)
      {expect(
        await realm.db.select().from(worldpoint).where(eq(worldpoint.ownerId, value.gameUid)),
      ).toHaveLength(4);}
    await global.close();
    await realm.close();
    await pg.restart();
    global = createDatabase("global", { ...pg.options, database: "creation_global", max: 8 });
    realm = createDatabase("kingdom", { ...pg.options, database: "creation_realm", max: 8 });
    store = createProvisioningStore(global.db);
    expect(
      (await store.reserve({ ...identity, subject: "second" }, { ...input, deviceUuid: "second" }))
        .reservation,
    ).toEqual(second);
    expect(await realm.db.select().from(command_receipt)).toHaveLength(8);
    const endpoint = async (name: string, port: number) =>
      Number(
        Buffer.from(await pg.docker(["port", name, `${port}/tcp`]))
          .toString()
          .trim()
          .split(":")
          .at(-1),
      );
    for (const [image, port] of [
      ["redis:6.2.24-bookworm", 6379],
      ["zookeeper:3.4.14", 2181],
    ] as const) {
      const name = `opencok-creation-${randomUUID()}`;
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
    await Bun.sleep(1500);
    runtime = await startServer(
      {
        host: "127.0.0.1",
        port: 0,
        healthPort: 0,
        kingdomId: 1,
        kingdomDatabase: "creation_realm",
        globalDatabase: "creation_global",
        databaseUrl: url.href,
        redisUrl: `redis://127.0.0.1:${await endpoint(containers[0]!, 6379)}/0`,
        zookeeper: `127.0.0.1:${await endpoint(containers[1]!, 2181)}`,
        zkPath: "/opencok-experiment/COK1",
        loginSecret: "synthetic-login",
        mapSize: 10,
        timeoutMs: 5000,
        provisioningSecret: secret,
      },
      rules,
    );
    const liveConnector = realmProvisioner(
      `http://127.0.0.1:${runtime.healthPort}/_internal/characters`,
      secret,
      5000,
    );
    const liveApplication = new ProvisioningService(
      { verify: async () => ({ ...identity, subject: "second" }) },
      store,
      new Map([[1, liveConnector]]),
    );
    expect(
      (await liveApplication.create("synthetic", { ...input, deviceUuid: "second" })).state,
    ).toBe("ready");
    client = new Client(runtime.port);
    await client.handshake();
    expect(
      (
        await client.login(
          "synthetic-login",
          second.gameUid,
          "second",
          "12.06.0",
          String(Date.now()),
          "Google",
        )
      ).zn?.value,
    ).toBe("COK1");
    const init = fields((await client.next()).p);
    expect(str(init, "c")).toBe("init");
    const data = fields(init.p);
    expect(fields(data.user).gold?.value).toBe(1000n);
    expect(fields(data.resource).wood?.value).toBe(100000n);
    expect(fields(data.resource).food?.value).toBe(100000n);
    expect((await client.command("build.info")).building?.value).toHaveLength(11);
    const built = await client.command("build.create", {
      itemId: sfs.string("413000"),
      pos: sfs.int(20),
      gold: sfs.int(1),
      operationId: sfs.string(randomUUID()),
    });
    expect(built.level?.value).toBe(1);
    const trained = await client.command("army.add", {
      id: sfs.string("107000"),
      num: sfs.int(1),
      gold: sfs.bool(false),
      operationId: sfs.string(randomUUID()),
    });
    const trainingQueue = fields(trained.queue);
    await client.command("queue.ccd", {
      qUUID: trainingQueue.uuid!,
      activityId: trainingQueue.activityId!,
      isGold: sfs.int(1),
      operationId: sfs.string(randomUUID()),
    });
    expect(
      (await realm.db.select().from(user_army).where(eq(user_army.uid, second.gameUid)))[0]!.free,
    ).toBe(1);
    await realm.db
      .insert(user_hospital)
      .values({ uid: second.gameUid, armyId: "107000", dead: 5, heal: 0 });
    const cured = await client.command("hospital.cd", {
      "107000": sfs.int(3),
      operationId: sfs.string(randomUUID()),
    });
    expect(cured.cure?.value).toBe(3);
    const dismissed = await client.command("army.fire", {
      id: sfs.string("107000"),
      num: sfs.int(1),
      operationId: sfs.string(randomUUID()),
    });
    expect(dismissed.free?.value).toBe(3);
    const technology = await client.command("science.data.init");
    expect((technology.science!.value as unknown[]).length).toBeGreaterThan(100);
    const military = await client.command("login.other", { army: sfs.int(1) });
    expect((military.army!.value as unknown[]).length).toBeGreaterThan(10);
    expect((military.hospital!.value as unknown[]).length).toBe(1);
    client.close();
    client = new Client(runtime.port);
    await client.handshake();
    expect(
      (
        await client.login(
          "synthetic-login",
          second.gameUid,
          "second",
          "12.06.0",
          String(Date.now()),
          "Google",
        )
      ).zn?.value,
    ).toBe("COK1");
    const reconnected = fields(fields((await client.next()).p).p);
    expect(
      fields((reconnected.army!.value as ReturnType<typeof sfs.object>[])[0]).free?.value,
    ).toBe(3);
    expect(
      fields((reconnected.hospital!.value as ReturnType<typeof sfs.object>[])[0]).dead?.value,
    ).toBe(2);
    expect((await client.command("build.info")).building?.value).toHaveLength(12);

    client.close();
    client = undefined;
    await runtime.close();
    runtime = undefined;
  } finally {
    client?.close();
    await runtime?.close();
    for (const name of containers) {await pg.docker(["rm", "-f", name]).catch(() => undefined);}
    await Promise.allSettled([global?.close(), realm?.close(), otherRealm?.close()]);
    await pg.stop();
  }
}, 120000);
