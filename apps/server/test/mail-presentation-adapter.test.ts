import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import * as globalSchema from "@opencok/drizzle/schema/global";
import { readMailSenders, readMailTranslations } from "@opencok/repositories/mail-presentation";

function fixture(
  options: {
    routes?: [string, string][];
    profileRealm?: number;
    fail?: string;
    translationSize?: number;
    mismatch?: boolean;
    duplicate?: boolean;
  } = {},
) {
  const calls: { realm: number; text: string; params: unknown[] }[] = [];
  const users = new Map([
    [
      1,
      [
        ["local", 1, "Local", "pic1", null, null, "ONE"],
        ["sender@mod", 1, "Moderator", "mod", 4, "fr", null],
      ],
    ],
    [2, [["remote", 2, "Remote", "pic2", 7, null, "TWO"]]],
  ]);
  const realm = (id: number) => {
    const client = {
      query: async (statement: { text: string }, params: unknown[] = []) => {
        const text = statement.text;
        calls.push({ realm: id, text, params });
        if (text.includes('from "opencok_kingdom"."userprofile"')) {
          if (options.fail === "profile") throw new Error("Synthetic profile failure");
          const rows = (users.get(id) ?? [])
            .filter((row) => params.slice(0, -1).includes(row[0]))
            .map((row) =>
              row.map((value, index) => (index === 1 ? (options.profileRealm ?? value) : value)),
            );
          return { rows: options.duplicate ? [...rows, ...rows] : rows };
        }
        if (text.includes('from "opencok_kingdom"."translationv2"')) {
          const metadata = text.includes("octet_length");
          if (options.fail === (metadata ? "metadata" : "contents"))
            throw new Error("Synthetic translation failure");
          const language = text.match(/"(?:en|ja|pt)"/)?.[0].slice(1, -1) ?? "en";
          const ids = params
            .slice(0, -1)
            .filter((value): value is string => typeof value === "string" && value !== "missing");
          const rows = ids.map((uid) => {
            const contents = uid === "blank" ? null : Buffer.from(" translated " + language + " ");
            return metadata
              ? [uid, options.translationSize ?? contents?.length ?? 0]
              : [options.mismatch ? "wrong" : uid, contents];
          });
          return { rows: options.duplicate ? [...rows, ...rows] : rows };
        }
        return { rows: [] };
      },
    };
    return { db: drizzle(client as unknown as NodePgClient, { schema }) };
  };
  const global = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      calls.push({ realm: 0, text: statement.text, params });
      if (options.fail === "directory") throw new Error("Synthetic directory failure");
      return { rows: options.routes ?? [["remote", "2"]].filter(([uid]) => params.includes(uid)) };
    },
  };
  const kingdoms = new Map([
    [1, realm(1)],
    [2, realm(2)],
  ]);
  const databases = {
    kingdoms,
    getKingdom: (id: number) => kingdoms.get(id)!,
    global: { db: drizzle(global as unknown as NodePgClient, { schema: globalSchema }) },
  } as unknown as Parameters<typeof readMailSenders>[0];
  return { databases, db: kingdoms.get(1)!.db, calls, users };
}

test("mail sender routes precede realm reads and local sender data shares the caller snapshot", async () => {
  const f = fixture();
  const result = await readMailSenders(f.databases, 1, f.db, [
    "local",
    "remote",
    "sender@mod",
    "missing",
  ]);
  expect(result).toEqual(
    new Map([
      ["local", { name: "Local", pic: "pic1", picVer: "0", lang: "", abbr: "ONE" }],
      ["sender@mod", { name: "Moderator", pic: "mod", picVer: "4", lang: "fr", abbr: null }],
      ["remote", { name: "Remote", pic: "pic2", picVer: "7", lang: null, abbr: "TWO" }],
    ]),
  );
  expect(f.calls[0]!.realm).toBe(0);
  expect(f.calls[0]!.text).toContain('select "gameUid", "server"');
  expect(f.calls[0]!.params).toEqual(["local", "remote", "sender@mod", "missing", 5]);
  expect(f.calls.filter((call) => call.realm === 1)).toHaveLength(1);
  const remote = f.calls.filter((call) => call.realm === 2);
  expect(remote[0]!.text).toBe("begin isolation level repeatable read read only");
  expect(remote.at(-1)!.text).toBe("commit");
  const publicReads = f.calls.filter((call) => call.realm !== 0 && call.text.startsWith("select"));
  for (const call of publicReads) {
    expect(call.text).toContain('left join "opencok_kingdom"."alliance"');
    expect(call.text).not.toMatch(/gold|email|device|password|passmd5|resource|banTime/);
  }
  expect(f.calls.map((call) => call.text).join("\n")).not.toMatch(
    /insert into|delete from|update "/,
  );
});

