import { z } from "zod";
import type { WorldFavoritesResponse } from "@opencok/contracts/responses/world-favorites";
import { field } from "./response.ts";

export const worldFavoritesSchema = z.strictObject({
    favo: z
        .array(
            z.strictObject({
                name: field.string.optional(),
                point: field.int.optional(),
                type: field.int.optional(),
                server: field.int.optional(),
                resType: field.int.optional(),
                cityType: field.int.optional(),
                serverType: field.int.optional(),
                createTime: field.long.optional(),
            }),
        )
        .max(32767),
}) satisfies z.ZodType<WorldFavoritesResponse>;
