import { expect, test } from "bun:test";
import { Rules, type Rule } from "@opencok/rules/game";
import { previewRewards } from "@opencok/rules/rewards";
import { rewardPreviewArray } from "@opencok/mappings/rewards";
import { decode, encode, fields, sfs, type Value } from "@opencok/messages/sfs";

const context = { kingdomId: 2, version: "12.06.0", now: 1792756800000 };
function rules(reward: Rule) {
  return new Rules(
    new Map(),
    new Map(),
    new Map(),
    undefined,
    undefined,
    undefined,
    undefined,
    new Map(),
    2,
    undefined,
    undefined,
    undefined,
    undefined,
    { rewards: new Map([["synthetic", reward]]) },
  );
}
const noRandom = () => {
  throw new Error("Random must not be called");
};
function project(reward: Rule, draws: number[] = []) {
  const bounds: number[] = [];
  const result = previewRewards("synthetic", rules(reward), context, (bound) => {
    bounds.push(bound);
    const draw = draws.shift();
    if (draw === undefined) throw new Error("Missing synthetic draw");
    return draw;
  });
  return { result, bounds };
}

test("reward previews preserve legacy resource ordering and only positive configured resource values", () => {
  const reward = Object.freeze({
    exp: "1",
    wood: "2",
    food: "3",
    iron: "4",
    stone: "5",
    silver: "6",
    gold: "7",
    crystal: "8",
    sandstone: "9",
    diamondstone: "10",
    marble: "11",
    granite: "12",
    limestone: "13",
    power: "14",
    honor: "15",
    alliance_point: "16",
    casino: "17",
    gold_casino: "18",
    wbskill: "19",
    material: "999",
    dragon_food: "999",
  });
  const expectedTypes = [6, 0, 3, 2, 1, 4, 5, 19, 22, 23, 24, 25, 26, 9, 10, 11, 12, 13, 18];
  const result = previewRewards("synthetic", rules(reward), context, noRandom);
  expect(result).toEqual(
    expectedTypes.map((type, index) => ({ kind: "count", type, value: index + 1 })),
  );
  expect(decode(encode({ reward: rewardPreviewArray(result) })).reward).toEqual(
    sfs.array(
      expectedTypes.map((type, index) =>
        sfs.object({ type: sfs.int(type), value: sfs.int(index + 1) }),
      ),
    ),
  );
  expect(
    previewRewards("synthetic", rules({ exp: "0", gold: "-1", wood: "+5" }), context, noRandom),
  ).toEqual([{ kind: "count", type: 0, value: 5 }]);
  expect(previewRewards("missing", rules(reward), context, noRandom)).toEqual([]);
  expect(previewRewards(undefined, rules(reward), context, noRandom)).toEqual([]);
});

test("military presentation uses the server feature gate and skips malformed disabled fields", () => {
  const catalog = rules({ military: "7", milhonor: "9", wbskill: "2" });
  expect(previewRewards("synthetic", catalog, context, noRandom)).toEqual([
    { kind: "count", type: 18, value: 2 },
  ]);
  catalog.features.set("wr_switch", { id: "wr_switch", version: "99.0.0", online: "2", test: "1" });
  expect(previewRewards("synthetic", catalog, context, noRandom)).toEqual([
    { kind: "count", type: 18, value: 2 },
    { kind: "count", type: 21, value: 7 },
    { kind: "count", type: 27, value: 9 },
  ]);
  expect(previewRewards("synthetic", catalog, { ...context, testServer: true }, noRandom)).toEqual([
    { kind: "count", type: 18, value: 2 },
  ]);
  catalog.features.clear();
  catalog.reconnect.rewards!.get("synthetic")!.military = "bad";
  expect(() => previewRewards("synthetic", catalog, context, noRandom)).not.toThrow();
});

test("weighted item previews consume bounded injected draws with exact bucket boundaries", () => {
  const { result, bounds } = project(
    { item: "200100;200200;200300", num: "2;3;4", rate: "2;3;5", circle: "4" },
    [0, 1, 2, 9],
  );
  expect(bounds).toEqual([10, 10, 10, 10]);
  expect(
    new Map(
      result.filter((reward) => reward.kind === "item").map((reward) => [reward.id, reward.count]),
    ),
  ).toEqual(
    new Map([
      ["200100", 4],
      ["200200", 3],
      ["200300", 4],
    ]),
  );
  expect(project({ item: "200100", num: "3", rate: "25", circle: "2" }, [0, 24]).result).toEqual([
    { kind: "item", type: 7, id: "200100", count: 6 },
  ]);
  expect(
    project({ item: "200100;200200", num: "3;5", rate: "-1;2", circle: "1" }, [0]).result,
  ).toEqual([{ kind: "item", type: 7, id: "200200", count: 5 }]);
});

