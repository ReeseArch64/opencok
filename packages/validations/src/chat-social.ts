import { z } from "zod";

const identifier = z
    .string()
    .min(1)
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/);

const text = (length: number) =>
    z
        .string()
        .max(length)
        .refine((value) => value.isWellFormed() && !value.includes("\0"));

export const chatSocialParams = z.object({
    fid: text(100).optional(),
    type: z.number().int().min(0).max(102).optional(),
    data: text(4000).optional(),
    auth: z.enum(["alliance", "self"]).optional(),
    notices: text(4100).optional(),
    ids: text(10100).optional(),
    localid: text(100).optional(),
    allianceId: identifier.optional(),
    uid: z.union([identifier, z.array(identifier).max(100)]).optional(),
    reportUid: identifier.optional(),
    friendUid: identifier.optional(),
    uuid: identifier.optional(),
    id: text(160).optional(),
    roomId: text(160).optional(),
    room: text(160).optional(),
    name: text(100).optional(),
    msg: text(500).optional(),
    content: text(2000).optional(),
    banMsg: text(500).optional(),
    description: text(1000).optional(),
    members: z.array(identifier).max(50).optional(),
    uuids: z.string().max(4100).optional(),
    roomids: z.array(text(160)).max(50).optional(),
    time: z.number().int().positive().max(2_592_000).optional(),
    seqId: z
        .union([
            z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
            z.string().regex(/^\d{1,16}$/),
        ])
        .optional(),
    seqid: z
        .string()
        .regex(/^\d{1,16}$/)
        .optional(),
    count: z.number().int().min(1).max(100).optional(),
});
