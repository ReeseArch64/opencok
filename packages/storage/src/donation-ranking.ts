import type { DonationScore } from "@opencok/contracts/community-ranking";
import { DependencyError } from "@opencok/errors/dependency";

export async function loadDonationRanking(
  command: (name: string, ...args: string[]) => Promise<unknown>,
  realm: number,
  allianceId: string,
  kind: "resource-day" | "resource-week" | "resource-history",
  date: string,
): Promise<DonationScore[]> {
  if (
    !Number.isInteger(realm) ||
    realm < 1 ||
    realm > 2147483647 ||
    !allianceId ||
    allianceId.length > 40 ||
    !allianceId.isWellFormed() ||
    !["resource-day", "resource-week", "resource-history"].includes(kind) ||
    (kind !== "resource-history" && !/^\d{8}$/.test(date))
  )
    throw new DependencyError("donation ranking input");

  const key =
    kind === "resource-history"
      ? `bsDonateRank${realm}${allianceId}`
      : `bsDonateRank${kind === "resource-day" ? "Day" : "Week"}${realm}${date}${allianceId}`;
  const values = await command("ZREVRANGE", key, "0", "100", "WITHSCORES");

  if (!Array.isArray(values) || values.length % 2 || values.length > 202)
    throw new DependencyError("donation ranking rows");

  const rows: DonationScore[] = [];

  for (let i = 0; i < values.length; i += 2) {
    const uid = values[i],
      raw = values[i + 1];

    if (
      typeof uid !== "string" ||
      !uid ||
      uid.length > 40 ||
      (typeof raw !== "string" && typeof raw !== "number") ||
      String(raw).trim() === "" ||
      !Number.isFinite(Number(raw))
    )
      throw new DependencyError("donation ranking score");

    rows.push({ uid, score: Number(raw) });
  }

  return rows;
}
