import { expect, test } from "bun:test";
import type { CityState, GameStore, LoginConfigurationState } from "@opencok/contracts/game";
import { Game } from "@opencok/controllers/game";
import { featureConfig, loginConfiguration } from "@opencok/dtos/bootstrap";
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
    mailStatus: unused,
    allianceRanking: unused,
    playerRanking: unused,
    publicProfile: unused,
    playerSummaries: unused,
    power: unused,
    configuration: async (uid) => {
      expect(uid).toBe("synthetic");
      return state;
    },
    profile: unused,
    accounts: unused,
    city: unused,
    world: unused,
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

test("account-specific flags require exact channel/UID matches and an available provider", () => {
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
  expect(featureAnnouncementEnabled(pay, catalog, context)).toBe(false);
  expect(featureAnnouncementEnabled(role, catalog, context)).toBe(false);
  const active = { ...context, services: { payelex: true, role_on: true } };
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

test("boss and subscription flags remain closed without authoritative service availability", () => {
  const catalog = rules();
  for (const id of [
    "worldboss",
    "worldboss_elite",
    "worldboss_special",
    "worldboss_npc",
  ] as const) {
    const rule = { id, ...base };
    expect(featureAnnouncementEnabled(rule, catalog, context)).toBe(false);
    expect(
      featureAnnouncementEnabled(rule, catalog, { ...context, services: { [id]: true } }),
    ).toBe(true);
    expect(
      featureAnnouncementEnabled(rule, catalog, {
        ...context,
        kingdomId: 3,
        services: { [id]: true },
      }),
    ).toBe(false);
  }
  const subscription = { id: "subscribe", ...base };
  for (const platform of ["AppStore", "market_global", "market_global2"])
    expect(
      featureAnnouncementEnabled(subscription, catalog, {
        ...context,
        platform,
        services: { subscribe: true },
      }),
    ).toBe(true);
  expect(
    featureAnnouncementEnabled(subscription, catalog, {
      ...context,
      platform: "Google",
      services: { subscribe: true },
    }),
  ).toBe(false);
  expect(featureAnnouncementEnabled(subscription, catalog, context)).toBe(false);
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

test("account verification thresholds honor realm/version gates without losing counter precision", () => {
  const catalog = rules();
  catalog.items.set("function_on7", { id: "function_on7", k5: "12.6.0", k6: "2", k7: "3" });
  expect(accountVerificationEnabled(catalog, context)).toBe(true);
  expect(accountVerificationRequired(catalog, context, null)).toBe(false);
  expect(accountVerificationRequired(catalog, context, 2n)).toBe(false);
  expect(accountVerificationRequired(catalog, context, 3n)).toBe(true);
  expect(accountVerificationRequired(catalog, context, 9007199254740993n)).toBe(true);
  expect(accountVerificationRequired(catalog, { ...context, kingdomId: 3 }, 100n)).toBe(false);
  expect(accountVerificationRequired(catalog, { ...context, version: "12.5.99" }, 100n)).toBe(
    false,
  );
  catalog.items.get("function_on7")!.k7 = "invalid";
  expect(() => accountVerificationRequired(catalog, context, 3n)).toThrow();
});

test("login.other config preserves correlation, reads counts only when enabled and fails on dependency errors", async () => {
  const catalog = rules();
  const state = configuration();
  let reads = 0;
  const services = {
    changeAccountCount: async (deviceId: string) => {
      expect(deviceId).toBe("synthetic-device");
      reads++;
      return 3n;
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
  await expect(failing.execute("synthetic", "login.other", request)).rejects.toThrow(
    "Unexpected dependency call",
  );
  state.profile!.deviceId = "";
  expect(
    (await failing.execute("synthetic", "login.other", request)).body.isVerifyChangeAccount?.value,
  ).toBe(false);
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
    configuration: unused,
    power: unused,
    city: async () => state,
  };
  const output = await new Game(db, rules(), { kingdomId: 2 }).execute("synthetic", "login.other", {
    army: sfs.int(0),
    config: sfs.int(1),
  });
  expect(output.body.army).toEqual(sfs.array());
  expect(output.body.funcOn).toBeUndefined();
});

test("initial and deferred login announce the same generic feature availability", async () => {
  const catalog = rules();
  catalog.roles.set("100100", { id: "100100", player_exp: "100" });
  catalog.features.set("ui", { id: "ui", ...base });
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
    { ...store(persisted), city: async () => state },
    catalog,
    { kingdomId: 2 },
    () => now,
  );
  const initial = await game.initial("synthetic");
  const deferred = (await game.execute("synthetic", "login.other", { config: sfs.int(1) })).body;
  expect(initial.funcOn).toEqual(deferred.funcOn);
  expect(fields((initial.funcOn!.value as Value[])[0]).onOff?.value).toBe(true);
});

test("feature services receive the persisted player and server time rather than client overrides", async () => {
  const catalog = rules();
  catalog.features.set("subscribe", { id: "subscribe", ...base });
  const persisted = configuration();
  const game = new Game(store(persisted), catalog, { kingdomId: 2 }, () => now, {
    featureAvailability: (profile, instant) => {
      expect(profile.uid).toBe("synthetic");
      expect(instant).toBe(now);
      return { subscribe: true };
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
