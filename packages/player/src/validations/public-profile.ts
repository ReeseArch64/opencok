import { publicEquipmentSchema } from "@opencok/equipment/validations/equipment-preview";
import { z } from "zod";
import type {
    PublicStatisticsResponse,
    PublicMedalResponse,
    PublicProfileBaseResponse,
} from "@opencok/player/contracts/responses/public-profile";
import { field } from "@opencok/messages/validations/response";
import { playerStatisticsSchema } from "@opencok/validations/power";

export const publicStatisticsSchema = z.union([
    z.strictObject({}),
    playerStatisticsSchema.extend({ power: field.long }),
]) satisfies z.ZodType<PublicStatisticsResponse>;

export const publicMedalSchema = z.strictObject({
    id: field.string,
    level: field.int,
}) satisfies z.ZodType<PublicMedalResponse>;

export const publicProfileBaseSchema = z
    .strictObject({
        uid: field.string,
        name: field.string,
        pic: field.string,
        medal: field.string,
        serverName: field.string,
        lastUpdateTime: field.string,
        officer: field.string.optional(),
        level: field.int,
        exp: field.int,
        picVer: field.int,
        picfraId: field.int,
        gmFlag: field.int,
        maxExp: field.int,
        vip: field.int,
        vipEndTime: field.int,
        armedLevel: field.int,
        market: field.int,
        score: field.int,
        serverId: field.int,
        flowerVal: field.int,
        showEquip: field.bool,
        showMedal: field.bool,
        showMarchSoldier: field.bool,
        achieveNum: field.float,
    })
    .extend({
        ...playerStatisticsSchema.partial().shape,
        power: field.long.optional(),
        medalList: z.array(publicMedalSchema).max(32767),
        equip: z.array(publicEquipmentSchema).max(32767),
    }) satisfies z.ZodType<PublicProfileBaseResponse>;
