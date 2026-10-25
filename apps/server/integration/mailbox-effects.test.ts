import { afterAll, beforeAll, expect, test } from "bun:test";
import { readFile } from "node:fs/promises";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import type { Pool } from "pg";
import { DisposablePostgres } from "../../../packages/drizzle/tests/support/postgres.ts";
import { createChatMailboxStore } from "../../../packages/repositories/src/chat-mailbox.ts";
import { markMailConversationRead } from "../../../packages/repositories/src/mail-conversation-read.ts";
import { deleteMailConversations } from "../../../packages/repositories/src/mail-conversation-delete.ts";
import { relayMailChat } from "../../../packages/repositories/src/mail-chat-intents.ts";
import { mailConversationReadQuery } from "../../../packages/rules/src/mail-conversation-read.ts";
import type { Database } from "../../../packages/repositories/src/game.ts";
import * as schema from "../../../packages/drizzle/src/schema/kingdom.ts";

const postgres = new DisposablePostgres();
let pool: Pool;
let realm: Database["kingdom"]["db"];
let consumer: ReturnType<typeof createChatMailboxStore>;
const now = 100000;
beforeAll(async () => {
  pool = await postgres.start();
  await pool.query("create schema opencok_kingdom");
  await migrate(drizzle(pool), {
    migrationsFolder: new URL("../../../packages/drizzle/migrations/global", import.meta.url)
      .pathname,
  });
  await pool.query(
    await readFile(
      new URL(
        "../../../packages/drizzle/migrations/kingdom/0005_mail_chat_read_intents.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await pool.query(
    await readFile(
      new URL(
        "../../../packages/drizzle/migrations/kingdom/0011_mailbox_chat_actions.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  await pool.query(`create table opencok_kingdom.userprofile (uid varchar(40) primary key, "serverId" int, "banFlag" int default 0, "banTime" bigint default 0);
create table opencok_kingdom.mail (uid varchar(40) primary key, "toUser" varchar(40), "fromUser" varchar(40), type int, status int, "saveFlag" int, "rewardStatus" int);
create table opencok_kingdom.mail_group (uid varchar(40), "groupType" int, "groupIndex" varchar(40));
insert into opencok_kingdom.userprofile (uid, "serverId") values ('self',1),('other',1);`);
  realm = drizzle(pool, { schema });
  consumer = createChatMailboxStore(
    realm as unknown as Parameters<typeof createChatMailboxStore>[0],
  );
}, 120000);
afterAll(async () => {
  await pool?.end();
  await postgres.stop();
});
async function seed() {
  await pool.query(
    "truncate opencok_kingdom.mail, opencok_kingdom.mail_group, opencok_kingdom.mail_chat_read_intent, opencok_chat.chat_mailbox_message, opencok_chat.chat_mailbox_receipt, opencok_chat.chat_mailbox_intent",
  );
  await pool.query(`insert into opencok_kingdom.mail values ('m','self','peer',20,0,1,0),('foreign','other','peer',20,0,0,1);
insert into opencok_kingdom.mail_group values ('self',100,'peer'),('other',100,'peer');
insert into opencok_chat.chat_mailbox_message (kingdom_id,owner_uid,message_id,peer_uid,chat_type,created_at,body) values
(1,'self','old','peer',1,99999,'synthetic'),(1,'self','future','peer',1,100001,'synthetic'),(1,'other','foreign','peer',1,99999,'synthetic'),(2,'self','realm','peer',1,99999,'synthetic');`);
}
test("read transaction and durable relay recover a committed remote effect after lost acknowledgment", async () => {
  await seed();
  await markMailConversationRead(
    realm,
    1,
    "self",
    mailConversationReadQuery({ fromUser: "peer" }, now),
  );
  expect(
    (await pool.query("select status from opencok_kingdom.mail where uid=$1", ["m"])).rows[0]
      .status,
  ).toBe(1);
  expect((await consumer.list("self", 1, "peer", 1, 10)).every((row) => !row.read)).toBe(true);
  await expect(
    relayMailChat(
      realm,
      1,
      async (update) => {
        await consumer.apply(update);
        throw new Error("lost acknowledgment");
      },
      1000,
    ),
  ).rejects.toThrow();
  expect(
    (await pool.query("select count(*)::int as count from opencok_kingdom.mail_chat_read_intent"))
      .rows[0].count,
  ).toBe(1);
  expect(
    (await consumer.list("self", 1, "peer", 1, 10)).find((row) => row.id === "old")?.read,
  ).toBe(true);
  await pool.end();
  await postgres.restart();
  pool = await postgres.connect();
  realm = drizzle(pool, { schema });
  consumer = createChatMailboxStore(
    realm as unknown as Parameters<typeof createChatMailboxStore>[0],
  );
  expect(
    await relayMailChat(
      realm,
      1,
      async (update) => {
        expect(await consumer.apply(update)).toBe("unchanged");
      },
      1000,
    ),
  ).toBe(1);
  expect(
    await relayMailChat(
      realm,
      1,
      async () => {
        throw new Error("unexpected");
      },
      1000,
    ),
  ).toBe(0);
  expect(
    (await consumer.list("self", 1, "peer", 1, 10)).find((row) => row.id === "future")?.read,
  ).toBe(false);
  expect((await consumer.list("other", 1, "peer", 1, 10))[0]?.read).toBe(false);
  expect((await consumer.list("self", 2, "peer", 1, 10))[0]?.read).toBe(false);
}, 30000);
test("conversation deletion preserves the source's saved/reward bypass and confines remote deletion to old owned copies", async () => {
  await seed();
  await deleteMailConversations(realm, 1, "self", {
    now,
    senders: ["peer"],
    moderation: false,
    bottle: false,
  });
  expect((await pool.query("select uid from opencok_kingdom.mail")).rows).toEqual([
    { uid: "foreign" },
  ]);
  expect((await pool.query("select uid from opencok_kingdom.mail_group")).rows).toEqual([
    { uid: "other" },
  ]);
  await relayMailChat(
    realm,
    1,
    async (update) => {
      await consumer.apply(update);
    },
    1000,
  );
  expect((await consumer.list("self", 1, "peer", 1, 10)).map((row) => row.id)).toEqual(["future"]);
  expect((await consumer.list("other", 1, "peer", 1, 10)).map((row) => row.id)).toEqual([
    "foreign",
  ]);
});
test("local failure rolls back mailbox deletion and outbox together", async () => {
  await seed();
  await pool.query(`create function opencok_kingdom.reject_mail_delete() returns trigger language plpgsql as 'begin raise exception ''synthetic failure''; end';
create trigger reject_mail_delete before delete on opencok_kingdom.mail for each row execute function opencok_kingdom.reject_mail_delete();`);
  try {
    await expect(
      deleteMailConversations(realm, 1, "self", {
        now,
        senders: ["peer"],
        moderation: false,
        bottle: false,
      }),
    ).rejects.toThrow();
    expect(
      (await pool.query("select count(*)::int as count from opencok_kingdom.mail")).rows[0].count,
    ).toBe(2);
    expect(
      (await pool.query("select count(*)::int as count from opencok_kingdom.mail_chat_read_intent"))
        .rows[0].count,
    ).toBe(0);
  } finally {
    await pool.query(
      "drop trigger reject_mail_delete on opencok_kingdom.mail; drop function opencok_kingdom.reject_mail_delete()",
    );
  }
});
test("concurrent replay applies once and rejects a mismatched operation without altering messages", async () => {
  await seed();
  const update = {
    owner: "self",
    kingdomId: 1,
    operationId: "00000000-0000-4000-8000-000000000001",
    effectIndex: 0,
    action: "read" as const,
    others: "peer",
    types: [1],
    requestedAt: now,
  };
  expect((await Promise.all([consumer.apply(update), consumer.apply(update)])).sort()).toEqual([
    "applied",
    "unchanged",
  ]);
  await expect(consumer.apply({ ...update, action: "delete" })).rejects.toThrow();
  expect(await consumer.list("self", 1, "peer", 1, 10)).toHaveLength(2);
});
