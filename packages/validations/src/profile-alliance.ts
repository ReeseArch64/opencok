import { z } from "zod";
import type {
  AllianceVideoResponse,
  PublicAllianceInfoResponse,
} from "@opencok/contracts/responses/profile-alliance";
import { field, responseRecord } from "./response.ts";

export const allianceStringFields = [
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

export const allianceIntegerFields = [
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

export const allianceLongFields = [
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

export const allianceVideoSchema = z.strictObject({
  allianceid: field.string,
  videoURL: field.string,
  thumbnailURL: field.string,
  videoH: field.int,
  videoW: field.int,
  videoSize: field.int,
  videoLength: field.int,
  checksign: field.byte,
}) satisfies z.ZodType<AllianceVideoResponse>;

export const publicAllianceInfoSchema = z.strictObject({
  alliance: z.strictObject({
    ...Object.fromEntries(allianceStringFields.map((key) => [key, field.string.optional()])),
    ...Object.fromEntries(allianceIntegerFields.map((key) => [key, field.int.optional()])),
    ...Object.fromEntries(allianceLongFields.map((key) => [key, field.long.optional()])),
    currentlevel: z.union([field.long, field.double]).optional(),
    nextlevel: z.union([field.long, field.double]).optional(),
    fightpower: z.union([field.long, field.double]).optional(),
    member: field.long,
    maxMember: field.int.optional(),
    learderUid: field.string,
    learderName: field.string.optional(),
    permission: responseRecord(z.string(), field.int).optional(),
    allianceVideo: allianceVideoSchema.optional(),
  }),
}) satisfies z.ZodType<PublicAllianceInfoResponse>;
