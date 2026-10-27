import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { heroCalendarPlan, heroCalendarIdentity } from "@opencok/hero/rules/hero-calendar";
test("hero stage identities remain stable within a period and change at the next UTC stage", async () => {
  const rules = await loadRules(),
    state = { activities: [], events: [], blocked: false },
    now = BigInt(Date.UTC(2023, 0, 2, 12, 30)),
    plan = heroCalendarPlan(state, rules, now);
  expect(plan.activities).toHaveLength(3);
  expect(plan.events).toHaveLength(4);
  expect(plan.events.filter((row) => Number(row.type) >= 3).map((row) => row.type)).toEqual([3, 4]);
  expect(
    heroCalendarPlan(
      { activities: plan.activities, events: plan.events, blocked: false },
      rules,
      now,
    ).events,
  ).toHaveLength(0);
  expect(heroCalendarIdentity("event", 1, "definition", now)).not.toBe(
    heroCalendarIdentity("event", 2, "definition", now),
  );
});
test("an existing multi-day hero period keeps its saved stage interval on a day without new admission", async () => {
  const rules = await loadRules(),
    definition = rules.advanced.heroActivities!.get("9000000")!;
  rules.advanced.heroActivities!.clear();
  rules.advanced.heroActivities!.set("9000000", {
    ...definition,
    date: "1:0|2:1|3:0|4:0|5:0|6:0|7:0",
    cycle: "10|110|2880",
  });
  const first = heroCalendarPlan(
    { activities: [], events: [], blocked: false },
    rules,
    BigInt(Date.UTC(2023, 0, 2, 12, 30)),
  );
  rules.advanced.heroActivities!.get("9000000")!.cycle = "20|100|2880";
  const next = heroCalendarPlan(
    { activities: first.activities, events: first.events, blocked: false },
    rules,
    BigInt(Date.UTC(2023, 0, 3, 14, 30)),
  );
  expect(next.events).toHaveLength(1);
  expect(next.events[0]).toMatchObject({
    activityId: first.activities[0]!.uuid,
    readyTime: BigInt(Date.UTC(2023, 0, 3, 14)),
    startTime: BigInt(Date.UTC(2023, 0, 3, 14, 10)),
    lastTime: 6600000n,
  });
});
