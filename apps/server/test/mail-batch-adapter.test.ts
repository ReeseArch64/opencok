import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import * as globalSchema from "@opencok/drizzle/schema/global";
import { readMailBatch } from "@opencok/repositories/mail-batch";
import { Database } from "@opencok/repositories/game";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import { mailBatchQuery } from "@opencok/rules/mail";
import type { MailBatchQuery, MailListEntry } from "@opencok/contracts/mail";
import { fields, sfs, type Value } from "@opencok/messages/sfs";
import { mailListEntry, mailCategoryNow as now } from "./fixtures/mail-category.ts";

const columns = [
  "uid",
  "toUser",
  "fromUser",
  "fromName",
  "title",
  "rewardId",
  "rewardStatus",
  "status",
  "itemIdFlag",
  "saveFlag",
  "reply",
  "translationId",
  "type",
  "createTime",
  "contents",
  "extra",
] as const;
const query = (type: number, begin = 0, limit = 1000) =>
  mailBatchQuery(type, begin, limit, "sender", now);
function fixture(
  options: { profile?: unknown[] | null; fail?: string; size?: number; mismatch?: boolean } = {},
) {
  let rows = Array.from({ length: 50 }, (_, type) => ({
    ...mailListEntry({
      uid: `t${String(type).padStart(2, "0")}`,
      type,
      createTime: BigInt(100 - type),
      contents: Buffer.from("{n:1}"),
      saveFlag: type < 14 ? 1 : 0,
    }),
    extraOwner: "self" as string | null,
  }));
  rows.push({
    ...mailListEntry({ uid: "foreign", toUser: "other", type: 22, createTime: 1000n }),
    extraOwner: "other",
  });
  rows.push({
    ...mailListEntry({ uid: "other-sender", fromUser: "other", type: 22, createTime: 999n }),
    extraOwner: "self",
  });
  let before = rows;
  const calls: { text: string; params: unknown[] }[] = [];
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      calls.push({ text, params });
      const fail = (name: string) => {
        if (options.fail === name) {throw new Error("Synthetic " + name + " failure");}
      };
      if (text.startsWith("begin")) {before = rows.map((row) => ({ ...row }));}
      if (text === "rollback") {rows = before;}
      if (text.includes('from "opencok_kingdom"."userprofile"')) {
        if (text.includes('"name"')) {return { rows: [] };}
        fail("profile");
        return { rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]] };
      }
      if (text.startsWith("select") && text.includes('from "opencok_kingdom"."mail"')) {
        const equal = (column: string) => {
          const index = text.match(
            new RegExp('"selected_mail"\\."' + column + '" = \\$(\\d+)'),
          )?.[1];
          return index ? params[Number(index) - 1] : undefined;
        };
        const set = (column: string) => {
          const list = text.match(
            new RegExp('"selected_mail"\\."' + column + '" in \\(([^)]+)\\)'),
          )?.[1];
          return list?.match(/\$\d+/g)?.map((token) => params[Number(token.slice(1)) - 1]);
        };
        const types = set("type");
        const ids = set("uid");
        const owner = equal("toUser");
        const sender = equal("fromUser");
        const selected = rows
          .filter(
            (row) =>
              row.toUser === owner &&
              (!types || types.includes(row.type)) &&
              (!ids || ids.includes(row.uid)) &&
              (sender === undefined || row.fromUser === sender),
          )
          .sort((a, b) =>
            a.createTime !== b.createTime
              ? a.createTime > b.createTime
                ? -1
                : 1
              : a.uid < b.uid
                ? -1
                : 1,
          );
        const extra = (row: (typeof rows)[number]) =>
          row.extraOwner === owner || row.extraOwner === "" || row.extraOwner === null
            ? row.extra
            : null;
        if (text.includes("octet_length")) {
          fail("metadata");
          const begin = Number(params[Number(text.match(/offset \$(\d+)/)?.[1]) - 1] ?? 0);
          const limit = Number(params[Number(text.match(/limit \$(\d+)/)![1]) - 1]);
          return {
            rows: selected
              .slice(begin, begin + limit)
              .map((row) => [
                row.uid,
                options.size ??
                  (row.contents?.length ?? 0) +
                    (extra(row)?.length ?? 0) +
                    Buffer.byteLength(row.rewardId ?? ""),
              ]),
          };
        }
        fail("bodies");
        return {
          rows: selected.map((row) =>
            columns.map((column) =>
              column === "uid" && options.mismatch
                ? "wrong"
                : column === "createTime"
                  ? String(row.createTime)
                  : column === "rewardId"
                    ? row.rewardId === null
                      ? null
                      : Buffer.from(row.rewardId)
                    : column === "extra"
                      ? extra(row)
                      : row[column],
            ),
          ),
        };
      }
      if (text.startsWith('delete from "opencok_kingdom"."mail"')) {
        fail("delete");
        const [owner, ...ids] = params;
        rows = rows.filter((row) => row.toUser !== owner || !ids.includes(row.uid));
      }
      if (text === "commit") {fail("commit");}
      return { rows: [] };
    },
  };
  const db = drizzle(client as unknown as NodePgClient, { schema });
  const global = drizzle({ query: async () => ({ rows: [] }) } as unknown as NodePgClient, {
    schema: globalSchema,
  });
  const databases = {
    getKingdom: () => ({ db }),
    kingdoms: new Map([[1, { db }]]),
    global: { db: global },
  } as unknown as Parameters<typeof readMailBatch>[0];
  const repository: Database = Object.assign(Object.create(Database.prototype), {
    databases,
    config: { kingdomId: 1 },
  });
  const game = new Game(
    repository,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => now,
  );
  return { db, databases, game, calls, rows: () => rows };
}

