import { test, expect } from "bun:test";
import {
  expeditionSchedule,
  expeditionPhase,
  expeditionScore,
} from "@opencok/rules/new-expedition";
import { expeditionScoreText } from "@opencok/mappings/new-expedition";
import { loadRules } from "@opencok/resources/rules";
import { Rules } from "@opencok/rules/game";
import { GameService } from "@opencok/services/game";
import type { GameStore } from "@opencok/contracts/game";
import { sfs } from "@opencok/messages/sfs";
test("expedition schedules use contiguous saved deadlines and source floating point and display rules", async () => {
  const phases = expeditionSchedule({
    serverId: 1,
    periodId: "p1",
    matchServerId: 2,
    startTime: 1000n,
    stages: [
      { stage: 3, durationMs: 100n },
      { stage: 5, durationMs: 200n },
    ],
  });
  const row = {
    startTime: 1000n,
    endTime: 1300n,
    schedule: JSON.stringify(
      phases.map((phase) => ({
        ...phase,
        startTime: String(phase.startTime),
        endTime: String(phase.endTime),
      })),
    ),
  };
  expect(expeditionPhase(row, 1099n)?.stage).toBe(3);
  expect(expeditionPhase(row, 1100n)?.stage).toBe(5);
  expect(expeditionPhase(row, 1300n)).toBeUndefined();
  expect(() =>
    expeditionSchedule({
      serverId: 1,
      periodId: "x",
      matchServerId: 1,
      startTime: 0n,
      stages: [{ stage: 3, durationMs: 1n }],
    }),
  ).toThrow();
  const rules = await loadRules();
  expect(expeditionScore(rules, 7, 5, 107000, 10, () => 0)).toBe(50);
  expect(expeditionScore(rules, 7, 5, 107000, 10, () => 50)).toBe(100);
  expect(expeditionScore(rules, 3, 5, 107000, 10, () => 0)).toBe(0);
  expect(expeditionScoreText(10.5)).toBe("10");
  expect(expeditionScoreText(11.5)).toBe("12");
  expect(expeditionScoreText(1e25)).toBe("10000000000000000000000000");
});
test("native expedition query and claim requests retain correlation without exposing score producers", async () => {
  const calls: string[] = [];
  const game = new GameService(
    {} as GameStore,
    new Rules(new Map(), new Map(), new Map()),
    { kingdomId: 1 },
    () => 1000,
    {
      cityProgression: async (_, command) => {
        calls.push(command);
        return { body: {}, pushes: [] };
      },
    },
  );
  for (const command of [
    "exchequer.show",
    "expedition.king.present",
    "expedition.recieve.count",
    "newexpidition.activityinfo",
    "newexpidition.takepersonreward",
    "newexpidition.takealliancereward",
    "expedition.show",
    "distribution.record.show",
    "tax.record.show",
  ])
    expect((await game.execute("owner", command, { _cok_: sfs.long(7n) })).body._cok_).toEqual(
      sfs.long(7n),
    );
  await expect(
    game.execute("owner", "expedition.score", { score: sfs.int(1000000) }),
  ).rejects.toThrow();
  await expect(game.execute("owner", "expedition.configure", {})).rejects.toThrow();
  expect(calls).toHaveLength(9);
});
