import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import { saveCelebrityDescription } from "@opencok/repositories/celebrity";
import { GameService as Game } from "@opencok/services/game";
import { Rules } from "@opencok/rules/game";
import { NicknameWordFilter } from "@opencok/resources/nickname-words";
import type { GameServices, GameStore } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function fixture(initial = new Map<string, Buffer | null>()) {
  const saved = structuredClone(initial);
  const calls: string[] = [];
  const queries: { text: string; params: unknown[] }[] = [];
  let owner: Row | undefined = { uid: "owner", serverId: 1, gmFlag: 11, banFlag: 0, banTime: 0n };
  let fresh: Row | undefined = owner;
  let queue = Promise.resolve();
  let failure = "";
  let beforeWrite: (() => Promise<void>) | undefined;
  const filter = new NicknameWordFilter(async () => ["blocked", "中文"]);
  class Pool {
    async connect() {
      let release!: () => void;
      let changes = new Map<string, Buffer | null>();
      return {
        release() {},
        async query(query: { text: string }, params: unknown[] = []) {
          const text = query.text;
          queries.push({ text, params });
          if (text.startsWith("begin")) {return { rows: [] };}
          if (text === "rollback") {
            changes.clear();
            release?.();
            return { rows: [] };
          }
          if (text === "commit") {
            if (failure === "commit") {throw new Error("Synthetic commit failure");}
            for (const [uid, description] of changes) {saved.set(uid, description);}
            release?.();
            return { rows: [] };
          }
          if (text.includes('from "opencok_kingdom"."userprofile"')) {
            calls.push("owner");
            expect(text).toContain("for update");
            expect(params).toEqual(["owner", 1]);
            const previous = queue;
            queue = new Promise<void>((done) => {
              release = done;
            });
            await previous;
            if (failure === "owner") {throw new Error("Synthetic owner read failure");}
            return {
              rows: fresh
                ? [
                    [
                      fresh.uid,
                      fresh.serverId,
                      fresh.gmFlag,
                      fresh.banFlag ?? 0,
                      fresh.banTime ?? 0n,
                    ],
                  ]
                : [],
            };
          }
          if (text.startsWith('select "uid"')) {
            calls.push("existing");
            if (failure === "read") {throw new Error("Synthetic description read failure");}
            const pattern = new RegExp(params[0] as string, "u");
            return {
              rows: [...saved.keys()].filter((uid) => pattern.test(uid)).map((uid) => [uid]),
            };
          }
          await beforeWrite?.();
          if (text.startsWith("insert ")) {
            calls.push("insert");
            expect(text).toBe(
              'insert into "opencok_kingdom"."celebrity" ("uid", "description") values ($1, $2) returning "uid"',
            );
            if (failure === "insert") {throw new Error("Synthetic insert failure");}
            const [uid, description] = params as [string, Buffer | null];
            if (saved.has(uid)) {throw new Error("Synthetic duplicate row");}
            changes.set(uid, description);
            return { rows: failure === "result" ? [] : [[uid]] };
          }
          calls.push("update");
          expect(text).toBe(
            'update "opencok_kingdom"."celebrity" set "description" = $1 where "opencok_kingdom"."celebrity"."uid" = $2 returning "uid"',
          );
          if (failure === "update") {throw new Error("Synthetic update failure");}
          const [description, uid] = params as [Buffer | null, string];
          changes.set(uid, description);
          return { rows: failure === "result" ? [] : [[uid]] };
        },
      };
    }
  }
  const db = drizzle(new Pool() as unknown as NodePgClient) as unknown as Parameters<
    typeof saveCelebrityDescription
  >[0];
  const store = {
    async getProfileById() {
      calls.push("profile");
      return owner;
    },
    saveCelebrityDescription(uid: string, now: number, read: () => Buffer | null) {
      return saveCelebrityDescription(db, uid, 1, now, read);
    },
  };
  const services: GameServices = {
    filterBadWords: (text) => {
      calls.push("filter");
      return filter.filter(text);
    },
  };
  const game = new Game(
    store as unknown as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    services,
  );
  return {
    calls,
    queries,
    saved,
    services,
    filter,
    run: (params: Fields) => game.execute("owner", "celebrity.desc.save", params),
    owner: (value: Row | undefined) => {
      owner = value;
    },
    fresh: (value: Row | undefined) => {
      fresh = value;
    },
    fail: (value: string) => {
      failure = value;
    },
    beforeWrite: (value: () => Promise<void>) => {
      beforeWrite = value;
    },
  };
}

test("celebrity saves filter the real loaded words and acknowledge only the authenticated owner's insert", async () => {
  const instance = fixture(new Map([["other", Buffer.from("unchanged")]]));
  await instance.filter.reload();
  const params = {
    uid: sfs.string("other"),
    description: sfs.string(" BLOCKED and 中 文 "),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.long(8),
  };
  const result = await instance.run(decode(encode(params)));
  expect(result).toEqual({
    body: { success: sfs.bool(true), _cok_: params._cok_, cmdBaseTime: params.cmdBaseTime },
    pushes: [],
  });
  expect(instance.saved.get("owner")?.toString("utf8").replace(/\0+$/, "")).toBe("** and **");
  expect(Buffer.from(instance.saved.get("other")!)).toEqual(Buffer.from("unchanged"));
  expect(instance.calls).toEqual(["profile", "owner", "existing", "filter", "insert"]);
});

