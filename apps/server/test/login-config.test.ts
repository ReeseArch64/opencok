import { expect, test } from "bun:test";
import type { CityState, GameStore, LoginConfigurationState } from "@opencok/contracts/game";
import { Game } from "@opencok/controllers/game";
import { featureConfig, loginConfiguration } from "@opencok/mappings/bootstrap";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";
import { Rules } from "@opencok/rules/game";
import {
  accountVerificationEnabled,
  accountVerificationRequired,
  featureAnnouncementEnabled,
  type FeatureContext,
} from "@opencok/rules/features";

const now = Date.UTC(2026, 9, 23, 12);
const context: FeatureContext = {
  kingdomId: 2,
  uid: "synthetic",
  platform: "market_global",
  version: "12.06.0",
  now,
};
const rules = () =>
  new Rules(
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    2,
  );
const base = { online: "2", test: "9", version: "12.6.0", pf: "0" };
const configuration = (): LoginConfigurationState => ({
  profile: { uid: "synthetic", pf: "market_global", level: 0, deviceId: "synthetic-device" },
  switches: [],
  pushSettings: [],
});
const unused = async (): Promise<never> => {
  throw new Error("Unexpected dependency call");
};
function store(state: LoginConfigurationState): GameStore {
  return {
    mailGroups: unused,
    mailBatch: unused,
    mailCategory: unused,
    mailContents: unused,
    mailConversationSave: unused,
    mailDelete: unused,
    mailRead: unused,
    mailSave: unused,
    mailStatus: unused,
    allianceRanking: unused,
    playerRanking: unused,
    publicProfile: unused,
    getPlayerSummariesByIds: unused,
    getPowerByPlayerId: unused,
    initializeWorldNewsPreference: async (uid, instant) => {
      expect(uid).toBe("synthetic");
      expect(instant).toBe(now);
    },
    getConfigurationByPlayerId: async (uid) => {
      expect(uid).toBe("synthetic");
      return state;
    },
    getProfileById: unused,
    getAccountsByPlayerId: unused,
    getCityByPlayerId: unused,
    getWorldByPointIds: unused,
  };
}

test("feature announcements retain the legacy realm selector and version/platform metadata", () => {
  const catalog = rules();
  catalog.features.set("ui", {
    id: "ui",
    ...base,
    start: "2026-10-23-12-00",
    end: "2026-10-24-12-00",
  });
  const announcement = (ctx: FeatureContext) =>
    fields((featureConfig(catalog, ctx).funcOn!.value as Value[])[0]);
  expect(announcement(context)).toEqual({
    funcKey: sfs.string("ui"),
    pf: sfs.string("0"),
    version: sfs.string("12.6.0"),
    onOff: sfs.bool(true),
  });
  for (const override of [{ kingdomId: 3 }, { testServer: true }])
    expect(announcement({ ...context, ...override }).onOff?.value).toBe(false);
  expect(announcement({ ...context, testServer: true, kingdomId: 9 }).onOff?.value).toBe(true);
  expect(announcement({ ...context, now: now + 86_400_000 }).onOff?.value).toBe(true);
  expect(announcement({ ...context, version: "12.5.99", now: now - 1 }).onOff?.value).toBe(true);
  expect(JSON.stringify(announcement(context))).not.toContain(context.uid);
});

