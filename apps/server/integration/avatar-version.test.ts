import { expect, test } from "bun:test";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { user_building } from "@opencok/drizzle/schema/opencok_kingdom/user_building";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { avatar_version_update } from "@opencok/drizzle/schema/opencok_kingdom/avatar_version_update";
import { avatar_completion } from "@opencok/drizzle/schema/opencok_kingdom/avatar_completion";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import {
  commitAvatarVersion,
  publishAvatarVersionEffect,
} from "@opencok/repositories/avatar-version";
import { createChatAvatarProfileStore } from "@opencok/repositories/chat-avatar-profile";
import { createChatAvatarProfileHandler } from "@opencok/controllers/chat-avatar-profile";
import { GameService as Game } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs } from "@opencok/messages/sfs";
import { createRealmNotifications } from "@opencok/connection/notifications";
import { Cache } from "@opencok/storage/session";
import { eq } from "drizzle-orm";
import { createAvatarRuntime } from "../src/avatar.ts";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { DisposableRedis } from "./support/redis.ts";

test("avatar allocation commits atomically, serializes requests and recovers real mail/cache/chat delivery", async () => {
  const pg = new DisposablePostgres();
  const redis = new DisposableRedis();
  const topology = {
    globalDatabase: "avatar_global",
    kingdoms: [{ id: 1, database: "avatar_realm" }],
  };
  let databases: ReturnType<typeof createDatabases> | undefined;
  try {
    const admin = await pg.start();
    try {
      for (const name of ["avatar_global", "avatar_realm"])
        await admin.query(`CREATE DATABASE "${name}"`);
    } finally {
      await admin.end();
    }
    databases = createDatabases(pg.options, topology);
    await migrateDatabase(databases.global.pool, "global");
    await migrateDatabase(databases.getKingdom(1).pool, "kingdom");
    const realm = () => databases!.getKingdom(1);
    const profile = async (uid: string) =>
      (await realm().db.select().from(userprofile).where(eq(userprofile.uid, uid)))[0]!;
    const intents = async (uid: string) =>
      realm()
        .db.select()
        .from(avatar_version_update)
        .where(eq(avatar_version_update.ownerUid, uid));
    let now = 1792756800123;
    await realm()
      .db.insert(userprofile)
      .values(
        ["1001", "1002", "1003", "1004", "1999"].map((uid) => ({
          uid,
          name: `Synthetic ${uid}`,
          country: "BR",
          level: 1,
          exp: 0,
          pf: "synthetic",
          serverId: uid === "1999" ? 2 : 1,
          picVer: uid === "1001" ? 1000004 : 2000000,
          banTime: 0n,
          banFlag: 0,
        })),
      );
    await databases.global.db.insert(account_new).values(
      ["1001", "1002"].map((gameUid) => ({
        gameUid,
        server: "1",
        uuid: "synthetic-device",
        gameUserLevel: 1,
        lastTime: 0n,
      })),
    );
    await realm()
      .db.insert(user_building)
      .values({ uuid: "castle", uid: "1001", itemId: 400000, pos: 0, level: 10 });
    await realm()
      .db.insert(pic_upload_record)
      .values({
        uid: "1001",
        picVer: 1000004,
        report: 3,
        updateTime: BigInt(now - 60000),
        banCount: 2,
        banTime: BigInt(now - 1),
        stat: 9,
      });
    const cache = new Cache({ redisUrl: await redis.start(), timeoutMs: 500, kingdomId: 1 });
    const rules = new Rules(new Map(), new Map(), new Map());
    rules.items.set("function_on5", { k2: "1" });
    rules.items.set("hero", { k9: "10", k7: "60" });
    rules.mail.set("10111", {
      title: "Allocated",
      sender: "Synthetic",
      message: "Review pending",
      type: "2",
    });
    const reports: string[] = [];
    let cacheDown = true,
      chatDown = true;
    const files = {
      issue(): never {
        throw new Error("Allocation must not issue an upload grant");
      },
      async find(): Promise<never> {
        throw new Error("Allocation must not inspect an asset");
      },
    };
    const secret = "synthetic-allocation-chat-secret";
    const runtime = () =>
      createAvatarRuntime({
        db: { kingdom: { db: realm().db } },
        files,
        rules,
        config: {
          kingdomId: 1,
          timeoutMs: 1000,
          avatarChat: {
            url: "http://chat.internal/_internal/avatar-profile",
            signingSecret: secret,
          },
        },
        cache: {
          async publishPlayerUpdateTime(owner, time) {
            if (cacheDown) throw new Error("Synthetic cache outage");
            await cache.publishPlayerUpdateTime(owner, time);
          },
        },
        notifications: createRealmNotifications(),
        report: (effect) => {
          reports.push(effect);
        },
        now: () => now,
        async fetch(_, options) {
          if (chatDown) throw new Error("Synthetic chat outage");
          const receive = createChatAvatarProfileHandler({
            profiles: createChatAvatarProfileStore(databases!.global.db),
            signingSecret: secret,
            now: () => now,
          });
          let status = 0,
            body = "";
          await receive(
            {
              headers: options.headers,
              async *[Symbol.asyncIterator]() {
                yield Buffer.from(String(options.body));
              },
            } as unknown as IncomingMessage,
            {
              writeHead(code: number) {
                status = code;
              },
              end(value: string) {
                body = value;
              },
            } as unknown as ServerResponse,
          );
          return new Response(body, { status, headers: { "content-type": "application/json" } });
        },
      });
    let live = runtime();
    const game = new Game({} as GameStore, rules, { kingdomId: 1 }, () => now, {
      avatarVersion: live.versionService,
    });
    const result = await game.execute("1001", "user.update.picVer", {
      uid: sfs.string("1002"),
      picVer: sfs.int(999999),
      _cok_: sfs.string("request"),
    });
    expect(decode(encode(result.body))).toEqual({
      uid: sfs.string("1001"),
      picVer: sfs.int(5),
      nextUpdateTime: sfs.long(now + 60000),
      _cok_: sfs.string("request"),
    });
    expect((await profile("1001")).picVer).toBe(5);
    expect(await realm().db.select().from(pic_upload_record)).toEqual([
      {
        uid: "1001",
        picVer: 5,
        report: 0,
        updateTime: BigInt(now),
        banCount: 2,
        banTime: BigInt(now - 1),
        stat: 0,
      },
    ]);
    const first = (await intents("1001"))[0]!;
    expect(first.pendingEffects).toBe(6);
    expect(Object.keys(first).sort()).toEqual(
      [
        "revision",
        "operationId",
        "ownerUid",
        "picVer",
        "committedAt",
        "nextUpdateTime",
        "effects",
        "pendingEffects",
      ].sort(),
    );
    expect((await realm().db.select().from(mail)).length).toBe(1);
    expect(await realm().db.select().from(avatar_completion)).toEqual([]);
    expect(reports).toEqual(["profile", "chat"]);
    let aborted: AbortSignal | undefined;
    await expect(
      publishAvatarVersionEffect(
        2,
        realm().db,
        1,
        "1001",
        first.operationId,
        async (_, signal) => {
          aborted = signal;
          await new Promise<void>(() => {});
        },
        100,
      ),
    ).rejects.toThrow();
    expect(aborted?.aborted).toBe(true);
    expect((await intents("1001"))[0]!.pendingEffects).toBe(6);
    await databases.close();
    databases = undefined;
    await pg.restart();
    databases = createDatabases(pg.options, topology);
    live = runtime();
    expect(await live.nextVersion()).toEqual({ owner: "1001", operationId: first.operationId });
    cacheDown = false;
    chatDown = false;
    await live.versionService.deliver("1001", first.operationId);
    await live.versionService.deliver("1001", first.operationId);
    expect((await intents("1001"))[0]!.pendingEffects).toBe(0);
    expect((await realm().db.select().from(mail)).length).toBe(1);
    expect((await cache.playerUpdateTimes(1, ["1001"])).get("1001")).toBe(
      String(Math.floor(now / 1000)),
    );
    expect((await createChatAvatarProfileStore(databases.global.db).find("1001", 1))!.picVer).toBe(
      5,
    );
    rules.items.set("function_on5", { k2: "0" });
    const pool = realm().pool;
    const originalConnect = pool.connect;
    const connect = pool.connect.bind(pool);
    let loseReply = true;
    Object.defineProperty(pool, "connect", {
      configurable: true,
      value: async () => {
        const client = await connect();
        return {
          async query(...args: unknown[]) {
            const result = await Reflect.apply(client.query, client, args);
            const query = args[0];
            const text =
              typeof query === "string"
                ? query
                : query && typeof query === "object" && "text" in query
                  ? query.text
                  : undefined;
            if (loseReply && text === "commit") {
              loseReply = false;
              throw new Error("Synthetic lost successful commit reply");
            }
            return result;
          },
          release: () => client.release(),
        };
      },
    });
    try {
      expect((await live.versionService.update("1004", now)).intent!.picVer).toBe(2000001);
    } finally {
      Object.defineProperty(pool, "connect", { configurable: true, value: originalConnect });
    }
    expect(loseReply).toBe(false);
    expect((await profile("1004")).picVer).toBe(2000001);
    expect((await intents("1004")).length).toBe(1);
    const allocated = await Promise.all(
      Array.from({ length: 20 }, () => live.versionService.update("1002", now)),
    );
    expect(allocated.map((entry) => entry.intent!.picVer).sort((a, b) => a - b)).toEqual(
      Array.from({ length: 20 }, (_, i) => 2000001 + i),
    );
    expect(new Set(allocated.map((entry) => entry.intent!.operationId)).size).toBe(20);
    expect((await profile("1002")).picVer).toBe(2000020);
    expect((await intents("1002")).length).toBe(20);
    await Promise.all(
      allocated.map((entry) => live.versionService.deliver("1002", entry.intent!.operationId)),
    );
    expect((await intents("1002")).every((entry) => entry.pendingEffects === 0)).toBe(true);
    expect((await createChatAvatarProfileStore(databases.global.db).find("1002", 1))!.picVer).toBe(
      2000020,
    );
    const recovered = await commitAvatarVersion(
      realm().db,
      1,
      "1002",
      allocated[0]!.intent!.operationId,
      now,
      async () => {
        throw new Error("Recovery must not re-inspect");
      },
      true,
    );
    expect(recovered.intent!.operationId).toBe(allocated[0]!.intent!.operationId);
    expect((await profile("1002")).picVer).toBe(2000020);
    await expect(
      commitAvatarVersion(
        realm().db,
        1,
        "1002",
        "a".repeat(32),
        now,
        async () => {
          throw new Error("Recovery must not allocate");
        },
        true,
      ),
    ).rejects.toThrow();
    for (const picVer of [null]) {
      await realm().db.update(userprofile).set({ picVer }).where(eq(userprofile.uid, "1003"));
      await expect(live.versionService.update("1003", now)).rejects.toThrow();
      expect((await profile("1003")).picVer).toBe(picVer);
      expect(await intents("1003")).toEqual([]);
    }
    for (const [before, after] of [
      [-1, 2000001],
      [999999, 3000000],
      [2999999, 3000000],
    ]) {
      await realm()
        .db.update(userprofile)
        .set({ picVer: before })
        .where(eq(userprofile.uid, "1003"));
      expect((await live.versionService.update("1003", now)).intent?.picVer).toBe(after);
    }
    expect((await live.versionService.update("1999", now)).intent).toBeUndefined();
    expect(await intents("1999")).toEqual([]);
    await realm()
      .db.update(userprofile)
      .set({ picVer: 0, banFlag: 1 })
      .where(eq(userprofile.uid, "1003"));
    expect((await live.versionService.update("1003", now)).intent).toBeUndefined();
    rules.items.set("function_on5", { k2: "1" });
    now += 60000;
    const previousProfile = await profile("1001");
    const previousRecord = await realm().db.select().from(pic_upload_record);
    await realm().pool.query(
      `CREATE FUNCTION reject_allocation() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Synthetic outbox failure'; END $$`,
    );
    await realm().pool.query(
      "CREATE TRIGGER reject_allocation BEFORE INSERT ON opencok_kingdom.avatar_version_update FOR EACH ROW EXECUTE FUNCTION reject_allocation()",
    );
    await expect(live.versionService.update("1001", now)).rejects.toThrow();
    expect(await profile("1001")).toEqual(previousProfile);
    expect(await realm().db.select().from(pic_upload_record)).toEqual(previousRecord);
    expect((await intents("1001")).length).toBe(1);
    expect((await realm().db.select().from(mail)).length).toBe(1);
    expect(await realm().db.select().from(avatar_completion)).toEqual([]);
  } finally {
    await databases?.close();
    await redis.stop();
    await pg.stop();
  }
}, 120000);
