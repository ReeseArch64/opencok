import { expect, test } from "bun:test";
import { drizzle, type NodePgClient } from "drizzle-orm/node-postgres";
import * as schema from "@opencok/drizzle/schema/kingdom";
import type { GameStore, ProfilePreferenceField } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Database } from "@opencok/repositories/game";
import { updateProfilePreference } from "@opencok/repositories/profile-preferences";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, sfs, type Fields } from "@opencok/messages/sfs";

const now = 1000;
const commands = [
  ["equip.show", "show", "showEquip"],
  ["medal.show", "show", "showMedal"],
  ["march.soldier.show", "show", "marchSoldierShow"],
  ["colorblind.set", "set", "colorblind"],
  ["equip.scroll", "setting", "scrollEquip"],
  ["banner.set", "set", "showBanner"],
  ["speed.cd.open", "open", "clientSaveFlag"],
] as const;
function fixture() {
  let profile: Row | undefined = { uid: "self", serverId: 2, banFlag: 0, banTime: 0n };
  let lockedProfile: Row | undefined;
  let overrideOwner = false;
  const initial: Row = {
    uid: "self",
    showEquip: 1,
    showMedal: 1,
    marchSoldierShow: 0,
    colorblind: 0,
    scrollEquip: 1,
    showBanner: 0n,
    clientSaveFlag: 0,
    taskStage: 37,
  };
  let saved = new Map<string, Row>([
    ["self", { ...initial }],
    ["other", { ...initial, uid: "other" }],
  ]);
  let lock = Promise.resolve();
  let sequence = 0;
  let failure = "";
  const queries: { client: number; text: string; params: unknown[] }[] = [];
  const calls: string[] = [];
  class FixturePool {
    async connect() {
      const client = sequence++;
      let working: Map<string, Row> | undefined;
      let unlock: (() => void) | undefined;
      const release = () => {
        unlock?.();
        unlock = undefined;
      };
      return {
        release,
        query: async (query: { text: string }, params: unknown[] = []) => {
          const text = query.text;
          queries.push({ client, text, params });
          if (text.startsWith("begin")) return { rows: [] };
          if (text === "rollback") {
            working = undefined;
            release();
            return { rows: [] };
          }
          if (text === "commit") {
            if (failure === "commit") throw new Error("Synthetic commit failure");
            saved = working!;
            working = undefined;
            release();
            if (failure === "lost") throw new Error("Synthetic lost acknowledgment");
            return { rows: [] };
          }
          if (text.includes('from "opencok_kingdom"."userprofile"')) {
            expect(text).toContain('where "opencok_kingdom"."userprofile"."uid" = $1');
            expect(text).toContain("for update");
            expect(params).toEqual(["self", 1]);
            const previous = lock;
            lock = new Promise<void>((resolve) => {
              unlock = resolve;
            });
            await previous;
            working = structuredClone(saved);
            if (failure === "owner") throw new Error("Synthetic owner failure");
            const current = overrideOwner ? lockedProfile : profile;
            return {
              rows: current
                ? [[current.uid, current.serverId, current.banFlag, current.banTime]]
                : [],
            };
          }
          if (!working) throw new Error("Query without owner lock");
          if (
            text.startsWith("select") &&
            text.includes('from "opencok_kingdom"."user_mixed_info"')
          ) {
            expect(text).toContain('where "opencok_kingdom"."user_mixed_info"."uid" = $1');
            expect(text).toContain("for update");
            expect(params).toEqual(["self", 1]);
            const field = /^select "uid", "([^"]+)"/.exec(text)?.[1];
            expect(commands.some(([, , column]) => column === field)).toBe(true);
            if (failure === "mixed") throw new Error("Synthetic mixed failure");
            const row = working.get("self");
            return { rows: row ? [[row.uid, row[field!]]] : [] };
          }
          if (text.startsWith('update "opencok_kingdom"."user_mixed_info"')) {
            const field =
              /set "([^"]+)" = \$1 where "opencok_kingdom"\."user_mixed_info"\."uid" = \$2$/.exec(
                text,
              )?.[1];
            expect(commands.some(([, , column]) => column === field)).toBe(true);
            expect(params[1]).toBe("self");
            expect(params).toHaveLength(2);
            if (failure === "update") throw new Error("Synthetic update failure");
            working.get("self")![field!] =
              field === "showBanner" ? BigInt(params[0] as string) : (params[0] as number);
            return { rows: [], rowCount: 1 };
          }
          throw new Error("Unexpected SQL");
        },
      };
    }
  }
  const db = drizzle(new FixturePool() as unknown as NodePgClient, { schema });
  const repository = { kingdom: { db }, config: { kingdomId: 2 } } as Database;
  const store = {
    profile: async (uid: string) => {
      expect(uid).toBe("self");
      calls.push("profile");
      return profile;
    },
    updateProfilePreference: (
      uid: string,
      field: ProfilePreferenceField,
      instant: number,
      readValue: () => number,
    ) => {
      expect([uid, instant]).toEqual(["self", now]);
      return Database.prototype.updateProfilePreference.call(
        repository,
        uid,
        field,
        instant,
        readValue,
      );
    },
  };
  return {
    db,
    queries,
    calls,
    game: new Game(
      store as unknown as GameStore,
      new Rules(new Map(), new Map(), new Map()),
      { kingdomId: 2 },
      () => now,
    ),
    row: () => structuredClone(saved.get("self")),
    other: () => structuredClone(saved.get("other")),
    setRow: (row: Row | undefined) => {
      if (row) saved.set("self", row);
      else saved.delete("self");
    },
    profile: (row: Row | undefined) => {
      profile = row;
    },
    owner: (row: Row | undefined) => {
      overrideOwner = true;
      lockedProfile = row;
    },
    fail: (value: string) => {
      failure = value;
    },
  };
}

