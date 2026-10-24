import { expect, test } from "bun:test";
import { Rules } from "@opencok/rules/game";
import {
  reconnectContainsBuildings,
  reconnectTaskInitialCount,
  reconnectResourceOutput,
  type ReconnectTaskCountState,
} from "@opencok/rules/reconnect-task-counts";

const rules = new Rules(new Map(), new Map(), new Map());
rules.reconnect.positionUnlock = [{ unlock: "1" }, { unlock: "0" }, { unlock: "1" }];
const state: ReconnectTaskCountState = {
  profile: { level: 20, pf: "market_global", payTotal: 2147483648n, openedPos: "a,b,a" },
  buildings: [
    { itemId: 400000, level: 8 },
    { itemId: "400000", level: 4 },
  ],
  armies: [{ free: 5, pve: 3, defence: 2, march: 1, train: 500 }],
  equipment: [{ on: 0 }, { on: 1 }, { on: 2 }, { on: 1 }],
  scienceLevels: new Map([["science", 7]]),
  resourceOutput: new Map([[3, 125]]),
  playerInfo: { power: 4294967297n, armyPower: 2147483648n },
  prestigeLevel: 9,
  civilizationCastle: { status: 1 },
};

test("new task counts restore each progress source with legacy integer widths", () => {
  const count = (type2: number, para1 = "", para2 = "1") =>
    reconnectTaskInitialCount(
      {
        type2: String(type2),
        para1,
        para2,
      },
      state,
      rules,
    );
  expect(count(0, "400000")).toBe(8);
  expect(count(1, "science")).toBe(7);
  expect(count(3, "3")).toBe(125);
  expect(count(5)).toBe(20);
  expect(count(8, "400005|400001", "1|1")).toBe(2);
  expect(count(8, "400001|400001", "10|10")).toBe(4);
  expect(count(12)).toBe(11);
  expect(count(15)).toBe(4);
  expect(count(30, "0")).toBe(1);
  expect(count(30, "2")).toBe(-2147483648);
  expect(count(33)).toBe(2147483647);
  expect(count(34, "", "3")).toBe(3);
  expect(count(39)).toBe(2);
  expect(count(58)).toBe(9);
  expect(count(65)).toBe(1);
  for (const kind of [2, 4, 6, 7, 9, 14, 29, 64]) expect(count(kind)).toBe(0);
  expect(() => count(66)).toThrow();
  expect(() => count(8, "400000|400001", "1")).toThrow();
});

test("resource output task progress sums configured building output without granting or collecting resources", () => {
  const catalog = new Rules(
    new Map([
      ["413001", { level: "1", para1: "2147483647" }],
      ["415002", { level: "2", para1: "150" }],
      ["455001", { level: "1", para1: "7" }],
    ]),
    new Map(),
    new Map(),
  );
  expect([
    ...reconnectResourceOutput(
      [
        { itemId: 413000, level: 1 },
        { itemId: 413000, level: 1 },
        { itemId: 415000, level: 2 },
        { itemId: 455000, level: 1 },
        { itemId: 400000, level: 3 },
      ],
      catalog,
    ),
  ]).toEqual([
    [0, -2],
    [3, 150],
    [211508, 7],
  ]);
});

test("building acceptance uses base IDs and required levels, including empty requirements", () => {
  expect(reconnectContainsBuildings(state.buildings, ["400008", "400004"])).toBe(true);
  expect(reconnectContainsBuildings(state.buildings, ["400009"])).toBe(false);
  expect(reconnectContainsBuildings(state.buildings, [])).toBe(true);
  expect(() => reconnectContainsBuildings(state.buildings, ["not-a-building"])).toThrow();
});