test("account-specific flags use global feature gates and exact channel/UID matches", () => {
  const catalog = rules();
  const pay = { id: "payelex", ...base };
  const role = { id: "role_on", ...base };
  catalog.features.set("cn_bind", { id: "cn_bind", ...base });
  catalog.items.set("cn_bind", {
    id: "cn_bind",
    k1: "market_global;AppStore",
    k2: "synthetic;other",
  });
  catalog.items.set("role_info", { id: "role_info", k4: "all", k5: "synthetic" });
  expect(featureAnnouncementEnabled(pay, catalog, context)).toBe(true);
  expect(featureAnnouncementEnabled(role, catalog, context)).toBe(false);
  catalog.features.set("role_on", role);
  const active = context;
  expect(featureAnnouncementEnabled(pay, catalog, active)).toBe(true);
  expect(featureAnnouncementEnabled(role, catalog, active)).toBe(true);
  expect(featureAnnouncementEnabled(pay, catalog, { ...active, uid: "syntheti" })).toBe(false);
  expect(featureAnnouncementEnabled(pay, catalog, { ...active, platform: "market" })).toBe(false);
  expect(featureAnnouncementEnabled(role, catalog, { ...active, uid: "synthetic-extra" })).toBe(
    false,
  );
  expect(featureAnnouncementEnabled(role, catalog, { ...active, version: "12.5.0" })).toBe(false);
  catalog.items.set("cn_bind", { id: "cn_bind", k1: "all", k2: "0" });
  expect(featureAnnouncementEnabled(pay, catalog, active)).toBe(false);
});

test("boss flags require running services while subscriptions use configured realm and platform", () => {
  const catalog = rules();
  for (const id of [
    "worldboss",
    "worldboss_elite",
    "worldboss_special",
    "worldboss_npc",
  ] as const) {
    const rule = { id, ...base };
    catalog.features.set(id === "worldboss" ? id : id.replace("worldboss", "world_boss"), rule);
    expect(featureAnnouncementEnabled(rule, catalog, context)).toBe(false);
    expect(featureAnnouncementEnabled(rule, catalog, { ...context, bossRunning: () => true })).toBe(
      true,
    );
    expect(
      featureAnnouncementEnabled(rule, catalog, {
        ...context,
        kingdomId: 3,
        bossRunning: () => true,
      }),
    ).toBe(false);
  }
  const subscription = { id: "subscribe", ...base };
  for (const platform of ["AppStore", "market_global", "market_global2"])
    expect(
      featureAnnouncementEnabled(subscription, catalog, {
        ...context,
        platform,
      }),
    ).toBe(true);
  expect(
    featureAnnouncementEnabled(subscription, catalog, {
      ...context,
      platform: "Google",
    }),
  ).toBe(false);
  expect(featureAnnouncementEnabled(subscription, catalog, context)).toBe(true);
});

test("configuration includes share XML, persisted switches and stable push defaults without writes", () => {
  const catalog = rules();
  catalog.configuration.facebookShare = new Map([
    ["001", { id: "001", value: "0005", label: "城" }],
  ]);
  const state = configuration();
  state.switches = [
    { name: "switch", stat: 1, appVersion: "12.6.0" },
    { name: "nullable", stat: null, appVersion: null },
  ];
  state.pushSettings = [{ type: 3, status: 0, audio: 1 }];
  const before = structuredClone(state);
  const result = decode(encode(loginConfiguration(catalog, state, context, true)));
  expect(result.fbShare).toEqual(
    sfs.array([
      sfs.object({ id: sfs.string("001"), value: sfs.string("0005"), label: sfs.string("城") }),
    ]),
  );
  expect(result.switches).toEqual(
    sfs.array([
      sfs.object({
        name: sfs.string("switch"),
        stat: sfs.int(1),
        appVersion: sfs.string("12.6.0"),
      }),
      sfs.object({ name: sfs.string("nullable"), stat: sfs.null(), appVersion: sfs.null() }),
    ]),
  );
  const preferences = (result.pushSetting!.value as Value[]).map(fields);
  expect(preferences.length).toBe(20);
  expect(preferences.find((row) => row.type?.value === 3)).toEqual({
    type: sfs.int(3),
    status: sfs.int(0),
    audio: sfs.int(1),
  });
  expect(preferences.find((row) => row.type?.value === 15)).toEqual({
    type: sfs.int(15),
    status: sfs.int(0),
  });
  expect(preferences.find((row) => row.type?.value === 19)).toEqual({
    type: sfs.int(19),
    status: sfs.int(1),
  });
  expect(result.isVerifyChangeAccount).toEqual(sfs.bool(true));
  expect(loginConfiguration(catalog, state, context, true)).toEqual(result);
  expect(state).toEqual(before);
});