test("seven profile commands persist only their mapped field and return exact responses without pushes", async () => {
  for (const [command, key, column] of commands) {
    const instance = fixture();
    const before = instance.row()!;
    const other = instance.other();
    const value = command === "equip.scroll" ? 0 : -2147483648;
    const params = {
      [key]: sfs.int(value),
      uid: sfs.string("other"),
      server: sfs.int(99),
      _cok_: sfs.string("request"),
      cmdBaseTime: sfs.long(42),
    };
    const result = await instance.game.execute("self", command, params);
    const expected: Fields =
      command === "equip.scroll"
        ? { scrollEquip: sfs.bool(false) }
        : command === "speed.cd.open"
          ? { success: sfs.bool(true) }
          : { show: sfs.int(value) };
    expect(decode(encode(result.body))).toEqual({
      ...expected,
      _cok_: params._cok_,
      cmdBaseTime: params.cmdBaseTime,
    });
    expect(result.pushes).toEqual([]);
    expect(instance.row()).toEqual({
      ...before,
      [column]: column === "showBanner" ? BigInt(value) : value,
    });
    expect(instance.other()).toEqual(other);
    expect(instance.queries[0]?.text).toBe("begin isolation level read committed read write");
    expect(instance.queries.at(-1)?.text).toBe("commit");
  }
});

test("unchanged profile values skip writes while speed flags write on every accepted request", async () => {
  for (const [command, key, column] of commands) {
    const instance = fixture();
    const value = Number(instance.row()![column]);
    for (let index = 0; index < 2; index++)
      await instance.game.execute("self", command, { [key]: sfs.int(value) });
    expect(
      instance.queries.filter(({ text }) => text.startsWith("update")),
      command,
    ).toHaveLength(command === "speed.cd.open" ? 2 : 0);
  }
});

test("SQL null flags compare as primitive zero and retained values span the signed Int domain", async () => {
  for (const [command, key, column] of commands) {
    const instance = fixture();
    instance.setRow({ ...instance.row()!, [column]: null });
    await instance.game.execute("self", command, { [key]: sfs.int(0) });
    expect(instance.row()![column]).toBe(command === "speed.cd.open" ? 0 : null);
    if (command !== "equip.scroll") {
      await instance.game.execute("self", command, { [key]: sfs.int(2147483647) });
      expect(instance.row()![column]).toBe(column === "showBanner" ? 2147483647n : 2147483647);
    }
  }
});

