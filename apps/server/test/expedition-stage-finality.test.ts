import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { recordExpeditionScore, flushExpeditionScores } from "@opencok/services/new-expedition";
import { cityFixture } from "./fixtures/city-progression";
test("confirmed timed actions retain their saved completion instant and immediate finishes cannot score a future deadline", async () => {
  const { context } = cityFixture(await loadRules());
  context.completing = { type: 1, itemId: "107000", dueAt: 999000n };
  context.recordHero(4, "107000", 5);
  recordExpeditionScore(context, 5, 107000, 5);
  expect(context.heroActions[0]?.at).toBe(999000n);
  expect(context.expeditionActions[0]?.at).toBe(999000n);
  context.completing.dueAt = 1005000n;
  context.recordHero(4, "107000", 5);
  recordExpeditionScore(context, 5, 107000, 5);
  expect(context.heroActions[1]?.at).toBe(context.now);
  expect(context.expeditionActions[1]?.at).toBe(context.now);
  expect(() => recordExpeditionScore(context, 5, 107000, 5, context.now + 1n)).toThrow();
});
test("archived expedition action snapshots preserve separate periods and stop economic scoring after their owned seal", async () => {
  const { context, state } = cityFixture(await loadRules()),
    seen: bigint[] = [];
  state.expeditionScore = {
    load: async (at) => {
      seen.push(at);
      const periodId = at < 500000n ? "old" : "new";
      return {
        period: { periodId },
        phase: { stage: 7, startTime: 0n, endTime: 1000001n },
        closed: at === 900000n,
        progress: [{ periodId, stage: 7, uid: "owner", score: 10, takeReward: "1" }],
        allianceScore: 0,
        kingdomScore: 0,
        rank: -1,
      };
    },
  };
  recordExpeditionScore(context, 5, 107000, 2, 100000n);
  recordExpeditionScore(context, 5, 107000, 3, 100000n);
  recordExpeditionScore(context, 5, 107000, 4, 600000n);
  recordExpeditionScore(context, 5, 107000, 999, 900000n);
  await flushExpeditionScores(context);
  expect(seen).toEqual([100000n, 600000n, 900000n]);
  expect(context.write.expedition?.map((row) => [row.periodId, row.score, row.takeReward])).toEqual(
    [
      ["old", 35, "1"],
      ["new", 30, "1"],
    ],
  );
  expect(context.expeditionActions).toHaveLength(0);
});
