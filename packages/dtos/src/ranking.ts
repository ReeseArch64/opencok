import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { PlayerRankingKind, PlayerRankingResult } from "@opencok/contracts/ranking";
import { text, type Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, type Fields, type Value } from "@opencok/messages/sfs";

function number(value: unknown, cached: boolean): Value {
  if (typeof value === "number" && !Number.isSafeInteger(value))
    throw new GameError(errors.unsupported, "ranking");
  if (!/^[+-]?\d+$/.test(String(value))) throw new GameError(errors.unsupported, "ranking");
  const parsed = BigInt(String(value));
  if (BigInt.asIntN(64, parsed) !== parsed || (!cached && BigInt.asIntN(32, parsed) !== parsed))
    throw new GameError(errors.unsupported, "ranking");
  return BigInt.asIntN(32, parsed) === parsed ? sfs.int(Number(parsed)) : sfs.long(parsed);
}

function player(row: Row, kind: PlayerRankingKind): Fields {
  if (kind === "building") {
    const result: Fields = {};
    for (const key of ["uid", "name", "pic", "allianceId", "alliancename", "abbr", "icon"])
      if (row[key] !== null && row[key] !== undefined) result[key] = sfs.string(text(row, key));
    for (const key of [
      "updateTime",
      "level",
      "star",
      "picVer",
      "picfraId",
      "banTime",
      "buildingPower",
    ])
      if (row[key] !== null && row[key] !== undefined) result[key] = number(row[key], true);
    return result;
  }
  const result: Fields = {
    uid: sfs.string(text(row, "uid")),
    name: sfs.string(text(row, "name")),
    pic: sfs.string(text(row, "pic")),
    picVer: number(row.picVer ?? 0, false),
  };
  if (kind !== "contribution") result.picfraId = number(row.picfraId ?? 0, false);
  for (const key of kind === "power"
    ? ["power"]
    : kind === "kills"
      ? ["armyKill"]
      : kind === "contribution"
        ? ["contributeSum"]
        : ["level", "exp", "banTime"])
    if (row[key] !== null && row[key] !== undefined) result[key] = number(row[key], true);
  if (text(row, "allianceId").trim())
    for (const key of ["allianceId", "abbr", "alliancename"])
      result[key] = sfs.string(text(row, key));
  return result;
}

function serializePlayerRanking(kind: PlayerRankingKind, ranking: PlayerRankingResult): Fields {
  return {
    [kind === "contribution" ? "myRanking" : "selfRanking"]: sfs.int(
      kind === "contribution" && ranking.rows.length === 0 ? -1 : ranking.selfRanking,
    ),
    serverRanking: sfs.array(ranking.rows.map((row) => sfs.object(player(row, kind)))),
  };
}

export class PlayerRankingDto extends createZodDto(
  z.strictObject({
    selfRanking: wire.int.optional(),
    myRanking: wire.int.optional(),
    serverRanking: wire.array(
      wire.object(
        z
          .strictObject({
            uid: wire.string.optional(),
            name: wire.string.optional(),
            pic: wire.string.optional(),
            allianceId: wire.string.optional(),
            alliancename: wire.string.optional(),
            abbr: wire.string.optional(),
            icon: wire.string.optional(),
          })
          .extend({
            picVer: z.union([wire.int, wire.long]).optional(),
            picfraId: z.union([wire.int, wire.long]).optional(),
            power: z.union([wire.int, wire.long]).optional(),
            armyKill: z.union([wire.int, wire.long]).optional(),
            contributeSum: z.union([wire.int, wire.long]).optional(),
            level: z.union([wire.int, wire.long]).optional(),
            exp: z.union([wire.int, wire.long]).optional(),
            banTime: z.union([wire.int, wire.long]).optional(),
            updateTime: z.union([wire.int, wire.long]).optional(),
            star: z.union([wire.int, wire.long]).optional(),
            buildingPower: z.union([wire.int, wire.long]).optional(),
          }),
      ),
    ),
  }),
) {}

export function playerRanking(...args: Parameters<typeof serializePlayerRanking>): Fields {
  return new PlayerRankingDto(serializePlayerRanking(...args));
}
