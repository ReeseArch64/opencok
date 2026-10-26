import { test, expect } from "bun:test";
import { loadRules } from "@opencok/resources/rules";
import { HeroRankPublicationService } from "@opencok/services/hero-rank-publication";
import { publishHeroRanking } from "@opencok/storage/hero-ranking";
import type { HeroRankVersionedScore } from "@opencok/contracts/hero-rank-publication";
test("overlapping hero publication refreshes share one snapshot and a failed run remains retryable", async () => {
  const rules = await loadRules();
  let release: () => void = () => {},
    reads = 0,
    writes = 0,
    published = 0,
    fail = false;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const service = new HeroRankPublicationService(
    {
      page: async () => {
        reads++;
        await gate;
        if (fail) throw new Error("Synthetic source failure");
        return [
          {
            event: { uuid: "act", eventId: "9001000", type: 1, endTime: 2000n },
            score: { uid: "owner", level: 0, score: 1 },
            metadata: null,
          },
        ];
      },
    },
    {
      write: async (rows, observedAt) => {
        writes++;
        return rows.map((row) => ({
          ...row,
          ownerEpoch: 1n,
          sequence: BigInt(writes),
          observedAt,
        }));
      },
    },
    async () => {
      published++;
    },
    rules,
    () => 1000,
  );
  const first = service.refresh(),
    second = service.refresh();
  release();
  await Promise.all([first, second]);
  expect([reads, writes, published]).toEqual([1, 1, 1]);
  fail = true;
  await expect(service.refresh()).rejects.toThrow("Synthetic source failure");
  fail = false;
  await service.refresh();
  expect([reads, writes, published]).toEqual([3, 2, 2]);
});
test("hero publication rejects foreign or invalid cache versions before making a Redis write", async () => {
  const row: HeroRankVersionedScore = {
    rankKey: "HERO_PERSON_RANK_0_0_1",
    member: "owner",
    kingdomId: 1,
    actId: "act",
    eventId: "event",
    type: 1,
    level: 0,
    endTime: 1000n,
    score: 1,
    metadata: null,
    ownerEpoch: 1n,
    sequence: 1n,
    observedAt: 1n,
  };
  let writes = 0;
  const command = async () => {
    writes++;
    return 1;
  };
  for (const patch of [
    { kingdomId: 2 },
    { ownerEpoch: 0n },
    { sequence: 0n },
    { sequence: 9223372036854775808n },
    { score: 2147483648 },
    { rankKey: "unowned-key" },
  ])
    await expect(publishHeroRanking(command, 1, [{ ...row, ...patch }])).rejects.toThrow();
  await expect(publishHeroRanking(command, 1, [row, row])).rejects.toThrow();
  expect(writes).toBe(0);
});
