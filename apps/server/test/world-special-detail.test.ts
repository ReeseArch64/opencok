import { importBuildingDefinition } from "@opencok/resources/buildings/import";
import { expect, test } from "bun:test";
import type {
  WorldPointDetailSnapshot,
  WorldResourceOwnerSnapshot,
} from "@opencok/contracts/world-point-detail";
import { specialWorldFields } from "../../../packages/services/src/world-special-detail.ts";
import { occupiedResourceFields } from "../../../packages/services/src/world-resource-query.ts";
import { territorySoldierCapacity } from "../../../packages/services/src/world-territory-capacity.ts";
import { Rules } from "@opencok/rules/game";
import { decodeWorldResourceArmy } from "@opencok/messages/world-resource-army";
import { sfs, Type, encode, decode, type Fields } from "@opencok/messages/sfs";
import vectors from "./fixtures/world-resource-army-vectors.json";

function fixture(type = 14) {
  const rules = new Rules(new Map(), new Map(), new Map());
  const snapshot: WorldPointDetailSnapshot = {
    profile: { uid: "self" },
    kingdomId: 1,
    remote: false,
    point: {
      id: 701,
      worldId: 9,
      pointType: type,
      ownerId: "",
      ownerName: "",
      resInitValue: 100,
      resCostValue: 10,
    },
    special: {
      territory: {
        uid: "t",
        pointId: 701,
        atWorldId: 9,
        type,
        allianceId: "A",
        allianceName: "Alliance",
        level: 1,
        stat: 4,
        active: 1,
        curDef: 40,
        maxDef: 100,
        buildingSpd: 0.25,
        startTime: 9223372036854775807n,
        updateTime: 9007199254740993n,
      },
      marches: [],
      resources: [],
      kills: [],
      ranks: [],
      banner: "A-banner",
      observerBanner: "B-banner",
    },
  };
  const read = () => specialWorldFields(snapshot, "self", rules, 5000, {});
  return { snapshot, rules, read };
}
const nested = (fields: Fields, key = "territory") => fields[key]!.value as Fields;

test("every specialized territory preserves local types, sentinels, resource fields and mini-fort banners", async () => {
  for (const type of [14, 18, 20, 21, 23, 46, 47]) {
    const f = fixture(type);
    const fields = decode(encode(await f.read()));
    const territory = nested(fields);
    expect(territory.level).toEqual(sfs.int(2));
    expect(territory.startTime).toEqual(sfs.long(0n));
    expect(territory.updateTime).toEqual(sfs.long(9007199254740993n));
    expect(territory.buildingSpd).toEqual(sfs.double(0.25));
    expect(fields.speed).toEqual([14, 46, 47].includes(type) ? sfs.double(0.25) : undefined);
    expect(fields.alreadySoldier).toEqual(
      [14, 20, 21, 46, 47].includes(type) ? sfs.int(0) : undefined,
    );
    if (type === 18) {
      expect(fields.q).toEqual(sfs.int(0));
      expect(territory.tq).toEqual(sfs.int(90));
    }
    if (type === 46) {
      expect(fields.flag).toEqual(sfs.string("B-banner"));
      expect(territory.banner).toEqual(sfs.string("A-banner"));
    }
  }
});

test("territory state uses actual catalog level and occupied upgrading requires a defense march", async () => {
  const f = fixture();
  f.rules.world.allianceBuildings = [
    { type: "0", level: "1", building_value: "100" },
    { type: "0", level: "2", building_value: "40" },
  ];
  expect(nested(await f.read()).stat).toEqual(sfs.int(1));
  f.snapshot.point!.ownerId = "owner";
  f.snapshot.special!.territory!.stat = 10;
  expect(nested(await f.read()).stat).toEqual(sfs.int(1));
  f.snapshot.special!.territory!.type = 18;
  f.snapshot.point!.pointType = 18;
  f.snapshot.special!.marches = [
    { uuid: "m", ownerUid: "self", targetId: 701, worldId: 9, state: 1 },
  ];
  expect(nested(await f.read()).stat).toEqual(sfs.int(0));
  expect((await f.read()).marchUuid).toEqual(sfs.string("m"));
  f.snapshot.remote = true;
  expect((await f.read()).marchUuid).toBeUndefined();
});

test("warehouse clamps only source-defined negative balances and rejects foreign rows", async () => {
  const f = fixture(23);
  f.snapshot.special!.resources = [
    {
      row: { uid: "member", allianceId: "A", wood: -1n, food: 9007199254740993n, silver: -9n },
      profile: { uid: "member", name: "Member", picVer: 3, picfraId: 2 },
    },
  ];
  const resource = (nested(await f.read()).resourceList!.value as { value: Fields }[])[0]!.value;
  expect(resource.wood).toEqual(sfs.long(0n));
  expect(resource.food).toEqual(sfs.long(9007199254740993n));
  expect(resource.silver).toEqual(sfs.long(-9n));
  f.snapshot.special!.resources[0]!.row.allianceId = "foreign";
  await expect(f.read()).rejects.toThrow("Foreign warehouse");
});