test("fully saved notification preferences are retained without appending duplicate defaults", () => {
  const state = configuration();
  state.pushSettings = Array.from({ length: 20 }, (_, type) => ({
    type,
    status: type % 2,
    audio: 0,
  }));
  const output = loginConfiguration(rules(), state, context, false);
  const preferences = (output.pushSetting!.value as Value[]).map(fields);
  expect(preferences).toHaveLength(20);
  expect(preferences[15]?.status?.value).toBe(1);
  expect(preferences.every((row) => row.audio?.value === 0)).toBe(true);
});

test("account verification thresholds honor realm/version gates and signed Java Int limits", () => {
  const catalog = rules();
  catalog.items.set("function_on7", { id: "function_on7", k5: "12.6.0", k6: "2", k7: "3" });
  expect(accountVerificationEnabled(catalog, context)).toBe(true);
  expect(accountVerificationRequired(catalog, context, null)).toBe(false);
  expect(accountVerificationRequired(catalog, context, "2")).toBe(false);
  expect(accountVerificationRequired(catalog, context, "3")).toBe(true);
  expect(() => accountVerificationRequired(catalog, context, "9007199254740993")).toThrow();
  expect(accountVerificationRequired(catalog, { ...context, kingdomId: 3 }, "100")).toBe(false);
  expect(accountVerificationRequired(catalog, { ...context, version: "12.5.99" }, "100")).toBe(
    false,
  );
  catalog.items.get("function_on7")!.k7 = "invalid";
  expect(() => accountVerificationRequired(catalog, context, "3")).toThrow();
});

test("account verification parses item selectors after blank metadata and version gates", () => {
  const catalog = rules();
  const rule = { id: "function_on7", k5: "12.6.0", k6: "+２;bad", k7: "3" };
  catalog.items.set(rule.id, rule);
  expect(accountVerificationEnabled(catalog, context)).toBe(true);
  rule.k6 = "bad;2";
  expect(() => accountVerificationEnabled(catalog, context)).toThrow();
  expect(accountVerificationEnabled(catalog, { ...context, version: "1.0.0" })).toBe(false);
  rule.k6 = "\u2000";
  expect(accountVerificationEnabled(catalog, context)).toBe(false);
  rule.k6 = "bad";
  rule.k5 = "\u2000";
  expect(accountVerificationEnabled(catalog, context)).toBe(false);
});

test("account selector failure skips counter reads while an early realm match permits the enabled read", async () => {
  const catalog = rules();
  const state = configuration();
  const rule = { id: "function_on7", k5: "12.6.0", k6: "bad;2", k7: "3" };
  catalog.items.set(rule.id, rule);
  let reads = 0;
  const game = new Game(store(state), catalog, { kingdomId: 2 }, () => now, {
    changeAccountCount: async () => {
      reads++;
      return "3";
    },
  });
  expect(
    (await game.execute("synthetic", "login.other", { config: sfs.int(0) })).body
      .isVerifyChangeAccount,
  ).toBeUndefined();
  expect(reads).toBe(0);
  rule.k6 = "2;bad";
  const result = await game.execute("synthetic", "login.other", { config: sfs.int(0) });
  expect(result.body.isVerifyChangeAccount).toEqual(sfs.bool(true));
  expect(reads).toBe(1);
});

