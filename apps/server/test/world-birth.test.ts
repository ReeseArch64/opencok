import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  worldBirthRules,
  initialWorldBirth,
  parseWorldBirth,
  advanceWorldBirth,
  countWorldBirth,
  worldBirthArea,
  worldBirthCandidates,
} from "@opencok/rules/world-birth";
const settings = worldBirthRules(await loadRules());

test("resident birth catalogs preserve all Source priorities and fresh native phase", () => {
  expect(settings.priorities).toHaveLength(98);
  expect(settings.priorities[0]).toEqual({ id: 43000, areas: [67, 68, 69, 70] });
  expect(settings.priorities.at(-1)!.id).toBe(43097);
  expect(settings.side).toBe(60);
  expect(settings.limits.length).toBeGreaterThan(0);
  const state = initialWorldBirth(settings, 7n);
  expect(state).toMatchObject({
    schema: 1,
    version: 1,
    priority: 43000,
    round: 1,
    phase: 0,
    epoch: "7",
    counts: {},
  });
  expect(parseWorldBirth(JSON.stringify(state))).toEqual(state);
});

test("birth counters preserve Source process-local increments, priority wrap and unlimited fallback", () => {
  const rules = { ...settings, limits: [2] },
    state = initialWorldBirth(rules, 1n);
  countWorldBirth(state, rules, 67);
  expect(state.priority).toBe(43000);
  countWorldBirth(state, rules, 67);
  expect(state.priority).toBe(43001);
  state.priority = 43097;
  advanceWorldBirth(state, rules);
  expect(state).toMatchObject({ priority: 43000, round: 2, phase: 1, limit: 2147483647 });
  countWorldBirth(state, rules, 68);
  expect(state.priority).toBe(43000);
  expect(state.counts).toEqual({ 67: 2, 68: 1 });
});

test("birth state rejects malformed private snapshots without mutating the supplied source", () => {
  const state = initialWorldBirth(settings, 1n),
    raw = JSON.stringify(state);
  for (const changed of [
    { schema: 2 },
    { version: "1" },
    { epoch: 1 },
    { counts: { 1: "1" } },
    { priority: 42999 },
    { phase: 3 },
    { epoch: "0" },
    { counts: { 1: -1 } },
    { counts: [] },
    { version: 2147483647 },
  ])
    expect(() => parseWorldBirth(JSON.stringify({ ...state, ...changed }))).toThrow();
  const decoded = parseWorldBirth(raw);
  decoded.counts[67] = 1;
  expect(state.counts).toEqual({});
});

test("birth candidate regions retain x-major Source numbering and exclude four-cell crossings into an unadmitted area", () => {
  const first = 1 + 181 + 181 * 1201,
    second = 1 + 181 + 421 * 1201;
  expect(worldBirthArea(first, 1201, 60)).toBe(67);
  expect(worldBirthArea(second, 1201, 60)).toBe(71);
  const single = worldBirthCandidates([67], 1201, 60),
    group = worldBirthCandidates([67, 68], 1201, 60);
  expect(single).toHaveLength(3481);
  expect(single).toContain(first);
  expect(single).not.toContain(1 + 181 + 240 * 1201);
  expect(group).toContain(1 + 181 + 240 * 1201);
  expect(worldBirthCandidates([67], 100, 60)).toHaveLength(0);
});
