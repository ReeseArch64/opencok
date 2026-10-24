import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { ExpeditionRankingResult } from "@opencok/contracts/expedition-ranking";
import { sfs, type Fields } from "@opencok/messages/sfs";

function serializeExpeditionRanking(result: ExpeditionRankingResult | undefined): Fields {
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

export class ExpeditionRankingDto extends createZodDto(
  z.union([
    z.strictObject({}),
    z.strictObject({
      selfRanking: wire.int,
      serverRanking: wire.array(
        wire.object(
          z
            .strictObject({
              uid: wire.string,
              name: wire.string,
              pic: wire.string,
              abbr: wire.string,
              score: wire.int,
              rank: wire.int,
              picVer: wire.int,
              serverId: wire.int,
            })
            .extend({ power: z.union([wire.int, wire.long]) }),
        ),
      ),
    }),
  ]),
) {}

export function expeditionRanking(...args: Parameters<typeof serializeExpeditionRanking>): Fields {
  return new ExpeditionRankingDto(serializeExpeditionRanking(...args));
}
