import { z } from "zod";
import { createZodDto, wire, wireRecord } from "./dto.ts";

import type { PublicAllianceState } from "@opencok/contracts/profile";
import { text, type Row } from "@opencok/contracts/rows";
import { errors } from "@opencok/constants/game";
import { GameError } from "@opencok/errors/game";
import { sfs, type Fields } from "@opencok/messages/sfs";
import type { Rules } from "@opencok/rules/game";
import { publicAllianceProgress } from "@opencok/rules/profile";

const strings = [
  "uid",
  "alliancename",
  "abbr",
  "intro",
  "announce",
  "icon",
  "language",
  "country",
  "rankone",
  "ranktwo",
  "rankthree",
  "rankfour",
  "rankfive",
  "ally",
  "enemy",
  "other",
  "crossFightEnemy",
  "targetScience",
  "donateItem",
  "bannerStyle",
  "taskLimit",
];
const integers = [
  "abbrRename",
  "curMember",
  "recruit",
  "oldfightpower",
  "giftlevel",
  "reicon",
  "dau",
  "rallyPoint",
  "castleRestriction",
  "camp",
  "ckfThroneFightFlag",
  "cdfIndex",
  "cdfVersion",
  "taskNum",
];
const longs = [
  "alliancepoint",
  "createtime",
  "powerRestriction",
  "wood",
  "food",
  "iron",
  "stone",
  "sandstone",
  "diamond",
  "marble",
  "granite",
  "limestone",
  "taskFlushTime",
];

function signed(value: unknown, bits: 8 | 32 | 64): bigint {
  if (
    (typeof value === "number" && !Number.isSafeInteger(value)) ||
    !/^[+-]?\d+$/.test(String(value))
  )
    throw new GameError(errors.unsupported, "public_profile");
  const parsed = BigInt(String(value));
  if (BigInt.asIntN(bits, parsed) !== parsed)
    throw new GameError(errors.unsupported, "public_profile");
  return parsed;
}

function serializeAllianceVideo(row: Row): Fields {
  const fields: Fields = {};
  for (const [wire, column] of [
    ["allianceid", "allianceId"],
    ["videoURL", "vedioURL"],
    ["thumbnailURL", "thumbnailURL"],
  ]) {
    if (typeof row[column!] !== "string") throw new GameError(errors.unsupported, "public_profile");
    fields[wire!] = sfs.string(text(row, column!));
  }
  for (const [wire, column] of [
    ["videoH", "vedioH"],
    ["videoW", "vedioW"],
    ["videoSize", "vedioSize"],
    ["videoLength", "vedioLength"],
  ])
    fields[wire!] = sfs.int(Number(signed(row[column!], 32)));
  fields.checksign = sfs.byte(Number(signed(row.checkSign, 8)));
  return fields;
}

function serializePublicAllianceInfo(
  state: PublicAllianceState,
  rules: Rules,
  remote: boolean,
  permissions: ReadonlyMap<string, number> | undefined,
): Fields {
  const progress = publicAllianceProgress(state, rules);
  const fields: Fields = {};
  for (const key of strings)
    if (state.alliance[key] !== null && state.alliance[key] !== undefined)
      fields[key] = sfs.string(text(state.alliance, key));
  for (const key of integers)
    if (state.alliance[key] !== null && state.alliance[key] !== undefined)
      fields[key] = sfs.int(Number(signed(state.alliance[key], 32)));
  for (const key of longs)
    if (state.alliance[key] !== null && state.alliance[key] !== undefined)
      fields[key] = sfs.long(signed(state.alliance[key], 64));
  for (const key of ["currentlevel", "nextlevel", "fightpower"] as const) {
    const value = progress[key];
    if (value !== undefined)
      fields[key] = remote ? sfs.long(BigInt.asIntN(64, value)) : sfs.double(Number(value));
  }
  fields.member = sfs.long(progress.member);
  if (progress.maxMember !== undefined) fields.maxMember = sfs.int(progress.maxMember);
  fields.learderUid = sfs.string(text(state.leader, "uid"));
  if (state.leader.name !== null && state.leader.name !== undefined)
    fields.learderName = sfs.string(text(state.leader, "name"));
  if (permissions !== undefined)
    fields.permission = sfs.object(
      Object.fromEntries(
        [...permissions].map(([key, value]) => [key, sfs.int(Number(signed(value, 32)))]),
      ),
    );
  if (state.video) {
    if (text(state.video, "allianceId") !== text(state.alliance, "uid"))
      throw new GameError(errors.unsupported, "public_profile");
    fields.allianceVideo = sfs.object(allianceVideo(state.video));
  }
  return { alliance: sfs.object(fields) };
}

export class AllianceVideoDto extends createZodDto(
  z.strictObject({
    allianceid: wire.string,
    videoURL: wire.string,
    thumbnailURL: wire.string,
    videoH: wire.int,
    videoW: wire.int,
    videoSize: wire.int,
    videoLength: wire.int,
    checksign: wire.byte,
  }),
) {}

export class PublicAllianceInfoDto extends createZodDto(
  z.strictObject({
    alliance: wire.object(
      z.strictObject({
        ...Object.fromEntries(strings.map((key) => [key, wire.string.optional()])),
        ...Object.fromEntries(integers.map((key) => [key, wire.int.optional()])),
        ...Object.fromEntries(longs.map((key) => [key, wire.long.optional()])),
        currentlevel: z.union([wire.long, wire.double]).optional(),
        nextlevel: z.union([wire.long, wire.double]).optional(),
        fightpower: z.union([wire.long, wire.double]).optional(),
        member: wire.long,
        maxMember: wire.int.optional(),
        learderUid: wire.string,
        learderName: wire.string.optional(),
        permission: wire.object(wireRecord(z.string(), wire.int)).optional(),
        allianceVideo: wire.object(AllianceVideoDto.schema).optional(),
      }),
    ),
  }),
) {}

export function allianceVideo(...args: Parameters<typeof serializeAllianceVideo>): Fields {
  return new AllianceVideoDto(serializeAllianceVideo(...args));
}

export function publicAllianceInfo(
  ...args: Parameters<typeof serializePublicAllianceInfo>
): Fields {
  return new PublicAllianceInfoDto(serializePublicAllianceInfo(...args));
}
