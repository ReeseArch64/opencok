import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { worldItemTarget, worldItemFree, worldItemResource } from "@opencok/rules/world-use";
const rules = await loadRules();

test("owned world props use maintained weighted candidates and base capacity without natural spawn effects", () => {
  const rule = rules.goods.get("200060")!;
  expect(worldItemTarget(rule, () => 0)).toBe("110105");
  expect(worldItemTarget(rule, () => 5000000)).toBe("110119");
  expect(worldItemTarget(rule, (total) => total - 1)).toBe("110173");
  expect(worldItemResource(rules, "110105")).toEqual({
    type: 0,
    level: 5,
    amount: 297000,
    duration: 64800000n,
  });
  expect(worldItemResource(rules, "110275")).toEqual({
    type: 5,
    level: 7,
    amount: 130,
    duration: 86400000n,
  });
  expect(worldItemFree({ worldId: 0, pointType: 0, gridType: 0, grid2Type: 0 })).toBe(true);
  expect(worldItemFree({ worldId: 0, pointType: 0, gridType: 1, grid2Type: 0 })).toBe(true);
  expect(worldItemFree({ worldId: 0, pointType: 0, ownerId: "foreign" })).toBe(false);
  expect(worldItemFree({ worldId: 0, pointType: 0, grid2Type: 1 })).toBe(false);
  expect(() => worldItemResource(rules, "110006")).toThrow();
  expect(() => worldItemTarget({ para1: "110105;110119", para2: "1;2;3" }, () => 0)).toThrow();
});
