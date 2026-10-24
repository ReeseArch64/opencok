import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { saveMailConversation } from "@opencok/repositories/mail-conversation-save";
import { mailConversationSaveQuery } from "@opencok/rules/mail";

const now = 1792756800000;
function database(options: { profile?: unknown[] | null; fail?: string } = {}) {
  const queries: { text: string; params: unknown[] }[] = [];
  let rows = ["self", "other"].flatMap((owner) =>
    ["sender", "elsewhere", ""].flatMap((from) =>
      [2, 7, 10, 12, 14, 20, 21, 22, 23, 24, 28, 37, 38, 39, 40, 43, 44, 45, 46].map((type) => ({
        owner,
        from,
        type,
        saved: null as number | null,
        read: 0,
        reward: 0,
        contents: "synthetic",
      })),
    ),
  );
  let before: typeof rows = [];
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ text, params });
      if (text.startsWith("begin")) before = rows.map((row) => ({ ...row }));
      if (text === "rollback") rows = before;
      if (text.includes('from "opencok_kingdom"."userprofile"')) {
        if (options.fail === "profile") throw new Error("Synthetic profile failure");
        return { rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]] };
      }
      if (text.startsWith('update "opencok_kingdom"."mail"')) {
        if (options.fail === "update") throw new Error("Synthetic update failure");
        const [flag, owner, selection, ...types] = params;
        const sender = text.includes('"mail"."fromUser" =');
        for (const row of rows)
          if (
            row.owner === owner &&
            (sender ? row.from === selection && types.includes(row.type) : row.type === selection)
          )
            row.saved = flag as number;
      }
      if (text === "commit" && options.fail === "commit")
        throw new Error("Synthetic commit failure");
      return { rows: [] };
    },
  };
  return { db: drizzle(client as unknown as NodePgClient, { schema }), queries, rows: () => rows };
}

test("sender saving updates all owned textual messages without media, marker or read-state effects", async () => {
  for (const mod of [0, 1, 2]) {
    const { db, queries, rows } = database();
    const query = mailConversationSaveQuery({ mod, fromUser: "sender", flag: -2147483648 }, now);
    await saveMailConversation(db, 1, "self", query);
    const types = mod === 1 ? [23, 24] : [20, 21, 22];
    for (const row of rows()) {
      expect(row.saved).toBe(
        row.owner === "self" && row.from === "sender" && types.includes(row.type)
          ? -2147483648
          : null,
      );
      expect([row.read, row.reward, row.contents]).toEqual([0, 0, "synthetic"]);
    }
    expect(queries).toHaveLength(4);
    expect(queries[0]?.text).toBe("begin isolation level read committed read write");
    expect(queries[1]?.text).toEndWith("limit $2 for update");
    expect(queries[1]?.params).toEqual(["self", 1]);
    expect(queries[2]?.params).toEqual([-2147483648, "self", "sender", ...types]);
    expect(queries[2]?.text).toContain('"mail"."toUser" = $2');
    expect(queries[2]?.text).toContain('"mail"."fromUser" = $3');
    expect(queries[2]?.text).not.toMatch(/returning|limit|coalesce|rewardStatus|"status"/);
    expect(queries.at(-1)?.text).toBe("commit");
    const before = rows().map((row) => ({ ...row }));
    await saveMailConversation(db, 1, "self", query);
    expect(rows()).toEqual(before);
    expect(queries.map((entry) => entry.text).join("\n")).not.toMatch(
      /insert |delete |mail_update|mail_group|mail_gift|contents|rewardId|select \*/,
    );
  }
});

