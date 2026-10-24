import type { ExpeditionRankingResult } from "@opencok/contracts/expedition-ranking";
import { sfs, type Fields } from "@opencok/messages/sfs";

export function expeditionRanking(result: ExpeditionRankingResult | undefined): Fields {
  if (result === undefined) return {};
  return {
    selfRanking: sfs.int(result.selfRanking),
    serverRanking: sfs.array(
      result.rows.map((row) =>
        sfs.object({
          uid: sfs.string(row.uid),
          score: sfs.int(row.score),
          rank: sfs.int(row.rank),
          name: sfs.string(row.name),
          pic: sfs.string(row.pic),
          picVer: sfs.int(row.picVer),
          abbr: sfs.string(row.abbr),
          serverId: sfs.int(row.serverId),
          power:
            BigInt.asIntN(32, row.power) === row.power
              ? sfs.int(Number(row.power))
              : sfs.long(row.power),
        }),
      ),
    ),
  };
}
