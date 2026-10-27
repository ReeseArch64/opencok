import { createHash } from "node:crypto";
import { cityAmount } from "./city-progression";
import type { CostRankingScore } from "@opencok/contracts/continued-cost-ranking";
import type { CostFrozenScore } from "@opencok/contracts/continued-cost-finality";

export function costScoreSnapshot(rows: readonly CostRankingScore[]) {
  if (rows.length > 100 || new Set(rows.map((row) => row.uid)).size !== rows.length)
    throw new Error("Invalid consumption closure population");

  return JSON.stringify(
    rows.map((row) => ({
      ...row,
      score: String(row.score),
      paid: String(row.paid),
      free: String(row.free),
      lastAt: String(row.lastAt),
    })),
  );
}

export function readCostScoreSnapshot(raw: string): readonly CostRankingScore[] {
  if (Buffer.byteLength(raw) > 1048576)
    throw new Error("Consumption closure snapshot bound exceeded");

  const data: unknown = JSON.parse(raw);

  if (!Array.isArray(data) || data.length > 100)
    throw new Error("Invalid consumption closure snapshot");

  const rows = data.map((value: CostFrozenScore) => {
    if (
      !value ||
      typeof value !== "object" ||
      typeof value.uid !== "string" ||
      !value.uid ||
      value.uid.length > 40 ||
      typeof value.metadata !== "string" ||
      Buffer.byteLength(value.metadata) > 8192 ||
      ![value.score, value.paid, value.free, value.lastAt].every(
        (part) => typeof part === "string" && /^(0|[1-9][0-9]*)$/.test(part),
      )
    )
      throw new Error("Invalid frozen consumption score");

    const row = {
      ...value,
      score: cityAmount(value.score),
      paid: cityAmount(value.paid),
      free: cityAmount(value.free),
      lastAt: cityAmount(value.lastAt),
    };

    if (row.score <= 0n) throw new Error("Empty frozen consumption score");

    return row;
  });

  if (new Set(rows.map((row) => row.uid)).size !== rows.length)
    throw new Error("Duplicate frozen consumption identity");

  return rows;
}

export function costScoreDigest(
  rows: readonly (Omit<CostRankingScore, "metadata"> & { metadata?: string })[],
) {
  return createHash("sha256")
    .update(
      JSON.stringify(
        rows
          .toSorted((a, b) => Buffer.compare(Buffer.from(a.uid), Buffer.from(b.uid)))
          .map((row) => [
            row.uid,
            String(row.score),
            String(row.paid),
            String(row.free),
            String(row.lastAt),
          ]),
      ),
    )
    .digest("hex");
}
