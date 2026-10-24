import { z } from "zod";
import type { HeroSelfRankingDto } from "@opencok/dtos/hero-ranking";
import { field } from "./dto.ts";

export const heroSelfRankingSchema = z.strictObject({
  eventList: z.array(z.never()).length(0),
  ranking: field.int,
  rankingAlliance: field.int,
  type: field.int,
}) satisfies z.ZodType<HeroSelfRankingDto>;
