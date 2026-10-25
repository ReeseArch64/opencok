import { expect, test } from "bun:test";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { avatar_version_update } from "@opencok/drizzle/schema/opencok_kingdom/avatar_version_update";
import { account_new } from "@opencok/drizzle/schema/opencok_global/account_new";
import { moderateAvatar } from "@opencok/repositories/avatar-moderation";
import { createChatAvatarProfileStore } from "@opencok/repositories/chat-avatar-profile";
import { avatarVersionProfile } from "@opencok/rules/avatar-version";
import { createAvatarRuntime } from "../src/avatar.ts";
import { createRealmNotifications } from "@opencok/connection/notifications";
import { Rules } from "@opencok/rules/game";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";

function loseCommit(pool: ReturnType<typeof createDatabases>["global"]["pool"], statement: string) {
  const originalConnect = pool.connect;
  const connect = pool.connect.bind(pool);
  let armed = true;
  Object.defineProperty(pool, "connect", {
    configurable: true,
    value: (...connectArgs: unknown[]) => {
      if (connectArgs.length) return Reflect.apply(originalConnect, pool, connectArgs);
      return connect().then((client) => {
        let touched = false;
        return {
          async query(...args: unknown[]) {
            const first = args[0];
            const text =
              typeof first === "string"
                ? first
                : first && typeof first === "object" && "text" in first
                  ? first.text
                  : undefined;
            if (typeof text === "string" && text.startsWith("begin")) touched = false;
            if (typeof text === "string" && text.trimStart().startsWith(statement)) touched = true;
            const result = await Reflect.apply(client.query, client, args);
            if (armed && touched && text === "commit") {
              armed = false;
              throw new Error("Synthetic lost commit response");
            }
            return result;
          },
          release: (destroy?: boolean) => client.release(destroy),
        };
      });
    },
  });
  return {
    restore: () => Object.defineProperty(pool, "connect", { value: originalConnect }),
    fired: () => !armed,
  };
}