test("optional banner and speed fields do not read mixed state when absent and tolerate a missing profile", async () => {
  for (const command of ["banner.set", "speed.cd.open"]) {
    const instance = fixture();
    for (const profile of [{ uid: "self" }, undefined]) {
      instance.profile(profile);
      expect(await instance.game.execute("self", command, { _cok_: sfs.string("empty") })).toEqual({
        body: { success: sfs.bool(true), _cok_: sfs.string("empty") },
        pushes: [],
      });
    }
    expect(instance.queries).toEqual([]);
  }
});

test("missing mixed state suppresses lazy optional parsing but required preference rows fail", async () => {
  for (const [command, key] of commands) {
    const instance = fixture();
    instance.setRow(undefined);
    const optional = command === "banner.set" || command === "speed.cd.open";
    const request = instance.game.execute("self", command, {
      [key]: optional ? sfs.string("malformed but unused") : sfs.int(1),
    });
    if (optional) expect(await request).toEqual({ body: { success: sfs.bool(true) }, pushes: [] });
    else await expect(request).rejects.toThrow();
    expect(instance.row()).toBeUndefined();
    expect(instance.queries.some(({ text }) => /^(insert|update|delete)/.test(text))).toBe(false);
  }
});

test("out-of-domain scroll integers acknowledge without mixed reads while 0 and 1 produce Bool metadata", async () => {
  const instance = fixture();
  instance.fail("mixed");
  for (const setting of [-2147483648, -1, 2, 2147483647])
    expect(
      await instance.game.execute("self", "equip.scroll", { setting: sfs.int(setting) }),
    ).toEqual({ body: { success: sfs.bool(true) }, pushes: [] });
  expect(instance.queries).toEqual([]);
  instance.fail("");
  for (const setting of [0, 1])
    expect(
      (await instance.game.execute("self", "equip.scroll", { setting: sfs.int(setting) })).body,
    ).toEqual({ scrollEquip: sfs.bool(setting === 1) });
});

test("malformed present flag values reject when consumed and never modify saved state", async () => {
  for (const [command, key] of commands) {
    const instance = fixture();
    const before = instance.row();
    for (const value of [
      sfs.null(),
      sfs.bool(true),
      sfs.string("1"),
      sfs.short(1),
      sfs.long(1),
      sfs.int(0.5),
      sfs.int(NaN),
      sfs.int(2147483648),
      sfs.int(-2147483649),
    ])
      await expect(instance.game.execute("self", command, { [key]: value })).rejects.toThrow();
    if (command !== "banner.set" && command !== "speed.cd.open")
      await expect(instance.game.execute("self", command, {})).rejects.toThrow();
    expect(instance.row()).toEqual(before);
    expect(instance.queries.some(({ text }) => text.startsWith("update"))).toBe(false);
    if (command === "banner.set" || command === "speed.cd.open")
      expect(instance.queries.at(-1)?.text).toBe("rollback");
    else expect(instance.queries).toEqual([]);
  }
});

test("owner revalidation rejects stale moved banned and mismatched players before mixed reads", async () => {
  const valid = { uid: "self", serverId: 2, banFlag: 0, banTime: 0n };
  for (const owner of [
    undefined,
    { ...valid, uid: "other" },
    { ...valid, serverId: 3 },
    { ...valid, banFlag: 1 },
    { ...valid, banTime: 1001n },
  ]) {
    const instance = fixture();
    instance.owner(owner);
    const before = instance.row();
    await expect(
      instance.game.execute("self", "banner.set", { set: sfs.int(1) }),
    ).rejects.toThrow();
    expect(instance.row()).toEqual(before);
    expect(instance.queries.some(({ text }) => text.includes('"user_mixed_info"'))).toBe(false);
  }
  const expired = fixture();
  expired.owner({ ...valid, banTime: 1000n });
  await expired.game.execute("self", "banner.set", { set: sfs.int(1) });
  expect(expired.row()!.showBanner).toBe(1n);
});

