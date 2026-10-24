import { expect, test } from "bun:test";
import type { CityState, GameStore } from "@opencok/contracts/game";
import { Game } from "@opencok/controllers/game";
import { settingConfig } from "@opencok/dtos/bootstrap";
import { Rules } from "@opencok/rules/game";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";

test("setting.xml preserves IDs, string values, Unicode, and correlation through SFS", async () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.settings.set("001", { id: "001", enabled: "0", value: "0007", label: "Preferência 城" });
  rules.settings.set("002", { id: "002", value: "  text  " });
  const unused = async (): Promise<never> => {
    throw new Error("Settings must not access player state");
  };
  const store: GameStore = {
    profile: unused,
    accounts: unused,
    city: unused,
    world: unused,
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
    playerSummaries: unused,
    configuration: unused,
    power: unused,
  };
  const game = new Game(store, rules, { kingdomId: 1 });
  const result = await game.execute("synthetic-player", "setting.xml", {
    _cok_: sfs.string("correlation"),
    cmdBaseTime: sfs.string("42"),
  });
  expect(decode(encode(result.body))).toEqual({
    setting: sfs.array([
      sfs.object({
        id: sfs.string("001"),
        enabled: sfs.string("0"),
        value: sfs.string("0007"),
        label: sfs.string("Preferência 城"),
      }),
      sfs.object({ id: sfs.string("002"), value: sfs.string("  text  ") }),
    ]),
    _cok_: sfs.string("correlation"),
    cmdBaseTime: sfs.string("42"),
  });
  expect(result.pushes).toEqual([]);
  expect(rules.settings.get("001")?.value).toBe("0007");
});

test("an absent optional settings catalog returns the legacy empty array", () => {
  expect(settingConfig(new Rules(new Map(), new Map(), new Map()))).toEqual({
    setting: sfs.array(),
  });
});

test("build.info uses the injected clock for buildings and queue previews without mutations", async () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  rules.buildings.set("400030", { id: "400030", level: "30", star_time: "0;10|100;20" });
  rules.buildings.set("400031", { id: "400031", level: "30" });
  rules.stars.set("first", {
    id: "first",
    build_id: "400000",
    star: "1",
    online: "all",
    version: "12.6.0",
    start: "2026-10-23-12-00",
    end: "2026-10-24-12-00",
  });
  const state: CityState = {
    profile: { uid: "synthetic-player" },
    resource: {},
    buildings: [{ uuid: "building", itemId: "400000", level: 30, star: 0, progress: 0 }],
    queues: [{ uuid: "queue", itemId: "building", type: 0 }],
    armies: [],
    items: [],
    world: undefined,
    lord: undefined,
    hasMarches: false,
  };
  const before = structuredClone(state);
  const unused = async (): Promise<never> => {
    throw new Error("Unexpected query");
  };
  const store: GameStore = {
    profile: unused,
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
    playerSummaries: unused,
    configuration: unused,
    power: unused,
    accounts: unused,
    city: async () => state,
    world: unused,
  };
  let now = Date.UTC(2026, 9, 23, 12);
  const game = new Game(store, rules, { kingdomId: 1 }, () => now);
  const output = (await game.execute("synthetic-player", "build.info", {})).body;
  expect(fields((output.building!.value as Value[])[0]).starMax?.value).toBe(1);
  const queue = fields((output.buildingQueue!.value as Value[])[0]);
  expect(fields(queue.itemObj).starNum?.value).toBe(1);
  now += 86_400_001;
  const expired = (await game.execute("synthetic-player", "build.info", {})).body;
  expect(fields((expired.building!.value as Value[])[0]).starMax?.value).toBe(0);
  expect(fields(fields((expired.buildingQueue!.value as Value[])[0]).itemObj).starNum?.value).toBe(
    0,
  );
  expect(state).toEqual(before);
});
