import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type { ResourceResponse } from "../contracts/responses/resources.ts";

export const resourceSchema = z.strictObject({
    wood: field.long,
    wood_bind: field.long,
    stone: field.long,
    stone_bind: field.long,
    iron: field.long,
    iron_bind: field.long,
    food: field.long,
    food_bind: field.long,
    silver: field.int,
    chip: field.int,
    diamond: field.int,
    sandstone: field.int,
    diamondstone: field.int,
    marble: field.int,
    granite: field.int,
    limestone: field.int,
    dragonFood: field.int,
    dragonGold: field.int,
}) satisfies z.ZodType<ResourceResponse>;
