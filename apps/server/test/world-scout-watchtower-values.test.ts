import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { scoutWatchtowerValues } from "@opencok/rules/world-scout-watchtower";
const rules = await loadRules();
const context = { kingdomId: 1, now: 200000000, version: "12.06.0" };
test("scout watchtower reads Source underscore speed and cooldown only at exact progress", () => {
  expect(scoutWatchtowerValues(rules, { level: 30, star: 4, progress: 0 }, context)).toEqual({
    speed: 100,
    cooldown: undefined,
    ready: false,
  });
  expect(
    scoutWatchtowerValues(rules, { level: 30, star: 5, progress: 0, effectTime: 0n }, context),
  ).toEqual({ speed: 100, cooldown: 86400, ready: true });
  expect(
    scoutWatchtowerValues(
      rules,
      { level: 30, star: 5, progress: 0, effectTime: 200000000n },
      context,
    ).ready,
  ).toBe(false);
  expect(scoutWatchtowerValues(rules, { level: 30, star: 5, progress: 1 }, context)).toEqual({
    speed: 0,
    cooldown: undefined,
    ready: false,
  });
  expect(scoutWatchtowerValues(rules, undefined, context).speed).toBe(0);
});
test("native watchtower feature version protects older callers without changing the maintained switch", () => {
  expect(
    scoutWatchtowerValues(
      rules,
      { level: 30, star: 5, progress: 0 },
      { ...context, version: "1.0.0" },
    ),
  ).toEqual({ speed: 0, cooldown: undefined, ready: false });
});

test("native watchtower blank-version compatibility and negative progress preserve the Source branch", () => {
  expect(
    scoutWatchtowerValues(rules, { level: 30, star: 5, progress: 0 }, { ...context, version: "" })
      .speed,
  ).toBe(100);
  expect(scoutWatchtowerValues(rules, { level: 30, star: 5, progress: -1 }, context)).toEqual({
    speed: 0,
    cooldown: undefined,
    ready: false,
  });
});
