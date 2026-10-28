import { z } from "zod";

export const createAllianceSchema = z.object({
    name: z.string().trim().min(3).max(20),
    intro: z.string().max(200),
    language: z.string().max(40).optional(),
});