test("item repeats aggregate signed counts while unsplit display preserves duplicate declarations", () => {
  const { result } = project(
    { item: "200100|200100", num: "2|3", rate: "100|100", circle: "1|1" },
    [99, 0],
  );
  expect(result).toEqual([
    { kind: "item", type: 7, id: "200100", count: 5 },
    { kind: "item", type: 7, id: "200100", count: 5 },
  ]);
  expect(
    project({ item: "200100", num: "16777217", rate: "100", circle: "1" }, [0]).result,
  ).toEqual([{ kind: "item", type: 7, id: "200100", count: 16777216 }]);
  expect(
    project({ item: "200100", num: "2147483647", rate: "100", circle: "2" }, [0, 0]).result,
  ).toEqual([{ kind: "item", type: 7, id: "200100", count: -2 }]);
  expect(project({ item: "200100", num: "16777217", rate: "99", circle: "1" }, [0]).result).toEqual(
    [{ kind: "item", type: 7, id: "200100", count: 16777217 }],
  );
});

test("item categories retain enum ordinals, equipment ranges and original textual item IDs", () => {
  const ids = [
    "0",
    "34",
    "35",
    "49",
    "-1",
    "50",
    "0999999",
    "1000000",
    "1999999",
    "2000000",
    "10000003",
    "10000004",
    "10050555",
    "10050556",
  ];
  const { result } = project(
    {
      item: ids.join("|"),
      num: ids.map(() => "0").join("|"),
      rate: ids.map(() => "100").join("|"),
      circle: ids.map(() => "1").join("|"),
    },
    ids.map(() => 0),
  );
  expect(result).toEqual([
    { kind: "count", type: 0, value: 0 },
    { kind: "count", type: 34, value: 0 },
    ...(
      [
        ["50", 7],
        ["0999999", 7],
        ["1000000", 14],
        ["1999999", 14],
        ["2000000", 7],
        ["10000003", 7],
        ["10000004", 14],
        ["10050555", 14],
        ["10050556", 7],
      ] as const
    ).map(([id, type]) => ({ kind: "item" as const, type, id, count: 0 })),
  ]);
  const wire = decode(encode({ reward: rewardPreviewArray(result) }));
  const entries = (wire.reward!.value as Value[]).map(fields);
  expect(entries[0]!.value).toEqual(sfs.int(0));
  expect(entries[3]!.value).toEqual(sfs.object({ id: sfs.string("0999999"), num: sfs.int(0) }));
});

test("prestige display collapses duplicate civilizations and preserves current-civilization flags", () => {
  const { result } = project({ prestige: "|2;7|0;4|2;9|invalid|3;1;2||1;-5|" });
  expect(result).toEqual([
    { kind: "prestige", type: 31, currentCivilization: true, value: 4 },
    { kind: "prestige", type: 31, currentCivilization: false, value: -5 },
    { kind: "prestige", type: 31, currentCivilization: false, value: 9 },
  ]);
  expect(decode(encode({ reward: rewardPreviewArray(result) })).reward).toEqual(
    sfs.array([
      sfs.object({
        type: sfs.int(31),
        value: sfs.object({ isCurrentCivilization: sfs.bool(true), value: sfs.int(4) }),
      }),
      sfs.object({
        type: sfs.int(31),
        value: sfs.object({ isCurrentCivilization: sfs.bool(false), value: sfs.int(-5) }),
      }),
      sfs.object({
        type: sfs.int(31),
        value: sfs.object({ isCurrentCivilization: sfs.bool(false), value: sfs.int(9) }),
      }),
    ]),
  );
});

test("absent rate, unused groups and unselected malformed alternatives retain lazy preview semantics", () => {
  expect(project({ item: "200100", num: "3", circle: "1" }).result).toEqual([]);
  expect(project({ item: "200100", num: "bad", rate: "100", circle: "0" }).result).toEqual([]);
  expect(project({ item: "200100", num: "bad", rate: "100", circle: "-1" }).result).toEqual([]);
  expect(
    project({ item: "200100;200200", num: "bad;4", rate: "1;1", circle: "1" }, [1]).result,
  ).toEqual([{ kind: "item", type: 7, id: "200200", count: 4 }]);
  expect(project({ item: "200100", num: "2", rate: "0;100", circle: "1" }, [0]).result).toEqual([]);
  expect(
    project({ item: "|200100||200200|", num: "2", rate: "100", circle: "1" }, [0]).result,
  ).toEqual([{ kind: "item", type: 7, id: "200100", count: 2 }]);
});

test("malformed rules and random providers fail without exposing stored reward contents", () => {
  for (const reward of [
    { exp: "1.5" },
    { gold: "2147483648" },
    { wood: "-2147483649" },
    { prestige: "bad;1" },
    { item: "200100", rate: "100", circle: "1" },
    { item: "200100", num: "1", rate: "100" },
    { item: "200100", num: "1", rate: "0", circle: "1" },
    { item: "200100", num: "1", rate: "2147483647;1", circle: "1" },
    { item: "bad", num: "1", rate: "100", circle: "1" },
  ] as Rule[])
    expect(() => previewRewards("synthetic", rules(reward), context, () => 0)).toThrow("102192");
  for (const value of [-1, 100, 0.5, NaN, Infinity])
    expect(() =>
      previewRewards(
        "synthetic",
        rules({ item: "200100", num: "1", rate: "100", circle: "1" }),
        context,
        () => value,
      ),
    ).toThrow("102192");
  expect(() =>
    previewRewards("synthetic", rules({}), { ...context, kingdomId: 1 }, noRandom),
  ).toThrow();
});
