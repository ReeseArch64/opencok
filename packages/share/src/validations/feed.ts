import { z } from "zod";

const text = (length: number) =>
    z
        .string()
        .max(length)
        .refine((value) => value.isWellFormed() && !value.includes("\0"));

export const shareFeedFields = {
    fid: text(100).optional(),
    type: z.number().int().min(0).max(102).optional(),
    data: text(4000).optional(),
    auth: z.enum(["alliance", "self"]).optional(),
    notices: text(4100).optional(),
    localid: text(100).optional(),
};