test("login.other config preserves correlation and omits verification when its dependency fails", async () => {
  const catalog = rules();
  const state = configuration();
  let reads = 0;
  const services = {
    changeAccountCount: async (deviceId: string) => {
      expect(deviceId).toBe("synthetic-device");
      reads++;
      return "3";
    },
  };
  const game = new Game(store(state), catalog, { kingdomId: 2 }, () => now, services);
  const request = {
    config: sfs.int(0),
    _cok_: sfs.string("request"),
    cmdBaseTime: sfs.string("42"),
  };
  expect(
    (await game.execute("synthetic", "login.other", request)).body.isVerifyChangeAccount?.value,
  ).toBe(false);
  expect(reads).toBe(0);
  catalog.items.set("function_on7", { id: "function_on7", k5: "12.6.0", k6: "2", k7: "3" });
  const result = await game.execute("synthetic", "login.other", request);
  expect(result.body.isVerifyChangeAccount?.value).toBe(true);
  expect(result.body._cok_?.value).toBe("request");
  expect(result.body.cmdBaseTime?.value).toBe("42");
  expect(result.pushes).toEqual([]);
  expect(reads).toBe(1);
  const failing = new Game(store(state), catalog, { kingdomId: 2 }, () => now, {
    changeAccountCount: unused,
  });
  const unavailable = (await failing.execute("synthetic", "login.other", request)).body;
  expect(unavailable.isVerifyChangeAccount).toBeUndefined();
  expect(unavailable.switches).toEqual(sfs.array());
  expect(unavailable._cok_).toEqual(sfs.string("request"));
  state.profile!.deviceId = "";
  expect(
    (await failing.execute("synthetic", "login.other", request)).body.isVerifyChangeAccount?.value,
  ).toBeUndefined();
  state.profile!.banFlag = 1;
  await expect(game.execute("synthetic", "login.other", request)).rejects.toThrow();
  state.profile = undefined;
  await expect(game.execute("synthetic", "login.other", request)).rejects.toThrow();
});

test("army selection takes precedence over config as in the legacy deferred-login dispatcher", async () => {
  const state: CityState = {
    profile: { uid: "synthetic" },
    resource: {},
    world: undefined,
    lord: undefined,
    buildings: [],
    queues: [],
    armies: [],
    items: [],
    hasMarches: false,
  };
  const db: GameStore = {
    ...store(configuration()),
    getConfigurationByPlayerId: unused,
    getPowerByPlayerId: unused,
    getCityByPlayerId: async () => state,
  };
  const output = await new Game(db, rules(), { kingdomId: 2 }).execute("synthetic", "login.other", {
    army: sfs.int(0),
    config: sfs.int(1),
  });
  expect(output.body.army).toEqual(sfs.array());
  expect(output.body.funcOn).toBeUndefined();
});

test("initial and deferred login announce ordinary, account and subscription metadata without reading boss state", async () => {
  const catalog = rules();
  catalog.roles.set("100100", { id: "100100", player_exp: "100" });
  catalog.features.set("ui", { id: "ui", ...base });
  for (const id of ["payelex", "cn_bind", "role_on", "subscribe"])
    catalog.features.set(id, { id, ...base });
  catalog.items.set("cn_bind", { k1: "all", k2: "synthetic" });
  catalog.items.set("role_info", { k4: "market_global", k5: "all" });
  const persisted = configuration();
  const state: CityState = {
    profile: persisted.profile,
    resource: {},
    world: { worldId: 0 },
    lord: undefined,
    buildings: [],
    queues: [],
    armies: [],
    items: [],
    hasMarches: false,
  };
  const game = new Game(
    { ...store(persisted), getCityByPlayerId: async () => state },
    catalog,
    { kingdomId: 2 },
    () => now,
    {
      featureAvailability: () => {
        throw new Error("No boss announcement requested");
      },
    },
  );
  const initial = await game.initial("synthetic");
  const deferred = (await game.execute("synthetic", "login.other", { config: sfs.int(1) })).body;
  expect(initial.funcOn).toEqual(deferred.funcOn);
  expect(fields((initial.funcOn!.value as Value[])[0]).onOff?.value).toBe(true);
  expect((initial.funcOn!.value as Value[]).map((value) => fields(value).onOff?.value)).toEqual([
    true,
    true,
    true,
    true,
    true,
  ]);
});