test("mail sender lookup rejects bad, unconfigured and inconsistent routes without wrong-realm fallback", async () => {
  for (const routes of [
    [["remote", "3"]],
    [["remote", "0"]],
    [["remote", "2.0"]],
    [["remote", " 2"]],
    [["remote", "2147483648"]],
    [["foreign", "1"]],
    [
      ["remote", "2"],
      ["remote", "2"],
    ],
  ] as [string, string][][]) {
    const f = fixture({ routes });
    await expect(readMailSenders(f.databases, 1, f.db, ["remote"])).rejects.toThrow();
    expect(f.calls.every((call) => call.realm === 0)).toBe(true);
  }
  for (const options of [
    { profileRealm: 1 },
    { fail: "directory" },
    { fail: "profile" },
    { duplicate: true },
  ]) {
    const f = fixture(options);
    await expect(readMailSenders(f.databases, 1, f.db, ["remote"])).rejects.toThrow();
    expect(f.calls.some((call) => call.realm === 1)).toBe(false);
    if (options.fail !== "directory") expect(f.calls.at(-1)!.text).toBe("rollback");
  }
  const fallback = fixture({ routes: [] });
  expect((await readMailSenders(fallback.databases, 1, fallback.db, ["local"])).has("local")).toBe(
    true,
  );
  const routed = fixture({ routes: [["local", "2"]] });
  expect(await readMailSenders(routed.databases, 1, routed.db, ["local"])).toEqual(new Map());
  expect(routed.calls.some((call) => call.realm === 1)).toBe(false);
});

test("mail sender queries are bounded and skip all dependencies for empty selection", async () => {
  const f = fixture();
  expect(await readMailSenders(f.databases, 1, f.db, [])).toEqual(new Map());
  for (const ids of [
    ["local", "local"],
    [""],
    ["x".repeat(41)],
    ["\0"],
    ["\ud800"],
    Array.from({ length: 1001 }, (_, i) => String(i)),
  ])
    await expect(readMailSenders(f.databases, 1, f.db, ids)).rejects.toThrow();
  expect(f.calls).toEqual([]);
});

test("translation reads deduplicate per language, preserve bytes and use only allowlisted bound columns", async () => {
  const f = fixture();
  const result = await readMailTranslations(f.db, [
    { id: "id'quoted", language: "ja" },
    { id: "id'quoted", language: "ja" },
    { id: "id'quoted", language: "pt" },
    { id: "missing", language: "pt" },
    { id: "blank", language: "pt" },
  ]);
  expect(result).toEqual([
    { id: "id'quoted", language: "ja", contents: Buffer.from(" translated ja ") },
    { id: "id'quoted", language: "pt", contents: Buffer.from(" translated pt ") },
    { id: "blank", language: "pt", contents: null },
  ]);
  expect(f.calls).toHaveLength(4);
  expect(f.calls[0]!.text).toContain('coalesce(octet_length("ja"), 0)');
  expect(f.calls[0]!.params).toEqual(["id'quoted", 2]);
  expect(f.calls[1]!.text).toContain('select "id", "ja"');
  expect(f.calls[2]!.params).toEqual(["id'quoted", "missing", "blank", 4]);
  expect(f.calls[3]!.params).toEqual(["id'quoted", "blank", 3]);
  for (const call of f.calls) {
    expect(call.text).not.toContain("id'quoted");
    expect(call.text.startsWith("select")).toBe(true);
  }
});

test("translation readers bound bodies before loading and reject inconsistent snapshots or failed reads", async () => {
  for (const options of [
    { translationSize: 4 * 1024 * 1024 + 1 },
    { translationSize: -1 },
    { translationSize: NaN },
    { translationSize: 0 },
    { mismatch: true },
    { duplicate: true },
    { fail: "metadata" },
    { fail: "contents" },
  ]) {
    const f = fixture(options);
    await expect(readMailTranslations(f.db, [{ id: "id", language: "en" }])).rejects.toThrow();
    if ("translationSize" in options && options.translationSize !== 0)
      expect(f.calls).toHaveLength(1);
  }
  const missing = fixture();
  expect(await readMailTranslations(missing.db, [{ id: "missing", language: "en" }])).toEqual([]);
  expect(missing.calls).toHaveLength(1);
  const f = fixture();
  expect(await readMailTranslations(f.db, [])).toEqual([]);
  for (const requests of [
    [{ id: "id", language: "en;drop" }],
    [{ id: "", language: "en" }],
    [{ id: "\0", language: "en" }],
    [{ id: "\ud800", language: "en" }],
    [{ id: "x".repeat(256), language: "en" }],
    Array.from({ length: 1001 }, (_, i) => ({ id: String(i), language: "en" })),
  ])
    await expect(readMailTranslations(f.db, requests)).rejects.toThrow();
  expect(f.calls).toEqual([]);
});
