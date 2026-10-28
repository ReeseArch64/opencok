import { z } from "zod";
import type {
    WorldResourceOwnerResponse,
    WorldResourceGroupResponse,
    WorldNeutralResourceResponse,
} from "@opencok/contracts/responses/world-resource-detail";
import { field } from "@opencok/messages/validations/response";

export const worldResourceOwnerSchema = z.strictObject({
    q: field.int,
    tq: field.int,
    collected: field.int,
    spd: field.float,
    sdt: field.long,
    changeCollectSpdTime: field.long,
    occupyEndTime: field.long,
}) satisfies z.ZodType<WorldResourceOwnerResponse>;

export const worldResourceGroupSchema = z.union([
    z.strictObject({}),
    z.strictObject({ spd: field.float, tq: field.int, sdt: field.double }),
]) satisfies z.ZodType<WorldResourceGroupResponse>;

export const worldNeutralResourceSchema = z.union([
    z.strictObject({}),
    z.strictObject({ occupybegintime: field.long }),
]) satisfies z.ZodType<WorldNeutralResourceResponse>;
