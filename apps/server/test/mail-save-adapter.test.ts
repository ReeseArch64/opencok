import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import { saveMail } from "@opencok/repositories/mail-save";
import { mailSaveQuery } from "@opencok/rules/mail";

const now = 1792756800000;
type Entry = { uid: string; owner: string; flag: number | null; status: number; reward: string };
function database(options: { profile?: unknown[] | null; fail?: string } = {}) {
  const queries: { text: string; params: unknown[] }[] = [];
  let entries: Entry[] = [
    { uid: "a", owner: "self", flag: null, status: 0, reward: "synthetic" },
    { uid: "b", owner: "self", flag: 2, status: 1, reward: "synthetic" },
    { uid: "c", owner: "self", flag: -1, status: 0, reward: "synthetic" },
    { uid: "foreign", owner: "other", flag: 0, status: 0, reward: "synthetic" },
  ];
  let markers = new Map<string, bigint>();
  let before: { entries: Entry[]; markers: Map<string, bigint> } | undefined;
  const client = {
    query: async (statement: { text: string }, params: unknown[] = []) => {
      const text = statement.text;
      queries.push({ text, params });
      if (text.startsWith("begin"))
        {before = { entries: structuredClone(entries), markers: new Map(markers) };}
      if (text === "rollback" && before) {
        entries = before.entries;
        markers = before.markers;
      }
      if (text.includes('from "opencok_kingdom"."userprofile"')) {
        if (options.fail === "profile") {throw new Error("Synthetic profile failure");}
        return { rows: options.profile === null ? [] : [options.profile ?? ["self", 1, "0", 0]] };
      }
      if (text.startsWith('update "opencok_kingdom"."mail"')) {
        if (options.fail === "mail") {throw new Error("Synthetic mail failure");}
        const [flag, owner, ...ids] = params;
        const selected = entries.filter(
          (entry) =>
            entry.owner === owner &&
            ids.includes(entry.uid) &&
            (!text.includes("<= 0") || (entry.flag ?? 0) <= 0) &&
            (!text.includes("<> 0") || (entry.flag ?? 0) !== 0),
        );
        for (const entry of selected) {entry.flag = flag as number;}
        return { rows: selected.map((entry) => [entry.uid]) };
      }
      if (text.startsWith('insert into "opencok_kingdom"."mail_update"')) {
        if (options.fail === "marker") {throw new Error("Synthetic marker failure");}
        for (let i = 0; i < params.length; i += 3) {
          const key = `${params[i]}:${params[i + 1]}`;
          const time = BigInt(params[i + 2] as string);
          const previous = markers.get(key) ?? 0n;
          markers.set(key, time > previous ? time : previous);
        }
      }
      if (text === "commit" && options.fail === "commit")
        {throw new Error("Synthetic commit failure");}
      return { rows: [] };
    },
  };
  return {
    db: drizzle(client as unknown as NodePgClient, { schema }),
    queries,
    entries: () => entries,
    markers: () => markers,
  };
}

test("single saves are recipient scoped, atomic with markers and repeated save/cancel requests preserve state", async () => {
  const fixture = database();
  const { db, queries } = fixture;
  expect((await saveMail(db, 1, "self", mailSaveQuery("save", "a", 28, now))).result).toBe("save");
  expect(fixture.entries().find((entry) => entry.uid === "a")?.flag).toBe(1);
  expect(fixture.markers()).toEqual(new Map([["self:a", BigInt(now)]]));
  expect(queries[0]?.text).toBe("begin isolation level read committed read write");
  expect(queries[1]?.text).toEndWith("limit $2 for update");
  expect(queries[1]?.params).toEqual(["self", 1]);
  expect(queries[2]?.text).toContain('"mail"."toUser" = $2');
  expect(queries[2]?.text).toContain('"mail"."uid" in ($3)');
  expect(queries[2]?.text).toContain('coalesce("opencok_kingdom"."mail"."saveFlag", 0) <= 0');
  expect(queries[2]?.params).toEqual([1, "self", "a"]);
  expect(queries[3]?.text).toContain('on conflict ("toUser","mailUid") do update');
  expect(queries[3]?.text).toContain(
    'greatest("opencok_kingdom"."mail_update"."updateTime", excluded."updateTime")',
  );
  expect(queries.at(-1)?.text).toBe("commit");
  const markerCount = () => queries.filter((entry) => entry.text.startsWith("insert")).length;
  for (const id of ["a", "b", "missing", "foreign"])
    {expect((await saveMail(db, 1, "self", mailSaveQuery("save", id, 99, now + 10))).result).toBe(
      "unchanged",
    );}
  expect(markerCount()).toBe(1);
  expect((await saveMail(db, 1, "self", mailSaveQuery("save", "c", 0, now))).result).toBe("save");
  expect((await saveMail(db, 1, "self", mailSaveQuery("cancel", "a", 0, now - 1))).result).toBe(
    "cancel",
  );
  expect(fixture.markers().get("self:a")).toBe(BigInt(now));
  expect((await saveMail(db, 1, "self", mailSaveQuery("cancel", "a", 0, now + 1))).result).toBe(
    "unchanged",
  );
  expect((await saveMail(db, 1, "self", mailSaveQuery("cancel", "b", 0, now))).result).toBe(
    "cancel",
  );
  expect(fixture.entries().map(({ uid, status, reward }) => ({ uid, status, reward }))).toEqual(
    database()
      .entries()
      .map(({ uid, status, reward }) => ({ uid, status, reward })),
  );
  expect(fixture.entries().find((entry) => entry.uid === "foreign")?.flag).toBe(0);
  expect(queries.map((entry) => entry.text).join("\n")).not.toMatch(
    /contents|rewardId|"status"|delete |opencok_global|select \*/,
  );
});