test("boss availability receives the persisted player and server time rather than client overrides", async () => {
  const catalog = rules();
  catalog.features.set("worldboss", { id: "worldboss", ...base });
  const persisted = configuration();
  const game = new Game(store(persisted), catalog, { kingdomId: 2 }, () => now, {
    featureAvailability: (profile, instant) => {
      expect(profile.uid).toBe("synthetic");
      expect(instant).toBe(now);
      return { worldboss: profile.pf === "market_global" };
    },
  });
  const input = {
    config: sfs.int(1),
    uid: sfs.string("other"),
    pf: sfs.string("Google"),
    now: sfs.long(0),
  };
  const result = await game.execute("synthetic", "login.other", input);
  expect(fields((result.body.funcOn!.value as Value[])[0]).onOff?.value).toBe(true);
  persisted.profile!.pf = "Google";
  const unavailable = await game.execute("synthetic", "login.other", input);
  expect(fields((unavailable.body.funcOn!.value as Value[])[0]).onOff?.value).toBe(false);
});

test("account version failures precede counter reads and noncanonical required versions reach the provider", async () => {
  const catalog = rules();
  const rule = { id: "function_on7", k5: "11.bad", k6: "2", k7: "3" };
  catalog.items.set(rule.id, rule);
  let reads = 0;
  const game = new Game(store(configuration()), catalog, { kingdomId: 2 }, () => now, {
    changeAccountCount: async () => {
      reads++;
      return "3";
    },
  });
  for (const version of ["11.bad", "12.6", "12.6.0.bad"]) {
    rule.k5 = version;
    expect(
      (await game.execute("synthetic", "login.other", { config: sfs.int(0) })).body
        .isVerifyChangeAccount,
    ).toBeUndefined();
    expect(reads).toBe(0);
  }
  rule.k5 = ".１２..+6.-0.99";
  const result = await game.execute("synthetic", "login.other", { config: sfs.int(0) });
  expect(result.body.isVerifyChangeAccount).toEqual(sfs.bool(true));
  expect(reads).toBe(1);
});

test("account counters and thresholds use signed Unicode Java Int parsing after null checks", () => {
  const catalog = rules();
  const rule = { id: "function_on7", k5: "12.6.0", k6: "2", k7: "3" };
  catalog.items.set("function_on7", rule);
  for (const [count, limit, expected] of [
    ["+３", "003", true],
    ["٢", "+3", false],
    ["-1", "-2", true],
    ["-2", "-1", false],
    ["-2147483648", "-2147483648", true],
    ["2147483647", "2147483647", true],
    ["-0", "+0", true],
    ["0".repeat(100) + "3", "3", true],
  ] as const) {
    rule.k7 = limit;
    expect(accountVerificationRequired(catalog, context, count)).toBe(expected);
  }
  for (const malformed of [
    "",
    " 3",
    "3 ",
    "3.0",
    "1e1",
    "NaN",
    "2147483648",
    "-2147483649",
    "😀",
    "0".repeat(65536),
  ]) {
    rule.k7 = "3";
    expect(() => accountVerificationRequired(catalog, context, malformed)).toThrow();
    rule.k7 = malformed;
    expect(() => accountVerificationRequired(catalog, context, "3")).toThrow();
    expect(accountVerificationRequired(catalog, context, null)).toBe(false);
    expect(accountVerificationRequired(catalog, { ...context, kingdomId: 3 }, malformed)).toBe(
      false,
    );
  }
  delete catalog.items.get("function_on7")!.k7;
  expect(accountVerificationRequired(catalog, context, "invalid")).toBe(false);
});

