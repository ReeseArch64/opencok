import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { selectTargetTasks, targetSchedule, targetQuantity } from "@opencok/rules/target-task";
import { targetTaskView } from "@opencok/mappings/target-task";
import { sfs } from "@opencok/messages/sfs";
test("target scheduling uses stable UTC periods and excludes the exact expiration boundary", () => {
  const config = { id: "target_quest", k1: "3", k2: "1", k3: "5", k4: "1" },
    now = BigInt(Date.UTC(2026, 9, 26, 12));
  const schedule = targetSchedule(config, now, 0n);
  expect(schedule.active).toBe(true);
  expect(schedule.start).toBe(BigInt(Date.UTC(2026, 9, 26)));
  expect(schedule.end).toBe(BigInt(Date.UTC(2026, 10, 1)));
  expect(targetSchedule(config, schedule.end, 0n).active).toBe(false);
  expect(targetSchedule(config, now, now).active).toBe(false);
  expect(targetQuantity({ num: "4;7" }, () => 2)).toBe(6);
  expect(targetQuantity({ num: "7;4" }, () => 0)).toBe(4);
  expect(() => targetQuantity({ num: "4;7" }, () => 3)).toThrow();
});
test("maintained target rules can assign five distinct supported tasks at the starting castle", async () => {
  const rules = await loadRules(),
    config = rules.items.get("target_quest")!;
  const selected = selectTargetTasks(rules, config, 1, () => 0);
  expect(selected).toHaveLength(5);
  expect(new Set(selected.map((rule) => rule.id)).size).toBe(5);
  expect(selected.every((rule) => Number(rule.type) <= 17)).toBe(true);
  const view = targetTaskView([], "78192", 5, 0, false);
  expect(Object.keys(view)).toEqual([
    "targetList",
    "exchangeid",
    "day_sum",
    "day_now",
    "receive_mode",
  ]);
  expect(view.receive_mode).toEqual(sfs.bool(false));
});

test("native target commands preserve correlation and reject internal producers", async () => {
  const { GameService } = await import("@opencok/services/game");
  const { Rules } = await import("@opencok/rules/game");
  const game = new GameService(
    {} as import("@opencok/contracts/game").GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    { cityProgression: async () => ({ body: {}, pushes: [] }) },
  );
  expect(
    (await game.execute("owner", "target.task.ui", { _cok_: sfs.long(9007199254740993n) })).body
      ._cok_,
  ).toEqual(sfs.long(9007199254740993n));
  await expect(game.execute("owner", "target.paid", {})).rejects.toThrow();
  await expect(game.execute("owner", "target.init", {})).rejects.toThrow();
  await expect(game.execute("owner", "quest.action", {})).rejects.toThrow();
});