test("batch storage maps all selectors to exact stored types before pagination and sender filtering", async () => {
  for (const [type, expected] of [
    [2, [14, 15, 16]],
    [3, [13]],
    [4, [20, 21, 22]],
    [5, [5]],
    [6, [6, 7, 8, 9]],
    [7, [18]],
    [8, [10]],
    [9, [23, 24]],
    [11, [32]],
  ] as const) {
    const f = fixture();
    let entries: readonly MailListEntry[] = [];
    await readMailBatch(f.databases, 1, "self", query(type), async (selected) => {
      entries = selected;
      return [];
    });
    expect(entries.map((entry) => entry.type)).toEqual([...expected]);
    const metadata = f.calls[2]!;
    expect(metadata.params).toEqual([
      "self",
      "",
      "self",
      ...expected,
      ...([4, 9].includes(type) ? ["sender"] : []),
      1000,
    ]);
    expect(metadata.text).toContain('"selected_mail"."type" in (');
    expect(metadata.text).toContain('for update of "selected_mail"');
    expect(metadata.text).toContain(
      'order by "selected_mail"."createTime" desc, "selected_mail"."uid" collate "C" asc',
    );
    expect(metadata.text).not.toContain('"saveFlag"');
    expect(entries.every((entry) => entry.toUser === "self")).toBe(true);
    if (type === 2) {expect(entries.every((entry) => entry.saveFlag === 0)).toBe(true);}
    expect(f.calls.at(-1)!.text).toBe("commit");
  }
  const f = fixture();
  let ids: string[] = [];
  await readMailBatch(f.databases, 1, "self", query(4, 1, 1), async (entries) => {
    ids = entries.map((row) => row.uid);
    return [];
  });
  expect(ids).toEqual(["t21"]);
  expect(f.calls[2]!.params).toEqual(["self", "", "self", 20, 21, 22, "sender", 1, 1]);
  expect(f.calls[2]!.text).toContain("limit $8 offset $9 for update");
  expect(f.calls[3]!.params).toEqual(["self", "", "self", "t21"]);
  const afterEnd = fixture();
  await readMailBatch(afterEnd.databases, 1, "self", query(4, 100, 1), async (entries) => {
    expect(entries).toEqual([]);
    return [];
  });
  expect(afterEnd.calls).toHaveLength(4);
});