test("deferred account verification fetches enabled state before skipping absent thresholds and omits malformed results", async () => {
  const catalog = rules();
  const rule = { id: "function_on7", k5: "12.6.0", k6: "2" };
  catalog.items.set("function_on7", rule);
  const state = configuration();
  const before = structuredClone(state);
  let reads = 0;
  let counter: string | null = "bad";
  const game = new Game(store(state), catalog, { kingdomId: 2 }, () => now, {
    changeAccountCount: async () => {
      reads++;
      return counter;
    },
  });
  const request = { config: sfs.int(1) };
  expect(
    (await game.execute("synthetic", "login.other", request)).body.isVerifyChangeAccount,
  ).toEqual(sfs.bool(false));
  expect(reads).toBe(1);
  catalog.items.get("function_on7")!.k7 = "2";
  expect(
    (await game.execute("synthetic", "login.other", request)).body.isVerifyChangeAccount,
  ).toBeUndefined();
  expect(reads).toBe(2);
  counter = null;
  catalog.items.get("function_on7")!.k7 = "bad";
  expect(
    (await game.execute("synthetic", "login.other", request)).body.isVerifyChangeAccount,
  ).toEqual(sfs.bool(false));
  counter = "+２";
  catalog.items.get("function_on7")!.k7 = "2";
  expect(
    (await game.execute("synthetic", "login.other", request)).body.isVerifyChangeAccount,
  ).toEqual(sfs.bool(true));
  expect(state).toEqual(before);
});

test("deferred verification reads empty, null and missing device IDs using legacy string suffixes", async () => {
  const catalog = rules();
  catalog.items.set("function_on7", { k5: "12.6.0", k6: "2", k7: "2" });
  const state = configuration();
  const devices: string[] = [];
  const game = new Game(store(state), catalog, { kingdomId: 2 }, () => now, {
    changeAccountCount: async (device) => {
      devices.push(device);
      return "2";
    },
  });
  for (const device of ["", null, undefined, "null", " "]) {
    if (device === undefined) delete state.profile!.deviceId;
    else state.profile!.deviceId = device;
    const result = await game.execute("synthetic", "login.other", { config: sfs.int(1) });
    expect(result.body.isVerifyChangeAccount).toEqual(sfs.bool(true));
  }
  expect(devices).toEqual(["", "null", "null", "null", " "]);
  catalog.items.get("function_on7")!.k6 = "close";
  expect(
    (await game.execute("synthetic", "login.other", { config: sfs.int(1) })).body
      .isVerifyChangeAccount,
  ).toEqual(sfs.bool(false));
  expect(devices).toHaveLength(5);
});

test("failed switch reads omit both switch fields without blocking other configuration or reading counters", async () => {
  const catalog = rules();
  catalog.items.set("function_on7", { k5: "bad", k6: "bad", k7: "bad" });
  catalog.features.set("ui", { id: "ui", ...base });
  catalog.configuration.facebookShare = new Map([["share", { id: "share", value: "001" }]]);
  const state = configuration();
  state.switches = undefined;
  const before = structuredClone(state);
  const game = new Game(store(state), catalog, { kingdomId: 2 }, () => now, {
    changeAccountCount: unused,
  });
  const output = decode(
    encode(
      (
        await game.execute("synthetic", "login.other", {
          config: sfs.int(1),
          _cok_: sfs.string("switch-failure"),
          cmdBaseTime: sfs.string("42"),
        })
      ).body,
    ),
  );
  expect(Object.hasOwn(output, "switches")).toBe(false);
  expect(Object.hasOwn(output, "isVerifyChangeAccount")).toBe(false);
  expect(output.fbShare).toEqual(
    sfs.array([sfs.object({ id: sfs.string("share"), value: sfs.string("001") })]),
  );
  expect(output.pushSetting!.value as Value[]).toHaveLength(20);
  expect(fields((output.funcOn!.value as Value[])[0]).onOff).toEqual(sfs.bool(true));
  expect(output._cok_).toEqual(sfs.string("switch-failure"));
  expect(output.cmdBaseTime).toEqual(sfs.string("42"));
  expect(loginConfiguration(catalog, state, context, true).isVerifyChangeAccount).toBeUndefined();
  expect(state).toEqual(before);
});

