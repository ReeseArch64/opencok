import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  treasureMapCandidates,
  treasureMapFallback,
  treasureMapFree,
  treasureMapItem,
  treasureMapRules,
} from "@opencok/rules/treasure-map";
const rules = await loadRules();
test("treasure catalogs retain color alternatives and native corner geometry excludes black-land strips", () => {
  expect(treasureMapRules(rules, 1, 3).map((row) => row.id)).toEqual(["1003", "1007"]);
  expect(treasureMapItem(1)).toBe("200042");
  expect(treasureMapItem(5)).toBe("200046");
  const ids = treasureMapCandidates(1 + 560 + 560 * 1201, 1201, 5, 30);
  expect(ids.length).toBeGreaterThan(0);
  for (const id of ids) {
    const x = (id - 1) % 1201,
      y = Math.floor((id - 1) / 1201);
    expect(x < 574 || x > 626).toBe(true);
    expect(y < 574 || y > 626).toBe(true);
  }
  expect(treasureMapFallback(1, 20, 1)).toEqual([21, 2, 22]);
  expect(treasureMapFree({ worldId: 0, pointType: 0, gridType: 2, grid2Type: 0 })).toBe(true);
  expect(
    treasureMapFree({ worldId: 0, pointType: 0, gridType: 2, grid2Type: 0, ownerId: "other" }),
  ).toBe(false);
});