test("active turret omits owner and excludes whole entries with nonpositive casualties", async () => {
  const f = fixture(21);
  f.snapshot.point!.ownerId = "owner";
  f.snapshot.special!.kills = [
    { uid: "one", content: '{"soldier":3,"deadPower":0}' },
    { uid: "two", content: '{"soldier":0}' },
  ];
  const body = nested(await f.read());
  expect(body.owner).toBeUndefined();
  const kills = body.kill!.value as { value: Fields }[];
  expect(kills).toHaveLength(1);
  expect(kills[0]!.value.dead).toEqual(sfs.object({ soldier: sfs.int(3) }));
  f.snapshot.special!.kills = [{ uid: "bad", content: '{"soldier":1.5}' }];
  await expect(f.read()).rejects.toThrow("Invalid turret");
});

test("boss query preserves byte and short fields and reports eligibility without settling rewards", async () => {
  const f = fixture(49);
  f.snapshot.special!.boss = {
    bossid: 8,
    type: 3,
    status: 2,
    reward: 0,
    killuser: "other",
    hp: 90,
    maxhp: 100,
  };
  f.snapshot.special!.ranks = [{ uid: "self", score: 1, reward: 1 }];
  const data = nested(decode(encode(await f.read())), "data");
  expect(data.type).toEqual({ type: Type.Byte, value: 3 });
  expect(data.state).toEqual({ type: Type.Short, value: 2 });
  expect(data.reward).toEqual(sfs.int(1));
  expect(data.hurt).toEqual(sfs.int(0));
  f.snapshot.special!.ranks = Array.from({ length: 1000 }, (_, i) => ({
    uid: i === 999 ? "self" : `p${i}`,
    score: 1000 - i,
    reward: 1,
  }));
  expect(nested(await f.read(), "data").reward).toEqual(sfs.int(0));
  f.snapshot.remote = true;
  expect(await f.read()).toEqual({});
  f.snapshot.remote = false;
  f.snapshot.point!.ownerId = "owner";
  expect(await f.read()).toEqual({});
});

test("occupied ordinary resource reads the saved nonresident load and rejects redirected army ownership", async () => {
  const f = fixture(3);
  const armyInfo = Buffer.from(vectors.arrayList, "base64");
  const army = decodeWorldResourceArmy(armyInfo)!;
  f.snapshot.point!.ownerId = army.owner;
  f.snapshot.point!.ownerMarchUUid = "m";
  f.snapshot.point!.pointItem = "resource";
  f.rules.items.set("resource_weight", { k1: "1", k2: "1", k3: "1", k4: "1" });
  f.snapshot.resource = {
    march: {
      uuid: "m",
      ownerUid: army.owner,
      targetId: 701,
      worldId: 9,
      state: 1,
      armyInfo,
      plunderRes: null,
      collectSpd: 2,
      marchArrivalTime: 1000n,
      changeCollectSpdTime: 1000n,
      collectedBeforeSpd: 0n,
      occupyResourceEndTime: 10000n,
    },
  };
  const read = () => occupiedResourceFields(f.snapshot, f.rules, 5000, {}, () => 5000);
  const fields = await read();
  expect(fields.spd).toEqual({ type: Type.Float, value: 2 });
  expect(fields.sdt).toEqual(sfs.long(1000n));
  expect(fields.tq).toEqual(sfs.int(90));
  f.snapshot.resource.march!.ownerUid = "foreign";
  await expect(read()).rejects.toThrow("Foreign resource");
});

test("garrison capacity combines persisted school and war hall with float effects", async () => {
  const owner: WorldResourceOwnerSnapshot = {
    effects: {
      profile: {
        uid: "owner",
        level: 1,
        civilizationType: 0,
        appVersion: null,
        decomposeSuitEffect: null,
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
      prestige: [],
      military: undefined,
      miracle: undefined,
      office: undefined,
      kingdomFights: [],
      territoryTrees: [],
      luckyDay: undefined,
      powerServer: undefined,
      throneRewards: [],
    },
    buildings: [],
    newGenerals: { moved: false, generals: [], statuses: [], equipment: [], offices: [] },
  };
  owner.effects.profile.serverId = 1;
  owner.effects.profile.crossFightSrcServerId = -1;
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.items.set("building_base", { k5: "100" });
  rules.items.set("effect", { k1: "56;10|171;20|8;50|882;7|144;4" });
  owner.buildings = [
    { uuid: "school", itemId: 427000, level: 1, star: 0 },
    { uuid: "hall", itemId: 407000, level: 1, star: 0 },
  ];
  rules.buildings.set(
    Number("427001"),
    importBuildingDefinition({ level: "1", para1: "20" }, Number("427001")),
  );
  rules.buildings.set(
    Number("407001"),
    importBuildingDefinition({ level: "1", para1: "30" }, Number("407001")),
  );
  const result = await territorySoldierCapacity(owner, rules, 1, 5000, {
    worldPowerEffects: async () => new Map(),
  });
  expect(result).toBe(266);
});
