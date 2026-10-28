import { z } from "zod";
import { field } from "@opencok/messages/validations/response";
import type {
    PlayerItemGiftResponse,
    PlayerItemGiftLoginResponse,
} from "@opencok/contracts/responses/player-item-gifts";

export const playerItemGiftSchema = z.strictObject({
    result: field.bool,
}) satisfies z.ZodType<PlayerItemGiftResponse>;

export const playerItemGiftLoginSchema = z.strictObject({
    item_allname: z.array(field.string).max(64),
    item_allitemId: z.array(field.string).max(64),
}) satisfies z.ZodType<PlayerItemGiftLoginResponse>;
