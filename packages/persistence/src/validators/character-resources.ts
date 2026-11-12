import { z } from "zod";
import { internalIdValidator } from "./repository";

const quantity = z.string().regex(/^(0|[1-9][0-9]*)$/).refine(
    value => BigInt(value) <= 9223372036854775807n,
    "Saldo fora do intervalo bigint",
);
const balances = z.strictObject({
    wood: quantity,
    food: quantity,
    stone: quantity,
    iron: quantity,
    silver: quantity,
    gold: quantity,
    crystals: quantity,
});
export const characterResourcesCreateValidator = balances.extend({
    characterId: internalIdValidator,
})
    .extend({
        wood: quantity.default("0"),
        food: quantity.default("0"),
        stone: quantity.default("0"),
        iron: quantity.default("0"),
        silver: quantity.default("0"),
        gold: quantity.default("0"),
        crystals: quantity.default("0"),
    });
export const characterResourcesUpdateValidator = balances.partial().refine(
    value =>
        Object.keys(value).length > 0 && Object.values(value).every(field => field !== undefined),
    "Informe ao menos um saldo",
);