test("failed profile preference transactions roll back and lost acknowledgment retries preserve the saved value", async () => {
  for (const stage of ["owner", "mixed", "update", "commit"]) {
    const instance = fixture();
    instance.fail(stage);
    const before = instance.row();
    await expect(
      instance.game.execute("self", "medal.show", { show: sfs.int(0) }),
    ).rejects.toThrow();
    expect(instance.row()).toEqual(before);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
  }
  const instance = fixture();
  instance.fail("lost");
  await expect(instance.game.execute("self", "medal.show", { show: sfs.int(0) })).rejects.toThrow();
  expect(instance.row()!.showMedal).toBe(0);
  instance.fail("");
  await instance.game.execute("self", "medal.show", { show: sfs.int(0) });
  expect(instance.queries.filter(({ text }) => text.startsWith("update"))).toHaveLength(1);
});

test("simulated concurrent flag changes preserve both fields after serial owner locks", async () => {
  const instance = fixture();
  await Promise.all([
    instance.game.execute("self", "medal.show", { show: sfs.int(0) }),
    instance.game.execute("self", "equip.show", { show: sfs.int(-9) }),
  ]);
  expect(instance.row()!.showMedal).toBe(0);
  expect(instance.row()!.showEquip).toBe(-9);
  expect(instance.row()!.taskStage).toBe(37);
  const firstCommit = instance.queries.findIndex(
    ({ client, text }) => client === 0 && text === "commit",
  );
  const secondRead = instance.queries.findIndex(
    ({ client, text }) =>
      client === 1 && text.startsWith("select") && text.includes('"user_mixed_info"'),
  );
  expect(secondRead).toBeGreaterThan(firstCommit);
});

test("invalid repository selectors and identity bounds reject before queries or deferred decoding", async () => {
  const instance = fixture();
  let reads = 0;
  const value = () => {
    reads++;
    return 1;
  };
  for (const uid of ["", "x".repeat(41), "a\0b", "\ud800"])
    await expect(
      updateProfilePreference(instance.db, uid, 2, "showEquip", now, value),
    ).rejects.toThrow();
  for (const field of ["uid", "taskStage", "__proto__"])
    await expect(
      updateProfilePreference(instance.db, "self", 2, field as ProfilePreferenceField, now, value),
    ).rejects.toThrow();
  for (const instant of [-1, NaN, Infinity, 0.5])
    await expect(
      updateProfilePreference(instance.db, "self", 2, "showEquip", instant, value),
    ).rejects.toThrow();
  for (const realm of [0, -1, NaN, 0.5])
    await expect(
      updateProfilePreference(instance.db, "self", realm, "showEquip", now, value),
    ).rejects.toThrow();
  expect(instance.queries).toEqual([]);
  expect(reads).toBe(0);
});

test("restored banner values and mixed ownership are checked before deferred input consumption", async () => {
  const changes: Row[] = [
    { showBanner: 2147483648n },
    { showBanner: -2147483649n },
    { uid: "other" },
  ];
  for (const change of changes) {
    const instance = fixture();
    instance.setRow({ ...instance.row()!, ...change });
    const before = instance.row();
    let decoded = false;
    await expect(
      updateProfilePreference(instance.db, "self", 2, "showBanner", now, () => {
        decoded = true;
        return 1;
      }),
    ).rejects.toThrow();
    expect(decoded).toBe(false);
    expect(instance.row()).toEqual(before);
    expect(instance.queries.some(({ text }) => text.startsWith("update"))).toBe(false);
  }
  for (const [field, value] of [
    ["showEquip", 0.5],
    ["showBanner", 2147483648],
    ["scrollEquip", 2],
  ] as const) {
    const instance = fixture();
    const before = instance.row();
    await expect(
      updateProfilePreference(instance.db, "self", 2, field, now, () => value),
    ).rejects.toThrow();
    expect(instance.row()).toEqual(before);
    expect(instance.queries.at(-1)?.text).toBe("rollback");
  }
});
