import { z } from "zod";
import type { WoundedTroopsResponse, FortificationResponse } from "../contracts/responses/military";
import { field } from "@opencok/messages/validations/response";

export const woundedTroopsSchema = z.strictObject({
    id: field.string,
    dead: field.int,
    heal: field.int.optional(),
    finish: field.long.optional(),
}) satisfies z.ZodType<WoundedTroopsResponse>;

export const fortificationSchema = z.strictObject({
    id: field.string,
    free: field.int,
    level: field.int,
    train: field.int.optional(),
    finish: field.long.optional(),
    attack: field.int,
    defen: field.int,
    range: field.int.optional(),
    move: field.int.optional(),
    wood: field.int.optional(),
    stone: field.int,
    iron: field.int,
    food: field.int,
    time: field.int,
    power: field.float,
    load: field.int.optional(),
}) satisfies z.ZodType<FortificationResponse>;