test("empty selectors and unauthorized snapshots cannot fetch bodies or authorize deletion", async () => {
  for (const q of [query(0), query(1), query(12), query(4, 0, 0)]) {
    const f = fixture();
    await readMailBatch(f.databases, 1, "self", q, async (entries) => {
      expect(entries).toEqual([]);
      return [];
    });
    expect(f.calls).toHaveLength(3);
  }
  for (const profile of [
    null,
    ["other", 1, "0", 0],
    ["self", 2, "0", 0],
    ["self", 1, "0", 1],
    ["self", 1, String(now + 1), 0],
  ]) {
    const f = fixture({ profile });
    await readMailBatch(f.databases, 1, "self", query(2), async () => {
      throw new Error("Unauthorized inspection");
    });
    expect(f.calls).toHaveLength(3);
  }
});

test("ordinary batch cleanup is primary-only and follows successful full command projection", async () => {
  const f = fixture();
  const row = f.rows().find((entry) => entry.uid === "t32")!;
  row.contents = Buffer.from("broken");
  row.saveFlag = 1;
  row.extra = Buffer.from("retained auxiliary");
  const before = f.rows().map((entry) => ({ ...entry }));
  const result = await f.game.execute("self", "mread.batch", {
    type: sfs.int(11),
    num: sfs.int(0),
    offset: sfs.int(10),
    _cok_: sfs.int(7),
  });
  expect(result.body).toEqual({ result: sfs.array(), _cok_: sfs.int(7) });
  expect(f.rows()).toEqual(before.filter((entry) => entry.uid !== "t32"));
  const deletion = f.calls.find((call) => call.text.startsWith("delete"))!;
  expect(deletion.params).toEqual(["self", "t32"]);
  expect(deletion.text).toContain('"mail"."toUser" = $1');
  expect(f.calls.map((call) => call.text).join("\n")).not.toMatch(
    /mail_update|mail_group|gift|insert into|update "|delete from "opencok_kingdom"\."mail_contents"/,
  );
  for (const selector of [5, 7, 8]) {
    const g = fixture();
    g
      .rows()
      .find((entry) => entry.type === (selector === 5 ? 5 : selector === 7 ? 18 : 10))!.contents =
      Buffer.from("broken");
    const saved = g.rows().map((entry) => ({ ...entry }));
    await expect(
      g.game.execute("self", "mread.batch", {
        type: sfs.int(selector),
        num: sfs.int(0),
        offset: sfs.int(10),
      }),
    ).rejects.toThrow();
    expect(g.rows()).toEqual(saved);
    expect(g.calls.at(-1)!.text).toBe("rollback");
  }
});

test("batch metadata bounds and all failures preserve state before cleanup commits", async () => {
  for (const options of [
    { size: 4 * 1024 * 1024 + 1 },
    { size: -1 },
    { size: NaN },
    { mismatch: true },
    ...["profile", "metadata", "bodies", "delete", "commit"].map((fail) => ({ fail })),
  ]) {
    const f = fixture(options);
    const before = f.rows().map((row) => ({ ...row }));
    await expect(
      readMailBatch(f.databases, 1, "self", query(11), async () => ["t32"]),
    ).rejects.toThrow();
    expect(f.rows()).toEqual(before);
    expect(f.calls.at(-1)!.text).toBe("rollback");
    if ("size" in options) {expect(f.calls).toHaveLength(4);}
  }
  for (const kind of ["rows", "rewards"]) {
    const f = fixture();
    for (let i = 0; i < (kind === "rows" ? 1001 : 65); i++)
      {f.rows().push({
        ...mailListEntry({
          uid: `extra-${i}`,
          type: 14,
          rewardId: kind === "rewards" ? "x".repeat(65535) : "",
        }),
        extraOwner: "self",
      });}
    await expect(
      readMailBatch(f.databases, 1, "self", query(2, 0, 2147483647), async () => []),
    ).rejects.toThrow("capacity");
    expect(f.calls).toHaveLength(4);
  }
  for (const plan of [
    async () => ["foreign"],
    async () => ["t32", "t32"],
    async () => {
      throw new Error("Synthetic projection failure");
    },
  ]) {
    const f = fixture();
    await expect(readMailBatch(f.databases, 1, "self", query(11), plan)).rejects.toThrow();
    expect(f.calls.some((call) => call.text.startsWith("delete"))).toBe(false);
  }
});

