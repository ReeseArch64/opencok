import { expect, test } from "bun:test";
import type { GameStore, PushPreference } from "@opencok/contracts/game";
import type { Row } from "@opencok/contracts/rows";
import { Game } from "@opencok/controllers/game";
import { Rules } from "@opencok/rules/game";
import { decode, encode, fields, sfs, type Fields, type Value } from "@opencok/messages/sfs";

const now = 1000;
function fixture() {
  let profile: Row | undefined = { uid: "self", serverId: 2 };
  let rows: Row[] = [];
  const calls: string[] = [];
  const writes: PushPreference[] = [];
  const unexpected = async (): Promise<never> => {
    throw new Error("Unexpected configuration dependency");
  };
  const db = {
    getProfileById: async (uid: string) => {
      expect(uid).toBe("self");
      calls.push("profile");
      return profile;
    },
    getConfigurationByPlayerId: async (uid: string) => {
      expect(uid).toBe("self");
      calls.push("preferences");
      return { profile, pushSettings: structuredClone(rows), switches: undefined };
    },
    initializeWorldNewsPreference: async (uid: string, instant: number) => {
      expect([uid, instant]).toEqual(["self", now]);
      calls.push("initialize");
      rows.push({ type: 15, status: 0, audio: 1 });
    },
    setPushPreference: async (uid: string, preference: PushPreference, instant: number) => {
      expect([uid, instant]).toEqual(["self", now]);
      calls.push("set");
      writes.push({ ...preference });
      rows = rows.filter((row) => row.type !== preference.type);
      rows.push({ ...preference });
    },
    configurationSwitches: unexpected,
  };
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.features.set("broken", {});
  const game = new Game(db as unknown as GameStore, rules, { kingdomId: 2 }, () => now, {
    changeAccountCount: unexpected,
    featureAvailability: () => {
      throw new Error("Unexpected announcement");
    },
  });
  return {
    game,
    db,
    calls,
    writes,
    rows: (value: Row[]) => {
      rows = value;
    },
    profile: (value: Row | undefined) => {
      profile = value;
    },
  };
}
const preferenceRows = (body: Fields) => (body.pushSetting!.value as Value[]).map(fields);

test("standalone preference reads initialize news once and preserve first versus saved wire shapes", async () => {
  const instance = fixture();
  instance.rows([{ type: 3, status: -7, audio: 0 }]);
  const params = {
    uid: sfs.string("other"),
    server: sfs.int(99),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.long(22),
  };
  const first = await instance.game.execute("self", "pushSetting.get", params);
  expect(Object.keys(first.body).sort()).toEqual(["_cok_", "cmdBaseTime", "pushSetting"]);
  expect(first.pushes).toEqual([]);
  expect(first.body._cok_).toEqual(params._cok_);
  expect(first.body.cmdBaseTime).toEqual(params.cmdBaseTime);
  const rows = preferenceRows(decode(encode(first.body)));
  expect(rows).toHaveLength(20);
  expect(rows[0]).toEqual({ type: sfs.int(3), status: sfs.int(-7), audio: sfs.int(0) });
  expect(rows.find((row) => row.type?.value === 15)).toEqual({
    type: sfs.int(15),
    status: sfs.int(0),
  });
  expect(rows.find((row) => row.type?.value === 0)).toEqual({
    type: sfs.int(0),
    status: sfs.int(1),
  });
  const second = await instance.game.execute("self", "pushSetting.get", {});
  expect(preferenceRows(second.body).find((row) => row.type?.value === 15)).toEqual({
    type: sfs.int(15),
    status: sfs.int(0),
    audio: sfs.int(1),
  });
  expect(instance.calls).toEqual(["preferences", "initialize", "preferences"]);
});

test("saved news choices and full unknown-type lists suppress initialization", async () => {
  const instance = fixture();
  instance.rows([{ type: 15, status: 9, audio: -4 }]);
  const saved = await instance.game.execute("self", "pushSetting.get", {});
  expect(preferenceRows(saved.body)[0]).toEqual({
    type: sfs.int(15),
    status: sfs.int(9),
    audio: sfs.int(-4),
  });
  instance.rows(
    Array.from({ length: 20 }, (_, type) => ({ type: type + 100, status: 0, audio: 1 })),
  );
  const full = await instance.game.execute("self", "pushSetting.get", {});
  expect(preferenceRows(full.body)).toHaveLength(20);
  expect(instance.calls).toEqual(["preferences", "preferences"]);
});

