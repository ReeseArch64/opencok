import { z } from "zod";
import { field } from "./dto.ts";
import type {
  DonationMemberDto,
  CemeteryMemberDto,
  DonationRankingDto,
  ResourceDonationRankingDto,
  CemeteryRankingDto,
} from "@opencok/dtos/community-ranking";
export const donationMemberSchema = z.strictObject({
  uid: field.string,
  name: field.string,
  pic: field.string,
  picVer: field.int,
  picfraId: field.int,
  power: field.long,
  rank: field.int,
  donateTime: field.long.optional(),
  alliance_honor: field.int.optional(),
  donation: field.int.optional(),
  key: field.int.optional(),
  allianceId: field.string.optional(),
  score: field.double.optional(),
}) satisfies z.ZodType<DonationMemberDto>;
export const cemeteryMemberSchema = z.strictObject({
  uid: field.string,
  name: field.string,
  pic: field.string,
  picVer: field.int,
  picfraId: field.int,
  allianceId: field.string.optional(),
  abbr: field.string.optional(),
  alliancename: field.string.optional(),
  useItemSum: field.int,
  deadSum: field.long,
}) satisfies z.ZodType<CemeteryMemberDto>;
export const donationRankingSchema = z.strictObject({
  donateRank: z.array(donationMemberSchema).max(32767),
  refreshTime: field.long.optional(),
}) satisfies z.ZodType<DonationRankingDto>;
export const resourceDonationRankingSchema = z.strictObject({
  ranks: z.array(donationMemberSchema).max(32767),
  weekendTime: field.long.optional(),
}) satisfies z.ZodType<ResourceDonationRankingDto>;
export const cemeteryRankingSchema = z.strictObject({
  myRanking: field.int,
  serverRanking: z.array(cemeteryMemberSchema).max(49),
}) satisfies z.ZodType<CemeteryRankingDto>;