test("batch commands preserve extra ownership and transport limits through the production adapter", async () => {
  for (const owner of ["self", "", null, "foreign"]) {
    const f = fixture();
    const row = f.rows().find((entry) => entry.type === 32)!;
    row.contents = Buffer.from("extra");
    row.extra = Buffer.from("{n:9007199254740993}");
    row.extraOwner = owner;
    const request = f.game.execute("self", "mread.batch", {
      type: sfs.int(11),
      num: sfs.int(0),
      offset: sfs.int(10),
    });
    if (owner === "foreign") {
      await expect(request).rejects.toThrow("Missing persisted mail contents");
      expect(f.calls.at(-1)!.text).toBe("rollback");
    } else {
      const result = await request;
      expect(fields(fields((result.body.result!.value as Value[])[0]).detail).n).toEqual(
        sfs.long(9007199254740993n),
      );
    }
    expect(f.rows().some((entry) => entry.type === 32)).toBe(true);
  }
  const f = fixture();
  f.rows().find((row) => row.type === 32)!.contents = Buffer.from("broken");
  await expect(
    f.game.execute("self", "mread.batch", {
      type: sfs.int(11),
      num: sfs.int(0),
      offset: sfs.int(10),
      _cok_: sfs.string("x".repeat(32768)),
    }),
  ).rejects.toThrow();
  expect(f.rows().some((row) => row.type === 32)).toBe(true);
  expect(f.calls.at(-1)!.text).toBe("rollback");
});

test("direct batch readers reject invalid normalized scopes and unbounded identities before SQL", () => {
  const f = fixture();
  const inspect = async () => [];
  for (const invalid of [
    { ...query(4), fromUser: null },
    { ...query(4), fromUser: "" },
    { ...query(4), fromUser: "\0" },
    { ...query(4), fromUser: "x".repeat(41) },
    { ...query(2), fromUser: "sender" },
    { ...query(2), kind: "groups" },
    { ...query(0), limit: 1 },
    { ...query(2), begin: -1 },
    { ...query(2), limit: 2147483648 },
    { ...query(2), now: -1 },
  ] as MailBatchQuery[])
    {expect(() => readMailBatch(f.databases, 1, "self", invalid, inspect)).toThrow();}
  for (const owner of ["", " ", "\0", "\ud800", "x".repeat(41)])
    {expect(() => readMailBatch(f.databases, 1, owner, query(2), inspect)).toThrow();}
  for (const realm of [0, 1.5, 2147483648])
    {expect(() => readMailBatch(f.databases, realm, "self", query(2), inspect)).toThrow();}
  expect(f.calls).toEqual([]);
});

test("mread.chat reaches the production message reader with default and explicit selectors and preserves read state", async () => {
  for (const selector of [undefined, 2, 3, 4, 5, 6, 7, 8, 9, 11, 0]) {
    const f = fixture();
    const before = f.rows().map((row) => ({ ...row }));
    const result = await f.game.execute("self", "mread.chat", {
      ...(selector === undefined ? {} : { type: sfs.int(selector) }),
      num: sfs.int(1),
      offset: sfs.int(1),
      fromUser: sfs.string("sender"),
      _cok_: sfs.int(9),
    });
    const batch = fixture();
    expect(result).toEqual(
      await batch.game.execute("self", "mread.batch", {
        type: sfs.int(selector ?? 4),
        num: sfs.int(1),
        offset: sfs.int(1),
        fromUser: sfs.string("sender"),
        _cok_: sfs.int(9),
      }),
    );
    expect(f.calls).toEqual(batch.calls);
    expect(f.rows()).toEqual(before);
    expect(f.calls.some((call) => /^(update|insert|delete) /.test(call.text))).toBe(false);
  }
  const bad = fixture();
  bad.rows().find((row) => row.uid === "t32")!.contents = Buffer.from("broken");
  await bad.game.execute("self", "mread.chat", {
    type: sfs.int(11),
    num: sfs.int(0),
    offset: sfs.int(1),
  });
  expect(bad.rows().some((row) => row.uid === "t32")).toBe(false);
  expect(bad.calls.find((call) => call.text.startsWith("delete"))!.params).toEqual(["self", "t32"]);
});