test("verification failures preserve queried switches and later announcements without inventing false", async () => {
  const catalog = rules();
  catalog.items.set("function_on7", { k5: "12.6.0", k6: "2", k7: "2" });
  catalog.features.set("worldboss", { id: "worldboss", ...base });
  const state = configuration();
  state.switches = [{ name: "saved", stat: null, appVersion: null }];
  const calls: string[] = [];
  const game = new Game(store(state), catalog, { kingdomId: 2 }, () => now, {
    changeAccountCount: async () => {
      calls.push("counter");
      throw new Error("unavailable");
    },
    featureAvailability: () => {
      calls.push("announcements");
      return { worldboss: true };
    },
  });
  const output = decode(
    encode((await game.execute("synthetic", "login.other", { config: sfs.int(1) })).body),
  );
  expect(output.switches).toEqual(
    sfs.array([
      sfs.object({ name: sfs.string("saved"), stat: sfs.null(), appVersion: sfs.null() }),
    ]),
  );
  expect(Object.hasOwn(output, "isVerifyChangeAccount")).toBe(false);
  expect(fields((output.funcOn!.value as Value[])[0]).onOff).toEqual(sfs.bool(true));
  expect(calls).toEqual(["counter", "announcements"]);
  const noCounterProvider = new Game(store(state), catalog, { kingdomId: 2 }, () => now);
  expect(
    (await noCounterProvider.execute("synthetic", "login.other", { config: sfs.int(1) })).body
      .isVerifyChangeAccount,
  ).toBeUndefined();
});

test("required snapshot and later announcement failures remain outside the optional switch boundary", async () => {
  const catalog = rules();
  catalog.items.set("function_on7", { k5: "12.6.0", k6: "2", k7: "2" });
  catalog.features.set("worldboss", { id: "worldboss", ...base });
  const state = configuration();
  let reads = 0;
  const services = {
    changeAccountCount: async () => {
      reads++;
      return "3";
    },
    featureAvailability: () => {
      throw new Error("announcement failure");
    },
  };
  const requiredFailure = new Game(
    { ...store(state), getConfigurationByPlayerId: unused },
    catalog,
    { kingdomId: 2 },
    () => now,
    services,
  );
  await expect(
    requiredFailure.execute("synthetic", "login.other", { config: sfs.int(1) }),
  ).rejects.toThrow("Unexpected dependency call");
  expect(reads).toBe(0);
  const laterFailure = new Game(store(state), catalog, { kingdomId: 2 }, () => now, services);
  await expect(
    laterFailure.execute("synthetic", "login.other", { config: sfs.int(1) }),
  ).rejects.toThrow("announcement failure");
  expect(reads).toBe(1);
});

test("world-news preference initialization is conditioned on the original saved list", async () => {
  const state = configuration();
  const initialized: string[] = [];
  const game = new Game(
    {
      ...store(state),
      initializeWorldNewsPreference: async (uid, instant) => {
        expect(instant).toBe(now);
        initialized.push(uid);
      },
    },
    rules(),
    { kingdomId: 2 },
    () => now,
  );
  for (const saved of [[], [{ type: 3, status: 0, audio: 0 }]]) {
    state.pushSettings = saved;
    const result = await game.execute("synthetic", "login.other", { config: sfs.int(1) });
    const news = (result.body.pushSetting!.value as Value[])
      .map(fields)
      .find((item) => item.type?.value === 15)!;
    expect(news).toEqual({ type: sfs.int(15), status: sfs.int(0) });
    expect(state.pushSettings).toEqual(saved);
  }
  expect(initialized).toEqual(["synthetic", "synthetic"]);
  state.pushSettings = [{ type: 15, status: 1, audio: 0 }];
  const existing = await game.execute("synthetic", "login.other", { config: sfs.int(1) });
  expect(fields((existing.body.pushSetting!.value as Value[])[0])).toEqual({
    type: sfs.int(15),
    status: sfs.int(1),
    audio: sfs.int(0),
  });
  state.pushSettings = Array.from({ length: 20 }, (_, index) => ({
    type: index + 20,
    status: 0,
    audio: 0,
  }));
  const full = await game.execute("synthetic", "login.other", { config: sfs.int(1) });
  expect(full.body.pushSetting!.value as Value[]).toHaveLength(20);
  expect(initialized).toHaveLength(2);
});

