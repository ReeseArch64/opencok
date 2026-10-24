import { expect, test } from "bun:test";
import { mkdtemp, mkdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { setupDatabases } from "../scripts/setup";
import { createDatabases } from "../src";
import { usermapping } from "../src/schema/opencok_global";
import { exchange } from "../src/schema/opencok_pay";
import { chat_session } from "../src/schema/opencok_chat";
import { ability_page } from "../src/schema/opencok_kingdom";
import { DisposablePostgres } from "./support/postgres";

test("namespace migrations preserve existing PostgreSQL rows, object identity and sequences", async () => {
  const server = new DisposablePostgres();
  const directory = await mkdtemp(join(tmpdir(), "opencok-namespace-upgrade-"));
  const topology = {
    globalDatabase: "upgrade_global",
    kingdoms: [{ id: 7, database: "upgrade_kingdom" }],
  };
  let databases: ReturnType<typeof createDatabases> | undefined;
  try {
    const admin = await server.start();
    try {
      for (const [role, database] of [
        ["global", topology.globalDatabase],
        ["kingdom", topology.kingdoms[0]!.database],
      ] as const) {
        await admin.query(`CREATE DATABASE "${database}"`);

        const folder = join(directory, role);
        await mkdir(join(folder, "meta"), { recursive: true });
        const current = new URL(`../migrations/${role}/`, import.meta.url);
        const journal = JSON.parse(await readFile(new URL("meta/_journal.json", current), "utf8"));
        journal.entries = journal.entries.slice(0, 1);
        await writeFile(join(folder, "meta/_journal.json"), JSON.stringify(journal));
        await copyFile(new URL("0000_initial.sql", current), join(folder, "0000_initial.sql"));
        const pool = await server.connect(database);
        try {
          await migrate(drizzle(pool), { migrationsFolder: folder });
        } finally {
          await pool.end();
        }
      }
      const global = await server.connect(topology.globalDatabase);
      const kingdom = await server.connect(topology.kingdoms[0]!.database);
      let previousId: number, previousOid: number;
      const token = Buffer.alloc(32, 1),
        bytes = Buffer.from([0, 255, 0]);
      try {
        await global.query(
          `INSERT INTO cokdb_global.usermapping ("gameUid","mappingType","mappingValue") VALUES ('retained-uid','synthetic','retained-value')`,
        );
        previousId = (
          await global.query(
            `INSERT INTO cokdb_pay.exchange (name,"paidGold",price) VALUES ('retained',9223372036854775807,'99999999.99') RETURNING id`,
          )
        ).rows[0].id;
        await global.query(
          `INSERT INTO opencok_chat.chat_session (token_hash,uid,created_at,expires_at) VALUES ($1,'retained-session','2026-10-23 00:00:00.000','2026-10-24 00:00:00.000')`,
          [token],
        );
        await kingdom.query(
          `INSERT INTO cokdb1.ability_page (uid,page,ability) VALUES ('retained',7,$1)`,
          [bytes],
        );
        previousOid = (await kingdom.query("SELECT 'cokdb1.ability_page'::regclass::oid AS oid"))
          .rows[0].oid;
      } finally {
        await global.end();
        await kingdom.end();
      }
      await setupDatabases(admin, server.options, topology);
      databases = createDatabases(server.options, topology);
      const [mapping] = await databases.global.db.select().from(usermapping);
      expect(mapping?.gameUid).toBe("retained-uid");
      expect(mapping?.mappingValue).toBe("retained-value");
      const [payment] = await databases.global.db.select().from(exchange);
      expect(payment?.id).toBe(previousId);
      expect(payment?.paidGold).toBe(9223372036854775807n);
      expect(payment?.price).toBe("99999999.99");
      expect((await databases.global.db.select().from(chat_session))[0]?.token_hash).toEqual(token);
      const target = databases.getKingdom(7);
      expect(await target.db.select().from(ability_page)).toEqual([
        { uid: "retained", page: 7, ability: bytes },
      ]);
      expect(
        (await target.pool.query("SELECT 'opencok_kingdom.ability_page'::regclass::oid AS oid"))
          .rows[0].oid,
      ).toBe(previousOid);
      const [next] = await databases.global.db
        .insert(exchange)
        .values({ name: "after-rename" })
        .returning({ id: exchange.id });
      expect(next!.id).toBe(previousId + 1);
      await setupDatabases(admin, server.options, topology);
      expect(await target.db.select().from(ability_page)).toHaveLength(1);
      for (const pool of [target.pool, databases.global.pool]) {
        const role = pool === target.pool ? "kingdom" : "global";
        const journal = JSON.parse(
          await readFile(
            new URL(`../migrations/${role}/meta/_journal.json`, import.meta.url),
            "utf8",
          ),
        );
        expect(
          (
            await pool.query(
              "SELECT count(*)::integer AS n FROM pg_namespace WHERE nspname IN ('cokdb1','cokdb_global','cokdb_pay')",
            )
          ).rows[0].n,
        ).toBe(0);
        expect(
          (await pool.query("SELECT count(*)::integer AS n FROM drizzle.__drizzle_migrations"))
            .rows[0].n,
        ).toBe(journal.entries.length);
      }
    } finally {
      await admin.end();
    }
  } finally {
    try {
      await databases?.close();
    } finally {
      await server.stop();
      await rm(directory, { recursive: true, force: true });
    }
  }
}, 120_000);
