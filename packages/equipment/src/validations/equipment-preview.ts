import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type { PublicEquipmentResponse } from "../contracts/responses/equipment-preview";

export const publicEquipmentSchema = z.strictObject({
    uuid: field.string,
    itemId: field.string,
    extraProperty: field.string,
    refineProperty: field.string,
    lockProperty: field.string.optional(),
    suit_effect: field.string.optional(),
    suit_value: field.string.optional(),
    suit_value_type: field.string.optional(),
    suit_value_sign: field.string.optional(),
    Buff: field.string.optional(),
    buff: field.string.optional(),
    buff_str: field.string.optional(),
    buff_Str: field.string.optional(),
    buffStr: field.string.optional(),
    BuffStr: field.string.optional(),
    on: field.int,
    reforgeCount: field.int,
    strength_level: field.int.optional(),
}) satisfies z.ZodType<PublicEquipmentResponse>;