test("batch flags and markers cover only existing owned IDs; empty and unmatched batches retain distinct responses", async () => {
  const fixture = database();
  const { db, queries } = fixture;
  for (const flag of [1, 5]) {
    const result = await saveMail(
      db,
      1,
      "self",
      mailSaveQuery("batch", "a,b,a,foreign,missing", flag, now),
    );
    expect(result.result).toBe("save");
    expect(
      fixture
        .entries()
        .filter((entry) => ["a", "b"].includes(entry.uid))
        .map((entry) => entry.flag),
    ).toEqual([flag === 1 ? 1 : 0, flag === 1 ? 1 : 0]);
    expect([...fixture.markers().keys()].sort()).toEqual(["self:a", "self:b"]);
  }
  const batch = queries.find((entry) => entry.text.startsWith("update"))!;
  expect(batch.params).toEqual([1, "self", "a", "b", "foreign", "missing"]);
  expect(batch.text).not.toContain("coalesce");
  expect((await saveMail(db, 1, "self", mailSaveQuery("batch", "missing", 1, now))).result).toBe(
    "save",
  );
  const count = queries.length;
  expect((await saveMail(db, 1, "self", mailSaveQuery("batch", ",,", 1, now))).result).toBe(
    "unchanged",
  );
  expect(queries.slice(count).map((entry) => entry.text)).toHaveLength(3);
  expect(queries.slice(count).some((entry) => /^(insert|update)/.test(entry.text))).toBe(false);
  expect(fixture.entries().find((entry) => entry.uid === "foreign")?.flag).toBe(0);
});

test("mail saving authorizes locked profiles before writing and rolls back flags and markers on every failure", async () => {
  for (const profile of [
    null,
    ["other", 1, "0", 0],
    ["self", 2, "0", 0],
    ["self", 1, "0", 1],
    ["self", 1, String(now + 1), 0],
  ]) {
    const fixture = database({ profile });
    expect((await saveMail(fixture.db, 1, "self", mailSaveQuery("save", "a", 1, now))).result).toBe(
      "unchanged",
    );
    expect(fixture.queries.some((entry) => /^(insert|update)/.test(entry.text))).toBe(false);
  }
  for (const fail of ["profile", "mail", "marker", "commit"]) {
    const fixture = database({ fail });
    const before = structuredClone(fixture.entries());
    await expect(
      saveMail(fixture.db, 1, "self", mailSaveQuery("batch", "a,b", 1, now)),
    ).rejects.toThrow();
    expect(fixture.entries()).toEqual(before);
    expect(fixture.markers().size).toBe(0);
    expect(fixture.queries.at(-1)?.text).toBe("rollback");
  }
});

test("the mutation adapter rejects malformed direct callers without executing SQL", () => {
  const fixture = database();
  const query = mailSaveQuery("save", "a", 1, now);
  for (const owner of ["", " ", "x".repeat(41), "a\0b", "\ud800"])
    {expect(() => saveMail(fixture.db, 1, owner, query)).toThrow();}
  for (const realm of [0, -1, 1.5, 2147483648])
    {expect(() => saveMail(fixture.db, realm, "self", query)).toThrow();}
  for (const patch of [
    { now: -1 },
    { now: NaN },
    { mode: "bad" },
    { flag: 2 },
    { flag: 0 },
    { ids: [] },
    { ids: ["a", "a"] },
    { ids: ["a\0b"] },
    { ids: ["\ud800"] },
    { ids: ["x".repeat(41)] },
  ])
    {expect(() => saveMail(fixture.db, 1, "self", { ...query, ...patch } as typeof query)).toThrow();}
  expect(fixture.queries).toEqual([]);
});