const operation = () => randomBytes(16).toString("hex");
test("operator moderation is atomic, fenced, replayable and orders state changes independently of time or sequence", async () => {
  const pg = new DisposablePostgres();
  let databases: ReturnType<typeof createDatabases> | undefined;
  try {
    const admin = await pg.start();
    try {
      for (const name of ["moderation_global", "moderation_realm"])
        await admin.query(`create database "${name}"`);
    } finally {
      await admin.end();
    }
    databases = createDatabases(pg.options, {
      globalDatabase: "moderation_global",
      kingdoms: [{ id: 1, database: "moderation_realm" }],
    });
    const realm = databases.getKingdom(1);
    await migrateDatabase(databases.global.pool, "global");
    await migrateDatabase(realm.pool, "kingdom");
    await realm.db.insert(userprofile).values(
      ["1001", "1002", "1003"].map((uid) => ({
        uid,
        name: "Synthetic",
        pf: "synthetic",
        level: 1,
        exp: 0,
        country: "BR",
        serverId: uid === "1003" ? 2 : 1,
        picVer: 2000004,
      })),
    );
    await databases.global.db.insert(account_new).values({
      gameUid: "1001",
      server: "1",
      gameUserLevel: 1,
      lastTime: 0n,
      uuid: "synthetic-device",
    });
    await realm.db.insert(pic_upload_record).values({
      uid: "1001",
      picVer: 4,
      report: 9,
      banCount: 2,
      banTime: 5n,
      updateTime: 6n,
      stat: 0,
    });
    const request = {
      owner: "1001",
      operationId: operation(),
      expectedPicVer: 2000004,
      decision: "reject" as const,
    };
    const results = await Promise.all([
      moderateAvatar(realm.db, 1, request, 1000, "60"),
      moderateAvatar(realm.db, 1, request, 1000, "60"),
    ]);
    expect(results[0]).toEqual(results[1]);
    expect(results[0]).toMatchObject({ picVer: 3000004, changed: true });
    expect(
      (await realm.db.select().from(pic_upload_record).where(eq(pic_upload_record.uid, "1001")))[0],
    ).toMatchObject({
      picVer: 4,
      report: 9,
      banCount: 3,
      banTime: 181000n,
      updateTime: 1000n,
      stat: 2,
    });
    await expect(
      moderateAvatar(realm.db, 1, { ...request, decision: "approve" }, 1001, "60"),
    ).rejects.toThrow("conflict");
    await expect(
      moderateAvatar(realm.db, 1, { ...request, operationId: operation() }, 1001, "60"),
    ).rejects.toThrow("version changed");
    await expect(
      moderateAvatar(
        realm.db,
        1,
        { ...request, owner: "1003", operationId: operation() },
        1001,
        "60",
      ),
    ).rejects.toThrow("owner unavailable");
    const repeated = await moderateAvatar(
      realm.db,
      1,
      { ...request, operationId: operation(), expectedPicVer: 3000004 },
      2000,
      "bad",
    );
    expect(repeated.changed).toBe(false);
    await moderateAvatar(
      realm.db,
      1,
      { ...request, operationId: operation(), expectedPicVer: 3000004, decision: "approve" },
      2000,
      undefined,
    );
    expect(
      (await realm.db.select().from(pic_upload_record).where(eq(pic_upload_record.uid, "1001")))[0],
    ).toMatchObject({ picVer: 4, report: 9, banCount: 3, banTime: 0n, updateTime: 1000n, stat: 1 });
    expect(
      (await realm.db.select().from(userprofile).where(eq(userprofile.uid, "1001")))[0]!.picVer,
    ).toBe(3000004);
    const entries = await realm.db
      .select()
      .from(avatar_version_update)
      .where(eq(avatar_version_update.ownerUid, "1001"));
    const first = entries.find((e) => e.operationId === request.operationId)!;
    expect(first.revision).toBe(1n);
    const chat = createChatAvatarProfileStore(databases.global.db);
    const update = avatarVersionProfile(first, 1);
    expect(await chat.publish(update)).toBe("applied");
    expect(await chat.publish(update)).toBe("unchanged");
    const rollbackClock = {
      ...update,
      revision: 2n,
      picVer: 2000001,
      sequence: 1,
      committedAt: 1n,
      updatedAt: "0",
    };
    expect(await chat.publish(rollbackClock)).toBe("applied");
    expect(await chat.publish(update)).toBe("superseded");
    await expect(chat.publish({ ...rollbackClock, picVer: 3000001 })).rejects.toThrow(
      "Conflicting",
    );
    expect(
      await chat.publish({
        ...rollbackClock,
        revision: 9007199254740993n,
        sequence: 0,
        picVer: 3000000,
      }),
    ).toBe("applied");
    expect((await chat.find("1001", 1))!.revision).toBe(9007199254740993n);
    await realm.pool.query(
      "CREATE FUNCTION reject_avatar_intent() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Synthetic failure'; END $$",
    );
    await realm.pool.query(
      "CREATE TRIGGER reject_avatar_intent BEFORE INSERT ON opencok_kingdom.avatar_version_update FOR EACH ROW EXECUTE FUNCTION reject_avatar_intent()",
    );
    try {
      await expect(
        moderateAvatar(
          realm.db,
          1,
          { ...request, owner: "1002", operationId: operation() },
          1000,
          "60",
        ),
      ).rejects.toThrow();
    } finally {
      await realm.pool.query(
        "DROP TRIGGER reject_avatar_intent ON opencok_kingdom.avatar_version_update",
      );
    }
    expect(
      (await realm.db.select().from(userprofile).where(eq(userprofile.uid, "1002")))[0]!.picVer,
    ).toBe(2000004);
    expect(
      await realm.db.select().from(pic_upload_record).where(eq(pic_upload_record.uid, "1002")),
    ).toEqual([]);
    expect(
      (
        await realm.pool.query(
          'select revision from opencok_kingdom.avatar_publication where "ownerUid"=$1',
          ["1002"],
        )
      ).rows,
    ).toEqual([]);
    const uncertain = { ...request, owner: "1002", operationId: operation() };
    const fault = loseCommit(realm.pool, 'insert into "opencok_kingdom"."avatar_version_update"');
    try {
      await expect(moderateAvatar(realm.db, 1, uncertain, 1000, "60")).rejects.toThrow();
    } finally {
      fault.restore();
    }
    expect(fault.fired()).toBe(true);
    expect(await moderateAvatar(realm.db, 1, uncertain, 2000, "60")).toMatchObject({
      picVer: 3000004,
      changed: true,
    });
    expect(
      (await realm.db.select().from(pic_upload_record).where(eq(pic_upload_record.uid, "1002")))[0],
    ).toMatchObject({ banCount: 1, banTime: 61000n });
    const notifications = createRealmNotifications();
    const pushes: unknown[] = [];
    const failures: string[] = [];
    const runtime = createAvatarRuntime({
      db: { kingdom: realm },
      rules: new Rules(new Map(), new Map(), new Map()),
      files: { find: async () => null, issue: () => "unused" },
      config: {
        kingdomId: 1,
        timeoutMs: 1000,
        avatarChat: {
          url: "http://127.0.0.1/_internal/avatar-profile",
          signingSecret: "synthetic",
        },
      },
      cache: { publishPlayerUpdateTime: async () => {} },
      notifications,
      report: (e) => failures.push(e),
      fetch: async () => {
        throw new Error("Synthetic Chat outage");
      },
    });
    notifications.subscribe("1001", async (command, body) => {
      pushes.push({ command, body });
      return true;
    });
    await runtime.versionService.deliver("1001", first.operationId);
    expect(pushes).toHaveLength(1);
    expect(failures).toContain("chat");
    expect(pushes[0]).toMatchObject({
      command: "push.picVer.update",
      body: { picVer: { value: 3000004 } },
    });
    expect(
      (
        await realm.db
          .select()
          .from(avatar_version_update)
          .where(eq(avatar_version_update.operationId, first.operationId))
      )[0]!.pendingEffects & 8,
    ).toBe(0);
    await runtime.versionService.deliver("1001", first.operationId);
    expect(pushes).toHaveLength(1);
    await realm.db.update(userprofile).set({ picVer: 2000005 }).where(eq(userprofile.uid, "1001"));
    await realm.pool.query(
      'update opencok_kingdom.avatar_publication set revision=9223372036854775807 where "ownerUid"=$1',
      ["1001"],
    );
    await expect(
      moderateAvatar(
        realm.db,
        1,
        { ...request, expectedPicVer: 2000005, operationId: operation() },
        3000,
        "60",
      ),
    ).rejects.toThrow();
    expect(
      (await realm.db.select().from(userprofile).where(eq(userprofile.uid, "1001")))[0]!.picVer,
    ).toBe(2000005);
    expect(
      (await realm.db.select().from(pic_upload_record).where(eq(pic_upload_record.uid, "1001")))[0]!
        .banCount,
    ).toBe(3);
  } finally {
    await databases?.close();
    await pg.stop();
  }
}, 60000);
