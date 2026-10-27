import { expect, test } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import {
  currentMergeEffects,
  decodeMergeEffects,
  mergeSignInRewards,
  mergeTimers,
  mergeTimerEligible,
} from "@opencok/rules/merge-campaign";
import { worldPowerEffects } from "@opencok/rules/power-world";
import { mergeEffectBoard } from "@opencok/mappings/merge-campaign";
import { publishMergeEffectBoard } from "@opencok/services/merge-campaign";
import { encode, decode, sfs } from "@opencok/messages/sfs";

test("declared timers preserve exact inclusive merge windows and exclude combat and disabled rules", async () => {
  const rules = await loadRules();
  const timers = mergeTimers(rules.advanced.campaignRules ?? []);
  expect(timers).toHaveLength(3);
  const harvest = timers.find((timer) => timer.effects.some((effect) => effect.id === 307))!;
  const monster = timers.find((timer) => timer.effects.some((effect) => effect.id === 309))!;
  const signIn = timers.find((timer) => timer.effects.some((effect) => effect.id === 310))!;
  const at = 1000000,
    hour = 3600000;
  expect(mergeTimerEligible(harvest, at, at + 120 * hour)).toBe(true);
  expect(mergeTimerEligible(harvest, at, at + 120 * hour + 1)).toBe(false);
  expect(mergeTimerEligible(monster, at, at + 24 * hour - 1)).toBe(false);
  expect(mergeTimerEligible(monster, at, at + 24 * hour)).toBe(true);
  expect(mergeTimerEligible(signIn, at, at + 168 * hour)).toBe(true);
  expect(mergeTimerEligible(signIn, at, at + 168 * hour + 1)).toBe(false);
  expect(mergeTimerEligible(signIn, 0, at)).toBe(false);
  expect(mergeTimerEligible(signIn, at + 1, at)).toBe(false);
  expect(() =>
    mergeTimers([
      {
        id: 656,
        name: "synthetic",
        state: 2,
        openType: 2,
        events: [{ code: 43, parameters: "-1;600" }],
        conditions: [{ code: 90, parameters: "<=;120" }],
        actions: [{ code: 52 }],
      },
    ]),
  ).toThrow();
});

test("merge board wire types, gating and bounded state reject corrupt authority", async () => {
  const snapshot = decodeMergeEffects(
    '{"version":1,"effects":[{"id":310,"sourceMergeAt":1,"start":2,"end":600002,"value":100}],"notified":[310]}',
  );
  const active = currentMergeEffects(snapshot, 1, 3);
  expect(currentMergeEffects(snapshot, 2, 3)).toEqual([]);
  expect(currentMergeEffects(snapshot, 1, 600002)).toEqual([]);
  expect(decode(encode(mergeEffectBoard(active)))).toEqual({
    status: sfs.array([
      sfs.object({
        effNum: sfs.int(310),
        effVal: sfs.int(100),
        stateId: sfs.int(310),
        endTime: sfs.long(600002),
      }),
    ]),
    clear: sfs.array([307, 308, 309, 310].map((id) => sfs.string(String(id)))),
  });
  for (const raw of [
    " ".repeat(4097),
    '{"version":2}',
    '{"version":1,"effects":[],"notified":[310,310]}',
    '{"version":1,"effects":[{"id":310,"sourceMergeAt":1,"start":2,"end":600003,"value":100}],"notified":[]}',
  ])
    expect(() => decodeMergeEffects(raw)).toThrow();
  const rules = await loadRules();
  rules.features.set("server_buff", { version: "1.0.0", online: "close", test: "close" });
  expect(
    worldPowerEffects([{ id: 310, value: "100", endTime: 600002n }], rules, {
      kingdomId: 1,
      version: "12.06.0",
      now: 3,
    }).has(310),
  ).toBe(false);
});

test("sign-in multiplication matches Java float truncation for goods and leaves equipment and direct resources unchanged", () => {
  const rewards = [
    { kind: "item", type: 7, id: "200001", count: 3 },
    { kind: "item", type: 14, id: "1000001", count: 1 },
    { kind: "count", type: 0, value: 7 },
  ] as const;
  expect(mergeSignInRewards(rewards, 50)).toEqual([
    { ...rewards[0], count: 4 },
    rewards[1],
    rewards[2],
  ]);
  expect(mergeSignInRewards(rewards, -200)[0]).toMatchObject({ count: 0 });
  expect(mergeSignInRewards([{ ...rewards[0], count: 2147483647 }], 100)[0]).toMatchObject({
    count: 2147483647,
  });
  expect(rewards[0].count).toBe(3);
});

test("board fanout bounds audience pages and send concurrency and obtains fresh board for every delivery batch", async () => {
  const owners = Array.from({ length: 1001 }, (_, index) => `synthetic-${index}`);
  const pages: number[] = [];
  let reads = 0,
    sent = 0,
    pending = 0,
    maximum = 0;
  await publishMergeEffectBoard(
    [...owners, owners[0]!],
    {
      async select(page) {
        pages.push(page.length);
        return page;
      },
    },
    async () => {
      reads++;
      return mergeEffectBoard([]);
    },
    async (_owner, command) => {
      expect(command).toBe("world.effect.push");
      pending++;
      maximum = Math.max(maximum, pending);
      await Promise.resolve();
      pending--;
      sent++;
    },
    () => 1,
  );
  expect(pages).toEqual([500, 500, 1]);
  expect(sent).toBe(1001);
  expect(maximum).toBe(32);
  expect(reads).toBe(33);
});

test("initialization replays the current board and an expired board clears only merge effects", async () => {
  const { GameService } = await import("@opencok/services/game");
  const { Rules } = await import("@opencok/rules/game");
  const state = {
    profile: { uid: "synthetic" },
    resource: {},
    world: { worldId: 0 },
    buildings: [],
    queues: [],
    armies: [],
    items: [],
    hasMarches: false,
  };
  const store = {
    getCityByPlayerId: async () => state,
  } as unknown as import("@opencok/contracts/game").GameStore;
  const rules = new Rules(
    new Map(),
    new Map([["100100", { id: "100100", player_exp: "100" }]]),
    new Map(),
  );
  let now = 3;
  const snapshot = decodeMergeEffects(
    '{"version":1,"effects":[{"id":310,"sourceMergeAt":1,"start":2,"end":600002,"value":100}],"notified":[310]}',
  );
  const game = new GameService(store, rules, { kingdomId: 1 }, () => now, {
    worldEffectBoard: async () => mergeEffectBoard(currentMergeEffects(snapshot, 1, now)),
  });
  expect((await game.initialize("synthetic")).pushes).toEqual([
    { command: "world.effect.push", body: mergeEffectBoard(currentMergeEffects(snapshot, 1, now)) },
  ]);
  now = 600002;
  expect((await game.initialize("synthetic")).pushes).toEqual([
    { command: "world.effect.push", body: mergeEffectBoard([]) },
  ]);
});