test("initial preference persistence precedes switches and survives later announcement failure", async () => {
  const state = configuration();
  const catalog = rules();
  catalog.features.set("worldboss", { id: "worldboss", ...base });
  const calls: string[] = [];
  let saved = false;
  const db = {
    ...store(state),
    getConfigurationByPlayerId: async () => {
      calls.push("snapshot");
      return { ...state, pushSettings: saved ? [{ type: 15, status: 0, audio: 1 }] : [] };
    },
    initializeWorldNewsPreference: async () => {
      calls.push("initialize");
      saved = true;
    },
    configurationSwitches: async () => {
      calls.push("switches");
      return [];
    },
  };
  const game = new Game(db, catalog, { kingdomId: 2 }, () => now, {
    featureAvailability: () => {
      calls.push("announcements");
      throw new Error("later failure");
    },
  });
  await expect(game.execute("synthetic", "login.other", { config: sfs.int(1) })).rejects.toThrow(
    "later failure",
  );
  expect(saved).toBe(true);
  expect(calls).toEqual(["snapshot", "initialize", "switches", "announcements"]);
  catalog.features.clear();
  calls.length = 0;
  const retry = await game.execute("synthetic", "login.other", { config: sfs.int(1) });
  expect(fields((retry.body.pushSetting!.value as Value[])[0])).toEqual({
    type: sfs.int(15),
    status: sfs.int(0),
    audio: sfs.int(1),
  });
  expect(calls).toEqual(["snapshot", "switches"]);
});

test("failed or unavailable preference initialization rejects before optional switches and announcements", async () => {
  const state = configuration();
  const catalog = rules();
  let switches = 0;
  const db = {
    ...store(state),
    configurationSwitches: async () => {
      switches++;
      return [];
    },
    initializeWorldNewsPreference: unused,
  };
  const game = new Game(db, catalog, { kingdomId: 2 }, () => now);
  await expect(game.execute("synthetic", "login.other", { config: sfs.int(1) })).rejects.toThrow(
    "Unexpected dependency call",
  );
  expect(switches).toBe(0);
  const missing = new Game(
    { ...db, initializeWorldNewsPreference: undefined },
    catalog,
    { kingdomId: 2 },
    () => now,
  );
  await expect(
    missing.execute("synthetic", "login.other", { config: sfs.int(1) }),
  ).rejects.toThrow();
  expect(switches).toBe(0);
  state.profile!.banFlag = 1;
  await expect(game.execute("synthetic", "login.other", { config: sfs.int(1) })).rejects.toThrow();
  expect(switches).toBe(0);
});

test("a switch-provider exception after preference initialization omits its fields and keeps the saved default", async () => {
  const state = configuration();
  let saved = false;
  const db = {
    ...store(state),
    initializeWorldNewsPreference: async () => {
      saved = true;
    },
    configurationSwitches: async () => {
      expect(saved).toBe(true);
      throw new Error("optional query failure");
    },
  };
  const result = await new Game(db, rules(), { kingdomId: 2 }, () => now).execute(
    "synthetic",
    "login.other",
    { config: sfs.int(1) },
  );
  expect(saved).toBe(true);
  expect(result.body.switches).toBeUndefined();
  expect(result.body.isVerifyChangeAccount).toBeUndefined();
  expect(result.body.funcOn).toEqual(sfs.array());
  expect(result.body.pushSetting!.value as Value[]).toHaveLength(20);
});
