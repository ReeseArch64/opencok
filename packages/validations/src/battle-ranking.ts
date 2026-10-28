import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type {
    FightRankingMemberResponse,
    FightRankingResponse,
    PlayoffRankingTeamResponse,
    PlayoffRankingResponse,
} from "@opencok/contracts/responses/battle-ranking";

export const fightMemberSchema = z.strictObject({
    rankNum: field.int,
    id: field.string,
    teamId: field.string,
    name: field.string,
    winNum: field.int,
    failNum: field.int,
    killNum: field.int,
    score: field.int,
    awardNum: field.int,
    holdNum: field.int,
    campType: field.int,
}) satisfies z.ZodType<FightRankingMemberResponse>;

export const playoffTeamSchema = z.strictObject({
    kingId: field.int,
    kingName: field.string,
    teamId: field.string,
    name: field.string,
    abbr: field.string,
    icon: field.string,
    curmember: field.int,
    fighting: field.int,
    fightPower: field.long,
    rankNum: field.int,
    start: field.long,
    end: field.long,
    groupId: field.int,
    ticketPayed: field.bool,
}) satisfies z.ZodType<PlayoffRankingTeamResponse>;

export const playoffRankingSchema = z.strictObject({
    battleState: field.int.optional(),
    endTime: field.long.optional(),
    teamId: field.string,
    enemyId: field.string,
    inBattle: field.bool,
    state: field.byte,
    turns: field.int,
    groups: z.array(playoffTeamSchema).length(8),
}) satisfies z.ZodType<PlayoffRankingResponse>;

export const fightRankingSchema = z.strictObject({
    rank: z.array(fightMemberSchema).max(32767).optional(),
}) satisfies z.ZodType<FightRankingResponse>;
