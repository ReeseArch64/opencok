import { expect, test } from "bun:test";
import { createDatabase } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { pic_upload_record } from "@opencok/drizzle/schema/opencok_kingdom/pic_upload_record";
import { reportAvatar } from "../../../packages/repositories/src/avatar-report.ts";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { eq } from "drizzle-orm";

test("avatar reports persist atomic increments, legacy defaults and moderation isolation", async () => {
  const server = new DisposablePostgres();
  let database: ReturnType<typeof createDatabase<"kingdom">> | undefined;
  try {
    const admin = await server.start();
    try {
      await admin.query('CREATE DATABASE "avatar_reports"');
    } finally {
      await admin.end();
    }
    database = createDatabase("kingdom", { ...server.options, database: "avatar_reports", max: 8 });
    await migrateDatabase(database.pool, "kingdom");
    const db = database.db;
    await db.insert(userprofile).values([
      {
        uid: "reporter",
        name: "Reporter",
        country: "BR",
        exp: 0,
        level: 1,
        serverId: 1,
        banFlag: 0,
        banTime: 0n,
      },
      {
        uid: "second",
        name: "Second",
        country: "BR",
        exp: 0,
        level: 1,
        serverId: 1,
        banFlag: 0,
        banTime: 0n,
      },
      {
        uid: "foreign",
        name: "Foreign",
        country: "BR",
        exp: 0,
        level: 1,
        serverId: 2,
        banFlag: 0,
        banTime: 0n,
      },
      {
        uid: "banned",
        name: "Banned",
        country: "BR",
        exp: 0,
        level: 1,
        serverId: 1,
        banFlag: 1,
        banTime: 0n,
      },
    ]);
    const submit = (target: string, owner = "reporter") => reportAvatar(db, 1, owner, target, 1000);
    const read = async (uid: string) =>
      (await db.select().from(pic_upload_record).where(eq(pic_upload_record.uid, uid)))[0];
    await Promise.all(
      Array.from({ length: 20 }, (_, i) => submit("new", i % 2 ? "second" : "reporter")),
    );
    expect(await read("new")).toEqual({
      uid: "new",
      report: 20,
      picVer: -1,
      updateTime: 0n,
      banCount: 0,
      banTime: 0n,
      stat: 0,
    });
    const original = {
      uid: "Targeté",
      report: 2147483647,
      picVer: 123,
      updateTime: 456n,
      banCount: 7,
      banTime: 999n,
      stat: 8,
    };
    await db.insert(pic_upload_record).values(original);
    await submit("TARGETE ");
    expect(await read("Targeté")).toEqual({ ...original, report: -2147483648 });
    expect(await read("TARGETE ")).toBeUndefined();
    await db.insert(pic_upload_record).values({ uid: "null-counter", report: null });
    await submit("null-counter");
    expect((await read("null-counter"))!.report).toBe(1);
    await db.insert(pic_upload_record).values([{ uid: "alias" }, { uid: "ALIAS" }]);
    await expect(submit("Alias")).rejects.toThrow();
    expect((await read("alias"))!.report).toBe(0);
    expect((await read("ALIAS"))!.report).toBe(0);
    for (const owner of ["missing", "foreign", "banned"])
      await expect(submit("unauthorized-target", owner)).rejects.toThrow();
    expect(await read("unauthorized-target")).toBeUndefined();
    expect(
      (await db.select().from(userprofile).where(eq(userprofile.uid, "reporter")))[0]!.banFlag,
    ).toBe(0);
    await database.close();
    database = undefined;
    await server.restart();
    database = createDatabase("kingdom", { ...server.options, database: "avatar_reports" });
    expect(
      (
        await database.db.select().from(pic_upload_record).where(eq(pic_upload_record.uid, "new"))
      )[0]!.report,
    ).toBe(20);
  } finally {
    await database?.close();
    await server.stop();
  }
}, 120000);
