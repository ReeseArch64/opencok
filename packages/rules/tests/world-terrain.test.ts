import { expect, test } from "bun:test";
import { Rules } from "../src/game";
import { worldTerrainRules, sourceWorldArea, worldTerrainPoint } from "../src/world-terrain";
import type { WorldTerrain } from "@opencok/contracts/world-terrain";
function fixture(size = 1201) {
  const terrain: WorldTerrain = {
    format: "worldcreator-v2.normal.v1",
    size,
    sourceHash: "0".repeat(64),
    grid: new Uint8Array(size * size).fill(2),
    overlay: new Uint8Array(size * size),
  };
  const rules = { size, bornSide: 60, resourceSide: 50, monsterSide: 60 };
  return {
    terrain,
    rules,
    point: (x: number, y: number) => worldTerrainPoint(terrain, rules, x + y * size),
  };
}
test("native terrain IDs, birth blocks and Source resource edge areas preserve the final row and column", () => {
  const { point } = fixture();
  expect(point(0, 0)).toMatchObject({ id: 1, gridType: 2, grid2Type: 0, bornAreaId: 1, areaId: 1 });
  expect(point(60, 61).bornAreaId).toBe(23);
  expect(point(1200, 1200)).toMatchObject({
    id: 1442401,
    bornAreaId: 441,
    areaId: 577,
    monsterAreaId: 401,
  });
  expect(point(1199, 1199)).toMatchObject({ areaId: 576, monsterAreaId: 400 });
  expect(sourceWorldArea(1200, 50, 1199, 1199)).toBe(576);
  expect(sourceWorldArea(13, 5, 10, 2)).toBe(5);
  expect(sourceWorldArea(13, 5, 12, 12)).toBe(0);
});
test("static throne, native trebuchet footprints and victory tower are reserved without an invented battle actor", () => {
  const { point } = fixture();
  expect(point(600, 600)).toMatchObject({ pointType: 10, resLevel: 0 });
  expect(point(599, 599)).toMatchObject({ pointType: 11, pointItem: String(point(600, 600).id) });
  for (const [x, y] of [
    [605, 605],
    [605, 596],
    [596, 596],
    [596, 605],
  ]) {
    expect(point(x!, y!).pointType).toBe(12);
    for (const [dx, dy] of [
      [-1, 0],
      [0, -1],
      [-1, -1],
    ])
      expect(point(x! + dx!, y! + dy!)).toMatchObject({
        pointType: 13,
        pointItem: String(point(x!, y!).id),
      });
    expect(point(x! + 1, y!).pointType).toBe(0);
  }
  expect(point(604, 600)).toMatchObject({ pointType: 48, resLevel: 1, resInitValue: 0 });
  expect(point(605, 600).pointType).toBe(0);
});
test("terrain settings require factual catalog dimensions and independently preserve authoring values", () => {
  const rules = new Rules(new Map(), new Map(), new Map());
  expect(() => worldTerrainRules(rules)).toThrow();
  rules.items.set("worldmap_city", { k3: "1201", k1: "60", k6: "50" });
  rules.items.set("worldmap_explore", { k1: "60" });
  expect(worldTerrainRules(rules)).toEqual({
    size: 1201,
    bornSide: 60,
    resourceSide: 50,
    monsterSide: 60,
  });
  const f = fixture(5);
  f.rules.bornSide = 2;
  f.rules.resourceSide = 2;
  f.rules.monsterSide = 2;
  f.terrain.grid[1] = 1;
  f.terrain.overlay[1] = 1;
  expect(f.point(1, 0)).toMatchObject({ gridType: 1, grid2Type: 1 });
  expect(() => worldTerrainPoint(f.terrain, { ...f.rules, size: 4 }, 0)).toThrow();
});
