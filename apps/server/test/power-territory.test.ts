import { expect, test } from "bun:test";
import type { Row } from "@opencok/contracts/rows";
import { Rules } from "@opencok/rules/game";
import { territoryTreeEffects } from "@opencok/rules/power-territory";

const profile = { allianceId: "synthetic-alliance" };
const tree = {
  allianceId: "synthetic-alliance",
  pointId: 10,
  type: 42,
  stat: 3,
  level: 0,
  activeSkin: "default",
};

function fixture() {
  const rules = new Rules(
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    new Map(),
    1,
    new Map(),
    { payControl: new Map() },
    { treeSkins: new Map(), statuses: new Map() },
  );
  rules.items.set("life_treeavatar", { id: "life_treeavatar", k2: "default" });
  for (const [id, status, value] of [
    ["69014", "a", "12.9"],
    ["69015", "b", "-1.1"],
    ["69016", "c", "2147483648.5"],
  ]) {
    rules.configuration.payControl!.set(id!, { id: id!, k1: status!, k2: status! });
    rules.power.statuses!.set(status!, { id: status!, effect: `487;${value}` });
  }
  rules.power.treeSkins!.set("custom", { id: "custom", buff: "a;b;a" });
  return rules;
}

test("territory power uses only the player's placed alliance tree and does not mutate it", () => {
  const rules = fixture();
  const trees: Row[] = [
    tree,
    { ...tree, allianceId: "other" },
    { ...tree, type: 14 },
    { ...tree, pointId: 0 },
  ];
  const before = structuredClone(trees);
  expect(territoryTreeEffects(profile, trees, rules)).toEqual(new Map([[487, 12]]));
  expect(trees).toEqual(before);
  for (const allianceId of ["", " ", "other-missing"])
    expect(territoryTreeEffects({ allianceId }, trees, rules).size).toBe(0);
  expect(() => territoryTreeEffects(profile, [tree, { ...tree, pointId: 20 }], rules)).toThrow();
});

test("only building and complete trees contribute, independently of feature announcement gates", () => {
  const rules = fixture();
  expect(rules.features.size).toBe(0);
  for (let stat = 0; stat <= 10; stat++)
    expect(territoryTreeEffects(profile, [{ ...tree, stat }], rules).get(487)).toBe(
      stat === 1 || stat === 3 ? 12 : undefined,
    );
  rules.items.clear();
  expect(territoryTreeEffects(profile, [{ ...tree, stat: 5 }], rules).size).toBe(0);
});

test("default-skin stages floor double bonuses and saturate signed integer limits", () => {
  const rules = fixture();
  for (const [level, expected] of [
    [0, 12],
    [1, -2],
    [2, 2147483647],
    [3, 12],
    [-1, 12],
  ])
    expect(territoryTreeEffects(profile, [{ ...tree, level: level! }], rules).get(487)).toBe(
      expected,
    );
  rules.power.statuses!.get("c")!.effect = "487;-2147483649.5";
  expect(territoryTreeEffects(profile, [{ ...tree, level: 2 }], rules).get(487)).toBe(-2147483648);
  for (const activeSkin of [null, "", " "])
    expect(territoryTreeEffects(profile, [{ ...tree, activeSkin }], rules).get(487)).toBe(12);
});

test("default control values include their ID and missing or blank status effects are ignored", () => {
  const rules = fixture();
  rules.power.statuses!.set("69014", { id: "69014", effect: "218;7.9" });
  rules.configuration.payControl!.get("69014")!.k3 = "missing";
  expect(territoryTreeEffects(profile, [tree], rules)).toEqual(
    new Map([
      [487, 12],
      [218, 7],
    ]),
  );
  rules.power.statuses!.get("a")!.effect = " ";
  expect(territoryTreeEffects(profile, [tree], rules)).toEqual(new Map([[218, 7]]));
});

test("skin status IDs are deduplicated and retain Java hash traversal replacement precedence", () => {
  const rules = fixture();
  const custom = { ...tree, activeSkin: "custom", level: 2 };
  expect(territoryTreeEffects(profile, [custom], rules).get(487)).toBe(-2);
  rules.power.treeSkins!.get("custom")!.buff = "b;a;b";
  expect(territoryTreeEffects(profile, [custom], rules).get(487)).toBe(-2);
  rules.power.statuses!.set("Aa", { id: "Aa", effect: "487;9" });
  rules.power.statuses!.set("BB", { id: "BB", effect: "487;4" });
  rules.power.treeSkins!.get("custom")!.buff = "Aa;BB";
  expect(territoryTreeEffects(profile, [custom], rules).get(487)).toBe(4);
  rules.power.treeSkins!.get("custom")!.buff = "BB;Aa";
  expect(territoryTreeEffects(profile, [custom], rules).get(487)).toBe(9);
});

test("each status contributes its first hash-map entry rather than its first declared effect", () => {
  const rules = fixture();
  rules.power.statuses!.get("a")!.effect = "218;40|487;2.5|487;3.5|bad|1;2;3";
  expect(territoryTreeEffects(profile, [tree], rules)).toEqual(new Map([[487, 3]]));
  rules.power.statuses!.get("a")!.effect = "17;3|1;4";
  expect(territoryTreeEffects(profile, [tree], rules)).toEqual(new Map([[17, 3]]));
  rules.power.statuses!.get("a")!.effect =
    "16;100|" + Array.from({ length: 12 }, (_, i) => `${i + 1};${i + 1}`).join("|");
  expect(territoryTreeEffects(profile, [tree], rules)).toEqual(new Map([[1, 1]]));
});

test("absent skins and empty buff lists yield no bonuses without requiring unrelated catalogs", () => {
  const rules = fixture();
  rules.configuration.payControl!.clear();
  expect(territoryTreeEffects(profile, [{ ...tree, activeSkin: "unknown" }], rules).size).toBe(0);
  rules.power.treeSkins!.get("custom")!.buff = ";;";
  rules.power.statuses!.clear();
  expect(territoryTreeEffects(profile, [{ ...tree, activeSkin: "custom" }], rules).size).toBe(0);
});

test("missing required catalogs and malformed active values cannot become a partial tree modifier", () => {
  for (const erase of [
    (rules: Rules) => rules.items.clear(),
    (rules: Rules) => rules.configuration.payControl!.clear(),
    (rules: Rules) => rules.power.statuses!.clear(),
  ]) {
    const rules = fixture();
    erase(rules);
    expect(() => territoryTreeEffects(profile, [tree], rules)).toThrow();
  }
  const rules = fixture();
  rules.power.treeSkins!.clear();
  expect(() => territoryTreeEffects(profile, [{ ...tree, activeSkin: "custom" }], rules)).toThrow();
  for (const effect of ["bad", "487;NaN", "487;Infinity", "487;1e999", "2147483648;1"]) {
    rules.power.statuses!.get("a")!.effect = effect;
    expect(() => territoryTreeEffects(profile, [tree], rules)).toThrow();
  }
  rules.power.statuses!.get("a")!.effect = Array.from(
    { length: 11 },
    (_, i) => `${1 + i * 64};1`,
  ).join("|");
  expect(() => territoryTreeEffects(profile, [tree], rules)).toThrow();
});
