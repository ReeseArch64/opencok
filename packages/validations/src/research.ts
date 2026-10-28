import { z } from "zod";
import type { ResearchResponse } from "@opencok/contracts/responses/research";
import { field } from "./response";

export const researchSchema = z.strictObject({
    level: field.int,
    itemId: field.string,
    cd: field.long,
    max_lv: field.string.optional(),
    research_need: field.string.optional(),
    time_research: field.string.optional(),
    building_condition: field.string.optional(),
    science_condition: field.string.optional(),
    reputation_condition: field.string.optional(),
    para1: field.string.optional(),
    para2: field.string.optional(),
    science_point: field.string.optional(),
    vip: field.string.optional(),
    nextPara2: field.string,
}) satisfies z.ZodType<ResearchResponse>;
