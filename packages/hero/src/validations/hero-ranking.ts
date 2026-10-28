import { z } from "zod";
import type {
    HeroSelfRankingResponse,
    HeroInsideRankingResponse,
    HeroInsideMemberResponse,
    HeroHistoryResponse,
    HeroHistoryMemberResponse,
} from "@opencok/hero/contracts/responses/hero-ranking";
import { field } from "@opencok/messages/validations/response";

export const heroSelfRankingSchema = z.strictObject({
    eventList: z.array(z.never()).length(0),
    ranking: field.int,
    rankingAlliance: field.int,
    type: field.int,
}) satisfies z.ZodType<HeroSelfRankingResponse>;

export const heroInsideMemberSchema = z.strictObject({
    uid: z.string().optional(),
    name: z.string().optional(),
    pic: z.string().optional(),
    picVer: field.int,
    picfraId: field.int,
    power: field.long.optional(),
    abbr: z.string().optional(),
    lang: z.string().optional(),
    mainBuildingLevel: field.int.optional(),
    allianceId: z.string().optional(),
    gmFlag: field.int,
    crossFightSrcServerId: field.int,
    vipLevel: field.int,
    svipLevel: field.int,
    vipEndTime: field.long.optional(),
    offLineTime: field.long.optional(),
    rank: field.int,
    score: field.int,
}) satisfies z.ZodType<HeroInsideMemberResponse>;

export const heroInsideRankingSchema = z.strictObject({
    rankList: z.array(heroInsideMemberSchema).max(32767),
}) satisfies z.ZodType<HeroInsideRankingResponse>;

export const heroHistoryMemberSchema = z.strictObject({
    uid: z.string().optional(),
    allianceId: z.string().optional(),
    rewardId: z.string(),
    rank: field.int,
    name: z.string().optional(),
    server: field.int.optional(),
    pic: z.string().optional(),
    picVer: field.int.optional(),
    picfraId: field.int.optional(),
    abbr: z.string().optional(),
    icon: z.string().optional(),
}) satisfies z.ZodType<HeroHistoryMemberResponse>;

export const heroHistorySchema = z.strictObject({
    history: z
        .array(
            z.strictObject({
                eventId: z.string(),
                endTime: field.long,
                userList: z.array(heroHistoryMemberSchema).max(10),
                kingdomList: z
                    .array(
                        z.strictObject({
                            id: field.int,
                            rank: field.int,
                            name: z.string().optional(),
                            banner: z.string().optional(),
                        }),
                    )
                    .max(100),
            }),
        )
        .max(10),
}) satisfies z.ZodType<HeroHistoryResponse>;
