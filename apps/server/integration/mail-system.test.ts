import { expect, test } from "bun:test";
import { createDatabases } from "@opencok/drizzle";
import { userprofile } from "@opencok/drizzle/schema/opencok_kingdom/userprofile";
import { mail } from "@opencok/drizzle/schema/opencok_kingdom/mail";
import { mail_contents } from "@opencok/drizzle/schema/opencok_kingdom/mail_contents";
import { readSystemMail } from "@opencok/repositories/mail-system";
import { systemMailProjection } from "@opencok/services/mail-system";
import type { MailListEntry } from "@opencok/contracts/mail";
import { migrateDatabase } from "../../../packages/drizzle/scripts/migrate.ts";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { eq } from "drizzle-orm";

test("system-mail snapshots enforce ownership, inclusive anchors, limits and read-only presentation", async () => {
  const server = new DisposablePostgres();
  let databases: ReturnType<typeof createDatabases> | undefined;
  try {
    const admin = await server.start();
    try {
      for (const name of ["mail_global", "mail_one", "mail_two"])
        {await admin.query(`CREATE DATABASE "${name}"`);}
    } finally {
      await admin.end();
    }
    databases = createDatabases(server.options, {
      globalDatabase: "mail_global",
      kingdoms: [
        { id: 1, database: "mail_one" },
        { id: 2, database: "mail_two" },
      ],
    });
    await migrateDatabase(databases.global.pool, "global");
    for (const realm of databases.kingdoms.values()) {await migrateDatabase(realm.pool, "kingdom");}
    const db = databases.getKingdom(1).db;
    const profiles = [
      { uid: "self", serverId: 1, banFlag: 0 },
      { uid: "sender", serverId: 1, banFlag: 0 },
      { uid: "banned", serverId: 1, banFlag: 1 },
      { uid: "foreign", serverId: 2, banFlag: 0 },
    ].map((row) => ({ ...row, name: row.uid, country: "BR", exp: 0, level: 1, banTime: 0n }));
    await db.insert(userprofile).values(profiles);
    const entry = (uid: string, createTime: bigint, toUser = "self") => ({
      uid,
      createTime,
      toUser,
      type: 2,
      contents: Buffer.from("body"),
    });
    await db
      .insert(mail)
      .values([
        entry("a", 1000n),
        entry("c", 2000n),
        entry("b", 2000n),
        entry("z", 3000n),
        entry("other", 9000n, "someone-else"),
      ]);
    await databases.getKingdom(2).db.insert(mail).values(entry("other-realm", 1000n));
    const read = async (anchor: string | null, time = 0n, uid = "self") => {
      let entries: readonly MailListEntry[] = [];
      const state = await readSystemMail(
        databases!,
        1,
        uid,
        { anchor, time, now: 1000 },
        async (rows) => {
          entries = rows;
        },
      );
      return { state, entries, ids: entries.map((row) => row.uid) };
    };
    const before = await db.select().from(mail);
    expect((await read(null, 9000n)).ids).toEqual(["a", "b", "c", "z"]);
    expect((await read("b")).ids).toEqual(["b", "c", "z"]);
    expect((await read("other", 2000n)).ids).toEqual(["b", "c", "z"]);
    expect((await read("missing", 3000n)).ids).toEqual(["z"]);
    expect((await read("missing")).ids).toEqual(["a", "b", "c", "z"]);
    for (const uid of ["missing", "banned", "foreign"])
      {expect((await read(null, 0n, uid)).entries).toEqual([]);}
    expect(
      (
        await readSystemMail(
          databases,
          2,
          "self",
          { anchor: null, time: 0n, now: 1000 },
          async () => {
            throw new Error("Foreign owner reached inspector");
          },
        )
      ).profile,
    ).toBeUndefined();
    await readSystemMail(
      databases,
      1,
      "self",
      { anchor: null, time: 0n, now: 1000 },
      async (_, readers) => {
        await db
          .update(userprofile)
          .set({ name: "Changed concurrently" })
          .where(eq(userprofile.uid, "sender"));
        expect((await readers.senders(["sender"])).get("sender")!.name).toBe("sender");
      },
    );
    expect(
      (await db.select().from(userprofile).where(eq(userprofile.uid, "sender")))[0]!.name,
    ).toBe("Changed concurrently");
    expect(await db.select().from(mail)).toEqual(before);
    await db.insert(mail).values({ ...entry("extra", 4000n), contents: Buffer.from("extra") });
    const project = () =>
      readSystemMail(
        databases!,
        1,
        "self",
        { anchor: null, time: 0n, now: 1000 },
        async (rows, readers) => {
          await systemMailProjection("self", rows, readers, 100, 0n, {});
        },
      );
    await expect(project()).rejects.toThrow();
    await db
      .insert(mail_contents)
      .values({ uid: "extra", toUser: "someone-else", contents: Buffer.from("foreign body") });
    await expect(project()).rejects.toThrow();
    await db.update(mail_contents).set({ toUser: "self" }).where(eq(mail_contents.uid, "extra"));
    await project();
    await expect(
      readSystemMail(databases, 1, "self", { anchor: null, time: 0n, now: 1000 }, async () => {
        throw new Error("Synthetic serialization failure");
      }),
    ).rejects.toThrow();
    expect((await db.select().from(mail)).length).toBe(6);
    await db.insert(mail).values(Array.from({ length: 996 }, (_, i) => entry(`bulk-${i}`, 5000n)));
    await expect(read(null)).rejects.toThrow();
    await db.delete(mail).where(eq(mail.uid, "bulk-0"));
    expect((await read(null)).entries.length).toBe(1000);
    await db.update(mail).set({ contents: Buffer.alloc(5000, 97) });
    await expect(read(null)).rejects.toThrow();
  } finally {
    await databases?.close();
    await server.stop();
  }
}, 120000);
