import type { ThroneRankingSnapshot, ThroneRankingPeriod } from "@opencok/contracts/throne-ranking";
import { decodeLegacyJsonObject } from "@opencok/messages/legacy-json";
import { sfs, Type, type Fields } from "@opencok/messages/sfs";
import { javaDecimal } from "@opencok/rules/java-integer";
import { throneRankingBoardSchema, throneRankingSchema } from "@opencok/validations/throne-ranking";
import { validateFields } from "./validation.ts";

export function throneRankingBoard(
  snapshot: ThroneRankingSnapshot,
  realm: number,
  uid: string,
): Fields | undefined {
  if (!snapshot.period) {return undefined;}

  if (!throneRankingOpen(snapshot.period)) {return undefined;}

  const rows = snapshot.rows;

  if (rows.length > 32767) {throw new Error("Oversized throne ranking");}

  const found = rows.findIndex((row) => row.uid === uid);

  return validateFields(throneRankingBoardSchema, {
    list: sfs.array(
      rows.slice(0, 19).map((row, index) => {
        const result: Fields = {
          uid: sfs.string(String(row.uid ?? "")),
          rank: sfs.int(index + 1),
          killCount: sfs.long(javaDecimal(String(row.totalKills ?? 0), 64)),
          deadCount: sfs.long(javaDecimal(String(row.totalDeads ?? 0), 64)),
        };

        for (const key of ["name", "allianceName", "abbr", "kingdomName"])
          {result[key] = sfs.string(String(row[key] ?? ""));}

        result.serverId = sfs.int(Number(javaDecimal(String(row.serverId), 32)));

        return sfs.object(result);
      }),
    ),
    selfRank: sfs.int(found === -1 ? rows.length : found + 1),
    serverId: sfs.int(realm),
  });
}

export function throneRanking(boards: readonly Fields[]): Fields {
  return validateFields(throneRankingSchema, {
    rank: sfs.array(boards.map((board) => sfs.object(board))),
  });
}

export function throneRankingOpen(state: ThroneRankingPeriod): boolean {
  const period = decodeLegacyJsonObject(state.info);

  if (period.isCrossOpen === undefined) {return false;}

  if (period.isCrossOpen.type !== Type.Bool) {throw new Error("Invalid throne opening state");}

  return period.isCrossOpen.value as boolean;
}
