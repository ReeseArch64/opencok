import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type { InventoryItemResponse } from "../contracts/responses/inventory.ts";

export const inventoryItemSchema = z.strictObject({
    uuid: field.string,
    itemId: field.string,
    para1: field.string.optional(),
    para2: field.string.optional(),
    para3: field.string.optional(),
    para4: field.string.optional(),
    para5: field.string.optional(),
    para6: field.string.optional(),
    para7: field.string.optional(),
    para8: field.string.optional(),
    para9: field.string.optional(),
    count: field.int,
    vanishTime: field.long,
}) satisfies z.ZodType<InventoryItemResponse>;
