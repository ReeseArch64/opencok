import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { PlayerSearchEntry, PlayerSearchResult } from "@opencok/contracts/player-search";
import type { Row } from "@opencok/contracts/rows";
import { GameError } from "@opencok/errors/game";
import { errors } from "@opencok/constants/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

function invalid(): never {
  throw new GameError(errors.unsupported, "player_search");
}
function integer(value: unknown): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < -2147483648 ||
    value > 2147483647
  )
    return invalid();
  return value;
}
function long(value: unknown): bigint {
  if (typeof value !== "bigint" || BigInt.asIntN(64, value) !== value) return invalid();
  return value;
}
function strings(row: Row, result: Fields, keys: readonly string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value == null) continue;
    if (
      typeof value !== "string" ||
      !value.isWellFormed() ||
      value.includes("\0") ||
      new TextEncoder().encode(value).length > 32767
    )
      return invalid();
    result[key] = sfs.string(value);
  }
}
function serializePlayerSearchEntry(entry: PlayerSearchEntry): Fields {
  const { data, remote } = entry;
  const kingdomId = integer(entry.kingdomId);
  if (kingdomId < 1 || typeof remote !== "boolean" || typeof data.uid !== "string" || !data.uid)
    return invalid();
  const result: Fields = { serverId: sfs.int(kingdomId) };
  strings(data, result, ["uid", "name", "lang", "pic", "abbr"]);
  if (!remote) {
    strings(data, result, ["alliancename"]);
    for (const key of ["picVer", "level"])
      if (data[key] != null) result[key] = sfs.int(integer(data[key]));
    if (data.power != null) result.power = sfs.long(long(data.power));
    return result;
  }
  strings(data, result, ["allianceId"]);
  for (const key of ["picVer", "picfraId", "gmFlag", "vipLevel", "svipLevel", "rank"])
    result[key] = sfs.int(integer(data[key] ?? 0));
  result.crossFightSrcServerId = sfs.int(integer(data.crossFightSrcServerId ?? -1));
  for (const key of ["power", "vipEndTime", "offLineTime"]) {
    const value = long(data[key] ?? 0n);
    if (value > 0n) result[key] = sfs.long(value);
  }
  const level = integer(data.mainBuildingLevel ?? 0);
  if (level > 0) {
    result.mainBuildingLevel = sfs.int(level);
    result.level = sfs.int(level);
  }
  return result;
}
function serializePlayerSearch(result: PlayerSearchResult): Fields {
  if (
    result.entries.length > 10 ||
    long(result.total) < BigInt(result.entries.length) ||
    long(result.maximum) < 0n
  )
    return invalid();
  const body: Fields = {
    list: sfs.array(result.entries.map((entry) => sfs.object(playerSearchEntry(entry)))),
    page: sfs.int(integer(result.page)),
    total: sfs.long(result.total),
    max: sfs.long(result.maximum),
  };
  strings({ key: result.key }, body, ["key"]);
  if (!body.key) return invalid();
  return body;
}

export class PlayerSearchEntryDto extends createZodDto(
  z.strictObject({
    uid: wire.string,
    name: wire.string.optional(),
    lang: wire.string.optional(),
    pic: wire.string.optional(),
    abbr: wire.string.optional(),
    alliancename: wire.string.optional(),
    allianceId: wire.string.optional(),
    serverId: wire.int,
    picVer: wire.int.optional(),
    level: wire.int.optional(),
    picfraId: wire.int.optional(),
    gmFlag: wire.int.optional(),
    vipLevel: wire.int.optional(),
    svipLevel: wire.int.optional(),
    rank: wire.int.optional(),
    crossFightSrcServerId: wire.int.optional(),
    mainBuildingLevel: wire.int.optional(),
    power: wire.long.optional(),
    vipEndTime: wire.long.optional(),
    offLineTime: wire.long.optional(),
  }),
) {}

export class PlayerSearchDto extends createZodDto(
  z.strictObject({
    list: wire
      .array(wire.object(PlayerSearchEntryDto.schema))
      .refine((field) => field.value.length <= 10),
    page: wire.int,
    total: wire.long,
    max: wire.long,
    key: wire.string,
  }),
) {}

export function playerSearchEntry(...args: Parameters<typeof serializePlayerSearchEntry>): Fields {
  return new PlayerSearchEntryDto(serializePlayerSearchEntry(...args));
}

export function playerSearch(...args: Parameters<typeof serializePlayerSearch>): Fields {
  return new PlayerSearchDto(serializePlayerSearch(...args));
}
