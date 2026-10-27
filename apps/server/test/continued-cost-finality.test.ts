import { test, expect } from "bun:test";
import {
  costScoreDigest,
  costScoreSnapshot,
  readCostScoreSnapshot,
} from "@opencok/rules/continued-cost-finality";
import type { CostRankingScore } from "@opencok/contracts/continued-cost-ranking";
const score: CostRankingScore = {
  uid: "synthetic",
  score: 9007199254740993n,
  paid: 3n,
  free: 9007199254740990n,
  lastAt: 1900000000000n,
  metadata: '{"name":"Synthetic","hideKing":0}',
};
test("consumption closure retains exact economic integers and ignores public metadata in its proof", () => {
  const snapshot = costScoreSnapshot([score]);
  expect(readCostScoreSnapshot(snapshot)).toEqual([score]);
  expect(costScoreDigest([score])).toBe(
    costScoreDigest([{ ...score, metadata: '{"name":"Renamed","hideKing":1}' }]),
  );
  expect(costScoreDigest([score])).not.toBe(
    costScoreDigest([{ ...score, score: score.score + 1n }]),
  );
  expect(costScoreDigest([score, { ...score, uid: "other" }])).toBe(
    costScoreDigest([{ ...score, uid: "other" }, score]),
  );
  expect(readCostScoreSnapshot(costScoreSnapshot([]))).toEqual([]);
});
test("invalid consumption snapshots cannot introduce duplicate identities, out-of-range integers or excess members", () => {
  for (const raw of [
    "{}",
    "null",
    "[null]",
    JSON.stringify([{ ...score, score: "9223372036854775808", paid: "0", free: "0", lastAt: "1" }]),
    costScoreSnapshot([score]).replace("9007199254740993", "-1"),
  ])
    expect(() => readCostScoreSnapshot(raw)).toThrow();
  expect(() => costScoreSnapshot([score, score])).toThrow();
  expect(() =>
    costScoreSnapshot(Array.from({ length: 101 }, (_, i) => ({ ...score, uid: String(i) }))),
  ).toThrow();
});
