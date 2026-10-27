import { expect, test } from "bun:test";
import type { WorldResourceOwnerSnapshot } from "@opencok/contracts/world-point-detail";
import type { RuleContext } from "@opencok/rules/availability";
import { Rules } from "@opencok/rules/game";
import {
  resourceGeneralBuildingEffect,
  restoredResourceBuilding,
} from "@opencok/hero/services/general-building-effects";

function fixture() {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.features.set("general_official", { version: "12.6.0", online: "2", test: "3" });
  rules.features.set("general_random_effect", { version: "12.6.0", online: "2", test: "3" });
  rules.items.set("general_official", { k1: "30", k2: "1.5" });
  rules.power.newGeneralOffices = new Map([
    [
      "office",
      {
        unlock: "1;30|2;5|3;20",
        pos_unlock: "1;0;0",
        effect: "78",
        unlock_person_num: "1",
      },
    ],
  ]);
  rules.power.prestigeLevelRecords = [{ reputation_point: "100", reputation_level: "5" }];
  rules.power.equipment = new Map([["1", { site: "0", para1: "78", num1: "4" }]]);
  rules.power.newGeneralRefinement = new Map([["r", { effect: "78" }]]);
  const snapshot: WorldResourceOwnerSnapshot = {
    effects: {
      profile: {
        uid: "owner",
        level: 20,
        civilizationType: 2,
        appVersion: "12.6.0",
        serverId: 99,
        crossFightSrcServerId: 88,
      },
      generals: [],
      sciences: [],
      civilizationSciences: [],
      sagaSciences: [],
      foreignSciences: [],
      equipment: [],
      heroes: [],
      dragons: [],
      dragonSkills: [],
      states: [],
      vip: undefined,
      allianceSciences: [],
      prestige: [{ civilizationType: 2, prestigeValue: 100n }],
      military: undefined,
      miracle: undefined,
      office: undefined,
      kingdomFights: [],
      territoryTrees: [],
      luckyDay: undefined,
      powerServer: undefined,
      throneRewards: [],
    },
    buildings: [{ uuid: "a", itemId: 400000, level: 25, star: 5 }],
    newGenerals: {
      moved: false,
      generals: [
        {
          id: 7,
          state: 6,
          buildingUuid: null,
          star: 1,
          baseSkill: null,
          talent: null,
          opTime: null,
          refinement: null,
        },
      ],
      statuses: [],
      equipment: [{ generalId: 7, itemId: 1, extraProperty: null }],
      offices: [{ id: 7, officeId: "office", position: 1, startTime: 1n }],
    },
  };
  let calls = 0;
  let ticks = 0;
  const resolve = (patch: Partial<RuleContext> = {}, buildingItemId = 400000) => {
    const context = { now: 1000, kingdomId: 2, version: "0.0.0", ...patch };
    return resourceGeneralBuildingEffect(
      snapshot,
      rules,
      context,
      78,
      () => {
        calls++;
        return 0;
      },
      () => {
        ticks++;
        return 1000n;
      },
      buildingItemId,
    );
  };
  return {
    rules,
    snapshot,
    resolve,
    reads: () => ({ calls, ticks }),
    building: (itemId = 400000) => restoredResourceBuilding(snapshot, rules, itemId),
  };
}

test("building selection follows fresh UUID concurrent-map order and uses the selected stronghold instead of maximum level", () => {
  const f = fixture();
  f.snapshot.buildings = [
    { uuid: "z", itemId: 400000, level: 100, star: 100 },
    { uuid: "a", itemId: 400000, level: 25, star: 5 },
    { uuid: "b", itemId: 400001, level: 8, star: 0 },
  ];
  const before = structuredClone(f.snapshot);
  const building = f.building();
  expect(building.buildingUuid).toBe("a");
  expect([...building.buildingUuids]).toEqual(["a", "b", "z"]);
  expect(building.mainBuildingLevel).toBe(30);
  expect(f.building(400001).buildingUuid).toBe("b");
  expect(f.building(400001).mainBuildingLevel).toBe(30);
  expect(f.resolve()).toBe(6);
  expect(f.snapshot).toEqual(before);
});

test("building duplicate UUIDs retain their final record and main level plus star wraps as a Java Int", () => {
  const f = fixture();
  f.snapshot.buildings = [
    { uuid: "a", itemId: 400001, level: 1, star: 0 },
    { uuid: "a", itemId: 400000, level: 2147483647, star: 1 },
  ];
  expect(f.building().buildingUuid).toBe("a");
  expect(f.building().mainBuildingLevel).toBe(-2147483648);
  expect(f.building(400001).buildingUuid).toBeUndefined();
  expect(f.resolve()).toBe(0);
  f.snapshot.buildings[1]!.level = -2147483648;
  f.snapshot.buildings[1]!.star = -1;
  expect(f.building().mainBuildingLevel).toBe(2147483647);
  f.snapshot.buildings[1]!.level = 30;
  f.snapshot.buildings[1]!.star = null;
  expect(f.building().mainBuildingLevel).toBe(30);
});

test("missing requested buildings return before restoring malformed generals or reading owner context", () => {
  const f = fixture();
  f.snapshot.buildings = [];
  f.snapshot.newGenerals.generals[0]!.talent = "1;bad";
  f.snapshot.effects.profile.appVersion = 123;
  f.snapshot.newGenerals.offices = Array(4097).fill({});
  expect(f.building().mainBuildingLevel).toBe(0);
  expect(f.resolve()).toBe(0);
  expect(f.reads()).toEqual({ calls: 0, ticks: 0 });
});

