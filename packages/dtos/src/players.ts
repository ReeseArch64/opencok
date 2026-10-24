import { z } from "zod";
import { createZodDto, wire } from "./dto.ts";

import type { PlayerSummary } from "@opencok/contracts/game";
import { long, text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";

function integer(row: Row, key: string): number {
  const value = long(row, key);
  if (value < -2147483648n || value > 2147483647n)
    throw new GameError(errors.unsupported, "player_summary");
  return Number(value);
}

function serializePlayerSummary(
  { data, kingdomId, remote }: PlayerSummary,
  lastUpdateTime: string,
): Fields {
  const country = text(data, "country");
  const result: Fields = {
    serverId: sfs.int(kingdomId),
    vipEndTime: sfs.int(Number(BigInt.asIntN(32, long(data, "vipEndTime") / 1000n))),
    lastUpdateTime: sfs.string(lastUpdateTime),
    svipLevel: sfs.int(integer(data, "sLevel")),
    flagCountry: sfs.string(/^\d+$/.test(country) ? "" : country.toLowerCase()),
    officer: sfs.string(remote ? "" : text(data, "officer")),
    endTime: sfs.long(long(data, "endTime")),
  };
  for (const key of ["uid", "name", "allianceId", "pic", "abbr"])
    result[key] = sfs.string(text(data, key));
  for (const key of [
    "picVer",
    "picfraId",
    "gmFlag",
    "crossFightSrcServerId",
    "rank",
    "sLevel",
    "stateId",
  ])
    result[key] = sfs.int(integer(data, key));
  const vip = integer(data, "vipLevel");
  result.vipLevel = sfs.int(remote && vip === -1 ? 0 : vip);
  if (data.showBanner !== null && data.showBanner !== undefined)
    result.showBanner = sfs.int(
      text(data, "registrationCountry") === "TW" ? 0 : integer(data, "showBanner"),
    );
  return result;
}

function serializeGuidePlayerSummary(): Fields {
  return {
    serverId: sfs.int(0),
    sLevel: sfs.int(0),
    vipEndTime: sfs.long(0),
    uid: sfs.string("3000002"),
    gmFlag: sfs.int(1),
    pic: sfs.string("guide_player_icon"),
    allianceId: sfs.string(""),
    vipLevel: sfs.int(0),
    rank: sfs.int(0),
    crossFightSrcServerId: sfs.int(-1),
    picVer: sfs.int(0),
    lastUpdateTime: sfs.int(1474375485),
    svipLevel: sfs.int(10),
    name: sfs.string("Agatha"),
    abbr: sfs.string(""),
    style: sfs.string(""),
  };
}

export class PlayerSummaryDto extends createZodDto(
  z.strictObject({
    lastUpdateTime: wire.string,
    flagCountry: wire.string,
    officer: wire.string,
    uid: wire.string,
    name: wire.string,
    allianceId: wire.string,
    pic: wire.string,
    abbr: wire.string,
    serverId: wire.int,
    vipEndTime: wire.int,
    svipLevel: wire.int,
    picVer: wire.int,
    picfraId: wire.int,
    gmFlag: wire.int,
    crossFightSrcServerId: wire.int,
    rank: wire.int,
    sLevel: wire.int,
    stateId: wire.int,
    vipLevel: wire.int,
    showBanner: wire.int.optional(),
    endTime: wire.long,
  }),
) {}

export class GuidePlayerSummaryDto extends createZodDto(
  z.strictObject({
    uid: wire.string,
    pic: wire.string,
    allianceId: wire.string,
    name: wire.string,
    abbr: wire.string,
    style: wire.string,
    serverId: wire.int,
    sLevel: wire.int,
    gmFlag: wire.int,
    vipLevel: wire.int,
    rank: wire.int,
    crossFightSrcServerId: wire.int,
    picVer: wire.int,
    lastUpdateTime: wire.int,
    svipLevel: wire.int,
    vipEndTime: wire.long,
  }),
) {}

export function playerSummary(...args: Parameters<typeof serializePlayerSummary>): Fields {
  return new PlayerSummaryDto(serializePlayerSummary(...args));
}

export function guidePlayerSummary(
  ...args: Parameters<typeof serializeGuidePlayerSummary>
): Fields {
  return new GuidePlayerSummaryDto(serializeGuidePlayerSummary(...args));
}