test("existing celebrity rows update without an upsert and preserve unrelated canonical false positives", async () => {
  const instance = fixture(
    new Map([
      ["ÓWNER ", Buffer.from("old")],
      ["rowen", Buffer.from("other")],
    ]),
  );
  await instance.run({ description: sfs.string("abcdefghij") });
  expect(Buffer.from(instance.saved.get("ÓWNER ")!)).toEqual(Buffer.from("abcdefghij\0"));
  expect(Buffer.from(instance.saved.get("rowen")!)).toEqual(Buffer.from("other"));
  expect(instance.saved.has("owner")).toBe(false);
  expect(instance.calls.at(-1)).toBe("update");
});

test("non-celebrities acknowledge before decoding description or requiring its filter", async () => {
  for (const flag of [null, -1, 0, 1, 10, 12]) {
    const instance = fixture();
    instance.owner({ uid: "owner", serverId: 1, gmFlag: flag });
    instance.services.filterBadWords = undefined;
    expect(await instance.run({ description: sfs.int(7) })).toEqual({
      body: { success: sfs.bool(true) },
      pushes: [],
    });
    expect(instance.calls).toEqual(["profile"]);
    expect(instance.queries).toEqual([]);
  }
});

test("blank and malformed UTF-16 descriptions persist null while valid Unicode retains Java encoder capacity", async () => {
  for (const [description, expected] of [
    ["", null],
    [" \t\u2000", null],
    ["\ud800", null],
    ["中文", Buffer.concat([Buffer.from("中文"), Buffer.alloc(5)])],
    [" \0x\0 ", Buffer.from("x")],
  ] as const) {
    const instance = fixture();
    await instance.run({ description: sfs.string(description) });
    expect(instance.saved.get("owner")).toEqual(expected);
  }
});

test("description and filter failures occur after the existing-row read and roll back", async () => {
  for (const params of [{}, { description: sfs.int(1) }] as Fields[]) {
    const instance = fixture();
    await expect(instance.run(params)).rejects.toThrow();
    expect(instance.calls).toEqual(["profile", "owner", "existing"]);
    expect(instance.saved.size).toBe(0);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
  }
  const missing = fixture();
  missing.services.filterBadWords = undefined;
  await expect(missing.run({ description: sfs.string("valid") })).rejects.toThrow();
  expect(missing.calls).toEqual(["profile", "owner", "existing"]);
  const long = fixture();
  await expect(long.run({ description: sfs.string("a".repeat(60000)) })).rejects.toThrow();
  expect(long.saved.size).toBe(0);
});

test("owner revalidation and canonical row ambiguity stop writes before filtering", async () => {
  for (const fresh of [
    undefined,
    { uid: "wrong", serverId: 1, gmFlag: 11 },
    { uid: "owner", serverId: 2, gmFlag: 11 },
    { uid: "owner", serverId: 1, gmFlag: 11, banFlag: 1 },
    { uid: "owner", serverId: 1, gmFlag: 11, banTime: 1001n },
  ] as (Row | undefined)[]) {
    const instance = fixture();
    instance.fresh(fresh);
    await expect(instance.run({ description: sfs.string("valid") })).rejects.toThrow();
    expect(instance.calls).toEqual(["profile", "owner"]);
    expect(instance.saved.size).toBe(0);
  }
  const noLongerCelebrity = fixture();
  noLongerCelebrity.fresh({ uid: "owner", serverId: 1, gmFlag: 0 });
  expect(await noLongerCelebrity.run({})).toEqual({
    body: { success: sfs.bool(true) },
    pushes: [],
  });
  expect(noLongerCelebrity.calls).toEqual(["profile", "owner"]);
  const ambiguous = fixture(
    new Map([
      ["owner", null],
      ["OWNER", null],
    ]),
  );
  await expect(ambiguous.run({ description: sfs.string("valid") })).rejects.toThrow();
  expect(ambiguous.calls).toEqual(["profile", "owner", "existing"]);
});

test("write and commit failures leave prior fake-pool state without automatic retries", async () => {
  for (const failure of ["owner", "read", "insert", "result", "commit"]) {
    const instance = fixture();
    instance.fail(failure);
    await expect(instance.run({ description: sfs.string("valid") })).rejects.toThrow();
    expect(instance.saved.size).toBe(0);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
    expect(instance.calls.filter((call) => call === "filter").length).toBeLessThanOrEqual(1);
  }
  const update = fixture(new Map([["owner", Buffer.from("old")]]));
  update.fail("update");
  await expect(update.run({ description: sfs.string("valid") })).rejects.toThrow();
  expect(Buffer.from(update.saved.get("owner")!)).toEqual(Buffer.from("old"));
});

test("concurrent saves for one owner serialize insertion and then update the same row", async () => {
  const instance = fixture();
  const entered = deferred(),
    finish = deferred();
  let writes = 0;
  instance.beforeWrite(async () => {
    if (++writes === 1) {
      entered.resolve();
      await finish.promise;
    }
  });
  const first = instance.run({ description: sfs.string("first") });
  await entered.promise;
  const second = instance.run({ description: sfs.string("second") });
  finish.resolve();
  await Promise.all([first, second]);
  expect(instance.calls.filter((call) => call === "insert" || call === "update")).toEqual([
    "insert",
    "update",
  ]);
  expect(instance.saved.size).toBe(1);
  expect(instance.saved.get("owner")?.toString("utf8")).toBe("second");
});
