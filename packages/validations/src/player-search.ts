import { z } from "zod";
import type {
    PlayerSearchEntryResponse,
    PlayerSearchResponse,
} from "@opencok/contracts/responses/player-search";
import { field } from "./response.ts";

export const playerSearchEntrySchema = z.strictObject({
    uid: field.string,
    name: field.string.optional(),
    lang: field.string.optional(),
    pic: field.string.optional(),
    abbr: field.string.optional(),
    alliancename: field.string.optional(),
    allianceId: field.string.optional(),
    serverId: field.int,
    picVer: field.int.optional(),
    level: field.int.optional(),
    picfraId: field.int.optional(),
    gmFlag: field.int.optional(),
    vipLevel: field.int.optional(),
    svipLevel: field.int.optional(),
    rank: field.int.optional(),
    crossFightSrcServerId: field.int.optional(),
    mainBuildingLevel: field.int.optional(),
    power: field.long.optional(),
    vipEndTime: field.long.optional(),
    offLineTime: field.long.optional(),
}) satisfies z.ZodType<PlayerSearchEntryResponse>;

export const playerSearchSchema = z.strictObject({
    list: z.array(playerSearchEntrySchema).refine((field) => field.length <= 10),
    page: field.int,
    total: field.long,
    max: field.long,
    key: field.string,
}) satisfies z.ZodType<PlayerSearchResponse>;
