import { expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { createDatabase } from "../src";
import { migrateDatabase } from "../scripts/migrate";
import { mail } from "../src/schema/opencok_kingdom/mail";
import { DisposablePostgres } from "./support/postgres";

test("mail migration preserves ordinary text and supports lossless NUL strings with Drizzle", async () => {
  const server = new DisposablePostgres();
  const folder = await mkdtemp(join(tmpdir(), "opencok-mail-upgrade-"));
  let database: ReturnType<typeof createDatabase<"kingdom">> | undefined;
  try {
    const admin = await server.start();
    try {
      await admin.query('CREATE DATABASE "mail_upgrade"');
    } finally {
      await admin.end();
    }
    database = createDatabase("kingdom", { ...server.options, database: "mail_upgrade" });
    const history = new URL("../migrations/kingdom/", import.meta.url);
    const journal = JSON.parse(await readFile(new URL("meta/_journal.json", history), "utf8"));
    journal.entries = journal.entries.slice(0, 2);
    await mkdir(join(folder, "meta"));
    await writeFile(join(folder, "meta/_journal.json"), JSON.stringify(journal));
    for (const entry of journal.entries)
      await copyFile(new URL(`${entry.tag}.sql`, history), join(folder, `${entry.tag}.sql`));
    await migrate(database.db, { migrationsFolder: folder });
    const ordinary = "\\x0041 ordinary 城 🏰";
    await database.pool.query(
      'INSERT INTO opencok_kingdom.mail (uid,"toUser",contents,"createTime","rewardId") VALUES ($1,$2,$3,$4,$5)',
      ["synthetic-mail", "synthetic-player", Buffer.from([0, 255]), 0, ordinary],
    );
    const before = (
      await database.pool.query("SELECT 'opencok_kingdom.mail'::regclass::oid AS oid")
    ).rows[0].oid;
    await migrateDatabase(database.pool, "kingdom");
    expect((await database.db.select().from(mail))[0]!.rewardId).toBe(ordinary);
    expect(
      (await database.pool.query('SELECT "rewardId" FROM opencok_kingdom.mail')).rows[0].rewardId,
    ).toEqual(Buffer.from(ordinary));
    expect(
      (await database.pool.query("SELECT 'opencok_kingdom.mail'::regclass::oid AS oid")).rows[0]
        .oid,
    ).toBe(before);
    const value = "\uFEFFsynthetic\0城 🏰\t\\N\n";
    await database.db.update(mail).set({ rewardId: value });
    expect((await database.db.select().from(mail))[0]!.rewardId).toBe(value);
    const abort = new Error("synthetic rollback");
    await expect(
      database.db.transaction(async (tx) => {
        await tx.update(mail).set({ rewardId: "changed\0" });
        throw abort;
      }),
    ).rejects.toBe(abort);
    expect((await database.db.select().from(mail))[0]!.rewardId).toBe(value);
    await database.db.update(mail).set({ rewardId: null });
    expect((await database.db.select().from(mail))[0]!.rewardId).toBeNull();
    await migrateDatabase(database.pool, "kingdom");
    expect(
      (await database.pool.query("SELECT count(*)::integer AS n FROM drizzle.__drizzle_migrations"))
        .rows[0].n,
    ).toBe(3);
  } finally {
    try {
      await database?.close();
    } finally {
      await server.stop();
      await rm(folder, { recursive: true, force: true });
    }
  }
}, 120000);
