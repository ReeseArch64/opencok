import { z } from "zod";
import type { WorldFavoritesDto } from "@opencok/dtos/world-favorites";
import { field } from "./dto.ts";

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
}) satisfies z.ZodType<WorldFavoritesDto>;
