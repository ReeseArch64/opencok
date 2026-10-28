import { z } from "zod";
import type { WorldSearchResponse } from "../contracts/responses/world-search";
import { field } from "@opencok/messages/validations/response";

const searchText = (maximum: number) =>
    field.string.refine(
        (value) => value.length <= maximum && value.isWellFormed() && !value.includes("\0"),
    );

export const worldSearchSchema = z.strictObject({
    list: z
        .array(
            z.strictObject({
                uid: searchText(255).refine((value) => value.length > 0),
                name: searchText(255),
                pic: searchText(40).optional(),
                abbr: searchText(10),
                pointId: field.int.refine((value) => value === 1203),
                picVer: field.int.optional(),
                power: field.long.optional(),
            }),
        )
        .refine(
            (value) =>
                value.length <= 8 && new Set(value.map((entry) => entry.uid)).size === value.length,
        ),
}) satisfies z.ZodType<WorldSearchResponse>;