test("setter preserves signed integers, defaults omitted audio on updates and shares state with the getter", async () => {
  const instance = fixture();
  const params = {
    type: sfs.int(-2147483648),
    status: sfs.int(2147483647),
    audio: sfs.int(-9),
    uid: sfs.string("other"),
    _cok_: sfs.string("set"),
    cmdBaseTime: sfs.long(42),
  };
  const first = await instance.game.execute("self", "parse.push.set", params);
  expect(first).toEqual({
    body: { success: sfs.bool(true), _cok_: params._cok_, cmdBaseTime: params.cmdBaseTime },
    pushes: [],
  });
  for (let index = 0; index < 2; index++)
    await instance.game.execute("self", "parse.push.set", {
      type: params.type,
      status: sfs.int(-2147483648),
    });
  expect(instance.writes).toEqual([
    { type: -2147483648, status: 2147483647, audio: -9 },
    { type: -2147483648, status: -2147483648, audio: 1 },
    { type: -2147483648, status: -2147483648, audio: 1 },
  ]);
  const read = await instance.game.execute("self", "pushSetting.get", {});
  expect(preferenceRows(read.body)[0]).toEqual({
    type: params.type,
    status: sfs.int(-2147483648),
    audio: sfs.int(1),
  });
});

test("explicit news choices are returned without resetting or initializing them", async () => {
  const instance = fixture();
  await instance.game.execute("self", "parse.push.set", {
    type: sfs.int(15),
    status: sfs.int(1),
    audio: sfs.int(0),
  });
  const result = await instance.game.execute("self", "pushSetting.get", {});
  expect(preferenceRows(result.body)[0]).toEqual({
    type: sfs.int(15),
    status: sfs.int(1),
    audio: sfs.int(0),
  });
  expect(instance.calls).toEqual(["profile", "set", "preferences"]);
});

test("malformed preference integers fail before profile reads or writes", async () => {
  const instance = fixture();
  for (const field of ["type", "status", "audio"]) {
    for (const value of [
      sfs.null(),
      sfs.bool(true),
      sfs.string("1"),
      sfs.byte(1),
      sfs.short(1),
      sfs.long(1),
      sfs.double(1),
      sfs.int(0.5),
      sfs.int(NaN),
      sfs.int(Infinity),
      sfs.int(2147483648),
      sfs.int(-2147483649),
    ]) {
      await expect(
        instance.game.execute("self", "parse.push.set", {
          type: sfs.int(0),
          status: sfs.int(1),
          [field]: value,
        }),
      ).rejects.toThrow();
    }
  }
  const incomplete: Fields[] = [{}, { type: sfs.int(0) }, { status: sfs.int(1) }];
  for (const params of incomplete)
    await expect(instance.game.execute("self", "parse.push.set", params)).rejects.toThrow();
  expect(instance.calls).toEqual([]);
  expect(instance.writes).toEqual([]);
});

test("missing and banned players cannot initialize or change preferences", async () => {
  const instance = fixture();
  const profiles: (Row | undefined)[] = [
    undefined,
    { uid: "self", banFlag: 1 },
    { uid: "self", banTime: 1001n },
  ];
  for (const profile of profiles) {
    instance.profile(profile);
    for (const command of ["pushSetting.get", "parse.push.set"])
      await expect(
        instance.game.execute("self", command, { type: sfs.int(1), status: sfs.int(0) }),
      ).rejects.toThrow();
  }
  expect(instance.writes).toEqual([]);
  expect(instance.calls).not.toContain("initialize");
});

test("failed required reads and preference writes propagate without a success response", async () => {
  for (const stage of [
    "getConfigurationByPlayerId",
    "initializeWorldNewsPreference",
    "setPushPreference",
  ] as const) {
    const instance = fixture();
    instance.db[stage] = async () => {
      throw new Error("Synthetic dependency failure");
    };
    const command = stage === "setPushPreference" ? "parse.push.set" : "pushSetting.get";
    await expect(
      instance.game.execute("self", command, { type: sfs.int(1), status: sfs.int(0) }),
    ).rejects.toThrow("Synthetic dependency failure");
  }
});