test("type saving reaches every sender for the exact mapped type and preserves raw flags", async () => {
  const { db, queries, rows } = database();
  await saveMailConversation(
    db,
    1,
    "self",
    mailConversationSaveQuery({ mod: 1, type: 14, flag: 2147483647 }, now),
  );
  for (const row of rows())
    expect(row.saved).toBe(row.owner === "self" && row.type === 12 ? 2147483647 : null);
  expect(queries[2]?.params).toEqual([2147483647, "self", 12]);
  expect(queries[2]?.text).not.toContain("fromUser");
  await saveMailConversation(
    db,
    1,
    "self",
    mailConversationSaveQuery({ mod: 0, type: 14, flag: 0 }, now),
  );
  expect(
    rows()
      .filter((row) => row.owner === "self" && row.type === 12)
      .map((row) => row.saved),
  ).toEqual([0, 0, 0]);
  await saveMailConversation(
    db,
    1,
    "self",
    mailConversationSaveQuery({ mod: 0, fromUser: "", flag: 2 }, now),
  );
  expect(
    rows()
      .filter((row) => row.owner === "self" && row.from === "" && [20, 21, 22].includes(row.type))
      .map((row) => row.saved),
  ).toEqual([2, 2, 2]);
});

test("conversation saving does not truncate large selections or read their contents into the process", async () => {
  const { db, queries, rows } = database();
  rows().push(
    ...Array.from({ length: 1500 }, () => ({
      owner: "self",
      from: "large",
      type: 21,
      saved: null,
      read: 0,
      reward: 0,
      contents: "synthetic",
    })),
  );
  await saveMailConversation(
    db,
    1,
    "self",
    mailConversationSaveQuery({ mod: 0, fromUser: "large", flag: 1 }, now),
  );
  expect(rows().filter((row) => row.from === "large" && row.saved === 1)).toHaveLength(1500);
  expect(queries).toHaveLength(4);
  expect(queries.filter((entry) => entry.text.startsWith("update"))).toHaveLength(1);
  expect(
    queries.some((entry) => entry.text.startsWith("select") && entry.text.includes('"mail"')),
  ).toBe(false);
});

test("no-selector and unauthorized profiles perform no mail writes; dependency failures roll back", async () => {
  const query = mailConversationSaveQuery({ mod: 0, type: 1, flag: 1 }, now);
  for (const profile of [
    null,
    ["other", 1, "0", 0],
    ["self", 2, "0", 0],
    ["self", 1, "0", 1],
    ["self", 1, String(now + 1), 0],
  ]) {
    const { db, queries } = database({ profile });
    await saveMailConversation(db, 1, "self", query);
    expect(queries.some((entry) => entry.text.startsWith("update"))).toBe(false);
  }
  const empty = database();
  await saveMailConversation(empty.db, 1, "self", { scope: "none", now });
  expect(empty.queries).toHaveLength(3);
  for (const fail of ["profile", "update", "commit"]) {
    const { db, queries, rows } = database({ fail });
    const before = rows().map((row) => ({ ...row }));
    await expect(saveMailConversation(db, 1, "self", query)).rejects.toThrow();
    expect(rows()).toEqual(before);
    expect(queries.at(-1)?.text).toBe("rollback");
  }
});

test("direct conversation-save callers cannot bypass owner, realm or selector validation", () => {
  const { db, queries } = database();
  const query = mailConversationSaveQuery({ mod: 0, fromUser: "sender", flag: 1 }, now);
  for (const owner of ["", " ", "\0", "\ud800", "x".repeat(41)])
    expect(() => saveMailConversation(db, 1, owner, query)).toThrow();
  for (const realm of [0, 1.5, 2147483648])
    expect(() => saveMailConversation(db, realm, "self", query)).toThrow();
  for (const patch of [
    { now: -1 },
    { now: NaN },
    { scope: "unknown" },
    { flag: 2147483648 },
    { fromUser: "\0" },
    { fromUser: "\ud800" },
    { fromUser: "x".repeat(41) },
    { moderation: 1 },
  ])
    expect(() =>
      saveMailConversation(db, 1, "self", { ...query, ...patch } as typeof query),
    ).toThrow();
  expect(queries).toEqual([]);
});