test("resource general effects use the owner version and execution realm instead of observer version or owner home realm", () => {
  const f = fixture();
  expect(f.resolve({ version: "0.0.0" })).toBe(6);
  f.snapshot.effects.profile.appVersion = "12.5.99";
  expect(f.resolve({ version: "99.0.0" })).toBe(0);
  f.snapshot.effects.profile.appVersion = "12.6.0";
  expect(f.resolve({ kingdomId: 99 })).toBe(0);
  expect(f.resolve({ kingdomId: 3, testServer: true })).toBe(6);
});

test("owner context creation never evaluates an observer version getter", () => {
  const f = fixture();
  const context = {
    kingdomId: 2,
    now: 1000,
    get version(): string {
      throw new Error("Unrelated observer version");
    },
  };
  expect(
    resourceGeneralBuildingEffect(
      f.snapshot,
      f.rules,
      context,
      78,
      () => 0,
      () => 1000n,
    ),
  ).toBe(6);
});

test("blank saved owner versions bypass only the version comparison for official and refinement features", () => {
  const f = fixture();
  f.snapshot.newGenerals.generals[0]!.refinement = "1;r_3";
  for (const version of [null, "", "\u2000"]) {
    f.snapshot.effects.profile.appVersion = version;
    expect(f.resolve()).toBe(10.5);
    expect(f.resolve({ kingdomId: 1 })).toBe(0);
  }
  f.rules.features.get("general_official")!.version = "";
  expect(f.resolve()).toBe(0);
  f.rules.features.get("general_official")!.version = "12.6.0";
  f.rules.features.get("general_random_effect")!.version = "";
  expect(f.resolve()).toBe(6);
});

test("direct assignment avoids unused official prestige, level and office data while retaining concrete equipment effects", () => {
  const f = fixture();
  Object.assign(f.snapshot.newGenerals.generals[0]!, { state: 2, buildingUuid: "a" });
  f.rules.features.clear();
  f.snapshot.effects.profile.level = "bad";
  f.snapshot.effects.profile.civilizationType = "bad";
  f.snapshot.buildings[0]!.level = "bad";
  f.snapshot.effects.prestige = [{ civilizationType: 2, prestigeValue: "bad" }];
  f.snapshot.newGenerals.offices = Array(4097).fill({});
  expect(f.resolve()).toBe(4);
  f.snapshot.newGenerals.generals[0]!.buildingUuid = "missing";
  expect(f.resolve()).toBe(0);
});

test("prestige data is consumed only by reached office conditions and its malformed state clears the whole general sum", () => {
  const f = fixture();
  f.rules.power.prestigeLevelRecords = [{ reputation_point: "bad" }];
  expect(f.resolve()).toBe(0);
  f.rules.power.newGeneralOffices!.get("office")!.unlock = "1;30|3;20";
  expect(f.resolve()).toBe(6);
  f.rules.power.newGeneralOffices!.get("office")!.pos_unlock = "1;2;5";
  expect(f.resolve()).toBe(0);
  f.snapshot.newGenerals.generals = [
    { ...f.snapshot.newGenerals.generals[0]!, id: 1, state: 2, buildingUuid: "a" },
    ...f.snapshot.newGenerals.generals,
  ];
  f.snapshot.newGenerals.equipment = [
    { generalId: 1, itemId: 1, extraProperty: null },
    ...f.snapshot.newGenerals.equipment,
  ];
  expect(f.resolve()).toBe(0);
});

test("official composition uses exact owner prestige, saved level, office quotas and nullable office fields without repair", () => {
  const f = fixture();
  f.rules.power.prestigeLevelRecords = [
    { reputation_point: "9007199254740993", reputation_level: "5" },
  ];
  f.snapshot.effects.prestige[0]!.prestigeValue = 9007199254740992n;
  expect(f.resolve()).toBe(0);
  f.snapshot.effects.prestige[0]!.prestigeValue = 9007199254740993n;
  expect(f.resolve()).toBe(6);
  f.snapshot.effects.profile.level = 19;
  expect(f.resolve()).toBe(0);
  f.snapshot.effects.profile.level = 20;
  f.rules.power.newGeneralOffices!.get("office")!.unlock_person_num = "2";
  expect(f.resolve()).toBe(0);
  f.snapshot.newGenerals.offices = [
    ...f.snapshot.newGenerals.offices,
    { id: 8, officeId: "office", position: null, startTime: null },
  ];
  const before = structuredClone(f.snapshot);
  expect(f.resolve()).toBe(6);
  expect(f.snapshot).toEqual(before);
  f.snapshot.newGenerals.offices[0]!.startTime = null;
  expect(f.resolve()).toBe(0);
});

test("bounded building and reached owner fields fail inside the general contribution", () => {
  const f = fixture();
  f.snapshot.buildings = Array(4097).fill({ uuid: "a", itemId: 400000, level: 30, star: 0 });
  expect(f.resolve()).toBe(0);
  f.snapshot.buildings = [{ uuid: "x".repeat(41), itemId: 400000, level: 30, star: 0 }];
  expect(f.resolve()).toBe(0);
  f.snapshot.buildings[0]!.uuid = "a";
  f.snapshot.effects.profile.appVersion = "x".repeat(41);
  expect(f.resolve()).toBe(0);
  f.snapshot.effects.profile.appVersion = "12.6.0";
  f.snapshot.newGenerals.offices[0]!.startTime = 9223372036854775808n;
  expect(f.resolve()).toBe(0);
});
