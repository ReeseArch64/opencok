import { z } from "zod";
import type {
    PlayerSummaryResponse,
    GuidePlayerSummaryResponse,
} from "@opencok/contracts/responses/players";
import { field } from "@opencok/messages/validations/response";

export const playerSummarySchema = z.strictObject({
    lastUpdateTime: field.string,
    flagCountry: field.string,
    officer: field.string,
    uid: field.string,
    name: field.string,
    allianceId: field.string,
    pic: field.string,
    abbr: field.string,
    serverId: field.int,
    vipEndTime: field.int,
    svipLevel: field.int,
    picVer: field.int,
    picfraId: field.int,
    gmFlag: field.int,
    crossFightSrcServerId: field.int,
    rank: field.int,
    sLevel: field.int,
    stateId: field.int,
    vipLevel: field.int,
    showBanner: field.int.optional(),
    endTime: field.long,
}) satisfies z.ZodType<PlayerSummaryResponse>;

export const guidePlayerSummarySchema = z.strictObject({
    uid: field.string,
    pic: field.string,
    allianceId: field.string,
    name: field.string,
    abbr: field.string,
    style: field.string,
    serverId: field.int,
    sLevel: field.int,
    gmFlag: field.int,
    vipLevel: field.int,
    rank: field.int,
    crossFightSrcServerId: field.int,
    picVer: field.int,
    lastUpdateTime: field.int,
    svipLevel: field.int,
    vipEndTime: field.long,
}) satisfies z.ZodType<GuidePlayerSummaryResponse>;
