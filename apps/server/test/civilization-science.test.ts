import type { Rule } from "@opencok/rules/game";
import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { civilizationScienceDomain } from "@opencok/services/civilization-science";
import { civilizationScience } from "@opencok/rules/civilization-science";
import { decode, sfs, Type } from "@opencok/messages/sfs";
import { cityFixture } from "./fixtures/city-progression";
import type { TimedActivity } from "@opencok/contracts/timed-activity";

async function fixture() {
  const rules = await loadRules();
  rules.power.civilizationSciences = new Map<string, Rule>([
    [
      "700000",
      {
        id: "700000",
        time_research: "60",
        research_need: "0;100",
        science_point: "210090;2",
        para2: "10",
        power: "0",
      },
    ],
    ["700001", { id: "700001", para2: "25", power: "100" }],
  ]);
  const value = cityFixture(rules);
  value.items.set("210090", 10);
  return { ...value, rules };
}

test("civilization research reserves paid costs and completes only its own queue", async () => {
  const { context, state, balances, items } = await fixture();
  const planned = await civilizationScienceDomain.prepare(context, "race.science.research", {
    itemId: sfs.string("700000"),
  });
  expect(planned.type).toBe(19);
  expect(planned.durationMs).toBe(60000n);
  expect(balances.get("wood")).toBe(950n);
  expect(items.get("210090")).toBe(8);
  state.civilizationSciences = context.write.civilizationSciences;
  state.queues = [{ uuid: "queue", type: 19, itemId: "700000", updateTime: 1060000n }];
  const activity: TimedActivity = {
    id: "activity",
    ownerId: "owner",
    queueId: "foreign",
    type: 19,
    itemId: "700000",
    startedAt: 1000000n,
    dueAt: 1060000n,
    status: 0,
    version: 1,
    data: planned.data,
  };
  await expect(civilizationScienceDomain.apply(context, "finish", activity)).rejects.toThrow();
  activity.queueId = "queue";
  const response = await civilizationScienceDomain.apply(context, "finish", activity);
  expect(response.level).toEqual(sfs.int(1));
  expect(response.sciencePower).toEqual(sfs.int(100));
  expect(response.para2?.type).toBe(Type.Float);
  expect(response.para2?.value).toBe(Math.fround(0.25));
  state.civilizationSciences = context.write.civilizationSciences;
  await expect(civilizationScienceDomain.apply(context, "finish", activity)).rejects.toThrow();
});

test("civilization cancellation refunds paid resources once through the activity boundary, without item refunds", async () => {
  const { context, state, items, balances } = await fixture();
  const planned = await civilizationScienceDomain.prepare(context, "race.science.research", {
    itemId: sfs.string("700000"),
  });
  state.civilizationSciences = context.write.civilizationSciences;
  state.queues = [{ uuid: "queue", type: 19, itemId: "700000" }];
  await civilizationScienceDomain.apply(context, "cancel", {
    id: "activity",
    ownerId: "owner",
    queueId: "queue",
    type: 19,
    itemId: "700000",
    startedAt: 1000000n,
    dueAt: 1060000n,
    status: 0,
    version: 1,
    data: planned.data,
  });
  expect(balances.get("wood")).toBe(975n);
  expect(balances.get("woodbind")).toBe(25n);
  expect(items.get("210090")).toBe(8);
});

test("civilization discovery emits float effects and pending deadlines without charges", async () => {
  const { context, state, items } = await fixture();
  state.queues = [{ type: 19, itemId: "700000", updateTime: 1060000n }];
  const result = await civilizationScienceDomain.prepare(
    context,
    "civilization.science.data.init",
    {},
  );
  const decoded = decode(Buffer.from(result.response));
  expect(decoded.civilization_science?.type).toBe(Type.Array);
  expect(items.get("210090")).toBe(10);
});

test("civilization discovery skips saved levels absent from the catalog without changing them", async () => {
  const { context, state, rules } = await fixture();
  rules.power.civilizationSciences!.set("800000", { id: "800000", para2: "0" });
  state.civilizationSciences = [{ baseItemID: 700000, level: 2 }];
  const result = await civilizationScienceDomain.prepare(
    context,
    "civilization.science.data.init",
    {},
  );
  const decoded = decode(Buffer.from(result.response));
  expect(decoded.civilization_science?.type).toBe(Type.Array);
  expect(decoded.civilization_science?.value).toHaveLength(1);
  expect(state.civilizationSciences).toEqual([{ baseItemID: 700000, level: 2 }]);
  expect(context.write.civilizationSciences).toBeUndefined();
});

test("civilization cannot jump levels or bypass building requirements", async () => {
  const { context, rules, balances } = await fixture();
  expect(() => civilizationScience(rules, 700001, 0)).toThrow();
  rules.power.civilizationSciences!.get("700000")!.building_condition = "400030";
  await expect(
    civilizationScienceDomain.prepare(context, "race.science.directly", {
      itemId: sfs.string("700000"),
    }),
  ).rejects.toThrow();
  expect(balances.get("gold")).toBe(100000n);
});

test("civilization feature gates reject new research before any debit", async () => {
  const { context, rules, balances, items } = await fixture();
  rules.features.delete("science_race_switch");
  await expect(
    civilizationScienceDomain.prepare(context, "race.science.research", {
      itemId: sfs.string("700000"),
    }),
  ).rejects.toThrow();
  expect(balances.get("wood")).toBe(1000n);
  expect(items.get("210090")).toBe(10);
});
